import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Table, Card, Form, Modal, Input, Tabs, Row, Col, Icon, Upload, message, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import reqwest from 'reqwest';
import cookies from 'js-cookie';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from  '@/services/serviceObj';
import RedeemCoode from './redeemCode';
import BatchFilterForm from './batchFilterForm';
import styles from '../Lists.less';


const { TabPane } = Tabs;
const FormItem = Form.Item;
const { confirm } = Modal;
const { VritualUrl, openService } = serviceObj;

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  virtualCardList:strategyMall.virtualCardList,
} ) )
@Form.create()

class BatchCode extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    clickId:null,
    clickName:null,
    TabPaneKey:false,
    fileList:[],   // 上传文件列表
    exporotLoading:false,
    handleLoading:false,
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 11 },
    wrapperCol: { span: 10 },
  };

  componentDidMount() {
    this.fetchList();
  };

  //  获取批次兑换码
  fetchList = () => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { groupId, name, createTime } = formValue;
    const from = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD' ):'';
    const to = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD' ):'';

    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getVirtualList',
      payload: {
        pageSize,
        pageNum,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'create_time desc',
        groupId,
        name,
        from,
        to,
      }
    } )
  };

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    this.setState( {
      pageNum:1
    }, ()=>this.fetchList() )
  }

  // 翻页
  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, ()=>this.fetchList() );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      fileList:[]
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( e, obj ) => {
    e.stopPropagation()
    this.setState( {
      visible: true,
      current: obj
    } );
  };

  //  取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      fileList:[]
    } );
  };

  // 存储导入文件
  beforeUpload=( file )=>{
    const { fileList } = this.state;
    this.setState( { exporotLoading:true, fileList:[...fileList, file] }, ()=>{
        setTimeout( () => {
          this.setState( { exporotLoading:false } )
          message.success( '导入成功' )
        }, 900 );
    } )
    return false
  }

  //  删除导出文件
  onRemove=( file )=>{
    const { fileList } = this.state;
    const index = fileList.indexOf( file );
    const newFileList = fileList.slice();
    newFileList.splice( index, 1 );
    this.setState( { fileList:newFileList } )
  }


  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const $this = this;
    const { current, fileList } = this.state;
    const { form } = this.props;
    const id = current ? current.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      this.setState( { handleLoading:true } )
      const { name } = fieldsValue;
      const formData = new FormData();
      if( fileList.length > 0 ) formData.append( 'file', fileList[0] );
      if ( id ) formData.append( 'groupId', id );
      formData.append( 'name', name );
      const token = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )|| sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
      const tokenObj = token ? { 'X-Auth-Token': token } : {};
      const headers =  Object.assign( { Accept: '*/*' }, tokenObj );
      reqwest( {
        url:`${openService}/vouchers/upload`,
        method: 'post',
        processData: false,
        headers,
        data: formData,
        success: ( res ) => {
          if( res.success ){
            $this.fetchList()
            $this.setState( {
              fileList:[],
              visible:false,
              handleLoading:false,
            } )
            message.success( res.message )
          }else{
            this.setState( { handleLoading:false } )
            message.error( "卡密添加或编辑失败" );
          }
        },
        error: () => {
          this.setState( { handleLoading:false } )
          message.error( "文件上传失败！" );
        },
      } );
    } );
  };

  //  删除
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const $this = this;
    const { dispatch } = this.props;
    const{ id, name }=obj;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      content:'删除批次将会删除该批次的所有券',
      onOk() {
        dispatch( {
          type:'strategyMall/delVirtual',
          payload: {
            groupId:id,
            callFunc: () => {
              $this.fetchList();
            }
          }
        } );
      },
    } );
  }

  onChange=()=>{
    this.setState( {
      clickId:null,
      clickName:null
    }, ()=>this.fetchList() )
  }


  render() {
    const { loading, virtualCardList: { total, list }, form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, current = {}, sortedInfo, clickId, clickName, TabPaneKey, fileList, exporotLoading, handleLoading } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };


    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>批次ID</span>,
        dataIndex: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>卡券名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>剩余数量</span>,
        dataIndex: 'leftCount',
        render: leftCount => <span>{leftCount}</span>,
      },
      {
        title: <span>已发放数量</span>,
        dataIndex: 'usedNumber',
        render: ( usedNumber, item ) =>{
          const { leftCount, totalCount } = item;
          if( leftCount !== undefined && totalCount!==undefined ){
            return <span>{totalCount-leftCount}</span>
          }
          return<span>0</span>
        }
      },
      {
        title: <span>卡券总量</span>,
        dataIndex: 'totalCount',
        render: totalCount => <span>{totalCount || '0'}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        align:'center',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'Id',
        align:'center',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight:20, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>

          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="虚拟卡券管理（本功能即将废弃，请勿新增，使用权益中心的功能，不清楚咨询项目经理群）"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <Tabs defaultActiveKey={TabPaneKey.toString()} onChange={this.onChange}>
                <TabPane tab="批次" key={TabPaneKey}>
                  <BatchFilterForm
                    filterSubmit={this.filterSubmit}
                    wrappedComponentRef={( ref ) => { this.filterForm = ref}}
                  />
                  <Button
                    type="dashed"
                    style={{ width: '100%', marginBottom: 8 }}
                    icon="plus"
                    disabled
                    onClick={() => this.showAddModal()}
                  >
                    新建
                  </Button>

                  <Table
                    size="large"
                    rowKey="id"
                    columns={columns}
                    loading={loading}
                    pagination={paginationProps}
                    dataSource={list}
                    onChange={this.tableChange}
                    onRow={( record )=> {
                      return {
                        // 点击行
                        // onClick: event => {
                        //   event.stopPropagation()
                        //   this.setState( {
                        //     clickId:record.id,
                        //     clickName:record.name,
                        //     TabPaneKey:!TabPaneKey
                        //   } );
                        // },
                      };
                    }}
                  />
                </TabPane>

                <TabPane tab="卡密明细" key={!TabPaneKey}>
                  <RedeemCoode clickId={clickId} clickName={clickName} />
                </TabPane>

              </Tabs>
            </div>
          </Card>
        </div>

        <Modal
          maskClosable={false}
          title={current.id ? '编辑卡密' : '添加卡密'}
          className={styles.standardListForm}
          width={700}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          confirmLoading={handleLoading}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>

            <FormItem label='卡券名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}卡券名称` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}卡券名称`} /> )}
            </FormItem>
            <FormItem
              label={(
                <span>
                  导入卡密&nbsp;
                  <Tooltip title="同一批次卡密不能重复">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              {...this.formLayout}
            >
              <Row gutter={24}>
                <Col span={9}>
                  <Upload
                    beforeUpload={this.beforeUpload}
                    onRemove={this.onRemove}
                    fileList={fileList}
                  >
                    <Button type="primary" loading={exporotLoading} disabled={!!( fileList && fileList.length >= 1 )}>批量导入</Button>
                  </Upload>
                </Col>

                <Col span={7}>
                  <Button href={VritualUrl}>模板下载</Button>
                </Col>
              </Row>
            </FormItem>

          </Form>
        </Modal>
      </GridContent>
    );
  };
}

export default BatchCode;

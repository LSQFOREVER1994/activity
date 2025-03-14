import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, Radio, Icon, Select, message } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import FilterForm from './FilterForm';
import serviceObj from '@/services/serviceObj';
import styles from '../../Lists.less'

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const RadioGroup = Radio.Group;

const typeObj={
  "MOGUL_ATTENTION": '大佬关注',
  "INSTITUTIONAL_DISCUSSION":'机构热议',
  'MAIN_TREND':'主力方向',
  'LONG_TERM_LAYOUT':'长线布局'
}

const pushStateObj={
  'PENDING':'待发布',
  'PUBLISHED':'已发布'
}

const auditStateObj={ 
  'PENDING':'待审核',
  'PASSED':'已通过',
  'REJECTED':'已拒绝'
}

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  paperList: tool.paperList
} ) )
@Form.create()

class List extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    // articleId: 'all',
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  componentDidMount() {
    this.fetchList();
  };

  // 初始化 页面获取列表
  fetchList = () => {
    const { dispatch } = this.props;
    const  { pageSize, pageNum } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const params = formValue;
    const { pushTime } = params;
    params.pushStartTime = ( pushTime && pushTime.length ) ?  moment( pushTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    params.pushEndTime = ( pushTime && pushTime.length ) ? moment( pushTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    if( pushTime )delete params.pushTime
    dispatch( {
      type: 'tool/getPaperList',
      payload: {
        pageSize,
        pageNum,
        ...params
      }
    } )
  };

  // 翻页
  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList () );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      info: undefined
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( item ) => {
    this.setState( {
      visible: true,
      info:item
    } );
  };

  //  取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      info: undefined,
    } );
  };

  popover=( item )=>{
    const{ id }=item;
    const { paperUrl }=serviceObj;
    const strWindowFeatures = "width=375,height=667,top=0,right=0,scrollbars=no";
    window.open( `${paperUrl}?id=${id}`, '_blank', strWindowFeatures )
  }

  //  提交(添加或者编辑标签)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { info } = this.state;
    const id = info ? info.id : '';
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( info, fieldsValue ) : { ...fieldsValue };
      dispatch( {
        type: 'tool/submitPaper',
        payload: {
          params,
          callFunc: () => {
            $this.setState( {
              visible: false,
              info: undefined,
            } );
            $this.fetchList()
          },
        },
      } );
    } );
  };

  // 删除
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const{ state, id }=obj;
    if( state === 'ENABLE' ){
      message.warning( '此资讯产品目前为上架状态，不可删除!!' )
      return
    }
    const $this = this;
    const { dispatch }=this.props;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：ID为${id}的文章？`,
      onOk() {
        dispatch( {
          type: 'tool/delPaper',
          payload: {
            id,
          },
          callFunc: () => {
            $this.fetchList()
          },
        } );
      },
    } );
  }


  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    this.setState( {
      pageNum:1,
      pageSize:10
    }, ()=>this.fetchList() )
  }


  render() {
    const { loading, paperList: { total, list }, form: { getFieldDecorator, getFieldValue } } = this.props;
    const { pageSize, pageNum, visible, info={} } = this.state;

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
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        fixed: 'left',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>文章标题</span>,
        dataIndex: 'title',
        fixed: 'left',
        width:350,
        render: title => <div className={styles.titleBox}>{title}</div>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'state',
        render: state => (
          <span>{state === 'ENABLE' ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> )
      },
      {
        title: <span>类型</span>,
        dataIndex: 'type',
        render: type => <span>{typeObj[type] || '--'}</span>,
      },
      {
        title: <span>首页展示</span>,
        dataIndex: 'homeShow',
        render: ( homeShow, item ) =>{
          if( item.homeTop )return <span>置顶</span>
          return <span>{homeShow ? '是' : '否'}</span>
        }
      },
      {
        title: <span>子栏目置顶</span>,
        dataIndex: 'subSectionTop',
        width:120,
        render: subSectionTop => (
          <span>{subSectionTop ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> )
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        width:200,
        render: createTime => <span>{createTime	|| '--'}</span>,
      },
      {
        title: <span>审核状态</span>,
        dataIndex: 'auditState',
        render: auditState => <span>{auditStateObj[auditState] || '--'}</span>,
      },
      {
        title: <span>发布状态</span>,
        dataIndex: 'pushState',
        render: pushState => <span>{pushStateObj[pushState] || '--'}</span>,
      },
      {
        title: <span>发布时间</span>,
        dataIndex: 'pushTime',
        width:200,
        render: pushTime => <span>{pushTime || '--'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        fixed: 'right',
        width:150,
        render: ( id, item ) => (
          <div>
            <span
              style={{ cursor:'pointer', color:'#1890ff'  }}
              type="link"
              onClick={() => this.showEditModal( item )}
            >
              编辑
            </span>

            <span
              style={{  margin:'0 15px', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >
              删除
            </span>
            <span
              style={{ cursor: 'pointer', color: '#1890ff' }} 
              onClick={() => { this.popover( item ) }}
            >
              预览
            </span>
          </div>
        ),
      },
    ];
    return (
      <GridContent>
        <div>
          <Card
            // className={styles.listCard}
            bordered={false}
            title="文章列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <FilterForm
              wrappedComponentRef={( ref ) => { this.filterForm = ref}}
              filterSubmit={this.filterSubmit}
              delBatch={this.delBatch}
            />
            {/* 添加按钮 */}
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showAddModal()}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>

            {/* 显示列表 */}
            <Table
              size="large"
              rowKey="id"
              scroll={{ x: 1500 }}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>

        {/* 添加，编辑模板 */}
        <Modal
          maskClosable={false}
          title={info.id ? '编辑标签' : '添加标签'}
          width={840}
          bodyStyle={{ padding: '12px 24px', maxHeight: '75vh', overflow: "auto" }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label='文章标题' {...this.formLayout}>
              {getFieldDecorator( 'title', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}文章标题` }],
                initialValue: info.title,
              } )( <Input 
                disabled={!!( info && info.auditState === 'PASSED' )}
                placeholder={`${formatMessage( { id: 'form.input' } )}文章标题`}
              /> )}
            </FormItem>

            <FormItem label='类型' {...this.formLayout}>
              {getFieldDecorator( 'type', {
                  rules: [{ required: true, message: `请选择类型` }],
                  initialValue: info.type,
                } )( 
                  <Select
                    placeholder="请选择类型" 
                    disabled={!!( info && info.auditState === 'PASSED' )}
                  >
                    {
                      Object.keys( typeObj ).map( item =>(
                        <Option key={item}>{typeObj[item]}</Option>
                      ) )
                    }
                  </Select>
                )}
            </FormItem>

            <div style={{ display:'flex', justifyContent:'center', color:'#000000d9', fontSize:14 }}>
              <div style={{ display:'flex', paddingRight:'18%' }}>
                <div className={styles.edit_acitve_tab} style={{ paddingTop:'10px' }}>本篇付费：</div>
                <FormItem>
                  {getFieldDecorator( 'chargeType', {
                    rules: [{ required: true }],
                    initialValue: info.chargeType || 'CHARGE',
                  } )(
                    <RadioGroup disabled={!!( info && info.auditState === 'PASSED' )}>
                      <Radio value="CHARGE">是</Radio>
                      <Radio value="FREE">否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>

              <div style={{ display:'flex', paddingLeft:15 }}>
                <div className={styles.edit_acitve_tab} style={{ paddingTop:'10px' }}>子栏目置顶：</div>
                <FormItem>
                  {getFieldDecorator( 'subSectionTop', {
                    rules: [{ required: true }],
                    initialValue: info.subSectionTop !== undefined ? info.subSectionTop : true,
                  } )(
                    <RadioGroup disabled={!!( info && info.auditState === 'PASSED' )}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>


            <div style={{ display:'flex', justifyContent:'center', color:'#000000d9', fontSize:14 }}>
              <div style={{ display:'flex', paddingRight:'18%' }}>
                <div style={{ paddingTop:'10px' }}>首页展示：</div>
                <FormItem>
                  {getFieldDecorator( 'homeShow', {
                    rules: [{ required: false }],
                    initialValue: info.homeShow !== undefined ? info.homeShow : true,
                  } )(
                    <RadioGroup disabled={!!( info && info.auditState === 'PASSED' )}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>

              <div style={{ display:'flex', paddingLeft:20 }}>
                <div style={{ paddingTop:'10px' }}>首页置顶：</div>
                <FormItem>
                  {getFieldDecorator( 'homeTop', {
                    rules: [{ required: false }],
                    initialValue: info.homeTop !== undefined ? info.homeTop : false,
                  } )(
                    <RadioGroup disabled={!!( info && info.auditState === 'PASSED' )}>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
            </div>

            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'state', {
                  rules: [{ required: true }],
                  initialValue: info.state || 'DISABLE',
                } )(
                  <RadioGroup disabled={!( info && info.pushState === 'PUBLISHED' )}>
                    <Radio value='ENABLE'>上架</Radio>
                    <Radio value='DISABLE'>下架</Radio>
                  </RadioGroup>
                )}
            </FormItem>

            <FormItem label='悬疑式标题' {...this.formLayout}>
              {getFieldDecorator( 'suspiciousTitle', {
                  rules: [{ required: true, message: `请输入悬疑式标题` }],
                  initialValue: info.suspiciousTitle,
                } )( <Input 
                  disabled={!!( info && info.auditState === 'PASSED' )}
                  placeholder={`${formatMessage( { id: 'form.input' } )}悬疑式标题`}
                /> )}
            </FormItem>

            <FormItem label='悬疑式详情' {...this.formLayout}>
              {getFieldDecorator( 'suspiciousDetail', {
                rules: [{ required: getFieldValue( 'chargeType' ) !== 'CHARGE', message: `请输入悬疑式标题` }],
                initialValue: info.suspiciousDetail,
              } )( <BraftEditor 
                readOnly={!!( info && info.auditState === 'PASSED' )}
                record={info.suspiciousDetail}
                fieldDecorator={getFieldDecorator}
                field="content"
                contentStyle={{ height: '350px' }}
              /> )}
            </FormItem>
            {
              getFieldValue( 'chargeType' ) === 'CHARGE' &&
              <div>
                <FormItem label='未解锁文章标题' {...this.formLayout}>
                  {getFieldDecorator( 'unlockedTitle', {
                  rules: [{ required: false }],
                  initialValue: info.unlockedTitle,
                } )( <Input disabled={!!( info && info.auditState === 'PASSED' )} /> )}
                </FormItem>

                <FormItem label='未解锁文章详情' {...this.formLayout}>
                  {getFieldDecorator( 'unlockedDetail', {
                    rules: [{ required: false }],
                    initialValue: info.unlockedDetail,
                  } )( <BraftEditor
                    readOnly={!!( info && info.auditState === 'PASSED' )}
                    record={info.unlockedDetail}
                    fieldDecorator={getFieldDecorator}
                    field="content"
                    contentStyle={{ height: '350px' }}
                  /> )}
                </FormItem>
              </div>
            }
            <FormItem label='解锁文章详情' {...this.formLayout}>
              {getFieldDecorator( 'lockedDetail', {
                  rules: [{ required: true, message: `请输入解锁文章详情` }],
                  initialValue: info.lockedDetail,
                } )( <BraftEditor
                  readOnly={!!( info && info.auditState === 'PASSED' )}
                  record={info.lockedDetail}
                  fieldDecorator={getFieldDecorator}
                  field="content"
                  contentStyle={{ height: '350px' }}
                /> )}
            </FormItem>

          </Form>
        </Modal>
      </GridContent>
    );
  };
}

export default List;
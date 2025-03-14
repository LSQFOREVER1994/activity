import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Modal, DatePicker, Input, Icon, Select, Radio, InputNumber, Checkbox, Tooltip  } from 'antd';
import { formatMessage } from 'umi/locale';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../exhibition.less';

const { confirm } = Modal;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { TextArea } = Input;
const stateObj = {
  "": '全部',
  "true": '启用',
  "false": '禁用',
}


// const time = () => new Date().getTime();

@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  resourceData: exhibition.resourceData,
} ) )
@Form.create()
class Resource extends PureComponent {
  taskForm = {}

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };

  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    // info: {},
    // assignmentInfoList: [],
    buttomLoading: false,
    istop:false,
    topState:false,
  };

  componentDidMount() {
    this.getMyOrys();
    this.fetchList();
    this.getTagList();
  }


  //  获取列表
  fetchList = () => {
    const { pageSize, pageNum, listType, sortedInfo={} } = this.state;
    const { dispatch } = this.props;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'exhibition/getResourceData',
      payload: {
        pageNum,
        pageSize,
        enables:listType,
        orderBy: sortedInfo.columnKey ? `is_top desc,s_enable desc,${ sortedInfo.columnKey || '' } ${ sortValue }`: 'is_top desc,s_enable desc,create_time desc',
      },
    } );
  }


  //  获取编辑运营位列表
  getTagList=()=>{
    const { dispatch }=this.props;
    const $this = this;
    dispatch( {
      type:'exhibition/getModalData',
      payload:{},
      callFunc:( result )=>{
        $this.setState( {
          taglList:result
        } )
      }
    } )
  }

  //  获取当前用户权限
  getMyOrys = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'exhibition/getMyOrgs',
      callFunc: ( res ) => {
        const array = Object.keys( res ).map( key=> res[key] )
        if( array.length === 1 && array[0].type === 'HEAD_COMPANY' ){
          this.setState( { topState:true } )
        }else{
          this.setState( { topState:false } )
        }
      }
    } )
  }

  // searchReset = () => {
  //   const { form } = this.props;
  //   form.resetFields();
  //   this.fetchList();
  // }

  // 改变产品状态
  changeListType = ( e ) => {
    const listType = e.target.value;
    this.setState( { listType }, ()=>{
      this.fetchList()
    } )
  }


  //  删除列表
  deleteItem = ( data ) => {
    const { dispatch } = this.props;
    const { id, tag } = data;
    const that = this;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${tag}`,
      onOk() {
        dispatch( {
          type: 'exhibition/deleteResourceData',
          payload: {
            id,
            callFunc: () => {
              that.fetchList()
            },
          },
        } );
      },
    } );
  }

  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }

    this.setState( { pageNum: current, pageSize, sortedInfo: sotrObj }, ()=>this.fetchList() );
  }

  // 显示新建模板
  showModal=()=>{
    this.setState( {
      visible: true,
      info:undefined,
      istop:false,
    } )
  }

  // 显示编辑模板
  showEditModal = ( data ) => {
    this.setState( {
      visible: true,
      info:data,
      istop:data.isTop || false,
    } )
  }

  topChang=( e )=>{
    this.setState( {
      istop:e.target.checked
    } )
  }


  // 提交
  handleSubmit=( e )=>{
    e.preventDefault();
    const { info, istop }=this.state;
    const { form, dispatch }=this.props;

    const id = info ? info.id : '';
    const $this = this;

    form.validateFields( ( err, fieldsValue )=>{
      if ( err ) return;
      const newObj = info ? JSON.parse( JSON.stringify( info ) ) : {};
      const params = id ? Object.assign( newObj, { ...fieldsValue, id }, { isTop:istop } ) : Object.assign( fieldsValue, { isTop:istop } );
      dispatch( {
        type:'exhibition/submitResourceData',
        payload:{
          params,
          callFunc:()=>{
            $this.fetchList();
            $this.setState( {
              visible: false,
              info: undefined,
              istop:false
            } );
          }
        }
      } )
    } )

  }


  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      info: undefined,
      istop:false
    } );
  };


  render() {
    const {
      loading,  form: { getFieldDecorator }, resourceData:{ list, total },
    } = this.props;
    const { info={}, visible, buttomLoading, pageNum, pageSize, sortedInfo, taglList, topState, istop } = this.state;
    
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      current: pageNum,
      pageSize,
    };

    const columns = [
      {
        title: '缩略图',
        dataIndex: 'imgUrl',
        render: imgUrl => (
          <div className={styles.listImgBox}>
            <img className={styles.img} alt="" src={imgUrl} />
          </div>
        ),
      },
      {
        title: '资源位',
        dataIndex: 'tag',
        render:tag=><span>{tag}</span>
      },
      {
        title: '排序',
        dataIndex: 'sort',
        render:( sort, item )=>{
          if( item.isTop ){
            return <span style={{ color:'#f6ac17' }}>置顶</span>
          }
          return <span>{sort}</span>
        }
        // render:sort=><span>{sort}</span>
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: '总公司',
        dataIndex: 'headCompany',
        // align: 'center',
        render: ( value, record ) => record.companyInfoMap.HEAD_COMPANY ? record.companyInfoMap.HEAD_COMPANY.name : '--'
      },
      {
        title: '一级分公司',
        dataIndex: 'branchFirst',
        // align: 'center',
        render: ( value, record ) => record.companyInfoMap.BRANCH_FIRST ? record.companyInfoMap.BRANCH_FIRST.name : '--'
      },
      {
        title: '二级分公司',
        dataIndex: 'branchSecond',
        // align: 'center',
        render: ( value, record ) => record.companyInfoMap.BRANCH_SECOND ? record.companyInfoMap.BRANCH_SECOND.name : '--'
      },
      {
        title: '营业部',
        dataIndex: 'department',
        // align:'center',
        render: ( value, record ) => record.companyInfoMap.DEPARTMENT ? record.companyInfoMap.DEPARTMENT.name : '--'
      },
      {
        title: '备注',
        dataIndex: 'description',
        render:description=>{
          if( description && description.length>4 ){
            return( <span>{`${description.substring( 0, 4 )}...`}</span> )
          }
          return( <span>{description||''}</span> )
        }
      },
      {
        title: '状态',
        dataIndex: 'enable',
        render:enable=><span>{stateObj[enable]}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        render:( id, item )=>{
          if( item.isTop === true && topState === false ){
            return <span>--</span>
          }
          return(
            <div>
              <span
                style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
                type="link"
                onClick={() => this.showEditModal( item )}
              >编辑
              </span>
        
              <span
                style={{ cursor: 'pointer', color: '#f5222d' }}
                type="link"
                onClick={() => this.deleteItem( item )}
              >删除
              </span>
            </div>
          )
        }
      },
    ];

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup onChange={this.changeListType} defaultValue='' buttonStyle="solid">
          <RadioButton value="">全部</RadioButton>
          <RadioButton value="true">已启用</RadioButton>
          <RadioButton value="false">未启用</RadioButton>
        </RadioGroup>

        <Button style={{ marginLeft: 30 }} type="primary" onClick={this.showModal}>新增</Button>
      </div>
    );

    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
          title="资源位管理"
          extra={extraContent}
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <Table
            size="large"
            rowKey='id'
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        {
          visible ? 
            <Modal
              title={`${info.id ? '编辑' : '添加'}资源位`}
              visible={visible}
              width={640}
              bodyStyle={{ padding: '12px 36px', maxHeight: '80vh', overflowY: 'auto', minHeight: '40vh' }}
              centered
              okText="保存"
              confirmLoading={buttomLoading}
              {...modalFooter}
            >
              <Form layout='horizontal' className={styles.formHeight} onSubmit={this.handleSubmit}>
             
                <FormItem label='运营位' {...this.formLayout}>
                  {getFieldDecorator( 'tag', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}资源位管理` }],
                    initialValue: info.tag || '首页'
                  } )(
                    <RadioGroup>
                      {
                        taglList?
                        taglList.map( item=>(
                          <Radio value={item.name} key={item.name}>{item.name}（尺寸：{item.width}*{item.height}）</Radio>
                         ) )
                        :
                        <div>
                          <Radio value="首页">首页（尺寸）</Radio>
                          <Radio value="产品页">产品页（尺寸）</Radio>
                        </div>
                      }
                     
                    </RadioGroup>
                  )}
                </FormItem>
                    
                <FormItem label="图片" {...this.formLayout}>
                  {getFieldDecorator( 'imgUrl', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动介绍图` }],
                    initialValue: info.imgUrl,
                  } )( <UploadImg /> )}
                </FormItem>

                <FormItem label='状态' {...this.formLayout}>
                  {getFieldDecorator( 'enable', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}资源位管理` }],
                    initialValue: ( info.enable === undefined || JSON.stringify( info.enable ) === '{}' ) ? true : info.enable
                  } )(
                    <RadioGroup>
                      <Radio value>启用</Radio>
                      <Radio value={false}>禁用</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                  
                <div style={{ display:'flex', marginLeft:'5%' }}>
                  <FormItem
                    label={( 
                      <span>排序
                        <Tooltip title="数值越小越靠前，最小值为1">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span> )}
                    // {...this.formLayout}
                    style={{ display:'flex', marginRight:'5%' }}
                  >
                    {getFieldDecorator( 'sort', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}排序` }],
                      initialValue: info.sort,
                      } )(  
                        <InputNumber min={1} style={{ width:'170px' }} placeholder={`${formatMessage( { id: 'form.input' } )}排序`} />
                      )}
                  </FormItem>
                  {
                    topState && 
                    <FormItem style={{ display:'flex' }}>
                      {getFieldDecorator( 'isTop', {
                        rules: [{ required: false, message: `${formatMessage( { id: 'form.select' } )}是否置顶` }],
                        // initialValue: info.isTop
                      } )(
                        <Checkbox checked={istop} onChange={this.topChang}>置顶</Checkbox>
                      )}
                    </FormItem>
                  }
                </div>
      
                <FormItem
                  label={( 
                    <span>链接
                      <Tooltip title="未设置时仅展示，不可跳转">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span> )}
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'link', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}链接` }],
                    initialValue: info.link,
                  } )(  
                    <Input placeholder={`${formatMessage( { id: 'form.input' } )}链接`} />
                   )}
                </FormItem>
                 
                <FormItem label='描述' {...this.formLayout}>
                  {getFieldDecorator( 'description', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}描述` }],
                    initialValue: info.description,
                  } )(  
                    <TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder={`${formatMessage( { id: 'form.input' } )}描述`} />
                   )}
                </FormItem>
                     
              </Form>
            
            </Modal>
        : null
        }
      
      </GridContent>
    );
  }
}

export default Resource;

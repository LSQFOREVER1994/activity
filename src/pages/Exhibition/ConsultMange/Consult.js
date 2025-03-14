import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Card, Form, Modal, Input, Tabs, Select, Radio, Checkbox, Icon, InputNumber, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
// import { exportXlsx } from '@/utils/utils';
// import { findDOMNode } from 'react-dom';
import UploadImg from '@/components/UploadImg';
// import copy from 'copy-to-clipboard';
import Classify from './Classify';
// import serviceObj from '@/services/serviceObj';
import ConsultFilterForm from './ConsultFilterForm'
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../exhibition.less';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect( ( { exhibition } ) => ( {
  loading: exhibition.loading,
  informationsList:exhibition.informationsList
} ) )
@Form.create()

class Consult extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    selectedRowKeys: [],
    visible: false,
    // sortedInfo: {
    //   columnKey: 'create_time',
    //   field: 'createTime',
    //   order: 'descend',
    // },
    TabPaneKey:true,
    tabState:'true',
    istop:false,
    topState:false,
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
    this.getMyOrys();
    this.fetchList();
    this.getCategoryList()
  };

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

  //  获取批次兑换码
  fetchList = () => {
    const { pageNum, pageSize } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { name, publisher, rangeTime, isSale } = formValue;
    const start = ( rangeTime && rangeTime.length ) ?  moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const end = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    // const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'exhibition/getInformationsList',
      payload: {
        pageSize,
        pageNum,
        // orderBy: sortedInfo.columnKey ? `is_top desc,sort desc,${ sortedInfo.columnKey || '' } ${ sortValue }`: 'is_top desc,sort desc,create_time desc',
        orderBy:'is_top desc,sort desc',
        name,
        publisher,
        start,
        end,
        isSale
      }
    } )
  };

  //  获取类别列表
  getCategoryList = () =>{
    const { dispatch }=this.props;
    dispatch( {
      type:'exhibition/getCategoryList',
      payload:{
        pageSize:30,
        pageNum:1,
      },
      callFunc:( res )=>{
        this.setState( { categoryList:res.list } )
      }
    } )
  }

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    setTimeout( () => {
      this.fetchList()
    }, 100 );
  }

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      // sortedInfo: sorter,
    }, ()=> this.fetchList() );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      istop:false,
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( e, item ) => {
    e.stopPropagation()
    const { informationsList: { list } } = this.props;
    const obj = list.find( o => o.id === item.id );
    this.setState( {
      visible: true,
      current: obj,
      istop:item.isTop || false,
    } );
  };

  //  滚动动态获取类别列表
  // companyScroll = e => {
  //   e.persist();
  //   const { target } = e;
  //   if ( target.scrollTop + target.offsetHeight === target.scrollHeight ) {}
  // };

  //  取消
  handleCancel = () => {
    const { current } = this.state;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      current: undefined,
      istop:false
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ?  current.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const data = fieldsValue;
      const { sort } =data;
      if( !sort ){
        data.sort = 1
      }
      const params = id ? Object.assign( { ...current, ...data } ) : { ...data };
      dispatch( {
        type: 'exhibition/submitInformationsData',
        payload: {
          params
        },
        callFunc: () => {
          this.fetchList();
          this.setState( {
            visible: false,
            current:undefined,
            istop:false
          } );
        },
      } );
    } );
  };

  //  删除列表
  deleteItem=( e, item )=>{
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id, name } = item;
    const that = this
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'exhibition/deleteInformations',
          payload: {
            id,
          },
          callFunc: () => {
            that.fetchList();
            that.setState( {
              istop:false
            } )
          },
        } );
      },
    } );
  }

  //  批量删除
  delBatch = () => {
    const { selectedRowKeys } = this.state;
    if( selectedRowKeys.length === 0 )return
    const { dispatch } = this.props;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: '确定批量删除资讯吗？删除后无法恢复',
      onOk() {
        dispatch( {
          type: 'exhibition/delBatchInformations',
          payload: {
            ids: selectedRowKeys,
            callFunc: () => {
              this.setState( { selectedRowKeys: [], istop:false }, ()=>{this.fetchList()} );
            },
          }
        } );
      },
    } );
  }

  // 多选
  onSelectChange = ( selectedRowKeys ) => {
    this.setState( { selectedRowKeys } );
  }

  //  Tab切换状态
  tabChange=( tab )=>{
    this.setState( { tabState:tab } )
  }

  // 置顶按钮状态
  topChang=( e )=>{
    this.setState( {
      istop:e.target.checked
    } )
  }


  render() {
    const { loading, informationsList:{ list, total }, form: { getFieldDecorator } }=this.props;
    const { pageSize, pageNum, TabPaneKey, selectedRowKeys, visible, current={}, categoryList, tabState, topState, istop } = this.state;

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

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    
    const columns = [  
      {
        title: <span>名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>图片</span>,
        dataIndex: 'img',
        render: img => (
          <div className={styles.listImgBox}>
            <img className={styles.img} alt="" src={img} />
          </div>
        ),
      },
      {
        title: <span>类别</span>,
        dataIndex: 'category',
        render: ( category, item ) => <span>{item.category ? item.category.name : '--'}</span>,
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
      },
      {
        title: <span>发布时间</span>,
        dataIndex: 'createTime',
        // key:'create_time',
        // sorter: true,
        // sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>发布者</span>,
        dataIndex: 'publisher',
        render: publisher => <span>{publisher || ''}</span>,
      },
      {
        title: <span>状态</span>,
        width:90,
        dataIndex: 'isSale',
        render: isSale => <span>{isSale ? '已上架' : '已下架'}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        render:( id, item )=>{
          return(
            <div>
              <div
                style={{ cursor: 'pointer', color: '#1890ff' }}
                type="link"
                onClick={( e ) => this.showEditModal( e, item )}
              >编辑
              </div>
        
              <div
                style={{ cursor: 'pointer', color: '#f5222d' }}
                type="link"
                onClick={( e ) => this.deleteItem( e, item )}
              >删除
              </div>
            </div>
          )
        }
      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card 
            className={styles.listCard}
            bordered={false}
            title={tabState === 'true' ? '资讯管理' : "资讯类别"}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <Tabs defaultActiveKey={TabPaneKey.toString()} onChange={this.tabChange}>
                <TabPane tab="资讯" key={TabPaneKey}>
                  <ConsultFilterForm
                    filterSubmit={this.filterSubmit}
                    showAddModal={this.showAddModal}
                    delBatch={this.delBatch}
                    wrappedComponentRef={( ref ) => { this.filterForm = ref}}
                  />  
                  <Table
                    size="large"
                    rowKey="id"
                    columns={columns}
                    loading={loading}
                    pagination={paginationProps}
                    dataSource={list}
                    onChange={this.tableChange}
                    rowSelection={rowSelection}
                  />
                </TabPane>

                <TabPane tab="分类" key={!TabPaneKey}>
                  <Classify />
                </TabPane>

              </Tabs>
            </div>
          </Card>
        </div>
      
        <Modal
          maskClosable={false}
          title={current.id ? '编辑资讯管理':'添加资讯管理'}
          className={styles.standardListForm}
          width={840}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label='名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}名称` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}名称`} /> )}
            </FormItem>

            <FormItem label='图片' {...this.formLayout}>
              {getFieldDecorator( 'img', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}图片` }],
                  initialValue: current.img,
                } )( <UploadImg />  )}
            </FormItem>

            <FormItem label='类别' {...this.formLayout}>
              {getFieldDecorator( 'categoryId', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}类别` }],
                  initialValue: current.categoryId,
                } )( 
                  <Select 
                    onSearch={this.onSearch}
                    showSearch
                    filterOption={false}
                    onChange={()=>this.onSearch}
                    onPopupScroll={this.companyScroll}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {
                     categoryList && categoryList.length>0 && categoryList.map( item=>(
                       <Option key={item.id} value={item.id}>{item.name}</Option>
                      ) )
                    }
                  </Select>
              )}
            </FormItem>

            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'isSale', {
                  rules: [{ required: true, message: '请选择状态' }],
                  initialValue: ( current.isSale === undefined || JSON.stringify( current.isSale ) === '{}' ) ? true : current.isSale
                } )( 
                  <RadioGroup>
                    <Radio value>上架</Radio>
                    <Radio value={false}>下架</Radio>
                  </RadioGroup>
                )}
            </FormItem>

            <div style={{ display:'flex', marginLeft:'19%' }}>
              <FormItem
                label={( 
                  <span>排序
                    <Tooltip title="数值越大越靠前，最小值为1">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                  )}
                style={{ display:'flex', marginRight:'5%' }}
              >
                {getFieldDecorator( 'sort', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}排序` }],
                  initialValue: current.sort,
                  } )(  
                    <InputNumber min={1} style={{ width:'170px' }} placeholder={`${formatMessage( { id: 'form.input' } )}排序`} />
                  )}
              </FormItem>

              {
                topState &&
                <FormItem style={{ display:'flex' }}>
                  {getFieldDecorator( 'isTop', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.select' } )}是否置顶` }],
                  // initialValue: current.isTop
                } )( <Checkbox checked={istop} onChange={this.topChang}>置顶</Checkbox> )}
                </FormItem>
              }

            </div>

            <FormItem label='富文本' {...this.formLayout}>
              {getFieldDecorator( 'content', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}数量` }],
                  initialValue: current.content,
                } )( <BraftEditor record={current.content} fieldDecorator={getFieldDecorator} field="introduction" /> )}
            </FormItem>

            <FormItem label='链接' {...this.formLayout}>
              {getFieldDecorator( 'link', {
                  rules: [{ required: false }],
                  initialValue: current.link,
                } )( <Input placeholder="请输入链接" /> )}
            </FormItem>

          </Form>
        </Modal>

      </GridContent>
    );
  };
}

export default Consult;
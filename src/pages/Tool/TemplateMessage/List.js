import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import { Card, Input, Button, Modal, Form, Table, DatePicker, Radio, Select, Row, Col } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from '../Lists.less';

const FormItem = Form.Item;
const { Option } = Select;

const { confirm } = Modal;

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  templateMessageData: tool.templateMessageData,
  wxAccesstoken: tool.wxAccesstoken,
  wxTagList: tool.wxTagList,
  wxTemplateList: tool.wxTemplateList,
} ) )
@Form.create()
class TemplateMessage extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    currentTemplate: {},
    selectValue: [],
  };

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  componentWillMount() {
    const { dispatch } = this.props;
    this.fetchList();
    dispatch( {
      type: 'tool/getWxAccessToken',
      payload: {
        configId:1
      },
      callFunc:( wxAccesstoken )=>{
        dispatch( {
          type: 'tool/getWxTemplateList',
          payload:{
            accessToken: wxAccesstoken
          }
        } )
        dispatch( {
          type: 'tool/getWxTagList',
          payload:{
            accessToken: wxAccesstoken
          }
        } )
      }
    } )
    
  }

  // 获取列表
  fetchList = ( params ) => {
    const { pageNum, pageSize, sortedInfo={} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/getTemplateMessageData',
      payload: {
        pageNum,
        pageSize,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'create_time desc',
        ...params,
      }
    } );
    
   
  }
  

  // 删除列表项
  deleteItem = ( e, id, ) => {
    e.stopPropagation();
    const $this = this;
    const { listType } = this.state;
    const { templateMessageData:{ list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.title}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        
        dispatch( {
          type: 'tool/deleteTemplateMessageData',
          payload: { id },
          callFunc: () => {
            $this.fetchList();;
          },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      currentTemplate: {}
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, id ) => {
    e.stopPropagation();
   
    const { templateMessageData:{ list } } = this.props;
    const obj =  list.find( o => o.id === id ) ;
    this.templateChange( obj.templateId )
    
    this.setState( {
      visible: true,
      current: obj,
    } );
  };

 
  // 取消
  handleCancel = () => {
    const { current } = this.state;
    const { dispatch } = this.props;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this.addSpeBtn ) { this.addSpeBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
      if ( this[`editSpeBtn${id}`] ) { this[`editSpeBtn${id}`].blur(); }
    }, 0 );
    this.setState( {
      visible: false,
      current: undefined,
    } );
    
  };

  // 提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form, } = this.props;
    const {
      current, currentTemplate
    } = this.state;
    const id = current ? current.id : '';

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this.addSpeBtn ) { this.addSpeBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
      if ( this[`editSpeBtn${id}`] ) { this[`editSpeBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      // const params = id ? Object.assign( fieldsValue, { id }, ) : fieldsValue;
      
      let contentList = [];
      if( currentTemplate.contentList&&currentTemplate.contentList.length ){
        contentList = currentTemplate.contentList.map( item=>( {
          'key':item.key,
          'value': fieldsValue[item.key],
        } ) )
      }
      
      const params = {
        templateId: fieldsValue.templateId,
        contentList,
        targetUserTags: fieldsValue.targetUserTags.join( ',' ),
        jumpLink: fieldsValue.jumpLink,
        title: currentTemplate.title,
        wxAccountId: 1,
      }
      if( id )params.id=id

      dispatch( {
        type:'tool/submitTemplateMessageData',
        payload: {
          ...params,
        },
        callFunc:()=>{
          $this.fetchList();
          $this.setState( {
            visible: false,
            current: undefined,
          } );
        }
      } )
    } );
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( ) =>{
    setTimeout( () => {
      this.fetchList()
    }, 100 );
  }

  // 改变产品状态
  changeListType = ( e ) => {
    const listType = e.target.value;
    this.setState( { listType } )
  }

  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, ()=>this.fetchList() );
  };

  
  // 打开图片预览
  PreviewFunc = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  PreviewFunc2 = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  uploadImg = ( res, type ) => {
    const list = this.state[`fileList${type}`];
    list[0] = res;
    this.setState( { [`fileList${type}`]: new Array( ...list ) } );
    this.props.form.setFieldsValue( { [type]:res.url } )

  }

  RemoveFunc = ( type ) => {
    this.setState( { [`fileList${type}`]: [] } );
    this.props.form.setFieldsValue( { [type]: '' } )
  }

  templateChange = ( id ) =>{
    const { wxTemplateList } = this.props;
    const obj = wxTemplateList.find( item=>item.templateId===id );

    this.setState( { currentTemplate: obj } )
  }

  pushMessage = ( e, id ) =>{
    e.preventDefault();
    const { dispatch, wxAccesstoken } = this.props;
    dispatch( {
      type: 'tool/postWxMessage',
      payload:{
        accessToken: wxAccesstoken,
        id
      },
      callFunc:()=>{
        this.fetchList();
      }
    } )
  }

  // 全选功能暂时搁置
  // onChange=( key, item )=>{
  //   const { selectValue } =this.state;
  //   const { wxTagList, form:{ setFieldsValue, getFieldValue } } = this.props
  //   console.log( key, item, 'kkkkkkkkkkkkkkkk' );
  //   if( key.includes( 'all' ) ){
  //       if( ( getFieldValue( 'targetUserTags' )&&getFieldValue( 'targetUserTags' ).length )===wxTagList.length ){
  //         this.setFormValue( { fieldValue:'targetUserTags', targetValue: undefined } )
  //         this.setState( { selectValue:[] } )
  //       }else{

  //           const keyArr = wxTagList.map( x=>{
  //               return x.id
  //           } )
  //           this.setFormValue( { fieldValue:'targetUserTags', targetValue: keyArr } )
  //           this.setState( { selectValue: keyArr } )
  //       }
  //   }else{
  //       // this.onChange( key )
  //       console.log( 3333333333333 );
  //       this.setFormValue( { fieldValue:'targetUserTags', targetValue: key } )
        
  //   }
  // }

  // setFormValue = ( { fieldValue, targetValue } ) =>{
  //   const { form:{ setFieldsValue } } = this.props
  //   setTimeout( () => {
  //     setFieldsValue( { [fieldValue]: targetValue } )
  //   }, 100 );
  // }


  render() {
    const {
      loading, templateMessageData:{ list, total }, form: { getFieldDecorator, getFieldValue }, wxTemplateList, wxTagList
    } = this.props;
    const {
      pageSize, pageNum, visible, current = {},  sortedInfo, currentTemplate, selectValue
    } = this.state;

    let modalText = currentTemplate.content;
    
    const contentList = current.templateId === currentTemplate.templateId?current.contentList:currentTemplate.contentList;
    if( contentList&&contentList.length ){
      contentList.forEach( item => {
        modalText=modalText.replace( /{{(.*?)}}/, getFieldValue( item.key ) || item.value );
      } );
    }


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk:  this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>模板ID</span>,
        dataIndex: 'templateId',
        key: 'templateId',
        render : id => <span>{id}</span>
      },
      {
        title: <span>标题</span>,
        dataIndex: 'title',
        key: 'title',
        
        render: title => (
          <span>{title}</span> ),
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>推送时间</span>,
        dataIndex: 'pushTime',
        key: 'pushTime',
        render : pushTime => <span>{pushTime}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id ) => (
          <div>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
              onClick={( e ) => this.showEditModal( e, id )}
            >编辑
            </span>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
              onClick={( e ) => this.pushMessage( e, id )}
            >消息推送
            </span>

            <span
              style={{ cursor:'pointer', marginRight: 15, color:'#f5222d' }}
              onClick={( e ) => this.deleteItem( e, id )}
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
            // extra={extraContent}
            title='模板消息'
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              // scroll={{ x: 1200 }}
              size="large"
              rowKey='id'
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        {
          visible?
            <Modal
              maskClosable={false}
              title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={1200}
              bodyStyle={{ padding:'12px 24px', maxHeight:'72vh', overflow: "auto" }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <div>
                <Form layout='horizontal' className={styles.formHeight} onSubmit={this.handleSubmit}>
                  <Row gutter={24}>
                    <Col span={10}>
                      
                      {
                        current.templateId||currentTemplate.templateId?
                          <div>
                            <div className={styles.template_box}>
                              <div className={styles.template_title}>| 内容预览</div>
                              <div className={styles.template_content}>

                                <div style={{ whiteSpace: 'pre-line' }}>{modalText}</div>
                              </div>
                            </div>
                            <div className={styles.template_box}>
                              <div className={styles.template_title}>| 填写模板</div>
                              <div className={styles.template_content}>
                                <div style={{ whiteSpace: 'pre-line' }}>{currentTemplate.content}</div>
                              </div>
                            </div>
                            <div className={styles.template_box}>
                              <div className={styles.template_title}>| 填写例子</div>
                              <div className={styles.template_content}>
                                <div style={{ whiteSpace: 'pre-line' }}>{currentTemplate.example}</div>
                              </div>
                            </div>
                          </div>:<div className={styles.template_null}>暂未选择模板</div>
                      }
                     
                      
                    </Col>
                    <Col span={14}>
                      <FormItem label='模板ID' {...this.formLayout}>
                        {getFieldDecorator( 'templateId', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}模板ID` }],
                          initialValue: current.templateId,
                        } )( 
                          <Select style={{ width: 260 }} onChange={( id )=>{this.templateChange( id )}}>
                            {
                              wxTemplateList.map( item=>(
                                <Option key={item.templateId} value={item.templateId}>{item.title}</Option>
                              ) )
                            }
                            
                                 
                          </Select> 
                        )}
                      </FormItem>
                      <FormItem label='| 消息内容' {...this.formLayout} />

                      {
                        contentList&&contentList.length?contentList.map( ( item, index )=>(
                          <FormItem key={index} label={item.key} {...this.formLayout}>
                            {getFieldDecorator( item.key, {
                              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${item.key}` }],
                              initialValue: item.value||'',
                            } )( <Input style={{ width: 260 }} placeholder={`${formatMessage( { id: 'form.input' } )}${item.key}`} /> )}
                          </FormItem>
                        ) ):null
                      }
 
                      <FormItem label='跳转链接' {...this.formLayout}>
                        {getFieldDecorator( 'jumpLink', {
                          rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                          initialValue: current.jumpLink,
                        } )( <Input style={{ width: 260 }} placeholder={`${formatMessage( { id: 'form.input' } )}跳转链接`} /> )}
                      </FormItem>
                      <FormItem label='推送用户' {...this.formLayout}>
                        {getFieldDecorator( 'targetUserTags', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}推送用户` }],
                          initialValue: current.targetUserTags?current.targetUserTags.split( ',' ) : undefined,
                        } )(
                          <Select
                            // onChange={this.onChange}
                            style={{ width: '90%' }} 
                            allowClear
                            mode='multiple'
                            placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.content' } )}`}
                          >
                            {/* <Option key="all">全选</Option> */}
                            {
                              wxTagList.map( item => (
                                <Option key={item.id}>{item.name}</Option>
                              ) )
                            }
                          </Select> 
                      )}
                      </FormItem>
                      
                    </Col>
                  </Row>
                  
                </Form>
              </div>
            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default TemplateMessage;

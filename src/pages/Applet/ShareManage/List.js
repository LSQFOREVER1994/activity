import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import { Card, Input, Button, Modal, Form, Table, DatePicker, InputNumber, message, Radio, Icon, applettip, Select, Row, Col } from 'antd';
import moment from 'moment';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import ShareModal from './ShareModal';

import styles from '../Lists.less';

const { activitySeckillUrl } = serviceObj;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

const { confirm } = Modal;
const { RangePicker } = DatePicker;


const stateObj = {
  "": '全部',
  "ENABLE": '上架',
  "DISABLE": '下架',
}


@connect( ( { applet } ) => ( {
  loading: applet.loading,
  shareManageData: applet.shareManageData,
} ) )
@Form.create()
class List extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    listType: '',

    // image图
    coverSrcimage: '',
    imgagesSrcimage: '',
    previewVisibleimage: false,
    previewImageimage: '',
    fileListimage: [],
    

  };

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };


  

  componentWillMount() {
    const { listType } = this.state;
    this.fetchList( { listType } );
  }

  // 获取列表
  fetchList = ( params ) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch( {
      type: 'applet/getShareManageData',
      payload: {
        pageNum,
        pageSize,
        orderBy: 'id desc',
        ...params
      }
    } );
  }
  

  // 删除列表项
  deleteItem = ( e, id, ) => {
    e.stopPropagation();
    const $this = this;
    const { listType } = this.state;
    const { shareManageData:{ list }, dispatch } = this.props;
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
          type: 'applet/delShareManageData',
          payload: { id },
          callFunc: () => {
            $this.fetchList( { listType } );;
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
      fileListbackgroundImg:  [],
      fileListafterImg: [],
      fileListbuttonImg: [],
      fileListimage: [],
      fileListpreImg: [],
      fileListruleImg: [],
      fileListscratchAreaImg: [],
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, id, ) => {
    e.stopPropagation();
    const { shareManageData:{ list }, dispatch } = this.props;
    const obj =  list.find( o => o.id === id ) ;
    this.setState( {
      visible: true,
      current: obj,
      fileListimage: obj.image ? [{ url: obj.image, uid: obj.image }] : [],

    } );
    
  };

 
  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
    } );
    
  };

  // 提交
  handleSubmit = ( ) => {

    this.fetchList( { } );
    this.setState( { visible: false, current: undefined } );
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( ) =>{
    setTimeout( () => {
      this.fetchList( {} )
    }, 100 );
  }

  // 改变产品状态
  changeListType = ( e ) => {
    const listType = e.target.value;
    this.setState( { listType } )
    // this.fetchList({ listType });
  }

  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
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

  // 活动类型切换
  activeTypeChange = ( e ) =>{
    this.setState( { activeType: e.target.value } )
  }


  render() {
    const {
      loading, shareManageData:{ list, total }, form: { getFieldDecorator }
    } = this.props;
    const {
      pageSize, pageNum, visible, current = {}, previewVisibleimage, previewImageimage, fileListimage,
      previewVisiblebuttonImg, previewImagebuttonImg, fileListbuttonImg, previewVisiblebackgroundImg, previewImagebackgroundImg, fileListbackgroundImg,
      previewVisiblepreImg, previewImagepreImg, fileListpreImg, previewVisibleafterImg, previewImageafterImg, fileListafterImg,
      previewVisibleruleImg, previewImageruleImg, fileListruleImg, previewVisiblescratchAreaImg, previewImagescratchAreaImg, fileListscratchAreaImg,
    } = this.state;
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
        title: <span>标题</span>,
        dataIndex: 'title',
        key: 'title',
        
        render: title => (
          <span>{title}</span> ),
      },
      {
        title: <span>分享图</span>,
        dataIndex: 'image',
        key: 'image',
        
        render: image => (
          <img style={{ width: '100px' }} src={image} alt="" /> ),
      },
      // {
      //   title: <span>状态</span>,
      //   dataIndex: 'state',
      //   key: 'state',
      //   render : state => <span>{stateObj[state]}</span>
      // },
      // {
      //   title: <span>创建时间</span>,
      //   dataIndex: 'creatTime',
      //   key: 'creatTime',
      //   render : creatTime => <span>{creatTime}</span>
      // },
      // {
      //   title: <span>打开次数</span>,
      //   dataIndex: 'openCount',
      //   key: 'openCount',
      //   render : openCount => <span>{openCount}</span>
      // }, 
      // {
      //   title: <span>链接</span>,
      //   dataIndex: 'link',
      //   key: 'link',
      //   render : link => <span>{link}</span>
      // }, 
      {
        title: <span>查看次数</span>,
        dataIndex: 'viewCount',
        key: 'viewCount',
        render : viewCount => <span>{viewCount}</span>
      }, 
      {
        title: <span>过期时间</span>,
        dataIndex: 'endTime',
        key: 'endTime',
        render: endTime => (
          <span>{endTime || '永久'}</span> ),
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
              style={{ cursor:'pointer', marginRight: 15, color:'#f5222d' }}
              onClick={( e ) => this.deleteItem( e, id )}
            >删除
            </span>
            {/* <span>
              <a href={`${activitySeckillUrl}${id}`} target="_blank" rel='noopener noreferrer'>链接</a>
            </span> */}
          
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
            title='快捷小程序'
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
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        {/* {
          visible?
            <Modal
              maskClosable={false}
              title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={650}
              bodyStyle={{ padding:'12px 24px', maxHeight:'72vh', overflow: "auto" }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <div>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                  <FormItem label='标题' {...this.formLayout}>
                    {getFieldDecorator( 'title', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}标题` }],
                    initialValue: current.title,
                  } )( <Input style={{ width: 260 }} placeholder={`${formatMessage( { id: 'form.input' } )}标题`} /> )}
                  </FormItem>

                  
                  <FormItem label='封面图' {...this.formLayout}>
                    {getFieldDecorator( 'image', {
                      initialValue: current.image,
                    } )(
                      <div style={{ height: 110 }}>
                        <UploadImg
                          previewVisible={previewVisibleimage}
                          previewImage={previewImageimage}
                          fileList={fileListimage}
                          CancelFunc={() => { this.CancelFunc( 'image' ) }}
                          PreviewFunc={( e ) => { this.PreviewFunc2( e, 'image' ) }}
                          ChangeFunc={( e ) => this.uploadImg( e, 'image' )}
                          RemoveFunc={() => this.RemoveFunc( 'image' )}
                        />
                      </div>
                    )}
                  </FormItem>
                  <FormItem label='链接' {...this.formLayout}>
                    {getFieldDecorator( 'link', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}链接` }],
                    initialValue: current.link,
                  } )( <Input style={{ width: 260 }} placeholder={`${formatMessage( { id: 'form.input' } )}链接`} /> )}
                  </FormItem>
                  <FormItem label={formatMessage( { id: 'strategyMall.product.state' } )} {...this.formLayout}>
                    {getFieldDecorator( 'state', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                    initialValue: current.state || 'ENABLE',
                  } )(
                    <RadioGroup>
                      <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                      <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                    </RadioGroup>
                  )}
                  </FormItem>
                  {
                    current.id&&
                    <FormItem label="小程序分享图" {...this.formLayout}>
                    {getFieldDecorator( 'miniImg', {
                  } )(
                    <img 
                    style={{width: '150px', height: '150px', border: '1px solid #eee'}} 
                    src={`http://api.test.jiniutech.cn/open-service/wx-mini/qr-codes?configId=1&scene=${current.id}`} />
                  )}
                  </FormItem>
                  }
                </Form>
                
              </div>
            </Modal>:null
        } */}
        {/* {visible && <ShareModal visible={visible} current={current} handleSubmit={this.handleSubmit} handleCancel={this.handleCancel} />} */}
        {
         visible && (
           <ShareModal visible={visible} current={current} handleSubmit={this.handleSubmit} handleCancel={this.handleCancel} />
          )
        }
        
      </GridContent>
    );
  }
}

export default List;

/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 18:34:19
 * @LastEditTime: 2019-08-14 21:21:14
 * @LastEditors: Please set LastEditors
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, DatePicker, Button, Input, Modal, Radio, Row, Col, Tooltip, Icon } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import serviceObj from '@/services/serviceObj';
import styles from '../Lists.less';
import TemplateForm from './TemplateForm.com';
import FilterForm from './FilterForm';

const { activityTemplateUrl } = serviceObj;

const reorder = ( list, startIndex, endIndex ) => {
  const result = Array.from( list );
  const [removed] = result.splice( startIndex, 1 );
  result.splice( endIndex, 0, removed );
  return result;
};

const FormItem = Form.Item;
const { confirm } = Modal;
const time = () => new Date().getTime();

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  activityUserList: tool.activityUserList,
  activityTemplateData: tool.activityTemplateData
} ) )
@Form.create()


class ActivesTemplate extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayoutImage = {
    labelCol: { span: 12 },
    wrapperCol: { span: 12 },
  }

  templatesForm = {}

  constructor( props ) {
    super( props );
    this.state = {
      pageNum: 1,
      pageSize: 10,
      visible: false,
      detailInfos: [],
      info: null,
    }
  }


  componentDidMount() {
    this.fetchList( );
  }
;
  onRef = ( ref ) => {
    this.child = ref
  }

  fetchList = ( params ) => {
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { pageNum, pageSize } = this.state;
    const { name, state, startTime, endTime } = formValue;
    const start = startTime ? startTime.format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const end = endTime ? endTime.format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const { dispatch } = this.props;
    dispatch( {
        type: 'tool/getActivityTemplateList',
        payload: {
          pageSize,
          pageNum,
          orderBy: 'create_time desc',
          name,
          state,
          start,
          end,
          ...params,
        }
      } );
  };

  // 翻页
  // tableChange = ( pagination ) => {
  //   const { current } = pagination;
  //   this.fetchList( { pageNum: current } );
  //   this.setState( {
  //     pageNum: current,
  //   } );
  // };
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList ( { pageNum: current, pageSize } ) );
  }

  addDetailInfo = () => {
    const detailInfos = this.state.detailInfos.concat( [{ key:`detail-${time()}`, state: 'DISABLE', details: [], isSlide:false, isFixed:false }] );
    this.setState( { detailInfos } )
  }

  deledeDetailInfo = ( obj ) => {
    const { templatesForm  } = this;
    const detailInfos =[]
    Object.keys( templatesForm ).forEach( ( key ) => {
      const formData = templatesForm[key].getValues();
      templatesForm[key].formReset();
      detailInfos.push( { ...formData, key } );
    } )
    const newDetails = detailInfos.filter( ( item ) => item && item.key !== obj.key )
    delete templatesForm[obj.key];
    this.setState( { detailInfos: newDetails } );
  }


  deleteClick = ( data ) => {
    const { dispatch } = this.props;
    const { id, name } = data;
    const that = this;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'tool/deleteActivesTemplate',
          payload: { id },
          callFunc: () => {
            that.fetchList();
          },
        } );
      },

    } );
  }

  editClick = ( info ) => {
    
    const detailInfos = info.detailInfos && info.detailInfos.length > 0 ? 
      info.detailInfos.map( ( item, index ) => ( { ...item, key: `detail-${time()+index}` } ) ) : []
    
    this.setState( { info, visible: true, detailInfos } )
  }
 
  clickAdd = () => {
    this.setState( { info:null, visible: true, detailInfos:[] } )
  }


  handleSubmit = () => {
    const { templatesForm } = this;
    const { form, dispatch } = this.props;
    const { info } = this.state;
    
    
    const detailInfos = [];
    if( this.state.detailInfos.length > 0 ){
      this.state.detailInfos.forEach( ( item ) => {
        const formData = templatesForm[item.key].getValues();
        detailInfos.push( formData );
      } )
    }
    // Object.keys( templatesForm ).forEach( ( key ) => {
    //   const formData = templatesForm[key].getValues();
    //   // templatesForm[key].formReset();
    //   detailInfos.push( formData );
    // } )
    form.validateFields( ( err, values ) => {
      if( err ) return;
      const { startTime, endTime, ...Values } = values;
      dispatch( {
        type: 'tool/submitActivityTemplate',
        payload: {
          id:info && info.id? info.id:null,
          ...Values,
          startTime: startTime ? startTime.format() :'',
          endTime: endTime ?  endTime.format(): '',
          detailInfos,
        },
        isUpdate: !!( info&& info.id ),
        callFunc: ( result ) => {
          this.fetchList();
          this.setState( { visible:false } )
          this.templatesForm = {};
        }
      } )
      
    } )
    
  }

  clickTop = ( index ) => {
    if( index === 0 ) return ;
    const { templatesForm } = this;
    const detailInfos = [] 
    const list = reorder( this.state.detailInfos, index, index-1 );
    list.forEach( ( item ) => {
      const formData = templatesForm[item.key].getValues();
      templatesForm[item.key].formReset();
      detailInfos.push( formData );
    } )
    this.setState( { detailInfos } )
  }

  onCancel =() => {
   this.templatesForm = {};
   this.setState( { visible: false } )
 }

  // 筛选表单提交 请求数据
  filterSubmit = ( ) =>{
    setTimeout( () => {
      this.fetchList()
    }, 100 );
  }
  

 
  render() {
    const { loading, activityTemplateData: { total, list }, form:{ getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, detailInfos, info,
      } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        width:150,
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: <span>状态</span>,
        dataIndex: 'state',
        render:( value ) => value  === 'ENABLE' ? '上架' : '下架',
        // width:80
      },
      {
        title: <span>说明</span>,
        dataIndex: 'vendor',
        render:vendor=><span>{vendor || '--'}</span>
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        width: 150,
        fixed: 'right',
        render: record => (
          <div className={styles.form_action}>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
              onClick={() => this.editClick( record )}
            >修改
            </span>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#f5222d' }}
              onClick={() => this.deleteClick( record )}
            >删除
            </span>
            <a href={`${activityTemplateUrl}?id=${record.id}`} target="_blank" rel='noopener noreferrer'>链接</a>
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
            title="万能活动页管理"
            // extra={extraContent}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <FilterForm 
                filterSubmit={this.filterSubmit} 
                wrappedComponentRef={( ref ) => { this.filterForm = ref}}
                clickAdd={this.clickAdd}
              />
            </div>
            <Table
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
        <Modal
          maskClosable={false}
          title={`${info && info.id ? '编辑' : '添加'}活动模版`}
          className={styles.standardListForm}
          centered
          width={1000}
          bodyStyle={{ padding: '12px 24px', maxHeight: '80vh', overflow: "auto" }}
          destroyOnClose
          visible={visible}
          onOk={this.handleSubmit}
          onCancel={this.onCancel}
        >
          <Form name='mainForm'>
            <FormItem label='活动落地页名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动落地页名称` }],
                initialValue: info ? info.name : ''
              } )(
                <Input placeholder={`${formatMessage( { id: 'form.input' } )}活动落地页名称`} />
              )}
            </FormItem>
            <FormItem label='页面设置' {...this.formLayout} style={{ marginBottom:10 }}>
              <div> </div>
            </FormItem>
            {detailInfos && detailInfos.length > 0 &&
              detailInfos.map( ( item, index ) => <TemplateForm
                key={item.key}
                deleteClick={this.deledeDetailInfo}
                record={item}
                onRef={( ref ) => { this.templatesForm[`${item.key}`] = ref }}
                formLayout={this.formLayout}
                ref={( node ) => { this.signFormRef = node }}
                clickTop={() => { this.clickTop( index )}}
              /> )
            }
            <Row style={{ margin:'10px 0' }}>
              <Col offset={6}>              
                <Button type="primary" onClick={this.addDetailInfo}>新增</Button>
              </Col>
            </Row>
            {/* 新增设置背景图片 bgImage暂未确定接口，所以该字段赞自主设置 */}
            <FormItem
              label={
                <span>背景填充图
                  <Tooltip title="当页面不满一屏时显示">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>}
              {...this.formLayout}
            >
              {getFieldDecorator( 'background', {
                    initialValue: info && info.background ?info.background :'',
                  } )( <UploadImg /> )}
            </FormItem>
            <FormItem label='开始时间' {...this.formLayout}>
              {getFieldDecorator( 'startTime', {
                initialValue: info ? moment( info.startTime ): undefined,
              } )(
                <DatePicker showTime />
              )}
            </FormItem>
            <FormItem label='结束时间' {...this.formLayout}>
              {getFieldDecorator( 'endTime', {
                initialValue: info ? moment( info.endTime ) : undefined,
              } )(
                <DatePicker showTime />
              )}
            </FormItem>
          
            <div style={{ paddingLeft: 240, fontWeight: 'bold' }}><span style={{ fontSize: 16 }}>非活动时间提示 </span>
              <Tooltip title=" 配置了提示图，则不显示提示文字">
                <Icon type="question-circle-o" />
              </Tooltip>
            </div>
            <Row>
              <Col span={12}>
                <FormItem label='活动未开始提示' {...this.formLayoutImage}>
                  {getFieldDecorator( 'preText', {
                    initialValue: info ? info.preText : '活动未开始！',
                  } )(
                    <Input style={{ width:195 }} placeholder={`${formatMessage( { id: 'form.input' } )}活动未开始提示`} />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='活动已结束提示' {...this.formLayout}>
                  {getFieldDecorator( 'afterText', {
                    initialValue: info ? info.afterText : '活动已结束！',
                  } )(
                    <Input style={{ width:195 }} placeholder={`${formatMessage( { id: 'form.input' } )}活动已结束提示`} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label='活动未开始提示图' {...this.formLayoutImage}>
                  {getFieldDecorator( 'preImage', {
                    initialValue: info && info.preImage ?info.preImage :'',
                  } ) ( <UploadImg /> )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='活动已结束提示图' {...this.formLayout}>
                  {getFieldDecorator( 'afterImage', {
                    initialValue: info && info.afterImage ? info.afterImage :'',
                  } )( <UploadImg /> )}
                </FormItem>
              </Col>
            </Row>
            <FormItem label='APP下载链接' {...this.formLayout}>
              {getFieldDecorator( 'downloadLink', {
                initialValue: info && info.downloadLink || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}APP下载链接`} />
              )}
            </FormItem>
            <FormItem label='埋点AppID' {...this.formLayout}>
              {getFieldDecorator( 'ext1', {
                initialValue: info && info.ext1 || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}埋点AppID`} />
              )}
            </FormItem>
            <FormItem label='扩展字段' {...this.formLayout}>
              {getFieldDecorator( 'ext2', {
                initialValue: info&& info.ext2 || '',
              } )(
                <Input placeholder={`${formatMessage( { id: 'form.input' } )}扩展字段`} />
              )}
            </FormItem>
            <FormItem label='活动落地页状态' {...this.formLayout}>
              {getFieldDecorator( 'state', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}活动落地页状态` }],
                initialValue: info ? info.state : 'DISABLE'
              } )(
                <Radio.Group>
                  <Radio value="ENABLE">上架</Radio>
                  <Radio value="DISABLE">下架</Radio>
                </Radio.Group>
              )}
            </FormItem>


            <div style={{ paddingLeft: 140, color:'#d1261b', fontSize: 16 }}>（选填）分享配置</div>

            <FormItem label='分享标题' {...this.formLayout}>
              {getFieldDecorator( 'shareTitle', {
                initialValue: info && info.shareTitle,
              } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`}  /> )}
            </FormItem>
            <FormItem label='分享描述' {...this.formLayout}>
              {getFieldDecorator( 'shareDescription', {
                initialValue: info && info.shareDescription,
              } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享描述`} /> )}
            </FormItem>
            <FormItem label='分享链接' {...this.formLayout}>
              {getFieldDecorator( 'shareLink', {
                initialValue: info && info.shareLink,
              } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享链接，不填默认本活动链接`}  /> )}
            </FormItem>
            <FormItem label='分享图标' {...this.formLayout}>
              {getFieldDecorator( 'shareImg', {
                  initialValue: info && info.shareImg,
                } )( <UploadImg /> )}
              <div
                style={{ 
                  position: 'absolute', 
                  top:0, left:'125px', 
                  width:'180px',
                  fontSize: 13,
                  color: '#999', 
                  lineHeight:2,
                  marginTop:'10px'
                }}
              >
                <div>格式：jpg/jpeg/png </div>
                <div>建议尺寸：200px*200px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </FormItem>
          </Form>
        </Modal>

      </GridContent>
    );
  };
}

export default ActivesTemplate;
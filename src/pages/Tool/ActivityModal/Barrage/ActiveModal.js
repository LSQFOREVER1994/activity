/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Icon, Tabs, message, Radio, Input, Button } from 'antd';
import UploadImg from '@/components/UploadImg';
import serviceObj from '@/services/serviceObj';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj

const ImgObj={
  giftButtonImg:`${activityTemplateObj}danmu/giftButtonImg.png`,
}

@connect()
@Form.create()
class ActiveModal extends PureComponent {

  formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      errorFormList:[], // 表单错误项
      currTab:1,
      options:props.data.options || [],
      isShowGift:props.data.showGift===undefined ? 'true' : props.data.showGift.toString() 
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.props.onRef( this )
  }


  getHaveError = () => {
    let errorFormList = [];
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        haveError = true;
        errorFormList = Object.keys( err )
      }
    } );
    this.setState( { errorFormList } )
    return haveError;
  };


  // 拿去表单中数据
  getValues = () => {
    const { form } = this.props;
    const { options, isShowGift }=this.state;
    const data = form.getFieldsValue();
    const newObj =  Object.assign( data, { 
      options,
      showGift:isShowGift==='true',
    } );
    return newObj;
  }

  // 提交
  activeHandleSubmit = () => {
    const { options }=this.state;
    let Data={};
    const { form } = this.props;
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      }
    Data=Object.assign( fieldsValue,  { options }  );
    // if( Data.options ){
    //   delete Data.options
    // }
    } );
    if( isError ){
      return  Data;
    }
      return isError
  };

  onPreview = () => {
    this.props.onPreview()
  }

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }

  // 渲染
  onPreviewChang=()=>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

  // 礼包状态
  onGiftChang=( e )=>{
    this.setState( {
      isShowGift:e.target.value
    }, ()=>{
      setTimeout( () => {
        this.onPreview()
      }, 100 );
    } )

  }

  // 添加弹幕文案
  addBulletScreen=()=>{
    const { options } = this.state;
    const a=''
    options.push( a );
    this.setState( { options: Array( ...options ) } );
  }

  // 修改弹幕文案
  editBulletScreen = ( e, index ) => {
    const { options } = this.state;
    options[index] = e.target.value;
    this.setState( { options:Array( ...options ) }, ()=>{  setTimeout( () => {
      this.onPreview()
    }, 1000 );} );
  }
  
 // 删除弹幕文案
  deleteBulletScreen = ( index ) => {
    const { options } = this.state;
    const newOptions =  options.filter( ( item, i ) => i !== index );
    this.setState( { options:Array( ...newOptions ) } );
  }

  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const { errorFormList, currTab, isShowGift, options }= this.state;

    return (
      <GridContent>
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='弹幕文案' errorFormList={errorFormList} requiredList={['options', 'backgroundImg', 'backgroundColor']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='bulletText' />
                <FormItem 
                  label='弹幕文案' 
                  {...this.formLayout}
                  style={{ paddingTop: 20 }}
                >
                  {getFieldDecorator( 'options', {
                        rules: [{ required: true, message: "请输入弹幕文案" }],
                        initialValue:options,
                      } )(
                        <div> 
                          {options.map( ( item, index ) => {
                            return (
                              <Input.Group compact key={index}>
                                <Input 
                                  style={{ width: '85%' }} 
                                  value={item} 
                                  maxLength={20} 
                                  onChange={e => this.editBulletScreen( e, index )} 
                                  suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{options[index].length}/20</span>}
                                />
                                <Button style={{ width: '15%' }} type="danger" onClick={() => this.deleteBulletScreen( index )}>删除</Button>
                              </Input.Group>
                            )
                          } )}
                          <Button
                            type="dashed"
                            style={{ width: '100%', marginBottom: 8 }}
                            icon="plus"
                            onClick={() => this.addBulletScreen()}
                          >
                            添加弹幕
                          </Button>
                        </div>
                      )}
                </FormItem>
              </TabPane>
              
              <TabPane tab={<TabName name='礼包' errorFormList={errorFormList} requiredList={['giftButtonImg', 'sendButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 2} />} key="2">
                <Reminder type='gifs' />
                <FormItem
                  label='礼包' 
                  style={{ paddingTop: 20, display:'flex' }}
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'showGift', {
                    rules: [{ required: true, } ],
                    initialValue: data.showGift===undefined ? 'true' : data.showGift.toString() 
                  } )(
                    <Radio.Group onChange={this.onGiftChang}>
                      <Radio value="true">展示</Radio>
                      <Radio value="false">不展示</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
                {isShowGift==="true"&&   
                <FormItem
                  label='礼包按钮'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'giftButtonImg', {
                      rules: [{ required: true, } ],
                      initialValue: data.giftButtonImg||ImgObj.giftButtonImg,
                    } )( <UploadImg onChange={this.onPreviewChang} /> )}
                  <div
                    style={
                     { 
                       position: 'absolute', 
                       top:0, left:'125px', 
                       width:'180px',
                       fontSize: 13,
                       color: '#999', 
                       lineHeight:2,
                       marginTop:'10px'
                       }
                     }
                  >
                    <div>格式：jpg/jpeg/png </div>
                    <div>建议尺寸：80px*80px </div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
              }
                { isShowGift==="true"&&   
                <FormItem
                  style={{ paddingTop: 20, display:'flex' }} 
                  label='礼包链接'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'link', {
                    rules: [{ required: true, } ],
                      initialValue: data.link,
                    } )( <Input
                      onChange={this.onPreviewChang}
                      placeholder={`${formatMessage( { id: 'form.input' } )}请输入礼包链接`}
                    /> )}
                </FormItem>
              }
              </TabPane>

              <TabPane tab='微信分享' key="3">
                <Reminder type='wxShare' />
                <FormItem
                  style={{ paddingTop: 20, display:'flex' }} 
                  label='分享标题'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareTitle', {
                    initialValue: data.shareTitle,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`} /> )}
                </FormItem>
                <FormItem
                  style={{ paddingTop: 20, display:'flex' }} 
                  label='分享描述'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareDescription', {
                    initialValue: data.shareDescription,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享描述`} /> )}
                </FormItem>
                <FormItem
                  style={{ paddingTop: 20, display:'flex' }} 
                  label='分享链接'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareLink', {
                    initialValue: data.shareLink,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享链接，不填默认本活动链接`} /> )}
                </FormItem>
                <FormItem
                  label='分享图标'
                  {...this.formLayout}
                >
                  {getFieldDecorator( 'shareImg', {
                      initialValue: data.shareImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  <div
                    style={
                     { 
                       position: 'absolute', 
                       top:0, left:'125px', 
                       width:'180px',
                       fontSize: 13,
                       color: '#999', 
                       lineHeight:2,
                       marginTop:'10px'
                       }
                     }
                  >
                    <div>格式：jpg/jpeg/png </div>
                    <div>建议尺寸：200px*200px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </GridContent>
    );
  }
}

export default ActiveModal;

const Reminder = ( { type, msg = '', style={} } ) =>{
  
  let text = msg
  switch ( type ) {
    case 'bulletText': text = '用户可发送的弹幕文案'; break;
    case 'gifs': text = '设置礼包'; break;
    case 'wxShare': text = '（ 选填 ）微信分享'; break;
    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}


const TabName = ( { name, errorFormList, requiredList, isActive } ) => {
  let isError = false;
  if ( errorFormList&&errorFormList.length && requiredList&&requiredList.length ){
    requiredList.forEach( item => {
      if ( !isError ){
        isError = errorFormList.includes( item )
      }
    
    } )
  }
  if ( isActive ) isError=false
  const style = isError? { color:'#f5222d' } : {}
  return (
    <div style={style} className={styles.edit_acitve_tab}>
      {name}
      {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
    </div> 
  )
}

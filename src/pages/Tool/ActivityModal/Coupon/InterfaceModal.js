/* eslint-disable no-nested-ternary */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  SketchPicker } from 'react-color';
import { formatMessage } from 'umi/locale';
import { Form, Icon, Tabs, message, Input } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj

const ImgObj ={
  head:`${activityTemplateObj}qiangquan/introductionImg.png`,
  ruleButton:`${activityTemplateObj}qiangquan/ruleButtonImg.png`,
  bottom:`${activityTemplateObj}qiangquan/bottomImg.png`,
}

@connect()
@Form.create()
class StyleModal extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  formLayoutInput = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      errorFormList:[], // 表单错误项
      currTab:1,
      visibleBackgroundColor:false,
      visibleTextColor:false,
      visiblePrizeButtonColor: false,
      visibleButtonColor:false,
      backgroundColor:this.props.data.backgroundColor ?  ( this.props.data.backgroundColor.indexOf( '#' ) !== -1 ? this.props.data.backgroundColor : `#${this.props.data.backgroundColor}` ) : '#8c171f',
      buttonColor: this.props.data.buttonColor ?  ( this.props.data.buttonColor.indexOf( '#' ) !== -1 ? this.props.data.buttonColor : `#${this.props.data.buttonColor}` ): '#8c171f',
      prizeButtonColor: this.props.data.prizeButtonColor ?  ( this.props.data.prizeButtonColor.indexOf( '#' ) !== -1 ? this.props.data.prizeButtonColor : `#${this.props.data.prizeButtonColor}` ): '#fef4e8',
      textColor: this.props.data.textColor ?  ( this.props.data.textColor.indexOf( '#' ) !== -1 ? this.props.data.textColor : `#${this.props.data.textColor}` ): '#a52429',
    }
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

  // // 拿取子组件
  // onRef = ( ref ) => {
  //   this.child = ref;
  // }

  // 拿去表单中数据
  getValues = () => {
    const { form } = this.props;
    const { buttonColor, backgroundColor, prizeButtonColor, textColor } = this.state;
    const data = form.getFieldsValue()
    const newObj =  Object.assign( data, { buttonColor, backgroundColor, prizeButtonColor, textColor } );
    return newObj
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const { buttonColor, backgroundColor, prizeButtonColor, textColor } = this.state;
    const id = data.id ? data.id : '';
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      }
      
      Data = id ? Object.assign( fieldsValue, { id, buttonColor, backgroundColor, prizeButtonColor, textColor } ) : Object.assign( fieldsValue, { buttonColor, backgroundColor, prizeButtonColor, textColor } );
    } );
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview()
  }


  backgroundColorChange =( e )=>{
    const color = e.hex;
    this.setState( { backgroundColor: color }, ()=>{
      this.onPreview()
    } )
  }

  prizeButtonColorChange =( e )=>{
    const color = e.hex;
    this.setState( { prizeButtonColor: color }, ()=>{
      this.onPreview()
    } )
  }

  textColorChange =( e )=>{
    const color = e.hex;
    this.setState( { textColor: color }, ()=>{
      this.onPreview()
    } )
  }

  buttonColorChange = ( e ) =>{
    const color = e.hex;
    this.setState( { buttonColor: color }, ()=>{
      this.onPreview()
    } )
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }

  showBackgroundColor = ( e ) =>{
    e.stopPropagation()
    const { visibleBackgroundColor } = this.state;
    this.setState( {
      visibleBackgroundColor:!visibleBackgroundColor
    }, ()=>{
      this.onPreview()
    } )
  }

  showPrizeButtonColor = ( e ) =>{
    e.stopPropagation()
    const { visiblePrizeButtonColor } = this.state;
    this.setState( {
      visiblePrizeButtonColor:!visiblePrizeButtonColor
    }, ()=>{
      this.onPreview()
    } )
  }

  showTextColor = ( e ) =>{
    e.stopPropagation()
    const { visibleTextColor } = this.state;
    this.setState( {
      visibleTextColor:!visibleTextColor
    }, ()=>{
      this.onPreview()
    } )
  }

  
  showButtonColor = ( e ) =>{
    e.stopPropagation()
    const { visibleButtonColor } = this.state;
    this.setState( {
      visibleButtonColor:!visibleButtonColor
    }, ()=>{
      this.onPreview()
    } )
  }

  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visibleBackgroundColor: false,
      visibleButtonColor: false,
      visibleTextColor:false,
      visiblePrizeButtonColor:false,
    } )
  }

      //  图片切换
  imgChang=()=>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, data } = this.props;
    const { errorFormList, currTab, backgroundColor, prizeButtonColor, textColor, buttonColor, visibleBackgroundColor, visibleTextColor, visiblePrizeButtonColor, visibleButtonColor }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor ||visibleTextColor || visibleButtonColor || visiblePrizeButtonColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页Banner' errorFormList={errorFormList} requiredList={['introductionImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='banner' />
                <Content
                  sizeText='宽度750px，高度不限' 
                  // imgSrc={fileListintroductionImg.length ? fileListintroductionImg[0].url : headCard}
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'40px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                        rules: [{ required: true, message: '请上传banner图片' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )(
                        <UploadImg onChange={this.imgChang} />
                      )}
                  </FormItem>
                </Content>
              </TabPane>
              
              <TabPane tab={<TabName name='背景区域' errorFormList={errorFormList} requiredList={['backgroundColor']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='backgroundColor' />
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showBackgroundColor( e )}}>
                      <div style={{ background:backgroundColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleBackgroundColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'backgroundColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.backgroundColor|| backgroundColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              disableAlpha
                              color={backgroundColor}
                              onChange={this.backgroundColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
              </TabPane>

              <TabPane tab={<TabName name='优惠券样式' errorFormList={errorFormList} requiredList={['prizeButtonColor', 'textColor	']} isActive={parseInt( currTab, 10 ) === 2}  />} key="3">
                <Reminder type='prizeButtonColor' />
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    按钮色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showPrizeButtonColor( e )}}>
                      <div style={{ background:prizeButtonColor, width:116, height:32 }} />
                    </div>
                    {
                      visiblePrizeButtonColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'prizeButtonColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}商品图色值`
                            }],
                            initialValue: data.prizeButtonColor|| prizeButtonColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              disableAlpha
                              color={prizeButtonColor}
                              onChange={this.prizeButtonColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
                <Reminder type='textColor' style={{ borderTop:'1px dashed #999' }} />
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    文字色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showTextColor( e )}}>
                      <div style={{ background:textColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleTextColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'textColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}商品图色值`
                            }],
                            initialValue: data.textColor|| textColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              disableAlpha
                              color={textColor}
                              onChange={this.textColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
              </TabPane>
             
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="4">
                <Reminder type='rule' />
                <Content
                  sizeText='150px*62px'
                  // imgSrc={fileListruleButtonImg.length ? fileListruleButtonImg[0].url : ruleCard}
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传按钮图片' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButton,
                    } )(
                      <UploadImg onChange={this.imgChang} />
                    )}
                  </FormItem>
                </Content>
                <Reminder type='buttonColor' style={{ borderTop:'1px dashed #999' }} />
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    按钮填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative'  }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer'  }} className={styles.edit_form_pre} onClick={( e )=>{this.showButtonColor( e )}}>
                      <div style={{ background:buttonColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleButtonColor &&
                      <FormItem
                        style={{ position:'absolute', bottom:-70, left:200, zIndex:999 }}
                      >
                        {getFieldDecorator( 'buttonColor', {
                        rules: [{
                          required: true, message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`
                        }],
                        initialValue: data.buttonColor || buttonColor,
                      } )(
                        <SketchPicker
                          width="230px"
                          disableAlpha
                          color={buttonColor}
                          onChange={this.buttonColorChange}
                        />
                       )}
                      </FormItem>
                    }
                   
                  </div>
                </div>
              </TabPane>

              <TabPane tab='底部图' key="5">
                <Reminder type='bottom' />
                <Content
                  sizeText='宽度为750px，高度不限'
                  // imgSrc={fileListbottomImg.length ? fileListbottomImg[0].url : bottomCard}
                  imgBoxStyle={{ height: 275, width: 200 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'bottomImg', {
                      // rules: [{ required: true, message: ' ' }],
                      initialValue: data.bottomImg || ImgObj.bottom,
                    } )(
                      <UploadImg onChange={this.imgChang} />
                    )}
                  </FormItem>
                </Content>
                <FormItem label='跳转链接' {...this.formLayout}>
                  {getFieldDecorator( 'link', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                      initialValue: data.link,
                    } )( <Input placeholder="请输入底部图的跳转链接" disabled={!getFieldValue( 'bottomImg' )} /> )}
                </FormItem>
              </TabPane>
            </Tabs>
          </Form>

          {/* </div> */}
        </div>
      </GridContent>
    );
  }
}

export default StyleModal;

const Reminder = ( { type, msg = '', style={} } ) =>{
  let text = msg
  switch ( type ) {
    case 'banner': text = '首页顶部使用的图片'; break;
    // case 'background': text = '刮奖区背景图，主要展示刮刮卡外边框'; break;
    case 'backgroundColor': text = '由于优惠券列表内时间、左侧区域均为白色，故建议背景色值使用反差较大的颜色'; break;
    case 'prizeButtonColor': text = '优惠券右侧按钮，可通过“按钮色值”进行调整'; break;
    case 'textColor': text = '优惠券内文字，可通过“文字色值”进行调整;由于优惠券左侧为白色，故建议文字使用深色'; break;
    case 'buttonImg': text = '刮奖区覆盖图，手势滑动该区域进行刮奖'; break;
    case 'rule': text = '首页右上角活动规则按钮，图片大小建议不大于1M'; break;
    case 'buttonColor': text = '设置活动规则弹窗“确定”按钮色值,按钮文字固定白色，建议使用深色色值'; break;
    // case 'card': text = '翻牌前状态，即所抽卡牌的背面图，格式为jpg、png'; break;
    case 'bottom': text = '（选填）页面底部使用的图片，可根据具体需求选择是否设置'; break;
    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}


const Content = ( props ) => {
  const { style = {},  sizeText,  } = props;
  return (
    <div style={{ display: "flex", padding: '20px 0 0 0', ...style }}>
      <div
        style={{
          display: "flex",
          justifyContent: 'center',
          paddingLeft: 15,
          fontSize: 13,
          color: '#999',
          alignItems:'center'
        }}
      >
        {props.children}

        <div style={{ marginLeft:10, position:'relative', top:-20 }}>
          格式：jpg/jpeg/png
          <br />
          建议尺寸：{sizeText}
          <br />
          图片大小建议不大于1M
        </div>
      </div>
    </div>
  )
}

const TabName = ( { name, errorFormList, requiredList, isActive } ) => {
  let isError = false;
  if ( errorFormList.length && requiredList.length ){
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
      {name} {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
    </div> 
  )
}

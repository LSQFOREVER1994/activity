import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  SketchPicker } from 'react-color';
import { formatMessage } from 'umi/locale';
import { Form, Icon, Tabs, message } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj


const ImgObj ={
  head:`${activityTemplateObj}miaosha/introductionImg.jpg`,
  ruleButton:`${activityTemplateObj}miaosha/ruleButtonImg.png`,
  bottom:`${activityTemplateObj}miaosha/bottomImg.jpg`,
}

@connect( ( { tool } ) => ( {
  loading: tool.loading,
} ) )
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
      visibleImgColor:false,
      visibleButtonColor:false,
      
      backgroundColor:this.props.data.backgroundColor ?  ( this.props.data.backgroundColor.indexOf( '#' ) !=-1 ? this.props.data.backgroundColor : `#${this.props.data.backgroundColor}` ) : '#ffbc3e',
      buttonColor: this.props.data.buttonColor ?  ( this.props.data.buttonColor.indexOf( '#' ) != -1 ? this.props.data.buttonColor : `#${this.props.data.buttonColor}` ): '#FF9900',
      imgColor: this.props.data.imgColor ?  ( this.props.data.imgColor.indexOf( '#' ) != -1 ? this.props.data.imgColor : `#${this.props.data.imgColor}` ): '#FF9900',
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

  // // 拿取子组件
  // onRef = ( ref ) => {
  //   this.child = ref;
  // }

  // 拿去表单中数据
  getValues = () => {
    const { form } = this.props;
    const { buttonColor, backgroundColor, imgColor } = this.state;
    const data = form.getFieldsValue()
    const newObj =  Object.assign( data, { buttonColor, backgroundColor, imgColor } );
    return newObj
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const { buttonColor, backgroundColor, imgColor } = this.state;
    const id = data.id ? data.id : '';
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      }
      
      Data = id ? Object.assign( fieldsValue, { id, buttonColor, backgroundColor, imgColor } ) :
        Object.assign( fieldsValue, { buttonColor, backgroundColor, imgColor } );
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

  imgColorChange =( e )=>{
    const color = e.hex;
    this.setState( { imgColor: color }, ()=>{
      this.onPreview()
    } )
  }

  buttonColorChange = ( e ) =>{
    const color = e.hex;
    this.setState( { buttonColor: color }, ()=>{
      this.onPreview()
    } )
  }

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    console.log( 'key: ', currTab );
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

  showImgColor = ( e ) =>{
    e.stopPropagation()
    const { visibleImgColor } = this.state;
    this.setState( {
      visibleImgColor:!visibleImgColor
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

  //  图片切换
  imgChang=()=>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }
  
  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visibleBackgroundColor: false,
      visibleButtonColor: false,
      visibleImgColor:false,
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, imgColor, buttonColor, visibleBackgroundColor, visibleImgColor, visibleButtonColor
    }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor ||visibleImgColor || visibleButtonColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页Banner' errorFormList={errorFormList} requiredList={['introductionImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='banner' style={{ borderTop:'none' }} />
                <Content
                  sizeText='宽度750px，高度不限' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                        rules: [{ required: true, message: ' 请上传首页banner图片' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              
              <TabPane tab={<TabName name='背景区域' errorFormList={errorFormList} requiredList={['backgroundColor', 'backgroundImg']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='backgroundColor' style={{ borderTop:'none' }} />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
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

              <TabPane tab={<TabName name='商品图' errorFormList={errorFormList} requiredList={['imgColor']} isActive={parseInt( currTab, 10 ) === 2}  />} key="3">
                <Reminder type='imgColor' style={{ borderTop:'none' }} />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    商品图色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showImgColor( e )}}>
                      <div style={{ background:imgColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleImgColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'imgColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}商品图色值`
                            }],
                            initialValue: data.imgColor|| imgColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              disableAlpha
                              color={imgColor}
                              onChange={this.imgColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
              </TabPane>
             
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="4">
                <Reminder type='rule' style={{ borderTop:'none' }} />
                <Content
                  sizeText='150px*62px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传按钮图片' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                <Reminder type='buttonColor' />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
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
                <Reminder type='bottom' style={{ borderTop:'none' }} />
                <Content
                  sizeText='620px*346px'
                  imgBoxStyle={{ height: 275, width: 200 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'bottomImg', {
                      // rules: [{ required: true, message: ' ' }],
                      initialValue: data.bottomImg || ImgObj.bottom,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
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
    case 'backgroundColor': text = '设置页面除Banner和秒杀商品外的背景区域颜色'; break;
    case 'imgColor': text = '设置秒杀商品图除白色区域及文字外的颜色'; break;
    case 'buttonImg': text = '刮奖区覆盖图，手势滑动该区域进行刮奖'; break;
    case 'rule': text = '首页右上角活动规则按钮，图片大小建议不大于1M'; break;
    case 'buttonColor': text = '设置活动规则弹窗“确定”按钮色值'; break;
    // case 'card': text = '翻牌前状态，即所抽卡牌的背面图，格式为jpg、png'; break;
    case 'bottom': text = '（选填）页面底部使用的图片，将衔接在页面的最底部'; break;
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

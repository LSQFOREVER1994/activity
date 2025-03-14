import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { SketchPicker } from 'react-color';
import { Form, Icon, Tabs, message } from 'antd';
import UploadImg from '@/components/UploadImg';
import serviceObj from '@/services/serviceObj';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj

const ImgObj={
  head:`${activityTemplateObj}dati2/introductionImg.png`,
  ruleButton:`${activityTemplateObj}dati2/ruleButtonImg.png`,
  homePageImg:`${activityTemplateObj}dati2/homePageImg.png`,
  prizeButtonImg:`${activityTemplateObj}dati2/prizeButtonImg.png`,
  startButton:`${activityTemplateObj}dati2/startButton.png`,
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
      visibleButtonColor:false,
      visibleHomePageColor:false,
      homePageColor:props.data.homePageColor ?  ( props.data.homePageColor.indexOf( '#' ) != -1 ? props.data.homePageColor : `#${props.data.homePageColor}` ): '#3956BE',
      backgroundColor:props.data.backgroundColor ?  ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ): '#3956BE',
      buttonColor: props.data && props.data.buttonColor ?  ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#5371DE',
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
    const data = form.getFieldsValue();
    const newObj =  Object.assign( data, 
      { 
        backgroundColor:this.state.backgroundColor,
        buttonColor: this.state.buttonColor,
        homePageColor: this.state.homePageColor,
      } );
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const id = data.id ? data.id : '';
    let isError = true
    // const newObj ={}
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      } 
      Data = id ? Object.assign( fieldsValue, { 
        id, 
        buttonColor: this.state.buttonColor, 
        backgroundColor:this.state.backgroundColor,
        homePageColor: this.state.homePageColor,
      } ) : Object.assign( fieldsValue, { buttonColor: this.state.buttonColor, backgroundColor:this.state.backgroundColor } );
    } );
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview()
  }

  buttonColorChange = ( e ) =>{
    const color = e.hex;
    this.setState( { buttonColor: color }, () => {
      this.onPreview()
    } )
    
  }

  backgroundColorChange =( e )=>{
    const color = e.hex;
    this.setState( { backgroundColor: color }, ()=>{
      this.onPreview()
    } )
  }

   homePageColorChange =( e )=>{
    const color = e.hex;
    this.setState( { homePageColor: color }, ()=>{
      this.onPreview()
    } )
  }



  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }

  showBackgroundColor = ( e ) =>{
    e.stopPropagation()
    const { visibleBackgroundColor } =this.state;
    this.setState( {
      visibleBackgroundColor:!visibleBackgroundColor
    }, ()=>{
      this.onPreview()
    } )
  }

  
  showButtonColor = ( e ) =>{
    e.stopPropagation()
    const { visibleButtonColor } = this.state;
    this.setState( {
      visibleButtonColor:!visibleButtonColor,
    }, ()=>{
      this.onPreview()
    } )
  }
  

  showHomePageColor = ( e ) =>{
    e.stopPropagation()
    const { visibleHomePageColor } =this.state;
    this.setState( {
      visibleHomePageColor:!visibleHomePageColor
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


  linkChange = () =>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visibleBackgroundColor: false,
      visibleButtonColor: false,
      visibleHomePageColor:false
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor, visibleBackgroundColor, visibleButtonColor, visibleHomePageColor,
      homePageColor
    }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleButtonColor ||visibleHomePageColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页' errorFormList={errorFormList} requiredList={['homePageImg', 'homePageColor', 'startButton']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='introductionImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='宽度750px，高度不限' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'homePageImg', {
                        rules: [{ required: true, message: '请上传首页背景图' }],
                        initialValue: data.homePageImg || ImgObj.homePageImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                <Reminder type='homeBack' style={{ borderTop:'none' }} />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, padding:10, border: '1px solid #f5f5f5', cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showHomePageColor( e )}}>
                      <div style={{ background:homePageColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleHomePageColor && 
                        <FormItem
                          style={{ position:'absolute', top:-60, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'homePageColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.homePageColor|| homePageColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              color={homePageColor}
                              onChange={this.homePageColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>

                <Reminder type='beginBtn' style={{ borderTop:'none' }} />
                <Content
                  sizeText='150px*62px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'startButton', {
                      rules: [{ required: true, message: '请上传开始按钮图' }],
                      initialValue: data.startButton || ImgObj.startButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              
              <TabPane tab={<TabName name='答题页' errorFormList={errorFormList} requiredList={['backgroundColor']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='answeiBnnerImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='宽度750px，高度不限' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                        rules: [{ required: true, message: '请上传答题页面顶部banner图片' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                <Reminder type='backgroundColor' style={{ borderTop:'none' }} />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, padding:10, border: '1px solid #f5f5f5', cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showBackgroundColor( e )}}>
                      <div style={{ background:backgroundColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleBackgroundColor && 
                        <FormItem
                          style={{ position:'absolute', top:-80, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'backgroundColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.backgroundColor|| backgroundColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              color={backgroundColor}
                              onChange={this.backgroundColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
                
              </TabPane>
             
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'buttonColor', 'prizeButtonImg']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
        
                <Reminder type='rule' style={{ borderTop:'none' }} />
                <Content
                  sizeText='150px*62px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传活动规则图片' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='peize' style={{ borderTop:'none' }} />
                <Content
                  sizeText='150px*62px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请上传我的奖品图片' }],
                      initialValue: data.prizeButtonImg || ImgObj.prizeButtonImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                <Reminder type='buttonColor' />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    按钮填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative'  }}>
                    <div style={{ position:'absolute', top:-23, padding:10, border: '1px solid #f5f5f5', cursor:'pointer'  }} className={styles.edit_form_pre} onClick={( e )=>{this.showButtonColor( e )}}>
                      <div style={{ background:buttonColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleButtonColor &&
                      <FormItem
                        style={{ position:'absolute', bottom:-60, left:200, zIndex:999 }}
                      >
                        {getFieldDecorator( 'buttonColor', {
                        rules: [{
                          required: true, message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`
                        }],
                        initialValue: data.buttonColor || buttonColor,
                      } )(
                        <SketchPicker
                          // triangle="hide"
                          width="230px"
                          color={buttonColor}
                          onChange={this.buttonColorChange}
                        />
                       )}
                      </FormItem>
                    }
                   
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </GridContent>
    );
  }
}

export default StyleModal;

const Reminder = ( { type, msg = '', style={} } ) =>{
  let text = msg
  switch ( type ) {
    case 'introductionImg': text = '首页背景图片'; break;
    case 'homeBack': text = '设置首页背景色，填充页面除图片外的区域'; break;
    case 'beginBtn': text = '开始按钮'; break;

    case 'answeiBnnerImg': text = '答题页顶部banner的图片'; break;
    case 'backgroundColor': text = '设置页面背景色，填充页面除Banner、题目外的背景区域;题目区域为白色，建议设置深色色值'; break;
    case 'rule': text = '首页右上角活动规则按钮，图片大小建议不大于1M'; break;
    case 'peize': text = '首页我的奖品按钮，图片大小建议不大于1M'; break;
    case 'buttonColor': text = '设置确定、上一题、下一题、提交、结果页按钮色值，文字固定白色，建议设置深色色值'; break;
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

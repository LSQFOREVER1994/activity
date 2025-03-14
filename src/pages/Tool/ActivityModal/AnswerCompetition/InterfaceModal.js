import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { SketchPicker } from 'react-color';
import { Form, Icon, Tabs, message, Input } from 'antd';
import UploadImg from '@/components/UploadImg';
import serviceObj from '@/services/serviceObj';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj

const ImgObj={
  home:`${activityTemplateObj}dati-chiji/homeBg.png`,
  game:`${activityTemplateObj}dati-chiji/gameBg.png`,
  ruleButton:`${activityTemplateObj}dati-chiji/rule.png`,
  myPrizeButton:`${activityTemplateObj}dati-chiji/myPrize.png`,
  rankButton:`${activityTemplateObj}dati-chiji/rank.png`,
}

@connect()
@Form.create()
class StyleModal extends PureComponent {


  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
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
      visibleLeftButtonColor:false,
      visibleRightButtonColor:false,

      bottomImgVal:props.data && props.data.bottomImg ? props.data.bottomImg:'',
      
      backgroundColor:props.data.backgroundColor ?  ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ): '#105597',
      buttonColor: props.data && props.data.buttonColor ?  ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#f5a623',
      leftButtonColor:props.data.leftButtonColor ?  ( props.data.leftButtonColor.indexOf( '#' ) != -1 ? props.data.leftButtonColor : `#${props.data.leftButtonColor}` ): '#d94628',
      rightButtonColor: props.data && props.data.rightButtonColor ?  ( props.data.rightButtonColor.indexOf( '#' ) != -1 ? props.data.rightButtonColor : `#${props.data.rightButtonColor}` ) : '#288ad9',
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
    const newObj =  Object.assign( data, { backgroundColor:this.state.backgroundColor, buttonColor: this.state.buttonColor, leftButtonColor:this.state.leftButtonColor, rightButtonColor:this.state.rightButtonColor } );
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
      Data = id ? Object.assign( fieldsValue, { id, buttonColor: this.state.buttonColor, backgroundColor:this.state.backgroundColor, leftButtonColor:this.state.leftButtonColor, rightButtonColor:this.state.rightButtonColor } ) : Object.assign( fieldsValue, { buttonColor: this.state.buttonColor, backgroundColor:this.state.backgroundColor, leftButtonColor:this.state.leftButtonColor, rightButtonColor:this.state.rightButtonColor } );
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


  leftButtonColorChange = ( e ) =>{
    const color = e.hex;
    this.setState( { leftButtonColor: color }, () => {
      this.onPreview()
    } )
    
  }


  rightButtonColorChange = ( e ) =>{
    const color = e.hex;
    this.setState( { rightButtonColor: color }, () => {
      this.onPreview()
    } )
    
  }

  // 底部图切换
  bottomImgChang=( val )=>{
    this.setState( {
      bottomImgVal:val
    }, ()=>{
      setTimeout( () => {
        this.onPreview()
      }, 100 );
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

  showLeftButtonColor = ( e ) =>{
    e.stopPropagation()
    const { visibleLeftButtonColor } = this.state;
    this.setState( {
      visibleLeftButtonColor:!visibleLeftButtonColor,
    }, ()=>{
      this.onPreview()
    } )
  }

  showRightButtonColor= ( e ) =>{
    e.stopPropagation()
    const { visibleRightButtonColor } = this.state;
    this.setState( {
      visibleRightButtonColor:!visibleRightButtonColor,
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
      visibleLeftButtonColor: false,
      visibleRightButtonColor: false,
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor, visibleBackgroundColor, visibleButtonColor,
      bottomImgVal, rightButtonColor, leftButtonColor, visibleLeftButtonColor, visibleRightButtonColor
    }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleButtonColor||visibleLeftButtonColor||visibleRightButtonColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>

              <TabPane tab={( <TabName name='背景图' errorFormList={errorFormList} requiredList={['backgroundImg', 'backgroundColor']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='backgroundImg' />
                <FormItem
                  style={{ marginTop:'30px' }}
                >
                  {getFieldDecorator( 'backgroundImg', {
                      rules: [{ required: true, message: '请添加首页背景图片' }],
                      initialValue: data.backgroundImg||ImgObj.home,
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
                    <div>建议尺寸：宽度750px，高度不限</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
                <Reminder type='backgroundColor' style={{ borderTop:'1px dashed #999' }} />
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:10 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showBackgroundColor( e )}}>
                      <div style={{ background:backgroundColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleBackgroundColor && 
                        <FormItem
                          style={{ position:'absolute', top:-200, left:200, zIndex:999 }}
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
              
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'rankImg', 'prizeButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='button' />
                <FormItem
                  label='排行榜'
                  {...this.formLayout}
                  style={{ marginTop:'30px' }}
                >
                  {getFieldDecorator( 'rankImg', {
                      rules: [{ required: true, message: '请添加排行榜图片' }],
                      initialValue: data.rankImg||ImgObj.rankButton,
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
                    <div>建议尺寸：宽度80px*80px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
                <FormItem
                  label='活动规则'
                  {...this.formLayout}
                  style={{ marginTop:'30px' }}
                >
                  {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请添加活动规则图片' }],
                      initialValue: data.ruleButtonImg ||ImgObj.ruleButton,
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
                    <div>建议尺寸：宽度80px*80px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
                <FormItem
                  label='我的奖品'
                  {...this.formLayout}
                  style={{ marginTop:'30px' }}
                >
                  {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请添加我的奖品图片' }],
                      initialValue: data.prizeButtonImg||ImgObj.myPrizeButton,
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
                    <div>建议尺寸：宽度80px*80px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
                <Reminder type='buttonColor' style={{ borderTop:'1px dashed #999' }} />
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:10 }}>
                    按钮填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showBackgroundColor( e )}}>
                      <div style={{ background:buttonColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleBackgroundColor && 
                        <FormItem
                          style={{ position:'absolute', top:-340, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'buttonColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.buttonColor|| buttonColor,
                          } )( 
                            <SketchPicker
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
              <TabPane tab={( <TabName name='界面图' errorFormList={errorFormList} requiredList={['answerPageImg', 'leftButtonColor', 'rightButtonColor']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="3">
                <Reminder type='answerPageImg' />
                <FormItem
                  style={{ marginTop:'30px' }}
                >
                  {getFieldDecorator( 'answerPageImg', {
                      rules: [{ required: true, message: '请添加游戏匹配页、问答页面背景图片' }],
                      initialValue: data.answerPageImg||ImgObj.game,
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
                    <div>建议尺寸：750px*1620px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
                <Reminder type='leftButtonColor' style={{ borderTop:'1px dashed #999' }} />
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:10 }}>
                    左侧按钮填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showLeftButtonColor( e )}}>
                      <div style={{ background:leftButtonColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleLeftButtonColor && 
                        <FormItem
                          style={{ position:'absolute', top:-240, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'leftButtonColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.leftButtonColor|| leftButtonColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              color={leftButtonColor}
                              onChange={this.leftButtonColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
                <div style={{ display:'flex', padding:'50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:10 }}>
                    右侧按钮填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showRightButtonColor( e )}}>
                      <div style={{ background:rightButtonColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleRightButtonColor && 
                        <FormItem
                          style={{ position:'absolute', top:-300, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'rightButtonColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.rightButtonColor|| rightButtonColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              color={rightButtonColor}
                              onChange={this.rightButtonColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
              </TabPane>
              <TabPane tab='底部图' key="4">
                <Reminder type='bottomImg' />
                <Content
                  sizeText='750px,高度不限'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'bottomImg', {
                      initialValue: data.bottomImg,
                    } )( <UploadImg onChange={this.bottomImgChang} /> )}
                  </FormItem>
                </Content>
                {bottomImgVal &&<Reminder type='bottomImgLink' style={{ borderTop:'1px dashed #999' }}  />}
                {bottomImgVal &&
                <FormItem {...this.formLayout} style={{ marginTop:'30px' }}>
                  {getFieldDecorator( 'bottomLink', {
                   initialValue: data.bottomLink,
                   } )( <Input 
                     placeholder={`${formatMessage( { id: 'form.input' } )}底部图链接`} 
                     onChange={this.onPreview}
                   /> )}
                </FormItem>
                }
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
    case 'backgroundImg': text = '首页背景图片'; break;
    case 'backgroundColor': text = '填充背景图片外的背景区域'; break;
    case 'button': text = '首页右上角活动规则、排行榜按钮；我的奖品按钮'; break;
    case 'buttonColor': text = '设置页面其他按钮颜色，包括开始游戏按钮，任务完成按钮，弹窗按钮等'; break;
    case 'bottomImg': text = '( 选填 ) 页面底部使用的图片，将衔接在页面的最底部'; break;
    case 'bottomImgLink': text = '页面底部使用的图片点击跳转的链接'; break;
    case 'answerPageImg': text = '游戏匹配页、问答页面背景图片'; break;
    case 'leftButtonColor': text = '设置问答按钮颜色'; break;
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

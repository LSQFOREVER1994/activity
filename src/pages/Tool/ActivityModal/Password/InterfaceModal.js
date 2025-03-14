import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { SketchPicker } from 'react-color';
import { Form, Icon, Tabs, message, Input } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj

const ImgObj = {
  head: `${activityTemplateObj}kouling/introductionImg.png`,
  background:`${activityTemplateObj}kouling/backgroundImg.png`,
  jump:`${activityTemplateObj}kouling/jumpImg.png`,
  prizeButton:`${activityTemplateObj}kouling/prizeButtonImg.png`,
  ruleButton:`${activityTemplateObj}kouling/ruleButtonImg.png`,
  bottom:`${activityTemplateObj}kouling/bottomImg.png`,
}


@connect()
@Form.create()
class StyleModal extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
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
      // isJumpLink: props.data.id ? !!props.data.jumpImg : true,
      // visibleBackgroundColor:false,
      visibleButtonColor:false,
      ruleState:true,
    
      // eslint-disable-next-line no-nested-ternary
      buttonColor: props.data && props.data.buttonColor ?  ( props.data.buttonColor.indexOf( '#' ) !== -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#e43021',
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
    const newObj =  Object.assign( data, { backgroundColor:this.state.backgroundColor, buttonColor: this.state.buttonColor, ruleState:this.state.ruleState } );
    return newObj;
    
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const id = data.id ? data.id : '';
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      } 
      Data = id ? Object.assign( fieldsValue, { id, buttonColor: this.state.buttonColor, backgroundColor:this.state.backgroundColor } ) : Object.assign( fieldsValue, { buttonColor: this.state.buttonColor, backgroundColor:this.state.backgroundColor } );
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


  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
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

    //  图片切换
  imgChang=()=>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

  jumpImgChange = ( val ) => {
    if( !val ){
      this.props.form.setFieldsValue( { 'jumpLink': '' } );
    }
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }
  
  bottomImgChang = ( val ) => {
    if( !val ){
      this.props.form.setFieldsValue( { 'bottomLink': '' } );
    }
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

    // 点击元素外隐藏元素
    hideAllMenu = () => {
      this.setState( {
        visibleButtonColor: false,
      } )
    }
  
  render() {
    const { form: { getFieldDecorator, getFieldValue }, data } = this.props;
    const { errorFormList, currTab, buttonColor, visibleButtonColor }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!visibleButtonColor} />
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
                        rules: [{ required: true, message: '请上传首页banner图片' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )(
                        <UploadImg onChange={this.imgChang} />
                      )}
                  </FormItem>
                </Content>
              </TabPane>
              
              <TabPane tab={<TabName name='口令区域' errorFormList={errorFormList} requiredList={['backgroundImg', 'jumpImg']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='backgroundImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='750px*496px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                        rules: [{ required: true, message: '请上传背景图片' }],
                        initialValue: data.backgroundImg || ImgObj.background,
                      } )(
                        <UploadImg onChange={this.imgChang} />
                      )}
                  </FormItem>
                </Content>
                
                <Reminder type='jumpImg' />
                <Content
                  sizeText='620px*136px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'jumpImg', {
                        rules: [{ required: false, message: '' }],
                        initialValue: data.jumpImg || ( data.id ? '' : ImgObj.jump ),
                      } )(
                        <UploadImg onChange={this.jumpImgChange} />
                      )}
                  </FormItem>
                </Content>

                <div style={{ display:'flex', marginLeft:'1%' }}>
                  <span style={{ marginTop:8 }}>跳转链接：</span>
                  <FormItem>
                    {getFieldDecorator( 'jumpLink', {
                      rules: [{ required:false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                      // rules: [{ required: getFieldValue( 'jumpImg' ), message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                      initialValue: data.jumpLink,
                      } )( <Input placeholder='请输入活动口令所在的活动链接' disabled={!getFieldValue( 'jumpImg' )} style={{ width:430 }} /> )}
                  </FormItem>
                </div>
              </TabPane>
             
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'prizeButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
                <Reminder type='ruleButtonImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='150px*62px'
                  imgBoxStyle={{ height: 540, width: 250 }}
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

                <Reminder type='prizeButtonImg' />
                <Content
                  sizeText='114px*114px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请上传奖品按钮图片' }],
                      initialValue: data.prizeButtonImg || ImgObj.prizeButton,
                    } )(
                      <UploadImg onChange={this.imgChang} />
                    )}
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
                          disableAlpha
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

              <TabPane tab='底部图' key="4">
                <Reminder type='bottom' style={{ borderTop:'none' }} />
                <Content
                  sizeText='宽度750px，高度不限'
                  imgBoxStyle={{ height: 275, width: 200 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'bottomImg', {
                      rules: [{ required: false, message:'' }],
                      initialValue: data.bottomImg || ( data.id ? '' : ImgObj.bottom ),
                    } )(
                      <UploadImg onChange={this.bottomImgChang} />
                    )}
                  </FormItem>
                </Content>
                <div style={{ display:'flex', marginLeft:'1%' }}>
                  <span style={{ marginTop:8 }}>跳转链接：</span>
                  <FormItem>
                    {getFieldDecorator( 'bottomLink', {
                      initialValue: data.bottomLink,
                      } )( <Input placeholder='请输入底部图的跳转链接' style={{ width:430 }} disabled={!getFieldValue( 'bottomImg' )} /> )}
                  </FormItem>
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
    case 'banner': text = '页面顶部使用的图片'; break;
    case 'backgroundImg': text = '除banner和底部图外的背景图，即口令区域的背景图'; break;
    case 'jumpImg': text = '（选填）找口令的入口banner，附在口令区域背景图上'; break;
    case 'ruleButtonImg': text = '首页右上角活动规则按钮'; break;
    case 'prizeButtonImg': text = '页面右下角悬浮的“我的奖品”按钮'; break;
    case 'buttonColor': text = '设置页面其他所有按钮颜色，包括口令提交、弹窗按钮等'; break;
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

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { SketchPicker } from 'react-color';
import { Form, Icon, Tabs, message } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj

const ImgObj ={
  head:`${activityTemplateObj}dazhuanpan/introductionImg.jpg`,
  background:`${activityTemplateObj}dazhuanpan/backgroundImg.png`,
  button:`${activityTemplateObj}dazhuanpan/buttonImg.png`,
  ruleButton:`${activityTemplateObj}dazhuanpan/ruleButtonImg.png`,
  bottom:`${activityTemplateObj}dazhuanpan/bottomImg.jpg`,
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
      backgroundColor:props.data.backgroundColor ?  ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ): '#e74435',
      buttonColor: props.data && props.data.buttonColor ?  ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#FF9900',
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
    const { backgroundColor, buttonColor }=this.state;
    const data = form.getFieldsValue();
    const newObj =  Object.assign( data, { backgroundColor, buttonColor } );
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const { backgroundColor, buttonColor }=this.state;
    const id = data.id ? data.id : '';
    let isError = true
    // const newObj ={}
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      } 
      Data = id ? Object.assign( fieldsValue, { id, buttonColor, backgroundColor } ) 
      : Object.assign( fieldsValue, { buttonColor, backgroundColor } );
    } );
    return isError && Data;
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

  // 显示调色板
  showButtonColor=( type )=>{
    this.setState( {
      [`${type}`]: true
    }, ()=>{this.onPreview()} )
  }

  // 颜色变更
  buttonColorChange = ( e, type ) =>{
    const color = e.hex;
    this.setState( { [`${type}`]: color }, () => {
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
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data, currentId } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor,
      visibleBackgroundColor, visibleButtonColor,
    }= this.state;

    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleButtonColor )} />
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
                        rules: [{ required: true, message: '请上传banner图片' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              
              <TabPane tab={<TabName name='背景图' errorFormList={errorFormList} requiredList={['backgroundColor', 'backgroundImg']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='backgroundColor' style={{ borderTop:'none' }} />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, padding:10, cursor:'pointer', border: '1px solid #f5f5f5' }} className={styles.edit_form_pre} onClick={()=>{this.showButtonColor( 'visibleBackgroundColor' )}}>
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
                              color={backgroundColor}
                              disableAlpha
                              onChange={( e )=>this.buttonColorChange( e, 'backgroundColor' )}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
                
                <Reminder type='background' />
                <Content
                  sizeText='750px*794px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                        rules: [{ required: true, message: '请上传背景图片' }],
                        initialValue: data.backgroundImg || ImgObj.background,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
             
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['buttonImg', 'ruleButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
                <Reminder type='buttonImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='180px*180px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'buttonImg', {
                        rules: [{ required: true, message: '请上传按钮图片' }],
                        initialValue: data.buttonImg || ImgObj.button, 
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='rule' />
                <Content
                  sizeText='150px*62px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传规则图片' }],
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
                    <div style={{ position:'absolute', top:-23, padding:10, border: '1px solid #f5f5f5', cursor:'pointer'  }} className={styles.edit_form_pre} onClick={()=>{this.showButtonColor( 'visibleButtonColor' )}}>
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
                          width="230px"
                          color={buttonColor}
                          disableAlpha
                          onChange={( e )=>this.buttonColorChange( e, 'buttonColor' )}
                        />
                       )}
                      </FormItem>
                    }
                   
                  </div>
                </div>
              </TabPane>

              <TabPane tab='底部图' key="4">
                <Reminder type='bottom' style={{ borderTop:'none' }}  />
                <Content
                  sizeText='宽度750px，高度不限'
                  imgBoxStyle={{ height: 275, width: 200 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'bottomImg', {
                      // rules: [{ required: true, message: ' ' }],
                      initialValue:currentId ?  data.bottomImg : ImgObj.bottom,
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
    case 'backgroundColor': text = '设置页面背景色，“我的奖品”和“剩余次数”文字为白色,填充页面除Banner和转盘外的背景区域'; break;
    case 'background': text = '转盘背景图，建议使用深色'; break;
    case 'buttonImg': text = '大转盘中间的抽奖按钮图'; break;
    case 'rule': text = '首页右上角活动规则按钮，图片大小建议不大于1M'; break;
    case 'buttonColor': text = '设置弹框确定按钮的底色，按钮文字固定白色，建议设置深色色值'; break;
    case 'bottom': text = '（选填）页面底部使用的图片，将衔接在页面的最底部'; break;
    case 'popupTitleColor': text = '弹窗标题色值可进行调整，建议和背景色值反差较大'; break;
    case 'popupBackgroundColor': text = '由于任务区域均为白色，故建议背景色值使用反差较大的颜色'; break;
    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}


const Content = ( props ) => {
  const { style = {},  sizeText,  } = props;
  return (
    <div style={{ display: "flex", padding: '10px 0 0 0', ...style }}>
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

/* eslint-disable no-nested-ternary */
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
  head:`${activityTemplateObj}wenjuan/banner.png`,
}

@connect( ( { questionnaire } ) => ( {
  loading: questionnaire.loading,
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
      visibleBackgroundColor:false,   // 背景颜色
      visibleButtonColor:false,       // 按钮填充颜色
      backgroundColor:props.data.backgroundColor ?  ( props.data.backgroundColor.indexOf( '#' ) !== -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ): '#1B29C0',
      buttonColor: props.data && props.data.buttonColor ?  ( props.data.buttonColor.indexOf( '#' ) !== -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#F7B050',
      bottomImgVal:props.data && props.data.bottomImg ? props.data.bottomImg:''
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
    const data = form.getFieldsValue();
    const newObj =  Object.assign( data, { 
      backgroundColor:this.state.backgroundColor, 
      buttonColor: this.state.buttonColor,
    } );
    return newObj;
  }

  // 提交
  styleHandleSubmit = () => {
    let Data={}
    let valuesMap={}
    const { form, data } = this.props;
    const id = data.id ? data.id : '';
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      } 
      if( id ){
        valuesMap={ 
          id, 
          buttonColor: this.state.buttonColor,
          backgroundColor:this.state.backgroundColor,
        }
      }else{
        valuesMap={ 
          buttonColor: this.state.buttonColor,
          backgroundColor:this.state.backgroundColor,
        }
      }
     Data=Object.assign( fieldsValue, valuesMap );
    } );
  
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview()
  }

  // 按钮填充颜色更新
  buttonColorChange = ( e ) =>{
    const color = e.hex;
    this.setState( { buttonColor: color }, () => {
      this.onPreview()
    } )
    
  }

// 背景填充颜色更新
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

 

  //  图片切换
  imgChang=()=>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
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


  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visibleBackgroundColor: false,
      visibleButtonColor: false,
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor, visibleBackgroundColor,
       visibleButtonColor, bottomImgVal
    }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleButtonColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页Banner' errorFormList={errorFormList} requiredList={['introductionImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='introductionImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='宽度750px，高度不限' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                        rules: [{ required: true, message: '*banner图为必填项' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
            
              <TabPane tab={( <TabName name='背景图' errorFormList={errorFormList} requiredList={[ 'backgroundColor']} isActive={parseInt( currTab, 10 ) === 2} /> )} key="2">
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
                              color={backgroundColor}
                              onChange={this.backgroundColorChange}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
              </TabPane>
              
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'sendButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
                <Reminder type='buttonColor' style={{ borderTop:'none' }} />
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
                        style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                      >
                        {getFieldDecorator( 'buttonColor', {
                        rules: [{
                          required: true, message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`
                        }],
                        initialValue: data.buttonColor || buttonColor,
                      } )(
                        <SketchPicker
                          triangle="hide"
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
                <Reminder type='bottomImg' style={{ borderTop:'none' }} />
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
                  {getFieldDecorator( 'bottomImgLink', {
                   initialValue: data.bottomImgLink,
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
    case 'introductionImg': text = '首页顶部使用的图片'; break;
    case 'backgroundColor': text = '设置页面背景色，填充页面除背景图外的背景区域'; break;
    case 'buttonColor': text = '设置页面其他所有按钮颜色，包括提交按钮，立即抽奖按钮，弹框确认按钮等'; break;
    case 'bottomImg': text = '( 选填 ) 页面底部使用的图片，将衔接在页面的最底部'; break;
    case 'bottomImgLink': text = '页面底部使用的图片点击跳转的链接'; break;
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

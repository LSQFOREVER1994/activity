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

const ImgObj = {
  background: `${activityTemplateObj}juedou/backgroundImg.jpg`,
  ruleButton: `${activityTemplateObj}juedou/ruleButtonImg.png`,
  prizeButton: `${activityTemplateObj}juedou/prizeButtonImg.png`,
  schoolButton: `${activityTemplateObj}juedou/schoolButtonImg.png`,
}

@connect()
@Form.create()
class StyleModal extends PureComponent {

  formLayout = {
    labelCol: { span: 1 },
    wrapperCol: { span: 20 },
  };

  formLayoutInput = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      errorFormList: [], // 表单错误项
      currTab: 1,
      visibleBackgroundColor: false,
      visibleButtonColor: false,
      visiblePopupTextColor: false,
      visibleEndingPageColor: false,
      backgroundColor: props.data.backgroundColor ? ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ) : '#f7d15b',
      popupTextColor: props.data.popupTextColor ? ( props.data.popupTextColor.indexOf( '#' ) != -1 ? props.data.popupTextColor : `#${props.data.popupTextColor}` ) : '#e74435',
      buttonColor: props.data && props.data.buttonColor ? ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#FF9900',
      endingPageColor: props.data && props.data.endingPageColor ? ( props.data.endingPageColor.indexOf( '#' ) != -1 ? props.data.endingPageColor : `#${props.data.endingPageColor}` ) : '#004161',
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
    const newObj = Object.assign( data, { backgroundColor: this.state.backgroundColor, buttonColor: this.state.buttonColor, endingPageColor: this.state.endingPageColor } );
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data = {}
    const { form, data } = this.props;
    const id = data.id ? data.id : '';
    let isError = true
    // const newObj ={}
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      }
      Data = id ? Object.assign( fieldsValue, { id, buttonColor: this.state.buttonColor, backgroundColor: this.state.backgroundColor, endingPageColor: this.state.endingPageColor } )
        : Object.assign( fieldsValue, { buttonColor: this.state.buttonColor, backgroundColor: this.state.backgroundColor, endingPageColor: this.state.endingPageColor } );
    } );
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview()
  }

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if ( errorFormList.length > 0 ) {
      this.getHaveError()
    }
    this.setState( { currTab } )
  }


  //  颜色变化
  colorChange = ( e, type ) => {
    const color = e.hex;
    this.setState( { [`${type}`]: color }, () => {
      this.onPreview()
    } )
  }

  showColor = ( type, state ) => {
    this.setState( {
      [type]: !state
    }, () => {
      this.onPreview()
    } )
  }

  //  图片切换
  imgChang = () => {
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visibleBackgroundColor: false,
      visibleButtonColor: false,
      visiblePopupTextColor: false,
      visibleEndingPageColor: false
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor,
      visibleBackgroundColor, visibleButtonColor, visiblePopupTextColor, endingPageColor, visibleEndingPageColor
    } = this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleButtonColor || visiblePopupTextColor || visibleEndingPageColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane
                tab={( <TabName
                  name='首页'
                  errorFormList={errorFormList}
                  requiredList={['backgroundColor', 'backgroundImg', 'clickButtonImg']}
                  isActive={parseInt( currTab, 10 ) === 1}
                /> )}
                key="1"
              >
                <Reminder type='background' />
                <Content
                  sizeText='宽度750px，高度不限'
                  imgBoxStyle={{ width: 250, marginRight: 20 }}
                  style={{ padding: '20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                      rules: [{ required: true, message: '请上传活动首页使用的图片' }],
                      initialValue: data.backgroundImg || ImgObj.background,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='backgroundColor' style={{ borderTop: 'none' }} />
                <div style={{ display: 'flex', padding: '30px 0 50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    背景填充色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={() => { this.showColor( 'visibleBackgroundColor', visibleBackgroundColor ) }}>
                      <div style={{ background: backgroundColor, width: 116, height: 32 }} />
                    </div>

                    {
                      visibleBackgroundColor &&
                      <FormItem style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}>
                        {getFieldDecorator( 'backgroundColor', {
                          rules: [{
                            required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                          }],
                          initialValue: data.backgroundColor || backgroundColor,
                        } )(
                          <SketchPicker
                            width="230px"
                            color={backgroundColor}
                            disableAlpha
                            onChange={( e ) => this.colorChange( e, 'backgroundColor' )}
                          />
                        )}
                      </FormItem>
                    }
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab={( <TabName
                  name='背景图'
                  errorFormList={errorFormList}
                  requiredList={['backgroundColor', 'backgroundImg', 'clickButtonImg']}
                  isActive={parseInt( currTab, 10 ) === 1}
                /> )}
                key="2"
              >

                <Reminder type='endingPageColor' style={{ borderTop: 'none' }} />
                <div style={{ display: 'flex', padding: '30px 0 50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    背景填充色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={() => { this.showColor( 'visibleEndingPageColor', visibleBackgroundColor ) }}>
                      <div style={{ background: endingPageColor, width: 116, height: 32 }} />
                    </div>

                    {
                      visibleEndingPageColor &&
                      <FormItem style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}>
                        {getFieldDecorator( 'endingPageColor', {
                          rules: [{
                            required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                          }],
                          initialValue: data.endingPageColor || endingPageColor,
                        } )(
                          <SketchPicker
                            width="230px"
                            color={endingPageColor}
                            disableAlpha
                            onChange={( e ) => this.colorChange( e, 'endingPageColor' )}
                          />
                        )}
                      </FormItem>
                    }
                  </div>
                </div>
              </TabPane>
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['bucketImg']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
                {/* 规则按钮 */}
                <Reminder type='rulesImg' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='150px*50px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传规则按钮图片' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                {/* k线学堂 */}
                <Reminder type='kLineSchoolImg' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='110px*110px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'schoolButtonImg', {
                      rules: [{ required: true, message: '请上传k线学堂图片' }],
                      initialValue: data.schoolButtonImg || ImgObj.schoolButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                {/* 我的奖品 */}
                <Reminder type='prizeImg' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='110px*110px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请上传我的奖品图片' }],
                      initialValue: data.prizeButtonImg || ImgObj.prizeButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                {/* 按钮填充色值 */}
                <Reminder type='buttonColor' style={{ borderTop: 'none' }} />
                <div style={{ display: 'flex', padding: '30px 0 50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    按钮填充色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={() => { this.showColor( 'visibleBackgroundColor', visibleBackgroundColor ) }}>
                      <div style={{ background: buttonColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visibleBackgroundColor &&
                      <FormItem style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}>
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
                            onChange={( e ) => this.colorChange( e, 'buttonColor' )}
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

const Reminder = ( { type, msg = '', style = {} } ) => {
  let text = msg
  switch ( type ) {
    case 'backgroundColor': text = '设置页面背景色，填充首页除图片外的区域'; break;
    case 'background': text = '活动首页使用的图片'; break;
    case 'buttonColor': text = '设置弹框确定按钮的底色，按钮文字固定白色，建议设置深色色值'; break;
    case 'rulesImg': text = '首页右上角活动规则按钮'; break;
    case 'kLineSchoolImg': text = 'k线学堂按钮'; break;
    case 'prizeImg': text = '我的奖品按钮'; break;
    case 'endingPageColor': text = '设置游戏进行时和结算页背景色'; break;
    
    // -----
    case 'clickButtonImg': text = '抽签触发按钮，固定悬停在页面下方'; break;
    case 'bucketImg': text = '设置签筒图片，摇签时签筒会左右晃动'; break;
    case 'popupImg': text = '设置抽签结果弹窗'; break;
    case 'popupTextColor': text = '弹窗内文案色值'; break;
    case 'againImg': text = '（选填）活动无奖品时，可设置"再测一次"按钮，显示在抽签结果弹窗下方，未配置不展示'; break;
    case 'recommendLinkImg': text = '（选填）活动无奖品时，可设置推广按钮、推广链接，显示在抽签结果弹窗下方，未配置不展示'; break;
    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}


const Content = ( props ) => {
  const { style = {}, sizeText, } = props;
  return (
    <div style={{ display: "flex", padding: '10px 0 0 0', ...style }}>
      <div
        style={{
          display: "flex",
          justifyContent: 'center',
          paddingLeft: 15,
          fontSize: 13,
          color: '#999',
          alignItems: 'center'
        }}
      >
        {props.children}

        <div style={{ marginLeft: 10, position: 'relative', top: -20 }}>
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
  if ( errorFormList.length && requiredList.length ) {
    requiredList.forEach( item => {
      if ( !isError ) {
        isError = errorFormList.includes( item )
      }
    } )
  }
  if ( isActive ) isError = false
  const style = isError ? { color: '#f5222d' } : {}
  return (
    <div style={style} className={styles.edit_acitve_tab}>
      {name} {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
    </div>
  )
}

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
  introductionImg: `${activityTemplateObj}suijika/banner.png`,
  backgroundImg: `${activityTemplateObj}suijika/backgroundImg.png`,
  coverImg: `${activityTemplateObj}suijika/coverImg.png`,
  ruleButtonImg: `${activityTemplateObj}suijika/ruleButtonImg.png`,
  prizeButtonImg: `${activityTemplateObj}suijika/prizeButtonImg.png`
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
      errorFormList: [], // 表单错误项
      currTab: 1,
      visibleBackgroundColor: false,
      visibleButtonColor: false,

      backgroundColor: props.data && props.data.backgroundColor ? ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ) : '#140c4f',
      buttonColor: props.data && props.data.buttonColor ? ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#ffc36d',
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
    const { backgroundColor, buttonColor } = this.state
    const data = form.getFieldsValue();
    const newObj = Object.assign( data, { backgroundColor, buttonColor } );
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data = {}
    const { form, data } = this.props;
    const { backgroundColor, buttonColor } = this.state
    const id = data.id ? data.id : '';
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      }
      Data = id ? Object.assign( fieldsValue, { id, backgroundColor, buttonColor } ) : Object.assign( fieldsValue, { backgroundColor, buttonColor } );
    } );
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview()
  }


  //  颜色变化
  colorChange = ( e, type ) => {
    const color = e.hex;
    this.setState( { [`${type}`]: color }, () => {
      this.onPreview()
    } )
  }


  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if ( errorFormList.length > 0 ) {
      this.getHaveError()
    }
    this.setState( { currTab } )
  }

  //  显示颜色调试器
  showColorModal = ( e, type ) => {
    this.setState( {
      [`${type}`]: true
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
      visibleButtonColor: false
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor, visibleBackgroundColor, visibleButtonColor
    } = this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleButtonColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页' errorFormList={errorFormList} requiredList={['introductionImg', 'backgroundImg', 'backgroundColor', 'coverImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='introductionImg' />
                <Content
                  sizeText='750px * 380px'
                  imgBoxStyle={{ width: 250, marginRight: 20 }}
                  style={{ padding: '40px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                      rules: [{ required: true, message: '请上传banner' }],
                      initialValue: data.introductionImg || ImgObj.introductionImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='backgroundImg' style={{ borderTop: '1px dashed #999', paddingTop: '30px' }} />
                <Content
                  sizeText='750px * 954px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                      rules: [{ required: true, message: '请上传元素图图片' }],
                      initialValue: data.backgroundImg || ImgObj.backgroundImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='backgroundColor' style={{ borderTop: '1px dashed #999', paddingTop: '30px' }} />
                <div style={{ display: 'flex', padding: '50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    背景填充色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={( e ) => { this.showColorModal( e, 'visibleBackgroundColor' ) }}>
                      <div style={{ background: backgroundColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visibleBackgroundColor &&
                      <FormItem
                        style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}
                      >
                        {getFieldDecorator( 'backgroundColor', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值` }],
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

                <Reminder type='coverImg' style={{ borderTop: '1px dashed #999', paddingTop: '30px' }} />
                <Content
                  sizeText='460px * 590px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'coverImg', {
                      rules: [{ required: true, message: '请上传默认卡片图图片' }],
                      initialValue: data.coverImg || ImgObj.coverImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>

              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'prizeButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">

                <Reminder type='ruleButtonImg' />
                <Content
                  sizeText='126px * 52px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight: 10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传活动规则图片' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButtonImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='prizeButtonImg' style={{ borderTop: '1px dashed #999', paddingTop: '30px' }} />
                <Content
                  sizeText='126px * 52px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请上传我的奖品图片' }],
                      initialValue: data.prizeButtonImg || ImgObj.prizeButtonImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='buttonColor' style={{ borderTop: '1px dashed #999', padding: '30px 0', }} />
                <div style={{ display: 'flex', padding: '50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    主题颜色填充色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={( e ) => { this.showColorModal( e, 'visibleButtonColor' ) }}>
                      <div style={{ background: buttonColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visibleButtonColor &&
                      <FormItem
                        style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}
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
    case 'introductionImg': text = 'banner, 用于配置活动页面顶部图片'; break;
    case 'backgroundImg': text = '元素图, 衔接在banner下方'; break;
    case 'backgroundColor': text = '背景填充色, 设置整体页面的背景底色'; break;
    case 'coverImg': text = '默认卡片图, 长按可快速轮播展示随机卡片'; break;
    case 'ruleButtonImg': text = '右上角活动规则按钮'; break;
    case 'prizeButtonImg': text = '右上角我的奖品按钮'; break;
    case 'buttonColor': text = '主题颜色，设置弹窗“确定”按钮底色,建议设置深色色值'; break;
    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}


const Content = ( props ) => {
  const { style = {}, sizeText, } = props;
  return (
    <div style={{ display: "flex", padding: '20px 0 0 0', ...style }}>
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

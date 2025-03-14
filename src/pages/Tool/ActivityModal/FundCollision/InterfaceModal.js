import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { SketchPicker } from 'react-color';
import { Form, Icon, Tabs, message, Input } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import styles from './index.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { activityTemplateObj } = serviceObj

const ImgObj = {
  poolBgImg: `${activityTemplateObj}duiduipeng/poolBgImg.png`,
  ruleButtonImg: `${activityTemplateObj}duiduipeng/ruleButtonImg.png`,
  myRecord: `${activityTemplateObj}duiduipeng/myRecordImg.png`,
  shareFriend: `${activityTemplateObj}duiduipeng/shareImg.png`,
  awardImg: `${activityTemplateObj}duiduipeng/awardImg.png`,
}

@connect(({ fundCollision }) => ({
  loading: fundCollision.loading,
}))
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

  constructor(props) {
    super(props);
    this.state = {
      errorFormList: [], // 表单错误项
      currTab: 1,
      visibleBackgroundColor: false,
      visibleButtonColor: false,

      // 左侧基金背景色值
      visibleLeftBgColor: false,
      leftBgColor: props.data.leftBgColor ? (props.data.leftBgColor.indexOf('#') != -1 ? props.data.leftBgColor : `#${props.data.leftBgColor}`) : '#ffffff',
      // 左侧基金名称、竞猜按钮色值		
      visibleLeftColor: false,
      leftColor: props.data.leftColor ? (props.data.leftColor.indexOf('#') != -1 ? props.data.leftColor : `#${props.data.leftColor}`) : '#ffe1b5',
      // 右侧基金背景色值
      visibleRightBgColor: false,
      rightBgColor: props.data.rightBgColor ? (props.data.rightBgColor.indexOf('#') != -1 ? props.data.rightBgColor : `#${props.data.rightBgColor}`) : '#ffffff',
      // 右侧基金名称、竞猜按钮色值	
      visibleRightColor: false,
      rightColor: props.data.rightColor ? (props.data.rightColor.indexOf('#') != -1 ? props.data.rightColor : `#${props.data.rightColor}`) : '#ffe1b5',


      // 背景填充色值
      backgroundColor: props.data.backgroundColor ? (props.data.backgroundColor.indexOf('#') != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}`) : '#f7f7f7',

      // 按钮填充色值
      buttonColor: props.data && props.data.buttonColor ? (props.data.buttonColor.indexOf('#') != -1 ? props.data.buttonColor : `#${props.data.buttonColor}`) : '#FF9900',
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.props.onRef(this)
  }


  getHaveError = () => {
    let errorFormList = [];
    const { form } = this.props;
    let haveError = false
    form.validateFields((err) => {
      if (err) {
        haveError = true;
        errorFormList = Object.keys(err)

      }
    });
    this.setState({ errorFormList })
    return haveError;
  };


  // 拿去表单中数据 
  getValues = () => {
    const { form } = this.props;
    const { backgroundColor } = this.state;
    const data = form.getFieldsValue();
    const newObj = Object.assign(data, {
      backgroundColor: this.state.backgroundColor,
      buttonColor: this.state.buttonColor,
      leftBgColor: this.state.leftBgColor,
      rightBgColor: this.state.rightBgColor,
      rightColor: this.state.rightColor,
      leftColor: this.state.leftColor,
    });
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data = {}
    const { form, data } = this.props;
    const { buttonColor, backgroundColor, rightColor, rightBgColor, leftColor, leftBgColor } = this.state;
    const id = data.id ? data.id : '';
    let isError = true

    form.validateFields((err, fieldsValue) => {
      if (err) {
        isError = false
        message.error('请在界面设置里面输入必填项')
        return;
      }
      Data = id ? Object.assign(fieldsValue, { id, buttonColor, backgroundColor, rightColor, rightBgColor, leftColor, leftBgColor })
        : Object.assign(fieldsValue, { buttonColor, backgroundColor, rightBgColor, leftColor, leftBgColor });
    });
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview()
  }

  changeTab = (currTab) => {
    const { errorFormList } = this.state;
    if (errorFormList.length > 0) {
      this.getHaveError()
    }
    this.setState({ currTab })
  }


  //  颜色变化
  colorChange = (e, type) => {
    const color = e.hex;
    this.setState({ [`${type}`]: color }, () => {
      this.onPreview()
    })
  }

  showColor = (type, state) => {
    this.setState({
      [type]: !state
    }, () => {
      this.onPreview()
    })
  }

  //  图片切换
  imgChang = () => {
    setTimeout(() => {
      this.onPreview()
    }, 100);
  }

  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState({
      visibleBackgroundColor: false,
      visibleButtonColor: false,
      //
      visibleLeftBgColor: false,
      visibleRightBgColor: false,
      visibleRightColor: false,
      visibleLeftColor: false,
    })
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor, popupTextColor,
      visibleBackgroundColor, visibleButtonColor, visibleLeftBgColor, visibleLeftColor,
      visibleRightBgColor, visibleRightColor, leftBgColor, leftColor, rightColor, rightBgColor
    } = this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover}
          hidden={!(visibleBackgroundColor || visibleButtonColor || visibleLeftBgColor || visibleRightBgColor || visibleRightColor || visibleLeftColor)}
        />
        <div className={styles.interfaceModal}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane
                tab={(<TabName name='奖池背景色' errorFormList={errorFormList} requiredList={['backgroundColor', 'backgroundImg']}
                  isActive={parseInt(currTab, 10) === 1} />)}
                key="1"
              >
                <Reminder type='backgroundColor' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='750*432px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator('poolBgImg', {
                      rules: [{
                        required: true, message: `首页上方奖池背景图不能为空！`
                      }],
                      initialValue: data.poolBgImg || ImgObj.poolBgImg,
                    })(<UploadImg onChange={this.imgChang} />)}
                  </FormItem>
                </Content>
                {/* 设置基金色值 */}
                <Reminder type='popupTextColor' style={{ borderTop: 'none' }} />
                <div style={{ display: 'flex' }}>
                  <div className={`${styles.sketchPicker} ${styles.f_1}`}>
                    <div style={{ marginRight: 20 }}>
                      左侧基金背景色值:
                  </div>
                    <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }}
                        className={styles.edit_form_pre}
                        onClick={() => { this.showColor('visibleLeftBgColor', visibleLeftBgColor) }}>
                        <div style={{ background: leftBgColor, width: 116, height: 32 }} />
                      </div>
                      {
                        visibleLeftBgColor &&
                        <FormItem style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}>
                          {getFieldDecorator('leftBgColor', {
                            rules: [{
                              required: true, message: `请选择左侧基金背景色值`
                            }],
                            initialValue: data.leftBgColor || leftBgColor,
                          })(
                            <SketchPicker
                              width="230px"
                              color={leftBgColor}
                              disableAlpha
                              onChange={(e) => this.colorChange(e, 'leftBgColor')}
                            />
                          )}
                        </FormItem>
                      }
                    </div>
                  </div>
                  <div className={`${styles.sketchPicker} ${styles.f_1}`}>
                    <div style={{ marginRight: 20 }}>
                      左侧基金名称、竞猜按钮色值:
                  </div>
                    <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                      <div
                        style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }}
                        className={styles.edit_form_pre}
                        onClick={() => { this.showColor('visibleLeftColor', visibleLeftColor) }}
                      >
                        <div style={{ background: leftColor, width: 116, height: 32 }} />
                      </div>
                      {
                        visibleLeftColor &&
                        <FormItem style={{ position: 'absolute', top: -30, right: 550, zIndex: 999 }}>
                          {getFieldDecorator('leftColor', {
                            rules: [{
                              required: true, message: `${formatMessage({ id: 'form.input' })}背景填充色值`
                            }],
                            initialValue: data.leftColor || leftColor,
                          })(
                            <SketchPicker
                              width="230px"
                              color={leftColor}
                              disableAlpha
                              onChange={(e) => this.colorChange(e, 'leftColor')}
                            />
                          )}
                        </FormItem>
                      }
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex' }}>
                  <div className={`${styles.sketchPicker} ${styles.f_1}`}>
                    <div style={{ marginRight: 20 }}>
                      右侧基金背景色值:
                    </div>
                    <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={() => { this.showColor('visibleRightBgColor', visibleRightBgColor) }}>
                        <div style={{ background: rightBgColor, width: 116, height: 32 }} />
                      </div>
                      {
                        visibleRightBgColor &&
                        <FormItem style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}>
                          {getFieldDecorator('rightBgColor', {
                            rules: [{
                              required: true, message: `${formatMessage({ id: 'form.input' })}背景填充色值`
                            }],
                            initialValue: data.rightBgColor || rightBgColor,
                          })(
                            <SketchPicker
                              width="230px"
                              color={rightBgColor}
                              disableAlpha
                              onChange={(e) => this.colorChange(e, 'rightBgColor')}
                            />
                          )}
                        </FormItem>
                      }
                    </div>
                  </div>
                  <div className={`${styles.sketchPicker} ${styles.f_1}`}>
                    <div style={{ marginRight: 20 }}>
                      右侧基金名称、竞猜按钮色值:
                    </div>
                    <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={() => { this.showColor('visibleRightColor', visibleRightColor) }}>
                        <div style={{ background: rightColor, width: 116, height: 32 }} />
                      </div>
                      {
                        visibleRightColor &&
                        <FormItem style={{ position: 'absolute', top: -30, right: 550, zIndex: 999 }}>
                          {getFieldDecorator('rightColor', {
                            rules: [{
                              required: true, message: `请选择右侧基金名称、竞猜按钮色值`
                            }],
                            initialValue: data.rightColor || rightColor,
                          })(
                            <SketchPicker
                              width="230px"
                              color={rightColor}
                              disableAlpha
                              onChange={(e) => this.colorChange(e, 'rightColor')}
                            />
                          )}
                        </FormItem>
                      }
                    </div>
                  </div>
                </div>
                {/* 设置活动背景色，充填页面 */}
                <Reminder type='popupImg' style={{ borderTop: 'none' }} />
                <div className={`${styles.sketchPicker} ${styles.f_1}`}>
                  <div style={{ marginRight: 20 }}>
                    背景填充颜色值:
                    </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} className={styles.edit_form_pre} onClick={() => { this.showColor('visibleBackgroundColor', visibleBackgroundColor) }}>
                      <div style={{ background: backgroundColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visibleBackgroundColor &&
                      <FormItem style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}>
                        {getFieldDecorator('backgroundColor', {
                          rules: [{
                            required: true, message: `${formatMessage({ id: 'form.input' })}背景填充色值`
                          }],
                          initialValue: data.backgroundColor || backgroundColor,
                        })(
                          <SketchPicker
                            width="230px"
                            color={backgroundColor}
                            disableAlpha
                            onChange={(e) => this.colorChange(e, 'backgroundColor')}
                          />
                        )}
                      </FormItem>
                    }
                  </div>
                </div>
              </TabPane>
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} isActive={parseInt(currTab, 10) === 2} />} key="2">
                <Reminder type='rulesImg' style={{ borderTop: 'none' }} />
                <div style={{ display: "flex" }}>
                  <div>
                    {/* 活动规则 */}
                    <Content
                      sizeText='140*66px'
                      imgBoxStyle={{ height: 540, width: 250 }}
                    >
                      <FormItem>
                        {getFieldDecorator('ruleButtonImg', {
                          rules: [{ required: true, message: '请上传活动规则' }],
                          initialValue: data.ruleButtonImg || ImgObj.ruleButtonImg,
                        })(<UploadImg onChange={this.imgChang} />)}
                      </FormItem>
                    </Content>
                  </div>
                  <div>
                    {/* 我的战绩 */}
                    <Content
                      sizeText='136*56px'
                      imgBoxStyle={{ height: 540, width: 250 }}
                    >
                      <FormItem>
                        {getFieldDecorator('myRecord', {
                          rules: [{ required: true, message: '请上传我的战绩' }],
                          initialValue: data.myRecord || ImgObj.myRecord,
                        })(<UploadImg onChange={this.imgChang} />)}
                      </FormItem>
                    </Content>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div>
                    {/* 好友分享 */}
                    <Content
                      sizeText='270*56px'
                      imgBoxStyle={{ height: 540, width: 250 }}
                    >
                      <FormItem>
                        {getFieldDecorator('shareFriend', {
                          rules: [{ required: true, message: '请上传好友分享' }],
                          initialValue: data.shareFriend || ImgObj.shareFriend,
                        })(<UploadImg onChange={this.imgChang} />)}
                      </FormItem>
                    </Content>
                  </div>
                  <div>
                    {/* 我的红包 */}
                    <Content
                      sizeText='136*54px'
                      imgBoxStyle={{ height: 540, width: 250 }}
                    >
                      <FormItem>
                        {getFieldDecorator('prizeButtonImg', {
                          rules: [{ required: true, message: '请上传我的红包' }],
                          initialValue: data.prizeButtonImg || ImgObj.awardImg,
                        })(<UploadImg onChange={this.imgChang} />)}
                      </FormItem>
                    </Content>
                  </div>
                </div>
                {/* 按钮填充色值 */}
                <Reminder type='kLineSchoolImg' style={{ borderTop: 'none' }} />
                <div className={styles.sketchPicker}>
                  <div style={{ marginRight: 20 }}>
                    按钮填充色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div
                      style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }}
                      className={styles.edit_form_pre}
                      onClick={() => { this.showColor('visibleButtonColor', visibleButtonColor) }}
                    >
                      <div style={{ background: buttonColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visibleButtonColor &&
                      <FormItem style={{ position: 'absolute', top: -30, left: 200, zIndex: 999 }}>
                        {getFieldDecorator('buttonColor', {
                          rules: [{
                            required: true, message: `请选择按钮填充色值`
                          }],
                          initialValue: data.buttonColor || buttonColor,
                        })(
                          <SketchPicker
                            width="230px"
                            color={buttonColor}
                            disableAlpha
                            onChange={(e) => this.colorChange(e, 'buttonColor')}
                          />
                        )}
                      </FormItem>
                    }
                  </div>
                </div>
              </TabPane>
              <TabPane tab="底部图" key="3">
                {/* 底部图片 */}
                <Reminder type='background' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='宽度750px，高度不限'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator('bottomImg', {
                      initialValue: data.bottomImg || ImgObj.bottomImg,
                    })(<UploadImg onChange={this.imgChang} />)}
                  </FormItem>
                </Content>
                <Reminder type='link' style={{ borderTop: 'none' }} />
                <FormItem label='链接' {...this.formLayout}>
                  {getFieldDecorator('link', {
                    initialValue: data.link,
                  })(<Input
                    placeholder={`底部图跳转链接`}
                  />)}
                </FormItem>
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </GridContent>
    );
  }
}

export default StyleModal;

const Reminder = ({ type, msg = '', style = {} }) => {
  let text = msg
  switch (type) {
    case 'backgroundColor': text = '设置首页上方奖池背景图'; break;
    case 'popupTextColor': text = '设置基金色值'; break;
    case 'popupImg': text = '设置活动背景色，充填页面除首页图以外的背景区域'; break;
    case 'rulesImg': text = '首页上方活动规则按钮、我的战绩按钮、分享按钮、我的奖品按钮、图片大小建议不大于1M'; break;
    case 'kLineSchoolImg': text = '设置页面其它验收按钮，包括邀请升级奖池按钮、分享好友、再次竞猜、我的奖品、返回首页按钮等'; break;
    case 'background': text = '（选填）页面底部使用的图片，将衔接在页面最底部'; break;
    case 'link': text = '（选填）页面底部跳转链接'; break;
    // -----
    case 'buttonColor': text = '设置弹框确定按钮的底色，按钮文字固定白色，建议设置深色色值'; break;

    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}


const Content = (props) => {
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

const TabName = ({ name, errorFormList, requiredList, isActive }) => {
  let isError = false;
  if (errorFormList.length && requiredList.length) {
    requiredList.forEach(item => {
      if (!isError) {
        isError = errorFormList.includes(item)
      }
    })
  }
  if (isActive) isError = false
  const style = isError ? { color: '#f5222d' } : {}
  return (
    <div style={style} className={styles.edit_acitve_tab}>
      {name} {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
    </div>
  )
}

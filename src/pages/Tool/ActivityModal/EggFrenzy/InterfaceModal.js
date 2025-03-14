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
const { activityTemplateObj } = serviceObj;

const ImgObj = {
  backgroundImg: `${activityTemplateObj}zajindan/backgroundImg.png`,
  introductionImg: `${activityTemplateObj}zajindan/introductionImg.png`,
  palletImg: `${activityTemplateObj}zajindan/palletImg.png`,
  prizeButton: `${activityTemplateObj}zajindan/prizeButton.png`,
  ruleButton: `${activityTemplateObj}zajindan/ruleButton.png`,
};

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
      // visibleHomeBgColor:false,
      // visibleGameBgColor:false,
      visibleThemeColor: false,
      buttonColor:
        // eslint-disable-next-line no-nested-ternary
        props.data && props.data.buttonColor
          ? props.data.buttonColor.indexOf( '#' ) != -1
            ? props.data.buttonColor
            : `#${props.data.buttonColor}`
          : '#93110f',
      backgroundColor:
        // eslint-disable-next-line no-nested-ternary
        props.data && props.data.backgroundColor
          ? props.data.backgroundColor.indexOf( '#' ) != -1
            ? props.data.backgroundColor
            : `#${props.data.backgroundColor}`
          : '#93110f',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    this.props.onRef( this );
  }

  getHaveError = () => {
    let errorFormList = [];
    const { form } = this.props;
    let haveError = false;
    form.validateFields( err => {
      if ( err ) {
        haveError = true;
        errorFormList = Object.keys( err );
      }
    } );
    this.setState( { errorFormList } );
    return haveError;
  };

  // 拿去表单中数据
  getValues = () => {
    const { form } = this.props;
    const { buttonColor, backgroundColor } = this.state;
    const data = form.getFieldsValue();
    const newObj = Object.assign( data, { buttonColor, backgroundColor } );
    return newObj;
  };

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data = {};
    const { form, data } = this.props;
    const { buttonColor, backgroundColor } = this.state;
    const id = data.id ? data.id : '';
    let isError = true;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false;
        message.error( '请在界面设置里面输入必填项' );
        return;
      }
      Data = id
        ? Object.assign( fieldsValue, { id, buttonColor, backgroundColor } )
        : Object.assign( fieldsValue, { buttonColor, backgroundColor } );
    } );
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview();
  };

  //  颜色变化
  colorChange = ( e, type ) => {
    const color = e.hex;
    this.setState( { [`${type}`]: color }, () => {
      this.onPreview();
    } );
  };

  changeTab = currTab => {
    const { errorFormList } = this.state;
    if ( errorFormList.length > 0 ) {
      this.getHaveError();
    }
    this.setState( { currTab } );
  };

  //  显示颜色调试器
  showColorModal = ( e, type ) => {
    this.setState(
      {
        [`${type}`]: true,
      },
      () => {
        this.onPreview();
      }
    );
  };

  //  图片切换
  imgChang = () => {
    setTimeout( () => {
      this.onPreview();
    }, 100 );
  };

  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visibleThemeColor: false,
    } );
  };

  render() {
    const {
      form: { getFieldDecorator },
      data,
    } = this.props;
    const {
      errorFormList,
      currTab,
      buttonColor,
      visibleThemeColor,
      backgroundColor,
    } = this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!visibleThemeColor} />
        <div
          style={{
            width: '100%',
            border: '1px solid #f5f5f5',
            borderRadius: 3,
            padding: '0px 15px',
          }}
        >
          <Form
            layout="horizontal"
            className={`${styles.formHeight} ${styles.settingImg}`}
            onSubmit={this.styleHandleSubmit}
          >
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane
                tab={
                  <TabName
                    name="首页Banner"
                    errorFormList={errorFormList}
                    requiredList={['introductionImg']}
                    isActive={parseInt( currTab, 10 ) === 1}
                  />
                }
                key="1"
              >
                <Reminder type="homeBanner" />
                <Content sizeText="750px*648px" imgBoxStyle={{ height: 540, width: 250 }}>
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                      rules: [{ required: true, message: '请上传顶部图片' }],
                      initialValue: data.backgroundImg || ImgObj.backgroundImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>

              <TabPane
                tab={
                  <TabName
                    name="背景图"
                    errorFormList={errorFormList}
                    requiredList={[]}
                    isActive={parseInt( currTab, 10 ) === 2}
                  />
                }
                key="2"
              >
                {/* 砸蛋区域背景图 */}
                <Reminder type="eggBgImg" />
                <Content sizeText="750px*855px" imgBoxStyle={{ height: 540, width: 250 }}>
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                      rules: [{ required: true, message: '请上传区域背景图片' }],
                      initialValue: data.introductionImg || ImgObj.introductionImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                {/* 金蛋托盘图 */}
                <Reminder type="eggTray" />
                <Content sizeText="730px*284px" imgBoxStyle={{ height: 540, width: 250 }}>
                  <FormItem>
                    {getFieldDecorator( 'palletImg', {
                      rules: [{ required: true, message: '请上传托盘图片' }],
                      initialValue: data.palletImg || ImgObj.palletImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                {/* 背景填充色 */}
                <Reminder type="bgColor" />
                <div style={{ display: 'flex', padding: '30px 0 50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>背景填充色值:</div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: -23,
                        border: '1px solid #f5f5f5',
                        padding: 10,
                        cursor: 'pointer',
                      }}
                      className={styles.edit_form_pre}
                      onClick={e => {
                        this.showColorModal( e, 'visibleThemeColor' );
                      }}
                    >
                      <div style={{ background: backgroundColor, width: 116, height: 32 }} />
                    </div>
                    {visibleThemeColor && (
                      <FormItem
                        style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}
                      >
                        {getFieldDecorator( 'backgroundColor', {
                          rules: [
                            {
                              required: true,
                              message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`,
                            },
                          ],
                          initialValue: data.backgroundColor || backgroundColor,
                        } )(
                          <SketchPicker
                            width="230px"
                            color={backgroundColor}
                            disableAlpha
                            onChange={e => this.colorChange( e, 'backgroundColor' )}
                          />
                        )}
                      </FormItem>
                    )}
                  </div>
                </div>
              </TabPane>

              <TabPane
                tab={
                  <TabName
                    name="按钮图"
                    errorFormList={errorFormList}
                    requiredList={['ruleButtonImg', 'prizeButtonImg', 'themeColor']}
                    isActive={parseInt( currTab, 10 ) === 3}
                  />
                }
                key="3"
              >
                <Reminder type="ruleButtonImg" style={{ borderTop: 'none' }} />
                <Content
                  sizeText="260px*80px"
                  imgBoxStyle={{ height: 51, width: 120, marginRight: 10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传活动规则图片' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type="prizeButtonImg" />
                <Content sizeText="260px*80px" imgBoxStyle={{ height: 540, width: 250 }}>
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请上传我的奖品图片' }],
                      initialValue: data.prizeButtonImg || ImgObj.prizeButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type="themeColor" />
                <div style={{ display: 'flex', padding: '30px 0 50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>按钮填充色值:</div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: -23,
                        border: '1px solid #f5f5f5',
                        padding: 10,
                        cursor: 'pointer',
                      }}
                      className={styles.edit_form_pre}
                      onClick={e => {
                        this.showColorModal( e, 'visibleThemeColor' );
                      }}
                    >
                      <div style={{ background: buttonColor, width: 116, height: 32 }} />
                    </div>
                    {visibleThemeColor && (
                      <FormItem
                        style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}
                      >
                        {getFieldDecorator( 'buttonColor', {
                          rules: [
                            {
                              required: true,
                              message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`,
                            },
                          ],
                          initialValue: data.buttonColor || buttonColor,
                        } )(
                          <SketchPicker
                            width="230px"
                            color={buttonColor}
                            disableAlpha
                            onChange={e => this.colorChange( e, 'buttonColor' )}
                          />
                        )}
                      </FormItem>
                    )}
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
  let text = msg;
  switch ( type ) {
    case 'homeBanner':
      text = '首页顶部使用的图片';
      break;
    case 'eggBgImg':
      text = '除banner和底部外的背景图，即砸蛋区域的背景图';
      break;
    case 'eggTray':
      text = '金蛋托盘图，建议和金蛋颜色区分';
      break;
    case 'ruleButtonImg':
      text = '活动规则按钮，图片大小建议不大于1M';
      break;
    case 'bgColor':
      text = '设置活动背景区域颜色';
      break;
    case 'prizeButtonImg':
      text = '我的奖品按钮，图片大小建议不大于1M';
      break;
    case 'themeColor':
      text = '设置弹框确定按钮的底色，按钮文字固定白色，建议设置深色色值';
      break;
    case 'bottomImg':
      text = '（选填）页面底部使用的图片，将衔接在页面的最底部';
      break;
    default:
  }
  return (
    <div className={styles.collect_edit_reminder} style={style}>
      {text}
    </div>
  );
};

const Content = props => {
  const { style = {}, sizeText } = props;
  return (
    <div style={{ display: 'flex', padding: '20px 0 0 0', ...style }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: 15,
          fontSize: 13,
          color: '#999',
          alignItems: 'center',
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
  );
};

const TabName = ( { name, errorFormList, requiredList, isActive } ) => {
  let isError = false;
  if ( errorFormList.length && requiredList.length ) {
    requiredList.forEach( item => {
      if ( !isError ) {
        isError = errorFormList.includes( item );
      }
    } );
  }
  if ( isActive ) isError = false;
  const style = isError ? { color: '#f5222d' } : {};
  return (
    <div style={style} className={styles.edit_acitve_tab}>
      {name}{' '}
      {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
    </div>
  );
};

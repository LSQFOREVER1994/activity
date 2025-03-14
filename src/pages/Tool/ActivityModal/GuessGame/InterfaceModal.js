import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from "lodash";
import { formatMessage } from 'umi/locale';
import { SketchPicker } from 'react-color';
import { Form, Icon, Tabs, message, Input, Table, Modal, Tooltip, Radio, InputNumber } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { activityTemplateObj } = serviceObj
const { TextArea } = Input;
const time = () => new Date().getTime();

const ImgObj = {
  background: `${activityTemplateObj}caizhangdie/background.png`,
  middlePartImg: `${activityTemplateObj}caizhangdie/canyu-gift.png`,
  selfBtn: `${activityTemplateObj}caizhangdie/self.png`,
  ruleButtonImg: `${activityTemplateObj}caizhangdie/rule.png`,
}

@connect()
@Form.create()
class StyleModal extends PureComponent {

  timer = null;

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayoutInput = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );

    this.state = {
      list: ( props.data.banners && props.data.banners.length ) ? props.data.banners.map( ( item, i ) => { if ( !item.prizeId ) { item.prizeId = "onWinPrize" } return ( { ...item, rowKey: time() + i } ) } ) : [],
      errorFormList: [], // 表单错误项
      currTab: 1,
      visibleBackgroundColor: false,
      visibleButtonColor: false,
      visiblePopupTextColor: false,
      backgroundColor: props.data.backgroundColor ? ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ) : '#f9f9f9',
      buttonColor: props.data && props.data.buttonColor ? ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#FF9900',
      isBannerEdit: false,
      popupValue: ""
    }
  }

  componentWillMount() { }

  componentDidMount() {
    this.props.onRef( this )
  }

  getHaveError = () => {
    let errorFormList = [];
    const { form } = this.props;
    let haveError = false;
    form.validateFields( ['prizeButtonImg', 'ruleButtonImg', 'backgroundColor', 'backgroundImg'], ( err ) => {
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
    const { list, backgroundColor, buttonColor } = this.state;
    const data = form.getFieldsValue();
    const newObj = Object.assign( data, { banners: list, backgroundColor, buttonColor } );
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data = {}
    const { form, data } = this.props;
    const { buttonColor, backgroundColor }=this.state;
    const id = data.id ? data.id : '';
    let isError = true
    form.validateFields( [], ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      }
      Data = id ? Object.assign( fieldsValue, { id, buttonColor, backgroundColor } ) : Object.assign( fieldsValue, { buttonColor, backgroundColor } );
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

  colorChange = ( e, type ) => {
    const color = e.hex;
    this.setState( {
      [`${type}`]: color
    }, () => {
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
      visiblePopupTextColor: false
    } )
  }

  // 显示新建广告banner
  showBannerModal = () => {
    this.setState( {
      isBannerEdit: true,
      prizeCurrent: undefined,
      popupValue: ''
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, prize, index ) => {
    e.stopPropagation();
    this.setState( {
      isBannerEdit: true,
      prizeCurrent: { ...prize, prizeId: !prize.prizeId ? 'onWinPrize' : prize.prizeId },
      popupValue: prize.comment || ''
    } );
  };

  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { list } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}`,
      onOk: () => {
        const newList = list.filter( item => item.rowKey !== obj.rowKey );
        this.setState( { list: new Array( ...newList ) }, () => {
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  // banner弹出框确定
  handleModalConfirm = ( e ) => {
    e.preventDefault();
    const { form, form: { getFieldsValue } } = this.props;
    const { prizeCurrent, list } = this.state;

    let newList = list;
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const data = getFieldsValue( ['img', 'enable', 'sort', 'link', 'comment', ] );

      if ( prizeCurrent ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...data } ) : item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...data, prizeType: "ALL", rowKey: time() }] )
        message.success( '添加成功' )
      };

      $this.setState( {
        isBannerEdit: false, //
        prizeCurrent: undefined,
        useInventory: '',
        popupValue: '',
        list: newList,
      }, () => {
        $this.onPreview()
      } );
    } );
  }

  handleModalCancel = () => {
    this.setState( {
      isBannerEdit: false,
    } )
  }

  popuChange = ( e ) => {
    this.setState( { popupValue: e.target.value } )
  }

  // 广告banner
  renderBannerConfig = () => {
    const { list } = this.state;
    const columns = [
      {
        title: <span>排序</span>,
        dataIndex: 'sort',
        render: sort =><span>{sort}</span>
      },
      {
        title: <span>图片</span>,
        dataIndex: 'img',
        render: img => <img src={img} alt="" style={{ width: '50px', height: '50px' }} />
      },
      {
        title: <span>状态</span>,
        dataIndex: 'enable',
        render: ( record, item ) => {
          return <span>{item.enable ? "上架" : "下架"}</span>
        }
      },
      {
        title: <span>链接</span>,
        dataIndex: 'link',
        render: link => <span>{link || ''}</span>
      },
      {
        title: <span>备注</span>,
        dataIndex: 'comment',
        render: comment => <span>{comment || ''}</span>
      },
      {
        title: <span>操作</span>,
        dataIndex: 'edit',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, index )}
            >编辑
            </span>
            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>
          </div>
        ),
      },
    ]
    return (
      <div>
        <Reminder type='banner' style={{ borderTop: 'none' }} />
        <Table
          size="small"
          rowKey="rowKey"
          columns={columns}
          pagination={false}
          dataSource={list}
          footer={() => {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1890FF',
                cursor: 'pointer'
              }}
              onClick={this.showBannerModal}
            >
              <Icon
                type="plus-circle"
                style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
              />
              添加
            </div>
          )
        }}
        />
      </div>
    )
  }

  // banner添加弹出框
  renderBannerEditModal = () => {
    const { isBannerEdit, prizeCurrent = {}, popupValue } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleModalConfirm,
      onCancel: this.handleModalCancel,
    };
    return (
      <Modal
        maskClosable={false}
        title={`${prizeCurrent.prizeId ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
        className={styles.standardListForm}
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={isBannerEdit}
        {...modalFooter}
      >
        <div>
          <Form className={styles.formHeight} onSubmit={this.handleModalConfirm}>
            <div style={{ display: 'flex', padding: '0px 0px 20px 70px', alignItems: 'center' }}>
              <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 10, color: '#333' }} className={styles.edit_form_pre}>
                  <span style={{ color: 'red', marginRight: 5 }}>*</span>图片:
                </div>
                <FormItem style={{ marginBottom: 0, paddingLeft: 80 }}>
                  {getFieldDecorator( 'img', {
                  rules: [{ required: true, message: '请上传图片' }],
                  initialValue: prizeCurrent.img
                } )( <UploadImg onChange={this.imgChang} /> )}
                </FormItem>
                <div style={{ fontSize: 13, color: '#999', position: 'absolute', top: '20px', right: '160px' }}>
                  格式：jpg/jpeg/png
                  <br />
                  建议尺寸：700px*200px
                  <br />
                  建议大小：不超过1M
                </div>
              </div>
            </div>
            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'enable', {
              rules: [{ required: true, message: `状态不能为空！` }],
              initialValue: prizeCurrent.enable !== undefined ? prizeCurrent.enable : true,
            } )(
              <Radio.Group>
                <Radio value>上架</Radio>
                <Radio value={false}>下架</Radio>
              </Radio.Group>
            )}
            </FormItem>
            <FormItem
              label={
                <span>
                  排序值
                  <Tooltip title="数值越小越靠前">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
          }
              {...this.formLayout}
            >
              {getFieldDecorator( 'sort', {
              rules: [{ required: true, message: `排序值不能为空！` }],
              initialValue: prizeCurrent.sort,
            } )( <InputNumber min={1} /> )}
            </FormItem>
            <FormItem
              label={
                <span>
                  链接
                  <Tooltip title="点击该图片可跳转动作,不填为纯展示">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
            }
              {...this.formLayout}
            >
              {getFieldDecorator( 'link', {
              initialValue: prizeCurrent.link,
            } )( <Input placeholder="请输入链接" /> )}
            </FormItem>
            <FormItem label='备注' {...this.formLayout}>
              {getFieldDecorator( 'comment', {
              initialValue: prizeCurrent.comment,
            } )( <TextArea
              rows={2}
              placeholder="请输入备注"
              onChange={this.popuChange}
              maxLength={20}
            /> )}
              <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{popupValue.length}/20</span>
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor,
      visibleBackgroundColor, visibleButtonColor, visiblePopupTextColor
    } = this.state;
    const currentId = data && data.id;

    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleButtonColor || visiblePopupTextColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane
                tab={( <TabName
                  name='首页图'
                  errorFormList={errorFormList}
                  requiredList={['backgroundColor', 'backgroundImg', 'clickButtonImg']}
                  isActive={parseInt( currTab, 10 ) === 1}
                /> )}
                key="1"
              >
                <Reminder type='background' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='宽度750px，高度不限'
                  imgBoxStyle={{ width: 250, marginRight: 20 }}
                  style={{ padding: '20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                      rules: [{ required: true, message: '请选择顶部所使用的图片' }],
                      initialValue: data.backgroundImg || ImgObj.background,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>

              <TabPane tab={<TabName name='背景图' errorFormList={errorFormList} requiredList={['bucketImg']} isActive={parseInt( currTab, 10 ) === 2} />} key="2">
                {/* 背景填充色值 */}
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
                {/* 中间部分页面 */}
                <Reminder type='middlePartImg' />
                <Content
                  sizeText='700px*300px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                      // rules: [{ required: true, message: ' ' }],
                      initialValue: currentId ? data.introductionImg : ( data.introductionImg || ImgObj.middlePartImg ),
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                {/* 底部活动二维码 */}
                <Reminder type='qrCode' />
                <Content
                  sizeText='180px*180px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'qrCode', {
                      // rules: [{ required: true, message: ' ' }],
                      initialValue: data.qrCode,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['bucketImg']} />} key="3">
                {/* 活动规则按钮 */}
                <Reminder type='rulesImg' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='80px*74px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请选择活动规则按钮' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButtonImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                {/* 我的按钮 */}
                <Reminder type='selfImg' />
                <Content
                  sizeText='80px*74px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请选择活动规则按钮' }],
                      initialValue: data.prizeButtonImg || ImgObj.selfBtn,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>

              <TabPane tab="广告banner" key="4">
                {this.renderBannerConfig()}
              </TabPane>

              <TabPane tab='底部图' key="5" requiredList={['bottomImg']}>
                {/* 底部填充色值 */}
                <Reminder type='bottomImg' style={{ borderTop: 'none' }} />
                <Content
                  sizeText='700px*180px'
                  imgBoxStyle={{ width: 250, marginRight: 20 }}
                  style={{ padding: '20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'bottomImg', {
                      initialValue: data.bottomImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
            </Tabs>
          </Form>
        </div>
        {/* 弹出框 */}
        {this.renderBannerEditModal()}
      </GridContent>
    );
  }
}

export default StyleModal;

const Reminder = ( { type, msg = '', style = {} } ) => {
  let text = msg
  switch ( type ) {
    case 'bottomImg': text = '（选填）页面底部使用的图片，将衔接在页面最底部'; break;
    case 'background': text = '首页、落地页、注册页、分享图顶部所使用的图片'; break;
    case 'backgroundColor': text = '设置页面背景色，填充首页除图片外的区域'; break;
    case 'middlePartImg': text = '（选填）落地页、分享图的中间部分，用于介绍活动流程、奖品等'; break;
    case 'qrCode': text = '（选填）分享底部图片的活动二维码'; break;
    case 'rulesImg': text = '首页右上角活动规则按钮'; break;
    case 'selfImg': text = '首页右上角我的按钮'; break;
    case 'banner': text = '（选填）排行榜下方的广告banner，多图自动轮播'; break;
    // ------


    case 'buttonColor': text = '设置弹框确定按钮的底色，按钮文字固定白色，建议设置深色色值'; break;

    case 'kLineSchoolImg': text = 'k线学堂按钮'; break;
    case 'prizeImg': text = '我的奖品按钮'; break;
    case 'clickButtonImg': text = '抽签触发按钮，固定悬停在页面下方'; break;
    case 'bucketImg': text = '设置签筒图片，摇签时签筒会左右晃动'; break;
    case 'popupImg': text = '设置抽签结果弹窗'; break;
    // case 'popupTextColor': text = '弹窗内文案色值'; break;
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

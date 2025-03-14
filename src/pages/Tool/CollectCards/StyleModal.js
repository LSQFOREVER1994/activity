import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { SketchPicker } from 'react-color';
import serviceObj from '@/services/serviceObj';
import { Form, Icon, Tabs } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';


const FormItem = Form.Item;
const { activityTemplateObj } = serviceObj
const { TabPane } = Tabs;

const ImgObj ={
  head:`${activityTemplateObj}/jika/introductionImg.png`,
  background:`${activityTemplateObj}/jika/backgroundImg.png`,
  ruleButton:`${activityTemplateObj}/jika/ruleButtonImg.png`,
  card:`${activityTemplateObj}/jika/cardImg.png`,
  bottom:`${activityTemplateObj}/jika/bottomImg.png`,
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
      visibleButtonColor: false,
      buttonColor:props.data.buttonColor ? ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#FF9900'
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

  // 拿取子组件
  onRef = ( ref ) => {
    this.child = ref;
  }

  getValues = () => {
    const { form } = this.props;
    const{ buttonColor,  } = this.state;
    const data = form.getFieldsValue()
    const newObj = Object.assign( data, { buttonColor, } );
    return newObj
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const id = data.id ? data.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      
      Data = id ? Object.assign( fieldsValue, { id } ) : fieldsValue;
    } );
    return Data
  };

  onPreview = () => {
    this.props.onPreview()
  }

  buttonColorChange = ( e ) =>{
    const color = e.hex;
    this.setState( { buttonColor: color }, ()=>{
      this.onPreview();
    } )
  }

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }


  showButtonColor = ( e ) => {
    e.stopPropagation()
    const { visibleButtonColor } = this.state;
    this.setState( {
      visibleButtonColor: !visibleButtonColor
    }, () => {
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
      visibleButtonColor: false,
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, buttonColor, visibleButtonColor
    }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!visibleButtonColor} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={styles.formHeight} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页Banner' errorFormList={errorFormList} requiredList={['introductionImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='banner' />
                <Content
                  sizeText='宽度750px，高度不限' 
                  imgBoxStyle={{  width: 250, marginRight:20 }}
                  style={{ padding:'40px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                        rules: [{ required: true, message: ' ' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              <TabPane tab={<TabName name='背景图' errorFormList={errorFormList} requiredList={['backgroundImg']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='background' />
                <Content
                  sizeText='750px*1620px，若页面超长，将使用背景图进行规则填充'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                        rules: [{ required: true, message: ' ' }],
                        initialValue: data.backgroundImg || ImgObj.background, 
                      } )( <UploadImg onChange={this.imgChang} />  )}
                  </FormItem>
                </Content>
              </TabPane>
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
                <Reminder type='rule' />
                <Content
                  sizeText='150px*62px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: ' ' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                <Reminder type='buttonColor' style={{ borderTop:'1px dashed #999' }} />

                <div style={{ display: 'flex', padding: '50px 0', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    按钮填充色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, border: '1px solid #f5f5f5', padding: 10, cursor: 'pointer' }} onClick={( e ) => { this.showButtonColor( e ) }}>
                      <div style={{ background: buttonColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visibleButtonColor &&
                      <FormItem
                        style={{ position: 'absolute', bottom: -70, left: 200, zIndex: 999 }}
                      >
                        {getFieldDecorator( 'buttonColor', {
                          rules: [{
                            required: true, message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`
                          }],
                          initialValue: data.buttonColor || buttonColor,
                        } )(
                          <SketchPicker
                            width="230px"
                            disableAlpha
                            color={buttonColor}
                            onChange={this.buttonColorChange}
                          />
                        )}
                      </FormItem>
                    }

                  </div>
                </div>
              </TabPane>
              <TabPane tab={<TabName name='卡片背景图' errorFormList={errorFormList} requiredList={['cardImg']} isActive={parseInt( currTab, 10 ) === 4} />} key="4">
                <Reminder type='card' />
                <Content
                  sizeText='600px*830px'
                  imgBoxStyle={{ height: 275, width: 200 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'cardImg', {
                      rules: [{ required: true, message: ' ' }],
                      initialValue: data.cardImg || ImgObj.card,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              <TabPane tab='底部图' key="5">
                <Reminder type='bottom' />
                <Content
                  sizeText='宽度为750px，高度不限'
                  imgBoxStyle={{ height: 275, width: 200 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'bottomImg', {
                      // rules: [{ required: true, message: ' ' }],
                      initialValue: data.bottomImg || ImgObj.bottom,
                    } )( <UploadImg onChange={this.imgChang} />  )}
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
    case 'background': text = '首页除Banner外的背景区域'; break;
    case 'rule': text = '首页右上角活动规则按钮'; break;
    case 'buttonColor': text = '设置页面其他所有按钮颜色，包括抽卡按钮、好友助力按钮、任务完成按钮、弹窗确定按钮等'; break;
    case 'card': text = '翻牌前状态，即所抽卡牌的背面图'; break;
    case 'bottom': text = '（选填，页面底部使用的图片，将衔接在页面的最底部）'; break;
    default:
  }
  return <div className={styles.collect_edit_reminder} style={style}>{text}</div>
}

const Content = ( props ) => {
  const { style = {},  sizeText,  } = props;
  return (
    <div style={{ display: "flex", padding: '10px 0', ...style }}>
      {/* <div style={{ padding: 10, border: '1px solid #f5f5f5', ...imgBoxStyle }}>
        <img
          src={imgSrc}
          alt='' 
          style={{ maxWidth: '100%', maxHeight:'100%', margin:'0 auto', display:'block' }}
        />
      </div> */}
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
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
  head:`${activityTemplateObj}hongbaoyu/introductionImg.png`,
  buttonImg:`${activityTemplateObj}hongbaoyu/buttonImg.png`,
  redPacketImg:`${activityTemplateObj}hongbaoyu/redPacketImg.png`,
  ruleButton:`${activityTemplateObj}hongbaoyu/ruleButtonImg.png`,
  prizeButtonImg:`${activityTemplateObj}hongbaoyu/prizeButtonImg.png`
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
      visibleHomeBgColor:false,
      visibleGameBgColor:false,
      visibleThemeColor:false,

      homeBgColor:props.data &&props.data.homeBgColor ?  ( props.data.homeBgColor.indexOf( '#' ) != -1 ? props.data.homeBgColor : `#${props.data.homeBgColor}` ): '#93110f',
      gameBgColor: props.data && props.data.gameBgColor ?  ( props.data.gameBgColor.indexOf( '#' ) != -1 ? props.data.gameBgColor : `#${props.data.gameBgColor}` ) : '#8C171F',
      themeColor: props.data && props.data.themeColor ?  ( props.data.themeColor.indexOf( '#' ) != -1 ? props.data.themeColor : `#${props.data.themeColor}` ) : '#ffc36d',
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
    const { homeBgColor, gameBgColor, themeColor }=this.state
    const data = form.getFieldsValue();
    const newObj =  Object.assign( data, { homeBgColor, gameBgColor, themeColor } );
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const { homeBgColor, gameBgColor, themeColor }=this.state
    const id = data.id ? data.id : '';
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      } 
      Data = id ? Object.assign( fieldsValue, { id, gameBgColor, homeBgColor, themeColor } ) : Object.assign( fieldsValue, { gameBgColor, homeBgColor, themeColor } );
    } );
    return isError && Data;
  };

  onPreview = () => {
    this.props.onPreview()
  }


  //  颜色变化
  colorChange =( e, type )=>{
    const color = e.hex;
    this.setState( { [`${type}`]: color }, ()=>{
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

  //  显示颜色调试器
  showColorModal = ( e, type ) =>{
    this.setState( {
      [`${type}`]:true
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
  
  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visibleHomeBgColor:false,
      visibleGameBgColor:false,
      visibleThemeColor:false
    } )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, homeBgColor, gameBgColor, themeColor, visibleHomeBgColor, visibleGameBgColor, visibleThemeColor
    }= this.state;
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleHomeBgColor || visibleGameBgColor || visibleThemeColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页' errorFormList={errorFormList} requiredList={['homeBgColor', 'introductionImg', 'buttonImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                
                <Reminder type='homeBgColor' style={{ borderTop:'none' }} />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    首页背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showColorModal( e, 'visibleHomeBgColor' )}}>
                      <div style={{ background:homeBgColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleHomeBgColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'homeBgColor', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值` }],
                            initialValue: data.homeBgColor|| homeBgColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              color={homeBgColor}
                              disableAlpha
                              onChange={( e )=>this.colorChange( e, 'homeBgColor' )}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
                
                <Reminder type='banner' />
                <Content
                  sizeText='宽度750px，高度小于1334px' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                        rules: [{ required: true, message: '请上传活动bannner图片' }],
                        initialValue: data.introductionImg || ImgObj.head,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='buttonImg' />
                <Content
                  sizeText='230px*230px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'buttonImg', {
                        rules: [{ required: true, message: '请上传开始按钮图片' }],
                        initialValue: data.buttonImg || ImgObj.buttonImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              
              <TabPane tab={<TabName name='游戏页' errorFormList={errorFormList} requiredList={['gameBgColor', 'redPacketImg']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
                <Reminder type='gameBgColor' style={{ borderTop:'none' }} />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    游戏背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer' }} className={styles.edit_form_pre} onClick={( e )=>{this.showColorModal( e, 'visibleGameBgColor' )}}>
                      <div style={{ background:gameBgColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleGameBgColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'gameBgColor', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值` }],
                            initialValue: data.gameBgColor|| gameBgColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              color={gameBgColor}
                              disableAlpha
                              onChange={( e )=>this.colorChange( e, 'gameBgColor' )}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
                
                <Reminder type='redPacketImg' />
                <Content
                  sizeText='180px*180px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'redPacketImg', {
                        rules: [{ required: true, message: '请上传红包图片' }],
                        initialValue: data.redPacketImg || ImgObj.redPacketImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
             
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={[ 'ruleButtonImg', 'prizeButtonImg', 'themeColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">

                <Reminder type='ruleButtonImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='220px*54px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                      rules: [{ required: true, message: '请上传活动规则图片' }],
                      initialValue: data.ruleButtonImg || ImgObj.ruleButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='prizeButtonImg' />
                <Content
                  sizeText='112px*112px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                        rules: [{ required: true, message: '请上传我的奖品图片' }],
                        initialValue: data.prizeButtonImg || ImgObj.prizeButtonImg, 
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='themeColor' />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    主题颜色填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative'  }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer'  }} className={styles.edit_form_pre} onClick={( e )=>{this.showColorModal( e, 'visibleThemeColor' )}}>
                      <div style={{ background:themeColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleThemeColor &&
                      <FormItem
                        style={{ position:'absolute', bottom:-60, left:200, zIndex:999 }}
                      >
                        {getFieldDecorator( 'themeColor', {
                        rules: [{
                          required: true, message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`
                        }],
                        initialValue: data.themeColor || themeColor,
                      } )(
                        <SketchPicker
                          width="230px"
                          color={themeColor}
                          disableAlpha
                          onChange={( e )=>this.colorChange( e, 'themeColor' )}
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

const Reminder = ( { type, msg = '', style={} } ) =>{
  let text = msg
  switch ( type ) {
    case 'homeBgColor': text = '首页背景色，填充首页元素图未铺满的地方（主要用于适配大屏）'; break;
    case 'banner': text = '首页元素图，位于页面居中的位置，未铺满的位置使用背景色填充'; break;
    case 'buttonImg': text = '开始按钮'; break;
    case 'gameBgColor': text = '游戏页背景填充，活动开始后的背景颜色，纯色的背景'; break;
    case 'redPacketImg': text = '红包图片（设置一张红包元素图片）'; break;
    case 'ruleButtonImg': text = '右上角活动规则按钮'; break;
    case 'prizeButtonImg': text = '我的奖品'; break;
    case 'themeColor': text = '主题颜色，设置弹窗“确定”按钮、活动倒计时、抢到红包个数的颜色等'; break;
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
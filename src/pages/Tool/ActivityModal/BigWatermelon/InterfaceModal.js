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
  backgroundImg:`${activityTemplateObj}daxigua/backgroundImg.png`,
  startGameButton:`${activityTemplateObj}daxigua/startGameButton.png`,
  integralImg:`${activityTemplateObj}daxigua/integralImg.png`,
  gameBackgroundImg:`${activityTemplateObj}daxigua/gameBackgroundImg.png`,
  gameBottomImg: `${activityTemplateObj}daxigua/backgroundBottomImg.png`,
  scoreFrameImg:`${activityTemplateObj}daxigua/scoreFrameImg.png`,
  stopGameButton:`${activityTemplateObj}daxigua/stopGameButton.png`,
  elementImg0:`${activityTemplateObj}daxigua/elementImg0.png`,
  elementImg1:`${activityTemplateObj}daxigua/elementImg1.png`,
  elementImg2:`${activityTemplateObj}daxigua/elementImg2.png`,
  elementImg3:`${activityTemplateObj}daxigua/elementImg3.png`,
  elementImg4:`${activityTemplateObj}daxigua/elementImg4.png`,
  elementImg5:`${activityTemplateObj}daxigua/elementImg5.png`,
  elementImg6:`${activityTemplateObj}daxigua/elementImg6.png`,
  elementImg7:`${activityTemplateObj}daxigua/elementImg7.png`,
  elementImg8:`${activityTemplateObj}daxigua/elementImg8.png`,
  elementImg9:`${activityTemplateObj}daxigua/elementImg9.png`,
  elementImg10:`${activityTemplateObj}daxigua/elementImg10.png`,
  ruleButtonImg:`${activityTemplateObj}daxigua/ruleButtonImg.png`,
  prizeButtonImg:`${activityTemplateObj}daxigua/prizeButtonImg.png`,
  rankButton:`${activityTemplateObj}daxigua/rankButton.png`,
  backButton:`${activityTemplateObj}daxigua/backButton.png`,
  restartButton:`${activityTemplateObj}daxigua/restartButton.png`,
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
      visibleBackgroundColor: false,
      visibleGameBackgroundColor: false,
      visibleButtonColor: false,
      // elementsImg: [], // 合成图标固定11张
      backgroundColor: props.data.backgroundColor ?  ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ): '#e74435',
      buttonColor: props.data && props.data.buttonColor ?  ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#FF9900',
      gameBackgroundColor: props.data.gameBackgroundColor ?  ( props.data.gameBackgroundColor.indexOf( '#' ) != -1 ? props.data.gameBackgroundColor : `#${props.data.gameBackgroundColor}` ): '#e74435',
    }
  }


  componentDidMount() {
    this.props.onRef( this );
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
    const { backgroundColor, buttonColor, gameBackgroundColor }=this.state;
    const data = form.getFieldsValue();
    const elementsImg = [];
    for( let i=0; i<11; i+=1 ) {
      elementsImg[i] = data[`elementsImg${i}`];
      delete data[`elementsImg${i}`];
    }
    data.elementsImg = elementsImg;
    const newObj =  Object.assign( data, { backgroundColor, buttonColor, gameBackgroundColor } );
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form } = this.props;
    let isError = true;
    form.validateFields( ( err ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      } 
      Data = this.getValues();
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
      visibleGameBackgroundColor: false,
      visibleButtonColor: false,
    } )
  }

  renderElementsImg = () => {
    const imgArr = [];
    const { form: { getFieldDecorator }, data } = this.props;
    for ( let i = 0; i< 11; i+=1 ) {
      imgArr.push(
        <FormItem key={`elementImg${i}`}>
          {
            getFieldDecorator( `elementsImg${i}`, {
              rules: [{ required: true, message: '请上传合成元素图标' }],
              initialValue: data.elementsImg && data.elementsImg[i] || ImgObj[`elementImg${i}`],
            } )( <UploadImg onChange={this.imgChang} /> )
          }
        </FormItem>
      )
    }
    return imgArr;
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, backgroundColor, buttonColor,
      visibleBackgroundColor, visibleGameBackgroundColor,  
      visibleButtonColor, gameBackgroundColor
    }= this.state;
    
    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleBackgroundColor || visibleGameBackgroundColor || visibleButtonColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页图' errorFormList={errorFormList} requiredList={['backgroundImg', 'backgroundColor', 'startGameButton', 'integralImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
                <Reminder type='backgroundImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='750*1632px 位深度为8' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                        rules: [{ required: true, message: '请上传首页使用的背景区域图片' }],
                        initialValue: data.backgroundImg || ImgObj.backgroundImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='backgroundColor' />
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

                <Reminder type='startGameButton' />
                <Content
                  sizeText='444*189px' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'startGameButton', {
                        rules: [{ required: true, message: '请上传开始游戏按钮图片' }],
                        initialValue: data.startGameButton || ImgObj.startGameButton,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='integralImg' />
                <Content
                  sizeText='76*76px' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'integralImg', {
                        rules: [{ required: true, message: '请上传积分图标' }],
                        initialValue: data.integralImg || ImgObj.integralImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
              </TabPane>
              
              <TabPane 
                tab={<TabName
                  name='游戏界面图'
                  errorFormList={errorFormList}
                  requiredList={['gameBackgroundImg', 'gameBackgroundColor', 'scoreFrameImg', 'stopGameButton', 'elementsImg']}
                  isActive={parseInt( currTab, 10 ) === 2}
                />}
                key="2"
              >
                <Reminder type='gameBackgroundImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='750*1334px' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'gameBackgroundImg', {
                        rules: [{ required: true, message: '请上传游戏界面背景区域图片' }],
                        initialValue: data.gameBackgroundImg || ImgObj.gameBackgroundImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='gameBottomImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='750*126px' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'gameBottomImg', {
                        rules: [{ required: true, message: '请上传游戏界面背景区域底部图片' }],
                        initialValue: data.gameBottomImg || ImgObj.gameBottomImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                
                <Reminder type='gameBackgroundColor' />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, padding:10, cursor:'pointer', border: '1px solid #f5f5f5' }} className={styles.edit_form_pre} onClick={()=>{this.showButtonColor( 'visibleGameBackgroundColor' )}}>
                      <div style={{ background:gameBackgroundColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleGameBackgroundColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'gameBackgroundColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.gameBackgroundColor|| gameBackgroundColor,
                          } )( 
                            <SketchPicker
                              width="230px"
                              color={gameBackgroundColor}
                              disableAlpha
                              onChange={( e )=>this.buttonColorChange( e, 'gameBackgroundColor' )}
                            />
                          )}
                        </FormItem>
                      }
                  </div>
                </div>
                
                <Reminder type='scoreFrameImg' />
                <Content
                  sizeText='242*90px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'scoreFrameImg', {
                        rules: [{ required: true, message: '请上传分数显示框图片' }],
                        initialValue: data.scoreFrameImg || ImgObj.scoreFrameImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='stopGameButton' />
                <Content
                  sizeText='76*76px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'stopGameButton', {
                        rules: [{ required: true, message: '请上传关闭游戏按钮图片' }],
                        initialValue: data.stopGameButton || ImgObj.stopGameButton,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='elementsImg' />
                <Content
                  sizeText=''
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  {
                    this.renderElementsImg()
                  }
                </Content>
              </TabPane>
             
              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['ruleButtonImg', 'rankButton', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
                <Reminder type='ruleButtonImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='140*56px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'ruleButtonImg', {
                        rules: [{ required: true, message: '请上传首页右上角规则按钮图片' }],
                        initialValue: data.ruleButtonImg || ImgObj.ruleButtonImg, 
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='prizeButtonImg' />
                <Content
                  sizeText='140*56px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeButtonImg', {
                      rules: [{ required: true, message: '请上传首页右上角我的奖品按钮图片' }],
                      initialValue: data.prizeButtonImg || ImgObj.prizeButtonImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='rankButton' />
                <Content
                  sizeText='140*56px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'rankButton', {
                      rules: [{ required: true, message: '请上传首页右上角排行榜按钮图片' }],
                      initialValue: data.rankButton || ImgObj.rankButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='backButton' />
                <Content
                  sizeText='76*76px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backButton', {
                      rules: [{ required: true, message: '请上传结算页返回首页按钮图片' }],
                      initialValue: data.backButton || ImgObj.backButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='restartButton' />
                <Content
                  sizeText='76*76px'
                  imgBoxStyle={{ height: 51, width: 120, marginRight:10 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'restartButton', {
                      rules: [{ required: true, message: '请上传结算页重新开始按钮图片' }],
                      initialValue: data.restartButton || ImgObj.restartButton,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                <Reminder type='buttonColor' />
                <div style={{ display:'flex', padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative' }}>
                    <div style={{ position:'absolute', top:-23, padding:10, cursor:'pointer', border: '1px solid #f5f5f5' }} className={styles.edit_form_pre} onClick={()=>{this.showButtonColor( 'visibleButtonColor' )}}>
                      <div style={{ background:buttonColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleButtonColor && 
                        <FormItem
                          style={{ position:'absolute', top:-30, left:200, zIndex:999 }}
                        >
                          {getFieldDecorator( 'buttonColor', {
                            rules: [{ 
                              required: true, message: `${formatMessage( { id: 'form.input' } )}背景填充色值`
                            }],
                            initialValue: data.buttonColor|| buttonColor,
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

              {/* <TabPane tab='底部图' key="4">
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
              </TabPane> */}

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
    case 'backgroundImg': text = '首页使用背景的区域'; break;
    case 'backgroundColor': text = '设置首页图片以外的填充区域'; break;
    case 'startGameButton': text = '开始游戏按钮'; break;
    case 'integralImg': text = '积分图标'; break;
    case 'gameBackgroundImg': text = '游戏界面使用的背景区域'; break;
    case 'gameBottomImg': text ='游戏界面使用的背景区域底部图'; break;
    case 'gameBackgroundColor': text = '设置游戏以外的填充区域'; break;
    case 'scoreFrameImg': text = '分数显示框'; break;
    case 'stopGameButton': text = '关闭游戏按钮'; break;
    case 'elementsImg': text = '合成游戏图标（由小到大依次上传，固定11张）'; break;
    case 'ruleButtonImg': text = '首页右上角活动规则按钮'; break;
    case 'prizeButtonImg': text = '首页右上角我的奖品按钮'; break;
    case 'rankButton': text = '首页右上角排行榜按钮'; break;
    case 'backButton': text = '结算页返回首页按钮'; break;
    case 'restartButton': text = '结算页重新开始按钮'; break;
    case 'buttonColor': text = '设置页面其他所有按钮颜色，包括任务完成，弹窗确定按钮等'; break;
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
          justifyContent: 'left',
          paddingLeft: 15,
          fontSize: 13,
          color: '#999',
          alignItems:'center',
          flexWrap: 'wrap'
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

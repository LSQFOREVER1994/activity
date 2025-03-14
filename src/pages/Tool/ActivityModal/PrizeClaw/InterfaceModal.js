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
  introductionImg:`${activityTemplateObj}zhuawawa/introductionImg.png`,
  backgroundImg:`${activityTemplateObj}zhuawawa/backgroundImg.png`,
  prizeImg1:`${activityTemplateObj}zhuawawa/prizeImg1.png`,
  prizeImg2:`${activityTemplateObj}zhuawawa/prizeImg2.png`,
  prizeImg3:`${activityTemplateObj}zhuawawa/prizeImg3.png`,
  buttonImg:`${activityTemplateObj}zhuawawa/buttonImg.png`,
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
      prizeImgList:props.data && props.data.prizeImgList && props.data.prizeImgList.length > 0 ? props.data.prizeImgList : [ImgObj.prizeImg1, ImgObj.prizeImg2, ImgObj.prizeImg3],
      errorFormList:[], // 表单错误项
      currTab:1,
      fileList:[],
      visibleButtonColor:false,
      visibleBackgroundColor:false,
      buttonColor: props.data && props.data.buttonColor ?  ( props.data.buttonColor.indexOf( '#' ) != -1 ? props.data.buttonColor : `#${props.data.buttonColor}` ) : '#a20000',
      backgroundColor:props.data && props.data.backgroundColor ?  ( props.data.backgroundColor.indexOf( '#' ) != -1 ? props.data.backgroundColor : `#${props.data.backgroundColor}` ) : '#e74435',
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
    const{ buttonColor, backgroundColor, prizeImgList }=this.state;
    const data = form.getFieldsValue();
    const newObj =  Object.assign( data, { backgroundColor, buttonColor, prizeImgList } );
    if( newObj.prizeImg )delete newObj.prizeImg
    return newObj;
  }

  // 提交：商品种类
  styleHandleSubmit = () => {
    let Data ={}
    const { form, data } = this.props;
    const{ buttonColor, backgroundColor, prizeImgList }=this.state;
    const id = data.id ? data.id : '';
    let isError = true
    // const newObj ={}
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        isError = false
        message.error( '请在界面设置里面输入必填项' )
        return;
      } 
      Data = id ? Object.assign( fieldsValue, { id, buttonColor, backgroundColor, prizeImgList } ) 
      : Object.assign( fieldsValue, { buttonColor, backgroundColor, prizeImgList } );
    } );
    if( Data.prizeImg )delete Data.prizeImg
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

  colorChange =( e, type )=>{
    const color = e.hex;
    this.setState( {
      [`${type}`]: color
    }, ()=>{
      this.onPreview()
    } )
  }

  showColor =( type, state )=>{
    this.setState( {
      [type]:!state
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
      visibleButtonColor: false,
      visibleBackgroundColor: false,
    } )
  }


  indexOf = ( val ) =>{
    const { prizeImgList } = this.state;
    // eslint-disable-next-line no-plusplus
    for ( let i = 0; i < prizeImgList.length; i++ ) {
      if ( prizeImgList[i] === val ) return i;
    }
    return -1;
  };

  // 图片删除
  prizeImgChang=( data )=>{
    const { prizeImgList } = this.state;
    const index = this.indexOf( data );
    if ( index > -1 ) {
    if( prizeImgList&&prizeImgList.length===1 ){
      this.setState( { prizeImgList:[] } )
      return
    }
      const arr = prizeImgList
      arr.splice( index, 1 );
      this.setState( { prizeImgList:new Array( ...arr ) }, ()=>this.onPreview() )
    }
  }

  // 添加图片
  addImgChang=( url )=>{
    const{ prizeImgList } = this.state;
    const newList=prizeImgList
    newList.push( url )
    this.setState( { prizeImgList: newList, fileList:[] }, ()=>this.onPreview() )
  }


  render() {
    const { form: { getFieldDecorator }, data } = this.props;
    const {
      errorFormList, currTab, buttonColor, backgroundColor, visibleButtonColor, visibleBackgroundColor, prizeImgList, fileList
    }= this.state;

    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visibleButtonColor || visibleBackgroundColor )} />
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px' }}>
          <Form layout='horizontal' className={`${styles.formHeight} ${styles.settingImg}`} onSubmit={this.styleHandleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.changeTab}>
              <TabPane tab={( <TabName name='首页banner' errorFormList={errorFormList} requiredList={['introductionImg']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">

                <Reminder type='introductionImg' />
                <Content
                  sizeText='750px*180px' 
                  imgBoxStyle={{ width: 250, marginRight:20 }}
                  style={{ padding:'20px 0 10px 0' }}
                >
                  <FormItem>
                    {getFieldDecorator( 'introductionImg', {
                        rules: [{ required: true, message: '请添加首页banner图片' }],
                        initialValue: data.introductionImg || ImgObj.introductionImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

              </TabPane>
              
              <TabPane tab={<TabName name='背景图' errorFormList={errorFormList} requiredList={['backgroundImg']} isActive={parseInt( currTab, 10 ) === 2}  />} key="2">
 
                <Reminder type='backgroundImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='750px*1154px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'backgroundImg', {
                        rules: [{ required: true, message: '请添加背景图片' }],
                        initialValue: data.backgroundImg || ImgObj.backgroundImg,
                      } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>

                    
                <Reminder type='backgroundColor'  />
                <div style={{ display:'flex',  padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    背景填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative'  }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer'  }} className={styles.edit_form_pre} onClick={()=>{this.showColor( 'visibleBackgroundColor', visibleBackgroundColor )}}>
                      <div style={{ background:backgroundColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleBackgroundColor &&
                      <FormItem style={{ position:'absolute', bottom:-70, left:200, zIndex:999 }}>
                        {getFieldDecorator( 'backgroundColor', {
                        rules: [{
                          required: true, message: `${formatMessage( { id: 'form.input' } )}按钮填充色值`
                        }],
                        initialValue: data.backgroundColor || backgroundColor,
                      } )(
                        <SketchPicker
                          width="230px"
                          color={backgroundColor}
                          disableAlpha
                          onChange={( e )=>this.colorChange( e, 'backgroundColor' )}
                        />
                       )}
                      </FormItem>
                    }
                  </div>
                </div>

              </TabPane>
             
              <TabPane tab={<TabName name='奖品图' errorFormList={errorFormList} requiredList={['prizeImg']} isActive={parseInt( currTab, 10 ) === 3} />} key="3">
                <Reminder type='prizeImg' style={{ borderTop:'none' }} />

                {
                  prizeImgList && prizeImgList.length > 0 &&
                  <div className={styles.prizeImgList}>
                    {
                      prizeImgList.map( ( item, index )=>{
                        return(
                          <UploadImg key={index} value={item} onChange={()=>this.prizeImgChang( item )} />
                        )
                      } )
                    }
                  </div>
                }
              
                <Content
                  sizeText='180px*180px'
                  imgBoxStyle={{ height: 540, width: 250 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'prizeImg', {
                        rules: [{ required: !( prizeImgList.length > 0 ), message: '请添加奖品图，最少配置一张' }],
                      } )( <UploadImg onChange={this.addImgChang} fileList={fileList} /> )}
                  </FormItem>
                </Content>

              </TabPane>

              <TabPane tab={<TabName name='按钮图' errorFormList={errorFormList} requiredList={['buttonImg', 'buttonColor']} isActive={parseInt( currTab, 10 ) === 4} />} key="4">
                
                <Reminder type='buttonImg' style={{ borderTop:'none' }} />
                <Content
                  sizeText='245px*125px'
                  imgBoxStyle={{ height: 275, width: 200 }}
                >
                  <FormItem>
                    {getFieldDecorator( 'buttonImg', {
                      rules: [{ required: true, message:'请添加按钮图' }],
                      initialValue: data.buttonImg || ImgObj.buttonImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
                  </FormItem>
                </Content>
                
                <Reminder type='buttonColor'  />
                <div style={{ display:'flex',  padding:'30px 0 50px 0', alignItems:'center' }}>
                  <div style={{ marginRight:20 }}>
                    按钮填充色值:
                  </div>
                  <div style={{  flexGrow:100, alignItems:'center', position:'relative'  }}>
                    <div style={{ position:'absolute', top:-23, border: '1px solid #f5f5f5', padding:10, cursor:'pointer'  }} className={styles.edit_form_pre} onClick={()=>{this.showColor( 'visibleButtonColor', visibleButtonColor )}}>
                      <div style={{ background:buttonColor, width:116, height:32 }} />
                    </div>
                    {
                      visibleButtonColor &&
                      <FormItem style={{ position:'absolute', bottom:-70, left:200, zIndex:999 }}>
                        {getFieldDecorator( 'buttonColor', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}按钮填充色值` }],
                        initialValue: data.buttonColor || buttonColor,
                      } )(
                        <SketchPicker
                          width="230px"
                          color={buttonColor}
                          disableAlpha
                          onChange={( e )=>this.colorChange( e, 'buttonColor' )}
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
    case 'introductionImg': text = '首页顶部使用的图片'; break;
    case 'backgroundImg': text = '设置娃娃机背景图'; break;
    case 'backgroundColor': text = '设置活动背景区域颜色'; break;
    case 'prizeImg': text = '设置奖品图，至少一张'; break;
    case 'buttonImg': text = '抓取按钮，图片大小建议不大于1M'; break;
    case 'buttonColor': text = '设置页面其他所有按钮颜色，包括活动规则、我的奖品按钮、弹窗确认按钮等'; break;
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

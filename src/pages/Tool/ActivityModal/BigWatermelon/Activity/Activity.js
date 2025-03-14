import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Icon, message, Tabs, } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../../Lists.less';
import Integral from './Components/Integral/Integral';
import Props from './Components/Props/Props';
import Prize from './Components/Prize/Prize';
import Task from './Components/Task/Task';

const FormItem = Form.Item;
const { TabPane } = Tabs;

// 活动设置模块
@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )
@Form.create()
class PrizeCom extends PureComponent {

  timer = null;
  
  formItemStyle = {
    display: 'flex',
    marginLeft: '3%'
  }

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  formLayout1 = {
    labelCol: { span: 9 },
    wrapperCol: { span: 12 },
  };


  formLayout3 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 14 },
  };


  constructor( props ) {
    super( props );
    this.state = {
      list:props.prizes && props.prizes.length ? props.prizes.map( item => ( { ...item, rowKey:item.id } ) ) : [],
      deleteIds:[0],
      errorFormList:[], // 表单错误项
      currTab:1,
      shareImg:props.data.shareImg,
      shareDescription:props.data.shareDescription,
      shareTitle:props.data.shareTitle,
      shareLink:props.data.shareLink,
    };
  }


  componentDidMount() {
    this.props.onRef( this );
  }

  onPreview = () =>{
    this.props.onPreview()
  }

  getData = () =>{
    const { list, deleteIds, shareImg, shareDescription, shareTitle, shareLink } = this.state;
    let prizeData; let integralData;let taskData; let  propsData;
    if( this.prizeRef ) prizeData = this.prizeRef.handleSubmit();
    if( this.integralRef ) integralData = this.integralRef.handleSubmit();
    if( this.taskSetRef ) {
      taskData = this.taskSetRef.handleSubmit();
      if ( !taskData ) {
        message.error( '请在任务设置中填入必填项' );
      }
    }
    if( this.propsRef ) propsData = this.propsRef.handleSubmit();
    if( ( this.prizeRef && !prizeData ) ||
        ( this.integralRef && !integralData ) ||
        ( this.taskSetRef && !taskData ) || 
        ( this.propsRef && !propsData ) ){
      return null
    }
    return { prizes: list, deleteIds, shareImg, shareDescription, shareTitle, shareLink, ...prizeData, ...propsData, ...integralData, ...taskData }
  }

  getValues = () => {
    const { list, deleteIds, shareImg, shareDescription, shareTitle, shareLink  } = this.state;
    let taskData; let integralData; let propsData; let prizeData;
    if( this.prizeRef ) prizeData = this.prizeRef.getValues();
    if( this.integralRef ) integralData = this.integralRef.getValues();
    if( this.taskSetRef ) taskData = this.taskSetRef.getValues();
    if( this.propsRef ) propsData = this.propsRef.getValues();
    return{ prizes: list, deleteIds, shareImg, shareDescription, shareTitle, shareLink, ...prizeData, ...taskData, ...integralData, ...propsData  }
  }

  // 分享图标
  shareImgChang=( value )=>{
    this.setState( {
      shareImg:value
    } )
  }

  // 分享描述
  shareDescriptionChange=( v )=>{
    this.setState( {
      shareDescription:v.target.value
    } )
  }

  // 分享标题
  shareTitleChange=( v )=>{
    this.setState( {
      shareTitle:v.target.value
    } )
  }

  // 分享链接
  shareLinkChange=( v )=>{
    this.setState( {
      shareLink:v.target.value
    } )
  }


  // tab切换
  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }


  render() {
    const { form: { getFieldDecorator } } = this.props;
    const {
      errorFormList, currTab, shareImg, shareDescription, shareTitle, shareLink, 
    } = this.state;



    return (
      <Tabs defaultActiveKey="1" onChange={this.changeTab}>
        <TabPane tab={( <TabName name='奖品设置' errorFormList={errorFormList} requiredList={['list']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
          <GridContent>
            <Prize 
              data={this.props.data}
              onPreview={this.onPreview}
              wrappedComponentRef={( ref )=>{this.prizeRef = ref}}
            />
          </GridContent>
        </TabPane>
        {/* <TabPane tab='奖品配置' key="1">

        </TabPane> */}
        <TabPane tab='积分设置' key="2">
          <Integral 
            data={this.props.data}
            onPreview={this.onPreview}
            wrappedComponentRef={( ref )=>{this.integralRef = ref}}
          />
        </TabPane>
        <TabPane tab='任务设置' key="3">
          <Task 
            data={this.props.data}
            onPreview={this.onPreview}
            onRef={( ref )=>{this.taskSetRef = ref}} 
          />
        </TabPane>
        <TabPane tab='道具配置' key="4">
          <Props 
            data={this.props.data}
            onPreview={this.onPreview}
            wrappedComponentRef={( ref )=>{this.propsRef = ref}} 
          />
        </TabPane>
        <TabPane tab='微信分享' key="5">
          <p style={{ fontWeight:600, color:'#000', fontSize:15 }}>微信分享（选填）</p>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }} 
            label='分享标题'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareTitle', {
              initialValue: shareTitle,
            } )( <Input
              placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`} 
              onChange={this.shareTitleChange}
            /> )}
          </FormItem>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }} 
            label='分享描述'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareDescription', {
              initialValue:shareDescription,
            } )( <Input
              placeholder={`${formatMessage( { id: 'form.input' } )}分享描述`}
              onChange={this.shareDescriptionChange}
            /> )}
          </FormItem>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }} 
            label='分享链接'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareLink', {
              initialValue: shareLink,
            } )( <Input 
              placeholder={`${formatMessage( { id: 'form.input' } )}分享链接，不填默认本活动链接`} 
              onChange={this.shareLinkChange} 
            /> )}
          </FormItem>
          <FormItem
            label='分享图标'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareImg', {
                initialValue: shareImg,
              } )( <UploadImg onChange={this.shareImgChang} /> )}
            <div
              style={
                     { 
                       position: 'absolute', 
                       top:0, left:'125px', 
                       width:'180px',
                       fontSize: 13,
                       color: '#999', 
                       lineHeight:2,
                       marginTop:'10px'
                       }
                     }
            >
              <div>格式：jpg/jpeg/png </div>
              <div>建议尺寸：200px*200px</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </FormItem>
        </TabPane>
      </Tabs>
    );
  }
}

export default PrizeCom;

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
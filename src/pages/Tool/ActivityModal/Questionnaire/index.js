import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Steps, message, Modal, Icon } from 'antd';
import copy from 'copy-to-clipboard';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import BasicModal from './BasicsModal';
import StyleModal from './InterfaceModal';
import ActiveModal from './ActiveModal';

import styles from '../ActivityModal.less';


const { Step } = Steps;


@connect( ( { questionnaire } ) => ( {
  loading: questionnaire.loading,
} ) )
@Form.create()
class Questionnaire extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };


  constructor( props ) {
    let currentId = props.location.query.id || sessionStorage.getItem( 'questionnaire_edit_id' ) ||  ''
    if ( props.location.pathname === '/oldActivity/activityModal/addQuestionnaire' ) currentId = null
    super( props );
    this.state = {
      visible:false,
      currentStep: 0,
      currentId, // 当前活动id，新增时为null
      activeData:null,
      loading:false,
      canChangeStep:!!currentId
    };
  }



  componentWillMount() {
  }

  componentDidMount() {
    const { currentId } = this.state;
    this.getEditData( currentId )
    Modal.error( {
      title: '特别提醒',
      content: '请勿在编辑中打开其他菜单，将导致当前页面无法保存',
      okText:'知道了',
      icon: <Icon type="exclamation-circle" theme="filled" />
    } );

    // 通信问题优化
    this.postMessageTimer = setInterval( () => {
    window.addEventListener( 'message', ( e ) => {
        if ( e.data.postMessage ) {
        clearInterval( this.postMessageTimer );
        this.onPreview();
        }
      }, false );
    }, 1 );
  }

  componentWillUnmount(){
    clearInterval( this.postMessageTimer );
  }

  // 获取数据
  getEditData = ( id ) => {
    const { dispatch } = this.props;
    if( id ){
      dispatch( {
        type: 'questionnaire/getQuestionnaire',
        payload: {
          id,
        },
        callFunc: ( result ) => {
          const activeData = Object.assign( {
            type: 'QUESTIONNAIRE',
            nextState: false
          }, result )
          this.setState( {
            activeData
          }, ()=>{
              setTimeout( () => {
                this.onPreview()
              }, 500 )
          } )
        }
      } )
    }else {
      this.setState( {
        activeData:{
          type: 'QUESTIONNAIRE',
          nextState: false
        }
      }, ()=>{
        setTimeout( () => {
        this.onPreview()
        }, 500 )
      } )
    }
  }


  // 预览数据
  onPreview = () => {
    const { basicRef, styleRef, activeRef } = this;
    if ( basicRef && styleRef && activeRef ) {
      const { activeData } = this.state;
      const basiceData = this.basicRef.getValues()
      const styleData = this.styleRef.getValues()
      const listData = this.activeRef.getValues();
      const data = Object.assign(
        activeData,
        basiceData,
        styleData,
        listData
      )
      if( this.iframe && this.iframe.contentWindow ) {
        delete data.nextState
        this.iframe.contentWindow.postMessage( { data }, '*' );
      }
    }
  }



  // 提交
  handleSubmit = () => {
    const { currentId, activeData }=this.state;
    const activeInfo = this.activeRef.activeHandleSubmit(); // 活动配置
    const basiceData = this.basicRef.basicHandleSubmit();   // 基础数据
    const styleData = this.styleRef.styleHandleSubmit();    // 界面设置
    if( !activeInfo || !basiceData ){
      return;
    }
    const Parameters = Object.assign( activeData, basiceData, styleData, activeInfo );
    const { needLogin, isPrizeEmpty, isShowAttendCount } = Parameters;
    if( !needLogin && !isPrizeEmpty ){
      message.error( '配置抽奖必须设置为需要登录，请修改后再提交' )
      return
    }
    if( isShowAttendCount ){
      if( this.basicRef.getHaveError()||this.styleRef.getHaveError()||this.activeRef.getHaveError() ){
        return
       }
    }

    const newObj = Parameters;
    let prizeList = [];
    if( newObj && newObj.prizes && newObj.prizes.length >= 0 ){
      prizeList = newObj.prizes
    }
    prizeList.forEach( info=>{
      if( info.prizeId === 'onWinPrize' ){
       // eslint-disable-next-line no-param-reassign
       info.prizeId = ''
      }
    } )
    if ( currentId ){
      // 编辑
      this.editQuestionnaire( newObj )
    }else{
      // 新增
      this.addQuestionnaire( newObj )
    }
  }


  // 新增活动
  addQuestionnaire=( Parameters )=>{
    const { dispatch } = this.props;
    dispatch( {
      type: 'questionnaire/addQuestionnaire',
      payload: {
        params:Parameters,
        callFunc: ( res ) => {
          const currentId = res && res.id ? res.id : this.state.currentId;
          this.setState( { loading: false, currentId, visible:true } )
        }
      },
    } )
  }

  // 活动编辑
  editQuestionnaire=( Parameters )=>{
    const { dispatch } = this.props;
    dispatch( {
      type: 'questionnaire/editQuestionnaire',
      payload: {
        params:Parameters,
        callFunc: ( res ) => {
          const currentId = res && res.id ? res.id : this.state.currentId;
          this.setState( { loading: false, currentId, visible:true } )
        }
      },
    } )
  }


  //  进模板提示
  cancel = () => {
    const { history, location } = this.props;
    Modal.confirm( {
      content: '该操作将导致本页面关闭，您所编辑的内容尚未保存，是否确定离开本页面？',
      okText: '取消',
      icon: <Icon type="close-circle" style={{ color:'#f5222d' }} theme='filled' />,
      cancelText: '确认离开',
      onOk:() =>{

      },
      onCancel:()=>{
        if ( window.removeTab ) {
          window.removeTab( location.pathname )
          history.push( '/oldActivity/activityPanel' )
        }
      }
    } );
  }

  // 关闭模板提示
  cancelModel = () =>{
    const { history, location } = this.props;
    if ( window.removeTab ) {
      window.removeTab( location.pathname )
      history.push( '/oldActivity/activityPanel' )
    }else {
      this.setState( { visible:false } )
    }
  }

  //  跳转链接
  openActive = () => {
    const { currentId } = this.state;
    const strWindowFeatures = "width=375,height=667,top=0,right=0,scrollbars=no";
    window.open( `${serviceObj.questionnaireUrl}?id=${currentId}`, '_blank', strWindowFeatures )
  }

  // 拷贝
  clickCopy=( e )=>{
    e.stopPropagation();
    const { currentId } = this.state;
    const tag = copy( `${serviceObj.questionnaireUrl}?id=${currentId}` )
    if( tag ){
      message.success( '复制链接成功' )
    }else{
      message.error( '复制失败，重新点击或手动复制' )
    }
  }


  // 下一步
  next = () => {
    const { currentStep, canChangeStep } = this.state;
    let haveError = false
    if( currentStep === 0 ) {
      haveError = this.basicRef.getHaveError()
    }else if( currentStep === 1 ){
      haveError = this.styleRef.getHaveError()
      if ( !canChangeStep ) this.setState( { canChangeStep:true } )
    }
    if( !haveError ){
      this.setState( { currentStep: currentStep +1 } );
    }
  }

  // 上一步
  prev() {
    const currentStep = this.state.currentStep - 1;
    this.setState( { currentStep } );
  }


  render() {
    const {
      currentStep, activeData, loading, canChangeStep, currentId, visible
    } = this.state;

    const steps = [
      {
        title: '基础设置',
        content: activeData &&
        <BasicModal
          onRef={( ref ) =>{this.basicRef = ref}}
          data={activeData}
          onPreview={this.onPreview}
          currentId={currentId}
        />,
      },
      {
        title: '界面设置',
        content: activeData &&
        <StyleModal
          onRef={( ref ) => { this.styleRef = ref }}
          data={activeData}
          onPreview={this.onPreview}
        />,
      },
      {
        title: '活动设置',
        content: activeData && <ActiveModal
          data={activeData}
          currentId={currentId}
          onPreview={this.onPreview}
          onRef={( ref )=>{this.activeRef = ref}}
        />,
      },
    ];



    return (
      <GridContent className={styles.collect_edit_grid} style={{ background:'#fff' }}>
        <Card
          className={styles.listCard}
          bordered={false}
          bodyStyle={{ padding: '20px 30px 20px 30px', height:'100%' }}
        >
          <div className={styles.collect_edit}>
            <div className={styles.collect_edit_left_question}>
              <div className={styles.collect_edit_left_title}>
                效果预览
              </div>

              <iframe
                className={styles.collect_iframe}
                scrolling='auto'
                title='问卷活动预览'
                frameBorder={0}
                src={`${serviceObj.questionnaireUrl}?preview=true`}
                // src='http://localhost:8080/#/?preview=true'
                ref={( Ifram ) => { this.iframe = Ifram}}
                id='myframe'
              />
            </div>
            <div className={styles.collect_edit_right}>

              <div style={{ width: '100%', margin: '0 auto', }}>
                <Steps
                  current={currentStep}
                  style={{ margin:'0 auto 20px auto' }}
                  type="navigation"
                  size="small"
                  className={styles.collect_edit_steps}
                  onChange={( currentIndex ) => { if ( canChangeStep ) this.setState( { currentStep: currentIndex } ) }}
                >
                  {steps.map ( item => (
                    <Step
                      key={item.title}
                      title={item.title}
                      className={!canChangeStep ? styles.collect_edit_step : ''}
                      style={{ cursor: canChangeStep ? 'pointer' :'default' }}
                    />
                  ) )}
                </Steps>
              </div>
              {steps.map( ( item, index ) =>
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={styles.edit_collect_content}
                  style={{ display: index === currentStep ? 'block' : 'none',  }}
                >
                  {item.content}
                </div> )}
              <div className={styles.stepsAction}>
                <Button style={{ marginRight:15 }} onClick={() => this.cancel()}>
                  取消
                </Button>
                {currentStep > 0 && (
                  <Button style={{ marginRight:15 }} onClick={() => this.prev()}>
                    上一步
                  </Button>
                      )}
                {currentStep < steps.length - 1 && (
                  <Button style={{ marginRight: 15 }} type="primary" onClick={() => this.next()}>
                    下一步
                  </Button>
                )}
                {
                  <Button
                    type="primary"
                    loading={loading}
                    disabled={( currentStep !== steps.length - 1 ) && !canChangeStep}
                    onClick={( e ) => this.handleSubmit( e )}
                  >
                    {
                      currentId ? '保存并生成' : '保存并创建'
                    }
                  </Button>
                }
              </div>
            </div>
          </div>

        </Card>

        <Modal
          visible={visible}
          footer={null}
          bodyStyle={{ textAlign:'center', paddingBottom:40 }}
          onCancel={this.cancelModel}
          width={400}
          centered
          maskClosable={false}
        >
          <h3>创建活动成功</h3>
          <p>后续可在活动面板进行编辑和查看～</p>
          <div style={{ padding:'20px 0 20px' }}>您可以打开<u style={{ color:'#1890FF', cursor:'pointer' }} onClick={this.openActive}>新的窗口预览</u></div>
          <div
            style={{ cursor:'pointer' }}
            onClick={( e )=>this.clickCopy( e )}
          ><Icon type="copy" style={{ color:'#1890FF' }} />一键复制活动地址
          </div>
        </Modal>

      </GridContent>
    );
  }
}

export default Questionnaire;


import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Steps, message, Modal, Icon } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import copy from 'copy-to-clipboard';
import serviceObj from '@/services/serviceObj';
import BasicModal from './BasicsModal';
import StyleModal from './InterfaceModal';
import ActiveModal from './ActiveModal';
import styles from '../ActivityModal.less';

const { Step } = Steps;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
} ) )
@Form.create()
class ListModal extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  constructor( props ) {
    let currentId = props.location.query.id || sessionStorage.getItem( 'coupon_edit_id' ) ||  ''
    if ( props.location.pathname === '/oldActivity/activityModal/addCoupon' ) currentId = ''
    super( props );
    this.state = {
      visible:false,
      currentStep: 0,
      // 当前id
      currentId,
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

    // // 监听iframe加载完以后
    // const oFrm = document.getElementById( 'myframe' );
    // if( oFrm ) {
    //   oFrm.onload = () => {
    //     this.onPreview()
    //   }
    // }
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


  getEditData = ( id ) => {
    const { dispatch } = this.props;
    if( id ){
      dispatch( {
        type: 'activity/getGrabCouponSpecsList',
        payload: {
          id,
        },
        callFunc: ( result ) => {
          const activeData = Object.assign( {
            type: 'RUSH_COUPON',
            nextState: false
          }, result )
          this.setState( {
            activeData
          }, ()=>{
              setTimeout( () => {
                this.onPreview()
              }, 1000 )
          } )
        }
      } )
    }else {
      this.setState( {
        activeData:{
          type: 'RUSH_COUPON',
          nextState: false
        }
      }, ()=>{
        setTimeout( () => {
        this.onPreview()
        }, 1000 )
      } )
    }

  }

  onPreview = () => {
    const { basicRef, styleRef, activeRef } = this;
    if ( basicRef && styleRef && activeRef ) {
      const { activeData } = this.state;
      const basiceData = this.basicRef.getValues()
      const styleData = this.styleRef.getValues()
      const listData = this.activeRef.getValues();

      const data = Object.assign( activeData,
        basiceData,
        styleData,
        { ...listData, prizes:  listData.prizes.filter( item => item.isSale === true ) }
      )
      if( this.iframe && this.iframe.contentWindow ) {
        delete data.nextState
        this.iframe.contentWindow.postMessage( { data }, '*' );
      }
    }

  }



  // 提交
  handleSubmit = (  ) => {
    this.setState( { loading:true } )
    const that = this;
    const { dispatch } = this.props;
    const basiceData = this.basicRef.basicHandleSubmit()
    const styleData = this.styleRef.styleHandleSubmit()
    const listData = this.activeRef.getValues();
    const { prizes } = listData;
    let isError = true;
    const startTimeArr = [];
    prizes.forEach( item => (
      startTimeArr.push( {
        receiveStartTime: item.receiveStartTime, receiveEndTime: item.receiveEndTime,
      } )
    ) );
    const StartTimeArr = [];
    const obj = {};
    // 去重
    startTimeArr.forEach( ( item, i ) => {
      if ( !obj[startTimeArr[i].receiveStartTime] ) {
        StartTimeArr.push( startTimeArr[i] );
        obj[startTimeArr[i].receiveStartTime] = true;
      }
    } );

    // 按时间先后排序
    StartTimeArr.sort( ( a, b ) => {
      const value1 = a.receiveStartTime;
      const value2 = b.receiveStartTime;
      return value1 > value2 ? 1 : -1;
    } );
    StartTimeArr.forEach( ( item, index ) => {
      const startTime = moment( item.receiveStartTime ).valueOf();
      const endTime = moment( item.receiveEndTime  ).valueOf();
      if( startTime === endTime ){
        message.error( '抢券时间不可重合' )
          isError = false;
      }

      const startTimeDay =  moment( item.receiveStartTime ).format( 'YYYY-MM-DD' );
      const endTimeDay = moment( item.receiveEndTime ).format( 'YYYY-MM-DD' );


      if( startTimeDay !== endTimeDay ){
          message.error( '抢券时间不可跨天' )
          isError = false;
      }

      const preEndTime =  ( index < StartTimeArr.length-1 ) && new Date( StartTimeArr[index].receiveEndTime.replace( /-/g, '/' ) ).getTime();
      const nextStartTime = ( index < StartTimeArr.length-1 ) && new Date( StartTimeArr[index+1].receiveStartTime.replace( /-/g, '/' ) ).getTime();
      if( ( index < StartTimeArr.length-1 ) && preEndTime > nextStartTime ){
        message.error( '抢券时间不可重叠' )
        isError = false;
      }

    } )

    if( !isError ) return
    const { activeData } = this.state;
    delete activeData.nextState
    if ( basiceData && styleData && listData ){
      const data = Object.assign( activeData, basiceData, styleData, { ...listData, } )
      if( data.prizes.length === 0 ) {
        this.setState( {
          loading: false
        } )
        return message.error( "奖品不能为空！" )
      }
      delete data.showDates
      dispatch( {
        type: 'activity/submitGrabCouponData',
        payload: {
          params:data,
          callFunc: ( res ) => {
            if( res.success ){
              const currentId = res && res.id ? res.id : this.state.currentId;
              that.setState( { loading: false, visible:true, currentId } )
            }else{
              this.setState( { loading: false } )
            }
          }
        },
      } )
    }else{
      // message.error( '页面出错' )
      this.setState( { loading: false } )
    }
  }


  //  进模板提示
  cancel = () => {
    const { history, location } = this.props;
    Modal.confirm( {
      content: '该操作将导致本页面关闭，您所编辑的内容尚未保存，是否确定离开本页面？',
      okText: '取消',
      icon: <Icon type="close-circle" style={{ color:'#f5222d' }} theme='filled' />,
      cancelText: '确认离开',
      onOk:( ) =>{

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
    window.open( `${serviceObj.activityGrabCouponUrl}?id=${currentId}`, '_blank', strWindowFeatures )
  }

  // 拷贝
  clickCopy=( e )=>{
    e.stopPropagation();
    const { currentId } = this.state;
    const tag = copy( `${serviceObj.activityGrabCouponUrl}?id=${currentId}` )
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
          prizeGroup={activeData.prizeGroup}
          onPreview={this.onPreview}
          data={activeData}
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
            <div className={styles.collect_edit_left}>
              <div className={styles.collect_edit_left_title}>
                效果预览
              </div>
              <iframe
                className={styles.collect_iframe}
                // scrolling='auto'
                title='抢券预览'
                frameBorder={0}
                src={`${serviceObj.activityGrabCouponUrl}?preview=true`}
                // src="http://gyy.test.jiniutech.cn:8080/#/?preview=true"
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
                      // status='error'
                    />
                  ) )}
                </Steps>
              </div>
              {steps.map( ( item, index ) =>
                <div
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
                {/* {
                  <Button type="primary" style={{ margin: '0 15px' }} onClick={( e ) => this.previewSubmit( e )} disabled={previewState}>
                    预览
                  </Button>
                } */}
                {currentStep < steps.length - 1 && (
                  <Button style={{ marginRight: 15 }} type="primary" onClick={() => this.next()}>
                    下一步
                  </Button>
                )}
                {/* {currentStep === steps.length - 1 && (
                  <Button type="primary" onClick={( e ) => this.handleSubmit( e )}>
                    提交
                  </Button>
                      )} */}
                {
                  <Button
                    type="primary"
                    loading={loading}
                    disabled={( currentStep !== steps.length - 1 ) && !canChangeStep}
                    onClick={( e ) => this.handleSubmit( e )}
                  >
                    保存并生成
                  </Button>
                }
              </div>
              {/* </div> */}
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
            onClick={this.clickCopy}
          ><Icon type="copy" style={{ color:'#1890FF' }} />一键复制活动地址
          </div>
        </Modal>

      </GridContent>
    );
  }
}

export default ListModal;


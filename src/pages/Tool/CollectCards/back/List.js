import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import { Card, Button, Modal, Form, Table, Steps, message, Row, Col } from 'antd';
import moment from 'moment';
// import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import serviceObj from '@/services/serviceObj';
import FilterForm from './FilterForm';
// import BasicModal from './BasicModal';
// import StyleModal from './StyleModal';
// import TaskModal from './TaskModal'
// import PrizeModal from './PrizeModal';
// import ChuckModal from './ChuckModal';

import ShareModal from '../../Applet/ShareManage/ShareModal';
import styles from '../Lists.less';

const { activityGleanCardUrl } = serviceObj;
const { confirm } = Modal;
// const { Step } = Steps;


@connect( ( { activity } ) => ( {
  loading: activity.loading,
  grabCouponData:activity.grabCouponData,
  collectCardsSpecsObj:activity.collectCardsSpecsObj,
} ) )
@Form.create()
class ActivesLists extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  constructor( props ){
    super( props );
    this.state = {
      pageNum: 1,
      pageSize: 10,
      visible: true,
      currentStep: 1,
      // 预览按钮状态
      previewState:true,
      // 提交按钮状态
      handleState:true,
      // 当前id
      currentId:'',

      shareModalVisible: false,
      shareModalCurrent: {},
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },

    };
  }



  componentWillMount() {
    this.fetchList();
  }

  componentDidMount() {
    window.addEventListener( "message", this.receiveMessageFromIframePage, false );
  }

  receiveMessageFromIframePage = ( event ) =>{
    console.log( 'receiveMessageFromIframePageZhongtai: ', event );
  }

  txClick = () => {
    // console.log( this.iframe.contentWindow )
    this.iframe.contentWindow.postMessage( { data:'测试' }, '*' );
  }

  // 获取列表
  fetchList = ( params ) => {
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { pageNum, pageSize, sortedInfo={} } = this.state;
    const { activityState, rangeTime, name } = formValue;
    const start = ( rangeTime && rangeTime.length ) ?  moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const end = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getGrabCouponData',
      payload: {
        pageNum,
        pageSize,
        activityState,
        start,
        end,
        name,
        type: 'COLLECT_CARD',
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'create_time desc',
        ...params,
      }
    } );
  }


  // 获取卡牌列表
  fetchCardList = ( id ) => {
    const { dispatch, collectCardsSpecsObj } = this.props;
    const $this = this;
    if( id ){
      dispatch( {
        type: 'activity/getAllCardList',
        payload: {
          id,
          orderBy:'sort desc'
        },
        callFunc:( result )=>{
          dispatch( {
            type: 'activity/SetState',
            payload:{
              collectCardsSpecsObj:{
                ...collectCardsSpecsObj,
                cardInfoList:result,
               }
            }
          } )
          $this.fetchTasksList( id )
        }
      } );
    }
  }


  // 获取任务列表
  fetchTasksList = ( id ) => {
    const { dispatch, collectCardsSpecsObj } = this.props;
    const $this = this;
    if( id ){
      dispatch( {
        type: 'activity/getAllAppointList',
        payload: {
          id
        },
        callFunc:( result )=>{
          dispatch( {
            type: 'activity/SetState',
            payload:{
              collectCardsSpecsObj:{ ...collectCardsSpecsObj, taskList:result }
            }
          } )
          $this.fetchPrizesList( id )
        }
      } );
    }
  }

  // 获取奖品列表
  fetchPrizesList = ( id ) => {
    const { dispatch, collectCardsSpecsObj } = this.props;
    if( id ){
      dispatch( {
        type: 'activity/getPrizeListAll',
        payload: {
          id
        },
        callFunc:( result )=>{
          dispatch( {
            type: 'activity/SetState',
            payload:{
              collectCardsSpecsObj:{ ...collectCardsSpecsObj, prizeList:result }
            }
          } )
        }
      } );
    }
  }


  // 删除列表项
  deleteItem = ( e, id, ) => {
    e.stopPropagation();
    const $this = this;
    // const { listType } = this.state;
    const { grabCouponData:{ list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )

        dispatch( {
          type: 'activity/deleteCollectCards',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList();;
            },
           },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }

  // 显示新建遮罩层
  showModal = () => {
    this.props.history.push( '/oldActivity/addCollectCard' )
  };

  // 显示编辑遮罩层
  showEditModal = ( e, id ) => {
    e.stopPropagation();

    this.props.history.push( `/oldActivity/editCollectCard?id=${id}` )

  };


  // 取消
  handleCancel = () => {
    const { current } = this.state;
    const { dispatch } = this.props;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this.addSpeBtn ) { this.addSpeBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
      if ( this[`editSpeBtn${id}`] ) { this[`editSpeBtn${id}`].blur(); }
    }, 0 );
    dispatch( {
      type: 'activity/SetState',
      payload:{
        collectCardsSpecsObj:{
          type: 'COLLECT_CARD',
          cardInfoList:[],
          taskList:[],
          prizeList:[]
        }
      }
    } )
    this.setState( {
      visible: false,
      currentStep: 0,
      previewState:true,
      handleState:true,
      currentId:''
    } );
  };



  // 拿取子组件
  onRef = ( ref ) => {
    this.child = ref;
  }


  //  保存
  saveSubmit = ( e ) =>{
    e.preventDefault();
    const { currentStep } = this.state;
    if( currentStep === 0 ) {
      this.child.basicHandleSubmit( e );
    }
    if( currentStep === 1 ){
      this.child.styleHandleSubmit( e )
    }
    if( currentStep===2 ){
      const { dispatch, collectCardsSpecsObj, collectCardsSpecsObj:{ prizeList } }=this.props;
      if( !( prizeList.length === 0 ) ){
        dispatch( {
          type:'activity/SetState',
          payload:{
            collectCardsSpecsObj:{
              ...collectCardsSpecsObj,
              nextState:false
            }
          }
        } )
        message.success( '保存成功' )
      }else{
        message.error( '请填写奖品设置' )
      }
    }
  }

  // 提交
  handleSubmit = ( e )=>{
    e.stopPropagation();
    const { handleState } = this.state;
    if( !handleState ){
      message.error( '不可多次重复提交' )
      return
    }
    const { dispatch, collectCardsSpecsObj } = this.props;
    if( collectCardsSpecsObj.taskList === [] ){
      message.error( '请填写指定任务列表' )
      return
    }
    const $this = this;
    delete collectCardsSpecsObj.nextState;
    dispatch( {
      type:'activity/submitColletCards',
      payload:{
        params:{ ...collectCardsSpecsObj },
        callFunc:()=>{
          $this.setState( {
            visible: true,
            currentStep:3,
            previewState:false,
            handleState:false,
          } )
          $this.fetchList( {} )
        }
      },
    } )
  }


  // 筛选表单提交 请求数据
  filterSubmit = ( ) =>{
    setTimeout( () => {
      this.fetchList()
    }, 100 );
  }

  // // 改变产品状态
  // changeListType = ( e ) => {
  //   const listType = e.target.value;
  //   this.setState( { listType } )
  // }

  tableChange = ( pagination, filters, sorter ) =>{
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, ()=>this.fetchList() );
  };


   // 显示小程序弹框
   showShareModal = ( item ) =>{
    const { dispatch } = this.props;

    let shareModalCurrent = {
      title: item.name,
      link: `${activityGleanCardUrl}${item.id}`,
    };
    if( item.wxShareId ){
      dispatch( {
        type: 'activity/getMiniShareData',
        payload:{
          id: item.wxShareId,
        },
        callFunc:( res )=>{
          if( res ){
            shareModalCurrent=res;
            this.setState( { shareModalCurrent, shareModalVisible: true, current: item } )
          }else{
            this.setState( { shareModalCurrent, shareModalVisible: true, current: item } )
          }
        }
      } )
    } else {
      this.setState( { shareModalCurrent, shareModalVisible: true, current: item } )
    }
  }

   // 取消
   shareModalHandleCancel = () => {
    this.setState( {
      shareModalVisible: false,
      shareModalCurrent: {},
    } );

  };

  // 提交
  shareModalHandleSubmit = ( wxShareId ) => {
    const { dispatch,  } = this.props;
    const { current } = this.state;
    const $this = this;
    // 有小程序id更新活动列表
    if( wxShareId ){
      dispatch( {
        type:'activity/submitColletCards',
        payload: {
          ...current,
          wxShareId,
          deleteIds: ['0'],
        },
        callFunc:()=>{
          $this.fetchList();
          this.setState( {
            shareModalVisible: false,
            shareModalCurrent: {},
          } );
        }
      } )

    }else{
      this.setState( {
        shareModalVisible: false,
        shareModalCurrent: {},
      } );
    }
  };


  // 预览
  previewSubmit = ( e ) =>{
    e.stopPropagation();
    const { grabCouponData } = this.props;
    const { currentId }= this.state;
    const id = currentId || grabCouponData.list[0].id
    window.open( `${activityGleanCardUrl}${id}`, "_blank" );
  }

  // 下一步
  next() {
    const currentStep = this.state.currentStep + 1;
    this.setState( { currentStep } );
  }

  // 上一步
  prev() {
    const { handleState, currentId } = this.state;
    if( handleState === false ){
      const { grabCouponData, dispatch, collectCardsSpecsObj } = this.props;
      const id = currentId || grabCouponData.list[0].id
      const currentStep = this.state.currentStep - 1;
      dispatch( {
        type:'activity/SetState',
        payload:{
          collectCardsSpecsObj:{
            ...collectCardsSpecsObj,
            id
          }
        }
      } )
      this.setState( { currentStep, handleState:true, previewState:true } );
    }else{
      const currentStep = this.state.currentStep - 1;
      this.setState( { currentStep } );
    }
  }

  render() {
    const {
      loading, grabCouponData:{ list, total }, collectCardsSpecsObj
    } = this.props;
    const nextState = collectCardsSpecsObj ? collectCardsSpecsObj.nextState : true;
    const {
      pageSize, pageNum, visible, current = {},
      shareModalVisible, shareModalCurrent, sortedInfo,
      currentStep, previewState
    } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    // const steps = [
    //   {
    //     title: '基础设置',
    //     content: <BasicModal onRef={this.onRef} />,
    //   },
    //   {
    //     title: '样式设置',
    //     content: <StyleModal onRef={this.onRef} />,
    //   },
    //   {
    //     title: '卡牌设置',
    //     content: <ChuckModal onRef={this.onRef} />,
    //   },
    //   {
    //     title: '奖品管理',
    //     content: <PrizeModal onRef={this.onRef} />,
    //   },
    //   {
    //     title: '指定任务',
    //     content: <TaskModal onRef={this.onRef} />,
    //   },
    // ];

    const columns = [
      {
        title: <span>活动名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => (
          <span>{name}</span> ),
      },
      {
        title: <span>活动状态</span>,
        dataIndex: 'activityState',
        key: 'activityState',
        render : activityState => <span>{activityState}</span>
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
        key: 'startTime',
        render : startTime => <span>{startTime}</span>
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        key: 'endTime',
        render : endTime => <span>{endTime}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
              onClick={( e ) => this.showEditModal( e, id )}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', marginRight: 15, color:'#f5222d' }}
              onClick={( e ) => this.deleteItem( e, id )}
            >删除
            </span>

            <span style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}>
              <a href={`${activityGleanCardUrl}${id}`} target="_blank" rel='noopener noreferrer'>链接</a>
            </span>

            <span
              style={{ marginBottom:5, cursor:'pointer', marginRight: 15, color:'#1BB557' }}
              onClick={()=>this.showShareModal( item )}
            >小程序
            </span>

          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            // extra={extraContent}
            title='集卡列表'
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <FilterForm filterSubmit={this.filterSubmit} wrappedComponentRef={( ref ) => { this.filterForm = ref}} />
            </div>
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              // scroll={{ x: 1200 }}
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        {
          // visible?
          //   <Modal
          //     maskClosable={false}
          //     title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
          //     className={styles.standardListForm}
          //     width={1200}
          //     bodyStyle={{ padding:'12px 24px', maxHeight:'72vh', overflow: "auto" }}
          //     destroyOnClose
          //     visible={visible}
          //     onCancel={this.handleCancel}
          //     footer={null}
          //     // confirmLoading={}
          //     // {...modalFooter}
          //   >
          //     <div style={{ width:1000, margin:'0 auto' }}>
          //       {/* <Steps current={currentStep} style={{ width:900, margin:'15px auto 30px auto' }}>
          //         {steps.map ( item => (
          //           <Step key={item.title} title={item.title} />
          //         ) )}
          //       </Steps> */}
          //       <div className={styles.tabBox}>
          //         {steps.map( ( item, index ) => (
          //           <div
          //             key={item.title}
          //             onClick={() => { this.setState( { currentStep:index } )}}
          //             className={`${styles.tabItem} ${index === currentStep ? styles.tabActive : ''}`}
          //           >
          //             {item.title}
          //           </div>
          //       ) )}
          //       </div>
          //       <Row>
          //         {/* <Col span={6}>
          //           <iframe src="http://192.168.35.100:8080/#/" id='myframe' style={{ height:500 }} ref={iframe => this.iframe = iframe} />

          //           <Button onClick={this.txClick}>通信</Button>
          //         </Col> */}
          //         <Col span={18}>
          //           {steps.map( ( item, index ) => <div style={{ display:index === currentStep ? 'block' : 'none' }}>{item.content}</div> )}
          //           {/* <div>{steps[currentStep].content}</div> */}
          //           <div className={styles.stepsAction}>
          //             {currentStep > 0 && (
          //               <Button onClick={() => this.prev()}>
          //                 上一步
          //               </Button>
          //             )}
          //             {
          //               currentStep < 3 ?
          //                 <Button type="primary" style={{ margin: '0 15px' }} onClick={( e ) => this.saveSubmit( e )}>
          //                   保存
          //                 </Button>
          //                 :
          //                 <Button type="primary" style={{ margin: '0 15px' }} onClick={( e ) => this.previewSubmit( e )} disabled={previewState}>
          //                   预览
          //                 </Button>
          //             }
          //             {currentStep < steps.length - 1 && (
          //               <Button type="primary" onClick={() => this.next()} disabled={nextState}>
          //                 下一步
          //               </Button>
          //             )}
          //             {currentStep === steps.length - 1 && (
          //               <Button type="primary" onClick={( e ) => this.handleSubmit( e )}>
          //                 提交
          //               </Button>
          //             )}
          //           </div>
          //         </Col>
          //       </Row>

          //     </div>

          //   </Modal>
          // :null
        }
        <ShareModal visible={shareModalVisible} current={shareModalCurrent} handleSubmit={this.shareModalHandleSubmit} handleCancel={this.shareModalHandleCancel} />

      </GridContent>
    );
  }
}

export default ActivesLists;

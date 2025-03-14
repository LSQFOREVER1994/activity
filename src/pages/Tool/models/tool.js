/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 10:59:51
 * @LastEditTime: 2019-08-14 18:43:42
 * @LastEditors: Please set LastEditors
 */
import { message } from 'antd';
import {
  getBannerTags, getBanners, addBanners,
  exitBanners, delBanners,
  getMessageTypes, getMessage, 
  // getCouponList,addActivity, updateActivity, delActivity,
  // getActivityList, getActivitySituation, 
  // getSignActivityDetail, addSignActivity, updateSignActivity, 
  // getIntegralActivityDetail, addIntegralActivity, updateIntegralActivity, 
  getHistoryGainsData, DeleteHistoryGains, AddHistoryCategory, editHistoryCategory,
  addHistoryGainPeriod, getHistoryCategoryDetail, editHistoryGainPeriod, deleteHistoryGainPeriod,
  getHistoryGainsPeriod, getRecordDetailsList,
  getPurchasesRecordData, deletePurchasesRecord, editRecordTemplate, addRecordTemplate,
  getLandingPageData, deleteLandingPage, editLandingPage, addLandingPage,
  getPlatformListAll,
  getDockingList,
  getPrizeList, updatePrize, addPrize, delPrize,
  getActivityTemplateList, addActivityTemplate, editActivityTemplate, deleteActivesTemplate,
  getAllPrizeList, 
  // editPrizeData, addPrizeData, getPrizeDetailSpecsList
  // deletePrizeData,getSinglePrizeList,
  getAwardrecords, editAwardReissue,
  getActiveOrder, getActiveOrderAmounts,
  //  editSecondKillData, addSecondKillData, deleteSecondKillData, getFlashSaleSpecsList,
  // getCollectCardsData, editGrabCouponData, addGrabCouponData, deleteGrabCouponData, getGrabCouponSpecsList, getMiniShareData,
  // getCollectCouponSpecs, getAllCardList, getAllAppointList, getPrizeListAll, editColletCards, addColletCards, deleteCollectCards,

  // editOrderGiftData, addOrderGiftData, deleteOrderGiftData, getOrderGiftSpecsList, getgoodsSpecs,
  //  editDrawLotsData, addDrawLotsData, deleteDrawLotsData, getDrawLotsSpecsList,
  // getPasswordActivity, editPasswordActivity, addPasswordActivity, deletePasswordActivity, getPasswordPrize,
  getAuditProcessList, auditProcessType,
  getTemplateMessageData, getWxAccessToken, getWxTemplateList, getWxTagList,
  editTemplateMessageData, addTemplateMessageData, deleteTemplateMessageData, postWxMessage,
  // exitRandomCard, addRandomCard, getRandomCardData,
   getTaskTemplateList,
  getAppointTaskList, deleteAppointTask, editAppointTask, addAppointTask, getTaskActivity,
  // getAllActivityList, getAppidList, getActivityStateNum, deleteActivityData,getCollectTaskList,
  // getAnswerSpecsObj, getQuestionsObj, 
  // getAllSubjects, getAllTagsList, getTagsSubjectList,
  // exitQuestions, addQuestions, exitAnswerData, addAnswerData, 
  // getRedRainData, exitRedRain, addRedRain,
  getAccountList, addAccount, addPayCapital, balanceMoney, lockMoney, getAccountDetailsList, getAllAccountData,
  // addOrderPrizes, editOrderPrizes, delOrderPrizes, getOrderPrizes, getOrderShowing,
  // getGuessGame, delGuessGame, addGuessGame, editGuessGame, getGuessPrices, getGuessIntegral, editGuessIntegral, addGuessIntegral,
  // getPrizeClawData, exitPrizeClaw, addPrizeClaw,
  // getActivityData, editActivityData, addActivityData, delActivityData,
  getPaperList, editPaper, addPaper, delPaper,
  getAuditList, goAudit, getRecordList
} from '@/services/tool.service';


import {
  getTaskEventList
} from '@/services/taskEvents.service';

// import {
//   getProducts
// } from '@/services/strategyMall.service';

export default {
  namespace: 'tool',
  
  state: {
    loading: false,
    bannerTags: [],
    messageTypes: [],
    banners: {
      total: 0,
      list: [],
    },
    message: {
      total: 0,
      list: [],
    },
    // activityList: {
    //   total: 0,
    //   list: [],
    // },
    // couponList: {
    //   total: 0,
    //   list: [],
    // },
    // activityUserList: {
    //   total: 0,
    //   list: [],
    // },
    platformyListAll:{
      total: 0,
      list: [],
    },
    dockingList:{
      total: 0,
      list: [],
    },
    prizeManageList:{
      total: 0,
      list: [],
    },
    historyGainsData:{
      list:[],
      total:0
    },
    historyGainsPeriod:{
      list:[],
      total:0
    },
    purchasesRecordData:{
      list:[],
      total:0
    },
    prizeData:{
      list:[],
      total:0
    }, // 抽奖活动列表
    landingPageData: {
      list: [],
      total: 0
    },
    prizeDetailList: [], // 活动详情页-奖品列表
    bigWhellList: [], // 大转盘奖品列表
    scratchCardList: [], // 刮刮卡奖品列表
    allPrizeList: [], // 所有奖项
    prizeDeleteIds: ['0'], // 删除的奖品id
    activityTemplateData:{
      list:[],
    },
    awardrecordsData: {
      list: [],
      total: 0,    
    }, // 中奖纪录数据

    // 活动订单列表
    activeOrderList:{
      total: 0,
      list: [],
    },
    activeOrderAmounts:{
      total: 0,
      list: [],
    },
    secondKillData: {
      list: [],
      total: 0,    
    }, // 秒杀数据
    collectCardsData: {
      list: [],
      total: 0,
    }, // 抢券数据
    flashSaleSpecsList: [], // 秒杀活动下的秒杀设置列表
    drawLotsSpecsList: [], // 抽签活动下的设置列表
    orderGifData:{
      list: [],
      total: 0, 
    }, // 下单有礼数据
    drawLotsData:{
      list: [],
      total: 0, 
    }, // 抽签数据
    goodsSpecsTree: [],
    // 口令活动
    // passwordActivity: {
    //   list: [],
    //   total: 0,    
    // },
    // 审核流程
    auditProcessList:{
      list: [],
      total: 0,    
    },

    templateMessageData:{
      total: 0,
      list: [],
    },
    appointTaskData:{
      list:[],
      total:0
    },
    // allActivityList:{
    //   total: 0,
    //   list: [],
    // },
    wxAccesstoken: '', // 微信的token
    wxTemplateList: [], // 微信消息模板列表
    wxTagList: [], // 微信标签列表
    collectCardsSpecsObj: {
      type: 'COLLECT_CARD',
      nextState: true, // 保存按钮状态
      cardDeleteIds: [0],
      taskDeleteIds: [0],
      prizeDeleteIds: [0],
      cardInfoList: [],
      taskList: [],
      prizeList: [],
    },
    collectTaskList:[],
    taskPrizeList:[], // 指定任务的奖品列表
    taskActivityList:[], // 未绑定的任务组活动列表
    // allSubjectsResult: [], // 所有题目
    //  账户平台
    accountList:{
      list:[],
      total:0
    },
    accountDetailsList:{ // 资金详情列表
      total: 0,
      list: [],
    },
    categoriesList:[], // 商品列表
    prizesList:[],
    integralData:{},
    paperList:{
      list:[],
      total:0
    },
    auditList:{
      list:[],
      total:0
    },
    recordList:[]
  },

  
  effects: {
    *getActivityTemplateList( { payload }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getActivityTemplateList, payload );
      if( success ){
        yield put( {
          type: 'SetState',
          payload: { activityTemplateData:result },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
      
    },
    *submitActivityTemplate( { payload, isUpdate, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = isUpdate ? yield call( editActivityTemplate, payload ) : yield call( addActivityTemplate, payload )
      if ( success ) {
        const Result = isUpdate ? payload : result
        callFunc( Result );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
     *deleteActivesTemplate( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
       const { success } = yield call( deleteActivesTemplate, payload );
      if ( success && callFunc ) {
        callFunc();
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    *getLandingPageData( { payload }, { call, put } ) {
      const { success, result } = yield call( getLandingPageData, payload );
      if ( success ) {
        const landingPageData = result;
        yield put( {
          type: 'SetState',
          payload: { landingPageData },
        } );
      }
    },
    *deleteLandingPage( { payload, callFunc }, { call } ) {
      const { success } = yield call( deleteLandingPage, payload );
      if ( success && callFunc ) {
        callFunc()
      }
    },
    *submitLandingPage( { payload, callFunc, isUpdate }, { call } ) {
      const { success, result } = isUpdate ? yield call( editLandingPage, payload ) : yield call( addLandingPage, payload );
      if ( success ) {
        const Result = isUpdate ? payload : result
        callFunc( Result );
      }
    },
    *getPurchasesRecordData( { payload, callFunc }, { call, put } ){
      const { success, result } = yield call( getPurchasesRecordData, payload );
      if ( success ) {
        const { list } = result
        if( callFunc )callFunc( list )
        const purchasesRecordData = result;
        yield put( {
          type: 'SetState',
          payload: { purchasesRecordData },
        } );
      }
    },
    // *getPrizeData( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGrabCouponData, payload );
    //   if ( success ) {
    //     const prizeData = result;
    //     yield put( {
    //       type: 'SetState',
    //       payload: { prizeData },
    //     } );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getOrderGiftData( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGrabCouponData, payload );
    //   if ( success ) {
    //     const orderGifData = result;
    //     yield put( {
    //       type: 'SetState',
    //       payload: { orderGifData },
    //     } );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // 获取中奖名单列表
    *getAwardrecords( { payload }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAwardrecords, payload );
      if ( success ) {
        const awardrecordsData = result;
        yield put( {
          type: 'SetState',
          payload: { awardrecordsData },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    *editAwardReissue( { payload }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success } = yield call( editAwardReissue, payload );
      if( success ){
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    // *getSecondKillData( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGrabCouponData, payload );
    //   if ( success ) {
    //     const secondKillData = result;
    //     yield put( {
    //       type: 'SetState',
    //       payload: { secondKillData },
    //     } );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getDrawLotsData( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGrabCouponData, payload );
    //   if ( success ) {
    //     const drawLotsData = result;
    //     yield put( {
    //       type: 'SetState',
    //       payload: { drawLotsData },
    //     } );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getCollectCardsData( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getCollectCardsData, payload );
    //   if ( success ) {
    //     const collectCardsData = result;
    //     yield put( {
    //       type: 'SetState',
    //       payload: { collectCardsData },
    //     } );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getFlashSaleSpecsList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getFlashSaleSpecsList, payload );
    //   if ( success ) {
    //     // const flashSaleSpecsList = result.flashSaleSpecs;
    //     // yield put( {
    //     //   type: 'SetState',
    //     //   payload: { flashSaleSpecsList },
    //     // } );
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getOrderGiftSpecsList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getOrderGiftSpecsList, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getDrawLotsSpecsList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getDrawLotsSpecsList, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getGrabCouponSpecsList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGrabCouponSpecsList, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getPrizeDetailSpecsList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getPrizeDetailSpecsList, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // *getMiniShareData( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getMiniShareData, payload );
    //   if ( success ) {
        
    //     callFunc( result )
        
    //   }else{
    //     callFunc()
    //   }
    //   yield put( {
    //     type: 'setLoading',
    //     payload: false,
    //   } );
    // },
    // *getAllPrizeList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getAllPrizeList, payload );
    //   if ( success ) {
    //     const allPrizeList = result.list;
    //     if( callFunc )callFunc( allPrizeList )
    //     yield put( {
    //       type: 'SetState',
    //       payload: { allPrizeList },
    //     } );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // //  根据ID 获取单个奖品 
    // *getSinglePrizeList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getSinglePrizeList, payload );
    //   if ( success ) {
    //     callFunc( result );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    *getAppointTaskList( { payload }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAppointTaskList, payload );
      if ( success ) {
        const appointTaskData = result;
        yield put( {
          type: 'SetState',
          payload: { appointTaskData },
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *getTaskPrizeList( { payload }, { call, put } ){
      const { success, result } = yield call( getAllPrizeList, payload );
      if ( success ) {
        const taskPrizeList = result.list;
        yield put( {
          type: 'SetState',
          payload: { taskPrizeList },
        } );
      }
    },
    *getTaskActivity( { payload }, { call, put } ){
      const { success, result } = yield call( getTaskActivity, payload );
      if ( success ) {
        const taskActivityList = result;
        yield put( {
          type: 'SetState',
          payload: { taskActivityList },
        } );
      }
    },
    *deleteAppointTask( { payload, callFunc }, { call } ) {
      const { success } = yield call( deleteAppointTask, payload );
      if ( success && callFunc ) {
        callFunc()
      }
    },
    *deletePurchasesRecord( { payload, callFunc }, { call } ) {
      const { success } = yield call( deletePurchasesRecord, payload );
      if ( success && callFunc ) {
        callFunc()
      }
    },
    *submitRecordTemplate( { payload, callFunc, isUpdate }, { call } ) {
      const { success, result } = isUpdate ? yield call( editRecordTemplate, payload ) : yield call( addRecordTemplate, payload );
      if ( success ) {
        const Result = isUpdate ? payload : result
        callFunc( Result );
      }
    },
    *getHistoryGainsData( { payload }, { call, put } ){
      const { success, result } = yield call( getHistoryGainsData, payload );
      if( success ){
        const historyGainsData = result;
        yield put( {
          type: 'SetState',
          payload: { historyGainsData },
        } );
      }
    },
    *deleteHistoryGains( { payload, callFunc }, { call } ) {
      const { success } = yield call( DeleteHistoryGains, payload );
      if ( success && callFunc ) {
        callFunc()
      }
    },
    *submitHistoryCategory( { payload, callFunc, isUpdate }, { call } ){
      const { success } = isUpdate ? yield call( editHistoryCategory, payload ) : yield call( AddHistoryCategory, payload );
      if ( success && callFunc ) {
        callFunc( payload )
      }
    },
    *getHistoryCategoryDetail( { payload, callFunc }, { call } ){
      const { success, result } = yield call( getHistoryCategoryDetail, payload );
      if ( success && callFunc ) {
        callFunc( result )
      }
    },
    *submitHistoryGainPeriod( { payload, isUpdate, callFunc }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = isUpdate ? yield call( editHistoryGainPeriod, payload )  :  yield call( addHistoryGainPeriod, payload ) 
      if ( success ){
        const Result = isUpdate ? payload:result
        callFunc( Result );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *deleteHistoryGainPeriod( { payload, callFunc }, { call } ){
      const { success, result } = yield call( deleteHistoryGainPeriod, payload );
      if ( success ) {
        callFunc( result );
      }
    },
    // *submitPrizeData( { payload:{ params, callFunc } }, { call } ){
    //   const data = params.id ? yield call( editPrizeData, params )  :  yield call( addPrizeData, params ) 
    //   if ( data.success ) {
    //     callFunc( data.result );
    //     message.success( data.message );
    //   } else {
    //     // message.error( data.message );
    //   }
    // },
    // *submitSecondKillData( { payload:{ params, callFunc } }, { call } ){;
    //   const data = params.id ? yield call( editSecondKillData, params )  :  yield call( addSecondKillData, params ) 
    //   if( data.success ){
    //     callFunc( data.result );
    //     message.success( data.message );
    //   }else{
    //     message.error( data.message );
    //   }
    // },
    // *deleteSecondKillData( { payload, callFunc }, { call } ){
    //   const { success, result } = yield call( deleteSecondKillData, payload );
    //   if ( success ) {
    //     callFunc( result );
    //   }
    // },
    // *submitGrabCouponData( { payload:{ params, callFunc } }, { call } ){;
    //   const { success, result } = params.id ? yield call( editGrabCouponData, params )  :  yield call( addGrabCouponData, params ) 
    //   if( success ){
    //     callFunc( result );
    //   }
    // },
    // *submitOrderGiftData( { payload, callFunc }, { call } ){;
    //   const { success, result } = payload.id ? yield call( editOrderGiftData, payload )  :  yield call( addOrderGiftData, payload ) 
    //   if( success ){
    //     callFunc( result );
    //   }
    // },
    // *submitDrawLotsData( { payload:{ params, callFunc } }, { call } ){
    //   const { success, result } = params.id ? yield call( editDrawLotsData, params )  :  yield call( addDrawLotsData, params ) 
    //   if( success ){
    //     callFunc( result );
    //   }
    // },
    // *deleteGrabCouponData( { payload, callFunc }, { call } ){
    //   const { success, result } = yield call( deleteGrabCouponData, payload );
    //   if ( success ) {
    //     callFunc( result );
    //   }
    // },
    // *deleteOrderGiftData( { payload, callFunc }, { call } ){
    //   const { success, result } = yield call( deleteOrderGiftData, payload );
    //   if ( success ) {
    //     callFunc( result );
    //   }
    // },
    // *deleteDrawLotsData( { payload, callFunc }, { call } ){
    //   const { success, result } = yield call( deleteDrawLotsData, payload );
    //   if ( success ) {
    //     callFunc( result );
    //   }
    // },
    // *deletePrizeData( { payload, callFunc }, { call } ){
    //   const { success, result } = yield call( deletePrizeData, payload );
    //   if ( success ) {
    //     callFunc( result );
    //   }
    // },


    // 获取战绩数据列表
    *getHistoryGainsPeriod( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getHistoryGainsPeriod, payload );
      if ( success ) {
        yield put( {
          type: 'setHistoryGainsPeriod',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  获取战绩详情列表
    *getRecordDetailsList(  { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
     const detailResult = yield call( getRecordDetailsList, payload );
      if ( detailResult.success ) {
        callFunc( detailResult.result );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 用户反馈
    *getMessageTypes( { payload: { successsFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getMessageTypes );
      if ( success ) {
        yield put( {
          type: 'setMessageTypes',
          payload: result.list,
        } );
      }

      successsFunc( result.list[0].type );

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *getMessage( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getMessage, payload );
      if ( success ) {
        yield put( {
          type: 'setMessage',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 轮播图标签列表(运营位)
    *getBannerTags( _, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getBannerTags );
      if ( success ) {
        yield put( {
          type: 'setBannerTags',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 轮播图标签列表
    *getBanners( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getBanners, payload );
      if ( success ) {
        yield put( {
          type: 'setBanners',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *submitBanners( { payload: { params, callFunc } }, { call } ) {
      const data = params.id ? yield call( exitBanners, params ) : yield call( addBanners, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },
    *delBanners( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delBanners, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    // // 活动列表
    // *getActivityList( { payload }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
      
    //   const { success, result } = yield call( getActivityList, payload );
    //   if ( success ) {
    //     yield put( {
    //       type: 'setActivity',
    //       payload: result,
    //     } );
    //   }

    //   yield put( {
    //     type: 'setLoading',
    //     payload: false,
    //   } );
    // },

    // // 用户活动列表
    // *getActivitySituation( { payload }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
      
    //   const { success, result } = yield call( getActivitySituation, payload );
    //   if ( success ) {
    //     yield put( {
    //       type: 'setActivityUser',
    //       payload: result,
    //     } );
    //   }

    //   yield put( {
    //     type: 'setLoading',
    //     payload: false,
    //   } );
    // },

    // //  提交活动
    // *submitActivity( { payload: { params, isUpdate, callFunc } }, { call } ) {
    //   const data = isUpdate ? yield call( updateActivity, params ) : yield call( addActivity, params );;
    //   if ( data.success ) {
    //     callFunc();
    //     message.success( data.message );
    //   } else {
    //     message.error( data.message );
    //   }
    // },
    // // 提交特殊活动
    // *submitOtherActivity( { payload: { params, isUpdate, callFunc } }, { call } ) {
    //   let data = {}
    //    switch ( params.type ) {
    //     case 'SIGN': 
    //       data = isUpdate ? yield call( updateSignActivity, params ) : yield call( addSignActivity, params );
    //       break;
    //     case 'INTEGRAL':
    //       data = isUpdate ? yield call( updateIntegralActivity, params ) : yield call( addIntegralActivity, params );
    //       break;
    //      default: data={ message:'不存在该活动类型' };
    //   }
    //   if ( data.success ) {
    //     callFunc();
    //     message.success( data.message );
    //   } else {
    //     message.error( data.message );
    //   }
    // },
    // //  获取活动详情delActivity
    // *getActivityDetail( { payload: { id, type, callFunc } }, { call } ) {
    //   let detailResult;
    //   switch ( type ) {
    //     case 'SIGN': 
    //       detailResult = yield call( getSignActivityDetail, id );
    //       break;
    //     case 'INTEGRAL':
    //       detailResult = yield call( getIntegralActivityDetail, id );
    //       break;
    //     default:
    //       detailResult =  { message: '不存在该活动类型' };
    //   }
    //   if ( detailResult.success ) {
    //     callFunc( detailResult.result );
    //   }
    // },

    // //  删除活动
    // *delActivity( { payload: { id, type, callFunc } }, { call } ) {
    //   const detailResult = yield call( delActivity, { id, type } );
    //   if ( detailResult.success ) {
    //     callFunc();
    //     message.success( detailResult.message );
    //   } else {
    //     message.error( detailResult.message );
    //   }
    // },

    // // 活动优惠券
    // *getCouponList( { payload }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
      
    //   const { success, result } = yield call( getCouponList, payload );
    //   if ( success ) {
    //     yield put( {
    //       type: 'setCoupons',
    //       payload: result,
    //     } );
    //   }

    //   yield put( {
    //     type: 'setLoading',
    //     payload: false,
    //   } );
    // },

    // 获取平台列表
    *getPlatformListAll( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );

      const { success, result } = yield call( getPlatformListAll, payload );
      if ( success ) {
        yield put( {
          type: 'setPlatformyAll',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取对接功能列表
    *getDockingList( { payload }, { call, put } ) {
      const { success, result } = yield call( getDockingList, payload );
      if ( success ) {
        yield put( {
          type: 'setDocking',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 获取对接功能列表
    *getTaskTemplateList( { payload, callFunc }, { call } ) {
      const { success, result } = yield call( getTaskTemplateList, payload );
      if ( success ) {
      callFunc( result.list )
      }
    },
    //  获取奖品列表
    *getPrizeList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );

      const { success, result } = yield call( getPrizeList, payload );
      if ( success ) {
        yield put( {
          type: 'setPrizeList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 添加或编辑奖品
    *submitPrize( { payload: { params, callFunc, isUpdate } }, { call } ) {
      const data = isUpdate ? yield call( updatePrize, params ) : yield call( addPrize, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    //  删除奖品
    *delPrize( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delPrize, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },


    // 获取活动订单列表
    *getActiveOrder( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getActiveOrder, payload );
      if ( success ) { 
        yield put( {
          type: 'setActiveOrder',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      
    },

    // 获取活动订单统计数据
    *getAllActiveOrderAmounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getActiveOrderAmounts, payload );
      if ( success ) { 
        yield put( {
          type: 'setActiveOrderAmounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      
    },
    // // 查询商品与套餐列表(tree)
    // *getgoodsSpecs( _, { call, put } ) {

    //   const { success, result } = yield call( getgoodsSpecs );
    //   const arrTree = [];
    //   if ( success ) {
    //     result.forEach( item => {
    //       const obj = {
    //         title: item.name,
    //         value: `p_${item.id}`,
    //         key: `p_${item.id}`,
    //         selectable: false,
    //         children: [],
    //       }
    //       item.specs.forEach( specs => {
           
    //         obj.children.push( {
    //           title: specs.name,
    //           value: specs.id,
    //           key: specs.id,
    //         } )
    //       } )
    //       arrTree.push( { ...obj } )
    //     } );
        

    //     yield put( {
    //       type: 'setGoodsSpecsTree',
    //       payload: arrTree,
    //     } );
    //   }

    // },

  // // 获取口令活动列表
  // *getPasswordActivity( { payload }, { call, put } ) {
  //   yield put( {
  //     type: 'setLoading',
  //     payload: true,
  //   } );
  //   const { success, result } = yield call( getPasswordActivity, payload );
  //   if ( success ) { 
  //     yield put( {
  //       type: 'setPasswordActivity',
  //       payload: result,
  //     } );
  //   }
  //   yield put( {
  //     type: 'setLoading',
  //     payload: false,
  //   } );
  // },

  // // 添加或编辑口令活动
  // *submitPasswordActivity( { payload:{ params, callFunc } }, { call } ){;
  //   const { success, result } = params.id ? yield call( editPasswordActivity, params )  :  yield call( addPasswordActivity, params ) 
  //   if( success ){
  //     callFunc( result );
  //   }
  // },

  // // 删除口令活动
  // *deletePasswordActivity( { payload: { id, callFunc } }, { call } ) {
  //   const data = yield call( deletePasswordActivity, id );
  //   if ( data.success ) {
  //     callFunc();
  //     message.success( data.message );
  //   }
  // },

  // // 获取口令活动奖品列表
  // *getPasswordPrize( { payload, callFunc }, { call, put } ) {
  //   yield put( {
  //     type: 'setLoading',
  //     payload: true,
  //   } );
  //   const { success, result } = yield call( getPasswordPrize, payload );
  //   if ( success ) {
  //     callFunc( result )
  //     yield put( {
  //       type: 'setLoading',
  //       payload: false,
  //     } );
  //   }
  // },
    // // 根据活动id查找集卡活动所有数据
    // *getCollectDetail( { payload, callFunc }, { call, put, all } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const [collectInfo, cardData, prizeData ] = yield all( [
  
    //     yield call( getCollectCouponSpecs, payload ),
    //     yield call( getAllCardList, payload ),
    //     yield call( getPrizeListAll, payload ),
    //     // yield call( getAllTask, payload )
    //   ] )
    //   const collectDetail = Object.assign(
    //     collectInfo.result, 
    //     { cardInfoList: cardData.result },
    //     { prizeList: prizeData.result }
    //     )
    //   callFunc( collectDetail )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    // },
    // // 根据活动id查找集卡活动基本信息
    // *getCollectTaskList( { payload }, { call, put } ){
    //   const { success, result } = yield call( getCollectTaskList, payload );
    //   if ( success ) {
    //     yield put( { type: 'SetState', payload: { collectTaskList:result } } )
    //   }
    // },
    // // 根据活动id查找集卡活动基本信息
    // *getCollectCouponSpecs( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getCollectCouponSpecs, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 根据活动id查找集卡活动卡牌信息
    // *getAllCardList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getAllCardList, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // 添加或编辑模板消息
    *submitTemplateMessageData( { payload, callFunc }, { call } ){;
      const { success, result } = payload.id ? yield call( editTemplateMessageData, payload )  :  yield call( addTemplateMessageData, payload ) 
      if( success ){
        callFunc( result );
      }
    },

    // // 根据活动id查找集卡任务信息
    // *getAllAppointList( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getAllAppointList, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    

    // // 根据活动id查找集卡奖品信息
    // *getPrizeListAll( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getPrizeListAll, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // 获取模板消息列表
    *getTemplateMessageData( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getTemplateMessageData, payload );
      if ( success ) {
        if( callFunc )callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { templateMessageData: result },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
   
    
    //  // 编辑或添集卡活动
    //  *submitColletCards( { payload: { params, callFunc } }, { call } ) {
    //   const data = params.id ? yield call( editColletCards, params ) : yield call( addColletCards, params );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //   } else {
    //     callFunc();
    //     message.error( data.message );
    //   }
    // },
     // 编辑指定任务
    *submitAppointTask( { payload: { params, callFunc } }, { call } ) {
      const data = params.id ? yield call( editAppointTask, params ) : yield call( addAppointTask, params );
      if ( data.success ) {
        callFunc( data.result );
      } else {
        callFunc();
        message.error( data.message );
      }
    },
 
    *getWxAccessToken( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getWxAccessToken, payload );
      if ( success ) {
        if( callFunc )callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { wxAccesstoken: result },
        } );
      }
    },
    *getWxTemplateList( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getWxTemplateList, payload );
      if ( success ) {
        if( callFunc )callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { wxTemplateList: result.templateList },
        } );
      }
    },
    *getWxTagList( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getWxTagList, payload );
      if ( success ) {
        if( callFunc )callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { wxTagList: result.tags },
        } );
      }
    },

    // 删除消息模板列表
    *deleteTemplateMessageData( { payload, callFunc }, { call } ) {
      const data = yield call( deleteTemplateMessageData, payload );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },


    // //  删除集卡活动列表
    // *deleteCollectCards( { payload: { id, callFunc } }, { call } ) {
    //   const data = yield call( deleteCollectCards, id );
    //   if ( data.success ) {
    //     callFunc();
    //     message.success( data.message );
    //   }
    // },

    // 微信消息推送
    *postWxMessage( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( postWxMessage, payload );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    //  获取审核流程列表 
    *getAuditProcessList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getAuditProcessList, payload );
      if ( success ) {
        yield put( {
          type: 'setAuditProcessList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 切换审核流程状态 
    *auditProcessType( { payload, callFunc }, { call } ){;
      const data = yield call( auditProcessType, payload )
      // console.log( 'data', data )
      if( data.success ){
        callFunc( data.message );
      }
    },

    // //  获取全部活动列表
    // *getAllActivityList( { payload, callFunc }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getAllActivityList, payload );
    //   if ( success ) { 
    //     callFunc( result )
    //     yield put( {
    //       type: 'setAllActivityList',
    //       payload: result,
    //     } );
    //   }

    //   yield put( {
    //     type: 'setLoading',
    //     payload: false,
    //   } );
    // },

    // //  获取活动对应的点击人数
    // *getAppidList( { payload: { appidList }, callFunc }, { call } ){
    //   const data = yield call( getAppidList, appidList );
    //   if ( data.success ) { 
    //     callFunc( data.result )
    //   }
    // },


    // // 获取活动各个状态的数量
    // *getActivityStateNum( { payload: { callFunc } }, { call } ){
    //   const data = yield call( getActivityStateNum );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //     // message.success( data.message );
    //   }
    // },

    // //  删除活动
    // *deleteActivityData( { payload: { id, callFunc } }, { call } ) {
    //   const data = yield call( deleteActivityData, id );
    //   if ( data.success ) {
    //     callFunc();
    //     message.success( data.message );
    //   }
    // },

    // //  根据id获取答题活动信息
    // *getAnswerSpecsObj( { payload, callFunc }, { call } ){
    //   const { success, result } = yield call( getAnswerSpecsObj, payload );
    //   if ( success ) {
    //     callFunc( result )
    //   }
    // },

    // //  根据id获取答题活动题库数据
    // *getQuestionsObj( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const data = yield call( getQuestionsObj, payload );
    //   if ( data.success ) {
    //     callFunc( data.result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 所有题目
    // *getAllSubjects( { payload }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getAllSubjects, payload );
    //   if ( success ) {
    //     yield put( {
    //       type: 'setAllSubjects',
    //       payload: result,
    //     } );
    //   }

    //   yield put( {
    //     type: 'setLoading',
    //     payload: false,
    //   } );
    // },

    // // 标签列表
    // *getTagsList( { payload: { params, callFunc } }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getAllTagsList, params );
    //   if ( success ) {
    //     callFunc( result );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 添加或者编辑答题活动题目 
    // *submitQuestions( { payload:{  params }, callFunc }, { call } ) {
    //   const data = params.id ? yield call( exitQuestions, params ) : yield call( addQuestions, params );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //   } else {
    //     message.error( data.message );
    //   }
    // },

    // // 添加或者编辑答题活动基本信息 
    // *submitAnswerData( { payload:{  params, callFunc } }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const data = params.id ? yield call( exitAnswerData, params ) : yield call( addAnswerData, params );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   } else {
    //     // message.error( data.message );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 通过题目名字获取对应题目
    // *getTagsSubjectList( { payload:{ params, callFunc } }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getTagsSubjectList, params );
    //   if ( success ) {
    //     callFunc( result )
    //   }
    //   yield put( {
    //     type: 'setLoading',
    //     payload: false,
    //   } );
    // },
    

    //  获取平台账户列表
    *getAccountList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAccountList, payload );
      if ( success ) { 
        yield put( {
          type: 'setAccountList',
          payload: result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },


    //  平台账户操作
    *accountModal( { payload, callFunc }, { call, put } ) {
      yield put( {
        type:'setLoading',
        payload: true,
      } );
      const { type, params } = payload
      const serverObj = {
        dataModal:addAccount,
        payModal:addPayCapital,
        balanceModal:balanceMoney,
        lockModal:lockMoney,
        unLockModal:lockMoney,
      }
      const data= yield call( serverObj[type], params );      
      if( data.success ){
        callFunc();
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  获取平台资金详情列表
    *getAccountDetailsList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAccountDetailsList, payload );
      if ( success ) { 
        yield put( {
          type: 'setAccountDetailsList',
          payload: result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取账户总详情 
    *getAllAccountData( { payload, callFunc }, { call } ) {
      const data = yield call( getAllAccountData, payload )
      if ( data.success ) {
        callFunc( data.result );
      } else {
        message.error( data.message );
      }
    },

    // *getRedRainData( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getRedRainData, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // //  编辑或添加红包雨活动
    // *submitRedRain( { payload:{ params, callFunc } }, { call } ) {
    //   const data = params.id ? yield call( exitRedRain, params ) : yield call( addRedRain, params );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //   } else {
    //     message.error( data.message );
    //   }
    // },
    

    // //  获取抓娃娃活动信息
    // *getPrizeClawData( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getPrizeClawData, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // //  添加或编辑抓娃娃活动
    // *submitPrizeClaw( { payload:{ params, callFunc } }, { call, put } ) {
    //   const data = params.id ? yield call( exitPrizeClaw, params ) : yield call( addPrizeClaw, params );
    //   callFunc( data.result );
    // },

    // // 下单有礼 - 新增或修改下单有礼
    // *submitOrderPrizes( { payload:{ params, callFunc } }, { call, put } ){
    //   const { success, result } = params.id ? yield call( editOrderPrizes, params ) : yield call( addOrderPrizes, params );
    //     if ( success ) {
    //       callFunc( result )
    //       yield put( {
    //         type: 'setLoading',
    //         payload: false,
    //       } );
    //     }
    // },
    // // 编辑或添加猜涨跌活动 
    // *submitGuessGame( { payload:{ params, callFunc } }, { call } ) {
    //   const data = params.id ? yield call( editGuessGame, params ) : yield call( addGuessGame, params );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //   } else {
    //     message.error( data.message );
    //   }
    // },

    
    // *getGuessGame( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGuessGame, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // // 获取随机卡基本信息 
    // *getRandomCardData( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getRandomCardData, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    
    // 下单有礼 - 修改下单有礼
    // *editOrderPrizes({ payload, callFunc }, { call, put } ){
    //   yield put({
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const {success, result } = yield call(editOrderPrizes, payload);
    //   if (success){
    //     callFunc(result)
    //     yield put({
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // // 下单有礼 - 删除下单有礼
    // *delOrderPrizes( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( delOrderPrizes, payload );
    //   if ( success ){
        
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // // 下单有礼 - 查询指定下单有礼数据
    // *getOrderPrizes( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getOrderPrizes, payload );
    //   if ( success ){
    //     if( callFunc ){
    //       callFunc( result );
    //     }
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },
    // // 获取指定猜涨跌奖品列表
    // *getGuessPrizes( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGuessPrices, payload );
    //   if ( success ) {
    //     yield put( {
    //       type: 'SetState',
    //       payload: { prizesList:result },
    //     } );
        
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 获取指定猜涨跌积分  
    // *getGuessIntegral( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getGuessIntegral, payload );
    //   if ( success ) {
    //     yield put( {
    //       type: 'SetState',
    //       payload: { integralData:result },
    //     } );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 下单有礼 - 返回下单后奖品列表
    // *getOrderShowing( { payload }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getOrderShowing, payload );
    //   if ( success ){
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 商品种类列表
    // *getProducts( { payload }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getProducts, payload );
    //   if ( success ) {
    //     yield put( {
    //       type: 'SetState',
    //       payload: { productsList: result.list },
    //     } );
    //   }
    // },
    // // 编辑指定猜涨跌积分
    // *editGuessIntegral( { payload:{ params, callFunc } }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( editGuessIntegral, params );
    //   if ( success ) {
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //     if( callFunc ){
    //       callFunc();
    //     }
    //   }
    // },
    // // 新增指定猜涨跌积分
    // *addGuessIntegral( { payload:{ params, callFunc } }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( addGuessIntegral, params );
    //   if ( success ) {
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //     if( callFunc ){
    //       callFunc();
    //     }
    //   }
    // },

    // // 编辑或添加随机卡
    // *submitRandomCard( { payload: { params, callFunc } }, { call, put } ) {
    //   const data = params.id ? yield call( exitRandomCard, params ) : yield call( addRandomCard, params );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //   } else {
    //     message.error( data.message );
    //   }
    // },

    // // 根据活动ID获取活动信息
    // *getActivityData( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( getActivityData, payload );
    //   if ( success ) {
    //     callFunc( result )
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    // // 编辑或添加活动
    // *submitActivityData( { payload: { params, callFunc } }, { call, put } ) {
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const data = params.id ? yield call( editActivityData, params ) : yield call( addActivityData, params );
    //   if ( data.success ) {
    //     callFunc( data.result );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   } else {
    //     message.error( data.message );
    //   }
    // },
    
    // // 删除活动
    // *delActivityData( { payload, callFunc }, { call, put } ){
    //   yield put( {
    //     type: 'setLoading',
    //     payload: true,
    //   } );
    //   const { success, result } = yield call( delActivityData, payload );
    //   if ( success ){
    //     callFunc( result );
    //     yield put( {
    //       type: 'setLoading',
    //       payload: false,
    //     } );
    //   }
    // },

    //  获取事件列表
    *getEventList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getTaskEventList, payload );
      if ( data.success ) {
        callFunc( data.result )
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    //  获取文章列表 
    *getPaperList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getPaperList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { paperList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    //  添加，编辑文章 upaddPaper
    *submitPaper( { payload:{ params, callFunc } }, { call } ) {
      const data = params.id ? yield call( editPaper, params ) : yield call( addPaper, params );
      if ( data.success ) {
        callFunc( data.result );
      }
    },

    //  删除文章 
   *delPaper( { payload, callFunc }, { call } ){
      const { success } = yield call( delPaper, payload );
      if ( success ){
        callFunc();
      }
    },

    // 文章审核 
    *goAudit( { payload, callFunc }, { call } ) {
      const data = yield call( goAudit, payload );
      if ( data.success ) {
        callFunc();
        message.success( data.message )
      }
    },
    //  获取审核列表 
    *getAuditList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getAuditList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { auditList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },
    //  获取审核记录列表
    *getRecordList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getRecordList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { recordList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

  },


  
  reducers: {
    SetState( state, { payload } ){
      return {
        ...state,
        ...payload
      }
    },
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
    setBannerTags( state, { payload } ) {
      return {
        ...state,
        bannerTags: payload,
      };
    },
    setMessageTypes( state, { payload } ) {
      return {
        ...state,
        messageTypes: payload,
      };
    },
    setBanners( state, { payload } ) {
      return {
        ...state,
        banners: payload,
      };
    },
    setMessage( state, { payload } ) {
      return {
        ...state,
        message: payload,
      };
    },
    // setActivity( state, { payload } ) {
    //   return {
    //     ...state,
    //     activityList: payload,
    //   };
    // },
    // setActivityUser( state, { payload } ) {
    //   return {
    //     ...state,
    //     activityUserList: payload,
    //   };
    // },
    // setCoupons( state, { payload } ) {
    //   return {
    //     ...state,
    //     couponList: payload,
    //   };
    // },
    setPlatformyAll( state, { payload } ) {
      return {
        ...state,
        platformyListAll: payload,
      };
    },
    setDocking( state, { payload } ) {
      return {
        ...state,
        dockingList: payload,
      };
    },
    setPrizeList( state, { payload } ) {
      return {
        ...state,
        prizeManageList: payload,
      };
    },
    setHistoryGainsPeriod( state, { payload } ) {
      return {
        ...state,
        historyGainsPeriod: payload,
      };
    },
    // setActiveOrder( state, { payload } ){
    //   return {
    //     ...state,
    //     activeOrderList: payload,
    //   };
    // },
    // setActiveOrderAmounts( state, { payload } ){
    //   return {
    //     ...state,
    //     allAmounts: payload,
    //   };
    // },
    setGoodsSpecsTree( state, { payload } ) {
      return {
        ...state,
        goodsSpecsTree: payload,
      };
    },
    // setPasswordActivity( state, { payload } ){
    //   return {
    //     ...state,
    //     passwordActivity: payload,
    //   };
    // },
    setAuditProcessList( state, { payload } ) {
      return {
        ...state,
        auditProcessList: payload,
      };
    },
    // setAllActivityList( state, { payload } ) {
    //   return {
    //     ...state,
    //     allActivityList: payload,
    //   };
    // },
    // setAllSubjects( state, { payload } ) {
    //   return {
    //     ...state,
    //     allSubjectsResult: payload,
    //   };
    // },
    setAccountList( state, { payload } ) {
      return {
        ...state,
        accountList: payload,
      };
    },
    setAccountDetailsList( state, { payload } ) {
      return {
        ...state,
        accountDetailsList: payload,
      };
    },
  },
};

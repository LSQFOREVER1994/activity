import { message } from 'antd';
import {
  getAllActivityList, getAppidList, getActivityStateNum, deleteActivityData,
  getMiniShareData,
  getAllPrizeList, getSinglePrizeList,
  getActivityData, editActivityData, addActivityData,
  getGuessIntegral, editGuessIntegral, addGuessIntegral,
  getAllSubjects, getAllTagsList, getTagsSubjectList, exitQuestions, addQuestions, getQuestionsObj, 
  getFlashSaleSpecsList, editSecondKillData, addSecondKillData,
  getGrabCouponSpecsList, editGrabCouponData, addGrabCouponData,
  // getPasswordPrize, editPasswordActivity, addPasswordActivity,
  // getCollectCouponSpecs, getAllCardList, getPrizeListAll, getCollectTaskList, getAllAppointList, editColletCards, addColletCards, deleteCollectCards,
  getPurchasesRecordData,
} from '@/services/tool.service';

import { getActivityResource, getActivityResourceType } from '@/services/crop.service';

import {
  getProducts
} from '@/services/strategyMall.service';

export default{
  namespace: 'activity',
  state:{
    loading: false,
    activityLoading:false,
    allActivityList:{
      total: 0,
      list: [],
    },
    allList:{
      total: 0,
      list: [],
    },
    productsList:[],
    prizesList:[],
    allPrizeList:[],
    allSubjectsResult: [], // 所有题目
    collectTaskList:[],
    purchasesRecordData:{
      list:[],
      total:0
    },
  },

  effects:{
    //  获取全部活动列表
    *getAllActivityList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAllActivityList, payload );
      if ( success ) { 
        callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { allActivityList:result },
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    
    //  获取活动资源类型列表
    *getActivityResourceType( { payload: { callFunc } }, { call } ){
      // yield put( {
      //   type: 'setLoading',
      //   payload: true,
      // } );

      const data = yield call( getActivityResourceType );
      if ( data.success ) { 
        callFunc( data.result )
      }
    },
    //  分页获取活动资源
    *getActivityResource( { payload, oldList, success }, { call, put } ){
      const data = yield call( getActivityResource, payload );

      if ( data.success ) { 
        const { pages, list, total } = data.result;
        yield put( {
          type: 'SetState',
          payload: { allList: {
            total,
            list: oldList.concat( list ),
          } },
        } );
        success( pages )
      }
    },

    //  获取活动对应的点击人数
    *getAppidList( { payload: { appidList }, callFunc }, { call } ){
      const data = yield call( getAppidList, appidList );
      if ( data.success ) { 
        callFunc( data.result )
      }
    },


    // 获取活动各个状态的数量
    *getActivityStateNum( { payload: { callFunc } }, { call } ){
      const data = yield call( getActivityStateNum );
      if ( data.success ) {
        callFunc( data.result );
        // message.success( data.message );
      }
    },

    //  删除活动
    *deleteActivityData( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( deleteActivityData, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    *getMiniShareData( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getMiniShareData, payload );
      if ( success ) {
        callFunc( result )
      }else{
        callFunc()
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取所有奖品
    *getAllPrizeList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAllPrizeList, payload );
      if ( success ) {
        const allPrizeList = result.list;
        if ( callFunc ) callFunc( allPrizeList )
        yield put( {
          type: 'SetState',
          payload: { allPrizeList },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    //  根据ID 获取单个奖品 
    *getSinglePrizeList( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getSinglePrizeList, payload );
      if ( success ) {
        callFunc( result )
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    // 根据活动ID获取活动信息
    *getActivityData( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getActivityData, payload );
      if ( success ) {
        callFunc( result )
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    // 编辑或添加活动
    *submitActivityData( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { activityLoading:true },
      } );
      const data = params.id ? yield call( editActivityData, params ) : yield call( addActivityData, params );
      if ( data && data.success ) {
        callFunc( data.result );
        yield put( {
          type: 'SetState',
          payload: { activityLoading:false },
        } );
      }else {
        yield put( {
          type: 'SetState',
          payload: { activityLoading:false },
        } );
      }
    },

    //  获取秒杀活动数据
    *getFlashSaleSpecsList( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getFlashSaleSpecsList, payload );
      if ( success ) {
        // const flashSaleSpecsList = result.flashSaleSpecs;
        // yield put( {
        //   type: 'SetState',
        //   payload: { flashSaleSpecsList },
        // } );
        callFunc( result )
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    //  秒杀添加或编辑
    *submitSecondKillData( { payload:{ params, callFunc } }, { call } ){;
      const data = params.id ? yield call( editSecondKillData, params )  :  yield call( addSecondKillData, params ) 
      if( data.success ){
        callFunc( data );
        message.success( data.message );
      }else{
        message.error( data.message );
      }
    },
    // 抢券获取
    *getGrabCouponSpecsList( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGrabCouponSpecsList, payload );
      if ( success ) {
        callFunc( result )
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    // 抢券编辑
    *submitGrabCouponData( { payload:{ params, callFunc } }, { call } ){;
      const data= params.id ? yield call( editGrabCouponData, params )  :  yield call( addGrabCouponData, params ) 
      if( data.success ){
        callFunc( data );
      }
    },
    // 获取指定猜涨跌积分  
    *getGuessIntegral( { payload: { params, callFunc } }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGuessIntegral, params );
      if ( success ) {
        if( callFunc )callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { integralData:result },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    // 编辑指定猜涨跌积分
    *editGuessIntegral( { payload:{ params, callFunc } }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success } = yield call( editGuessIntegral, params );
      if ( success ) {
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
        if( callFunc ){
          callFunc();
        }
      }
    },
    // 新增指定猜涨跌积分
    *addGuessIntegral( { payload:{ params, callFunc } }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success } = yield call( addGuessIntegral, params );
      if ( success ) {
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
        if( callFunc ){
          callFunc();
        }
      }
    },

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

    // 所有题目
    *getAllSubjects( { payload }, { call, put } ) {
      const { pageNum, pageSize, list } = payload
      
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAllSubjects, { pageNum, pageSize } );
      console.log( result );
      if( result.list.length !== 0 ) {
       const preList = list || []
       const totalResult =  preList.concat( result.list )
       result.list = totalResult
       if ( success ) {
        yield put( {
          type: 'SetState',
          payload:{ allSubjectsResult: result },
        } );
      }
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 添加或者编辑答题活动题目
    *submitQuestions( { payload:{  params }, callFunc }, { call } ) {
      const data = params.id ? yield call( exitQuestions, params ) : yield call( addQuestions, params );
      if ( data.success ) {
        callFunc( data.result );
      } else {
        message.error( data.message );
      }
    },
    
    // 标签列表
    *getTagsList( { payload: { params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAllTagsList, params );
      if ( success ) {
        callFunc( result );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    //  根据id获取答题活动题库数据
    *getQuestionsObj( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getQuestionsObj, payload );
      if ( data.success ) {
        callFunc( data.result )
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    // 通过题目名字获取对应题目
    *getTagsSubjectList( { payload:{ params, callFunc } }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getTagsSubjectList, params );
      if ( success ) {
        callFunc( result )
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

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

    // // 添加或编辑口令活动
    // *submitPasswordActivity( { payload:{ params, callFunc } }, { call } ){;
    //   const { success, result } = params.id ? yield call( editPasswordActivity, params )  :  yield call( addPasswordActivity, params ) 
    //   if( success ){
    //     callFunc( result );
    //   }
    // },

  //   // 根据活动id查找集卡活动所有数据
  //   *getCollectDetail( { payload, callFunc }, { call, put, all } ) {
  //     yield put( {
  //       type: 'setLoading',
  //       payload: true,
  //     } );
  //     const [collectInfo, cardData, prizeData ] = yield all( [
  
  //       yield call( getCollectCouponSpecs, payload ),
  //       yield call( getAllCardList, payload ),
  //       yield call( getPrizeListAll, payload ),
  //       // yield call( getAllTask, payload )
  //     ] )
  //     const collectDetail = Object.assign(
  //       collectInfo.result, 
  //       { cardInfoList: cardData.result },
  //       { prizeList: prizeData.result }
  //       )
  //     callFunc( collectDetail )
  //       yield put( {
  //         type: 'setLoading',
  //         payload: false,
  //       } );
  //   },
  //   // 根据活动id查找集卡活动基本信息
  //   *getCollectTaskList( { payload }, { call, put } ){
  //     const { success, result } = yield call( getCollectTaskList, payload );
  //     if ( success ) {
  //       yield put( { type: 'SetState', payload: { collectTaskList:result } } )
  //     }
  //   },
  //  // 根据活动id查找集卡活动基本信息
  //  *getCollectCouponSpecs( { payload, callFunc }, { call, put } ){
  //     yield put( {
  //       type: 'setLoading',
  //       payload: true,
  //     } );
  //     const { success, result } = yield call( getCollectCouponSpecs, payload );
  //     if ( success ) {
  //       callFunc( result )
  //       yield put( {
  //         type: 'setLoading',
  //         payload: false,
  //       } );
  //     }
  //   },

  //   // 根据活动id查找集卡活动卡牌信息
  //   *getAllCardList( { payload, callFunc }, { call, put } ){
  //     yield put( {
  //       type: 'setLoading',
  //       payload: true,
  //     } );
  //     const { success, result } = yield call( getAllCardList, payload );
  //     if ( success ) {
  //       callFunc( result )
  //       yield put( {
  //         type: 'setLoading',
  //         payload: false,
  //       } );
  //     }
  //   },
  //   // 根据活动id查找集卡任务信息
  //   *getAllAppointList( { payload, callFunc }, { call, put } ){
  //     yield put( {
  //       type: 'setLoading',
  //       payload: true,
  //     } );
  //     const { success, result } = yield call( getAllAppointList, payload );
  //     if ( success ) {
  //       callFunc( result )
  //       yield put( {
  //         type: 'setLoading',
  //         payload: false,
  //       } );
  //     }
  //   },
  //   // 根据活动id查找集卡奖品信息
  //   *getPrizeListAll( { payload, callFunc }, { call, put } ){
  //     yield put( {
  //       type: 'setLoading',
  //       payload: true,
  //     } );
  //     const { success, result } = yield call( getPrizeListAll, payload );
  //     if ( success ) {
  //       callFunc( result )
  //       yield put( {
  //         type: 'setLoading',
  //         payload: false,
  //       } );
  //     }
  //   },
  //   // 编辑或添集卡活动
  //   *submitColletCards( { payload: { params, callFunc } }, { call } ) {
  //     const data = params.id ? yield call( editColletCards, params ) : yield call( addColletCards, params );
  //     if ( data.success ) {
  //       callFunc( data.result );
  //     } else {
  //       callFunc();
  //       message.error( data.message );
  //     }
  //   },
  //   //  删除集卡活动列表
  //   *deleteCollectCards( { payload: { id, callFunc } }, { call } ) {
  //     const data = yield call( deleteCollectCards, id );
  //     if ( data.success ) {
  //       callFunc();
  //       message.success( data.message );
  //     }
  //   },
    // 商品种类列表
    *getProducts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getProducts, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { productsList: result.list },
        } );
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
  },
  reducers:{
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
  }
}
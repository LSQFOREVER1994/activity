import {
  getReissueList, addReissue, getBufaInfo, getBufaFailedUserList,
  getActivityIdNames, getPrizeTypeList, getPrizeList, getTaskList, getMerchantList,
  getVisibleGoodsList
} from '@/services/rewardReissue.service';
import { getInfoPrizeList } from '@/services/bees.service';


export default {
  namespace: 'rewardReissue',

  state: {
    loading: false,
    rewardReissueMap: {
      total: 0,
      list: [],
    },
    bees: {
      total: 0,
      list: [],
    },
    searchActivityListMap: [],
    prizeTypeList: [],
    prizeList: [],
    taskList: [],
    merchantList: [],
    merchantVisibleList: [],
    activityPrizes: []
  },

  effects: {
    // 查询活动内奖品列表
    *getInfoPrizeList( { payload: { query, callBackFunc } }, { call, put } ) {
      const data = yield call( getInfoPrizeList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            activityPrizes: data.result
          },
        } );
        if ( callBackFunc ) callBackFunc( data.result )
      }
    },

    // 查询奖品类型
    *getPrizeTypeList( { payload }, { call, put } ) {
      const data = yield call( getPrizeTypeList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { prizeTypeList: data.result },
        } );
      }
    },
    // 模糊搜索奖品
    *getPrizeList( { payload, callBackFunc }, { call, put } ) {
      const data = yield call( getPrizeList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { prizeList: data.result.list },
        } );
        if ( callBackFunc ) {
          callBackFunc( data.result.list )
        }
      }
    },
    // 获取积分次数补发列表
    *getReissueList( { payload, successFun }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getReissueList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { rewardReissueMap: data.result },
        } );
        if ( successFun ) successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    *getActivityIdNames( { payload, successFun }, { call, put } ) {
      const data = yield call( getActivityIdNames, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { bees: data.result },
        } );
        if ( successFun ) successFun( data.result )
      }
    },
    // 搜索活动列表
    *SearchActivityIdNameList( { payload: { query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getActivityIdNames, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { bees: data.result },
        } );
        if ( callFunc ) callFunc()
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 获取单个补发详情
    *getBufaInfo( { payload: { query, callBackFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getBufaInfo, query );
      if ( data.success ) {
        if ( callBackFunc ) callBackFunc( data.result )
      }
      if ( callBackFunc ) callBackFunc( data.result || data )
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 新增补发
    *addToReissue( { payload: { query, callBackFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( addReissue, query );
      if ( data.success ) {
        if ( callBackFunc ) callBackFunc( true )
      } else if ( callBackFunc ) callBackFunc( false )
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // // 导出补发用户名单
    // *exportBufaUserList( { payload: { query, callBackFunc } }, { call, } ) {
    //   const data = yield call( exportBufaUserList, query );
    //   if ( callBackFunc ) callBackFunc( data )
    // },

    // 查询补发失败用户名单
    *getBufaFailedUserList( { payload: { query, callBackFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getBufaFailedUserList, query );
      if ( data.success ) {
        callBackFunc( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 获取补发任务列表
    *getTaskList( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getTaskList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            taskList: data.result
          },
        } );
        if ( successFun ) successFun( data.result )
      }
    },
    // 获取商户可见列表
    *getVisibleGoodsList( { payload, callBackFunc }, { call, put } ) {
      const data = yield call( getVisibleGoodsList, payload );
      if ( data?.success ) {
        yield put( {
          type: 'SetState',
          payload: { merchantVisibleList: data.result.list },
        } );
      }
      if ( callBackFunc ) callBackFunc( data.result.list, data.result );

    },

    // 获取商户列表
    *getMerchantList( { payload, callBackFunc }, { call, put } ) {
      const data = yield call( getMerchantList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { merchantList: data.result },
        } );
        if ( callBackFunc ) callBackFunc( data.result );
      }
    },
  },


  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload
      }
    },
  },
};

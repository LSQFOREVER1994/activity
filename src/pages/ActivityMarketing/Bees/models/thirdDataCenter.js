import {
  getBeesInfo,
  getPrizeInventory,
  getElementDataType,
  importActivityBlacklist,
  isInBlacklist,
  // downloadBlackList,
  deleteBlackList,
  getPushSetting,
  updatePushSetting,
} from '@/services/bees.service';
import { getAppointAppData } from '@/services/statistics.service'

export default {
  namespace: 'thirdDataCenter',

  state: {
    loading: false,
    activityDetail: {},
    appPointData: {}, // 数据中心活动信息
    prizeInventory: {}, // 奖品库存信息
    isHasBlackList: false,
  },


  effects: {
    *getBeesInfo( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getBeesInfo, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            activityDetail: data.result
          },
        } );
        successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    *getAppointAppData( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getAppointAppData, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            appPointData: data.result
          },
        } );
        successFun( data.result )
      }
    },

    *getPrizeInventory( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getPrizeInventory, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            prizeInventory: data.result
          },
        } );
        successFun( data.result )
      }
    },

    *getElementDataType( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getElementDataType, query );
      if ( data.success ) {
        successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    *importBlackList( { payload: { query, successFun } }, { call, } ) {
      const data = yield call( importActivityBlacklist, query );
      if ( data.success ) {
        successFun( data.result )
      }
    },

    *isInBlacklist( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( isInBlacklist, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            isHasBlackList: data.result
          },
        } );
        successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    *deleteBlackList( { payload: { query, successFun } }, { call } ) {
      const data = yield call( deleteBlackList, query );
      if ( data.success ) {
        successFun( data.result )
      }
    },


    *getPushSetting( { payload, successFun }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getPushSetting, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    *updatePushSetting( { payload, successFun }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( updatePushSetting, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    }
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

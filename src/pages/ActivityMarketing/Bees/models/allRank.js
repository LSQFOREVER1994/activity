import { getAllRankData } from '@/services/allRankData.service'
import { getUserIntergralRecord } from '@/services/reward.service';

export default {
  namespace: 'allRankData',
  state: {
    loading: false,
    allRankData: {
      total: 0,
      list: []
    },
    userInterGralList: {
      total: 0,
      list: []
    }
  },

  effects: {
    *getAllRankData( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getAllRankData, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            allRankData: data.result
          },
        } );
        successFun()
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 获取用户具体积分明细
    *getUserIntergralRecord( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getUserIntergralRecord, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { userInterGralList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
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

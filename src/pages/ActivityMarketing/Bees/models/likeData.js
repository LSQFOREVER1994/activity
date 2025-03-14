// import { message } from 'antd';
import { getLikeLineData, getLikeStatistics } from '@/services/like.service';

export default {
  namespace: 'likeData',

  state: {
    loading: false,
    recordList: {
      total: 0,
      list: [],
    },
    lineData: {
      total: 0,
      statistics: [],
    }
  },

  effects: {
    *getLikeLineData( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getLikeLineData, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { lineData: data.result },
        } );
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
      if( callFunc ) callFunc();

    },

    *getLikeStatistics( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getLikeStatistics, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { recordList: data.result },
        } );
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
      if( callFunc ) callFunc();
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

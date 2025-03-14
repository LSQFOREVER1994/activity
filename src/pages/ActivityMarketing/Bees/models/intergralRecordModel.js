// import { message } from 'antd';
import { getIntergralRecord, getUserIntergralRecord } from '@/services/reward.service';

export default {
  namespace: 'intergralRecordModel',

  state: {
    loading: false,
    recordList: {
      total: 0,
      list: [],
    },
    userInterGralList: {
      total: 0,
      list: []
    }
  },


  effects: {
    // 获取活动积分明细
    *getIntergralRecord( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getIntergralRecord, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { recordList: data.result },
        } );
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

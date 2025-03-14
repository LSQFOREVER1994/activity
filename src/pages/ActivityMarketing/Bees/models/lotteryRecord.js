import getLotteryRecord from '@/services/lotteryRecord.service';

export default {
  namespace: 'lotteryRecord',
  state: {
    loading: false,
    lotteryList: {
      total: 0,
      list: [],
    },
  },

  effects: {
    *getLotteryRecord( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getLotteryRecord, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { lotteryList: data.result },
        } );
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
      if ( callFunc ) callFunc();

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

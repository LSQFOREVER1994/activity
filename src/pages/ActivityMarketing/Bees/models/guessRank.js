// import { message } from 'antd';
import { getGuessRank, getGuessRecords } from '@/services/rank.service';

export default {
  namespace: 'guessRank',

  state: {
    loading: false,
    GuessRankMap: {
      total: 0,
      list: [],
    },
    guessRecordMap: {
      total: 0,
      list: [],
    },
  },


  effects: {
    // 获取猜涨跌排行榜列表
    *getGuessRank( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getGuessRank, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { GuessRankMap: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    // 获取用户详情
    *getGuessRecords( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getGuessRecords, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { guessRecordMap: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
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

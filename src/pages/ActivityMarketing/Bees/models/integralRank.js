// import { message } from 'antd';
import { getIntegralRank, getIntegralRecords } from '@/services/rank.service';

export default {
  namespace: 'integralRank',

  state: {
    loading: false,
    IntegralRankMap: {
      total: 0,
      list: [],
    },
    integralRecordMap: {
      total: 0,
      list: [],
    },
  },


  effects: {
    // 获取猜涨跌排行榜列表
    *getIntegralRank( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getIntegralRank, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { IntegralRankMap: data.result },
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
    *getIntegralRecords( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getIntegralRecords, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { integralRecordMap: data.result },
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

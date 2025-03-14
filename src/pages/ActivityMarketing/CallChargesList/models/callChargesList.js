// import { message } from 'antd';
import { getCallChargesList, getResourcRecharge } from '@/services/callChargesList.service';

export default {
  namespace: 'callCharges',

  state: {
    loading: false,
    callChargesMap: {
      total: 0,
      list: [],
    },
  },


  effects: {
    // 获取话费充值列表
    *getCallChargesList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getCallChargesList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { callChargesMap: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },
    // 重试话费充值
    *getResourcRecharge( { payload: { query, callBack } }, { call } ) {
      const data = yield call( getResourcRecharge, query );
        callBack( data );
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

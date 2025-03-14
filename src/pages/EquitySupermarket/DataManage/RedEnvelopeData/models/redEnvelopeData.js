import { getMerchantNames, getRedEnvelopeData } from '@/services/merchantManage.service';

export default {
  namespace: 'redEnvelopeData',

  state: {
    loading: false,
    data: {
      total: 0,
      records: [],
    },
    merchantNames: [],
  },

  effects: {
    // 商户名称列表
    *getMerchantNames( { payload }, { call, put } ) {
      const { success, result } = yield call( getMerchantNames, payload );
      if ( success ) {
        yield put( {
          type: 'setMerchantNames',
          payload: result,
        } );
      }
    },

    // 获取红包数据
    *getRedEnvelopeData( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getRedEnvelopeData, payload );
      if ( success ) {
        yield put( {
          type: 'setData',
          payload: result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
  },

  reducers: {
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
    setData( state, { payload } ) {
      return {
        ...state,
        data: payload,
      };
    },
    setMerchantNames( state, { payload } ) {
      return {
        ...state,
        merchantNames: payload,
      };
    },
  },
};

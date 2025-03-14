import { getWithdrawOrderList, auditWithdrawOrder } from '@/services/equityDataManage.service';
import { getMerchantNames } from '@/services/merchantManage.service';

export default {
  namespace: 'withdrawOrder',

  state: {
    loading: false,
    withdrawOrderList: {
      total: 0,
      list: [],
    },
    merchantNames: undefined,

  },


  effects: {
    // 获取列表
    *getWithdrawOrderList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getWithdrawOrderList, payload );
      if ( success ) {
        yield put( {
          type: 'setWithdrawOrderList',
          payload: result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 商户名称列表
    *getMerchantNames( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getMerchantNames, payload );
      if ( success ) {
        yield put( {
          type: 'setMerchantNames',
          payload: result,
        } );
        callBackFunc( result )
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *auditWithdrawOrder( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( auditWithdrawOrder, payload );
      if ( success ) {
        callFunc( message )
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
    setWithdrawOrderList( state, { payload } ) {
      return {
        ...state,
        withdrawOrderList: payload,
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

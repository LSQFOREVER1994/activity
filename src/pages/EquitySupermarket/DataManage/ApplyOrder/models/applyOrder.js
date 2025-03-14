import {
  getApplyOrderList,
  getMerchantNameList,
  fetchEquityApply,
  fetchEquityAudit,
  fetchEquitySend,
  fetchEquityCancel,
  getSingleGoodsDetail,
  getSingleOrderDetail,
  getStatusCount,
} from '@/services/equityDataManage.service';

export default {
  namespace: 'applyOrder',

  state: {
    loading: false,
    auditLoading: false,
    sendLoading: false,
    cancelLoading: false,
    applyOrderListResult: {
      total: 0,
      list: []
    },
    merchantListResult: {
      total: 0,
      list: []
    },
    statusResult: [],
    singleGoodsResult: {}
  },


  effects: {
    // 获取申请订单列表
    *getApplyOrderList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getApplyOrderList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setApplyOrderList',
          payload: data.result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      if ( callBackFunc ) callBackFunc( data )

    },

    // 获取权益商户列表
    *getMerchantNameList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getMerchantNameList, payload );
      if ( success ) {
        yield put( {
          type: 'setMerchantNameList',
          payload: result,
        } );
        if ( callBackFunc ) callBackFunc( result )
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取单个商品详情
    *getSingleGoodsDetail( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getSingleGoodsDetail, payload );
      if ( data.success ) {
        yield put( {
          type: 'setSingleGoodsInfo',
          payload: data.result,
        } );
      }
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取单个订单详情
    *getSingleOrderDetail( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getSingleOrderDetail, payload );
      if ( data.success ) {
        yield put( {
          type: 'setSingleOrderInfo',
          payload: data.result,
        } );
      }
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },




    // 权益订单申请
    *fetchEquityApply( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( fetchEquityApply, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 权益订单审核
    *fetchEquityAudit( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setAuditLoading',
        payload: true,
      } );
      const data = yield call( fetchEquityAudit, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setAuditLoading',
        payload: false,
      } );
    },

    // 权益订单发送
    *fetchEquitySend( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setSendLoading',
        payload: true,
      } );
      const data = yield call( fetchEquitySend, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setSendLoading',
        payload: false,
      } );
    },

    // 权益订单取消
    *fetchEquityCancel( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setCancelLoading',
        payload: true,
      } );
      const data = yield call( fetchEquityCancel, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setCancelLoading',
        payload: false,
      } );
    },

    // 审核类型数量
    *getStatusCount( { payload }, { call, put } ) {
      const data = yield call( getStatusCount, payload );
      if ( data.success ) {
        yield put( {
          type: 'setStatusCount',
          payload: data.result,
        } );
      }
    },

  },


  reducers: {
    setApplyOrderList( state, { payload } ) {
      return {
        ...state,
        applyOrderListResult: payload
      }
    },
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload
      }
    },
    setAuditLoading( state, { payload } ) {
      return {
        ...state,
        auditLoading: payload
      }
    },
    setSendLoading( state, { payload } ) {
      return {
        ...state,
        sendLoading: payload
      }
    },
    setCancelLoading( state, { payload } ) {
      return {
        ...state,
        cancelLoading: payload
      }
    },
    setMerchantNameList( state, { payload } ) {
      return {
        ...state,
        merchantListResult: payload
      }
    },
    setSingleGoodsInfo( state, { payload } ) {
      return {
        ...state,
        singleGoodsResult: payload
      }
    },
    setStatusCount( state, { payload } ) {
      return {
        ...state,
        statusResult: payload
      }
    },
  },
};

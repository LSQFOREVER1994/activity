import {
  getConsumeOrderList,
  fetchConsumeExpressAlterOrSend,
  getMerchantNameList,
  fetchMultiSend,
  getExpressList,
  changeExpressSubscribe,
  getLogisticsData,
} from '@/services/equityDataManage.service';

export default {
  namespace: 'consumeOrder',

  state: {
    loading: false,
    consumeOrderListResult: {
      total: 0,
      list: [],
    },
    expressList: [],
  },


  effects: {
    // 获取消耗订单列表
    *getConsumeOrderList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getConsumeOrderList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setConsumeOrderList',
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
      const data = yield call( getMerchantNameList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setMerchantNameList',
          payload: data.result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      if ( callBackFunc ) callBackFunc( data )
    },

    // 获取物流公司列表
    *getExpressList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } )
      const data = yield call( getExpressList, payload )
      if ( data.success ) {
        yield put( {
          type: 'setExpressList',
          payload: data.result,
        } )
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } )
    },

    // 获取物流公司列表
    *getLogisticsData( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } )
      const data = yield call( getLogisticsData, payload )
      if ( data.success ) {
        if ( callBackFunc ) callBackFunc( data.result )
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } )
    },

    // 修改物流订阅状态
    *changeExpressSubscribe( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } )
      const data = yield call( changeExpressSubscribe, payload )
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } )
    },

    // 消耗订单 - 物流信息修改或发货
    *fetchConsumeExpressAlterOrSend( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( fetchConsumeExpressAlterOrSend, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 批量发货
    *fetchMultiSend( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( fetchMultiSend, payload );
      if ( callBackFunc ) callBackFunc( data )
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
        loading: payload
      }
    },
    setConsumeOrderList( state, { payload } ) {
      return {
        ...state,
        consumeOrderListResult: payload
      }
    },
    setExpressList( state, { payload } ) {
      return {
        ...state,
        expressList: payload
      }
    }
  },
};

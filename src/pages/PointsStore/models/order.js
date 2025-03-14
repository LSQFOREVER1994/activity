// import { message } from 'antd';

import {
  getOrderInfoList,
  getLogistics,
  changeShelf,
  delShelf,
  getOrderInfo,
  getDelivery,
  refuseGoods,
} from '@/services/pointsStore.service';

export default {
  namespace: 'order',

  state: {
    loading: false,
    orders: {
      total: 0,
      list: [],
    },
    logistics: [],
  },

  effects: {
    // 获取商品列表
    *changeShelf( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( changeShelf, payload );
      if ( success ) {
        callFunc( message );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 获取订单列表
    *getOrderInfoList(
      {
        payload: { query, successFun },
      },
      { call, put }
    ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderInfoList, query );
      if ( success ) {
        successFun( result );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 获取快递公司
    *getLogistics( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getLogistics, payload );
      if ( success ) {
        yield put( {
          type: 'setLogistics',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 通过id删除spu商品
    *delShelf( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( delShelf, payload );
      if ( success ) {
        callFunc( message );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 通过id查询商城订单
    *getOrderInfo( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderInfo, payload );
      if ( success ) {
        callFunc( result );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 发货提交
    *getDelivery( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( getDelivery, payload );
      if ( success ) {
        callFunc( message );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 退货
    *refuseGoods( { payload: { query, callBack } }, { call, put } ) {
        yield put( {
          type: 'setLoading',
          payload: true,
        } );
        const data = yield call( refuseGoods, query );
        console.log( data, 'data' )
        callBack( data.success )

        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      },

  },

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload,
      };
    },
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
    setLogistics( state, { payload } ) {
      return {
        ...state,
        logistics: payload,
      };
    },
  },
};

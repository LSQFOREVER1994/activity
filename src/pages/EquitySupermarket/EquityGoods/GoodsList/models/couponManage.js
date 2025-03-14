import { getCouponList, getCouponDetail, deleteCoupon, getCouponRecycleList } from '@/services/equityGoods.service';

export default {
  namespace: 'couponManage',
  state: {
    loading: false,
    recycleList: {
      total: 0,
      list: [],
    }
  },

  effects: {
    *getCouponList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { loading: true },
      } );
      const data = yield call( getCouponList, payload );
      if ( data.success && callBackFunc ) {
        callBackFunc( data )
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } );
    },

    *getCouponRecycleList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { loading: true },
      } )
      const data = yield call( getCouponRecycleList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { recycleList: data.result },
        } )
      }
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } )
    },

    *getCouponDetail( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { loading: true },
      } )
      const data = yield call( getCouponDetail, payload );
      if ( data.success && callBackFunc ) {
        callBackFunc( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } )
    },

    *deleteCoupon( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { loading: true },
      } )
      const data = yield call( deleteCoupon, payload );
      if ( data.success && callBackFunc ) {
        callBackFunc( data )
      }
      yield put( {
        type: 'SetState',
        payload: { loading: false },
      } )
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

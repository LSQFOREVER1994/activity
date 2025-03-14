// import { message } from 'antd';
import {
  getMerchantList, getPrizeTypeList, getVisibleGoodsList, getPrizeList
} from '@/services/bees.service';

export default {
  namespace: 'prizeModal',

  state: {
    merchantList:[],
    prizeTypeList:[],
    merchantVisibleList:[],
    prizeList:[]
  },

  effects: {
     // 获取商户列表
     *getMerchantList( { payload, successFun }, { call, put } ) {
      const data = yield call( getMerchantList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { merchantList: data.result },
        } );
        if ( successFun ) successFun( data.result );
      }
    },

      // 查询奖品类型
      *getPrizeTypeList( { payload, successFun }, { call, put } ) {
        const data = yield call( getPrizeTypeList, payload );
        if ( data.success ) {
          yield put( {
            type: 'SetState',
            payload: { prizeTypeList: data.result },
          } );
          if ( successFun ) successFun( data.result );

        }
      },

        // 获取商户可见列表
    *getVisibleGoodsList( { payload, successFun, failFunc }, { call, put } ) {
      const data = yield call( getVisibleGoodsList, payload );
      if ( data?.success ) {
        yield put( {
          type: 'SetState',
          payload: { merchantVisibleList: data.result.list },
        } );
        if ( successFun ) successFun( data.result.list, data.result );
      } else if ( failFunc ) failFunc()
    },

      // 模糊搜索奖品
      *getPrizeList( { payload, successFun }, { call, put } ) {
        const data = yield call( getPrizeList, payload );
        if ( data.success ) {
          yield put( {
            type: 'SetState',
            payload: { prizeList: data.result.list },
          } );
          if ( successFun ) successFun( data.result.list );
        }
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

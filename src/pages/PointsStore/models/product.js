// import { message } from 'antd';

import {
  getGoodsSpu,
  getGoodsCode,
  changeShelf,
  delShelf,
  addGood,
  updateGood,
  getWarnGoodsSpu,
  getGoodsCategoryList,
  addGoodsCategory,
  editGoodsCategory,
  deleteGoodsCategory,
  getRightList,
  getUserLevel,
} from '@/services/pointsStore.service';

export default {
  namespace: 'product',

  state: {
    loading: false,
    goods: {
      total: 0,
      list: [],
    },
    warnGoods: {
      total: 0,
      list: [],
    },
    accountList: [], // 项目账户
    goodsCategory: {
      total: 0,
      list: []
    },
    rights: [],
    userLevelList: [], // 会员等级列表
  },

  effects: {
     // 获取商品列表
     *getWarnGoodsSpu( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getWarnGoodsSpu, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { warnGoods: result },
        } );
        // callFunc( result );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取商品类型(分页)
    *getGoodsCategoryList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGoodsCategoryList, payload );
      if ( success ) {
        yield put( {
          type: 'setGoodsCategory',
          payload: result,
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
        callFunc( result );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 修改、新增商品分类
    *editGoodCategory( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      console.log( 'vdfvf', payload );
      const { success, message } = payload.id
        ? yield call( editGoodsCategory, payload )
        : yield call( addGoodsCategory, payload );
      if ( success ) {
        callFunc( message );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 通过id删除商品分类
    *deleteGoodsCategory( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( deleteGoodsCategory, payload );
      if ( success ) {
        callFunc( message );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取商品类型
    *getGoodsCode( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGoodsCode, payload );
      if ( success ) {
        yield put( {
          type: 'setCodeList',
          payload: result,
        } );
        callFunc( result );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取商品列表
    *getGoodsSpu( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGoodsSpu, payload );
      if ( success ) {
        yield put( {
          type: 'setGoods',
          payload: result,
        } );
        // callFunc( result );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
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
    // 修改、新增商品
    *editGood( { payload, callFunc, errFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = payload.id
        ? yield call( updateGood, payload )
        : yield call( addGood, payload );
      if ( success ) {
        callFunc( message );
      } else {
        errFunc( );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 权益列表
    *getRightList ( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getRightList, payload );
      if ( success ) {
        yield put( {
          type: 'setRights',
          payload: result,
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
        if ( callFunc ) callFunc( result );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 获取商品类型
    *getUserLevel( { payload }, { call, put } ) {
      const { success, result } = yield call( getUserLevel, payload );
      if ( success ) {
        yield put( {
          type: 'setUserLevelList',
          payload: result,
        } );
      }
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
    setGoodsCategory( state, { payload } ) {
      return {
        ...state,
        goodsCategory: payload,
      };
    },
    setCodeList( state, { payload } ) {
      return {
        ...state,
        codeList: payload,
      };
    },
    setGoods( state, { payload } ) {
      return {
        ...state,
        goods: payload,
      };
    },
    setRights( state, { payload } ) {
      return {
        ...state,
        rights: payload,
      };
    },
    setUserLevelList( state, { payload } ) {
      return {
        ...state,
        userLevelList: payload,
      };
    },
  },
};

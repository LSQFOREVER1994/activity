import {
  getGoodsClassifyList,
  getGoodsClassifyDownShelf,
  fetchGoodsClassifyAdd,
  fetchGoodsClassifyRemove,
  fetchGoodsClassifyUpDate,
  getAllClassify
} from '@/services/equityGoods.service';

export default {
  namespace: 'equityGoodsClassify',

  state: {
    loading: false,
    goodsClassifyListResult: {
      total: 0,
      list: [],
    },
    classifyAddResult: {
      code: '',
      message: ''
    },
    classifyUpDateResult: {
      code: '',
      message: ''
    },
    classifyRemoveResult: {
      code: '',
      message: ''
    },
    classifyDownShelfResult: {
      code: '',
      message: ''
    }
  },


  effects: {
    // 获取商品分类列表
    *getGoodsClassifyList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true
      } );
      const data = yield call( getGoodsClassifyList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setGoodsClassify',
          payload: data.result,
        } );
      }
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 获取全部商品分类
    *getAllClassify( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true
      } );
      const data = yield call( getAllClassify, payload );
      if ( data.success ) {
        yield put( {
          type: 'setAllClassify',
          payload: data.result,
        } );
      }
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 关闭开启分类展示
    *getGoodsClassifyDownShelf( { payload, callBackFunc }, { call } ) {
      const data = yield call( getGoodsClassifyDownShelf, payload );
      if ( callBackFunc ) callBackFunc( data )
    },


    // 添加分类
    *fetchGoodsClassifyAdd( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,

      } );
      const data = yield call( fetchGoodsClassifyAdd, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,

      } );
    },
    // 修改分类
    *fetchGoodsClassifyUpDate( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,

      } );
      const data = yield call( fetchGoodsClassifyUpDate, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,

      } );

    },


    // 删除分类
    *fetchGoodsClassifyRemove( { payload, callBackFunc }, { call } ) {
      const data = yield call( fetchGoodsClassifyRemove, payload );
      if ( callBackFunc ) callBackFunc( data )
    },
  },


  reducers: {
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload
      }
    },
    setGoodsClassify( state, { payload } ) {
      return {
        ...state,
        goodsClassifyListResult: payload
      }
    },
  },
};

import {
  getGoodsList,
  fetchGoodsDownShelf,
  fetchGoodsUpDate,
  fetchGoodsAdd,
  fetchCouponResplenish,
  fetchGoodsResplenish,
  fetchGoodsApply,
  getMerchantNameList,
  getGoodsClassifyList,
  getSingleGoodsDetail,
  getPriceRatio,
  syncGoods,
  getSyncGoodsSource,
  getPreSaleDetail,
  getJNRigthList,
} from '@/services/equityGoods.service';

export default {
  namespace: 'equityGoods',

  state: {
    loading: false,
    classifyLoading: false,
    resplenishLoading: false,
    editLoading: false,
    goodsListResult: {
      total: 0,
      list: [],
    },

    goodsAddResult: {
      code: '',
      message: '',
    },
    goodsUpDateResult: {
      code: '',
      message: '',
    },
    merchantListResult: {
      total: 0,
      list: []
    },
    classifyListResult: {
      total: 0,
      list: []
    },
    jnRightList:[]
  },


  effects: {
    // 获取商品列表
    *getGoodsList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getGoodsList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setGoodsList',
          payload: data.result,
        } );
      }
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取绩牛权益商品列表
    *getJNRigthList( { payload, callBackFunc }, { call, put } ) {
      const data = yield call( getJNRigthList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setJnRightList',
          payload: data?.result?.list || [],
        } );
      }
      if ( callBackFunc ) callBackFunc( data.result )
    },

    // 获取单个商品详情
    *getSingleGoodsDetail( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setEditLoading',
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
        type: 'setEditLoading',
        payload: false,
      } );
    },

    // 获取权益商户列表
    *getMerchantNameList( { payload, callBackFunc }, { call, put } ) {
      const data = yield call( getMerchantNameList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setMerchantNameList',
          payload: data.result,
        } );
      }
      if ( callBackFunc ) callBackFunc( data )
    },

    // 获取商品分类列表
    *getGoodsClassifyList( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setClassifyLoading',
        payload: true,
      } );
      const data = yield call( getGoodsClassifyList, payload );
      if ( data.success ) {
        yield put( {
          type: 'setGoodsClassify',
          payload: data.result,
        } );
      }
      yield put( {
        type: 'setClassifyLoading',
        payload: false,
      } );
      if ( callBackFunc ) callBackFunc( data )
    },

    // 新增商品
    *fetchGoodsAdd( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( fetchGoodsAdd, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 修改商品
    *fetchGoodsUpDate( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( fetchGoodsUpDate, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 下架商品
    *fetchGoodsDownShelf( { payload, callBackFunc }, { call } ) {
      const data = yield call( fetchGoodsDownShelf, payload );
      if ( callBackFunc ) callBackFunc( data )
    },

    // 权益商品申请
    *fetchGoodsApply( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( fetchGoodsApply, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 补仓
    *fetchGoodsResplenish( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setResplenishLoading',
        payload: true,
      } );
      const data = yield call( fetchGoodsResplenish, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setResplenishLoading',
        payload: false,
      } );
    },

    // 卡密模版补仓 - 文件上传
    *fetchCouponResplenish( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( fetchCouponResplenish, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 查询商户定价
    *getPriceRatio( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getPriceRatio, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 同步商品
    *syncGoods( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( syncGoods, payload );
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      if ( callBackFunc ) callBackFunc( data )
    },

    // 获取同步商品来源
    *getSyncGoodsSource( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getSyncGoodsSource, payload );
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      if ( callBackFunc ) callBackFunc( data )
    },

    // 获取商品预售明细
    *getPreSaleDetail( { payload, callBackFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( getPreSaleDetail, payload );
      if ( callBackFunc ) callBackFunc( data )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );

    },
  },



  reducers: {
    setGoodsList( state, { payload } ) {
      return {
        ...state,
        goodsListResult: payload
      }
    },
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload
      }
    },
    setEditLoading( state, { payload } ) {
      return {
        ...state,
        editLoading: payload
      }
    },
    setClassifyLoading( state, { payload } ) {
      return {
        ...state,
        classifyLoading: payload
      }
    },
    setResplenishLoading( state, { payload } ) {
      return {
        ...state,
        resplenishLoading: payload
      }
    },
    setMerchantNameList( state, { payload } ) {
      return {
        ...state,
        merchantListResult: payload
      }
    },
    setGoodsClassify( state, { payload } ) {
      return {
        ...state,
        classifyListResult: payload
      }
    },
    setJnRightList( state, { payload } ) {
      return {
        ...state,
        jnRightList:payload
      }
    },
    

  },
};

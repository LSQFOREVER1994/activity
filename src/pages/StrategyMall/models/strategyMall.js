import { message } from 'antd';

import {
  getProducts, addProduct, exitProduct, delProduct,
  getSpecs, addSpecst, exitSpecs, delSpecs,
  getProductsRights, addProductsRights, exitProductsRights, delProductsRights,
  getCoupons, addCoupons, exitCoupons, delCoupons,
  getProductsRightsBelongs, getCouponsUsers, getOrders, searchGoods, sendCoupons, getProductsParticulars,
  getCategories, exitCategorie, addCategorie, delCategorie, putInventories, getgoodsSpecs, getRefundList, refundCheck, getOrder, getVisit,
  getOrderAmounts, getOrderCounts, addJurisdiction,
  refundAdministrator,
  getBatchCodeList, addBatchCodeList, getRedeemCodeList, getSharePassword,
  getVirtualList, exitVirtual, addVirtual, delVirtual, getVouchersList, delVouchers
} from '@/services/strategyMall.service';

export default {
  namespace: 'strategyMall',

  state: {
    loading: false,
    couponsUsers: {
      total: 0,
      list: [],
    },
    orders: {
      total: 0,
      list: [],
    },
    coupons: {
      total: 0,
      list: [],
    },
    categorieList: [],
    datas: {
      total: 0,
      list: [],
    },
    productsRightsBelongs: {
      total: 0,
      list: [],
    },
    productsParticularsList: {
      total: 0,
      list: [],
    },
    specsList: [],
    ProductsRights: {
      total: 0,
      list: [],
    },
    nameListAll: {
      total: 0,
      list: [],
    },
    goodsList: [],
    sendCouponsVisible: false,
    goodsSpecsTree: [],
    refundList: [],
    refundLoading: false,
    refundPage: {
      pageSize: 10,
      pageNum: 1,
      total: 0
    },
    visitList: [],
    amounts: [],
    counts: [],
    // 权限模板显示隐藏的判断
    jurisdictionVisible: false,
    jurisdictionList:{
      total: 0,
      list: [],  
    },
    batchCodeList:{
      total: 0,
      list: [],
    },
    redeemCodeList:{
      total: 0,
      list: [],
    },
    virtualCardList:{
      total: 0,
      list: [],
    },
    vouchersCardList:{
      total: 0,
      list: [],
    }
  },

  effects: {
    // 订单列表
    *getOrders( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getOrders, payload );
      if ( success ) {
        // const userIdArr = [];
        // const { list } = result;
        // list.forEach(item => userIdArr.push(item.userId));

        // const users = yield call(getUsersInfo, userIdArr.join(','));

        // list.forEach(item => {
        //   const { nick, profilePhoto } = users.result.find(o => o.id === item.userId) || {};
        //   return Object.assign(item, { nick, profilePhoto }); 
        // });
        
        yield put( {
          type: 'setOrders',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *getOrder( { payload, success }, { call } ) {
      const  data = yield call( getOrder, payload );
      if ( data.success ) {
        success( data.result )
      }
    },

    *getAllOrderAmounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderAmounts, payload );
      if ( success ) { 
        yield put( {
          type: 'setAllOrderAmounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      
    },

    *getAllOrderCounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderCounts, payload );
      if ( success ) {
        yield put( {
          type: 'setAllOrderCounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *getFinishOrderAmounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderAmounts, payload );
      if ( success ) { 
        yield put( {
          type: 'setFinishOrderAmounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      
    },

    *getFinishOrderCounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderCounts, payload );
      if ( success ) {
        yield put( {
          type: 'setFinishOrderCounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *getRefundOrderAmounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderAmounts, payload );
      if ( success ) { 
        yield put( {
          type: 'setRefundOrderAmounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
      
    },

    *getRefundOrderCounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getOrderCounts, payload );
      if ( success ) {
        yield put( {
          type: 'setRefundOrderCounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    
    *getRefundList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { refundLoading:true },
      } );

      const { success, result } = yield call( getRefundList, payload );
      if ( success ) {
      const { list, total, pageNum, pageSize } = result
      const refundPage ={
          pageNum, pageSize, total
        }
      yield put( {
        type: 'SetState',
        payload: { refundLoading: false, refundList: list, refundPage },
      } );
      }
      yield put( { type: 'SetState', payload: { refundLoading: false, } } )
     
    },
    *refundCheck( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { refundLoading: true },
      } );

      const { success } = yield call( refundCheck, payload );
      if ( success ) {
        yield put( {
          type: 'setRefundCheck',
          payload,
        } );

      }
      yield put( { type: 'SetState', payload: { refundLoading: false, } } )
    },

    // 用户领取的优惠券列表
    *getCouponsUsers( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getCouponsUsers, payload );
      if ( success ) {
        yield put( {
          type: 'setCouponsUsers',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 优惠券列表
    *getCoupons( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getCoupons, payload );
      if ( success ) {
        yield put( {
          type: 'setCoupons',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    // 商品种类列表
    *getCategories( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getCategories, payload );
      if ( success ) {
        yield put( {
          type: 'setCategories',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *submitCategorie( { payload: { params, callFunc } }, { call } ) {
      const data = params.id ? yield call( exitCategorie, params ) : yield call( addCategorie, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },
    // 删除商品种类
    *delCategorie( { payload: { id }, callFunc }, { call } ) {
      const data = yield call( delCategorie, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },
    *submitCoupons( { payload: { params, callFunc } }, { call } ) {
      const data = params.id ? yield call( exitCoupons, params ) : yield call( addCoupons, params );
      if ( data ) {
        callFunc();
      }
    },

    // 查找所有商品
    *searchGoods( { payload }, { call, put } ) {
      const { success, result } = yield call( searchGoods, payload );
      if ( success ) {
        yield put( {
          type: 'setGoodsList',
          payload: result.list,
        } );
      }
    },
    // 发送优惠券
    *sendCoupons( { payload: { query, callFunc } }, { call } ) {
      const  data = yield call( sendCoupons, query );
      if ( data.success ) {
        message.success( data.message );
        callFunc();
      }
    },
    *delCoupons( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delCoupons, id );
      if ( data.success ) {
        message.success( data.message );
        callFunc();
      }
    },

    // 产品权限所属
    *getProductsRightsBelongs( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getProductsRightsBelongs, payload );
      if ( success ) {
        yield put( {
          type: 'setProductsRightsBelongs',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取用户详细权限
    *getProductsParticulars( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getProductsParticulars, payload );
      if ( success ) {
        yield put( {
          type: 'setProductsParticulars',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },


    // 产品权限
    *getProductsRights( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getProductsRights, payload );
      if ( success ) {
        yield put( {
          type: 'setProductsRights',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *submitProductsRights( { payload: { params, callFunc } }, { call } ) {
      const data = params.change ? yield call( exitProductsRights, params ) : yield call( addProductsRights, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } 
    },
    *delProductsRights( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delProductsRights, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } 
    },
    // 产品列表
    *getProducts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );

      const { success, result } = yield call( getProducts, payload );
      if ( success ) {
        yield put( {
          type: 'setProductDatas',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  获取所有列表
    *getProductsAll( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getProducts, payload );
      if ( success ) {
        yield put( {
          type: 'setNameListAll',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 添加 或 编辑 产品
    *submitProduct( { payload: { params, callFunc } }, { call } ) {
      const data = params.id ? yield call( exitProduct, params ) : yield call( addProduct, params );
      if ( data.success ) {
        callFunc( data.result );
        if ( params.id ) {
          message.success( '商品保存成功。' );
        } else {
          message.success( params.payType === 'FREE' ? '添加成功。' : '添加成功。该商品套餐未设置' );
        }
      }
    },

    // 删除产品
    *delProduct( { payload: { id, callFunc } }, { call } ) {
      const data =  yield call( delProduct, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },


    // 获取产品规格(套餐)
    *getSpecs( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );

      const { success, result } = yield call( getSpecs, payload );
      if ( success ) {
        yield put( {
          type: 'setSpecs',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  添加 或 编辑 套餐
    *submitPackage( { payload: { params, callFunc } }, { call } ) {
      const data =  params.id ? yield call( exitSpecs, params ) : yield call( addSpecst, params );
      if ( data.success ) {
        callFunc( data.result );
          message.success( params.id ? '商品套餐保存成功' : '商品套餐添加成功。' );
        }
    },

   // 删除套餐
   *delPackage ( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delSpecs, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    
    // 修改优惠券库存
    *putInventories( { payload: { params, callFunc } }, { call } ) {

      const { success } = yield call( putInventories, params );
      if ( success ) {
        callFunc()
      }
      
    },

    // 查询商品与套餐列表(tree)
    *getgoodsSpecs( _, { call, put } ) {

      const { success, result } = yield call( getgoodsSpecs );
      const arrTree = [];
      if ( success ) {
        result.forEach( item => {
          const obj = {
            title: item.name,
            value: `p_${item.id}`,
            key: `p_${item.id}`,
            selectable: false,
            children: [],
          }
          item.specs.forEach( specs => {
           
            obj.children.push( {
              title: specs.name,
              value: specs.id,
              key: specs.id,
            } )
          } )
          arrTree.push( { ...obj } )
        } );
        

        yield put( {
          type: 'setGoodsSpecsTree',
          payload: arrTree,
        } );
      }


    },
    *clearSpecs( { payload }, { put } ) {
      yield put( {
        type: 'setSpecs',
        payload,
      } );
    },
      // 订单列表
    *getVisit( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getVisit, payload );
      if ( success ) {
        yield put( {
          type: 'setVisit',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 手动赠送工具权限(付费权限)
    *addJurisdiction( { payload:{ params, callFunc } }, { call } ) {
      const data = yield call( addJurisdiction, params );
      if ( data.success ) {
        message.success( data.message );
        callFunc();
      }
    },

    // 管理员退款
    *refundAdministrator( { payload:{ params, callFunc } }, { call } ) {
      const data = yield call( refundAdministrator, params );
      if ( data.success ) {
        message.success( data.message );
        callFunc();
      }
    },

    // 获取批次兑换码列表
    *getBatchCodeList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getBatchCodeList, payload );
      if ( success ) {
        yield put( {
          type: 'setBatchCodeList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 添加批次兑换码
    *addBatchCodeList( { payload: { params, callFunc } }, { call } ) {
      const data =  yield call( addBatchCodeList, params );
      if ( data.success ) {
        callFunc( data.result );
          message.success( '商品套餐添加成功。' );
        }
    },
    
    //  获取兑换码列表
    *getRedeemCodeList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getRedeemCodeList, payload );
      if ( success ) {
        yield put( {
          type: 'setRedeemCodeList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  获取分享密码
    *getSharePassword( { payload:{ id, callFunc } }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getSharePassword, id );
      if ( success ) {
        callFunc( result )
        message.success( '获取分享密码成功' );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    //  获取批次虚拟卡
    *getVirtualList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getVirtualList, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { virtualCardList:result },
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    
    // 编辑或添加批次虚拟卡
    *submitVirtual( { payload: { params, callFunc } }, { call } ) {
      const data =  params.id ? yield call( exitVirtual, params ) : yield call( addVirtual, params );
      if ( data.success ) {
        callFunc();
      }
    },

    // 删除批次虚拟卡 
    *delVirtual ( { payload:{ groupId, callFunc } }, { call } ) {
      const data = yield call( delVirtual, groupId );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 获取密卡列表 
    *getVouchersList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getVouchersList, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { vouchersCardList:result },
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  删除密卡 
    *delVouchers ( { payload:{ id, callFunc } }, { call } ) {
      const data = yield call( delVouchers, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

  },

  reducers: {
    setOrders( state, { payload } ) {
      return {
        ...state,
        orders: payload,
      };
    },
    setAllOrderAmounts( state, { payload } ) {
      return {
        ...state,
        allAmounts: payload,
      };
    },
    setAllOrderCounts( state, { payload } ) {
      return {
        ...state,
        allCounts: payload,
      };
    },
    setFinishOrderAmounts( state, { payload } ) {
      return {
        ...state,
        finishAmounts: payload,
      };
    },
    setFinishOrderCounts( state, { payload } ) {
      return {
        ...state,
        finishCounts: payload,
      };
    },
    setRefundOrderAmounts( state, { payload } ) {
      return {
        ...state,
        refundAmounts: payload,
      };
    },
    setRefundOrderCounts( state, { payload } ) {
      return {
        ...state,
        refundCounts: payload,
      };
    },
    setRefundCheck( state, { payload } ){
      const refundList = state.refundList.map( ( item => {
        if( item.orderId === payload.orderId ) return { ...item, state:payload.state }
        return item
      } ) )
      return {
        ...state,
        refundList,
      };
    },
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
    setCouponsUsers( state, { payload } ) {
      return {
        ...state,
        couponsUsers: payload,
      };
    },
    setCoupons( state, { payload } ) {
      return {
        ...state,
        coupons: payload,
      };
    },
    setCategories( state, { payload } ) {
      return {
        ...state,
        categorieList: payload,
      };
    },
    setGoodsList( state, { payload } ) {
      return {
        ...state,
        goodsList: payload,
      };
    },
    setProductsRightsBelongs( state, { payload } ) {
      return {
        ...state,
        productsRightsBelongs: payload,
      };
    },
    setProductsParticulars( state, { payload } ) {
      return {
        ...state,
        productsParticularsList: payload,
      };
    },
    setSpecs( state, { payload } ) {
      return {
        ...state,
        specsList: payload,
      };
    },
    setProductsRights( state, { payload } ) {
      return {
        ...state,
        ProductsRights: payload,
      };
    },
    setNameListAll( state, { payload } ) {
      return {
        ...state,
        nameListAll: payload,
      };
    },
    setProductDatas( state, { payload } ) {
      return {
        ...state,
        datas: payload,
      };
    },
    setSendCouponsVisible( state, { payload } ) {
      return {
        ...state,
        sendCouponsVisible: payload,
      };
    },
    setGoodsSpecsTree( state, { payload } ) {
      return {
        ...state,
        goodsSpecsTree: payload,
      };
    },
    setVisit( state, { payload } ) {
      return {
        ...state,
        visitList: payload,
      };
    },
    setJurisdiction( state, { payload } ) {
      return {
        ...state,
        jurisdictionList: payload,
      };
    },
    setBatchCodeList( state, { payload } ) {
      return {
        ...state,
        batchCodeList: payload,
      };
    },
    setRedeemCodeList( state, { payload } ) {
      return {
        ...state,
        redeemCodeList: payload,
      };
    },
  },
};

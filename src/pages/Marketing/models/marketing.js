
import {
  getOrderAmounts, getAllOrderSales,
  getPercentList, getProductMassage,
  getThreeAmounts, getThreeSpecs,
  getNowActivityList, getStartActivityList, getActiveCountData,
  getProductsSale, getProductsAmount, getAppidList
} from '@/services/marketing.service';

import moment from 'moment';

export default {
  namespace: 'marketing',
  state: {
    loading: false,
    goodsList: [],
    goodsSalesList: [],
    comboSalesList: [],
    orderSalesList: [],
    allAmounts:[],
    allSales:[],
    allThreeAmounts:[],
    percentList:[],
    allThreeSpecs:[],
    nowActivityList:{
      total: 0,
      list: []
    },
    startActivityList:{
      total: 0,
      list: []
    },
    startLoading:false,
    productMassageList:[],
    yesterdayProductList:[],
    activeCountData:[],
    orderBarList:[],
    pieSaleData:null
  },

  effects: {
    //  获取今日销售总额
    *setState( { payload }, {  put } ) {
      yield put( {
        type: 'SetState',
        payload,
      } );
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
    // 获取今日销量
    *getAllOrderSales( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getAllOrderSales, payload );
      if ( success ) { 
        yield put( {
          type: 'setAllOrderSales',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  获取3日的前三销售额
    *getThreeAmounts( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getThreeAmounts, payload );
      if ( success ) { 
        yield put( {
          type: 'setThreeAmounts',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 获取3日的前三订单额
    *getThreeSpecs( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getThreeSpecs, payload );
      if ( success ) { 
        yield put( {
          type: 'setThreeSpecs',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    //  获取正在进行的活动列表
    *getNowActivityList( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getNowActivityList, payload );
      if ( success ) { 
        callFunc( result )
        const buryList = [];
        let { list } = result
        list.forEach( item => {
          if ( item.buryPointId ) buryList.push( item.buryPointId )
        } )
        if ( buryList.length > 0 ){
          const buryData = yield call( getAppidList, buryList );
          list = list.map( item => ( { ...item, appid: buryData.result[item.buryPointId] || '' } ) )
          
        }
        yield put( {
          type: 'setNowActivityList',
          payload: { ...result, list },
        } );
      }
    },
    //  获取正在进行的活动列表
    *getActiveCountData( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getActiveCountData, payload );
      if ( success ) { 
        callFunc( result )
        const activeCountData = result && result.length >0 ?
        result.map( ( item )=> ( { ...item, date:item.date.substring( 5, 10 ) } ) ) : []
        yield put( {
          type: 'SetState',
          payload: { activeCountData },
        } );
      }
    },

    //  获取即将开始活动列表
    *getStartActivityList( { payload }, { call, put } ) {
      yield put( {
        type: 'setSrartLoading',
        payload: true,
      } );
      const { success, result } = yield call( getStartActivityList, payload );
      if ( success ) { 
        yield put( {
          type: 'setStartActivityList',
          payload: result,
        } );
      }

      yield put( {
        type: 'setSrartLoading',
        payload: false,
      } );
    },

    // 获取饼数据
    *getPercentList( { payload }, { call, put } ) {
      const { success, result } = yield call( getPercentList, payload );
      if ( success ) { 
        yield put( {
          type: 'setPercentList',
          payload: result,
        } );
      }
    },

    // 点击饼图获取右边今日相应数据
    *getProductMassage( { payload }, { call, put } ) {
      const { success, result } = yield call( getProductMassage, payload );
      if ( success ) { 
        yield put( {
          type: 'setProductMassage',
          payload: result,
        } );
      }
    },

    // 点击饼图获取右边昨日相应数据
    *getYesterdayProduct( { payload }, { call, put } ) {
      const { success, result } = yield call( getProductMassage, payload );
      if ( success ) { 
        yield put( {
          type: 'setYesterdayProduct',
          payload: result,
        } );
      }
    },
    // 订单模块柱状图
    *getOrderData( { payload }, { call, put, all } ) {
      const [allSaleData, allAmountData] = yield all( [
        yield call( getAllOrderSales, payload ),
        yield call( getOrderAmounts, payload ),
      ] );
      const allSaleList = allSaleData.result.map( item => ( { ...item, time:moment( item.time ).format( 'YYYY-MM-DD' ) } ) );
      const allAmountList = allAmountData.result.map( item => ( { ...item, time: moment( item.time ).format( 'YYYY-MM-DD' ) } ) );;
      const allSaleObj = {}
      allSaleList.forEach( item => { allSaleObj[item.time] =item} )
      const orderBarList = allAmountList.map( item => 
        ( { ...item,
           sale: allSaleObj[item.time] ? allSaleObj[item.time].amount : 0, 
           date: item.time.substring( 5, 10 ),
          time: item.time.substring( 5, 10 )  } 
           ) )
      
      const saleChange = {
        yesterday: allSaleList[allSaleList.length - 2].amount,
        today: allSaleList[allSaleList.length - 1].amount
      }
      const amountChange = {
        yesterday: allAmountList[allAmountList.length - 2].amount,
        today: allAmountList[allAmountList.length - 1].amount
      }
      yield put( {
          type: 'SetState',
        payload: { orderBarList, amountChange, saleChange },
        
        } );
    },
    // 订单模块柱状图
    *getPieData( { payload }, { call, put, all } ) {
      const [saleData, amountData]  = yield all( [
        
        yield call( getProductsSale, payload ),
        yield call( getProductsAmount, payload )
      ] )
      const pieSaleData = saleData.result.filter( item => !!item.amount )
      const pieAmountData = amountData.result.filter( item => !!item.amount )
      // if( success ){
        yield put( {
          type: 'SetState',
          payload: { pieSaleData, pieAmountData },
        } );
      // }

      
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
    setAllOrderAmounts( state, { payload } ) {
      return {
        ...state,
        allAmounts: payload,
      };
    },
    setAllOrderSales( state, { payload } ) {
      return {
        ...state,
        allSales: payload,
      };
    },
    setThreeAmounts( state, { payload } ) {
      return {
        ...state,
        allThreeAmounts: payload,
      };
    },
    setThreeSpecs( state, { payload } ) {
      return {
        ...state,
        allThreeSpecs: payload,
      };
    },
    setNowActivityList( state, { payload } ) {
      return {
        ...state,
        nowActivityList: payload,
      };
    },
    setStartActivityList( state, { payload } ) {
      return {
        ...state,
        startActivityList: payload,
      };
    },
    setSrartLoading( state, { payload } ) {
      return {
        ...state,
        startLoading: payload,
      };
    },
    setPercentList( state, { payload } ) {
      return {
        ...state,
        percentList: payload,
      };
    },
    setProductMassage( state, { payload } ) {
      return {
        ...state,
        productMassageList: payload,
      };
    },
    setYesterdayProduct( state, { payload } ) {
      return {
        ...state,
        yesterdayProductList: payload,
      };
    },
  },
};

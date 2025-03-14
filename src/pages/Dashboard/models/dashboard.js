import moment from 'moment';
import {
  getSalesTotal, getSpecifyDateTotal, getOrderTotal, getDealOrderTotal, getGoodsSales, getComboSales, getOrderSales, 
  getTodaySales, getCouponsTotal, getDealCouponsTotal, getOrderCounts
} from '@/services/dashboard.service';
import {
  searchGoods
} from '@/services/strategyMall.service';

// import { message } from 'antd';

export default {
  namespace: 'dashboard',
  state: {
    loading: false,
    goodsList: [],
    goodsSalesList: [],
    comboSalesList: [],
    orderSalesList: [],
    amountList:[]
  },

  effects: {
     *searchGoods({ payload }, { call,put }) {
      const { success, result } = yield call(searchGoods, payload);
      if (success) {
        yield put({
          type: 'setGoodsList',
          payload: result.list,
        });
      }
    },
    // 查找所有商品
    *setState({ payload }, { put }) {
        yield put({
          type: 'SetState',
          payload,
        });
    },
    // 查询总销售额
    *getSalesTotal({ payload: { params, callFunc } }, { call }) {
      const { success, result } = yield call(getSalesTotal, params);
      if (success) {
        callFunc(result)
      }
    },
    // 查询指定日期销售额
    *getSpecifyDateTotal({ payload: { params, callFunc } }, { call }) {
      const { success, result } = yield call(getSpecifyDateTotal, params);
      if (success) {
        callFunc(result)
      }
    },
    // 按天范围查询商品销售额
    *getGoodsSales({ payload }, { call, put }) {
      yield put({
        type: 'setGoodsSalesList',
        payload: [],
      });
      const { success, result } = yield call(getGoodsSales, payload);
      if (success) {
        const compare = (amount) => (obj1, obj2) => {
          const val1 = obj1[amount];
          const val2 = obj2[amount];
    
          if (val1 < val2) {
            return -1;
          } if (val1 > val2) {
            return  1;
          }
          return 0;
        };

        yield put({
          type: 'setGoodsSalesList',
          payload: result.sort(compare('amount')),
        });
      }
    },
    // 按天范围查询规格(套餐)销售额
    *getComboSales({ payload }, { call, put }) {
      yield put({
        type: 'setGoodsSalesList',
        payload: [],
      });
      const { success, result } = yield call(getComboSales, payload);
      if (success) {
        const compare = (amount) => (obj1, obj2) => {
          const val1 = obj1[amount];
          const val2 = obj2[amount];
    
          if (val1 < val2) {
            return -1;
          } if (val1 > val2) {
            return  1;
          }
          return 0;
        };
        yield put({
          type: 'setGoodsSalesList',
          payload: result.sort(compare('amount')),
        });
      }
    },
    // 初始化获取商品列表，7日销售额、销售量
    *initGetOrderData({payload},{call,put,all}){
      const [goodsRes, moneyRes, amountRes] = yield all([
        call(searchGoods, {
          pageSize: 100
        }),
        call(getOrderSales, payload),
        call(getOrderCounts, payload),
      ])
      const goodsList = goodsRes.success ? goodsRes.result.list : [];
      const amountList = amountRes.success? amountRes.result.map(item => ({time:item.time,'all':item.amount})) : []
      
      const moneyList = moneyRes.success ? moneyRes.result.map(item => ({time:item.time,'all':item.amount})): []
      // const goodsMap = goodsList.length > 0 ? goodsList.map(item => ({type:item.name})) : []
      yield put({
        type: 'SetState',
        payload: {goodsList,amountList,moneyList},
      });
    },
    *changeDayGetOrder({payload},{call,all,put}){
      yield put({type:'SetState',payload:{loading:true}})
      const { getMap, saleType } = payload;
      const getList = Object.keys(getMap);
      const getProducts = saleType === 'sales' ?  getList.map((item) => call(getOrderSales,{...payload,productId:item ==='all' ? '' :item})) :
        getList.map((item) => call(getOrderCounts,{...payload,productId:item ==='all' ? '' :item}))
      const list = [];
      const data = yield all(getProducts)
      
      data.forEach((productRes,index) => {
        if (productRes.success) {
            productRes.result.forEach((product, productIndex) => {
          if(list[productIndex]) list[productIndex] = {...list[productIndex],[`${getList[index]}`]:product.amount}
          else list[productIndex] = {...product,[`${getList[index]}`]:product.amount}
        })
        }
      })
      
      if(saleType === 'sales') {
        yield put({ type: 'SetState', payload: {moneyList:list}});
        
      }else {
        yield put({ type: 'SetState', payload: {amountList:list}});
      }
      
      yield put({type:'SetState',payload:{loading:false}})
    },
    *getGoodOrder({ payload }, {call, put}) {
        yield put({type:'SetState',payload:{loading:true}})
       const { success, result } = payload.saleType === 'sales' ? yield call(getOrderSales, payload) :  yield call(getOrderCounts, payload);
       if (success){
         yield put({
           type: 'setGoodOrder',
           payload: {list:result,product:payload.product,saleType:payload.saleType},
         });
       }
       yield put({type:'SetState',payload:{loading:false}})
    },
    // 按天范围查询订单总销售额
    *getOrderSales({ payload }, { call, put }) {
      const { success, result } = yield call(getOrderSales, payload);
      if (success) {
        yield put({
          type: 'setOrderSalesList',
          payload: result,
        });
      }
    },
    // 按天范围查询订单总销售量
    *getOrderCounts({ payload }, { call, put }) {
      const { success, result } = yield call(getOrderCounts, payload);
      if (success) {
        yield put({
          type: 'setOrderSalesList',
          payload: result,
        });
      }
    },
    // 按天查询订单销售额(小时为单位)
    *getTodaySales({ payload }, { call, put }) {
      const { success, result } = yield call(getTodaySales, payload);
      if (success) {
        yield put({
          type: 'setOrderSalesList',
          payload: result,
        });
      }
    },
    // 查询订单的总个数(按天)
    *getOrderTotal({ payload: { params, callFunc } }, { call }) {
      const { success, result } = yield call(getOrderTotal, params);
      let deal = 0;
      let total = 0;
      if (success) {
        result.forEach(totalItem => {
          if(moment(totalItem.time).unix() >= moment(params.start).unix()|| moment(totalItem.time).unix() <= moment(params.end).unix()){
            
            total += totalItem.amount
          }
        });
        const dealOrder = yield call(getDealOrderTotal, params);
        dealOrder.result.forEach(dealItem =>{
          if(moment(dealItem.time).unix() >= moment(params.start).unix()|| moment(dealItem.time).unix() <= moment(params.end).unix()){
            deal += dealItem.amount
          }
        })
        callFunc({deal, total})
      }
    },
    // 查询优惠券总数
    *getCouponsTotal({ payload: { params, callFunc } }, { call }) {
      const { success, result } = yield call(getCouponsTotal, params);
      if (success) {
        
        const dealOrder = yield call(getDealCouponsTotal,);
        
        callFunc({deal: dealOrder.result, total: result })
      }
    },
  },
  

  reducers: {
    SetState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setGoodOrder(state,{payload}){
      const { list, product,saleType } = payload;
      
      const List = saleType === 'sales' ? state.moneyList : state.amountList
      
      const listMap = {};
      list.forEach(item => {
        listMap[item.time.substring(0,10)] = item.amount
        
      })
      const newAmountList = List.map(item => {
        const obj = item;
        obj[product.id] = listMap[item.time.substring(0,10)];
        return obj;
      });
      if(saleType === 'sales') {
        return {
          ...state,
        moneyList: newAmountList
        }
      }
      return {
        ...state,
        amountList: newAmountList
      }
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    setGoodsList(state, { payload }) {
      return {
        ...state,
        goodsList: payload,
      };
    },
    setGoodsSalesList(state, { payload }) {
      return {
        ...state,
        goodsSalesList: payload,
      };
    },
    setComboSalesList(state, { payload }) {
      return {
        ...state,
        comboSalesList: payload,
      };
    },
    setOrderSalesList(state, { payload }) {
      return {
        ...state,
        orderSalesList: payload,
      };
    },
  },
};

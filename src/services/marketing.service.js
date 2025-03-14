import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { strategyMallService, cropService, statisticsService } = serviceObj;

// // 查询总销售额
// export async function getOrderAmounts( obj ) {
//   return request( `${strategyMallService}/orders/amounts`, {
//     method: 'GET',
//     body: obj
//   } );
// }

// 查询总销售额
export async function getAllOrderSales ( obj ) {
  return request( `${strategyMallService}/statistics/day/range`, {
    method: 'GET',
    body: obj
  } );
}

// 查询总销额
export async function getOrderAmounts( obj ) {
  return request( `${strategyMallService}/statistics/sale/count`, {
    method: 'GET',
    body: obj
  } );
}

// 查询今日完成订单
export async function getAllOrderFinish( obj ) {
  return request( `${strategyMallService}/statistics/orders/deal`, {
    method: 'GET',
    body: obj
  } );
}

//  查询3日销量前三销售额
export async function getThreeAmounts( obj ) {
  return request( `${strategyMallService}/statistics/specs/range`, {
    method: 'GET',
    body: obj
  } );
}
// 查询3日前三的订单额
export async function getThreeSpecs( obj ) {
  return request( `${strategyMallService}/statistics/specs/count/range`, {
    method: 'GET',
    body: obj
  } );
}

// 获取正在进行的活动列表
export async function getNowActivityList( obj ) {
  return request( `${cropService}/base/activities`, {
    method: 'GET',
    body: obj
  } );
}

// 获取活动的统计数据
export async function getActiveCountData( obj ) {
  return request( `${statisticsService}/statistics/chart/userstats/realtime`, {
    method: 'GET',
    body: obj
  } );
}



//  获取即将开始的活动列表
export async function getStartActivityList( obj ) {
  return request( `${cropService}/base/activities`, {
    method: 'GET',
    body: obj
  } );
}

// 获取饼图数据
export async function getPercentList( obj ) {
  return request( `${strategyMallService}/orders/percent/range`, {
    method: 'GET',
    body: obj
  } );
}

// 点击饼图获取数据
export async function getProductMassage( obj ) {
  return request( `${strategyMallService}/orders/amounts`, {
    method: 'GET',
    body: obj
  } );
}
// 点击饼图销售额
export async function getProductsSale( obj ) {
  return request( `${strategyMallService}/statistics/products/range`, {
    method: 'GET',
    body: obj
  } );
}
// 点击饼图销售两
export async function getProductsAmount( obj ) {
  return request( `${strategyMallService}/statistics/specs/count/range`, {
    method: 'GET',
    body: obj
  } );
}
// 获取活动对应的点击人数
export async function getAppidList( obj ) {
  return request( `${statisticsService}/statistics/app/totalUv?appIds=${obj}`, {
    method: 'GET',
    // body: obj,
  } );
}
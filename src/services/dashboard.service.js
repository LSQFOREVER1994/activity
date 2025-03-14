import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { strategyMallService } = serviceObj;

// 查询总销售额
export async function getSalesTotal() {
  return request(`${strategyMallService}/statistics/total/amount`, {
    method: 'GET',
    // body: obj,
  });
}
// 查询指定日期销售额
export async function getSpecifyDateTotal(obj) {
  return request(`${strategyMallService}/statistics/day/range`, {
    method: 'GET',
    body: obj,
  });
}
// 查询订单的总个数(按天)
export async function getOrderTotal(obj) {
  return request(`${strategyMallService}/statistics/orders/total`, {
    method: 'GET',
    body: obj,
  });
}

// 查询订单的成交个数(按天)
export async function getDealOrderTotal(obj) {
  return request(`${strategyMallService}/statistics/orders/deal`, {
    method: 'GET',
    body: obj,
  });
}

// 查询优惠券总数
export async function getCouponsTotal(obj) {
  return request(`${strategyMallService}/statistics/coupons/send/count`, {
    method: 'GET',
    body: obj,
  });
}

// 查询已经发送优惠券数
export async function getDealCouponsTotal(obj) {
  return request(`${strategyMallService}/statistics/coupons/used/count`, {
    method: 'GET',
    body: obj,
  });
}

// 按天范围查询商品销售额
export async function getGoodsSales(obj) {
  return request(`${strategyMallService}/statistics/products/range`, {
    method: 'GET',
    body: obj,
  });
}
// 按天范围查询规格(套餐)销售额
export async function getComboSales(obj) {
  return request(`${strategyMallService}/statistics/specs/range`, {
    method: 'GET',
    body: obj,
  });
}
// 按天范围查询订单总销售额
export async function getOrderSales(obj) {
  return request(`${strategyMallService}/statistics/day/range`, {
    method: 'GET',
    body: obj,
  });
}
// 按天范围查询订单总销售量
export async function getOrderCounts(obj) {
  return request(`${strategyMallService}/statistics/sale/count`, {
    method: 'GET',
    body: obj,
  });
}
// 按天查询订单销售额(小时为单位)
export async function getTodaySales(obj) {
  return request(`${strategyMallService}/statistics/day`, {
    method: 'GET',
    body: obj,
  });
}

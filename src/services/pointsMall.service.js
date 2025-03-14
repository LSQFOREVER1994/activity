/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { jfService } = serviceObj;

// 获取商品列表
export async function getGoodsSpu( obj ) {
  return request( `${jfService}/goodsSpu/page`, {
      method: 'GET',
      body: obj
  } )
}
// 商品上下架操作
export async function changeShelf( obj ) {
  return request( `${jfService}/goodsSpu/shelf`, {
      method: 'POST',
      body: obj
  } )
}
// 通过id删除spu商品
export async function delShelf( obj ) {
  return request( `${jfService}/goodsSpu/delete/${obj.id}`, {
      method: 'POST',
      body: obj
  } )
}
// 新增spu商品
export async function addGood( obj ) {
  return request( `${jfService}/goodsSpu/add`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}
// 更新spu商品
export async function updateGood( obj ) {
  return request( `${jfService}/goodsSpu/update`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}
// 通过id查询商城订单
export async function getOrderInfo( obj ) {
  return request( `${jfService}/orderInfo/${obj.id}`, {
      method: 'GET',
      body: obj
  } )
}

// 获取商品列表
export async function getOrderInfoList( obj ) {
  return request( `${jfService}/orderInfo/page`, {
      method: 'GET',
      body: obj
  } )
}

// 获取快递公司
export async function getLogistics( obj ) {
  return request( `${jfService}/orderLogistics/dict/${obj.type}`, {
      method: 'GET',
      body: obj
  } )
}

// 发货提交
export async function getDelivery( obj ) {
  return request( `${jfService}/orderInfo/delivery`, {
      method: 'POST',
      body: obj
  }, 'JSON' )
}

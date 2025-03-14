import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { openService } = serviceObj;

// 获取资源点评列表
export async function getCallChargesList( obj ) {
  return request( `${openService}/direct/order`, {
    method: 'GET',
    body: obj,
  } );
}


// 重试话费充值
export async function getResourcRecharge( obj ) {
  return request( `${openService}/direct/order?orderId=${obj.orderId}`, {
    method: 'PUT',
    // body: obj,
  } );
}

// 直冲链接奖品列表
export async function getCallChargesLinkList( obj ) {
  return request( `${openService}/direct/charge-prize/page`, {
    method: 'GET',
    body: obj,
  } );
}

// 生成充值码
export async function createChargeCode( obj ) {
  return request( `${openService}/direct/charge-code`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改充值码状态
export async function updateChargeCode( obj ) {
  return request( `${openService}/direct/charge-code`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 获取充值码列表
export async function getChargeCodeDetail( obj ) {
  return request( `${openService}/direct/charge-code/page`, {
    method: 'GET',
    body: obj
  } );
}

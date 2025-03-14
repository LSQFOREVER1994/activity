import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';


const { cropService } = serviceObj;

// 获取分数排行
export async function getWatermelonRank( obj ) {
  return request( `${cropService}/watermelon/ranking-cms`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取奖品列表 
export async function getWatermelonPrizes( obj ) {
  return request( `${cropService}/base/prizes/${obj.id}/prizes`, {
    method: 'GET',
  }, 'JSON' );
}

// 获取用户详情数据
export async function getUserDetails( obj ) {
  const newObj = obj;
  return request( `${cropService}/watermelon/records`, {
    method: "GET",
    body: newObj
  }, 'JSON' );
}

// 一键发奖
export async function sendPrizes( obj ) {
  return request( `${cropService}/base/prizes/universal/send/prize/batch`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 发奖一键通知G
export async function sendPrizeMsg( obj ) {
  return request( `${cropService}/watermelon/user/message`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
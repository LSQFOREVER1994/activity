/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 获取猜涨跌排行榜列表
export async function getGuessRank( obj ) {
  return request( `${activityService}/element/guess/rank/cms`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取积分排行榜列表
export async function getIntegralRank( obj ) {
  return request( `${activityService}/integral/rank`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取猜涨跌用户详情
export async function getGuessRecords( obj ) {
  return request( `${activityService}/element/guess/user/records`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取积分排行榜用户详情
export async function getIntegralRecords( obj ) {
  return request( `${activityService}/integral/user/record/page`, {
    method: 'GET',
    body: obj,
  } );
}

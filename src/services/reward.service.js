/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 获取中奖名单列表
export async function getRewardRecord( obj ) {
  return request( `${activityService}/activity/reward-record/search`, {
    method: 'GET',
    body: obj,
  } );
}


// 获取活动参与次数明细
export function getActivityLeftCountList( obj ) {
  return request( `${activityService}/task/left-count/page`, {
    method: 'GET',
    body: obj,
  } )
}

// 获取用户参与次数具体流水
export function getLeftCountRecord( obj ) {
  return request( `${activityService}/task/left-count/record/page`, {
    method: 'GET',
    body: obj,
  } )
}

// 获取活动积分明细
export function getIntergralRecord( obj ) {
  return request( `${activityService}/integral/user/page`, {
    method: 'GET',
    body: obj,
  } )
}

// 获取用户具体积分明细
export function getUserIntergralRecord( obj ) {
  return request( `${activityService}/integral/user/record/page`, {
    method: 'GET',
    body: obj
  } )
}

// 获取用户参与记录
export function getParticipationRecord( obj ) {
  return request( `${activityService}/activity/users/page`, {
    method: 'GET',
    body: obj
  } )
}

// 获取用户参与图表数据
export function getParticipationData( obj ) {
  return request( `${activityService}/activity/users/statistics`, {
    method: 'GET',
    body: obj
  } )
}

// 奖品补发
export async function getRewardReissue( obj ){
  return request( `${activityService}/activity/reward-record/reissue`, {
    method: 'POST',
    body: obj,
  } );
}

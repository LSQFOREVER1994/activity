/* eslint-disable import/prefer-default-export */
import request, { request2 } from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { activityService, equityCenterService, activityUploadService } = serviceObj;
// 获取积分次数补发列表
export async function getReissueList( obj ) {
  return request( `${activityService}/reissue`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取积分次数补发列表
export async function getActivityIdNames( obj ) {
  return request( `${activityService}/activity/info`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取奖品类型列表
export async function getPrizeTypeList() {
  return request( `${activityService}/rights/getRightTypes`, {
    method: 'GET',
  } );
}

// 模糊搜索奖品列表
export async function getPrizeList( obj ) {
  return request( `${activityService}/rights/getRightList`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增积分次数补发items
export async function addReissue( obj ) {
  let isFile = false
  if ( obj && obj.file ) isFile = true
  return request2( `${activityUploadService}/reissue`, {
    method: 'POST',
    body: obj,
  }, 'FORM', isFile );
}

// 获取补发详情
export async function getBufaInfo( obj ) {
  return request( `${activityService}/reissue/detail`, {
    method: 'GET',
    body: obj,
  } );
}

// 查询补发失败用户名单
export async function getBufaFailedUserList( obj ) {
  return request( `${activityService}/reissue/user/fail`, {
    method: 'GET',
    body: obj,
  } );
}

// // 导出补发用户名单
// export async function exportBufaUserList( obj ) {
//   return download( `${activityService}/reissue/user/export/${obj.id}` );
// }

// 获取补发任务列表
export async function getTaskList( obj ) {
  return request( `${activityService}/task/task/list`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取商户下拉列表
export async function getMerchantList( obj ) {
  return request( `${equityCenterService}/merchant/all`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取商户可见列表
export async function getVisibleGoodsList( obj ) {
  return request( `${equityCenterService}/merchant/right/page`, {
    method: 'GET',
    body: obj,
  } );
}

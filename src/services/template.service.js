/* eslint-disable import/prefer-default-export */
import request, { request2 } from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService, activityUploadService } = serviceObj;

// 获取我的模版列表
export async function getMineTemplateList( obj ) {
  return request( `${activityService}/activity/template/mine`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取公共模板列表 
export async function getActivityTemplateList( obj ) {
  return request( `${activityService}/activity/template`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取审核列表
export async function getAuditList( obj ) {
  return request( `${activityService}/activity/template/audit/page`, {
    method: 'GET',
    body: obj,
  } );
}

// 导入活动
export async function importTemplate( obj ) {
  return request2( `${activityUploadService}/activity/template/mine/import?isCommon=${obj.isCommon}`, {
    method: 'POST',
    body: obj.file,
  }, 'JSON' );
}


// 转为公共模板
export async function intoCommonTemplate( obj ) {
  return request( `${activityService}/activity/template/audit/commit`, {
    method: 'GET',
    body: obj,
  } )
}

// 修改模版信息
export async function editTemplate( obj ) {
  return request( `${activityService}/activity/template/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除模版信息
export async function delTemplate( obj ) {
  return request( `${activityService}/activity/template/delete`, {
    method: 'GET',
    body:obj
  } );
}

// 修改模板审核
export async function auditTemplate( obj ) {
  return request( `${activityService}/activity/template/audit`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

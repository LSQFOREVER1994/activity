/* eslint-disable import/prefer-default-export */
import request, { request2 } from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService, activityUploadService } = serviceObj;

// 获取题目列表
export async function getAnswerList( obj ) {
  return request( `${activityService}/questions/page`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取标签列表
export async function getTagList( obj ) {
  return request( `${activityService}/question-tags/page`, {
    method: 'GET',
    body: obj,
  } );
}
// 删除标签
export async function delTag( obj ) {
  return request( `${activityService}/question-tags/delete`, {
    method: 'GET',
    body: obj,
  } );
}
// 新建题目
export async function addAnswer( obj ) {
  return request( `${activityService}/questions/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 编辑题目
export async function updateAnswer( obj ) {
  return request( `${activityService}/questions/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 删除题目
export async function delAnswer( obj ) {
  return request( `${activityService}/questions/delete`, {
    method: 'GET',
    body: obj,
  } );
}
// 新增标签
export async function addTag( obj ) {
  return request( `${activityService}/question-tags/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改标签
export async function updateTag( obj ) {
  return request( `${activityService}/question-tags/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改标签启用
export async function changeStatus( obj ) {
  return request( `${activityService}/question-tags/enable`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 导入模板题目
export async function saveAnswerModel( obj ) {
  return request2( `${activityUploadService}/questions/import`, {
    method: 'POST',
    body: obj,
  } );
}

/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { libraryService, openService } = serviceObj;

// 获取公共分类列表
export async function getCategoryList( obj ) {
  return request( `${libraryService}/material/category`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取我的分类列表
export async function getMineCategoryList( obj ) {
  return request( `${libraryService}/material/category/mine`, {
    method: 'GET',
    body: obj,
  } );
}
// 新增分类
export async function addCategory( obj ) {
  return request( `${libraryService}/material/category`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改分类
export async function editCategory( obj ) {
  return request( `${libraryService}/material/category/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改公共素材所有分类
export async function editCategoryAll( obj ) {
  return request( `${libraryService}/material/category/updateAll`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改我的素材所有分类
export async function editMineCategoryAll( obj ) {
  return request( `${libraryService}/material/category/update/mine/all`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 删除分类
export async function delCategory( obj ) {
  return request( `${libraryService}/material/category/delete`, {
    method: 'GET',
    body:obj
  } );
}

// 获取素材列表
export async function getMaterialList( obj ) {
  return request( `${libraryService}/material`, {
    method: 'GET',
    body: obj,
  } );
}

// 素材保存
export async function saveMaterial( obj ) {
  return request( `${libraryService}/material/saveMaterial`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 批量删除素材
export async function batchDelMaterial( obj ) {
  return request( `${libraryService}/material/delete`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 批量修改素材
export async function batchEditMaterial( obj ) {
  return request( `${libraryService}/material/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 易企秀链接上传文件
export async function uploadUrlFile( obj ) {
  return request( `${libraryService}/files/url/material?imageUrl=${obj.imageUrl}`, {
    method: 'POST',
    body: obj.item,
  }, 'JSON' );
}

// 获取易企秀作品信息
export async function getEQXiuOpus( obj ) {
  return request( `${openService}/eqxiu/creation/info`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取我的素材
export async function getMineMaterialList( obj ) {
  return request( `${libraryService}/material/mine`, {
    method: 'GET',
    body: obj,
  } );
}

// 提交素材至审核列表
export async function commitMaterial( obj ) {
  return request( `${libraryService}/material/audit/commit`, {
    method: 'GET',
    body: obj,
  } );
}

// 审核素材
export async function batchAuditMaterial( obj ) {
  return request( `${libraryService}/material/audit`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取审核列表
export async function getAuditList( obj ) {
  return request( `${libraryService}/material/audit/page`, {
    method: 'GET',
    body: obj,
  } );
}

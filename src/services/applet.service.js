/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 10:59:51
 * @LastEditTime: 2019-08-14 18:42:45
 * @LastEditors: Please set LastEditors
 */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { openService } = serviceObj;
/* eslint-disable import/prefer-default-export */ 
// GET /users/shortInfo
export async function getShareManageData( obj ) {
  return request( `${openService}/wx/applets/shares`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增 POST /快捷小程序列表
export async function addShareManageData( obj ) {
  return request( `${openService}/wx/applets/shares`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改 PUT /快捷小程序/{id}
export async function exitShareManageData( obj ) {
  return request( `${openService}/wx/applets/shares`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 删除 DELETE /快捷小程序/{id}
export async function delShareManageData( obj ) {
  return request( `${openService}/wx/applets/shares/${obj.id}`, {
    method: 'DELETE',
    body: obj,
  } );
}
/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-26 13:51:17
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-06-27 11:40:52
 * @FilePath: /data_product_cms_ant-pro/src/services/activityAudit.service.js
 */

import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;
// 获取审批列表
export function getAuditList( obj ) {
  return request( `${activityService}/activity/approval/page`, {
    method: 'GET',
    body: obj,
  } )
}

// 获取审批流
export function getAuditFlow( obj ) {
  return request( `${activityService}/activity/approval/flow`, {
    method: 'GET',
    body: obj,
  } )
}
// 审批
export function getAudit( obj ) {
  return request( `${activityService}/activity/approval`, {
    method: 'POST',
    body: obj,
  } )
}

// 审批数量
export function getAuditNum( obj ) {
  return request( `${activityService}/activity/approval/count`, {
    method: 'GET',
    body: obj,
  } )
}

export function getAuditItemDetail( obj ) {
  return request( `${activityService}/activity/approval/detail`, {
    method: 'GET',
    body: obj,
  } )
}
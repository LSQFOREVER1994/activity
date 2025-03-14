/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-26 13:51:1
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-23 10:18:28
 * @FilePath: /data_product_cms_ant-pro/src/services/activityAudit.service.js
 */

import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { statisticsService } = serviceObj;
// 获取客户经理列表
export function getCustomerList( obj ) {
  return request( `${statisticsService}/customerManager/page`, {
    method: 'GET',
    body: obj,
  } )
}

// 新增客户经理
export function getAddCustomer( obj ) {
  return request( `${statisticsService}/customerManager/add`, {
    method: 'POST',
    body: obj,
  } )
}

// 删除客户经理
export function deleteCustomer( obj ) {
  return request( `${statisticsService}/customerManager/delete`, {
    method: 'POST',
    body: obj,
  } )
}

// 修改客户经理
export function editCustomer( obj ) {
  return request( `${statisticsService}/customerManager/update`, {
    method: 'GET',
    body: obj,
  } )
}

// ------------------------------活动内客户经理详情------------------------------

// 活动内新增客户经理信息
export function addActivityCustomer( obj ) {
  return request( `${statisticsService}/customerManager/activity/add`, {
    method: 'GET',
    body: obj,
  } )
}

// 查询所有的客户经理信息
export function activityAllCustomer( obj ) {
  return request( `${statisticsService}/customerManager/all`, {
    method: 'GET',
    body: obj,
  } )
}

// 活动内启用或禁用已添加的客户经理信息
export function updateCustomerStatus( obj ) {
  return request( `${statisticsService}/customerManager/activity/updateStatus`, {
    method: 'GET',
    body: obj,
  } )
}

// 活动内查询已添加的客户经理信息
export function getActivityCustomerlList( obj ) {
  return request( `${statisticsService}/customerManager/activity/list`, {
    method: 'GET',
    body: obj,
  } )
}

// 查询活动下客户经理数据
export function getActivityCustomerData( obj ) {
  return request( `${statisticsService}/statistics/activity/browseData`, {
    method: 'GET',
    body: obj,
  } )
}

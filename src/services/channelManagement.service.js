/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-26 13:51:1
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-22 14:51:45
 * @FilePath: /data_product_cms_ant-pro/src/services/activityAudit.service.js
 */

import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { statisticsService } = serviceObj;
// 获取渠道列表
export function getChannelList( obj ) {
  return request( `${statisticsService}/channel/page`, {
    method: 'GET',
    body: obj,
  } )
}

// 新增渠道
export function getAddChannel( obj ) {
  return request( `${statisticsService}/channel/save`, {
    method: 'GET',
    body: obj,
  } )
}

// 删除渠道
export function deleteChannel( obj ) {
  return request( `${statisticsService}/channel/delete`, {
    method: 'POST',
    body: obj,
  } )
}

// 修改渠道
export function editChannel( obj ) {
  return request( `${statisticsService}/channel/update`, {
    method: 'GET',
    body: obj,
  } )
}

// ------------------------------活动内渠道详情------------------------------

// 活动内新增渠道信息
export function addActivityChannel( obj ) {
  return request( `${statisticsService}/channel/bind`, {
    method: 'GET',
    body: obj,
  } )
}

// 查询所有的渠道信息
export function activityAllChannel( obj ) {
  return request( `${statisticsService}/channel/all`, {
    method: 'GET',
    body: obj,
  } )
}

// 活动内启用或禁用已添加的渠道信息
export function updateChannelStatus( obj ) {
  return request( `${statisticsService}/channel/updateStatus`, {
    method: 'GET',
    body: obj,
  } )
}

// 活动内查询已添加的渠道信息
export function getActivityChannelList( obj ) {
  return request( `${statisticsService}/channel/list`, {
    method: 'GET',
    body: obj,
  } )
}

// 查询活动下渠道数据
export function getActivityChannelData( obj ) {
  return request( `${statisticsService}/statistics/activity/browseData`, {
    method: 'GET',
    body: obj,
  } )
}
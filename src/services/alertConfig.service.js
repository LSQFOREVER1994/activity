/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-24 17:37:36
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-07-12 14:05:07
 * @FilePath: /data_product_cms_ant-pro/src/services/alertConfig.service.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { equityCenterService, userService } = serviceObj;

// 查询预警配置类列表
export async function getAlertList( obj ) {
    return request( `${equityCenterService}/right/earlyConfigurantion`, {
        method: 'GET',
        body: obj
    } )
}

// 预警配置详情
export async function getAlertDetail( obj ) {
    return request( `${equityCenterService}/right/earlyConfigurantion`, {
        method: 'GET',
        body: obj
    } )
}
// 是否开启预警配置提醒
export async function changeStatus( obj ) {
    return request( `${equityCenterService}/right/earlyConfigurantion/shelf`, {
        method: 'POST',
        body: obj
    } )
}
// 新增预警
export async function addAlert( obj ) {
    return request( `${equityCenterService}/right/earlyConfigurantion/add`, {
        method: 'POST',
        body: obj
    }, 'JSON' )
}
// 删除预警
export async function delAlert( obj ) {
    return request( `${equityCenterService}/right/earlyConfigurantion/remove`, {
        method: 'POST',
        body: obj
    } )
}

// 商户修改
export async function updateAlert( obj ) {
    return request( `${equityCenterService}/right/earlyConfigurantion/update`, {
        method: 'POST',
        body: obj
    }, 'JSON' )
}

// 管理员列表
export async function getManagerUserList( obj ){
    return request( `${userService}/userManager/managerUserList`, {
      method: 'POST',
      body: obj,
    }, "JSON" );
  }



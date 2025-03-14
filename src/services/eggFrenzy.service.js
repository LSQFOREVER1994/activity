/*
 * @Description: In User Settings Edit
 * @Author: lizengyuan
 * @Date: 2020-07-22 11:42:00
 * @LastEditTime:  2020-07-22 11:50:00
 * @LastEditors: lizengyuan
 */
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { cropService } = serviceObj;

// 新增砸金蛋 
export async function addEggFrenzy(obj) {
  return request(`${cropService}/base/activities`, {
    method: 'POST',
    body: obj
  }, "JSON");
}

// 删除砸金蛋
export async function delEggFrenzy(obj) {
  return request(`${cropService}/base/activities/${obj.id}`, {
    method: 'DELETE',
  });
}


// 编辑砸金蛋
export async function editEggFrenzy(obj) {
  return request(`${cropService}/base/activities`, {
    method: 'PUT',
    body: obj
  }, "JSON");
}


// 获取砸金蛋
export async function getEggFrenzy(obj) {
  return request(`${cropService}/base/activities/${obj.id}`, {
    method: 'GET',
    // body:obj
  });
}

// 砸金蛋抽奖
export async function getEggFrenzyPrize(obj) {
  return request(`${cropService}/base/prizes/${obj.id}/draw`, {
    method: 'POST',
    // body:obj
  });
}
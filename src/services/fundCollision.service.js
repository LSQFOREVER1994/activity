
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';
import { functions } from 'lodash';

const { cropService } = serviceObj;

// 增加基金对对碰
export async function addFundCollision(obj) {
  return request(`${cropService}/base/activities`, {
    method: "POST",
    body: obj,
  }, 'JSON');
}

// 删除基金对对碰
export async function delFundCollision(id) {
  return request(`${cropService}/base/activities/${id}`, {
    method: "DELETE",
    body: { id },
  });
}

// 修改基金对对碰
export async function editFundCollision(obj) {
  return request(`${cropService}/base/activities`, {
    method: "PUT",
    body: obj,
  }, "JSON");
}

// 查询基金对对碰
export async function getFundCollision(id) {
  return request(`${cropService}/base/activities/${id}`, {
    method: "GET",
  });
}


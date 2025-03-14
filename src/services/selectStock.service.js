import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { filterService } = serviceObj;

// 条件列表获取 GET /condition
export async function getCondition(obj) {
  return request(`${filterService}/condition`, {
    method: 'GET',
    body: obj,
  });
}

// 条件列表新增 POST /condition
export async function addCondition(obj) {
  return request(`${filterService}/condition`, {
    method: 'POST',
    body: obj,
  }, 'JSON');
}
// 条件列表修改 PUT /condition
export async function exitCondition(obj) {
  return request(`${filterService}/condition`, {
    method: 'PUT',
    body: obj,
  }, 'JSON');
}
// 条件列表删除 DELETE /condition/{id}
export async function delCondition(id) {
  return request(`${filterService}/condition/${id}`, {
    method: 'DELETE',
    body: { id },
  });
}

// 配置列表获取 GET /config
export async function getGroups(obj) {
  return request(`${filterService}/config`, {
    method: 'GET',
    body: obj,
  });
}

// 配置列表新增 POST /config
export async function addGroups(obj) {
  return request(`${filterService}/config`, {
    method: 'POST',
    body: obj,
  }, 'JSON');
}
// 配置列表修改 PUT /config
export async function exitGroups(obj) {
  return request(`${filterService}/config`, {
    method: 'PUT',
    body: obj,
  }, 'JSON');
}
// 配置列表删除 DELETE /config/{id}
export async function delGroups(id) {
  return request(`${filterService}/config/${id}`, {
    method: 'DELETE',
    body: { id },
  });
}

// 配置列表删除 DELETE /config/{id}
export async function searchGroups(queryKey) {
  return request(`${filterService}/config/like`, {
    method: 'GET',
    body: queryKey,
  });
}
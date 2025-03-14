import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { loopbackService } = serviceObj;

//  获取回测模型列表
export async function getModalList(obj) {
  return request(`${loopbackService}/loopBack/list`, {
      method: 'GET',
      body: obj
  });
}

//  获取买卖点条件列表
export async function getGroups(obj) {
  return request(`${loopbackService}/loopBack/groups`, {
      method: 'GET',
      body: obj
  });
}

// 查询回测作业详情
export async function getModalDetail(obj) {
  const { id } = obj;
  return request(`${loopbackService}/loopBack/detail`, {
    method: 'GET',
    body: {
      id
    }
  });
}

//  创建回测作业
export async function addModal(obj) {
  return request(`${loopbackService}/loopBack/create?${obj}`, {
      method: 'POST',
      body: {}
  });
}

//  删除回测作业
export async function delModal(obj) {
  const { id } = obj;
  return request(`${loopbackService}/loopBack/delete`, {
      method: 'DELETE',
      body: {
        id
      }
  });
}
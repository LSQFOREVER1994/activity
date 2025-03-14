import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { activityService } = serviceObj;

// 查询功能配置列表
export const getFunctionConfigList = body => {
  return request( `${activityService}/jump/config`, { body, method: 'GET' } );
};

// 添加功能配置
export const addFunctionConfig = body => {
  return request( `${activityService}/jump/config/add`, { body, method: 'POST' }, 'JSON' );
};

// 修改功能配置
export const updateFunctionConfig = body => {
  return request( `${activityService}/jump/config/update`, { body, method: 'POST' }, 'JSON' );
};

// 删除功能配置
export const deleteFunctionConfig = id => {
  return request( `${activityService}/jump/config/delete`, { body:{ id }, method: 'GET' } );
};

// 根据类型查询配置
export const typeFunctionConfig = body => {
  return request( `${activityService}/jump/config/show`, { method: 'GET', body } );
};

import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { taskService } = serviceObj;

// 获取任务事件列表
export async function getTaskEventList( obj ) {
  return request( `${taskService}/event`, {
    method: 'GET',
    body: obj
  } );
}
 
// 新增任务事件
export async function addTask( obj ) {
  return request( `${taskService}/event`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 编辑任务事件 
export async function editTask( obj ) {
  return request( `${taskService}/event`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除任务事件列表
export async function delTask( obj ) {
  return request( `${taskService}/event/${obj.id}`, {
    method: 'DELETE',
  } );
}

// 获取任务统计列表
export async function getTaskStatistics( obj ) {
  return request( `${taskService}/statistic/task`, {
    method: 'GET',
    body: obj
  } );
}

// 获取任务统计详情 
export async function initChartsData( obj ) {
  return request( `${taskService}/statistic`, {
    method: 'GET',
    body: obj
  } );
}
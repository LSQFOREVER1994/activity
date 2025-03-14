import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { statisticsService } = serviceObj;

// 获取app列表
export async function getAppData( obj ) {
  return request( `${statisticsService}/statistics/app`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取指定app
export async function getAppointAppData( obj ) {
  return request( `${statisticsService}/statistics/app`, {
    method: 'GET',
    body:obj
  } );
}

// 新增 POST /app
export async function addAppData( obj ) {
  return request( `${statisticsService}/statistics/app`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改 PUT /app/{appid}
export async function exitAppData( obj ) {
  return request( `${statisticsService}/statistics/app/${obj.appId}`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 删除 DELETE /app/{appid}
export async function delAppData( appId ) {
  return request( `${statisticsService}/statistics/app/${appId}`, {
    method: 'DELETE',
    body: { appId },
  } );
}

// 获取事件详情数据
export async function getEventDaily( obj ) {
  return request( `${statisticsService}/statistics/event/daily`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取事件值列表
export async function getEventSum( obj ) {
  return request( `${statisticsService}/statistics/event/daily/sum`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取事件值列表
export async function getEventValueSum( obj ) {
  return request( `${statisticsService}/statistics/event/daily/values`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取APP每日数据统计
export async function getAppDaily( obj ) {
  return request( `${statisticsService}/statistics/app/daily`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取APP存留率数据
export async function getRateDaily( obj ) {
  return request( `${statisticsService}/statistics/rate`, {
    method: 'GET',
    body: obj,
  } );
}


// 获取短链列表
export async function getShortLinkList( obj ) {
  return request( `${statisticsService}/min/link/list`, {
    method: 'GET',
    body:obj
  } );
}

// 新增短链
export async function addShortLink( obj ) {
  return request( `${statisticsService}/min/link/create`, {
    method: 'POST',
    body:obj,
  } );
}

// 删除短链
export async function deleteShortLink( obj ) {
  return request( `${statisticsService}/min/link/delete`, {
    method: 'POST',
    body:obj,
  } );
}

// 修改短链
export async function editShortLink( obj ) {
  return request( `${statisticsService}/min/link/update`, {
    method: 'POST',
    body:obj,
  } );
}
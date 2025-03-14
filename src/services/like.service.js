import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 查询点赞记录
export function getLikeStatistics( obj ) {
  return request( `${activityService}/element/like/search`, {
    method: 'GET',
    body: obj,
  } )
}

// 点赞图表统计
export function getLikeLineData( obj ) {
  return request( `${activityService}/element/like/statistics`, {
    method: 'GET',
    body: obj
  } )
}
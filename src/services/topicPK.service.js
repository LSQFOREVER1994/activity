/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 获取话题pk列表
export async function getTopicPKList( obj ) {
  return request( `${activityService}/element/pk-topic/list`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取话题pk列表
export async function getTopicPKDetail( obj ) {
  return request( `${activityService}/element/pk-topic/detail`, {
    method: 'GET',
    body: obj,
  } );
}

/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 获取内容管理列表
export async function getComment( obj ) {
  return request( `${activityService}/content`, {
    method: 'GET',
    body: obj,
  } );
}
// 修改内容审批
export async function toExamine( obj ) {
  return request( `${activityService}/content`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 话题组件列表获取
export async function getTopicElementList( obj ) {
  return request( `${activityService}/content/pk-topic/element`, {
    method: 'GET',
    body: obj,
  } );
}


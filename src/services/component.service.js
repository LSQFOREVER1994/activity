/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 获取中奖名单列表
export async function getComponentList( obj ) {
  return request( `${activityService}/activity/element`, {
    method: 'GET',
    body: obj,
  } );
}

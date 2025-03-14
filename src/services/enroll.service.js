/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 获取报名列表
export async function getActivityEnrollList( obj ) {
  return request( `${activityService}/element/enroll/page`, {
    method: 'GET',
    body: obj,
  } );
}

/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

export async function getInvite( obj ) {
  return request( `${activityService}/task/invite/search`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getInviteList( obj ) {
  return request( `${activityService}/task/invite/statistics`, {
    method: 'GET',
    body: obj,
  } );
}

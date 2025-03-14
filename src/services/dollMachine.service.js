/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

export async function getDataList( obj ) {
  return request( `${activityService}/element/doll-machine/users`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getTrend( obj ) {
  return request( `${activityService}/element/doll-machine/stats/trend`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getInfo( obj ) {
  return request( `${activityService}/element/doll-machine/stats/info`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getUserRecord( obj ) {
  return request( `${activityService}/element/doll-machine/records`, {
    method: 'GET',
    body: obj,
  } );
}

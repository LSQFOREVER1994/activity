/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

export async function getDataList( obj ) {
  return request( `${activityService}/receive-gold/users`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getTrend( obj ) {
  return request( `${activityService}/receive-gold/stats/trend`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getInfo( obj ) {
  return request( `${activityService}/receive-gold/stats/info`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getUserRecord( obj ) {
  return request( `${activityService}/receive-gold/records`, {
    method: 'GET',
    body: obj,
  } );
}

/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { activityService } = serviceObj;

export async function getAllRankData( obj ) {
  return request( `${activityService}/element/rank/cms`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

export async function getGuessPeriods( obj ) {
  return request( `${activityService}/guess/periods`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getUserGuessRecord( obj ) {
  return request( `${activityService}/guess/periods/records`, {
    method: 'POST',
    body: obj,
  } );
}

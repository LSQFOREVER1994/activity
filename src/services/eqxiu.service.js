/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { libraryService } = serviceObj;

export async function getEqxiuLoginCode( obj ) {
  return request( `${libraryService}/external/getAuth`, {
    method: 'GET',
    body: obj,
  } );
}

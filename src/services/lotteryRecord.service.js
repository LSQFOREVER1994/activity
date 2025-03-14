import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { activityService } = serviceObj;

// 查询抽奖记录
export default function getLotteryRecord( obj ) {
  return request( `${activityService}/lottery`, {
    method: 'GET',
    body: obj,
  } )
}

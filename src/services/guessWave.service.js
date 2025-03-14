import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';
import { func } from 'prop-types';


const { customGameService, accountService } = serviceObj;

export async function getGuessgameRanking(obj) {
  return request(`${customGameService}/guessgame/ranking`, {
    method: 'GET',
    body: obj,
  });
}


export async function getGuessgameRank(obj) {
  return request(`${customGameService}/guessgame/historyRank`, {
    method: "GET",
    body: obj
  });
}


export async function getGuessgameCurrentRank(obj) {
  return request(`${customGameService}/guessgame/ranking`, {
    method: "GET",
    body: obj
  });
}
export async function getHistoryRankDates(obj) {
  return request(`${customGameService}/guessgame/historyRank/dates`, {
    method: "GET",
    body: obj
  });
}

export async function getCreditDetails(obj) {
  const pageNum = obj.pageNum;
  const pageSize = obj.pageSize;
  const orderBy = obj.orderBy;
  const accountId = obj.accountId;
  delete obj.pageNum;
  delete obj.pageSize;
  delete obj.orderBy;
  return request(`${accountService}/waters/${obj.accountId}?pageNum=${pageNum}&pageSize=${pageSize}${orderBy ? `&orderBy=${orderBy}` : ''}`, {
    method: "GET",
    body: obj
  }, 'JSON');
}

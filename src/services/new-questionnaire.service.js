/*
 * @Description: In User Settings Edit
 * @Author: yangjingrong
 * @Date: 2020-05-25 23:09:51
 * @LastEditTime:  2020-05-25 23:09:51
 * @LastEditors: yangjingrong
 */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { activityService } = serviceObj;

// 导出
export async function getQuestionnaireExport( obj ){
  return request( `${activityService}/questionnaire/data/export/${obj.id}`, {
    method: 'GET',
  } );
}


// 数据统计
export async function getQuestionnaireStatistics( obj ){
  return request( `${activityService}/questionnaire/data/statistics`, {
    method: 'GET',
    body:obj
  } );
}

// 数据详情
export async function getQuestionnaireDetail( obj ){
  return request( `${activityService}/questionnaire/data/detail`, {
    method: 'POST',
    body:obj
  } );
}

// 题目详情
export async function getQuestion( obj ){
  return request( `${activityService}/questionnaire/question/detail`, {
    method: 'POST',
    body:obj
  } );
}

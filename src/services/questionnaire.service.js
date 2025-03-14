/*
 * @Description: In User Settings Edit
 * @Author: yangjingrong
 * @Date: 2020-05-25 23:09:51
 * @LastEditTime:  2020-05-25 23:09:51
 * @LastEditors: yangjingrong
 */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { cropService } = serviceObj;
/* eslint-disable import/prefer-default-export */ 


// 新增问卷活动
export async function addQuestionnaire( obj ) {
  return request( `${cropService}/questionnaire/new`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除活动
export async function deleteQuestionnaire( id ) {
  return request( `${cropService}/questionnaire/new/${id}`, {
    method: 'DELETE',
  } );
}


// 修改问卷活动
export async function editQuestionnaire( obj ) {
  return request( `${cropService}/questionnaire/new`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 查询问卷活动
export async function getQuestionnaire( obj ){
  return request( `${cropService}/questionnaire/new/cms/${obj.id}`, {
    method: 'GET',
  } );
}

// 查询问卷活动列表
export async function getQuestionnaireList( obj ){
  return request( `${cropService}/questionnaire/new`, {
    method: 'GET',
    body:obj
  } );
}

// 导出
export async function getQuestionnaireExport( obj ){
  return request( `${cropService}/questionnaire/new/data/export/${obj.id}`, {
    method: 'GET',
  } );
}

// 数据统计
export async function getQuestionnaireStatistics( obj ){
  return request( `${cropService}/questionnaire/new/data/statistics/${obj.id}`, {
    method: 'GET',
  } );
}

// 数据详情
export async function getQuestionnaireDetail( obj ){
  return request( `${cropService}/questionnaire/new/data/detail/${obj.id}`, {
    method: 'GET',
    body:obj
  } );
}
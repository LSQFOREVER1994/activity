import {
  getQuestionnaireExport,
  getQuestionnaireStatistics,
  getQuestionnaireDetail,
 } from '@/services/new-questionnaire.service';


export default {
 namespace: 'questionnaireData',

 state: {
   loading: false,
   questionnaireMap:{}
 },


 effects: {
   // 数据统计
   *getQuestionnaireStatistics( { payload, callFunc }, { call, put } ){
     yield put( {
       type: 'SetState',
       payload:{
         loading:true
       },
     } );
     const { success, result } = yield call( getQuestionnaireStatistics, payload );
     if ( success ) {
       callFunc( result )
       yield put( {
         type: 'SetState',
         payload:{
           loading:false,
         },
       } );
     }
   },

   // 数据详情
   *getQuestionnaireDetail( { payload, callFunc }, { call, put } ){
     yield put( {
       type: 'SetState',
       payload:{
         loading:true
       },
     } );
     const { success, result } = yield call( getQuestionnaireDetail, payload );
     if ( success ) {
       callFunc( result )
       yield put( {
         type: 'SetState',
         payload:{
           loading:false
         },
       } );
     }
   },

   // 导出
   *getQuestionnaireExport( { payload, callFunc }, { call, put } ){
     yield put( {
       type: 'SetState',
       payload:{
         loading:true
       },
     } );
     const { success, result } = yield call( getQuestionnaireExport, payload );
     if ( success ) {
       callFunc( result )
       yield put( {
         type: 'SetState',
         payload:{
           loading:false
         },
       } );
     }
   },
 },


 reducers: {
   SetState( state, { payload } ){
     return {
       ...state,
       ...payload
     }
   },
 },
};

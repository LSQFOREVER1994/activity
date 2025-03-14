/*
 * @Description: In User Settings Edit
 * @Author: yangjingrong
 * @Date: 2020-05-25 23:09:51
 * @LastEditTime:  2020-05-25 23:09:51
 * @LastEditors: yangjingrong
 */
import { message } from 'antd';
import {
   addQuestionnaire,
   editQuestionnaire, 
   getQuestionnaire,
   getQuestionnaireList,
   getQuestionnaireExport,
   getQuestionnaireStatistics,
   getQuestionnaireDetail,
  } from '@/services/questionnaire.service';


export default {
  namespace: 'questionnaire',
  
  state: {
    loading: false,
    questionnaireMap:{}
  },

  
  effects: {
    //  根据id获取弹幕活动信息
    *getQuestionnaire( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const { success, result } = yield call( getQuestionnaire, payload );
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

    // 新增弹幕活动
    *addQuestionnaire( { payload:{  params, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data =  yield call( addQuestionnaire, params );
      if ( data.success ) {
        callFunc( data.result );
        message.success( data.message );
        yield put( {
          type: 'SetState',
          payload:{
            loading:false
          },
        } );
      } else {
        message.error( data.message );
        yield put( {
          type: 'SetState',
          payload:{
            loading:false
          },
        } );
      }
    },

    // 修改弹幕活动
    *editQuestionnaire( { payload:{  params, callFunc } }, { call, put } ) {
          yield put( {
            type: 'SetState',
            payload:{
              loading:true
            },
          } );
       const data =  yield call( editQuestionnaire, params );
          if ( data.success ) {
            callFunc( data.result );
            message.success( data.message );
            yield put( {
              type: 'SetState',
              payload:{
                loading:false
              },
            } );
          } else {
            message.error( data.message );
            yield put( {
              type: 'SetState',
              payload:{
                loading:false
              },
            } );
          }
    },

    // 查询问卷活动列表
    *getQuestionnaireList( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const { success, result } = yield call( getQuestionnaireList, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
            questionnaireMap:result
          },
        } );
        callFunc( result )
      }
    },

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

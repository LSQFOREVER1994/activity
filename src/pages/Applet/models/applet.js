/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 10:59:51
 * @LastEditTime: 2019-08-14 18:43:42
 * @LastEditors: Please set LastEditors
 */
import { message } from 'antd';
import {
  getShareManageData, addShareManageData, exitShareManageData, delShareManageData,
} from '@/services/applet.service';


export default {
  namespace: 'applet',
  
  state: {
    loading: false,
    shareManageData: {
      total: 0,
      list: [],
    },
  },

  
  effects: {

    // 快捷小程序列表
    *getShareManageData( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      
      const { success, result } = yield call( getShareManageData, payload );
      if ( success ) {
        yield put( {
          type: 'setShareManageData',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
    *submitShareManageData( { payload, callFunc }, { call } ) {
      const data = payload.id ? yield call( exitShareManageData, payload ) : yield call( addShareManageData, payload );
      if ( data.success ) {
        callFunc( data.result );
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },
    *delShareManageData( { payload, callFunc }, { call } ) {
      const data = yield call( delShareManageData, payload );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
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
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },

    setShareManageData( state, { payload } ) {
      return {
        ...state,
        shareManageData: payload,
      };
    }, 
  },  
};

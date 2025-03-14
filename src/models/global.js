/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2023-12-28 14:49:35
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-05-30 11:36:39
 * @FilePath: /data_product_cms_ant-pro/src/models/global.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { message } from 'antd';
import {
  addShareManageData, exitShareManageData,
} from '@/services/applet.service';
import { getUnreadCount, getMessageModalList } from '@/services/messageCenter.service';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    unreadCount:0
  },

  effects: {

    *submitShareManageData( { payload, callFunc }, { call } ) {
      const data = payload.id ? yield call( exitShareManageData, payload ) : yield call( addShareManageData, payload );
      if ( data.success ) {
        callFunc( data.result );
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    *getGlobalUnreadCount( { payload:{ callFunc } }, { call, put } ){
      const data = yield call( getUnreadCount );
      if( data.success ){
        yield put( {
          type: 'changeUnreadCount',
          payload: data.result,
        } );
        if( callFunc ){
          callFunc( data.result )
        }
      }
    },

    *getMessageModalList( { payload:{ callFunc } }, { call } ){
      const data = yield call( getMessageModalList );
      if( data.success && callFunc ){
        callFunc( data.result )
      }
    }
  },

  reducers: {
    changeLayoutCollapsed( state, { payload } ) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    changeUnreadCount( state, { payload } ) {
      return {
        ...state,
        unreadCount: payload,
      };
    },
  },

  subscriptions: {
    setup( { history } ) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen( ( { pathname, search } ) => {
        if ( typeof window.ga !== 'undefined' ) {
          window.ga( 'send', 'pageview', pathname + search );
        }
      } );
    },
  },
};

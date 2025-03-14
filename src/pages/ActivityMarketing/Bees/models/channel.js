/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-28 16:07:18
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-23 10:25:56
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/Bees/models/channel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { message } from 'antd';
import { addActivityChannel, activityAllChannel, updateChannelStatus, getActivityChannelList, getActivityChannelData } from '@/services/channelManagement.service';

export default {
  namespace: 'channelDetail',

  state: {
    loading: false,
    channelData:[],
    channelList:[],
    selectChannelList:[],
  },

  effects: {
    *getActivityChannelList( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getActivityChannelList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { channelList: data.result },
        } );
        if( callFunc ) callFunc();
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    *addActivityChannel( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( addActivityChannel, query );
      if ( data.success ) {
        callFunc()
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    *getActivityAllChannel( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( activityAllChannel, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { selectChannelList: data.result },
        } );
        if( callFunc ) callFunc();
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    *updateChannelStatus( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( updateChannelStatus, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { selectChannelList: data.result },
        } );
        if( callFunc ) callFunc();
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    *getActivityChannelData( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getActivityChannelData, query );
      if ( data.success && data.result ) {
        const value = data.result.map( ( item )=> ( { ...item, value:item.viewNum } ) )
        yield put( {
          type: 'SetState',
          payload: { channelData: value },
        } );
        if( callFunc ) callFunc();
      };
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
  },

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload
      }
    },
  },
};

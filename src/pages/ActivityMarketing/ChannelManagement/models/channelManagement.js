/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-20 15:29:44
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-06-28 15:41:36
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ChannelManagement/models/channelManagement.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { getChannelList, getAddChannel, deleteChannel, editChannel } from '@/services/channelManagement.service';

export default {
  namespace: 'channelManagement',

  state: {
    loading: false,
    channelMap: {
      list: [],
      total: 0,
    },
  },

  effects: {
    *getChannelList( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getChannelList, query );
      if ( data.success ) {
        yield put( { type: 'setChannelMap', payload: data.result } );
        if( callFunc ) {
          callFunc( data.result )
        }
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *getAddChannel( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getAddChannel, query );
      if ( data.success ) {
        callFunc( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *editChannel( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( editChannel, query );
      if ( data.success ) {
        callFunc( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *deleteChannel( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( deleteChannel, query );
      if ( data.success ) {
        callFunc( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },
  },

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload,
      };
    },
    setLoading: ( state, { payload } ) => {
      return { ...state, loading: payload };
    },
    setChannelMap: ( state, { payload } ) => {
      return { ...state, channelMap: payload };
    },
  },
};

/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-20 15:29:44
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-06-27 14:38:45
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ChannelManagement/models/channelManagement.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as ShortLinkService from '@/services/statistics.service.js';

export default {
  namespace: 'shortChainCreate',

  state: {
    loading: false,
    shortLinkMap: {
      list: [],
      total: 0,
    },
  },

  effects: {
    *getShortLinkList( { payload:{ query } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( ShortLinkService.getShortLinkList, query );
      if ( data.success ) {
        yield put( { type: 'setData', payload: data.result } );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *addShortLink( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( ShortLinkService.addShortLink, query );
      if ( data.success ) {
        callFunc( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *editShortLink( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( ShortLinkService.editShortLink, query );
      if ( data.success ) {
        callFunc( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *deleteShortLink( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( ShortLinkService.deleteShortLink, query );
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
    setData: ( state, { payload } ) => {
      return { ...state, shortLinkMap: payload };
    },
  },
};

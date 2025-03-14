/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-20 15:29:44
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-23 09:52:44
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ChannelManagement/models/channelManagement.js
 */
import { getCustomerList, getAddCustomer, editCustomer, deleteCustomer } from '@/services/customerManagement.service';

export default {
  namespace: 'customerManagement',

  state: {
    loading: false,
    customerMap: {
      list: [],
      total: 0,
    },
  },

  effects: {

    *getCustomerList( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getCustomerList, query );
      if ( data.success ) {
        yield put( { type: 'setCustomerMap', payload: data.result } );
        if( callFunc ) {
          callFunc( data.result )
        }
      }
      yield put( { type: 'setLoading', payload: false } );
    },
    *getAddCustomer( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getAddCustomer, query );
      if ( data.success ) {
        callFunc( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *editCustomer( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( editCustomer, query );
      if ( data.success ) {
        callFunc( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *deleteCustomer( { payload: { query, callFunc } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( deleteCustomer, query );
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

    setCustomerMap: ( state, { payload } ) => {
      return { ...state, customerMap: payload };
    },
  },
};

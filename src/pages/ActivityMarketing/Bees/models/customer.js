/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-06-28 16:07:18
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-23 10:24:26
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/Bees/models/channel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import { message } from 'antd';
import { addActivityCustomer, activityAllCustomer, updateCustomerStatus, getActivityCustomerlList, getActivityCustomerData } from '@/services/customerManagement.service';

export default {
  namespace: 'customerDetail',

  state: {
    loading: false,
    customerData:[],
    customerList:[],
    selectCustomerList:[],
  },

  effects: {
    *getActivityCustomerlList( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getActivityCustomerlList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { customerList: data.result },
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

    *addActivityCustomer( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( addActivityCustomer, query );
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
    *activityAllCustomer( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( activityAllCustomer, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { selectCustomerList: data.result },
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

    *updateCustomerStatus( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( updateCustomerStatus, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { selectCustomerList: data.result },
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
    *getActivityCustomerData( { payload:{ query, callFunc }  }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getActivityCustomerData, query );
      if ( data.success && data.result ) {
        const value = data.result.map( ( item )=> ( { ...item, value:item.viewNum } ) )
        yield put( {
          type: 'SetState',
          payload: { customerData: value },
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

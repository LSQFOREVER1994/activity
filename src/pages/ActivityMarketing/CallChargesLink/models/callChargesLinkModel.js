import { message } from 'antd';
import { getCallChargesLinkList, createChargeCode, updateChargeCode, getChargeCodeDetail } from '@/services/callChargesList.service';
import { getPlatformListAll } from '@/services/tool.service';

export default {
  namespace: 'callChargesLinkModel',

  state: {
    loading: false,
    recordList: {
      total: 0,
      list: [],
    },
    platformList: [],
    visibleAddModal: false,
  },


  effects: {
    // 获取话费充值链接列表
    *getCallChargesLinkList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getCallChargesLinkList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { recordList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    // 生成话费充值码
    *createChargeCode( { payload: { query, successFun, errorFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( createChargeCode, query );
      if ( data.success ) {
        message.success( '生成成功' );
        successFun();
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
            visibleAddModal: false
          },
        } );
      } else {
        if(errorFunc) errorFunc()
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
          },
        } );
      }
    },

    // 编辑话费充值吗
    *editCallChargesLink( { payload: { query, successFun, errorFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( updateChargeCode, query );
      if ( data.success ) {
        message.success( '修改成功' );
        successFun();
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
          },
        } );
      } else {
        if(errorFunc) errorFunc()
      }
    },

    // 更改充值码状态
    *updateChargeCode( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( updateChargeCode, query );
      if ( data.success ) {
        message.success( '更改成功' );
        successFun();
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
          },
        } );
      }
    },

    // 获取平台名称
    *getPlatformName( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getPlatformListAll, payload );
      if ( data.success && data?.result?.list ) {
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
            platformList: data.result.list
          },
        } );
      }else {
        message.error( data.message );
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
          },
        } );
      }
    },

    // 获取充值码详情列表
    *getChargesLinkDetail( { payload: { query, successFun } }, { put, call } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getChargeCodeDetail, query );
      if( data.success ) {
        successFun( data.result );
      }else {
        message.error( data.message )
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading: false
        },
      } );
    }
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

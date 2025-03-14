// import { message } from 'antd';
import { getAuditList, getAuditFlow, getAudit, getAuditNum, getAuditItemDetail } from '@/services/activityAudit.service';

export default {
  namespace: 'activityAudit',

  state: {
    loading: false,
    auditList: {
      list: [],
      total: 0
    },
    auditFlow:[],
    auditCount:{
      mine:0,
      approved:0,
      approval:0
    },
    auditItemDetail:{}
  },


  effects: {
    // 获取审批流程
    *getAuditList( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getAuditList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { auditList: data.result },
        } );
        if( callFunc ) {
          callFunc( data.result )
        }
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },
    
    // 获取审核流程
    *getAuditFlow( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getAuditFlow, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { auditFlow: data.result },
        } );
        if( callFunc ) {
          callFunc( data.result )
        }
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    // 审批
    *getAudit( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getAudit, query );
      if ( data.success ) {
        if( callFunc ) {
          callFunc( data.result )
        }
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    // 获取审批数量
    *getAuditNum( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getAuditNum, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { auditCount: data.result },
        } );
        if( callFunc ) {
          callFunc( data.result )
        }
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    // 获取审批详情
    *getAuditItemDetail( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getAuditItemDetail, query );
      if ( data.success && data.result ) {
        yield put( {
          type: 'SetState',
          payload: { auditItemDetail: data.result },
        } );
        if( callFunc ) {
          callFunc( data.result )
        }
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
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

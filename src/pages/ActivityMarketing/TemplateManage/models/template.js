// import { message } from 'antd';
import { getMineTemplateList, getActivityTemplateList, editTemplate, delTemplate, importTemplate, intoCommonTemplate, getAuditList, auditTemplate } from '@/services/template.service';

export default {
  namespace: 'template',

  state: {
    loading: false,
    templateMap:{
      list:[],
      total:0
    },  // 模版列表
    auditList: {
      list: [],
      total: 0
    }
  },


  effects: {
    // 获取模版列表
    *getMineTemplate( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getMineTemplateList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { templateMap: data.result },
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

    *getActivityTemplate( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getActivityTemplateList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { templateMap: data.result },
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

        // 导入模板
    *importTemplate( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( importTemplate, query );
      if ( data && data.success ) {
        successFun( data )
      } else {
        successFun( false )
      }

      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    // 转为公共模板
    *intoCommonTemplate( { payload:{ query, callFunc } }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data= yield call ( intoCommonTemplate, query )
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

    // 编辑模版
    *editTemplate( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( editTemplate, payload );
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

    // 删除模版
    *delTemplate( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( delTemplate, payload );
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

    // 获取审核模板列表
    *getAuditList( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getAuditList, payload );
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

    // 变更审核列表结果
    *auditTemplate( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( auditTemplate, payload );
      if ( data.success && callFunc ) {
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
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

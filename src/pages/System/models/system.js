import { message } from 'antd';

import {
  editPassword,
  getRoleList,
  getManagerUserList,
  getEditManager,
  getAddManager,
  getUserList,
  createList,
  updateList,
  resetPassword,
  deleteRoleList,
  getPurviewList, upPurviewList, createPurviewList,
  createRoleList,
  updateRoleList,
  getRecordList,
  getPlatformListAll, updatePlatform, addPlatform, delpPlatform,
  getDockingList, updateDocking, addDocking, delpDocking,
  updateUserStatus,
  getTagList,
  postTagList,
  putTagList,
  delTagList,
  stickTag,
  getMenuTree,
  getPermissionList,
  getPermissionDetail,
  getEditPermission,
  getExportList,
  deleteExportListItem,
  cancelExportListItem,
  retryExportListItem,
  resetManagerPassword,
  getDepartmentTree,
  importUserList,
} from '@/services/account.service';

export default {
  namespace: 'system',

  state: {
    status: undefined,
    loading: false,
    updating: false,
    treeLoading: false,
    roleData: {
      list: [],
      total: 0,
      pageNum: 1,
    },
    datas: {
      list: [],
      total: 0,
      pageNum: 1,
    },
    tags: {
      list: [],
      total: 0,
      pageNum: 1,
    },
    platformyListAll: {
      total: 0,
      list: [],
    },
    dockingList: {
      total: 0,
      list: [],
    },
    recordList: {
      list: [],
      total: 0,
    },
    permissionMap: {
      list: [],
      total: 0,
    },
    permissionLoading: false,
    permissionDetail: {},
    managerUserData: {
      list: [],
      total: 0,
      pageNum: 1,
    }, // 管理员数据
    departmentTree:[],
  },

  effects: {
    *editPassWord( { payload: { query, callFunc }, }, { call } ) {
      const data = yield call( editPassword, query );
      callFunc( data );
    },

    *getRoleList( { payload, successFun }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取角色列表
      const data = yield call( getRoleList, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data.result.list )
        yield put( { type: 'setRoleData', payload: data.result } );
      }
      yield put( { type: 'setLoading', payload: false } );
    },



    *getUserList( { payload }, { call, put } ) {
      // 获取列表
      const { query } = payload;
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getUserList, query );
      if ( data.success ) {
        yield put( { type: 'setDatas', payload: data.result } );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *submitUser( { payload, successFunc }, { call, put } ) {
      // 编辑或新建列表
      yield put( { type: 'setUpdating', payload: true } );
      const data = payload.id ? yield call( updateList, payload ) : yield call( createList, payload );
      if ( data.success ) {
        successFunc( data.message );
      }
      yield put( { type: 'setUpdating', payload: false } );
    },


    *updateUserStatus( { payload }, { call } ) {
      // 改变角色状态true启用，false禁用
      const { query, onLoadFunc, successFunc, errorFunc } = payload;
      const data = yield call( updateUserStatus, query );
      if ( data.success ) {
        successFunc( data.message );
        onLoadFunc();
      } else {
        errorFunc( data.message );
      }
    },

    *resetPassword( { payload }, { call } ) {
      // 重置用户密码
      const { query, success } = payload;
      const data = yield call( resetPassword, query );
      if ( data ) {
        success( data );
      }
    },

    *deleteRoleList( { payload, successFunc }, { call } ) {
      // 删除角色列表
      const data = yield call( deleteRoleList, payload );
      if ( data.success ) {
        successFunc( data.message );
      }
    },

    *editRoleListFunc( { payload, callFunc }, { call, put } ) {
      // 编辑或新建列表
      yield put( { type: 'setUpdating', payload: true } );
      const data = payload.id ? yield call( updateRoleList, payload ) : yield call( createRoleList, payload );
      if ( data.success ) {
        message.success( data.message );
        callFunc()
      }
      yield put( { type: 'setUpdating', payload: false } );
    },

    *getPurviewList( { payload }, { call, put } ) {
      // 获取权限列表
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getPurviewList, payload );
      if ( data.success ) {
        yield put( { type: 'setDatas', payload: data.result } );
        yield put( { type: 'setLoading', payload: false } );
      }
    },

    *submitPurview( { payload, successFunc }, { call, put } ) {
      // 编辑或新建权限列表
      yield put( { type: 'setUpdating', payload: true } );
      const data = payload.code ? yield call( upPurviewList, payload ) : yield call( createPurviewList, payload );
      if ( data.success ) {
        message.success( data.message );
        successFunc();
      }
      yield put( { type: 'setUpdating', payload: false } );
    },

    //  获取操作记录
    *getRecordList( { payload }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getRecordList, payload );
      if ( data.success ) {
        yield put( { type: 'setRecordList', payload: data.result } );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    // 获取平台列表
    *getPlatformListAll( { payload, callFun }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getPlatformListAll, payload );
      if ( success ) {
        if ( callFun ) {
          callFun( result )
        } else {
          yield put( {
            type: 'setPlatformyAll',
            payload: result,
          } );
        }
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 添加平台
    *submitPlatform( { payload: { params, callFunc, isUpdate } }, { call } ) {
      const data = isUpdate ? yield call( updatePlatform, params ) : yield call( addPlatform, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    //  删除平台
    *delpPlatform( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delpPlatform, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    // 获取对接功能列表
    *getDockingList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );

      const { success, result } = yield call( getDockingList, payload );
      if ( success ) {
        yield put( {
          type: 'setDockingAll',
          payload: result,
        } );
      }

      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 新增或编辑对接功能
    *submitDocking( { payload: { params, callFunc, isUpdate } }, { call } ) {
      const data = isUpdate ? yield call( updateDocking, params ) : yield call( addDocking, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    // 删除对接功能
    *delpDocking( { payload: { id, callFunc } }, { call } ) {
      const data = yield call( delpDocking, id );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      }
    },

    *getTagList( { payload }, { call, put } ) {
      // 获取用户标签列表
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getTagList, payload );
      if ( data.success ) {
        yield put( { type: 'setTags', payload: data.result } );
        yield put( { type: 'setLoading', payload: false } );
      }
    },
    // 添加\编辑标签
    *submitTags( { payload: { params, callFunc, isUpdate } }, { call } ) {
      const data = isUpdate ? yield call( putTagList, params ) : yield call( postTagList, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    *delTagList( { payload }, { call } ) {
      // 删除用户标签
      const { query, successFunc, errorFunc } = payload;

      const data = yield call( delTagList, query );
      if ( data.success ) {
        successFunc( data.message );
      } else {
        errorFunc( data.message );
      }
    },

    *stickTag( { payload }, { call } ) {
      // 贴标签
      const { query, successFunc, errorFunc } = payload;

      const data = yield call( stickTag, query );
      if ( data.success ) {
        successFunc( data.message );
      } else {
        errorFunc( data.message );
      }
    },

    // 获取角色树
    *getMenuTree( { payload, callBack }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { treeLoading: true },
      } );

      const { success, result } = yield call( getMenuTree, payload );
      if ( success ) {
        callBack( result )
      }
      yield put( {
        type: 'SetState',
        payload: { treeLoading: false },
      } );
    },

    // 获取权限组列表
    *getPermissionList( { payload, callBack }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: { permissionLoading: true },
      } );
      const data = yield call( getPermissionList, payload );
      if ( data && data.success ) {
        yield put( {
          type: 'SetState',
          payload: { permissionMap: data.result },
        } );
        if ( callBack ) callBack( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: { permissionLoading: false },
      } );
    },

    // 获取权限组详情
    *getPermissionDetail( { payload, callBack }, { call, put } ) {
      yield put( { type: 'SetState', payload: { permissionLoading: true }, } );
      const data = yield call( getPermissionDetail, payload );
      if ( data && data.success ) {
        yield put( {
          type: 'SetState',
          payload: { permissionDetail: data.result },
        } );
        if ( callBack ) callBack( data.success )
      }
      yield put( { type: 'SetState', payload: { permissionLoading: false }, } );
    },

    // 编辑权限组
    *getEditPermission( { payload, callBack }, { call, put } ) {
      yield put( { type: 'SetState', payload: { permissionLoading: true }, } );
      const data = yield call( getEditPermission, payload );
      if ( callBack ) callBack( data )
      yield put( { type: 'SetState', payload: { permissionLoading: false }, } );
    },

    *getExportList( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getExportList, payload );
      if ( data && data.success ) {
        yield put( {
          type: 'SetState',
          payload: { exportListData: data.result },
        } );
        if ( callBack ) callBack( data.success )
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *deleteExportListItem( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( deleteExportListItem, payload );
      if ( data.success ) {
        callBack();
        message.success( data.message )
      }
      yield put( { type: 'setLoading', payload: false } );
    },


    *cancelExportListItem( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( cancelExportListItem, payload );
      if ( data.success ) {
        callBack( data.message );
      }
      yield put( { type: 'setLoading', payload: false } );
    },


    *retryExportListItem( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( retryExportListItem, payload );
      if ( data.success ) {
        callBack( data.message );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *getManagerUserList( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );

      const data = yield call( getManagerUserList, payload );
      if ( data.success ) {
        if( callBack ){
          callBack( data.result );
        }
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *getEditManager( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );

      const data = yield call( getEditManager, payload );
      if ( data.success ) {
        if( callBack ){
          callBack( data.result );
        }
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *resetManagerPassword( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );

      const data = yield call( resetManagerPassword, payload );
      if ( data.success ) {
        if( callBack ){
          callBack( data.result );
        }
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *getAddManager( { payload, callBack }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );

      const data = yield call( getAddManager, payload );
      if ( data.success ) {
        if( callBack ){
          callBack( data.result );
        }
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *getDepartmentTree( { payload:{ query, callBack } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( getDepartmentTree, query );
      if ( data && data.success ) {
        yield put( {
          type: 'SetState',
          payload: { departmentTree: data.result },
        } );
        if ( callBack ) callBack( data.success )
      }
      yield put( { type: 'setLoading', payload: false, } );
    },

    *importUserList( { payload: { query, successFun } }, { call } ) {
      const data = yield call( importUserList, query );
      if ( data && data.success ) {
        successFun( data )
      } else {
        successFun( false )
      }
    },
  },

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload
      }
    },
    setLoading: ( state, { payload } ) => {
      return { ...state, loading: payload };
    },
    setDatas: ( state, { payload } ) => {
      return { ...state, datas: payload };
    },
    setUpdating: ( state, { payload } ) => {
      return { ...state, updating: payload };
    },
    setRoleData: ( state, { payload } ) => {
      return { ...state, roleData: payload };
    },
    setRecordList: ( state, { payload } ) => {
      return { ...state, recordList: payload };
    },
    setPlatformyAll( state, { payload } ) {
      return {
        ...state,
        platformyListAll: payload,
      };
    },
    setDockingAll( state, { payload } ) {
      return {
        ...state,
        dockingList: payload,
      };
    },
    setTags: ( state, { payload } ) => {
      return { ...state, tags: payload };
    },
  },
};

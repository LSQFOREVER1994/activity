import { 
  getMenuTreeObject, 
  getMenuTreeNodeDetail, 
  deleteMenuTreeNode, 
  updateMenuTreeNode, 
  addMenuTreeNode, 
  getMenuTreeNodeMission,
  setPermission 
} from '@/services/account.service';

export default {
  namespace: 'menuPermission',

  state: {
    loading: false,
    menuTree: [],
    permissionDetail:{},
  },


  effects: {
    // 获取列表
    *getMenuTreeObject( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getMenuTreeObject, payload );
      if ( success ) {
        yield put( {
          type: 'setMenuTree',
          payload: result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *getMenuTreeNodeDetail( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getMenuTreeNodeDetail, query );
      if ( success ) {
        if( callFunc ) callFunc( result )
      }else if( callFunc ) callFunc( false )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *deleteMenuTreeNode( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( deleteMenuTreeNode, query );
      if ( success ) {
        if( callFunc ) callFunc( result )
      }else if( callFunc ) callFunc( false )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *updateMenuTreeNode( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( updateMenuTreeNode, query );
      if ( success ) {
        if( callFunc ) callFunc( message )
      }else if( callFunc ) callFunc( false )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *addMenuTreeNode( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( addMenuTreeNode, query );
      if ( success ) {
        if( callFunc ) callFunc( message )
      }else if( callFunc ) callFunc( false )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *getMenuTreeNodeMission( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getMenuTreeNodeMission, query );
      if ( success ) {
        yield put( {
          type: 'setLoading',
          payload: { permissionDetail:result },
        } );
        if( callFunc ) callFunc( result )
      }else if( callFunc ) callFunc( false )
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    *setPermission( {  payload:{ query, callFunc } }, { call, put } ) {
      yield put( { type: 'SetState', payload: { permissionLoading: true }, } );
      const { success } = yield call( setPermission, query );
      if( success ){
        if ( callFunc ) callFunc( success )
      }else if ( callFunc ) callFunc( false )
      
      yield put( { type: 'SetState', payload: { permissionLoading: false }, } );
    },
  },


  reducers: {
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
    setMenuTree( state, { payload } ) {
      return {
        ...state,
        menuTree: payload,
      };
    },
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload
      }
    },
  },
};
import { message } from 'antd'
import { getMessageList, getAllRead, getUnreadCount, markRead } from '@/services/messageCenter.service';

export default {
  namespace: 'messageCenter',

  state: {
    loading: false,
    messageMap:{
      list:[],
      total:0
    },  // 消息列表
    unreadCount:0, // 未读消息数量
  },


  effects: {
    *getMessageList( { payload:{ query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getMessageList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { messageMap: data.result },
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

    *getAllRead( { payload:{ callFunc, query } }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getAllRead, query );
      if ( data.success && callFunc ) {
        message.success( data.message );
        callFunc( data.result )
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    *getUnreadCount( { payload:{ query, callFunc } }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( getUnreadCount, query );
      if( data.success ){
        yield put( {
          type: 'SetState',
          payload: { unreadCount: data.result },
        } );
        if( callFunc ){
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

    *getMessageRead( { payload:{ query, callFunc } }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading: true
        },
      } );
      const data = yield call( markRead, query );
      message.success( data.message );
      if ( data.success && callFunc ) {
        callFunc()
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

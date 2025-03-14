// import { message } from 'antd';
import { getComment, toExamine, getTopicElementList } from '@/services/comment.service';

export default {
  namespace: 'comment',

  state: {
    loading: false,
    commentMap: {
      total: 0,
      list: [],
    },
    elementList:[]
  },


  effects: {
    // 获取评论列表
    *getComment( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getComment, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { commentMap: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },
    // 修改内容审批
    *toExamine( { payload: { query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( toExamine, query );
      if ( data.success && callFunc ) {
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },
    *getTopicElementList( { payload: { query, callBackFunc } }, { call, put } ) {
      const data = yield call( getTopicElementList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { elementList: data.result },
        } );
        if( callBackFunc )callBackFunc( data.result );
      } else if( callBackFunc ) callBackFunc( false )
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

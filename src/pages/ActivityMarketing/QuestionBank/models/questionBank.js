// import { message } from 'antd';
import { message } from 'antd';
import { getAnswerList, getTagList, addTag, updateTag, changeStatus, delTag, addAnswer, updateAnswer, delAnswer, saveAnswerModel } from '@/services/answer.service';

export default {
  namespace: 'answer',

  state: {
    loading: false,
    answerMap: {
      total: 0,
      list: [],
    },
    tagListMap: {
      total: 0,
      list: [],
    },
    searchTagListMap: []
  },


  effects: {
    // 获取评论列表
    *getAnswerList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getAnswerList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { answerMap: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 获取标签列表
    *getTagList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getTagList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { tagListMap: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 搜索标签列表
    *SearchTagList( { payload: { query, callFunc } }, { call, put } ) {
      const data = yield call( getTagList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { searchTagListMap: data.result.list },
        } );
        if ( callFunc ) callFunc( data.result.list )
      }
    },
    // 保存题目
    *saveAnswer( { payload: { query, callFunc, isUpdate } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      // const data = yield call( saveAnswer, query );
      const obj = { ...query }
      delete obj.setting;
      const data = isUpdate ? yield call( updateAnswer, obj ) : yield call( addAnswer, obj );
      if ( data.success && callFunc ) {
        message.success( data.message )
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 保存模版题目
    *saveAnswerModel( { payload: { query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( saveAnswerModel, query );
      if ( data.success && callFunc ) {
        message.success( data.message )
      }
      if ( callFunc ) { callFunc( data.success ) }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 删除题目
    *delAnswer( { payload: { query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( delAnswer, query );
      if ( data.success && callFunc ) {
        message.success( data.message )
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 保存标签
    *saveTag( { payload: { query, callFunc, isUpdate } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = isUpdate ? yield call( updateTag, query ) : yield call( addTag, query );
      if ( data.success && callFunc ) {
        callFunc();
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 修改标签状态
    *changeStatus( { payload: { query, callFunc, failFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( changeStatus, query );
      if ( data.success && callFunc ) {
        callFunc();
      } else if ( failFunc ) {
        failFunc();
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },
    // 删除标签
    *delTag( { payload: { query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( delTag, query );
      if ( data.success && callFunc ) {
        message.success( data.message )
        callFunc();
      }
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

// import { message } from 'antd';
import { getTopicPKDetail, getTopicPKList } from '@/services/topicPK.service';

export default {
  namespace: 'topicPK',

  state: {
    loading: false,
    topicPKList: {},
    topicPKDetail: {},
  },


  effects: {
    *getTopicPKDetail( { payload }, { call, put } ) { // 获取话题pk详情
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getTopicPKDetail, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { topicPKDetail: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    *getTopicPKList( { payload }, { call, put } ) { // 获取话题pk列表
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getTopicPKList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { topicPKList: data.result },
        } );
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

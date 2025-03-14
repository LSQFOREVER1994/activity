import { message } from 'antd';
import { getTaskEventList, editTask, addTask, delTask, getTaskStatistics, initChartsData } from '@/services/taskEvents.service';

export default {
  namespace: 'taskEvents',

  state: {
    loading: false,
    taskEventList: {
      total: 0,
      list: [],
    },
    taskStatisticsList:{
      total: 0,
      list: [],
    }
  },


  effects: {
    // 获取任务事件列表
    *getTaskEventList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getTaskEventList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { taskEventList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    //  编辑或者添加事件列表
    *submitTask( { payload:{ params, callFunc },  }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = params.id ? yield call( editTask, params ) : yield call( addTask, params )
      if ( data.success ) {
        callFunc();
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    // 删除任务事件列表 
    *delTask( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
       const data = yield call( delTask, payload );
      if ( data.success && callFunc ) {
        callFunc();
        message.success( data.message )
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    //  获取任务统计列表
    *getTaskStatistics( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getTaskStatistics, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { taskStatisticsList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },

    //  获取任务统计详情
    *initChartsData( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( initChartsData, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { taskCensueList: data.result },
        } );
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

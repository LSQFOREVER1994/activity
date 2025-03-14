import { getDataList, getTrend, getInfo, getUserRecord } from '@/services/dollMachine.service';

export default {
  namespace: 'dollMachine',

  state: {
    loading: false,
    gameMap: {
      total: 0,
      list: [],
    },
    trendData: [],
    gameInfo: [],
    userDetail: {
      total: 0,
      list: []
    }
  },


  effects: {
    // 获取列表
    *getDataList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getDataList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { gameMap: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 获取趋势
    *getTrend( { payload, successFn }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getTrend, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { trendData: data.result },
        } );
        if ( successFn ) successFn( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 获取游戏统计数据
    *getInfo( { payload, successFn }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getInfo, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { gameInfo: data.result },
        } );
        if ( successFn ) successFn( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    // 获取用户数据
    *getUserRecord( { payload, successFn }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getUserRecord, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { userDetail: data.result },
        } );
        if ( successFn ) successFn( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
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

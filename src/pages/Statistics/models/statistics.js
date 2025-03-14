import { message } from 'antd';
import {
  getAppData, addAppData, exitAppData, delAppData,
  getAppointAppData,
  getAppDaily, getEventDaily, getEventSum, getEventValueSum,
  getRateDaily
} from '@/services/statistics.service';

export default {
  namespace: 'statistics',
  state: {
    loading: false,
    appDaily: [],
    eventDaily: [],
    eventSum: [],
    eventValueSum: [],
    appointAppData: {},
    appData: {},
    rateDaily: [],
  },

  effects: {
    // 获取app列表
    *getAppData( { payload }, { call, put } ) {
      yield put( { type:'SetState', payload:{ loading: true } } );
      const { success, result } = yield call( getAppData, payload );
      if ( success ) {
        yield put( {
          type: 'setAppData',
          payload: result,
        } );
      }
      yield put( { type:'SetState', payload:{ loading: false } } );
    },
    *getAppointAppData( { payload }, { call, put } ) {
      const { success, result } = yield call( getAppointAppData, payload );
      if ( success && result ) {
        yield put( {
          type: 'setAppointAppData',
          payload: result,
        } );
      } else {
        message.error( '埋点ID不存在' );
      }
    },
    *submitAppData( { payload: { params, callFunc } }, { call } ) {
      const data = params.add ? yield call( addAppData, params ) : yield call( exitAppData, params );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },
    *delAppData( { payload: { appId, callFunc } }, { call } ) {
      const data = yield call( delAppData, appId );
      if ( data.success ) {
        callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
    },

    // 获取app每日统计列表
    *getAppDaily( { payload }, { call, put } ){
      yield put( { type:'SetState', payload:{ loading: true } } );
      const { success, result } = yield call( getAppDaily, payload );
      if ( success ){
        yield put( {
          type: 'SetState',
          payload: { appDaily: result.reverse() },
        } );
      }
      yield put( { type:'SetState', payload:{ loading: false } } );
    },

    // 获取app事件每日统计列表
    *getEventDaily( { payload }, { call, put } ){
      yield put( { type:'SetState', payload:{ loading: true } } );
      const { success, result } = yield call( getEventDaily, payload );
      if ( success ){
        yield put( {
          type: 'SetState',
          payload: { eventDaily: result.reverse() },
        } );
      }
      yield put( { type:'SetState', payload:{ loading: false } } );
    },

    // 获取app事件统计列表
    *getEventSum( { payload }, { call, put } ) {
      yield put( { type:'SetState', payload:{ loading: true } } );
      const { success, result } = yield call( getEventSum, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { eventSum: result },
        } );
      }
      yield put( { type:'SetState', payload:{ loading: false } } );
    },

    // 获取app事件值统计列表
    *getEventValueSum( { payload }, { call, put } ) {
      yield put( { type:'SetState', payload:{ loading: true } } );
      const { success, result } = yield call( getEventValueSum, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { eventValueSum: result },
        } );
      }
      yield put( { type:'SetState', payload:{ loading: false } } );
    },

    // 获取app存留率
    *getRateDaily( { payload }, { call, put } ) {
      yield put( { type:'SetState', payload:{ loading: true } } );
      const { success, result } = yield call( getRateDaily, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { rateDaily: result },
        } );
      }
      yield put( { type:'SetState', payload:{ loading: false } } );
    },
  },
  

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload,
      };
    },
    setAppData( state, { payload } ) {
      return {
        ...state,
        appData: payload,
      };
    },
    setAppointAppData( state, { payload } ) {
      return {
        ...state,
        appointAppData: payload,
      };
    },
  },
};

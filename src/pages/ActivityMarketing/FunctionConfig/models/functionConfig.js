import * as SystemConfig from '@/services/systemConfig.service';

export default {
  namespace: 'functionConfig',

  state: {
    loading: false,
    data: {
      list: [],
      total: 0,
    },
  },

  effects: {
    *getFunctionConfigList( { payload }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( SystemConfig.getFunctionConfigList, payload );
      if ( data.success ) {
        yield put( { type: 'setData', payload: data.result } );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *addFunctionConfig( { payload: { body, callback } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( SystemConfig.addFunctionConfig, body );
      if ( data.success ) {
        callback( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *updateFunctionConfig( { payload: { body, callback } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( SystemConfig.updateFunctionConfig, body );
      if ( data.success ) {
        callback( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *deleteFunctionConfig( { payload: { body, callback } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      // 获取功能配置
      const data = yield call( SystemConfig.deleteFunctionConfig, body );
      if ( data.success ) {
        callback( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },

    *typeFunctionConfig( { payload: { body, callback } }, { call, put } ) {
      yield put( { type: 'setLoading', payload: true } );
      const data = yield call( SystemConfig.typeFunctionConfig, body );
      if ( data.success ) {
        callback( data.result );
      }
      yield put( { type: 'setLoading', payload: false } );
    },
  },

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload,
      };
    },
    setLoading: ( state, { payload } ) => {
      return { ...state, loading: payload };
    },
    setData: ( state, { payload } ) => {
      return { ...state, data: payload };
    },
  },
};

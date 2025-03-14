import { getRedAbnormalList, getRedAbnormalAction } from '@/services/equityDataManage.service';

export default {
  namespace: 'redAbnormal',

  state: {
    loading: false,
    redAbnormalList: {
      total: 0,
      list: [],
    },
  },


  effects: {
    // 获取列表
    *getRedAbnormalList( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getRedAbnormalList, payload );
      if ( success ) {
        yield put( {
          type: 'setRedAbnormalList',
          payload: result,
        } );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 解绑||重发
    *getRedAbnormalAction( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, message } = yield call( getRedAbnormalAction, payload );
      if ( success ) {
        callFunc( message )
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },
  },


  reducers: {
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
    setRedAbnormalList( state, { payload } ) {
      return {
        ...state,
        redAbnormalList: payload,
      };
    },
  },
};

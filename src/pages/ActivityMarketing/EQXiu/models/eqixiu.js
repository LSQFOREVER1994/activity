import { getEqxiuLoginCode } from '@/services/eqxiu.service';

export default {
  namespace: 'eqxiu',
  state: {
    code: '',
  },

  effects: {
    *getEqxiuLoginCode( { payload, successFun }, { call, put } ) {
      const data = yield call( getEqxiuLoginCode, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { code: data.result },
        } );
        successFun( data.result )
      }
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

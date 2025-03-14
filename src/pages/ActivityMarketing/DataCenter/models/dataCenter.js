import { getElementDataType } from '@/services/bees.service';

export default {
  namespace: 'dataCenter',

  state: {
    loading: false,
  },


  effects: {
    *getElementDataType( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getElementDataType, query );
      if ( data.success ) {
        successFun( data.result )
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

import { getGuessPeriods, getUserGuessRecord } from '@/services/allRankData.service'

export default {
  namespace: 'guessData',

  state: {
    loading: false,
    guessData: {
      list: [],
      total: 0,
    },
    userGuessRecord: {
      list: [],
      total: 0
    }
  },


  effects: {
    *getGuessPeriods( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getGuessPeriods, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            guessData: data.result
          },
        } );
        successFun()
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false
        },
      } );
    },

    *getUserGuessRecord( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getUserGuessRecord, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            userGuessRecord: data.result
          },
        } );
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

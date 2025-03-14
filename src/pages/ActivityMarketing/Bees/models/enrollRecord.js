import { getActivityEnrollList } from '@/services/enroll.service';

export default {
  namespace: 'enrollRecord',

  state: {
    loading: false,
    enrollList: {
      total: 0,
      list: [],
    },
  },


  effects: {
    *getActivityEnrollList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getActivityEnrollList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { enrollList: data.result },
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

// import { message } from 'antd';
import { getParticipationRecord } from '@/services/reward.service';

export default {
  namespace: 'participationRecordModal',

  state: {
    loading: false,
    recordList: {
      total: 0,
      list: [],
    },
  },


  effects: {
    // 获取用户参与记录
    *getInfo( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getParticipationRecord, payload );
			console.log( data, 'xxxx' )
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { recordList: data.result },
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

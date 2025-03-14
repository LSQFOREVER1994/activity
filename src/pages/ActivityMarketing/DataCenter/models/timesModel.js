// import { message } from 'antd';
import { getActivityLeftCountList, getLeftCountRecord } from '@/services/reward.service';

export default {
  namespace: 'timesModel',

  state: {
    loading: false,
    recordList: {
      total: 0,
      list: [],
    },
    leftCountList: {
      total: 0,
      list: []
    }
  },


  effects: {
    // 获取活动参与次数明细
    *getInfo( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getActivityLeftCountList, payload );
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

    // 获取用户参与次数明细
    *getUserLeftCountInfo( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      console.log( payload, 'payload' )
      const data = yield call( getLeftCountRecord, payload );
			console.log( data, 'xxxx' );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { leftCountList: data.result },
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

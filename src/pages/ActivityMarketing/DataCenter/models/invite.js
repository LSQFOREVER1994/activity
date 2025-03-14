// import { message } from 'antd';
import { getInvite } from '@/services/invite.service';

export default {
  namespace: 'invite',

  state: {
    loading: false,
    inviteMap: {
      total: 0,
      list: [],
    },
  },


  effects: {
    // 获取邀请列表
    *getInvite( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true
        },
      } );
      const data = yield call( getInvite, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { inviteMap: data.result },
        } );
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

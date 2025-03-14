import { message } from 'antd';
import {
  getWatermelonRank,
  getUserDetails,
  getWatermelonPrizes,
  sendPrizeMsg,
  sendPrizes,
} from '@/services/watermelon.service';

export default {
  namespace: 'watermelon',

  state: {
    watermelonRankData: {
      total: 0,
      list: [],
    }, // rank榜单数据
    watermelonRankALLData: {
      total: 0,
      list: [],
    }, // rank榜单所有数据
    prizesList: [], // 奖品列表
    rankTypeObj: {}, // 当前选中榜单类型
    userDetailsData: { // 用户详情数据
      total: 0,
      list: [],
    },
    loading: false,
  },


  effects: {

    // 获取大西瓜分数排行
    *getWatermelonRank( { payload }, { call, put } ) {
      const { success, result } = yield call( getWatermelonRank, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: {
            watermelonRankData: result
          }
        } )

      }
    },

    // 获取大西瓜奖品列表
    *getWatermelonPrizes( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getWatermelonPrizes, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { prizesList: result },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },

    // 设置当前选中榜单对象
    *setWatermelonRankObj( { payload }, { put } ) {
      yield put( {
        type: 'SetState',
        payload
      } )
    },

    // 获取大西瓜排行所有数据
    *getWatermelonALLRank( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getWatermelonRank, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: {
            watermelonRankALLData: result
          }
        } )

        callFunc( result );
      }
    },

    // 获取指定用户积分明细
    *getUserDetails( { payload }, { call, put } ) {
      const { success, result } = yield call( getUserDetails, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { userDetailsData: result },
        } );
      }
    },

    // 一键发奖
    *sentPrizeAward( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( sendPrizes, payload );

      if ( data.success ) {
        if ( callFunc ) callFunc();
        message.success( data.message );
      } else {
        message.error( data.message );
      }
      yield put( {
        type: 'setLoading',
        payload: false,
      } );
    },

    // 发奖通知
    *sendPrizeMsg( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( sendPrizeMsg, payload );
      if ( data.success ) message.success( data.message )
      yield put( {
        type: 'setLoading',
        payload: false,
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
    setLoading( state, { payload } ) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

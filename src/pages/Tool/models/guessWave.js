import { message } from 'antd';
import { getGuessgameRanking, getHistoryRankDates, getGuessgameRank, getCreditDetails, getGuessgameCurrentRank } from '@/services/guessWave.service';
import { sendPrizes, sendGuessMsg, getGuessPrices } from '@/services/tool.service';
import moment from 'moment';

export default {
  namespace: 'guessWave',

  state: {
    loading: false,
    guessgameRankingData: {
      total: 0,
      list: [],
    },
    guessgameRankData: {
      total: 0,
      list: [],
    },
    rankDateList: [],
    creditDetailsData: {
      total: 0,
      list: [],
    },
    allPrizeList: [],
  },


  effects: {

    // 猜涨跌排行
    *getGuessgameRanking( { payload }, { call, put } ) {
      const { success, result } = yield call( getGuessgameRanking, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { guessgameRankingData: result },
        } );
      }
    },
    // 获取指定周榜月榜列表
    *getGuessgameRank( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGuessgameRank, payload );
      if ( success ) {
        if ( callFunc ) {
          callFunc()
        }
        yield put( {
          type: 'SetState',
          payload: { guessgameRankData: result },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    // 获取当前期数
    *getGuessgameCurrentRank( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGuessgameCurrentRank, payload );
      if ( success ) {
        if ( callFunc ) {
          callFunc()
        }
        yield put( {
          type: 'SetState',
          payload: { guessgameRankData: result },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
        } );
      }
    },
    // 获取指定周榜月榜全部列表
    *getGuessgameAllRank( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getGuessgameRank, payload );
      if ( success ) {
        callFunc( result );
      }
    },
    // 获取指定周榜月榜日期
    *getHistoryRankDates( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getHistoryRankDates, payload );
      let lastData = '';
      let startDay = moment().startOf( 'week' ).format( "YYYY-MM-DD" );
      // const endDay = moment( startDay ).add( 6, "days" ).format( "YYYY-MM-DD" );
      if ( payload.rankType === 'WEEK' ) {
        startDay = moment().startOf( 'week' ).format( "YYYY-MM-DD" );
        lastData = moment( startDay ).add( 6, "days" ).format( "YYYY-MM-DD" );
      } else if(payload.rankType === 'MONTH') {
        lastData = moment().format( "YYYY-MM-DD" );
      }

      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { rankDateList: [lastData, ...( result || [] ).reverse()] },
        } );
        callFunc(  [lastData, ...( result || [] ).reverse()] );
      }
    },
    // 获取指定用户积分明细
    *getCreditDetails( { payload }, { call, put } ) {
      const { success, result } = yield call( getCreditDetails, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { creditDetailsData: result },
        } );
      }
    },
      // 获取指定猜涨跌奖品列表
    *getGuessPrizes( { payload }, { call, put } ){
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const { success, result } = yield call( getGuessPrices, payload );
      if ( success ) {
        yield put( {
          type: 'SetState',
          payload: { prizesList:result },
        } );
        yield put( {
          type: 'setLoading',
          payload: false,
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
        if( callFunc ) callFunc();
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
    *sendGuessMsg( { payload }, { call, put } ) {
      yield put( {
        type: 'setLoading',
        payload: true,
      } );
      const data = yield call( sendGuessMsg, payload );
      if( data.success )message.success( data.message )
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

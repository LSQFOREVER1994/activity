import {
   getVotingExport,
   getVotingStatistics,
   getVotingDetail,
  } from '@/services/voting.service';


export default {
  namespace: 'votingData',

  state: {
    loading: false,
    questionnaireMap: {},
    detailData: {
      total: 0,
      list: [],
    },
    chartData: [],
    questions:[]
  },

  effects: {
    // 数据统计
    *getVotingStatistics( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const { success, result } = yield call( getVotingStatistics, payload );
      if ( success ) {
        if ( callFunc ) callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { chartData: result },
        } );
        yield put( {
          type: 'SetState',
          payload:{
            loading:false,
          },
        } );
      }
    },

    // 数据详情
    *getVotingDetail( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getVotingDetail, payload );
      const { success, result }  = data;
      if ( success ) {
        if ( callFunc ) callFunc( result )
        yield put( {
          type: 'SetState',
          payload: { detailData: result },
        } );
        
        yield put( {
          type: 'SetState',
          payload:{
            loading:false
          },
        } );
      }
    },

    // 导出
    *getVotingExport( { payload, callFunc }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const { success, result } = yield call( getVotingExport, payload );
      if ( success ) {
        callFunc( result )
        yield put( {
          type: 'SetState',
          payload:{
            loading:false
          },
        } );
      }
    },
  },


  reducers: {
    SetState( state, { payload } ){
      return {
        ...state,
        ...payload
      }
    },
  },
};

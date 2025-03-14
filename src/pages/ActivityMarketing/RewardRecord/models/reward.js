// import { message } from 'antd';
import { getRewardRecord, getRewardReissue } from '@/services/reward.service';
import { getMerchantNames } from '@/services/dataCount.service';
import { getBeesInfo, getInfoPrizeList, getRewardConsume } from '@/services/bees.service';


export default {
  namespace: 'reward',

  state: {
    loading: false,
    rewardRecord: {
      total: 0,
      list: [],
    },
    merchantList: [],
    activityDetail: {},
    prizeList: [],
    lineData:[]
  },


  effects: {
    // 获取中奖名单
    *getRewardRecord( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload:{
          loading:true
        },
      } );
      const data = yield call( getRewardRecord, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { rewardRecord: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload:{
          loading:false
        },
      } );
    },
    // 奖品补发
    *getRewardReissue( { payload, callBack }, { call } ){
      const data = yield call( getRewardReissue, payload );
      if( data && data.success ){
        callBack( data )
      }else{
        callBack( false )
      }
    },

    *getMerchantNames( { payload, callFunc }, { call, put } ) {
      const { success, result } = yield call( getMerchantNames, payload );
      if ( success ) {
          yield put( {
              type: 'SetState',
              payload: { merchantList :result },
          } );
          callFunc();
      }
    },
    *getBeesInfo( { payload: { query, successFun } }, { call, put } ) {

      const data = yield call( getBeesInfo, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            activityDetail: data.result
          },
        } );
        successFun( data.result )
      }

    },
    *getInfoPrizeList( { payload: { query, successFun } }, { call, put } ) {

      const data = yield call( getInfoPrizeList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            prizeList: data.result
          },
        } );
        successFun( data.result )
      }

    },
    *getRewardConsume( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getRewardConsume, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: {
            lineData: data.result
          },
        } );
        successFun()
      }

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

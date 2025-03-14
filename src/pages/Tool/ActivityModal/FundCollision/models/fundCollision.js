import { message } from 'antd';
import { addFundCollision, delFundCollision, editFundCollision, getFundCollision } from '@/services/fundCollision.service'

export default {
  namespace: 'fundCollision',

  state: {
    loading: false,
    allPrizeList: [], // 所有奖项
  },
  effects: {
    *addFundCollision({ payload: { params, callFunc } }, { call, put }) {
      const data = yield call(addFundCollision, params);
      if (data.success) {
        callFunc(data.result);
      }
    },
    *delFundCollision({ payload, callFunc }, { call, put }) {
      const { success, result } = yield call(delFundCollision, payload);
      if (success) { }
    },
    *editFundCollision({ payload: { params, callFunc } }, { call, put }) {
      const data = yield call(editFundCollision, params);
      if (data.success) {
        callFunc(data.result);
      }
    },
    *getFundCollision({ payload: { id }, callFunc }, { call, put }) {
      const { success, result } = yield call(getFundCollision, id);
      if (success) {
        callFunc(result);
      }
    },
  },

  reducers: {
    SetState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

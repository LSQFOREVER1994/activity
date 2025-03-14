import { message } from 'antd';
import {
  getCondition, addCondition, exitCondition, delCondition,
  getGroups, addGroups, exitGroups, delGroups, searchGroups,
} from '@/services/selectStock.service';

export default {
  namespace: 'selectStock',
  
  state: {
    loading: false,
    conditions: {
      total: 0,
      list: [],
    },
    groups: {
      total: 0,
      list: [],
    },
    searchGroups: [],
  },

  effects: {
    *getCondition({ payload }, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: true,
      });
      
      const { success, result } = yield call(getCondition, payload);
      if (success) {
        yield put({
          type: 'setCondition',
          payload: result,
        });
      }

      yield put({
        type: 'setLoading',
        payload: false,
      });
    },
    *submitCondition({ payload: { params, callFunc } }, { call }) {
      const data = params.id ? yield call(exitCondition, params) : yield call(addCondition, params);
      if (data.success) {
        callFunc();
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    },
    *delCondition({ payload: { id, callFunc } }, { call }) {
      const data = yield call(delCondition, id);
      if (data.success) {
        callFunc();
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    },

    *searchGroups({ payload }, { call, put }) {
      const { success, result } = yield call(searchGroups, payload);
      if (success) {
        yield put({
          type: 'setSearchGroups',
          payload: result,
        });
      }
    },
    *getGroups({ payload }, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: true,
      });
      
      const { success, result } = yield call(getGroups, payload);
      if (success) {
        yield put({
          type: 'setGroups',
          payload: result,
        });
      }

      yield put({
        type: 'setLoading',
        payload: false,
      });
    },
    *submitGroups({ payload: { params, callFunc } }, { call }) {
      const data = params.id ? yield call(exitGroups, params) : yield call(addGroups, params);
      if (data.success) {
        callFunc();
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    },
    *delGroups({ payload: { id, callFunc } }, { call }) {
      const data = yield call(delGroups, id);
      if (data.success) {
        callFunc();
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    },
  },

  reducers: {
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
    setCondition(state, { payload }) {
      return {
        ...state,
        conditions: payload,
      };
    },
    setGroups(state, { payload }) {
      return {
        ...state,
        groups: payload,
      };
    },
    setSearchGroups(state, { payload }) {
      return {
        ...state,
        searchGroups: payload,
      };
    },
  },
};

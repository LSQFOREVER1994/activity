import {
  editPassword,
} from '@/services/account.service';

export default {
  namespace: 'account',

  state: {
    status: undefined,
  },

  effects: {
    *editPassWord({payload: { query, callFunc },},{ call }) {
      const data = yield call(editPassword, query);
      callFunc(data);
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {...state,status: payload,};
    },
  },
};

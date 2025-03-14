import { getTaskRecord } from '@/services/taskRecord.service';

export default {
    namespace: 'taskRecord',

    state: {
        loading: false,
        result: [],
    },

    effects: {
        // 任务完成明细
        *getTaskRecord({ payload }, { call, put }) {
            yield put({
                type: 'SetState',
                payload: {
                    loading: true
                },
            });
            const data = yield call(getTaskRecord, payload);
            console.log(data);
            if (data.success) {
                yield put({
                    type: 'SetState',
                    payload: { result: data.result },
                });
            }
            yield put({
                type: 'SetState',
                payload: {
                    loading: false
                },
            });
        },
    },


    reducers: {
        SetState(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        },
    },
};

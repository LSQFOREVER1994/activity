// import { message } from 'antd';
import { getResplenishList } from '@/services/equityGoods.service';

export default {
    namespace: 'resplenishRecord',

    state: {
        loading: false,
        resplenishListResult: {
            total: 0,
            list: [],
        },
    },


    effects: {
        // 获取补仓记录
        *getResplenishList({ payload }, { call, put }) {
            yield put({
                type: 'setLoading',
                payload: true
            });
            const { result, success } = yield call(getResplenishList, payload);
            if (success) {
                yield put({
                    type: 'setResplenishRecord',
                    payload: result,
                });
            }
            yield put({
                type: 'setLoading',
                payload: false
            });
        },
    },


    reducers: {
        setLoading(state, { payload }) {
            return {
                ...state,
                loading: payload
            }
        },
        setResplenishRecord(state, { payload }) {
            return {
                ...state,
                resplenishListResult: payload
            }
        },
    },
};

import { getConsumeData, getRightConsumeRank, getRightTrend, getConsumeDetail, getTypeRank, getMerchantNames } from '@/services/dataCount.service';

export default {
    namespace: 'dataCount',

    state: {
        loading: false,
        consumeData: {
            total: 0,
            list: [],
        },
        rightRank: [],
        typeRank: [],
        consumeDetail: [],
        merchantNames: {
            list: [],
        }
    },


    effects: {
        // 获取四种商品消耗数据
        *getConsumeData( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const data = yield call( getConsumeData, payload );
            if ( data.success ) {
                yield put( {
                    type: 'SetState',
                    payload: { consumeData: data.result },
                } );
                callFunc( data )
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        *getRightConsumeRank( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const data = yield call( getRightConsumeRank, payload );
            if ( data.success ) {
                yield put( {
                    type: 'SetState',
                    payload: data.result,
                } );
                callFunc( data )
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        *getRightTrend( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const data = yield call( getRightTrend, payload );
            if ( data.success ) {
                yield put( {
                    type: 'setRightRank',
                    payload: { rightRank: data.result },
                } );
                callFunc( data )
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        *getConsumeDetail( { payload }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const data = yield call( getConsumeDetail, payload );
            if ( data.success ) {
                yield put( {
                    type: 'setConsumeDetail',
                    payload: data.result,
                } );
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        *getTypeRank( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const data = yield call( getTypeRank, payload );
            if ( data.success ) {
                yield put( {
                    type: 'setTypeRank',
                    payload: data.result,
                } );
                callFunc( data );
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 商户名称列表
        *getMerchantNames( { payload, callFunc }, { call, put } ) {
            const { success, result } = yield call( getMerchantNames, payload );
            if ( success ) {
                yield put( {
                    type: 'setMerchantNames',
                    payload: result,
                } );
                callFunc();
            }
        },
    },


    reducers: {
        setLoading( state, { payload } ) {
            return {
                ...state,
                loading: payload,
            };
        },
        setMerchantNames( state, { payload } ) {
            return {
                ...state,
                merchantNames: payload,
            };
        },
        setConsumeDetail( state, { payload } ) {
            return {
                ...state,
                consumeDetail: payload,
            };
        },
        setRightRank( state, { payload } ) {
            return {
                ...state,
                rightRank: payload,
            };
        },
        setTypeRank( state, { payload } ) {
            return {
                ...state,
                typeRank: payload,
            };
        },
    },
};

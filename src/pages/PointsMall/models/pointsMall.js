// import { message } from 'antd';

import {
    getGoodsSpu, changeShelf, delShelf, addGood, updateGood, getOrderInfoList, getLogistics, getDelivery,
    getOrderInfo,
} from '@/services/pointsMall.service';

export default {
    namespace: 'pointsMall',

    state: {
        loading: false,
        goods: {
            total: 0,
            list: [],
        },
        orders: {
            total: 0,
            list: [],
        },
        logistics: [],
    },

    effects: {
        // 获取商品列表
        *getGoodsSpu( { payload }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getGoodsSpu, payload );
            if ( success ) {
                yield put( {
                    type: 'setGoods',
                    payload: result,
                } );
                // callFunc( result );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 获取商品列表
        *changeShelf( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, message } = yield call( changeShelf, payload );
            if ( success ) {
                callFunc( message );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 获取订单列表
        *getOrderInfoList( { payload }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getOrderInfoList, payload );
            if ( success ) {
                yield put( {
                    type: 'setOrderInfo',
                    payload: result,
                } );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 获取快递公司
        *getLogistics( { payload }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getLogistics, payload );
            if ( success ) {
                yield put( {
                    type: 'setLogistics',
                    payload: result,
                } );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 通过id删除spu商品
        *delShelf( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, message } = yield call( delShelf, payload );
            if ( success ) {
                callFunc( message );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 通过id查询商城订单
        *getOrderInfo( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getOrderInfo, payload );
            if ( success ) {
                callFunc( result );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 修改、新增商品
        *editGood( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, message } = payload.id ? yield call( updateGood, payload ) : yield call( addGood, payload );
            if ( success ) {
                callFunc( message );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 发货提交
        *getDelivery( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, message } = yield call( getDelivery, payload );
            if ( success ) {
                callFunc( message );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },

    },

    reducers: {
        setLoading( state, { payload } ) {
            return {
                ...state,
                loading: payload,
            };
        },
        setGoods( state, { payload } ) {
            return {
                ...state,
                goods: payload,
            };
        },
        setOrderInfo( state, { payload } ) {
            return {
                ...state,
                orders: payload,
            };
        },
        setLogistics( state, { payload } ) {
            return {
                ...state,
                logistics: payload,
            };
        },
    }
}
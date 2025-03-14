import { getAlertList, getAlertDetail, changeStatus, addAlert, delAlert, updateAlert, getManagerUserList } from '@/services/alertConfig.service';
import { getMerchantNames } from '@/services/merchantManage.service';

export default {
    namespace: 'alertConfig',

    state: {
        loading: false,
        alertList: {
            total: 0,
            list: []
        },
        merchantNames: undefined,
        adminList:[],
    },


    effects: {
        // 获取预警列表
        *getAlertList( { payload }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getAlertList, payload );
            if ( success ) {
                yield put( {
                    type: 'setAlertList',
                    payload: result,
                } );
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },

        // 修改、新增预警
        *editAlert( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const data = payload.id ? yield call( updateAlert, payload ) : yield call( addAlert, payload );
            if ( callFunc ) {
                callFunc( data );
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },

        // 预警详情
        *getAlertDetail( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, message } = yield call( getAlertDetail, payload );
            if ( success ) {
                yield put( {
                    type: 'setAlertDetail',
                    payload: result,
                } );
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },

        // 预警删除
        *delAlert( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, message } = yield call( delAlert, payload );
            if ( success ) {
                callFunc( message );
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 状态转换
        *changeStatus( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, message } = yield call( changeStatus, payload );
            if ( success ) {
                callFunc( message );
            }

            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },
        // 商户名称列表
        *getMerchantNames( { payload }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getMerchantNames, payload );
            if ( success ) {
                yield put( {
                    type: 'setMerchantNames',
                    payload: result,
                } );
            }
            yield put( {
                type: 'setLoading',
                payload: false,
            } );
        },

        // 提醒成员列表
        *getManagerUserList( { payload, callFunc }, { call, put } ) {
            yield put( {
                type: 'setLoading',
                payload: true,
            } );
            const { success, result } = yield call( getManagerUserList, payload );
            if ( success ) {
                yield put( {
                    type: 'setAdminList',
                    payload: result.list,
                } );
                if( callFunc ) callFunc( result.list )
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

        setAlertList( state, { payload } ) {
            return {
                ...state,
                alertList: payload,
            };
        },

        setAlertDetail( state, { payload } ) {
            return {
                ...state,
                alertDetail: payload,
            };
        },

        setMerchantNames( state, { payload } ) {
            return {
                ...state,
                merchantNames: payload,
            };
        },

        setAdminList( state, { payload } ) {
            return {
                ...state,
                adminList: [...payload],
            };
        },
    },
};

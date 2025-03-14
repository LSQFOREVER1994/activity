import {
	getMerchantList, getMerchantDetail, addMerchant, updateMerchant, delMerchant, getMerchantNames, changeStatus,
	getMerchantTree, changeMerchantTree, getKey, getRoleGroupList, getManagerList, addManager, deleteManager, getCurrentManagerInfo
} from '@/services/merchantManage.service';

export default {
	namespace: 'merchantManage',
	state: {
		loading: false,
		merchantNames: undefined,
		merchantList: {
			total: 0,
			list: [],
		},
		merchantDetail: {
			total: 0,
			list: [],
		},
		merchantTree: [],
		roleGroupList: [],
		managerList: [],
		managersLoading: false,
	},

	effects: {
		// 获取列表数据
		*getMerchantList( { payload }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const { success, result } = yield call( getMerchantList, payload );
			if ( success ) {
				yield put( {
					type: 'setMerchantList',
					payload: result,
				} );
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 修改、新增商户
		*editMerchant( { payload, callFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = payload.id ? yield call( updateMerchant, payload ) : yield call( addMerchant, payload );
			if ( callFunc ) callFunc( data )
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 商户详情
		*getMerchantDetail( { payload, callFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( getMerchantDetail, payload );
			const { success, result } = data;
			if ( success ) {
				callFunc( result )
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 商户删除
		*delMerchant( { payload, callFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const { success, message } = yield call( delMerchant, payload );
			if ( success ) {
				callFunc( message );
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 商户名称列表
		*getMerchantNames( { payload, callBackFunc }, { call, put } ) {
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
				callBackFunc( result )
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

		// 商户可见权益
		*getMerchantTree( { payload, callFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( getMerchantTree, payload );
			const { success, result } = data;
			if ( callFunc ) callFunc( data );
			if ( success ) {
				yield put( {
					type: 'setMerchantTree',
					payload: result,
				} );
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 商户可见权益变更
		*changeMerchantTree( { payload, callFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const { success, message } = yield call( changeMerchantTree, payload );
			if ( success ) {
				callFunc( message );
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 获取密钥
		*getKey( { payload, callFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( getKey, payload );
			if ( callFunc ) callFunc( data );
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 获取对应角色码用户列表
		*getRoleGroupList( { payload, successFun }, { call, put } ) {
			const data = yield call( getRoleGroupList, payload );
			if ( data.success ) {
				yield put( {
					type: 'SetState',
					payload: { roleGroupList: data.result },
				} );
				if ( successFun ) successFun( data.result );
			}
		},

		// 商户管理者列表
		*getManagerList( { payload, successFun }, { call, put } ) {
			yield put( {
				type: 'SetState',
				payload: { managersLoading: true },
			} );
			const data = yield call( getManagerList, payload );
			if ( data.success ) {
				yield put( {
					type: 'SetState',
					payload: { managerList: data.result },
				} );
				if ( successFun ) successFun( data.result );
			}
			yield put( {
				type: 'SetState',
				payload: { managersLoading: false },
			} );
		},

		// 添加管理者
		*addManager( { payload, successFun }, { call } ) {
			const data = yield call( addManager, payload );
			if ( data.success ) {
				if ( successFun ) successFun( data.result );
			}
		},

		// 删除管理者
		*deleteManager( { payload, successFun }, { call } ) {
			const data = yield call( deleteManager, payload );
			if ( data.success ) {
				if ( successFun ) successFun( data );
			}
		},

		// 获取当前用户管理者信息
		*getCurrentManagerInfo( { payload, successFun }, { call, put } ) {
			const data = yield call( getCurrentManagerInfo, payload );
			if ( data.success ) {
				yield put( {
					type: 'SetState',
					payload: { roleGroupList: data.result },
				} );
				if ( successFun ) successFun( data.result );
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

		setMerchantList( state, { payload } ) {
			return {
				...state,
				merchantList: payload,
			};
		},


		setMerchantNames( state, { payload } ) {
			return {
				...state,
				merchantNames: payload,
			};
		},

		setMerchantTree( state, { payload } ) {
			return {
				...state,
				merchantTree: payload,
			};
		},

		SetState( state, { payload } ) {
			return {
				...state,
				...payload
			}
		},
	},
};

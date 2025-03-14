import {
	getMerchantRights, lockMerchantRights, unlockMerchantRights, rollbackRightsApply, getMerchantNames, getGoodsDetail,
	getFreezeDetail, unlockFreezeVouchers
} from '@/services/merchantManage.service';
import { fetchGoodsApply, editPriceRatio } from '@/services/equityGoods.service';

export default {
	namespace: 'merchantRights',

	state: {
		loading: false,
		rightList: {
			total: 0,
			list: [],
		},
		merchantList: {
			total: 0,
			list: []
		},
		freezeDetail: {
			total: 0,
			list: []
		}
	},


	effects: {
		// 获取权益商品列表
		*getMerchantRights( { payload }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const { success, result } = yield call( getMerchantRights, payload );
			if ( success ) {
				yield put( {
					type: 'setRights',
					payload: result,
				} );
			}

			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},
		// 获取商品信息列表
		*getGoodsDetail( { payload, callFunc }, { call } ) {
			const data = yield call( getGoodsDetail, payload );
			if ( callFunc ) {
				callFunc( data )
			}
		},
		// 冻结&解冻
		*lockMerchantRights( { payload, callFunc }, { call } ) {
			const { success, message } = payload.tradeStatus === "LOCK" ? yield call( unlockMerchantRights, payload ) : yield call( lockMerchantRights, payload );
			if ( success ) {
				callFunc( message );
			}
		},
		// 获取权益商户列表
		*getMerchantNameList( { payload, callBackFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( getMerchantNames, payload );
			if ( data.success ) {
				yield put( {
					type: 'setMerchantNameList',
					payload: data.result,
				} );
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
			if ( callBackFunc ) callBackFunc( data )
		},
		// 权益商品申请
		*fetchGoodsApply( { payload, callBackFunc }, { call } ) {
			const data = yield call( fetchGoodsApply, payload );
			if ( callBackFunc ) callBackFunc( data )
		},
		// 回退库存
		*rollbackRightsApply( { payload, callBackFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( rollbackRightsApply, payload );
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
			if ( callBackFunc ) callBackFunc( data )

		},

		// 商户定价修改
		*editPriceRatio( { payload, callBackFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( editPriceRatio, payload );
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
			if ( callBackFunc ) callBackFunc( data )

		},

		// 获取冻结明细列表
		*getFreezeDetail( { payload, callBackFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( getFreezeDetail, payload );
			if ( data.success ) {
				yield put( {
					type: 'SetState',
					payload: { freezeDetail: data.result },
				} );
				if ( callBackFunc ) callBackFunc( data )
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		// 批量解冻提货码
		*unlockFreezeVouchers( { payload, callBackFunc }, { call, put } ) {
			yield put( {
				type: 'setLoading',
				payload: true,
			} );
			const data = yield call( unlockFreezeVouchers, payload );
			if ( data.success ) {
				if ( callBackFunc ) callBackFunc( data )
			}
			yield put( {
				type: 'setLoading',
				payload: false,
			} );
		},

		*clearRightsList( _, { put } ) {
			yield put( {
				type: 'setRights',
				payload: {
					total: 0,
					list: []
				},
			} );
		}
	},


	reducers: {
		setLoading( state, { payload } ) {
			return {
				...state,
				loading: payload,
			};
		},
		setRights( state, { payload } ) {
			return {
				...state,
				rightList: payload,
			};
		},

		setMerchantNameList( state, { payload } ) {
			return {
				...state,
				merchantList: payload
			}
		},

		SetState( state, { payload } ) {
			return {
				...state,
				...payload
			}
		},
	},
};

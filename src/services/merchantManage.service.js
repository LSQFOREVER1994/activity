/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { equityCenterService, userService } = serviceObj;

/** 商户管理 -> 商户列表 */
// 获取商户列表
export async function getMerchantList( obj ) {
	return request( `${equityCenterService}/merchant`, {
		method: 'GET',
		body: obj
	} )
}

// 商户详情
export async function getMerchantDetail( obj ) {
	return request( `${equityCenterService}/merchant/detail`, {
		method: 'GET',
		body: obj
	} )
}
// 商户新增
export async function addMerchant( obj ) {
	return request( `${equityCenterService}/merchant/add`, {
		method: 'POST',
		body: obj
	}, 'JSON' )
}
// 商户删除
export async function delMerchant( obj ) {
	return request( `${equityCenterService}/merchant/remove`, {
		method: 'POST',
		body: obj
	} )
}

// 商户修改
export async function updateMerchant( obj ) {
	return request( `${equityCenterService}/merchant/update`, {
		method: 'POST',
		body: obj
	}, 'JSON' )
}

// 获取商户名称列表
export async function getMerchantNames( obj ) {
	return request( `${equityCenterService}/merchant/all`, {
		method: 'GET',
		body: obj
	} )
}

// 是否开启提醒
export async function changeStatus( obj ) {
	return request( `${equityCenterService}/merchant/shelf`, {
		method: 'GET',
		body: obj
	} )
}

// 获取商户可见权益数据
export async function getMerchantTree( obj ) {
	return request( `${equityCenterService}/merchant/visibleProduct`, {
		method: 'GET',
		body: obj
	} )
}

// 商户可见权益变更
export async function changeMerchantTree( obj ) {
	return request( `${equityCenterService}/merchant/visibleProduct/change`, {
		method: 'POST',
		body: obj
	}, 'JSON' )
}

// 查询商户Key
export async function getKey( obj ) {
	return request( `${equityCenterService}/merchant/getKey/${obj.id}`, {
		method: 'GET',
		body: obj
	} )
}

/** 商户可见权益 -> 权益可见用户设置 */
// 获取对应角色码用户列表
export async function getRoleGroupList( obj ) {
	return request( `${userService}/roleGroup/users`, {
		method: 'GET',
		body: obj,
	} );
}

// 商户管理者列表
export async function getManagerList( obj ) {
	return request( `${equityCenterService}/merchant/right/manager`, {
		method: 'GET',
		body: obj,
	} );
}

// 创建商户管理者
export async function addManager( obj ) {
	return request( `${equityCenterService}/merchant/right/manager/add`, {
		method: 'POST',
		body: obj,
	}, 'JSON' );
}

// 删除商户管理者
export async function deleteManager( obj ) {
	return request( `${equityCenterService}/merchant/right/manager/delete`, {
		method: 'POST',
		body: obj,
	}, 'JSON' );
}

// 查询当前用户管理者权限信息
export async function getCurrentManagerInfo( obj ) {
	return request( `${equityCenterService}/merchant/right/manager/get`, {
		method: 'GET',
		body: obj,
	} );
}

// 刷新权限缓存
export async function freshManagerCache( obj ) {
	return request( `${equityCenterService}/merchant/right/manager/permissions/cache/refresh`, {
		method: 'POST',
		body: obj,
	}, 'JSON' );
}

// 修改商户管理者
export async function updateManager( obj ) {
	return request( `${equityCenterService}/merchant/right/manager/update`, {
		method: 'POST',
		body: obj,
	}, 'JSON' );
}

/** 商户管理 -> 商户权益 */
// 商户权益列表
export async function getMerchantRights( obj ) {
	return request( `${equityCenterService}/merchant/right/page`, {
		method: 'GET',
		body: obj
	} )
}

// 权益商品详情
export async function getGoodsDetail( obj ) {
	return request( `${equityCenterService}/product/info`, {
		method: 'GET',
		body: obj
	} )
}
// 商户权益冻结
export async function lockMerchantRights( obj ) {
	const { id } = obj
	return request( `${equityCenterService}/merchant/right/enable`, {
		method: 'POST',
		body: { id }
	} )
}

// 商户权益解冻
export async function unlockMerchantRights( obj ) {
	const { id } = obj
	return request( `${equityCenterService}/merchant/right/unlock`, {
		method: 'POST',
		body: { id }
	} )
}

// 回退库存
export async function rollbackRightsApply( obj ) {
	return request( `${equityCenterService}/order/rollback/apply`, {
		method: 'POST',
		body: obj
	}, 'JSON' )
}

// 冻结明细-列表
export async function getFreezeDetail( obj ) {
	return request( `${equityCenterService}/vouchers/lock/details`, {
		method: 'GET',
		body: obj
	} )
}

// 冻结明细-批量解冻提货码
export async function unlockFreezeVouchers( obj ) {
	return request( `${equityCenterService}/vouchers/unlock`, {
		method: 'POST',
		body: obj
	}, 'JSON' )
}

// 获取红包数据
export async function getRedEnvelopeData( obj ) {
  return request(
    `${equityCenterService}/vouchers/stats/page`,
    {
      method: 'GET',
      body: obj,
    },
  );
}


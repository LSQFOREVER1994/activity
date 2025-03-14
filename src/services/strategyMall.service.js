import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { strategyMallService, openService } = serviceObj;

// 获取 用户领取的优惠券 GET /coupons/users
export async function getCouponsUsers( obj ) {
  const { productId, name, orderBy, ...params } = obj
  return request( `${strategyMallService}/coupons/users?coupon.name=${name}&coupon.productId=${productId}&coupon.orderBy=${orderBy}`, {
    method: 'GET',
    body: params,
  } );
}

// 获取 订单 GET /orders
export async function getOrders( obj ) {
  return request( `${strategyMallService}/orders`, {
    method: 'GET',
    body: obj
  } );
}

// 获取 订单详情 GET /orders/:Id
export async function getOrder( obj ) {
  return request( `${strategyMallService}/orders/${obj.orderId}`, {
    method: 'GET',
  } );
}

// 获取订单总额
export async function getOrderAmounts( obj ) {
  return request( `${strategyMallService}/orders/amounts`, {
    method: 'GET',
    body: obj
  } );
}

// 获取订单总数
export async function getOrderCounts( obj ) {
  return request( `${strategyMallService}/orders/count`, {
    method: 'GET',
    body: obj
  } );
}

// 增加付费权限
export async function addJurisdiction( obj ) {
  return request( `${strategyMallService}/orders/presents`, {
    method: 'POST',
    body: obj
  } );
}
// 获取 优惠券 GET /coupons
export async function getCoupons( obj ) {
  return request( `${strategyMallService}/coupons`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取 商品列表
export async function searchGoods( obj ) {
  // const { pageNum, pageSize,keyword } = obj;
  return request( `${strategyMallService}/products/search`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增 优惠券 POST /coupons
export async function addCoupons( obj ) {
  return request( `${strategyMallService}/coupons`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改 优惠券 PUT /coupons
export async function exitCoupons( obj ) {
  return request( `${strategyMallService}/coupons`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除 优惠券 DELETE /coupons/{id}
export async function delCoupons( id ) {
  return request( `${strategyMallService}/coupons/${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}


// 获取 产品权限
export async function getProductsRights( obj ) {
  const { pageNum = 1, pageSize = 1000 } = obj;
  return request( `${strategyMallService}/permissions`, {
    method: 'GET',
    body: {
      pageNum,
      pageSize,
    },
  } );
}

// 获取用户详细权限
export async function getProductsParticulars( obj ) {
  return request( `${strategyMallService}/permissions/users/histories`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增 产品权限 POST /permissions
export async function addProductsRights( obj ) {
  return request( `${strategyMallService}/permissions`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改 产品权限 PUT /permissions
export async function exitProductsRights( obj ) {
  return request( `${strategyMallService}/permissions`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除 产品权限 DELETE /permissions/{code}
export async function delProductsRights( code ) {
  return request( `${strategyMallService}/permissions/${code}`, {
    method: 'DELETE',
    body: { code },
  } );
}

// 获取 产品权限所属
export async function getProductsRightsBelongs( obj ) {
  return request( `${strategyMallService}/permissions/users`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取 获取商品种类列表
export async function getCategories( obj ) {
  return request( `${strategyMallService}/categories`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增商品种类
export async function addCategorie( obj ) {
  return request( `${strategyMallService}/categories`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改商品种类
export async function exitCategorie( obj ) {
  return request( `${strategyMallService}/categories`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除种类
export async function delCategorie( id ) {
  return request( `${strategyMallService}/categories/${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}

// 获取 产品列表
export async function getProducts( obj ) {
  const { pageNum, pageSize, state, orderBy, name, category } = obj;

  return request( `${strategyMallService}/products`, {
    method: 'GET',
    body: {
      pageNum,
      pageSize,
      state,
      orderBy,
      name,
      category
    },
  } );
}

// 新增产品 POST /products
export async function addProduct( obj ) {
  return request( `${strategyMallService}/products`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改产品 PUT /products
export async function exitProduct( obj ) {
  return request( `${strategyMallService}/products`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除产品 DELETE /products/{id}
export async function delProduct( id ) {
  return request( `${strategyMallService}/products/${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}


// 获取产品规格
export async function getSpecs( obj ) {
  const { id } = obj;
  return request( `${strategyMallService}/products/${id}/specs`, {
    method: 'GET',
    body: {
      id,
    },
  } );
}

// 新增产品规格 POST /products/specs
export async function addSpecst( obj ) {
  return request( `${strategyMallService}/products/specs`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改产品规格 PUT /products/specs
export async function exitSpecs( obj ) {
  return request( `${strategyMallService}/products/specs`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除产品规格 DELETE /products/specs/{id}
export async function delSpecs( id ) {
  return request( `${strategyMallService}/products/specs/${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}

// 发送优惠券
export async function sendCoupons( obj ) {
  return request( `${strategyMallService}/coupons/${obj.id}/receive`, {
    method: 'POST',
    body: obj,
  } );
}

// 修改优惠券库存
export async function putInventories( obj ) {
  return request( `${strategyMallService}/coupons/${obj.id}/inventories`, {
    method: 'PUT',
    body: obj,
  } );
}

// 查询商品与套餐列表(tree)
export async function getgoodsSpecs( obj ) {
  return request( `${strategyMallService}/products/specs`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取退款列表
export async function getRefundList( obj ) {
  return request( `${strategyMallService}/refunds`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取退款列表
export async function refundCheck( obj ) {
  return request( `${strategyMallService}/refunds`, {
    method: 'PUT',
    body: obj,
  }, "JSON" );
}

// 获取邀请码列表
export async function getVisit( obj ) {
  return request( `${strategyMallService}/orders/visit/codes`, {
    method: 'GET',
    body: obj,
  } );
}

// 管理员退款
export async function refundAdministrator( obj ) {
  return request( `${strategyMallService}/refunds/manual`, {
    method: 'POST',
    body: obj,
  } );
}

// 获取优惠券兑换码批次列表
export async function getBatchCodeList( obj ) {
  return request( `${strategyMallService}/coupons-code`, {
    method: 'GET',
    body: obj,
  } );
}

// 添加批次兑换码
export async function addBatchCodeList( obj ) {
  return request( `${strategyMallService}/coupons-code`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取兑换码列表
export async function getRedeemCodeList( obj ) {
  return request( `${strategyMallService}/coupons-code/codes`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取分享密码 
export async function getSharePassword( id ) {
  return request( `${strategyMallService}/coupons-code/${id}/password`, {
    method: 'PUT',
    // body: obj,
  } );
}

// 获取批次虚拟卡
export async function getVirtualList( obj ) {
  return request( `${openService}/vouchers/group`, {
    method: 'GET',
    body: obj,
  } );
}

// 编辑批次虚拟卡
export async function exitVirtual( obj ) {
  return request( `${openService}/vouchers/group`, {
    method: 'PUT',
    body: obj,
  } );
}

//  添加批次虚拟卡
export async function addVirtual( obj ) {
  return request( `${openService}/vouchers/group`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

//  删除批次虚拟卡
export async function delVirtual( id ) {
  return request( `${openService}/vouchers/group?groupId=${id}`, {
    method: 'DELETE',
    body: { groupId:id },
  } );
}


//  获取密卡列表
export async function getVouchersList( obj ) {
  return request( `${openService}/vouchers`, {
    method: 'GET',
    body: obj,
  } );
}

//  删除密卡
export async function delVouchers( id ) {
  return request( `${openService}/vouchers?id=${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}

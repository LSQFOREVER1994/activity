import request, { request2 } from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { equityCenterService, rightUploadService } = serviceObj;

/** 权益中心 -> 权益商品 */
// 获取商品预售明细
export async function getPreSaleDetail( obj ) {
  return request( `${equityCenterService}/merchant/right/list`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取商品列表
export async function getGoodsList( obj ) {
  return request( `${equityCenterService}/product`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取单个商品详情
export async function getSingleGoodsDetail( obj ) {
  return request( `${equityCenterService}/product/info`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取商户列表
export async function getMerchantNameList( obj ) {
  return request( `${equityCenterService}/merchant/all`, {
    method: 'GET',
    body: obj
  } )
}

// 同步商品
export async function syncGoods( obj ) {
  const { source, product } = obj;
  return request( `${equityCenterService}/product/syncProduct?source=${source}`, {
    method: 'POST',
    body: product,
  }, 'JSON' );
}

// 同步商品来源
export async function getSyncGoodsSource( obj ) {
  return request( `${equityCenterService}/product/product/source`, {
    method: 'GET',
    body: obj
  } )
}

// 新增商品
export async function fetchGoodsAdd( obj ) {
  return request( `${equityCenterService}/product/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取绩牛权益商品
export async function getJNRigthList( obj ) {
  return request( `${equityCenterService}/product/supplier`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改商品
export async function fetchGoodsUpDate( obj ) {
  return request( `${equityCenterService}/product/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 商品上下架
export async function fetchGoodsDownShelf( obj ) {
  return request( `${equityCenterService}/product/shelf`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 商品补仓
export async function fetchGoodsResplenish( obj ) {
  const { type, ...rest } = obj
  return request( `${equityCenterService}/product/replenishment`, {
    method: 'POST',
    body: rest,
  } );
}

// 卡密补仓
export async function fetchCouponResplenish( obj ) {
  return request2( `${rightUploadService}/product/replenishment/upload?id=${obj.id}`, {
    method: 'POST',
    body: obj.file,
  } );
}

// 立即申请
export async function fetchGoodsApply( obj ) {
  return request( `${equityCenterService}/order/apply`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 查询商户定价
export async function getPriceRatio( obj ) {
  return request( `${equityCenterService}/product/price-ratio`, {
    method: 'GET',
    body: obj,
  } );
}

// 商户定价修改
export async function editPriceRatio( obj ) {
  return request( `${equityCenterService}/product/price-ratio/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 卡券卡密列表
export async function getCouponList( obj ) {
  return request( `${equityCenterService}/vouchers/list`, {
    method: 'GET',
    body: obj,
  } );
}

// 卡券卡密查看
export async function getCouponDetail( obj ) {
  return request( `${equityCenterService}/vouchers/secret/view`, {
    method: 'GET',
    body: obj,
  } )
}

// 删除卡券
export async function deleteCoupon( obj ) {
  return request( `${equityCenterService}/vouchers/delete`, {
    method: 'GET',
    body: obj,
  } )
}

// 卡券卡密回收站列表
export async function getCouponRecycleList( obj ) {
  return request( `${equityCenterService}/vouchers/recycle/list`, {
    method: 'GET',
    body: obj,
  } );
}

/** 权益中心 -> 商品分类 */

// 获取商品分类列表
export async function getGoodsClassifyList( obj ) {
  return request( `${equityCenterService}/right/category/page`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取全部商品分类列表
export async function getAllClassify( obj ) {
  return request( `${equityCenterService}/right/category/list`, {
    method: 'GET',
    body: obj,
  } );
}

// 关闭开启分类展示
export async function getGoodsClassifyDownShelf( obj ) {
  return request( `${equityCenterService}/right/category/shelf`, {
    method: 'POST',
    body: obj,
  }, "JSON" );
}

// 添加分类
export async function fetchGoodsClassifyAdd( obj ) {
  return request( `${equityCenterService}/right/category/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改分类
export async function fetchGoodsClassifyUpDate( obj ) {
  return request( `${equityCenterService}/right/category/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除分类
export async function fetchGoodsClassifyRemove( obj ) {
  return request( `${equityCenterService}/right/category/remove`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

/** 权益中心 -> 补仓记录 */

// 获取补仓记录列表
export async function getResplenishList( obj ) {
  return request( `${equityCenterService}/product/replenishment/list`, {
    method: 'GET',
    body: obj,
  } );
}






import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { equityCenterService } = serviceObj;


/** 数据管理 -> 申请订单 */

//获取权益订单列表
export async function getApplyOrderList(obj) {
  return request(`${equityCenterService}/order/page`, {
    method: 'GET',
    body: obj,
  });
}

//获取单个商品详情
export async function getSingleGoodsDetail(obj) {
  return request(`${equityCenterService}/product/info`, {
    method: 'GET',
    body: obj,
  });
}

//获取单个订单详情
export async function getSingleOrderDetail(obj) {
  return request(`${equityCenterService}/order/detail`, {
    method: 'GET',
    body: obj,
  });
}

// 获取商户列表
export async function getMerchantNameList(obj) {
  return request(`${equityCenterService}/merchant/all`, {
    method: 'GET',
    body: obj
  })
}

//  权益订单申请 - 发送
export async function fetchEquityApply(obj) {
  return request(`${equityCenterService}/order/apply`, {
    method: 'POST',
    body: obj
  }, 'JSON')
}

//  权益订单审核
export async function fetchEquityAudit(obj) {
  return request(`${equityCenterService}/order/audit`, {
    method: 'POST',
    body: obj
  })
}

//  权益订单发送
export async function fetchEquitySend(obj) {
  return request(`${equityCenterService}/order/send`, {
    method: 'POST',
    body: obj
  })
}

//  权益订单取消
export async function fetchEquityCancel(obj) {
  return request(`${equityCenterService}/order/cancel`, {
    method: 'POST',
    body: obj
  })
}

// 获取订单数量
export async function getStatusCount(obj) {
  return request(`${equityCenterService}/order/apply/status-count`, {
    method: 'GET',
    body: obj
  })
}


/** 数据管理 -> 消耗订单 */

// 权益商品消耗订单列表
export async function getConsumeOrderList(obj) {
  return request(`${equityCenterService}/order/consume`, {
    method: 'GET',
    body: obj
  })
}

// 获取物流公司列表
export async function getExpressList() {
  return request(`${equityCenterService}/logistics/companies`, {
    method: 'POST',
  })
}

// 物流订阅
export async function changeExpressSubscribe(obj) {
  return request(`${equityCenterService}/order/express/subscribe`, {
    method: 'POST',
    body: obj
  })
}

// 权益商品消耗订单列表导出
export async function exportConsumeOrderList(obj) {
  return request(`${equityCenterService}/order/consume/export`, {
    method: 'GET',
    body: obj
  })
}


// 权益商品消耗订单发货物流信息修改
export async function fetchConsumeExpressAlterOrSend(obj) {
  return request(`${equityCenterService}/order/express`, {
    method: 'POST',
    body: obj
  })
}

// 批量发货
export async function fetchMultiSend(obj) {
  return request(`${equityCenterService}/order/replenishment/upload`, {
    method: 'POST',
    body: obj.file
  })
}

// 查询物流详情
export async function getLogisticsData(obj) {
  return request(`${equityCenterService}/logistics/third`, {
    method: 'GET',
    body: obj
  })
}

/** 数据管理 -> 回退订单 */

//回退订单列表
export async function getWithdrawOrderList(obj) {
  return request(`${equityCenterService}/order/rollback/apply/page`, {
    method: 'GET',
    body: obj,
  });
}

//权益回退申请
export async function fetchWithdrawOrder(obj) {
  return request(`${equityCenterService}/order/rollback/apply`, {
    method: 'POST',
    body: obj
  }, 'JSON')
}

//回退订单审核
export async function auditWithdrawOrder(obj) {
  return request(`${equityCenterService}/order/rollback/audit`, {
    method: 'POST',
    body: obj
  })
}

//回退订单导出
export async function exportWithdrawOrder(obj) {
  return request(`${equityCenterService}/order/rollback/export`, {
    method: 'POST',
    body: obj
  }, 'JSON')
}

/** 数据管理 -> 回退订单 */

// 红包提现异常列表
export async function getRedAbnormalList( obj ) {
  return request( `${equityCenterService}/red-exception-record/page`, {
    method: 'GET',
    body: obj,
  } );
}

// 红包提现异常操作 重发||解绑
export async function getRedAbnormalAction( obj ) {
  return request( `${equityCenterService}/red-exception-record/unbinding/${obj.id}`, {
    method: 'POST',
    body: obj
  } )
}

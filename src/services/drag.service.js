/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 10:59:51
 * @LastEditTime: 2024-12-11 17:27:19
 * @LastEditors: zq636443 zq636443@163.com
 */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { zsService, activityService, equityCenterService, libraryService, xindaServive } = serviceObj;

// 获取组件id
export async function getSingleId() {
  return request( `${activityService}/v3/id`, {
    method: 'GET',
  } );
}

// 获取批量id
export async function getComponentIds( count ) {
  return request( `${activityService}/v3/id/generate`, {
    method: 'GET',
    body: { count:count || 20 },
  } );
}

// 获取活动列表
export async function getBees( obj ) {
  return request( `${activityService}/v3/activity/info`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取活动信息
export async function getBeesInfo( obj ) {
  let data ={ id:obj.id }
  if( obj && obj.isDraft )data={ isDraft:obj.isDraft }
  return request( `${activityService}/activity/draft/detail`, {
    method: 'GET',
    body: data,
  } );
}

export async function getPassBeesInfo( obj ) {
  let data = { id:obj.id }
  if ( obj && obj.isDraft ) data = { isDraft: obj.isDraft }
  return request( `${activityService}/v3/activity/info/detail`, {
    method: 'GET',
    body: data,
  } );
}

// 新增或编辑活动
export async function addBeesOrEditBees( obj ) {
  return request( `${activityService}/activity/draft/addOrUpdate`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

export async function setPublish( obj ) {
  return request( `${activityService}/activity/draft/addAndSubmit`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// // 编辑活动
// export async function editBees( obj ) {
//   return request( `${activityService}/v3/activity/info/update`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

// 删除活动
export async function deleteBees( obj ) {
  return request( `${activityService}/v3/activity/info/delete`, {
    method: 'POST',
    body:obj
  } );
}

// 获取奖品类型列表
export async function getPrizeTypeList(  ) {
  return request( `${activityService}/rights/getRightTypes`, {
    method: 'GET',
  } );
}


// v3基金卡片组件获取基金列表
export async function getFundListV3( obj ){
  return request( `${xindaServive}/fund/list`, {
    method: 'GET',
    body: obj,
  } )
}


// 模糊搜索奖品列表
export async function getPrizeList( obj ) {
  return request( `${activityService}/rights/getRightList`, {
    method: 'GET',
    body: obj,
  } );
}


// 模糊搜索基金列表
export async function getFundList( obj ) {
  return request( `${zsService}/data/fund/search`, {
    method: 'GET',
    body: obj,
  } );
}

// 模糊搜索基金列表
export async function getInitFunds( obj ) {
  return request( `${zsService}/data/fund`, {
    method: 'GET',
    body: obj,
  } );
}

// 使用模版
export async function userTemplate( obj ) {
  return request( `${activityService}/activity/template/${obj.id}/use`, {
    method: 'POST',
  } );
}

// 获取模版详情
export async function getTemplate( obj ) {
  return request( `${activityService}/activity/template/${obj.id}`, {
    method: 'GET',
  } );
}

// 使用组件
export async function userComponent( obj ) {
  return request( `${activityService}/v3/activity/element/${obj.type}/use`, {
    method: 'POST',
  } );
}

// 复制活动
export async function copyActivity( obj ) {
  return request( `${activityService}/v3/activity/info/copy/${obj.id}`, {
    method: 'POST',
  } );
}

// 活动添加至模版
export async function addToTemplate( obj ) {
  return request( `${activityService}/v3/activity/template`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取组件列表
export async function getComponentList( obj ) {
  return request( `${activityService}/v3/activity/element`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取资格列表
export async function getEligibilityList( obj ) {
  return request( `${activityService}/task/task/eligibility`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取资格类型
export async function getEligibilityType( obj ) {
  return request( `${activityService}/task/task/eligibility/type`, {
    method: 'GET',
    body: obj,
  } );
}

// // 修改期数
// export async function getActivityDraft( obj ) {
//   return request( `${activityService}/v3/activity/info/next-periods`, {
//     method: 'POST',
//     body: obj,
//   } );
// }

// 查询未来版本
export async function getActivityDraft( obj ) {
  return request( `${activityService}/v3/activity/info/draft`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增未来版本
export async function addActivityDraft( obj ) {
  return request( `${activityService}/v3/activity/info/draft`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除未来版本
export async function deleteActivityDraft( obj ) {
  return request( `${activityService}/v3/activity/info/draft/delete`, {
    method: 'GET',
    body: obj,
  } );
}

// 编辑未来版本
export async function editActivityDraft( obj ) {
  return request( `${activityService}/v3/activity/info/draft/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取标签列表
export async function getTagList( obj ) {
  return request( `${activityService}/v3/question-tags/page`, {
    method: 'GET',
    body: obj,
  } );
}


// 获取活动数据
export async function getElementDataType( obj ) {
  return request( `${activityService}/v3/activity/element/dataType`, {
    method: 'GET',
    body: obj,
  } );
}

// 保存预览活动
export async function setPreview( obj ) {
  return request( `${activityService}/v3/activity/info/preview`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 预览二维码
export async function getQrcode( id ) {
  return request( `${activityService}/v3/activity/info/preview/${id}/qrcode`, {
    method: 'GET',
  } );
}


// 获取商户下拉列表
export async function getMerchantList( obj ) {
  return request( `${equityCenterService}/merchant/all`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取商户可见列表
export async function getVisibleGoodsList( obj ) {
  return request( `${equityCenterService}/merchant/right/page`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getGuessProductsList( obj ) {
  return request( `${xindaServive}/stock/list`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getAllActivityList( obj ) {
  return request( `${activityService}/activity/info/all`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getActivityIdPageList( obj ) {
  return request( `${activityService}/activity/info/${obj.id}/pages`, {
    method: 'GET',
    // body: obj,
  } );
}

// 获取字体列表
export async function getFontList( ) {
  return request( `${libraryService}/font`, {
    method: 'GET',
  } );
}

// 获取ETF大赛排行榜组件商户列表
export async function getETFRankMerchantList () {
  return request( `${activityService}/etf/datasource/merchant/list`, {
    method:'GET',
  } )
}


export async function getActivityIdPageData( obj ) {
  return request( `${activityService}/v3/activity/info/${obj.id}`, {
    method: 'GET',
    body: obj,
  } );
}

// ETF商户列表
export async function getETFMerchantIdList( obj ) {
  return request( `${activityService}/etf/datasource/merchant/list`, {
    method: 'GET',
    body: obj,
  } );
}

// ETF数据源列表
export async function getETFDatasourceList( obj ) {
  return request( `${activityService}/etf/datasource/list`, {
    method: 'GET',
    body: obj,
  } );
}

// ETF基金列表
export async function getETFFundList( obj ){
  return request( `${activityService}/fund/search`, {
    method: 'GET',
    body: obj,
  } )
}

// ETF基金代码查询列表
export async function getETFCodeFundList( obj ){
  const { fundIds } = obj
  return request( `${activityService}/fund/get?fundIds=${fundIds}`, {
    method: 'GET',
  } )
}

// 获取信达商城活动列表
export async function getXDMallActivityList( ) {
  return request( `${xindaServive}/shop/list/activity`, {
    method: 'GET',
  } );
}


// 获取信达商城商品列表
export async function getXDMallGoodsList( obj ) {
  return request( `${xindaServive}/shop/list/goods`, {
    method: 'GET',
    body: obj,
  } );
}


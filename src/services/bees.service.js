/* eslint-disable import/prefer-default-export */
import request, { request2 } from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { activityService, zsService, equityCenterService, userService, activityUploadService, xindaServive } = serviceObj;

// 获取活动列表
export async function getBees( obj ) {
  return request( `${activityService}/activity/info`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取活动信息
export async function getBeesInfo( obj ) {
  let data = { id:obj.id }
  if ( obj && obj.isDraft ) data = { isDraft: obj.isDraft }
  return request( `${activityService}/v3/activity/info/detail`, {
    method: 'GET',
    body: data,
  } );
}

// 获取奖品发放图统计
export async function getRewardConsume( obj ) {
  return request( `${activityService}/activity/reward-record/statistics`, {
    method: 'GET',
    body: obj,
  } );
}


// 获取活动信息下的奖品列表
export async function getInfoPrizeList( obj ) {
  return request( `${activityService}/activity/prize/info`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取活动列表
export async function getAllActivityList( obj ) {
  return request( `${activityService}/activity/info/all`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取活动的抽奖组件
export async function getDrawElement( id ) {
  return request( `${activityService}/activity/info/draw-element`, {
    method: 'GET',
    body: { id },
  } );
}

// 新增活动
export async function addBees( obj ) {
  return request( `${activityService}/activity/info/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 编辑活动
export async function editBees( obj ) {
  return request( `${activityService}/activity/info/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除活动
export async function deleteBees( obj ) {
  return request( `${activityService}/activity/draft/delete`, {
    method: 'GET',
    body: obj
  } );
}

// 获取奖品类型列表
export async function getPrizeTypeList() {
  return request( `${activityService}/rights/getRightTypes`, {
    method: 'GET',
  } );
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
  return request( `${activityService}/activity/template/use`, {
    method: 'POST',
    body:obj
  } );
}

// 获取模版详情
export async function getTemplate( obj ) {
  return request( `${activityService}/activity/template/detail`, {
    method: 'GET',
    body:obj
  } );
}

// 使用组件
export async function userComponent( obj ) {
  return request( `${activityService}/activity/element/${obj.type}/use`, {
    method: 'POST',
  } );
}

// 复制活动
export async function copyActivity( obj ) {
  return request( `${activityService}/activity/info/copy`, {
    method: 'POST',
    body:obj
  } );
}

// 活动添加至模版
export async function addToTemplate( obj ) {
  return request( `${activityService}/activity/template/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取组件列表
export async function getComponentList( obj ) {
  return request( `${activityService}/activity/element`, {
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

// 获取直播列表
export async function getLiveList( obj ) {
  return request( `${xindaServive}/live/data`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取审核人员列表
export async function getExamineList( obj ) {
  return request( `${userService}/userManager/list/approver`, {
    method: 'GET',
    body: obj,
  } );
}

// // 修改期数
// export async function getActivityDraft( obj ) {
//   return request( `${activityService}/activity/info/next-periods`, {
//     method: 'POST',
//     body: obj,
//   } );
// }

// 查询未来版本
export async function getActivityDraft( obj ) {
  return request( `${activityService}/activity/info/draft`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增未来版本
export async function addActivityDraft( obj ) {
  return request( `${activityService}/activity/info/draft`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除未来版本
export async function deleteActivityDraft( obj ) {
  return request( `${activityService}/activity/info/draft/delete`, {
    method: 'GET',
    body: obj,
  } );
}

// 编辑未来版本
export async function editActivityDraft( obj ) {
  return request( `${activityService}/activity/info/draft/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取标签列表
export async function getTagList( obj ) {
  return request( `${activityService}/question-tags/page`, {
    method: 'GET',
    body: obj,
  } );
}


// 获取活动数据
export async function getElementDataType( obj ) {
  return request( `${activityService}/activity/element/dataType`, {
    method: 'GET',
    body: obj,
  } );
}

// 导入活动
export async function importActivity( obj ) {
  return request2( `${activityUploadService}/activity/info/import`, {
    method: 'POST',
    body: obj.file,
  }, 'JSON' );
}

export async function getActiveStatistics( obj ) {
  return request( `${activityService}/activity/info/status/statistics`, {
    method: 'GET',
    body: obj,
  } );
}


/**  活动对接权益中心 */

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

// 获取奖品库存统计
export async function getPrizeInventory( obj ) {
  return request( `${activityService}/activity/prize/inventory/statistics`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取权限对应角色列表
export async function getRoleGroupList( obj ) {
  return request( `${userService}/roleGroup/users`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取活动协作者列表
export async function getCollaborators( obj ) {
  return request( `${activityService}/collaborators`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取活动协作者列表
export async function getCurrentCollaborsInfo( obj ) {
  return request( `${activityService}/collaborators/get`, {
    method: 'GET',
    body: obj,
  } );
}
// 创建活动协作者
export async function addCollaborators( obj ) {
  return request( `${activityService}/collaborators/add`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除活动协作者
export async function deleteCollaborators( obj ) {
  return request( `${activityService}/collaborators/delete`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改活动协作者
export async function updateCollaborators( obj ) {
  return request( `${activityService}/collaborators/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 导入活动黑名单
export async function importActivityBlacklist( obj ) {
  return request( `${activityService}/activity/info/import/blacklist`, {
    method:'POST',
    body: obj.formData
  }, 'JSON' )
}

// 判断当前活动是否已存在黑名单
export async function isInBlacklist( obj ) {
  return request( `${activityService}/activity/info/has/blacklist`, {
    method:'POST',
    body: obj
  } )
}

// 删除已上传的黑名单
export async function deleteBlackList( obj ) {
  return request( `${activityService}/activity/info/delete/blacklist`, {
    method:'POST',
    body: obj
  } )
}

// 查询推送设置
export async function getPushSetting( obj ) {
  return request( `${activityService}/v3/activity/info/push-setting`, {
    method: 'GET',
    body: obj,
  } );
}

// 修改推送设置
export async function updatePushSetting( obj ) {
  return request( `${activityService}/v3/activity/info/push-setting/update`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

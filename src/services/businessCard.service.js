import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { statisticsService, businessService, openService } = serviceObj;

// 获取资源点评列表
export async function getResourceData( obj ) {
  return request( `${businessService}/banners/all`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取浏览量、收藏、转发数据
export async function getAmountData( obj ) {
  return request( `${businessService}/statistics/admin-chart-amount`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取排名数据
export async function getRankData( obj ) {
  return request( `${businessService}/statistics/admin-chart-rank`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取产品分析-资讯点评数据
export async function getNewsData( obj ) {
  return request( `${businessService}/statistics/news-review-statistics`, {
    method: 'GET',
    body: obj,
  } );
} 
// 获取产品分析-热点资讯
export async function getInformationData( obj ) {
  return request( `${businessService}/statistics/information-statistics`, {
    method: 'GET',
    body: obj,
  } );
}

// // 获取产品分析-投顾组合数据
// export async function getInvestCombinationData( obj ) {
//   return request( `${businessService}/statistics/combination-statistics`, {
//     method: 'GET',
//     body: obj,
//   } );
// }
// // 获取产品分析-投顾观点数据
// export async function getInvestViewData( obj ) {
//   return request( `${businessService}/statistics/invest-view-statistics`, {
//     method: 'GET',
//     body: obj,
//   } );
// }
// 获取产品分析-决策商城数据
export async function getMallData( obj ) {
  return request( `${businessService}/statistics/product-statistics`, {
    method: 'GET',
    body: obj,
  } );
}
//  获取资源点评模板运营位
export async function getModalData( obj ) {
  return request( `${businessService}/banners/tags/v2`, {
    method: 'GET',
    // body: obj,
  } );
}
// 获取数据分析-浏览量
export async function getViewPanel( obj ) {
  return request( `${businessService}/statistics/admin-panel-view`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取数据分析-转发量
export async function getSharePanel( obj ) {
  return request( `${businessService}/statistics/admin-panel-share`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取数据分析-收藏量
export async function getfavoritePanel( obj ) {
  return request( `${businessService}/statistics/admin-panel-favorite`, {
    method: 'GET',
    body: obj,
  } );
}
// 修改资源位列表
export async function editResourceData( obj ) {
  return request( `${businessService}/banners`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 添加资源位列表
export async function addResourceData( obj ) {
  return request( `${businessService}/banners`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除资源位列表
export async function deleteResourceData( obj ) {
  return request( `${businessService}/banners/${obj}`, {
    method: 'DELETE',
  } );
}


// 查询登录用户所属机构
export async function getMyOrgs( obj ) {
  return request( `${businessService}/investment/advisors/users/orgs`, {
    method: 'GET',
    body: obj,
  } );
}

// 查询员工列表
export async function getUserList( obj ) {
  return request( `${businessService}/investment/advisors`, {
    method: 'GET',
    body: obj,
  } );
}

// 员工信息列表统计
export async function getUserTotal( obj ) {
  return request( `${businessService}/investment/advisors/total`, {
    method: 'GET',
    body: obj,
  } );
}
// // 改变员工状态
// export async function changeUserState( obj ) {
//   return request( `${businessService}/investment/advisors`, {
//     method: 'PUT',
//     body:obj,
//   }, 'JSON'  );
// }

// // 删除员工
// export async function deleteUser( id ) {
//   return request( `${businessService}/investment/advisors/${id}`, {
//     method: 'DELETE',
//     // body: { id },
//   } );
// }
// 查询营业部分支信心
export async function getBrachList( obj ) {
  return request( `${businessService}/company/infos/branch`, {
    method: 'GET',
    body: obj,
  } );
}
// 添加员工
export async function addUser( obj ) {
  return request( `${businessService}/investment/advisors`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改员工信息
export async function updateUser( obj ) {
  return request( `${businessService}/investment/advisors`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 修改 PUT /app/{appid}
export async function exitAppData( obj ) {
  return request( `${statisticsService}/statistics/app/${obj.appid}`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 获取渠道列表
export async function getChannelData( obj ) {
  return request( `${statisticsService}/statistics/channel`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增 POST /channel
export async function addChannelData( obj ) {
  return request( `${statisticsService}/statistics/channel`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}


//  获资讯点评列表
export async function getCommentList( obj ) {
  return request( `${businessService}/news/reviews/list`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取点评详细信息
export async function getDetaillData( obj ) {
  return request( `${businessService}/news/reviews/details/${obj.id}`, {
    method: 'GET',
    // body: obj,
  } );
}

//  获取用户详情列表
export async function getUserPagesList( obj ) {
  return request( `${businessService}/news/reviews/list/details`, {
    method: 'GET',
    body: obj,
  } );
}

//  更新点评文章状态
export async function upDataComment( obj ) {
  return request( `${businessService}/news/reviews/update`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  获取用户分析图表数据
export async function getUserAnalysisData( obj ) {
  return request( `${openService}/wx-mini/getUserPortraitInfo`, {
    method: 'POST',
    body: obj,
  } );
}

// 获取员工数据排名列表
export async function getRankingData( obj ) {
  return request( `${businessService}/statistics/advisor-statistics`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取员工数据活跃度列表
export async function getLivenessData( obj ) {
  return request( `${businessService}/statistics/advisor-activity-statistics`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取员工名字列表
export async function getUserNameList( obj ) {
  return request( `${businessService}/statistics/advisor/fuzzy`, {
    method: 'GET',
    body: obj,
  } );
}

// 海报查询
export async function getPosterList( obj ){
  return request( `${businessService}/poster`, {
    method: 'GET',
    body: obj,
  } )
}

// 增加海报
export async function addPoster( obj ){
  return request( `${businessService}/poster`, {
    method: 'POST',
    body: obj,
  }, 'JSON' )
}

// 修改海报
export async function editPoster( obj ){
  return request( `${businessService}/poster`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' )
}

// 删除海报
export async function delPoster( obj ){
  return request( `${businessService}/poster`, {
    method: 'DELETE',
    body: obj,
  } )
}

// 获取海报分类列表
export async function getPosterTypeList( obj ){
  return request( `${businessService}/postertype`, {
    method: 'GET',
    body: obj,
  } )
}

// 获取全部海报分类列表
export async function getPosterTypeAllList( obj ){
  return request( `${businessService}/postertype/all`, {
    method: 'GET',
    body: obj,
  } )
}

// 增加海报分类
export async function addPosterTypeList( obj ){
  return request( `${businessService}/postertype`, {
    method: 'POST',
    body: obj,
  } )
}

// 修改海报分类
export async function editPosterTypeList( obj ){
  return request( `${businessService}/postertype`, {
    method: 'PUT',
    body: obj,
  } )
}

// 删除海报分类
export async function delPosterTypeList( obj ){
  return request( `${businessService}/postertype`, {
    method: 'DELETE',
    body: obj,
  } )
}

// 获取咨询管理列表
export async function getInformationsList( obj ) {
  return request( `${businessService}/informations`, {
    method: 'GET',
    body: obj,
  } );
}

//  编辑资源管理列表
export async function editInformationsData( obj ) {
  return request( `${businessService}/informations`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  添资讯管理列表
export async function addInformationsData( obj ){
  return request( `${businessService}/informations`, {
    method:'POST',
    body:obj
  }, 'JSON' )
}

// 删除资讯管理列表
export async function deleteInformations( obj ) {
  return request( `${businessService}/informations/${obj}`, {
    method: 'DELETE',
  } );
}

// 批量删除资讯管理列表
export async function delBatchInformations( obj ) {
  return request( `${businessService}/informations/batch`, {
    method: 'DELETE',
    body:obj
  }, 'JSON' );
}

//  获取分类列表 
export async function getCategoryList( obj ) {
  return request( `${businessService}/informations/categories`, {
    method: 'GET',
    body: obj,
  } );
}

//  编辑分类列表
export async function editCategoryData( obj ) {
  return request( `${businessService}/informations/categories`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  添加分类列表
export async function addCategoryData( obj ){
  return request( `${businessService}/informations/categories`, {
    method:'POST',
    body:obj
  }, 'JSON' )
}


// 删除类别列表
export async function deleteCategory( obj ) {
  return request( `${businessService}/informations/categories/${obj}`, {
    method: 'DELETE',
  } );
}


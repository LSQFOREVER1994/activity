/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 10:59:51
 * @LastEditTime: 2024-06-29 10:28:26
 * @LastEditors: zq636443 zq636443@163.com
 */
import request from '@/utils/request';
import serviceObj from  '@/services/serviceObj';

const { cropService, messageBoardService, openService, 
  userService, statisticsService, courseService, customGameService, articleService } = serviceObj;
// GET /users/shortInfo
export async function getBannerTags() {
  return request( `${cropService}/banners/tags/v2`, {
    method: 'GET',
  } );
}

export async function getBanners( obj ) {
  return request( `${cropService}/banners/all`, {
    method: 'GET',
    body: obj,
  } );
}

// 新增 POST /banners
export async function addBanners( obj ) {
  return request( `${cropService}/banners`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改 PUT /banners/{id}
export async function exitBanners( obj ) {
  return request( `${cropService}/banners/${obj.id}`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 删除 DELETE /banners/{id}
export async function delBanners( id ) {
  return request( `${cropService}/banners/${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}

export async function getMessageTypes() {
  return request( `${messageBoardService}/message/types`, {
    method: 'GET',
    body: {
      pageNum: 1,
      pageSize: 10000,
    },
  } );
}

export async function getMessage( obj ) {
  return request( `${messageBoardService}/message`, {
    method: 'GET',
    body: obj,
  } );
}

//  活动列表
export async function getActivityList( obj ) {
  return request( `${cropService}/activities`, {
    method: 'GET',
    body: obj,
  } );
}

// // 新增活动
// export async function addActivity( obj ) {
//   return request( `${cropService}/activities`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

// // 新增活动
// export async function updateActivity( obj ) {
//   return request( `${cropService}/activities`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// // 删除活动
// export async function delActivity( obj ) {
  
//   return request( `${cropService}/activities/${obj.id}`, {
//     method: 'DELETE',
//     body: obj,
//   } );
// }



// //  签到活动详情
// export async function getSignActivityDetail( id ) {
//   return request( `${cropService}/activities/sign/${id}`, {
//     method: 'GET',
//     body: { id },
//   } );
// }

// // 新增签到活动
// export async function addSignActivity( obj ) {
//   return request( `${cropService}/activities/sign/activity`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

// // 修改签到活动
// export async function updateSignActivity( obj ) {
//   return request( `${cropService}/activities/sign`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// 删除签到活动
export async function delSignActivity( id ) {
  return request( `${cropService}/activities/sign/${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}
// //  签到累计积分详情
// export async function getIntegralActivityDetail( id ) {
//   return request( `${cropService}/activities/integral/${id}`, {
//     method: 'GET',
//     body: { id },
//   } );
// }
// // 新增累计积分活动
// export async function addIntegralActivity( obj ) {
//   return request( `${cropService}/activities/integral`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

// // 修改累计积分活动
// export async function updateIntegralActivity( obj ) {
//   return request( `${cropService}/activities/integral`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// 删除累计积分活动
export async function delIntegralActivity( id ) {
  return request( `${cropService}/activities/integral/${id}`, {
    method: 'DELETE',
    body: { id },
  } );
}



// //  活动参与情况
// export async function getActivitySituation( obj ) {
//   return request( `${cropService}/activities/users`, {
//     method: 'GET',
//     body: obj,
//   } );
// }

// //  获取优惠券
// export async function getCouponList( obj ) {
//   return request( `${strategyMallService}/coupons`, {
//     method: 'GET',
//     body: obj,
//   } );
// }

// 获取历史战绩列表
export async function getHistoryGainsData( obj ){
  return request( `${cropService}/histories/category`, {
    method: 'GET',
    body: obj,
  } );
}

// 删除历史战绩
export async function DeleteHistoryGains( obj ) {
  return request( `${cropService}/histories/category/${obj.id}`, {
    method: 'DELETE',
  } );
}
// 添加历史战绩分组
export async function AddHistoryCategory( obj ) {
  return request( `${cropService}/histories/category`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改历史战绩分组
export async function editHistoryCategory( obj ) {
  return request( `${cropService}/histories/category/${obj.id}`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 添加历史战绩期间
export async function addHistoryGainPeriod( obj ){
  return request( `${cropService}/histories/period`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}



//  获取战绩数据列表
export async function getHistoryGainsPeriod( obj ){
  return request( `${cropService}/histories/period`, {
    method: 'GET',
    body: obj,
  } );
}

//  获取战绩详情列表
export async function getRecordDetailsList( obj ){
  return request( `${cropService}/histories/detail/showing`, {
    method: 'GET',
    body:obj,
  } );
}



// 获取
export async function getHistoryCategoryDetail( obj ){
  return request( `${cropService}/histories/category/detail/${obj.id}`, {
    method: 'GET',
    body: obj,
  } );
}

export async function editHistoryGainPeriod( obj ){
  return request( `${cropService}/histories/period`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 删除历史战绩周期
export async function deleteHistoryGainPeriod( obj ){
  return request( `${cropService}/histories/period/${obj.id}`, {
    method: 'DELETE',
  } );
}

// 获取仿真购买记录列表
export async function getPurchasesRecordData( obj ){
  return request( `${cropService}/purchases/records/template`, {
    method: 'GET',
    body: obj,
  } );
}
// // 获取抽奖活动列表
// export async function getPrizeData( obj ){
//   return request( `${cropService}/prizes`, {
//     method: 'GET',
//     body: obj,
//   } );
// }
// 获取未绑定的任务组活动
export async function getTaskActivity( obj ){
  return request( `${cropService}/base/activities/task/unbound`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取所有奖品
export async function getAllPrizeList( obj ){
  return request( `${openService}/merchants/sku`, {
    method: 'GET',
    body: obj,
  } );
}
//  根据ID 获取单个奖品 
export async function getSinglePrizeList( obj ){
  return request( `${openService}/merchants/sku/detail/${obj.id}`, {
    method: 'GET',
    body: obj,
  } );
}

// 奖品补发
export async function editAwardReissue( obj ){
  return request( `${cropService}/awardrecords/reissue`, {
    method: 'PUT',
    body: obj,
  } );
}

// 获取中奖纪录
export async function getAwardrecords( obj ){
  return request( `${cropService}/awardrecords`, {
    method: 'GET',
    body: obj,
  } );
}
// 获取指定任务列表
export async function getAppointTaskList( obj ){
  return request( `${cropService}/assignment`, {
    method: 'GET',
    body: obj,
  } );
}

// 删除历史战绩周期
export async function deletePurchasesRecord( obj ) {
  return request( `${cropService}/purchases/records/template/${obj.id}`, {
    method: 'DELETE',
  } );
}
// 删除指定任务
export async function deleteAppointTask( obj ) {
  return request( `${cropService}/assignment/${obj.id}`, {
    method: 'DELETE',
  } );
}

// 添加仿真购买记录
export async function addRecordTemplate( obj ) {
  return request( `${cropService}/purchases/records/template`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改仿真购买记录
export async function editRecordTemplate( obj ) {
  return request( `${cropService}/purchases/records/template`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 获取落地介绍页列表
export async function getLandingPageData( obj ) {
  return request( `${cropService}/landingpage`, {
    method: 'GET',
    body: obj,
  } );
}

// 删除落地介绍页
export async function deleteLandingPage( obj ){
  return request( `${cropService}/landingpage/${obj.id}`, {
    method: 'DELETE',
  } );
}

// 添加落地介绍页
export async function addLandingPage( obj ) {
  return request( `${cropService}/landingpage`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 修改落地介绍页
export async function editLandingPage( obj ) {
  return request( `${cropService}/landingpage`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// // 删除抽奖活动列表
// export async function deletePrizeData( obj ) {
//   return request( `${cropService}/prizes/${obj.id}`, {
//     method: 'DELETE',
//   } );
// }

// 添加抽奖活动列表
// export async function addPrizeData( obj ) {
//   return request( `${cropService}/prizes`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }
// 获取活动落地页列表
export async function getActivityTemplateList( obj ) {
  return request( `${cropService}/landings`, {
    method: 'GET',
    body: obj,
  } );
}

// 修改活动落地页
export async function editActivityTemplate( obj ) {
  return request( `${cropService}/landings`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 添加活动落地页
export async function addActivityTemplate( obj ) {
  return request( `${cropService}/landings`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 删除活动落地页
export async function deleteActivesTemplate( obj ) {
  return request( `${cropService}/landings/${obj.id}`, {
    method: 'DELETE',
  } );
}

// 获取平台对接列表
export async function getPlatformListAll( obj ) {
  return request( `${openService}/merchants`, {
    method: 'GET',
    body: obj,
} );
}

//  获取对接功能列表
export async function getDockingList( obj ) {
  return request( `${openService}/merchants/spu`, {
    method: 'GET',
    body: obj,
  } );
}

//  获取奖品管理列表
export async function getPrizeList( obj ) {
  return request( `${openService}/merchants/sku`, {
    method: 'GET',
    body: obj,
  } );
}
//  添加奖品
export async function addPrize( obj ) {
  return request( `${openService}/merchants/sku`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 编辑奖品
export async function updatePrize( obj ) {
  return request( `${openService}/merchants/sku`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
// 修改抽奖活动列表
// export async function editPrizeData( obj ) {
//   return request( `${cropService}/prizes`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

//  删除奖品
export async function delPrize( id ) {
  return request( `${openService}/merchants/sku/${id}`, {
    method: 'DELETE',
    body:{ id },
  } );
}


//  获取活动列表
export async function getActiveOrder( obj ) {
  return request( `${cropService}/orders`, {
    method: 'GET',
    body: obj
  } );
}

// 获取活动统计数据
export async function getActiveOrderAmounts( obj ) {
  return request( `${cropService}/orders/amounts`, {
    method: 'GET',
    body: obj
  } );
}
    
// // 获取秒杀活动列表
// export async function getSecondKillData( obj ){
//   return request( `${cropService}/flash/sales`, {
//     method: 'GET',
//     body: obj,
//   } );
// }

// 修改秒杀活动列表
export async function editSecondKillData( obj ) {
  return request( `${cropService}/flash/sales`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// // 删除秒杀活动列表
// export async function deleteSecondKillData( obj ) {
//   return request( `${cropService}/flash/sales/${obj.id}`, {
//     method: 'DELETE',
//   } );
// }

// 添加秒杀活动列表
export async function addSecondKillData( obj ) {
  return request( `${cropService}/flash/sales`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 获取秒杀活动-秒杀设置列表
export async function getFlashSaleSpecsList( obj ){
  return request( `${cropService}/flash/sales/${obj.id}/products`, {
    method: 'GET',
    // body: obj,
  } );
}

// // 获取集卡活动列表
// export async function getCollectCardsData( obj ){
//   return request( `${cropService}/base/activities`, {
//     method: 'GET',
//     body: obj,
//   } );
// }

// 修改抢券活动列表
export async function editGrabCouponData( obj ) {
  return request( `${cropService}/receives`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// // 删除抢券活动列表
// export async function deleteGrabCouponData( obj ) {
//   return request( `${cropService}/receives/${obj.id}`, {
//     method: 'DELETE',
//   } );
// }

// 添加抢券活动列表
export async function addGrabCouponData( obj ) {
  return request( `${cropService}/receives`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 修改下单有礼活动列表
export async function editOrderGiftData( obj ) {
  return request( `${cropService}/orders/prizes`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// // 删除下单有礼活动列表
// export async function deleteOrderGiftData( obj ) {
//   return request( `${cropService}/orders/prizes/${obj.id}`, {
//     method: 'DELETE',
//   } );
// }

// 添加下单有礼活动列表
export async function addOrderGiftData( obj ) {
  return request( `${cropService}/orders/prizes`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// // 获取下单有礼活动-活动设置列表
// export async function getOrderGiftSpecsList( obj ){
//   return request( `${cropService}/orders/prizes/cms/${obj.id}`, {
//     method: 'GET',
//     // body: obj,
//   } );
// }
// // 修改抽签活动列表
// export async function editDrawLotsData( obj ) {
//   return request( `${cropService}/draws/lots`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// 删除抽签活动列表
// export async function deleteDrawLotsData( obj ) {
//   return request( `${cropService}/draws/lots/${obj.id}`, {
//     method: 'DELETE',
//   } );
// }


// // 添加抽签活动列表
// export async function addDrawLotsData( obj ) {
//   return request( `${cropService}/draws/lots`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

// // 获取抽签活动-活动设置列表
// export async function getDrawLotsSpecsList( obj ){
//   return request( `${cropService}/draws/lots/cms/${obj.id}`, {
//     method: 'GET',
//     // body: obj,
//   } );
// }

// 获取抢券活动-抢券设置列表
export async function getGrabCouponSpecsList( obj ){
  return request( `${cropService}/receives/prizes/${obj.id}`, {
    method: 'GET',
    // body: obj,
  } );
}
// 获取大转盘刮刮奖活动-奖品设置列表
// export async function getPrizeDetailSpecsList( obj ){
//   return request( `${cropService}/prizes/cms/${obj.id}`, {
//     method: 'GET',
//     // body: obj,
//   } );
// }
// 获取活动关联的小程序分享数据
export async function getMiniShareData( obj ){
  return request( `${openService}/wx/applets/shares/details/${obj.id}`, {
    method: 'GET',
    // body: obj,
  } );
}

// 根据活动id查找集卡活动基本信息
export async function getCollectCouponSpecs( obj ){
  return request( `${cropService}/collect/activities/cms/${obj.id}`, {
    method: 'GET',
    // body: obj,
  } );
}

// 根据活动id查找集卡活动卡牌信息
export async function getAllCardList( obj ){
  return request( `${cropService}/collect/activities/${obj.id}/cards`, {
    method: 'GET',
    body: obj,
  } );
}

// 根据活动id查找集卡活动任务信息
export async function getAllAppointList( obj ){
  return request( `${cropService}/collect/activities/${obj.id}/tasks`, {
    method: 'GET',
    // body: obj,
  } );
}
// 根据任务组ID获取任务
export async function getTaskTemplateList( obj ){
  return request( `${cropService}/assignment/${obj.id}/tasks`, {
    method: 'GET',
    // body: obj,
  } );
}
export async function getCollectTaskList(  ){
  return request( `${cropService}/assignment/unbound`, {
    method: 'GET',
    // body: obj,
  } );
}
// // 查询商品与套餐列表(tree)
// export async function getgoodsSpecs( obj ) {
//   return request( `${strategyMallService}/products/specs`, {
//     method: 'GET',
//     body: obj,
//   } );
// }
// // 获口令活动列表
// export async function getPasswordActivity( obj ){
//   return request( `${cropService}/base/activities`, {
//     method: 'GET',
//     body: obj,
//   } );
// }


// 根据活动id查找集卡活动奖品信息
export async function getPrizeListAll( obj ){
  return request( `${cropService}/collect/activities/${obj.id}/prizes`, {
    method: 'GET',
    // body: obj,
  } );
}

//  修改集卡活动 
export async function editColletCards( obj ) {
  return request( `${cropService}/collect/activities`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}
//  修改集卡活动 
export async function editAppointTask( obj ) {
  return request( `${cropService}/assignment`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 修改口令活动
export async function editPasswordActivity( obj ) {
  return request( `${cropService}/passwords/activities`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  添加集卡活动
export async function addColletCards( obj ) {
  return request( `${cropService}/collect/activities`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
//  添加指定任务
export async function addAppointTask( obj ) {
  return request( `${cropService}/assignment`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}
// 添加口令活动
export async function addPasswordActivity( obj ){
  return request( `${cropService}/passwords/activities`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}


//  删除集卡活动
export async function deleteCollectCards( id ) {
  return request( `${cropService}/collect/activities/${id}`, {
    method: 'DELETE',
  } );
}
// // 删除口令活动
// export async function deletePasswordActivity( obj ) {
//   return request( `${cropService}/passwords/activities/${obj.id}`, {
//     method: 'DELETE',
//   } );
// }

// 获取口令活动奖品列表
export async function getPasswordPrize( obj ){
  return request( `${cropService}/passwords/activities/cms/${obj.id}`, {
    method: 'GET',
    // body: obj,
  } );
}

//  获取审核流程列表
export async function getAuditProcessList( obj ){
  return request( `${userService}/oa/review`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取模板消息列表
export async function getTemplateMessageData( obj ){
  return request( `${openService}/accounts/templates`, {
    method: 'GET',
    body: obj,
  } );
}

// 切换审核流程
export async function auditProcessType( obj ){
  return request( `${userService}/oa/${obj.id}/review/?state=${obj.state}`, {
    method: 'GET',
    body: obj,
  } );
}

export async function getWxAccessToken( obj ){
  return request( `${openService}/official/accounts/access_token`, {
    method: 'GET',
    body: obj,
  } );
}
export async function getWxTemplateList( obj ){
  return request( `${openService}/accounts/templates/private`, {
    method: 'GET',
    body: obj,
  } );
}
export async function getWxTagList( obj ){
  return request( `${openService}/accounts/templates/tags`, {
    method: 'GET',
    body: obj,
  } );
}

// 修改模板消息
export async function editTemplateMessageData( obj ) {
  return request( `${openService}/accounts/templates`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 添加模板消息
export async function addTemplateMessageData( obj ){
  return request( `${openService}/accounts/templates`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 删除模板消息列表
export async function deleteTemplateMessageData( obj ) {
  return request( `${openService}/accounts/templates/${obj.id}`, {
    method: 'DELETE',
  } );
}
// 推送微信模板消息
export async function postWxMessage( obj ){
  return request( `${openService}/accounts/templates/push?accessToken=${obj.accessToken}&id=${obj.id}`, {
    method: 'POST',
    body: obj,
  },  );
}

// 获取全部活动列表
export async function getAllActivityList( obj ) {
  return request( `${cropService}/base/activities`, {
    method: 'GET',
    body: obj,
  } );
}

// 获取活动对应的点击人数
export async function getAppidList( obj ) {
  return request( `${statisticsService}/statistics/app/totalUv?appIds=${obj}`, {
    method: 'GET',
    // body: obj,
  } );
}

//  获取各个活动状态数量
export async function getActivityStateNum( obj ) {
  return request( `${cropService}/base/activities/state/count`, {
    method: 'GET',
    // body: obj,
  } );
}

// 删除活动
export async function deleteActivityData( id ) {
  return request( `${cropService}/base/activities/${id}`, {
    method: 'DELETE',
  } );
}

// 根据id获取答题活动信息  
export async function getAnswerSpecsObj( obj ){
  return request( `${cropService}/base/activities/${obj.id}`, {
    method: 'GET',
    // body: obj,
  } );
}

// 根据id获取答题活动题库数据 
export async function getQuestionsObj( obj ){
  return request( `${courseService}/questions/packages/${obj.packageId}`, {
    method: 'GET',
    // body: obj,
  } );
}

//  获取所有题目
export async function getAllSubjects( obj ) {
  return request( `${courseService}/questions/search`, {
    method: 'GET',
    body: obj
  } );
}

//  获取标签列表
export async function getAllTagsList( obj ) {
  return request( `${courseService}/tags`, {
    method: 'GET',
    body: obj
  } );
}

//  编辑答题活动题目 
export async function exitQuestions( obj ) {
  return request( `${courseService}/questions/package`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  添加答题活动题目 
export async function addQuestions( obj ) {
  return request( `${courseService}/questions/package`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// //  编辑答题活动基本信息
// export async function exitAnswerData( obj ) {
//   return request( `${cropService}/answer`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// //  添加答题活动基本信息
// export async function addAnswerData( obj ) {
//   return request( `${cropService}/answer`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }


// 通过题目名字获取对应题目
export async function getTagsSubjectList( obj ) {
  return request( `${courseService}/questions`, {
    method: 'GET',
    body: obj
  } );
}

// //  根据id获取红包雨活动信息
// export async function getRedRainData( obj ){
//   return request( `${cropService}/base/activities/${obj.id}`, {
//     method: 'GET',
//     // body: obj,
//   } );
// }

// //  编辑红包雨活动
// export async function exitRedRain( obj ) {
//   return request( `${cropService}/base/activities`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// //  添加红包雨活动
// export async function addRedRain( obj ) {
//   return request( `${cropService}/base/activities`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

// // 猜涨跌 - 查找
// export async function getGuessGame( obj ) {
//   return request( `${cropService}/base/activities/${obj.id}`, {
//     method: 'GET',
//     // body: obj,
//   }, 'JSON' );
// }

// // 猜涨跌 - 删除
// export async function delGuessGame( obj ) {
//   return request( `${cropService}/base/activities/${obj.id}`, {
//     method: 'DELETE',
//     // body: obj,
//   }, 'JSON' );
// }

// // 猜涨跌 - 新增
// export async function addGuessGame( obj ) {
//   return request( `${cropService}/base/activities`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

// // 猜涨跌 - 编辑
// export async function editGuessGame( obj ) {
//   return request( `${cropService}/base/activities`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// // 根据id获取随机卡活动信息
// export async function getRandomCardData( obj ){
//   return request( `${cropService}/base/activities/${obj.id}`, {
//     method: 'GET',
//     // body: obj,
//   } );
// }

// //  编辑随机卡活动
// export async function exitRandomCard( obj ) {
//   return request( `${cropService}/base/activities`, {
//     method: 'PUT',
//     body: obj,
//   }, 'JSON' );
// }

// 猜涨跌 - 查找指定奖品列表 
export async function getGuessPrices( obj ) {
  return request( `${cropService}/base/prizes/${obj.id}/prizes`, {
    method: 'GET',
    // body: obj,
  }, 'JSON' );
}

// 猜涨跌 - 获取指定猜涨跌积分  
export async function getGuessIntegral( obj ) {
  return request( `${customGameService}/guessgame/name/${obj.platFormName}`, {
    method: 'GET',
    // body: obj,
  } );
}

// 猜涨跌 - 编辑指定猜涨跌积分
export async function editGuessIntegral( obj ) {
  return request( `${customGameService}/guessgame`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

// 猜涨跌 - 新增指定猜涨跌积分
export async function addGuessIntegral( obj ) {
  return request( `${customGameService}/guessgame`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 猜涨跌 - 一键发奖
export async function sendPrizes( obj ) {
  return request( `${cropService}/base/prizes/universal/send/prize/batch`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

// 猜涨跌 - 发奖一键通知G
export async function sendGuessMsg( obj ) {
  return request( `${customGameService}/guessgame/message/batch`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}


// // 添加随机卡活动
// export async function addRandomCard( obj ){
//   return request( `${cropService}/base/activities`, {
//     method: 'POST',
//     body: obj,
//   }, 'JSON' );
// }

//  获取账户平台列表
export async function getAccountList( obj ) {
  return request( `${openService}/funds/platformFundsList`, {
    method: 'GET',
    body: obj
  } );
}

//  添加平台账户
export async function addAccount( obj ) {
  return request( `${openService}/funds/init?merchantId=${obj.merchantId}`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  平台资金充值
export async function addPayCapital( obj ) {
  return request( `${openService}/funds/pay`, {
    method: 'PATCH',
    body: obj,
  } );
}

//  平台资金退回
export async function balanceMoney( obj ) {
  return request( `${openService}/funds/backtrack`, {
    method: 'PATCH',
    body: obj,
  } );
}

// 锁定平台
export async function lockMoney( obj ) {
  return request( `${openService}/funds/account`, {
    method: 'PATCH',
    body: obj,
  } );
}

//  获取平台资金详情列表
export async function getAccountDetailsList( obj ) {
  return request( `${openService}/funds/order/`, {
    method: 'GET',
    body: obj
  } );
}

// 获取账户总详情
export async function getAllAccountData( obj ) {
  return request( `${openService}/funds/info`, {
    method: 'GET',
    body: obj
  } );
}


//  根据活动ID获取活动信息
export async function getActivityData( obj ){
  return request( `${cropService}/base/activities/${obj.id}`, {
    method: 'GET',
  } );
}

// 编辑活动
export async function editActivityData( obj ) {
  return request( `${cropService}/base/activities`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  添加活动
export async function addActivityData( obj ) {
  return request( `${cropService}/base/activities`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

//  删除活动
export async function delActivityData( obj ) {
  return request( `${cropService}/base/activities/${obj.id}`, {
    method: 'DELETE',
  }, 'JSON' );
}

//  获取文章列表
export async function getPaperList( obj ) {
  return request( `${articleService}/news`, {
    method: 'GET',
    body: obj
  } );
}

//  编辑文章
export async function editPaper( obj ) {
  return request( `${articleService}/news`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  添加文章
export async function addPaper( obj ) {
  return request( `${articleService}/news`, {
    method: 'POST',
    body: obj,
  }, 'JSON' );
}

//  删除文章
export async function delPaper( obj ) {
  return request( `${articleService}/news/${obj.id}`, {
    method: 'DELETE',
  }, 'JSON' );
}

//  文章审核 
export async function goAudit( obj ) {
  return request( `${articleService}/news/audits`, {
    method: 'PUT',
    body: obj,
  }, 'JSON' );
}

//  获取审核列表 
export async function getAuditList( obj ) {
  return request( `${articleService}/news/audit`, {
    method: 'GET',
    body: obj
  } );
}
//  获取审核记录列表
export async function getRecordList( obj ) {
  return request( `${articleService}/news/audits`, {
    method: 'GET',
    body: obj
  } );
}

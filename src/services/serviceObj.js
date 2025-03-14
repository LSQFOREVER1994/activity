/*
 * @Author: RidingWind
 * @Date: 2019-03-23 10:55:17
 * @Last Modified by: 绩牛信息 - YANGJINGRONG
 * @Last Modified time: 2024-03-21 13:50:05
*/
/* eslint-disable import/no-mutable-exports */

/*
 * 环境变量说明
 * 变量名 BUILD_ENV
 * 变量值 dev、uat、pro
*/
const apiObj = {
  dev:'http://192.168.137.50:8088',
  pro:'https://api-hd.jiniutech.com',
  uat:'http://hd-uat.jiniutech.com',
}
const BASE_API = window.BASEURL || apiObj[BUILD_ENV];

const activityUrlObj = {
  dev:'http://www.jiniutech.com/test/activities',
  pro:'https://m.jiniutech.com/hd',
  uat:'http://www.jiniutech.com/test/activities', // TODO: 预览地址暂时填测试的
}
const activityUrl = window.ACTIVITYURL || activityUrlObj[BUILD_ENV];  // 1.0 和 2.0 C端域名

// 默认图片地址配置
const defaultImagePath = 'https://media.jiniutech.com/yunying/2_default/';


// const services = require( '../../config/package/variables' ).variables

// const serviceObj = {}
// const servicePathsObj = {
//   userService:'/user-service',
//   statisticsService:'/statistics-service',
//   activityService:'/activity-service',
//   libraryService:'/file-service',
//   equityCenterService:'/right-service',
// }

// services.forEach( item => {
//   if( item.key ){
//     serviceObj[item.key] =`${item.default}${servicePathsObj[item.key] || ''}`
//   }
// } )

// ---------------------------------信达请求地址配置---------------------------------


const fileUploadObj = {
  dev:'http://192.168.129.56:8080',
  pro:'http://172.23.49.84:8088'
}

const activityUploadObj = {
  dev:'http://192.168.129.53:8080',
  pro:'http://172.23.49.84:8088'
}

const rightUploadObj = {
  dev:'http://192.168.129.55:8080',
  pro:'http://172.23.49.84:8088'
}

const userUploadObj = {
  dev:'http://192.168.129.54:8080',
  pro:'http://172.23.49.84:8088'
}

const userServiceUrlObj = {
  dev:'http://b4fo6yxqgfc8n9km.apigateway.antdev.xdcloud.com:8088',
  pro:'http://wlhgqki2lstri8qz.apigateway.ant.res.xdhfcloud.com:80'
}

const statisticsServiceUrlObj = {
  dev:'http://hop6xb1r9s2a8req.apigateway.antdev.xdcloud.com:8088',
  pro:'http://yhe2gpnyfz1d1xld.apigateway.ant.res.xdhfcloud.com:80'
}

const activityServiceUrlObj = {
  dev:'http://dlww2jfxo18k83o6.apigateway.antdev.xdcloud.com:8088',
  pro:'http://z2gcrqccsnkttgle.apigateway.ant.res.xdhfcloud.com:80'
}

const libraryServiceUrlObj = {
  dev:'http://7q8skcf1kelp6zpo.apigateway.antdev.xdcloud.com:8088',
  pro:'http://sdwkbigclacmwsaw.apigateway.ant.res.xdhfcloud.com:80'
}

const equityCenterService = {
  dev:'http://oezspffnlmikunij.apigateway.antdev.xdcloud.com:8088',
  pro:'http://mnpjvnd1brtiw8od.apigateway.ant.res.xdhfcloud.com:80'
}

const xindaServive = {
  dev:'http://kwuhdb0ru8njw3rm.apigateway.antdev.xdcloud.com:8088',
  pro:'http://i3jpowayodsqh6ab.apigateway.ant.res.xdhfcloud.com:80' 
}





export default {
  
  userService: `${userServiceUrlObj[BUILD_ENV]}/user-service`,
  statisticsService: `${statisticsServiceUrlObj[BUILD_ENV]}/statistics-service`,
  activityService: `${activityServiceUrlObj[BUILD_ENV]}/activity-service`,
  libraryService: `${libraryServiceUrlObj[BUILD_ENV]}/file-service`,
  equityCenterService: `${equityCenterService[BUILD_ENV]}/right-service`, // 权益中心服务
  xindaServive:`${xindaServive[BUILD_ENV]}/xinda-service`, // 信达服务
  fileUploadService: fileUploadObj[BUILD_ENV], // 信达素材库文件上传
  activityUploadService:activityUploadObj[BUILD_ENV], // 信达活动文件上传
  rightUploadService:rightUploadObj[BUILD_ENV], // 权益文件上传
  userUploadService:userUploadObj[BUILD_ENV], // 用户文件上传

  // ...serviceObj,
  kanpanService: `${BASE_API}/kanpan-service`,
  stockSchoolService: `${BASE_API}/stock-school-service`,
  stockWikiService: `${BASE_API}/stock-wiki-service`,
  cropService: `${BASE_API}/crop-service`,
  logService: `${BASE_API}/log-service`,
  dataService: `${BASE_API}/data-service`,
  bbsService: `${BASE_API}/bbs-service`,
  filterService: `${BASE_API}/filter-service`,
  strategyMallService: `${BASE_API}/strategy-mall-service`,
  messageBoardService: `${BASE_API}/crop-service`,
  courseService: `${BASE_API}/course-service`,
  loopbackService: `${BASE_API}/loopback-service`,
  openService: `${BASE_API}/open-service`,
  businessService: `${BASE_API}/business-card-service`,
  accountService: `${BASE_API}/virtual-account-service`,
  taskService: `${BASE_API}/task-service`,
  customGameService: `${BASE_API}/custom-game-service`, // 定制游戏服务
  watermelonService: `${BASE_API}/crop-service`, // 大西瓜游戏服务
  articleService: `${BASE_API}/article-service`, // 定制游戏服务
  activityTemplateUrl: `${activityUrl}/placard/`, // 活动模版连接的地址
  activityBigWheelUrl: `${activityUrl}/spin/index.html`, // 大转盘前端地址
  activityScratchCardUrl: `${activityUrl}/scratch-card/index.html`, // 刮刮卡前端地址
  activitySeckillUrl: `${activityUrl}/spike/index.html`, // 秒杀活动前端地址
  activityGrabCouponUrl: `${activityUrl}/grab-coupon/index.html`, // 抢券活动前端地址
  activityPasswordUrl: `${activityUrl}/countersign/index.html`, // 口令活动前端地址
  activityDrawUrl: `${activityUrl}/draw-activity/index.html`, // 抽签前端地址
  activityGleanCardUrl: `${activityUrl}/glean-card/index.html`, // 集卡前端地址
  sharePasswordUrl: `${activityUrl}/get-qrcode/#/`, // 兑换码前端地址
  activityEggsUrl: `${activityUrl}/eggs/index.html`, // 砸金蛋活动前端地址
  activityKLineArenaUrl: `${activityUrl}/k-game-v2/index.html`, // 角斗场活动地址
  guessMarketUrl: `${activityUrl}/guess-market/index.html`, // 猜涨跌活动地址
  activityRandomCardUrl: `${activityUrl}/random-card/index.html`, // 随机卡前端地址
  prizeClawUrl: `${activityUrl}/prizeClaw/index.html`, // 抓娃娃前端地址
  answerUrl: `${activityUrl}/answer/index.html`, // 答题活动地址
  barrageUrl: `${activityUrl}/barrage/index.html`, // 弹幕活动地址
  questionnaireUrl: `${activityUrl}/questionnaire/index.html`, // 问卷活动地址
  activityRedRainUrl: `${activityUrl}/gift-rain/index.html`, // 红包雨活动地址
  answerCompetitionUrl: `${activityUrl}/answer-competition/index.html`, // 吃鸡答题活动地址
  fundCollisionUrl: `${activityUrl}/fund-battle/#/`, // 基金对对碰前端地址
  bigWatermelonUrl: `${activityUrl}/big-watermelon/index.html`, // 合成大西瓜前端地址
  activityTemplateObj: 'https://media.jiniutech.com/yunying/',  // 活动模板数据获取地址
  historyUrl: 'https://media.jiniutech.com/一周战绩导入模板.xlsx', // 历史战绩模板下载地址
  subjectUrl: 'https://media.jiniutech.com/答题活动导入模板2.xlsx', // 题目模板下载地址
  VritualUrl: 'https://media.jiniutech.com/卡密导入模板.xlsx', // 卡密导入模板
  paperUrl: 'http://discover.test.jiniutech.cn/mogul-viewpoint/index.html#/detail', // 文章地址
  activityBeesUrl: `${activityUrl}/bees/index.html`, // 活动2.0模板地址
  defaultImagePath,
  pointsService: `${BASE_API}/points-mall-service`, // 新版积分商城
  jfService: `${BASE_API}/jf-mall-service`,  // 积分商城
};

import { getUrlParameter } from '@/utils/utils';
// use localStorage to store the authority info, which might be sent from server in actual project.
const AUTHORITYOBJ = {
  DATA_PORTFOLIO_MODIFY: '每月投资组合',
  stock_wiki: '股票百科',
  KANPAN_CONFIG_GET: '看盘配置',
  TAG_GET: '股民学堂标签管理',
  BANNER_GET: '股民学堂轮播图管理',
  RESOURCE_GET: '股民学堂资源管理',
  INTEREST: '股民学堂投顾问答管理',
  'crop-service:article:get:article': '公司官网文章',
  CROP_TAG_POST: '公司官网文章标签',
  // 'crop-service:activity:get:activity':'活动列表',
  CROP_PRODUCT_ALL_GET: '公司官网产品矩阵',
  LOG_IP_GET: '日志分析独立ip监控',
  LOG_GROUP_API_GET: '日志分析分组访问量监控',
  LOG_CODE_GET: '日志分析股票访问量监控',
  LOG_AGENT_GET: '日志分析客户端访问量监控',
  LOG_API_GET: '日志分析api访问量监控',
  LOG_GROUP_GET: '日志分析Api分组',


  MALL_PRODUCT_GET_DETAIL: '获取商品详情',
  MALL_SPECS_GET: '查询商品规格',
  MALL_DASHBOARD_STATISTIC: '决策商城统计接口权限',
  QUERY_CONFIG_GET: '条件选股查看搜索配置',
  STOCK_CONDITION_GET: '条件选股查看搜索条件',

  // 首页（营销概览）
  MARKETING_OVERVIEW_GET: '营销概览',

  // 数据运营
  BURY_POINT_STATISTICS_GET: '埋点统计',
  STATISTICS_APP_GET: '埋点统计数据',

  // 系统管理
  USER_LIST_GET: '系统管理用户列表',
  ROLE_LIST_GET: '系统管理角色列表',
  PERMISSION_LIST_GET: '系统管理权限列表',
  OPERATION_RECORD_GET: '系统管理操作记录',
  DEVELOPMENT_CONFIGURATION_GET: '系统管理开发配置',

  // 系统管理 -> 权限组
  PERMISSION_GROUP_GET: '权限组-查看',
  PERMISSION_GROUP_POST: '权限组-新增',
  PERMISSION_GROUP_PUT: '权限组-修改',
  PERMISSION_GROUP_DELETE: '权限组-删除',
};

// 活动营销权限
const activityAuth = {
  TEMPLATE_MANAGEMENT_GET: '活动模板管理',
  ACTIVITY_LIST_GET: '活动列表',
  COMPONENT_QUERY_GET: '组件查询',
  WINNER_LIST_GET: '中奖名单',
  REISSUE_LIST: '奖励补发',
  MATERIAL_LIBRARY_GET: '素材库',
  TOPIC_PK_LIST_GET: '话题PK列表',
  AUDIT_MANAGEMENT_GET: '审核管理',
  QUESTION_BANK_MANAGEMENT_GET: '题库管理',
  USER_PARTICIPATION_RECORD_GET: '用户参与记录',
  MICROPAGE_GET: 'EDM',
  POSTER_MANAGEMENT_GET: '易企秀海报',
  JUMP_CONFIG_GET: '权限配置',

  // 协作管理（活动列表）-> 权限组
  COLLABORATOR_ADMIN: '协作管理',
  // 模板管理（活动模板管理）-> 权限组
  TEMPLATE_AUDIT: '模板管理-审核列表',
  // 素材库（审核列表） -> 权限组
  MATERIAL_LIBRARY_AUDIT: '素材库-审核列表',
}

// 权益商超
const equitySupermarketAuth = {
  STATISTICS_CONSUME: '数据中心',
  PRODUCT_PAGE: '商品列表',
  PRODUCT_REPLENISHMENT_PAGE: '补仓记录',
  CATEGORY_PAGE: '商品分类',
  RIGHT_APPLY_ORDER_PAGE: '申请订单',
  RIGHT_APPLY_ORDER_CONSUME_PAGE: '消耗订单',
  RIGHT_APPLY_ORDER_ROLLBACK_PAGE: '回退订单',
  MERCHANT_PAGE: '商户列表',
  MERCHANT_RIGHT_PAGE: '商户权益',
  EARLY_CONFIG_PAGE: '预警配置',
  // 商户权益（权益可见用户） -> 权限组
  MERCHANT_RIGHT_ADMIN: '商户权益管理员',
  JN_VOUCHERS_STATS_LIST: "红包数据",
  RED_EXCEPTION_LIST:"红包提现异常记录"
};

// 权益管理
const rightsManagementAuth = {
  PRIZE_MANAGEMENT_GET: '奖品管理',
  COUPON_MANAGEMENT_GET: '优惠券管理',
  USER_COUPON_GET: '用户的优惠券',
  EXCHANGE_CODE_MANAGEMENT_GET: '兑换码管理',
  VIRTUAL_CARD_MANAGEMENT_GET: '虚拟卡管理',
  CALL_ORDER_LIST_GET: '话费订单列表',
  RECHARGE_LINK_GET: '话费订单链接',
  TREASURY_GET: '资金库',
}

// 增值营销
const strategyMallAuth = {
  CLASSIFICATION_MANAGEMENT_GET: '分类管理',
  TOOL_MANAGEMENT_GET: '工具管理',
  COMMODITY_MANAGEMENT_GET: '商品管理',
  ORDER_MANAGEMENT_GET: '订单管理',
  USER_RIGHTS_GET: '用户权益',
  'INVITE-RECORD_GET': '邀请记录',
  'REFUND_AFTER-SALES_GET': '售后退款列表',
  RESOURCE_BIT_MANAGEMENT_GET: '资源位管理',
  COUPON_MANAGEMENT_GET: '优惠券管理',
  USER_COUPON_GET: '用户的优惠券',
  EXCHANGE_CODE_MANAGEMENT_GET: '兑换码管理',
  VIRTUAL_CARD_MANAGEMENT_GET: '虚拟卡管理',
}


// 内容营销
const contentMarketingAuth = {
  CONTENT_MARKETING_INTELLIFENT_TEACH_GET: '内容营销智能投教',
  CONTENT_MARKETING_INTELLIFENT_INFORMATION_GET: '内容营销智能资讯',
  CONTENT_MARKETING_INTELLIFENT_POLICY_GET: '内容营销智能政策',
  CONTENT_MARKETING_FUND_TOOL_GET: '内容营销资金工具',
  CONTENT_MARKETING_INTELLIGENT_COMBINATION_GET: '内容营销智能组合',
  CONTENT_MARKETING_INFORMATION_EDIT_GET: '内容营销资讯编辑',
  CONTENT_MARKETING_ARTICLE_MANAGEMENT_GET: '内容营销文章管理',
  CONTENT_MARKETING_AUDIT_MANAGEMENT_GET: '内容营销审核管理',
  CONTENT_MARKETING_HISTORICAL_RECORD_GET: '历史记录',
  CONTENT_MARKETING_USER_FEEDBACK_GET: '用户反馈',
}

// 积分商城
const pointShopAuth = {
  MALL_COMMODITY_MANAGEMENT_GET: '积分商城商品管理',
  MALL_ORDER_MANAGEMENT_GET: '积分商城订单管理',
  BANNER_SELECT: '广告位配置',
  GOODS_SELECT: '商品管理',
  GOODS_CLASS_SELECT: '商品分类',
  PERMISSION_LIST_SELECT: '权益列表',
  ORDER_SELECT: '订单管理'

}

// 活动营销（旧）
const oldActivityAuth = {
  ACTIVITY_TEMPLATE_LIBRARY_GET: '活动模板库',
  'ACTIVITY-REPOSITORY_GET': '活动资源库',
  ACTIVITY_TEMPLATE_GET: '活动面板',
  ACTIVITY_LANDINGS_GET: '万能活动页',
  ACTIVITY_WINNER_LIST_GET: '中奖名单',
  'ACTIVITY-ORDER_GET': '活动订单',
  ITEM_BANK_MANAGEMENT_GET: '题库管理',
  SIMULATION_PURCHASE_GET: '仿真购买/中奖',
  LANDING_INTRODUCTION_PAGE_GET: '落地介绍页',
  TASK_EVENT_GET: '任务事件',
  'SHORTCUT-APPLET_GET': '快捷小程序',
  PRIZE_MANAGEMENT_GET: '奖品管理',
}

const menuMap = {
  ACTIVITY: activityAuth,
  POINTMALL: pointShopAuth,
  STRATEGYMALL: strategyMallAuth,
  CONTENT: contentMarketingAuth,
  EQUITYSUPERMARK: equitySupermarketAuth
}

let authMap = {
  ...AUTHORITYOBJ,
  ...activityAuth,
  ...equitySupermarketAuth,
  ...rightsManagementAuth,
  ...strategyMallAuth,
  ...contentMarketingAuth,
  ...pointShopAuth,
  ...oldActivityAuth,
}



const menuType = getUrlParameter( 'menuType' )
if ( menuType ) authMap = { ...AUTHORITYOBJ, ...menuMap[menuType] }
// 角色说明
export function getAuthority( str ) {
  // return localStorage.getItem('JINIU-CMS-authority') || ['admin', 'user'];
  const authorityString = ( typeof str === 'undefined' ) ? localStorage.getItem( 'JINIU-CMS-authority' ) : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse( authorityString );
  } catch ( e ) {
    authority = authorityString;
  }
  if ( typeof authority === 'string' ) {
    return [authority];
  }
  return authority || ['admin'];
}

export function setAuthority( authority ) {
  const { result } = authority;
  localStorage.setItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO', JSON.stringify( result ) );
  const { roleGroups } = result;
  const rolesArrs = [];
  if ( !menuType ) rolesArrs.push( 'HOME_PAGE' )
  if ( roleGroups.length > 0 ) {
    for ( let i = 0; i < roleGroups.length; i += 1 ) {
      const { roles } = roleGroups[i];
      for ( let j = 0; j < roles.length; j += 1 ) {
        const { code } = roles[j];
        if ( authMap[code] ) {
          rolesArrs.push( code );
        }
      }
    }
  }
  localStorage.setItem( 'JINIU-CMS-authority', JSON.stringify( rolesArrs ) );
}

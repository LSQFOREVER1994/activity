import activityMenu from './routerOption/activityMenu'; // 活动营销
import equitySupermarketMenu from './routerOption/equitySupermarketMenu'; // 权益商超
// import rightsManagementMenu from './routerOption/rightsManagementMenu'; // 权益管理
import strategyMallMenu from './routerOption/strategyMallMenu'; // 增值营销
import contentMarketingMenu from './routerOption/contentMarketingMenu'; // 内容营销
import pointShopMenu from './routerOption/pointShopMenu'; // 积分商城
import oldActivityMenu from './routerOption/oldActivityMenu'; // 活动营销（旧）
import systemMenu from './routerOption/systemMenu'; // 管理系统



const menuList = [
  {
    path: '/',
    redirect: '/user/login'
  },
  //首页
  {
    name: 'home',
    icon: 'home',
    path: '/home',
    component: './Home',
    authority: ['HOME_PAGE'],
  },
  // 数据运营
  {
    name: 'statistics',
    icon: 'icon-statistics',
    path: '/statistics',
    authority: ['BURY_POINT_STATISTICS_GET', 'STATISTICS_APP_GET'],
    hideInMenu: true,
    routes: [{
      path: '/statistics',
      redirect: '/statistics/app',
    },

    // 统计查询 -> 埋点统计
    {
      path: '/statistics/app',
      name: 'app',
      component: './Statistics/Product',
      authority: ['BURY_POINT_STATISTICS_GET'],
    },
    {
      path: '/statistics/app/detail',
      name: 'detail',
      hideInMenu: true,
      component: './Statistics/ProductDetail',
      authority: ['STATISTICS_APP_GET'],
    },
    {
      path: '/statistics/app/event',
      name: 'event',
      hideInMenu: true,
      component: './Statistics/ProductEvent',
      authority: ['STATISTICS_APP_GET'],
    },
    ],
  },
  activityMenu,
  equitySupermarketMenu,
  // rightsManagementMenu,
  strategyMallMenu,
  contentMarketingMenu,
  pointShopMenu,
  oldActivityMenu,
  systemMenu,
  {
    name: 'messageCenter',
    path: '/messageCenter',
    component: './MessageCenter',
  },
  // 用户
  {
    name: 'account',
    icon: 'user',
    path: '/account',
    hideInMenu: true,
    routes: [{
      path: '/account',
      redirect: '/account/center',
    },
    // 用户 -> 个人中心
    {
      path: '/account/center',
      name: 'center',
      component: './Account/Center',
    },
    // 用户 -> 个人设置
    {
      path: '/account/settings',
      name: 'settings',
      component: './Account/Settings/Info',
      routes: [{
        path: '/account/settings',
        redirect: '/account/settings/password',
      },
      // 用户 -> 个人设置 -> 修改密码
      {
        path: '/account/settings/password',
        component: './User/ModifyPassword',
      },
      // 用户 -> 个人设置 -> 更多设置
      {
        path: '/account/settings/more',
        component: './Account/Settings/More',
      },
      ],
    },
    ],
  },

  // 异常页
  {
    // name: 'exception',
    icon: 'warning',
    path: '/exception',
    routes: [{
      path: '/exception/403',
      // name: 'not-permission',
      component: './Exception/403',
    },
    {
      path: '/exception/404',
      // name: 'not-find',
      component: './Exception/404',
    },
    {
      path: '/exception/500',
      // name: 'server-error',
      component: './Exception/500',
    },
    ],
  },

  {
    component: '404',
  },
]

export default [
  // 外层登录相关
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login'
      },
      {
        path: '/user/modifyPassword',
        component: './User/ModifyPassword',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: menuList
  },
]



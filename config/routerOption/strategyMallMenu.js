
// 增值营销
const strategyMallMenu = {
  name: 'strategyMall',
  icon: 'shop',
  path: '/strategyMall',
  authority: [
    'CLASSIFICATION_MANAGEMENT_GET',
    'TOOL_MANAGEMENT_GET',
    'COMMODITY_MANAGEMENT_GET',
    'ORDER_MANAGEMENT_GET',
    'USER_RIGHTS_GET',
    'INVITE-RECORD_GET',
    'REFUND_AFTER-SALES_GET',
    'RESOURCE_BIT_MANAGEMENT_GET',
  ],
  routes: [
    {
      path: '/strategyMall',
      redirect: '/strategyMall/categoryList',
    },
    // 分类管理
    {
      path: '/strategyMall/categoryList',
      name: 'categorylist',
      component: './StrategyMall/Category/CategoryLists',
      authority: ['CLASSIFICATION_MANAGEMENT_GET'],
    },
    // 工具管理
    {
      path: '/strategyMall/productsRights',
      name: 'productsRightslist',
      component: './StrategyMall/ProductsRights/List',
      authority: ['TOOL_MANAGEMENT_GET'],
    },
    // 商品管理
    {
      path: '/strategyMall/productList',
      name: 'productlist',
      component: './StrategyMall/Product/ProductLists',
      authority: ['COMMODITY_MANAGEMENT_GET'],
    },
    // 订单管理
    {
      path: '/strategyMall/order',
      name: 'order',
      component: './StrategyMall/Orders/List',
      authority: ['ORDER_MANAGEMENT_GET']
    },
    // 用户权益管理
    {
      path: '/strategyMall/users',
      name: 'users',
      component: './StrategyMall/ProductsRights/Owner',
      authority: ['USER_RIGHTS_GET']
    },
    // 邀请记录
    {
      path: '/strategyMall/visit/list',
      name: 'visitlist',
      component: './StrategyMall/Visit/List',
      authority: ['INVITE-RECORD_GET'],
      hideInMenu: true
    },
    // 退款列表管理
    {
      path: '/strategyMall/refundList',
      name: 'refundList',
      component: './StrategyMall/RefundLists',
      authority: ['REFUND_AFTER-SALES_GET'],
    },
    // 增值营销 -> 卡券系统
    {
      name: 'card',
      // icon: 'icon-coupons',
      path: '/strategyMall/card',
      authority: ['COUPON_MANAGEMENT_GET', 'USER_COUPON_GET', 'EXCHANGE_CODE_MANAGEMENT_GET', 'VIRTUAL_CARD_MANAGEMENT_GET'],
      routes: [
        // 增值营销 -> 卡券系统 -> 优惠券管理
        {
          path: '/strategyMall/card/manage',
          name: 'manage',
          component: './StrategyMall/Coupons/List',
          authority: ['COUPON_MANAGEMENT_GET'],
        },
        // 增值营销 -> 卡券系统 -> 用户的优惠券
        {
          path: '/strategyMall/card/couponUser',
          name: 'couponUser',
          component: './StrategyMall/Coupons/couponUser',
          authority: ['USER_COUPON_GET'],
        },
        // 增值营销 -> 卡券系统 -> 兑换码管理
        {
          path: '/strategyMall/card/redeemCode',
          name: 'redeemCode',
          component: './StrategyMall/Code/batchCode',
          authority: ['EXCHANGE_CODE_MANAGEMENT_GET'],
        },
        // 增值营销 -> 卡券系统 -> 虚拟卡
        {
          path: '/strategyMall/card/virtualCard',
          name: 'virtualCard',
          component: './StrategyMall/VirtualCard/batchCode',
          authority: ['VIRTUAL_CARD_MANAGEMENT_GET'],
        }
      ]
    },
    // 资源位管理
    {
      name: 'banner',
      path: '/strategyMall/banner',
      component: './Tool/Banner/banner',
      authority: ['RESOURCE_BIT_MANAGEMENT_GET'],
    },
    // // 内容营销
    // {
    //   name: 'content',
    //   path: '/strategyMall/content',
    //   authority: [
    //     'CONTENT_MARKETING_INTELLIFENT_TEACH_GET', 'CONTENT_MARKETING_INTELLIFENT_INFORMATION_GET',
    //     'CONTENT_MARKETING_INTELLIFENT_POLICY_GET', 'CONTENT_MARKETING_FUND_TOOL_GET',
    //     'CONTENT_MARKETING_INTELLIGENT_COMBINATION_GET', 'CONTENT_MARKETING_INFORMATION_EDIT_GET',
    //     'CONTENT_MARKETING_HISTORICAL_RECORD_GET', 'CONTENT_MARKETING_USER_FEEDBACK_GET'
    //   ],
    //   routes: [
    //     {
    //       path: '/strategyMall/content',
    //       redirect: '/content/user',
    //     },
    //     // 内容营销-智能投教
    //     {
    //       path: '/strategyMall/content/toujiao',
    //       name: 'toujiao',
    //       component: './Mall/Toujiao',
    //       authority: ['CONTENT_MARKETING_INTELLIFENT_TEACH_GET']
    //     },
    //     // 内容营销-智能资讯
    //     {
    //       path: '/strategyMall/content/news',
    //       name: 'news',
    //       component: './Mall/News',
    //       authority: ['CONTENT_MARKETING_INTELLIFENT_INFORMATION_GET']
    //     },
    //     // 内容营销-智能策略
    //     {
    //       path: '/strategyMall/content/zncl',
    //       name: 'zncl',
    //       component: './Mall/Zncl',
    //       authority: ['CONTENT_MARKETING_INTELLIFENT_POLICY_GET']
    //     },
    //     // 内容营销-基金工具
    //     {
    //       path: '/strategyMall/content/jjgj',
    //       name: 'jjgj',
    //       component: './Mall/Jjgj',
    //       authority: ['CONTENT_MARKETING_FUND_TOOL_GET']
    //     },
    //     // 内容营销-智能组合
    //     {
    //       path: '/strategyMall/content/znzh',
    //       name: 'znzh',
    //       component: './Mall/Znzh',
    //       authority: ['CONTENT_MARKETING_INTELLIGENT_COMBINATION_GET']
    //     },
    //     // 内容营销-资讯编辑
    //     {
    //       path: '/strategyMall/content/consultMange',
    //       name: 'consultMange',
    //       component: './Exhibition/ConsultMange/Consult',
    //       authority: ['CONTENT_MARKETING_INFORMATION_EDIT_GET']
    //     },
    //     // 文章管理
    //     {
    //       path: '/strategyMall/content/paper',
    //       name: 'paper',
    //       authority: ['CONTENT_MARKETING_ARTICLE_MANAGEMENT_GET', 'CONTENT_MARKETING_AUDIT_MANAGEMENT_GET'],
    //       routes: [
    //         {
    //           path: '/strategyMall/content/paper',
    //           redirect: '/tool/paper/paperManange',
    //         },
    //         // 文章管理
    //         {
    //           path: '/strategyMall/content/paper/paperManange',
    //           name: 'paperManange',
    //           component: './Tool/Paper/PaperManange',
    //           authority: ['CONTENT_MARKETING_ARTICLE_MANAGEMENT_GET'],
    //         },
    //         // 审核管理
    //         {
    //           path: '/strategyMall/content/paper/paperAudit',
    //           name: 'paperAudit',
    //           component: './Tool/Paper/PaperAudit',
    //           authority: ['CONTENT_MARKETING_AUDIT_MANAGEMENT_GET']
    //         },
    //       ]
    //     },
    //     //  历史战绩
    //     {
    //       path: '/strategyMall/content/history',
    //       name: 'history',
    //       component: './Tool/Module/HistoryGains/HistoryGains',
    //       authority: ['CONTENT_MARKETING_HISTORICAL_RECORD_GET'],
    //     },
    //     // 用户反馈
    //     {
    //       path: '/strategyMall/content/feedback',
    //       name: 'feedback',
    //       component: './Tool/Feedback/Feedback',
    //       authority: ['CONTENT_MARKETING_USER_FEEDBACK_GET'],
    //     }
    //   ]
    // }
  ]
}


export default strategyMallMenu

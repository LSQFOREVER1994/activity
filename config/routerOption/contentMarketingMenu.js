
 // 内容营销
 const contentMarketingMenu = {
  name: 'contentMarketing',
  icon: 'icon-coupons',
  path: '/contentMarketing/content',
  // authority: [
  //   'CONTENT_MARKETING_INTELLIFENT_TEACH_GET', 'CONTENT_MARKETING_INTELLIFENT_INFORMATION_GET',
  //   'CONTENT_MARKETING_INTELLIFENT_POLICY_GET', 'CONTENT_MARKETING_FUND_TOOL_GET',
  //   'CONTENT_MARKETING_INTELLIGENT_COMBINATION_GET', 'CONTENT_MARKETING_INFORMATION_EDIT_GET',
  //   'CONTENT_MARKETING_HISTORICAL_RECORD_GET', 'CONTENT_MARKETING_USER_FEEDBACK_GET'
  // ],
  authority: ['CONTENT_MARKETING_INTELLIFENT_TEACH_GET' ],
  routes: [
    {
      path: '/contentMarketing/content',
      redirect: '/content/user',
    },
    // 内容营销-智能投教
    {
      path: '/contentMarketing/content/toujiao',
      name: 'toujiao',
      component: './Mall/Toujiao',
      // authority: ['CONTENT_MARKETING_INTELLIFENT_TEACH_GET']
    },
    // 内容营销-智能资讯
    {
      path: '/contentMarketing/content/news',
      name: 'news',
      component: './Mall/News',
      // authority: ['CONTENT_MARKETING_INTELLIFENT_INFORMATION_GET']
    },
    // 内容营销-智能策略
    {
      path: '/contentMarketing/content/zncl',
      name: 'zncl',
      component: './Mall/Zncl',
      // authority: ['CONTENT_MARKETING_INTELLIFENT_POLICY_GET']
    },
    // 内容营销-基金工具
    {
      path: '/contentMarketing/content/jjgj',
      name: 'jjgj',
      component: './Mall/Jjgj',
      // authority: ['CONTENT_MARKETING_FUND_TOOL_GET']
    },
    // 内容营销-智能组合
    {
      path: '/contentMarketing/content/znzh',
      name: 'znzh',
      component: './Mall/Znzh',
      // authority: ['CONTENT_MARKETING_INTELLIGENT_COMBINATION_GET']
    },
    // 内容营销-资讯编辑
    {
      path: '/contentMarketing/content/consultMange',
      name: 'consultMange',
      component: './Exhibition/ConsultMange/Consult',
      // authority: ['CONTENT_MARKETING_INFORMATION_EDIT_GET']
    },
    // 文章管理
    {
      path: '/contentMarketing/content/paper',
      name: 'paper',
      // authority: ['CONTENT_MARKETING_ARTICLE_MANAGEMENT_GET', 'CONTENT_MARKETING_AUDIT_MANAGEMENT_GET'],
      routes: [
        {
          path: '/contentMarketing/content/paper',
          redirect: '/tool/paper/paperManange',
        },
        // 文章管理
        {
          path: '/contentMarketing/content/paper/paperManange',
          name: 'paperManange',
          component: './Tool/Paper/PaperManange',
          // authority: ['CONTENT_MARKETING_ARTICLE_MANAGEMENT_GET'],
        },
        // 审核管理
        {
          path: '/contentMarketing/content/paper/paperAudit',
          name: 'paperAudit',
          component: './Tool/Paper/PaperAudit',
          // authority: ['CONTENT_MARKETING_AUDIT_MANAGEMENT_GET']
        },
      ]
    },
    //  历史战绩
    {
      path: '/contentMarketing/content/history',
      name: 'history',
      component: './Tool/Module/HistoryGains/HistoryGains',
      // authority: ['CONTENT_MARKETING_HISTORICAL_RECORD_GET'],
    },
    // 用户反馈
    // {
    //   path: '/contentMarketing/content/feedback',
    //   name: 'feedback',
    //   component: './Tool/Feedback/Feedback',
    //   authority: ['CONTENT_MARKETING_USER_FEEDBACK_GET'],
    // }
  ]
}

export default contentMarketingMenu

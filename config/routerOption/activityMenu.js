
// 活动营销菜单
const activityMenu = {
  name: 'activityTemplate',
  icon: 'icon-statistics',
  path: '/activityTemplate',
  authority: [
    'TEMPLATE_MANAGEMENT_GET', // 模版管理列表
    'ACTIVITY_LIST_GET',   // 活动列表
    // 'COMPONENT_QUERY_GET', // 组件列表
    'MATERIAL_LIBRARY_GET', // 素材库列表
    'AUDIT_MANAGEMENT_GET',  // 审核列表
    'QUESTION_BANK_MANAGEMENT_GET', // 题库列表
    'POSTER_MANAGEMENT_GET',
    'JUMP_CONFIG_GET'
  ],
  routes: [
    {
      path: '/activityTemplate',
      redirect: '/activityTemplate/bees',
    },
    // 活动模板管理
    {
      name: 'template',
      path: '/activityTemplate/template',
      component: './ActivityMarketing/TemplateManage/TemplateManage',
      authority: ['TEMPLATE_MANAGEMENT_GET'],
    },
    //活动列表
    {
      name: 'bees',
      path: '/activityTemplate/bees',
      component: './ActivityMarketing/Bees/Bees',
      authority: ['ACTIVITY_LIST_GET'],
    },
    // 组件查询
    // {
    //   name: 'componentList',
    //   path: '/activityTemplate/componentList',
    //   component: './ActivityMarketing/ComponentList/ComponentList',
    //   authority: ['COMPONENT_QUERY_GET']
    // },
    // 素材库
    {
      name: 'materialLibrary',
      path: '/activityTemplate/materialLibrary',
      component: './ActivityMarketing/MaterialLibrary/MaterialLibrary',
      authority: ['MATERIAL_LIBRARY_GET']
    },
    // 审核管理
    {
      name: 'commentReview',
      path: '/activityTemplate/commentReview',
      component: './ActivityMarketing/CommentReview/CommentReview',
      onlyHideMenu: true, // 只是隐藏菜单
      authority: ['AUDIT_MANAGEMENT_GET'],
    },
    //题库管理
    {
      name: 'questionBank',
      path: '/activityTemplate/questionBank',
      component: './ActivityMarketing/QuestionBank/QuestionBank',
      authority: ['QUESTION_BANK_MANAGEMENT_GET']
    },
    {
      name: 'poster',
      path: '/activityTemplate/poster',
      component: './ActivityMarketing/EQXiu/EQXiu',
      authority: ['POSTER_MANAGEMENT_GET']
    },
    {
      path: "/activityTemplate/functionConfig",
      name: "functionConfig",
      component: './ActivityMarketing/FunctionConfig',
      authority: ['JUMP_CONFIG_GET']
    },
    {
      path:'/activityTemplate/channelManagement',
      name:'channelManagement',
      component:'./ActivityMarketing/ChannelManagement',
    },
    {
      path:'/activityTemplate/customerManagement',
      name:'customerManagement',
      component:'./ActivityMarketing/CustomerManagement',
    },
    {
      path:'/activityTemplate/shortChainCreate',
      name:'shortChainCreate',
      component:'./ActivityMarketing/ShortChainCreate',
    },
    {
      path:'/activityTemplate/activityAudit',
      name:'activityAudit',
      component:'./ActivityMarketing/ActivityAudit'
    },
  ]
}



export default activityMenu

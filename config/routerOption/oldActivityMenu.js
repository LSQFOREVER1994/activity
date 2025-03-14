
// 活动营销 (旧)
const oldActivityMenu = {
  name: 'activity',
  icon: 'icon-activity',
  path: '/oldActivity',
  authority: [
    'ACTIVITY_TEMPLATE_LIBRARY_GET',
    'ACTIVITY-REPOSITORY_GET',
    'ACTIVITY_TEMPLATE_GET',
    'ACTIVITY_LANDINGS_GET',
    'ACTIVITY_WINNER_LIST_GET',
    'ACTIVITY-ORDER_GET',
    'ITEM_BANK_MANAGEMENT_GET',
    'SIMULATION_PURCHASE_GET',
    'LANDING_INTRODUCTION_PAGE_DELETE',
    'TASK_EVENT_GET', 'SHORTCUT-APPLET_GET',
    'PRIZE_MANAGEMENT_GET'
  ],
  routes: [
    // {
    //   path: '/oldActivity',
    //   redirect: '/oldActivity/turntable/BIG_WHEEL',
    // },
    // 活动营销 -> 活动模板库
    {
      path: '/oldActivity/activityLibrary',
      name: 'activityLibrary',
      component: './Tool/ActivityLibrary/List',
      authority: ['ACTIVITY_TEMPLATE_LIBRARY_GET']
    },
    // 活动营销 -> 活动资源库
    {
      path: '/oldActivity/activityList',
      name: 'activityList',
      component: './Tool/ActivityList/ActivityList',
      authority: ['ACTIVITY-REPOSITORY_GET']
    },
    // 活动营销 -> 活动面板
    {
      path: '/oldActivity/activityPanel',
      name: 'activityPanel',
      component: './Tool/ActivityPanel/List',
      authority: ['ACTIVITY_TEMPLATE_GET']
    },
    // 活动营销 -> 万能活动页
    {
      path: '/oldActivity/activity',
      name: 'activity',
      component: './Tool/ActivesTemplate/ActivesTemplate',
      authority: ['ACTIVITY_LANDINGS_GET'],
    },
    // 活动营销 -> 编辑刮刮卡活动
    {
      path: '/oldActivity/activityModal/editScratvhCard',
      name: 'editScratvhCard',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/ScratvhCard',
    },
    // 活动营销 -> 添加刮刮卡活动
    {
      path: '/oldActivity/activityModal/addScratchCard',
      name: 'addScratchCard',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/ScratvhCard',
    },

    // 活动营销 -> 编辑大转盘活动
    {
      path: '/oldActivity/activityModal/editBigWheel',
      name: 'editBigWheel',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/BigWheel',
    },
    // 活动营销 -> 添加大转盘
    {
      path: '/oldActivity/activityModal/addBigWheel',
      name: 'addBigWheel',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/BigWheel',
    },
    // 活动营销 -> 编辑口令
    {
      path: '/oldActivity/activityModal/editPassword',
      name: 'editPassword',
      onlyHideMenu: true,
      component: './Tool/ActivityModal/Password',
    },
    // 活动营销 -> 添加口令
    {
      path: '/oldActivity/activityModal/addPassword',
      name: 'addPassword',
      onlyHideMenu: true,
      component: './Tool/ActivityModal/Password',
    },

    // 活动营销 ->添加集卡
    {
      path: '/oldActivity/activityModal/addCollectCard',
      name: 'addCollectCard',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/CardCollecting',
    },
    // 活动营销 ->编辑集卡
    {
      path: '/oldActivity/activityModal/editCollectCard',
      name: 'editCollectCard',
      onlyHideMenu: true,
      component: './Tool/ActivityModal/CardCollecting',
    },

    // 活动营销 -> 编辑刮秒杀活动
    {
      path: '/oldActivity/activityModal/editFlashSales',
      name: 'editFlashSales',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/FlashSales',
    },
    // 活动营销 -> 添加秒杀活动
    {
      path: '/oldActivity/activityModal/addFlashSales',
      name: 'addFlashSales',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/FlashSales',
    },

    // 活动营销 -> 编辑抢券活动
    {
      path: '/oldActivity/activityModal/editCoupon',
      name: 'editCoupon',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Coupon',
    },
    // 活动营销 -> 添加抢券活动
    {
      path: '/oldActivity/activityModal/addCoupon',
      name: 'addCoupon',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Coupon',
    },

    // 活动营销 -> 编辑答题活动
    {
      path: '/oldActivity/activityModal/editAnswer',
      name: 'editAnswer',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Answer',
    },
    // 活动营销 -> 添加答题活动
    {
      path: '/oldActivity/activityModal/addAnswer',
      name: 'addAnswer',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Answer',
    },
    // 活动营销 -> 编辑吃鸡答题活动
    {
      path: '/oldActivity/activityModal/editAnswerCompetition',
      name: 'editAnswerCompetition',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/AnswerCompetition',
    },
    // 活动营销 -> 添加吃鸡答题活动
    {
      path: '/oldActivity/activityModal/addAnswerCompetition',
      name: 'addAnswerCompetition',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/AnswerCompetition',
    },
    // 活动营销 -> 编辑红包雨活动
    {
      path: '/oldActivity/activityModal/editRedRain',
      name: 'editRedRain',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/RedRain',
    },
    // 活动营销 -> 添加红包雨活动
    {
      path: '/oldActivity/activityModal/addRedRain',
      name: 'addRedRain',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/RedRain',
    },
    // 活动营销 -> 编辑弹幕活动
    {
      path: '/oldActivity/activityModal/editBarrage',
      name: 'editBarrage',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Barrage',
    },
    // 活动营销 -> 添加弹幕活动
    {
      path: '/oldActivity/activityModal/addBarrage',
      name: 'addBarrage',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Barrage',
    },
    // 活动营销 -> 编辑问卷活动
    {
      path: '/oldActivity/activityModal/editQuestionnaire',
      name: 'editQuestionnaire',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Questionnaire',
    },
    // 活动营销 -> 添加问卷活动
    {
      path: '/oldActivity/activityModal/addQuestionnaire',
      name: 'addQuestionnaire',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Questionnaire',
    },
    // 活动营销 -> 编辑下单有礼活动
    {
      path: '/oldActivity/activityModal/editOrderCourtesy',
      name: 'editOrderCourtesy',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/OrderCourtesy',
    },
    // 活动营销 -> 创建下单有礼活动
    {
      path: '/oldActivity/activityModal/addOrderCourtesy',
      name: 'addOrderCourtesy',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/OrderCourtesy',
    },
    // 活动营销 -> 编辑K线角斗场活动
    {
      path: '/oldActivity/activityModal/editKLineArena',
      name: 'editKLineArena',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/KLineArena',
    },
    // 活动营销 -> 添加K线角斗场活动
    {
      path: '/oldActivity/activityModal/addKLineArena',
      name: 'addKLineArena',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/KLineArena',
    },
    // 活动营销 -> 编辑猜涨跌活动
    {
      path: '/oldActivity/activityModal/editGuessGame',
      name: 'editGuessGame',
      onlyHideMenu: true,
      component: './Tool/ActivityModal/GuessGame',
    },
    // 活动营销 -> 添加猜涨跌活动
    {
      path: '/oldActivity/activityModal/addGuessGame',
      name: 'addGuessGame',
      onlyHideMenu: true,
      component: './Tool/ActivityModal/GuessGame',
    },
    // 活动营销 -> 编辑抓娃娃活动
    {
      path: '/oldActivity/activityModal/editPrizeClaw',
      name: 'editPrizeClaw',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/PrizeClaw',
    },
    // 活动营销 -> 添加抓娃娃活动
    {
      path: '/oldActivity/activityModal/addPrizClaw',
      name: 'addPrizClaw',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/PrizeClaw',
    },
    // 活动营销 -> 编辑抽签活动
    {
      path: '/oldActivity/activityModal/editDraw',
      name: 'editDraw',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Draw',
    },
    // 活动营销 -> 添加抽签活动
    {
      path: '/oldActivity/activityModal/addDraw',
      name: 'addDraw',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/Draw',
    },
    {
      path: '/oldActivity/activityModal/editEggFrenzy',
      name: 'editEggFrenzy',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/EggFrenzy',
    },
    // 活动营销 -> 添加砸金蛋活动
    {
      path: '/oldActivity/activityModal/addEggFrenzy',
      name: 'addEggFrenzy',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/EggFrenzy',
    },
    // 活动营销 -> 编辑随机卡活动
    {
      path: '/oldActivity/activityModal/editRandomCard',
      name: 'editRandomCard',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/RandomCard',
    },
    // 活动营销 -> 添加随机卡活动
    {
      path: '/oldActivity/activityModal/addRandomCard',
      name: 'addRandomCard',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/RandomCard',
    },
    // 活动营销 -> 编辑基金对对碰活动
    {
      path: '/oldActivity/activityModal/editFundCollision',
      name: 'editFundCollision',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/FundCollision',
    },
    // 活动营销 -> 添加基金对对碰活动
    {
      path: '/oldActivity/activityModal/addFundCollision',
      name: 'addFundCollision',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/FundCollision',
    },
    // 运营活动 -> 添加合成大西瓜活动
    {
      path: '/oldActivity/activityModal/addBigWatermelonGame',
      name: 'addBigWatermelonGame',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/BigWatermelon',
    },
    // 运营活动 -> 编辑合成大西瓜活动
    {
      path: '/oldActivity/activityModal/editBigWatermelonGame',
      name: 'editBigWatermelonGame',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityModal/BigWatermelon',
    },
    //  活动营销 ->活动数据
    {
      path: '/oldActivity/activityData',
      name: 'activityData',
      onlyHideMenu: true, // 只是隐藏菜单
      component: './Tool/ActivityData',
    },

    // 中奖名单
    {
      path: '/oldActivity/winners',
      name: 'winners',
      component: './Tool/ActivityData/AwardRecords/AwardRecords',
      authority: ['ACTIVITY_WINNER_LIST_GET'],
    },

    //  活动订单
    {
      path: '/oldActivity/activeOrder',
      name: 'activeOrder',
      component: './Tool/ActivityData/ActiveOrder/activeOrder',
      authority: ['ACTIVITY-ORDER_GET'],
    },

    //  题库管理
    {
      path: '/oldActivity/questionBank',
      name: 'questionBank',
      component: './EducationService/QuestionBank',
      authority: ['ITEM_BANK_MANAGEMENT_GET'],
    },
    // 仿真购买/中奖
    {
      path: '/oldActivity/purchasesRecord',
      name: 'purchasesRecord',
      component: './Tool/Module/PurchasesRecord/PurchasesRecord',
      authority: ['SIMULATION_PURCHASE_GET'],
    },

    // 落地介绍页
    {
      path: '/oldActivity/landingPage',
      name: 'landingPage',
      component: './Tool/Module/LandingPage/LandingPage',
      authority: ['LANDING_INTRODUCTION_PAGE_DELETE'],
    },
    // 任务事件
    {
      path: '/oldActivity/taskEvents',
      name: 'taskEvents',
      component: './Tool/ActivityData/TaskEvents/List',
      authority: ['TASK_EVENT_GET'],
    },
    // 快捷小程序
    {
      path: '/oldActivity/shareManage',
      name: 'shareManage',
      component: './Applet/ShareManage/List',
      authority: ['SHORTCUT-APPLET_GET']
    },
    // 奖品管理
    {
      path: '/oldActivity/prizeManagement',
      name: 'prizeManagement',
      component: './Tool/PrizeManage/PrizeManage',
      authority: ['PRIZE_MANAGEMENT_GET'],
    },
  ]
}

export default oldActivityMenu

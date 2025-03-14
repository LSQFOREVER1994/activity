
// 权益管理
const rightsManagementMenu = {
  name: 'rightsManagement',
  icon: 'icon-operation',
  path: '/rightsManagement',
  authority: [
    'PRIZE_MANAGEMENT_GET',
    'COUPON_MANAGEMENT_GET',
    'USER_COUPON_GET',
    'EXCHANGE_CODE_MANAGEMENT_GET',
    'VIRTUAL_CARD_MANAGEMENT_GET',
    'CALL_ORDER_LIST_GET',
    'RECHARGE_LINK_GET',
    'TREASURY_GET',
  ],
  routes: [
    // 奖品管理
    {
      path: '/rightsManagement/prizeManagement',
      name: 'prizeManagement',
      component: './Tool/PrizeManage/PrizeManage',
      authority: ['PRIZE_MANAGEMENT_GET'],
    },
    // 优惠券管理
    {
      path: '/rightsManagement/couponManagement',
      name: 'couponManagement',
      component: './StrategyMall/Coupons/List',
      authority: ['COUPON_MANAGEMENT_GET'],
    },
    // 用户的优惠券
    {
      path: '/rightsManagement/userCouponr',
      name: 'userCoupon',
      component: './StrategyMall/Coupons/couponUser',
      authority: ['USER_COUPON_GET'],
    },
    // 兑换码管理
    {
      path: '/rightsManagement/redeemCodeManagement',
      name: 'redeemCodeManagement',
      component: './StrategyMall/Code/batchCode',
      authority: ['EXCHANGE_CODE_MANAGEMENT_GET'],
    },
    // 虚拟卡管理
    {
      path: '/rightsManagement/virtualCouponManagement',
      name: 'virtualCouponManagement',
      component: './StrategyMall/VirtualCard/batchCode',
      authority: ['VIRTUAL_CARD_MANAGEMENT_GET'],
    },
    // 话费订单列表
    {
      path: '/rightsManagement/callChargesList',
      name: 'callChargesList',
      component: './ActivityMarketing/CallChargesList/CallChargesList',
      authority: ['CALL_ORDER_LIST_GET']
    },
    // 话费订单链接
    {
      path: '/rightsManagement/callChargesLink',
      name: 'callChargesLink',
      component: './ActivityMarketing/CallChargesLink/CallChargesLink',
      authority: ['RECHARGE_LINK_GET']
    },
    // 资金库
    {
      path: '/rightsManagement/treasury',
      name: 'treasury',
      component: './Tool/CapitalLibrary/platformAccount',
      authority: ['TREASURY_GET'],
    },
    // 平台账号
    {
      path: '/rightsManagement/treasury/platformParticulars',
      name: 'platformParticulars',
      component: './Tool/CapitalLibrary/platformParticulars',
      onlyHideMenu: true, // 只是隐藏菜单
    },
  ],
}

export default rightsManagementMenu

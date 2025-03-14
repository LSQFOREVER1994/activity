
// 积分商城
const pointShopMenu = {
  name: 'pointShop',
  icon: 'icon-coupons',
  path: '/pointShop',
  authority: [
    'BANNER_SELECT',
    'GOODS_SELECT',
    'GOODS_CLASS_SELECT',
    'PERMISSION_LIST_SELECT',
    'ORDER_SELECT',
  ],
  routes: [
    // 商品管理
    {
      path: '/pointShop/list',
      name: 'list',
      component: './PointsStore/Product/index',
      authority: ['GOODS_SELECT'],
    },
    // 商品分类
    {
      path: '/pointShop/classtify',
      name: 'classtify',
      component: './PointsStore/ProductClassify/index',
      authority: ['GOODS_CLASS_SELECT'],
    },
    // 权益列表
    {
      path: '/pointShop/right',
      name: 'right',
      component: './PointsStore/RightList/index',
      authority: ['PERMISSION_LIST_SELECT'],
    },
    {
      path: '/pointShop/order',
      name: 'order',
      component: './PointsStore/Order/index',
      authority: ['ORDER_SELECT'],
    },
    // 广告位配置
    {
      name: 'banner',
      path: '/pointShop/banner',
      component: './PointsStore/Banner/index',
      authority: ['BANNER_SELECT'],
    },
  ]
}

export default pointShopMenu

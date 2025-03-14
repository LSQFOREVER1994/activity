
// 权益商超
const equitySupermarket = {
  name: 'equitySupermarket',
  icon: 'icon-coupons',
  path: '/equitySupermarket',
  authority: [
    'STATISTICS_CONSUME',
    'PRODUCT_PAGE',
    'PRODUCT_REPLENISHMENT_PAGE',
    'CATEGORY_PAGE',
    'MERCHANT_PAGE',
    'RIGHT_APPLY_ORDER_PAGE',
    'RIGHT_APPLY_ORDER_CONSUME_PAGE',
    'RIGHT_APPLY_ORDER_ROLLBACK_PAGE',
    'MERCHANT_RIGHT_PAGE',
    'EARLY_CONFIG_PAGE',
    "JN_VOUCHERS_STATS_LIST",
    "RED_EXCEPTION_LIST"
  ],
  routes: [
    // 权益商超 -> 数据统计
    {
      path: '/equitySupermarket/dataCount',
      name: 'dataCount',
      component: './EquitySupermarket/DataCount/DataCount',
      authority: ['STATISTICS_CONSUME']
    },
    // 权益商超 -> 权益商品
    {
      path: '/equitySupermarket/equityGoods',
      name: 'equityGoods',
      authority: ['PRODUCT_PAGE', 'PRODUCT_REPLENISHMENT_PAGE', 'CATEGORY_PAGE'],
      routes: [
        // 商品列表
        {
          path: '/equitySupermarket/equityGoods/goodsList',
          name: 'equityGoodsList',
          component: './EquitySupermarket/EquityGoods/GoodsList/GoodsList',
          authority: ['PRODUCT_PAGE']
        },
        // 补仓记录
        {
          path: '/equitySupermarket/equityGoods/goodsResplenish',
          name: 'resplenishRecord',
          component: './EquitySupermarket/EquityGoods/GoodsResplenishRecord/ResplenishRecordList',
          authority: ['PRODUCT_REPLENISHMENT_PAGE']
        },
        // 商品分类
        {
          path: '/equitySupermarket/equityGoods/goodsClassify',
          name: 'goodsClassify',
          component: './EquitySupermarket/EquityGoods/GoodsClassify/GoodsClassifyList',
          authority: ['CATEGORY_PAGE']
        },

      ]
    },
    // 权益商超 -> 数据管理
    {
      path: '/equitySupermarket/dataManage',
      name: 'dataManage',
      authority: ['RIGHT_APPLY_ORDER_PAGE', 'RIGHT_APPLY_ORDER_CONSUME_PAGE', 'RIGHT_APPLY_ORDER_ROLLBACK_PAGE', "JN_VOUCHERS_STATS_LIST",'RED_EXCEPTION_LIST'],
      // 申请订单
      routes: [
        {
          path: '/equitySupermarket/dataManage/applyOrder',
          name: 'applyOrder',
          component: './EquitySupermarket/DataManage/ApplyOrder/ApplyOrderList',
          authority: ['RIGHT_APPLY_ORDER_PAGE']
        },
        // 消耗订单
        {
          path: '/equitySupermarket/dataManage/consumeOrder',
          name: 'consumeOrder',
          component: './EquitySupermarket/DataManage/ConsumeOrder/ConsumeOrderList',
          authority: ['RIGHT_APPLY_ORDER_CONSUME_PAGE']
        },
        // 回退订单
        {
          path: '/equitySupermarket/dataManage/withdrawOrder',
          name: 'withDrawOrder',
          component: './EquitySupermarket/DataManage/WithdrawOrder/WithdrawOrder',
          authority: ['RIGHT_APPLY_ORDER_ROLLBACK_PAGE']
        },
        // 红包数据
        {
          path: '/equitySupermarket/dataManage/redEnvelopeData',
          name: 'redEnvelopeData',
          component: './EquitySupermarket/DataManage/RedEnvelopeData',
          authority: ["JN_VOUCHERS_STATS_LIST"]
        },
        // 红包提现异常记录
        {
          path: '/equitySupermarket/dataManage/redAbnormalData',
          name: 'redAbnormalData',
          component: './EquitySupermarket/DataManage/RedAbnormalData/RedAbnormalData',
          authority: ["RED_EXCEPTION_LIST"]
        },
      ]
    },
    // 权益商超 -> 商户管理
    {
      path: '/equitySupermarket/merchantManage',
      name: 'merchantManage',
      authority: ['MERCHANT_PAGE', 'MERCHANT_RIGHT_PAGE'],
      routes: [
        // 权益商超 -> 商户管理 -> 商户列表
        {
          path: '/equitySupermarket/merchantManage/merchantList',
          name: 'merchantList',
          component: './EquitySupermarket/MerchantManage/MerchantList/MerchantManageList',
          authority: ['MERCHANT_PAGE'],
        },
        // 权益商超 -> 商户管理 -> 商户权益
        {
          path: '/equitySupermarket/merchantManage/merchantRights',
          name: 'merchantRights',
          component: './EquitySupermarket/MerchantManage/MerchantRights/MerchantRights',
          authority: ['MERCHANT_RIGHT_PAGE'],
        },
      ]
    },
    // 权益商超 -> 预警配置
    {
      path: '/equitySupermarket/alertConfig',
      name: 'alertConfig',
      component: './EquitySupermarket/AlertConfig/AlertConfig',
      authority: ['EARLY_CONFIG_PAGE'],
    },
    // 权益商超 -> 开发对接说明
    // {
    //   path: '/equitySupermarket/devDockExplain',
    //   name: 'devDockExplain',
    //   component: './EquitySupermarket/DevDockExplain/DevDockExplain',
    // },
  ]
}

export default equitySupermarket

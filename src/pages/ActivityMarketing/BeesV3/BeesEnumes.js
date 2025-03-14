
// 获取value
const getValue = ( enumList, key ) => {
  let selectValue = key;
  enumList.some( ( item ) => {
    if ( item.key !== key ) {
      return false;
    }
    selectValue = item.value;
    return true;
  } );
  return selectValue;
};

// 获取Key
const getKey = ( enumList, value ) => {
  let selectValue = value;
  enumList.some( ( item ) => {
    if ( item.value !== value ) {
      return false;
    }
    selectValue = item.key;
    return true;
  } );
  return selectValue;
};

// 活动状态 DISABLE, ENABLE, PAUSE
const activityStates = [
  { key:'ENABLE', value:'启用' },
  { key:'DISABLE', value:'禁用' },
  { key:'PAUSE', value:'暂停' },
]

// 浮动位置枚举
const positionTypes = [
  { key:'ENABLEFT_TOPLE', value:'左上角' },
  { key:'LEFT_CENTER', value:'左中间' },
  { key:'LEFT_BOTTOM', value:'左下角' },
  { key:'RIGHT_TOP', value:'右上角' },
  { key:'RIGHT_CENTER', value:'右中间' },
  { key:'RIGHT_BOTTOM', value:'右下角' },
  { key:'TOP_CENTER', value:'上居中' },
  { key:'BOTTOM_CENTER', value:'下居中' },
]

const clickTypes = [
  { key:'NONE', value:'无' },
  { key:'FEATURE', value:'功能' },
  { key:'CUSTOM_LINK', value:'自定义链接' },
]

const featureTypes = [
  { key:'ON_SHARE', value:'活动页面分享' },
  { key:'JUMP_PRIZE', value:'我的奖品' },
  { key:'SHOW_RULE', value:'规则弹框' },
  { key:'JUMP_MYINVITE', value:'邀请记录' },
  { key:'PRIZE_RECORD', value:'奖品公告(全品类)' },
  { key:'PRIZE_RECORD_RED', value:'奖品公告（红包）' },
  { key:'PRIZE_RECORD_COUPON', value:'奖品公告（权益）' },
  { key:'PRIZE_RECORD_GOODS', value:'奖品公告（实物）' },
  { key:'HOME_PAGE', value:'主活动首页' },
  { key:'ON_INVITE', value:'邀请分享' },
  { key:'JUMP_INTRGRSLRANK', value:'我的积分' },
  { key:'JUMP_PERSONAL', value: '竞猜个人中心' },
  { key:'SEND_BULLET', value: '发送弹幕' },
  { key:'SEND_COMMENT', value: '发送评论' },
  { key:'SEND_OPPSSITE_COMMENT', value: '发送正反发评论' },
]

const elementTypes = [
  { key:'BUTTON', value:'按钮' },
  { key:'BANNER', value:'轮播' },
  { key:'IMAGE', value:'图片' },
  { key:'TEXT', value:'文字' },
  { key:'GRID_WHEEL', value:'九宫格' },
  { key:'BIG_WHEEL', value:'大转盘' },
  { key:'FUNDS', value:'基金卡片' },
  { key:'MARQUEE', value:'跑马灯' },
  { key:'TASK', value:'任务' },
  { key:'AUDIO', value:'音频' },
  { key:'VIDEO', value:'视频' },
  { key:'PK_TOPIC', value:'话题pk' },
  { key:'RED_RAIN', value:'红包雨' },
  { key:'CHAT', value:'对话框' },
  { key:'ACTIVITY_SIGN', value:'签到' },
  { key:'ANSWER', value:'答题' },
  { key:'TAB', value:'Tab' },
  { key:'MYSTERY_BOX', value:'盲盒' },
  { key:'BARRAGE', value:'弹幕' },
  { key:'EXCHANGE', value:'兑换' },
  { key:'CARD', value:'集卡' },
  { key:'COUNTDOWN', value:'倒计时' },
  { key:'NORMAL_COMMENT', value:'常规评论' },
  { key:'OPPOSING_COMMENT', value:'正反方评论' },
  { key:'GUESS', value:'猜涨跌' },
  { key:'RANK', value:'排行榜' },
  { key:'BIND_GROUP', value:'拼团' },
  { key:'LUCK_DOG', value:'开奖组件' },
  { key:'MYSTERY_BOX_2', value:'盲盒' },
  { key:'MONOPOLY', value:'理财街' },
  { key:'QUESTIONNAIRE', value:'问卷' },
  { key:'SCRATCH_CARD', value:'刮刮卡' },
  { key:'LINK', value:'文字链' },
  { key:'AWARD', value:'领奖' },
  { key:'SMASH_EGG', value:'砸金蛋' },
  { key:'INTEGRAL', value:'积分' },
]

// 基金卡片展示类型
const fundsShowTypes = [
  { key:'growthRateDaily', value:'日涨幅' },
  { key:'growthRateWeekly', value:'周涨幅' },
  { key:'growthRateMonthly', value:'月涨幅' },
  { key:'growthRateQuarterly', value:'季涨幅' },
  { key:'growthRate6m', value:'近半年涨幅' },
  { key:'growthRate1y', value:'近一年涨幅' },
  { key:'growthRate2y', value:'近两年涨幅' },
  { key:'growthRate3y', value:'近三年涨幅' },
  { key:'growthRate0y', value:'今年以来涨幅' },
  { key:'growthRate', value:'成立以来涨幅' },
  { key:'netValue', value:'当前净值' },
  { key:'latestWeeklyYield', value:'七日年化收益率' },
  { key:'investmentYield', value:'年化投资收益率' },
  { key:'investmentRate1y', value:'近一年定投收益率' },
  { key:'investmentRate2y', value:'近二年定投收益率' },
  { key:'investmentRate3y', value:'近三年定投收益率' },
  { key:'investmentRate5y', value:'近五年定投收益率' },
]

// 活动类型
const activityTypes = [
  { key:'NEWER', value:'拉新裂变' },
  { key:'ACTIVE', value:'用户促活' },
  { key:'TRAFFIC', value:'推广引流' },
]

// 组件对应名称
const componentType = {
  BASE_ELEMENT: '基础组件',
  REWARD_ELEMENT: '抽奖组件',
  TASK_ELEMENT: '任务组件',
  PRODUCT_ELEMENT: '产品组件',
  INTERACT_ELEMENT: '互动组件',
}

// 活动页面主题
const themeTypes = [
  { key:'theme1', value:'丹桂黄主题' },
  { key:'theme2', value:'象牙白主题' },
  { key:'theme3', value:'晴空蓝主题' },
]

// 资格任务
const seniorityTypes = [
  { key:'ON_SHARE', value:'分享' },
  { key:'BING_ACCOUNT', value:'小程序端绑定资金账号' },
  { key:'FOCUS_QW', value:'小程序端关注企业微信' },
]

export {
  getValue,
  getKey,
  activityStates,
  positionTypes,
  clickTypes,
  featureTypes,
  elementTypes,
  fundsShowTypes,
  activityTypes,
  componentType,
  themeTypes,
  seniorityTypes
}




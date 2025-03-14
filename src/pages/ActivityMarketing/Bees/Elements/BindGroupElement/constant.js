// 人/次数相关信息
export const MEMBER = [
  {
    label: '组团人数',
    key: 'memberAmount', // 字段
    unit: '', // 单位
    placeholder: '请输入每个团所需组团的人数，最少为3人',
    min: 3,
    max: false, // 无最大值时设置为false
    style: {
      width: '85%'
    },
    require: true, // 是否必填字段
  },
  {
    label: '用户可参团次数',
    key: 'attendLimit',
    unit: '',
    placeholder: '请输入每个用户可参与组团的次数，最少为1',
    min: 1,
    max: false,
    style: {
      width: '85%'
    },
    require: true,
  },
];

// 按钮图片元素信息
export const BTN_IMAGE = [
  {
    label: '邀请好友按钮图',
    key: 'inviteButtonImg',
  },
  {
    label: '抽奖按钮图',
    key: 'drawButtonImg',
  },
  {
    label: '开团按钮图',
    key: 'startGroupButtonImg',
  },
  {
    label: '已获奖按钮图',
    key: 'awardButtonImg',
  },
];

// 按钮图片宽高信息
export const BTN_WH = [
  {
    label: '按钮图片宽',
    key: 'buttonWidth', // 字段
    unit: 'px', // 显示单位
    placeholder: '请输入',
    min: 0,
    max: 750,
    style: {
      width: '20%'
    },
    require: false, // 是否必填字段
  },
  {
    label: '按钮图片高',
    key: 'buttonHeight',
    unit: 'px',
    placeholder: '请输入',
    min: 0,
    max: 750,
    style: {
      width: '20%'
    },
    require: false,
  },
];

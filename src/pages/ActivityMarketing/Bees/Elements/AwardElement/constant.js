import serviceObj from '@/services/serviceObj';

// 表单布局
export const FORM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// 双列布局
export const BOTH_LAYOUT = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

// 生成唯一标识
export const getUniqueKey = () => {
  return Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 );
};

// 领奖组件默认值
export const AWARD_DEF = {
  name: "领奖组件",
  showCount: true, // 领取人次展示
  // virtualCount: 1, // 虚拟领取人次
  countSize: 12, // 领取人次字号
  awardButton: `${serviceObj.defaultImagePath}LJ_LJLQ.png`, // 领奖按钮
  oneMoreButton: `${serviceObj.defaultImagePath}LJ_JXLQ.png`, // 继续领奖按钮
  finishButton: `${serviceObj.defaultImagePath}LJ_YLQ.png`, // 领奖完成按钮
  buttonWidth: 400, // 按钮宽
  buttonHeight: 95, // 按钮高
  prizeName: '奖品包名称', // 奖品包名称
  prizeImg: `${serviceObj.defaultImagePath}HBY_HBT.png`, // 奖品包图片
  paddingTop: 30,
  paddingRight: 30,
  paddingLeft: 30,
  dateType: 'GLOBAL',
  prizes:[],
};

// Input标签元素信息
export const INPUTSUFFIX = {
  name: {
    key: 'name',
    require: true, // 是否必填字段
    label: '组件名称',
    maxLength: 20,
    suffix: false,
  },
  prizeName: {
    key: 'prizeName',
    require: true,
    label: '奖品包名称',
    maxLength: 20,
    suffix: true,
  },
};

// 人/次数相关信息
export const STATISTIC = {
  virtualCount: {
    key: 'virtualCount', // 字段
    require: false, // 是否必填字段
    label: '虚拟领取人次',
    placeholder: '请输入虚拟领取人次',
    min: 0,
    max: false, // 无最大值时设置为false
    style: {
      width: '85%'
    },
    unit: '', // 单位
  },
};

// 元素样式相关信息
export const ELE_STYLE = {
  countSize: {
    key: 'countSize', // 字段
    require: true, // 是否必填字段
    label: '领取人次字号',
    placeholder: '请输入',
    min: 0,
    max: 750,
    style: {
      width: '15%'
    },
    unit: 'px', // 显示单位
  },
  buttonWidth: {
    key: 'buttonWidth',
    require: false,
    label: '按钮宽',
    placeholder: '请输入',
    min: 0,
    max: 750,
    style: {
      width: '30%'
    },
    unit: 'px',
  },
  buttonHeight: {
    key: 'buttonHeight',
    require: false,
    label: '按钮高',
    placeholder: '请输入',
    min: 0,
    max: 750,
    style: {
      width: '30%'
    },
    unit: 'px',
  },
};

// 按钮图片元素信息
export const BTN_IMAGE = {
  awardButton: {
    key: 'awardButton',
    require: true,
    label: '领奖按钮',
    tips: [
      "图片大小建议不大于1M",
    ],
  },
  oneMoreButton: {
    key: 'oneMoreButton',
    require: true,
    label: '继续领奖按钮',
    tips: [
      "用户未成功领取全部奖品的异常状态下展示的按钮图片",
      "图片大小建议不大于1M",
    ],
  },
  finishButton: {
    key: 'finishButton',
    require: true,
    label: '领奖完成按钮',
    tips: [
      "图片大小建议不大于1M",
    ],
  },
  prizeImg: {
    key: 'prizeImg',
    require: true,
    label: '奖品包图',
    tips: [
      "格式：jpg/jpeg/png",
      "建议尺寸：180px*180px",
      "图片大小建议不大于1M",
    ],
  },
  image: {
    key: 'image',
    require: true,
    label: '奖品图',
    tips: [
      "格式：jpg/jpeg/png",
      "180px*180px",
      "图片大小建议不大于1M",
    ],
  },
};

// 奖品项默认值
export const PRIZE_DEF = {
  image: `${serviceObj.defaultImagePath}MRT.png`, // 奖项图
  expireType: 'TIME',
  inventory: 0,
};

// 请求奖品列表时的状态标志
export const PRIZE_MARK = {
  init: 'init', // 初始化
  update: 'update', // 数据更新
  search: 'search', // 搜索
};

// 单选元素信息
export const SINGLE_RADIO = {
  showCount: {
    key: 'showCount',
    require: true, // 是否必填字段
    label: '领取人次展示',
    radioType: [ // 选项类型值
      {
        text: '展示',
        value: true, // 传参值
        valueMapping: 'SHOW', // 渲染选项映射值
      },
      {
        text: '不展示',
        value: false,
        valueMapping: 'NONE',
      },
    ],
  },
};

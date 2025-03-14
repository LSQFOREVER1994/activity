import moment from 'moment';

export const DEFAULT_PAGE_STYLE = {
        width: 375,
        height: 718,
        opacity: 1,
        backgroundColor: 'rgba(241, 241, 241, 1)',
        backgroundLayout:'ORIGINAL',
        layout:'FREEDOM',
      }
export const addDefaultObj = {
  elements: [],
  id: '', // 活动ID
  name: `我的活动${moment().format( 'YYYYMMDDHHmmss' )}`, // 活动名称
  timeType: false,
  appointDateType:'DAILY',
  appointDate:[],
  appointTimeType:'ALL_DAY',
  appointTime:[
    {
      startTime:'07:00',
      endTime:'11:00',
    },
  ],
  // activityType: undefined, // 活动类型
  startTime: '', // 开始时间
  endTime: '', // 结束时间
  notStartTip:'活动暂未开始', // 活动未开始提示语
  endTip: '活动已结束', // 活动结束提示语
  state: 'ENABLE', // 活动状态
  pauseTip: '', // 活动暂停提示语
  rules: '', // 活动规则
  buryPointId: '', // 埋点统计
  backgroundImage: '', // 页面背景图
  backgroundColor: 'rgba(241, 241, 241, 1)', // 页面背景色
  shareTitle: '', // 分享标题
  shareDescription: '', // 分享描述
  shareLink: '', // 分享链接
  shareImage: '', // 分享图片
  withoutEmpty: true, // 0库存奖品概率是否移除
  isLoading: false, // 保存后加载
  theme: 'theme1',
  terminalType: 'APP',
  customerType: 'MOBILE',
  buryEnable: true,
  pages: [
    {
      key: 'first-one',
      style:DEFAULT_PAGE_STYLE,
      enablePageTurning: false,
      pageTurningMethod:'UP_AND_DOWN',
      pageTurningType:'common',
      autoPageTurning: false,
      autoPageTime:'',
    },
  ],
  drawSetting: {
    dailyClear: true,
    dailyType: 'NATURAL',
    removeZeroStock: true,
    initCount: 0, // 初始化次数
    dailyCount: 0, // 每日免费次数
    enableTidal: false, // 是否开启潮汐概率
    tidalProbability: 0, // 潮汐概率
    tidalTime: [
      {
        startTime:'07:00',
        endTime:'11:00',
      },
    ], // 潮汐时间
  },
};

// 默认组合数据
export const DEFAULT_GLOUP = {
  id: '',
  component: 'GROUP',
  type: 'GROUP',
  label: '组合',
  animations: [],
  events: [{}],
  isLock: false,
  isView: true,
  style: {
    rotate: 0,
    opacity: 1,
  },
  propValue: {
    componentIds: [],
    groupStyle: {},
  },
};

export const DEFAULT_ANIMATION = {
  animationTime: 1,
  label: '',
  value: '',
};
export default {};

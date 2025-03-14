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
// 补发状态
const reissueStatus = [
  { key:'FINISH', value:'补发完成' },
  { key:'PART_FINISH', value:'部分补发' },
  { key:'FAIL', value:'失败' },
  { key:'PROCESSING', value:'处理中' },
  { key:'AWAIT', value:'待补发' }
]
// 补发类型
const reissueTypes = [
  { key:'COUNT', value:'次数' },
  { key:'INTEGRAL', value:'积分' },
  { key:'PRIZE', value:'奖品' },
  { key:'TASK', value:'任务' },
]

// 下拉列表统一配置管理
const selectOptionConfig = {
  task: { // 任务列表下拉
    optionId: 'id',
    optionValue: 'name'
  },
  activityNames: { // 活动名称下拉
    optionId: 'id',
    optionValue: 'name'
  },
  openPrizeType: { // 旧模式奖品类型
    optionId: 'rightTypeId',
    optionValue: 'rightTypeName'
  },
  openPrize: { // 旧模式选择奖品
    optionId: 'rightId',
    optionValue: 'rightName'
  },
  rightMerchant: { // 新模式商户
    optionId: 'code',
    optionValue: 'name'
  },
  rightPrize: { // 新模式奖品
    optionId: 'productId',
    optionValue: 'productName'
  }
}
export {
  getValue,
  selectOptionConfig,
  getKey,
  reissueStatus,
  reissueTypes,
}

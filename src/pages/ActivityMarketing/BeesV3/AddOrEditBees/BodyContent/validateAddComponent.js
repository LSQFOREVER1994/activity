/* eslint-disable consistent-return */
/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-08-22 15:50:15
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-22 17:52:00
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/BeesV3/AddOrEditBees/BodyContent/validateAddComponent.js
 */

import { message } from 'antd';

// 定义组件验证规则，包括组件名称和允许的最大数量 以及 自定义校验函数
const validationRules = {
  INVITE: {
    name: '邀请组件',
    count: 1,
  },
  // IMAGE: {
  //   name: '图片组件',
  //   count: 3,
  //   // validateFunc: ( allComponents ) => {}
  // },
};
/**
 * 验证是否可以添加特定类型的组件到活动页面中
 * @param {Object} domData - 包含所有页面数据的对象
 * @param {string} currentComponentType - 当前要添加的组件类型
 * @returns {boolean} - 如果可以添加组件则返回 true，否则返回 false
 */

function validateAddComponent( domData, currentComponentType ) {
  const { pages } = domData || {}; // 获取活动中所有页面组件
  
  const currentComponentRule = validationRules[currentComponentType]; // 获取当前组件的验证规则
  if ( !currentComponentRule ) return true; // 如果不存在该组件的验证规则，则默认返回 true

  // 获取活动中所有页面的所有组件
  const allComponents = pages.reduce( ( pre, cur ) => {
    const curComponents = cur.componentData || [];
    return [...pre, ...curComponents];
  }, [] );

  const { count, name, validateFunc } = currentComponentRule; 

  // 如果存在自定义的验证函数，且验证不通过，则返回 false
  if( validateFunc && Object.prototype.toString.call( validateFunc ) === '[object Function]' ) {
    if( !validateFunc( allComponents ) ) {
      return false;
    }
    return true;
  }

  // 筛选出当前类型的组件
  const matchingComponents = allComponents.filter(
    component => component.type === currentComponentType
  );

  // 判断符合条件的组件数量是否超过了规定的最大值
  if ( matchingComponents.length + 1 > count ) {
    message.error( `活动中 ${name} 最多只能存在 ${count} 个` );
    return false;
  }
  
  return true;
}

export default validateAddComponent;

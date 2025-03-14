/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-07-27 09:22:49
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-07-30 17:32:30
 * @FilePath: /data_product_cms_ant-pro/src/pages/Home/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import styles from './index.less';
import homeBg from '@/assets/xdHomePageImg.png';

export default ()=>(
  <div className={styles.box}>
    <img src={homeBg} alt="" />
    <div>v1.0.0</div>
  </div>
)
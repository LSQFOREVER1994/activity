
import React from 'react';
import Link from 'umi/link';
import styles from './index.less';

const activityIcon = require( '../../../src/assets/activityIcon.png' )
const userImage = require( '../../../src/assets/users.png' )
const couponsIcon = require( '../../../src/assets/couponsIcon.png' )
const operationIcon = require( '../../../src/assets/operationIcon.png' )
const rewardIcon = require( '../../../src/assets/rewardIcon.png' )

const CommomCom = (  ) => {


  const list = [
    {
      name: '活动模版库', img: rewardIcon, link: '/oldActivity/activityLibrary',
    },
    {
      name: '万能活动页', img: activityIcon, link: '/oldActivity/activity',
    },
    {
      name: '优惠券管理', img: couponsIcon, link: '/coupons/manage',
    },
    {
      name: '资源位管理', img: operationIcon, link: '/tool/banner',
    },
    {
      name: '用户行为', img: userImage, link: '/statistics/user/trends',
    },

  ]
  return (
    <div className={styles.common}>
      {list.map( item => (
        <Link className={styles.common_item} key={item.name} to={item.link}>
          <div className={styles.common_item_img_box}>
            <img src={item.img} alt='' />
          </div>
          <div>{item.name}</div>
        </Link>
      ) )}
    </div>
  );
};
export default CommomCom;



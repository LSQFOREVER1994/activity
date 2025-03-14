/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/*
 * @Author: RidingWind
 * @Date: 2021-07-20 13:36:38
 * @Last Modified by: 绩牛信息 - YANGJINGRONG
 * @Last Modified time: 2023-04-03 14:07:02
 */

import React, { useEffect, useRef } from 'react';
import { setScaleFunc } from '../index';
import styles from './index.less';

const headAvatar = require( './assets/images/tuanzhang.png' );
const noneMember = require( './assets/images/none_member.png' );

function Index( props ) {
  const { memberAmount, inviteButtonImg, style:{ textColor }, id, style }= props
  const itemEl = useRef( null );
  const renderMemberBox = () => { // 渲染拼团人数
    const artificialList = [];
    for ( let i = 0; artificialList.length < memberAmount; i += 1 ) {
      artificialList.push( i );
    }
    return (
      <div className={styles.groupWrap}>
        <div className={styles.groupBox}>
          {
            artificialList.map( ( item ) => (
              <div className={`${styles.memeberItem}`} key={item.id}>
                <div className={`${styles.avaterBox} ${item === 0 ? styles.selectAvaterBox : ''}`}>
                  <img src={item === 0 ? headAvatar : noneMember} alt="" />
                  {item === 0 && <div className={styles.isHead}>团长</div>}
                  {item !== 0 && <div className={styles.noIsHead}>待邀请</div>}
                </div>
              </div>
            ) )
          }
        </div>
      </div>
    );
  }

  const renderBindBtn = () => {

    return (
      <div className={styles.bottomBox}>
        <img src={inviteButtonImg} alt="" className={styles.inviteButtonImg} />
        <div className={styles.myGroup} style={{ color:textColor }}>查看我的拼团记录</div>
      </div>
    );
  }
  const renderBindGroup = () => {
    // 渲染拼团内容
    
    return (
      <div className={styles.bindGroupBox}>
        <div style={{ color: textColor }} className={styles.memberAmount}>已拼/成团人数：1/{memberAmount}</div>
        {renderMemberBox()}
        {renderBindBtn()}
      </div>
    );
  }


  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );
  

  return (
    <div className={styles.main} ref={itemEl} id={id}>
      {renderBindGroup()}
    </div>
  );
}


export default Index

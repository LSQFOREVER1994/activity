/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useContext } from 'react';
import styles from './index.less';
import { CommonOperationFun } from '../../provider.js'

import { setScaleFunc } from '../index';

export default function Answer( props ) {
  const { startButton, showRemainingValue, style, drawConsumeType, id } = props;
  const { integralOtherName } = useContext( CommonOperationFun )
  const itemEl = useRef( null );
  const leftCountTxt = `登录后查看${drawConsumeType === 'INTEGRAL' ?  ( integralOtherName || '积分' ) : '次数'}`; // 未登录状态展示

  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  return (
    <div className={styles.main} ref={itemEl} id={id}>
      <div className={styles.startBox}>
        <img src={startButton} alt="" className={styles.startBtn} />
        {showRemainingValue && <div className={styles.leftCount}>{leftCountTxt}</div>}
      </div>
    </div>
  );
}

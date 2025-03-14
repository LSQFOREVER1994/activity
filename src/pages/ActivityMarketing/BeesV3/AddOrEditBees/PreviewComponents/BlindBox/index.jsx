/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useContext } from 'react';
import styles from './index.less';
import { CommonOperationFun } from '../../provider.js'
import { setScaleFunc } from '../index';

function BlindBox( props ) {
  const { buttonHeight, boxBefore, showRemainingValue, buttonBefore, showLeftCountType, drawConsumeType, style, id } = props;
  const itemEl = useRef( null );
  const { integralOtherName } = useContext( CommonOperationFun )
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );
  const leftCount = `登录后查看${drawConsumeType === 'INTEGRAL' ? ( integralOtherName || '积分' ) : '次数' }`; // 未登录状态展示
  return (
    <div className={styles.main} ref={itemEl} id={id}>
      {boxBefore ? <img src={boxBefore} alt="" className={styles.boxBefore} /> : null}
      <div className={styles.btnBox}>
        {buttonBefore ? (
          <img
            src={buttonBefore}
            alt=""
            style={{ height: `calc(${buttonHeight * 2} / 32 * 1rem )` }}
          />
        ) : null}
        { showLeftCountType === 'CORNER_MARK' && showRemainingValue && <div className={styles.cornerMark}>0</div> }
      </div>
      {showLeftCountType==='TEXT' && showRemainingValue && <div className={styles.leftCount}>{leftCount}</div>}
    </div>
  );
}

export default BlindBox;

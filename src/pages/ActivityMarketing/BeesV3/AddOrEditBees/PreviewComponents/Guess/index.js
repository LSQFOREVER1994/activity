/* eslint-disable import/no-cycle */
import React, { useRef, useEffect } from 'react';
import { setScaleFunc } from '../index';
import DigitalRoll from './DigitalRoll/DigitalRoll';
import ProgressBar from './ProgressBar/ProgressBar';
import CountDown from './CountDown/CountDown';
import styles from './index.less';


function Guess( props ) {
  const { fallButtonImage, riseButtonImage, id, title, baseScore, countDownOpen, style } = props;
  const itemEl = useRef( null );

  // 动画容器加载
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  return (
    <div id={id} className={styles.main} title={title} ref={itemEl}>
      {/* 积分 */}
      <div className={styles.integral}>
        <div className={styles.digitalBox}>
          <DigitalRoll rollNumber={baseScore || '000000'} />
        </div>
      </div>
      {/* 积分 */}
      <div className={styles.contentBox}>
        <div className={styles.info}>
          <div className={styles.points}>
            <span>上证指数:</span>
            <span>3249.18 3.50%</span>
          </div>
          <div className={styles.count}>
            <span>积分:</span>
            <span>5000</span>
          </div>
        </div>
        <div className={styles.title}>
          <span>3月16日上证指数收盘是涨还是跌</span>
        </div>
        <div className={styles.progressBar}>
          <ProgressBar leftPercent={70} animation />
        </div>
        <div className={styles.btnBox}>
          <img src={riseButtonImage} className={styles.riseBtn} alt="" />
          <img src={fallButtonImage} className={styles.fallBtn} alt="" />
        </div>
        {
          countDownOpen &&
          <div className={styles.countDown}>
            <span className={styles.label}>距离本期竞猜截止:</span>
            <div><CountDown /></div>
          </div>
        }
      </div>
    </div>
  );
}

export default Guess;

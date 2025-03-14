/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import { setScaleFunc } from '../index';

const sLive = require( '../../../assets/img/s-live.png' );
const ballBtn = require( '../../../assets/img/ball-btn.png' );

function Video( props ) {
  const { cover, url, isShowLike, virtualLike, virtualView, isShowView, enable, style, id } = props;
  // 数字展示单位转换
  const tranNumber = ( num, point ) => {
    // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
    const numStr = num.toString().split( '.' )[0];
    if ( numStr.length < 5 ) {
      // 判断数字有多长,如果小于5,,表示1万以内的数字,让其直接显示
      return numStr;
    }
    if ( numStr.length >= 5 && numStr.length <= 8 ) {
      // 如果数字大于5位,小于8位,让其数字后面加单位万
      const decimal = numStr.substring( numStr.length - 4, numStr.length - 4 + point );
      // 由千位,百位组成的一个数字
      return `${parseFloat( `${parseInt( num / 10000, 10 )}.${decimal}` )}万`;
    }
    if ( numStr.length > 8 ) {
      // 如果数字大于8位,让其数字后面加单位亿
      const decimal = numStr.substring( numStr.length - 8, numStr.length - 8 + point );
      return `${parseFloat( `${parseInt( num / 100000000, 10 )}.${decimal}` )}亿`;
    }
    return 0;
  };

  const itemEl = useRef( null );
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );
  return (
    <div className={styles.main} ref={itemEl} id={id}>
      <div className={styles.videoBox}>
        <video src={url} controls poster={cover} />
        {( isShowLike || isShowView || enable ) && (
          <div className={styles.videoBottomBox}>
            <div className={styles.bottomItem}>
              {isShowLike && (
                <div className={`${styles.videoItem}`}>
                  <div className={`${styles.pickUp}`} />
                  <div>{tranNumber( virtualLike || 0, 1 )}</div>
                </div>
              )}
              {isShowView && (
                <div className={styles.videoItem}>
                  <img src={sLive} alt="" className={styles.sLive} />
                  <div>{tranNumber( virtualView || 0, 1 )}</div>
                </div>
              )}
            </div>
            <div className={styles.bottomItem}>
              {enable && (
                <div className={styles.barrage_option}>
                  <div className={styles.videoItem}>
                    <img src={ballBtn} alt="" className={styles.ballBtn} />
                  </div>
                  <div className={styles.sendBox}>
                    <input type="text" placeholder="点击发弹幕" />
                    <div className={styles.sendBtn}>发送</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Video;

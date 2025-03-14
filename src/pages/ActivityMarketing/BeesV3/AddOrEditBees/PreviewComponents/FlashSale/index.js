/* eslint-disable import/no-cycle */
import React, { useEffect, useRef } from 'react';
import styles from './index.css';
import { setScaleFunc } from '../index';

export default function ETFEnroll( props ) {
  const { enrollButton, style, id, shopId, shopName, description, backgroundImage, beforeButton, inStockButton, outStockButton, endButton,
    spikePrice, originalPrice, startTime, endTime, mallActId, payModel,
    colors: {
      countDownColor, nameColor, originalPriceColor, presentPriceColor, describeColor,
    }, } = props;
  const itemEl = useRef( null );
  
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width] );

  const mathNum = ( num ) => {
    return ( num * 1000 ).toFixed( ( ( `${num}` ).length-5 ) < 0 ? 0 : ( ( `${num}` ).length-5 ) )
  }
  
  return (
    <div className={styles.main} ref={itemEl} id={id}>
      <img src={backgroundImage} alt="" />
      <div className={styles.box}>
        <div className={styles.name} style={{ color: nameColor }}>{shopName || "商品名称"}</div>
        <div className={styles.content}>
          {
            payModel === 2 ? 
              <div className={styles.moneyBox}>
                <span style={{ color: presentPriceColor }}>服务佣金</span>
                <span style={{ color: presentPriceColor }}>{mathNum( spikePrice )}‰</span>
                <span style={{ color: originalPriceColor }}>
                  {mathNum( originalPrice )}‰
                </span>
              </div> :
              <div className={styles.moneyBox}>
                <span style={{ color: presentPriceColor }}>￥</span>
                <span style={{ color: presentPriceColor }}>{spikePrice||12}</span>
                <span style={{ color: originalPriceColor }}>
                  ￥
                  {originalPrice|| 14}
                </span>
              </div> 
            }
          <img className={styles.btn} src={beforeButton} alt="" />
        </div>
        {
          <div className={styles.timeBox}>
            <span style={{ color: countDownColor }}>1天1时1分1秒</span>
            <span>后开始</span>
          </div>
        }

        <div className={styles.desc} style={{ color: describeColor }}>{description||'商品描述'}</div>
      </div>
    </div>
  );
}
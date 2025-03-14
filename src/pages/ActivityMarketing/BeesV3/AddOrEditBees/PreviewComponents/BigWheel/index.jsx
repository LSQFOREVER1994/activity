/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React, { useMemo, useRef, useEffect, useContext } from 'react';
import { CommonOperationFun } from '../../provider.js'
import styles from './index.less';
import { setScaleFunc } from '../index';

function BigWheel( props ) {
  const { borderImg, prizes: oldPrizes, drawButton, showRemainingValue, drawConsumeType, style, id, colors } = props;
  const defaultColors = {
    pannelColor1 : "rgba(255, 245, 211, 1)",
    pannelColor2 : "rgba(255, 255, 253, 1)",
    pennelDivideColor : "rgba(255, 146, 102, 1)",
    prizeTextColor :'rbga(255, 97, 58,1)',
    textColor : "rgba(83,83,83,1)",
  };

  const {
    pannelColor1,
    pannelColor2,
    pennelDivideColor,
    prizeTextColor,
    textColor,
  } = colors || defaultColors

  const { integralOtherName } = useContext( CommonOperationFun )
  const prizes = useMemo( () => {
    const arr = [];
    oldPrizes.forEach( info => {
      if ( info && info.itemPosition ) {
        const keys = info.itemPosition.split( ',' );
        keys.forEach( item => {
          arr[+item - 1] = {
            ...info,
            itemPosition: item,
          };
        } );
      }
    } );
    return arr;
  }, [oldPrizes] );


  const leftCountTxt = `登录后查看${drawConsumeType === 'INTEGRAL' ? ( integralOtherName || '积分' ) : '次数'}`; // 未登录状态展示
  const itemEl = useRef( null );

  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  return (
    <div className={styles.turn_box} ref={itemEl} id={id}>
      <div className={styles.turnTableBox}>

        <div className={styles.turnTableItemBox}>
          {!!prizes &&
            !!prizes.length &&
            prizes.map( ( item, index ) => (
              <div
                className={`${styles.turnTableItem}`}
                style={{
                  transform: `rotate(${index * -( 360 / prizes.length )}deg) skewY(${90 -
                    360 / prizes.length}deg)`,
                  borderColor: pennelDivideColor,
                  background:
                    index % 2
                      ? pannelColor1
                      : pannelColor2,
                }}
                key={item.itemName + index}
              >
                <div
                  className={styles.textBox}
                  style={{ transform: `skewY(${-( 90 - 360 / prizes.length )}deg) rotate(-30deg)` }}
                >
                  <span style={{ color: prizeTextColor }}>
                    {item.itemName}
                  </span>
                  <img src={item.image} alt="" />
                </div>
              </div>
            ) )}
        </div>
        <img
          src={borderImg}
          alt=""
          style={{ height: borderImg ? null : '375px' }}
          className={styles.turnTableBg}
        />
        <img src={drawButton} alt="" className={styles.drawBtn} />
      </div>
      <div className={styles.showCount} style={{ justifyContent: 'center' }}>
        {showRemainingValue && <div style={{ color: textColor }}>{leftCountTxt}</div>}
      </div>
    </div>
  );
}
export default BigWheel;

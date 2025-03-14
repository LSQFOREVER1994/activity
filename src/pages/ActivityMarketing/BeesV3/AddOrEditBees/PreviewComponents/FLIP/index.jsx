/* eslint-disable react/no-array-index-key */
/*
 * @Author       : ZQ
 * @Date         : 2023-11-23 14:19:19
 * @LastEditors  : ZQ
 * @LastEditTime : 2023-12-19 11:17:24
 */
/* eslint-disable import/no-cycle */
import React, { useMemo, useEffect, useRef, useContext } from 'react';
import { setScaleFunc } from '../index';
import { CommonOperationFun } from '../../provider.js'
import CardItem from './item'
import styles from './index.css';

const heightObj = {
  '3':'calc(262 / 32 * 1rem)',
  '6':'calc(554 / 32 * 1rem)',
  '9':'calc(846 / 32 * 1rem)'
}

function GridWheel( props ) {
  const {
    showRemainingValue,
    prizes: oldPrizes,
    style,
    drawConsumeType,
    startFlipButton,
    cardBehind,
    cardFront,
    id,
    number,
  } = props;
  const itemEl = useRef( null );
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


  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  const leftCountTxt = `登录后查看${drawConsumeType === 'INTEGRAL' ? ( integralOtherName || '积分' ) : '次数' }`; // 未登录状态展示

  return (
    <div className={styles.turn_box} ref={itemEl} id={id}>
      <div className={styles.cardContent} style={{ height:heightObj[String( number )], minHeight:heightObj[String( number )] }}>
        {new Array( Number( number ) ).fill( '' ).map( ( item, index ) => {
          return  (
            <CardItem
              key={index}
              cardConfig={prizes[index]}
              cardFront={cardFront}
              cardBehind={cardBehind}
            />
          )
        } )}
      </div>
      <div className={styles.startButtonBox}>
        <img className={styles.startButtonImg} src={startFlipButton} alt="" />
      </div>
      <div className={styles.showCount}>
        {showRemainingValue && <div>{leftCountTxt}</div>}
      </div>
    </div>
  );
}
export default GridWheel;

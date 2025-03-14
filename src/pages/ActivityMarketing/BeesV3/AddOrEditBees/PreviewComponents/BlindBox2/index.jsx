/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef } from 'react';
import styles from './index.less'
import { setScaleFunc } from '../index';

function BlindBox2( props ) {
  const { boxNumber, boxBefore, id, style  } = props;
  const itemEl = useRef( null );
  const leftCount = '登录后查看次数'; // 未登录状态展示

  const renderBlindBoxCon = () => {
    const basic = Math.ceil( boxNumber / 2 );
    const boxRow = Array.from( { length: 2 }, () => ( {} ) );
    const boxCol = Array.from( { length: basic }, () => ( {} ) );
    const boxDom = boxRow.map( ( item, row ) => (
      <div key={`blindbox2row${row}`} className={styles.boxCon}>
        {boxCol.map( ( _, col ) => {
          const key = col + basic * row;
          return (
            <div key={`blindbox2col${key}`} className={styles.imgBox}>
              <img src={boxBefore} className={styles.boxBefore} alt="" />
            </div>
          );
        } )}
      </div>
    ) );
    return boxDom;
  };

  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  return(
    <div id={id}>
      { renderBlindBoxCon() }
      <div className={styles.leftCount}>{leftCount}</div>
    </div>

  )
}

export default BlindBox2;

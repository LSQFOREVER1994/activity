/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { CommonOperationFun } from '../../provider.js'
import styles from './index.less'
import { setScaleFunc } from '../index';

const HitEgg = ( props ) => {
    const { eggsImages, showType, bottomImage, showRemainingValue, drawConsumeType, prizeObj, showPrize, hammerImages, style, id, colors } = props;
    const [ hitIndex, setHitIndex ] = useState( -1 );
    const [ harmerIndex, setHarmerIndex ] = useState( 0 );
    const { integralOtherName } = useContext( CommonOperationFun )
    const leftCountTxt = `登录后查看${drawConsumeType === 'INTEGRAL' ?  ( integralOtherName || '积分' ) : '次数'}`; // 未登录状态展示

    const defaultColors = { textColor: 'rgba(83,83,83,1)' };
    const { textColor } = colors || defaultColors;

    // 锤子轮流
    const setTimeOutHarmer =  () => {
    if ( !showPrize && !prizeObj ) {
      setHarmerIndex( harmerIndex < 2 ? harmerIndex + 1 : 0 )
      setTimeout( setTimeOutHarmer, 3000 );
    }
    }
    const itemEl = useRef( null );

    useEffect( ()=>{
        setTimeOutHarmer();
    }, [] )

    useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );


    return (
      <div className={styles.main} ref={itemEl} id={id}>
        {/* 金蛋静态图 */}
        <div>
          <div className={styles.eggCon}>
            {eggsImages && eggsImages.length > 0 && eggsImages.map( ( item, index ) => (
              <div key={index} className={showType === 'cone' && index === 1 ? styles.eggConItemB : styles.eggConItem}>
                <img
                  className={showType === 'cone' && index === 1 ? styles.eggbottomImgB : styles.eggbottomImg}
                  src={bottomImage}
                  alt=""
                />
                <img
                  className={`${showType === 'cone' && index === 1 ? styles.eggImgB : styles.eggImg} ${index === hitIndex ? styles.eggImgActive : ''}`}
                  src={item}
                  alt=""
                />
                {( hitIndex >= 0 && hitIndex === index )
                  || ( hitIndex < 0 && harmerIndex === index )
                  ? <img className={showType === 'cone' && index === 1 ? styles.hammerImageB : styles.hammerImage} src={hammerImages} alt="" /> : ''}
              </div>
            ) )}
          </div>
        </div>

        {showRemainingValue
          && <div className={styles.leftCount} style={{ color: textColor }}>{leftCountTxt}</div>}
      </div>
    );
}

export default HitEgg;

/*
 * @Author: ZHANG_QI
 * @Date: 2023-08-18 09:06:39
 * @LastEditors: ZHANG_QI
 * @LastEditTime: 2023-09-04 11:32:14
 */
import React, { useContext, useEffect, useState } from "react";
import styles from './index.less'
import { CurrentPages } from '../../../provider';

function Grid( { showRulerGrid } ) {
  const [currentPages] = useContext( CurrentPages );
  const { backgroundColor = 'rgba(241, 241, 241, 1)', backgroundImage, opacity, backgroundLayout='ORIGINAL' } = currentPages.style
  const [backgroundStyle, setBackgroundStyle] = useState( '' )

  useEffect( () => {
    if( backgroundLayout === 'ORIGINAL' ){
      setBackgroundStyle( `url(${backgroundImage}) no-repeat 0 0 / 100%, ${backgroundColor}` )
    } else if( backgroundLayout === 'TILE' ){
      setBackgroundStyle( `url(${backgroundImage}) repeat 0 0 / 100%, ${backgroundColor}` )
    }else if( backgroundLayout === 'STRETCH' ){
      setBackgroundStyle( `url(${backgroundImage}) no-repeat 0 0 / 100% 100%, ${backgroundColor}` )
    }
  }, [backgroundLayout, backgroundImage, backgroundColor] )
    return (
      <svg
        className={styles.gridWrap}
        style={{
        opacity,
        background:backgroundStyle,
      }}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* <pattern
            id="smallGrid"
            width="7.236328125"
            height="7.236328125"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 7.236328125 0 L 0 0 0 7.236328125"
              fill="none"
              stroke="red"
              strokeWidth="1"
            />
          </pattern> */}
          <pattern
            id="grid"
            width="50px"
            height="50px"
            patternUnits="userSpaceOnUse"
          >
            {/* <rect width="36.181640625" height="36.181640625" fill="url(#smallGrid)" /> */}
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              style={{ strokeDasharray: '5' }}
              stroke="rgb(147,160,168,.8)"
              strokeWidth="1px"
            />
          </pattern>
        </defs>
        {
          showRulerGrid.grid && <rect width="100%" height="100%" fill="url(#grid)" />
        }

      </svg>
    )
}
export default Grid
/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from 'react';
import { setScaleFunc } from '../index';
import styles from './index.css'

function Image( props ) {
  const { propValue, style, id, imageShowStyle } = props;
  const [imgShowStyle, setImgShowStyle] = useState( [] )
  const itemEl = useRef( null );

  // 不同图片展示模式的枚举
  const showTypeEnums = {
    'WIDTH_MATCH':{ backgroundSize:'100% auto', backgroundRepeat:'no-repeat' },
    'HIGHT_MATCH':{ backgroundSize:'auto 100% ', backgroundRepeat:'no-repeat' },
    'DRAW':{ backgroundSize:'100% 100%' },
    'TILE':{ backgroundSize:'100%', backgroundRepeat:'repeat' }
  }

  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height, propValue?.image] );

  useEffect( () => {
    setImgShowStyle( showTypeEnums[imageShowStyle] )
  }, [imageShowStyle] )

  return (
    <div
      id={id}
      className={styles.img}
      style={propValue.image ?
        {
          ...style,
          backgroundImage: `url(${propValue.image})`,
          ...imgShowStyle
        }
        : {}}
      ref={itemEl}
    />
  );
}

export default Image;

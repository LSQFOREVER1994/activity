/* eslint-disable import/no-cycle */
import React, { useEffect, useRef } from 'react';
import styles from './index.less';
import { setScaleFunc } from '../index';

export default function ETFEnroll( props ) {
  const { enrollButton, style, id } = props;
  const itemEl = useRef( null );
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width] );
  return (
    <div className={styles.main} ref={itemEl} id={id}>
      <div className={styles.enrollButton}>
        <img src={enrollButton} alt="" />
      </div>
    </div>
  );
}

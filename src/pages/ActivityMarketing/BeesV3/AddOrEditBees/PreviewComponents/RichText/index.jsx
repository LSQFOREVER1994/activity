/* eslint-disable import/no-cycle */
import React, { useRef, useEffect } from 'react';
import styles from './index.less';

function Text( props ) {
   const { style, id, propValue, changeValue } = props;
   const itemEl = useRef( null )
   useEffect( ()=>{
    const itemWrap = itemEl.current;
    if( itemWrap ){
      const { height } = itemWrap.getBoundingClientRect();
      if( changeValue ) changeValue( id, height, 'style.height' );
    }
    
   }, [propValue.text] )
    return (
      <div className={`${styles.vText} ${styles.preview}`} id={id} ref={itemEl}>
        <div className={styles.textBox} style={{  verticalAlign: style.verticalAlign }} dangerouslySetInnerHTML={{ __html: propValue.text }} />
      </div>
    );
}

export default Text


import React from 'react';
import styles from './index.less';

const Title = ( props ) => {
  return (
    <div className={styles.title} style={props.style || {}}>
      <div className={styles.title_name}>
        {props.name}
      </div>
      {props.children}
    </div>
  );
};
export default Title;

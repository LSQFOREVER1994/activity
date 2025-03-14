import React from 'react';
import DigitalItem from './DigitalItem/DigitalItem';
import styles from './digitalRoll.css';

function DigitalRoll( props ) {
  const {
    rollNumber, style, childrenStyle, duration,
  } = props;
  const numArr = rollNumber.toString().padStart( 7, 0 ).split( '' );
  return (
    <div className={styles.digitalContainer} style={{ ...style }}>
      {numArr.map( ( item, index ) => (
        <DigitalItem
          rollNumber={rollNumber}
          duration={duration}
          num={item}
          index={index}
          key={index}
          childrenStyle={childrenStyle}
        />
      ) )}
    </div>
  );
}

export default DigitalRoll;

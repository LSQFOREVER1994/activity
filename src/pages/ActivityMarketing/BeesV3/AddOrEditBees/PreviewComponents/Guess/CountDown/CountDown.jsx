import React from 'react';
import styles from './countdown.css';

const timeMap = {
  day: '天',
  hours: '时',
  minutes: '分',
  seconds: '秒',
};

const remainingTime = {
  day: '00',
  hours: '00',
  minutes: '00',
  seconds: '00',
}

export default function(){
  return(
    <div className={styles.countdown_container}>
      {Object.keys( remainingTime ).map( ( key, index ) => (
        <div key={index} className={styles.countdown_item}>
          <div>{remainingTime[key].toString().padStart( 2, '0' )}</div>
          <span>{timeMap[key]}</span>
        </div>
      ) )}
    </div>
  )
}




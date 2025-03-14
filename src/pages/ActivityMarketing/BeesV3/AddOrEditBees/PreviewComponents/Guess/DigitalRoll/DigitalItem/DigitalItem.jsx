import React, { useEffect, useState } from 'react';
import styles from './digitalItem.css';

let timer = null;

function DigitalItem(props) {
  const [flag, setFlag] = useState(false);
  const {
    index, num, childrenStyle, duration,
  } = props;

  // 控制滚动时长
  useEffect(() => {
    // 每一个数字动画必上一个晚一点出现数字
    const durationTime = duration || 1000;
    const totalTime = index * 300 + durationTime;
    timer = setTimeout(() => {
      setFlag(true);
    }, totalTime);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  /* function getAnimationTime() {

  } */

  return (
    <div className={styles.digitalBox} style={{ ...childrenStyle }}>
      <ul
        style={{ '--data-index': num }}
        className={`${!flag ? styles.digitalItem : styles.digitalEnd}`}
      >
        {Array.from(Array(10), (_, ind) => (
          <li key={ind}>{ind}</li>
        ))}
        {Array.from(Array(10), (_, ind) => (
          <li key={Math.random().toString(36).slice(2, 6)}>{ind}</li>
        ))}
      </ul>
    </div>
  );
}

export default DigitalItem;

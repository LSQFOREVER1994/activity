import React from 'react';
import styles from './progressBar.css';

function ProgressBar( props ) {
  const {
    style, leftPercent, animation, leftColor, rightColor,
  } = props;
  return (
    <div
      className={styles.bar}
      style={{ ...style, '--data-percent': 100 - leftPercent, background: leftColor }}
    >
      <div className={styles.left}>{`${leftPercent}%`}</div>
      <div
        className={`${styles.right} ${animation ? styles.showAni : ''}`}
        style={{ background: rightColor }}
      >
        {`${100 - leftPercent}%`}
      </div>
    </div>
  );
}

export default ProgressBar;

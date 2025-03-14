/*
 * @Author       : ZQ
 * @Date         : 2023-11-27 09:17:07
 * @LastEditors  : ZQ
 * @LastEditTime : 2023-12-19 10:18:00
 */
import React from 'react'
import styles from './item.css'


export default function item( props ) {
  const { cardFront, cardBehind, cardConfig } = props;
  const { image, itemName } = cardConfig || {}

  return (
    <div className={styles.flip_container}>
      <div 
        className={styles.flipper}
      >
        <div className={styles.front} style={{ backgroundImage:`url(${cardFront})` }}>
          <img className={styles.prizeImg} src={image} alt="" />
          <span className={styles.prizeName}>{itemName}</span>
        </div>
        <div className={styles.back}>
          <img src={cardBehind} alt="" />
        </div>
      </div>
    </div>
  )
}

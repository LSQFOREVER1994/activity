/*
 * @Author: ZHANG_QI
 * @Date: 2023-08-28 13:41:35
 * @LastEditors: ZHANG_QI
 * @LastEditTime: 2023-08-29 11:56:29
 */
import React from 'react'
import { LikeSvg, LoveSvg, FlowerSvg } from './likeIcons'
import styles from './index.less'

function Like( {
  id,
  likeStyle,
  likeIcon,
  likeColor,
  customLikeIcon,
  initLikeCount,
  showLikeCount,
  style
} ) {
  const typeToSvg = {
    like: <LikeSvg color={likeColor} width='100%' height='100%' />,
    love: <LoveSvg color={likeColor} width='100%' height='100%' />,
    flower: <FlowerSvg color={likeColor} width='100%' height='100%' />,
  }

  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }} id={id}>
      <div className={styles.icon_container}>
        {
          likeStyle === 'DEFAULT' && <div className={styles.icon}>{typeToSvg[likeIcon]}</div>
        }
        {
          likeStyle === 'CUSTOM' && customLikeIcon &&
          <img className={styles.active_img} src={customLikeIcon} alt="" />
        }
        {showLikeCount && <div id='initLikeCount' className={styles.like_count}>{initLikeCount > 999 ? '999+' : initLikeCount}</div>}
      </div>
    </div>
  )
}

export default Like

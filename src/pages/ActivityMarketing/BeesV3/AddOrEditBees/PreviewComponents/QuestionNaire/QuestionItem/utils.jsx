/* eslint-disable consistent-return */
import React from 'react';
import styles from './questionItem.less';

/**
 * PS：后续添加校验规则或公共函数时请添加注释
 */

// 渲染问题标签
const renderQuestinLabel = ( {
  title, showNumber, titleColor, answer
}, idx ) => (
  <div className={`${styles.question_label} ${title?.length < 20 ? styles.short_title : ''}`}>
    <div className={styles.required_tag} style={{ opacity: answer ? 1 : 0 }}>*</div>
    <span
      className={`${styles.question_title} ${answer ? styles.required_style : ''}`}
      style={{ color: titleColor }}
    >
      {showNumber ? `${idx + 1}.${title}` : title}
    </span>
  </div>
);



export default renderQuestinLabel

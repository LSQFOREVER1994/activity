/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef } from 'react';
import { Icon } from 'antd';
import QuestionSvg from '../../../assets/svg/QuestionSvg';
import styles from './index.less';
import { setScaleFunc } from '../index';

function Task( props ) {
  const {
    taskStateList,
    task: data,
    taskLimitShow,
    style,
    finishButton,
    goButton,
    image,
    colors,
  } = props;

  // 任务子项
  const renderTask = () => {
    const { name, attendLimit, id, description, descShowType } = data;
    const defaultColors = {
      "titleColor": "rgba(84,84,84,1)",
      "textColor": "rgba(134, 140, 148,1)"
  }
  const { titleColor, textColor } = colors || defaultColors;

    let taskStateObj = {};
    if ( taskStateList && taskStateList.length > 0 && id ) {
      taskStateObj = taskStateList.find( info => info.id === id ) || {};
    }

    let btnImg = goButton;

    if ( taskStateObj.isFinish ) {
      btnImg = finishButton;
    }
    // TODO: 当只留下按钮图片的时候 只展示按钮图片 宽高都为百分百
    const showButton = !name && !taskLimitShow && !image && descShowType === 'NONE';

    return (
      <>
        {showButton ? (
          <img className={styles.onlyButton} src={btnImg} alt="" />
        ) : (
          <div>
            <div className={styles.task_box} style={{ alignItems:descShowType === 'PAGE' ? 'flex-start':'center' }}>
              {image && <img src={image} alt="" className={styles.task_img} />}
              {descShowType === 'PAGE' ? (
                <div className={styles.task_info_page}>
                  <div className={styles.task_info_page_box} style={{ color: titleColor }}>
                    <div className={styles.task_info_name}>{name}</div>
                    <div className={styles.task_info_count}>
                      {taskLimitShow && (
                        <span className={styles.task_info_attendType}>
                          ({taskStateObj.finishCount || 0}/{attendLimit || 1})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.task_info_page_box_des} style={{ color: textColor }}>{description}</div>
                </div>
              ) : (
                <div className={styles.task_info}>
                  <div className={styles.task_info_name} style={{ color: titleColor }}>{name}</div>
                  <div className={styles.task_info_count} style={{ color: titleColor }}>
                    {taskLimitShow && (
                      <span className={styles.task_info_attendType}>
                        ({taskStateObj.finishCount || 0}/{attendLimit || 1})
                      </span>
                    )}
                  </div>
                  {descShowType === 'QUESTION_MARK' && (
                    <Icon
                      component={() =>
                        QuestionSvg( { className: styles.question_icon, style: { fill: textColor } } )
                      }
                    />
                  )}
                </div>
              )}
              <div className={styles.task_box_btn}>
                <img src={btnImg} alt="" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const itemEl = useRef( null );
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height, taskLimitShow] );
  return (
    <div id={props.id} className={styles.main} ref={itemEl}>
      {renderTask()}
    </div>
  );
}

export default Task;

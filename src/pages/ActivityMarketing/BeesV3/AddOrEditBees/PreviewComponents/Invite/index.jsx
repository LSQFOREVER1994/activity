/* eslint-disable import/no-cycle */
import React, { useEffect, useRef } from 'react';
import { Icon } from 'antd';
import QuestionSvg from '../../../assets/svg/QuestionSvg';
import styles from './index.less';
import { setScaleFunc } from '../index';

function Invite( props ) {
  const {
    showType,
    showStyle,
    bindingType,
    inviteButton,
    style,
    copyTip,
    fillTip,
    id,
    goButton,
    image,
    colors,
    task: { description, name, descShowType },
    copyBtnColor,
    confirmBtnColor,
    inviteFrameColor,
    taskLimitShow = false,
    inviterLimit,
    inviterSetting
  } = props;
  const itemEl = useRef( null );

  const defaultColors = {
    "titleColor": "rgba(84,84,84,1)",
    "textColor": "rgba(134, 140, 148,1)"
}
const { titleColor, textColor } = colors || defaultColors;

  const renderChildren = hidden => {
    // 因为邀请人和被邀请人任务是由后端加塞，所以在组件信息内没有对应id，只能根据name值进行判断
    return (
      <div className={styles.inviteContainer} hidden={hidden}>
        <div className={styles.inviteBox}>
          <div className={styles.inviteInfoBox}>
            <div className={styles.inviteTitle}>我的邀请码</div>
            <div className={styles.inviteCode} style={{ backgroundColor: inviteFrameColor }}>
              {/* {myInviteCode} */}
            </div>
            <div className={styles.inviteButton} style={{ backgroundColor: copyBtnColor }}>
              复制
            </div>
          </div>
          <div className={styles.inviteTip}>{copyTip}</div>
          <div className={styles.inviteInfoBox}>
            <div className={styles.inviteTitle}>填写邀请码</div>
            <input
              className={styles.inviteCode}
              style={{ backgroundColor: inviteFrameColor }}
            />
            <div className={styles.inviteButton} style={{ backgroundColor: confirmBtnColor }}>
              确定
            </div>
          </div>
          <div className={styles.inviteTip}>{fillTip}</div>
        </div>
      </div>
    );
  };
  const renderPopChidren = () => {
    return (
      <div className={styles.showModalButton}>
        {showStyle === 'TASK' ? (
          <div>
            <div className={styles.task_box} style={{ alignItems:descShowType === 'PAGE' ? 'flex-start':'center' }}>
              {image && <img src={image} alt="" className={styles.task_img} />}
              {descShowType === 'PAGE' ? (
                <div className={styles.task_info_page}>
                  <div className={styles.task_info_page_box} style={{ color: titleColor }}>
                    <div className={styles.task_info_name}>{name}</div>
                    <div className={styles.task_info_count}>
                      {taskLimitShow && (
                      <span className={styles.task_info_attendType}>(0/{ inviterSetting?.limit|| 1 })</span>
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
                    <span className={styles.task_info_attendType}>(0/{ inviterSetting?.limit|| 1 })</span>
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
                <img src={goButton} alt="" />
              </div>
            </div>
          </div>
        ) : (
          <img src={inviteButton} alt="" style={{ width:'100%' }} />
        )}
      </div>
    );
  };
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  return (
    <div ref={itemEl} id={id}>
      {bindingType === 'MANUAL' && renderChildren( showType === 'POP_WINDOWS' )}
      {bindingType === 'MANUAL' && showType === 'POP_WINDOWS' && renderPopChidren()}
      {bindingType === 'AUTO' && renderPopChidren()}
    </div>
  );
}

export default Invite;

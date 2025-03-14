/* eslint-disable import/no-cycle */
/* eslint-disable react/no-array-index-key */
import React, { useMemo, useRef, useEffect } from 'react';
import { Calendar } from 'antd';
import styles from './index.less';
import signBottomBg from "./images/bg_bottom.png";
import signTopBg from './images/bg_top_orange.png';
import signBottomOrange from "./images/bg_bottom_orange.png";
import { setScaleFunc } from '../index';

const dayWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周天'];

const ActivitySign = props => {
  const { label, unSignBtnImg, freshType, signDay, rule, lockIcon, id, style, signStyle } = props;

  const getDayNum = useMemo( () => {
    let day = signDay;
    if ( freshType === 'WEEK' ) day = 7;
    return new Array( day ).fill( 1 );
  }, [freshType, signDay] );

  const itemEl = useRef( null );
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  const CalendarContent = () => {
    return (
      <div className={styles.calendar}>
        <Calendar fullscreen={false} weekStartsOn="weekStartsOn" />
      </div>
    );
  };

   // 标题样式
   const renderTitleStyle = () => {
    let view;
    switch ( signStyle ) {
      case 'GOLD':
        view = (
          <svg className={styles.sign_head_title_gold}>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff620b" />
                <stop offset="100%" stopColor="#ffa53a" />
              </linearGradient>
            </defs>
            <text x="50%" y="50%" className={styles.sign_head_title_text_gold}>
              {label}
            </text>
          </svg>
        );
        break;
      case 'ORANGE':
        view = <div className={styles.sign_head_title_orange}>{label}</div>;
        break;
      default:
        view = <div className={styles.sign_head_title_basic}>{label}</div>;
        break;
    }
    return view;
  };

  let headStyle;
  let topImg; // 头部图片
  let ruleStyle; // 规则字段样式
  let buttonStyle;
  let bodyStyle; // 主体背景色
  let listStyle; //
  let listItemStyle;
  let bottomImg;
  switch ( signStyle ) {
    case 'GOLD':
      headStyle = styles.sign_head_gold;
      topImg = <img alt="" src="https://media.jiniutech.com/yunying/2_default/sign/bg_top.png" />;
      ruleStyle = styles.sign_body_rule_gold;
      buttonStyle = styles.sign_head_btn;
      bodyStyle = styles.sign_body_gold;
      listStyle = { marginTop: 'calc(10 / 32 * 1rem)' };
      listItemStyle = styles.sign_body_list_item_gold;
      bottomImg = <img className={styles.signBottomBg} alt="" src={signBottomBg} />;
      break;
    case 'ORANGE':
      headStyle = styles.sign_head_orange;
      topImg = <img alt="" src={signTopBg} />;
      ruleStyle = styles.sign_body_rule_orange;
      buttonStyle = styles.sign_head_btn_orange;
      bodyStyle = styles.sign_body_orange;
      listStyle = { paddingTop: 'calc(10 / 32 * 1rem)' };
      listItemStyle = styles.sign_body_list_item_orange;
      bottomImg = <img className={styles.signBottomBg} alt="" src={signBottomOrange} />;
      break;
    default:
      headStyle = styles.sign_head_basic;
      topImg = null;
      ruleStyle = styles.sign_body_rule_basic;
      buttonStyle = styles.sign_head_btn;
      bodyStyle = styles.sign_body_basic;
      listStyle = { paddingTop: 'calc(30 / 32 * 1rem)' };
      listItemStyle = styles.sign_body_list_item_basic;
      bottomImg = <div className={styles.signBottom_basic} />;
      break;
  }
  return (
    <div className={styles.sign} ref={itemEl} id={id}>
      <div className={headStyle}>
        {topImg}
        {renderTitleStyle()}
        <div className={buttonStyle}>
          <img
            alt=""
            src={unSignBtnImg}
          />
        </div>
      </div>
      <div className={bodyStyle}>
        <div className={ruleStyle}>{rule}</div>
        <div
          className={styles.sign_body_list}
          style={{
            justifyContent: getDayNum.length < 7 ? "space-evenly" : "",
            ...listStyle
          }}
        >
          {freshType !== "MONTH" ? (
            getDayNum.map( ( item, index ) => (
              <div
                key={index}
                className={listItemStyle}
              >
                <div>
                  <img
                    alt=""
                    src={lockIcon}
                  />
                </div>
                {freshType === "DAY" && <div>{`第${index + 1}天`}</div>}
                {freshType === "WEEK" && <div>{dayWeek[index]}</div>}
              </div>
            ) )
          ) : (
            <CalendarContent />
          )}
        </div>
      </div>
      {bottomImg}
    </div>
  );
};

export default ActivitySign;

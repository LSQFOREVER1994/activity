/* eslint-disable max-len */
import React, { useMemo, useEffect, useRef } from 'react';
import { setScaleFunc } from '../index';
import styles from './main.css';

function Main( props ) {
  
  const {
    title, description, submitButtonImage, isShowVoteData,
    showAttendUser, showVoteDataType, optionsList, checkFont, checkBackground,
    uncheckFont, uncheckBackground, uncheckScaleBackground, checkScaleBackground,
    style, id
  } = props;
  const itemEl = useRef( null );

  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width] );

  // 渲染人数/百分比
  const renderNumber = ( ) => {
    let numberView = null;
    if( !isShowVoteData ) return null
    if ( showVoteDataType === 'VOTERS' ) {
      numberView = (
        <div className={styles.numBox}>
          0人
        </div>
      );
    } else if ( showVoteDataType === 'PERCENT' ) {
      numberView = (
        <div className={styles.numBox}>
          50%
        </div>
      );
    } else if ( showVoteDataType === 'ALL' ) {
      numberView = (
        <div className={styles.numBox}>
          50人(50%)
        </div>
      );
    }
    return (
      numberView
    );
  };

  const renderTitle = useMemo( () => {
    return (
      <div className={styles.titleBox}>
        <div>{title}</div>
        <div>{description}</div>
      </div>
    );
  }, [title, description] );


  // 渲染投票主体
  const renderVotingContent = () => {
    // 默认为未选中颜色
    
    return (
      <div className={styles.contentBox}>
        {optionsList?.map( ( item, index ) => { // 根据选中的选项渲染颜色
        let backColor = uncheckBackground;
        let textColor = uncheckFont;
        let backgroundColor = uncheckScaleBackground
        if( index === 0 ){
          backColor = checkBackground;
          textColor = checkFont;
          backgroundColor = checkScaleBackground
        }
          return (
            <div
              className={styles.row}
              style={{
                backgroundColor:  backColor,
                color:  textColor,
              }}
              key={item.context}
            >
              {
                <div
                  className={styles.backColor}
                  style={{
                    backgroundColor,
                    width:'50%',
                  }}
                />
              }
              <div
                className={styles.rowBox}
              >
                <div
                  className={styles.rowName}
                >
                  {item.context}
                </div>
                {renderNumber( item )}
              </div>
            </div>
          );
        } )}
      </div>
    );
  };

  // 渲染参与人数
  const renderBottom = () => {
    return (
      <>
        {showAttendUser && (
        <div className={styles.joinNumber}>
          3100
          人参与
        </div>
        )}
        <div className={styles.btnBox}>
          <img className={styles.votingBtn} src={submitButtonImage} alt="" />
        </div>
      </>
    );
  };

  return (
    <div className={styles.main} ref={itemEl} id={id}>
      {renderTitle}
      {renderVotingContent()}
      {renderBottom()}
    </div>
  );
}

export default Main;

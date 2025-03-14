/*
 * @Author: ZHANG_QI
 * @Date: 2023-09-05 15:41:38
 * @LastEditors: ZHANG_QI
 * @LastEditTime: 2023-09-05 17:06:58
 */
import React, { useEffect, useRef } from 'react';
import ComponentWrapper from './ComponentWrapper';
import addComponentsImg from '../../../../../assets/img/addComponents.png';

import styles from './pageWrapper.less'

const PageWrapper = ( { pageData } ) => {
  const { componentData, style } = pageData;
  const { backgroundImage, backgroundColor, opacity, height = 0, backgroundLayout = 'ORIGINAL' } = style || {};
  const pageWrapperRef = useRef( null );
  const pageStyle = { height:`${height}px` };
  if ( backgroundLayout === 'ORIGINAL' ) pageStyle.background = `url(${backgroundImage}) no-repeat 0 0 / 100%, ${backgroundColor}`;
  if ( backgroundLayout === 'TILE' ) pageStyle.background = `url(${backgroundImage}) repeat 0 0 / 100%, ${backgroundColor}`;
  if ( backgroundLayout === 'STRETCH' ) pageStyle.background = `url(${backgroundImage}) no-repeat 0 0 / 100% 100%, ${backgroundColor}`;
  if ( opacity ) pageStyle.opacity = opacity;
  useEffect( ()=>{
  }, [] )
  return (
    <div className={styles.pageWrapper} ref={pageWrapperRef} style={{ ...pageStyle }}>
      {componentData?.length ? ( componentData?.map(
            ( item, idx ) =>
              !item.inCombination && (
                <ComponentWrapper
                  key={item.id}
                  element={item}
                  idx={idx}
                />
              )
          ) ):( 
            <div className={styles.empty}>
              <img src={addComponentsImg} alt="" />
              <p>从左侧选择组件添加到画布</p>
            </div> )}
    </div>
  );
};

export default PageWrapper;

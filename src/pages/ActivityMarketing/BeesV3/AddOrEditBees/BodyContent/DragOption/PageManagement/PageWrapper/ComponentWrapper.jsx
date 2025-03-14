/*
 * @Author: ZHANG_QI
 * @Date: 2023-09-05 16:57:05
 * @LastEditors: ZHANG_QI
 * @LastEditTime: 2023-09-05 17:09:09
 */
import React from 'react';
import previewComponentsEnum from '../../../../PreviewComponents';
import styles from './pageWrapper.less'

const rotateList = ['rotate', 'rotateX', 'rotateY'];
const ComponentWrapper = ( { element } ) => {
  const { style, propValue, type, isView } = element;

  const filterStyle = () => {
    const obj = JSON.parse( JSON.stringify( element ) );
    if ( element?.style ) {
      delete obj.style.transform;
    }
    return obj;
  };

  const renderGroupElement = ( itemId ) => {
    return (
      <div className={styles.groupContainer} id={itemId}>
        {propValue.componentData.map( item => {
          let transform = '';
          rotateList.forEach( key => {
            if ( item.style[key] ) {
              transform += `${key}(${item.style[key]}deg)`;
            }
          } );
          const Element = previewComponentsEnum[item.type];

          // 组合内组件选中，塞入样式标识组件
          return (
            item.isView && (
              <div
                className={styles.selectEleBox}
                style={{ position: 'absolute', transform, ...item.style, color: item.style.textColor }}
                key={item.id}
              >
                {Element && <Element {...item} />}
              </div>
            )
          );
        } )}
      </div>
    );
  };

  const renderItem = ( itemId ) => {
    if ( type === 'GROUP' ) {
      return renderGroupElement( itemId );
    }
    const Element = previewComponentsEnum[type];
    return !Element ? <></> : <Element {...filterStyle()} />;
  };
   const newStyle = { ...style, display: isView ? 'block' : 'none' };
  let transform = '';
  rotateList.forEach( item => {
    if ( style[item] ) {
      transform += `${item}(${style[item]}deg)`;
    }
  } );
  newStyle.transform = transform;
  if ( newStyle.textColor ) newStyle.color = newStyle.textColor;
  if ( !newStyle.openBoxShadow ) delete newStyle.boxShadow

    return (
      <div
        style={newStyle}
        className={styles.componentWrapper}
      >
        {renderItem()}
      </div>
    );
}

export default ComponentWrapper;

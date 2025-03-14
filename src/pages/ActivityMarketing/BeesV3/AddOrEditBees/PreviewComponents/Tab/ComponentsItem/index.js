import React, { useRef } from 'react';
import { Icon } from 'antd';
import previewComponentsEnum from "../..";
import styles from './index.less';

const rotateList = ['rotate', 'rotateX', 'rotateY'];

function DragComponentsItem( { element } ) {
  const { style, id, type, propValue, isLock, isView } = element;
  const dragEl = useRef( null );
  const filterStyle = () => {
    const obj = JSON.parse( JSON.stringify( element ) );
    if ( element?.style ) {
      delete obj.style.transform;
    }
    return obj;
  };

  const renderGroupElement = () => {
    if( !propValue || !propValue.componentIds || !propValue.componentIds.length ){
      return null;
    }
    return (
      <div className={styles.dragPageComponentsItemGroupContainer} style={{ ...style }}>
        { propValue.componentIds.map( item => {
          let transform = '';
          rotateList.forEach( key => {
            if ( item.style[key] ) {
              transform += `${key}(${item.style[key]}deg)`;
            }
          } );
          const Element = previewComponentsEnum[item.type];

          return (
            item.isView && (
              <div
                className={styles.selectEleBox}
                style={{ position: 'absolute', transform, ...item.style, color: item.style.textColor }}
                key={item.id}
              >
                {Element && <Element {...item} changeValue={()=>{}}  />}
              </div>
            )
          );
        } )}
      </div>
    );
  };
  const renderItem = () => {
    if ( type === 'GROUP' ) {
      return renderGroupElement();
    }
    const Element = previewComponentsEnum[type];
    return !Element ? <></> : <Element {...filterStyle()} changeValue={()=>{}} />;
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
  return (
    <div
      style={newStyle}
      className={styles.dragPageComponentsItemWrap}
      key={id}
      onClick={e => e.stopPropagation()}
      ref={dragEl}
    >
      <div className={styles.dragPageComponentsItemEleDom} style={{ ...style }}>
        {renderItem()}
      </div>
      {isLock && <Icon type="lock" className={styles.dragPageComponentsItemLock} />}
    </div>
  );
}

export default DragComponentsItem;

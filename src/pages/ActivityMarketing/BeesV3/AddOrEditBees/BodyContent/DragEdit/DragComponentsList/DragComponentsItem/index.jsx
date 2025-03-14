import React, { useRef, useContext } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import { CommonOperationFun } from '../../../../provider.js'
import styles from './index.less';
import previewComponentsEnum from '../../../../PreviewComponents';

const baseClass = 'dragComponentsItem';
const rotateList = ['rotate', 'rotateX', 'rotateY'];

function DragComponentsItem( { element, changeActive, idx, componentData, changeSetUpIdx, parentRef, currentEditId } ) {
  const { style, id, type, propValue, isLock, isView } = element;
  const { changeComponentValue } = useContext( CommonOperationFun )
  const dragEl = useRef( null );
  const handleClickComponents = e => {
    e.stopPropagation();
    e.preventDefault();
    const { clientX, clientY } = e.nativeEvent;
    const { left = 0, top = 0 } = parentRef.current.getBoundingClientRect();
    const offsetX = clientX - style.left - left;
    const offsetY = clientY - style.top - top;
    changeActive( element, dragEl.current, idx, { offsetX, offsetY } );
  };
  const filterStyle = () => {
    const obj = JSON.parse( JSON.stringify( element ) );
    if ( element?.style ) {
      delete obj.style.transform;
    }
    return obj;
  };
  const handleDoubleClickGroupChildren = ( itemId ) => {
    if ( isLock ) {
      changeSetUpIdx( undefined )
    } else {
      const index = componentData.findIndex( item => item.id === itemId )
      changeSetUpIdx( index )
    }
  }
  const renderGroupElement = ( itemId ) => {
    return (
      <div className={styles[`${baseClass}GroupContainer`]} id={itemId}>
        {propValue.componentData.map( item => {
          let transform = '';
          rotateList.forEach( key => {
            if ( item.style[key] ) {
              transform += `${key}(${item.style[key]}deg)`;
            }
          } );
          const Element = previewComponentsEnum[item.type];

          // 组合内组件选中，塞入样式标识组件
          let selectEleBoxStyle = {}
          if ( ( currentEditId || currentEditId === 0 ) && componentData[currentEditId].id === item.id ) {
            selectEleBoxStyle = { border: '1px dashed red' }
          }
          return (
            item.isView && (
              <div
                className={styles.selectEleBox}
                style={{ position: 'absolute', transform, ...item.style, color: item.style.textColor, ...selectEleBoxStyle }}
                key={item.id}
                onDoubleClick={handleDoubleClickGroupChildren.bind( null, item.id )}
              >
                {Element && <Element {...item} changeValue={changeComponentValue} />}
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
    return !Element ? <></> : <Element {...filterStyle()} changeValue={changeComponentValue} />;
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
      className={styles[`${baseClass}Wrap`]}
      key={id}
      onMouseDown={handleClickComponents}
      onClick={e => e.stopPropagation()}
      ref={dragEl}
    >
      <div className={styles[`${baseClass}EleDom`]}>
        {renderItem( id )}
      </div>
      {isLock && <Icon type="lock" className={styles[`${baseClass}Lock`]} />}
    </div>
  );
}

const mapProps = ( { beesVersionThree } ) => ( {
  currentEditId: beesVersionThree.currentEditId
} )
export default connect( mapProps )( DragComponentsItem );

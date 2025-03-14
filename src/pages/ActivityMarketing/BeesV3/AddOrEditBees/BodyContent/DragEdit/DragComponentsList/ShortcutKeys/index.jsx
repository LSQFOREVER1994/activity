/* eslint-disable no-param-reassign */
/**
 * @example 键盘编码
 * https://blog.csdn.net/just_for_that_moment/article/details/124663873
 */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import _ from 'lodash';
import { deleteElementDataId } from '../../../../../DataVerification'
import useThrottle from '@/hooks/useThrottle';
import styles from './index.less';
import { CommonOperationFun, CurrentPages, DomDataContext } from '../../../../provider';

let keyboardSet = [];
const baseClass = 'shortcutKeys';
let copyContent = '';

function ShortcutKeys( props ) {
  const {
    editWrapRef,
    activeParams,
    evalDragPosition,
    changeActiveParams,
    selectedComponents,
    selectedArea,
    clearSelectArea,
    computedComponentsBoundary,
    setPressControl,
    clearActive,
    currentEditId,
    changeScaling,
  } = props;
  const [domData] = useContext( DomDataContext );
  const [currentPages, changeCurrentPages] = useContext( CurrentPages );
  const {
    removeComponentsFun,
    addComponentsFun,
    saveActivity,
    editAreaUndo,
    editAreaRecovery,
    evalGroupData,
    evalUngroupData,
    DESTROY,
  } = useContext( CommonOperationFun );
  const [positionObj, setPositionObj] = useState( {} ); // 右击光标位置
  const { componentData = [] } = currentPages || {};
  const { index = 0, style = {}, el } = activeParams || {};
  const data = componentData.length ? componentData[index] : null;
  const isGroup = data?.type === 'GROUP';
  const [showContent, setShowContent] = useState( 0 ); // 1 右键组件 2 右键空白区域 3 组合
  const currentComponent = useMemo( () => {
    if ( typeof currentEditId !== 'number' || !componentData ) return {};
    return componentData[currentEditId];
  }, [currentEditId, componentData] );
  const changeCurrentComponent = ( val, key ) => {
    const value = val?.target ? val.target?.value : val;
    const dataConfig = _.set( currentComponent, key, value )
    const newData = { ...currentComponent, ...dataConfig };
    componentData[currentEditId] = newData;
    changeCurrentPages( currentPages );
  };
  useEffect( () => {
    if ( ( !activeParams || !selectedComponents.length ) && showContent ) {
      setShowContent( 0 );
    }
  }, [activeParams, selectedComponents] );

  useEffect( () => {
    if ( !showContent ) {
      setPositionObj( {} );
    }
  }, [showContent] )
  /**
   * @param 移动组件位置
   * @param {string | number} type 移动类型 up down 数字为指定位置
   * @returns
   */
  const moveUpAndDown = type => {
    if ( !activeParams ) return;
    let insetIndex;
    if ( typeof type === 'number' ) {
      insetIndex = type;
    } else if ( type === 'up' ) {
      insetIndex = index - 1;
    } else {
      insetIndex = index + 1;
    }
    const item = componentData.splice( index, 1 )[0];
    componentData.splice( insetIndex, 0, item );
    // 同步选中对象当前组件索引
    changeActiveParams( { index: insetIndex } );
    changeCurrentPages( currentPages );
  };
  /**
   * @example 对称旋转
   * @param {string} type X Y
   */
  const flip = type => {
    const val = data.style[`rotate${type}`] ? 0 : 180;
    data.style[`rotate${type}`] = val;
    changeCurrentPages( currentPages );
  };
  const componentCombination = () => {
    if ( isGroup ) {
      if ( !data ) return;
      evalUngroupData( data );
      return;
    }
    if ( !selectedComponents.length ) return;
    evalGroupData( selectedComponents, selectedArea );
    clearSelectArea();
    clearActive();
  };
  const operationSet = useMemo( () => {
    const isLock = data?.isLock;
    const arr = [
      {
        label: '取消',
        fun: () => {
          setShowContent( 0 );
        },
        show: true,
      },
      {
        label: '保存',
        keyboard: [17, 83],
        fun: saveActivity,
        show: false,
      },
      {
        label: '粘贴',
        keyboard: [17, 86],
        fun: () => {
          if ( !copyContent ) return;
          const newData = JSON.parse( copyContent );
          // left & top: 区分是右键粘贴还是快捷键粘贴
          const { left = 0, top = 0 } = positionObj;
          // true: 单个组件，false: 多选组件  ↓
          if ( Object.prototype.toString.call( newData ) === '[object Object]' ) {
            if ( left || top ) {
              newData.style.left = left;
              newData.style.top = top;
            } else {
              newData.style.top += ( newData.style.height + 10 );
            }
          } else if ( left || top ) {
            let minLeft = newData[0].style.left;
            let minTop = newData[0].style.top;
            newData.forEach( item => {
              minLeft = Math.min( minLeft, item.style.left )
              minTop = Math.min( minTop, item.style.top )
            } );
            newData.forEach( item => {
              item.style.left += ( left - minLeft );
              item.style.top += ( top - minTop );
            } );
          } else {
            newData.forEach( item => {
              item.style.top += ( item.style.height + 10 );
            } );
          }
          addComponentsFun( newData );
        },
        show: [2, 3].includes( showContent ),
      },
      {
        label: '复制',
        keyboard: [17, 67],
        fun: () => {
          if ( selectedComponents.length ) {
            copyContent = JSON.stringify( deleteElementDataId( selectedComponents ) );
            return;
          }
          if ( !data ) return;
          copyContent = JSON.stringify( deleteElementDataId( data ) );
          clearActive();
        },
        show: [1, 3].includes( showContent ) && !isLock,
      },
      {
        label: '剪切',
        keyboard: [17, 88],
        fun: () => {
          if ( selectedComponents.length ) {
            copyContent = JSON.stringify( selectedComponents );
            removeComponentsFun(
              selectedComponents.map( item => item.id ),
              true
            );
            clearSelectArea();
            return;
          }
          if ( !data ) return;
          copyContent = JSON.stringify( data );
          removeComponentsFun( index, true );
        },
        show: [1, 3].includes( showContent ) && !isLock,
      },
      {
        label: '删除',
        keyboard: [46],
        fun: () => {
          if ( selectedComponents.length ) {
            removeComponentsFun( selectedComponents.map( item => item.id ) );
            clearSelectArea();
            return;
          }
          if ( !activeParams ) return;
          removeComponentsFun( index );
        },
        show: [1, 3].includes( showContent ) && !isLock,
      },
      {
        label: data?.isLock ? '解锁' : '锁定',
        keyboard: [],
        fun: () => {
          if ( !data ) return;
          currentPages.componentData[index].isLock = !data.isLock;
          changeCurrentPages( currentPages );
        },
        show: showContent === 1,
      },
      {
        label: '上移',
        keyboard: [17, 76],
        fun: moveUpAndDown.bind( null, 'down' ),
        show: showContent === 1 && !isLock,
        disabled: index === componentData.length - 1,
      },
      {
        label: '下移',
        keyboard: [17, 75],
        fun: moveUpAndDown.bind( null, 'up' ),
        show: showContent === 1 && !isLock,
        disabled: index === 0,
      },
      {
        label: '置顶',
        keyboard: [],
        fun: moveUpAndDown.bind( null, componentData.length - 1 ),
        show: showContent === 1 && !isLock,
        disabled: index === componentData.length - 1,
      },
      {
        label: '置底',
        keyboard: [],
        fun: moveUpAndDown.bind( null, 0 ),
        show: showContent === 1 && !isLock,
        disabled: index === 0,
      },
      {
        label: '水平翻转',
        keyboard: [],
        fun: flip.bind( null, 'Y' ),
        show: showContent === 1 && !isLock,
      },
      {
        label: '垂直翻转',
        keyboard: [],
        fun: flip.bind( null, 'X' ),
        show: showContent === 1 && !isLock,
      },
      {
        label: '撤销',
        keyboard: [17, 90],
        fun: editAreaUndo,
        show: false,
      },
      {
        label: '恢复',
        keyboard: [17, 89],
        fun: editAreaRecovery,
        show: false,
      },
      {
        label: isGroup ? '取消组合' : '组合',
        keyboard: [],
        fun: componentCombination,
        show: showContent === 3 || ( isGroup && showContent === 1 ),
      },
      {
        label: '全选',
        keyboard: [17, 65],
        fun: computedComponentsBoundary.bind( null, componentData ),
        show: false,
      },
      {
        label: '画布放大',
        keyboard: [17, 107],
        fun: () => changeScaling( '+' ),
        show: false,
      },
      {
        label: '画布缩小',
        keyboard: [17, 109],
        fun: () => changeScaling( '-' ),
        show: false,
      },
    ];
    return arr;
  }, [activeParams, showContent, componentData, positionObj, domData, selectedComponents] );
  const handleClickLi = useCallback(
    item => {
      if ( item.disabled ) return;
      if ( item.fun ) item.fun();
      setShowContent( 0 );
    },
    [operationSet]
  );

  const evalWheelScroll = ( e ) => {
    if ( e.ctrlKey ) {
      e.stopPropagation()
      e.preventDefault()
      if ( e.deltaY > 0 ) {
        changeScaling( '-' )
      } else {
        changeScaling( '+' )
      }
    }
  }

  const evalKeyDown = useThrottle( e => {
    if ( keyboardSet.includes( e.keyCode ) ) return;
    keyboardSet.push( e.keyCode );
    if ( e.keyCode === 17 ) {
      setPressControl( true );
    }
    const hitItem = operationSet.find( item => {
      return !!item?.keyboard?.length && item.keyboard.every( key => keyboardSet.includes( key ) );
    } );
    if ( hitItem ) {
      e.preventDefault();
      e.stopPropagation();
      handleClickLi( hitItem );
    }
  }, 50 );

  // 键盘控制组件上下左右移动  Backspace删除
  const evalKeyDownMove = e => {
    e.preventDefault();
    e.stopPropagation();
    const isTrue = Object.keys( currentComponent ).length
    if ( !isTrue ) return;
    let moveValue;
    let moveDirection;
    const { top, left } = currentComponent?.style || {};
    if ( e.code === 'Backspace' ) {
      if ( selectedComponents.length ) {
        removeComponentsFun( selectedComponents.map( item => item.id ) );
        return;
      }
      if ( !activeParams ) return;
      removeComponentsFun( index );
      return;
    }
    switch ( e.code ) {
      case 'ArrowLeft':
        moveValue = left - 1;
        moveDirection = 'style.left';
        break;
      case 'ArrowUp':
        moveValue = top - 1;
        moveDirection = 'style.top';
        break;
      case 'ArrowRight':
        moveValue = left + 1;
        moveDirection = 'style.left';
        break;
      case 'ArrowDown':
        moveValue = top + 1;
        moveDirection = 'style.top';
        break;
      default:
        moveValue = null
        moveDirection = '';
    }
    changeCurrentComponent( moveValue, moveDirection )
  }

  const evalKeyDownBefore = e => {
    const activeEL = document.activeElement;
    if (
      DESTROY ||
      ['INPUT', 'TEXTAREA'].includes( activeEL.nodeName ) ||
      activeEL.getAttribute( 'contenteditable' )
    )
      return;
    // 按下ctrl需要立即阻止默认事件，如有延迟会被浏览器劫持
    e.preventDefault();
    evalKeyDown( e );
    evalKeyDownMove( e );
  };


  const evalKeyUp = e => {
    keyboardSet = keyboardSet.filter( item => item !== e.keyCode );
    if ( e.keyCode === 17 ) {
      setPressControl( false );
    }
  };
  const evalConTextMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    if ( e.target.nodeName === 'rect' || selectedComponents.length ) {
      if ( copyContent || selectedComponents.length ) {
        const obj = {
          x: e.clientX,
          y: e.clientY,
          width: style.width,
          height: style.height,
        };
        const { left, top } = evalDragPosition( obj, false );
        setShowContent( e.target.nodeName === 'rect' ? 2 : 3 );
        if ( e.target.nodeName === 'rect' ) { clearActive() }
        setPositionObj( {
          left,
          top,
        } );
      } else {
        setShowContent( 0 );
      }
      return;
    }

    if ( activeParams ) {
      const { left = 0, top = 0 } = style;
      setShowContent( 1 );
      setPositionObj( {
        left,
        top,
      } );
      return;
    }
    if ( showContent ) {
      setShowContent( 0 );
    }
  };
  useEffect( () => {
    editWrapRef.current.addEventListener( 'contextmenu', evalConTextMenu );
    document.addEventListener( 'keydown', evalKeyDownBefore );
    document.addEventListener( 'wheel', evalWheelScroll, { passive: false } );

    return () => {
      document.removeEventListener( 'wheel', evalWheelScroll );
      document.removeEventListener( 'keydown', evalKeyDownBefore );
      if ( !editWrapRef.current ) return;
      editWrapRef.current.removeEventListener( 'contextmenu', evalConTextMenu );
    };
  }, [operationSet, DESTROY, copyContent] );
  useEffect( () => {
    document.addEventListener( 'keyup', evalKeyUp );
    return () => {
      document.removeEventListener( 'keyup', evalKeyUp );
    };
  }, [] );
  const ulStyle = useMemo( () => {
    if ( showContent !== 1 ) {
      // 保存的是当前组件的中心点，显示的时候需要加上对应宽高
      return {
        left: positionObj.left + ( style.width || 0 ) / 2 + 5 || 0,
        top: positionObj.top + ( style.height || 0 ) / 2 + 5 || 0,
      };
    }
    if ( !el ) return {};
    const obj = {};
    const shortcutHeight = operationSet.filter( item => item.show ).length * 34;
    const { width, height, top, bottom } = el.getBoundingClientRect();
    // 点击组件下面是否能展示
    if ( window.innerHeight - bottom >= shortcutHeight ) {
      obj.top = style.top + height + 10;
      obj.left = style.left + width / 2 - 34;
    } else if ( top - 65 >= shortcutHeight ) {
      const { height: pageHeight } = currentPages.style;
      // 点击组件上面是否能展示
      obj.bottom = pageHeight - style.top + 10;
      obj.left = style.left + width / 2 - 34;
    } else {
      obj.left = style.left + width + 10;
      obj.top = style.top + height / 2 - shortcutHeight / 2;
    }
    return obj;
  }, [showContent, activeParams, positionObj] );
  if ( !editWrapRef?.current?.parentElement ) return <></>;
  return ReactDOM.createPortal(
    <ul
      className={styles[`${baseClass}Wrap`]}
      style={showContent ? ulStyle : { display: 'none' }}
      onClick={e => {
        e.stopPropagation();
      }}
      onMouseUp={e => {
        e.stopPropagation();
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      {operationSet.map(
        item =>
          item.show && (
            <li
              key={item.label}
              className={( item.disabled && styles[`${baseClass}LiDisabled`] ) || ''}
              onClick={handleClickLi.bind( null, item )}
            >
              {item.label}
            </li>
          )
      )}
    </ul>,
    editWrapRef.current.parentElement
  );
}
const mapProps = ( { beesVersionThree } ) => ( {
  currentEditId: beesVersionThree.currentEditId,
} );
export default connect( mapProps )( ShortcutKeys );

export const clearCopyContent = () => {
  copyContent=''
};
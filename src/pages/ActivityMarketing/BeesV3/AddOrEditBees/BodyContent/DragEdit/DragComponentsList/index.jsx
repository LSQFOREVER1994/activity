/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-bind */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import useThrottle from '@/hooks/useThrottle';
import { CurrentPages } from '../../../provider';
import addComponentsImg from '../../../../assets/img/addComponents.png';
import styles from './index.less';
import DragComponentsItem from './DragComponentsItem';
import ShortcutKeys from './ShortcutKeys';
import calculateComponentPositonAndSize from './calculateComponentPositonAndSize';
import StreamingLayoutComponentList from './StreamingLayoutComponentList'

const ROTATE_ADSORBENT = [0, 45, 90, 135, 180, 225, 270];
const ROTATE_GUIDES = [0, 45, 90, 135];
const activeParamsKey = ['left', 'top', 'width', 'height', 'rotate'];
const baseClass = 'dragComponentsList';
let moveFlag = '';
let setMoveFlagTime = Node.Time;
let moveResizeObj = {};
let controlFirstData = null;
function DragComponentsList( {
  scaling,
  visibleAreaRef,
  parentRef,
  evalDragPosition,
  dispatch,
  prevRef,
  selectedComponents,
  selectedArea,
  clearSelectArea,
  computedComponentsBoundary,
  setInfoTipModal,
  changeScaling,
} ) {
  const [currentPages, changeCurrentPages] = useContext( CurrentPages );
  const { style: { layout = 'FREEDOM' } } = currentPages;
  const [activeParams, setActiveParams] = useState( null );
  const [rotateGuides, setRotateGuides] = useState( false );
  const [pressControl, setPressControl] = useState( false );
  const selectElWrap = useRef( null );
  const { componentData = [] } = currentPages;
  const changeSetUpIdx = idx => {
    dispatch( {
      type: 'beesVersionThree/SetState',
      payload: {
        currentEditId: idx,
      },
    } );
  };
  const changeActiveEl = el => {
    dispatch( {
      type: 'beesVersionThree/SetState',
      payload: {
        currentActiveEl: el?.firstElementChild,
      },
    } );
  };
  const clearActive = useCallback( () => {
    if ( !activeParams ) return;
    setActiveParams( null );
    changeSetUpIdx();
  }, [activeParams] )

  useImperativeHandle( prevRef, () => ( {
    clearActive,
    clearMoveFlag: () => {
      if ( !moveFlag ) return;
      moveFlag = '';
    },
  } ) );
  const computedBorderCircularCursor = useMemo( () => {
    const { rotate = 0 } = activeParams?.style || {};
    const arr = [
      'nwse-resize',
      'ns-resize',
      'nesw-resize',
      'ew-resize',
      'nwse-resize',
      'ns-resize',
      'nesw-resize',
      'ew-resize',
    ];
    const diff = parseInt( rotate / 40, 10 );
    if ( diff > 0 ) {
      const val = arr.splice( 0, diff );
      arr.push( ...val );
    }
    return arr;
  }, [activeParams?.style?.rotate] );

  // 点击组件
  const changeActiveComponents = useCallback(
    ( data, el, index, offsetObj, noMove = false ) => {
      if ( !data ) return;
      const { id, isLock } = data;
      // 多选
      if ( pressControl ) {
        data.index = index;
        // 当没有选中的组件时，暂存一个组件
        if ( !controlFirstData && !selectedComponents.length ) {
          // 有高亮的直接视为点击第一次的
          if ( activeParams ) {
            activeParams.data.index = activeParams.index;
            controlFirstData = activeParams.data;
          } else {
            controlFirstData = data;
            return;
          }
        }
        if ( controlFirstData ) {
          if ( data.id === controlFirstData.id ) return;
          computedComponentsBoundary( [controlFirstData, data] );
          controlFirstData = null;
          return;
        }
        if ( selectedComponents.some( item => item.id === data.id ) ) return;
        computedComponentsBoundary( [...selectedComponents, data] );
        return;
      }
      if ( controlFirstData ) controlFirstData = null;
      if ( selectedComponents.length ) return;
      changeSetUpIdx( index );
      changeActiveEl( el );
      if ( data?.id === activeParams?.id && !isLock ) {
        moveFlag = 'move';
        setActiveParams( { ...activeParams, offsetObj } );
        return;
      }
      // 延时等待更新完成才能移动
      if ( !isLock && !noMove ) {
        setMoveFlagTime = setTimeout( () => {
          moveFlag = 'move';
        }, 200 );
      }

      const style = activeParamsKey.reduce( ( prev, item ) => {
        // eslint-disable-next-line no-param-reassign
        prev[item] = data.style[item] || 0;
        return prev;
      }, {} );
      const obj = { style, el, id, index, offsetObj, isLock: data.isLock, data };
      if ( data.type === 'GROUP' ) {
        obj.groupChildren = data?.propValue?.componentData || [];
      }
      setActiveParams( obj );
    },
    [activeParams, selectedComponents, pressControl]
  );


  window.changeActiveComponents = changeActiveComponents
  window.clearActiveEle = () => { setActiveParams( null ) }

  // 拖拽位置移动
  const evalPositionMove = e => {
    const { el, style, id, offsetObj } = activeParams || {};
    const { width, height } = style || {};
    const { clientX, clientY } = e || {};
    const { left = 0, top = 0 } = evalDragPosition( {
      x: clientX,
      y: clientY,
      width,
      height,
      id,
      ...offsetObj,
      noCenter: true,
    } );
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    selectElWrap.current.style.left = `${left}px`;
    selectElWrap.current.style.top = `${top}px`;
    changeSetUpIdx();
    setInfoTipModal( {
      left: left + width + 10,
      top: top + height + 10,
      content: `
        <p>X:${left.toFixed( 2 )}</p>
        <p>Y:${top.toFixed( 2 )}</p>
      `,
    } );
  };
  // 组件宽高拖拽
  const evalResize = e => {
    const { style, el, groupChildren } = activeParams;
    const obj = calculateComponentPositonAndSize( e, moveResizeObj, style, scaling );
    const styleArr = Object.keys( obj );
    styleArr.forEach( key => {
      if ( groupChildren && ['width', 'height'].includes( key ) ) {
        const { children } = el?.firstElementChild?.firstElementChild;
        const difference = obj[key] / style[key];
        if ( children?.length ) {
          Array.prototype.forEach.call( children, ( child, idx ) => {
            const childStyle = groupChildren[idx].style
            const val = childStyle[key] || 0;
            const newVal = Math.round( val * difference )
            child.style[key] = `${newVal}px`;
            const positionKey = key === 'width' ? 'left' : 'top';
            const positionVal = childStyle[positionKey];
            const newPositionVal = Math.round( positionVal * difference )
            child.style[positionKey] = `${newPositionVal}px`;
            groupChildren[idx].style = { ...childStyle, [`NEW_${key}`]: newVal, [`NEW_${positionKey}`]: newPositionVal };
          } );
        }
      }
      el.style[key] = `${obj[key]}px`;
      selectElWrap.current.style[key] = `${obj[key]}px`;
    } );
    changeSetUpIdx();
    setInfoTipModal( {
      left: style.left + parseFloat( el.style.width ) + 10,
      top: style.top + 10,
      content: `
        <p>宽度:${el.style.width}</p>
        <p>高度:${el.style.height}</p>
      `,
    } );
  };
  // 组件旋转
  const evalRotate = e => {
    const { el, style } = activeParams;
    const rect = el.getBoundingClientRect(); // 获取元素离视图
    /* 计算元素中心点位置 */
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    // 计算角度
    let deg = Math.atan2( center.y - e.pageY, center.x - e.pageX ) * ( 180 / Math.PI ) - 90;
    // 吸附处理
    ROTATE_ADSORBENT.forEach( item => {
      if ( Math.abs( item - Math.abs( deg ) ) <= 5 ) {
        deg = deg < 0 ? -item : item;
      }
    } );
    if ( deg < 0 ) deg += 360;
    const elTransform = el.style.transform;
    el.style.transform = elTransform
      ? elTransform.replace( /rotate\(-?\d+(.\d+)?deg\)/, `rotate(${deg}deg)` )
      : `rotate(${deg}deg)`;
    selectElWrap.current.style.transform = `rotate(${deg}deg)`;
    changeSetUpIdx();
    setInfoTipModal( {
      left: style.left + style.width + 10,
      top: style.top + style.height + 10,
      content: `
        <p>角度:${deg.toFixed( 2 )}</p>
      `,
    } );
  };
  // 鼠标移动事件
  const evalMouseMove = useThrottle( e => {
    if ( !moveFlag || !activeParams ) return;
    switch ( moveFlag ) {
      case 'move':
        evalPositionMove( e );
        break;
      case 'resize':
        evalResize( e );
        break;
      case 'rotate':
        evalRotate( e );
        break;
      default:
        break;
    }
  }, 0 );

  const evalMouseUp = () => {
    clearTimeout( setMoveFlagTime );
    if ( moveFlag === 'rotate' ) {
      setRotateGuides( false );
    }
    if ( !moveFlag ) return;
    moveFlag = '';
    if ( !activeParams ) return;
    const { left, top, width, height, transform } = selectElWrap.current.style;
    const { index, groupChildren } = activeParams;
    // 匹配transform 的rotate值
    const rotate = transform?.match( /rotate\(-?\d+(.\d+)?deg\)/ )?.[0]?.match( /-?\d+/ )[0] || 0;
    const obj = {
      left: parseFloat( left ),
      top: parseFloat( top ),
      width: parseFloat( width ),
      height: parseFloat( height ),
      rotate: +rotate,
    };
    const oldStyle = componentData[index]?.style || {};
    // 未改变不需要更新
    if ( !Object.keys( obj ).some( item => oldStyle[item] !== obj[item] ) ) return;
    // 组合组件需要同步子组件数据
    if ( groupChildren?.length ) {
      groupChildren.forEach( item => {
        const styleObj = Object.keys( item.style )
        // 同步外围数据
        const childrenIdx = componentData.findIndex( child => child.id === item.id )
        styleObj.forEach( key => {
          const val = item.style[`NEW_${key}`]
          if ( val ) {
            item.style[key] = val
            if ( childrenIdx >= 0 ) {
              componentData[childrenIdx].style[key] = val
            }
            delete item.style[`NEW_${key}`]
          }
        } )
      } )
    }
    currentPages.componentData[index].style = {
      ...componentData[index]?.style,
      ...obj,
    };
    activeParams.style = {
      ...activeParams.style,
      ...obj,
    };
    changeCurrentPages( currentPages, 'record' );
    changeSetUpIdx( index );
  };

  useEffect( () => {
    const { current } = visibleAreaRef;
    if ( layout === 'GRID' ) {
      current.removeEventListener( 'mousemove', evalMouseMove );
      current.removeEventListener( 'mouseup', evalMouseUp );
      return
    };
    current.addEventListener( 'mousemove', evalMouseMove );
    current.addEventListener( 'mouseup', evalMouseUp );
    return () => {
      current.removeEventListener( 'mousemove', evalMouseMove );
      current.removeEventListener( 'mouseup', evalMouseUp );
    };
  }, [activeParams, evalDragPosition, layout] );
  useEffect( () => {
    if ( !activeParams || layout === 'GRID' ) return;
    const activeItem = componentData.find( item => item.id === activeParams.id );

    // 当前选中的已被删除，清楚选中标识
    if ( !activeItem ) {
      setActiveParams( null );
      return;
    }
    const { rotate } = activeItem.style;
    // 当前选中的，在设置页面修改需要同步更新
    ['left', 'top', 'width', 'height', 'rotate'].forEach( key => {
      selectElWrap.current.style[key] = `${activeItem.style[key]}px`;
      activeParams.style[key] = activeItem?.style[key];
    } );
    if ( typeof rotate === 'number' ) {
      selectElWrap.current.style.transform = `rotate(${rotate}deg)`;
    }
    setActiveParams( { ...activeParams } );
  }, [JSON.stringify( componentData )] )
    ;
  const resizeMouseDown = ( type, e ) => {
    e.stopPropagation();
    e.preventDefault();
    const { style, isLock } = activeParams;
    if ( isLock ) return;
    if ( type === 'rotate' ) {
      moveFlag = type;
      setRotateGuides( true );
    } else {
      const { target } = e.nativeEvent;
      const idx = type;
      moveFlag = 'resize';
      const targetRect = target.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      // 当前点击圆点相对于画布的坐标
      const clickPosition = {
        x: Math.round( ( targetRect.left - parentRect.left + 6 ) * 100 / scaling ),
        y: Math.round( ( targetRect.top - parentRect.top + 6 ) * 100 / scaling ),
      };

      const center = {
        x: style.left + style.width / 2,
        y: style.top + style.height / 2,
      };
      // 获取对称点的坐标
      const symmetricPoint = {
        x: center.x - ( clickPosition.x - center.x ),
        y: center.y - ( clickPosition.y - center.y ),
      };
      moveResizeObj = {
        idx,
        parentRect,
        symmetricPoint,
        proportion: style.width / style.height,
        clickPosition,
      };
    }
  };
  const renderRotateGuides = useCallback( () => {
    const { style = {} } = activeParams || {};
    const { width = 0, height = 0, left = 0, top = 0 } = style;
    const maxValue = Math.max( width, height );
    const $width = maxValue * 1.2;
    const $left = left - maxValue * 0.1;
    const $top = top + height / 2;
    return (
      <div
        className={styles.rotateGuidesWrap}
        style={{ display: rotateGuides ? 'block' : 'none', left: $left, top: $top }}
      >
        {ROTATE_GUIDES.map( item => (
          <div
            key={item}
            className={styles.rotateGuidesItem}
            style={{ transform: `rotate(${item}deg)`, width: $width }}
          />
        ) )}
      </div>
    );
  }, [rotateGuides] );
  const isView = useMemo( () => {
    return componentData.some( item => item.isView && item.id === activeParams?.id );
  }, [componentData, activeParams] );
  const isLock = useMemo( () => {
    return componentData.some( item => item.isLock && item.id === activeParams?.id );
  }, [componentData, activeParams] );

  const renderComponentsBorder = useCallback( () => {
    const { style = {} } = activeParams || {};
    return (
      <div
        className={styles[`${baseClass}Border`]}
        style={
          isView ? { ...style, transform: `rotate(${style?.rotate || 0}deg)` } : { display: 'none' }
        }
        ref={selectElWrap}
      >
        <div
          className={styles[`${baseClass}BorderContent`]}
          style={{ display: isLock ? 'none' : 'flex' }}
          onClick={e => e.stopPropagation()}
        >
          {computedBorderCircularCursor.map( ( cursor, idx ) => (
            <span
              key={Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )}
              style={{ cursor }}
              className={styles[`${baseClass}BorderCircular`]}
              onMouseDown={resizeMouseDown.bind( null, idx )}
            />
          ) )}

          <Icon
            className={styles[`${baseClass}BorderSync`]}
            onMouseDown={resizeMouseDown.bind( null, 'rotate' )}
            type="sync"
          />
        </div>
      </div>
    );
  }, [activeParams, isLock, computedBorderCircularCursor, activeParams?.style] );

  const changeActiveParams = useCallback(
    data => {
      const newData = { ...activeParams, ...data };
      setActiveParams( newData );
      if ( data.index !== activeParams.index ) {
        changeSetUpIdx( data.index );
      }
    },
    [activeParams]
  );


  const renderComponentList = () => {
    let view = (
      <div id="dragEditComponentsList" className={styles[`${baseClass}Container`]}>
        {componentData?.length ? ( componentData?.map(
          ( item, idx ) =>
            !item.inCombination && (
              <DragComponentsItem
                key={item.id}
                element={item}
                idx={idx}
                parentRef={parentRef}
                componentData={componentData}
                changeSetUpIdx={changeSetUpIdx}
                changeActive={changeActiveComponents}
              />
            )
        ) ) : (
          <div className={styles[`${baseClass}Empty`]}>
            <img src={addComponentsImg} alt="" />
            <p>从左侧选择组件添加到画布</p>
          </div> )}
      </div>
    )
    if ( layout === 'GRID' ) {
      view = (
        <StreamingLayoutComponentList
          parentRef={parentRef}
          changeSetUpIdx={changeSetUpIdx}
          changeActive={changeActiveComponents}
        />
      )
    }
    return view
  }
  return (
    <>
      {layout === 'FREEDOM' && renderRotateGuides()}
      {layout === 'FREEDOM' && renderComponentsBorder()}
      {renderComponentList()}
      <ShortcutKeys
        activeParams={activeParams}
        editWrapRef={parentRef}
        evalDragPosition={evalDragPosition}
        selectedComponents={selectedComponents}
        selectedArea={selectedArea}
        changeActiveParams={changeActiveParams}
        clearSelectArea={clearSelectArea}
        computedComponentsBoundary={computedComponentsBoundary}
        setPressControl={setPressControl}
        changeScaling={changeScaling}
        clearActive={clearActive}
      />
    </>
  );
}
const Tc = connect()( DragComponentsList );
export default forwardRef( ( props, ref ) => <Tc {...props} prevRef={ref} /> );

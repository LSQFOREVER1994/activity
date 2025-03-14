/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import classNames from 'classnames';
import useThrottle from '@/hooks/useThrottle';
import useDebounce from '@/hooks/useDebounce';
import styles from './index.less';
import Grid from './Grid';
import Operation from './Operation';
import { CommonOperationFun, CurrentPages } from '../../provider';
import DragComponentsList from './DragComponentsList';
import {
  editAreaAdsorbent,
  adsorptionBetweenComponents,
  customReferenceLineAdsorption,
} from './adsorbent';
import SetUp from './SetUp';
import { calculateRotatedPointCoordinate } from './DragComponentsList/calculateComponentPositonAndSize';
import { widthEnlargesPictureHeight } from '@/utils/utils'



const baseClass = 'dragEdit';
let mouseMoveType = '';
let customGuidesIndex = 0;
const DEFAULT_ARR = [];
function DragEdit() {
  const { addComponentsFun, DESTROY } = useContext( CommonOperationFun );
  const [currentPages, changeCurrentPages] = useContext( CurrentPages );
  const { style: { layout = 'FREEDOM' } } = currentPages;
  const [showRulerGrid, setShowRulerGrid] = useState( {
    ruler: true,
    grid: true,
  } );
  const [scaling, setScaling] = useState( 100 );
  const [visibleAreaSize, setVisibleAreaSize] = useState( {} );
  const [operationElSize, setOperationElSize] = useState( {} );
  const [initSelectPosition, setInitSelectPosition] = useState( {} )
  const [initPosition, setInitPosition] = useState( {} )
  const [guides, setGuides] = useState( [] );
  const [selectedArea, setSelectedArea] = useState( null );
  const [selectedComponents, setSelectedComponents] = useState( [] );
  const [customGuides, setCustomGuides] = useState( [] );
  const [infoTipModal, setInfoTipModal] = useState( null );
  const visibleAreaEl = useRef( null );
  const editOperationEl = useRef( null );
  const dragComponentsListEl = useRef( null );
  const {
    componentData = DEFAULT_ARR,
    style: { height: pageHeight },
  } = currentPages;
  const changeRulerGrid = useCallback(
    obj => {
      setShowRulerGrid( { ...showRulerGrid, ...obj } );
    },
    [showRulerGrid]
  );

  // 画布缩放方法
  const changeScaling = useThrottle( type => {
    const newScale = type === '+' ? scaling + 10 : scaling - 10;
    if ( newScale > 150 ) {
      message.warning( '已达缩放上限' );
      return;
    }
    if ( newScale < 50 ) {
      message.warning( '已达缩放下限' );
      return;
    }
    setScaling( newScale );
  }, 100 );
  useEffect( () => {
    if ( DESTROY ) {
      setCustomGuides( [] );
    }
  }, [DESTROY] );

  const getVisibleAreaSize = useDebounce( () => {
    const { width, height, left = 0, top = 0 } = visibleAreaEl.current.getBoundingClientRect();
    const { left: _left, height: _height } = operationElSize;
    const $scaling = scaling / 100;
    const obj = {
      width: width / $scaling,
      height: height / $scaling,
      offsetXInWrap: ( _left - left ) / $scaling,
      offsetYInWrap: Math.abs( ( _height - height ) / $scaling / 2 ),
      left,
      top,
    };
    setVisibleAreaSize( obj );
  }, 50 );
  useEffect( () => {
    if ( !Object.keys( operationElSize ).length ) return () => { };
    getVisibleAreaSize();
    window.addEventListener( 'resize', getVisibleAreaSize );
    return () => {
      window.removeEventListener( 'resize', getVisibleAreaSize );
    };
  }, [operationElSize] );
  const getOperationElSize = async () => {
    // 初始化需要等待页面加载再获取
    if ( !Object.keys( operationElSize ).length && scaling === 100 ) {
      await new Promise( resolve => {
        setTimeout( resolve, 400 );
      } );
    }
    // const { current } = editOperationEl;
    const clientRect = editOperationEl?.current?.getBoundingClientRect();
    const { width, height, left, top } = clientRect;
    setOperationElSize( {
      width,
      height,
      left,
      top,
    } );
  };
  useEffect( () => {
    getOperationElSize();
    // drawRuler()
  }, [scaling, pageHeight] );

  const createGuides = ( { left, top }, option ) => {
    const obj = {
      left,
      top,
    };
    const editAreaGuides = editAreaAdsorbent( obj, option, visibleAreaSize, pageHeight  );
    const componentsGuides = adsorptionBetweenComponents( obj, option, componentData );
    customReferenceLineAdsorption( obj, option, customGuides );
    setGuides( editAreaGuides.concat( componentsGuides ) );
    return obj;
  };
  /**
   * @example 计算当前鼠标位置
   * @param {object} option {x:e.pageX,y:e.pageY,width,height}
   * @param {boolean} adsorbent 是否需要吸附与参考线 默认需要
   */
  const evalDragPosition = useCallback(
    ( option, adsorbent = true ) => {
      const { x, y, width, height, offsetX = 0, offsetY = 0, noCenter = false } = option;
      // x,y参数受滚动影响，需要实时获取
      const clientRect = editOperationEl.current.getBoundingClientRect();
      const offsetleft = ( ( x - clientRect.x ) / scaling ) * 100;
      const offsetTop = ( ( y - clientRect.y ) / scaling ) * 100;
      const obj = {
        left: !noCenter && width ? offsetleft - width / 2 : offsetleft,
        top: !noCenter && height ? offsetTop - height / 2 : offsetTop,
      };
      // ∵ offsetX = clientX - style.left - left;
      // clientRect.x&clientRect.y: 画布距离视窗边界的距离
      // marginLeft&marginTop: 组件距离画板边界的距离
      // x&y: 鼠标距离视窗边界的距离
      const marginLeft = ( -offsetX + x - clientRect.x ) * scaling / 100
      const marginTop = ( -offsetY + y - clientRect.y ) * scaling / 100

      const newOffsetX = ( x - clientRect.x - marginLeft ) * 100 / scaling
      const newOffsetY = ( y - clientRect.y - marginTop ) * 100 / scaling

      if ( offsetX ) obj.left -= newOffsetX;
      if ( offsetY ) obj.top -= newOffsetY;
      const { left, top } = adsorbent ? createGuides( obj, option ) : obj;
      return { left: Math.round( left ), top: Math.round( top  ) };
    },
    [scaling, visibleAreaSize, componentData, customGuides]
  );
  const evalMouseUp = () => {
    if ( infoTipModal ) {
      setInfoTipModal( null );
    }
    if ( !guides.length ) return;
    setGuides( [] );
  };
  /**
   * @example 处理拖拽数据
   * @param {*} evt
   * @returns
   */
  const evalOndrop = async evt => {
    evt.preventDefault();
    const data = evt.dataTransfer.getData( 'activityAddOrEditDrag' );
    if ( !data ) return;
    const newData = JSON.parse( data );
    const { width, height } = newData.style;
    const { x, y } = evt.nativeEvent;
    const { left, top } = evalDragPosition( { x, y, width, height }, false );
    newData.style.left = left;
    newData.style.top = top;
    if ( newData.type === 'IMAGE' && newData.SET_HEIGHT ) {
      newData.style.height = await widthEnlargesPictureHeight( newData.propValue.image, width ).catch( () => height )
    }
    addComponentsFun( newData );
  };
  const editVisibleAreaClick = () => {
    dragComponentsListEl.current.clearActive();
  };
  // 等待更新完成才能出现选中区域
  useEffect( () => {
    if ( !selectedArea || Object.keys( selectedArea ).length > 2 ) return;
    mouseMoveType = 'select';
  }, [selectedArea] );
  const editVisibleAreaMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    const { clientX, clientY } = e.nativeEvent;
    const { left, top } = evalDragPosition( { x: clientX, y: clientY }, false );
    setSelectedArea( { firstLeft: left, firstTop: top } );
  };
  /**
   * @example 处理鼠标选中区域
   * @param {ReactEventHandler} e
   * @returns
   */
  const evalSelectedArea = e => {
    if ( !e.nativeEvent || !selectedArea ) return;
    const { clientX, clientY } = e.nativeEvent;
    const { left, top } = evalDragPosition( { x: clientX, y: clientY }, false );
    const { firstLeft, firstTop } = selectedArea;
    const width = Math.abs( left - firstLeft );
    const height = Math.abs( top - firstTop );
    const newLeft = ( firstLeft > left ? left : firstLeft );
    const newTop = ( firstTop > top ? top : firstTop );
    setSelectedArea( { firstLeft, firstTop, top: newTop, left: newLeft, width, height } );
  };

  /**
   * @example 计算组件边界值
   * @param {array} arr 需要计算的数组
   * @param {object} selectPosition 选中范围
   * @returns
   */
  const computedComponentsBoundary = useCallback( ( arr, selectPosition ) => {
    if ( !arr || arr?.length < 2 ) return false;
    const obj = {
      left: Infinity,
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity,
    };
    const resArr = arr.filter( item => {
      if ( !item.isView || item.inCombination ) return false;
      const { left, top, width, height, rotate } = item.style;
      const centerObj = {
        x: left + width / 2,
        y: top + height / 2,
      };
      const coordinatePoint = [];
      coordinatePoint.push( calculateRotatedPointCoordinate( { x: left, y: top }, centerObj, rotate ) );
      coordinatePoint.push(
        calculateRotatedPointCoordinate( { x: left + width, y: top }, centerObj, rotate )
      );
      coordinatePoint.push(
        calculateRotatedPointCoordinate( { x: left + width, y: top + height }, centerObj, rotate )
      );
      coordinatePoint.push(
        calculateRotatedPointCoordinate( { x: left, y: top + height }, centerObj, rotate )
      );
      // 筛选在范围内的组件
      if ( selectPosition ) {
        const boundary = coordinatePoint.reduce(
          ( prev, point ) => {
            if ( point.x < prev.minX ) prev.minX = point.x;
            if ( point.y < prev.minY ) prev.minY = point.y;
            if ( point.x > prev.maxX ) prev.maxX = point.x;
            if ( point.y > prev.maxY ) prev.maxY = point.y;
            return prev;
          },
          {
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity,
          }
        );
        if ( boundary.minX < selectPosition.left ) return false;
        if ( boundary.maxX > selectPosition.left + selectPosition.width ) return false;
        if ( boundary.minY < selectPosition.top ) return false;
        if ( boundary.maxY > selectPosition.top + selectPosition.height ) return false;
      }
      // 组件边界值
      coordinatePoint.forEach( point => {
        if ( point.x < obj.left ) obj.left = point.x;
        if ( point.x > obj.right ) obj.right = point.x;
        if ( point.y < obj.top ) obj.top = point.y;
        if ( point.y > obj.bottom ) obj.bottom = point.y;
      } );
      return true;
    } );
    if ( resArr.length < 2 ) return false;
    obj.width = Math.round( obj.right - obj.left );
    obj.height = Math.round( obj.bottom - obj.top );
    obj.left = Math.round( obj.left )
    obj.top = Math.round( obj.top )
    delete obj.right;
    delete obj.bottom;
    mouseMoveType = 'freeze';
    setSelectedArea( obj );
    setSelectedComponents( resArr );
    return true;
  }, [] );


  const evalVisibleAreaMouseOut = () => {
    dragComponentsListEl.current.clearMoveFlag();
  };
  const editVisibleAreaMouseUp = e => {
    e.stopPropagation();
    if ( selectedComponents.length ) {
      setSelectedComponents( [] );
    }
    if ( !mouseMoveType ) return;
    if ( Object.keys( selectedArea || {} ).length > 2 && computedComponentsBoundary( componentData, selectedArea ) ) return;
    mouseMoveType = '';
    setSelectedArea( null );
  };
  /* 处理自定义参考线移动 */
  const evalCustomGuidesMove = e => {
    const idx = customGuidesIndex;
    const item = customGuides[idx];
    if ( !item || !e.nativeEvent ) return;
    const { clientX, clientY } = e.nativeEvent;
    const position = evalDragPosition( { x: clientX, y: clientY }, false );
    const type = Object.keys( item )[0];
    item[type] = position[type];

    // 拖出界外删除自定义参考线
    if ( type === 'left' ) {
      if ( position.left < -30 || position.left > 405 ) {
        customGuides.splice( idx, 1 );
      }
    }
    if ( type === 'top' ) {
      if ( position.top < -30 ) {
        customGuides.splice( idx, 1 );
      }
    }
    setCustomGuides( customGuides.concat( [] ) );
    setInfoTipModal( {
      left: position.left + 10,
      top: position.top + 10,
      content: `
      <p>${type === 'left' ? 'X' : 'Y'}:${position[type].toFixed( 2 )}</p>
    `,
    } );
  };
  // 画布高度移动
  const evalCanvasHeightResize = e => {
    if ( !e.nativeEvent ) return;
    const { clientX, clientY } = e.nativeEvent;
    const { top } = evalDragPosition( { x: clientX, y: clientY }, false );
    if ( top < 718 ){
      currentPages.style.height = 718
      return
    };
    currentPages.style.height = top;
    changeCurrentPages( currentPages );
  };
  const evalSelectedAreaMove = e => {
    if ( !e.nativeEvent ) return;
    if( !initSelectPosition.nativeEvent ) return 
    const { clientX, clientY } = e.nativeEvent;
    const { top:initTop, left:initLeft } = evalDragPosition( { x:initSelectPosition.nativeEvent.clientX, y:initSelectPosition.nativeEvent.clientY }, false )
    const { top, left } = evalDragPosition( { x: clientX, y: clientY }, false );
    const topGap = initTop - initPosition.top
    const leftGap = initLeft - initPosition.left
    const newTop = top - topGap
    const newLeft = left - leftGap
    const newComponentData = componentData.map( bItem => {
      const matchingItem = selectedComponents.find( aItem => aItem.id === bItem.id );
    if ( matchingItem ) {
      const componentTopGap = initTop - matchingItem.style.top
      const componentLeftGap = initLeft - matchingItem.style.left
      const componentNewTop = top - componentTopGap
      const componentNewLeft = left - componentLeftGap
      return { ...bItem, style:{ ...bItem.style, top:componentNewTop, left:componentNewLeft } };
    } 
      return bItem;
    } )
    currentPages.componentData = newComponentData
    setSelectedArea( { ...selectedArea, top:newTop, left: newLeft } )
    changeCurrentPages( currentPages );
  }

  const editVisibleAreaMouseMove = useThrottle( e => {
    const func = layout === 'GRID' ? () => { } : evalSelectedArea
    if ( !mouseMoveType ) return;
    e.persist();
    switch ( mouseMoveType ) {
      case 'select':
        func( e )
        break;
      case 'customGuides':
        evalCustomGuidesMove( e );
        break;
      case 'canvasHeightResize':
        evalCanvasHeightResize( e );
        break;
      case 'freeze':
        evalSelectedAreaMove( e )
        break;
      default:
        break;
    }
  }, 10 );
  const clearSelectArea = useCallback( () => {
    setSelectedArea( null );
    setSelectedComponents( [] );
    mouseMoveType = '';
  }, [] );
  const renderCustomGuides = useCallback( () => {
    if ( !customGuides.length ) return <></>;
    return customGuides.map( ( item, idx ) => {
      const style = {};
      const { height, width, offsetXInWrap, offsetYInWrap } = visibleAreaSize;
      const keys = Object.keys( item );
      if ( !keys?.length ) return null
      if ( keys.includes( 'top' ) ) {
        style.width = width;
        style.height = '1px';
        style.cursor = 'row-resize';
        style.left = -offsetXInWrap;
        style.top = item.top;
      }
      if ( keys.includes( 'left' ) ) {
        style.height = height;
        style.width = '1px';
        style.cursor = 'col-resize';
        style.top = -offsetYInWrap;
        style.left = item.left;
      }
      return (
        <div
          key={`${item.left}-${item.right}-${idx}`}
          className={styles[`${baseClass}customGuides`]}
          style={style}
          onMouseDown={e => {
            e.stopPropagation();
            mouseMoveType = 'customGuides';
            customGuidesIndex = idx;
          }}
          onDoubleClick={() => {
            customGuides.splice( idx, 1 );
            setCustomGuides( customGuides.concat( [] ) );
          }}
        />
      );
    } );
  }, [customGuides, visibleAreaSize] );
  const handleMouseDownRule = ( type, e ) => {
    e.stopPropagation();
    e.preventDefault();
    const { clientX, clientY } = e.nativeEvent;
    const position = evalDragPosition( { x: clientX, y: clientY }, false );
    const newArr = customGuides.concat( [{ [type]: position[type] }] );
    customGuidesIndex = newArr.length - 1;
    setCustomGuides( newArr );
    mouseMoveType = 'customGuides';
  };

  // 点击画布大小信息
  const handleMouseDownCanvasInfo = e => {
    e.stopPropagation();
    mouseMoveType = 'canvasHeightResize';
  };
  const selectObj = useMemo( () => {
    const obj = {
      selectedComponents: [],
      selectedArea: null,
    };
    if ( selectedComponents.length ) {
      obj.selectedArea = selectedArea;
      obj.selectedComponents = selectedComponents;
    }
    return obj;
  }, [selectedComponents] );


  // 刻度线数值
  const renderGraduationText = ( num, isVertical ) => {
    if ( !num ) return null
    const zoom = scaling / 100
    let textClass = styles[`${baseClass}RuleFont`]
    if ( isVertical ) textClass = classNames(
      styles[`${baseClass}RuleFont`],
      styles[`${baseClass}RuleFontVertical`]
    )
    const graduationText = new Array( parseInt( num / 100, 0 ) + 1 ).fill( '' ).map( ( i, idx ) => {
      return (
        <span
          key={Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )}
          className={textClass}
          style={{ left: `${( idx ) * 100 * zoom}px` }}
        >
          {idx * 100}
        </span>
      )
    } )
    return graduationText
  }

  // 刻度线
  const graduationDom = () => {
    const zoom = scaling / 100
    const graduationStyle = `repeating-linear-gradient(to right, #aaa 0, #aaa 0.05em, transparent 0, transparent ${100 * zoom}px),
   repeating-linear-gradient(to right, #aaa 0, #aaa 0.05em, transparent 0, transparent ${50 * zoom}px)`
    return (
      <>
        <div
          className={classNames(
            styles[`${baseClass}RuleView`],
            styles[`${baseClass}RuleViewCross`]
          )}
          style={{
            width: operationElSize.width,
            backgroundImage: graduationStyle
          }}
          onMouseDown={handleMouseDownRule.bind( null, 'top' )}
        >
          {renderGraduationText( 375 )}
        </div>
        <div
          className={classNames(
            styles[`${baseClass}RuleView`],
            styles[`${baseClass}RuleViewVertical`]
          )}
          style={{ width: `${pageHeight * ( scaling / 100 )}px`, backgroundImage: graduationStyle }}
          onMouseDown={handleMouseDownRule.bind( null, 'left' )}
        >
          {renderGraduationText( pageHeight, true )}
        </div>
      </>
    )
  }


  // 组件间的参考线
  const renderGuides = () => {
    if ( !guides || ( guides && !guides.length ) ) return null

    const guidesItem = guides.map( ( item ) => {
      let itemStyle = { ...item }
      if ( !item.width && item.height ) {
        itemStyle = {
          ...item,
          width: '1px',
          height: '100%',
          top: 0
        }
      } else if ( item.width && !item.height ) {
        itemStyle = {
          ...item,
          width: '100%',
          height: '1px',
          left: 0
        }
      }
      return (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )}
          className={styles[`${baseClass}ContentGuids`]}
          style={itemStyle}
        >
          <div>
            {/* <p style={{ whiteSpace: 'nowrap' }}> {item.$spacing > 0 && `间距:${item.$spacing}`}</p> */}
            {/* <p style={{ whiteSpace: 'nowrap' }}>
              {item.$spacingAndSize && (
                <>
                  起始间距:
                  {item.$spacingAndSize}
                </>
              )}
            </p> */}
          </div>
        </div>
      )
    } )
    return guidesItem
  }

  return (
    <div className={styles[`${baseClass}Wrap`]} onMouseOut={evalVisibleAreaMouseOut}>
      <div className={styles[`${baseClass}ScrollWrap`]}>
        <div
          className={styles[`${baseClass}Scroll`]}
          onClick={editVisibleAreaClick}
          ref={visibleAreaEl}
          onMouseOut={e => {
            e.stopPropagation();
          }}
          onMouseDown={editVisibleAreaMouseDown}
          onMouseUp={editVisibleAreaMouseUp}
          onMouseMove={editVisibleAreaMouseMove}
        >
          <div className={styles[`${baseClass}Periphery`]} />
          <div className={styles[`${baseClass}ContentWrap`]}>
            <div className={styles[`${baseClass}Periphery`]} />
            <div
              className={styles[`${baseClass}Content`]}
              style={{ width: operationElSize.width, height: operationElSize.height }}
            >
              <div
                className={styles[`${baseClass}ContentSizeInfo`]}
              >
                <div className={styles[`${baseClass}ContentSize`]} onMouseDown={handleMouseDownCanvasInfo}>—</div>
                <span className={styles[`${baseClass}ContentSizeHeight`]}>{pageHeight || 718}</span>
              </div>
              {/* 标尺 */}
              {showRulerGrid.ruler && graduationDom()}
              <div
                className={styles[`${baseClass}ContentOperation`]}
                ref={editOperationEl}
                style={{
                  transform: `translate(-50%, -50%) scale(${scaling / 100})`,
                  height: pageHeight > 718 ? pageHeight : 718,
                }}
                onDrop={evalOndrop}
                onDragOver={ev => {
                  ev.preventDefault();
                }}
                onMouseUp={evalMouseUp}
              >
                <Grid showRulerGrid={showRulerGrid} />
                <DragComponentsList
                  scaling={scaling}
                  visibleAreaRef={visibleAreaEl}
                  parentRef={editOperationEl}
                  evalDragPosition={evalDragPosition}
                  changeScaling={changeScaling}
                  ref={dragComponentsListEl}
                  clearSelectArea={clearSelectArea}
                  computedComponentsBoundary={computedComponentsBoundary}
                  setInfoTipModal={setInfoTipModal}
                  {...selectObj}
                />
                {/* 组件之间参考线 */}
                {renderGuides()}
                <div className={styles[`${baseClass}StandardScreen`]}>
                  <div />
                  <span>标准屏</span>
                </div>
                <div className={styles[`${baseClass}FullScreen`]}>
                  <div />
                  <span>全面屏</span>
                </div>
                {/* 自定义参考线 */}
                {renderCustomGuides()}
                {/* 信息提示框 */}
                {infoTipModal && (
                  <div
                    className={styles[`${baseClass}infoTipModal`]}
                    style={{ left: infoTipModal.left, top: infoTipModal.top }}
                    dangerouslySetInnerHTML={{ __html: infoTipModal.content }}
                  />
                )}

                {/* 选中框 */}
                {selectedArea && mouseMoveType && (
                  <div
                    className={styles[`${baseClass}SelectedArea`]}
                    style={selectedArea}
                    onMouseUp={e => {
                      if ( mouseMoveType === 'freeze' ) e.stopPropagation();
                      setInitPosition( {} )
                      setInitSelectPosition( {} )
                    }}
                    onMouseDown={e => {
                      e.stopPropagation();
                      setInitSelectPosition( e )
                      setInitPosition( selectedArea )
                    }}
                    onClick={clearSelectArea}
                  />
                )}
              </div>
            </div>
            <div className={styles[`${baseClass}Periphery`]} />
          </div>
          <div className={styles[`${baseClass}Periphery`]} />
        </div>
      </div>
      <Operation
        scaling={scaling}
        changeScaling={changeScaling}
        changeRulerGrid={changeRulerGrid}
      />
      <SetUp />
    </div>
  );
}

export default DragEdit

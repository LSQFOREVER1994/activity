/*
 * @Author: ZHANG_QI
 * @Date: 2023-08-29 14:40:59
 * @LastEditors: ZHANG_QI
 * @LastEditTime: 2023-10-16 09:09:38
 */
import React, { useState, useEffect } from "react";
import { Slider, InputNumber } from "antd";
import { SketchPicker } from "react-color";
import PropTypes from 'prop-types';
import ColorPipette from './color-pipette/index'
// import PipetteIcon from './icon/pipette'
import 'animate.css';
import styles from './ColorPickerModal.less'

const translateXValue = [2, 116];

function ColorPickerModal( {
  hasGradient,
  defaultColor,   
  changeColor,
  componentMountRef,
  onClose,
  mountOffset
} ) {
  const [boxPosition, setBoxPosition] = useState( { left: 0, top: 0 } );
  const [isDragging, setIsDragging] = useState( false );
  const [dragOffset, setDragOffset] = useState( { x: 0, y: 0 } );
  const [isShow, setIsShow] = useState( true );
  const [targetTabItem, setTargetTabItem] = useState( "0" );
  const [pureColor, setPureColor] = useState( "rgba(21,255,255,1)" );
  const [gradientColorArray, setGradientColorArray] = useState( [
    "rgba(255,255,255)",
    "rgba(0,0,0)",
    "90",
  ] );
  const [currentGraditenIndex, setCurrentGraditenIndex] = useState( "0" );
  const boxRef = React.useRef( null );

  const positionBoxBelowTrigger = () => {
    const triggerRect = componentMountRef.current.getBoundingClientRect();
    setBoxPosition( {
      left: triggerRect.left + ( mountOffset?.left || 0 ),
      top: triggerRect.bottom + ( mountOffset?.top || 10 ),
    } );
  };

  const handleDocumentClick = ( event ) => {
    if (
      !boxRef?.current?.contains( event?.target ) &&
      event?.target !== componentMountRef?.current
    ) { 
      onClose();
    }
  };

  const handleBoxHeaderMouseDown = ( event ) => {
    setIsDragging( true );
    setDragOffset( {
      x: event.clientX - boxPosition.left,
      y: event.clientY - boxPosition.top,
    } );
  };

  const handleDocumentMouseMove = ( event ) => {
    if ( !isDragging ) return;

    setBoxPosition( {
      left: event.clientX - dragOffset.x,
      top: event.clientY - dragOffset.y,
    } );
  };

  const handleDocumentMouseUp = () => {
    setIsDragging( false );
  };

  const handleChangeTab = ( value ) => {
    setTargetTabItem( value );
  };

  const handleChangeGradientColor = ( e ) => {
    const updatedColors = [...gradientColorArray];
    const { r, g, b, a } = e.rgb || {} ;
    const val = e?.rgb ? `rgba(${r},${g},${b},${a})` : e;
    updatedColors[currentGraditenIndex] = val;
    setGradientColorArray( updatedColors );
    const resultColor = `linear-gradient(${updatedColors[2]}deg, ${updatedColors[0]} 0%, ${updatedColors[1]} 100%)`;
    changeColor( resultColor );
  };

  const extractLinearGradientInfo = ( input ) => {
    const gradientPattern = /^linear-gradient\((.+)\)$/;

    const matches = input.match( gradientPattern );
    if ( !matches ) return; // 输入不是 linear-gradient 类型

    const gradientInfo = matches[1];
    const parts = gradientInfo.split( "," );

    const angle = parts.find( ( part ) => part.includes( "deg" ) ).trim();
    const colorStrings = gradientInfo.match( /rgba?\([^)]+\)/g ) || [];
    const colors = colorStrings.map( ( color ) => color.trim() );
    setGradientColorArray( [...colors, parseInt( angle, 10 )] );
  };

  const checkFormat = ( input ) => {
    const gradientPattern = /^linear-gradient\([\s\S]*\)$/;
    const colorPattern = /^rgba?\([\d\s,.]*\)$/;
    if( !hasGradient ){
      handleChangeTab( "0" );
      if( colorPattern.test( input ) ){
        setPureColor( input );
      }
    }else if ( colorPattern.test( input ) ) {
      handleChangeTab( "0" );
      setPureColor( input );
    } else if ( gradientPattern.test( input ) ) {
      handleChangeTab( "1" );
      extractLinearGradientInfo( input );
    } else {
      setIsShow( false )
      console.error( '传入的纯色和渐变色的颜色格式都需要为rgba格式' )
    }
    
  };

  const isValidHexColor = ( color ) => {
   return /^#([A-Fa-f0-9]{3}){1,2}$/.test( color );
  }

  const convertToRgba = ( color ) => {
    if ( isValidHexColor( color ) ) {
      const hexColor = color.substring( 1 ); // 去掉开头的 #
      const r = parseInt( hexColor.slice( 0, 2 ), 16 );
      const g = parseInt( hexColor.slice( 2, 4 ), 16 );
      const b = parseInt( hexColor.slice( 4, 6 ), 16 );
      return `rgba(${r}, ${g}, ${b}, 1)`;
    } 
      return color; // 不是合法的颜色格式，直接返回原值
  }

  const handlePickerColor = () => {
    const pipette = new ColorPipette( {
      container: document.body,
      scale: 2,
      useMagnifier: true,
      listener: {
        onOk: ( { color } ) => {
          const val = convertToRgba( color?.hex || color );
          if( targetTabItem === '0' ){
            setPureColor( val );
            changeColor( val );
          }else{
            handleChangeGradientColor( val );
          }
        },
      },
    } );
    pipette.start()
    // setTimeout( () => pipette.start(), 300 );
  };

  useEffect( () => {
    document.addEventListener( "click", handleDocumentClick );
    document.addEventListener( "mousemove", handleDocumentMouseMove );
    document.addEventListener( "mouseup", handleDocumentMouseUp );

    return () => {
      document.removeEventListener( "click", handleDocumentClick );
      document.removeEventListener( "mousemove", handleDocumentMouseMove );
      document.removeEventListener( "mouseup", handleDocumentMouseUp );
    };
  }, [isDragging] );

  useEffect( () => {
    positionBoxBelowTrigger();
    const convertedColor = convertToRgba( defaultColor )
    checkFormat( convertedColor );
    if( boxRef?.current ) boxRef.current.style.animation = `fadeIn 0.5s ease normal both running`
  }, [] );
  return (
    <>
      {isShow && (
        <div
          className={styles.colorWrap}
          ref={boxRef}
          style={{
            left: `${boxPosition.left  }px`,
            top: `${boxPosition.top  }px`,
          }}
        >
          <div
            className={styles.colorWrapHeader}
            onMouseDown={handleBoxHeaderMouseDown}
          >
            <div className={styles.colorWrapTitle}>
              <span>颜色</span>
            </div>
            <div className={styles.colorWrapClose} onClick={onClose}>
              <svg
                role="img"
                aria-label="close"
                focusable="false"
                data-icon="close"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.closeIcon}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.9394 12.0001L4.46973 5.53039L5.53039 4.46973L12.0001 10.9394L18.4697 4.46973L19.5304 5.53039L13.0607 12.0001L19.5304 18.4697L18.4697 19.5304L12.0001 13.0607L5.53039 19.5304L4.46973 18.4697L10.9394 12.0001Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          {hasGradient && (
            <div className={styles.colorWrapContent}>
              <div className={styles.colorWrapContentTopWrap}>
                <div className={styles.colorWrapContentTopTabs}>
                  <div
                    className={styles.colorWrapContentTopTabsItem}
                    onClick={() => {
                    handleChangeTab( "0" );
                    changeColor( pureColor );
                  }}
                  >
                    <span>纯色</span>
                  </div>
                  <div
                    className={styles.colorWrapContentTopTabsItem}
                    onClick={() => {
                    handleChangeTab( "1" );
                    changeColor(
                      `linear-gradient(${gradientColorArray[2]}deg, ${gradientColorArray[0]} 0%, ${gradientColorArray[1]} 100%)`
                    );
                  }}
                  >
                    <span>渐变</span>
                  </div>
                  <div
                    className={styles.colorWrapContentTopTabsBlock}
                    style={{
                    width: "114px",
                    display: "block",
                    transform: `translateX(${translateXValue[targetTabItem]}px)`,
                  }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className={styles.colorWrapContentPicker}>
            {targetTabItem === "0" && (
              <div className={styles.colorWrapPurePicker}>
                <SketchPicker
                  width="210px"
                  color={pureColor}
                  onChange={( e ) => {
                    const { r, g, b, a } = e.rgb;
                    const val = `rgba(${r},${g},${b},${a})`;
                    setPureColor( val );
                    changeColor( val );
                  }}
                />
                {/* <div className={styles.pipette_color}>
                  <div className={styles.tool_row_content} onClick={handlePickerColor}>
                    <PipetteIcon className={styles.tool_row_icon} />
                    <div>拾色器</div>
                  </div>
                </div> */}
              </div>
            )}
            {targetTabItem === "1" && (
              <div className={styles.colorWrapGradientPicker}>
                <div className={styles.showGradientColorBox}>
                  <div
                    className={styles.showGradientColorWrap}
                    style={{
                      background: `linear-gradient(90deg, ${gradientColorArray[0]} 0%, ${gradientColorArray[1]} 100%)`,
                    }}
                  >
                    <div className={styles.showGradientColorContainer}>
                      <div
                        className={styles.gradientColorEelector}
                        style={{
                          borderColor:
                            currentGraditenIndex === "0"
                              ? "#2254f4"
                              : "#ffffff",
                        }}
                        onClick={() => {
                          setCurrentGraditenIndex( "0" );
                        }}
                      />
                      <div
                        className={styles.gradientColorEelector}
                        style={{
                          borderColor:
                            currentGraditenIndex === "1"
                              ? "#2254f4"
                              : "#ffffff",
                        }}
                        onClick={() => {
                          setCurrentGraditenIndex( "1" );
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.gradientRotation}>
                  <div className={styles.sliderContainer}>
                    <Slider
                      min={0}
                      max={360}
                      onChange={( e ) => {
                        const val = e?.target ? e.target.value : e;
                        const updatedColors = [...gradientColorArray];
                        updatedColors[2] = val;
                        setGradientColorArray( updatedColors );
                        const resultColor = `linear-gradient(${updatedColors[2]}deg, ${updatedColors[0]} 0%, ${updatedColors[1]} 100%)`;
                        changeColor( resultColor );
                      }}
                      step={1}
                      value={parseInt( gradientColorArray[2], 10 )}
                    />
                  </div>
                  <div className={styles.rotationNumberContainer}>
                    <InputNumber
                      min={0}
                      max={360}
                      style={{ width: "64px" }}
                      value={parseInt( gradientColorArray[2], 10 )}
                      // value={multiply(opacity, 100, 2)}
                      onChange={( e ) => {
                        const val = e?.target ? e.target.value : e;
                        const updatedColors = [...gradientColorArray];
                        updatedColors[2] = val;
                        setGradientColorArray( updatedColors );
                        const resultColor = `linear-gradient(${updatedColors[2]}deg, ${updatedColors[0]} 0%, ${updatedColors[1]} 100%)`;
                        changeColor( resultColor );
                      }}
                    />
                  </div>
                </div>
                <SketchPicker
                  width="210px"
                  color={gradientColorArray[currentGraditenIndex]}
                  onChange={handleChangeGradientColor}
                />
                {/* <div className={styles.pipette_color}>
                  <div className={styles.tool_row_content} onClick={handlePickerColor}>
                    <PipetteIcon className={styles.tool_row_icon} />
                    <div>拾色器</div>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

ColorPickerModal.propTypes = {
  hasGradient: PropTypes.bool,
  defaultColor: PropTypes.string,
  changeColor: PropTypes.func.isRequired,
  componentMountRef: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  mountOffset:PropTypes.shape( {
    left: PropTypes.number,
    top: PropTypes.number,
  } ),
};

ColorPickerModal.defaultProps = {
  hasGradient: true,
  defaultColor: 'rgba(255,255,255,1)',
  mountOffset:{
    top:10,
    left:0,
  },
};

export default ColorPickerModal;

import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Tooltip } from 'antd';

/**
 * 渲染一组显示ColorPicker的组件。
 *
 * @param {Object} props - props.
 * @param {Function} props.onChange - onChange, 返回变更后的colors.
 * @param {Object} props.value - 一组颜色。
 * @param {Object} props.colorsTip - 每个颜色对应的提示。
 * @param {Array} props.colorsKey - 每个颜色对应的key,先用数组来保证顺序。
 * @param {Object} props.style - 额外样式。
 * @return {JSX.Element}
 */

function ColorsMap( props ) {
  const { onChange, value, colorsTip, colorsKey, style } = props;
  const [colorIndex, setColorIndex] = useState( -1 );
  const [showSketchPicker, setShowSketchPicker] = useState( false );
  let keysArr
  if ( !colorsKey ) {
    keysArr = Object.keys( colorsTip )
  } else {
    keysArr = colorsKey
  }
  return (
    <div
      style={{
        position: 'relative',
        height: '30px',
        width: '100%',
        ...style,
      }}
    >
      {
        keysArr?.map( ( item, idx ) => {
          return (
            <div
              key={item}
              onClick={() => {
                setColorIndex( idx );
                setShowSketchPicker( true );
              }}
              style={{
                position: 'absolute',
                left: `${idx * 40}px`,
                zIndex: 998,
                border: '1px solid #d9d9d9',
                borderRadius: '2px',
                width: '30px',
                height: '30px',
                cursor: 'pointer'
              }}
            >
              <Tooltip
                placement="top"
                title={colorsTip ? colorsTip[item] : ''}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    margin: '2px',
                    backgroundColor: value ? value[item] : "#fff"
                  }}
                />
              </Tooltip>
            </div>
          )
        } )
      }
      {showSketchPicker && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 990,
            }}
            onClick={() => {
              setShowSketchPicker( !showSketchPicker );
              setColorIndex( -1 );
            }}
          />
          <div style={{
            position: 'absolute',
            top: 30,
            zIndex: 999,
            width: '200px'
          }}
          >
            <SketchPicker
              color={value[keysArr[colorIndex]] || undefined}
              onChange={e => {
                const { r, g, b, a } = e.rgb;
                onChange( {
                  ...value,
                  [keysArr[colorIndex]]: `rgba(${r},${g},${b},${a})`,
                } );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ColorsMap

/* eslint-disable import/no-extraneous-dependencies */
import React, { useContext } from 'react';
import { connect } from 'dva';
import GridLayout from 'react-grid-layout';
import { CurrentPages } from '../../../../provider';
import StreamingLayoutComponentItem from './StreamingLayoutComponentItem';
import 'react-grid-layout/css/styles.css';
import styles from './index.less';


const baseClass = 'StreamingLayoutComponentList';
function StreamingLayoutComponentList( { parentRef, changeSetUpIdx, changeActive } ) {
  const [currentPages, changeCurrentPages] = useContext( CurrentPages );
  const { componentData = [] } = currentPages;

  const gridLayouts =  () => {
    if ( !componentData?.length ) return [];
    const data =  componentData.filter( item => !item.inCombination ).map( ( item ) => {
      return {
        i: item.id,
        x: item.style.left >= 0 ? item.style.left : 0,
        y: item.style.top,
        w: item.style.width,
        h: item.style.height,
      };
    } );
    return data;
  }
  
    const layoutProps = {
    className: 'layout',
    layout: gridLayouts(),
    cols: 375,
    rowHeight: 1,
    width: 375,
    margin: [0, 0],
    isResizable: true,
    isBounded: true,
    // resizeHandles: ['s', 'e', 'se'],
    // resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'],
    resizeHandles: ['se'],
    onLayoutChange: layoutPosition => {
      const newList = componentData.map( item => {
        const { x, y, w, h } = layoutPosition.find( child => child.i === item.id ) || {};
        Object.assign( item.style, {
          left: x,
          top: y,
          width: w,
          height: h,
        } );
        return item;
      } );
      changeCurrentPages( { componentData:newList } );
    },
  };
  return (
    <div id="streamingLayoutComponentsList" className={styles[`${baseClass}Container`]}>
      <GridLayout {...layoutProps}>
        {componentData.filter( item => !item.inCombination ).map( ( item, index ) => (
          <div key={item.id} id="layout" style={{ width:`${item.style.width}px`, height:`${item.style.width}px` }}>
            <StreamingLayoutComponentItem
              key={item.id}
              element={item}
              idx={index}
              parentRef={parentRef}
              componentData={componentData}
              changeSetUpIdx={changeSetUpIdx}
              changeActive={changeActive}
            />
          </div>
          ) )}
      </GridLayout>
    </div>
  );
}


export default connect()( StreamingLayoutComponentList );

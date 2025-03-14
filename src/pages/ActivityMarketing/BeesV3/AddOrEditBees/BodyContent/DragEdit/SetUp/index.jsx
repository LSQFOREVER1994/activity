/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Tabs, message } from 'antd';
import { connect } from 'dva';
import _ from 'lodash'
import copy from 'copy-to-clipboard'
import useThrottle from '@/hooks/useThrottle';
import styles from './index.less';
import ComponentSettings from './ComponentSettings';
import { CurrentPages, ComponentsDataContext } from '../../../provider';
import Animation from './Animation';

let flag = null;
const { TabPane } = Tabs;
function SetUp( { currentEditId, dispatch } ) {
  const [currentPages, changeCurrentPages] = useContext( CurrentPages );
  const { componentData } = currentPages;
  const setupEl = useRef( null );
  const evalMouseMove = useThrottle( e => {
    if ( !flag ) return;
    const { clientX, clientY } = e;
    let left = clientX - flag.offsetX;
    let top = clientY - flag.offsetY;
    if ( top <= 69 ) top = 65
    if ( top + 46 >= window.innerHeight ) top = window.innerHeight - 46
    if ( left <= 0 ) left = 0
    if ( left + 376 >= window.innerWidth ) left = window.innerWidth - 376
    setupEl.current.style.left = `${left}px`;
    setupEl.current.style.top = `${top}px`;
  }, 40 );
  const evalMouseUp = () => {
    flag = null;
  }
  useEffect( () => {
    document.addEventListener( 'mousemove', evalMouseMove );
    document.addEventListener( 'mouseup', evalMouseUp )
    return () => {
      document.removeEventListener( 'mouseup', evalMouseUp )
      document.removeEventListener( 'mousemove', evalMouseMove );
    };
  }, [] );
  const evalMouseDown = e => {
    const { offsetX, offsetY } = e.nativeEvent;
    flag = { offsetX, offsetY };
  };
  const handleClose = ( e ) => {
    if ( e ) e.stopPropagation()
    dispatch( {
      type: 'beesVersionThree/SetState',
      payload: {
        currentEditId: undefined,
      },
    } );
  };

  const currentComponent = useMemo( () => {
    if ( typeof currentEditId !== 'number' || !componentData ) return {};
    return componentData[currentEditId];
  }, [currentEditId, componentData] );
  const changeCurrentComponent = ( val, key ) => {
    const value = val?.target ? val.target?.value : val;
    const data = _.set( currentComponent, key, value )
    const newData = { ...currentComponent, ...data };
    componentData[currentEditId] = newData;
    changeCurrentPages( currentPages );
  };
  // 锁定状态直接关闭
  useEffect( () => {
    if ( currentComponent.isLock && !currentComponent.inCombination ) {
      handleClose()
    }
  }, [currentEditId] )
  const [functionConfig, setFunctionConfig] = useState( [] );
  useEffect( () => {
    dispatch( {
      type: 'bees/typeFunctionConfig',
      payload: {
        body: {
          jumpType: 'FUNCTION',
          page:{
            pageNum: 1,
            pageSize: 10000,
          }
        },
        callback: res => {
          setFunctionConfig( res.list );
        },
      },
    } );
  }, [] );

  const copyId = ( e, id ) => {
    if( e ) e.stopPropagation();
    if( !id ) return;
    if( copy( id ) ){
      message.success( '复制成功' );
    }else{
      message.error( '复制失败' )
    }
  }

  return (
    <div
      className={styles.setupWrap}
      ref={setupEl}
      style={{ display: currentEditId !== undefined ? 'block' : 'none' }}
    >
      <div
        className={styles.setupTitle}
        onMouseDown={evalMouseDown}
      >
        <span>组件设置（{currentComponent.id}）<Icon type="copy" onClick={( e )=>{copyId( e, currentComponent.id )}} onMouseDown={( e )=>e.stopPropagation()} /></span>
        <Icon type="close" onClick={handleClose} onMouseDown={( e )=>e.stopPropagation()} />
      </div>
      <div className={styles.setupContent}>
        <ComponentsDataContext.Provider value={[currentComponent, changeCurrentComponent ]}>
          <Tabs tabBarGutter={0} defaultActiveKey="1" type="card">
            <TabPane tab="组件设置" key="1">
              <ComponentSettings functionConfig={functionConfig} />
            </TabPane>
            <TabPane tab="动画" key="2">
              <Animation />
            </TabPane>
          </Tabs>
        </ComponentsDataContext.Provider>
      </div>
    </div>
  );
}
const mapProps = ( { beesVersionThree } ) => ( {
  currentEditId: beesVersionThree.currentEditId,
} );
export default connect( mapProps )( SetUp );

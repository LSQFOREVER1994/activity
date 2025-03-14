/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Collapse, Tooltip, Icon, Row, Col, InputNumber, Radio, Modal } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import AnimationDrawer from './AnimationDrawer';
import { ComponentsDataContext } from '../../../../provider';
import { DEFAULT_ANIMATION } from '../../../../addDefaultObj';

const { Panel } = Collapse;
const baseClass = 'animation';
const genNonDuplicateID = randomLength => {
  return Number(
    Math.random()
      .toString()
      .substr( 3, randomLength ) + Date.now()
  ).toString( 36 );
};
let animationEndTime = null;
function Animation( { currentActiveEl } ) {
  const [componentData, changeComponentData] = useContext( ComponentsDataContext );
  const [visible, setVisible] = useState( false );
  const [editIdx, setEditIdx] = useState( undefined );
  const [preViewData, setPerViewData] = useState( null );
  const [activeKey, setActiveKey] = useState( [] );
  const { animations = [] } = componentData || {};
  const handleChangeDrawwer = useCallback( () => {
    setVisible( !visible );
  }, [visible] );
  const addAnimation = ( { label, value, type } ) => {
    const newData = JSON.parse( JSON.stringify( DEFAULT_ANIMATION ) );
    newData.label = label;
    newData.value = value;
    newData.id = genNonDuplicateID();
    newData.type = type;
    animations.push( newData );
    setActiveKey( activeKey.concat( [newData.id] ) );
    changeComponentData( animations, 'animations' );
  };
  const addOrEditAnimation = useCallback(
    item => {
      if ( editIdx !== undefined ) {
        animations[editIdx].label = item.label;
        animations[editIdx].value = item.value;
        animations[editIdx].type = item.type;
        setEditIdx( undefined )
      } else {
        addAnimation( item );
      }
      handleChangeDrawwer();
    },
    [animations, visible]
  );
  // 预览单个动画
  const previewSingleAnimation = useCallback(
    data => {
      if ( animationEndTime ) clearTimeout( animationEndTime );
      return new Promise( resolve => {
        let type = '';
        let time = 1;
        let delay = 0;
        let animationLoopTotal = 1;
        if ( typeof data === 'string' ) {
          type = data;
          if ( preViewData ) setPerViewData( null );
        } else {
          type = data.value;
          time = data.animationTime;
          delay = data.animationDelay || 0;
          animationLoopTotal = data.animationLoopTotal || 1;
        }
        currentActiveEl.style.animation = `${type} ${time}s ease ${delay}s ${animationLoopTotal} normal both running`;
        if ( animationLoopTotal === 'infinite' ) {
          return;
        }
        animationEndTime = setTimeout( () => {
          currentActiveEl.style.animation = '';
          resolve( true );
        }, ( time + delay ) * 1000 * animationLoopTotal );
      } );
    },
    [currentActiveEl, preViewData]
  );
  const changePreViewData = data => {
    if ( preViewData ) return;
    const newData = Object.prototype.toString.call( data ) === '[object Object]' ? [data] : data;
    setPerViewData( newData );
  };
  /**
   * @example 同步执行动画
   * @param {array | object} data
   * @returns {undefined}
   */
  const syncPreviewAnimation = async () => {
    const leg = preViewData.length;
    for ( let i = 0; i < leg; i += 1 ) {
      const item = preViewData[i];
      await previewSingleAnimation( item );
    }
    setPerViewData( null );
  };
  useEffect( () => {
    if ( !preViewData ) return;
    syncPreviewAnimation();
  }, [preViewData] );
  const clearAnimation = () => {
    currentActiveEl.style.animation = '';
    setPerViewData( null );
  };
  const removeAnimation = ( e, idx ) => {
    e.stopPropagation();
    Modal.confirm( {
      title: '您确定要删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        animations.splice( idx, 1 );
        changeComponentData( animations, 'animations' );
      },
    } );
  };
  const handleClickEdit = ( idx, e ) => {
    e.stopPropagation();
    setEditIdx( idx );
    handleChangeDrawwer();
  };
  const renderPanel = () => {
    return animations.map( ( item, idx ) => {
      const header = (
        <div className={styles[`${baseClass}PanelHeader`]}>
          <h3>动画{idx + 1}</h3>
          <p onClick={handleClickEdit.bind( null, idx )}>
            {item.label}
            <Icon type="right" />
          </p>
          <div className={styles[`${baseClass}PanelHeaderOperation`]}>
            <Tooltip placement="bottom" title="预览动画">
              <Icon
                type="play-circle"
                onClick={e => {
                  e.stopPropagation();
                  changePreViewData( item );
                }}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="删除">
              <Icon
                type="delete"
                onClick={e => {
                  removeAnimation( e, idx );
                }}
              />
            </Tooltip>
          </div>
        </div>
      );
      return (
        <Panel
          ref={e => {
            window.el = e;
          }}
          header={header}
          key={item.id}
        >
          <Row className={styles[`${baseClass}PanelContentRow`]}>
            <Col span={12} style={{ whiteSpace:'nowrap' }}>
              <span>动画时长：</span>
              <InputNumber
                min={1}
                step={0.1}
                value={item.animationTime}
                onChange={e => {
                  changeComponentData( e, `animations.${idx}.animationTime` );
                }}
              />
              <span>S</span>
            </Col>
            <Col span={12} style={{ whiteSpace:'nowrap' }}>
              <span>动画延时</span>
              <InputNumber
                min={0}
                value={item.animationDelay}
                onChange={e => {
                  changeComponentData( e, `animations.${idx}.animationDelay` );
                }}
              />
              <span>S</span>
            </Col>
          </Row>
          <Row className={styles[`${baseClass}PanelContentRow`]}>
            <Col style={{ whiteSpace:'nowrap' }}>
              <span>是否循环：</span>
              <Radio.Group
                onChange={e => {
                  const val = e.target.value
                  if ( !val ) {
                    item.animationLoopTotal = 1;
                  }
                  changeComponentData( val, `animations.${idx}.isLoop` );
                }}
                value={item.isLoop || false}
              >
                <Radio value={false}>否</Radio>
                <Radio value>是</Radio>
              </Radio.Group>
            </Col>
          </Row>
          {item.isLoop && (
            <>
              <Row className={styles[`${baseClass}PanelContentRow`]} key="loopType">
                <Col>
                  <span>循环类型：</span>
                  <Radio.Group
                    onChange={e => {
                      const { value } = e.target;
                      if ( value ) {
                        item.animationLoopTotal = 'infinite';
                      } else {
                        item.animationLoopTotal = 1;
                      }
                      changeComponentData( value, `animations.${idx}.loopType` );
                    }}
                    value={item.loopType || false}
                  >
                    <Radio value={false}>自定义</Radio>
                    <Radio value>无限</Radio>
                  </Radio.Group>
                </Col>
              </Row>
              {!item.loopType && (
                <Row className={styles[`${baseClass}PanelContentRow`]}>
                  <Col span={12}>
                    <span>循环次数：</span>
                    <InputNumber
                      min={1}
                      value={item.animationLoopTotal || 1}
                      onChange={e => {
                        changeComponentData( e, `animations.${idx}.animationLoopTotal` );
                      }}
                    />
                  </Col>
                </Row>
              )}
            </>
          )}
        </Panel>
      );
    } );
  };
  return (
    <>
      <div className={styles[`${baseClass}Wrap`]}>
        <div className={styles[`${baseClass}Header`]}>
          <Button icon="plus" type="primary" onClick={handleChangeDrawwer}>
            添加动画
          </Button>
          {preViewData ? (
            <Button icon="pause" onClick={clearAnimation}>
              暂停动画
            </Button>
          ) : (
            <Button
              icon="caret-right"
              onClick={() => {
                changePreViewData( animations );
              }}
            >
              预览动画
            </Button>
          )}
        </div>
        <Collapse
          bordered={false}
          className={styles[`${baseClass}CollapseWrap`]}
          activeKey={activeKey}
          onChange={e => {
            setActiveKey( e );
          }}
        >
          {renderPanel()}
        </Collapse>
      </div>
      <AnimationDrawer
        visible={visible}
        onClose={handleChangeDrawwer}
        previewSingleAnimation={previewSingleAnimation}
        addOrEditAnimation={addOrEditAnimation}
      />
    </>
  );
}
const mapProps = ( { beesVersionThree } ) => ( {
  currentActiveEl: beesVersionThree.currentActiveEl,
} );
export default connect( mapProps )( Animation );

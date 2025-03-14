/* eslint-disable no-param-reassign */
import React, { useEffect, useCallback, useContext, useState } from 'react';
import { Empty, Tree, Icon, Input, message } from 'antd';
import { connect } from 'dva';
import { CurrentPages, CommonOperationFun } from '../../../provider';
import styles from './index.less';

const { TreeNode } = Tree;
const { Search } = Input;
const baseClass = 'layerManagement';
let clickCount = 0;
function LayerManagement( { dispatch, currentEditId } ) {
  const [currentPages, changeCurrentPages] = useContext( CurrentPages );
  const { removeComponentsFun } = useContext( CommonOperationFun );
  const { componentData = [] } = currentPages;
  const [editLabel, setEditLabel] = useState( '' );
  const [treeSelectedKeys, setTreeSelectedKeys] = useState( [] );
  const [searchValue, setSearchValue] = useState( '' )
  const [searchResult, setSearchResult] = useState( true )

  const handleChangeValue = ( type, val, idx, item ) => {
    // 组合需要同步数据
    if ( item ) {
      item[type] = val
    }
    currentPages.componentData[idx][type] = val;
    changeCurrentPages( currentPages );
  };
  const onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split( '-' );
    const dropPosition = info.dropPosition - Number( dropPos[dropPos.length - 1] );
    const loop = ( data, key, callback ) => {
      // eslint-disable-next-line consistent-return
      data.forEach( ( item, index, arr ) => {
        if ( item.id === key ) {
          return callback( item, index, arr );
        }
        if ( item.children ) {
          return loop( item.children, key, callback );
        }
      } );
    };
    const data = [...componentData];
    const child =
      !info.dropToGap ||
      ( ( info.node.props.children || [] ).length > 0 &&
        info.node.props.expanded &&
        dropPosition === 1 );
    // Find dragObject
    let dragObj;
    loop( data, dragKey, ( item, index, arr ) => {
      if ( !child ) {
        arr.splice( index, 1 );
        dragObj = item;
      }
    } );

    if ( !child ) {
      let ar;
      let i;
      loop( data, dropKey, ( item, index, arr ) => {
        ar = arr;
        i = index;
      } );
      if ( dropPosition === -1 ) {
        ar.splice( i, 0, dragObj );
      } else {
        ar.splice( i + 1, 0, dragObj );
      }
    }
    currentPages.componentData = data;
    changeCurrentPages( currentPages );
  };

  const changeSetUpIdx = idx => {
    dispatch( {
      type: 'beesVersionThree/SetState',
      payload: {
        currentEditId: idx,
      },
    } );
  };

  const handleClickLabel = ( id, idx, isLock ) => {
    clickCount += 1;
    setTimeout( () => {
      if ( clickCount === 1 ) {
        if ( isLock ) {
          clickCount = 0;
          if ( currentEditId !== undefined ) {
            changeSetUpIdx( undefined )
          }
          return
        }
        changeSetUpIdx( idx )
      } else {
        setEditLabel( id );
      }
      clickCount = 0;
    }, 200 );
  };

  const renderTreeNode = useCallback(
    ( data, idxList, isLock ) => {
      return data.slice().reverse().map( ( item, idx ) => {
        if ( !idxList && item.inCombination ) return null;
        const dataIndex = data.length - idx - 1;
        const index = idxList ? idxList[dataIndex] : dataIndex
        const groupItem = idxList ? item : undefined
        const title = (
          <div className={styles[`${baseClass}TreeTitle`]}>
            <div className={styles[`${baseClass}TreeTitleLeft`]}>
              <img src={item.icon} alt="" />
              {editLabel === item.id ? (
                <Input
                  value={item.label}
                  placeholder="请输入组件名称"
                  className={styles[`${baseClass}TreeTitleLeftInput`]}
                  onChange={e => {
                    handleChangeValue( 'label', e.target.value, dataIndex, groupItem );
                  }}
                  onBlur={() => {
                    if ( !item.label ) {
                      message.error( '请输入组件名称' )
                    } else {
                      setEditLabel( '' );
                    }
                  }}
                  autoFocus="autofocus"
                  maxLength={20}
                />
              ) : (
                <span onClick={handleClickLabel.bind( null, item.id, index, idxList ? isLock : item.isLock )}>
                  {item.label}
                </span>
              )}
            </div>
            <div className={styles[`${baseClass}TreeTitleRight`]}>
              <Icon
                type={item.isView ? 'eye' : 'eye-invisible'}
                onClick={( e ) => {
                  e.stopPropagation();
                  handleChangeValue( 'isView', !item.isView, index, groupItem );
                }}
              />
              {!idxList && (
                <>
                  <Icon
                    type={item.isLock ? 'lock' : 'unlock'}
                    onClick={( e ) => {
                      e.stopPropagation();
                      handleChangeValue( 'isLock', !item.isLock, index );
                    }}
                  />
                  <Icon
                    type="delete"
                    onClick={( e ) => {
                      e.stopPropagation();
                      removeComponentsFun( index );
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );
        // 找出组合子集对应的索引
        const { propValue } = item || {};
        const childIdx = [];
        const { length } = propValue?.componentData || {};
        if ( length ) {
          const { componentIds } = propValue;
          for ( let i = 0, leg = componentIds.length; i < leg; i += 1 ) {
            const res = componentData.findIndex( idsItem => componentIds[i] === idsItem.id )
            if ( res >= 0 ) {
              childIdx.push( res );
            }
          }
        }

        // 组件搜索时过滤显示
        let hasSearchTarget;
        if ( item.type === "GROUP" ) {
          hasSearchTarget = propValue?.componentData.findIndex( i => i.label.indexOf( searchValue ) > -1 )
        } else {
          hasSearchTarget = item.label.indexOf( searchValue )
        }
        if ( hasSearchTarget < 0 ) return null

        const Element = (
          <TreeNode key={item.id} title={title}>
            {!!length && renderTreeNode( propValue.componentData, childIdx, item.isLock )}
          </TreeNode>
        );
        return Element;
      } );
    },
    [componentData, editLabel, searchValue]
  );


  // 树节点点击
  const onSelectTreeNode = ( selectedKeys ) => {
    if ( selectedKeys && componentData ) {
      const selectedKey = selectedKeys[0]
      // 计算出组合里面的所有组件id
      const groupEleIds = []
      componentData.forEach( item => {
        if ( item?.type === 'GROUP' ) {
          if ( item?.propValue?.componentIds ) {
            item.propValue.componentIds.forEach( info => {
              groupEleIds.push( info )
            } )
          }
        }
      } )
      const eleInGroup = groupEleIds.includes( selectedKey )
      let eleIndex
      let eleData
      componentData.forEach( ( item, index ) => {
        if ( item.id === selectedKey ) {
          eleIndex = index
          eleData = item
        }
      } )
      // 选中节点应是它的父级节点(dragComponentsItemEleDom)的父级节点(dragComponentsItemWrap)
      const dragEl = document.getElementById( selectedKey )?.parentNode?.parentNode;
      if ( eleInGroup ) {
        window.clearActiveEle()
      } else {
        window.changeActiveComponents( eleData, dragEl, eleIndex, { offsetX: 0, offsetY: 0 }, true )
      }
    }
  }

  // 查询搜索框
  const onChange = e => {
    const { value } = e.target;
    let result
    componentData.forEach( item => {
      if ( item.type !== "GROUP" && item.label.indexOf( value ) > -1 ) {
        result = true
      }
    } )
    setSearchResult( result )
    setSearchValue( value )
  };

  // 选中组件高亮
  useEffect( () => {
    if ( componentData?.length ) {
      if ( currentEditId || currentEditId === 0 ) {
        const currentEditEleId = componentData[currentEditId].id
        setTreeSelectedKeys( currentEditEleId ? [currentEditEleId] : [] )
      } else {
        setTreeSelectedKeys( [] )
      }
    }
  }, [componentData, currentEditId] );


  return componentData.length ? (
    <>
      <Search placeholder="请输入要查询的组件名称" allowClear onChange={onChange} />
      {
        !searchResult && (
          <div className={styles.emptyWrap}>
            <Empty description="未找到组件" />
          </div>
        )
      }
      <Tree
        className="draggable-tree"
        draggable
        blockNode
        onDrop={onDrop}
        selectedKeys={treeSelectedKeys}
        onSelect={onSelectTreeNode}
      >
        {renderTreeNode( componentData )}
      </Tree>
    </>
  ) : (
    <div className={styles.emptyWrap}>
      <Empty description="未选择组件" />
    </div>
  );
}
const mapProps = ( { beesVersionThree } ) => ( {
  currentEditId: beesVersionThree.currentEditId,
} )
export default connect( mapProps )( LayerManagement );

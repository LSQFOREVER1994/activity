/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
/*
 * @Author       : ZQ
 * @Date         : 2023-11-15 11:00:24
 * @LastEditors  : ZQ
 * @LastEditTime : 2023-12-07 10:16:35
 */

import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

const RoleTreeSelect = ( { menuIds, menuTrees, changeCheckedRole } ) => {

  const renderTreeNodes = treeData =>
    treeData.map( item => {
      if ( item.childList && item.childList.length ) {
        return (
          <TreeNode title={item.name} key={item.id} checked={item.isChoice}>
            {renderTreeNodes( item.childList )}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} checked={item.isChoice} />;
  } );

  // TODO：查找两个数组中不同项
  const findDiffItems = ( array1, array2 ) => {
    const toNumberArray = arr => arr.map( item => Number( item ) );
    const numericArray1 = toNumberArray( array1 );
    const numericArray2 = toNumberArray( array2 );
    const diff1 = numericArray1.filter( item => !numericArray2.includes( item ) );
    const diff2 = numericArray2.filter( item => !numericArray1.includes( item ) );
    const result = [...diff1, ...diff2];
    return result;
  };

  // TODO：查找树中传入节点的所有子节点
  const collectChildNodeIdsById = ( dataSource, targetId ) => {
    const result = [];
  
    function collectAllChildIds( node ) {
      result.push( node.id );
      if ( node.childList ) {
        node.childList.forEach( collectAllChildIds );
      }
    }
  
    function findNodeAndCollectChildren( node ) {
      if ( node.id == targetId ) {
        collectAllChildIds( node );
      } else if ( node.childList ) {
        node.childList.forEach( findNodeAndCollectChildren );
      }
    }
  
    dataSource.forEach( findNodeAndCollectChildren );
  
    return result;
  }

  // TODO：递归查找包含指定 id 的节点及其所有父节点的 id
  const findNodeAndAncestorsById = ( data, targetId ) => {
    function findNodeRecursive( node, currentPath ) {
      // 将当前节点的 id 添加到路径
      const newPath = [...currentPath, node.id];

      // 如果当前节点的 id 与目标 id 匹配，则返回路径
      if ( node.id == targetId ) {
        return newPath;
      }

      // 遍历子节点
      if ( node.childList && node.childList.length > 0 ) {
        for ( const childNode of node.childList ) {
          const result = findNodeRecursive( childNode, newPath );
          // 如果在子节点中找到匹配的路径，则返回结果
          if ( result ) {
            return result;
          }
        }
      }

      // 如果当前节点没有匹配的子节点，则返回 null
      return null;
    }

    // 在整个数据中查找
    for ( const rootNode of data ) {
      const result = findNodeRecursive( rootNode, [] );
      // 如果在数据的某个分支中找到匹配的路径，则返回结果
      if ( result ) {
        return result;
      }
    }

    // 如果整个数据中都没有匹配的节点，则返回空数组
    return [];
  }

  // TODO：删除arrayB中与arrayA含有的共有项
  const removeCommonElements = ( arrayA, arrayB ) => {
    const toNumberArray = arr => arr.map( item => Number( item ) );
    const numericArray1 = toNumberArray( arrayA );
    const numericArray2 = toNumberArray( arrayB );
    // 使用 filter 方法筛选出在 arrayB 中但不在 arrayA 中的元素
    const result = numericArray2.filter( itemB => !numericArray1.includes( itemB ) );

    return result;
  }

  // TODO： 场景所需 将Tree组件改为受控组件 即父子节点间勾选不相互影响 故父子节点间的影响关系需自己开发
  const onCheck = ( data, e ) => {
    const { checked } = data;
    const { checked: isChecked } = e || {};
    if ( isChecked ) {  // 区分当前是 勾选 or 取消勾选 
      const currentId = checked[checked.length - 1]; // Tree组件勾选时 被勾选的节点的key值 是push进checkedKeys中，所以checked的最后一位即是当前勾选的节点的id
      const a = findNodeAndAncestorsById( menuTrees, currentId ).map( item => String( item ) ); // 查找当前节点的所有父节点
      const b = collectChildNodeIdsById( menuTrees, currentId ).map( item => String( item ) ); //  查找当前节点的所有子节点
      const newData = [...checked, ...a, ...b];
      changeCheckedRole( [...new Set( newData )] );
    } else {
      const currentId = findDiffItems( checked, menuIds ); //  通过对比前后两次数据拿到当前勾选节点的id
      const childIds = collectChildNodeIdsById( menuTrees, currentId ); //  查找当前节点的所有子节点
      const newData = removeCommonElements( childIds, checked ); //  去除checkedKeys中当前节点的所有子节点
      const newCheckedKeysValue = newData.map( item => String( item ) );
      changeCheckedRole( [...new Set( newCheckedKeysValue )] );
    }
  };

  return (
    <div>
      <Tree checkable checkedKeys={menuIds} checkStrictly onCheck={onCheck}>
        {renderTreeNodes( menuTrees )}
      </Tree>
    </div>
  );
};

export default RoleTreeSelect;

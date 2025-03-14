/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-01-09 09:30:06
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-01-11 11:49:35
 */
/* eslint-disable react/sort-comp */
/* eslint-disable no-restricted-syntax */
import React from "react";
import { Checkbox, Table } from "antd";

const parseMenuData = ( data ) => {
  const result = {};

  function traverse( menuItems ) {
    for ( const item of menuItems ) {
      result[item.id] = item.name;

      if ( item.childList && item.childList.length > 0 ) {
        traverse( item.childList );
      }
    }
  }

  traverse( data );

  return result;
}

// 编码Data, 转成表格格式
const encodeData = ( data, i = 0, addData = {} ) => {
  const ret = [];
  data.map( ( item ) => {
    const next = Object.assign( { [i]: item.id }, addData );
    if ( item.childList.length ) {
      ret.push( ...encodeData( item.childList, i + 1, next ) );
    } else {
      ret.push( next );
    }
  } );
  return ret;
};

// 获取最深的深度以确定列数
const getMaxDepth = ( data ) => {
  let max = 1;
  data.map( ( item ) => {
    if ( item.childList.length ) {
      const childDepth = getMaxDepth( item.childList );
      if ( max < 1 + childDepth ) max = 1 + childDepth;
    }
  } );
  return max;
};

// 生成一个子节点map, 用于判断所有
const getChildrenMap = ( data ) => {
  let ret = {};
  data.map( ( item ) => {
    if ( item.childList.length ) {
      ret[item.id] = [];
      const childrenMap = getChildrenMap( item.childList );
      item.childList.map( ( subItem ) => {
        if ( childrenMap[subItem.id] ) {
          ret[item.id].push( ...childrenMap[subItem.id] );
        } else {
          ret[item.id].push( subItem.id );
        }
      } );
      ret = Object.assign( ret, childrenMap, item.id );
    }
  } );
  return ret;
};
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

// TODO：删除arrayB中与arrayA含有的共有项
const removeCommonElements = ( arrayA, arrayB ) => {
  const toNumberArray = arr => arr.map( item => Number( item ) );
  const numericArray1 = toNumberArray( arrayA );
  const numericArray2 = toNumberArray( arrayB );
  // 使用 filter 方法筛选出在 arrayB 中但不在 arrayA 中的元素
  const result = numericArray2.filter( itemB => !numericArray1.includes( itemB ) );
  return result;
}


export default class TreeTable extends React.Component {
  static props = {
    data: [], // 数据
    onChange: "", // 当选中框改变时的回调 Function(checkedKeys: Array)
    columnWidthArray: "", // 控制每列的高度, 用到的会按比例增加到100%
    checkedKeys: [], // 选中的key
  };

  static defaultProps = {
    data: [],
    onChange: () => {},
    columnWidthArray: ["15%", "15%", "30%", "20%", "20%"],
    checkedKeys: [],
  };

  generateData = () => {
    const { data, columnWidthArray } = this.props;
    // 转换格式后生成的表格数据
    const dataSource = encodeData( data );
    const treeDataNames = parseMenuData( data );
    // 最大深度, 用于确认表格列数
    const max = getMaxDepth( data );
    // childrenMap, 用于判断选中
    this.childrenKeyMap = getChildrenMap( data );
    const columns = [];
    for ( let i = 0; i < max; i++ ) {
      columns.push( {
        key: i,
        dataIndex: i,
        name: i,
        width: columnWidthArray[i],
        render: ( t, r, rowIndex ) => {
          const obj = {
            children: t ? this.getCheckBox( t ) : "",
            props: {},
          };
          // 列合并
          if ( r[i] === undefined ) {
            obj.props.colSpan = 0;
          } else if ( r[i + 1] === undefined && i < max - 1 ) {
            obj.props.colSpan = max - i;
          }
          // 行合并
          if (
            dataSource[rowIndex - 1] &&
            dataSource[rowIndex - 1][i] === dataSource[rowIndex][i]
          ) {
            obj.props.rowSpan = 0;
          } else {
            let rowSpan = 1;
            for (
              let j = 1;
              dataSource[rowIndex + j] &&
              dataSource[rowIndex + j][i] === dataSource[rowIndex][i];
              j++
            ) {
              rowSpan++;
            }
            obj.props.rowSpan = rowSpan;
          }
          return obj;
        },
      } );
    }
    this.setState( { dataSource, columns, treeDataNames } );
  };

  getCheckBox = ( t ) => {
    const { data } = this.props;
    const { checkedKeys, treeDataNames } = this.state;
    return (
      <Checkbox
        checked={
          checkedKeys.indexOf( t ) >= 0
        }
        onChange={( e )=>{
          if( e.target.checked ){
            const a = findNodeAndAncestorsById( data, t ).map( item => Number( item ) ); // 查找当前节点的所有父节点
            const b = collectChildNodeIdsById( data, t ).map( item => Number( item ) ); //  查找当前节点的所有子节点
            const newData = [...new Set( [...checkedKeys, ...a, ...b] )];
            this.setState( { checkedKeys:newData } );
            this.props.onChange( newData );
          }else{
            const childIds = collectChildNodeIdsById( data, t ); //  查找当前节点的所有子节点
            const newData = removeCommonElements( childIds, checkedKeys ); //  去除checkedKeys中当前节点的所有子节点
            const newCheckedKeysValue = [...new Set( newData.map( item => Number( item ) ) )];
            this.setState( { checkedKeys:newCheckedKeysValue } );
            this.props.onChange( newCheckedKeysValue );
          }
        }}
      >
        {treeDataNames[t]}
      </Checkbox>
    );
  };

  constructor( props ) {
    super( props );

    this.state = {
      dataSource: [],
      columns: [],
      checkedKeys: [],
      treeDataNames:{},
    };
  }

  componentWillMount() {
    this.generateData();
  }

  componentDidUpdate( preProps ) {
    if ( preProps.data !== this.props.data ) {
      this.generateData();
    }
    if ( preProps.checkedKeys !== this.props.checkedKeys ) {
      this.setState( {
        checkedKeys: this.props.checkedKeys,
      } );
    }
  }

  render() {
    const { dataSource, columns } = this.state;
    return (
      <Table
        bordered
        pagination={false}
        scroll={{ y: true }}
        showHeader={false}
        dataSource={dataSource}
        columns={columns}
      />
    );
  }
}

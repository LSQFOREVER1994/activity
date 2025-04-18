/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useMemo } from 'react';
import { Icon, Button, message, Alert, Popconfirm } from 'antd';
import _ from 'lodash'
import EditTable from '../EditTable';
import EditPrizeModal from '../EditPrizeModal';
import CustomerGroups from '../CustomerGroups'
import styles from './index.less';

/**
 * 奖品表格组件参数
 * @param dataKey 更新的参数名，不传默认prizes
 * @param changeValue 更新组件数据FUNC
 * @param componentsData 组件数据
 * @param maxPrizeNum 最大奖品限制，默认不限制
 * @param tableWithPosition 是否带奖项，默认false
 * @param descriptionText 表格提示信息描述，默认空
 */
const defaultArr = []
const PrizeTable = props => {
  const {
    dataKey = 'prizes',
    changeValue,
    componentsData,
    maxPrizeNum = 0,
    tableWithPosition = false,
    noMore,
    descriptionText = '',
    noProbability = false,
    noGroupProbability = false, // 是否隐藏客群概率配置按钮组
  } = props;
  const probabilityNums = [1, 2, 3, 4, 5, 6, 7, 8]; // 概率数量

  const groupsKey = `${dataKey}CustomerGroups`;
  // 定义数据源
  const [prizeData, setPrizeData] = useState( _.get( componentsData, dataKey ) || defaultArr );
  const [prizeCustomerGroups, setPrizeCustomerGroups] = useState( _.get( componentsData, groupsKey ) );
  const [columns, setColumns] = useState( [] );
  const [modalVisible, setModalVisible] = useState( false );
  const [editData, setEditData] = useState( null );
  const [showTable, setShowTable] = useState( false );
  const [editGroupIdx, setEditGroupIdx] = useState( -1 ); // -1 默认客群索引

  // 客群概率合到奖品概率里展示
  const combineProbability = () => {
    const newPrizeCustomerGroups = _.cloneDeep( prizeCustomerGroups );
    const currentGroup = newPrizeCustomerGroups[editGroupIdx];
    const { probabilityList } = currentGroup;
    const dataSource = _.cloneDeep( prizeData );
    // 客群概率初始化奖品虚拟id

    const newProbabilityList = _.cloneDeep( probabilityList );
    if ( dataSource.length > probabilityList.length ) {
      // 补充新增项
      dataSource.forEach( ( item ) => {
        if ( !newProbabilityList.find( groupItem => groupItem.prizeVirtualId === item.prizeVirtualId ) ) {
          newProbabilityList.push( {
            prizeVirtualId: item.prizeVirtualId,
            probability: 0
          } )
        }
      } )
      currentGroup.probabilityList = newProbabilityList;
    }
    newPrizeCustomerGroups.splice( editGroupIdx, 1, currentGroup );
    changeValue( newPrizeCustomerGroups, groupsKey );
    setPrizeCustomerGroups( newPrizeCustomerGroups );

    // 切换客群，替换奖品数据中各项概率
    dataSource.forEach( ( item, index ) => {
      const probabilityObj = newProbabilityList ? newProbabilityList[index] : { probability: 0 };
      // 替换item中probability, probability1,probability2, probability3... 字段
      const probabilityArr = ['probability'];
      probabilityNums.forEach( i => {
        probabilityArr.push( `probability${i}` )
      } )
      const obj = _.omit( item, probabilityArr );
      if ( obj ) {
        Object.assign( obj, probabilityObj );
        dataSource[index] = obj
      }
    } )
    setPrizeData( dataSource )
  }

  // 删除表格概率项
  const onDeltetColumnItem = num => {
    if ( !prizeData?.length ) return
    let prohibitNum = 1;   // 删除限制
    const prtzeObj = editGroupIdx === -1 ? prizeData[0] : prizeCustomerGroups[editGroupIdx].probabilityList[0];
    probabilityNums.forEach( i => {
      if ( prtzeObj[`probability${i}`] || prtzeObj[`probability${i}`] === 0 ) {
        prohibitNum = i;
      }
    } );
    if ( num < prohibitNum ) {
      message.error( '请按顺序删除' );
      return;
    }
    if ( editGroupIdx === -1 ) {
      const newList = prizeData.map( info => {
        const newInfo = info;
        delete newInfo[`probability${num}`];
        return { ...newInfo };
      } );
      const newColumns = columns.filter( info => {
        return info.dataIndex !== `probability${num}`;
      } );
      setColumns( [...newColumns] );
      changeValue( newList, dataKey );
      setPrizeData( newList );
    } else {
      const newProbabilityList = prizeCustomerGroups[editGroupIdx].probabilityList.map( info => {
        const newInfo = info;
        delete newInfo[`probability${num}`];
        return { ...newInfo };
      } );
      const newColumns = columns.filter( info => {
        return info.dataIndex !== `probability${num}`;
      } );
      setColumns( [...newColumns] );
      changeValue( newProbabilityList, `${groupsKey}[${editGroupIdx}].probabilityList` );
      setPrizeCustomerGroups( newProbabilityList )
      combineProbability()
    }

  };

  // 表格概率项
  const createProbabilityItem = num => {
    const titleText = `第${num}次`;
    const dataIndex = `probability${num}`;
    return {
      title: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <div>{titleText}</div>
            <div>概率(%)</div>
          </div>
          <div
            onClick={() => onDeltetColumnItem( num )}
            style={{ display: 'flex', alignItems: 'center', color: '#f73232' }}
          >
            <Icon style={{ fontSize: '15px', marginLeft: '10px' }} type="minus-circle" />
          </div>
        </div>
      ),
      dataIndex,
      key: dataIndex,
      editable: true,
      width: 110,
    };
  };

  // 添加新奖品后初始化客群概率
  const initNewPrizeProbability = () => {
    const prizes = _.get( componentsData, dataKey );
    const groups = _.get( componentsData, groupsKey );
    if ( prizes?.length && groups?.length ) {
      groups.forEach( group => {
        if ( group.probabilityList.length < prizes.length ) {
          const newItem = {}
          Object.keys( group.probabilityList[0] ).forEach( key => {
            newItem[key] = 0
          } )
          Object.assign( newItem, { prizeVirtualId: prizes[prizes.length - 1].prizeVirtualId } );
          group.probabilityList.push( newItem );
        }
      } )
    }
  }

  // 编辑奖品
  const onEditPrizeItem = item => {
    if ( tableWithPosition ) {
      const data = prizeData.filter( info => info.itemPosition === item.itemPosition );
      setEditData( data );
    } else {
      setEditData( [item] );
    }
    setModalVisible( true );
  };

  // 删除奖品
  const onDeletePrizeItem = item => {
    let newList = [];
    if ( prizeData && prizeData.length ) {
      newList = prizeData.filter( info => {
        return info.prizeVirtualId !== item.prizeVirtualId;
      } );
    }

    // 删除prizeCustomerGroups中的每项probabilityList中对应奖品
    if ( prizeCustomerGroups && prizeCustomerGroups.length ) {
      prizeCustomerGroups.forEach( group => {
        if ( group.probabilityList && group.probabilityList.length ) {
          group.probabilityList = group.probabilityList.filter( info => {
            return info.prizeVirtualId !== item.prizeVirtualId;
          } );
        }
      } );
    }

    changeValue( prizeCustomerGroups, groupsKey )
    setPrizeCustomerGroups( prizeCustomerGroups )
    changeValue( newList, dataKey );
    setPrizeData( newList );
  };

  // 表格操作项
  const createTableOption = () => {
    return {
      title: <span style={{ textAlign: 'center' }}>操作</span>,
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'right',
      render: ( id, item ) => {
        const children = (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => onEditPrizeItem( item )}
            >
              编辑
            </span>

            <span style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}>
              <Popconfirm
                placement="top"
                title={`是否确认删除:${item.name || '谢谢参与'}`}
                onConfirm={() => onDeletePrizeItem( item )}
                okText="是"
                cancelText="否"
              >
                <span>删除</span>
              </Popconfirm>
            </span>
          </div>
        );
        return {
          props: {
            rowSpan: item.rowSpan,
          },
          children,
        };
      }
    }
  }

  // 新增表格概率项
  const onAddProbability = () => {
    if ( !prizeData?.length ) {
      message.error( '请先添加奖品' );
      return;
    }
    // 因为概率配置为每个奖品统一，所以取列表第一项判断就行
    const prizeItem = editGroupIdx === -1 ? prizeData[0] : prizeCustomerGroups[editGroupIdx].probabilityList[0];

    if (
      prizeItem[`probability${probabilityNums[probabilityNums.length - 1]}`] ||
      prizeItem[`probability${probabilityNums[probabilityNums.length - 1]}`] === 0
    ) {
      message.error( `最多只能配置${probabilityNums.length}次` );
      return;
    }

    let probabilityNum = 1;
    probabilityNums.forEach( i => {
      if ( prizeItem[`probability${i}`] || prizeItem[`probability${i}`] === 0 ) {
        probabilityNum = i + 1;
      }
    } );
    // 更新列表数据
    if ( editGroupIdx === -1 ) {
      const newList = prizeData.map( info => {
        return { ...info, [`probability${probabilityNum}`]: 0 };
      } );
      changeValue( newList, dataKey );
      setPrizeData( newList );
    } else {
      const newList = prizeCustomerGroups[editGroupIdx].probabilityList.map( info => {
        return { ...info, [`probability${probabilityNum}`]: 0 };
      } );
      changeValue( newList, `${groupsKey}[${editGroupIdx}].probabilityList` );
      setPrizeCustomerGroups( newList )
      combineProbability();
    }

    // 塞入项
    const obj = createProbabilityItem( probabilityNum );
    const newColumns = columns.filter( info => {
      return info.dataIndex !== 'id';
    } );
    setColumns( [...newColumns, obj, createTableOption()] );
  };

  // 初始化表格列数据
  const initColumns = () => {
    const columnsList = [
      {
        title: '奖品名称',
        dataIndex: 'name',
        key: 'name',
        render: name => {
          return <div>{name || '谢谢参与'}</div>;
        },
      },
      {
        title: '已用  / 活动库存 ',
        dataIndex: 'inventory',
        key: 'inventory',
        width: 120,
        render: ( inventory, data ) => {
          //! 该方法在 getTableColumns 中被重写
          const sendCount = data.sendCount ? data.sendCount : 0;
          const changeInventory = data.changeInventory ? data.changeInventory : 0;
          const invent = inventory || 0;
          return (
            <div>
              {sendCount || 0}
              <span style={{ margin: '0 10px' }}> / </span>
              {sendCount + invent + changeInventory}
            </div>
          );
        },
      }
    ];
    if ( !noProbability ) {
      columnsList.push( {
        title: '默认概率(%)',
        dataIndex: 'probability',
        key: 'probability',
        editable: true,
        width: 110,
      } )
    }
    // 塞入概率
    if ( !noProbability && prizeData && prizeData.length > 0 ) {
      // 每项的概率配置都一样，取一项来进行判断
      const prizeItem = editGroupIdx === -1 ? prizeData[0] : prizeCustomerGroups[editGroupIdx].probabilityList[0];
      probabilityNums.forEach( i => {
        if ( prizeItem[`probability${i}`] || prizeItem[`probability${i}`] === 0 ) {
          const columnItem = createProbabilityItem( i );
          columnsList.push( columnItem );
        }
      } );
    }
    const itemPositionColumns = [
      {
        title: '奖项位置',
        dataIndex: 'itemPosition',
        key: 'itemPosition',
        render: ( value, row ) => {
          return {
            children: row.itemPosition,
            props: {
              rowSpan: row.rowSpan,
            },
          };
        },
      },
      {
        title: '奖项名称',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 140,
      },
    ];

    let columnsData = [...columnsList];

    if ( tableWithPosition ) {
      columnsData = [...itemPositionColumns, ...columnsList];
    }
    setColumns( [...columnsData, createTableOption()] );
  };

  // 跳转权益中心
  const onJumpPrize = () => {
    window.open( `${window.location.origin}/oldActivity/prizeManagement` );
  };

  // 提示描述
  const renderTipDom = () => {
    let description;
    if ( descriptionText ) {
      description = <div style={{ color: '#f73232', fontSize: '12px' }}>{descriptionText}</div>;
    }
    return (
      <Alert
        type="warning"
        showIcon
        message={
          <div
            style={{
              fontSize: 12,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '2px',
            }}
          >
            <span>关联奖品需先配置奖品，已配置请忽略。</span>
            {/* <span
              onClick={() => {
                onJumpPrize();
              }}
              style={{ color: '#1890FF', cursor: 'pointer' }}
            >
              点此去配置奖品
            </span> */}
          </div>
        }
        description={description}
      />
    );
  };

  // 合并数组单元格
  const calculationSataSource = ( list, key ) => {
    if ( !list || ( list && !list.length ) ) return [];
    return list
      .reduce( ( result, item ) => {
        // 首先将name字段作为新数组result取出
        if ( result.indexOf( item[key] ) < 0 ) {
          result.push( item[key] );
        }
        return result;
      }, [] )
      .reduce( ( result, key2 ) => {
        // 将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
        const children = list.filter( item => item[key] === key2 );
        const rowData = children.map( ( item, index ) => ( {
          ...item,
          rowSpan: index === 0 ? children.length : 0, // 将第一行数据添加rowSpan字段
        } ) );
        const newResult = result.concat( rowData );
        return newResult;
      }, [] );
  };
  // 保存编辑
  const handleSave = ( key, row ) => {
    if ( editGroupIdx === -1 ) { // 默认客群,保留原本逻辑
      const newList = [...prizeData];
      const index = newList.findIndex( item => row.prizeVirtualId === item.prizeVirtualId );
      const item = newList[index];
      newList.splice( index, 1, {
        ...item,
        ...row,
      } );
      changeValue( newList, dataKey );
      setPrizeData( newList );
    } else {
      const newProbabilityList = prizeCustomerGroups[editGroupIdx].probabilityList
      const index = newProbabilityList.findIndex( item => row.prizeVirtualId === item.prizeVirtualId );
      const item = newProbabilityList[index];
      const probabilityArr = ['probability'];
      probabilityNums.forEach( i => {
        probabilityArr.push( `probability${i}` )
      } )
      const rowP = _.pick( row, probabilityArr );
      newProbabilityList.splice( index, 1, {
        ...item,
        ...rowP,
      } );
      combineProbability();
    }
  };

  // 新增奖品
  const onAddPrizeItem = () => {
    if ( tableWithPosition ) {
      const itemPositionList = [];
      if ( prizeData && prizeData.length > 0 ) {
        prizeData.forEach( info => {
          const list = info.itemPosition.split( ',' );
          list.forEach( item => {
            itemPositionList.push( item );
          } );
        } );
      }
      
      const newItemPositionList = Array.from( new Set( itemPositionList ) );
      if ( newItemPositionList.length && newItemPositionList.length >= maxPrizeNum ) {
        message.error( '奖品位置已全部配满' );
        return;
      }
    } else if ( maxPrizeNum && prizeData && prizeData.length >= maxPrizeNum ) {
      message.error( `最多配置${maxPrizeNum}个奖品` );
      return;
    }
    setModalVisible( true );
  };


  // 计算合计项
  const getTableColumns = ( dataSource ) => {
    if ( !dataSource?.length ) return null;
    if ( !columns?.length ) return null;
    const tableColumns = _.cloneDeep( columns ).map( item => {
      if ( item.key === 'name' ) {
        item.render = ( text, record, index ) => {
          if ( index === dataSource.length - 1 ) {
            return (
              <span className={styles.total_text}>合计</span>
            )
          }
          return text || '谢谢参与'
        }
      }
      if ( item.key === 'inventory' ) {
        item.render = ( text, record, index ) => {
          if ( index === dataSource.length - 1 ) {
            let totalSendCount = 0
            let totalInventory = 0
            dataSource.forEach( i => {
              if ( i.inventory ) totalInventory += i.inventory
              if ( i.sendCount ) totalSendCount += i.sendCount
              if ( i.changeInventory ) totalInventory += i.changeInventory
            } )
            return (
              <div className={styles.total_text}>
                {totalSendCount}
                <span style={{ margin: '0 10px' }}> / </span>
                {totalInventory + totalSendCount}
              </div>
            )
          }
          const sendCount = record.sendCount ? record.sendCount : 0;
          const changeInventory = record.changeInventory ? record.changeInventory : 0;
          const invent = text || 0;
          return (
            <>
              {sendCount || 0}
              <span style={{ margin: '0 10px' }}> / </span>
              {sendCount + invent + changeInventory}
            </>
          );
        }
      }
      if ( ( item.key ).indexOf( 'probability' ) >= 0 ) {
        item.render = ( text, record, index ) => {
          if ( index === dataSource.length - 1 ) {
            let totalProbability = 0
            dataSource.forEach( i => {
              if ( i[item.key] ) totalProbability += i[item.key] * 1000
            } )
            return (
              <span className={styles.total_text} style={{ padding: '5px 12px' }}>{totalProbability / 1000}</span>
            )
          }
          return text
        }
      }
      if ( item.key === 'id' ) {
        item.render = ( text, record, index ) => {
          if ( index === dataSource.length - 1 ) {
            return null
          }
          let children = (
            <div>
              <span
                style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
                onClick={() => onEditPrizeItem( record )}
              >
                编辑
              </span>

              <span style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}>
                <Popconfirm
                  placement="top"
                  title={`是否确认删除:${record.name || '谢谢参与'}`}
                  onConfirm={() => onDeletePrizeItem( record )}
                  okText="是"
                  cancelText="否"
                >
                  <span>删除</span>
                </Popconfirm>
              </span>
            </div>
          );
          if ( editGroupIdx !== -1 ) {
            children = "--"
          }
          return {
            props: {
              rowSpan: record.rowSpan,
            },
            children,
          };
        }
      }
      return item
    } )
    return tableColumns
  }

  // 奖品表格
  const renderPrizeTable = useMemo( () => {
    if ( !showTable ) return null; // rowKey取prizeVirtualId，等数据处理完延迟展示表格
    if ( !columns?.length ) return null;
    const clonePrizeData = _.cloneDeep( prizeData );
    let dataSource = clonePrizeData
    if ( tableWithPosition ) {
      dataSource = calculationSataSource( clonePrizeData, 'itemPosition' );
    }
    // 判断是否展示合计行
    let tableColumns = columns
    if ( dataSource && dataSource.length ) {
      tableColumns = getTableColumns( dataSource )
      const hasTotalRow = dataSource.find( item => item.prizeVirtualId === 'total_row' )
      if ( !hasTotalRow ) dataSource.push( { prizeVirtualId: 'total_row' } )
    }
    return (
      <>
        <EditTable
          key="row"
          rowKey="prizeVirtualId"
          dataSource={dataSource}
          columns={tableColumns}
          handleSave={handleSave}
          bordered
          scroll={{ x: true }}
          pagination={false}
          size="small"
        />
      </>
    );
  }, [prizeData, columns, showTable, editGroupIdx] );

  useEffect( () => {
    if ( !modalVisible ) setEditData( null );
  }, [modalVisible] );

  useEffect( () => {
    if ( showTable ) initColumns();
  }, [prizeData] );


  useEffect( () => {
    if ( editGroupIdx !== -1 ) {
      combineProbability()
    } else {
      setPrizeData( _.get( componentsData, dataKey ) || defaultArr )
    }
  }, [editGroupIdx] )

  useEffect( () => {
    initColumns();
    if ( !prizeData?.length ) {
      setShowTable( true )
      return
    }
    const resDataSource = prizeData.map( item => {
      if ( !item.prizeVirtualId ) {
        item.prizeVirtualId = Number(
          Math.random()
            .toString()
            .substring( 3, 12 ) + Date.now()
        ).toString( 36 );
      }
      return item;
    } );

    const initializeGroups = prizeCustomerGroups?.map( group => {
      group.probabilityList.map( ( probabilityObj, index ) => {
        if ( resDataSource[index] ) {
          probabilityObj.prizeVirtualId = resDataSource[index].prizeVirtualId
        }
        return probabilityObj
      } )
      return group
    } );

    changeValue( initializeGroups, groupsKey );
    changeValue( resDataSource, dataKey );
    setShowTable( true )
  }, [] )


  return (
    <>
      {renderTipDom()}
      {!noProbability && (
        <div className={styles.header}>
          <div className={styles.group_box}>
            {
              !noGroupProbability && (
                <CustomerGroups
                  {...componentsData}
                  groupsKey={groupsKey}
                  prizeCustomerGroups={prizeCustomerGroups}
                  setPrizeCustomerGroups={setPrizeCustomerGroups}
                  prizeData={prizeData}
                  changeValue={changeValue}
                  editGroupIdx={editGroupIdx}
                  setEditGroupIdx={setEditGroupIdx}
                />
              )
            }
          </div>
          <div className={styles.button_box}>
            <Button type="primary" onClick={onAddProbability}>
              添加概率配置
            </Button>
          </div>
        </div>
      )}
      <div style={{ marginTop: '20px' }}>{renderPrizeTable}</div>
      {
        editGroupIdx === -1 &&
        <div>
          <Button
            type="dashed"
            style={{ width: '100%', marginTop: 10 }}
            icon="plus"
            onClick={() => onAddPrizeItem()}
          >
            {tableWithPosition ? '添加奖项' : '添加奖品'}
          </Button>
        </div>
      }
      {/* 新增、编辑弹窗 */}
      <EditPrizeModal
        {...props}
        setPrizeData={setPrizeData}
        initNewPrizeProbability={initNewPrizeProbability}
        editData={editData}
        dataKey={dataKey}
        tableWithPosition={tableWithPosition}
        noMore={noMore}
        modalVisible={modalVisible}
        maxPrizeNum={maxPrizeNum}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

export default PrizeTable;

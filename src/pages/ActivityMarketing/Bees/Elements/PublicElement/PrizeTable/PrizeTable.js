/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useMemo } from "react";
import { Collapse, Icon, Button, message, Alert, Popconfirm } from 'antd';
import EditTable from '../EditTable/EditTable'
// import CommonEditPrizeModal from '../CommonEditPrizeModal/CommonEditPrizeModal'
// import PublicEditPrizeModal from '../PublicEditPrizeModal/PublicEditPrizeModal'
import EditPrizeModal from '../EditPrizeModal/EditPrizeModal'

import styles from './prizeTable.less';

const PrizeTable = ( props ) => {
    const {
        domData = {},
        changeDomData = () => { },
        eleObj = {},
        descriptionText = '',
        tableWithPosition = false,
        maxPrizeNum = 0,
        dataKey = 'prizes',
        tableTitle ='活动奖品配置'
    } = props
    const { elements = [] } = domData
    const prizeData = eleObj[dataKey] || []
    const probabilityNums = [1, 2, 3, 4] // 概率数量

    // 区分带表格类型（带奖项、不带奖项）
    // const EditPrizeModal = EditPrizeModal
    //  PublicEditPrizeModal
    // if ( tableWithPosition ) {
    //     EditPrizeModal = CommonEditPrizeModal
    // }

    const [columns, setColumns] = useState( [] )
    const [prizeModalVisible, setPrizeModalVisible] = useState( false )
    const [editKey, setEditKey] = useState( null )
    // 更新列表数据
    const updatePrizeData = ( list ) => {
        const elementsList = elements
        const newEleObj = Object.assign( eleObj, { [dataKey]: [...list] } );
        // 替换对应项
        const newElementsList = elementsList.map( item => {
            return item.virtualId === newEleObj.virtualId ? newEleObj : item;
        } );
        // 刷新总数据
        const newDomData = Object.assign( domData, { elements: newElementsList } );
        changeDomData( newDomData );
    }

    // 初始化奖品数据 (在表格操作时数据未保存，赋值id) 可优化
    const initPeizeData = () => {
        if ( !prizeData.length ) return
        const newPrizes = prizeData.map( info => {
            return {
                ...info,
                prizeVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
            }
        } )
        updatePrizeData( newPrizes )

    }

    // 删除表格概率项
    const onDeltetColumnItem = ( num ) => {
        // 删除限制
        let prohibitNum = 1
        if ( prizeData && prizeData.length > 0 ) {
            const prtzeObj = prizeData[0]
            probabilityNums.forEach( i => {
                if ( prtzeObj[`probability${i}`] || prtzeObj[`probability${i}`] === 0 ) {
                    prohibitNum = i
                }
            } )
        }
        if ( num < prohibitNum ) {
            message.error( '请按顺序删除' )
            return
        }
        const newList = prizeData.map( info => {
            const newInfo = info
            delete newInfo[`probability${num}`]
            return { ...newInfo }
        } )
        const newColumns = columns.filter( info => {
            return info.dataIndex !== `probability${num}`
        } )
        updatePrizeData( newList )
        setColumns( [...newColumns] )
    }

    // 表格概率项
    const createProbabilityItem = ( num ) => {
        const titleText = `第${num}次`
        const dataIndex = `probability${num}`
        return (
            {
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
                width: 110
            }
        )
    }

    // 编辑奖品
    const onEditPrizeItem = ( item ) => {
        let key = item.prizeVirtualId
        if ( tableWithPosition ) key = item.itemPosition
        setEditKey( key )
        setPrizeModalVisible( true )
    }

    // 删除奖品
    const onDeletePrizeItem = ( item ) => {
        let newPrizeList = []
        if ( prizeData && prizeData.length ) {
            newPrizeList = prizeData.filter( info => {
                return info.prizeVirtualId !== item.prizeVirtualId
            } )
        }
        updatePrizeData( newPrizeList )
    }

    // 表格操作项
    const createTableOption = () => {
        return {
            title: <span style={{ textAlign: 'center', }}>操作</span>,
            dataIndex: 'id',
            key: 'id',
            width: 120,
            fixed: 'right',
            render: ( id, item ) => {
                return (
                  <div>
                    <span
                      style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
                      onClick={() => onEditPrizeItem( item )}
                    >编辑
                    </span>

                    <span
                      style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}
                    >
                      <Popconfirm placement="top" title={`是否确认删除:${item.itemName || item.name || '谢谢参与'}`} onConfirm={() => onDeletePrizeItem( item )} okText="是" cancelText="否">
                        <span>删除</span>
                      </Popconfirm>
                    </span>
                  </div>
                )
            }
            ,
        }
    }

    // 新增表格概率项
    const onAddProbability = () => {
        let probabilityNum = 1
        if ( !prizeData || ( prizeData && !prizeData.length ) ) {
            message.error( '请先添加奖品' )
            return
        }
        // 因为概率配置为每个奖品统一，所以取列表第一项判断就行
        const prizeItem = prizeData[0]
        probabilityNums.forEach( i => {
            if ( prizeItem[`probability${i}`] || prizeItem[`probability${i}`] === 0 ) {
                probabilityNum = i + 1
            }
        } )
        if ( prizeItem[`probability${probabilityNums[probabilityNums.length - 1]}`] || prizeItem[`probability${probabilityNums[probabilityNums.length - 1]}`] === 0 ) {
            message.error( `最多只能配置${probabilityNums.length}次` )
            return
        }
        // 更新列表数据
        const newList = prizeData.map( info => {
            return {
                ...info,
                [`probability${probabilityNum}`]: 0
            }
        } )

        updatePrizeData( newList )
        // 塞入项
        const obj = createProbabilityItem( probabilityNum )
        const newColumns = columns.filter( info => {
            return info.dataIndex !== 'id'
        } )
        setColumns( [...newColumns, obj, createTableOption()] )
    }

    // 初始化表格列数据
    const initColumns = () => {
        if ( !prizeData.length ) return
        const columnsList = [

            {
                title: '奖品名称',
                dataIndex: 'name',
                key: 'name',
                render: ( name ) => {
                    return <div>{name || '谢谢参与'}</div>
                }
            },
            {
                title: '已用  / 活动库存 ',
                dataIndex: 'inventory',
                key: 'inventory',
                width: 120,
                render: ( inventory, data ) => {
                    const sendCount = data.sendCount ? data.sendCount : 0
                    const changeInventory = data.changeInventory ? data.changeInventory : 0;
                    const invent = inventory || 0
                    return (
                      <div>
                        {sendCount || 0}<span style={{ margin: '0 10px' }}> / </span>{sendCount + invent + changeInventory}
                      </div>
                    )
                }
            },
            {
                title: '默认概率(%)',
                dataIndex: 'probability',
                key: 'probability',
                editable: true,
                width: 110
            }
        ]
        // 塞入概率
        if ( prizeData && prizeData.length > 0 ) {
            // 每项的概率配置都一样，取一项来进行判断
            const prizeItem = prizeData[0]
            probabilityNums.forEach( i => {
                if ( prizeItem[`probability${i}`] || prizeItem[`probability${i}`] === 0 ) {
                    const columnItem = createProbabilityItem( i )
                    columnsList.push( columnItem )
                }
            } )
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
                        }
                    }
                }
            },
            {
                title: '奖项名称',
                dataIndex: 'itemName',
                key: 'itemName',
            }]

        let columnsData = [...columnsList]

        if ( tableWithPosition ) {
            columnsData = [...itemPositionColumns, ...columnsList]
        }


        setColumns( [...columnsData, createTableOption()] )
    }

    // 跳转权益中心
    const onJumpPrize = () => {
        window.open( `${window.location.origin}/oldActivity/prizeManagement` )
    }

    // 按钮
    const renderTipDom = () => {
        let description
        if ( descriptionText ) {
            description = (
              <div style={{ color: '#f73232', fontSize: '12px' }}>{descriptionText}</div>
            )
        }
        return (
          <Alert
            type="warning"
            showIcon
            message={(
              <div
                style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}
              >
                <span>关联奖品需先配置奖品，已配置请忽略。</span>
                <span onClick={() => { onJumpPrize() }} style={{ color: '#1890FF', cursor: 'pointer' }}>点此去配置奖品</span>
              </div> )}
            description={description}
          />
        )
    }

    // 合并数组单元格
    const calculationSataSource = ( list, key ) => {
        if ( !list || ( list && !list.length ) ) return []
        return list.reduce( ( result, item ) => {
            // 首先将name字段作为新数组result取出
            if ( result.indexOf( item[key] ) < 0 ) {
                result.push( item[key] )
            }
            return result
        }, [] ).reduce( ( result, key2 ) => {
            // 将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
            const children = list.filter( item => item[key] === key2 );
            const newResult = result.concat(
                children.map( ( item, index ) => ( {
                    ...item,
                    rowSpan: index === 0 ? children.length : 0, // 将第一行数据添加rowSpan字段
                } ) )
            )
            return newResult;
        }, [] )
    }

    // 保存编辑
    const handleSave = ( key, row ) => {
        const newData = [...prizeData];
        const index = newData.findIndex( item => row.prizeVirtualId === item.prizeVirtualId );
        const item = newData[index];
        newData.splice( index, 1, {
            ...item,
            ...row,
        } );
        updatePrizeData( newData )
    };


    // 新增奖品
    const onAddPrizeItem = () => {
        if ( tableWithPosition ) {
            const itemPositionList = []
            if ( prizeData && prizeData.length > 0 ) {
                prizeData.forEach( info => {
                    const list =  info.itemPosition.split( ',' )
                    list.forEach( item => {
                        itemPositionList.push( item )
                    } )
                } )
            }
            const newItemPositionList = Array.from( new Set( itemPositionList ) )
            if ( newItemPositionList.length && newItemPositionList.length >= maxPrizeNum ) {
                message.error( '奖品位置已全部配满' )
                return
            }
            setPrizeModalVisible( true )
        } else {
            if ( maxPrizeNum && prizeData && prizeData.length >= maxPrizeNum ) {
                message.error( `奖品最大限制${maxPrizeNum}个` )
                return
            }
            setPrizeModalVisible( true )
        }

    }



    // 奖品表格
    const renderPrizeTable = useMemo( () => {
        if ( !columns || ( columns && !columns.length ) ) return null
        let dataSource = prizeData
        if ( tableWithPosition ) {
            dataSource = calculationSataSource( prizeData, 'itemPosition' )
        }

        return (
          <EditTable
            key='row'
            dataSource={dataSource}
            columns={columns}
            handleSave={handleSave}
            bordered
            scroll={{ x: true }}
            pagination={false}
            size='small'
          />
        )
    }, [prizeData, columns] )


    useEffect( () => {
        if ( !prizeModalVisible ) setEditKey( null )
    }, [prizeModalVisible] );

    useEffect( () => {
        initPeizeData()
    }, [] );

    useEffect( () => {
        initColumns()
    }, [prizeData] );

    return (
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel header={tableTitle} key="1">
          {renderTipDom()}
          <div className={styles.button_box}>

            <Button type="primary" onClick={onAddProbability}>添加概率配置</Button>
          </div>
          <div style={{ marginTop: '20px' }}>
            {renderPrizeTable}
          </div>
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
        </Collapse.Panel>
        {prizeModalVisible &&
        <EditPrizeModal
          domData={domData}
          tableWithPosition={tableWithPosition}
          changeDomData={changeDomData}
          eleObj={eleObj}
          prizeModalVisible={prizeModalVisible}
          onChangeVisible={setPrizeModalVisible}
          editKey={editKey}
          dataKey={dataKey}
        />
            }
      </Collapse>
    )
}

export default PrizeTable;

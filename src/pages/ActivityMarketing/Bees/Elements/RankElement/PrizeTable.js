/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Collapse, Table, Button, Alert, Popconfirm } from 'antd';
import styles from './rankElement.less';
import EditGuessPrizeModal from './EditPrizeModal'

const { Panel } = Collapse;

@connect()
class GuessPrize extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      columns: [],
      prizeModalVisible: false,
      editPositionKey: null, // 编辑的奖品信息
    }
  }

  componentWillMount() {
    this.initPeizeData()
    this.initTableOption()
  }

  // 初始化表格配置和表格数据
  initTableOption = () => {
    const newColumns = [
      {
        title: '奖品名称',
        dataIndex: 'name',
        key: 'name',
        render: ( name ) => {
          return <div>{name || '谢谢参与'}</div>
        }
      },
      {
        title: '名次',
        dataIndex: 'ranking',
        key: 'ranking',
        render: ( ranking, item ) => {
          return <div>{`${item.rankFrom  }-${  item.rankTo}` || '-/-'}</div>
        }
      },
      {
        title: '库存(已用/总)',
        dataIndex: 'inventory',
        key: 'inventory',
        width: 120,
        render: ( inventory, data ) => {
          const sendCount = data.sendCount ? data.sendCount : 0
          const invent = inventory || 0
          return (
            <div>
              {sendCount || 0}<span style={{ margin: '0 10px' }}> / </span>{sendCount + invent}
            </div>
          )
        }
      },
    ]
    this.setState( {
      columns: [...newColumns, this.onGetTableOption()]
    } )
  }

  // 表格操作项
  onGetTableOption = () => {
    const option = {
      title: <span style={{ textAlign: 'center', }}>操作</span>,
      dataIndex: 'id',
      key: 'id',
      width: 120,
      fixed: 'right',
      render: ( id, item ) => (
        <div>
          <span
            style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
            onClick={( e ) => this.onEditPrizeItem( e, item )}
          >编辑
          </span>

          <span
            style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}
          >
            <Popconfirm placement="top" title={`是否确认删除:${item.itemName || item.name || '谢谢参与'}`} onConfirm={( e ) => this.onDeletePrizeItem( e, item )} okText="是" cancelText="否">
              <span>删除</span>
            </Popconfirm>
          </span>
        </div>
      ),
    }
    return option
  }

  // 编辑奖品
  onEditPrizeItem = ( e, item ) => {
    e.stopPropagation();
    const editPositionKey = item.prizeVirtualId
    this.setState( {
      editPositionKey
    }, () => {
      this.onChangeVisible( true )
    } )
  }

  // 新增奖品
  onAddPrizeItem = () => {
    this.onChangeVisible( true )
  }

  // 删除奖品
  onDeletePrizeItem = ( e, item ) => {
    e.stopPropagation();
    const { eleObj } = this.props;
    const prizeList = eleObj.prizes ? eleObj.prizes : []
    let newPrizeList = prizeList
    if ( prizeList.length > 0 ) {
      newPrizeList = prizeList.filter( info => {
        return info.prizeVirtualId !== item.prizeVirtualId
      } )
    }
    this.updatePrizeListData( newPrizeList )
  }

  // 处理奖品数据
  initPeizeData = () => {
    const { eleObj = {} } = this.props
    let newPrizes = eleObj.prizes ? eleObj.prizes : []
    if ( eleObj.prizes && eleObj.prizes.length > 0 ) {
      newPrizes = eleObj.prizes.map( info => {
        return {
          ...info,
          prizeVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        }
      } )
    }
    this.updatePrizeListData( newPrizes )
  }

  // 合并数组单元格
  createNewArr = ( data, key ) => {
    return data.reduce( ( result, item ) => {
      // 首先将name字段作为新数组result取出
      if ( result.indexOf( item[key] ) < 0 ) {
        result.push( item[key] )
      }
      return result
    }, [] ).reduce( ( result, key2 ) => {
      // 将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter( item => item[key] === key2 );
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
  handleSave = ( key, row ) => {
    const { eleObj } = this.props;
    const listData = eleObj.prizes || []
    const newData = [...listData];
    const index = newData.findIndex( item => row.prizeVirtualId === item.prizeVirtualId );
    const item = newData[index];
    newData.splice( index, 1, {
      ...item,
      ...row,
    } );
    this.updatePrizeListData( newData )
  };

  // 更新列表数据
  updatePrizeListData = ( list ) => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { prizes: [...list] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    // eslint-disable-next-line react/no-unused-state
    this.setState( { time: new Date() } )
  }

  // 编辑奖品弹框控制
  onChangeVisible = ( visible ) => {
    this.setState( {
      prizeModalVisible: visible
    }, () => {
      if ( !visible ) {
        this.setState( {
          editPositionKey: null
        } )
      }
    } )
  }

  // 奖品表格
  renderPrizeTable = () => {
    const { columns } = this.state
    const { eleObj } = this.props;
    const listData = eleObj.prizes || [];
    const newColumns = columns.map( col => {
      if ( !col.editable ) {
        return col;
      }
      return {
        ...col,
        onCell: record => ( {
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        } ),
      };
    } );

    return (
      <Table
        key='row'
        rowClassName={() => styles['editable-row']}
        dataSource={this.createNewArr( listData, 'itemPosition' )}
        columns={newColumns}
        bordered
        scroll={{ x: `calc(900px + 5%)` }}
        pagination={false}
        size='small'
      />
    )
  }


  // 跳转权益中心
  onJumpPrize = () => {
        window.open( `${window.location.origin}/oldActivity/prizeManagement` )
  }


  render() {
    const { prizeModalVisible, editPositionKey } = this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="单期活动奖品配置" key="1">
            <div>
              <Alert
                type="warning"
                showIcon
                message={(
                  <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <span>关联奖品需先配置奖品，已配置请忽略。</span>
                    <span onClick={() => { this.onJumpPrize() }} style={{ color: '#1890FF', cursor: 'pointer' }}>点此去配置奖品</span>
                  </div> )}
              />
              <div style={{
                marginTop: '10px',
                color: 'red',
              }}
              >
                *仅对有奖名次进行奖品配置，无配置奖品的名次默认不发奖品
              </div>
              <div style={{ marginTop: '20px' }}>
                {this.renderPrizeTable()}
              </div>
              <div>
                <Button
                  type="dashed"
                  style={{ width: '100%', marginTop: 10 }}
                  icon="plus"
                  onClick={() => this.onAddPrizeItem()}
                >
                  添加奖品
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
        {prizeModalVisible &&
          <EditGuessPrizeModal
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            prizeModalVisible={prizeModalVisible}
            onChangeVisible={this.onChangeVisible}
            editPositionKey={editPositionKey}
          />
        }
      </div>
    )
  }

}

export default GuessPrize;

/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Collapse, InputNumber, Table, Icon, Button, message, Alert, Popconfirm } from 'antd';
import EditPrizeModal from './EditPrizeModal';
import styles from './taskElement.less';

const { Panel } = Collapse;

const limitDecimals = ( value ) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).(\d\d\d).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2.$3' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2.$3' ) : ''
  }
  return ''
};

// --------列表的编辑项开始--------
const EditableContext = React.createContext();
const EditableRow = ( { form, index, ...props } ) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()( EditableRow );

// 编辑Item
class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState( { editing }, () => {
      if ( editing ) {
        this.input.focus();
      }
    } );
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields( ( error, values ) => {
      if ( error && error[e.currentTarget.id] ) {
        return;
      }
      this.toggleEdit();
      handleSave( e.currentTarget.id, { ...record, ...values } );
    } );
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator( dataIndex, {
          rules: [
            {
              required: true,
              message: `请设置概率`,
            },
          ],
          initialValue: record[dataIndex],
        } )(
          <InputNumber
            // eslint-disable-next-line no-return-assign
            ref={node => ( this.input = node )}
            onPressEnter={this.save}
            onBlur={this.save}
            min={0}
            max={100}
            formatter={limitDecimals}
            parser={limitDecimals}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
// --------列表的编辑项结束--------
@connect()
class PrizeTable extends PureComponent {
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
      showType: '', // account\mobile
    }
  }

  componentWillMount() {
    this.initPeizeData()
    // this.initTableOption()
    this.onChangeColumns( 'account' )
  }

  // // 初始化表格配置和表格数据
  // initTableOption = () => {
  //   const newColumns = [
  //     {
  //       title: '奖品名称',
  //       dataIndex: 'name',
  //       key: 'name',
  //       render: ( name ) => {
  //         return <div>{name || '谢谢参与'}</div>
  //       }
  //     },
  //     {
  //       title: '已用  / 活动库存 ',
  //       dataIndex: 'inventory',
  //       key: 'inventory',
  //       width: 120,
  //       render: ( inventory, data ) => {
  //         const sendCount = data.sendCount ? data.sendCount : 0
  //         const invent = inventory || 0
  //         return (
  //           <div>
  //             {sendCount || 0}<span style={{ margin: '0 10px' }}> / </span>{sendCount + invent}
  //           </div>
  //         )
  //       }
  //     },
  //     {
  //       title: '默认概率(%)',
  //       dataIndex: 'probability',
  //       key: 'probability',
  //       editable: true,
  //       width: 110
  //     }
  //   ]
  //   this.setState( {
  //     columns: [...newColumns, this.onGetTableOption()]
  //   } )
  // }

  // 表格概率项
  renderProbabilityItem = ( num ) => {
    const titleName = `第${num}次`
    return (
      {
        title: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <div>{titleName}</div>
              <div>概率(%)</div>
            </div>
            <div onClick={() => this.onDeltet( num )} style={{ display: 'flex', alignItems: 'center', color: '#f73232' }}>
              <Icon style={{ fontSize: '15px', marginLeft: '10px' }} type="minus-circle" />
            </div>
          </div>
        ),
        dataIndex: `probability${num}`,
        key: `probability${num}`,
        editable: true,
        width: 110
      }
    )
  }

  // 表格手机号概率
  renderMobileProbabilityItem = ( num ) => {
    let titleName = '手机号默认'
    let dataIndexName = 'probabilityL'
    if ( num > 0 ) {
      titleName = `手机号第${num}`
      dataIndexName = `probabilityL${num}`
    }
    return (
      {
        title: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <div>{titleName}</div>
              <div> 次概率(%)</div>
            </div>
            <div onClick={() => this.onDeltProbabilityL( num )} style={{ display: 'flex', alignItems: 'center', color: '#f73232' }}>
              <Icon style={{ fontSize: '15px', marginLeft: '10px' }} type="minus-circle" />
            </div>
          </div>
        ),
        dataIndex: dataIndexName,
        key: dataIndexName,
        editable: true,
        width: 120
      }
    )
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

  // 删除概率项
  onDeltet = ( probabilityNum ) => {
    const { eleObj = {} } = this.props
    const { columns = [] } = this.state
    // 删除限制
    let prohibitNum = 1
    if ( eleObj.prizes && eleObj.prizes.length > 0 ) {
      const obj = eleObj.prizes[0] || []
      if ( obj.probability2 || obj.probability2 === 0 ) {
        prohibitNum = 2
      }
      if ( obj.probability3 || obj.probability3 === 0 ) {
        prohibitNum = 3
      }
      if ( obj.probability4 || obj.probability4 === 0 ) {
        prohibitNum = 4
      }
    }

    if ( probabilityNum < prohibitNum ) {
      message.error( '请按顺序删除' )
      return
    }
    const newList = eleObj.prizes.map( info => {
      const newInfo = info
      delete newInfo[`probability${probabilityNum}`]
      return {
        ...newInfo
      }
    } )
    this.updatePrizeListData( newList )

    const newColumns = columns.filter( info => {
      return info.dataIndex !== `probability${probabilityNum}`
    } )

    this.setState( {
      columns: [...newColumns]
    } )
  }

  // 添加概率项
  onAddProbability = () => {
    const { columns = [] } = this.state
    const { eleObj = {} } = this.props
    let probabilityNum = 1
    let newList = eleObj.prizes
    if ( !eleObj.prizes || ( eleObj.prizes && !eleObj.prizes.length ) ) {
      message.error( '请先添加奖品' )
      return
    }
    // 添加限制
    if ( eleObj.prizes && eleObj.prizes.length > 0 ) {
      // 因为概率配置为没个奖品统一，所以取列表第一项累判断就行
      const obj = eleObj.prizes[0]
      if ( obj.probability1 || obj.probability1 === 0 ) {
        probabilityNum = 2
      }
      if ( obj.probability2 || obj.probability2 === 0 ) {
        probabilityNum = 3
      }
      if ( obj.probability3 || obj.probability3 === 0 ) {
        probabilityNum = 4
      }
      if ( obj.probability4 || obj.probability4 === 0 ) {
        message.error( '最多只能配置四次' )
        return
      }
      // 更新列表数据
      newList = eleObj.prizes.map( info => {
        return {
          ...info,
          [`probability${probabilityNum}`]: 0
        }
      } )
    }
    this.updatePrizeListData( newList )
    // 塞入项
    const obj = this.renderProbabilityItem( probabilityNum )
    const newColumns = columns.filter( info => {
      return info.dataIndex !== 'id' && info.dataIndex !== 'probabilityL'
    } )
    this.setState( {
      columns: [...newColumns, obj, this.onGetTableOption()],
    } )
  }

  // 删除手机号概率
  onDeltProbabilityL = ( probabilityNum ) => {
    const { eleObj = {} } = this.props
    const { columns = [] } = this.state

    // 删除限制
    let prohibitNum = 0
    if ( eleObj.prizes && eleObj.prizes.length > 0 ) {
      const obj = eleObj.prizes[0] || []
      if ( obj.probabilityL1 || obj.probabilityL1 === 0 ) {
        prohibitNum = 1
      }
      if ( obj.probabilityL2 || obj.probabilityL2 === 0 ) {
        prohibitNum = 2
      }
      if ( obj.probabilityL3 || obj.probabilityL3 === 0 ) {
        prohibitNum = 3
      }
      if ( obj.probabilityL4 || obj.probabilityL4 === 0 ) {
        prohibitNum = 4
      }
    }
    if ( probabilityNum < prohibitNum ) {
      message.error( '请按顺序删除' )
      return
    }

    let itemName = 'probabilityL'
    if ( probabilityNum > 0 ) itemName = `probabilityL${probabilityNum}`
    const newList = eleObj.prizes.map( info => {
      const newInfo = info
      delete newInfo[itemName]
      return {
        ...newInfo
      }
    } )
    this.updatePrizeListData( newList )
    const newColumns = columns.filter( info => {
      return info.dataIndex !== itemName
    } )

    this.setState( {
      columns: [...newColumns]
    } )
  }

  // 添加手机号概率项
  onAddProbabilityL = () => {
    const { columns = [] } = this.state
    const { eleObj = {} } = this.props
    let probabilityNum = 0
    let newList = eleObj.prizes
    if ( !eleObj.prizes || ( eleObj.prizes && !eleObj.prizes.length ) ) {
      message.error( '请先添加奖品' )
      return
    }
    // 添加限制
    if ( eleObj.prizes && eleObj.prizes.length > 0 ) {
      // 因为概率配置为没个奖品统一，所以取列表第一项累判断就行
      const obj = eleObj.prizes[0]
      if ( obj.probabilityL || obj.probabilityL === 0 ) {
        probabilityNum = 1
      }
      if ( obj.probabilityL1 || obj.probabilityL1 === 0 ) {
        probabilityNum = 2
      }
      if ( obj.probabilityL2 || obj.probabilityL2 === 0 ) {
        probabilityNum = 3
      }
      if ( obj.probabilityL3 || obj.probabilityL3 === 0 ) {
        probabilityNum = 4
      }
      if ( obj.probabilityL4 || obj.probabilityL4 === 0 ) {
        message.error( '最多只能配置四次' )
        return
      }

      let itemName = 'probabilityL'
      if ( probabilityNum > 0 ) itemName = `probabilityL${probabilityNum}`
      // 更新列表数据
      newList = eleObj.prizes.map( info => {
        return {
          ...info,
          [itemName]: 0
        }
      } )
    }
    this.updatePrizeListData( newList )
    // 塞入项
    const columnsobj = this.renderMobileProbabilityItem( probabilityNum )
    const newColumns = columns.filter( info => {
      return info.dataIndex !== 'id'
    } )
    this.setState( {
      columns: [...newColumns, columnsobj, this.onGetTableOption()],
    } )
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

  // 选择配置概率或者手机号概率
  onChangeColumns = ( type ) => {
    const { eleObj = {} } = this.props
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
      }
    ]
    if ( type === 'account' ) {
      newColumns.push(     {
        title: '默认概率(%)',
        dataIndex: 'probability',
        key: 'probability',
        editable: true,
        width: 110
      } )
      if ( eleObj.prizes && eleObj.prizes.length > 0 ) {
        // 每项的概率配置都一样，取一项来进行判断
        const obj = eleObj.prizes[0]
        if ( obj.probability1 || obj.probability1 === 0 ) {
          const columnObj = this.renderProbabilityItem( 1 )
          newColumns.push( columnObj )
        }
        if ( obj.probability2 || obj.probability2 === 0 ) {
          const columnObj = this.renderProbabilityItem( 2 )
          newColumns.push( columnObj )
        }
        if ( obj.probability3 || obj.probability3 === 0 ) {
          const columnObj = this.renderProbabilityItem( 3 )
          newColumns.push( columnObj )
        }
        if ( obj.probability4 || obj.probability4 === 0 ) {
          const columnObj = this.renderProbabilityItem( 4 )
          newColumns.push( columnObj )
        }
      }
    } else if ( type === 'mobile' ) {
      if ( eleObj.prizes && eleObj.prizes.length > 0 ) {
        // 每项的概率配置都一样，取一项来进行判断
        const obj = eleObj.prizes[0]
        // 手机号概率
        if ( obj.probabilityL || obj.probabilityL === 0 ) {
          const columnObj = this.renderMobileProbabilityItem( 0 )
          newColumns.push( columnObj )
        }
        if ( obj.probabilityL1 || obj.probabilityL1 === 0 ) {
          const columnObj = this.renderMobileProbabilityItem( 1 )
          newColumns.push( columnObj )
        }
        if ( obj.probabilityL2 || obj.probabilityL2 === 0 ) {
          const columnObj = this.renderMobileProbabilityItem( 2 )
          newColumns.push( columnObj )
        }
        if ( obj.probabilityL3 || obj.probabilityL3 === 0 ) {
          const columnObj = this.renderMobileProbabilityItem( 3 )
          newColumns.push( columnObj )
        }
        if ( obj.probabilityL4 || obj.probabilityL4 === 0 ) {
          const columnObj = this.renderMobileProbabilityItem( 4 )
          newColumns.push( columnObj )
        }
      }
    }
    this.setState( {
      showType: type,
      columns: [...newColumns, this.onGetTableOption()],
    } )
  }

  // 表格按钮集合
  renderBtnGroup = () => {
    const { showType } = this.state
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="primary"
            onClick={() => this.onChangeColumns( 'account' )}
            disabled={showType === 'account'}
          >
            默认概率配置
          </Button>
          <Button
            type="primary"
            onClick={() => this.onChangeColumns( 'mobile' )}
            style={{ marginLeft: '10px' }}
            disabled={showType === 'mobile'}
          >
            手机用户概率配置
          </Button>
        </div>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        >
          {showType === 'account' && <Button type="primary" onClick={this.onAddProbability}>添加概率配置</Button>}
          {showType === 'mobile' &&
            <Button type="primary" onClick={this.onAddProbabilityL} style={{ marginLeft: '10px' }}>
              添加概率配置
            </Button>
          }
        </div>
      </div>
    )
  }

  // 奖品表格
  renderPrizeTable = () => {
    const { columns } = this.state
    const { eleObj } = this.props;
    const listData = eleObj.prizes || []
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
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
        components={components}
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
          <Panel header="活动奖品配置" key="1">
            <div>
              <Alert
                type="warning"
                showIcon
                message={(
                  <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between', marginTop:'2px' }}>
                    <span>关联奖品需先配置奖品，已配置请忽略。</span>
                    <span onClick={() => { this.onJumpPrize() }} style={{ color: '#1890FF', cursor: 'pointer' }}>点此去配置奖品</span>
                  </div> )}
                description={
                  <div style={{ color: '#f73232', fontSize: '12px' }}>
                    *第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。<br />
                    若配置了手机号概率，此时会对资金账号参与和手机号参与做区分。否则，不做区分。<br />
                    每一列抽奖概率总和需为100%。
                  </div>
                }
              />
              {this.renderBtnGroup()}
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
          <EditPrizeModal
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

export default PrizeTable;

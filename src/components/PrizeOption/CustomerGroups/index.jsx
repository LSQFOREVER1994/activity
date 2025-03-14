import React, { useEffect, useMemo } from 'react'
import { Modal, Popover, Button, Card, Icon, Form, Input, Select, Empty, Spin, InputNumber } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'dva'
import { cloneDeep } from 'lodash'
import styles from './index.less'

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const FormItem = Form.Item;
const { Option } = Select;
function CustomerGroups( props ) {
  const { prizeCustomerGroups, prizeData, changeValue, editGroupIdx, setEditGroupIdx, setPrizeCustomerGroups, groupsKey } = props;
  const { dispatch, eligibilityType, eligibilityList, loading } = props;
  const [visible, setVisible] = React.useState( false );
  const [echoData, setEchoData] = React.useState( [] );
  const [echoFlag, setEchoFlag] = React.useState( false );

  // 获取资格类型
  const getEligibilityType = name => {
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : '',
        },
        successFun: () => { },
      },
    } );
  };

  // 获取资格列表
  const getEligibilityList = ( id, cb ) => {
    if ( !id ) return;
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query: { id },
        successFun: cb,
      },
    } );
  };

  // 选择资格相关
  const changeEligibility = ( e, type, index ) => {
    if ( type === 'taskEventType' ) {
      changeValue( e, `${groupsKey}[${index}].taskEventType` );
      changeValue( '', `${groupsKey}[${index}].taskEventId` );
    }
    else if ( type === 'taskEventId' ) {
      changeValue( e, `${groupsKey}[${index}].taskEventId` );
    }
    else if( type === 'parameter' ){
      changeValue( e, `${groupsKey}[${index}].parameter` );
    }
    else {
      changeValue( e, `${groupsKey}[${index}].name` );
    }
  };

  const focusEligibilitySelect = ( index ) => {
    const { taskEventType } = prizeCustomerGroups[index];
    if ( !taskEventType ) return;
    setEchoFlag( false );
    getEligibilityList( taskEventType );
  }

  const addNewCustomerGroup = () => {
    let groups = [];
    if ( prizeCustomerGroups?.length ) {
      groups = cloneDeep( prizeCustomerGroups );
    }

    const currentGroup = {
      id: groups.length + 1,
      name: `客群${groups.length + 1}`,
      taskEventType: '',
      taskEventId: '',
      probabilityList: []
    }

    currentGroup.probabilityList = []
    prizeData.forEach( ( item ) => {
      currentGroup.probabilityList.push( {
        prizeVirtualId: item.prizeVirtualId,
        probability: 0
      } )
    } )

    groups.push( currentGroup )
    changeValue( groups, groupsKey )
    setPrizeCustomerGroups( groups )
  }

  const delCustomerGroup = ( id ) => {
    const groups = cloneDeep( prizeCustomerGroups );
    groups.splice( id - 1, 1 );
    groups.forEach( ( item, index ) => {
      // eslint-disable-next-line no-param-reassign
      item.id = index + 1
    } )
    changeValue( groups, groupsKey )
    setPrizeCustomerGroups( groups )
    setEditGroupIdx( -1 )
  }

  const reorderList = ( list, startIndex, endIndex ) => {
    const result = Array.from( list );
    const [removed] = result.splice( startIndex, 1 );
    result.splice( endIndex, 0, removed );
    result.forEach( ( item, index ) => {
      // eslint-disable-next-line no-param-reassign
      item.id = index + 1
    } )
    return result;
  };

  const onDragEnd = ( result ) => {
    if ( !result.destination ) return;
    const newGroups = reorderList(
      prizeCustomerGroups || [],
      result.source.index,
      result.destination.index
    );

    changeValue( newGroups, groupsKey )
    setPrizeCustomerGroups( newGroups )
  }

  const getListStyle = isDraggingOver => ( {
    background: isDraggingOver ? 'rgba(216,178,105,0.1)' : '#fff',
  } );

  const getItemStyle = ( isDragging, draggableStyle ) => ( {
    userSelect: 'none',
    background: isDragging ? 'rgba(216,178,105,0.3)' : '#fff',
    ...draggableStyle,
  } );

  const getEchoData = () => {
    if ( !prizeCustomerGroups || !prizeCustomerGroups.length ) return;
    setEchoFlag( true );
    const typeArr = [];
    const promiseList = [];
    const idList = []
    prizeCustomerGroups.forEach( ( item ) => {
      if ( !typeArr.includes( item.taskEventType ) && item.taskEventType ) {
        typeArr.push( item.taskEventType )
        promiseList.push(
          new Promise( ( resolve ) => {
            getEligibilityList( item.taskEventType, ( res ) => resolve( res ) )
          } )
        )
      }
    } )
    Promise.all( promiseList ).then( ( res ) => {
      res.forEach( ( item ) => {
        if ( item && item.length ) {
          idList.push( ...item );
        }
      } )
      setEchoData( idList )
    } )
  }

  useEffect( () => {
    getEligibilityType();
    getEchoData();
  }, [] )

  const echoOption = ( taskEventId ) => {
    if ( !echoFlag || !taskEventId || !echoData.length ) return null;
    const optionItem = echoData.find( ( item ) => {
      return item.taskEventId === taskEventId
    } )
    if( !optionItem ) return null
    return <Option key={optionItem.taskEventId}>{optionItem.name}</Option>
  }

  const content = useMemo( () => {
    const view = prizeCustomerGroups?.map( ( item, index ) => {
      return (
        <div key={item.id}>
          <Button
            onClick={() => { setEditGroupIdx( index ) }}
            type={editGroupIdx === index ? 'primary' : 'default'}
          >
            {item.name} (优先级: {item.id})
          </Button>
          <Icon type="down" style={{ margin: '0 auto' }} />
        </div>
      )
    } )

    return (
      <div className={styles.popContent}>
        {view}
        <div>
          <Button
            type={editGroupIdx === -1 ? 'primary' : 'default'}
            onClick={() => { setEditGroupIdx( -1 ) }}
          >
            默认客群 (优先级: {prizeCustomerGroups?.length + 1 || 1})
          </Button>
        </div>
      </div>
    )
  }, [prizeCustomerGroups, editGroupIdx, visible] )

  const renderModalContent = () => {

    if ( !prizeCustomerGroups || !prizeCustomerGroups.length ) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-customer-groups">
          {
            ( provided, snapshot ) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getListStyle( snapshot.isDraggingOver )}
              >
                {prizeCustomerGroups?.map( ( item, index ) => (
                  <Draggable
                    key={item.id}
                    draggableId={`${item.id}`}
                    index={index}
                  >
                    {( providedChild, snapshotChild ) => (
                      <div
                        key={item.id}
                        ref={providedChild.innerRef}
                        {...providedChild.draggableProps}
                        {...providedChild.dragHandleProps}
                        style={getItemStyle(
                          snapshotChild.isDragging,
                          providedChild.draggableProps.style
                        )}
                      >
                        <Card
                          size='small'
                          style={{ marginBottom: 10 }}
                          title={
                            <>
                              <Icon type="swap" className={styles.dragIcon} />
                              {item.name} (优先级: {item.id})
                            </>
                          }
                          extra={
                            <Button type="link" onClick={() => delCustomerGroup( item.id )}>删除</Button>
                          }
                        >
                          <Form {...formLayout}>
                            <FormItem required label='客群名称' style={{ marginBottom: 0 }}>
                              <Input
                                size='small'
                                value={item.name}
                                placeholder="请输入客群名称"
                                maxLength={15}
                                onChange={e => changeEligibility( e.target.value, 'name', index )}
                              />
                            </FormItem>
                            <FormItem required label="关联资格" style={{ marginBottom: 0 }}>
                              <Select
                                size='small'
                                showSearch
                                allowClear
                                filterOption={( input, option ) =>
                                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                                }
                                value={item.taskEventType || undefined}
                                placeholder="请选择资格类型"
                                onChange={e => changeEligibility( e, 'taskEventType', index )}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                              >
                                {eligibilityType.map( et => (
                                  <Option key={et.id}>{et.name}</Option>
                                ) )}
                              </Select>
                              <Select
                                size='small'
                                showSearch
                                allowClear
                                filterOption={( input, option ) =>
                                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                                }
                                value={item.taskEventId || undefined}
                                placeholder="请选择资格"
                                onChange={e => changeEligibility( e, 'taskEventId', index )}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                onFocus={() => focusEligibilitySelect( index )}
                                notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                              >
                                {echoOption( item.taskEventId )}
                                {!loading && item.taskEventType && eligibilityList.map( el => (
                                  <Option key={el.taskEventId}>{el.name}</Option>
                                ) )}
                              </Select>
                              {eligibilityList.find( i => i.taskEventId === item.taskEventId )?.isDynamic && (
                              <InputNumber
                                min={0}
                                value={item.parameter}
                                placeholder="X"
                                onChange={e => changeEligibility( e, 'parameter', index )}
                                style={{ width:'70%' }}
                              />
                              ) }
                            </FormItem>
                          </Form>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ) )}
                {provided.placeholder}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    )
  }

  return (
    <>
      <div className={styles.groupEdit}>
        <div className={styles.title}>
          <span>当前客群：{editGroupIdx === -1 ? '默认客群' : prizeCustomerGroups[editGroupIdx]?.name}</span>
          <Popover placement='right' title='切换视角至' content={content}>
            <Button type="link">
              切换客群
            </Button>
          </Popover>
        </div>
        <Button type="primary" onClick={() => { setVisible( true ) }}>
          客群编辑
        </Button>
      </div>
      <Modal
        title="客群编辑"
        visible={visible}
        onCancel={() => { setVisible( false ) }}
        footer={false}
        maskClosable={false}
        width={450}
        bodyStyle={{ padding: '10px 24px 24px' }}
      >
        <span style={{ color: 'red' }}>排名靠前的客群会被优先匹配</span>
        {renderModalContent()}
        <Button
          icon='plus'
          type='primary'
          onClick={() => { addNewCustomerGroup() }}
          style={{ width: '100%' }}
        >
          添加客群
        </Button>
      </Modal>
    </>
  )
}

export default connect( ( { bees } ) => {
  return {
    loading: bees.loading,
    eligibilityList: bees.eligibilityList,
    eligibilityType: bees.eligibilityType,
  };
} )( CustomerGroups );

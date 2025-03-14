import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Popconfirm, Tooltip, Icon, Empty, Tag, message } from 'antd';
import { getValue, elementTypes, componentType } from '../BeesEnumes'
import styles from './edit.less';



const getListStyle = isDraggingOver => ( {
  background: isDraggingOver ? "rgba(216,178,105,0.1)" : "#fff",
} );

const getItemStyle = ( isDragging, draggableStyle ) => ( {
  userSelect: "none",
  background: isDragging ? "rgba(216,178,105,0.3)" : "#fff",
  ...draggableStyle
} );

const reorderList = ( list, startIndex, endIndex ) => {
  const result = Array.from( list );
  const [removed] = result.splice( startIndex, 1 );
  result.splice( endIndex, 0, removed );

  return result;
};

const removeList = ( list, attr, value ) => {
  // list是源数组，attr是目标数组中的属性名称，value是要删除的属性名称对应的值
  if ( !list || list.length === 0 ) {
    return ""
  }
  const newArr = list.filter( ( item ) => item[attr] !== value )
  return newArr
};

@connect( ( { bees } ) => ( {
  componentList: bees.componentList
} ) )
// @Form.create()
class Add extends PureComponent {
  // 初始化数据
  state = {
    type: '',
  };

  componentDidMount() {
    const { type } = this.props
    this.setState( { type } )
    this.getComponentList()
  };

  componentWillReceiveProps( nextProps ) {
    if ( this.props.type !== nextProps.type ) {
      const { type } = nextProps;
      this.setState( { type } )
    }
  }

  // 获取组件列表
  getComponentList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getComponentList',
      payload: {
        orderBy: 'group_type'
      },
    } );
  }


  changeNav = ( newType ) => {
    const { type } = this.state;
    if ( newType === type ) return;
    this.setState( { type: newType } )
  }

  onDragEnd = ( result ) => {
    const { domData = {}, changeDomData = () => { } } = this.props;
    if ( !result.destination ) {
      return;
    }
    const elements = reorderList( domData.elements || [], result.source.index, result.destination.index );
    const obj = Object.assign( domData, { elements } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  delItem = ( list, attr, value ) => {
    const { domData = {}, changeDomData = () => { } } = this.props;
    const elements = removeList( list, attr, value );
    const obj = Object.assign( domData, { elements } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  // 生成一个用不重复的ID
   genNonDuplicateID = ( randomLength ) => {
    return Number( Math.random().toString().substr( 3, randomLength ) + Date.now() ).toString( 36 )
  }

  // 判断数据类型
  getType = ( obj ) => {
  const type = Object.prototype.toString.call( obj );
  if ( type === '[object Array]' ) return 'Array'
  if ( type === '[object Object]' ) return 'Object'
  return 'param is no object type';
 }

  // 删除数据中的所有id
  deleteDataId = ( item )=>{
    const itemStr = JSON.stringify( item )
    const newItem = JSON.parse( itemStr )
    const arr = Object.keys( item )
    arr.forEach( info=>{
      const ele =  newItem[info]
      if( info==='id' ) delete newItem[info]
      // 获取类型
      const type = this.getType( newItem[info] )
      // 对象类型
      if( type==='Object' ){
       if( newItem.type !== "ANSWER" && ele.id ) delete ele.id
       if( ele.activityId )delete ele.activityId
       if( ele.elementId )delete ele.elementId
      }
      // 数组类型
      if( type==='Array'&& ele.length ){
          const arrStr = JSON.stringify( ele )
          const newArr= JSON.parse( arrStr ).map( tep=>{
            const arrItemStr =JSON.stringify( tep )
            const newArrItem = JSON.parse( arrItemStr )
            if( newArrItem.id ) delete newArrItem.id
            if( newArrItem.activityId )delete newArrItem.activityId
            if( newArrItem.elementId )delete newArrItem.elementId
            return  newArrItem
          } )
          newItem[info] = newArr
      }
    } )
    return newItem
  }

  // 复制组件
  copyElement= ( item )=>{
    const { domData, changeDomData = () => { } } = this.props;
    const { elements }=domData
    // 数据拷贝
    const itemStr = JSON.stringify( item );
    const newItem = JSON.parse( itemStr );
    const copyItem = this.deleteDataId( newItem );
    copyItem.virtualId = this.genNonDuplicateID();
    copyItem.name = `${copyItem.name}-copy`;
    const newElements = [...elements, copyItem];
    const obj = Object.assign( domData, { elements:newElements } );
    changeDomData( obj );
    this.setState( { time: new Date() }, ()=>{message.success( '复制成功' )} )
  }

  render() {
    const { type } = this.state;
    const { domData: { elements = [] }, editDomType = () => { }, componentList } = this.props;
    return (
      <div className={styles.add}>
        <div className={styles.navs}>
          <div
            className={type === 'add' ? styles.navItemActive : styles.navItem}
            onClick={() => this.changeNav( 'add' )}
          >
            添加组件
          </div>
          <div
            className={type === 'grid' ? styles.navItemActive : styles.navItem}
            onClick={() => this.changeNav( 'grid' )}
          >
            已选组件
          </div>
        </div>

        <div className={styles.addContent}>
          {
            type === 'add' ? (
              <div>
                {
                  componentList && componentList.map( item => (
                    <div key={item.groupType}>
                      <div className={styles.modalTit}>{componentType[item.groupType]}:</div>

                      <div className={styles.modalBox}>
                        {
                          item.list.map( citem => (
                            <div
                              className={styles.modalBoxItem}
                              key={citem.name}
                              onClick={() => editDomType( citem )}
                            >
                              <img src={citem.logo} alt="" />
                              <div>{citem.name}</div>
                            </div>
                          ) )
                        }
                      </div>
                    </div>
                  ) )
                }
              </div>
            ) : (
              <div>
                <div>
                  {
                    elements.length > 0 ? (
                      <div>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                          <Droppable droppableId="droppable">
                            {( provided, snapshot ) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle( snapshot.isDraggingOver )}
                              >
                                {elements.map( ( item, index ) => (
                                  <Draggable key={item.virtualId} draggableId={item.virtualId} index={index}>
                                    {( provided1, snapshot1 ) => (
                                      <div
                                        className={styles.pageItem}
                                        key={item.virtualId}
                                        ref={provided1.innerRef}
                                        {...provided1.draggableProps}
                                        {...provided1.dragHandleProps}
                                        style={getItemStyle(
                                          snapshot1.isDragging,
                                          provided1.draggableProps.style
                                        )}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                          }}
                                          >
                                            <Tag color="#d8b168">{index + 1}.{getValue( elementTypes, item.type )}</Tag>
                                          </div>
                                          <div>{item.name}</div>
                                        </div>
                                        <div className={styles.pageItemBtns}>
                                          <Tooltip placement="top" title="复制">
                                            <Icon
                                              style={{ color: '#1F3883', marginRight: 10, fontSize: 20 }}
                                              type="copy"
                                              onClick={() => this.copyElement( item )}
                                            />
                                          </Tooltip>
                                          <Tooltip placement="top" title="编辑">
                                            <Icon
                                              style={{ color: '#1F3883', marginRight: 10, fontSize: 20 }}
                                              type="edit"
                                              onClick={() => editDomType( item )}
                                            />
                                          </Tooltip>
                                          <Popconfirm
                                            placement="top"
                                            title="确定删除该组件？"
                                            onConfirm={() => this.delItem( elements, 'virtualId', item.virtualId )}
                                            okText="是"
                                            cancelText="否"
                                          >
                                            <Icon style={{ color: '#1F3883', fontSize: 20 }} type="delete" />
                                          </Popconfirm>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ) )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    ) : ( <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂未选取组件，请去添加组件" /> )
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    )
  }

}

export default Add;

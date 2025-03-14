/* eslint-disable no-param-reassign */
import React, { useContext, useState } from 'react';
import { Button, Icon, message, Tooltip, Modal, Input } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import { splicElementDataId } from '../../../../DataVerification'
import { DomDataContext, CurrentPages, CommonOperationFun } from '../../../provider';
import { DEFAULT_PAGE_STYLE } from '../../../addDefaultObj'
import PageWrapper from './PageWrapper/PageWrapper';
import styles from './index.less';


const { TextArea } = Input
const baseClass = 'pageManagement';
const reorder = ( list, startIndex, endIndex ) => {
  const result = Array.from( list );
  const [removed] = result.splice( startIndex, 1 );
  result.splice( endIndex, 0, removed );
  return result;
};
// 生成唯一标识
const getUniqueKey = () => {
  return Number(
    Math.random()
      .toString()
      .substr( 3, 12 ) + Date.now()
  ).toString( 36 );
};
function PageManagement( { changeTabs } ) {
  const [domData, changeDomData] = useContext( DomDataContext );
  const [currentPages, changeCurrentPages, pagesIndex] = useContext( CurrentPages );
  const { generateSnapshot, getPageId } = useContext( CommonOperationFun )
  const [editPageName, setEditPageName] = useState( undefined );
  const { pages } = domData;
  const { componentData = [] } = currentPages;


  const getItemStyle = ( isDragging, draggableStyle ) => ( {
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#fff',
    // styles we need to apply on draggables
    ...draggableStyle,
  } );
  const onDragEnd = result => {
    // dropped outside the list
    if ( !result.destination ) {
      return;
    }
    const items = reorder( pages, result.source.index, result.destination.index );
    domData.pages = items;
    changeDomData( domData );
  };
  const handleClickPages = async ( idx, card ) => {
    if ( idx === pagesIndex ) return;
    if ( card ) ( await generateSnapshot() )
    changeCurrentPages( idx, 'num' );
  };
  const handleAddPages = async () => {
    getPageId().then( id => {
      if ( !id ) return
      const obj = {
        id,
        style: DEFAULT_PAGE_STYLE,
        key: getUniqueKey(),
        label: `页面${pages.length + 1}`,
        enablePageTurning: false,
        pageTurningMethod: 'UP_AND_DOWN',
        pageTurningType: 'common',
        autoPageTurning: false,
        autoPageTime: '',
      };
      domData.pages = domData.pages.concat( [obj] );
      changeDomData( domData );
      changeTabs( '1' );
      handleClickPages( domData.pages.length - 1 )
    } )
    await generateSnapshot()
  };

  const handleCopyPage = idx => {
    if ( !componentData.length ) {
      message.warn( '当前页面未添加组件！' );
      return;
    }
    getPageId().then( id => {
      if ( !id ) return
      const newPage = JSON.parse( JSON.stringify( pages[idx] ) );
      newPage.id = id;
      newPage.key = getUniqueKey();
      const cloneComponentData = _.cloneDeep( newPage.componentData )
      const pageNum = domData.pages.length
      newPage.componentData = cloneComponentData.map( i => splicElementDataId( i, pageNum ) )
      domData.pages = domData.pages.concat( newPage );
      changeDomData( domData );
    } )
  };

  const handleDeletePage = ( idx, e ) => {
    e.stopPropagation();
    if ( domData.pages.length <= 1 ) {
      message.warn( '当前只有一个页面，无法删除' );
      return;
    }
    Modal.confirm( {
      title: (
        <>
          <span style={{ color: 'red' }}>页面删除后无法还原，</span>您还要继续吗？
        </>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if ( idx === domData.pages.length - 1 ) {
          handleClickPages( idx - 1 )
        }
        if ( pagesIndex === domData.pages.length - 1 ) {
          handleClickPages( 0 )
        }
        domData.pages.splice( idx, 1 );
        const domDataConfig = JSON.parse( JSON.stringify( domData ) )
        changeDomData( domDataConfig );
      },
    } );
  };
  const handleChangePageName = ( e, idx ) => {
    const { value } = e.target
    domData.pages[idx].label = value
    changeDomData( domData )
  }

  return (
    <div className={styles[`${baseClass}Wrap`]}>
      <div className={styles[`${baseClass}AddPage`]}>
        <Button onClick={handleAddPages}> + 添加页面</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={styles[`${baseClass}Droppable`]}
            >
              {pages.map( ( item, index ) => (
                <Draggable
                  key={item.id || item.key}
                  draggableId={item.id || item.key}
                  index={index}
                >
                  {( providedChild, snapshotChild ) => (
                    <div
                      ref={providedChild.innerRef}
                      {...providedChild.draggableProps}
                      {...providedChild.dragHandleProps}
                      style={getItemStyle(
                        snapshotChild.isDragging,
                        providedChild.draggableProps.style
                      )}
                      className={styles[`${baseClass}DraggableItem`]}
                      onClick={handleClickPages.bind( null, index, true )}
                    >
                      <div className={styles[`${baseClass}DraggableImgWrap`]}>
                        <PageWrapper pageData={item} />
                      </div>
                      <div
                        className={styles[`${baseClass}DraggableOperation`]}
                        onClick={() => {
                          if ( editPageName === undefined ) return
                          setEditPageName( undefined )
                        }}
                      >
                        <div className={styles[`${baseClass}DraggablePageName`]}>
                          {editPageName === index ? (
                            <TextArea
                              value={item.label || ''}
                              autoFocus
                              rows={2}
                              onChange={( e ) => { handleChangePageName( e, index ) }}
                              onBlur={() => { setEditPageName( undefined ) }}
                              onPressEnter={() => { setEditPageName( undefined ) }}
                              onClick={( e ) => { e.stopPropagation() }}
                              maxLength={20}
                              style={{ resize: 'none' }}
                            />
                          ) : (
                            <>
                              <span onClick={( e ) => {
                                e.stopPropagation()
                                setEditPageName( editPageName === index ? undefined : index )
                              }}
                              >
                                {item.label || `页面${index + 1}`}
                              </span>
                              <br />
                              <br />
                              <span>页面ID:</span>
                              <br />
                              <span style={{ fontSize: 12 }}>{item.id}</span>
                            </>
                          )}
                        </div>
                        <div
                          className={`${styles[`${baseClass}DraggableOperationOrderNum`]
                            } ${( pagesIndex === index &&
                              styles[`${baseClass}DraggableOperationOrderNumActive`] ) ||
                            ''}`}
                        >
                          {index + 1}
                        </div>
                        <div className={styles[`${baseClass}DraggableOperationBottom`]}>
                          <Tooltip placement="top" title="复制当前页">
                            <Icon
                              type="copy"
                              onClick={() => {
                                handleCopyPage( index );
                              }}
                            />
                          </Tooltip>
                          <Tooltip placement="top" title="删除">
                            <Icon
                              type="delete"
                              onClick={( e ) => {
                                handleDeletePage( index, e );
                              }}
                            />
                          </Tooltip>
                        </div>
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
  );
}
export default PageManagement;

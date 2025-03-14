/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Form, Input, Modal, Empty, Icon, Tooltip, Popconfirm, Button, message, Row, Col } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UploadImg from '@/components/UploadImg';
import UploadModal from '@/components/UploadModal/UploadModal';
import SetSkip from '../PublicElement/SetSkip';
import styles from './index.less';
import { getValue, clickTypes, featureTypes } from '../../../BeesEnumes';

const FormItem = Form.Item;
const randomId = () => Number(
          Math.random()
            .toString()
            .substr( 3, 12 ) + Date.now()
        ).toString( 36 )
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
export default function ImgList( { componentsData, changeValue, functionConfig } ) {
  const [visibleImgModal, setVisibleImgModal] = useState( false );
  const [imageObj, setImageObj] = useState( {} );
  const [operateType, setOperateType] = useState( '' );
  
  const getListStyle = isDraggingOver => ( {
    background: isDraggingOver ? 'rgba(216,178,105,0.1)' : '#fff',
  } );

  const getItemStyle = ( isDragging, draggableStyle ) => ( {
    userSelect: 'none',
    background: isDragging ? 'rgba(216,178,105,0.3)' : '#fff',
    ...draggableStyle,
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
      return '';
    }
    const newArr = list.filter( item => item[attr] !== value );
    return newArr;
  };

  function changeImg( e, type ) {
    const newImgObj = Object.assign( {}, imageObj, { [type]: e } );
    setImageObj( newImgObj );
  }

  function changeImageName( e, type ) {
    const val = e.target.value;
    const newImgObj = Object.assign( {}, imageObj, { [type]: val } );
    setImageObj( newImgObj );
  }

  // 关闭弹框
  function onImgModalCancel() {
    setImageObj( {} );
    setOperateType( '' );
    setVisibleImgModal( false );
  }

  function onModalVerification( obj ) {
    let isTrue = true;
    if ( !obj.url ) {
      isTrue = false;
      message.error( '请选择图片' );
    }
    if ( !( obj.clickEvent && obj.clickEvent.clickType ) ) {
      isTrue = false;
      message.error( '请设置跳转功能' );
    }
    if ( obj.clickEvent && obj.clickEvent.clickType === 'FEATURE' ) {
      if ( !( obj.clickEvent.key || obj.clickEvent.parameter ) ) {
        isTrue = false;
        message.error( '请选择功能' );
      }
    }
    if ( obj.clickEvent && obj.clickEvent.clickType === 'CUSTOM_LINK' ) {
      if ( !obj.clickEvent.link && !obj.clickEvent.outLink ) {
        isTrue = false;
        message.error( '请输入端内或者端外链接' );
      }
    }
    return isTrue;
  }

  function onImgModalConfirm() {
    const images = componentsData.images ? componentsData.images : [];
    let newImages = images;
    if ( !onModalVerification( imageObj ) ) return;
    // 新增
    if ( operateType && operateType === 'add' ) {
      const newImageObj = Object.assign( imageObj, {
        imgVirtualId: randomId(),
      } );
      newImages.push( newImageObj );
    }
    // 编辑
    if ( operateType && operateType === 'edit' ) {
      newImages = images.map( item => {
        return item.imgVirtualId === imageObj.imgVirtualId ? imageObj : item;
      } );
    }
    changeValue( newImages, 'images' );
    setImageObj( {} );
    setOperateType( '' );
    setVisibleImgModal( false );
  }

  // 删除图片配置
  function delItem( list, attr, value ) {
    const newImages = removeList( list, attr, value );
    changeValue( newImages, 'images' );
  }

  // 编辑图片配置
  function editImgObj( item ) {
    setImageObj( item );
    setOperateType( 'edit' );
    setVisibleImgModal( true );
  }

  const onDragEnd = result => {
    if ( !result.destination ) {
      return;
    }
    const newImages = reorderList(
      componentsData.images || [],
      result.source.index,
      result.destination.index
    );
    changeValue( newImages, 'images' );
  };

  // 添加图片配置
  function addImgObj() {
    if ( componentsData && componentsData.images && componentsData.images.length >= 9 ) {
      message.error( '最多只能添加9张' );
      return;
    }
    setVisibleImgModal( true );
    setOperateType( 'add' );
  }

  // 图片列表
  function renderImg() {
    // eslint-disable-next-line no-param-reassign
    const imageList = componentsData.images.map( item => {if( !item.imgVirtualId ) item.imgVirtualId = randomId();return item} );

    let imgView = (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无图片，请去添加图片" />
    );
    if ( imageList && imageList.length > 0 ) {
      imgView = (
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {( provided, snapshot ) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle( snapshot.isDraggingOver )}
                >
                  {imageList.map( ( item, index ) => (
                    <Draggable
                      key={item.imgVirtualId}
                      draggableId={item.imgVirtualId}
                      index={index}
                    >
                      {( provided1, snapshot1 ) => (
                        <div
                          className={styles.pageItem}
                          key={item.imgVirtualId}
                          ref={provided1.innerRef}
                          {...provided1.draggableProps}
                          {...provided1.dragHandleProps}
                          style={getItemStyle( snapshot1.isDragging, provided1.draggableProps.style )}
                        >
                          <div style={{ display: 'flex' }}>
                            <UploadImg value={item.url} disabled />
                            <div className={styles.imgName}>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <span>图片名称：</span>
                                <span>{item.name}</span>
                              </div>
                              {/* <div style={{ fontSize: '12px', color: '#666', height: '30px' }}>
                                <span>跳转类型：</span>
                                <span>{getValue( clickTypes, item.clickEvent.clickType )}</span>
                              </div>
                              {item.clickEvent.clickType === 'FEATURE' && (
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    height: '30px',
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                  }}
                                >
                                  <span style={{ minWidth: '60px' }}>功能类型：</span>
                                  <span
                                    style={{
                                      maxWidth: '62.5px',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {getValue( featureTypes, item.clickEvent.key )}
                                  </span>
                                </div>
                              )}
                              {item.clickEvent.clickType === 'CUSTOM_LINK' && (
                                <div>
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: '#666',
                                      height: '30px',
                                      display: 'flex',
                                      flexWrap: 'nowrap',
                                    }}
                                  >
                                    <span style={{ minWidth: '60px' }}>端内链接：</span>
                                    <span
                                      style={{
                                        maxWidth: '62.5px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {item.clickEvent.link}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '12px',
                                      color: '#666',
                                      height: '30px',
                                      display: 'flex',
                                      flexWrap: 'nowrap',
                                    }}
                                  >
                                    <span style={{ minWidth: '60px' }}>端外链接：</span>
                                    <span
                                      style={{
                                        maxWidth: '62.5px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {item.clickEvent.outLink}
                                    </span>
                                  </div>
                                </div>
                              )} */}
                            </div>
                          </div>
                          <div className={styles.pageItemBtns}>
                            <Tooltip placement="top" title="编辑">
                              <Icon
                                style={{ color: '#1F3883', marginRight: 10, fontSize: 20 }}
                                type="edit"
                                onClick={() => editImgObj( item )}
                              />
                            </Tooltip>
                            <Popconfirm
                              placement="top"
                              title="是否删除该图片？"
                              onConfirm={() =>
                                delItem( imageList, 'imgVirtualId', item.imgVirtualId )
                              }
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
      );
    }
    return imgView;
  }

  // 编辑或添加图片弹框
  function renderImgModal() {
    const modalFooter = {
      okText: '保存',
      onOk: onImgModalConfirm,
      onCancel: onImgModalCancel,
    };
    return (
      <Modal
        maskClosable={false}
        title="添加图片"
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={visibleImgModal}
        {...modalFooter}
      >
        <div>
          <FormItem label="图片名称" {...formLayout}>
            <Input
              value={imageObj.name}
              placeholder="请输入图片名称"
              onChange={e => changeImageName( e, 'name' )}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>图片
              </span>
            }
            {...formLayout}
          >
            <Row>
              <Col span={10}>
                <UploadModal value={imageObj.url} onChange={e => changeImg( e, 'url' )} />
              </Col>
              <Col span={12}>
                <div>格式：jpg/jpeg/png</div>
                <div>图片大小建议不大于1M</div>
              </Col>
            </Row>
          </FormItem>
          <SetSkip
            formLayout={formLayout}
            functionConfig={functionConfig}
            changeVal={( e ) => {setImageObj( { ...imageObj, clickEvent:e } )}}
            clickEvent={imageObj.clickEvent}
          />
        </div>
      </Modal>
    );
  }

  return (
    <>
      <FormItem
        label={
          <span className={styles.labelText}>
            <span>*</span>图片列表
          </span>
        }
      >
        <div>
          {renderImg()}
          <Button
            type="dashed"
            style={{ width: '100%', marginTop: 10 }}
            icon="plus"
            onClick={addImgObj}
          >
            添加图片
          </Button>
        </div>
      </FormItem>
      {renderImgModal()}
    </>
  );
}

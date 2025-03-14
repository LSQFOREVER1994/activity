/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { message, Form, Input, Radio, Popconfirm, Icon, Empty, Button, Modal, Select, Checkbox, InputNumber, Tooltip } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { connect } from 'dva';
import UploadModal from '@/components/UploadModal/UploadModal';
import UploadImg from '@/components/UploadImg';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import styles from './bannerElement.less';
import serviceObj from '@/services/serviceObj';
import { getValue, clickTypes, featureTypes } from '../../BeesEnumes'

const FormItem = Form.Item;
const { Option } = Select;

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

const limitDecimals = ( value ) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : ''
  }
  return ''
};

@connect()
@Form.create()
class BannerElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      visibleImgModal: false,
      imageObj: {},
      operateType: '',
    }
  }

  componentWillMount() {
    this.onAddImgId();
    this.initElmentData()
  }

    // 组件基础信息初始化
  initElmentData = () => {
    console.log( 333 );
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '轮播组件',
      direction:'HORIZONTAL',
      spaceBetween:0,
      effect:'SLIDE',
      pagination:'BULLETS',
      autoplay:true,
      delay:2000,
      loop:true,
      images:[
        {
          clickEvent: {
            clickType: "NONE"
          },
          name: "默认1",
          url:`${serviceObj.defaultImagePath}MRT.png`,
          imgVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        },
        {
          clickEvent: {
            clickType: "NONE"
          },
          name: "默认2",
          url:`${serviceObj.defaultImagePath}MRT.png`,
          imgVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        },
      ]
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj  );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 编辑时给图片列表加虚拟Id
  onAddImgId = () => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    let newEleObj = eleObj
    const imgList = ( eleObj.images && eleObj.images.length > 0 ) ? eleObj.images : []
    if ( imgList && imgList.length > 0 ) {
      const newImgList = imgList.map( info => {
        return {
          ...info,
          imgVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        }
      } )
      newEleObj = Object.assign( eleObj, { images: newImgList } )
    }
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    const val = e.target.value
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInputNumber = ( e, type ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: e } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeImg = ( e, type ) => {
    const { imageObj } = this.state
    const newImgObj = Object.assign( {}, imageObj, { [type]: e } );
    this.setState( {
      imageObj: { ...newImgObj }
    } )
  }

  changeInputClickEven = ( e, type ) => {
    const val = e.target.value
    const { imageObj } = this.state
    const oldClickEvent = imageObj.clickEvent ? imageObj.clickEvent : {}
    const newImgObj = Object.assign( {}, imageObj, { clickEvent: { ...oldClickEvent, [type]: val } } );
    this.setState( {
      imageObj: { ...newImgObj }
    } )
  }

  changeImageName = ( e, type ) => {
    const val = e.target.value
    const { imageObj } = this.state
    const newImgObj = Object.assign( {}, imageObj, {  [type]: val  } );
    this.setState( {
      imageObj: { ...newImgObj }
    } )
  }

  // 多选框
  onChangeCheckbox = ( e ) => {
    let noSupportWx = false
    let openByApp = false
    if ( e.indexOf( "noSupportWx" ) > -1 ) {
      noSupportWx = true
    }
    if ( e.indexOf( "openByApp" ) > -1 ) {
      openByApp = true
    }
    const { imageObj } = this.state
    const oldClickEvent = imageObj.clickEvent ? imageObj.clickEvent : {}
    const newImgObj = Object.assign( {}, imageObj, { clickEvent: { ...oldClickEvent, noSupportWx, openByApp } } );
    this.setState( {
      imageObj: { ...newImgObj }
    } )
  }

  changeFuntion = ( e, type ) => {
    const { imageObj } = this.state
    const oldClickEvent = imageObj.clickEvent ? imageObj.clickEvent : {}
    const newImgObj = Object.assign( {}, imageObj, { clickEvent: { ...oldClickEvent, [type]: e } } );
    this.setState( {
      imageObj: { ...newImgObj }
    } )
  }

  onDragEnd = ( result ) => {
    if ( !result.destination ) {
      return;
    }
    const { domData, changeDomData, eleObj } = this.props;
    const newImages = reorderList( eleObj.images || [], result.source.index, result.destination.index );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { images: newImages } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 删除图片配置
  delItem = ( list, attr, value ) => {
    const newImages = removeList( list, attr, value );
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { images: newImages } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 编辑图片配置
  editImgObj = ( item ) => {
    this.setState( {
      imageObj: item,
      visibleImgModal: true,
      operateType: 'edit'
    } )
  }

  // 添加图片配置
  addImgObj = () => {
    const { eleObj } = this.props;
    if ( eleObj && eleObj.images && eleObj.images.length >= 9 ) {
      message.error( '最多只能添加9张' )
      return
    }
    this.setState( {
      visibleImgModal: true,
      operateType: 'add'
    } )
  }

  // 关闭弹框
  onImgModalCancel = () => {
    this.setState( {
      imageObj: {},
      visibleImgModal: false,
      operateType: '',
    } )
  }

  onImgModalConfirm = () => {
    const { imageObj, operateType } = this.state
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const images = eleObj.images ? eleObj.images : []
    let newImages = images
    if( !this.onModalVerification( imageObj ) ) return
    // 新增
    if ( operateType && operateType === 'add' ) {
      const newImageObj = Object.assign( imageObj, { imgVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 ) } );
      newImages.push( newImageObj )
    }
    // 编辑
    if ( operateType && operateType === 'edit' ) {
      newImages = images.map( item => {
        return item.imgVirtualId === imageObj.imgVirtualId ? imageObj : item;
      } );
    }
    const newEleObj = Object.assign( eleObj, { images: newImages } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( {
      imageObj: {},
      visibleImgModal: false,
      operateType: '',
      time: new Date()
    } )
  }

  onModalVerification = ( obj ) => {
    let isTrue = true
    if( !obj.url ) {
      isTrue = false
      message.error( '请选择图片' )
    }
    if( !( obj.clickEvent && obj.clickEvent.clickType ) ) {
      isTrue = false
      message.error( '请设置跳转功能' )
    }
    if( obj.clickEvent && obj.clickEvent.clickType === 'FEATURE' ) {
      if( !obj.clickEvent.key ) {
        isTrue = false;
        message.error( '请选择功能' )
      }
    }
    if( obj.clickEvent && obj.clickEvent.clickType === 'CUSTOM_LINK' ) {
      if( !obj.clickEvent.link && !obj.clickEvent.outLink ) {
        isTrue = false;
        message.error( '请输入端内或者端外链接' )
      }
    }
    return isTrue
  }

  // 跳转类型
  changeJumpType = ( e ) => {
    if ( e && e.target.value === this.state.clickTypeState ) return
    this.setState( {
      clickTypeState: e.target.value
    } )

  }


  // 图片列表
  renderImg() {
    const { eleObj } = this.props;
    const imageList = eleObj.images
    let imgView = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无图片，请去添加图片" />
    if ( imageList && imageList.length > 0 ) {
      imgView = (
        <div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {( provided, snapshot ) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle( snapshot.isDraggingOver )}
                >
                  {imageList.map( ( item, index ) => (
                    <Draggable key={item.imgVirtualId} draggableId={item.imgVirtualId} index={index}>
                      {( provided1, snapshot1 ) => (
                        <div
                          className={styles.pageItem}
                          key={item.imgVirtualId}
                          ref={provided1.innerRef}
                          {...provided1.draggableProps}
                          {...provided1.dragHandleProps}
                          style={
                            getItemStyle( snapshot1.isDragging, provided1.draggableProps.style )
                          }
                        >
                          <div style={{ display: 'flex' }}>
                            <UploadImg value={item.url} disabled />
                            <div style={{ marginLeft: '10px' }}>
                              <div style={{ fontSize: '12px', color: '#666', height: '30px' }}>
                                <span>图片名称：</span>
                                <span>{item.name}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#666', height: '30px' }}>
                                <span>跳转类型：</span>
                                <span>{getValue( clickTypes, item.clickEvent.clickType )}</span>
                              </div>
                              {item.clickEvent.clickType === 'FEATURE' &&
                                <div style={{ fontSize: '12px', color: '#666', height: '30px' }}>
                                  <span>功能类型：</span>
                                  <span>{getValue( featureTypes, item.clickEvent.key )}</span>
                                </div>
                              }
                              {item.clickEvent.clickType === 'CUSTOM_LINK' &&
                                <div>
                                  <div style={{ fontSize: '12px', color: '#666', height: '30px' }}>
                                    <span>端内链接：</span>
                                    <span>{item.clickEvent.link}</span>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#666', height: '30px' }}>
                                    <span>端外链接：</span>
                                    <span>{item.clickEvent.outLink}</span>
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                          <div className={styles.pageItemBtns}>
                            <Tooltip placement="top" title="编辑">
                              <Icon
                                style={{ color: '#1F3883', marginRight: 10, fontSize: 20 }}
                                type="edit"
                                onClick={() => this.editImgObj( item )}
                              />
                            </Tooltip>
                            <Popconfirm
                              placement="top"
                              title="是否删除该图片？"
                              onConfirm={() => this.delItem( imageList, 'imgVirtualId', item.imgVirtualId )}
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
      )
    }
    return imgView
  }


  // 编辑或添加图片弹框
  renderImgModal() {
    const { visibleImgModal, imageObj } = this.state;
    const modalFooter = {
      okText: '保存',
      onOk: this.onImgModalConfirm,
      onCancel: this.onImgModalCancel,
    };

    const options = [
      { label: '不支持微信打开', value: 'noSupportWx' },
      { label: '需原生APP打开', value: 'openByApp' },
    ];

    const checkboxVal = []
    if ( imageObj.clickEvent && imageObj.clickEvent.noSupportWx ) {
      checkboxVal.push( 'noSupportWx' )
    }
    if ( imageObj.clickEvent && imageObj.clickEvent.openByApp ) {
      checkboxVal.push( 'openByApp' )
    }

    return (
      <Modal
        maskClosable={false}
        title='添加图片'
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={visibleImgModal}
        {...modalFooter}
      >
        <div>
          <FormItem
            label='图片名称'
            {...this.formLayout}
          >
            <Input
              value={imageObj.name}
              placeholder="请输入图片名称"
              onChange={( e ) => this.changeImageName( e, 'name' )}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>图片</span>}
            {...this.formLayout}
          >
            <UploadModal value={imageObj.url} onChange={( e ) => this.changeImg( e, 'url' )} />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>设置跳转</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInputClickEven( e, 'clickType' )}
              value={imageObj.clickEvent ? imageObj.clickEvent.clickType : ''}
            >
              <Radio value="NONE">无</Radio>
              <Radio value="FEATURE">功能</Radio>
              <Radio value="CUSTOM_LINK">自定义链接</Radio>
            </Radio.Group>
          </FormItem>

          {imageObj.clickEvent && imageObj.clickEvent.clickType === 'FEATURE' &&
            <FormItem label='选择功能' {...this.formLayout}>
              <Select
                style={{ width: '100%' }}
                onChange={( e ) => this.changeFuntion( e, 'key' )}
                value={imageObj.clickEvent ? imageObj.clickEvent.key : ''}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {featureTypes.map( info=>  <Option value={info.key}>{info.value}</Option> )}
              </Select>
            </FormItem>
          }

          {imageObj.clickEvent && imageObj.clickEvent.clickType === 'CUSTOM_LINK' &&
            <div>
              <FormItem
                style={{ display: 'flex' }}
                label='端内链接'
                {...this.formLayout}
              >
                <Input
                  value={imageObj.clickEvent ? imageObj.clickEvent.link : ''}
                  placeholder="请输入端内链接"
                  onChange={( e ) => this.changeInputClickEven( e, 'link' )}
                  maxLength={2000}
                />
              </FormItem>

              <FormItem
                style={{ display: 'flex' }}
                label='端外链接'
                {...this.formLayout}
              >
                <Input
                  value={imageObj.clickEvent ? imageObj.clickEvent.outLink : ''}
                  placeholder="请输入端外链接"
                  onChange={( e ) => this.changeInputClickEven( e, 'outLink' )}
                  maxLength={2000}
                />
              </FormItem>
              <FormItem
                style={{ display: 'flex' }}
                label='链接限制'
                {...this.formLayout}
              >
                <Checkbox.Group
                  options={options}
                  value={checkboxVal}
                  onChange={this.onChangeCheckbox}
                />
              </FormItem>
            </div>
          }
        </div>
      </Modal>
    )
  }

  render() {
    const { domData = {}, changeDomData, eleObj } = this.props;
    return (
      <div>
        <div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>组件名称</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={( e ) => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>滑动方向</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'direction' )}
              value={eleObj.direction}
            >
              <Radio value="HORIZONTAL">横向</Radio>
              <Radio value="VERTICAL">竖向</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label='图片间距' {...this.formLayout}>
            <InputNumber
              value={eleObj.spaceBetween}
              placeholder="请输入"
              min={0}
              style={{ width: '85%' }}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeInputNumber( e, 'spaceBetween' )}
            />
            <span style={{ paddingLeft: '10px' }}>px</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>切换效果</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'effect' )}
              value={eleObj.effect}
            >
              <Radio value="SLIDE">位移</Radio>
              <Radio value="FADE">淡入</Radio>
              <Radio value="CUBE">方块</Radio>
              <Radio value="FLIP">3D翻转</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>分页器样式</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'pagination' )}
              value={eleObj.pagination}
            >
              <Radio value="BULLETS">圆点</Radio>
              <Radio value="FRACTION">页码</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>自动切换</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'autoplay' )}
              value={eleObj.autoplay}
            >
              <Radio value>开启</Radio>
              <Radio value={false}>关闭</Radio>
            </Radio.Group>
          </FormItem>
          {eleObj.autoplay &&
            <FormItem label='自动切换时间' {...this.formLayout}>
              <InputNumber
                value={eleObj.delay}
                placeholder="请输入"
                min={0}
                step={1}
                style={{ width: '85%' }}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.changeInputNumber( e, 'delay' )}
              />
              <span style={{ paddingLeft: '10px' }}>ms</span>
            </FormItem>
          }
          <FormItem
            label={<span className={styles.labelText}><span>*</span>循环播放</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'loop' )}
              value={eleObj.loop}
            >
              <Radio value>开启</Radio>
              <Radio value={false}>关闭</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>图片列表</span>}
            {...this.formLayout}
          >
            <div>
              {this.renderImg()}
              <Button
                type="dashed"
                style={{ width: '100%', marginTop: 10 }}
                icon="plus"
                onClick={this.addImgObj}
              >
                添加图片
              </Button>
            </div>
          </FormItem>
        </div>
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
        {this.renderImgModal()}
      </div>
    )
  }

}

export default BannerElement;

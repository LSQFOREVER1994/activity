/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Modal, message, Input, DatePicker, InputNumber, Button, Radio, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import serviceObj from '@/services/serviceObj';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import PrizeTable from './PrizeTable';
import styles from './exchangeElement.less'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect()
@Form.create()
class GridWheelElement extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      textColorVisible: false,
      activeColorVisible: false,
      tabItemModalVisible: false,
      eidtTabItem: {},
      isEdit: false,
      saveLoading: false,
    }
  }


  componentWillMount() {
    this.initElmentData();
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '兑换组件',
      landingPage:`${serviceObj.defaultImagePath}DH_RKT.png`,
      showInventory:true,
      exchangeBackgroundColor:'#f6f6f6',
      integralNumColor: '#000',
      productShowType: 'LONG_PIC',
      elementShowType: 'SECOND_LEVEL_PAGE',
      exchangeButton:`${serviceObj.defaultImagePath}DH_LJDH.png`,
      emptyInventoryExchangeButton:`${serviceObj.defaultImagePath}DH_LJDHC.png`,
      tags:[
        {
          name: "默认1",
          sort: 1,
        },
        {
          name: "默认2",
          sort: 2,
        },
        {
          name: "默认3",
          sort: 3,
        },
      ]
    }
    const elementsList = domData.elements ? domData.elements : []
    const prizeList = eleObj.prizes || [];
    const newPrizeList = [...prizeList]
    newPrizeList.sort( ( item1, item2 ) => ( item1.sort - item2.sort ) )
    newPrizeList.forEach( ( item => {
      item.changeInventory = 0
    } ) )

    const newEleObj = Object.assign( eleObj, defaultObj  );
    const finalObj = Object.assign( newEleObj, { prizes: [...newPrizeList] } );

    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === finalObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    const val = e.target.value;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val, changeInventory:0 } );
    if( type === 'elementShowType' ){
      if( val === 'SECOND_LEVEL_PAGE' ){
        newEleObj.prizes.forEach( item=>{
          const info = item;
          if( info.tagName ) delete info.tagName
        } )
      }else if( val === 'HOMEPAGE' ){
        newEleObj.prizes.forEach( item=>{
          const info = item;
          if( !info.tagName ) info.tagName =  eleObj.tags && eleObj.tags.length ? eleObj.tags[0].name : ''
        } )
      }
    }
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  changeValue = ( e, type ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: e.hex || e } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  changeColor = ( e, type ) => {
    const color = e.hex;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: color } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  // 拾色板
  showBgColor = ( e, type ) => {
    e.stopPropagation()
    const visibleType = `${type}Visible`
    this.setState( {
      [visibleType]: !this.state[visibleType]
    } )
  }

  // 删除tab
  onDeleteTabItem = ( index ) => {
    const { domData, changeDomData, eleObj } = this.props
    const { tags = [] } = eleObj
    const newTabItems = [...tags]
    newTabItems.splice( index, 1 )
    newTabItems.sort( ( item1, item2 ) => ( item1.sort - item2.sort ) )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { tags: [...newTabItems] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
    // 关闭弹框
    setTimeout( () => {
      this.onTabItemModalCancel()
    }, 200 );
  }

  removeTag = ( str ) => {
    if ( str ) {
      return str.replace( /<[^>]+>/g, '' ).replace( /&nbsp;/ig, '' ).replace( /\s/g, '' )
    }
    return ''

  }

  // 添加tab
  onAddTabItem = () => {
    const { eleObj = {} } = this.props
    const { tags } = eleObj
    if ( tags && tags.length >= 10 ) {
      message.error( '最多只能添加十个标签' )
      return
    }
    this.setState( {
      tabItemModalVisible: true
    } )
  }

  // 编辑tab
  onEditTabItem = ( e, item, index ) => {
    this.setState( {
      tabItemModalVisible: true,
      eidtTabItem: { ...item, index },
      isEdit: true
    } )
  }

  // 弹框确定
  onTabItemModalConfirm = () => {
    const { eidtTabItem, saveLoading } = this.state;
    const { name, sort, index } = eidtTabItem;
    if ( saveLoading ) return;
    this.setState( {
      saveLoading: true,
    } )
    if ( !name ) {
      message.error( '请输入入口标题' );
      this.setState( {
        saveLoading: false,
      } )
      return
    }
    if ( !sort ) {
      message.error( '请输入标签排序' );
      this.setState( {
        saveLoading: false,
      } )
      return
    }
    const { domData, changeDomData, eleObj } = this.props
    const { tags = [], prizes=[] } = eleObj;
    if( tags.find( o=>o.name === name ) ){
      message.error( '标签名不可重复' );
      this.setState( {
        saveLoading: false,
      } )
      return
    }
    let newTabItems = tags;
    let prizeArr =[];
    if ( index || index === 0 ) {
      // 编辑
      if( prizes.length ){
        prizeArr = prizes.map( o=>{
          const i = o;
          if( o.tagName === tags[index].name ){
            i.tagName = name;
          }
          return i;
        } )
      };
      newTabItems.splice( index, 1, eidtTabItem );
    } else {
      // 新增
      newTabItems = [...tags, eidtTabItem]
      prizeArr = prizes
    }
    newTabItems.sort( ( item1, item2 ) => ( item1.sort - item2.sort ) )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { tags: [...newTabItems], prizes:prizeArr } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
    // 关闭弹框
    setTimeout( () => {
      this.onTabItemModalCancel();
    }, 100 );
    setTimeout( () => {
      this.setState( {
        saveLoading: false,
      } );
    }, 200 );
  }

  // 弹框取消
  onTabItemModalCancel = () => {
    this.setState( {
      tabItemModalVisible: false,
      eidtTabItem: {},
      isEdit: false,
    } )
  }

  // 更新弹框数据
  changeEditInput = ( e, type ) => {
    const { eidtTabItem } = this.state
    let val;
    if ( type === 'name' ) {
      val = e.target.value;
    } else if ( type === 'sort' ) {
      if ( e && e >= 0 ) val = e;
    } else {
      val = e;
    }

    let obj = eidtTabItem;
    if ( e ) obj = { ...eidtTabItem, [type]: val };
    this.setState( {
      eidtTabItem: { ...obj },
    } )
  }

  // Tab弹框
  renderTabItemModal = () => {
    const { tabItemModalVisible, eidtTabItem, isEdit } = this.state;
    const modalFooter = {
      okText: '保存',
      onOk: this.onTabItemModalConfirm,
      onCancel: this.onTabItemModalCancel,
    };

    return (
      <Modal
        maskClosable={false}
        title={`${isEdit ? '编辑' : '新增'}标签内容`}
        width={840}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={tabItemModalVisible}
        {...modalFooter}
      >
        <FormItem
          label={<span className={styles.labelText}><span>*</span>入口标题</span>}
          {...this.formLayout}
        >
          <Input
            value={eidtTabItem.name}
            placeholder="请输入入口标题"
            onChange={( e ) => this.changeEditInput( e, 'name' )}
            maxLength={5}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>排序</span>}
          {...this.formLayout}
        >
          <InputNumber
            value={eidtTabItem.sort}
            placeholder="请输入排序值，数值越小排序越靠前"
            min={0}
            precision={0}
            onChange={( e ) => this.changeEditInput( e, 'sort' )}
            style={{ width: '100%' }}
          />
        </FormItem>
      </Modal>
    )
  }

  // Tab表格
  renderTabTable = () => {
    const { eleObj = {} } = this.props
    const { tags } = eleObj
    const columns = [
      {
        title: <span>排序</span>,
        dataIndex: 'sort',
        key: 'sort',
        render: sort => <span>{sort}</span>,
      },
      {
        title: <span>入口标题</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        width: 120,
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.onEditTabItem( e, item, index )}
            > 编辑
            </span>
            <Popconfirm placement="top" title="是否确认删除该条内容" onConfirm={() => this.onDeleteTabItem( index )} okText="是" cancelText="否">
              <span
                style={{ cursor: 'pointer', marginRight: 15, color: '#f5222d' }}
              >
                删除
              </span>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <div style={{ marginBottom: '20px' }}>
        <Table
          key='sort'
          dataSource={tags || []}
          columns={columns}
          pagination={false}
          size='small'
        />
        <div>
          <Button
            type="dashed"
            style={{ width: '100%', marginTop: 10 }}
            icon="plus"
            onClick={() => this.onAddTabItem()}
          >
            添加
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { exchangeBackgroundColorVisible, integralNumColorVisible } = this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <div>
          <div onClick={( e ) => {this.showBgColor( e, 'exchangeBackgroundColor' )}} className={styles.cover} hidden={!( exchangeBackgroundColorVisible )} />
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
            label={<span className={styles.labelText}>兑换有效时间</span>}
            {...this.formLayout}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={eleObj.startTime ? [moment( eleObj.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' )] : []}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={( e ) => this.changeDate( e )}
            />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>商品展示样式</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'productShowType' )}
              value={eleObj.productShowType}
            >
              <Radio value="LONG_PIC">长图展示</Radio>
              <Radio value="SQUARE">方块展示</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>组件样式</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'elementShowType' )}
              value={eleObj.elementShowType}
            >
              <Radio value="SECOND_LEVEL_PAGE">二级页面展示</Radio>
              <Radio value="HOMEPAGE">主页展示</Radio>
            </Radio.Group>
          </FormItem>
          {
            eleObj.elementShowType === 'SECOND_LEVEL_PAGE' && (
            <FormItem
              label={<span className={styles.labelText}><span>*</span>兑换入口图</span>}
              {...this.formLayout}
            >
              <div style={{ display: 'flex' }}>
                <UploadModal value={eleObj.landingPage} onChange={( e ) => this.changeValue( e, 'landingPage' )} />
                <div
                  style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
                >
                  <div>图片宽度建议750px</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </div>
            </FormItem>
            )
          }

          {
            eleObj.elementShowType === 'HOMEPAGE' && (
            <FormItem
              label={<span className={styles.labelText}><span>*</span>兑换标签编辑</span>}
              {...this.formLayout}
            >
              {
                this.renderTabTable()
              }
            </FormItem>
            )
          }

          <FormItem
            label={<span className={styles.labelText}><span>*</span>是否展示库存</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'showInventory' )}
              value={eleObj.showInventory}
            >
              <Radio value>展示</Radio>
              <Radio value={false}>不展示</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>兑换按钮</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.exchangeButton} onChange={( e ) => this.changeValue( e, 'exchangeButton' )} />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>图片大小建议不大于1M</div>
                <div>不配置为默认样式</div>
              </div>
            </div>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>库存为0兑换按钮</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.emptyInventoryExchangeButton} onChange={( e ) => this.changeValue( e, 'emptyInventoryExchangeButton' )} />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>图片大小建议不大于1M</div>
                <div>不配置为默认样式</div>
              </div>
            </div>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>积分数字颜色</span>}
            {...this.formLayout}
          >
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor( e, 'integralNumColor' ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.integralNumColor, width: 116, height: '22px' }} />
            </span>

            {
              integralNumColorVisible &&
              <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.integralNumColor}
                  onChange={( e ) => { this.changeValue( e, 'integralNumColor' ) }}
                />
              </div>
            }
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}>兑换列表背景图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.exchangeBackgroundImg} onChange={( e ) => this.changeValue( e, 'exchangeBackgroundImg' )} />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem label="兑换列表背景色" {...this.formLayout}>
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor( e, 'exchangeBackgroundColor' ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.exchangeBackgroundColor, width: 116, height: '22px' }} />
            </span>

            {
              exchangeBackgroundColorVisible &&
              <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.exchangeBackgroundColor}
                  onChange={( e ) => { this.changeValue( e, 'exchangeBackgroundColor' ) }}
                />
              </div>
            }
          </FormItem>


        </div>
        <div>
          <PrizeTable
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
        <div style={{ marginTop: '30px' }}>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
        {/* 弹框 */}
        {this.renderTabItemModal()}
      </div>
    )
  }

}

export default GridWheelElement;

/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Select, InputNumber, Checkbox, Radio, Button, Empty, Popconfirm } from 'antd';
import { connect } from 'dva';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import { featureTypes } from '../../BeesEnumes'
import styles from './marqueeElement.less';

const FormItem = Form.Item;
const { Option } = Select;

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
class MarqueeElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  itemFormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };


  constructor( props ) {
    super( props );
    this.state = {
      textColorVisible:false,
    }
  }

  componentWillMount(){
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '跑马灯组件',
      fontSize: 28,
      activeColor: '#BF832E',
      dataType :'REWARD',
      direction:'VERTICAL',
      showCount:10,
      isSuspend:false,
      records:[
       '用户178****666获得8.88元红包',
       '用户088****535获得0.88元红包',
      ]
    }
    const oldClickEvent = eleObj.clickEvent ? eleObj.clickEvent : {}
    const defaultClickEvent ={
      ...oldClickEvent,
      clickType:'NONE'
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj, { clickEvent: defaultClickEvent }  );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    const  val = e.target.value
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

  changeValue = ( e, type ) => {
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
    this.setState( { time: new Date() } )
  }

  // 拾色板
  showBgColor = ( e, type ) => {
    e.stopPropagation()
    const visibleType = `${type}Visible`
    this.setState( {
      [visibleType]: !this.state[visibleType]
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
      const { domData, changeDomData, eleObj } = this.props;
      const oldClickEvent = eleObj.clickEvent ? eleObj.clickEvent : {}
      const elementsList = domData.elements ? domData.elements : []
      const newEleObj = Object.assign( eleObj, { clickEvent: { ...oldClickEvent, noSupportWx, openByApp } } );
      // 替换对应项
      const newElementsList = elementsList.map( item => {
        return item.virtualId === newEleObj.virtualId ? newEleObj : item;
      } );
      // 刷新总数据
      const newDomData = Object.assign( domData, { elements: newElementsList } );
      changeDomData( newDomData );
      this.setState( { time: new Date() } )
    }

    changeFuntion = ( e, type ) => {
      const { domData, changeDomData, eleObj } = this.props;
      const oldClickEvent = eleObj.clickEvent ? eleObj.clickEvent : {}
      const elementsList = domData.elements ? domData.elements : []
      const newEleObj = Object.assign( eleObj, { clickEvent: { ...oldClickEvent, [type]: e } } );
      // 替换对应项
      const newElementsList = elementsList.map( item => {
        return item.virtualId === newEleObj.virtualId ? newEleObj : item;
      } );
      // 刷新总数据
      const newDomData = Object.assign( domData, { elements: newElementsList } );
      changeDomData( newDomData );
      this.setState( { time: new Date() } )
    }

    changeInputClickEven = ( e, type ) => {
      const val = e.target.value
      const { domData, changeDomData, eleObj } = this.props;
      const oldClickEvent = eleObj.clickEvent ? eleObj.clickEvent : {}
      const elementsList = domData.elements ? domData.elements : []
      const newEleObj = Object.assign( eleObj, { clickEvent: { ...oldClickEvent, [type]: val } } );
      // 替换对应项
      const newElementsList = elementsList.map( item => {
        return item.virtualId === newEleObj.virtualId ? newEleObj : item;
      } );
      // 刷新总数据
      const newDomData = Object.assign( domData, { elements: newElementsList } );
      changeDomData( newDomData );
      this.setState( { time: new Date() } )
    }

  // 编辑仿真
  changeRecordInput = ( e, indexNumber )=>{
    const val = e.target.value
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const recordList = eleObj.records ? eleObj.records : []
    const newRecordList = recordList.map( ( info, index )=>{
      return index===indexNumber? val:info
    } )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { records: [...newRecordList] } );

    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  // 添加仿真记录
  addRecordItem = () => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const recordList = eleObj.records ? eleObj.records : []
    const newRecordList = [...recordList, '']
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { records: [...newRecordList] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: [...newElementsList] } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 删除仿真记录
  onDelete = ( indexNum ) => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const recordList = eleObj.records ? eleObj.records : []
    let newRecordList = recordList
    if( !recordList.length||recordList.length===1 ){
      newRecordList = []
    }else if( recordList.length > 1 ){
      newRecordList = recordList.filter( ( i, index )=>{
        return index !==indexNum
      } )
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { records: [...newRecordList] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: [...newElementsList] } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  renderRecords= ()=>{
  const { eleObj } = this.props;
  const recordList = eleObj.records ? eleObj.records : []
  let view = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无仿真记录，请去添加仿真记录" />
  if ( recordList&&recordList.length>0 ) {
    const viewList = recordList.map( ( info, index ) => {
      return (
        <div style={{ flex:1 }}>
          <FormItem
            label={`内容${index+1}`}
            {...this.formLayout}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            <Input
              value={info}
              placeholder="请输入仿真内容"
              onChange={( e ) => this.changeRecordInput( e, index )}
              maxLength={30}
              style={{ width:'85%' }}
            />

            <Popconfirm
              title="确定删除该仿真记录吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => this.onDelete( index )}
            >
              <span style={{ color: '#f5222d', cursor: 'pointer', marginLeft:'20px' }}>删除</span>
            </Popconfirm>
          </FormItem>
        </div>
      )
    } )
    view = (
      <div>
        {viewList}
        <div style={{ color: '#666' }}>* 仿真记录内容过长可能会被省略部分内容</div>
      </div>
    )
  }

  return view

}

  render() {
    const { textColorVisible }=this.state
    const { domData = {}, changeDomData, eleObj={} } = this.props;
    const options = [
      { label: '不支持微信打开', value: 'noSupportWx' },
      { label: '需原生APP打开', value: 'openByApp' },
    ];

    const checkboxVal = []
    if ( eleObj.clickEvent && eleObj.clickEvent.noSupportWx ) {
      checkboxVal.push( 'noSupportWx' )
    }
    if ( eleObj.clickEvent && eleObj.clickEvent.openByApp ) {
      checkboxVal.push( 'openByApp' )
    }
    return (
      <div>
        <div>
          <div onClick={( e ) => { this.showBgColor(  e, 'textColor' ) }} className={styles.cover} hidden={!( textColorVisible )} />
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
            label="字号"
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.fontSize}
              placeholder="请输入"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'fontSize' )}
              style={{ width:'85%' }}
            />
            <span style={{ paddingLeft:'10px' }}>px</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>数据源</span>}
            {...this.formLayout}
          >
            <Select
              style={{ width: '100%' }}
              onChange={( e ) => this.changeValue( e, 'dataType' )}
              value={eleObj.dataType}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <Option value='NONE'>无</Option>
              <Option value='REWARD'>中奖记录</Option>
              <Option value='ENROLL'>报名记录</Option>
            </Select>
          </FormItem>
          <FormItem
            label='展示数据条数'
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.showCount}
              placeholder="请输入"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'showCount' )}
              style={{ width:'85%' }}
            />
            <span style={{ paddingLeft:'10px' }}>条</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>滚动类型</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'direction' )}
              value={eleObj.direction}
            >
              <Radio value="HORIZONTAL">横向</Radio>
              <Radio value="VERTICAL">纵向</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>设置跳转</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInputClickEven( e, 'clickType' )}
              value={eleObj.clickEvent ? eleObj.clickEvent.clickType : ''}
            >
              <Radio value="NONE">无</Radio>
              <Radio value="FEATURE">功能</Radio>
              <Radio value="CUSTOM_LINK">自定义链接</Radio>
            </Radio.Group>
          </FormItem>

          {eleObj.clickEvent && eleObj.clickEvent.clickType === 'FEATURE' &&
          <FormItem label='选择功能' {...this.formLayout}>
            <Select
              style={{ width: '100%' }}
              onChange={( e ) => this.changeFuntion( e, 'key' )}
              value={eleObj.clickEvent ? eleObj.clickEvent.key : ''}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {featureTypes.map( info=>  <Option value={info.key}>{info.value}</Option> )}
            </Select>
          </FormItem>
        }

          {eleObj.clickEvent && eleObj.clickEvent.clickType === 'CUSTOM_LINK' &&
          <div>
            <FormItem
              style={{ display: 'flex' }}
              label='端内链接'
              {...this.formLayout}
            >
              <Input
                value={eleObj.clickEvent ? eleObj.clickEvent.link : ''}
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
                value={eleObj.clickEvent ? eleObj.clickEvent.outLink : ''}
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
          <FormItem label='仿真记录' {...this.itemFormLayout}>
            <div>
              {this.renderRecords()}
              <Button
                type="dashed"
                style={{ width: '100%', marginTop: 10 }}
                icon="plus"
                onClick={() => this.addRecordItem()}
              >
                添加仿真记录
              </Button>
            </div>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>是否悬浮</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'isSuspend' )}
              value={eleObj.isSuspend}
            >
              <Radio value={false}>关闭</Radio>
              <Radio value>开启</Radio>
            </Radio.Group>
          </FormItem>

          {eleObj.isSuspend&&
          <FormItem
            label={<span className={styles.labelText}><span>*</span>悬浮方式</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'suspendMode' )}
              value={eleObj.suspendMode}
            >
              <Radio value="TOP">置顶</Radio>
              <Radio value="BOTTOM">置底</Radio>
              <Radio value="CUSTOM">自定义顶部距离</Radio>
            </Radio.Group>
          </FormItem>
        }

          {eleObj.isSuspend&&eleObj.suspendMode==='CUSTOM'&&
          <FormItem label={<span className={styles.labelText}><span>*</span>距离</span>} {...this.formLayout}>
            <InputNumber
              value={eleObj.distance}
              placeholder="请输入"
              min={0}
              onChange={( e ) => this.changeValue( e, 'distance' )}
            />
            <span style={{ paddingLeft:'10px' }}>px</span>
          </FormItem>
        }
        </div>
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </div>
    )
  }

}

export default MarqueeElement;

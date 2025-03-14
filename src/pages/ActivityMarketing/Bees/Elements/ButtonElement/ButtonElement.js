/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Radio, InputNumber, Checkbox, Select } from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import { featureTypes } from '../../BeesEnumes'
import styles from './buttonElement.less';

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
class ButtonElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      textColorVisible: false,
      borderColorVisible: false,
      buttonColorVisible: false
    }
  }

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '按钮组件',
      style: 'CUSTOM_STYLE',
      text: '我是按钮文字',
      fontSize: 32,
      borderColor: '#BF832E',
      borderWidth: 1,
      borderRadius: 100,
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 30,
      isSuspend: false
    }
    const oldClickEvent = eleObj.clickEvent ? eleObj.clickEvent : {}
    const defaultClickEvent = {
      ...oldClickEvent,
      clickType: 'NONE'
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj, { clickEvent: defaultClickEvent } );
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

  hiddenColorModal = () => {
    this.setState( {
      textColorVisible: false,
      borderColorVisible: false,
      buttonColorVisible: false,
    } )
  }

  render() {
    const { textColorVisible, borderColorVisible, buttonColorVisible } = this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
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
          <div onClick={this.hiddenColorModal} className={styles.cover} hidden={!( textColorVisible || borderColorVisible || buttonColorVisible )} />
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
            label={<span className={styles.labelText}><span>*</span>组件样式</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'style' )}
              value={eleObj.style ? eleObj.style : 'CUSTOM_STYLE'}
            >
              <Radio value="CUSTOM_STYLE">自定义样式 </Radio>
              <Radio value="CUSTOM_LINK">自定义图片</Radio>
            </Radio.Group>
          </FormItem>

          {( ( eleObj.style && eleObj.style === 'CUSTOM_STYLE' ) || ( !eleObj.style ) ) &&
            <div>
              <FormItem
                label='按钮文字'
                {...this.formLayout}
              >
                <Input
                  value={eleObj.text}
                  placeholder="请输入按钮文字"
                  onChange={( e ) => this.changeInput( e, 'text' )}
                  maxLength={20}
                />
              </FormItem>
              <FormItem label='字号' {...this.formLayout}>
                <InputNumber
                  value={eleObj.fontSize}
                  placeholder="请输入"
                  min={0}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={( e ) => this.changeValue( e, 'fontSize' )}
                  style={{ width: '85%' }}
                />
                <span style={{ paddingLeft: '10px' }}>px</span>
              </FormItem>
              <FormItem
                label="按钮边框颜色"
                {...this.formLayout}
              >
                <span
                  style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
                  onClick={( e ) => { this.showBgColor( e, 'borderColor' ) }}
                >
                  <span style={{ display: 'inline-block', background: eleObj.borderColor, width: 116, height: '22px' }} />
                </span>

                {borderColorVisible &&
                  <div style={{ position: 'absolute', bottom: -100, left: 200, zIndex: 999 }}>
                    <SketchPicker
                      width="230px"
                      disableAlpha
                      color={eleObj.borderColor}
                      onChange={( e ) => { this.changeColor( e, 'borderColor' ) }}
                    />
                  </div>
                }
              </FormItem>
              <FormItem label='边框宽度' {...this.formLayout}>
                <InputNumber
                  value={eleObj.borderWidth}
                  placeholder="请输入"
                  min={0}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={( e ) => this.changeValue( e, 'borderWidth' )}
                  style={{ width: '85%' }}
                />
                <span style={{ paddingLeft: '10px' }}>px</span>
              </FormItem>
              <FormItem
                label="按钮颜色"
                {...this.formLayout}
              >
                <span
                  style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
                  onClick={( e ) => { this.showBgColor( e, 'buttonColor' ) }}
                >
                  <span style={{ display: 'inline-block', background: eleObj.buttonColor, width: 116, height: '22px' }} />
                </span>

                {buttonColorVisible &&
                  <div style={{ position: 'absolute', bottom: -100, left: 200, zIndex: 999 }}>
                    <SketchPicker
                      width="230px"
                      disableAlpha
                      color={eleObj.buttonColor}
                      onChange={( e ) => { this.changeColor( e, 'buttonColor' ) }}
                    />
                  </div>
                }
              </FormItem>
              <FormItem label='圆角值' {...this.formLayout}>
                <InputNumber
                  value={eleObj.borderRadius}
                  placeholder="请输入"
                  min={0}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={( e ) => this.changeValue( e, 'borderRadius' )}
                  style={{ width: '85%' }}
                />
                <span style={{ paddingLeft: '10px' }}>px</span>
              </FormItem>
            </div>
          }

          {eleObj.style && eleObj.style === 'CUSTOM_LINK' &&
            <FormItem label="按钮图片" {...this.formLayout}>
              <UploadModal value={eleObj.buttonImage} onChange={( e ) => this.changeValue( e, 'buttonImage' )} />
            </FormItem>
          }

          {eleObj.style && eleObj.style === 'CUSTOM_LINK' &&
            <div>
              <FormItem label='图片宽' {...this.formLayout}>
                <InputNumber
                  value={eleObj.buttonWidth}
                  placeholder="请输入"
                  min={0}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={( e ) => this.changeValue( e, 'buttonWidth' )}
                  style={{ width: '85%' }}
                />
                <span style={{ paddingLeft: '10px' }}>px</span>
              </FormItem>

              <FormItem label='图片高' {...this.formLayout}>
                <InputNumber
                  value={eleObj.buttonHeight}
                  placeholder="请输入"
                  min={0}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={( e ) => this.changeValue( e, 'buttonHeight' )}
                  style={{ width: '85%' }}
                />
                <span style={{ paddingLeft: '10px' }}>px</span>
              </FormItem>
            </div>
          }

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
                {featureTypes.map( info => <Option value={info.key}>{info.value}</Option> )}
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

          {eleObj.isSuspend &&
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

          {eleObj.isSuspend && eleObj.suspendMode === 'CUSTOM' &&
            <FormItem label={<span className={styles.labelText}><span>*</span>距离</span>} {...this.formLayout}>
              <InputNumber
                value={eleObj.distance}
                placeholder="请输入"
                min={0}
                onChange={( e ) => this.changeValue( e, 'distance' )}
              />
              <span style={{ paddingLeft: '10px' }}>px</span>
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

export default ButtonElement;

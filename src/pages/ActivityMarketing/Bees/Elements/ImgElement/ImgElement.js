import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Radio, Select, Checkbox, InputNumber } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import { featureTypes } from '../../BeesEnumes'
import serviceObj from '@/services/serviceObj';
import styles from './imgElement.less';

const FormItem = Form.Item;
const { Option } = Select;


@connect()
class ImgElement extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
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
      name: '图片组件',
      url:`${serviceObj.defaultImagePath}MRT.png`,
      isSuspend:false
    }
    const oldClickEvent = eleObj.clickEvent ? eleObj.clickEvent : {}
    const defaultClickEvent ={
      ...oldClickEvent,
      clickType:'NONE',
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

  changeImg = ( e, type ) => {
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

  render() {
    const { domData = {}, changeDomData, eleObj } = this.props;
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
          label={<span className={styles.labelText}><span>*</span>图片</span>}
          {...this.formLayout}
        >
          <UploadModal value={eleObj.url} onChange={( e ) => this.changeImg( e, 'url' )} />
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
              onChange={( e ) => this.changeImg( e, 'distance' )}
            />
            <span style={{ paddingLeft:'10px' }}>px</span>
          </FormItem>
        }
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </div>

    );
  }
}

export default ImgElement;

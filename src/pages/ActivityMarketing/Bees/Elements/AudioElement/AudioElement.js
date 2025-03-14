import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Radio, Switch } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import styles from './audioElement.less';

const FormItem = Form.Item;
@connect()
class AudioElement extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
    }
  }

  componentWillMount() {
    this.initElmentData()
  }

    // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '音频组件',
      style:'BAR_STYLE',
      loop:false,
      paddingLeft: 30,
      paddingRight: 30,
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
          label={<span className={styles.labelText}><span>*</span>音频</span>}
          {...this.formLayout}
        >
          <UploadModal
            value={eleObj.url}
            onChange={( e ) => this.changeImg( e, 'url' )}
            mediaType='AUDIO'
          />
        </FormItem>

        <FormItem
          label={<span className={styles.labelText}><span>*</span>组件样式</span>}
          {...this.formLayout}
        >
          <Radio.Group
            onChange={( e ) => this.changeInput( e, 'style' )}
            value={eleObj.style}
          >
            <Radio value="BUTTON_STYLE">按钮样式</Radio>
            <Radio value="BAR_STYLE">横条样式</Radio>
            <Radio value="CAR_STYLE">卡片样式</Radio>
          </Radio.Group>
          {
            eleObj.style === 'BUTTON_STYLE' && <div>*可在组件高级设置中调整内边距(上)和内边距(左)移动按钮位置。</div>
          }
          {
            eleObj.style === 'CAR_STYLE' && <div>*音频名称将取自组件名称。</div>
          }
        </FormItem>

        {
          eleObj.style === 'BUTTON_STYLE' &&
          <div>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>播放中按钮</span>}
              {...this.formLayout}
            >
              <UploadModal
                value={eleObj.playImage}
                onChange={( e ) => this.changeImg( e, 'playImage' )}
              />
            </FormItem>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>暂停中按钮</span>}
              {...this.formLayout}
            >
              <UploadModal
                value={eleObj.stopImage}
                onChange={( e ) => this.changeImg( e, 'stopImage' )}
              />
            </FormItem>
          </div>
        }

        {/* <FormItem
          label={<span className={styles.labelText}><span>*</span>自动播放</span>}
          {...this.formLayout}
        >
          <Switch
            checkedChildren='是'
            unCheckedChildren='否'
            defaultChecked={eleObj.autoplay}
            onChange={( e ) => this.changeImg( e, 'autoplay' )}
          />
        </FormItem> */}

        <FormItem
          label={<span className={styles.labelText}><span>*</span>循环播放</span>}
          {...this.formLayout}
        >
          <Switch
            checkedChildren='是'
            unCheckedChildren='否'
            defaultChecked={eleObj.loop}
            onChange={( e ) => this.changeImg( e, 'loop' )}
          />
        </FormItem>
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

export default AudioElement;

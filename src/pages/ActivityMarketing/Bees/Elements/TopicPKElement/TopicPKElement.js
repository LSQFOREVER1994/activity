import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import styles from './topicPKElement.less';

const FormItem = Form.Item;
@connect()
class TopicPKElement extends PureComponent {

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
      name: '话题PK组件',
      topic:'周末怎么过？',
      positive:'出门',
      negative:'宅',
      virtualPositive:1,
      virtualNegative:1,
      paddingLeft:30,
      paddingRight:30,
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

  changeInput = ( e, type, funcType ) => {
    let val = ''
    if( funcType === 'date' ) {
      val = e && e.format( 'YYYY-MM-DD' )
    } else if ( e.target ) {
      val = e.target.value
    } else  {
      val =  e
    }
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
          label={<span className={styles.labelText}><span>*</span>话题内容</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.topic}
            placeholder="请输入话题内容"
            onChange={( e ) => this.changeInput( e, 'topic' )}
            maxLength={400}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>正方观点</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.positive}
            placeholder="请输入正方观点"
            onChange={( e ) => this.changeInput( e, 'positive' )}
            maxLength={10}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>反方观点</span>}
          {...this.formLayout}
        >
          <Input
            value={eleObj.negative}
            placeholder="请输入反方观点"
            onChange={( e ) => this.changeInput( e, 'negative' )}
            maxLength={10}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}>虚拟正方人数</span>}
          {...this.formLayout}
        >
          <InputNumber
            value={eleObj.virtualPositive}
            placeholder="请填写虚拟正方人数"
            min={0}
            precision={0}
            style={{ width: 150 }}
            onChange={( e ) => this.changeInput( e, 'virtualPositive' )}
          />
        </FormItem>

        <FormItem
          label={<span className={styles.labelText}>虚拟反方人数</span>}
          {...this.formLayout}
        >
          <InputNumber
            value={eleObj.virtualNegative}
            placeholder="请填写虚拟反方人数"
            min={0}
            precision={0}
            style={{ width: 150 }}
            onChange={( e ) => this.changeInput( e, 'virtualNegative' )}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>结束时间</span>}
          {...this.formLayout}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder='请选择结束时间'
            value={eleObj.endTime ? moment( eleObj.endTime, 'YYYY-MM-DD' ) : null}
            onChange={( e ) => this.changeInput( e, 'endTime', 'date' )}
            format="YYYY-MM-DD"
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

export default TopicPKElement;

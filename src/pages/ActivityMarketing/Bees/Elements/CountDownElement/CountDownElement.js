import React, { PureComponent } from 'react';
import { Form, Input, Radio, DatePicker, } from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import styles from './countDownElement.less';

const FormItem = Form.Item;

@connect()
@Form.create()
class AnswerElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      timeUnitColorVisible: false,
      timeNumColorVisible: false
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
      name: '倒计时组件',
      isShowDays:true,
      effectType:'NORMAL',
      endEffectType:"NORMAL"
    };
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  
  changeInput = ( e, type ) => {
    const val = e && e.target ? e.target.value : e;
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

  changeValue = ( e, type, citem ) => {
    const { domData, changeDomData, eleObj } = this.props;
    let obj = {};
    if ( citem ) {
      obj = { [type]: e, tag: { name: citem.props.children, id: citem.props.value }, count: null }
    } else {
      obj = { [type]: e && e.hex ? e.hex : e }
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  changeDate = ( e ) => {
    const endTime = e && e.format( 'YYYY-MM-DD HH:mm:ss' );
    const { domData, changeDomData, eleObj } = this.props;
    let { isShowDays } = eleObj;
    if( moment( endTime ).diff( moment(), 'days' ) >=4 ){
      isShowDays = true;
    }
    const obj = Object.assign( eleObj, { endTime, isShowDays } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, obj );
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

  hiddenColorModal = () => {
    this.setState( {
      timeUnitColorVisible: false,
      timeNumColorVisible: false,
    } )
  }


  render() {
    const { timeUnitColorVisible, timeNumColorVisible } = this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;

    return (
      <div>
        <div>
          <div onClick={this.hiddenColorModal} className={styles.cover} hidden={!( timeUnitColorVisible || timeNumColorVisible )} />
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
            label={<span className={styles.labelText}><span>*</span>倒计时结束时间</span>}
            {...this.formLayout}
          >
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onChange={( e ) => this.changeDate( e )}
              value={eleObj.endTime ? moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' ) : null}
            />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>是否展示天数</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'isShowDays' )}
              value={eleObj.isShowDays}
              disabled={moment( eleObj.endTime ).diff( moment(), 'days' ) >=4}
            >
              <Radio value>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
            <span style={{ color:'#f5222d', fontSize:12 }}>
              *倒计时超过4天必须展示天数
            </span>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>展示效果</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'effectType' )}
              value={eleObj.effectType}
            >
              <Radio value='NORMAL'>普通</Radio>
              <Radio value='SLIDE'>滑动</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem label='时间框背景图' {...this.formLayout}>
            <UploadModal 
              value={eleObj.timeFrameBackgroundImage}
              onChange={( e ) => this.changeValue( e, 'timeFrameBackgroundImage' )}
            />
          </FormItem>

          <FormItem label="时间单位颜色" {...this.formLayout}>
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor( e, 'timeUnitColor' ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.timeUnitColor, width: 116, height: '22px' }} />
            </span>

            {
              timeUnitColorVisible &&
              <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.timeUnitColor}
                  onChange={( e ) => { this.changeValue( e, 'timeUnitColor' ) }}
                />
              </div>
            }
          </FormItem>

          <FormItem label="时间数字颜色" {...this.formLayout}>
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor( e, 'timeNumColor' ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.timeNumColor || '#3A393B', width: 116, height: '22px' }} />
            </span>

            {
              timeNumColorVisible &&
              <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.timeNumColor}
                  onChange={( e ) => { this.changeValue( e, 'timeNumColor' ) }}
                />
              </div>
            }
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>倒计时结束效果</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'endEffectType' )}
              value={eleObj.endEffectType}
            >
              <Radio value='NORMAL'>普通</Radio>
              <Radio value='COPYWRITING'>文案</Radio>
            </Radio.Group>
            {
              eleObj.endEffectType === 'NORMAL' && 
              <span style={{ color:'#f5222d', fontSize:12 }}>
                *普通效果倒计时结束后，将显示为00:00:00
              </span>
            }
          </FormItem>
          {
            eleObj.endEffectType === 'COPYWRITING' &&
            <FormItem
              label={<span className={styles.labelText}><span>*</span>倒计时结束文案</span>}
              {...this.formLayout}
            >
              <Input
                value={eleObj.copywriting}
                placeholder="请输入倒计时结束文案"
                onChange={( e ) => this.changeInput( e, 'copywriting' )}
                maxLength={15}
              />
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

export default AnswerElement;

/* eslint-disable react/no-unused-state */
/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, InputNumber } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import serviceObj from '@/services/serviceObj';
import * as constant from './constant';
import styles from './bindGroupElement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

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
class BindGroupElement extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      textColorVisible: false
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
      name: '拼团组件',
      memberAmount: 3,
      attendLimit: 1,
      inviteButtonImg: `${serviceObj.defaultImagePath}PT_YQ.png`,
      drawButtonImg: `${serviceObj.defaultImagePath}PT_CJ.png`,
      startGroupButtonImg: `${serviceObj.defaultImagePath}PT_KT.png`,
      awardButtonImg: `${serviceObj.defaultImagePath}PT_YHJ.png`,
      buttonWidth: 500,
      buttonHeight: 100,
      paddingLeft: 30,
      paddingRight: 30,
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
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
  showBgColor = ( e ) => {
    e.stopPropagation()
    const { textColorVisible } = this.state;
    this.setState( {
      textColorVisible: !textColorVisible
    } )
  }

  // 渲染按钮图元素
  renderBtnImage = ( eleObj, item ) => {
    return (
      <FormItem
        key={item.key}
        label={<span className={styles.labelText}><span>*</span>{item.label}</span>}
        {...this.formLayout}
      >
        <div style={{ display: 'flex' }}>
          <UploadModal value={eleObj[item.key]} onChange={( e ) => this.changeValue( e, item.key )} />
          <div
            style={{
              width: '180px',
              marginTop: 10,
              marginLeft: 10,
              color: '#999',
              fontSize: 13,
              lineHeight: 2,
            }}
          >
            <div>建议比例：</div>
            <div>图片大小建议不大于1M</div>
            <div>图片尺寸建议500px * 100px</div>
          </div>
        </div>
      </FormItem>
    )
  }

  // 渲染InputNumber元素
  renderInputNumber = ( eleObj, item ) => {
    const attr = {};
    if ( item.max ) attr.max = item.max;

    return (
      <FormItem
        key={item.key}
        label={<span className={styles.labelText}>{item.require ? <span>*</span> : ''}{item.label}</span>}
        {...this.formLayout}
      >
        <InputNumber
          value={eleObj[item.key]}
          placeholder={item.placeholder}
          min={item.min}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={( e ) => this.changeValue( e, item.key )}
          style={item.style}
          {...attr}
        /> {item.unit}
      </FormItem>
    )
  }

  render() {
    const { textColorVisible } = this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <div>
          <div onClick={this.showBgColor} className={styles.cover} hidden={!( textColorVisible )} />
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
            label={<span className={styles.labelText}>组件有效时间</span>}
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
          {
            constant.MEMBER.map( item => {
              return this.renderInputNumber( eleObj, item )
            } )
          }
          {
            constant.BTN_IMAGE.map( item => {
              return this.renderBtnImage( eleObj, item )
            } )
          }
          {
            constant.BTN_WH.map( item => {
              return this.renderInputNumber( eleObj, item )
            } )
          }
        </div>
        <div>
          <PrizeOptionSecondEdition
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            tableTitle='团长奖品配置'
            descriptionText='*一个用户一期活动仅可当一次团长，只需配置默认概率和手机号默认概率。'
          />
        </div>
        <div>
          <PrizeOptionSecondEdition
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            dataKey="prizeList"
            tableTitle='团员奖品配置'
            descriptionText="*第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。 若配置了手机号概率，此时会对资金账号参与和手机号参与做分区。否则，不做区分。 每一列抽奖概率总和需为100%。"
          />
        </div>
        <div style={{ marginTop: '30px' }}>
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

export default BindGroupElement;

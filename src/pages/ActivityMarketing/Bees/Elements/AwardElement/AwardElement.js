/* eslint-disable react/no-unused-state */
/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  InputNumber,
  Row,
  Col,
  Select
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
// import EditAwardPrize from './EditAwardPrize';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';


import {
  FORM_LAYOUT,
  BOTH_LAYOUT,
  getUniqueKey,
  AWARD_DEF,
  INPUTSUFFIX,
  STATISTIC,
  ELE_STYLE,
  BTN_IMAGE,
  SINGLE_RADIO,
} from './constant';
import styles from './awardElement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
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
class AwardElement extends PureComponent {

  constructor( props ) {
    super( props );
    this.state = {}
  }

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { eleObj } = this.props;
    // 编辑和新增状态的编辑都不走此流程
    if ( eleObj && ( eleObj.id || eleObj.name ) ) return;
    // 塞入默认值
    const newEleObj = Object.assign( eleObj, AWARD_DEF );
    this.updateDomData( newEleObj );
  }

  changeInput = ( e, type ) => {
    const { eleObj } = this.props;
    let val = e.target.value;
    const radioKeys = Object.keys( SINGLE_RADIO );
    if ( radioKeys.includes( type ) ) {
      const radioObj = SINGLE_RADIO[type].radioType.find( it => it.valueMapping === val )
      val = radioObj.value;
    }
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    this.updateDomData( newEleObj );
  }

  changeValue = ( e, type ) => {
    const { eleObj } = this.props;
    const newEleObj = Object.assign( eleObj, { [type]: e } );
    this.updateDomData( newEleObj );
  }

  changeDate = ( e ) => {
    const { eleObj } = this.props;
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const newEleObj = Object.assign( eleObj, obj );
    this.updateDomData( newEleObj );
  }

  // 更新总数据
  updateDomData = ( newEleObj ) => {
    const { domData, changeDomData } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  }

  /**
   * 渲染InputNumber元素
   * @param {object} eleObj 回显数据
   * @param {object} inputNum
   * @returns
   */
  renderInputNumber = ( eleObj, inputNum, layout ) => {
    const { key, require, label, placeholder, min, max, style, unit } = inputNum;
    // 独有字段处理
    const attr = {};
    if ( max ) attr.max = max;

    return (
      <FormItem
        label={<span className={styles.labelText}>{require && <span>*</span>}{label}</span>}
        {...( layout || FORM_LAYOUT )}
      >
        <InputNumber
          value={eleObj[key]}
          placeholder={placeholder}
          min={min}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={( e ) => this.changeValue( e, key )}
          style={style}
          {...attr}
        /> {unit}
      </FormItem>
    );
  }

  /**
   * 渲染Input标签元素，显示输入字符限制
   * @param {object} eleObj 回显数据
   * @param {object} inputSuffix Input标签元素信息
   * @returns
   */
  renderInputSuffix = ( eleObj, inputSuffix ) => {
    const { key, require, label, maxLength, suffix } = inputSuffix;

    return (
      <FormItem
        label={<span className={styles.labelText}>{require && <span>*</span>}{label}</span>}
        {...FORM_LAYOUT}
      >
        <Input
          value={eleObj[key]}
          placeholder={`请输入${label}`}
          onChange={( e ) => this.changeInput( e, key )}
          maxLength={maxLength}
          suffix={suffix &&
            <span className={styles.inputSuffix}>
              {eleObj[key] && eleObj[key].length}/{maxLength}
            </span>
          }
        />
      </FormItem>
    );
  }

  // 渲染按钮图元素
  renderBtnImage = ( eleObj, btnImg ) => {
    const { key, require, label, tips } = btnImg;

    return (
      <FormItem
        label={<span className={styles.labelText}>{require && <span>*</span>}{label}</span>}
        {...FORM_LAYOUT}
      >
        <div style={{ display: 'flex' }}>
          <UploadModal
            value={eleObj[key]}
            onChange={( e ) => this.changeValue( e, key )}
          />
          <div
            style={{
              // width: '180px',
              marginTop: 10,
              marginLeft: 10,
              color: '#999',
              fontSize: 13,
              lineHeight: 2,
            }}
          >
            {tips.map( ( item ) => {
              const biUniKey = getUniqueKey();
              return <div key={`award_tip${biUniKey}`}>{item}</div>
            } )}
          </div>
        </div>
      </FormItem>
    );
  }

  // 渲染单选按钮
  renderRadioGroup = ( eleObj, radioGroup ) => {
    const { key, require, label, radioType } = radioGroup;
    const radioObj = radioType.find( it => it.value === eleObj[key] ) || radioType[0];

    return (
      <FormItem
        label={<span className={styles.labelText}>{require && <span>*</span>}{label}</span>}
        {...FORM_LAYOUT}
      >
        <Radio.Group
          onChange={( e ) => this.changeInput( e, key )}
          value={radioObj.valueMapping}
        >
          {radioType.map( item => {
            const radioUniKey = getUniqueKey();
            const { text, valueMapping } = item;
            return (
              <Radio key={`award_rg${radioUniKey}`} value={valueMapping}>{text}</Radio>
            )
          } )}
        </Radio.Group>
      </FormItem>
    );
  }

  renderDateType = () => {
    const { eleObj } = this.props;

    return (
      <FormItem
        label={<span className={styles.labelText}>{require && <span>*</span>}日期类型</span>}
        {...FORM_LAYOUT}
      >
        <Select
          value={eleObj.dateType}
          onChange={( e ) => this.changeValue( e, 'dateType' )}
          style={{ width: 200 }}
        >
          <Option value="GLOBAL">全局</Option>
          <Option value="DAILY">每日</Option>
        </Select>
      </FormItem>
    )
  }

  render() {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;

    return (
      <div>
        <div>
          {/* 组件名称 */}
          {this.renderInputSuffix( eleObj, INPUTSUFFIX.name )}
          <FormItem
            label={<span className={styles.labelText}>领奖有效时间</span>}
            {...FORM_LAYOUT}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={eleObj.startTime ? [
                moment( eleObj.startTime, 'YYYY-MM-DD HH:mm:ss' ),
                moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' )]
                : []}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={( e ) => this.changeDate( e )}
            />
          </FormItem>
          {/* 领取人次展示 */}
          {this.renderRadioGroup( eleObj, SINGLE_RADIO.showCount )}
          {/* 日期类型 */}
          {this.renderDateType()}
          {/* 虚拟领取人次 */}
          {eleObj.showCount && this.renderInputNumber( eleObj, STATISTIC.virtualCount )}
          {/* 领取人次字号 */}
          {eleObj.showCount && this.renderInputNumber( eleObj, ELE_STYLE.countSize )}
          {/* 领奖按钮 */}
          {this.renderBtnImage( eleObj, BTN_IMAGE.awardButton )}
          {/* 继续领奖按钮 */}
          {this.renderBtnImage( eleObj, BTN_IMAGE.oneMoreButton )}
          {/* 领奖完成按钮 */}
          {this.renderBtnImage( eleObj, BTN_IMAGE.finishButton )}
          <Row gutter={24}>
            <Col span={12}>
              {/* 按钮宽 */}
              {this.renderInputNumber( eleObj, ELE_STYLE.buttonWidth, BOTH_LAYOUT )}
            </Col>
            <Col span={12}>
              {/* 按钮高 */}
              {this.renderInputNumber( eleObj, ELE_STYLE.buttonHeight, BOTH_LAYOUT )}
            </Col>
          </Row>
          {/* 奖品包名称 */}
          {this.renderInputSuffix( eleObj, INPUTSUFFIX.prizeName )}
          {/* 奖品包图 */}
          {this.renderBtnImage( eleObj, BTN_IMAGE.prizeImg )}
          {/* 奖品配置 */}
          <div style={{ marginBottom:20 }}>
            <PrizeOptionSecondEdition
              domData={domData}
              changeDomData={changeDomData}
              eleObj={eleObj}
              noProbability
              disabledThanks
            />
          </div>
        </div>
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

export default AwardElement;

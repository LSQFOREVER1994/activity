/* eslint-disable react/no-array-index-key */
/*
 * @Autor: Chen
 * @Date: 2023-01-30 14:40:54
 * @LastEditors: ZHANG_QI
 * @LastEditTime: 2023-09-14 16:54:30
 * @Description: JSON数据渲染表单行
 */
/**
 * 若在原基础功能修改，请考虑影响范围！！！
 * 如有更改，请同步 BeesThirdEdition 下的readme文档！！！
 */
import React, { useContext, useState, } from 'react';
import {
  Input,
  InputNumber,
  Form,
  Row,
  Col,
  Slider,
  DatePicker,
  TimePicker,
  Radio,
  Select,
  Checkbox,
  Switch,
} from 'antd';
import _ from 'lodash';
import { SketchPicker } from 'react-color';
import moment from 'moment';
import PropTypes from 'prop-types';
import { ComponentsDataContext } from '../../provider';
import styles from './index.less';
import UploadModal from '@/components/UploadModal/UploadModal';
import { mathematicalCalculation } from '@/utils/utils';
import ColorsMap from '@/components/ColorsMap/ColorsMap';

const { multiply } = mathematicalCalculation;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
// const formLayout = {
//   labelCol: { span: 6 },
//   wrapperCol: { span: 14 },
// };
/**
 * @example JSON渲染表单行
 * @param {object} param {renderList:array}
 * @returns
 */
function RenderFormItem( { renderList = [] } ) {
  const [componentData, changeComponentData] = useContext( ComponentsDataContext );
  const [showSketchPicker, setShowSketchPicker] = useState( undefined );
  // 日期选择值
  const evalRangeValue = ( field, { format = 'YYYY-MM-DD HH:mm:ss' } ) => {
    return field.map( item => {
      let val = _.get( componentData, item, undefined );
      if ( format && val ) {
        val = moment( val, format );
      }
      return val;
    } );
  };
  // 日期选择值改变
  const evalRangeChange = ( date, { field, format = 'YYYY-MM-DD HH:mm:ss' } ) => {
    const startVal = date[0] ? date[0].format( format ) : '';
    const endVal = date[1] ? date[1].format( format ) : '';
    const value = [startVal, endVal];
    field.forEach( ( item, idx ) => {
      changeComponentData( value[idx], item );
    } );
  };

  /**
   * @example 条件渲染 | 禁用
   * @param {string|object|array|function} conditional
   * @returns
   */
  const evalConditionalRendering = conditional => {
    const dataType = Object.prototype.toString.call( conditional );
    let flag = false;
    let conditionalArr = [];
    switch ( dataType ) {
      case '[object String]': // 只需要值有时，传路径即可
        flag = _.get( componentData, conditional, false );
        break;
      case '[object Boolean]':
        flag = conditional;
        break;
      case '[object Object]':
        conditionalArr = [conditional];
        break;
      case '[object Array]':
        conditionalArr = conditional;
        break;
      case '[object Function]':
        flag = conditional( componentData );
        break;
      default:
        break;
    }
    if ( conditionalArr.length ) {
      flag = conditionalArr.every( item => {
        const val = _.get( componentData, item.path );
        return val === item.value;
      } );
    }
    return !!flag;
  };

  const renderWarningWord = ( unit, tips ) => {
    let word;
    if ( unit ) {
      if ( unit.$$typeof ) {
        word = unit;
        return word;
      }
      const { text, style = {} } = unit;
      word =
        text &&
        text.length &&
        text.map( ( item, index ) => {
          return (
            <span key={index} className={styles.unit} {...style}>
              {item}
            </span>
          );
        } );
    }
    if ( tips ) {
      if ( tips.$$typeof ) {
        word = tips;
        return word;
      }
      const { text, style = {} } = tips;
      word = (
        <div className={styles.tips} {...style}>
          {text &&
            text.length &&
            text.map( ( item, index ) => {
              return <p key={index}>{item}</p>;
            } )}
        </div>
      );
    }
    return word;
  };
  const renderElement = () => {
    return renderList.map( ( item, idx ) => {
      const {
        field,
        renderType,
        label,
        required,
        flex, // 组件配置是否单行展示
        radioList = [],
        optionList = [],
        propsData = {},
        tips = null,
        conditionalRendering,
        content,
        suffixContainerStyle = {},
        changeCallBack = () => {},
        disabled,
        annotation,
        unit,
        addonAfter,
        recoveryValue = null,
        wordsMax,
      } = item;
      const { multiple = 1, style, defaultValue, format } = propsData;
      let Element;
      let word;
      let disabledFlag = false;
      const value = _.get( componentData, field, defaultValue );
      // let $formLayout = item.formLayout || formLayout;
      // if ( renderType === 'UploadModal' && tips ) $formLayout = {};
      if ( unit || tips ) {
        word = renderWarningWord( unit, tips );
      }
      if ( conditionalRendering && !evalConditionalRendering( conditionalRendering ) ) return false;
      // 同条件渲染逻辑相同，复用逻辑
      if ( disabled ) disabledFlag = evalConditionalRendering( disabled );
      switch ( renderType ) {
        case 'custom': // 自定义
          return content;
        case 'Switch':
          Element = (
            <Switch
              {...propsData}
              disabled={disabledFlag}
              defaultChecked={!!value}
              checked={value}
              onChange={e => {
                changeCallBack( e, componentData, changeComponentData );
                changeComponentData( e, field );
              }}
            />
          );
          break;
        case 'Checkbox':
          Element = (
            <Checkbox.Group
              {...propsData}
              disabled={disabledFlag}
              value={value}
              options={optionList}
              defaultValue={value}
              onChange={e => {
                changeCallBack( e, componentData, changeComponentData );
                changeComponentData( e, field );
              }}
            />
          );
          break;
        case 'DatePicker':
          Element = (
            <DatePicker
              {...propsData}
              value={value ? moment( value, format ) : undefined}
              disabled={disabledFlag}
              onChange={e => {
                const val = e ? e.format( format ) : '';
                changeCallBack( val, componentData, changeComponentData );
                changeComponentData( val, field );
              }}
              getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
            />
          );
          break;
          case 'TimePicker':
            Element = (
              <TimePicker
                {...propsData}
                value={value ? moment( value, format ) : undefined}
                disabled={disabledFlag}
                onChange={e => {
                  const val = e ? e.format( format ) : '';
                  changeCallBack( val, componentData, changeComponentData );
                  changeComponentData( val, field );
                }}
                getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
              />
            );
            break;
        case 'TextArea':
          Element = (
            <TextArea
              {...propsData}
              value={value}
              disabled={disabledFlag}
              onChange={e => {
                changeComponentData( e, field );
              }}
            />
          );
          break;
        case 'Select':
          Element = (
            <Select
              {...propsData}
              value={value || undefined}
              disabled={disabledFlag}
              onChange={e => {
                changeCallBack( e, componentData, changeComponentData );
                changeComponentData( e, field );
              }}
              getPopupContainer={triggerNode => triggerNode.parentElement || document.body}
            >
              {optionList.map( optionItem => (
                <Option key={optionItem.value} value={optionItem.value}>
                  {optionItem.label}
                </Option>
              ) )}
            </Select>
          );
          break;
        case 'Radio':
          Element = (
            <Radio.Group
              {...propsData}
              value={value}
              disabled={disabledFlag}
              onChange={e => {
                changeCallBack( e, componentData, changeComponentData );
                changeComponentData( e, field );
              }}
            >
              {radioList.map( radioItem => (
                <Radio disabled={radioItem.disabled} key={radioItem.value} value={radioItem.value}>
                  {radioItem.label}
                </Radio>
              ) )}
            </Radio.Group>
          );
          break;
        case 'RangePicker':
          Element = (
            <RangePicker
              {...propsData}
              value={evalRangeValue( field, propsData )}
              disabled={disabledFlag}
              onChange={e => {
                changeCallBack( e, componentData, changeComponentData );
                evalRangeChange( e, { field, format } );
              }}
              getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
            />
          );
          break;
        case 'InputNumber':
          Element = (
            <InputNumber
              {...propsData}
              style={style || { width: '100%' }}
              value={value}
              disabled={disabledFlag}
              onChange={e => {
                changeCallBack( e ?? recoveryValue, componentData, changeComponentData );
                changeComponentData( e ?? recoveryValue, field );
              }}
            />
          );
          break;
        case 'SketchPicker':
          Element = (
            <>
              <div
                className={styles.renderFormItemPreviewColor}
                onClick={() => {
                  setShowSketchPicker( showSketchPicker === idx ? undefined : idx );
                }}
              >
                <span style={{ backgroundColor: value }} />
              </div>
              {showSketchPicker === idx && (
                <>
                  <div
                    onClick={() => {
                      setShowSketchPicker( undefined );
                    }}
                    className={styles.sketchPickerMask}
                  />
                  <div style={{ position: 'relative', zIndex: 999, width: '200px', ...style }}>
                    <SketchPicker
                      width={style?.width ? 'auto' : '200px'}
                      color={value || undefined}
                      onChange={e => {
                        const { r, g, b, a } = e.rgb;
                        changeComponentData( `rgba(${r},${g},${b},${a})`, field )
                        changeCallBack( e?.rgb, componentData, changeComponentData );
                      }}
                    />
                  </div>
                </>
              )}
            </>
          );
          break;
        case 'SliderAndInputNumber':
          Element = (
            <Row>
              <Col span={12}>
                <Slider
                  {...propsData}
                  value={multiply( value, multiple, 2 )}
                  disabled={disabledFlag}
                  onChange={e => {
                    changeCallBack( e / multiple, componentData, changeComponentData );
                    changeComponentData( e / multiple, field );
                  }}
                />
              </Col>
              <Col span={12}>
                <InputNumber
                  {...propsData}
                  value={multiply( value, multiple, 2 )}
                  disabled={disabledFlag}
                  onChange={e => {
                    changeCallBack( e / multiple, componentData, changeComponentData );
                    changeComponentData( e / multiple, field );
                  }}
                  style={{ marginLeft: '10px' }}
                />
              </Col>
            </Row>
          );
          break;
        case 'UploadModal':
          Element = (
            <UploadModal
              {...propsData}
              value={value}
              disabled={disabledFlag}
              onChange={e => {
                changeComponentData( e, field );
                changeCallBack( e, componentData, changeComponentData );
              }}
            />
          );
          break;
        case 'ColorsMap':
          Element = (
            <ColorsMap
              {...propsData}
              value={value || defaultValue}
              disabled={disabledFlag}
              onChange={e => {
                changeComponentData( e, field );
                changeCallBack( e, componentData, changeComponentData );
              }}
            />
          );
          break;
        default:
          Element = (
            <Input
              {...propsData}
              addonAfter={addonAfter}
              value={value}
              maxLength={wordsMax}
              disabled={disabledFlag}
              onChange={e => {
                changeComponentData( e, field );
              }}
            />
          );
          break;
      }

      let itemStyle = {}
      if ( flex ) {
        itemStyle = { display: 'flex' }
      }
      if ( !required ) {
        itemStyle = { ...itemStyle, marginLeft: '10px' }
      }

      return (
        <Form.Item
          key={item.field}
          label={label}
          required={required}
          style={itemStyle}
        // {...$formLayout}
        >
          <div
            className={styles.renderElementBox}
            style={{
              display: tips || unit ? 'flex' : 'block',
              alignItems: 'center',
              marginLeft: required ? '10px' : '0',
              ...suffixContainerStyle,
            }}
          >
            {Element}
            {word}
          </div>
          {annotation}
        </Form.Item>
      );
    } );
  };
  return renderElement();
}
RenderFormItem.propTypes = {
  renderList: PropTypes.array.isRequired,
};
export default RenderFormItem;

import React from 'react';
import RenderFormItem from '../RenderFormItem';
import SimulationContent from './SimulationContent'


function Marquee( props ) {
  const { componentsData:{ productType } } = props;
  const renderList = [
    {
      renderType: 'Select',
      label: '数据源',
      field: 'dataType',
      flex:true,
      required: true,
      optionList: [
        {
          label: '无',
          value: 'NONE',
        },
        {
          label: '中奖记录',
          value: 'REWARD',
        },
        {
          label:'用户购买记录',
          value:'USER_BUY_HISTORY'
        }
      ],
      propsData: {
        style:{
          width: 200
        }
      },
    },
    {
      renderType: 'Select',
      label: '商品类型',
      field: 'productType',
      flex:true,
      conditionalRendering: { path: 'dataType', value: 'USER_BUY_HISTORY' },
      required: true,
      optionList: [
        {
          label: '智能投顾',
          value: 'SMART_INVESTMENT',
        },
        {
          label: '投顾',
          value: 'INVESTMENT',
        },
        {
          label:'理财',
          value:'FINANCE'
        }
      ],
      propsData: {
        placeholder: '请输入选择商品类型',
        style:{
          width: 200
        }
      },
    },
    {
      renderType: 'Input',
      field: 'productId',
      label: `产品${ productType === 'FINANCE' ? '类别' : 'ID' }`,
      conditionalRendering: { path: 'dataType', value: 'USER_BUY_HISTORY' },
      required: false,
      formLayout: {},
      propsData: {
        placeholder: '请输入产品ID',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'goodsId',
      label: `${ productType === 'FINANCE' ? '产品代码' : '商品ID' }`,
      conditionalRendering: { path: 'dataType', value: 'USER_BUY_HISTORY' },
      required: false,
      formLayout: {},
      propsData: {
        placeholder: '请输入商品ID',
        maxLength: 200,
      },
    },
    {
      renderType: 'InputNumber',
      label: '展示数据条数',
      field: 'showCount',
      flex:true,
      required: false,
      recoveryValue:10,
      unit:{
        text:['条']
      },
      propsData: {
        min: 0,
        placeholder:'请输入展示数据条数',
      },
    },
    {
      renderType: 'Radio',
      label: '滚动类型',
      field: 'direction',
      flex:true,
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
      radioList: [
        {
          label: '横向',
          value: 'HORIZONTAL',
        },
        {
          label: '纵向',
          value: 'VERTICAL',
        },
      ],
    },
    {
      renderType: 'SliderAndInputNumber',
      field: 'speed',
      label: '滚动速率',
      flex: true,
      propsData: {
        min: 0.1,
        max: 10.0,
        step: 0.01,
        defaultValue: 1
      }
    },
    {
      renderType: 'SketchPicker',
      field: 'style.textColor',
      label: '文字颜色',
      flex: true,
    },
    {
      renderType:'InputNumber',
      field: 'fontSize',
      label: '字号',
      flex: true,
    }
  ];
  return (
    <>
      <RenderFormItem renderList={renderList} />
      <SimulationContent {...props} />
    </>
  );
}

export const HIDE_TEXT_COLOR = true;
export const SET_JUMP = true;
export default Marquee;

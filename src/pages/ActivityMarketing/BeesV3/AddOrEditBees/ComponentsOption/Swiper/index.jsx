import React from 'react';
import RenderFormItem from '../RenderFormItem';
import ImgList from './ImgList';

function Swiper( { componentsData, changeValue, functionConfig } ) {
  const { bannerType } = componentsData;
  const renderList = [
    {
      renderType: 'Radio',
      label: '轮播类型',
      field: 'bannerType',
      flex: true,
      required: true,
      radioList: [
        {
          label: '单图',
          value: 'SINGLE',
        },
        {
          label: '多图',
          value: 'MULTI',
        },
      ],
      propsData: {
        defaultValue: 'SINGLE',
      },
      changeCallBack: ( e ) => {
        if ( e.target.value === 'MULTI' ) {
          changeValue( 'NONE', 'pagination' )
          changeValue( true, 'autoplay' )
          changeValue( 1, 'delay' )
        }
        else {
          changeValue( 'BULLETS', 'pagination' )
          changeValue( true, 'autoplay' )
          changeValue( 1, 'delay' )
        }
      },
    },
    {
      renderType: 'Radio',
      label: '滑动方向',
      field: 'direction',
      flex: true,
      required: true,
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
      conditionalRendering: { path: 'bannerType', value: 'SINGLE' },
    },
    {
      renderType: 'InputNumber',
      label: '图片间距',
      field: 'spaceBetween',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        placeholder: '请输入图片间隔',
        min: 0,
      },
    },
    {
      renderType: 'Radio',
      label: '切换效果',
      field: 'effect',
      required: true,
      formLayout: {},
      radioList: [
        {
          label: '位移',
          value: 'SLIDE',
        },
        {
          label: '淡入',
          value: 'FADE',
        },
        {
          label: '方块',
          value: 'CUBE',
        },
        {
          label: '3D翻转',
          value: 'FLIP',
        },
      ],
      conditionalRendering: { path: 'bannerType', value: 'SINGLE' },
    },
    {
      renderType: 'Radio',
      label: '分页器样式',
      field: 'pagination',
      flex: true,
      required: true,
      radioList: [
        {
          label: '圆点',
          value: 'BULLETS',
        },
        {
          label: '页码',
          value: 'FRACTION',
        },
        {
          label: '无',
          value: 'NONE'
        }
      ],
      conditionalRendering: { path: 'bannerType', value: 'SINGLE' },
    },
    {
      renderType: 'SketchPicker',
      field: 'defaultColor',
      label: '分页器默认颜色',
      conditionalRendering: { path: 'pagination', value: 'BULLETS' },
      flex: true,
    },
    {
      renderType: 'SketchPicker',
      field: 'activeColor',
      label: '分页器选中颜色',
      conditionalRendering: { path: 'pagination', value: 'BULLETS' },
      flex: true,
    },
    {
      renderType: 'Radio',
      label: `自动${bannerType === 'SINGLE' ? '切换' : '滚动'}`,
      flex: true,
      field: 'autoplay',
      required: true,
      radioList: [
        {
          label: '开启',
          value: true,
        },
        {
          label: '关闭',
          value: false,
        },
      ],
    },
    {
      renderType: 'SliderAndInputNumber',
      field: 'delay',
      label: `${bannerType === 'SINGLE' ? '切换' : '滚动'}速率`,
      flex: true,
      propsData: {
        min: 0.1,
        max: 10.0,
        step: 0.01,
        defaultValue: 1
      },
      conditionalRendering: { path: 'autoplay', value: true },
    },
    {
      renderType: 'Radio',
      label: '循环播放',
      flex: true,
      field: 'loop',
      required: false,
      radioList: [
        {
          label: '开启',
          value: true,
        },
        {
          label: '关闭',
          value: false,
        },
      ],
      conditionalRendering: { path: 'bannerType', value: 'SINGLE' },
    },
  ];

  return (
    <>
      <RenderFormItem renderList={renderList} />
      <ImgList changeValue={changeValue} componentsData={componentsData} functionConfig={functionConfig} />
    </>
  );
}

export const HIDE_TEXT_COLOR = true;
export default Swiper;

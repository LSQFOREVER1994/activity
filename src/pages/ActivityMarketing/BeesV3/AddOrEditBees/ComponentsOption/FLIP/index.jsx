/*
 * @Author       : ZQ
 * @Date         : 2023-11-27 11:46:43
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-12-11 14:16:41
 */
import React from 'react';
import RenderFormItem from '../RenderFormItem';
import PrizeOption from '@/components/PrizeOption';
import drawConsumeTypeLabel from '@/components/CommonText'

function GridWheel( props ) {
  const { componentsData, changeValue } = props;
  const { drawConsumeType, number } = componentsData;

  const renderList = [
    {
      renderType: 'DatePicker',
      label: '开始时间',
      field: 'startTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      renderType: 'DatePicker',
      label: '结束时间',
      field: 'endTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      renderType: 'Radio',
      label: drawConsumeTypeLabel,
      field: 'drawConsumeType',
      required: true,
      changeCallBack: e => {
        changeValue( null, 'drawConsumeValue' );
        const val = e?.target ? e.target.value : e;
        if ( val !== 'INTEGRAL' ) {
          changeValue( '活动次数已达上限，下次再来吧', 'hasNoChangeTip' );
          changeValue( '快去完成任务，获得抽奖机会吧', 'hasChangeTip' );
        } else {
          changeValue( '您的积分不足，下次再来吧', 'hasNoChangeTip' );
          changeValue( '快去完成任务，获得更多积分吧', 'hasChangeTip' );
        }
      },
      propsData: {
        defaultValue: 'LEFT_COUNT',
      },
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
      radioList: [
        {
          label: '通用次数',
          value: 'LEFT_COUNT',
        },
        {
          label: '组件次数',
          value: 'ELEMENT_LEFT_COUNT',
        },
        {
          label: '积分',
          value: 'INTEGRAL',
        },
      ],
    },
    {
      renderType: 'Radio',
      label: `参与${drawConsumeType === 'INTEGRAL' ? '积分' : '次数'}展示`,
      field: 'showRemainingValue',
      flex: true,
      required: true,
      propsData: {
        defaultValue: true,
      },
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
      radioList: [
        {
          label: '展示',
          value: true,
        },
        {
          label: '不展示',
          value: false,
        },
      ],
    },
    {
      renderType: 'InputNumber',
      label: `单次抽奖所需积分(单位：分/次)`,
      field: 'drawConsumeValue',
      required: true,
      conditionalRendering: compData => {
        return compData.drawConsumeType === 'INTEGRAL';
      },
      propsData: {
        placeholder: '最小值1',
        min: 1,
        precision: 0,
        parser: text => Number( text.replace( /[^0-9]/g, '' ) ),
      },
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
    },
    {
      renderType: 'Select',
      field: 'number',
      label: '翻牌牌数',
      required: true,
      flex: true,
      propsData: {
        style: {
          width: 200
        },
        defaultValue: '9'
      },
      optionList: [
        {
          label: '3张',
          value: '3',
        },
        {
          label: '6张',
          value: '6',
        },
        {
          label: '9张',
          value: '9',
        },
      ],
      changeCallBack: ( e, componentsDataFunc, changeComponentData ) => {
        const scaleValue = ( componentsDataFunc.style.width * 2 ) / componentsDataFunc.style.previewWidth
        const heightObj = {
          '3': 248,
          '6': 394,
          '9': 540,
        }
        const currentHeight = heightObj[e] * scaleValue
        changeComponentData( currentHeight, 'style.height' )
      },
    },
    {
      renderType: 'SketchPicker',
      field: 'style.textColor',
      label: '文字颜色',
      flex: true,
    },
    {
      renderType: 'UploadModal',
      label: '开始翻牌按钮图',
      field: 'startFlipButton',
      required: true,
      formLayout: {},
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      field: 'pleaseFlipButton',
      required: true,
      renderType: 'UploadModal',
      label: '请翻牌按钮图',
      formLayout: {},
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      field: 'cardBehind',
      required: true,
      renderType: 'UploadModal',
      label: '卡牌背面图',
      formLayout: {},
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      field: 'cardFront',
      renderType: 'UploadModal',
      required: true,
      label: '卡牌正面背景图',
      formLayout: {},
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'Input',
      label: '无抽奖机会且任务全部完成详情文案',
      field: 'hasNoChangeTip',
      required: true,
      formLayout: {},
      propsData: {
        placeholder: '请输入弹窗文案',
      },
    },
    {
      renderType: 'Input',
      label: '无抽奖机会且任务未全部完成详情文案',
      field: 'hasChangeTip',
      required: true,
      formLayout: {},
      propsData: {
        placeholder: '请输入弹窗文案',
      },
    },
  ];

  return (
    <>
      <RenderFormItem renderList={renderList} />
      <PrizeOption
        {...props}
        tableWithPosition
        noMore
        maxPrizeNum={Number( number )}
        descriptionText=" *此组件必须配置8个奖品。 第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。 每一列抽奖概率总和需为100%。"
      />
    </>
  );
}

export const HIDE_TEXT_COLOR = true;
export default GridWheel;

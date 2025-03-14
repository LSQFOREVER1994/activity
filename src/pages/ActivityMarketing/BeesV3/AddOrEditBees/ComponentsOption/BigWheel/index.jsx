/* eslint-disable consistent-return */
import React from 'react';
import RenderFormItem from '../RenderFormItem';
import PrizeOption from '@/components/PrizeOption'
import drawConsumeTypeLabel from '@/components/CommonText'

function BigWheel( props ) {
  const { componentsData, changeValue } = props;
  const { drawConsumeType } = componentsData;

  const colorsTip = {
    pannelColor1: "转盘盘面颜色1",
    pannelColor2: "转盘盘面颜色2",
    pennelDivideColor: "转盘分界线颜色",
    prizeTextColor: "奖品文字颜色",
    textColor: `${drawConsumeType === "INTEGRAL" ? "积分文字颜色" : "次数文字颜色"}`
  }

  const defaultColors = {
    pannelColor1: 'rgba(255, 245, 211, 1)',
    pannelColor2: 'rgba(255, 255, 253, 1)',
    pennelDivideColor: 'rgba(255, 146, 102, 1)',
    prizeTextColor: 'rgba(255, 97, 58, 1)',
    textColor: 'rgba(83,83,83,1)',
  }

  const colorsKey = [
    "pannelColor1",
    "pannelColor2",
    "pennelDivideColor",
    "prizeTextColor",
    "textColor",
  ]

  const renderList = [
    {
      renderType: 'DatePicker',
      label: '大转盘开始时间',
      field: 'startTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
    {
      renderType: 'DatePicker',
      label: '大转盘结束时间',
      field: 'endTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
    {
      renderType: 'ColorsMap',
      label: '颜色',
      field: 'colors',
      formLayout: {},
      propsData: {
        colorsTip,
        colorsKey,
        defaultValue: defaultColors
      },
    },
    {
      renderType: 'Radio',
      label: drawConsumeTypeLabel,
      field: 'drawConsumeType',
      required: true,
      changeCallBack: ( e ) => {
        changeValue( null, 'drawConsumeValue' )
        const val = e?.target ? e.target.value : e;
        if ( val !== 'INTEGRAL' ) {
          changeValue( '活动次数已达上限，下次再来吧', 'hasNoChangeTip' )
          changeValue( '快去完成任务，获得抽奖机会吧', 'hasChangeTip' )
        } else {
          changeValue( '您的积分不足，下次再来吧', 'hasNoChangeTip' )
          changeValue( '快去完成任务，获得更多积分吧', 'hasChangeTip' )
        }
      },
      propsData: {
        defaultValue: 'LEFT_COUNT'
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
      renderType: 'InputNumber',
      label: `单次抽奖所需积分(单位：分/次)`,
      field: 'drawConsumeValue',
      required: true,
      conditionalRendering: { path: 'drawConsumeType', value: 'INTEGRAL' },
      propsData: {
        placeholder: "最小值1",
        min: 1,
        precision: 0,
        parser: text => Number( text.replace( /[^0-9]/g, '' ) )
      },
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
    },
    {
      renderType: 'Radio',
      label: `参与${drawConsumeType === 'INTEGRAL' ? '积分' : '次数'}展示`,
      field: 'showRemainingValue',
      required: true,
      flex: true,
      propsData: {
        defaultValue: true
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
    // {
    //   renderType: 'InputNumber',
    //   label: '活动虚拟参与人数',
    //   field: 'baseAttendUser',
    //   flex:true,
    //   required: false,
    //   formLayout: {},
    //   propsData: {
    //     style:{
    //       width: 190
    //     },
    //     placeholder: '请输入活动虚拟参与人数',
    //     min: 0,
    //   },
    // },
    {
      renderType: 'UploadModal',
      field: 'borderImg',
      label: '转盘外框图',
      required: true,
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'drawButton',
      label: '抽奖按钮图',
      required: true,
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'Input',
      field: 'hasNoChangeTip',
      label: '无抽奖机会且任务全部完成详情文案',
      required: true,
      formLayout: {},
      propsData: {
        placeholder: '请输入弹窗文案',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'hasChangeTip',
      label: '无抽奖机会且任务未全部完成详情文案',
      required: true,
      formLayout: {},
      propsData: {
        placeholder: '请输入弹窗文案',
        maxLength: 200,
      },
    },
  ];

  return (
    <>
      <RenderFormItem renderList={renderList} />
      <PrizeOption
        {...props}
        tableWithPosition
        maxPrizeNum={6}
        descriptionText=" *此组件必须配置6个奖品。 第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。 每一列抽奖概率总和需为100%。"
      />
    </>
  );
}

export const HIDE_TEXT_COLOR = true;
export default BigWheel;

import React from 'react';
import RenderFormItem from '../RenderFormItem';
import PrizeTable from '@/components/PrizeOption'
import drawConsumeTypeLabel from '@/components/CommonText'

function BlindBox( props ) {
  const { componentsData, changeValue } = props;
  const { drawConsumeType } = componentsData;

  const renderList = [
    {
      renderType: 'DatePicker',
      label: '盲盒开始时间',
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
      label: '盲盒结束时间',
      flex: true,
      field: 'endTime',
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
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
      flex: true,
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
      flex: true,
      required: true,
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
    {
      renderType: 'Radio',
      label: '展示方式',
      field: 'showLeftCountType',
      flex: true,
      radioList: [
        {
          label: '文字',
          value: 'TEXT',
        },
        {
          label: '角标',
          value: 'CORNER_MARK',
        }
      ]
    },
    {
      renderType: 'UploadModal',
      field: 'boxBefore',
      label: '开启前盲盒样式图',
      required: false,
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'boxAfter',
      label: '开启后盲盒样式图',
      required: false,
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'buttonBefore',
      label: '开启按钮点亮图',
      required: true,
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'buttonAfter',
      label: '开启按钮置灰图',
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
  ]

  return (
    <>
      <RenderFormItem renderList={renderList} />
      <PrizeTable {...props} />
      <RenderFormItem renderList={[{
        renderType: 'SketchPicker',
        field: 'style.textColor',
        label: '文字颜色',
        flex: true,
      }]}
      />
    </>
  );
}

export const HIDE_TEXT_COLOR = true;
export default BlindBox;

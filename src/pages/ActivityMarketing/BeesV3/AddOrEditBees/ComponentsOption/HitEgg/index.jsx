import React from 'react';
import RenderFormItem from '../RenderFormItem';
import PrizeTable from '@/components/PrizeOption'
import drawConsumeTypeLabel from '@/components/CommonText'


const Index = ( props ) => {
  const { componentsData, changeValue } = props;
  const { drawConsumeType } = componentsData


  const renderList = [
    {
      renderType: 'Radio',
      label: drawConsumeTypeLabel,
      field: 'drawConsumeType',
      required: true,
      changeCallBack: ( e ) => {
        changeValue( null, 'drawConsumeValue' )
        const val = e?.target ? e.target.value : e;
        if ( val !== 'INTEGRAL' ) {
          changeValue( '快去完成下方任务，获得抽奖机会', 'hasNoChangeTip' )
          changeValue( '答题次数已达上限，明天再来吧', 'hasChangeTip' )
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
      conditionalRendering: ( compData ) => {
        return compData.drawConsumeType === 'INTEGRAL'
      },
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
    {
      renderType: 'ColorsMap',
      label: '颜色',
      field: 'colors',
      flex: true,
      formLayout: {},
      propsData: {
        colorsTip: { textColor: '次数/积分文字颜色' },
        defaultValue: { textColor: 'rgba(84,84,84,1)', }
      },
    },
    {
      renderType: 'Radio',
      label: '金蛋展示',
      field: 'showType',
      required: true,
      flex: true,
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
      radioList: [
        {
          label: '横向展示',
          value: 'cross',
        },
        {
          label: '锥形展示',
          value: 'cone',
        }
      ]
    },
    {
      renderType: 'UploadModal',
      label: '静态蛋图',
      field: 'eggsImages[0]',
      required: true,
      tips: {
        text: ['图片尺寸建议140px * 180px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      label: '',
      field: 'eggsImages[1]',
      required: true,
      tips: {
        text: ['图片尺寸建议140px * 180px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      label: '',
      field: 'eggsImages[2]',
      required: true,
      tips: {
        text: ['图片尺寸建议140px * 180px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      label: '锤子图',
      field: 'hammerImages',
      required: true,
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      label: '砸蛋效果图',
      field: 'hitImages[0]',
      tips: {
        text: ['图片宽度建议750px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      label: '',
      field: 'hitImages[1]',
      tips: {
        text: ['图片宽度建议750px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      label: '',
      field: 'hitImages[2]',
      tips: {
        text: ['图片宽度建议750px', '图片大小建议不大于1M'],
      },
    },
    // {
    //   renderType: 'UploadModal',
    //   label: '点击按钮图',
    //   field: 'clickImage',
    //   required: true,
    //   tips: {
    //     text:['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
    //   },
    // },
    {
      renderType: 'UploadModal',
      label: '底部托盘图',
      field: 'bottomImage',
      required: true,
      tips: {
        text: ['图片尺寸建议180px * 52px', '图片大小建议不大于1M'],
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
    }
  ]
  return (
    <>
      <RenderFormItem renderList={renderList} />
      <PrizeTable {...props} />
    </>
  );
}

export const HIDE_TEXT_COLOR = true;
export default Index;

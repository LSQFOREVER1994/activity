import React from 'react';
import { Tooltip, Icon } from 'antd';
import RenderFormItem from '../RenderFormItem';
import PrizeSetting from './prizeSetting';
import TopicSetting from './topicSetting';
import drawConsumeTypeLabel from '@/components/CommonText'

function index( props ) {
  const { componentsData, changeValue } = props;
  const { drawConsumeType  } = componentsData


  const renderList = [
    {
      renderType: 'DatePicker',
      field: 'startTime',
      label: '答题开始时间',
      required: false,
      flex:true,
      propsData: {
        placeholder: '请选择开始时间',
        format: 'YYYY-MM-DD',
      },
    },
    {
      renderType: 'DatePicker',
      field: 'endTime',
      label: '答题结束时间',
      required: false,
      flex:true,
      propsData: {
        placeholder: '请选择结束时间',
        format: 'YYYY-MM-DD',
      },
    },
    {
      renderType: 'InputNumber',
      field: 'answerTime',
      label: '每次答题时间（秒）',
      flex:true,
      propsData: {
        placeholder: '请输入每次答题时间',
        min: 0,
      },
    },
    {
      renderType: 'Radio',
      label: drawConsumeTypeLabel,
      field: 'drawConsumeType',
      required: true,
      changeCallBack: ( e ) => {
        changeValue( null, 'drawConsumeValue', )
        const val = e?.target ? e.target.value : e;
        if( val !== 'INTEGRAL' ){
          changeValue( '答题次数已达上限，明天再来吧', 'hasNoChangeTip' )
          changeValue( '快去完成下方任务，获得抽奖机会', 'hasChangeTip' )
        }else{
          changeValue( '您的积分不足，下次再来吧', 'hasNoChangeTip' )
          changeValue( '快去完成任务，获得更多积分吧', 'hasChangeTip' )
        }
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
      conditionalRendering:( compData ) => ( compData.drawConsumeType === 'INTEGRAL' ),
      propsData:{
        placeholder:"最小值1",
        min:1,
        precision:0,
        parser:text=>Number( text.replace( /[^0-9]/g, '' ) )
      },
    },
    {
      renderType: 'Switch',
      field: 'showRemainingValue',
      label: `参与${drawConsumeType === 'INTEGRAL' ? '积分' : '次数'}展示`,
      flex:true,
      required: false,
      propsData:{
        defaultValue:true
      },
    },
    {
      renderType: 'UploadModal',
      field: 'startButton',
      label: '开始答题按钮图',
      required: true,
      tips: {
        text: ['图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'banner',
      label: '答题页/结果页banner图',
      required: false,
      tips: {
        text: ['图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'SketchPicker',
      field: 'resultBackground',
      flex:true,
      label: (
        <span>
          <span>答题页/结果页背景色 </span>
          <Tooltip
            title={
              <span>
                设置答题/结果页面背景色，填充页面除Banner、题目外的背景区域；题目区域为白色，建议设置深色色值
              </span>
            }
          >
            <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
          </Tooltip>
        </span>
      ),
    },
    {
      renderType: 'SketchPicker',
      field: 'buttonColor',
      flex:true,
      label: (
        <span>
          <span>答题页/结果页按钮色 </span>
          <Tooltip
            title={
              <span>
                设置确定、上一题、下一题、提交、结果页按钮色值，文字固定白色，建议设置深色色值
              </span>
            }
          >
            <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
          </Tooltip>
        </span>
      ),
    },
    {
      renderType: 'Input',
      field: 'hasNoChangeTip',
      label: '无答题机会且任务全部完成详情文案',
      required: false,
      formLayout: {},
      propsData: {
        placeholder: '请输入弹窗文案',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'hasChangeTip',
      label: '无答题机会且任务未全部完成详情文案',
      required: false,
      formLayout: {},
      propsData: {
        placeholder: '请输入弹窗文案',
        maxLength: 200,
      },
    },
    {
      renderType: 'InputNumber',
      field: 'passAnswerNumber',
      flex:true,
      label: (
        <span>
          <span>达标题数 </span>
          <Tooltip
            title={
              <span>
                需达对N题及以上才有资格获得答题奖励，否则不发放任何奖励。配置为0时，表示不需要达标门槛。
              </span>
            }
          >
            <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
          </Tooltip>
        </span>
      ),
      required: true,
      propsData: {
        placeholder: '请输入达标题数',
        min: 0,
      },
    },
    {
      renderType: 'Input',
      field: 'passContext',
      label: '达标文案',
      required: false,
      propsData: {
        placeholder: '请输入达标文案',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'unPassContext',
      label: '未达标文案',
      required: false,
      propsData: {
        placeholder: '请输入未达标文案',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'jumpButtonContext',
      label: '达标跳转按钮文案',
      required: false,
      propsData: {
        placeholder: '请输入达标跳转按钮文案',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'jumpLink',
      label: '达标跳转链接',
      required: false,
      propsData: {
        placeholder: '请输入达标跳转链接',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'unPassJumpContext',
      label: '未达标跳转按钮文案',
      required: false,
      propsData: {
        placeholder: '请输入未达标跳转按钮文案',
        maxLength: 200,
      },
    },
    {
      renderType: 'Input',
      field: 'unPassJumpLink',
      label: '未达标跳转链接',
      required: false,
      propsData: {
        placeholder: '请输入未达标跳转链接',
        maxLength: 200,
      },
    },
  ];

  return (
    <>
      <RenderFormItem renderList={renderList} />
      <PrizeSetting {...props} />
      <TopicSetting {...props} />
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
export default index;

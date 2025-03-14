import React from 'react';
import RenderFormItem from '../RenderFormItem';
import RenderGuessList from './guessOption';
import IntegralOption from './integralOption';


const renderList1 = [
  {
    renderType: 'UploadModal',
    field: 'riseButtonImage',
    label: '看涨按钮图',
    required: true,
    tips: {
      text:['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
    },
  },
  {
    renderType: 'UploadModal',
    field: 'fallButtonImage',
    label: '看跌按钮图',
    required: true,
    tips: {
      text:['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
    },
  },
];

const renderList2 = [
    {
        renderType: 'Radio',
        label: '竞猜倒计时',
        flex:true,
        field: 'countDownOpen',
        required: true,
        formLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 14 },
        },
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
]

function Guess( props ) {
  return (
    <>
      <RenderFormItem renderList={renderList1} />
      <RenderGuessList {...props} />
      <RenderFormItem renderList={renderList2} />
      <IntegralOption {...props} />
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
export default Guess;

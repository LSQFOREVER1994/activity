import React from 'react';
import RenderFormItem from '../RenderFormItem';
import PrizeTable from '@/components/PrizeOption'


const renderList = [
  {
    renderType: 'RangePicker',
    label: '盲盒有效时间',
    field: ['startTime', 'endTime'],
    required: true,
    formLayout: {},
    propsData: {
      showTime: true,
      style: { width: '100%' },
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    renderType: 'Radio',
    label: '盲盒数量',
    field: 'boxNumber',
    flex:true,
    required: true,
    radioList: [
      {
        label: '6个',
        value: 6,
      },
      {
        label: '4个',
        value: 4,
      },
    ],
  },
  {
    renderType: 'UploadModal',
    field: 'boxBefore',
    label: '盲盒样式图',
    required: true,
    tips: {
      text:['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
    },
  },
  {
    renderType: 'UploadModal',
    field: 'boxAfter',
    label: '盲盒开启图',
    required: true,
    tips: {
      text:['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
    },
  },
]

const BlindBox2 = ( props ) => {
    return (
      <>
        <RenderFormItem renderList={renderList} />
        <PrizeTable {...props}  />
      </>
    );
}

export default BlindBox2;

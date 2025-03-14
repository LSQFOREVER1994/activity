import React from 'react';
import RenderFormItem from '../RenderFormItem';

const formLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
};
const renderList = [
  {
    renderType: 'UploadModal',
    field: 'url',
    label: '视频',
    required: true,
    formLayout:{},
    propsData: {
      mediaType: 'VIDEO',
    },
  },
  {
    renderType: 'UploadModal',
    field: 'cover',
    formLayout:{},
    label: '封面图',
    flex:true,
  },
  // {
  //   renderType: 'Radio',
  //   label: '是否开启弹幕功能',
  //   flex:true,
  //   field: 'enable',
  //   required: true,
  //   formLayout,
  //   radioList: [
  //     {
  //       label: '是',
  //       value: true,
  //     },
  //     {
  //       label: '否',
  //       value: false,
  //     },
  //   ],
  // },
  // {
  //   renderType: 'Radio',
  //   label: '是否展示播放量',
  //   field: 'isShowView',
  //   flex:true,
  //   required: true,
  //   formLayout,
  //   radioList: [
  //     {
  //       label: '是',
  //       value: true,
  //     },
  //     {
  //       label: '否',
  //       value: false,
  //     },
  //   ],
  // },
  // {
  //   renderType: 'InputNumber',
  //   field: 'virtualView',
  //   label: '虚拟播放量',
  //   conditionalRendering: 'isShowView',
  //   flex:true,
  //   propsData: {
  //     style:{
  //       width:210
  //     },
  //     placeholder: '请输入虚拟播放量',
  //     min: 0,
  //   },
  // },
  // {
  //   renderType: 'Radio',
  //   label: '是否展示点赞量',
  //   field: 'isShowLike',
  //   required: true,
  //   flex:true,
  //   formLayout,
  //   radioList: [
  //     {
  //       label: '是',
  //       value: true,
  //     },
  //     {
  //       label: '否',
  //       value: false,
  //     },
  //   ],
  // },
  // {
  //   renderType: 'InputNumber',
  //   field: 'virtualLike',
  //   label: '虚拟点赞量',
  //   flex:true,
  //   conditionalRendering: 'isShowLike',
  //   propsData: {
  //     placeholder: '请输入虚拟点赞量',
  //     min: 0,
  //   },
  // },
];
function Video() {
  return <RenderFormItem renderList={renderList} />;
}

export const HIDE_TEXT_COLOR = true;
export default Video;

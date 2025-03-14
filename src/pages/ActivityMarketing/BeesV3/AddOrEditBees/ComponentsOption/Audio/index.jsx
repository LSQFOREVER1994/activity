import React from 'react';
import RenderFormItem from '../RenderFormItem';

const renderList = [
  {
    renderType: 'UploadModal',
    field: 'url',
    label: '音频',
    flex: true,
    required: true,
    formLayout: {},
    propsData: {
      mediaType: 'AUDIO',
    },
  },
  {
    renderType: 'Radio',
    label: '组件样式',
    field: 'showType',
    required: true,
    formLayout: {},
    radioList: [
      {
        label: '按钮样式',
        value: 'BUTTON_STYLE',
      },
      {
        label: '横条样式',
        value: 'BAR_STYLE',
      },
      {
        label: '卡片样式',
        value: 'CAR_STYLE',
      },
    ],
    changeCallBack: ( e, componentData, changeComponentData ) => {
      const val = e?.target ? e.target.value : e;
      if ( val === 'BUTTON_STYLE' ) {
        changeComponentData( 50, 'style.height' );
        changeComponentData( 50, 'style.width' );
      } else if ( val === 'BAR_STYLE' ) {
        changeComponentData( 54, 'style.height' );
        changeComponentData( 300, 'style.width' );
      } else {
        changeComponentData( 90, 'style.height' );
        changeComponentData( 300, 'style.width' );
      }
    },
  },
  {
    renderType: 'custom',
    content: <div style={{ marginTop: -20, marginBottom: 10 }}>* 音频名称将取自组件名称。</div>,
    conditionalRendering: { path: 'showType', value: 'CAR_STYLE' },
  },
  {
    renderType: 'UploadModal',
    field: 'playImage',
    label: '播放中按钮',
    flex: true,
    required: true,
    formLayout: {},
    conditionalRendering: { path: 'showType', value: 'BUTTON_STYLE' },
  },
  {
    renderType: 'UploadModal',
    field: 'stopImage',
    label: '暂停中按钮',
    flex: true,
    required: true,
    formLayout: {},
    conditionalRendering: { path: 'showType', value: 'BUTTON_STYLE' },
  },
  {
    renderType: 'Radio',
    label: '循环播放',
    field: 'loop',
    flex: true,
    required: true,
    radioList: [
      {
        label: '是',
        value: true,
      },
      {
        label: '否',
        value: false,
      },
    ],
  },
];
function Audio() {
  return <RenderFormItem renderList={renderList} />;
}
export const HIDE_TEXT_COLOR = true;
export default Audio;

import React from 'react'
import RenderFormItem from '../RenderFormItem';

const renderList = [
    {
        renderType:'UploadModal',
        label:'图片',
        field:'propValue.image',
        flex:true,
        required:true,
        changeCallBack:( val, { style:{ width } }, changeComponentData ) => {
            // 上传图片后给组件设置对应比例高度
            if ( !val ) return
            const img = new Image()
            img.src = val
            img.onload = () => {
                const imgScale = img.width / width;
                const height = Math.round( img.height / imgScale ) || 0;
                changeComponentData( height, 'style.height' )
            }
        }
    },
    {
      renderType: 'Select',
      label: '图片展示模式',
      field: 'imageShowStyle',
      flex:true,
      required: true,
      propsData:{
        defaultValue:'WIDTH_MATCH',
        style:{
          width: 200
        }
      },
      optionList: [
        {
          label: '宽度适应',
          value: 'WIDTH_MATCH',
        },
        {
          label: '高度适应',
          value: 'HIGHT_MATCH',
        },
        {
          label: '拉伸',
          value: 'DRAW',
        },
        {
          label: '平铺',
          value: 'TILE',
        },
      ],
    },
]
function Img() {
    return <RenderFormItem renderList={renderList} />
}

export const SET_JUMP = true;
export const SUSPENSION = true;
export const HIDE_TEXT_COLOR = true;
export default Img
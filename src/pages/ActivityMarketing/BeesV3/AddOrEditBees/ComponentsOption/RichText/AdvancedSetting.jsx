import React from 'react'
import RenderFormItem from '../RenderFormItem'

const formItemList = [
    // {
    //     renderType:'SketchPicker',
    //     label:'颜色',
    //     field:'style.color'
    // },
    
    {
        renderType:'SliderAndInputNumber',
        field:'style.fontSize',
        label:'字体大小',
        propsData:{
            min:12,
            max:100
        }
    }, 
    {
        renderType:'InputNumber',
        field:'style.fontWeight',
        label:'字体粗细',
        propsData:{
            step:100,
            min:400,
            max:600
        }
    }, 
    {
        renderType:'InputNumber',
        field:'style.lineHeight',
        label:'行高',
        propsData:{
            min:0,
        }
    }, 
      {
        renderType:'InputNumber',
        field:'style.letterSpacing',
        label:'字间距',
        propsData:{
            min:0
        }
    }, 
]
function AdvancedSetting() {
    return (
      <RenderFormItem renderList={formItemList} />
    )
}
export default AdvancedSetting
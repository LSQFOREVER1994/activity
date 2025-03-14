import React from 'react'
import { Collapse } from 'antd'
import RenderFormItem from '../RenderFormItem'

const { Panel } = Collapse

function SubmitButtonConfig() {
  const renderList = [
    {
      renderType: 'Input',
      field: 'submitTimes',
      label: '提交次数',
      flex: 1,
      propsData:{
        style:{
          width:200
        },
        placeholder:'设置提交次数，不填不限制'
      }
    },
    {
      renderType: 'Radio',
      label: '提交按钮样式',
      field: 'submitButtonStyle',
      flex: true,
      required: true,
      radioList: [
        {
          label: '默认',
          value: 'DEFAULT',
        },
        {
          label: '自定义',
          value: 'CUSTOM',
        },
      ],
    },
    {
      renderType: 'Input',
      field: 'submitButtonText',
    wordsMax: 10,
      label: '按钮文字',
      flex: 1,
      conditionalRendering: ( componentData ) => (
        componentData.submitButtonStyle === 'DEFAULT'
      )
    },
    {
      renderType: 'SketchPicker',
      field: 'submitButtonTextColor',
      label: '文字颜色',
      flex: 1,
      conditionalRendering: ( componentData ) => (
        componentData.submitButtonStyle === 'DEFAULT'
      )
    },
    {
      renderType: 'SketchPicker',
      field: 'submitButtonBackgroundColor',
      label: '按钮颜色',
      flex: 1,
      conditionalRendering: ( componentData ) => (
        componentData.submitButtonStyle === 'DEFAULT'
      )
    },
    {
      renderType: 'UploadModal',
      field: 'submitButtonImage',
      label: '提交按钮图',
      required: true,
      tips:{
        text:['格式: jpg/jpeg/png', '图片大小建议不大于1M'],
      },
      conditionalRendering: ( componentData ) => (
        componentData.submitButtonStyle === 'CUSTOM'
      )
    },
    {
      renderType: 'Input',
      field: 'popupTitle',
      label: '弹窗标题',
      wordsMax: 10,
      required:true,
      propsData:{
        style:{
          width:300
        },
        placeholder:'请输入弹窗标题'
      }
    },
    {
      renderType: 'Input',
      field: 'popupDescription',
      wordsMax: 20,
      label: '弹窗描述',
      propsData:{
        style:{
          width:300
        },
        placeholder:'请输入弹窗描述 ，不填不展示'
      }
    },
    {
      renderType: 'Input',
      wordsMax: 10,
      field: 'popupButtonText',
      label: '弹窗按钮文案',
      propsData:{
        style:{
          width:300
        },
        placeholder:'请输入弹窗按钮文案 ，不填不展示'
      }
    },
    {
      renderType: 'Input',
      field: 'popupButtonUrl',
      label: '弹窗按钮跳转链接',
      propsData:{
        style:{
          width:300
        },
        placeholder:'请输入弹窗跳转链接'
      }
    },

  ]

  return (
    <Collapse defaultActiveKey="submitBtnConfig" expandIconPosition="left" bordered style={{ marginBottom: 20 }}>
      <Panel header="提交配置" key="submitBtnConfig">
        <RenderFormItem renderList={renderList} />
      </Panel>
    </Collapse>
  )
}

export default SubmitButtonConfig

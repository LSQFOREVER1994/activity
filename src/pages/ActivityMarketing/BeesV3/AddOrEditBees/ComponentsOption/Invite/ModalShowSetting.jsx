import React from 'react'
import { Row, Col, Tooltip, Icon } from 'antd'
import RenderFormItem from '../RenderFormItem'

export default function ModalShowSetting() {
  const colorsTip = {
    titleColor: "标题颜色",
    textColor: "描述颜色"
  }

  const colorsKey = [
    "titleColor",
    "textColor",
  ]

  const defaultColors = {
    titleColor: 'rgba(84,84,84,1)',
    textColor: 'rgba(134, 140, 148,1)'
  }

  const renderList = [
  {
    renderType: 'UploadModal',
    field: 'image',
    label: '任务图标',
    flex:true,
    // required: true,
  },
  {
    renderType: 'Input',
    label: '任务标题',
    field: 'task.name',
    required: true,
    flex:true,
    wordsMax:20,
    propsData:{
      placeholder: '请填写任务标题',
    }
  },
  {
    renderType: 'Radio',
    label:'任务描述展示类型',
    field:'task.descShowType',
    flex: false,
    required: false,
    radioList: [
      {
        label: '问号',
        value: 'QUESTION_MARK',
      },
      {
        label: '页面展示',
        value: 'PAGE',
      },
      {
        label: '无',
        value: 'NONE',
      },
    ],
  },
  {
    renderType: 'Switch',
    flex: true,
    label: (
      <span>
        <span>任务上限展示 </span>
        <Tooltip title={<span>默认展示任务上限（0/1）,关闭后隐藏（0/1）</span>}>
          <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
        </Tooltip>
      </span>
    ),
    field: 'taskLimitShow',
    required: false,
  },
  {
    renderType: 'TextArea',
    label: '任务描述',
    field: 'task.description',
    required: false,
    propsData:{
      placeholder: '请填写任务描述',
    },
    conditionalRendering: data => {
      const showArr = ['QUESTION_MARK', 'PAGE']
      return showArr.includes( data.task.descShowType );
    },
  },
  {
    renderType: 'ColorsMap',
    label: '颜色',
    field: 'colors',
    flex: true,
    formLayout: {},
    propsData: {
      colorsTip,
      colorsKey,
      defaultValue: defaultColors
    },
  },
];

  return (
    <div>
      <RenderFormItem renderList={renderList} />
      <Row type="flex" justify="space-between">
        <Col span={12}>
          <RenderFormItem
            renderList={[
                {
                  renderType: 'UploadModal',
                  field: 'goButton',
                  label: '去完成按钮',
                  required: true,
                  annotation:<span>图片大小建议不大于1M</span>
                },
              ]}
          />
        </Col>
        <Col span={12}>
          <RenderFormItem
            renderList={[
                {
                  renderType: 'UploadModal',
                  field: 'finishButton',
                  label: '已完成按钮',
                  required: true,
                  annotation:<span>图片大小建议不大于1M</span>
                },
              ]}
          />
        </Col>
      </Row>
    </div>
  )
}

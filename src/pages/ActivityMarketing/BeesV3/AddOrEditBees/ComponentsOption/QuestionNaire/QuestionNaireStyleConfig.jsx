import React from 'react'
import { Collapse } from 'antd'
import RenderFormItem from '../RenderFormItem'

const { Panel } = Collapse

function QuestionNaireStyleConfig() {
  const renderList = [
    {
      renderType: 'SketchPicker',
      field: 'titleColor',
      label: '标题颜色',
      flex: 1,
    },
    {
      renderType: 'SketchPicker',
      field: 'descriptionColor',
      label: '描述颜色',
      flex: 1,
    },
    {
      renderType: 'SketchPicker',
      field: 'optionColor',
      label: '选项颜色',
      flex: 1,
    },
    {
      renderType: 'SketchPicker',
      field: 'borderColor',
      label: '边框颜色',
      flex: 1,
    },
    {
      renderType: 'SliderAndInputNumber',
      field: 'spacing',
      label: '题目间距',
      flex: 1,
      propsData: {
        min: 0,
        max: 1000,
        step: 0.1
      }
    },
    {
      renderType: 'Switch',
      field: 'showNumber',
      flex: true,
      label: '题号展示',
    },
  ]
  return (
    <Collapse defaultActiveKey="qnStyleConfig" expandIconPosition="left" bordered style={{ marginBottom: 20 }}>
      <Panel header="问卷样式配置" key="qnStyleConfig">
        <RenderFormItem renderList={renderList} />
      </Panel>
    </Collapse>
  )
}

export default QuestionNaireStyleConfig

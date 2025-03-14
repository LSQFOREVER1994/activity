import React from 'react'
import { connect } from 'dva'
import RenderFormItem from '../RenderFormItem'
import QuestionNaireConfig from './QuestionNaireConfig'
import QuestionNaireStyleConfig from './QuestionNaireStyleConfig'
import SubmitConfig from './SubmitConfig'

function Index( props ) {
  const renderList = [
    {
      renderType: 'DatePicker',
      label: '问卷开始时间',
      field: 'startTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
    {
      renderType: 'DatePicker',
      label: '问卷结束时间',
      flex: true,
      field: 'endTime',
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
  ]

  return (
    <div>
      <RenderFormItem renderList={renderList} />
      {/* 问卷配置 */}
      <QuestionNaireConfig {...props} />
      {/* 问卷样式配置 */}
      <QuestionNaireStyleConfig {...props} />
      {/* 提交按钮配置 */}
      <SubmitConfig {...props} />
    </div>
  )
}
export const HIDE_TEXT_COLOR = true;
export default connect()( Index )

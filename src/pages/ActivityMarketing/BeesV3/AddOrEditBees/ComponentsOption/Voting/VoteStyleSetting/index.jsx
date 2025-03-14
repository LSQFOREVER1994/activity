/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-08-28 11:01:18
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-28 19:54:54
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/BeesV3/AddOrEditBees/ComponentsOption/Voting/VoteStyleSetting/index.jsx
 */
import React from 'react'
import { Collapse } from 'antd'
import RenderFormItem from '../../RenderFormItem'

const { Panel } = Collapse

const renderList = [
  {
    renderType: 'SketchPicker',
    field: 'uncheckFont',
    label: '未投票选项内容文字颜色',
    flex: true,
  },
  {
    renderType: 'SketchPicker',
    field: 'checkFont',
    label: '已投票选项内容文字颜色',
    flex: true,
  },
  {
    renderType: 'SketchPicker',
    field: 'uncheckBackground',
    label: '未投票选项背景颜色',
    flex: true,
  },
  {
    renderType: 'SketchPicker',
    field: 'checkBackground',
    label: '已投票选项背景颜色',
    flex: true,
  },
  {
    renderType: 'SketchPicker',
    field: 'uncheckScaleBackground',
    label: '未投票占比背景颜色',
    flex: true,
  },
  {
    renderType: 'SketchPicker',
    field: 'checkScaleBackground',
    label: '已投票占比背景颜色',
    flex: true,
  },
]

function Index() {
  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: 20 }}>
      <Panel header="投票样式配置" key="1">
        <RenderFormItem renderList={renderList} />
      </Panel>
    </Collapse>
  )
}

export default Index
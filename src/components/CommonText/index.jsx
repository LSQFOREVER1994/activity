import React from 'react';
import { Tooltip, Icon } from 'antd'

const drawConsumeTypeLabel = (
  <Tooltip title={
    <span>
      <span>该配置项用于设置用户参与该组件的方式。可选项包括：</span>
      <br />
      <span>① 通用次数：所有组件都可以共享和消耗的次数</span>
      <br />
      <span>② 组件专享次数：当前组件专享次数</span>
      <br />
      <span>③ 积分：当前活动积分</span>
    </span>}
  >
    <span>参与方式配置 </span>
    <Icon type="question-circle" />
  </Tooltip>
)

export default drawConsumeTypeLabel;

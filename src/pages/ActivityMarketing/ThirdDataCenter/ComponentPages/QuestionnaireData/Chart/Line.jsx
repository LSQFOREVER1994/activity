import React, { useEffect } from 'react'
import { Line } from '@antv/g2plot';

function LineChart( { statisticsResult, questionId } ) {
  const renderLine = () => {
    const line = new Line( `${questionId}`, {
      data: statisticsResult,
      padding: 50,
      xField: 'key',
      yField: 'value',
      xAxis: {
        // type: 'timeCat',
        tickCount: 5,
      },
      meta: {
        value: {
          alias: '数量',
          // formatter: ( v ) => `${v} 人`,
        },
      }
    } );
    line.render();
  }
  useEffect( () => {
    renderLine()
  },  [statisticsResult, questionId] )
  return <div id={`${questionId}`} />
}
export default LineChart

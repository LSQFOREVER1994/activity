import React, { useEffect } from 'react'
import { Pie } from '@antv/g2plot';

function PieChart( { statisticsResult, questionId } ) {
 const renderPie = ( ) => {
    statisticsResult.forEach( item => {
      // eslint-disable-next-line no-param-reassign
      item.votes = Number( item.votes )
    } );
    const piePlot = new Pie( `${questionId}`, {
      padding: 50,
      appendPadding: 10,
      data: statisticsResult,
      angleField: 'votes',
      colorField: 'itemValue',
      radius: 1,
      innerRadius: 0.50,
      meta: {
        votes: {
          // formatter: ( v ) => ` ${v} 人`,
        },
      },
      label: {
        type: 'inner',
        offset: '-50%',
        autoRotate: false,
        style: { textAlign: 'center' },
        formatter: ( { percent } ) => `${( percent * 100 ).toFixed( 2 )}%`,
      },
      legend: {
        position: 'top'
      },
      statistic: {
        title: {
          content: '总计',
          offsetY: -10,
        },
        content: {
          offsetY: 0,
        },
      },
      // 添加 中心统计文本 交互
      interactions: [
        { type: 'element-selected' },
        { type: 'element-active' },
        {
          type: 'pie-statistic-active',
          cfg: {
            start: [
              { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
              { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' },
            ],
            end: [
              { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
              { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' },
            ],
          },
        },
      ],
    } );
    piePlot.render();
  }

  useEffect( () => {
    renderPie()
  }, [] )
  return <div id={`${questionId}`} />
}
export default PieChart

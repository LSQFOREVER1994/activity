import React, { useEffect } from 'react'
import { Bar } from '@antv/g2plot';

function BarChart( { statisticsResult, questionId, topic } ) {
  const renderBar = () => {
    const bar = new Bar( `${questionId}`, {
      data: statisticsResult,
      padding: 50,
      xField: topic === 'SCORE' ? 'scale' : 'value',
      yField: 'key',
      seriesField: 'key',
      legend: {
        position: 'top',
      },
      meta: {
        key: {
          formatter: ( v ) => `${v}${topic === 'SCORE' ? '分' : ''} `,
        },
        scale: {
          formatter: ( percent ) => `${( percent * 100 ).toFixed( 2 )}%`,
        }
      }
    } );
    bar.render();
  }

  useEffect( () => {
    renderBar()
  }, [] )

  return <div id={`${questionId}`} />
}
export default BarChart

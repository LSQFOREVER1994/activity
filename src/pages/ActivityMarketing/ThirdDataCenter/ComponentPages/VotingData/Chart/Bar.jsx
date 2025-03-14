import React, { useEffect } from 'react'
import { Bar } from '@antv/g2plot';

function BarChart( { statisticsResult, id } ) {
  const renderBar = () => {
    const bar = new Bar( `${id}`, {
      data: statisticsResult,
      padding: 100,
      xField: 'votes',
      yField: 'itemValue',
      seriesField: 'itemValue',
      legend: {
        position: 'top',
      },
      meta: {
        votes: {
          formatter: ( percent ) => percent,
        },
        // scale: {
        //   formatter: ( percent ) => `${( percent * 100 ).toFixed( 2 )}%`,
        // }
      }
    } );
    bar.render();
  }

  useEffect( () => {
    renderBar()
  }, [] )

  return <div id={`${id}`} />
}
export default BarChart

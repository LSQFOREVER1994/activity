import React, { useState, useEffect } from 'react'
import { Button } from 'antd';
import Pie from './Chart/Pie';
import Bar from './Chart/Bar';
// import Line from './Chart/Line';
import styles from './votingData.less';

function Chart( { data } ) {
  const [chartType, setChartType] = useState( '' );

  useEffect( () => {
    setChartType( '' )
    setTimeout( () => {
      setChartType( 'pie' )
    } )
  }, [data] )
  
  const renderChart = () => {
    if ( chartType === 'pie' ) {
      return <Pie {...data} />
    }
    if ( chartType === 'bar' ) {
      return <Bar {...data} />
    }
    // if ( chartType === 'line' ) {
    //   return <Line {...data} />
    // }
    return <div className={styles.skeleton} />
  }

  return (
    <div className={styles.item_chart}>
      {renderChart()}
      <div className={styles.item_chart_button}>
        <Button onClick={() => { setChartType( 'pie' ) }} type={chartType === 'pie' ? 'primary' : ''} size='small' className={styles.chart_button}>饼图</Button>
        <Button onClick={() => { setChartType( 'bar' ) }} type={chartType === 'bar' ? 'primary' : ''} size='small' className={styles.chart_button}>条形图</Button>
        {/* <Button onClick={() => { setChartType( 'line' ) }} type={chartType === 'line' ? 'primary' : ''} size='small' className={styles.chart_button}>折线图</Button> */}
      </div>
    </div>
  )
}

export default Chart

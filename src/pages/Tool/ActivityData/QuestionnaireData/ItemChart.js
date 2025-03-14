import React, { PureComponent } from 'react';
import styles from './questionnaire.less';
import PieChart from './PieChart';
import BarChart from './BarChart'


class ItemChart extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      statisticsResult:props.statisticsResult||[],
      chartType:'pie'
    };
  }


  componentWillMount() {} 

  componentWillReceiveProps( nextProps ) {
    if ( this.props.statisticsResult !== nextProps.statisticsResult ) {
      this.setState( {
        statisticsResult: nextProps.statisticsResult,
      } );
    }
  }


  // 选择图表
   onChangeChart=( val )=>{
     this.setState( {
       chartType:val
     } )
   }

 // 单选、多选
 renderChart=(  )=>{
   const { chartType, statisticsResult }=this.state
   let pieButtonStyle='item_chart_button_choose'
   let barButtonStyle='item_chart_button_unchoose'
   if( chartType==='bar' ){
    pieButtonStyle='item_chart_button_unchoose'
    barButtonStyle='item_chart_button_choose'
   }

  return (
    <div className={styles.item_chart}>
      { chartType==='pie' && <PieChart statisticsResult={statisticsResult} />}
      { chartType==='bar' && <BarChart statisticsResult={statisticsResult} />}
      <div className={styles.item_chart_button}>
        <div className={styles[`${pieButtonStyle}`]} onClick={()=>this.onChangeChart( 'pie' )}>饼图</div>
        <div className={styles.item_chart_button_line} />
        <div className={styles[`${barButtonStyle}`]} onClick={()=>this.onChangeChart( 'bar' )}>条形图</div>
      </div>
    </div>
  );
 }



  render() {
    return this.renderChart()
  }
}

export default ItemChart;

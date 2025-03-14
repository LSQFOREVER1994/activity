import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon } from 'antd';
import styles from './index.less';

@connect( ( { marketing } ) => ( {
  allAmounts: marketing.allAmounts,
  allSales:marketing.allSales,
} ) )

class AggregateData extends PureComponent{
  state = {
    end:moment().format( 'YYYY-MM-DD' ),
    yesterdayStart:moment().subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
  };


  componentDidMount() {
    this.fetchMessage();
    this.fetchSales()

  }

  componentWillUnmount(){
    
  }

  // 获取今日,昨日销售总额
  fetchMessage = () => {
    const { yesterdayStart, end } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'marketing/getAllOrderAmounts',
      payload: {
        start:yesterdayStart,
        end
      },
    } );
  }

  // 获取今日,昨日订单总数
  fetchSales = () => {
    const { yesterdayStart, end } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'marketing/getAllOrderSales',
      payload: {
        start:yesterdayStart,
        end
      },
    } );
  }


  render(){
    const { allAmounts, allSales } =this.props;

    // 今日总销额
    const allTodayAmount = allAmounts.length>0 ? allAmounts[1].amount : 0;
    // 今日总销量
    const allTodaySales = allSales.length>0 ? allSales[1].amount : 0;
    
    // 昨日总销额
    const allYesterdayAmount = allAmounts.length>0 ? allAmounts[0].amount : 0;
    // 昨日总销量
    const allYesterdaySales = allSales.length>0 ? allSales[0].amount : 0;
    
    return (
      <div> 
        <div className={styles.salesSituation}>

          <div className={styles.messageChlid}>
            <p style={{ color:'#1890ff' }}>今日销售总额(元)</p>
            <div style={{ marginTop:'-15px' }}>
              <span style={{ fontSize:28, fontWeight:570 }}>{allTodayAmount.toFixed( 2 )}</span>
              {
              ( allTodayAmount -  allYesterdayAmount )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
            }
              <span className={styles.smallStyle}>{Math.abs( allTodayAmount -  allYesterdayAmount ).toFixed( 2 )}</span>
            </div>
            <p className={styles.smallStyle}>昨日：{allYesterdayAmount.toFixed( 2 )}</p>
          </div>

          <div className={styles.messageChlid}>
            <p style={{ color:'#1890ff' }}>今日订单总数(个)</p>

            <div style={{ marginTop:'-15px' }}>
              <span style={{ fontSize:28, fontWeight:570 }}>{allTodaySales}</span>
              {
              ( allTodaySales - allYesterdaySales )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
            }
              <span className={styles.smallStyle}>{Math.abs( allTodaySales - allYesterdaySales )}</span>
            </div>
            <p className={styles.smallStyle}>昨日：{allYesterdaySales}</p>
          </div>
          
        </div>
        
      </div>
    )
  }

}

export default AggregateData;
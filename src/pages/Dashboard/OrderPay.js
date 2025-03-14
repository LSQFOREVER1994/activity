import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Icon, Tooltip } from 'antd';
import moment from 'moment';
import { ChartCard, Pie } from '@/components/Charts';
import styles from './dashboard.less';

@connect(({ dashboard }) => ({
  goodsList: dashboard.goodsList,
}))

class OrderPay extends PureComponent {
  state={
    orderInfo: {}
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'dashboard/getOrderTotal',
      payload: {
        params: {
          start: moment().format('YYYY-MM-DD'),
          // start: '2019-04-16',
          end: moment().format('YYYY-MM-DD'),
        },
        callFunc:(orderInfo) =>{
          this.setState({ orderInfo })
        }
      }
    })
  }

  render() {
    const { orderInfo: { deal=0, total=0 } } = this.state;
    const pieTotal =  (!deal && !total) ? '0' : (deal/total*100).toFixed(1)
    return (
      <div className={styles.chartCard}>
        <ChartCard
          title="今日订单支付"
          action={
            <Tooltip title="今天订单已支付完成数量 / 总订单数量">
              <Icon type="info-circle-o" />
            </Tooltip>
        }
          total={() => (
            <span 
              style={{fontSize: '22px'}}
              dangerouslySetInnerHTML={{ __html: `${deal}/${total}` }}
            />
        )}
          contentHeight={46}
        >
          <div className={styles.pie}>
            <Pie 
              percent={(!deal && !total) ? 0 : deal/total*100}
              total={()=>(<span className={styles.pieTotal}>{pieTotal}%</span>)}
              height={100}
            />
          </div>
        </ChartCard>
      </div>
    );
  }
}

export default OrderPay;

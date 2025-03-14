import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Icon, Tooltip } from 'antd';
import { ChartCard, Pie } from '@/components/Charts';
import styles from './dashboard.less';

@connect(({ dashboard }) => ({
  goodsList: dashboard.goodsList,
}))

class CouponsCount extends PureComponent {
  state={
    orderInfo: {}
  }

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'dashboard/getCouponsTotal',
      payload: {
        callFunc:(orderInfo) =>{
          this.setState({ orderInfo })
        }
      }
    })
  }

  render() {
    // const { orderInfo } = this.state;
    const { orderInfo: { deal=0, total=0 } } = this.state;
    const pieTotal =  (!deal && !total) ? '0' : (deal/total*100).toFixed(1)
    return (
      <div className={styles.chartCard}>
        <ChartCard
          title="优惠券"
          action={
            <Tooltip title="已使用的优惠券数 / 总发放数量">
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

export default CouponsCount;

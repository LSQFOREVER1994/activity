import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Icon, Tooltip } from 'antd';
import moment from 'moment';
import { ChartCard } from '@/components/Charts';
import Trend from '@/components/Trend';
// import numeral from 'numeral';


@connect(({ dashboard }) => ({
  goodsList: dashboard.goodsList,
}))

class TodayTotal extends PureComponent {
  state = {
    salesList: [],
  };

  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'dashboard/getSpecifyDateTotal',
      payload: {
        params: {
          // start: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          // end: moment().format('YYYY-MM-DD'),
          start: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
        },
        callFunc:(data) =>{
          this.setState({ salesList: data })
        }
      }
    })
  }

  render() {
    const { salesList } = this.state;
    const todaySale = salesList[1] || {}
    const yesterday = salesList[0] || {}
    const ratio = salesList[0] && salesList[1] && salesList[0].amount !== 0 ? ((salesList[1].amount-salesList[0].amount)/salesList[0].amount * 100).toFixed(1) : '∞'
    return (
      
      <div>
        <ChartCard
          title="今日售额"
          action={
            <Tooltip title="今天所有商品的销售总金额">
              <Icon type="info-circle-o" />
            </Tooltip>
        }
          total={() => (
            // <span style={{fontSize: '22px'}} dangerouslySetInnerHTML={{ __html: yuan(todaySale.amount) }} />
            <span style={{fontSize: '22px'}} dangerouslySetInnerHTML={{ __html: todaySale.amount }} />
        )}
          contentHeight={46}
        >
          <span>
            昨日
            <Trend
              flag={yesterday.amount > todaySale.amount ? "up" : "down"}
              style={{ marginLeft: 5, color: "rgba(0,0,0,.85)" }}
            >
              ￥{yesterday.amount ? yesterday.amount.toFixed(1) : 0}
            </Trend>
            {/* <span style={{ marginRight: '16px', color: "rgba(0,0,0,.85)" }}>
              {yesterday.amount}
            </span> */}
            日环比
            <Trend
              flag={ratio >= 0 || ratio === '∞'? "up" : "down"}
              style={{ marginLeft: 5, color: "rgba(0,0,0,.85)" }}
            >
              {
                ratio === '∞'? '∞':
                `${ratio} %`
              }
            </Trend>
          </span>
        </ChartCard>
      </div>
          
      
    );
  }
}

export default TodayTotal;

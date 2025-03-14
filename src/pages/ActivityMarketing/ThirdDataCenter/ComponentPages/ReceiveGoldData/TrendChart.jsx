import React, { PureComponent } from 'react';
import { Line } from '@antv/g2plot';
import moment from 'moment';

class TrendChart extends PureComponent {
  componentDidMount() {
    this.getStatisticInfo()
  };

  getStatisticInfo = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'thirdDataCenter/getAppointAppData',
      payload: {
        query: {
          appId: activityId
        },
        successFun: ( res ) => {
          const { createTime } = res
          this.getLineData( createTime )
        }
      },
    } );
  }

  getLineData = ( time ) => {
    const { dispatch, activityId } = this.props;
    const offsetV = 2592000000;
    const nowTime = moment().valueOf();
    const createTime = new Date( time ).valueOf()
    let startTime;
    let endTime;
    if ( ( nowTime - createTime ) > offsetV ) {
      startTime = ''
      endTime = ''
    } else {
      startTime = time
      endTime = moment().format( 'YYYY-MM-DD 23:59:59' )
    }
    dispatch( {
      type: 'receiveGold/getTrend',
      payload: {
        activityId,
        startTime,
        endTime
      },
      successFn: ( res ) => {
        this.renderLine( res );
      }
    } );
  }

  renderLine = ( data ) => {
    data.sort( ( x, y ) => {
      return x.date < y.date ? -1 : 1
    } )
    const line = new Line( 'gamedata', {
      data,
      autoFit: true,
      xField: 'date',
      yField: 'count',
      color: '#EDBB62',
      smooth: true,
      yAxis: {
        alias: '参与次数'
      },
      xAxis: {
        tickCount: 6,
      },
    } );
    line.render();
  }

  render() {
    return ( <div id='gamedata' style={{ height: '100%' }} /> )
  }
}
export default TrendChart;

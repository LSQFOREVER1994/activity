/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Empty, Button } from 'antd';
import { Line } from '@antv/g2plot';

@connect( ( { invite } ) => ( {
  inviteList: invite.inviteList
} ) )
class InviteDataTable extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      inviteTotal: 0,
      lineChart: ''
    }
  }

  componentDidMount() {
    this.getInviteList()
  }

  // 获取邀请统计数据
  getInviteList = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'invite/getInviteList',
      payload: {
        activityId,
      },
      successFn: ( res ) => {
        const { statistics } = res
        let inviteTotal = 0
        // 计算总邀请人数
        statistics && statistics.map( item => {
          inviteTotal += item.count
        } )
        this.setState( { inviteTotal }, () => {
          this.generateLineChart( statistics )
        } )
      }
    } );
  }

  // 生成折线图
  generateLineChart = ( statistics ) => {
    if ( statistics && statistics.length > 0 ) {
      statistics.sort( ( x, y ) => {
        return x.date < y.date ? -1 : 1
      } )
      const line = new Line( 'lineChart', {
        data: statistics,
        padding: 'auto',
        xField: 'date',
        yField: 'count',
        color: '#EDBB62',
        yAxis: {
          alias: '邀请人数'
        },
        xAxis: {
          tickCount: 5,
        },
        slider: {
          start: 0,
          end: 1,
        },
      } );
      this.setState( { lineChart: line } )
      line.render();
    }
  }

  // 重置silider
  hanldeReset = () => {
    const { lineChart } = this.state
    lineChart.update( {
      slider: {
        start: 0,
        end: 1,
      },
    } )
  }

  numFormat = ( num ) => {
    const res = num.toString().replace( /\d+/, ( n ) => {
      return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
        return `${$1},`;
      } );
    } )
    return res;
  }

  render() {
    const { inviteList } = this.props
    const { statistics } = inviteList
    const { inviteTotal } = this.state
    return (
      <Card
        bordered={false}
        title='用户邀请情况趋势图'
        headStyle={{ fontWeight: 'bold' }}
        bodyStyle={{ marginBottom: 18 }}
      >
        {( statistics && statistics.length > 0 ) &&
          <>
            <div style={{ marginTop: 0, textAlign: 'center', fontSize: 16, color: '#333' }}>总邀请人数：{this.numFormat( inviteTotal )}</div>
            <div style={{ marginBottom: 10, textAlign: 'right' }}><Button onClick={this.hanldeReset} size='small'>Reset</Button></div>
          </>
        }
        {
          statistics && statistics.length > 0 ?
            <div id='lineChart' />
            : <Empty />
        }
      </Card>
    );
  }
}

export default InviteDataTable;

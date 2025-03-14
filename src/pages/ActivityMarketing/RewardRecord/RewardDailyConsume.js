/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Card, Spin } from 'antd';
import { Line } from '@antv/g2plot';
import * as _ from '@antv/util';
import styles from './rewardRecord.less'

@connect( ( { reward } ) => {
  return { ...reward }
} )
class RewardDailyConsume extends PureComponent {
  chartNodeRef = React.createRef();

  chartRef = React.createRef();

  constructor( props ) {
    super( props )
    this.state = {
      tooltipItems: [],
      activeTooltipTitle: null,
      activeSeriesList: [],
    }
  }

  componentDidMount() {
    this.getRewardConsume();
  }

  /*  doSameObjValue 数组对象相同值相加去重
    arr 需要处理的数组
    resultNum 最终计算结果的键名
    keyName 用于计算判断的键名
    keyValue 用于计算结果的键名 --> 对应的键值为number类型 */
  doSameObjValue = ( arr, resultNum, keyName, keyValue ) => {
    const warp = new Map();
    arr.forEach( i => {
      const str = keyName.map( v => i[v] ).join( '_' );
      // eslint-disable-next-line no-return-assign, no-param-reassign
      i[resultNum] = keyValue.reduce( ( p, c ) => p += i[c], 0 );
      // eslint-disable-next-line no-unused-expressions
      warp.has( str ) ? warp.get( str )[resultNum] += i[resultNum] : warp.set( str, i );
    } );
    return Array.from( warp ).map( ( [, v] ) => v );
  };

  handleRawData = ( data ) => {
    const newData = [];
    data.map( item => {
      item.statistics.map( i => {
        const Obj = {};
        Obj.name = item.name.trim();
        Object.assign( Obj, i )
        if ( Obj.name !== '谢谢参与' ) { newData.push( Obj ) }
        return Obj
      } )
      return newData
    } )
    const lastData = this.doSameObjValue( newData, 'result', ['name', 'date'], ['count'] );
    lastData.sort( ( x, y ) => {
      return x.date < y.date ? -1 : 1
    } )
    return lastData;
  }

  // 获取奖品库存发放统计数据
  getRewardConsume = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'reward/getRewardConsume',
      payload: {
        query: {
          activityId
        },
        successFun: () => {
          this.renderLine();
        }
      }
    } );
  }

  renderLine = () => {
    const chartDom = this.chartNodeRef.current;
    const { lineData } = this.props;
    const data = this.handleRawData( lineData );
    window.data = data;
    if ( this.chartRef ) {
      this.chartRef?.current?.clear();
    }
    const line = new Line( chartDom, {
      data,
      autoFit: true,
      xField: 'date',
      yField: 'result',
      seriesField: 'name',
      xAxis: {
        type: 'cat',
        label: {
          autoRotate: false,
          formatter: ( v ) => {
            return v.split( '/' ).reverse().join( '-' );
          },
        },
      },
      yAxis: {
        grid: {
          line: {
            style: {
              lineWidth: 0.5,
            },
          },
        },
      },
      meta: {
        date: {
          range: [0.04, 0.96],
        },
        result: {
          range: [0, 0.95],
        },
      },
      point: {
        shape: 'circle',
        size: 2,
        style: () => {
          return {
            fillOpacity: 0,
            stroke: 'transparent',
          };
        },
      },
      appendPadding: [0, 0, 0, 0],
      legend: false,
      smooth: true,
      lineStyle: {
        lineWidth: 1.5,
      },
      tooltip: {
        showMarkers: false,
        follow: false,
        position: 'top',
        customContent: () => null,
      },
      theme: {
        geometries: {
          point: {
            circle: {
              active: {
                style: {
                  r: 4,
                  fillOpacity: 1,
                  stroke: '#000',
                  lineWidth: 1,
                },
              },
            },
          },
        },
      },
      interactions: [{ type: 'marker-active' }, { type: 'brush' }],
    } );

    line.render();
    this.chartRef = line;
    // 初始化，默认激活
    const lastData = _.last( data );
    const point = line.chart.getXY( lastData );
    line.chart.showTooltip( point );
    const activeTooltipTitle = lastData.date;
    this.setState( { tooltipItems: data.filter( ( d ) => d.date === activeTooltipTitle ), activeTooltipTitle } );

    line.on( 'plot:mouseleave', () => {
      line.chart.hideTooltip();
    } );
    line.on( 'tooltip:change', ( evt ) => {
      const { title } = evt.data;
      const tooltipItems = data.filter( ( d ) => d.date === title );
      this.setState( { tooltipItems, activeTooltipTitle: title } );
    } );
  }

  changeActiveSeries = ( activeSeries ) => {
    const { activeTooltipTitle, activeSeriesList } = this.state;
    let newList = [];
    if ( !activeSeriesList.includes( activeSeries ) ) {
      newList = [...activeSeriesList, activeSeries];
    } else {
      newList = activeSeriesList.filter( ( s ) => s !== activeSeries );
    }
    this.setState( { activeSeriesList: newList }, () => {
      // @ts-ignore
      const chart = this.chartRef?.chart;
      if ( chart && activeSeries ) {
        chart.filter( 'name', ( name ) => {
          return !newList.includes( name );
        } );
        chart.render( true );
        chart.geometries
          .find( ( geom ) => geom.type === 'point' )
          .elements.forEach( ( ele ) => {
            const { date, name } = ele.getModel().data;
            if ( date === activeTooltipTitle && name === activeSeries ) {
              ele.setState( 'active', true );
            }
          } );
      }
    } );
  };


  generateTooltip = () => {
    const chart = this.chartRef?.chart;
    if ( !chart ) {
      return;
    }
    const { tooltipItems, activeSeriesList, activeTooltipTitle } = this.state;
    const { colors10, colors20 } = chart.themeObject;
    const colors = tooltipItems.length > 10 ? colors20 : colors10;
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltip_title}>{activeTooltipTitle}</div>
        <div className={styles.tooltip_items}>
          {tooltipItems.map( ( item, idx ) => {
            const changeActiveSeries = () => this.changeActiveSeries( item.name );
            return (
              <div
                className={styles.tooltip_item}
                onClick={changeActiveSeries}
                key={item.name}
              >
                <div className={styles[`tooltip_${item.name}`]}>
                  <div className={styles[`${activeSeriesList.includes( item.name ) ? 'inactive' : ''}`]}>
                    <div className={styles.tooltip_item_marker} style={{ background: colors[idx] }} />
                    <div className={styles.tooltip_item_label}>{item.name}</div>
                    <div className={styles.tooltip_item_value}>{item.result || '-'}</div>
                  </div>
                </div>
              </div>
            );
          } )}
        </div>
      </div>
    );
  };


  render() {
    const { loading } = this.props;
    return (
      <Card
        bordered={false}
        title='日消耗情况趋势图'
        headStyle={{ fontWeight: 'bold' }}
        bodyStyle={{ padding: '20px 32px 40px 32px', marginBottom: '16px' }}
      >
        <Spin spinning={loading}>
          <div className={styles.wrapper}>
            <section className={styles.trend_wrapper}>
              {this.generateTooltip()}
              <div className={styles.chart_wrapper} ref={this.chartNodeRef} />
            </section>
          </div>
        </Spin>
      </Card>
    );
  }
}

export default RewardDailyConsume;

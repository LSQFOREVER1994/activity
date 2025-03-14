import React from "react";
import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import styles from './index.less';

const data = [
  { date: '0.1', total: 2800, newusers: 22, totalL: 2800, newusersL: 2260, },
  { date: '0.2', total: 1800, newusers: 130, totalL: 1800, newusersL: 1300, },
  { date: '0.3', total: 950, newusers: 90, totalL: 950, newusersL: 900, },
  { date: '0.5', total: 170, newusers: 10, totalL: 170, newusersL: 100, },
  { date: '0.6', total: 170, newusers: 10, totalL: 170, newusersL: 100, },
  { date: '0.8', total: 170, newusers: 10, totalL: 170, newusersL: 100, },
];



class BarChart extends React.PureComponent {
  constructor( props ) {
    const Data = props.list || data;
    const xAxis = props.options.xAxis || 'date'
    const yAxis = props.options.yAxis || [
      { key: 'total', name: '总数', color: '#41a2fc' },
      { key: 'newusers', name: '新增', color: '#54ca76' }
    ]

    super( props );
    this.state = {
      xAxis,
      yAxis,
      Data
    }
  }

  static getDerivedStateFromProps( nextprops, prevState ) {
    if ( nextprops.list !== prevState.Data ) {
      return { Data: nextprops.list, xAxis: nextprops.options.xAxis, yAxis: nextprops.options.yAxis }
    }
    return null
  }

  getG2Instance = ( chart ) => {
    this.chartIns = chart;
  };

  render() {
    const { isOrder, winSizeState } = this.props;
    const { xAxis, yAxis, Data } = this.state;
    const num = winSizeState ? 229 : 301
  
    return (
      <div style={isOrder ? { paddingLeft:10, paddingRight:10 } : { paddingLeft:5, paddingRight:5 }}>
        {
          yAxis && yAxis.length > 0 &&
          <div className={styles.chart_legend} style={isOrder ? { top: 20 } : { top:20 }}>
            {yAxis.map( item => <div key={item.key} style={{ color: item.color }}><span style={{ backgroundColor: item.color }} />{item.name}</div> )}
          </div>
        }
        <Chart
          height={isOrder ? num :200}
          forceFit
          padding={isOrder ? [30, 'auto', 50, 'auto'] : [20, 'auto', 60, 'auto']}
        >
          <Legend
            visible={false}
          />
          <Tooltip />
          <View data={Data}>
            <Axis
              name={xAxis}
              tickLine={null}
              grid={null}
              textStyle={{
                fill: '#999'
              }}
              line={{ stroke: '#dddddd', lineWidth: 1 }}
            />
            <Axis name={yAxis[0].key} position="left" grid={null} line={{ stroke: '#dddddd', lineWidth: 1 }} />

            <Geom
              type="line"
              position={`${xAxis}*${yAxis[0].key}`}
              size={2}
              color={yAxis[0].color}
              tooltip={[`${xAxis}*${yAxis[0].key}`, ( ...arg ) => {
                return {
                  name:  yAxis[0].name,
                  title: arg[0],
                  value: arg[1]
                };
              }]}
            />
            <Geom
              type="point"
              shape="circle"
              position={`${xAxis}*${yAxis[0].key}`}
              size={2}
              color={yAxis[0].color}
              tooltip={[`${xAxis}*${yAxis[0].key}`, ( ...arg ) => {
                return {
                  name:  yAxis[0].name,
                  title: arg[0],
                  value: arg[1]
                };
              }]}
            />
          </View>
          <View data={Data}>
            <Axis
              name={xAxis}
              tickLine={null}
              grid={null}
              textStyle={{
                fill: '#999'
              }}
              line={{ stroke: '#dddddd', lineWidth: 1 }}
            />
            <Axis name={yAxis[1].key} position="right" grid={null} line={{ stroke: '#dddddd', lineWidth: 1 }} />

            <Geom
              type="line"
              position={`${xAxis}*${yAxis[1].key}`}
              size={2}
              color={yAxis[1].color}
              tooltip={[`${xAxis}*${yAxis[1].key}`, ( ...arg ) => {
                return {
                  name:  yAxis[1].name,
                  title: arg[0],
                  value: arg[1]
                };
              }]}
            />
            <Geom
              type="point"
              shape="circle"
              position={`${xAxis}*${yAxis[1].key}`}
              size={2}
              color={yAxis[1].color}
              tooltip={[`${xAxis}*${yAxis[1].key}`, ( ...arg ) => {
                return {
                  name:  yAxis[1].name,
                  title: arg[0],
                  value: arg[1]
                };
              }]}
            />
          </View>
        </Chart>
      </div>
    )
  }
}

export default BarChart
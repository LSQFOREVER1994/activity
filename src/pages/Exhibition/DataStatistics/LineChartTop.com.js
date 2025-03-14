import React from "react";
import { Chart, Axis, Tooltip, Geom, Legend, View } from 'bizcharts';
import styles from '../exhibition.less';

// const data = [
//   { date: '0.1', total: 2800, newusers: 22, totalL: 2800, newusersL: 2260, },
//   { date: '0.2', total: 1800, newusers: 130, totalL: 1800, newusersL: 1300, },
//   { date: '0.3', total: 950, newusers: 90, totalL: 950, newusersL: 900, },
//   { date: '0.5', total: 170, newusers: 10, totalL: 170, newusersL: 100, },
//   { date: '0.6', total: 170, newusers: 10, totalL: 170, newusersL: 100, },
//   { date: '0.8', total: 170, newusers: 10, totalL: 170, newusersL: 100, },
// ];



class BarChartTop extends React.PureComponent {
  constructor( props ) {

    const Data = props.list || [];
    const xAxis = props.options.xAxis || 'date'
    const yAxis = props.options.yAxis || [
      { key: 'total', name: '总数', color: '#41a2fc' },
      // { key: 'newusers', name: '新增', color: '#54ca76' }
    ]

    super( props );
    this.state = {
      xAxis,
      yAxis,
      Data,
      type:props.type
    }
  }

  static getDerivedStateFromProps( nextprops, prevState ){
    if ( nextprops.list !== prevState.Data || nextprops.type !== prevState.type ){
 
      const { options: { xAxis, yAxis, }, type, list } = nextprops;
      return { Data: list, type, xAxis, yAxis }
    }
    return null
  }

  getG2Instance = ( chart ) => {
    this.chartIns = chart;
  };

  render() {
    const {  title } = this.props;
    const { xAxis, yAxis, Data } = this.state;
    return (
      <div style={{ paddingLeft: 15, paddingRight:15, position:'relative' }}>
        {
          yAxis && yAxis.length > 1 &&
          <div className={styles.chart_legend}>
            {yAxis.map( item => <div key={item.key} style={{ color: item.color }}><span style={{ backgroundColor: item.color }} />{item.name}</div> )}
          </div>
        }
        {
          title &&
          <div style={{ fontWeight: 'bold' }}>{title}</div>
        }
        <Chart
          height={300}
          forceFit
          padding={[30, 'auto', 40, 'auto']}
        >
          <Legend
            visible={false}
          />

          <Tooltip />
          <View data={Data}>
            {/* x轴 */}
            <Axis
              name={xAxis}
              tickLine={null}
              grid={null}
              textStyle={{
                fill: '#999'
              }}
              line={{ stroke: '#dddddd', lineWidth: 1 }}
            />
            {/* y轴 */}
            <Axis
              name={yAxis[0].key}
              position="left"
              grid={{ type: 'polygon' }} 
              line={null}
            />

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
          </View>
          {/* {yAxis.length >= 2 && 
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
              <Axis name={yAxis[1].key} position="right" grid={null} line={null} />
              <Geom
                type="line"
                position={`${xAxis}*${yAxis[1].key}`}
                size={2}
                color={yAxis[1].color}
                tooltip={[`${xAxis}*${yAxis[1].key}`, ( ...arg ) => {
                  return {
                    name: yAxis[1].name,
                    title: arg[0],
                    value: arg[1]
                  };
                }]}
              />
            </View>
          } */}
          

        </Chart>
      </div>
    )
  }
}

export default BarChartTop
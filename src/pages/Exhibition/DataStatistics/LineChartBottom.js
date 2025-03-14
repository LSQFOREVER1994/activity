import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from '../exhibition.less';


class BarChartBottom extends React.PureComponent {
  
  render() {
    const{ list, options:{ yAxis }, title }=this.props;

    const dataList = [
      ...list.map( item => {return { date: item.date, name: '总排行', value: item.favoriteRankOfAll }} ),
      ...list.map( item => {return { date: item.date, name: '每日排行', value: item.favoriteRankOfDay }} )
    ];

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
        <Chart height={300} data={dataList} padding={[30, 'auto', 40, 'auto']} forceFit>
          <Legend />
          <Axis name="date" />
          <Axis name="value" />
          <Tooltip crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="date*value"
            grid={null}
            line={null}
            color="name"
          />
        </Chart>
      </div>
    );
  }
}


export default BarChartBottom
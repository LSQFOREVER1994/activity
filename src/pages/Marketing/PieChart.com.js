import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Coord,
  Legend,
} from "bizcharts";

import DataSet from "@antv/data-set";

class PieChart extends React.PureComponent {
  render() {
    const { data } = this.props;
    const { DataView } = DataSet;
    const dv = new DataView();
    dv.source( data ).transform( {
      type: "percent",
      field: "amount",
      dimension: "name",
      as: "percent"
    } );
    const cols = {
      percent: {
        formatter: val => {
          val = `${val * 100  }%`;
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          data={dv}
          scale={cols}
          height={215} 
          padding={{ bottom:15, left:'35%' }}
          forceFit
        >
          <Coord type="theta" radius={0.8} innerRadius={0.65} />
          <Axis name="percent" />
          <Legend
            position="left-center"
            offsetX={25}
            // offsetY={-80}
            marker='square'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="name"
            animate={{
              update:{
                duration:0
              }
            }}
            tooltip={[
              "name*percent",
              ( item, percent ) => {
                percent = `${percent * 100  }%`;
                return {
                  name: item,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff",
            }}
          >
            {/* <Label
              content="percent"
              formatter={( val, item ) => {
                return `${item.point.item  }: ${  val}`;
              }}
            /> */}
            {/* <Label
              content="percent"
              offset={-15}
              textStyle={{
                rotate: 0,
                textAlign: "center",
                shadowBlur: 2,
                shadowColor: "rgba(255, 255, 255, .85)",
                fill:'#fff'
              }}
              autoRotate={false}
              formatter={( val, item ) => {
                return `${item.point.amount}`;
              }}
            /> */}
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default PieChart
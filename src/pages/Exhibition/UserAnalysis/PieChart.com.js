import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  
} from "bizcharts";
import DataSet from "@antv/data-set";

class PieChart extends React.Component {
  render() {
    const { DataView } = DataSet;
    const { data } = this.props;
    const dv = new DataView();
    dv.source( data ).transform( {
      type: "percent",
      field: "value",
      dimension: "name",
      as: "percent"
    } );
    const cols = {
      percent: {
        formatter: val => {
          val = `${( val * 100 ).toFixed( 2 ) }%`;
          return val;
        }
      }
    };
    return (
      <div style={{ position:'relative' }}>
        <Chart
          height={300}
          data={dv}
          scale={cols}
          padding={[60, 0, 60, 0]}
          forceFit
        >
          <Coord type="theta" radius={0.85} innerRadius={0.75} />
          <Axis name="percent" />
          <Legend
            position="bottom"
            // offsetY={-window.innerHeight / 2 + 120}
            // offsetX={-100}
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="name"
            tooltip={[
              "name*value",
              ( name, value ) => {
                // value = `${( percent * 100 ).toFixed( 2 ) }%`;
                return {
                  name,
                  value
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              formatter={( val, item ) => {
                return `${item.point.name  }: ${  val}`;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default PieChart;

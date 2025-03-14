import React, { PureComponent } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Coord,
  Label,
  Legend,
  Tooltip
} from "bizcharts";

import DataSet from "@antv/data-set";

class PieChart extends  PureComponent  {
  constructor( props ) {
    super( props );
    this.state = {
      statisticsResult:props.statisticsResult||[]
    };
  }


  componentWillReceiveProps( nextProps ) {
    if ( this.props.statisticsResult !== nextProps.statisticsResult ) {
      this.setState( {
        statisticsResult: nextProps.statisticsResult,
      } );
    }
  }

  render() {
    const { statisticsResult }=this.state
    const { DataView } = DataSet;
    const data =statisticsResult.map( info=>{
      return {
        item:info.key,
        count:parseInt( info.value, 0 ),
      }
    } )

    const dv = new DataView();
    dv.source( data ).transform( {
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    } );
    const cols = {
      percent: {
        formatter: val => {
          val = `${( val * 100 ).toFixed( 2 )  }%`;
          return val;
        }
      }
    };
    return (
      <div>
        <Chart
          height={350}
          data={dv}
          scale={cols}
          padding={[80, 0]}
          forceFit
        >
          <Coord type="theta"  />
          <Axis name="percent" />
          <Legend
            position="bottom"
            offsetY={20}
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li>
              <span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>
              {name}:{value}
              </li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              "item*percent",
              ( item, percent ) => {
                percent = `${( percent * 100 ).toFixed( 2 )  }%`;
                return {
                  name: item,
                  value: percent
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
                return `${item.point.item  }: ${  val}`;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default PieChart
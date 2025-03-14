import React, { PureComponent } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Coord,
  Tooltip
} from "bizcharts";

import DataSet from "@antv/data-set";

class BarChart extends  PureComponent  {
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
    const data =statisticsResult.map( info=>{
      return {
        country:info.key,
        population:parseInt( info.value, 0 ),
      }
    } )
    const defuData=data.reverse()
    const ds = new DataSet();
    const dv = ds.createView().source( defuData );
    return (
      <div>
        <Chart height={350} data={dv} forceFit>
          <Coord transpose />
          <Axis
            name="country"
            label={{
              offset: 1
            }}
          />
          <Geom type="interval" position="country*population" />
        </Chart>
      </div>
    );
  }
}

export default BarChart
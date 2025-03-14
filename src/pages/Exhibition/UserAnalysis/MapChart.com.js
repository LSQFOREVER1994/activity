import React from 'react';
import { Chart, Geom, Tooltip, Legend } from 'bizcharts';
import DataSet from '@antv/data-set';

// 示例地图数据，数据来源DATAV.GeoAtlas: https://datav.aliyun.com/tools/atlas，当前数据只做示例用。
const MAP_URL = 'https://gw.alipayobjects.com/os/basement_prod/a502afb5-d979-443c-9c40-92c0bc297dc9.json';

class MapChart extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      chinaGeo: null,
    };
  }

  componentDidMount() {
    fetch( MAP_URL ).then( v => v.json() ).then( ( v ) => {
      this.setState( { chinaGeo: v } );
    } );
  }

  processGeoData = ( geoData, dataValue ) => {
    const { features } = geoData;
    features.forEach( ( one ) => {
      const name = one && one.properties && one.properties.name;
      dataValue.forEach( ( item ) => {
        if ( name.includes( item.name ) ) {
          one.value = item.value;
        }
      } );
    } );

    const geoDv = new DataSet.View().source( geoData, { type: 'GeoJSON' } );
    return geoDv;
  };

  render() {
   
    const { chinaGeo } = this.state;
    if ( !chinaGeo ) {
      return '数据加载中...';
    }
    const data = this.processGeoData( chinaGeo, this.props.data );
    const scale = {
      latitude: {
        sync: true,
        nice: false,
      },
      longitude: {
        sync: true,
        nice: false,
      },
      value: {
        formatter: val => val||0,
      },
    };
    return [
      <div key="1" style={{ position: 'relative', maxWidth:500, margin:'0 auto' }}>
        <Chart 
          height={500} 
          forceFit 
          scale={scale} 
          data={data} 
          padding={[60, 20, 0, 30]}
        >
          <Geom
            type="polygon"
            position="longitude*latitude"
            // color={['value', ['#31c5f8', '#61d3f8', '#89dcfd', '#b0e8f8', '#d8f3ff']]}
            color={['value', ['#d9f4ff', '#33c5f6']]}
            tooltip={[
              'name*value',
              ( name, value ) => ( {
                name,
                value:value || 0,
              } ),
            ]}
          >
            <Tooltip showTitle={false} />
            <Legend
              position="bottom-left"
              offsetY={-130}
              offsetX={0}
              slidable={false}
              width={250}
            />
          </Geom>
        </Chart>
      </div>,
    ];
  }
}

export default MapChart;

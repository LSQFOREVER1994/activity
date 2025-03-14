import React from "react";
import { connect } from 'dva';
import moment from 'moment';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
} from "bizcharts";
import DataSet from "@antv/data-set";
import { Icon } from "antd";
import IconFont from '@/components/IconFont';
import { isUrl } from '@/utils/utils';
import styles from './index.less';

const getIcon = icon => {
  if ( typeof icon === 'string' ) {
    if ( isUrl( icon ) ) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if ( icon.startsWith( 'icon-' ) ) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

@connect( ( { marketing } ) => ( {
  allThreeSpecs:marketing.allThreeSpecs
} ) )

class HotBasic extends React.Component {

  state = {
    start:moment().subtract( 2, 'days' ).format( 'YYYY-MM-DD' ),
    end:moment().format( 'YYYY-MM-DD' ),
  };

  componentDidMount() {
    this.fetchThreeSpecs()
  }

  // 获取近3日的冠军销量额
  fetchThreeSpecs = () => {
    const { start, end } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'marketing/getThreeSpecs',
      payload: {
        start,
        end
      },
    } );
  }

  render() {
    const { allThreeSpecs } = this.props;
    const threeSpecsList = allThreeSpecs.slice( 0, 3 )

    // 动态生成数据
    const data = threeSpecsList.map( ( item, index ) => {
      return (
        {
           country: `TOP${index+1}`,
           population: item.amount,
           name: item.name      
        }
      )
    } );
    const ds = new DataSet();
    const dv = ds.createView().source( data.reverse() );
    dv.source( data ).transform( {
      type: "sort",

      callback( a, b ) {
        // 排序依据，和原生js的排序callback一致
        return a.population - b.population > 0;
      }
    } );
    return (
      JSON.stringify( allThreeSpecs ) === '[]' ?
        <div style={{ textAlign:'center', color:'#ccc', paddingTop:'30px', boxSizing:'border-box' }}>
          <p style={{ fontSize:'50px', marginBottom:'10px' }}>{getIcon( 'icon-zanwushuju1' )}</p>
          <p>暂无数据</p>
        </div> 
      :
        <div style={{  width:'97%' }}>
          {/* <p style={{ paddingLeft: 15, marginTop:10 }} className={styles.topThreeOrderTit}>热销产品TOP3</p> */}
          <p className={styles.topThreeTit}>热销产品TOP3</p>
          <Chart 
            height={200} 
            data={dv} 
            forceFit
            padding={[0, 150, 0, 60]} 
          >
            <Coord transpose />
            <Axis
              name="country"
              label={{
              offset: 12
            }}
            />
            <Axis name="population" visible={false} />
            <Tooltip
              useHtml
              showTitle={false}
              htmlContent={( title, items ) => {
                return `<li class=${styles.barTooltip}>
                          <p class=${styles.tooltipTit}>${title}</p>
                          <span  class=${styles.tooltipName}>
                            <div class=${styles.tooltipDot}></div>
                            ${items[0].point.point.name}
                          </span>
                          <span  class=${styles.tooltipValue}>${items[0].value}</span>
                      </li>`
                    }}
            />
            <Geom 
              type="interval"
              position="country*population" 
              size={24} 
              // color="rgb(131, 195, 255)"
              color={["name", ["#EB7E65", "#FABC6F", "#FADF6F"]]}
            >
              <Label
                content='云参'
                htmlTemplate={( text, item )=>{
                const { point } = item; // 每个弧度对应的点
                return `
                    <div style="position:relative;left:-10px">
                    <span class="title" style="display: inline-block;width: 140px;font-size:12px">${  point.name  }</span>
                    <br>
                    <span style="font-size:10px">${  point.population  }单</span>
                    </div>
                `;
              }}
              />
            </Geom>
          </Chart>
        </div>
    );
  }
}

export default HotBasic;
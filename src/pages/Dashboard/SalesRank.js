import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
} from "bizcharts";

import { Tabs, Radio, DatePicker } from 'antd';

import moment from 'moment';
import styles from './dashboard.less';

const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect( ( { dashboard } ) => ( {
  goodsSalesList: dashboard.goodsSalesList,
} ) )
class SalesRank extends PureComponent {

  state = {
    start: moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' ),
    end: moment().format( 'YYYY-MM-DD' ),
    saleType: 'goods',
    timeType: 'thisWeek',
  }

  componentWillMount(){
    const { start, end, saleType  } = this.state;
    this.getList( start, end, saleType )
  }


  getList = ( start, end, saleType ) =>{
    const { dispatch } = this.props;
    dispatch( {
      type: saleType === 'goods' ? 'dashboard/getGoodsSales' : 'dashboard/getComboSales',
      payload: {
        start,
        end,
      }
    } )
  }

  timeChange = ( e ) =>{
    const { saleType } = this.state;
    const { value } = e.target;
    let startTime = '';
    let endTime = '';
    if( value === 'today' ){
      startTime = moment().format( 'YYYY-MM-DD' );
      endTime = moment().format( 'YYYY-MM-DD' );
    } else if( value === 'thisWeek' ){
      startTime = moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' );
      endTime = moment().format( 'YYYY-MM-DD' );
    } else if( value === 'thisMonth' ){
      startTime = moment().subtract( 'days', 29 ).format( 'YYYY-MM-DD' );
      endTime = moment().format( 'YYYY-MM-DD' );
    }
    this.setState( { start: startTime, end: endTime, timeType: value } )
    this.getList( startTime, endTime, saleType )
    

  }

  tabChange = ( saleType ) =>{
    const { start, end } = this.state;
    this.getList( start, end, saleType );
    this.setState( { saleType } );
  }

  rangeChange = ( time ) =>{
    const { saleType } = this.state;
    const start = moment( time[0] ).format( 'YYYY-MM-DD' );
    const end = moment( time[1] ).format( 'YYYY-MM-DD' );
    this.setState( { start, end, timeType: ''  } )
    this.getList( start, end, saleType )
  }

  renderTabRight = () =>{
    const { start, end, timeType } = this.state;
    return(
      <div>
        <RadioGroup value={timeType} onChange={this.timeChange} defaultValue="today">
          <RadioButton value="today">今天</RadioButton>
          <RadioButton value="thisWeek">近7天</RadioButton>
          <RadioButton value="thisMonth">近30天</RadioButton>
        </RadioGroup> 
        <RangePicker
          allowClear={false}
          // ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')] }}
          value={[moment( start ), moment( end )]}
          onChange={this.rangeChange}
          disabledDate={this.disabledDate}
          style={{ marginLeft: '20px', width: '300px ' }}
        />
      </div>
    )
  }

  disabledDate = ( current ) => {
    return current && current > moment().endOf( 'day' );
  }

  renderChar = ( goodsSalesList ) =>{
    return(
      <div style={{ padding: '0px 30px' }}>
        {
          goodsSalesList.length?
            <Chart
              style={{ margin:0 }} 
              // height={400}
              height={goodsSalesList.length > 8 ? ( goodsSalesList.length * 50 ) : 400}
              data={goodsSalesList}
              scale={
                {
                  sales:{
                    type:"interval",
                    tickInterval:10,
                  },
                }
              }
              forceFit
            >
              <Coord transpose />
              <Axis
                name="name"
                label={{
                offset: 8,
                htmlTemplate( text ) {
                  return `<div class=${styles.labelName}>${text}</div>`
                }
            }}
              />
              <Axis name="amount" />
              <Tooltip />
              <Geom
                size={30}
                tooltip={['name*amount', ( name, amount ) => {
                return {
                  // 自定义 tooltip 上显示的 title 显示内容等。
                  name: '销售额',
                  title: name,
                  value: amount
                };
              }]}
                type="interval"
                position="name*amount"
              />
            </Chart> : <div className={styles.nullData}>暂无数据</div>
        }
      </div>
    )
  }

  render() {
    const { goodsSalesList, containerWidth } = this.props;
    return (
      <div className={styles.salesRank}>
        <div className={styles.salesTitle}>销售排行</div>
        <Tabs
          tabBarStyle={{ padding: '0px 15px' }}
          onChange={this.tabChange}
          tabBarExtraContent={containerWidth < 850 ? null : this.renderTabRight()}
        >
          <TabPane tab="商品" key="goods">
            { this.renderChar( goodsSalesList ) }
          </TabPane>
          <TabPane tab="套餐" key="combo">
            { this.renderChar( goodsSalesList ) }
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default SalesRank;

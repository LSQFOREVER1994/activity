import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import DataSet from "@antv/data-set";
import { Radio, DatePicker, Spin, Button, Divider, Table, Icon } from 'antd';
import moment from 'moment';
import { exportXlsx } from '@/utils/utils';
import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect( ( { statistics } ) => ( {
  loading: statistics.loading,
  eventDaily: statistics.eventDaily,
  eventSum: statistics.eventSum,
  eventValueSum: statistics.eventValueSum,
} ) )
class Census extends PureComponent {

  state = {
    from: moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' ),
    to: moment().format( 'YYYY-MM-DD' ),
    timeType: 'thisWeek',
    showDetail: false,
    activeKey: 'triggers',
  }

  tableColums = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '消息数量',
      dataIndex: 'triggers',
      key: 'triggers'
    },
    {
      title: '独立用户数',
      dataIndex: 'users',
      key: 'users'
    },
  ];

  componentWillMount(){
    this.initEventChartsData();
  }

  initEventChartsData = () => {
    const { from, to } = this.state;
    const { dispatch, appId, name } = this.props;
    dispatch( {
      type: 'statistics/getEventDaily',
      payload:{
        from, to, appId, name
      }
    } );
    dispatch( {
      type: 'statistics/getEventValueSum',
      payload: {
        from,
        to,
        appId,
        name,
      },
    } );
  }

  timeChange = ( e ) =>{
    const { value } = e.target;
    let fromTime = '';
    let toTime = '';
    if( value === 'today' ){
      fromTime = moment().format( 'YYYY-MM-DD' );
      toTime = moment().format( 'YYYY-MM-DD' );
    } else if( value === 'thisWeek' ){
      fromTime = moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' );
      toTime = moment().format( 'YYYY-MM-DD' );
    } else if( value === 'thisMonth' ){
      fromTime = moment().subtract( 'days', 29 ).format( 'YYYY-MM-DD' );
      toTime = moment().format( 'YYYY-MM-DD' );
    }
   
    this.setState( { from: fromTime, to: toTime, timeType: value }, () => {
      this.initEventChartsData();
    } )
  }

  rangeChange = ( time ) =>{
    const from = moment( time[0] ).format( 'YYYY-MM-DD' );
    const to = moment( time[1] ).format( 'YYYY-MM-DD' );
    this.setState( { from, to, timeType: '' }, () => {
      this.initEventChartsData();
    } );
  }

  // 导出
  exportEvent=()=>{
    const { from, to  } = this.state;
    const { appId, name } = this.props;

    exportXlsx( {
      type:'statisticsService',
      uri: `statistics/event/daily/export?from=${from || ''}&to=${to || ''}&appId=${appId || ''}`,
      xlsxName: `${name || ''}事件导出列表.xls`,
      callBack: () => {}
    } )
  }

  onActiveKeyChange = ( e ) => {
    this.setState( { activeKey: e.target.value } );
  }

  renderTabRight = () =>{
    const { from, to, timeType } = this.state;
    return(
      <div>
        <RadioGroup value={timeType} onChange={this.timeChange} defaultValue="today">
          <RadioButton value="thisWeek">近7天</RadioButton>
          <RadioButton value="thisMonth">近30天</RadioButton>
        </RadioGroup>

        <RangePicker
          allowClear={false}
          value={[moment( from ), moment( to )]}
          onChange={this.rangeChange}
          style={{ marginLeft: '20px', width: '300px ' }}
        />
      </div>
    )
  
  }
  
  renderChar = () => {
    const { eventDaily } = this.props;
    const { activeKey } = this.state;
    const cols = {
      time: { range: [0, 1] },
      sum: {
        tickCount: 6,
      },
    };
 
     const ds = new DataSet();
     const dv = ds.createView().source( eventDaily );
     const fields = [activeKey]
     dv.transform( {
       type: 'fold',
       fields, // 展开字段集
       value: activeKey, // value字段
     } );
     const axisLabel = val => {
      let value = '';
      if ( val > 10000 ) {
        value = `${val / 10000}万`;
      } else{
        value = val;
      }
      return value;
    }
    return eventDaily.length ?
      <Chart 
        height={400}
        data={dv}
        padding={{ top: 30, right: 60, bottom: 60, left: 70 }}
        scale={cols}
        forceFit
      >
        <Axis name="date" label={{ autoRotate: false }} />
        <Axis name={activeKey} label={{ formatter: val => axisLabel( val ) }} />
        <Tooltip 
          crosshairs={{ type: "y" }} 
        />
        <Geom
          type="line"
          position={`date*${activeKey}`}
          size={2}
          tooltip={[`date*${activeKey}`, ( time, sum ) => {
            return {
              title: time.substring( 0, 10 ),
              value: sum
            };
          }]}
        />
      </Chart>
    : <div className={styles.nullData}>暂无数据</div>
  }

  render() {
    const { eventDaily, eventValueSum, loading } = this.props
    const { activeKey, showDetail } = this.state;

    const sumTriggers = eventValueSum.reduce( ( p, e )=> p + e.triggers, 0 );

    const columns = [
      {
        title: <span>参数值</span>,
        dataIndex: 'value',
        render: data => <span>{data || '--'}</span>,
      },
      {
        title: <span>消息数量</span>,
        dataIndex: 'triggers',
        render: data => <span>{data || '--'}</span>,
      },
      {
        title: <span>占比</span>,
        dataIndex: 'triggers',
        render: triggers => <span>{Number( triggers / sumTriggers * 100 ).toFixed( 2 )}%</span>,
      },
    ];

    return (
      <Spin spinning={loading}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 15px', backgroundColor: 'rgb(247, 248, 250)' }}>
          <span style={{ fontSize: '16px', color: '#252934' }}>数据趋势</span>
          { this.renderTabRight() }
        </div>
        <div style={{ backgroundColor: 'white', padding: '0 15px' }}>
          <Radio.Group value={activeKey} onChange={this.onActiveKeyChange} style={{ padding: '15px 0' }}>
            <Radio.Button value="triggers">消息数量</Radio.Button>
            <Radio.Button value="users">独立用户数</Radio.Button>
          </Radio.Group>
          { this.renderChar() }
          <Divider style={{ margin: '0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="link" onClick={() => this.setState( { showDetail: !showDetail } )}>{showDetail ? '收起明细数据' : '展开明细数据'}<Icon type={showDetail ? 'up' : 'down'} /></Button>
            <Button type="link" onClick={this.exportEvent}><Icon type="download" />导出</Button>
          </div>
          { showDetail && <Table size="middle" dataSource={eventDaily} columns={this.tableColums} pagination={{ defaultPageSize: 20 }} /> }
        </div>

        { eventValueSum && eventValueSum.length > 0 &&
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white' }}>
            <Table
              size="middle"
              rowKey="name"
              columns={columns}
              loading={loading}
              pagination={{ defaultPageSize: 20 }}
              dataSource={eventValueSum}
            />
          </div> 
        }
      </Spin>
    );
  }
}

export default Census;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Chart, Geom, Axis, Tooltip, } from "bizcharts";
import DataSet from "@antv/data-set";
import { Radio, DatePicker, Spin, Divider, Icon, Button, Table } from 'antd';
import moment from 'moment';
import { exportXlsx } from '@/utils/utils';
import styles from './pageBrowseData.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect( ( { statistics } ) => ( {
  appDaily: statistics.appDaily,
  loading: statistics.loading,
} ) )
class AppDaily extends PureComponent {

  state = {
    from: moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' ),
    to: moment().format( 'YYYY-MM-DD' ),
    timeType: 'thisWeek',
    activeKey: 'newUv',
    showDetail: false
  }

  tableColums = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: '新增用户',
      dataIndex: 'newUv',
      key: 'newUv'
    },
    {
      title: '活跃用户',
      dataIndex: 'uv',
      key: 'uv'
    },
    {
      title: '启动次数',
      dataIndex: 'pv',
      key: 'pv'
    },
    // {
    //   title: '独立IP数',
    //   dataIndex: 'ips',
    //   key: 'ips'
    // },
    {
      title: '累计用户',
      dataIndex: 'totalUv',
      key: 'totalUv'
    }
  ];

  componentWillMount() {
    const { from, to } = this.state;
    this.initChartsData( from, to );
  }

  initChartsData = ( from, to ) => {
    const { dispatch, appId } = this.props;
    dispatch( {
      type: 'statistics/getAppDaily',
      payload: {
        from, to, appId
      }
    } );
  }

  timeChange = ( e ) => {
    const { value } = e.target;
    let fromTime = '';
    let toTime = '';
    if ( value === 'today' ) {
      fromTime = moment().format( 'YYYY-MM-DD' );
      toTime = moment().format( 'YYYY-MM-DD' );
    } else if ( value === 'thisWeek' ) {
      fromTime = moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' );
      toTime = moment().format( 'YYYY-MM-DD' );
    } else if ( value === 'thisMonth' ) {
      fromTime = moment().subtract( 'days', 29 ).format( 'YYYY-MM-DD' );
      toTime = moment().format( 'YYYY-MM-DD' );
    }

    this.setState( { from: fromTime, to: toTime, timeType: value }, () => {
      this.initChartsData( fromTime, toTime );
    } )
  }

  rangeChange = ( time ) => {
    const from = moment( time[0] ).format( 'YYYY-MM-DD' );
    const to = moment( time[1] ).format( 'YYYY-MM-DD' );
    this.setState( { from, to, timeType: '' }, () => {
      this.initChartsData( from, to );
    } );
  }

  // 导出
  exportCensus = () => {
    const { from, to } = this.state;
    const { appId } = this.props;

    exportXlsx( {
      type: 'statisticsService',
      uri: `statistics/app/daily/export?from=${from || ''}&to=${to || ''}&appId=${appId || ''}`,
      xlsxName: `埋点-每日数据趋势.xls`,
      callBack: () => { }
    } )
  }


  onActiveKeyChange = ( e ) => {
    this.setState( { activeKey: e.target.value } );
  }

  renderTabRight = () => {
    const { from, to, timeType } = this.state;
    return (
      <div>
        <RadioGroup
          value={timeType}
          onChange={this.timeChange}
          defaultValue="today"
          style={{ marginRight: '20px' }}
        >
          <RadioButton value="today">今日</RadioButton>
          <RadioButton value="thisWeek">近7天</RadioButton>
          <RadioButton value="thisMonth">近30天</RadioButton>
        </RadioGroup>
        <RangePicker
          allowClear={false}
          value={[moment( from ), moment( to )]}
          onChange={this.rangeChange}
        />
      </div>
    )
  }

  renderChar = () => {
    const { appDaily } = this.props;
    const { activeKey } = this.state;
    const cols = {
      time: { range: [0, 1] },
      sum: {
        tickCount: 6,
      },
    };

    const ds = new DataSet();
    const dv = ds.createView().source( appDaily );
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
      } else {
        value = val;
      }
      return value;
    }
    return appDaily.length ?
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
    const { appDaily, loading } = this.props;
    const { activeKey, showDetail } = this.state;

    return (
      <Spin spinning={loading}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 15px', backgroundColor: 'rgb(247, 248, 250)' }}>
          <span style={{ fontSize: '16px', color: '#252934' }}>数据趋势</span>
          {this.renderTabRight()}
        </div>
        <div style={{ backgroundColor: 'white', padding: '0 15px' }}>
          <Radio.Group value={activeKey} onChange={this.onActiveKeyChange} style={{ padding: '15px 0' }}>
            <Radio.Button value="newUv">新增用户</Radio.Button>
            <Radio.Button value="uv">活跃用户</Radio.Button>
            <Radio.Button value="pv">启动次数</Radio.Button>
            {/* <Radio.Button value="ips">独立IP数</Radio.Button> */}
            <Radio.Button value="totalUv">累计用户</Radio.Button>
          </Radio.Group>
          {this.renderChar()}
          <Divider style={{ margin: '0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="link" onClick={() => this.setState( { showDetail: !showDetail } )}>{showDetail ? '收起明细数据' : '展开明细数据'}<Icon type={showDetail ? 'up' : 'down'} /></Button>
            <Button type="link" onClick={this.exportCensus}><Icon type="download" />导出</Button>
          </div>
          {showDetail && <Table size="middle" dataSource={appDaily} columns={this.tableColums} pagination={{ defaultPageSize: 20 }} />}
        </div>
      </Spin>
    );
  }
}

export default AppDaily;

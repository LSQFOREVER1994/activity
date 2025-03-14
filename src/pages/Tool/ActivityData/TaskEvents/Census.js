import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Chart, Geom, Axis, Tooltip, } from "bizcharts";
import { Tabs, Radio, DatePicker, Spin, Button } from 'antd';
import moment from 'moment';
import { exportXlsx } from '@/utils/utils';
import styles from './Task.less';

const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect( ( { taskEvents } ) => ( {
  loading: taskEvents.loading,
  taskCensueList: taskEvents.taskCensueList,
} ) )
class Census extends PureComponent {

  constructor( props ){

    const taskId = props.taskId ||  '';
    super( props );
    this.state = {
      taskId,
      from: moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' ),
      to: moment().format( 'YYYY-MM-DD' ),
      timeType: 'thisWeek',
      type:'ATTEND_COUNT',
    }
  }



  componentWillMount(){
    this.initChartsData();
  }

  // 获取任务统计详情
  initChartsData = () => {
    const { taskId, from, to, type } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'taskEvents/initChartsData',
      payload:{
        taskId, from, to, type
      }
    } )
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
      this.initChartsData( fromTime, toTime );
    } )
  }

  rangeChange = ( time ) =>{
    const from = moment( time[0] ).format( 'YYYY-MM-DD' );
    const to = moment( time[1] ).format( 'YYYY-MM-DD' );
    this.setState( { from, to, timeType: '' }, () => {
      this.initChartsData( from, to );
    } );
  }

  // 导出
  exportCensus = () => {
    const { from, to, taskId } = this.state;
    exportXlsx( {
      type:'taskService',
      uri: `statistic/export?taskId=${taskId}&from=${from}&to=${to}`,
      xlsxName: `${from}-${to}任务事件详情导出列表.csv`,
      callBack: () => {}
    } )
  }

  tabChange=( val )=>{
    this.setState( { type:val }, ()=>this.initChartsData() )
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
        <Button style={{ marginLeft:'20px' }} onClick={this.exportCensus}>导出</Button>
      </div>
    )
  }

  render() {
    const { taskCensueList, loading, goList } = this.props;

    return (
      <div className={styles.salesRank}>
        <div style={{ cursor:'pointer' }} onClick={goList}>{`<`}&nbsp;返回&nbsp;</div>
        <Spin spinning={loading}>
          <Tabs
            tabBarStyle={{ padding: '15px' }}
            tabBarExtraContent={this.renderTabRight()}
            onChange={this.tabChange}
          >
            <TabPane
              tab="完成次数"
              key="ATTEND_COUNT"
            >
              {
                taskCensueList ? 
                  <div>
                    <Chart height={400} data={taskCensueList} padding={{ top: 30, right: 60, bottom: 60, left: 70 }} forceFit>
                      <Axis name="date" label={{ autoRotate: false }} />
                      <Axis name='attendCount' label={{ autoRotate: false }} />
                      <Tooltip
                        crosshairs={{
                        type: "y"
                      }}
                      />
                      <Geom
                        type="line"
                        position='date*attendCount'
                        size={2}
                        tooltip={['date*attendCount', ( date, attendCount )=>{
                          return{
                            title: date,
                            value: `完成次数${attendCount}`
                          }
                        }]}
                      />
                    </Chart>
                  </div>
                : <div className={styles.nullData}>暂无数据</div>
              }
            </TabPane>
            <TabPane
              tab="完成用户数"
              key="USER_COUNT"
            >
              {
                taskCensueList ?
                  <div>
                    <Chart height={400} data={taskCensueList} padding={{ top: 30, right: 60, bottom: 60, left: 70 }} forceFit>
                      <Axis name="date" label={{ autoRotate: false }} />
                      <Axis name='userCount' label={{ autoRotate: false }} />
                      <Tooltip
                        crosshairs={{
                        type: "y"
                      }}
                      />
                      <Geom
                        type="line"
                        position='date*userCount'
                        size={2}
                        tooltip={['date*userCount', ( date, userCount )=>{
                          return{
                            title: date,
                            value: `完成用户数${userCount}`
                          }
                        }]}
                      />
                    </Chart>
                  </div>
                : <div className={styles.nullData}>暂无数据</div>
              }
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default Census;

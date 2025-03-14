import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Radio, DatePicker, Tooltip, Icon } from 'antd';
import { exportXlsx } from '@/utils/utils';
import moment from 'moment';
import router from 'umi/router';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect( ( { statistics } ) => ( {
  loading: statistics.loading,
  eventSum: statistics.eventSum,
} ) )
@Form.create()
class Event extends PureComponent {


  fetchInit = {
    pageNum: 1,
    pageSize: 10,
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };


  state={
    from: moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' ),
    to: moment().format( 'YYYY-MM-DD' ),
    timeType: 'thisWeek',
  }


  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    const { from, to } = this.state;
    const { dispatch, appId } = this.props;
    dispatch( {
      type: 'statistics/getEventSum',
      payload: {
        from,
        to,
        appId
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
      this.fetchList();
    } )
  }

  rangeChange = ( time ) =>{
    const from = moment( time[0] ).format( 'YYYY-MM-DD' );
    const to = moment( time[1] ).format( 'YYYY-MM-DD' );
    this.setState( { from, to, timeType: '' }, () => {
      this.fetchList();
    } );
  }

  jumpEventDetail = ( e, name, type ) => {
    e.stopPropagation();
    const { appId } = this.props;
    router.push( `/statistics/app/event?name=${name}&appid=${appId}&type=${type}` );
  }

  exportEvent=()=>{
    const { from, to  } = this.state;
    const { appId, name } = this.props;

    exportXlsx( {
      type:'statisticsService',
      uri: `statistics/event/daily/sum/export?from=${from || ''}&to=${to || ''}&appId=${appId || ''}`,
      xlsxName: `${name || ''}事件导出列表.xls`,
      callBack: () => {}
    } )
  }


  render() {
    const {
      from, to, timeType,
    } = this.state;

    const {
      loading,
      eventSum
    } = this.props;

    const columns = [
      {
        title: <span>事件名</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: () => (
          <span>
            总消息数量
            <Tooltip placement="top" title='日期范围内事件触发的总次数'>
              <Icon style={{ fontSize:'15px', marginLeft:'10px' }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        dataIndex: 'triggers',
        render: triggers => <span>{triggers}</span>,
        sorter: ( a, b ) => a.triggers - b.triggers,
        defaultSortOrder: 'descend',
      },
      {
        title: () => (
          <span>
            人均点击
            <Tooltip placement="top" title='总消息数/每日的总用户数'>
              <Icon style={{ fontSize:'15px', marginLeft:'10px' }} type="question-circle" />
            </Tooltip>
          </span> ),
        dataIndex: 'users',
        render: ( users, record ) => <span>{users && Number( record.triggers / record.users ).toFixed( 2 )}</span>,
      },
      {
        title: '详情',
        render: ( text, record ) => (
          <div>
            <Button
              style={{ display: 'block' }}
              type="ghost"
              shape="circle"
              icon="eye"
              onClick={( e ) => this.jumpEventDetail( e, record.name, record.type )}
            />
          </div>
        ),
      },
    ];

    return (
      <div style={{ backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 15px', backgroundColor: 'rgb(247, 248, 250)' }}>
          <span style={{ fontSize: '16px', color: '#252934' }}>事件统计</span>
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
            <Tooltip placement="topRight" title='导出时间范围内事件的每日数据统计'>
              <Button style={{ marginLeft:'20px' }} onClick={this.exportEvent}>导出</Button>
            </Tooltip>
          </div>
        </div>

        <Table
          style={{ margin: '15px' }}
          size="middle"
          rowKey="name"
          columns={columns}
          loading={loading}
          pagination={false}
          dataSource={eventSum}
        />
      </div>
    );
  }
}

export default Event;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Radio, DatePicker, Tooltip, Icon } from 'antd'
import moment from 'moment';
import styles from './index.less'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@connect( ( { statistics } ) => {
  return{
    rateDaily: statistics.rateDaily,
    loading: statistics.loading,
  }
} )
class UserRate extends PureComponent {

  state={
    from: moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' ),
    to: moment().format( 'YYYY-MM-DD' ),
    timeType: 'thisWeek',
    rateType: 'NEW_UV'
  }

  componentWillMount(){
    this.fetchList();
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

  rateChange = ( e ) => {
    const { value } = e.target;
    this.setState( { rateType: value }, () => {
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

  fetchList = () => {
    const { dispatch, appId } = this.props;
    const { from, to, rateType } = this.state;
    dispatch( {
      type: 'statistics/getRateDaily',
      payload:{
        from, to, appId, type: rateType
      }
    } );
  }

  render() {
    const {
      from, to, timeType, rateType
    } = this.state;

    const {
      loading,
      rateDaily,
    } = this.props;

    const columns = [
      {
        title: '时间',
        dataIndex: 'date',
      },
      {
        title: rateType === 'NEW_UV' ? '新增用户' : '活跃用户',
        dataIndex: 'num',
      },
      
    ];

    for( let i = 1; i <= 7; i+=1 ) {
      columns.push( {
        title: `${i}天后`,
        dataIndex: `day${i}`,
        render: value => value !== undefined && `${value}%`,
        align: 'center',
        onCell: ( record ) => {
          const value = record[`day${i}`];
          if ( value ) {
            if ( value> 80 ) {
              return { className: styles.rateL3 };
            }
            if ( value > 50 ) {
              return { className: styles.rateL2 };
            }
            if ( value > 20 ) {
              return { className: styles.rateL1 };
            }
            return { className: styles.rateL0 };
          }
          return { className: "" };
        }
      } );
    }

    return (
      <div style={{ backgroundColor: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 15px', backgroundColor: 'rgb(247, 248, 250)' }}>
          <div>
            <RadioGroup value={rateType} onChange={this.rateChange} defaultValue="today">
              <RadioButton value="NEW_UV">新用户存留</RadioButton>
              <RadioButton value="UV">活跃用户存留</RadioButton>
            </RadioGroup>
            <Tooltip
              placement="top"
              title='某段时间内的新增用户（活跃用户），经过一段时间后，又继续使用应用的被认作是留存用户；
                    这部分用户占当时新增用户（活跃用户）的比例即是留存率。
                    例如，7月5日新增用户200，这200人在6日动过应用的有100人，7日启动过应用的有80人，8日启动过应用的有50人；
                    则7月5日新增用户1日后的留存率是50%，2日后的留存率是40%，3日后的留存率是25%。
                    '
            >
              <Icon style={{ fontSize:'15px', marginLeft:'10px' }} type="question-circle" />
            </Tooltip>
          </div>
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
        </div>
        <Table
          size="middle"
          rowKey="date"
          style={{ margin: '15px' }}
          loading={loading}
          columns={columns}
          pagination={false}
          dataSource={rateDaily}
        />
      </div>
    );
  }
}

export default UserRate;


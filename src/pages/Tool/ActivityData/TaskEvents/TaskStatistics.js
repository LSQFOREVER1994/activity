import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Radio, DatePicker } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Census from "./Census";
import styles from './Task.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const typeObj ={
  DAILY:'次/每日',
  DURING :'次'
}


@connect( ( { taskEvents } ) => ( {
  loading: taskEvents.loading,
  taskStatisticsList: taskEvents.taskStatisticsList,
} ) )
@Form.create()
class TaskStatistics extends PureComponent {

  fetchInit = {
    pageNum: 1,
    pageSize: 10,
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  constructor( props ){
    super( props );
    const activityId = props.id ||  '';
    this.state = {
      isList:true,
      activityId,
      from: moment().subtract( 'days', 6 ).format( 'YYYY-MM-DD' ),
      to: moment().format( 'YYYY-MM-DD' ),
      timeType: 'thisWeek',
      pageNum: 1,
      pageSize: 10,
    };
  }




  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    const { from, to, pageNum, pageSize, activityId } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'taskEvents/getTaskStatistics',
      payload: {
        activityId,
        from,
        to,
        pageNum,
        pageSize,
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
    const to = moment( time[1] ).format( 'YYYY-MM-DD'  );
    this.setState( { from, to, timeType: '' }, () => {
      this.fetchList();
    } );
  }

  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, () => {
      this.fetchList();
    } );
  }

  goDetail=( id )=>{
    this.setState( { taskId:id, isList:false } )
  }

  goList=()=>{
    this.setState( { isList:true } )
  }

  render() {
    const { pageSize, pageNum, from, to, timeType, isList, taskId } = this.state;
    const { loading, taskStatisticsList: { total, list } } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
    };

    const columns = [
      {
        title: <span>任务名称</span>,
        dataIndex: 'name',
        align: 'center',
        render: name => <span>{name}</span>
      },
      {
        title: <span>事件名称</span>,
        dataIndex: 'eventName',
        align: 'center',
        render:eventName=><span>{eventName || '--'}</span>
      },
      {
        title:<span>任务上限</span>,
        dataIndex:'attendLimit',
        align: 'center',
        render:( attendLimit, item )=>{
          if( attendLimit !==undefined && item.type ){
          return <span>{`${attendLimit}${typeObj[item.type]}`}</span>
          }
          return <span>--</span>
        }
      },
      {
        title: <span>完成次数</span>,
        align:'center',
        dataIndex: 'attendCount',
        render: attendCount => <span>{attendCount || '--'}</span>,
      },
      {
        title: <span>完成用户数</span>,
        align:'center',
        dataIndex: 'userCount',
        render: userCount => <span>{userCount || '--'}</span>,
      },
      {
        title: '详情',
        render: ( text, record ) => (
          <Button
            style={{ display: 'block' }}
            type="ghost"
            shape="circle"
            icon="eye"
            onClick={() => this.goDetail( record.id )}
          />
        ),
      },
    ];

    return (
      <GridContent>
        {
          isList ?
            <div className={styles.standardList}>
              <div className={styles.searchBox}>
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
              <Table
                size="large"
                rowKey="name"
                columns={columns}
                loading={loading}
                pagination={paginationProps}
                dataSource={list}
                onChange={this.tableChange}
              />
            </div>
          :
            <Census taskId={taskId} goList={this.goList} />
        }
      </GridContent>
    
    );
  }
}

export default TaskStatistics;


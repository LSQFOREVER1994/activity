import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import moment from 'moment';



@connect( ( { marketing } ) => ( {
  loading: marketing.loading,
  nowActivityList: marketing.nowActivityList,
} ) )

class NowActivity extends PureComponent {
  state = {
    pageNum: 1,
    pageSize:3,
  };

  componentDidMount() {
    this.fetchNowActivityList( {} );
  };



  // 获取正在进行活动列表
  fetchNowActivityList = () => {
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'marketing/getNowActivityList',
      payload: {
        pageNum,
        pageSize,
        isSale:true,
        activityState:'GOING',
        orderBy: 'start_time desc',
      },
    } );
  }


  render() {
    const { nowActivityList:{ list }, loading } = this.props;

    const columnsNowActivity = [
      {
        title: <span>活动名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
        render: startTime => <span>{startTime}</span>,
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        render: endTime => <span>{endTime}</span>,
      },
      {
        title: <span>距离结束天数</span>,
        dataIndex: 'lastDays',
        render: ( id, item ) =>
          <div style={{ width:105 }}>
            <div style={{ width:'70px', height:'10px', borderRadius:'8px', backgroundColor:'#eee', float:'left', marginTop:'6px' }}>
              <div style={{ width:( item.lastDays )/( moment( item.endTime ).diff( moment( item.startTime ), 'days' ) )*70, height:'10px', borderRadius:'8px', backgroundColor:'#46A2F6' }} />
            </div>
            <span style={{ float:'right' }}>{item.lastDays}天</span>
          </div>
      },
      {
        title: <span>参与人数</span>,
        dataIndex: 'attendCount',
        render: attendCount => <span>{attendCount}人</span>,
      },
    ]


    return (
      <Table
        size="large"
        rowKey="id"
        columns={columnsNowActivity}
        loading={loading}
        dataSource={list}
        pagination={false}
        bordered={false}
      />
    );
  }
}

export default NowActivity;

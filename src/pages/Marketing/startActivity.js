import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './index.less';
import Title from './Title.com';

@connect( ( { marketing } ) => ( {
  loading: marketing.loading,
  startActivityList:marketing.startActivityList
} ) )

class StartActivity extends PureComponent {

  constructor( props ){
    super( props )
    this.state={
      pageNum: 1,
      pageSize:props.winSizeState ? 5 : 7,
    }
  }


  componentDidMount() {
    this.fetchStartActivityList( {} );
  };

  // 获取即将活动列表
  fetchStartActivityList = () => {
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'homePage/getStartActivityList',
      payload: {
        pageNum,
        pageSize,
        isSale:true,
        activityState:'COMING',
        orderBy: 'end_time desc',
      },
    } );
  }

  render() {
    const { startActivityList:{ list }, loading } = this.props;

    const columnsStartActivity =[
      {
        title: <span style={{ paddingLeft:7 }}>活动名称</span>,
        dataIndex: 'name',
        // ellipsis: true,
        render: name => <span style={{ color: '#000', paddingLeft: 7, fontSize:13 }}>{name}</span>,
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
        // width:100,
        align: 'center',
        render: startTime => <span style={{ fontSize:12, color:'#999' }}>{startTime}</span>,
      },
      {
        title: <span>活动天数</span>,
        dataIndex: 'lastDays',
        align:'center',
        render: lastDays => <span>{lastDays}</span>,
      },
    ]

    return (
      <div className={styles.table_box}>
        <Title name="活动待开始" style={{ marginBottom: 5 }}>
          {
            list && <span style={{ color: '#1890FF' }}>{list.length}个</span>
          }
        </Title>
        <Table 
          size="small"
          rowKey="name"
          loading={loading}
          columns={columnsStartActivity}
          dataSource={list}
          pagination={false}
          bordered={false}
        />
      </div>
    );
  }
}

export default StartActivity;

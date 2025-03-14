
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';

@connect( ( { integralRank } ) => {
  return {
    loading: integralRank.loading,
    integralRecordMap: integralRank.integralRecordMap,
  }
} )

class GuessRank extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  };

  componentDidMount() {
    this.getIntegralRecords();
  };

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getIntegralRecords();
    } )
  }

  // 获取活动列表
  getIntegralRecords = ( ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, detailInfo, id } = this.props;
    dispatch( {
      type: 'integralRank/getIntegralRecords',
      payload: {
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        activityId: id,
        userId: detailInfo.userId,
        periods: detailInfo.periods,
      },
    } );
  }


  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }

    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getIntegralRecords() );
  };


  exportRecord = () => {

  }

  render() {
    const { loading, integralRecordMap: { total, list }, detailInfo } = this.props;
    const { pageSize, pageNum, sortedInfo, } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      }
    };

    const columns = [
      {
        title: <span>事件</span>,
        dataIndex: 'source',
        key: 'source',
        render: ( source ) => <span>{source}</span>,
      },
      {
        title: <span>积分变动</span>,
        dataIndex: 'score',
        key: 'score',
        render: score => <span>{score}</span>,
      },
      {
        title: <span>总积分</span>,
        dataIndex: 'currentScore',
        key: 'currentScore',
        render: currentScore => {
          return <span>{`${currentScore > 0 ? '+' : ''}${currentScore}` }</span>
        }
      },
      {
        title: <span>时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          用户：{detailInfo && detailInfo.username ? detailInfo.username : detailInfo && detailInfo.user && ( detailInfo.user.username || detailInfo.user.account || detailInfo.user.mobile )}
          <Button onClick={this.exportRecord} type='primary' style={{ marginRight: 15 }}>导出</Button>

        </div>
        <Table
          size="middle"
          rowKey="id"
          columns={columns}
          loading={loading}
          pagination={paginationProps}
          dataSource={list}
          onChange={this.tableChange}
        />
      </div>
    );
  };
}

export default GuessRank;

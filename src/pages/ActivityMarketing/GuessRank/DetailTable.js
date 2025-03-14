
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import moment from 'moment';

const codeObj = {
  SHENZHEN_INDEX: '深证指数',
  SHANGHAI_INDEX: '上证指数',
  GEM_INDEX: '创业板指数',
};

@connect( ( { guessRank } ) => {
  return {
    loading: guessRank.loading,
    guessRecordMap: guessRank.guessRecordMap,
  }
} )

class GuessRank extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'update_time',
      field: 'updateTime',
      order: 'descend',
    },
  };

  componentDidMount() {
    this.getGuessRecords();
  };

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getGuessRecords();
    } )
  }

  // 获取活动列表
  getGuessRecords = ( ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, detailInfo } = this.props;
    dispatch( {
      type: 'guessRank/getGuessRecords',
      payload: {
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        activityId: detailInfo.activityId,
        userId: detailInfo.userId,
        periods: detailInfo.periods,
      },
    } );
  }


  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getGuessRecords() );
  };


  render() {
    const { loading, guessRecordMap: { total, list }, detailInfo } = this.props;
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
        title: <span>竞猜标的</span>,
        dataIndex: 'indexCode',
        key: 'indexCode',
        render: ( indexCode ) => <span>{codeObj[indexCode]}</span>,
      },
      {
        title: <span>竞猜</span>,
        dataIndex: 'guess',
        key: 'guess',
        render: guess => {
          return <span>{guess === 'INDEX_RISE' ? '涨' : '跌' }</span>
        }
      },
      {
        title: <span>结果</span>,
        dataIndex: 'win',
        key: 'win',
        // eslint-disable-next-line no-nested-ternary
        render: win => <span>{typeof win === 'boolean' ? win ? '正确' : '错误' : '待公布'}</span>,
      },
      {
        title: <span>时间</span>,
        dataIndex: 'updateTime',
        key: 'update_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'update_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: updateTime => <span>{updateTime}</span>,
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          用户：{detailInfo && detailInfo.username ? detailInfo.username : detailInfo && detailInfo.user && ( detailInfo.user.username || detailInfo.user.account || detailInfo.user.mobile )}
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

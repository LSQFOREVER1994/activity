/* eslint-disable react/jsx-filename-extension */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Breadcrumb } from 'antd';
import moment from 'moment';
import { Line } from '@antv/g2plot';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

@connect( ( { participationRecordModal } ) => {
  return {
    loading: participationRecordModal.loading,
    recordList: participationRecordModal.recordList,
    lineData: participationRecordModal.lineData,
  }
} )

class ParticipationRecord extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      sortedInfo: {
        columnKey: 'update_time',
        field: 'updateTime',
        order: 'descend',
      },
      totalNum: 0,
      line: [],
    };
    this.searchBar = React.createRef()
    this.searchEleList = [
      {
        key: 'mobile',
        label: '手机号',
        type: 'Input'
      },
      {
        key: 'account',
        label: '资金账号',
        type: 'Input'
      },
      {
        key: 'userNo',
        label: '客户号',
        type: 'Input'
      },
      {
        key: 'structure',
        label: '营业部',
        type: 'Input'
      },
      {
        key: 'accountManager',
        label: '客户经理',
        type: 'Input'
      },
      {
        key: 'updateTime',
        label: '最新参与时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
      }
    ];
  }

  componentDidMount() {
    this.getList();
    this.getLineData();
  };

  renderLine = () => {
    const { lineData } = this.props;
    const data = lineData.statistics;
    data.sort( ( x, y ) => {
      return x.date < y.date ? -1 : 1
    } )
    let total = 0;
    data.map( item => {
      total += item.count;
      return total
    } )
    this.setState( {
      totalNum: total
    } )
    const line = new Line( 'linedata', {
      data,
      padding: 'auto',
      xField: 'date',
      yField: 'count',
      color: '#1F3883',
      xAxis: {
        tickCount: 6,
      },
      yAxis: {
        alias: '参与人数'
      },
      slider: {
        start: 0,
        end: 1,
      },
    } );
    this.setState( {
      line
    } )
    line.render();
  }

  hanldeReset = () => {
    const { line } = this.state;
    if ( line.length === 0 ) return
    line.update( {
      slider: {
        start: 0,
        end: 1,
      },
    } )
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getList( data );
    } )
  }

  getLineData = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'participationRecordModal/getLineData',
      payload: {
        id:activityId
      },
      callFunc: () => {
        this.renderLine();
      }
    } );
  }

  getList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'participationRecordModal/getInfo',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        ...data,
        activityId
      },
    } );
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order: 'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getList( this.searchBar.current.data ) );
  };

  numFormat = ( num ) => {
    const res = num.toString().replace( /\d+/, ( n ) => {
      return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
        return `${$1},`;
      } );
    } )
    return res;
  }

  render() {
    const { loading, recordList: { total, list }, activityId, closeUserActionPage } = this.props;
    const { pageSize, pageNum, sortedInfo, totalNum } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
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

    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `activity/users/export`,
      xlsxName: '活动参与用户明细.xlsx',
      extraData: { activityId, orderBy },
    }

    const columns = [
      {
        title: <span>手机号</span>,
        dataIndex: 'mobile',
        key: 'mobile',
        render: mobile => <span>{mobile}</span>,
      },
      {
        title: <span>资金账号</span>,
        dataIndex: 'account',
        key: 'account',
        render: account => <span>{account || '--'}</span>,
      },
      {
        title: <span>客户号</span>,
        dataIndex: 'userNo',
        key: 'userNo',
        render: userNo => <span>{userNo || '--'}</span>,
      },
      {
        title: <span>营业部</span>,
        dataIndex: 'structure',
        key: 'structure',
        render: structure => <span>{structure || '--'}</span>,
      },
      {
        title: <span>客户经理</span>,
        dataIndex: 'accountManager',
        key: 'accountManager',
        render: accountManager => <span>{accountManager}</span>,
      },
      {
        title: <span>渠道名称</span>,
        dataIndex: 'channel',
        key: 'channel',
        render: channel => <span>{channel}</span>,
      },
      {
        title: <span>首次参与时间</span>,
        align: 'center',
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime ? moment( createTime ).format( 'YYYY-MM-DD  HH:mm:ss' ) : '--'}</span>
      },
      {
        title: <span>最新参与时间</span>,
        align: 'center',
        dataIndex: 'updateTime',
        key: 'update_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'update_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: updateTime => <span>{updateTime ? moment( updateTime ).format( 'YYYY-MM-DD  HH:mm:ss' ) : '--'}</span>,
      },
    ];

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>用户参与记录</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          headStyle={{ fontWeight: 'bold' }}
          title='用户参与情况趋势图'
        >
          <div style={{ marginTop: 0, textAlign: 'center', fontSize: 16, color: '#333' }}>总参与人数：{this.numFormat( totalNum )}</div>
          <div style={{ marginBottom: 10, textAlign: 'right' }}><Button onClick={this.hanldeReset} size='small'>Reset</Button></div>
          <div id='linedata' />
        </Card>
        <Card
          bordered={false}
          title='详细信息'
          headStyle={{ fontWeight: 'bold' }}
          style={{ marginTop: 18 }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={this.searchEleList}
            searchFun={this.filterSubmit}
            loading={loading}
            exportConfig={exportConfig}
          />
          <Table
            size="middle"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
      </GridContent>
    );
  };
}

export default ParticipationRecord;

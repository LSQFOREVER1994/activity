/* eslint-disable react/jsx-filename-extension */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Breadcrumb } from 'antd';
import moment from 'moment';
import { Line } from '@antv/g2plot';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

@connect( ( { likeData } ) => {
  return {
    loading: likeData.loading,
    recordList: likeData.recordList,
    lineData: likeData.lineData,
  }
} )

class LikeData extends PureComponent {
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
        key: 'username',
        label: '用户名',
        type: 'Input'
      },
      {
        key: 'isLike',
        label: '点赞状态',
        type: 'Select',
        optionList: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '已点赞',
            value: true,
          },
          {
            label: '已取消',
            value: false,
          }
        ]
      },
      {
        key: 'createTime',
        label: '首次点赞时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startCreateTime: 'YYYY-MM-DD 00:00:00', endCreateTime: 'YYYY-MM-DD 23:59:59' }
      },
      {
        key: 'updateTime',
        label: '最新点赞时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startUpdateTime: 'YYYY-MM-DD 00:00:00', endUpdateTime: 'YYYY-MM-DD 23:59:59' }
      }
    ];
  }

  componentDidMount() {
    this.getLikeLineData(); // 获取点赞折线图图数据
    this.getLikeStatistics(); // 获取点赞表格统计数据
  };

  renderLine = () => {
    const { lineData } = this.props;
    const newData = []
    lineData.forEach( ( item ) => {
      item.statistics.forEach( element => {
        newData.push( { id: item.id, ...element } )
      } );
    } )

    newData.sort( ( x, y ) => {
      return x.date < y.date ? -1 : 1
    } )
    let total = 0;
    newData.map( item => {
      total += item.count;
      return total
    } )
    this.setState( {
      totalNum: total
    } )
    const line = new Line( 'linedata', {
      data: newData,
      padding: 'auto',
      xField: 'date',
      yField: 'count',
      xAxis: {
        tickCount: 6,
      },
      yAxis: {
        alias: '点赞人数'
      },
      slider: {
        start: 0,
        end: 1,
      },
      seriesField: 'id'
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
      this.getLikeStatistics( data );
    } )
  }

  // 获取点赞折线图图数据
  getLikeLineData = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'likeData/getLikeLineData',
      payload: {
        activityId
      },
      callFunc: () => {
        this.renderLine();
      }
    } );
  }

  // 获取点赞统计数据
  getLikeStatistics = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'likeData/getLikeStatistics',
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
    }, () => this.getLikeStatistics( this.searchBar.current.data ) );
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
      ajaxUrl: `element/like/export`,
      xlsxName: '点赞数据明细.xlsx',
      extraData: { activityId, orderBy },
    }

    const columns = [
      {
        title: <span>用户名</span>,
        align: 'center',
        dataIndex: 'username',
        key: 'username',
        render: username => <span>{username}</span>,
      },
      {
        title: <span>昵称</span>,
        align: 'center',
        dataIndex: 'nick',
        key: 'nick',
        render: nick => <span>{nick}</span>,
      },
      {
        title: <span>点赞状态</span>,
        align: 'center',
        dataIndex: 'isLike',
        key: 'isLike',
        render: isLike => <span>{isLike ? '已点赞' : '已取消'}</span>,
      },
      {
        title: <span>首次点赞时间</span>,
        align: 'center',
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime ? moment( createTime ).format( 'YYYY-MM-DD  HH:mm:ss' ) : '--'}</span>
      },
      {
        title: <span>最新点赞时间</span>,
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
          <Breadcrumb.Item>点赞数据</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          headStyle={{ fontWeight: 'bold' }}
          title='点赞数据趋势图'
        >
          <div style={{ marginTop: 0, textAlign: 'center', fontSize: 16, color: '#333' }}>总点赞人数：{this.numFormat( totalNum )}</div>
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

export default LikeData;

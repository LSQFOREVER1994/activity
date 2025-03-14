
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Breadcrumb } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

@connect( ( { enrollRecord } ) => ( {
  loading: enrollRecord?.loading,
  enrollList: enrollRecord?.enrollList,
} ) )


class EnrollRecord extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
    };
    this.searchBar = React.createRef()
    this.searchEleList = [
      {
        key: 'username',
        label: '用户名',
        type: 'Input'
      },
      {
        key: 'nick',
        label: '昵称',
        type: 'Input'
      },
      {
        key: 'updateTime',
        label: '报名时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
      },
    ]
  }


  componentDidMount() {
    this.getList();
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getList( data );
    } )
  }

  // 获取活动参与次数数据
  getList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const { dispatch, activityId } = this.props;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'enrollRecord/getActivityEnrollList',
      payload: {
        page: {
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        activityId,
        ...data
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


  render() {
    const { loading, enrollList: { total, list }, activityId, closeUserActionPage } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `element/enroll/export`,
      xlsxName: '活动报名明细.xlsx',
      extraData: { activityId, orderBy, pageNum:1, pageSize:-1, searchCount:false },
      responseType:'POST'
    }
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
        title: <span>用户名</span>,
        align: 'center',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: <span>昵称</span>,
        align: 'center',
        dataIndex: 'nick',
        key: 'nick',
        render: nick => <span>{nick}</span>,
      },
      {
        title: <span>报名时间</span>,
        align: 'center',
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>
      }
    ];


    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>报名记录</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title='报名明细'
          bordered={false}
          headStyle={{ fontWeight: 'bold' }}
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

export default EnrollRecord;

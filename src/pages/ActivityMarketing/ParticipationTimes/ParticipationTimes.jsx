
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Button, Breadcrumb } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
import SearchBar from '@/components/SearchBar';

@connect( ( { timesModel } ) => {
  return {
    loading: timesModel?.loading,
    recordList: timesModel?.recordList,
    leftCountList: timesModel?.leftCountList
  }
} )

class ParticipationTimes extends PureComponent {
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
      sortedInfo2: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      isShwoModal: false, // 是否展示用户具体次数流水弹窗
      userId: '',
      currentUsername: '',
      elementId: '',
      paginationInfo: {
        pageNum: 1,
        pageSize: 10
      },
      isExPLoading: false,
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
        key: 'updateTime',
        label: '更新时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { updateStartTime: 'YYYY-MM-DD 00:00:00', updateEndTime: 'YYYY-MM-DD 23:59:59' }
      }
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
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'timesModel/getInfo',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        activityId,
        ...data
      },
    } );
  }

  // 导出名单
  exportRecord = () => {
    const { activityId } = this.props
    const { userId, sortedInfo2 } = this.state

    const obj = {
      userId,
      activityId,
      orderBy: `${sortedInfo2.columnKey} ${sortedInfo2.order === 'descend' ? 'desc' : 'asc'}`
    }

    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys( obj ).forEach( key => {
      if ( obj[key] || typeof obj[key] === 'boolean' ) {
        return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
      }
    } )

    let ajaxUrl = `task/left-count/record/export`
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      ajaxUrl = `task/left-count/record/export?${paramStr}`
    }

    this.setState( {
      isExPLoading: true
    }, () => {
      exportXlsx( {
        type: 'activityService',
        uri: ajaxUrl,
        xlsxName: `用户次数流水明细.xlsx`,
        callBack: () => {
          this.setState( {
            isExPLoading: false
          } )
        }
      } )
    } )
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

  tableChange2 = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const { paginationInfo } = this.state
    paginationInfo.pageNum = current;
    paginationInfo.pageSize = pageSize
    this.setState( {
      paginationInfo,
      sortedInfo2: sorter,
    }, () => this.getUserLeftCount() );
  };

  // 展示用户次数流水
  showModal = ( record ) => {
    const { userId, username, elementId } = record;
    this.setState( {
      isShwoModal: true,
      userId,
      currentUsername: username,
      elementId
    }, () => {
      this.getUserLeftCount()
    } )
  }

  closeModal = () => {
    this.setState( {
      isShwoModal: false,
      userId: '',
      paginationInfo: {
        pageNum: 1,
        pageSize: 10
      },
    } )
  }

  getUserLeftCount = () => {
    const { dispatch, activityId } = this.props
    const { userId, sortedInfo2, paginationInfo, elementId } = this.state
    const sortValue = sortedInfo2?.order === 'descend' ? 'desc' : 'asc'
    dispatch( {
      type: 'timesModel/getUserLeftCountInfo',
      payload: {
        activityId,
        elementId,
        userId,
        page:{
          pageNum: paginationInfo.pageNum,
          pageSize: paginationInfo.pageSize,
          orderBy: `${sortedInfo2.columnKey} ${sortValue},left_count desc`
        }
      },
    } );
  }


  render() {
    const { loading, recordList: { total, list }, leftCountList, closeUserActionPage, activityId } = this.props;
    const { pageSize, pageNum, sortedInfo, sortedInfo2, isShwoModal, paginationInfo, currentUsername, isExPLoading, } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `task/left-count/export`,
      xlsxName: '活动次数记录明细.xlsx',
      extraData: { activityId, orderBy },
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

    const paginationProps2 = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: paginationInfo.pageSize,
      total: leftCountList.total,
      current: paginationInfo.pageNum,
      showTotal: () => {
        return `共 ${leftCountList.total} 条`;
      }
    };

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
        title: <span>组件ID</span>,
        align: 'center',
        dataIndex: 'elementId',
        key: 'elementId',
        render: elementId => <span>{elementId}</span>,
      },
      {
        title: <span>总剩余次数</span>,
        align: 'center',
        dataIndex: 'leftCount',
        key: 'left_count',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'left_count' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: leftCount => <span>{leftCount}</span>
      },
      {
        title: <span>已用次数</span>,
        align: 'center',
        dataIndex: 'usedCount',
        key: 'used_count',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'used_count' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: usedCount => <span>{usedCount}</span>
      },
      {
        title: <span>更新时间</span>,
        align: 'center',
        dataIndex: 'updateTime',
        key: 'update_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'update_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: updateTime => <span>{updateTime ? moment( updateTime ).format( 'YYYY-MM-DD  HH:mm:ss' ) : '--'}</span>
      },
      {
        title: '操作',
        align: 'center',
        render: ( _, record ) => <span style={{ color:'#1F3883', cursor:'pointer' }} onClick={() => { this.showModal( record ) }}>详情</span>,
        with: 200
      }
    ];

    const columns2 = [
      {
        title: <span>事件</span>,
        align: 'center',
        dataIndex: 'source',
      },
      {
        title: <span>次数变化</span>,
        align: 'center',
        dataIndex: 'countChange',
      },
      {
        title: <span>当前剩余次数</span>,
        align: 'center',
        dataIndex: 'leftCount',
      },
      {
        title: <span>时间</span>,
        align: 'center',
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo2.columnKey === 'create_time' && sortedInfo2.order,
        sortDirections: ['descend', 'ascend'],
      },
    ]

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>活动次数记录</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          title='详细信息'
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
        <Modal
          visible={isShwoModal}
          width="60%"
          footer={null}
          onCancel={() => this.closeModal()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '30px' }}>
            <span>用户名: {currentUsername}</span>
            <Button onClick={this.exportRecord} type='primary' loading={isExPLoading}>导出列表</Button>
          </div>
          <Table
            size="small"
            rowKey="id"
            columns={columns2}
            loading={loading}
            pagination={paginationProps2}
            dataSource={leftCountList?.list}
            onChange={this.tableChange2}
          />
        </Modal>
      </GridContent>
    );
  };
}

export default ParticipationTimes;

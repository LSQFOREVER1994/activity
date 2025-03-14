
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Button, Breadcrumb } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
import SearchBar from '@/components/SearchBar';

@connect( ( { intergralRecordModel } ) => {
  return {
    loading: intergralRecordModel?.loading,
    recordList: intergralRecordModel?.recordList,
    userInterGralList: intergralRecordModel?.userInterGralList,
  }
} )

class IntergralRecord extends PureComponent {
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
        key: 'createTime',
        label: '创建时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { createStartTime: 'YYYY-MM-DD 00:00:00', createEndTime: 'YYYY-MM-DD 23:59:59' }
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

  // 获取积分明细
  getList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'intergralRecordModel/getIntergralRecord',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`
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

    let ajaxUrl = `integral/user/record/export`
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      ajaxUrl = `integral/user/record/export?${paramStr}`
    }

    this.setState( {
      isExPLoading: true
    }, () => {
      exportXlsx( {
        type: 'activityService',
        uri: ajaxUrl,
        xlsxName: `用户积分流水明细.xlsx`,
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
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter, }

    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getList( this.searchBar.current.data ) );
  };

  tableChange2 = ( pagination, filters, sorter ) => {
    const sotrObj = { order: 'descend', ...sorter, }

    const { current, pageSize } = pagination;
    const { paginationInfo } = this.state
    paginationInfo.pageNum = current;
    paginationInfo.pageSize = pageSize
    this.setState( {
      paginationInfo,
      sortedInfo2: sotrObj,
    }, () => this.getUserIntergralRecord() );
  };

  // 展示用户具体积分明细
  showModal = ( record ) => {
    const { userId, username } = record;
    this.setState( {
      isShwoModal: true,
      userId,
      currentUsername: username,
    }, () => {
      this.getUserIntergralRecord()
    } )

  }

  // 获取用户具体积分明细
  getUserIntergralRecord = () => {
    const { dispatch, activityId } = this.props
    const { userId, sortedInfo2, paginationInfo } = this.state
    const sortValue = sortedInfo2?.order === 'descend' ? 'desc' : 'asc'
    dispatch( {
      type: 'intergralRecordModel/getUserIntergralRecord',
      payload: {
        activityId,
        userId,
        page:{
          pageNum: paginationInfo.pageNum,
          pageSize: paginationInfo.pageSize,
          orderBy: `${sortedInfo2.columnKey} ${sortValue}`
        }
      },
    } );
  }


  render() {
    const { loading, recordList: { total, list }, userInterGralList, activityId, closeUserActionPage } = this.props;
    const { pageSize, pageNum, sortedInfo, sortedInfo2, isShwoModal, paginationInfo, currentUsername, isExPLoading } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `integral/user/export`,
      xlsxName: '活动用户积分明细.xlsx',
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
      total: userInterGralList.total,
      current: paginationInfo.pageNum,
      showTotal: () => {
        return `共 ${userInterGralList.total} 条`;
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
        title: <span>当前积分</span>,
        align: 'center',
        dataIndex: 'score',
        key: 'score',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'score' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: score => <span>{score}</span>
      },
      {
        title: <span>累积活动积分</span>,
        align: 'center',
        dataIndex: 'historyScore',
        key: 'history_score',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'history_score' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: historyScore => <span>{historyScore}</span>
      },
      {
        title: <span>创建时间</span>,
        align: 'center',
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime ? moment( createTime ).format( 'YYYY-MM-DD  HH:mm:ss' ) : '--'}</span>
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
        render: ( _, record ) => <div style={{ color:'#1F3883', cursor:'pointer' }} onClick={() => { this.showModal( record ) }}>详情</div>
      }
    ];

    const columns2 = [
      {
        width: '100px',
        title: <span>事件</span>,
        align: 'center',
        dataIndex: 'source',
      },
      {
        width: '50px',
        title: <span>积分变动</span>,
        align: 'center',
        dataIndex: 'score',
      },
      {
        width: '50px',
        title: <span>当前积分</span>,
        align: 'center',
        dataIndex: 'currentScore',
      },
      {
        width: '200px',
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
          <Breadcrumb.Item>活动积分明细</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          title='详细信息'
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
          // onOk={this.handleOk}
          onCancel={() => { this.setState( { isShwoModal: false, userId: '' } ) }}
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
            dataSource={userInterGralList?.list}
            onChange={this.tableChange2}
          />
        </Modal>
      </GridContent>
    );
  };
}

export default IntergralRecord;

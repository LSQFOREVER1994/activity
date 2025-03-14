import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Breadcrumb, Row, Col, Button, Modal } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
import TrendChart from './TrendChart';
import GameInfo from './GameInfo';
import SearchBar from '@/components/SearchBar';

@connect( ( { combineGame } ) => {
  return { ...combineGame }
} )

class CombineGameData extends PureComponent {
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

      userSortedInfo: {
        columnKey: 'settlement_time',
        field: 'settlementTime',
        order: 'descend',
      },
      isShwoModal: false,
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
        label: '更新时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
      },
    ]
  }


  componentDidMount() {
    this.getList();
    this.getInfo();
  };

  // 展示用户分数弹窗
  showModal = ( record ) => {
    const { userId, username } = record;
    this.setState( {
      isShwoModal: true,
      userId,
      currentUsername: username,
    }, () => {
      this.getUserRecord()
    } )
  }

  // 获取用户具体分数明细
  getUserRecord = () => {
    const { dispatch, activityId } = this.props
    const { userId, userSortedInfo, paginationInfo } = this.state
    const sortValue = userSortedInfo?.order === 'descend' ? 'desc' : 'asc'
    dispatch( {
      type: 'combineGame/getUserRecord',
      payload: {
        activityId,
        userId,
        pageNum: paginationInfo.pageNum,
        pageSize: paginationInfo.pageSize,
        orderBy: `${userSortedInfo.columnKey} ${sortValue}`
      },
    } );
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getList( data );
    } )
  }

  // 获取表格数据
  getList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'combineGame/getDataList',
      payload: {
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        activityId,
        ...data
      },
    } );
  }

  // 获取参与情况
  getInfo = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'combineGame/getInfo',
      payload: {
        activityId,
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

  userTableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order: 'descend', ...sorter, }
    const { current, pageSize } = pagination;
    const { paginationInfo } = this.state
    paginationInfo.pageNum = current;
    paginationInfo.pageSize = pageSize
    this.setState( {
      paginationInfo,
      userSortedInfo: sotrObj,
    }, () => this.getUserRecord() );
  };

  exportRecord = () =>{
    const { activityId } = this.props
    const { userId, userSortedInfo } = this.state
    const obj = {
      userId,
      activityId,
      orderBy: `${userSortedInfo.columnKey} ${userSortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    }
    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys( obj ).forEach( key => {
      if ( obj[key] || typeof obj[key] === 'boolean' ) {
        return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
      }
    } )

    let ajaxUrl = `composite-game/records/export`
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      ajaxUrl = `composite-game/records/export?${paramStr}`
    }
    this.setState( {
      isExPLoading: true
    }, () => {
      exportXlsx( {
        type: 'activityService',
        uri: ajaxUrl,
        xlsxName: `用户分数明细.xlsx`,
        callBack: () => {
          this.setState( {
            isExPLoading: false
          } )
        }
      } )
    } )
  }

  renderModal = () => {
    const { isShwoModal, currentUsername, paginationInfo, isExPLoading, userSortedInfo } = this.state;
    const { loading, userDetail } = this.props
    const columns = [
      {
        title: <span>获得分数</span>,
        align: 'center',
        dataIndex: 'score',
      },
      {
        title: <span>结算时间</span>,
        align: 'center',
        dataIndex: 'settlementTime',
        key: 'settlement_time',
        sorter: true,
        sortOrder: userSortedInfo.columnKey === 'settlement_time' && userSortedInfo.order,
        sortDirections: ['descend', 'ascend'],
      },
    ]
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: paginationInfo.pageSize,
      total: userDetail.total,
      current: paginationInfo.pageNum,
      showTotal: () => {
        return `共 ${userDetail.total} 条`;
      }
    };
    return (
      <Modal
        visible={isShwoModal}
        width="60%"
        footer={null}
        onCancel={() => { this.setState( { isShwoModal: false, userId: '' } ) }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '30px' }}>
          <span>用户名: {currentUsername}</span>
          <Button onClick={this.exportRecord} type='primary' loading={isExPLoading}>导出</Button>
        </div>
        <Table
          size="small"
          rowKey="id"
          columns={columns}
          loading={loading}
          pagination={paginationProps}
          dataSource={userDetail?.list}
          onChange={this.userTableChange}
        />
      </Modal>
    )
  }

  render() {
    const { loading, gameMap: { total, list }, closeUserActionPage, activityId } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `composite-game/users/export`,
      xlsxName: '合成游戏数据.xlsx',
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
    const columns = [
      {
        title: <span>用户名</span>,
        dataIndex: 'username',
        key: 'username',
        render: username => <span>{username}</span>,
      },
      {
        title: <span>用户昵称</span>,
        dataIndex: 'nick',
        key: 'nick',
        render: nick => <span>{nick}</span>,
      },
      {
        title: <span>最高得分</span>,
        dataIndex: 'highestScore',
        key: 'highestScore',
        render: highestScore => <span>{highestScore}</span>

      },
      {
        title: <span>更新时间</span>,
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
        render: ( _, record ) => <a href="#" onClick={() => { this.showModal( record ) }}>详情</a>
      }
    ];

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>合成游戏数据</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={24}>
          <Col span={8}>
            <Card
              bordered={false}
              title="游戏参与情况"
              bodyStyle={{ height: 300, padding: 20 }}
              headStyle={{ fontWeight: 'bold' }}
            >
              <GameInfo {...this.props} />
            </Card>
          </Col>
          <Col span={16}>
            <Card
              bordered={false}
              title="游戏参与趋势（近30日）"
              bodyStyle={{ height: 300 }}
              headStyle={{ fontWeight: 'bold' }}
            >
              <TrendChart {...this.props} />
            </Card>
          </Col>
        </Row>
        <Card
          bordered={false}
          title="合成数据详情"
          headStyle={{ fontWeight: 'bold' }}
          style={{ marginTop: 16 }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={this.searchEleList}
            searchFun={this.filterSubmit}
            loading={loading}
            exportConfig={exportConfig}
          />
          <Table
            scroll={{ x: 1000 }}
            size="middle"
            rowKey="userId"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        {this.renderModal()}
      </GridContent>
    );
  };
}

export default CombineGameData;

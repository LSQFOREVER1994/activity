
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Breadcrumb } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import InviteDataTable from './InviteDataTable'
import SearchBar from '@/components/SearchBar';

@connect( ( { invite } ) => {
  return {
    loading: invite.loading,
    inviteMap: invite.inviteMap,
  }
} )

class Invite extends PureComponent {
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
        label: '邀请人',
        type: 'Input'
      },
      {
        key: 'invitee',
        label: '被邀请人',
        type: 'Input'
      },
      {
        key: 'isSuccess',
        label: '达标状态',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '已达标', value: 'true' },
          { label: '未达标', value: 'false' },
        ]
      },
      {
        key: 'hasReward',
        label: '是否有奖励',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '是', value: 'true' },
          { label: '否', value: 'false' },
        ]
      },
      {
        key: 'createTime',
        label: '绑定时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
      },
      {
        key: 'successTime',
        label: '达标时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startSuccessDate: 'YYYY-MM-DD', endSuccessDate: 'YYYY-MM-DD' }
      }
    ]
  }

  componentDidMount() {
    this.getInvite();
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getInvite( data );
    } )
  }

  // 获取活动列表
  getInvite = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'invite/getInvite',
      payload: {
        ...data,
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
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
    }, () => this.getInvite( this.searchBar.current.data ) );
  };


  render() {
    const { loading, inviteMap: { total, list }, closeUserActionPage, activityId } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
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
      ajaxUrl: `task/invite/search/export`,
      xlsxName: '邀请列表.xlsx',
      extraData: { activityId, orderBy },
    }

    const columns = [
      {
        title: <span>邀请人</span>,
        dataIndex: 'userAccount',
        key: 'userAccount',
        render: userAccount => <span>{userAccount}</span>,
      },
      {
        title: <span>被邀请人</span>,
        dataIndex: 'inviteUserAccount',
        key: 'inviteUserAccount',
        render: inviteUserAccount => <span>{inviteUserAccount}</span>,
      },
      {
        title: <span>绑定时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => {
          let showTime = '--'
          if ( endTime ) {
            showTime = moment( endTime ).format( 'YYYY-MM-DD  HH:mm:ss' )
          }
          return (
            <span>{showTime}</span>
          )
        }
      },
      {
        title: <span>达标状态</span>,
        dataIndex: 'isSuccess',
        key: 'isSuccess',
        render: isSuccess => {
          return <span>{isSuccess ? '已达标' : '未达标'}</span>
        }
      },
      {
        title: <span>达标时间</span>,
        dataIndex: 'successTime',
        key: 'success_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'success_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: successTime => {
          let showTime = '--'
          if ( successTime ) {
            showTime = moment( successTime ).format( 'YYYY-MM-DD  HH:mm:ss' )
          }
          return (
            <span>{showTime}</span>
          )
        },
      },
      {
        title: <span>是否有奖励</span>,
        dataIndex: 'hasReward',
        key: 'hasReward',
        render: hasReward => {
          return <span>{hasReward ? '是' : '否'}</span>
        }
      },
    ];

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>邀请数据</Breadcrumb.Item>
        </Breadcrumb>
        <InviteDataTable activityId={activityId} />
        <Card
          bordered={false}
          title="邀请数据"
          headStyle={{ fontWeight: 'bold' }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={this.searchEleList}
            searchFun={this.filterSubmit}
            exportConfig={exportConfig}
            loading={loading}
          />
          <Table
            scroll={{ x: 1000 }}
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

export default Invite;

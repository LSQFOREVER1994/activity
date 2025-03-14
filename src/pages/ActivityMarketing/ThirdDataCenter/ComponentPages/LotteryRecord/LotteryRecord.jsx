import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Breadcrumb } from 'antd';
import { connect } from 'dva';
import SearchBar from '@/components/SearchBar';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

// LotteryRecord 抽奖记录
function LotteryRecord( props ) {
  const { activityId, lotteryList, loading, dispatch, closeUserActionPage } = props;
  const { total = 0, list = [] } = lotteryList;
  const searchBar = useRef( null )
  const [pageInfo, setPageInfo] = useState( {
    pageNum: 1,
    pageSize: 10,
  } )
  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'create_time',
    field: 'createTime',
    order: 'descend',
  } )

  // 获取列表
  const getList = ( data ) => {
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'lotteryRecord/getLotteryRecord',
      payload: {
        activityId,
        page:{
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        ...pageInfo,
        },
        ...data
      },
    } );
  }

  const filterSubmit = () => {
    setPageInfo( {
      ...pageInfo,
      pageNum: 1,
    } )
  }

  const tableChange = ( pagination, filters, sorter ) => {
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'createTime' ) {
      sortObj.columnKey = 'create_time'
    }
    setPageInfo( {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    } )
    setSortedInfo( sortObj )
  };

  useEffect( () => {
    getList( searchBar.current?.data );
  }, [pageInfo, sortedInfo] )

  const exportConfig = {
    type: 'activityService',
    ajaxUrl: `lottery/export`,
    xlsxName: '抽奖记录.xlsx',
    responseType:'POST',
    extraData: {
      activityId,
      orderBy: `${sortedInfo.columnKey} ${( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'}`,
      pageNum:1, pageSize:-1, searchCount:false
    },
  }

  const searchEleList = [
    // {
    //   key: 'username',
    //   label: '用户名',
    //   type: 'Input'
    // },
    // {
    //   key: 'nick',
    //   label: '昵称',
    //   type: 'Input'
    // },
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
      label: '抽奖时间',
      type: 'RangePicker',
      format: 'YYYY-MM-DD',
      alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
    },
    {
      key: 'elementName',
      label: '抽奖组件',
      type: 'Input'
    },
    {
      key: 'winner',
      label: '是否中奖',
      type: 'Select',
      optionList: [
        { label: '全部', value: '' },
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
    {
      key: 'remark',
      label: '备注',
      type: 'Input',
    },
  ]
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total,
    pageSize: pageInfo.pageSize,
    current: pageInfo.pageNum,
    showTotal: () => {
      return `共 ${total} 条`;
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
    // {
    //   title: <span>用户名</span>,
    //   align: 'center',
    //   dataIndex: 'username',
    //   key: 'username',
    //   render: username => <span>{username}</span>,
    // },
    // {
    //   title: <span>昵称</span>,
    //   align: 'center',
    //   dataIndex: 'nick',
    //   key: 'nick',
    //   render: nick => <span>{nick}</span>,
    // },
    {
      title: <span>抽奖组件</span>,
      align: 'center',
      dataIndex: 'elementName',
      key: 'elementName',
      render: ( _, record ) => <span>{`${record.elementName}(${record.elementId})`}</span>,
    },
    {
      title: <span>抽奖时间</span>,
      align: 'center',
      dataIndex: 'createTime',
      key: 'create_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: createTime => <span>{createTime || '--'}</span>,
    },
    {
      title: <span>是否中奖</span>,
      align: 'center',
      dataIndex: 'winner',
      key: 'winner',
      render: winner => <span>{winner ? '是' : '否'}</span>,
    },
    {
      title: <span>备注</span>,
      align: 'center',
      dataIndex: 'remark',
      key: 'remark',
      render: remark => <span>{remark || '--'}</span>,
    }
  ];

  return (
    <GridContent>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>
          <a onClick={() => { closeUserActionPage() }}>数据中心</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>抽奖记录</Breadcrumb.Item>
      </Breadcrumb>
      <Card
        bordered={false}
        title='抽奖记录'
        headStyle={{ fontWeight: 'bold' }}
        bodyStyle={{ padding: '0 32px 40px 32px', margin: '16px' }}
      >
        <SearchBar
          ref={searchBar}
          searchEleList={searchEleList}
          searchFun={filterSubmit}
          exportConfig={exportConfig}
          loading={loading}
        />
        <Table
          size='middle'
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          onChange={tableChange}
          pagination={paginationProps}
        />
      </Card>
    </GridContent>
  )
}

export default connect( ( { lotteryRecord } ) => ( {
  ...lotteryRecord
} ) )( LotteryRecord );

import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

// DetailTable 问卷统计 -> 数据详情
function DetailTable( props ) {
  const { id, elementId, detailData, loading, dispatch } = props;
  const { total = 0, list = [] } = detailData;
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
      type: 'votingData/getVotingDetail',
      payload: {
        activityId: id,
        elementId,
        page: {
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
          ...pageInfo,
        },
        ...data
      },
    } );
  }
  const getVoting = () => {
    dispatch( {
      type: 'votingData/getVotingDetail',
      payload: {
        activityId:id,
        elementId,
      },
    } );
  }

  useEffect( () => {
    getList()
    getVoting()
  }, [id, elementId] )

  useEffect( () => {
    getList( searchBar.current?.data );
  }, [pageInfo, sortedInfo] )

  const filterSubmit = () => {
    setPageInfo( {
      ...pageInfo,
      pageNum: 1,
    } )
  }

  const tableChange = ( pagination, filters, sorter ) => {
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'startTime' ) {
      sortObj.columnKey = 'start_time'
    }
    if ( sortObj.columnKey === 'endTime' ) {
      sortObj.columnKey = 'end_time'
    }
    setPageInfo( {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    } )
    setSortedInfo( sortObj )
  };

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
      fixed: 'left',
      align: 'center',
      render: mobile => <span>{mobile}</span>,
    },
    {
      title: <span>资金账号</span>,
      dataIndex: 'account',
      key: 'account',
      render: account => <span>{account}</span>,
    },
    {
      title: <span>客户号</span>,
      dataIndex: 'userNo',
      key: 'userNo',
      render: userNo => <span>{userNo}</span>,
    },
    {
      title: <span>投票选项</span>,
      dataIndex: 'itemValue',
      key: 'itemValue',
      render: itemValue => <span>{itemValue}</span>,
    },
    {
      title: <span>投票提交时间</span>,
      dataIndex: 'createTime',
      key: 'create_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: createTime => <span>{createTime}</span>
    },
  ];
  const exportConfig = {
    type: 'activityService',
    ajaxUrl: `voting/export`,
    xlsxName: '投票数据详情.xlsx',
    extraData: {
      activityId:id,
      elementId,
      orderBy: `${sortedInfo.columnKey} ${( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'}`,
    },
  }
  const searchEleList = [
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
      type: 'Number'
    },
    {
      key: 'createTime',
      label: '投票提交时间',
      type: 'RangePicker',
      format: 'YYYY-MM-DD',
      alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
    },
  ]
  return (
    <GridContent>
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
        scroll={{ x: true }}
      />
    </GridContent>
  )
}

export default connect( ( { votingData } ) => ( {
  ...votingData
} ) )( DetailTable );

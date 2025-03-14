import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Table, Descriptions } from 'antd';
import SearchBar from '@/components/SearchBar';

const GuessType = {
  OPEN: '开盘',
  CLOSE: '收盘',
  ALL: '全部',
}

function UserRecord( props ) {
  const { record, userGuessRecord, visible, onClose, loading, dispatch } = props;
  if ( !record ) return null
  const { id, date, productName, productCode, type } = record
  const { total = 0, list = [] } = userGuessRecord
  const searchBar = useRef( null )
  const [pageInfo, setPageInfo] = useState( {
    pageNum: 1,
    pageSize: 10,
  } )
  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'create_time',
    field: 'createTime',
    order: 'descend',
  }, )

  // 获取列表
  const getList = ( data ) => {
    if ( !visible ) return
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'guessData/getUserGuessRecord',
      payload: {
        id,
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
  }, [id, visible, pageInfo, sortedInfo] )

  useEffect( () => {
    if ( visible === false ) {
      setPageInfo( {
        pageNum: 1,
        pageSize: 10,
      } )
    }
  }, [visible] )

  const exportConfig = {
    type: 'activityService',
    ajaxUrl: `guess/periods/records/export`,
    xlsxName: '用户竞猜记录.xlsx',
    extraData: {
      id,
      orderBy: `${sortedInfo.columnKey} ${( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'}`,
    },
  }

  const searchEleList = [
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
      key: 'createTime',
      label: '竞猜时间',
      type: 'RangePicker',
      format: 'YYYY-MM-DD',
      alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
    }
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
      title: <span>竞猜方向</span>,
      align: 'center',
      dataIndex: 'betType',
      key: 'downCount',
      render: betType => <span>{betType === 'RISE' ? '看涨' : '看跌'}</span>,
    },
    {
      title: <span>竞猜结果</span>,
      align: 'center',
      dataIndex: 'result',
      key: 'result',
      render: ( result, rec ) => {
        let str
        if ( !result ) { str = '-' }
        else if ( result === rec.betType ) { str = '正确' }
        else { str = '错误' }
        return ( <span>{str}</span> )
      }
    },
    {
      title: <span>下注积分</span>,
      align: 'center',
      dataIndex: 'betScore',
      key: 'betScore',
      render: betScore => <span>{betScore}</span>,
    },
    {
      title: <span>赢得积分</span>,
      align: 'center',
      dataIndex: 'earnScore',
      key: 'earnScore',
      render: earnScore => <span>{earnScore}</span>,
    },
    {
      title: <span>竞猜时间</span>,
      align: 'center',
      dataIndex: 'createTime',
      key: 'create_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: createTime => <span>{createTime || '--'}</span>,
    },
  ];

  return (
    <>
      <Modal
        title='用户竞猜记录'
        width={1000}
        visible={visible}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={[<Button key={id} type="primary" onClick={onClose}>关闭</Button>]}
      >
        <Descriptions>
          <Descriptions.Item label="竞猜日期">{date}</Descriptions.Item>
          <Descriptions.Item label="竞猜标的">{productName}{`(${productCode})`}</Descriptions.Item>
          <Descriptions.Item label="竞猜类型">{GuessType[type]}</Descriptions.Item>
        </Descriptions>
        <SearchBar
          ref={searchBar}
          searchEleList={searchEleList}
          searchFun={filterSubmit}
          exportConfig={exportConfig}
          loading={loading}
        />
        <Table
          style={{ marginTop: 20 }}
          size="small"
          rowKey="id"
          bordered={false}
          loading={loading}
          columns={columns}
          dataSource={list}
          onChange={tableChange}
          pagination={paginationProps}
        />
      </Modal>
    </>
  )
}

export default UserRecord

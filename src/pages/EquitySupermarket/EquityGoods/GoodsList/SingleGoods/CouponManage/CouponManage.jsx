import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'dva';
import { Drawer, Button, Icon, Table, Popconfirm } from 'antd'
import moment from 'moment';
import SearchBar from '@/components/SearchBar';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import CouponRecycleBin from './CouponRecycleBin';
import styles from '../SingleGoods.less';

function CouponManage( props ) {
  const { visible, handleVisible, goodsInfo, dispatch, loading } = props;
  const { id, name } = goodsInfo

  const preSearchData = { isSentOut:'false' }
  const [selectedRowKeys, setSelectedRowKeys] = useState( [] )
  const [recycleBinVisible, setRecycleBinVisible] = useState( false )
  const searchBar = useRef( null )
  const [couponList, setCouponList] = useState( {
    total: 0,
    list: [],
  } )
  const [tableList, setTableList] = useState( [] )
  const [pageInfo, setPageInfo] = useState( {
    pageNum: 1,
    pageSize: 10,
  } )
  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'expire_time',
    field: 'expireTime',
    order: 'ascend',
  } )

  const getCouponList = ( data ) => {
    dispatch( {
      type: 'couponManage/getCouponList',
      payload: {
        productId: id,
        page:{
          orderBy: `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`,
          ...pageInfo,
        },
        ...data,
        
      },
      callBackFunc: ( res ) => {
        const { result, result: { list } } = res;
        setCouponList( result )
        setTableList( list )
      }
    } )
  }

  const onShowCouponDetail = ( itemId ) => {
    dispatch( {
      type: 'couponManage/getCouponDetail',
      payload: {
        id: itemId
      },
      callBackFunc: ( res ) => {
        const newList = tableList.map( item => {
          if ( item.id === itemId ) {
            return res
          }
          return item
        } )
        setTableList( newList )
      }
    } )
  }

  const onHideCouponDetail = ( itemId ) => {
    const record = couponList.list.find( item => item.id === itemId )
    const newList = tableList.map( item => {
      if ( item.id === itemId ) {
        return record
      }
      return item
    } )
    setTableList( newList )
  }

  const filterSubmit = () => {
    setPageInfo( {
      ...pageInfo,
      pageNum: 1,
    } )
  }

  useEffect( () => {
    const data = searchBar.current?.data ? searchBar.current?.data : { ...preSearchData, ...searchBar.current?.data, }
    getCouponList( data )
  }, [pageInfo, sortedInfo] )

  const onSelectChange = ( selectedKeys ) => {
    setSelectedRowKeys( selectedKeys );
  }

  const deleteCoupon = () => {
    dispatch( {
      type: 'couponManage/deleteCoupon',
      payload: {
        list: selectedRowKeys
      },
      callBackFunc: () => {
        setSelectedRowKeys( [] )
        filterSubmit()
      }
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

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: couponList.total,
    pageSize: pageInfo.pageSize,
    current: pageInfo.pageNum,
    showTotal: () => {
      return `共 ${couponList.total} 条`;
    }
  };

  const columns = [
    {
      title: <span />,
      align: 'center',
      dataIndex: 'id',
      render: ( itemId, record ) => {
        const { psw } = record
        if ( psw.includes( '*' ) ) {
          return <Icon type="eye-invisible" style={{ cursor: 'pointer' }} onClick={() => onShowCouponDetail( itemId )} />
        }
        return <Icon type="eye" style={{ cursor: 'pointer' }} onClick={() => onHideCouponDetail( itemId )} />
      }
    },
    {
      title: <span>卡号</span>,
      align: 'center',
      dataIndex: 'account',
    },
    {
      title: <span>卡密</span>,
      align: 'center',
      dataIndex: 'psw',
    },
    {
      title: <span>发放状态</span>,
      align: 'center',
      dataIndex: 'isSentOut',
      render: isSentOut => <span>{isSentOut ? '已发放' : '未发放'}</span>,
    },
    {
      title: <span>发放时间</span>,
      align: 'center',
      dataIndex: 'updateTime',
      key: 'update_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'update_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: ( updateTime, record ) => <span>{record.isSentOut ? updateTime : '--'}</span>,
    },
    {
      title: <span>过期状态</span>,
      align: 'center',
      dataIndex: 'isExpired',
      render: ( isExpired, record ) => <span>{moment( record.expireTime ).isAfter( moment() ) ? '未过期' : '已过期'}</span>,
    },
    {
      title: <span>过期时间</span>,
      align: 'center',
      dataIndex: 'expireTime',
      key: 'expire_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'expire_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: expireTime => <span>{expireTime || '--'}</span>,
    },
    {
      title: <span>创建人</span>,
      align: 'center',
      dataIndex: 'createBy',
    },
    {
      title: <span>创建时间</span>,
      align: 'center',
      dataIndex: 'createTime',
      key: 'create_time',
      sorter: true,
      sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
      sortDirections: ['descend', 'ascend'],
      render: createTime => <span>{createTime || '--'}</span>,
    },
  ];

  const searchEleList = [
    {
      key: 'account',
      label: '卡号',
      type: 'Input'
    },
    {
      key: 'psw',
      label: '卡密',
      type: 'Input'
    },
    {
      key: 'isSentOut',
      label: '发放状态',
      type: 'Select',
      optionList: [
        { label: '全部', value: '' },
        { label: '已发放', value: "true" },
        { label: '未发放', value: "false" }
      ],
      initialValue:'false'
    },
    {
      key: 'isExpired',
      label: '过期状态',
      type: 'Select',
      optionList: [
        { label: '全部', value: '' },
        { label: '已过期', value: "true" },
        { label: '未过期', value: "false" }
      ]
    },
    {
      key: 'sendTime',
      label: '发放时间',
      type: 'RangePicker',
      format: 'YYYY-MM-DD',
      alias: { sentStart: 'YYYY-MM-DD 00:00:00', sentEnd: 'YYYY-MM-DD 23:59:59' }
    },
    {
      key: 'expireTime',
      label: '过期时间',
      type: 'RangePicker',
      format: 'YYYY-MM-DD',
      alias: { expiredStart: 'YYYY-MM-DD 00:00:00', expiredEnd: 'YYYY-MM-DD 23:59:59' }
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Drawer
      title={
        <div>
          <Button
            type='link'
            onClick={handleVisible}
          >
            <Icon type="left" />
          </Button>
          <span>卡密管理 - </span>
          <span style={{ color: 'red' }}>{name}</span>
        </div>
      }
      headerStyle={{ padding: 10 }}
      placement="right"
      closable={false}
      onClose={handleVisible}
      visible={visible}
      destroyOnClose
      width="90%"
      className={styles.global_styles}
    >
      <GridContent>
        <SearchBar
          ref={searchBar}
          searchEleList={searchEleList}
          searchFun={filterSubmit}
          loading={loading}
        />
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setRecycleBinVisible( true )} type='primary'>回收站</Button>
          <Popconfirm
            placement="topRight"
            title="是否删除选择的卡券?"
            onConfirm={() => deleteCoupon()}
            onCancel={() => { }}
            okText="是"
            cancelText="否"
          >
            <Button type='primary' disabled={selectedRowKeys.length === 0} style={{ marginLeft: 10 }}>删除</Button>
          </Popconfirm>
        </div>
        <Table
          size='middle'
          rowKey="id"
          // bordered
          loading={loading}
          columns={columns}
          dataSource={tableList}
          onChange={tableChange}
          rowSelection={rowSelection}
          pagination={paginationProps}
        />
      </GridContent>
      {recycleBinVisible &&
        <CouponRecycleBin
          id={id}
          visible={recycleBinVisible}
          setRecycleBinVisible={setRecycleBinVisible}
        />
      }
    </Drawer>
  )
}

export default connect( ( { couponManage } ) => ( {
  ...couponManage
} ) )( CouponManage )

import React, { useState, useEffect } from 'react'
import { connect } from 'dva';
import { Modal, Table, Button, Form, Input, DatePicker } from 'antd'
import styles from '../SingleGoods.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

function CouponRecycleBin( props ) {
  const { id, visible, setRecycleBinVisible, dispatch, loading, recycleList, form } = props;
  const { getFieldDecorator, resetFields, getFieldsValue } = form;
  const { total = 0, list = [] } = recycleList;

  const [pageInfo, setPageInfo] = useState( {
    pageNum: 1,
    pageSize: 10,
  } )
  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'expire_time',
    field: 'expireTime',
    order: 'descend',
  } )

  const getCouponRecycleList = () => {
    const { createBy, deleteTime } = getFieldsValue();
    const deleteStart = deleteTime && deleteTime.length ? deleteTime[0].format( 'YYYY-MM-DD 00:00:00' ) : '';
    const deleteEnd = deleteTime && deleteTime.length ? deleteTime[1].format( 'YYYY-MM-DD 23:59:59' ) : '';
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`;
    dispatch( {
      type: 'couponManage/getCouponRecycleList',
      payload: {
        productId: id,
        createBy,
        deleteStart,
        deleteEnd,
        page:{ 
          ...pageInfo,
          orderBy 
        }
      }
    } )
  }

  useEffect( () => {
    getCouponRecycleList();
  }, [pageInfo, sortedInfo] )

  const filterSubmit = () => {
    setPageInfo( {
      ...pageInfo,
      pageNum: 1,
    } )
  }

  const handleReset = () => {
    resetFields()
    filterSubmit()
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
    total,
    pageSize: pageInfo.pageSize,
    current: pageInfo.pageNum,
    showTotal: () => {
      return `共 ${total} 条`;
    }
  };

  const columns = [
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
      title: <span>操作人</span>,
      align: 'center',
      dataIndex: 'createBy',
    },
    {
      title: <span>删除时间</span>,
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
    <Modal
      title="回收站"
      width={1000}
      maskClosable={false}
      destroyOnClose
      visible={visible}
      onCancel={() => { setRecycleBinVisible( false ) }}
      className={styles.global_styles}
      footer={<Button type="primary" onClick={() => setRecycleBinVisible( false )}>关闭</Button>}
    >
      <Form layout='inline' style={{ marginBottom: '20px' }}>
        <FormItem label='操作人'>
          {getFieldDecorator( 'createBy', {
          } )(
            <Input placeholder='请输入操作人' style={{ width: '200px' }} allowClear />
          )}
        </FormItem>
        <FormItem label='删除时间'>
          {getFieldDecorator( 'deleteTime', {
          } )(
            <RangePicker
              format="YYYY-MM-DD"
              getCalendarContainer={triggerNode => triggerNode.parentNode}
            />
          )}
        </FormItem>
        <FormItem>
          <Button onClick={filterSubmit} type="primary" loading={loading} icon="search">搜索</Button>
          <Button onClick={handleReset} type="primary" loading={loading} icon="undo" style={{ marginLeft: 10 }}>重置</Button>
        </FormItem>
      </Form>
      <Table
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={list}
        onChange={tableChange}
        pagination={paginationProps}
      />
    </Modal>
  )
}

export default connect( ( { couponManage } ) => ( {
  ...couponManage
} ) )( Form.create()( CouponRecycleBin ) )

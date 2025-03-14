/* eslint-disable no-use-before-define */
import { Card, Form, Table, Input, Select, Button, DatePicker, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState, useCallback } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FunctionModal from './FunctionModal';

const { Option } = Select;
const { RangePicker } = DatePicker;

const JUMP_TYPE = { '': '全部', COMMON: '通用跳转', FUNCTION: '功能跳转', TASK: '任务跳转' };
const COLUMNS_KEY = { createTime: 'create_time' };

const Index = props => {
  const {
    loading,
    dispatch,
    data: { total, list },
    form,
  } = props;
  const { getFieldDecorator, resetFields, getFieldsValue } = form;

  const [visible, setVisible] = useState( false );
  const [modalData, setModalData] = useState( null );
  const [otherParams, setOtherParams] = useState( {
    pageNum: 1,
    pageSize: 10,
    orderBy: 'create_time desc',
  } );

  const getConfigData = () => {
    const values = getSearchValue();
    if( !values.jumpType ) delete values.jumpType 
    dispatch( {
      type: 'functionConfig/getFunctionConfigList',
      payload: {
        page:otherParams,
        ...values,
      },
    } );
  };

  useEffect( () => {
    getConfigData();
  }, [otherParams] );

  const showModal = ( data = null ) => {
    setModalData( data );
    setVisible( true );
  };

  const handleReset = () => {
    resetFields();
    setOtherParams( { ...otherParams, pageNum: 1 } );
  };

  const handleDelete = id => {
    dispatch( {
      type: `functionConfig/deleteFunctionConfig`,
      payload: {
        body: id,
        callback: r => {
          if ( r ) {
            message.success( '删除成功。' );
            getConfigData();
          }
        },
      },
    } );
  };

  const handleChange = ( page, filter, sort ) => {
    const { current, pageSize } = page;
    setOtherParams( {
      pageNum: current,
      pageSize,
      orderBy: `${[COLUMNS_KEY[sort.columnKey]]} ${sort.order?.replace( /end/, '' ) || 'asc'}`,
    } );
  };

  const getSearchValue = () => {
    const { createTime, ...values } = getFieldsValue();
    const create = { startTime: null, endTime: null };
    if ( createTime ) {
      create.startTime = createTime[0]?.format( 'YYYY-MM-DD HH:mm:ss' ) || null;
      create.endTime = createTime[1]?.format( 'YYYY-MM-DD HH:mm:ss' ) || null;
    }
    return { ...create, ...values };
  };

  const ExtraContent = useCallback( () => {
    const jumpTypeValue = Object.keys( JUMP_TYPE );
    return (
      <Form layout="inline" style={{ display: 'flex', marginBottom:'20px', padding:'0 12px' }}>
        <Form.Item label="功能名称">
          {getFieldDecorator( 'name' )( <Input placeholder="请输入功能名称" /> )}
        </Form.Item>
        <Form.Item label="功能类型">
          {getFieldDecorator( 'jumpType', { initialValue: jumpTypeValue[0] } )(
            <Select style={{ width: 100 }}>
              {jumpTypeValue.map( item => {
                return (
                  <Option key={item} value={item}>
                    {JUMP_TYPE[item]}
                  </Option>
                );
              } )}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="创建时间">
          {getFieldDecorator( 'createTime' )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
        </Form.Item>
        <Form.Item style={{ flex: '1', textAlign: 'right' }}>
          <Button onClick={getConfigData} type="primary" htmlType="submit">
            搜索
          </Button>
          <Button onClick={handleReset} style={{ marginLeft: '20px' }}>
            清空
          </Button>
          <Button
            icon="plus"
            type="primary"
            style={{ marginLeft: '20px' }}
            onClick={() => showModal( null )}
          >
            新增
          </Button>
        </Form.Item>
      </Form>
    );
  }, [] );

  const columns = [
    { title: '功能名称', dataIndex: 'name', render: name => <div>{name}</div> },
    {
      title: '功能类型',
      dataIndex: 'jumpType',
      render: jumpType => <div>{JUMP_TYPE[jumpType]}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: createTime => <div>{createTime}</div>,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: <span>操作</span>,
      render: record => (
        <>
          <span
            onClick={() => showModal( record )}
            style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
            type="link"
          >
            编辑
          </span>
          <Popconfirm
            title="是否删除当前功能配置？"
            cancelText="取消"
            onConfirm={() => handleDelete( record.id )}
          >
            <span style={{ cursor: 'pointer', color: '#f5222d' }} type="link">
              删除
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <GridContent>
        <Card
          title='功能配置'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
          bordered={false}
        >
          <ExtraContent />
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={{
              total,
              current: otherParams.pageNum,
              defaultPageSize: otherParams.pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: ( t, r ) => `${r[0]}-${r[1]} 共 ${t} 条记录`,
            }}
            onChange={handleChange}
          />
        </Card>
      </GridContent>
      <FunctionModal
        getConfigData={getConfigData}
        visible={visible}
        data={modalData}
        setVisible={setVisible}
      />
    </>
  );
};

export default connect( ( { functionConfig } ) => ( {
  loading: functionConfig.loading,
  data: functionConfig.data,
} ) )( Form.create()( Index ) );

/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-20 13:38:36
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-09-04 09:52:34
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ChannelManagement/Index.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { Button, Card, Layout, Table, Modal, Form, Input, Radio, DatePicker, message, Popconfirm, Tooltip } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

const { Content } = Layout;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const PerennialTime = '2099-12-30 00:00:00'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};


const searchEleList = [
  {
    key: 'name',
    label: '短链名称',
    type: 'Input'
  },
  {
    key: 'code',
    label: '短链接',
    type: 'Input'
  },
]

function ChannelManagement( props ) {
  const { form, dispatch, shortLinkMap:{ list, total } } = props;
  const { getFieldDecorator, resetFields, validateFields, setFieldsValue, getFieldValue } = form;
  const [modalVisible, setModalVisible] = useState( false );
  const [isAdd, setIsAdd] = useState( true );
  const [pageObj, setPageObj] = useState( {
    pageSize: 10,
    pageNum: 1,
  } );
  const searchBar = useRef( null )


  const getShortLinkList = () => {
    dispatch( {
      type: 'shortChainCreate/getShortLinkList',
      payload: {
        query: {
          page: {
            ...pageObj,
            orderBy: 'create_time desc'
          },
          ...searchBar?.current?.data,
        },
      },
    } );
  };
  
  const copyLink = ( e, publishLink ) => {
    e.stopPropagation();
    const tag = copy( publishLink );
    if ( tag ) {
      message.success( '复制链接成功' );
    } else {
      message.error( '复制失败，重新点击或手动复制' );
    }
  };

  const handleEdit = ( record,  ) => {
    const { name, url, minUrl, startTime, expireTime, id } = record
    const timeType = moment( expireTime ).format( 'YYYY-MM-DD HH:mm:ss' ) === PerennialTime 
    setModalVisible( true );
    setIsAdd( false );
    setFieldsValue( { name, url, minUrl, id, timeType, startTime, expireTime, time:startTime && expireTime ? [moment( startTime ), moment( expireTime )] : null, } );
  };

  const closeModal = () => {
    resetFields();
    setModalVisible( false );
  };

  const handleAddShortLink = ( params ) => {
    dispatch( {
      type: 'shortChainCreate/addShortLink',
      payload: {
        query: params,
        callFunc: () => {
          closeModal()
          getShortLinkList()
        },
      },
    } );
  }
  const handleAdd = () => {
    setModalVisible( true );
    setIsAdd( true );
  };

  const handleDeleteShortLink = ( id ) => {
    dispatch( {
      type: 'shortChainCreate/deleteShortLink',
      payload: {
        query: {
          id,
        },
        callFunc: () => {
          getShortLinkList()
        },
      },
    } );
  }

  const handelEditShortLink = ( parmas ) => {
    dispatch( {
      type: 'shortChainCreate/editShortLink',
      payload: {
        query: parmas,
        callFunc: () => {
          closeModal()
          getShortLinkList()
        },
      } } )
    }

  const handelChangeTimeType = e => {
    const { value } = e.target;
    const currentTime = moment().format( 'YYYY-MM-DD HH:mm:ss' );
    
    if ( value ) {
      setFieldsValue( {
        startTime: currentTime,
        expireTime: PerennialTime,
      } );
    } else {
      setFieldsValue( {
        startTime: '',
        expireTime: '',
      } );
    }
  };

  const handleRangePickerChange = dates => {
    const [startTime, expireTime] = dates;
    setFieldsValue( {
      startTime: startTime ? startTime.format( 'YYYY-MM-DD HH:mm:ss' ) : null,
      expireTime: expireTime ? expireTime.format( 'YYYY-MM-DD HH:mm:ss' ) : null,
    } );
  };

  const renderModal = () => {
    const footer = [
      <Button key="cancel" onClick={closeModal}>
          取消
      </Button>,
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          validateFields( ( err, values ) => {
            if ( !err ) {
              const { timeType, time, id, minUrl, ...rest } = values;
              if ( isAdd ) {
                handleAddShortLink( rest );
              } else {
                const { name, startTime, expireTime, url } = values;
                handelEditShortLink( { id, name, startTime, expireTime, url } );
              }
            }
          } );
        
          }}
      >
          确定
      </Button>,
      ]
    const title = `${isAdd ? '生成' : '生成的'}短链接`;
    return (
      <Modal title={title} visible={modalVisible} onCancel={closeModal} footer={footer} width='600px'>
        <Form>
          <FormItem {...formItemLayout} label="短链名称">
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: '请输入短链名称' }],
            } )( <Input placeholder="请输入短链名称" maxLength={30} /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="原链接">
            {getFieldDecorator( 'url', {
              rules: [{ required: true, message: '请输入原链接' }],
            } )( <Input placeholder="请输入原链接" maxLength={200} /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="有效期">
            {getFieldDecorator( 'timeType', {
              rules: [{ required: true, }],
              initialValue: false,
            } )(
              <Radio.Group onChange={handelChangeTimeType}>
                <Radio value={false}>日期范围</Radio>
                <Radio value>长期</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {!getFieldValue( 'timeType' ) && (
            <FormItem {...formItemLayout} label="时间范围">
              {getFieldDecorator( 'time', {
                rules: [{ required: true, message: '请选择时间' }],
              } )(
                <RangePicker
                  placeholder="请选择时间"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  onChange={handleRangePickerChange}
                  // style={{ marginLeft:'64px' }}
                />
              )}
            </FormItem>
          )}
          {getFieldDecorator( 'startTime' )( <input type="hidden" /> )}
          {getFieldDecorator( 'expireTime' )( <input type="hidden" /> )}
          {getFieldDecorator( 'id' )( <input type="hidden" /> )}
        </Form>
      </Modal>
    );
  };

  const columns = [
    {
      title: '短链名称',
      dataIndex: 'name',
      render: name => <div>{name}</div>,
    },
    {
      title: '短链接',
      dataIndex: 'minUrl',
      render: minUrl => <div>{minUrl}</div>,
    },
    {
      title: '生成时间',
      dataIndex: 'createTime',
      render: createTime => <div>{createTime}</div>,
    },
    {
      title: '生效时间',
      dataIndex: 'startTime',
      render: startTime => <div>{startTime || '--'}</div>,
    },
    {
      title: '失效时间',
      dataIndex: 'expireTime', 
      render: expireTime => expireTime === PerennialTime ? '长期' : <div>{expireTime || '--'}</div>
    },
    {
      title: '操作人',
      dataIndex: 'createNick',
      render: createNick => <div>{createNick}</div>,
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      render: record => (
        <>
          <Tooltip title={record.url}>
            <span
              onClick={( e ) => {copyLink( e, record.url )}}
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
            >
            复制原链接
            </span>
          </Tooltip>
          <Tooltip title={record.minUrl}>
            <span
              onClick={( e ) => { copyLink( e, record.minUrl )}}
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
            >
            复制短链接
            </span>
          </Tooltip>
          <span
            onClick={() => {
              handleEdit( record );
            }}
            style={{ marginRight: 15, cursor: 'pointer', color: 'rgb(232, 158, 66)' }}
            type="link"
          >
            修改
          </span>
          <Popconfirm
            title="请确认是否删除"
            onConfirm={() => { handleDeleteShortLink( record.id )}}
            okText="是"
            cancelText="否"
          >
            <span
              style={{ cursor: 'pointer', color: '#f5222d' }}
              type="link"
            >
            删除
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  const tableChange = ( pagination, ) => {
    const { current, pageSize } = pagination;
    setPageObj( {
      pageNum: current,
      pageSize,
    } )
  };


  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: pageObj.pageSize,
    total,
    current: pageObj.pageNum,
    showTotal: () => {
      return `共 ${total} 条`;
    },
  };

  useEffect( () => {
    getShortLinkList();
  }, [pageObj] );
  
  const resetSearchFunc = () => {
    setPageObj( {
      pageSize: 10,
      pageNum: 1,
    } );
  }

  return (
    <GridContent>
      <Card
        bordered={false} 
        title={
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <span>短链生成</span>
          </div>
        }
        extra={<Button type="primary" icon='plus-circle' onClick={handleAdd}>短链生成</Button>} 
        bodyStyle={{ padding: '1px 32px 40px 32px' }}
      >
        <SearchBar 
          ref={searchBar}
          searchEleList={searchEleList}
          searchFun={resetSearchFunc}
        />
        <Content>
          <Table 
            rowKey='id'
            columns={columns}
            dataSource={list}
            onChange={tableChange}
            pagination={paginationProps}
          />
        </Content>
        {renderModal()}
      </Card>
    </GridContent>
  );
}

export default connect( ( { shortChainCreate } ) => ( {
  loading: shortChainCreate.loading,
  shortLinkMap: shortChainCreate.shortLinkMap,
} ) )( Form.create()( ChannelManagement ) );

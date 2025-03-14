/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-20 13:38:36
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-28 09:30:03
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ChannelManagement/Index.jsx
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Card, Layout, Table, Popconfirm, Modal, Form, Input, Radio } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';


const { Header, Content } = Layout;
const FormItem = Form.Item;


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function ChannelManagement( props ) {
  const { channelMap:{ list, total }, loading, form, dispatch } = props;
  const [modalVisible, setModalVisible] = useState( false );
  const [isAdd, setIsAdd] = useState( true );
  const [pageObj, setPageObj] = useState( {
    pageSize: 10,
    pageNum: 1,
  } );

  const { getFieldDecorator, resetFields, validateFields, setFieldsValue } = form;

  const getChannerList = () => {
    dispatch( {
      type: 'channelManagement/getChannelList',
      payload: {
        query: {
          page: pageObj,
        },
        callFunc: () => {},
      },
    } );
  };

  const handleEdit = record => {
    setModalVisible( true );
    setIsAdd( false );
    setFieldsValue( record );
  };

  const closeModal = () => {
    resetFields();
    setModalVisible( false );
  };

  const handleAdd = () => {
    setModalVisible( true );
    setIsAdd( true );
  };

  const getAddChannel = ( params ) => {
    dispatch( {
      type:'channelManagement/getAddChannel',
      payload: {
        query: params,
        callFunc: () => {
          closeModal();
          getChannerList();
        },
      },
    } )
  }

  const editChannel = ( params ) => {
    dispatch( {
      type: 'channelManagement/editChannel',
      payload: {
        query: params,
        callFunc:() => {
          closeModal();
          getChannerList();
        }
      }
    } )
  }

  const deleteChannel = ( id ) => {
    dispatch( {
      type:'channelManagement/deleteChannel',
      payload: {
        query: {
          channelId:id,
        },
        callFunc: () => {
          getChannerList();
        },
      },
    } )
  }

  const renderModal = () => {
    return (
      <Modal
        title={`${isAdd ? '新增' : '编辑'}渠道`}
        visible={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              validateFields( ( err, values ) => {
                if ( !err ) {
                  if ( isAdd ) {
                    getAddChannel( values )
                  } else {
                    editChannel( values )
                  }
                }
              } );
            }}
          >
            确定
          </Button>,
        ]}
      >
        <Form>
          <FormItem {...formItemLayout} label="渠道ID">
            {getFieldDecorator( 'id' )(
              <Input style={{ width:'300px' }} disabled={!isAdd} placeholder="请输入渠道ID，若未输入，随机生成渠道ID" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="渠道名称">
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: '请输入渠道名称' }],
            } )( <Input placeholder="请输入渠道名称" maxLength={30} /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="渠道类型">
            {getFieldDecorator( 'type', {
              rules: [{ required: true, message: '请选择渠道类型' }],
              initialValue: 'APP'
            } )( 
              <Radio.Group disabled={!isAdd}>
                <Radio value='APP'>端内</Radio>
                <Radio value='WEB'>端外</Radio>
              </Radio.Group> )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator( 'remark' )( <Input placeholder="请输入备注" maxLength={80} /> )}
          </FormItem>
        </Form>
      </Modal>
    );
  };

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

  const typeMap = {
    WEB:'H5',
    APP:'APP'
  }

  const columns = [
    {
      title: '渠道ID',
      dataIndex: 'id',
      render: id => <div>{id}</div>,
    },
    {
      title: '渠道名称',
      dataIndex: 'name',
      render: name => <div>{name}</div>,
    },
    {
      title: '渠道类型',
      dataIndex: 'type',
      render: type => <div>{typeMap[type]}</div>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width:400,
      render: remark => <div>{remark}</div>,
    },
    {
      title: '操作',
      render: record => (
        <>
          <span
            onClick={() => {
              handleEdit( record );
            }}
            style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
            type="link"
          >
            编辑
          </span>
          <Popconfirm
            title="是否删除当前渠道？"
            cancelText="取消"
            onConfirm={() => deleteChannel( record.id )}
          >
            <span style={{ cursor: 'pointer', color: '#f5222d' }} type="link">
              删除
            </span>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect( () => {
    getChannerList();
  }, [pageObj] );

  return (
    <GridContent>
      <Card
        bordered={false} 
        title={
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <span>渠道管理</span>
          </div>
        }
        extra={<Button icon='plus-circle' type="primary" onClick={handleAdd}>新增渠道</Button>} 
        bodyStyle={{ padding: '20px 32px 40px 32px' }}
      >
        <Content>
          <Table 
            rowKey='id'
            columns={columns}
            dataSource={list}
            onChange={tableChange}
            pagination={paginationProps}
            loading={loading}
          />
        </Content>
        {renderModal()}
      </Card>
    </GridContent>
  );
}

export default connect( ( { channelManagement } ) => ( {
  loading: channelManagement.loading,
  channelMap:channelManagement.channelMap
} ) )( Form.create()( ChannelManagement ) );

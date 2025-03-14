/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-05-20 13:38:36
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-28 09:30:12
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ChannelManagement/Index.jsx
 */
import React, { useState, useEffect } from 'react'
import { connect } from 'dva';
import { Button, Card, Layout, Table, Popconfirm, Modal, Form, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';


const { Content } = Layout;
const FormItem = Form.Item;


const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

 function CustomerManagement( props ) {
  const { form, dispatch, customerMap: { list, total }, loading } = props;
  const [modalVisible, setModalVisible] = useState( false )
  const [isExamine, setIsExamine] = useState( false )
  const [isAdd, setIsAdd] = useState( true )
  const [pageObj, setPageObj] = useState( {
    pageSize: 10,
    pageNum: 1,
  } );
  const { getFieldDecorator, resetFields, validateFields, setFieldsValue } = form;



  const getCustomerList = () => {
    dispatch( {
      type: 'customerManagement/getCustomerList',
      payload: {
        query: {
          page: pageObj,
        },
        callFunc: () => {},
      },
    } );
  };

  const handleEdit = ( record, examine ) => {
    setModalVisible( true )
    setIsAdd( false )
    setFieldsValue( record )
    if ( examine ) setIsExamine( true )
  }


  const closeModal = () => {
    resetFields();
    setModalVisible( false )
    setTimeout( () => {
      setIsExamine( false )
    }, 300 );
  }

  const handleAdd = () => {
    setModalVisible( true )
    setIsAdd( true )
  }

  const getAddCustomer = ( params ) => {
    dispatch( {
      type:'customerManagement/getAddCustomer',
      payload:{
        query:params,
        callFunc:()=>{
          closeModal()
          getCustomerList()
        }
      }
    } )
  }

  const editCustomer = ( params ) => {
    dispatch( {
      type: 'customerManagement/editCustomer',
      payload: {
        query: params,
        callFunc:() => {
          closeModal();
          getCustomerList();
        }
      }
    } )
  }

  const deleteCustomer = ( id ) => {
    dispatch( {
      type:'customerManagement/deleteCustomer',
      payload: {
        query: {
          id,
        },
        callFunc: () => {
          getCustomerList();
        },
      },
    } )
  }

 const renderModal = () => {
  const footer = isExamine ? null : [
    <Button key="cancel" onClick={closeModal}>取消</Button>,
    <Button 
      key="submit"
      type="primary"
      onClick={() => {
        validateFields( ( err, values ) => {
          if ( !err ) {
            if( isAdd ){
              getAddCustomer( values )
            }else{
              editCustomer( values )
            }
          }
        } );
    }}
    >确定
    </Button>
  ]
  let title = `${isAdd ? '新增' : '编辑'}客户经理`
  if( isExamine ) title = '查看客户经理'
    return (
      <Modal
        title={title}
        visible={modalVisible}
        onCancel={closeModal}
        footer={footer}
        width={560}
      >
        <Form>
          <FormItem {...formItemLayout} label="客户经理ID">
            {getFieldDecorator( 'id' )( <Input disabled={isExamine || !isAdd} maxLength={20} placeholder='请输入客户经理ID，若未输入，随机生成客户经理ID' /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="客户经理名称">
            {getFieldDecorator( 'name', {
            rules: [{ required: true, message: '请输入客户经理名称' }], // 设置必填规则
          } )( <Input disabled={isExamine} maxLength={8} placeholder='请输入客户经理名称' /> )}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator( 'remark' )( <Input disabled={isExamine} maxLength={40} placeholder='请输入备注' /> )}
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


 const columns = [
    {
      title: '客户经理ID',
      dataIndex: 'id',
      render: id => <div>{id}</div>,
    },
    {
      title: '客户经理名称',
      dataIndex: 'name',
      render: name => <div>{name}</div>,
    },
    {
      title: '活动数',
      dataIndex: 'num',
      render: num => <div>{num}</div>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: remark => <div>{remark}</div>,
    },
    {
      title: '操作',
      render: ( record ) => 
        (
          <>
            <span
              onClick={() => { handleEdit( record )}}  
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
            >
              编辑
            </span>
            <span
              onClick={() => { handleEdit( record, true )}}  
              style={{ marginRight: 15, cursor: 'pointer', color: 'rgb(232, 158, 66)' }}
              type="link"
            >
              查看
            </span>
            <Popconfirm
              title="确定要删除删除客户经理吗？"
              cancelText="取消"
              onConfirm={() => deleteCustomer( record.id )}
            >
              <span style={{ cursor: 'pointer', color: '#f5222d' }} type="link">
                删除
              </span>
            </Popconfirm>
          </>
        )
        
    }
 ];

 useEffect( () => {
  getCustomerList();
}, [pageObj] );

  return(
    <GridContent>
      <Card bordered={false} title="客户经理管理" extra={<Button type="primary" icon='plus-circle' onClick={handleAdd}>新增客户经理</Button>} bodyStyle={{ padding: '20px 32px 40px 32px' }}>
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
  )
}

export default connect( ( { customerManagement } ) => ( {
    loading: customerManagement.loading,
    customerMap: customerManagement.customerMap
  } ),
)( Form.create()( CustomerManagement ) );

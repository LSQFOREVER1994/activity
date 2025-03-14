/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Modal, Table, Switch, message } from 'antd';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

function EditModal( props ) {
  const { permissionLoading, permissionDetail, editModalVisible, closeModal, dispatch } = props;
  const [permissions, setPermissions] = useState( [] );
  const [name, setName] = useState( '' );
  const [code, setCode] = useState( '' );

  // 启用禁用
  const onEnableChange = item => {
    const { code, enable } = item;
    const newPermissions = permissions.map( info => {
      let newInfo = { ...info };
      if ( info.code === code ) {
        newInfo = { ...info, enable: !enable };
      }
      return newInfo;
    } );
    setPermissions( newPermissions );
  };

  // 表格
  const renderTable = () => {
    const listData =
      permissions?.length &&
      permissions.filter( info => {
        return info.isShow === true;
      } );
    const columns = [
      {
        title: <span>权限名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>代码</span>,
        dataIndex: 'code',
        key: 'code',
        render: code => <span>{code || '--'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center' }}>操作</span>,
        dataIndex: 'enable',
        fixed: 'right',
        width: 100,
        render: ( enable, item ) => (
          <Switch
            checked={enable}
            onChange={() => {
              onEnableChange( item );
            }}
          />
        ),
      },
    ];

    return (
      <Table
        size="middle"
        rowKey="code"
        columns={columns}
        loading={permissionLoading}
        dataSource={listData}
        pagination={{ pageSize: 100 }}
      />
    );
  };

  // 搜索
  const onSearch = ( val, type ) => {
    if ( type === 'name' ) {
      setName( val );
    } else {
      setCode( val );
    }
  };

  // 筛选
  const renderFilterForm = () => {
    return (
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label="权限名称" {...formLayout}>
              <Input
                placeholder="请输入权限名称"
                style={{ width: 220 }}
                onChange={e => onSearch( e.target.value, 'name' )}
                value={name}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="代码" {...formLayout}>
              <Input
                placeholder="请输入代码"
                style={{ width: 220 }}
                onChange={e => onSearch( e.target.value, 'code' )}
                value={code}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  const onCloseModal = () => {
    setPermissions( [] );
    setCode( '' );
    setName( '' );
    closeModal();
  };

  // 编辑
  const getEditPermission = ( param ) => {
    if ( !param ) return;
    dispatch( {
      type: 'menuPermission/setPermission',
      payload: { 
        query:{ ...param },
        callFunc:( res )=>{
          if( res ){
            message.success( '设置菜单权限成功' )
            onCloseModal();
          }else{
            message.error( '设置菜单权限失败' )
          }
        }
       },
    } );
  };

  // 编辑弹窗确认
  const onSubmitModal = () => {
    if ( permissions && permissions.length ) {
      const codes = permissions.filter( info=>( info.enable ) ).map( info=>info.code )
      const param = {
        id:permissionDetail.id,
        codes
      };
      getEditPermission( param );
    }
  };

  useEffect( () => {
    setTimeout( () => {
      const nameStr = name ? name.trim() : '';
      const codeStr = code ? code.trim() : '';
      const newPermissions = permissions.map( item => {
        let newItem = { ...item, isShow: true };
        if ( item.name.indexOf( nameStr ) <= -1 || item.code.indexOf( codeStr ) <= -1 ) {
          newItem = { ...item, isShow: false };
        }
        return newItem;
      } );
      setPermissions( [...newPermissions] )
    }, 50 );
  }, [name, code] );

  useEffect( () => {
    const { permissions: permissionsData } = permissionDetail || {};
    const newPermissions =
      permissionsData?.length &&
      permissionsData.map( info => {
        return { ...info, isShow: true };
      } );
    setPermissions( newPermissions );
  }, [JSON.stringify( permissionDetail ), editModalVisible] );

  return (
    <Modal
      title="编辑权限"
      visible={editModalVisible}
      onOk={onSubmitModal}
      onCancel={onCloseModal}
      width={900}
    >
      {renderFilterForm()}
      {renderTable()}
    </Modal>
  );
}

export default connect( ( { menuPermission } ) => {
  return {
    permissionLoading: menuPermission.loading,
  };
} )( EditModal );
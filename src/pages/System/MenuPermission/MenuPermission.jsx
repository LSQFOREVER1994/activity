import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Card,
  Switch,
  Tree,
  Form,
  Modal,
  Input,
  Radio,
  TreeSelect,
  Popconfirm,
  message,
  Button,
  Table
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadModal from '@/components/UploadModal/UploadModal';
// import SearchBar from '@/components/SearchBar';
import EditPermissionModal from './EditModal';
import styles from './MenuPermission.less';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};
// const searchEleList = [
//   {
//     key: 'name',
//     label: '菜单名称',
//     type: 'Input'
//   },
//   {
//     key: 'router',
//     label: '路由地址',
//     type: 'Input'
//   },
//   {
//     key: 'code',
//     label: '按钮权限标识',
//     type: 'Input'
//   }
// ]

function MenuPermission( props ) {
  const { dispatch, loading, menuTreeList, form } = props;
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue, resetFields } = form;
  const [addOrEditVisible, setAddOrEditVisible] = useState( false );
  const [editPermissionModal, setEditPermissionModal] = useState( false );
  const [permissionDetail, setPermissionDetail] = useState( {} );
  const [editItem, setEditItem] = useState( {} );
  const [isEdit, setIsEdit] = useState( false );
  // const searchBar = useRef( null );
  const getMenuTree = () => dispatch( { type: 'menuPermission/getMenuTreeObject', payload:{} } );

  // const filterSubmit = ( ) => {
  //   getMenuTree();
  // }

  const transformData = data => {
    return (
      data?.length &&
      data.map( item => {
        const transformedItem = {
          ...item,
          children: item.childList.length > 0 ? transformData( item.childList ) : undefined,
          title: item.name,
          value: item.id,
        };
        return transformedItem;
      } )
    );
  };

  const handleEdit = id => {
    if ( loading || !id ) return;
    dispatch( {
      type: 'menuPermission/getMenuTreeNodeDetail',
      payload: {
        query: {
          id,
        },
        callFunc: res => {
          if ( res ) {
            setIsEdit( true );
            setEditItem( res );
            setAddOrEditVisible( true );
          }
        },
      },
    } );
  };

  const handleAdd = () => {
    setIsEdit( false );
    setEditItem( {} );
    setAddOrEditVisible( true );
    setFieldsValue( {} );
  };

  const getPermissionDetail = id => {
    if ( loading || !id ) return;
    dispatch( {
      type: 'menuPermission/getMenuTreeNodeMission',
      payload: {
        query: {
          id,
        },
        callFunc: res => {
          if ( res ) {
            setEditPermissionModal( true );
            setPermissionDetail( res );
          }
        },
      },
    } );
  };

  const handleDeleteItem = id => {
    if ( loading || !id ) return;
    dispatch( {
      type: 'menuPermission/deleteMenuTreeNode',
      payload: {
        query: {
          id,
        },
        callFunc: res => {
          if ( res ) {
            message.success( '删除成功' );
            getMenuTree();
          } else {
            message.error( '删除失败' );
          }
        },
      },
    } );
  };

  const addOrEditModalCancel = () => {
    setIsEdit( false );
    setEditItem( {} );
    setAddOrEditVisible( false );
    resetFields();
  };

  const addTreeMenuNode = data => {
    dispatch( {
      type: 'menuPermission/addMenuTreeNode',
      payload: {
        query: data,
        callFunc: res => {
          if ( res ) {
            message.success( res );
            getMenuTree();
            addOrEditModalCancel();
          }
        },
      },
    } );
  };

  const editTreeMenuNode = data => {
    dispatch( {
      type: 'menuPermission/updateMenuTreeNode',
      payload: {
        query: data,
        callFunc: res => {
          if ( res ) {
            message.success( res );
            getMenuTree();
            addOrEditModalCancel();
          }
        },
      },
    } );
  };

  const addSubordinates = id => {
    setEditItem( {} );
    setIsEdit( false );
    setAddOrEditVisible( true );
    const initValues = {
      pid: id,
      type: 'MENU',
      name: '',
      icon: '',
      router: '',
      sort: '',
      state: true,
      visible: true,
    };
    setFieldsValue( initValues );
  };

  const renderTreeNodeChild = config => {
    const { name, visible, state, id } = config || {};
    return (
      <div className={styles.treeNode}>
        <div className={styles.treeNodeItem}>{name}</div>
        {/* <div className={styles.treeNodeItem}>{router || '--'}</div> */}
        {/* <div className={styles.treeNodeItem}>{code || '--'}</div> */}
        <div className={styles.treeNodeItem}>
          <Switch checkedChildren="是" unCheckedChildren="否" checked={visible} disabled />
        </div>
        <div className={styles.treeNodeItem}>
          <Switch checkedChildren="是" unCheckedChildren="否" checked={state} disabled />
        </div>
        <div className={styles.treeNodeItem}>
          <div
            onClick={() => {
              getPermissionDetail( id );
            }}
          >
            选择权限
          </div>
          <div
            onClick={() => {
              addSubordinates( id );
            }}
          >
            添加下级
          </div>
          <div
            onClick={() => {
              handleEdit( id );
            }}
          >
            编辑
          </div>
          <Popconfirm
            placement="topRight"
            title="是否确认删除该条内容"
            onConfirm={() => handleDeleteItem( id )}
            okText="是"
            cancelText="否"
          >
            <div>删除</div>
          </Popconfirm>
        </div>
      </div>
    );
  };

  const renderMenuTree = data => {
    return data.map( node => {
      if ( node.childList && node.childList.length ) {
        return (
          <TreeNode key={node.id} title={renderTreeNodeChild( node )}>
            {renderMenuTree( node.childList )}
          </TreeNode>
        );
      }
      return <TreeNode key={node.id} title={renderTreeNodeChild( node )} />;
    } );
  };

  const addOrEditModalConfirm = () => {
    validateFields( ( err, values ) => {
      if ( err ) return;
      const data = { ...editItem, ...values };
      if ( isEdit ) {
        editTreeMenuNode( data );
      } else {
        addTreeMenuNode( data );
      }
    } );
  };

  const renderAddOrEditModal = () => {
    const modalFooter = {
      okText: '保存',
      onOk: addOrEditModalConfirm,
      onCancel: addOrEditModalCancel,
    };
    return (
      <Modal
        title={`${isEdit ? '编辑' : '新增'}模块`}
        width={840}
        visible={addOrEditVisible}
        {...modalFooter}
      >
        <Form>
          <FormItem label="类型" {...formLayout}>
            {getFieldDecorator( 'type', {
              rules: [{ required: true, message: '请选择类型' }],
              initialValue: isEdit ? editItem.type : 'MENU',
            } )(
              <Radio.Group>
                <Radio value="MENU">菜单</Radio>
                <Radio value="BUTTON">按钮（权限组）</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="模块名称" {...formLayout}>
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: '请输入模块名称' }],
              initialValue: isEdit ? editItem.name : '',
            } )(
              <Input
                placeholder="请输入模块名称"
                maxLength={30}
                suffix={
                  <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                    {getFieldValue( 'name' )?.length || 0}/30
                  </span>
                }
              />
            )}
          </FormItem>
          <FormItem label="父级菜单" {...formLayout}>
            {getFieldDecorator( 'pid', {
              rules: [{ required: false, message: '请选择父级菜单' }],
              initialValue: isEdit ? editItem.pid : undefined,
            } )(
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={transformData( menuTreeList )}
                placeholder="请选择父级菜单"
                treeDefaultExpandAll
                treeNodeLabelProp="name"
              />
            )}
          </FormItem>
          {getFieldValue( 'type' ) === 'MENU' && (
            <React.Fragment>
              <FormItem label="图标" {...formLayout}>
                {getFieldDecorator( 'icon', {
                  rules: [{ required: false, message: '请选择图标' }],
                  initialValue: isEdit ? editItem.icon : '',
                } )( <UploadModal /> )}
                <div className={styles.formItemTip}>
                  <div>建议尺寸为：1:1 </div>
                </div>
              </FormItem>
              <FormItem label="路由地址" {...formLayout}>
                {getFieldDecorator( 'router', {
                  rules: [{ required: true, message: '请输入路由地址' }],
                  initialValue: isEdit ? editItem.router : '',
                } )( <Input placeholder="请输入路由地址" /> )}
              </FormItem>
              <FormItem label="组件路径" {...formLayout}>
                {getFieldDecorator( 'component', {
                  rules: [{ required: false, message: '请输入组件路径' }],
                  initialValue: isEdit ? editItem.component : '',
                } )( <Input placeholder="请输入组件路径" /> )}
              </FormItem>
            </React.Fragment>
          )}
          {
            getFieldValue( 'type' ) === 'BUTTON' && (
              <React.Fragment>
                <FormItem label="权限标识" {...formLayout}>
                  {getFieldDecorator( 'code', {
                  rules: [{ required: false, message: '请输入按钮权限标识' }],
                  initialValue: isEdit ? editItem.code : '',
                } )( <Input placeholder="请输入按钮权限标识" /> )}
                </FormItem>
              </React.Fragment>
            )
          }
                
          <FormItem label="排序" {...formLayout}>
            {getFieldDecorator( 'sort', {
              rules: [{ required: true, message: '请输入排序值' }],
              initialValue: isEdit ? editItem.sort : undefined,
            } )( <Input placeholder="请输入排序值" /> )}
          </FormItem>
          <FormItem label="是否启用" {...formLayout}>
            {getFieldDecorator( 'state', {
              rules: [{ required: true, message: '请选择是否启用' }],
              initialValue: isEdit ? editItem.state : true,
            } )(
              <Radio.Group>
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="是否显示" {...formLayout}>
            {getFieldDecorator( 'visible', {
              rules: [{ required: true, message: '请选择是否显示' }],
              initialValue: isEdit ? editItem.visible : true,
            } )(
              <Radio.Group>
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  };

  useEffect( () => {
    getMenuTree();
  }, [] );

  const columns = [
    {
      title: '模块名',
      dataIndex: 'name',
      key: 'name',
      align:'left',
      width: 300,
    },
    {
      title: '是否显示',
      dataIndex: 'visible',
      key: 'visible',
      align:'center',
      render: ( visible ) => <Switch checkedChildren="是" unCheckedChildren="否" checked={visible} disabled />
    },
    {
      title: '是否启用',
      dataIndex: 'state',
      key: 'state',
      align:'center',
      render: ( state ) => <Switch checkedChildren="是" unCheckedChildren="否" checked={state} disabled />

    },
    {
      title:'操作',
      render: ( { id } ) => (
        <div className={styles.treeNodeItem}>
          <div
            onClick={() => {
              getPermissionDetail( id );
            }}
          >
            选择权限
          </div>
          <div
            onClick={() => {
              addSubordinates( id );
            }}
          >
            添加下级
          </div>
          <div
            onClick={() => {
              handleEdit( id );
            }}
          >
            编辑
          </div>
          <Popconfirm
            placement="topRight"
            title="是否确认删除该条内容"
            onConfirm={() => handleDeleteItem( id )}
            okText="是"
            cancelText="否"
          >
            <div>删除</div>
          </Popconfirm>
        </div>
      )
    }


  ];
  

  return (
    <GridContent>
      <Card bordered={false} title="权限配置" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
        {/* <SearchBar
          ref={searchBar}
          searchEleList={searchEleList}
          searchFun={filterSubmit}
          loading={loading}
        /> */}
        <div className={styles.header}>
          <Button type="primary" onClick={handleAdd}>
            添加模块
          </Button>
        </div>
        {/* <div className={styles.tabHeader}>
          <div>模块名</div>
          <div>路由地址</div>
          <div>按钮权限标识</div>
          <div>是否显示</div>
          <div>是否启用</div>
          <div>操作</div>
        </div> */}
        {/* <Tree className={styles.tree} blockNode>
          {renderMenuTree( menuTreeList )}
        </Tree> */}
        <Table
          rowKey='id'
          columns={columns}
          dataSource={transformData( menuTreeList )}
        />
      </Card>
      {renderAddOrEditModal()}
      <EditPermissionModal
        editModalVisible={editPermissionModal}
        permissionDetail={permissionDetail}
        closeModal={() => {
          setEditPermissionModal( false );
        }}
      />
    </GridContent>
  );
}

const menuPermissionProps = ( { menuPermission } ) => {
  return {
    loading: menuPermission.loading,
    menuTreeList: menuPermission.menuTree,
  };
};
export default Form.create( { name: 'menuPermission' } )(
  connect( menuPermissionProps )( MenuPermission )
);

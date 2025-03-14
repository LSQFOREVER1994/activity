/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'dva';
import { Card, Button, Table, Modal, Form, Select, Input, message, Radio, Popconfirm, Row, Col, Tree } from 'antd';
import styles from './index.less'
import UploadModal from '@/components/UploadModal/UploadModal';
import SearchBar from '@/components/SearchBar';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const FormItem = Form.Item
const { Option } = Select
const { Search } = Input
const { TreeNode } = Tree

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const dataList = [];
const generateList = data => {
  for ( let i = 0; i < data.length; i++ ) {
    const node = data[i];
    dataList.push( data[i] );
    if ( node.children ) {
      generateList( node.children );
    }
  }
};

const getParentKey = ( id, tree ) => {
  let parentKey;
  for ( let i = 0; i < tree.length; i++ ) {
    const node = tree[i];
    if ( node.children ) {
      if ( node.children.some( item => item.id === id ) ) {
        parentKey = node.id;
      } else if ( getParentKey( id, node.children ) ) {
        parentKey = getParentKey( id, node.children );
      }
    }
  }
  return parentKey;
};


function Index( props ) {
  const { dispatch, roleData, loading, form:{ getFieldDecorator, validateFields, setFieldsValue }, departmentTree } = props
  const searchBarRef = useRef( null )
  const [roleSelectData, setRoleSelectData] = useState( [] )
  const [treeData, setTreeData] = useState( [] )
  const [searchValue, setSearchValue] = useState( '' )
  const [autoExpandParent, setAutoExpandParent] = useState( false )
  const [expandedKeys, setExpandedKeys] = useState( [] )
  const [checkedKeys, setCheckedKeys] = useState( [] )
  const [pageNum, setPageNum] = useState( 1 )
  const [pageSize, setPageSize] = useState( 10 )
  const [currentEditData, setCurrentEditData] = useState( {} )
  const [currentEditVisible, setCurrentEditVisible] = useState( false )
  const [managerUserData, setManagerUserData] = useState( {
      list:[],
      total:0
  } )

  const [sortedInfo, setSortedInfo] = useState( {
    columnKey: 'create_time',
    field: 'createTime',
    order: 'descend',
  } )

  const { list, total } = managerUserData

  const hasEditInfo = Object.keys( currentEditData )?.length > 0
  const searchEleList = [
    {
      key:'nick',
      label:'用户名',
      type:'Input'
    },
    {
      key: 'username',
      label: '工号',
      type: 'Input'
    },
  ]

  // 编辑管理员信息
  const handleEditAdmin = ( info ) =>{
    const copyInfo = { ...info }
    // 角色列表处理
    let newGroups = []
    if( copyInfo?.roleGroups ){
       newGroups = copyInfo.roleGroups.map( ( item ) => item.id )
    }

    setCurrentEditData( info )
    setCurrentEditVisible( true )
    setTimeout( () => {
      setFieldsValue( { ...copyInfo, roleGroups:newGroups } )
    }, 50 );

  }

  /* table columns */
  const columns = [
    
    {
      title: <span>用户名</span>,
      dataIndex: 'nick',
      align:'center',
      render: nick => <span>{nick}</span>,
    },
    {
      title: <span>工号</span>,
      dataIndex: 'username',
      width:120,
      align:'center',
      render: username => <span>{username}</span>,
    },
    {
      title: <span>角色</span>,
      dataIndex: 'roleGroups',
      align:'center',
      render: roleGroups => {
        if( !roleGroups ) return <div>--</div>
        return (
          <div className={styles.role_groups}>
            {
            roleGroups.map( ( role ) => {
              return (
                <div className={styles.role}>{role.name}</div>
              )
            } )
           }
          </div>
        )
      },
    },
    // {
    //   title: <span>创建时间</span>,
    //   dataIndex: 'createTime',
    //   align:'center',
    //   sorter: true,
    //   sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
    //   sortDirections: ['descend', 'ascend'],
    //   render: createTime => <span>{createTime}</span>,
    // },
    {
      title: <span>最近登录时间</span>,
      dataIndex: 'lastLoginTime',
      align:'center',
      // sorter: true,
      // sortOrder: sortedInfo.columnKey === 'last_login_time' && sortedInfo.order,
      // sortDirections: ['descend', 'ascend'],
      render: lastLoginTime => <span>{lastLoginTime || '--'}</span>,
    },
    {
      title: <span>状态</span>,
      dataIndex: 'enable',
      align:'center',
      width:100,
      render: enable => {
        return (
          <div className={styles.enable_item}>
            <div className={styles.tips_icon} style={enable ? { background:'#1F3883' } : { background:'#c72a29' }} />
            <span htmlFor="n">{enable ? '启用' : '禁用'}</span>
          </div>
        )
      },
    },

    {
      title: <span>操作</span>,
      align:'center',
      render: (  record ) => {
        return (
          <div className={styles.btns}>
            <span
              className={styles.btnsBtn}
              style={{ marginRight:15, cursor:'pointer', color:'#1890ff' }}
              onClick={() => handleEditAdmin( record )}
              type="link"
            >
              编辑
            </span>
            {
              !record.isSync && ( 
              <Popconfirm
                placement="top"
                title="密码将重置为123456,是否重置？"
                onConfirm={() => resetManagerPassword( record )}
                okText="是"
                cancelText="否"
              >
                <span
                  className={styles.btnsBtn}
                  style={{ cursor:'pointer', color:'#f5222d' }}
                  type="link"
                >
                重置密码
                </span>
              </Popconfirm> 
              )
            }
            

          </div>
        )
      },
    },
  ];


  const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      }
  };

  // 获取组织结构树
  const getDepartmentTree = () => {
    dispatch( {
      type: 'system/getDepartmentTree',
      payload: {
        query:{},
        callBack:()=>{}
      }
    } )
  }

   // 获取角色列表
  const getRoleList = ( ) => {
    dispatch( {
      type: 'system/getRoleList',
      payload: {
        page:{
          pageNum: 1,
          pageSize: 500,
        }
      }
    } )
  }

  // 获取管理员列表
  const getManagerUserList = ( params, sorter ) => {
    const orderBySorterInfo = sorter || sortedInfo
    const sortValue = ( orderBySorterInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'system/getManagerUserList',
      payload: {
        page:{
         pageNum,
         pageSize,
         orderBy: `${orderBySorterInfo.columnKey} ${sortValue}`,
        },
        orgIds:checkedKeys,
        ...params
       },
      callBack: ( res ) => {
        if( res && res.list ){
          setManagerUserData( { ...res } )
        }
      }
    } )
  }
  //  编辑管理员
  const getEditManager = ( params, cb ) => {

    dispatch( {
      type: 'system/getEditManager',
      payload: {
        ...params,
      },
      callBack: ( res ) => {
        if( res ){
          if( cb ){
            cb()
          } else {
            editOrAddCallBack()
          }
        }
       }
    } )
  }

  // 重置管理员密码
  const resetManagerPassword = ( params ) => {
    const { id } = params
    dispatch( {
      type: 'system/resetManagerPassword',
      payload: {
        id
      },
      callBack: ( ) => {
         message.success( '重置密码成功!' )
         filterSubmit( searchBarRef.current.data )
       }
    } )
  }

  // 新增管理员
  const getAddManager = ( params ) => {
    dispatch( {
      type: 'system/getAddManager',
      payload: {
       ...params,
       password:123456
      },
      callBack: (  res ) => {
        if( res ){
          editOrAddCallBack()
        }
      }
    } )
  }

  // 新增编辑的回调
  const editOrAddCallBack = () => {
    const messageTxt = hasEditInfo ? '编辑管理员' : '添加管理员'
    setCurrentEditVisible( false )
    filterSubmit( searchBarRef.current.data )
    message.success( `${messageTxt}成功！` )
  }

  // 页面修改
  const onChangePage = (  paginationInfo ) => {
    const { current, pageSize:pSize } = paginationInfo;
    setPageNum( current )
    setPageSize( pSize )
  }

  // 搜索参数
  const filterSubmit = ( values ) => {
    setPageNum( 1 )
    setPageSize( 10 )
    getManagerUserList( values )
  }

  // 新增管理员
  const handleAddAdmin = () => {
    setCurrentEditData( {} )
    setCurrentEditVisible( true )
  }

  // 编辑管理员弹窗确认
  const handleEditAdminConfirm = (  ) => {
    validateFields( ( err, values ) => {
      if( !err ){
        // 数据处理
        const pureParams = { ...values }
        const roleGroupIds = values.roleGroups
        delete pureParams.roleGroups
        pureParams.roleGroupIds = roleGroupIds


        if( hasEditInfo ){
          getEditManager( { ...pureParams, id:currentEditData.id } )
        } else {
          getAddManager( pureParams )
        }
      } else {
        message.error( '请填写完整信息' )
      }
    } )
  }

  useEffect( () => {
    getRoleList()
    getDepartmentTree()
  }, [] )

  useEffect( ()=>{
    if( departmentTree.length ){
      setTreeData( departmentTree )
      generateList( departmentTree );
    }
  }, [departmentTree] )

  useEffect( () => {
    getManagerUserList( searchBarRef.current.data )
  }, [pageNum, pageSize, checkedKeys] )

  useEffect( () => {
    if( roleData?.list ){
      const filterList = roleData.list.filter( item => item.name && item.id )
      const roleList = filterList.map( item => {
        return {
          label:item.name,
          value:item.id
        }
      } )
      setRoleSelectData( roleList )
    }

  }, [roleData] )

  // 角色下拉选项
  const renderRoleOptions = () => {
    return roleSelectData?.map( ( item ) => {
      return (
        <Option value={item.value} key={item.value}>{item.label}</Option>
      )
    } )
  }

  const renderMenuTree = data => {
    return data.map( item => {
      const index = item.name.indexOf( searchValue );
      const beforeStr = item.name.substr( 0, index );
      const afterStr = item.name.substr( index + searchValue.length );
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#1F3883' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );
      if ( item.children ) {
        return (
          <TreeNode key={item.id} title={title}>
            {renderMenuTree( item.children )}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} />;
    } );
  };


  const onSearch = ( e ) => {
    const { value } = e.target
    const currentExpandedKeys = dataList
      .map( item => {
        if ( item.name.indexOf( value ) > -1 ) {
          return getParentKey( item.id, treeData );
        }
        return null;
      } )
      .filter( ( item, i, self ) => item && self.indexOf( item ) === i );
      setExpandedKeys( currentExpandedKeys );
      setSearchValue( value );
      setAutoExpandParent( !!value );
  } 

  const onExpand = expandedKeysValue => {
    setAutoExpandParent( false );
    setExpandedKeys( expandedKeysValue );  
  };

  const onCheck = ( checkedKeysValue ) => {
    setPageNum( 1 )
    setCheckedKeys( checkedKeysValue )
  };

  const renderEditModal = () => {
    const title = hasEditInfo ? '编辑管理员' : '新建管理员'
    return (
      <Modal
        title={title}
        visible={currentEditVisible}
        width={700}
        maskClosable={false}
        onCancel={() => setCurrentEditVisible( false )}
        onOk={() => handleEditAdminConfirm( )}
        destroyOnClose
      >
        <Form onSubmit={handleEditAdminConfirm}>
          <FormItem label='头像' {...formLayout} hidden>
            {getFieldDecorator( 'profilePhoto', {
            rules: [
              { required: false, message: `请选择头像` },
            ],
          } )( <UploadModal /> )}
          </FormItem>
          <FormItem label="用户名" {...formLayout} hidden={hasEditInfo}>
            {getFieldDecorator( 'nick', {
                rules: [{ required: !hasEditInfo, message: '请输入用户名' }],
              } )( <Input style={{ width: '75%' }} placeholder="请输入用户名" /> )}
          </FormItem>
          <FormItem label="工号" {...formLayout} style={{ marginBottom:-20 }} hidden={hasEditInfo}>
            {getFieldDecorator( 'username', {
              rules: [{ required: true, message: '请输入工号' }],
            } )( <Input style={{ width: '75%' }} placeholder="请输入工号" /> )}
            <div className={styles.account_tips}>创建账号后默认密码为：123456</div>
          </FormItem>
          <FormItem label="角色" {...formLayout}>
            {getFieldDecorator( 'roleGroups', {
                rules: [{ required: false, message: '请选择角色' }],
              } )(
                <Select
                  style={{ width: '75%' }}
                  placeholder="请选择角色"
                  showSearch
                  filterOption={( input, option ) =>
                    option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                  }
                  mode='multiple'
                  getPopupContainer={( triggerNode )=>triggerNode.parentElement || document.body}
                >
                  {renderRoleOptions()}
                </Select>
              )}
          </FormItem>
          <FormItem label="是否启用" {...formLayout}>
            {getFieldDecorator( 'enable', {
                initialValue: true,
                rules: [{ required: true }],
              } )(
                <Radio.Group>
                  <Radio value>启用</Radio>
                  <Radio value={false}>禁用</Radio>
                </Radio.Group>
               )}
          </FormItem>
        </Form>
      </Modal>
    )
  }


  return (
    <GridContent>
      <Card
        bordered={false}
        title="管理员列表"
        bodyStyle={{ padding: '20px 32px 40px 32px' }}
      >
        <Row>
          <Col span={6}>
            <Search style={{ marginBottom: 8, width:'85%' }} placeholder="搜索 " onChange={onSearch} />
            <Tree
              checkable
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
            >
              {renderMenuTree( treeData )}
            </Tree>
          </Col>
          <Col span={18}>
            <div className={styles.admin_list_container}>
              <SearchBar
                ref={searchBarRef}
                searchEleList={searchEleList}
                searchFun={filterSubmit}
              />
            </div>
            <Button
              className={styles.add_btn}
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => handleAddAdmin()}
            >
              <div>添加管理员</div>
            </Button>
            <Table
              scroll={{ x:true }}
              loading={loading}
              columns={columns}
              dataSource={list}
              rowKey='id'
              pagination={pagination}
              onChange={onChangePage}
            />
          </Col>
        </Row>
      </Card>
      {renderEditModal()}
    </GridContent>
  )
}

const mapPropsToState = ( { system } ) => ( {
  roleData: system.roleData,
  loading: system.loading,
  departmentTree:system.departmentTree
} )

export default Form.create(  )( connect( mapPropsToState )( Index ) )
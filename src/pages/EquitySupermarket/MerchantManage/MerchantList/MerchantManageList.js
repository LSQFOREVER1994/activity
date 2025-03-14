import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router'
import { Table, Card, Tooltip, Form, Icon, message, Modal, Row, Switch, Popconfirm, Input, Tree, Spin, Button, Tabs, Select, Empty } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import styles from './MerchantManageList.less';
import UploadModal from '@/components/UploadModal/UploadModal'

const FormItem = Form.Item
const { TextArea } = Input
const { TreeNode } = Tree;
const { TabPane } = Tabs;
const { Option } = Select;
@Form.create()
@connect( ( { merchantManage } ) => {
  return {
    ...merchantManage
  }
} )

class MerchantManageList extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    const authorityList = window.localStorage.getItem( 'JINIU-CMS-authority' ) || [];
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      current: undefined,
      visible: false,
      publicKeyEye: true,
      privateKeyEye: true,
      secretKeyEye: true,
      // tree
      currentTree: undefined,
      treeVisible: false,
      expandedKeys: ['parent'],
      autoExpandParent: true,
      checkedKeys: [],
      sendCheckedKeys: [],
      showAll: false,
      // 商户可见权限
      selectUsers: [],
      addManagerVisible: false,
      isClick: false,
      authorityList,
      hasPermission: false,
      merchantOption: [],
    };
    this.searchBar = React.createRef()
  }

  componentDidMount() {
    const { authorityList } = this.state;
    this.getListData();
    this.getMerchantName();
    this.getRoleGroupList();
    if ( authorityList.includes( 'MERCHANT_RIGHT_ADMIN' ) ) {
      this.setState( {
        hasPermission: true
      } )
    }
  };

  // 获取对应角色码用户列表
  getRoleGroupList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/getRoleGroupList',
      payload: {
        roleCode: 'ACTIVITY_LIST_GET'
      },
      successFun: () => { }
    } );
  }

  // 当前商户管理者列表
  getManagerList = () => {
    const { current } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/getManagerList',
      payload: {
        merchantId: current.id
      },
      successFun: () => { }
    } );
  }

  // 添加管理员弹窗
  handleAddManagerVisible = () => {
    this.setState( {
      addManagerVisible: !this.state.addManagerVisible,
      selectUsers: []
    } )
  }

  // 添加管理员
  addManager = () => {
    const { current, selectUsers = [], isClick } = this.state
    const { dispatch, roleGroupList, managersLoading } = this.props;

    if ( isClick || managersLoading ) return
    if ( !selectUsers.length ) {
      message.error( '请选择要添加的管理员！' )
      return
    }
    this.setState( {
      isClick: true
    } )

    // 处理为数组
    const managers = new Array( selectUsers.length ).fill( {} ).map( ( item, index ) => {
      const findUserItem = roleGroupList && roleGroupList.find( uitem => String( uitem.id ) === selectUsers[index] )
      const { nick, username } = findUserItem
      return {
        merchantId: current.id,
        role: "MANAGER",
        userId: selectUsers[index],
        nick,
        username,
      }
    } )
    dispatch( {
      type: 'merchantManage/addManager',
      payload: {
        list:managers 
      },
      successFun: ( res ) => {
        if ( res ) {
          this.setState( {
            isClick: false
          } )
          message.success( '添加管理员成功！' )
          this.handleAddManagerVisible()
          this.getManagerList()
        }
      }
    } );
  }

  // 删除管理员
  deleteManager = ( item ) => {
    const { dispatch } = this.props;
    const { isClick } = this.state;
    if ( isClick ) { return }
    this.setState( {
      isClick: true
    } )
    dispatch( {
      type: 'merchantManage/deleteManager',
      payload: {
        ...item
      },
      successFun: ( res ) => {
        message.success( res.message )
        this.getManagerList()
        this.setState( {
          isClick: false
        } )
      }
    } )
  }

  // 切换tab
  changeTabs = ( e ) => {
    if ( e === 'authConfig' ) {
      this.getRoleGroupList();
      this.getManagerList();
    }
  }

  // 多选框选择
  handleSelectUser = ( selectUsers ) => {
    this.setState( {
      selectUsers
    } )
  }

  // 下拉框商户名称列表
  getMerchantName = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/getMerchantNames',
      callBackFunc: ( res ) => {
        const merchantOption = [{ label: '全部', value: '' }]
        res.forEach( item => {
          const obj = { label: item.name, value: item.name }
          merchantOption.push( obj )
        } )
        this.setState( {
          merchantOption
        } )
      }
    } );
  }

  // 删除
  deleteItem = ( e, item ) => {
    e.stopPropagation();
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/delMerchant',
      payload: { id },
      callFunc: () => {
        message.success( '删除商户成功' );
        this.setState( {
          pageNum: 1,
        }, () => this.filterSubmit() );
        this.getMerchantName();
      }
    } );
  }

  // 是否开启提醒
  changeStatus = ( item ) => {
    const { id, status } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/changeStatus',
      payload: {
        id,
        status: status ? 0 : 1,
      },
      callFunc: () => {
        const text = status === true ? '禁用成功' : '启用成功';
        message.success( text );
        this.getListData( this.searchBar.current.data );
      }
    } );
  }

  // 编辑商户
  getDetail = ( code ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/getMerchantDetail',
      payload: { code },
      callFunc: ( res ) => {
        this.showModal( res )
      }
    } );
  }

  // 对话框
  showModal = ( item ) => {
    const { form } = this.props;
    this.setState( {
      current: item,
      visible: !this.state.visible
    }, () => {
      if ( item === undefined ) {
        form.setFieldsValue( { status: true } )
        // 开发环境兑换链接
        // form.setFieldsValue({ exchangeLink: 'https://www.jiniutech.com/test/activities/prizeExchange/index.html' })
        // 生产环境兑换链接
        // form.setFieldsValue( { exchangeLink: 'https://m.jiniutech.com/hd/prizeExchange/index.html' } )
      }
    } );
  }

  closeModal = () => {
    this.setState( {
      visible: !this.state.visible,
      current: undefined,
    } );
  };

  handleSubmit = ( e ) => {
    e.persist();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) { return; }
      const params = id ? Object.assign( current, fieldsValue ) : { ...fieldsValue };
      params.status = params.status === true ? 1 : 0;
      const dontSend = ['publicKey', 'privateKey', 'secretKey'];
      Object.keys( params ).filter( key => dontSend.includes( key ) ).forEach( key => delete params[key] );
      dispatch( {
        type: 'merchantManage/editMerchant',
        payload: params,
        callFunc: ( res ) => {
          if ( res.success ) {
            message.success( res.message );
            this.getListData( this.searchBar.current.data );
            this.getMerchantName();
            this.setState( {
              visible: false,
              current: undefined,
            } );
          } else {
            this.getListData( this.searchBar.current.data );
          }
        },
      } );
    } );
  }

  // 查询Key
  selectKey = ( type ) => {
    const { form } = this.props;
    const { publicKeyEye, privateKeyEye, secretKeyEye } = this.state;
    switch ( type ) {
      case "PUB":
        if ( publicKeyEye ) {
          this.getKey( type );
        } else {
          form.setFieldsValue( { publicKey: '******' } );
          this.setState( { publicKeyEye: true } )
        }
        break;
      case "PRI":
        if ( privateKeyEye ) {
          this.getKey( type );
        } else {
          form.setFieldsValue( { privateKey: '******' } );
          this.setState( { privateKeyEye: true } )
        }
        break;
      case "SEC":
        if ( secretKeyEye ) {
          this.getKey( type );
        } else {
          form.setFieldsValue( { secretKey: '******' } );
          this.setState( { secretKeyEye: true } )
        }
        break;
      default:
        break;
    }
  }

  getKey = ( type ) => {
    const { id } = this.state.current;
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/getKey',
      payload: {
        id,
        type
      },
      callFunc: ( res ) => {
        this.showKey( type, res.result );
        message.success( res.message );
      }
    } )
  }

  showKey = ( type, result ) => {
    const { form } = this.props;
    switch ( type ) {
      case "PUB":
        form.setFieldsValue( { publicKey: result } )
        this.setState( { publicKeyEye: false } )
        break;
      case "PRI":
        form.setFieldsValue( { privateKey: result } )
        this.setState( { privateKeyEye: false } )
        break;
      case "SEC":
        form.setFieldsValue( { secretKey: result } )
        this.setState( { secretKeyEye: false } )
        break;
      default:
        break;
    }
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getListData( data );
    } )
  }

  // 获取商户列表数据
  getListData = ( data ) => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/getMerchantList',
      payload: {
        page:{
          pageNum,
          pageSize,
          // orderBy:sortValue
          orderBy: sortedInfo.columnKey ? `${sortedInfo.columnKey || ''} ${sortValue}` : 'sort desc',
        },
        ...data
      },
    } );
  }

  // 排序改变
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'createTime' ) {
      sortObj.columnKey = 'create_time'
    }
    this.setState( {
      sortedInfo: sortObj,
      pageNum: current,
      pageSize,
    }, () => this.getListData( this.searchBar.current.data ) );
  }

  // 跳转到商户权益页面
  handleJump = ( item ) => {
    const { dispatch } = this.props;
    dispatch( routerRedux.push( {
      pathname: '/equitySupermarket/merchantManage/merchantRights',
      query: { data: item }
    } ) )
  }

  // 获取商户可见权益数据
  getTree = ( item ) => {
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/getMerchantTree',
      payload: { id },
      callFunc: ( res ) => {
        if ( res.success ) {
          this.setState( {
            currentTree: res.result,
            current: item
    
        }, this.getManagerList )
          this.showTree( res.result )
        }
      }
    } );
  }

  // 显示商户可见权益数据状态
  showTree = ( tree ) => {
    const currentTreeData = [];
    const temp = [];
    // 第一次处理，取出所有一级分类categoryChildren
    tree.forEach( i => {
      temp.push( i.categoryChildren )
    } )
    // 二次处理，打平并遍历二级分类products，取出所有商品item
    temp.flat().forEach( i => {
      if ( i.products ) {
        i.products.forEach( item => {
          currentTreeData.push( item )
        } )
      }
    } )
    // 获取所有商品可见状态
    // eslint-disable-next-line array-callback-return, consistent-return
    const checkedKeys = currentTreeData.map( i => { if ( i.rightStatus === 'SHOW' ) return i.id } ).filter( Boolean );
    const stringKeys = checkedKeys.map( String );
    this.setState( {
      treeVisible: !this.state.treeVisible,
      checkedKeys,
    }, () => this.onCheck( stringKeys ) );
  }

  // 关闭商户可见权益弹窗
  closeTree = () => {
    this.setState( {
      treeVisible: !this.state.treeVisible,
      expandedKeys: ['parent'],
    } );
  }

  handleTree = ( e ) => {
    e.preventDefault();
    const { sendCheckedKeys, showAll } = this.state;
    // sendCheckedKeys选中项，sendObj所有选中项{id: id, rightStatus: "SHOW"}
    const sendObj = [];
    // const arr = showAll ? [] : sendCheckedKeys;
    const arr = sendCheckedKeys;
    for ( let i = 0; i < arr.length; i += 1 ) {
      const obj = {}
      const key = 'id';
      obj[key] = arr[i];
      obj.rightStatus = 'SHOW';
      sendObj.push( obj )
    }

    const { id } = this.state.current
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantManage/changeMerchantTree',
      payload: {
        id,
        products:sendObj
      },
      callFunc: ( res ) => {
        message.success( res );
      }
    } )
    this.closeTree();
  }

  // 展开树
  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState( {
      expandedKeys,
      autoExpandParent: false,
    } );
  };

  // 选中叶子节点
  onCheck = checkedKeys => {
    const showAll = checkedKeys.indexOf( 'parent' ) !== -1;
    let newCheckedKeys = checkedKeys;
    newCheckedKeys = checkedKeys.filter( ( item ) => {
      if ( item.substring( 0, 6 ) === 'parent' ) {
        return false
      } return true
    } ).map( Number )

    this.setState( {
      showAll,
      checkedKeys,
      sendCheckedKeys: newCheckedKeys,
    } );
  };

  // 渲染一级枝干categoryChildren
  renderTreeNodes = data =>
    data.map( item => {
      return (
        <TreeNode key={`parentFirstSort${item.id}`} title={item.name}>
          {this.renderSecondary( item.categoryChildren )}
        </TreeNode>
      );
    } );

  // 渲染二级枝干products
  renderSecondary = data =>
    data.map( item => {
      if ( item.products.length > 0 ) { return <TreeNode key={`parentSecondSort${item.id}`} title={item.name}>{this.renderProducts( item.products )}</TreeNode>; }
      return <TreeNode key={`parentSecondSort${item.id}`} title={item.name} />;
    } );

  // 渲染叶子节点
  renderProducts = data => data.map( item => { return <TreeNode key={item.id} title={item.name} />; } )

  // 渲染管理员列表
  renderRightsManager = () => {
    const { managerList, managersLoading } = this.props
    const listView = managerList.length ? managerList.map( ( item ) => {
      const { userId, nick, username } = item
      return (
        <div className={styles.manager_list} key={userId}>
          <div className={styles.manager_info}>
            <span>{nick}</span>
            <span>{username}</span>
          </div>
          <Button onClick={() => this.deleteManager( item )}>删除</Button>
        </div>
      )
    } ) : <Empty description='暂无管理员数据' />
    return (
      <div>
        <Button
          style={{ width: '100%', margin: '20px 0', background: '#1F3883', color: '#fff' }}
          icon="plus"
          onClick={() => this.handleAddManagerVisible()}
        >
          添加管理员
        </Button>
        <div className={styles.user_info_box} style={managerList.length === 0 ? { justifyContent: 'center' } : {}}>
          <Spin spinning={managersLoading}>
            {listView}
          </Spin>
        </div>
      </div>
    )
  }

  // 添加管理员弹窗
  renderAddManager = () => {
    const { addManagerVisible, selectUsers, isClick } = this.state
    const { roleGroupList, managerList } = this.props
    let fliterArr = roleGroupList;
    // 实现 数组a - 数组b
    if ( roleGroupList.length ) {
      fliterArr = roleGroupList.filter( ( item ) => managerList.every( v => v.userId !== item.id ) )
    }
    const userOptions = fliterArr.length > 0 && fliterArr.map( ( roleItem ) => {
      const { id, username, nick } = roleItem
      return (
        <Option value={String( id )} key={id}>
          {`${username}(${nick})`}
        </Option>
      )
    } )
    return (
      <Modal
        title='添加管理员'
        visible={addManagerVisible}
        maskClosable={false}
        onOk={this.addManager}
        onCancel={this.handleAddManagerVisible}
        className={styles.global_styles}
        footer={[
          <Button key="back" onClick={this.handleAddManagerVisible}>取消</Button>,
          <Button key="submit" type="primary" loading={isClick} onClick={this.addManager}>确定</Button>,
        ]}
      >
        <Select
          mode="multiple"
          style={{ width: '80%' }}
          placeholder="请输入用户昵称或用户名添加指定用户"
          value={selectUsers}
          showSearch
          filterOption={( input, option ) =>
            option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
          }
          onChange={( val ) => this.handleSelectUser( val )}
          getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
        >
          {userOptions}
        </Select>
      </Modal>
    )
  }

  render() {
    const { loading, merchantList: { total, list }, form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, current = {}, publicKeyEye, privateKeyEye, secretKeyEye, sortedInfo, treeVisible, currentTree } = this.state;
    const searchEleList = [
      {
        key: 'name',
        label: '商户名称',
        type: 'Select',
        optionList: this.state.merchantOption
      },
      {
        key: 'status',
        label: '状态',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 1,
            label: '启用',
          }, {
            value: 0,
            label: '禁用',
          },
        ]
      },
    ]
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      }
    };
    const columns = [
      {
        title: <span>编码</span>,
        dataIndex: 'code',
        key: 'code',
        render: code => <span>{code}</span>,
      },
      {
        title: <span>商户名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>LOGO</span>,
        dataIndex: 'img',
        key: 'img',
        render: img => <div className={styles.logoBox}><img className={styles.logo} src={img} alt="商户LOGO" /></div>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'status',
        key: 'status',
        render: ( status, item ) => (
          <Popconfirm
            placement="top"
            title={status === true ? '是否禁用？' : '是否启用？'}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            onConfirm={() => this.changeStatus( item )}
            okText="是"
            cancelText="否"
          >
            <Switch checked={!!status} />
          </Popconfirm>
        ),
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: ( v, item ) => (
          <div>
            {/* <a onClick={() => this.handleJump(item)} style={{ color: "#5087ec" }}>商户权益</a> */}
            {/* <Link to={{ pathname: `/equitySupermarket/merchantManage/merchantRights`, query: { data: item } }} replace={true} style={{ color: "#5087ec" }}>商户权益</Link> */}
            <Link to={`/equitySupermarket/merchantManage/merchantRights?id=${item.id}`} replace style={{ color: "#5087ec" }}>商户权益</Link>
            <a style={{ color: "#5087ec", padding: "0 10px 0 20px" }} onClick={() => this.getTree( item )}>权益可见用户</a>
            <a style={{ color: "#5087ec", padding: "0 20px 0 10px" }} onClick={() => this.getDetail( item.code )}>编辑</a>
            <Popconfirm
              placement="top"
              title="是否确定删除？"
              onConfirm={( e ) => this.deleteItem( e, item )}
              okText="确定"
              cancelText="取消"
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <span
                style={{ cursor: 'pointer', color: '#f5222d' }}
                type="link"
              >
                删除
              </span>
            </Popconfirm>
          </div>
        ),
      },
    ];
    const modalFooter = {
      okText: '确定',
      onOk: this.handleSubmit,
      onCancel: this.closeModal
    };
    const treeModalFooter = {
      okText: '确定',
      onOk: this.handleTree,
      onCancel: this.closeTree
    };

    return (
      <GridContent>
        <Card
          bordered={false}
          title={
            <div className={styles.grid_title}>
              <span>商户列表</span>
              {/* <Tooltip title='新增商户'>
                <Icon className={styles.add_icon} onClick={() => this.showModal()} type='plus' />
              </Tooltip> */}
            </div>
          }
          extra={<Button type='primary' icon='plus-circle' onClick={() => this.showModal()}>新增商户</Button>}
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.global_styles}>
            <SearchBar
              ref={this.searchBar}
              searchEleList={searchEleList}
              searchFun={this.filterSubmit}
              loading={loading}
            />
          </div>
          <Table
            size="middle"
            rowKey="id"
            style={{ marginTop: '20px' }}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        <Modal
          className={styles.global_styles}
          title={current.id ? '编辑' : '新增'}
          visible={visible}
          {...modalFooter}
          destroyOnClose
          footer={[
            <Button key="back" onClick={this.closeModal}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>保存</Button>,
          ]}
        >
          <Spin spinning={loading}>
            <div className={styles.common_container}>
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <FormItem label='编码' {...this.formLayout}>
                    {getFieldDecorator( 'code', {
                      rules: [{ required: true, message: `请输入编码` }, { pattern: new RegExp( /^[A-Za-z0-9]+$/ ), message: '只能输入字母和数字！' }],
                      initialValue: current.code
                    } )(
                      <Input disabled={!!current.id} maxLength={8} placeholder='请输入编码' />
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label='商户名称' {...this.formLayout}>
                    {getFieldDecorator( 'name', {
                      rules: [{ required: true, message: `请输入商户名称` }],
                      initialValue: current.name
                    } )(
                      <Input maxLength={20} placeholder='请输入商户名称' />
                    )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label='LOGO' {...this.formLayout}>
                    {getFieldDecorator( 'img', {
                      rules: [{ required: true, message: `请上传LOGO图片` }],
                      initialValue: current.img
                    } )( <UploadModal /> )}
                    <span>支持.jpg .png .gif格式, 尺寸为400px * 400px</span>
                  </FormItem>
                </Row>
                {/* {current.id ? (
                  <>
                    <Row>
                      <FormItem label='公钥' {...this.formLayout}>
                        {getFieldDecorator( 'publicKey', {
                          initialValue: '******'
                        } )( <Input
                          disabled
                          suffix={
                            <Tooltip title="点击查询公钥">
                              <Icon style={{ cursor: 'pointer' }} type={publicKeyEye ? "eye-invisible" : "eye"} onClick={() => this.selectKey( 'PUB' )} />
                            </Tooltip>}
                        /> )}
                      </FormItem>
                    </Row>
                    <Row>
                      <FormItem label='私钥' {...this.formLayout}>
                        {getFieldDecorator( 'privateKey', {
                          initialValue: '******'
                        } )( <Input
                          disabled
                          suffix={
                            <Tooltip title="点击查询私钥">
                              <Icon style={{ cursor: 'pointer' }} type={privateKeyEye ? "eye-invisible" : "eye"} onClick={() => this.selectKey( 'PRI' )} />
                            </Tooltip>}
                        /> )}
                      </FormItem>
                    </Row>
                    <Row>
                      <FormItem label='加密KEY' {...this.formLayout}>
                        {getFieldDecorator( 'secretKey', {
                          initialValue: '******'
                        } )( <Input
                          disabled
                          suffix={
                            <Tooltip title="点击查询加密KEY">
                              <Icon style={{ cursor: 'pointer' }} type={secretKeyEye ? "eye-invisible" : "eye"} onClick={() => this.selectKey( 'SEC' )} />
                            </Tooltip>}
                        /> )}
                      </FormItem>
                    </Row>
                  </> ) : null} */}
                {/* <Row>
                  <FormItem label='红包兑换地址' {...this.formLayout}>
                    {getFieldDecorator( 'exchangeLink', {
                      initialValue: current.exchangeLink
                    } )( <Input placeholder='请输入兑换地址' /> )}
                  </FormItem>
                </Row> */}
                {/* <Row>
                  <FormItem label='权益回调地址' {...this.formLayout}>
                    {getFieldDecorator( 'notifyUrl', {
                      initialValue: current.notifyUrl
                    } )( <Input placeholder='请输入权益回调地址' /> )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label='物流回调地址' {...this.formLayout}>
                    {getFieldDecorator( 'logisticsPushNotifyUrl', {
                      initialValue: current.logisticsPushNotifyUrl
                    } )( <Input placeholder='请输入物流回调地址' /> )}
                  </FormItem>
                </Row> */}
                <Row>
                  <FormItem label='状态' {...this.formLayout}>
                    {getFieldDecorator( 'status', {
                      rules: [{ required: true }],
                      valuePropName: 'checked',
                      initialValue: current.status
                    } )( <Switch /> )}
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label='描述' {...this.formLayout}>
                    {getFieldDecorator( 'description', {
                      initialValue: current.description
                    } )(
                      <TextArea maxLength={200} placeholder='请输入描述' style={{ height: '100px' }} />
                    )}
                  </FormItem>
                </Row>
              </Form>
            </div>
          </Spin>
        </Modal>
        <Modal
          className={styles.global_styles}
          title="可见权益设置"
          visible={treeVisible}
          // {...treeModalFooter}]         
          onCancel={this.closeTree}
          destroyOnClose
          bodyStyle={{ paddingTop: 0 }}
          footer={null}
        >
          <Spin spinning={loading}>
            <Tabs defaultActiveKey='authConfig' onChange={this.changeTabs}>
              {/* <TabPane tab='商户可见权益' key='rightsConfig'>
                <div className={styles.common_container}>
                  <Tree
                    checkable
                    selectable={false}
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                  >
                    <TreeNode key='parent' title='全部'>{currentTree ? this.renderTreeNodes( currentTree ) : ''}</TreeNode>
                  </Tree>
                </div>
              </TabPane> */}
              <TabPane tab='权益可见用户' key='authConfig' disabled={!this.state.hasPermission}>
                <div className={styles.common_container} style={{ minHeight: 300 }}>
                  {this.renderRightsManager()}
                </div>
              </TabPane>
            </Tabs>
          </Spin>
        </Modal>
        {this.renderAddManager()}
      </GridContent>
    );
  };
}

export default MerchantManageList;

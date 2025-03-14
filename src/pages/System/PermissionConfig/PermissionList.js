
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import EditModal from './EditModal';

@connect( ( { system } ) => {
  return {
    permissionLoading: system.permissionLoading,
    permissionMap: system.permissionMap,
    permissionDetail: system.permissionDetail,
  }
} )

class PermissionList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    editModalVisible: false,
  };

  searchBar = React.createRef()

  componentDidMount() {
    this.getPermissionList();
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getPermissionList( data );
    } )
  }

  // 获取权限
  getPermissionList = ( data ) => {
    const { pageNum, pageSize, } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getPermissionList',
      payload: {
        pageNum,
        pageSize,
        ...data
      },
    } );
  }


  // 获取权限组详情
  getPermissionDetail = ( code ) => {
    if ( !code ) return
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getPermissionDetail',
      payload: { code },
      callBack: ( res ) => {
        if ( res ) {
          this.setState( {
            editModalVisible: true
          } )
        }
      }
    } );
  }


  // 编辑
  getEditPermission = ( param, callBack ) => {
    if ( !param ) return
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getEditPermission',
      payload: { ...param },
      callBack: ( res ) => {
        if ( res && res.success ) {
          this.handleEditModalCancel()
          callBack()
        } else if ( res && res.tip ) {
          message.error( res.tip )
        }
      }
    } );
  }


  // 排序
  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, () => this.getPermissionList( this.searchBar.current.data ) );
  };


  // 编辑弹窗关闭
  handleEditModalCancel = () => {
    this.setState( {
      editModalVisible: false
    } )
  }

  // 编辑弹窗确认
  handleEditModalSubmit = ( res, callBack ) => {
    const { permissionDetail } = this.props
    if ( res && res.length ) {
       const newPermissions = res.filter( info=>{
        return info.enable === true
       } )
      const param = {
        ...permissionDetail,
        permissions: newPermissions
      }
      this.getEditPermission( param, callBack )
    }
  }

  render() {
    const { permissionLoading, permissionMap: { total, list } } = this.props;
    const { pageSize, pageNum, editModalVisible } = this.state;
    const searchEleList = [
      {
        key: 'menuName',
        label: '菜单名称',
        type: 'Input'
      },
      {
        key: 'name',
        label: '权限组',
        type: 'Input'
      }
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
        title: <span>所属菜单</span>,
        dataIndex: 'menuName',
        key: 'menuName',
        render: menuName => <span>{menuName || '--'}</span>,
      },
      {
        title: <span>权限组</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'code',
        fixed: 'right',
        width: 100,
        render: ( code ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => this.getPermissionDetail( code )}
            >
              编辑
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title='权限配置'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={searchEleList}
            searchFun={this.filterSubmit}
            loading={permissionLoading}
          />
          <Table
            scroll={{ x: 1000 }}
            size="middle"
            rowKey="id"
            columns={columns}
            loading={permissionLoading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        <EditModal
          editModalVisible={editModalVisible}
          handleEditModalSubmit={this.handleEditModalSubmit}
          handleEditModalCancel={this.handleEditModalCancel}
        />
      </GridContent>
    );
  };
}

export default PermissionList;

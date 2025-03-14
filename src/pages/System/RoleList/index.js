/*
 * @Author: RidingWind
 * @Date: 2018-07-12 09:46:05
 * @Last Modified by: 绩牛金融 - RidingWind
 * @Last Modified time: 2018-07-12 15:30:03
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Button, Table, message, Modal, Select, Input } from 'antd';
import RoleListModal from './RoleListModal';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';

const { confirm } = Modal;
const { Option } = Select;

@connect( ( { system } ) => ( {
  loading: system.loading,
  roleData: system.roleData,
} ) )

class RoleList extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      pageNum: 1,
      pageSize: 10,
      visible: false,
      current:{},
      nameValue: '',
    };
  }

  componentDidMount() {
    this.fetchList(); // 获取角色列表
  }

  onChangePage = ( page ) => {
    this.setState( {
      pageNum: page.current,
    }, this.fetchList );
  }

  fetchList = () => {
    const { pageSize, pageNum, nameValue } = this.state;
    const { dispatch } = this.props;
    const params = {
      page:{
        pageNum,
        pageSize,
      },
      name:nameValue,
    }
    dispatch( {
      type: 'system/getRoleList',
      payload: params
    } );
  }

  onDelete = ( data ) => {
    const { dispatch } = this.props;
    const { name, id }=data;
    const that =this;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: '删除角色',
      content: `确定将角色【${name}】删除?`,
      onOk() {
        dispatch( {
          type: 'system/deleteRoleList',
          payload: {
            id,
          },
          successFunc: ( text ) => {
            message.success( text );
            that.fetchList();
          },
        } );
      },
    } );
  }

  // 新建list
  onNewList = () => {
    this.setState( {
      visible: true,
      current:{}
    } )
  }

  // 编辑list
  onEditList = ( data ) => {
    this.setState( {
      visible: true,
      current:data
    } )
  }

  onCloseModal = () => {
    this.setState( {
      visible: false,
      current:{}
    } );
  }

  onChange=( type, val )=>{
    this.setState( {
      [type]:val
    } )
  }

  empty=()=>{
    this.setState( {
      nameValue:'',
    }, this.fetchList )
  }

  goSearch = () => {
    this.setState( {
      pageNum: 1,
    }, this.fetchList );
  }

  render() {
    const {
      loading, roleData: { list, total, pageNum },
    } = this.props;
    const { pageSize, visible, current, nameValue } = this.state;

    /* table columns */
    const columns = [
      {
        title: <span>角色名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      // {
      //   title: <span>状态</span>,
      //   dataIndex: 'enable',
      //   render: enable => <span htmlFor="n">{enable ? '启用' : '禁用'}</span>,
      // },
      {
        title: <span>描述</span>,
        dataIndex: 'description',
        render: description => <span>{description}</span>,
      },
      {
        title: <span>操作</span>,
        render: ( id, record ) => (
          <div className={styles.btns}>
            <span
              className={styles.btnsBtn}
              style={{ marginRight:15, cursor:'pointer', color:'#1890ff' }}
              onClick={() => this.onEditList( record )}
              type="link"
            >
              编辑
            </span>

            <span
              className={styles.btnsBtn}
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={() => this.onDelete( record )}
            >
              删除
            </span>

          </div>
        ),
      },
    ];

    /* pagination */
    const pagination = {
      total,
      current: pageNum,
      defaultPageSize: pageSize,
      showQuickJumper: true,
      showTotal: ( t, r ) => `${r[0]}-${r[1]} 共 ${t} 条记录`,
    };
    const extraContent = (
      <div className={styles.extraContent}>
        <span className={styles.btn}>角色名称:</span>
        <Input
          maxLength={30}
          value={nameValue}
          allowClear
          placeholder="请输入角色名称"
          onChange={( e ) => this.onChange( 'nameValue', e.target.value )}
          style={{ width: 150, marginLeft: '10px' }}
        />
        <Button type="primary" style={{ margin:'0 20px' }} onClick={this.goSearch}>搜索</Button>
        <Button onClick={this.empty}>清空</Button>
      </div>
    );

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            extra={extraContent}
            title="角色列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.onNewList}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              rowKey="code"
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={pagination}
              onChange={this.onChangePage}
            />
          </Card>
        </div>
        {
          visible ? (
            <RoleListModal
              visible={visible}
              current={current}
              fetchList={this.fetchList}
              onCloseModal={this.onCloseModal}
            />
          ) : null
        }
      </GridContent>
    );
  }
}



export default RoleList;

/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-15 10:59:51
 * @LastEditTime: 2024-09-25 09:28:02
 * @LastEditors: zq636443 zq636443@163.com
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Card, Button, Table, Divider, message, Popconfirm, Select, Input, Modal, Tag, Tabs, Upload } from 'antd';
import { exportXlsx } from '@/utils/utils';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ListModal from './UserMoadal';
import TagsModal from './TagsModal';
import styles from './index.less';
import serviceObj from '@/services/serviceObj'



const { Option } = Select;
const { TabPane } = Tabs;

const { userUploadService } = serviceObj
let Timer
@connect( ( { system } ) => ( {
  loading: system.loading,
  datas: system.datas,
  roleData: system.roleData,
  tags: system.tags,
} ) )
@Form.create()


class UserList extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      moadaType: 'userModal',
      portfolio: {},
      pageNum: 1,
      pageSize: 10,
      roleGroupId: '',
      tagId: '',
      userNo:'',
      structure: '',
      account:'',
      mobile:'',
      visibleExport: false,
      userListFile: null,
      visibleFetchStickTag: false, // 贴标签控制渲染
      stickList: '', // 贴标签窗口用户列表
      stickTagList: [], // 贴标签标签列表
      visible: false,
      tagName: ''
    };
  }

  componentWillMount() {
    this.fetchTagList( {} );
    this.getRoleList( {} );
    this.fetchList();
  }

  fetchList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, roleGroupId, userNo, structure, account, mobile, tagId } = this.state;
    dispatch( {
      type: 'system/getUserList',
      payload: {
        query: {
          tagId,
          page:{
            pageNum,
            pageSize
          },
          userNo,
          structure,
          account,
          mobile,
          roleGroupId,
        },
      },
    } );
  }

  fetchTagList = ( { pageNum = 1, pageSize = 1000 } ) => {
    const { tagName } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/getTagList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: 'id desc',
        },
        tagName
      }
    } )
  }

  // 获取角色列表
  getRoleList = ( { name = '', num = 0 } ) => {
    const { roleData: { list, total }, dispatch } = this.props;
    if ( !name && list && list.length && list.length === total ) return;
    dispatch( {
      type: 'system/getRoleList',
      payload: {
        page:{
          pageNum: 1,
          pageSize: 100 + num,
        },
        name
      }
    } )
  }

  onChangePage = ( page ) => {
    this.setState( {
      pageNum: page.current,
    }, this.fetchList );
  }

  // 新建list
  onNewList = () => {
    this.setState( {
      portfolio: {},
      visible: true,
    } );
  }

  // 编辑list
  onEditList = ( record ) => {
    this.setState( {
      portfolio: record,
      visible: true,
    } );
  }


  // 修改用户状态 TODO:后端为返回改字段
  onEditUserStatue = ( record ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/updateUserStatus',
      payload: {
        query: {
          userId: record.id,
          freezeStatus: record.enable ? "FREEZE" : "UNFREEZE",
        },
        onLoadFunc: () => {
          this.fetchList();
        },
        successFunc: ( text ) => {
          message.success( text );
        },
        errorFunc: ( text ) => {
          message.error( text );
        },
      }
    } )
  }


  resetPassword = ( record ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'system/resetPassword',
      payload: {
        query: {
          ...record,
          password: '123456',
        },
        success: () => {
          message.success( '密码重置成功！' );
          this.fetchList()
        },
      },
    } );
  }


  // 用户名筛选
  onInputChange = ( key, value ) => {
    if ( !value ) {
      this.setState( { [key]: undefined } );
    } else {
      this.setState( { [key]: value } );
    }
  }

  // 权限筛选
  onRoleChange = ( value ) => {
    this.setState( { roleGroupId: value } );
  }

  /**
   * 标签筛选
   */
  onTagChange = ( tagId ) => {
    this.setState( { tagId } );
  }

  // 清空
  empty = () => {
    const { moadaType } = this.state;
    if ( moadaType === 'userModal' ) {
      this.setState( {
        userNo:'',
        structure: '',
        account:'',
        mobile:'',
        roleGroupId: '',
        tagId: '',
        pageNum: 1,
      }, this.fetchList )
    } else {
      this.setState( {
        tagName: ''
      }, () => {
        this.fetchTagList( { pageNum: 1, pageSize: 10 } )
      } )
    }
  }

  // 搜索
  goSearch = () => {
    const { moadaType } = this.state;
    if ( moadaType === 'userModal' ) {
      this.setState( {
        pageNum: 1
      }, this.fetchList )
    } else {
      this.fetchTagList( { pageNum: 1, pageSize: 10 } )
    }
  }

  //  关闭模板
  onCloseModal = () => {
    this.setState( {
      portfolio: {},
      visible: false,
    } )
  }


  //  显示导出模板
  exportModal = () => {
    this.setState( {
      visibleExport: true
    } )
  }

  // 关闭导出模板
  handleCancel = () => {
    this.setState( {
      visibleExport: false,
      userListFile: null
    } );
  };

  // 导出模板确定
  handleOk = () => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.exporotHandleOk()
    }, 500 );
  }

  OkStickTagModal = () => {
    // 贴标签完成按钮
    const { dispatch, tags } = this.props;
    const { list: tagList = [] } = tags;
    const { stickTagList, stickList } = this.state;
    if ( !stickTagList.length || !stickList ) return;
    const tagIds = stickTagList.map( item => tagList.find( item1 => item === item1.name ).id )
    dispatch( {
      type: 'system/stickTag',
      payload: {
        query: {
          tagIds,
          updateAll: false,
          username: stickList,
        },
        successFunc: () => {
          setTimeout( () => {
            this.fetchList();
          }, 500 );
          this.closeStickTagModal();
        }
      }
    } )
  }

  closeStickTagModal = () => {
    this.setState( {
      visibleFetchStickTag: false,
    } )
  }

  //  处理导出的id
  onBlur = ( e ) => {
    const reg = /\s/;
    const reg2 = /[\uff0c]/;
    const idStr = e.target.value;
    if ( reg.test( idStr ) ) {
      const newStr = idStr.replace( /\s+/g, "," )
      this.setState( { newStr } )
    } else if ( reg2.test( idStr ) ) {
      const newStr = idStr.replace( /[\uff0c]/g, "," )
      this.setState( { newStr } )
    } else {
      this.setState( { newStr: idStr } )
    }
  }

  //  导出接口
  exporotHandleOk = () => {
    const { newStr } = this.state;
    const ids = newStr.split( "," );
    let paramsStr = '';
    ids.forEach( ( key ) => {
      paramsStr += `${paramsStr ? '&' : '?'}ids=${key}`
    } );
    const uri = `users/export/export.csv/new${paramsStr}`
    exportXlsx( {
      type: 'userService',
      uri,
      xlsxName: '用户信息.xlsx',
      callBack: () => { }
    } )
  }

  callback = ( key ) => {
    if ( key === '1' ) {
      this.setState( {
        moadaType: 'userModal'
      }, () => {
        this.fetchList();
        this.fetchTagList( {} );
      } )
    } else {
      this.setState( {
        moadaType: 'tagModal'
      }, this.fetchTagList( { pageSize: 10 } ) )
    }
  }

  tagNameChange = ( val ) => {
    this.setState( {
      tagName: val
    } )
  }

  downloadTemplate = () => {
    window.open( `${userUploadService}/users/export/template` )
  }

  beforeUpload = ( file ) => {
    const { userListFile } = this.state;
    if ( userListFile ) {
      message.error( '只能上传单个文件' )
      return false;
    }
    if ( file ) {
      if ( file.name && file.name.length > 25 ) {
        message.error( '文件名过长' )
        return false;
      }
      this.setState( {
        userListFile: file
      } )
    }
    return false;
  }


  

  onSubmitUserList = () => {
    const { userListFile } = this.state;
    const { dispatch } = this.props;
    if ( !userListFile ) {
      message.error( '请上传文件' )
      return;
    }
    const formData = new FormData();
    formData.append( "file", userListFile );
    dispatch( {
      type: 'system/importUserList',
      payload: {
        query: {
          file:formData
        },
        successFun: ( res ) => {
          if ( res ) {
            this.fetchTagList( {} );
            this.getRoleList( {} );
            this.fetchList();
            message.success( '导入用户成功' )
            this.setState( {
              userListFile: null,
              visibleExport: false
            } );
          }
        }
      }
    } );
  }


  render() {
    const {
      loading, datas: { list, total, pageNum }, tags, 
    } = this.props;
    const { list: tagList = [] } = tags;
    const {
      pageSize, portfolio, visibleExport, moadaType, visible, tagName,
      visibleFetchStickTag, stickList, stickTagList, mobile, account, userNo, structure, roleGroupId, tagId, userListFile
    } = this.state;

    const columns = [
      // {
      //   title: <span>ID</span>,
      //   dataIndex: 'id',
      //   fixed: 'left',
      //   width: 100,
      //   render: id => <span>{id}</span>,
      // },
      // {
      //   title: <span>头像</span>,
      //   dataIndex: 'profilePhoto',
      //   fixed: 'left',
      //   width: 150,
      //   render: profilePhoto => <Avatar shape="square" size={50} src={profilePhoto} icon='user' />,
      // },
      // {
      //   title: <span>用户名</span>,
      //   dataIndex: 'username',
      //   render: name => <span>{name}</span>,
      // },
      // {
      //   title: <span>昵称</span>,
      //   dataIndex: 'nick',
      //   render: nick => <span>{nick}</span>,
      // },
      {
        title: <span>手机号</span>,
        dataIndex: 'mobile',
        render: a => <span>{a || '--'}</span>,
      },
      {
        title: <span>资金账号</span>,
        dataIndex: 'account',
        render: b => <span>{b || '--'}</span>,
      },
      {
        title: <span>客户号</span>,
        dataIndex: 'userNo',
        render: c => <span>{c || '--'}</span>,
      },
      {
        title: <span>营业部</span>,
        dataIndex: 'structure',
        render: d => <span>{d || '--'}</span>,
      },
      {
        title: <span>标签</span>,
        dataIndex: 'tags',
        width: 350,
        render: ( id, info ) => {
          return (
            info.tags && info.tags.length && info.tags.map( item => (
              <Tag key={item.tagId}>
                {item.tagName}
              </Tag>
            ) )
          )
        },
      },
      // {
      //   title: <span>用户角色</span>,
      //   dataIndex: 'roleGroupId',
      //   width: 400,
      //   render: ( id, item ) => {
      //     let tagView
      //     if ( item && item.roleGroups && item.roleGroups.length ) {
      //       const tagItem = item.roleGroups.map( i => {
      //         return <Tag key={i.id}> {i.name} </Tag>
      //       } );
      //       tagView = <div>{tagItem}</div>
      //     }
      //     return tagView
      //   }
      // },
      {
        title: <span>登陆次数</span>,
        dataIndex: 'loginCount',
        render: loginCount => <span>{loginCount}</span>,
      },
      {
        title: <span>操作</span>,
        width: 200,
        fixed: 'right',
        render: ( text, record, index ) => (
          <div className={styles.btns}>
            <span
              style={{ cursor: 'pointer', color: '#1890ff' }}
              className={styles.btnsBtn}
              onClick={() => this.onEditList( record, index )}
              type="link"
            >
              编辑
            </span>
            <Divider type="vertical" />
            {/* <Popconfirm
              title="密码将重置为123456，确定重置?"
              onConfirm={() => this.resetPassword( record )}
              okText="确定"
              cancelText="取消"
            >
              <span
                style={{ cursor: 'pointer', color: '#ff4d4f' }}
                type="link"
              >
                重置密码
              </span>
            </Popconfirm> */}
            <Divider type="vertical" />
            <Popconfirm
              title={`是否对当前用户的账户进行${record.enable ? "冻结" : "解冻"}?`}
              onConfirm={() => { this.onEditUserStatue( record ) }}
              okText="确定"
              cancelText="取消"
            >
              <span
                style={{ cursor: 'pointer', color: '#1F3883' }}
                type="link"
              >
                {record.enable ? "冻结" : "解冻"}
              </span>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const pagination = {
      total,
      current: pageNum,
      defaultPageSize: pageSize,
      showQuickJumper: true,
      showTotal: ( t, r ) => `${r[0]}-${r[1]} 共 ${t} 条记录`,
    };

    const extraContent = (
      <div>
        {
          moadaType === 'userModal' && (
            <div className={styles.extraContent}>
              <Button type="primary" style={{ marginRight: 20 }} onClick={() => { this.setState( { visibleFetchStickTag: true, stickList: [], stickTagList: [] } ) }}>贴标签</Button>
              <Button type="primary" style={{ marginRight: 20 }} onClick={this.exportModal}>用户导入</Button>
            </div>
          )
        }
      </div>
      
    );

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            extra={extraContent}
            title={moadaType === 'userModal' ? '用户列表' : '标签列表'}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              {
          moadaType === 'userModal' ?
            <>
            
              <span className={styles.btn}>标签:</span>
              <Select
                autoClearSearchValue
                value={tagId}
                style={{ width: 150, marginLeft: 10 }}
                onSelect={this.onTagChange}
              >
                <Option value=''>全部</Option>
                {tagList.map( tag => <Option key={tag.id} value={tag.id}>{tag.name}</Option> )}
              </Select>

              <span className={styles.btn}>手机号:</span>
              <Input
                value={mobile}
                placeholder="请输入手机号"
                onChange={( e ) => this.onInputChange( 'mobile', e.target.value )}
                style={{ width: 150, marginLeft: '10px' }}
              />
              <span className={styles.btn}>资金账号:</span>
              <Input
                value={account}
                placeholder="请输入资金账号"
                onChange={( e ) => this.onInputChange( 'account', e.target.value )}
                style={{ width: 150, marginLeft: '10px' }}
              />
              <span className={styles.btn}>客户号:</span>
              <Input
                value={userNo}
                placeholder="请输入客户号"
                onChange={( e ) => this.onInputChange( 'userNo', e.target.value )}
                style={{ width: 150, marginLeft: '10px' }}
              />
              <span className={styles.btn}>营业部:</span>
              <Input
                value={structure}
                placeholder="营业部"
                onChange={( e ) => this.onInputChange( 'structure', e.target.value )}
                style={{ width: 150, marginLeft: '10px' }}
              />
              {/* <span className={styles.btn}>角色:</span>
              <Select
                autoClearSearchValue
                value={roleGroupId}
                style={{ width: 180, marginLeft: '10px' }}
                onSelect={this.onRoleChange}
              >
                <Option value=''>全部</Option>
                {roleData && roleData.list && roleData.list.length && roleData.list.map( r => <Option key={r.id}>{r.name}</Option> )}
              </Select> */}
            </>
            :
            <>
              <span className={styles.btn}>标签名称:</span>
              <Input
                value={tagName}
                placeholder="输入标签名称"
                onChange={( e ) => this.tagNameChange( e.target.value )}
                style={{ width: 150, marginLeft: '10px' }}
              />
            </>
        }
              <Button type="primary" style={{ margin: '0 20px' }} onClick={this.goSearch}>搜索</Button>
              <Button onClick={this.empty}>清空</Button>
            </div>
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="用户列表" key="1">
                <Button
                  type="dashed"
                  style={{ width: '100%', marginBottom: 8 }}
                  icon="plus"
                  onClick={this.onNewList}
                >
                  {formatMessage( { id: 'form.add' } )}
                </Button>
                <Table
                  rowKey="id"
                  scroll={{ x: 1700 }}
                  columns={columns}
                  loading={loading}
                  dataSource={list}
                  pagination={pagination}
                  onChange={this.onChangePage}
                />
              </TabPane>
              <TabPane tab="标签列表" key="2">
                <TagsModal fetchTagList={this.fetchTagList} />
              </TabPane>
            </Tabs>

          </Card>
        </div>
        {
          visible ? (
            <ListModal
              portfolio={portfolio}
              visible={visible}
              tagList={tagList}
              onCloseModal={this.onCloseModal}
              onLoadFunc={this.fetchList}
              getRoleList={this.getRoleList}
            />
          ) : null
        }

        <Modal
          title="导入"
          className={styles.standardListForm}
          bodyStyle={{ padding: '28px', display: 'flex', justifyContent: 'flex-start' }}
          visible={visibleExport}
          onOk={this.onSubmitUserList}
          onCancel={this.handleCancel}
        >
          <Upload
            beforeUpload={this.beforeUpload}
            fileList={userListFile ? [userListFile] : []}
            accept='.xlsx,.xls'
            onRemove={() => { this.setState( { userListFile: null } ) }}
          >
            <Button style={{ marginRight: '10px' }}>+上传</Button>
          </Upload>
          <Button type='primary' onClick={this.downloadTemplate}>模板下载</Button>
        </Modal>

        <Modal
          title="贴标签"
          className={styles.standardListForm}
          bodyStyle={{ padding: '28px' }}
          visible={visibleFetchStickTag}
          onOk={this.OkStickTagModal}
          onCancel={this.closeStickTagModal}
          maskClosable={false}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <span className={styles.leftBtn}>用户列表：</span>
            <div style={{ width: '50%', flex: 1, marginLeft: 10 }}>
              <Select mode="tags" style={{ width: '100%' }} value={stickList} placeholder='多个手机号请用回车隔开' onChange={( e ) => { this.setState( { stickList: e } ) }} tokenSeparators={[',', '，']} />
            </div>
          </div>
          <div style={{ width: '80%', marginLeft: '17%', color: '#fc2630', fontSize: 12 }}>
            多个手机号请用回车隔开，也可以复制，例:张三，李四到输入框实现多个用户名称导入
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: '20px' }}>
            <span className={styles.leftBtn}>用户标签：</span>
            <div style={{ width: '50%', flex: 1, marginLeft: 10 }}>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择可参与活动的用户标签"
                onChange={( e ) => {
                  this.setState( { stickTagList: e } )
                }
                }
                value={stickTagList}
              >
                {
                  tagList && tagList.map( item => (
                    <Option value={`${item.name}`} label={item.id} title={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ) )
                }
              </Select>
            </div>
          </div>
        </Modal>

      </GridContent>
    );
  }
}

export default UserList;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, Select } from 'antd';
import { formatMessage } from 'umi/locale';
// import router from 'umi/router';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../education.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const SelectOption = Select.Option;

const stateObj = {
  "NORMAL": formatMessage( { id: 'strategyMall.normal' } ),
  "DISABLE": formatMessage( { id: 'strategyMall.disable' } ),
  "AUDIT": formatMessage( { id: 'strategyMall.audit' } ),
  "APPROVED": formatMessage( { id: 'strategyMall.approved' } ),
}

@connect( ( { course } ) => ( {
  loading: course.loading,
  postListResult: course.postListResult,
  replyPostListResult: course.replyPostListResult,
  userListResult: course.userListResult,
  allUserListResult: course.allUserListResult
} ) )
@Form.create()

class ReplyPostList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    topicState: '',
    topicId: '',
    plantCode: '',
    // userList: [],
    childPost:undefined
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const topicId = this.props.location.query.id;
    const { plantCode } = this.props.location.query;
    const { pageNum, pageSize, topicState } = this.state;
    this.fetchList( { pageSize, pageNum, topicId, topicState } );
    // this.getUserList();
    this.setState( { topicId, plantCode,  } )
  };

  componentWillReceiveProps( nextProps ){
    if ( this.props.location.query.id !== nextProps.location.query.id ) {
      window.location.reload();
    }
  }

  fetchList = ( { pageSize, pageNum, topicId, topicState } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getReplyList',
      payload: {
        params: {
          pageSize,
          pageNum,
          topicId,
          topicState
        },
        callFunc() {}
      }
    } )
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize, topicId, topicState } = pagination;
    this.fetchList( { pageNum: current, pageSize, topicId, topicState } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  // //  获取用户
  // getUserList = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'course/getAllUser',
  //     payload: {
  //       params: {
  //         pageSize: 10000,
  //         pageNum: 1,
  //       },
  //       callFunc: () => {
  //         const { allUserListResult: { list } } = this.props;
  //         this.setState({
  //           userList: list
  //         });
  //       }
  //     }
  //   })
  // }

  //  显示添加 Modal
  showAddModal = ( item ) => {
    this.setState( {
      visible: true,
      current: undefined,
      childPost:item,
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( obj ) => {
    
    this.onUserSearch( obj.username )
    this.setState( {
      visible: true,
      current: obj,
      childPost:undefined
    } );
  };

  //  取消
  handleCancel = () => {
    const { current } = this.state;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      current: undefined,
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum, topicId, topicState, plantCode, childPost
    } = this.state;
    const id = current ? current.id : '';
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const AddParams = childPost ? { ...fieldsValue, rootId: topicId, plantCode, parentId: childPost.id } : { ...fieldsValue, parentId: topicId, rootId: topicId, plantCode }
      const params = id ? Object.assign( current, fieldsValue, { plantCode } ) : AddParams;
      const isUpdate = !!id;
      // if(1 !==2 ) return;
      dispatch( {
        type: 'course/submitReplyPost',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.fetchList( { pageNum, pageSize, topicId, topicState } );
            $this.setState( {
              visible: false,
              current: undefined,
            } );
          },
        },
      } );
    } );
  };

  // 删除
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const $this = this;
    const { pageSize, pageNum, topicId, topicState } = this.state;
    const { dispatch } = this.props;
    const { id } = obj;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.title}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'course/delPost',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList( { pageSize, pageNum, topicId, topicState } );
            },
          },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }

  // 改变状态
  onStateChange = ( topicState ) => {
    const { pageNum, pageSize, topicId } = this.state;
    this.fetchList( { pageNum, pageSize, topicId, topicState } );
    this.setState( { topicState } )
  }

  //  选择用户
  onUserSearch = ( value ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getUserBySearch',
      payload: {
        pageSize: 10000,
        pageNum: 1,
        username: value
      }
    } );
  }

  detail = () => {
    
  }

  render() {
    const { loading, replyPostListResult: { total, list }, form: { getFieldDecorator }, userListResult } = this.props;
    const { pageSize, pageNum, visible, current = {}, topicState } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const extraContent = (
      <div className={styles.extraContent}>
        <span>状态 ：</span>
        {
          <Select
            style={{ width: 100, borderRadius: '3px', marginRight: '20px' }}
            defaultValue={topicState}
            onSelect={this.onStateChange}
          >
            <SelectOption key='' value=''>所有</SelectOption>
            <SelectOption key='NORMAL' value='NORMAL'>正常</SelectOption>
            <SelectOption key='DISABLE' value='DISABLE'>禁用</SelectOption>
            <SelectOption key='AUDIT' value='AUDIT'>审核</SelectOption>
            <SelectOption key='APPROVED' value='APPROVED'>已审核</SelectOption>
          </Select>
        }
      </div>
    );

    const columns = [
      {
        title: <span>内容</span>,
        dataIndex: 'content',
        render: title => <span>{title}</span>,
      },
      {
        title: <span>发帖人</span>,
        dataIndex: 'nick',
        width: 100,
      },
      {
        title: <span>回复数量</span>,
        dataIndex: 'replayCount',
        width: 90,
        render: replayCount => <span>{replayCount}</span>,
      },
      {
        title: <span>总赞数量</span>,
        dataIndex: 'praiseCount',
        width: 90,
        render: praiseCount => <span>{praiseCount}</span>,
      },
      {
        title: <span>帖子积分</span>,
        dataIndex: 'count',
        width: 90,
        render: count => <span>{count}</span>,
      },
      {
        title: <span>帖子状态</span>,
        dataIndex: 'state',
        width:100,
        render: state => <span>{stateObj[state]}</span>,
      },
      {
        title: <span>发帖日期</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>

            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( item )}
            >
                编辑
            </span>

            {
              item.parentId === item.rootId && 
                <span
                  style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#52c41a' }}
                  type="link"
                  onClick={() => this.showAddModal( item )}
                >
                  回帖
                </span>
            }

            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >
                删除
            </span>
          </div>
        ),
      },
    ];
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card 
            className={styles.listCard}
            bordered={false}
            title="帖子列表"
            extra={extraContent}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showAddModal()}
            >
              新增
            </Button>
            <Table
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        <Modal
          maskClosable={false}
          title={Object.keys( current ).length > 0 ? '编辑帖子' : '添加回帖'}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>
              <FormItem label='标题' {...this.formLayout}>
                {getFieldDecorator( 'title', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}标题` }],
                  initialValue: current.title,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}标题`} /> )}
              </FormItem>

              <FormItem label='内容' {...this.formLayout}>
                {getFieldDecorator( 'content', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}内容` }],
                  initialValue: current.content,
                } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}内容`} /> )}
              </FormItem>

              <FormItem label='发帖账号' {...this.formLayout}>
                {getFieldDecorator( 'userId', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}发帖账号` }],
                  initialValue: current.userId ? current.userId: undefined,
                } )(
                  <Select
                    showSearch
                    placeholder={`${formatMessage( { id: 'form.select' } )}发帖账号`}
                    optionFilterProp="children"
                    onSearch={this.onUserSearch}
                    filterOption={false}
                    notFoundContent={null}
                  >
                    { 
                      userListResult.list.map( item => 
                        <SelectOption key={item.id} value={item.id}>{item.username}</SelectOption>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Form>
          }
        </Modal>
      </GridContent>
    );
  };
}

export default ReplyPostList;
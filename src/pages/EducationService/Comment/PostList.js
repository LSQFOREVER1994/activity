import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Table, Card, Form, Modal, Input, Select } from 'antd';
import { formatMessage } from 'umi/locale';
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
  plateListResult: course.plateListResult,
  userListResult: course.userListResult,
  allUserListResult: course.allUserListResult
} ) )
@Form.create()

class PostList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    plateId: '',
    topicState: '',
    // userList: []
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageNum, pageSize, topicState } = this.state;
    dispatch( {
      type: 'course/getPlateList',
      payload: {
        params: {
          pageSize: 10000,
          pageNum,
          state: 'NORMAL'
        },
        callFunc: () => {
          const { plateListResult: { list } } = this.props;
          if ( list.length > 0 ) {
            const plateId = list[0].code;
            this.fetchList( { pageSize, pageNum, plateId, topicState } );
            // this.getUserList();
            this.setState( { plateId } );
          }
        }
      }
    } )
  };

  fetchList = ( { pageSize, pageNum, plateId, topicState } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getPostList',
      payload: {
        params: {
          pageSize,
          pageNum,
          plantCode: plateId,
          topicState
        },
        callFunc() {}
      }
    } )
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize, plateId, topicState } = pagination;
    this.fetchList( { pageNum: current, pageSize, plateId, topicState } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  //  获取用户
  getUserList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'course/getAllUser',
      payload: {
        params: {
          pageSize: 10000,
          pageNum: 1,
        },
        callFunc: () => {
          const { allUserListResult: { list } } = this.props;
          console.log( 'list: ', list );
          // this.setState({
          //   userList: list
          // });
        }
      }
    } )
  }

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( id ) => {
    const { postListResult: { list } } = this.props;
    const obj = list.find( o => o.id === id );

    this.setState( {
      visible: true,
      current: obj,
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
      current, pageSize, pageNum, plateId, topicState
    } = this.state;
    const id = current ? current.id : '';
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( current, fieldsValue, { plantCode: plateId } ) : { ...fieldsValue, plantCode: plateId };
      const isUpdate = !!id;
      dispatch( {
        type: 'course/submitPost',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.fetchList( { pageNum, pageSize, plateId, topicState } );
            $this.setState( {
              visible: false,
              current: undefined,
            } );
          },
        },
      } );
    } );
  };

  // 删除课程
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { pageSize, pageNum, plateId, topicState } = this.state;
    const { postListResult: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
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
              $this.fetchList( { pageSize, pageNum, plateId, topicState } );
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
    const { pageNum, pageSize, plateId } = this.state;
    this.fetchList( { pageNum, pageSize, plateId, topicState } );
    this.setState( { topicState } )
  }

  //  选择课程
  onPlateChange = ( plateId ) => {
    const { pageNum, pageSize, topicState } = this.state;
    this.fetchList( { pageNum, pageSize, plateId, topicState } );
    this.setState( { plateId } );
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

  detail = ( id, plantCode ) => {
    router.push( `/educationService/comment/replyPost?id=${id}&plantCode=${plantCode}` );
  }

  render() {
    const { loading, postListResult: { total, list }, plateListResult, form: { getFieldDecorator }, userListResult } = this.props;
    const { pageSize, pageNum, visible, current = {}, plateId, topicState } = this.state;

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
        <span>板块 ：</span>
        {
          <Select
            style={{ width: 180, borderRadius: '3px', marginRight: '20px' }}
            value={plateId}
            onSelect={this.onPlateChange}
          >
            {plateListResult && plateListResult.list.map( plate =>
              <SelectOption key={plate.code} value={plate.code}>{plate.title}</SelectOption>
            )}
          </Select>
        }

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
        title: <span>标题</span>,
        dataIndex: 'title',
        render: title => <span>{title}</span>,
      },
      {
        title: <span>发帖人</span>,
        dataIndex: 'nick',
      },
      {
        title: <span>回复数量</span>,
        dataIndex: 'replayCount',
        render: replayCount => <span>{replayCount}</span>,
      },
      {
        title: <span>总赞数量</span>,
        dataIndex: 'praiseCount',
        render: praiseCount => <span>{praiseCount}</span>,
      },
      {
        title: <span>帖子积分</span>,
        dataIndex: 'count',
        render: count => <span>{count}</span>,
      },
      {
        title: <span>帖子状态</span>,
        dataIndex: 'state',
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
              onClick={() => this.showEditModal( id )}
            >
                编辑
            </span>

            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#52c41a' }}
              type="link"
              onClick={() => this.detail( id, item.plantCode )}
            >
                查看
            </span>
            
            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, id )}
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
            title="根帖列表"
            extra={extraContent}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showAddModal()}
            >
              {formatMessage( { id: 'form.add' } )}
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
          title={Object.keys( current ).length > 0 ? '编辑帖子' : '添加帖子'}
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
                  initialValue: current.userId ? current.userId.toString() : undefined,
                } )(
                  <Select
                    showSearch
                    placeholder={`${formatMessage( { id: 'form.select' } )}发帖账号`}
                    onSearch={this.onUserSearch}
                    filterOption={false}
                    notFoundContent={null}
                  >
                    { 
                      userListResult && userListResult.list.map( item => 
                        <SelectOption key={item.id.toString()} value={item.id.toString()}>{item && item.username}</SelectOption>
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

export default PostList;
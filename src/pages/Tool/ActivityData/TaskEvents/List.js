import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Input, Button, Modal, Form, Table, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Task.less';

const FormItem = Form.Item;
const { confirm } = Modal;

@connect( ( { taskEvents } ) => ( {
  loading: taskEvents.loading,
  taskEventList: taskEvents.taskEventList,
} ) )
@Form.create()
class TaskEventsList extends PureComponent {
  state = {
    visible: false,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentWillMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = () => {
    const{ pageSize, pageNum } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'taskEvents/getTaskEventList',
      payload: {
        pageSize,
        pageNum,
        orderBy:'create_time desc'
      }
    } );
  }
  

  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const $this = this;
    const { dispatch } = this.props;
    const { name, id, enableDelete }=obj
    if( !enableDelete ){
      message.error( '该事件不可删除' )
      return
    }
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'taskEvents/delTask',
          payload: {
            id
          },
          callFunc: () => {
            $this.fetchList();;
          },
        } );
      },
    } );
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, obj ) => {
    e.stopPropagation();
    this.setState( {
      visible: true,
      current: obj,
    } );
  };

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  };
  

 
  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
    } );
  };

  // 提交：商品种类
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current
    } = this.state;
    const id = current ? current.id : '';

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( fieldsValue, { id } ) : fieldsValue;

      dispatch( {
        type:'taskEvents/submitTask',
        payload: {
          params,
          callFunc:()=>{
            $this.fetchList();
            $this.setState( {
              visible: false,
              current: undefined,
            } );
          }
        }
      } )
    } );
  };


  render() {
    const { loading, form: { getFieldDecorator }, taskEventList:{ list, total } } = this.props;
    const { visible, current = {}, pageSize, pageNum } = this.state;
   
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk:  this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>事件ID</span>,
        dataIndex: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>事件名称</span>,
        dataIndex: 'name',
        render: name => <div className={styles.showSingleLine}>{name}</div>,
      },
      // {
      //   title: <span>说明</span>,
      //   dataIndex: 'explain',
      //   render: explain => <span>{explain || '--'}</span>,
      // },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'action',
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>
          
          </div>
        ),
        width:90,
      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title='任务事件列表'
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
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
        {
          visible?
            <Modal
              maskClosable={false}
              title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                
                <FormItem label='事件名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}事件名称` }],
                    initialValue: current.name,
                  } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}事件名称`} /> )}
                </FormItem>
                
              </Form>
            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default TaskEventsList;

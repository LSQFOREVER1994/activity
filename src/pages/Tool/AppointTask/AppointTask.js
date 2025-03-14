import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Modal, DatePicker, Input, Icon, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';
import TaskForm from './TaskForm.com';

const { confirm } = Modal;
const FormItem = Form.Item;
const { Option } = Select;
const {  RangePicker } = DatePicker;

const time = () => new Date().getTime();

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  appointTaskData: tool.appointTaskData,
  taskPrizeList: tool.taskPrizeList,
  taskActivityList: tool.taskActivityList,
} ) )
@Form.create()
class AppointTask extends PureComponent {
  taskForm= {}

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };

 constructor( props ){
   const activityId = props.location.query && props.location.query.activityId
   super( props );
   this.state = {
     visible: !!activityId,
     taskDeleteIds: [0],
     info: activityId ? { activityId } :  {},
     assignmentInfoList: [],
     buttomLoading: false,
     activityId
   };
 }

  componentDidMount() {
    this.fetchList();
    this.getPrizeList();
    this.getTaskActivity();
  }


  //  获取列表
  fetchList = ( params = {} ) => {
    const { dispatch, appointTaskData: { pageNum }, form } = this.props;
    form.validateFields( ['activityName', 'rangeTime'], ( error, values ) => {
      let startTime = '';
      let endTime = '';
      const { activityName, rangeTime } = values
      if ( rangeTime ){
        startTime = moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' )
        endTime = moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' )
      }
      dispatch( {
        type: 'tool/getAppointTaskList',
        payload: {
          pageNum: pageNum || 1,
          pageSize: 10,
          activityName,
          startTime,
          endTime,
          orderBy: "create_time desc",
          ...params,
          
        },
      } );
    } )
   
  }

  searchReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchList();
  }

  getPrizeList = ( ) => {
    const { dispatch,  } = this.props;
    dispatch( {
      type: 'tool/getTaskPrizeList',
      payload: {
        pageSize: 100,
      },
    } );
  }

  getTaskActivity = ( ) => {
    const { dispatch,  } = this.props;
    dispatch( {
      type: 'tool/getTaskActivity',
    } );
  }

  addDetail = () => {
    const { assignmentInfoList } = this.state;
    const newList = assignmentInfoList.concat( { key: time(), isOpen: true } );
    this.setState( { assignmentInfoList: newList } )
  }

  deleteItem = ( data ) => {
    const { dispatch } = this.props;
    const { id, name, activityId } = data;
    const that = this;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'tool/deleteAppointTask',
          payload: { id },
          callFunc: () => {
            that.fetchList();
            if ( activityId ) that.getTaskActivity();
          },
        } );
      },

    } );

  }

  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize } );
  }


  valueChange = ( value ) => {
    const { pageNum, pageSize, orderId } = this.state;
    this.setState( { orderId: value } )
    if ( value === '' && value !== orderId ) {
      this.fetchList( { pageNum, pageSize, orderId: value } );
    }
  }

  showEditModal = ( data ) => {
    this.taskForm = {};
    const assignmentInfoList = data.assignmentInfoList && data.assignmentInfoList.length > 0 ? 
      data.assignmentInfoList.map( ( item, index ) => ( { ...item, key:time()+index } ) ) : []
    this.setState( { visible: true, info: data, assignmentInfoList, taskDeleteIds: [0], activityName: data.activityName  } )
  }

  handleOk = () => {
    const { taskDeleteIds, info, activityName } = this.state;
    const { dispatch, form } = this.props;
    const { taskForm } = this;
    let haveError = false;
    Object.keys( taskForm ).forEach( ( key ) => {
      if ( taskForm[key].getFormError() ) haveError = true
    } )
    let value = {}
    form.validateFields( ['activityId', 'name'], ( error, values ) => {
      value = values
      if( error ) haveError = true
    } )
    if ( haveError ) {
      return 
    }
    this.setState( { buttomLoading:true } )
    const list = [];
    Object.keys( taskForm ).forEach( ( key ) => {
      const formData = taskForm[key].getValues();
      list.push( { ...formData, } );
    } )
    const data = { ...info, assignmentInfoList: list, taskDeleteIds, name: value.name, activityId: value.activityId && value.activityId.key, activityName }
    dispatch( {
      type: 'tool/submitAppointTask',
      payload: {
        params: data,
        callFunc: (  ) => {
          this.setState( { visible :false } )
          this.fetchList()
          this.setState( { buttomLoading: false } )
          this.getTaskActivity();
        }
      },
    } )
  }

  selectChange = ( item ) =>{
    const { form } = this.props;
    const values = form.getFieldsValue	( ['name'] )
    if( !values.name ){
      form.setFieldsValue( { name:item.label } )
      this.setState( { activityName:item.label } )
    }
  }

  deleteDetail = ( detail, index ) => {
    let { taskDeleteIds } = this.state;
    if ( detail.id ) taskDeleteIds = taskDeleteIds.concat( [detail.id] )
    const { taskForm } = this;
    const lists = [];
    Object.keys( taskForm ).forEach( ( key ) => {
      const formData = taskForm[key].getValues();
      taskForm[key].formReset();
      lists.push( formData );
      
    } )
    const newList = lists.filter( ( item ) => item && item.key !== index )
    delete this.taskForm[`taskForm-${index}`];
    this.setState( { assignmentInfoList: newList, taskDeleteIds } )
  }

  extraContent = () => {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div className={styles.extraContent}>
        <Form layout="inline" name='selectForm'>
          <div className={styles.form_title}>活动名称：</div>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator( 'activityName', {
            } )(
              <Input placeholder='请输入关联活动名称' />
            )}
          </FormItem>
          <span className={styles.form_title}>任务创建时间：</span>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator( 'rangeTime', {
            } )(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
            )}
          </FormItem>
          <Button
            type="primary"
            style={{ marginLeft: 30 }}
            onClick={()=>{this.fetchList()}}
          >搜索
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: 30 }}
            onClick={this.searchReset}
          >清空
          </Button>
        </Form>
      </div>
    );
  }

  render() {
    const {
      loading, appointTaskData: { list, total, pageNum }, form: { getFieldDecorator }, taskPrizeList, taskActivityList
    } = this.props;
    const { info, visible, max = 8, assignmentInfoList, buttomLoading, activityId } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      current: pageNum,
    };

    const columns = [
      {
        title: '任务组名称',
        dataIndex: 'name',
      },
      {
        title: '关联活动名称',
        dataIndex: 'activityName',
      },
      {
        title: '指定任务数',
        dataIndex: 'assignmentInfoList',
        render: ( value ) => value.length
      },
      {
        title: '任务创建时间',
        dataIndex: 'createTime',
        render: ( value ) => value || 0
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        render: ( data ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( data )}
            >编辑
            </span>

            <span
              style={{ cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={() => this.deleteItem( data )}
            >删除
            </span>

          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          className={styles.listCard}
          bordered={false}
          extra={this.extraContent()}
          title='指定任务列表'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={() => { this.showEditModal( {} ) }}
          >
            {formatMessage( { id: 'form.add' } )}
          </Button>
          <Table
            size="large"
            // scroll={{ y: 500 }}
            rowKey='id'
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
          <Modal
            title={`${info.id ? '编辑' : '添加'}指定任务`}
            visible={visible}
            width={860}
            bodyStyle={{ padding: '12px 36px', maxHeight:'80vh', overflowY:'auto', minHeight:'50vh' }}
            onCancel={() => { this.setState( { visible: false } ) }}
            centered
            onOk={this.handleOk}
            okText="保存"
            confirmLoading={buttomLoading}
          > 
            {visible && 
            <Form>
              <FormItem label='关联活动名称' {...this.formLayout}>
                {getFieldDecorator( 'activityId', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}任务名称` }],
                    initialValue: info.activityId && { key:info.activityId },
                  } )(
                    <Select 
                      style={{ width: 200 }} 
                      placeholder="请选择任务所关联的活动"
                      labelInValue
                      onChange={this.selectChange}
                    >
                      {info && info.activityId && !activityId &&
                        <Option key={info.activityId}>{info.activityName}</Option>
                      }
                      {taskActivityList && taskActivityList.length > 0 &&
                        taskActivityList.map( item => 
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )
                      }
                    </Select> )}
              </FormItem>
              <FormItem label='任务组名称' {...this.formLayout}>
                {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务组名称` }],
                    initialValue: info.name,
                  } )( <Input
                    placeholder={`${formatMessage( { id: 'form.input' } )}任务组名称以做区别`}
                    maxLength={8}
                    onChange={this.onChangeName}
                    style={{ width: 200 }}
                  /> )}
              </FormItem>
            </Form>
          }
            {visible && assignmentInfoList.map( ( task, index ) => {
              return <TaskForm
                key={task.key}
                onRef={( ref ) => { this.taskForm[`taskForm-${task.key}`] = ref }}
                deleteDetail={() => { this.deleteDetail( task, task.key ) }}
                detail={task}
                cardIndex={index + 1}
                prizeList={taskPrizeList}
              />
            }
            )}
            <div
              className={styles.edit_active_add}
              onClick={() => { if ( assignmentInfoList.length < max ) this.addDetail() }}
            >
              <Icon
                type="plus-circle"
                style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
              />添加指定任务（{assignmentInfoList.length}/{max}）
            </div>
          </Modal>
        </Card>
      </GridContent>
    );
  }
}

export default AppointTask;
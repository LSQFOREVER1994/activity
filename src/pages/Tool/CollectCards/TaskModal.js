import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {  Input, Button, Modal, Form, Table, InputNumber, Radio, message, activitytip, Icon } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  collectCardsSpecsObj:activity.collectCardsSpecsObj,
} ) )
@Form.create()
class TaskModal extends PureComponent {
  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  timer = null;

  constructor( props ){
    super( props );
    this.state={
      activeIndex: undefined,
      isSaleActiveType:this.props.collectCardsSpecsObj.isSale ? this.props.collectCardsSpecsObj.isSale : true
    }
  }

  componentDidMount() {
    const { dispatch, collectCardsSpecsObj, collectCardsSpecsObj:{ taskList } } = this.props;
    if( taskList.length === 0 ){
      dispatch( {
        type:'activity/SetState',
        payload:{
          collectCardsSpecsObj:{
            ...collectCardsSpecsObj,
            nextState:true
          }
        }
      } )
    }
    this.props.onRef( this );
  }


  // // 获取任务列表
  // fetchList =()=>{
  //   const { dispatch, collectCardsSpecsObj } = this.props;
  //   const { id }= collectCardsSpecsObj;
  //   dispatch( {
  //     type: 'activity/getAllAppointList',
  //     payload: {
  //       id
  //     },
  //     callFunc:( result )=>{
  //       dispatch( {
  //         type:'activity/SetState',
  //         payload:{
  //           collectCardsSpecsObj:{
  //             ...collectCardsSpecsObj,
  //             taskList:result
  //           }
  //         }
  //       } )
  //     }
  //   } )
  // }
  

  // 删除种类
  deleteItem = ( e, index ) => {

    e.stopPropagation();
   
    const { collectCardsSpecsObj, dispatch } = this.props;
    const list = collectCardsSpecsObj ? collectCardsSpecsObj.taskList : []
    const obj = list[index];

    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        list.splice( index, 1 );
        if( obj.id ){
          collectCardsSpecsObj.taskDeleteIds.push( obj.id )
        }
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ ...collectCardsSpecsObj, taskList:list }
          }
        } )
      },
      onCancel() {
      },
    } );
  }



  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      appointCurrent: undefined,
      activeIndex: undefined,
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, index ) => {
    e.stopPropagation();
    const { collectCardsSpecsObj } = this.props;
    const list =  collectCardsSpecsObj.taskList || []
    const obj = list[index]
    this.setState( {
      visible: true,
      appointCurrent: obj,
      activeIndex:index
    } );
  };

 
  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      appointCurrent: undefined,
    } );
  };
  
  
  // 状态切换
  activeType =( e ) =>{
    this.setState( {
      isSaleActiveType:e.target.value
    }, ()=>{
      const { dispatch, collectCardsSpecsObj } = this.props;
      const { isSaleActiveType } = this.state;
      dispatch( {
        type: 'activity/SetState',
        payload:{
          collectCardsSpecsObj:{ ...collectCardsSpecsObj, isSale: isSaleActiveType }
        }
      } )
    } )
  }


  // 提交：商品种类
  appointHandleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form, collectCardsSpecsObj } = this.props;
    const { activeIndex, isSaleActiveType } = this.state;

    const list = collectCardsSpecsObj.taskList || []
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;

      if( activeIndex!== undefined ){
        list[activeIndex] = { ...list[activeIndex], ...fieldsValue }
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ ...collectCardsSpecsObj, taskList:list, isSale:isSaleActiveType }
          }
        } )
        message.success( '添加成功' )
      }else{
        list.push( { ...fieldsValue } )
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ ...collectCardsSpecsObj, taskList:list, isSale:isSaleActiveType }
          }
        } )
        message.success( '添加成功' )
      }
      $this.setState( {
        visible: false,
        appointCurrent: undefined,
      } );
    } );
  };


  render() {
    const { form: { getFieldDecorator, getFieldValue }, collectCardsSpecsObj:{ taskList } } = this.props;
    const { visible, appointCurrent = {}, isSaleActiveType } = this.state;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk:  this.appointHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>任务名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>描述</span>,
        dataIndex: 'description',
        render : description => <span>{description}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, index )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e )  => this.deleteItem( e, index )}
            >删除
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <div style={{ width:'90%', margin:'40px auto 20px auto' }}>
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={this.showModal}
          >
            {formatMessage( { id: 'form.add' } )}
          </Button>
          <Table
            size="small"
            rowKey="id"
            columns={columns}
            pagination={false}
            dataSource={taskList}
          />
          <div style={{ marginTop:20 }}>
            <span><span style={{ color:'red' }}>*&nbsp;</span>活动状态：</span>
            <RadioGroup onChange={this.activeType} defaultValue={isSaleActiveType.toString()}>
              <Radio value='true'>启用</Radio>
              <Radio value='false'>禁用</Radio>
            </RadioGroup>
          </div>

        </div>
        {
          visible?
            <Modal
              maskClosable={false}
              title={`${appointCurrent.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <div>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>

                  <FormItem label='任务选择' {...this.formLayout}>
                    {getFieldDecorator( 'taskType', {
                      initialValue: appointCurrent.taskType===undefined ? 'JUMP' : appointCurrent.taskType
                    } )( 
                      <RadioGroup disabled={!!appointCurrent.id}>
                        <Radio value="JUMP">跳转任务</Radio>
                        <Radio value="OPERATION">操作任务</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem label='任务名称' {...this.formLayout}>
                    {getFieldDecorator( 'name', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务名称` }],
                      initialValue: appointCurrent.name,
                    } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}任务名称`} /> )}
                  </FormItem>

                  <FormItem label='描述' {...this.formLayout}>
                    {getFieldDecorator( 'description', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}描述` }],
                      initialValue: appointCurrent.description,
                    } )( <TextArea rows={4} /> )}
                  </FormItem>

                  <FormItem label='跳转链接' {...this.formLayout}>
                    {getFieldDecorator( 'link', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                      initialValue: appointCurrent.link,
                    } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}跳转链接`} /> )}
                  </FormItem>

                  {
                    getFieldValue( 'taskType' ) === 'JUMP' ? null :
                    <FormItem 
                      label={(
                        <span>任务KEY
                          <activitytip title="任务接口">
                            <Icon type="question-circle-o" />
                          </activitytip>
                        </span>
                      )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'taskKey', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务KEY` }],
                        initialValue: appointCurrent.taskKey,
                      } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}任务KEY`} /> )}
                    </FormItem>
                  }

                  <FormItem label='增加次数' {...this.formLayout}>
                    {getFieldDecorator( 'presentCount', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}增加次数` }],
                      initialValue: appointCurrent.presentCount,
                    } )( <InputNumber step={1} min={1} /> )}
                  </FormItem>

                  <FormItem label='每日可参与次数' {...this.formLayout}>
                    {getFieldDecorator( 'shareCount', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}每日可参与次数` }],
                      initialValue: appointCurrent.shareCount,
                    } )( <InputNumber step={1} min={1} /> )}
                  </FormItem>
     
                </Form>
              </div>
            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default TaskModal;

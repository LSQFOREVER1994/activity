/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Select, Modal, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect( ( { bees } ) => ( {
  eligibilityList: bees.eligibilityList,
  eligibilityType: bees.eligibilityType
} ) )
@Form.create()
class EligibilityModal extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      taskEventType:'', // 资格类型
      taskEventId:'', // 资格ID
    }
  }

  componentWillMount() {
    this.getEligibilityType( '' )

    const { taskEventType, taskEventId } = this.props;
    if( taskEventType ){
      this.setState( {
        taskEventType,
        taskEventId
      } )
    }
  }

  // 获取资格类型
  getEligibilityType = ( name ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : ''
        },
        successFun: () => {
          // 获取资格列表
          const { taskEventType } = this.props;
         if( taskEventType ) this.getEligibilityList( taskEventType )
        }
      },
    } );
  }

  // 获取资格列表
  getEligibilityList = ( id ) => {
    const { dispatch } = this.props;
    if( !id ) return
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query:{
          id
        },
        successFun:( data )=>{
        }
      },
    } );
  }


  // 选择资格相关
  changeEligibility = ( e, type ) => {
    if( type==='taskEventType' ){
      this.getEligibilityList( e )
      this.setState( {
        taskEventType:e,
        taskEventId:'',
      } )
    }else{
      this.setState( {
        taskEventId: e
      } )
    }

  }


  // 弹框确定
  onSubModalConfirm = ()=>{
    const { eligibilityModalConfirm, eligibilityList }=this.props
    const { taskEventType, taskEventId }=this.state
    // 进行数据校验，数据回传
    if( !taskEventType ){
      message.error( '请选择资格类型' )
      return
    }
    if( !taskEventId ){
      message.error( '请选择资格' )
      return
    }
    let obj= {}
    if( eligibilityList&&eligibilityList.length>0&&taskEventId ){
      obj = eligibilityList.find( i=>i.taskEventId===taskEventId ) ||{}
    }
    eligibilityModalConfirm( { taskEventType, taskEventId, name:obj.name } )
    setTimeout( () => {
      this.setState( {
        taskEventType:'',
        taskEventId:'',
      } )
    }, 500 );
  }

  // 关闭弹框
  onSubModalCancel = ()=>{
    const { eligibilityModalCancel }=this.props
    this.setState( {
      taskEventType:'',
      taskEventId:'',
    }, ()=>{
      eligibilityModalCancel()
    } )
  }

  render() {
    const { modalVisible, eligibilityType,  eligibilityList, eleObj } = this.props;
    const { taskEventType, taskEventId }=this.state
    // let obj= {}
    // if( eligibilityList&&eligibilityList.length>0&&taskEventId ){
    //   obj = eligibilityList.find( i=>i.taskEventId===taskEventId ) ||{}
    // }
    const modalFooter = {
      okText: '保存',
      onOk: this.onSubModalConfirm,
      onCancel: this.onSubModalCancel,
    };


    return (
      <div>
        <Modal
          maskClosable={false}
          title="资格变更"
          width={840}
          bodyStyle={{ padding: '28px 0 0', minHeight: '30vh', maxHeight:'72vh' }}
          destroyOnClose
          visible={modalVisible}
          {...modalFooter}
        >
          <Form>
            <FormItem label={eleObj && eleObj.task && eleObj.task.taskType === 'INVITE' ? '被邀请人资格' : '关联资格'} {...this.formLayout}>
              <div>
                <Select
                  style={{ width: '40%' }}
                  showSearch
                  filterOption={false}
                  value={taskEventType}
                  placeholder="请选择资格类型"
                  onChange={( e ) => this.changeEligibility( e, 'taskEventType' )}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {eligibilityType.map( item => (
                    <Option key={item.id}>{item.name}</Option>
                  ) )}
                </Select>
                <Select
                  style={{ width: '40%', marginLeft: '20px' }}
                  showSearch
                  filterOption={false}
                  value={taskEventId}
                  placeholder="请选择资格"
                  onChange={( e ) => this.changeEligibility( e, 'taskEventId' )}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {eligibilityList.map( item => (
                    <Option key={item.taskEventId}>{item.name}</Option>
                  ) )}
                </Select>
              </div>
            </FormItem>
            {/* {taskEventId &&
              <FormItem label='资格描述' {...this.formLayout}>
                <div style={{ background: '#f5f5f5', padding: '0 10px', borderRadius: '5px' }}>
                  {obj.description||'--'}
                </div>
              </FormItem>
            }
            {taskEventId &&
              <FormItem label='规则关系' {...this.formLayout}>
                <div style={{ background: '#f5f5f5', padding: '0 10px', borderRadius: '5px' }}>
                  {obj.express||'--'}
                </div>
              </FormItem>
            } */}
          </Form>
        </Modal>
      </div>
    )
  }
}

export default EligibilityModal;

/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Radio, InputNumber, Select, Icon, message, Modal, Checkbox } from 'antd';
import { connect } from 'dva';
import { featureTypes } from '../../BeesEnumes'
import EligibilityModal from './EligibilityModal'

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const limitDecimals = ( value ) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : ''
  }
  return ''
};
@connect()
@Form.create()
class SubTaskModal extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      eligibilityModalVisible:false, // 资格设置弹框
      editData:props.data||{},
    }
  }

  componentWillReceiveProps( nextProps ) {
    if ( this.props.data !== nextProps.data ) {
      this.setState( {
        editData:nextProps.data
      } );
    }
  }


  // 更改编辑数据
  onChangeData = ( e, type )=>{
    const { editData }=this.state
    const newObj = Object.assign( editData, { [type]: e } );
    this.setState( {
      editData:newObj
    } )
  }

  // 弹框保存操作
  onSubModalConfirm = () => {
    if( !this.subHandleSubmit() )return
    // 数据获取
    const { editData }=this.state
    const { subModalConfirm }=this.props
    subModalConfirm( editData )
    setTimeout( () => {
      this.setState( {
        editData:{},
      } )
    }, 500 );
  }

  // 弹框关闭操作
  onSubModalCancel = () => {
    const { subModalCancel } = this.props
    subModalCancel( false )
  }

  // 数据校验
  subHandleSubmit = () => {
    const {  form } = this.props;
    let isError = true
    form.validateFields( ( err ) => {
      if ( err ) {
        isError = false;
        message.error( '请输入必填项' )
      }
    } );
    return  isError;
  };

    // 打开资格编辑弹框
    onChangeEligibilityModal= ()=>{
      this.setState( {
        eligibilityModalVisible:true
      } )
    }

    // 资格选择确定
    eligibilityModalConfirm = ( data )=>{
    const { taskEventType, taskEventId, name }=data
    this.onChangeData( taskEventType, 'taskEventType' )
    this.onChangeData( taskEventId, 'taskEventId' )
    this.onChangeData( name, 'taskEventName' )
    this.setState( {
      eligibilityModalVisible:false
    } )
    }

    // 资格选择弹框关闭
    eligibilityModalCancel = ()=>{
      this.setState( {
        eligibilityModalVisible:false
      } )
    }


  // 更改ClickEven内数据
  changeClickEvenData = ( e, type ) => {
    const { editData }=this.state
    const oldClickEvent = editData.clickEvent ? editData.clickEvent : {}
    const newObj = Object.assign( editData, { clickEvent:{ ...oldClickEvent, [type]: e } } );
    this.setState( {
      editData:{ ...newObj }
    } )
  }

  onChangeCheckbox = ( e ) => {
    let noSupportWx = false
    let openByApp = false
    if ( e.indexOf( "noSupportWx" ) > -1 ) {
      noSupportWx = true
    }
    if ( e.indexOf( "openByApp" ) > -1 ) {
      openByApp = true
    }
    const { editData }=this.state
    const oldClickEvent = editData.clickEvent ? editData.clickEvent : {}
    const newObj = Object.assign( editData, { clickEvent: { ...oldClickEvent, noSupportWx, openByApp  } } );
    this.setState( {
      editData:{ ...newObj }
    } )
  }

  // 邀请任务
  renderInviteFrom = () => {
    const { editData }=this.state
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <FormItem label='被邀请人资格' {...this.formLayout}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <div style={{ background:'#f5f5f5', padding:'0 10px', borderRadius:'5px', width:'85%' }}>
              { editData.taskEventId ? editData.taskEventName:'--'}
            </div>
            <Icon type="edit" style={{ fontSize:'18px', marginLeft:'10px', cursor:'pointer' }} onClick={this.onChangeEligibilityModal} />
          </div>
        </FormItem>
        <FormItem label='被邀请人增加次数' {...this.formLayout}>
          {getFieldDecorator( 'backRewardCount', {
            initialValue: editData.backRewardCount,
            } )(
              <InputNumber
                onChange={e=>this.onChangeData( e, 'backRewardCount' )}
                placeholder="请输入"
                min={0}
                formatter={limitDecimals}
                parser={limitDecimals}
                style={{ width: '85%' }}
              />
            )}
          <span style={{ paddingLeft: '10px' }}>次</span>
        </FormItem>
        <FormItem label="被邀请成功提示" {...this.formLayout}>
          <Input
            value={editData.backTip}
            placeholder="请输入被邀请成功提示"
            onChange={( e ) => this.onChangeData( e.target.value, 'backTip' )}
            maxLength={200}
          />
        </FormItem>
        <FormItem label="任务完成消息提示" {...this.formLayout}>
          <TextArea
            value={editData.tip}
            placeholder="请输入任务完成消息提示"
            onChange={( e ) => this.onChangeData( e.target.value, 'tip' )}
            maxLength={200}
          />
        </FormItem>
      </div>
    )
  }

  // 资格任务
  renderQualificaFrom = ()=>{
    const { editData }=this.state
    return (
      <div>
        <FormItem label='参与人资格' {...this.formLayout}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <div style={{ background:'#f5f5f5', padding:'0 10px', borderRadius:'5px', width:'85%' }}>
              { editData.taskEventId ? editData.taskEventName:'--'}
            </div>
            <Icon type="edit" style={{ fontSize:'18px', marginLeft:'10px', cursor:'pointer' }} onClick={this.onChangeEligibilityModal} />
          </div>
        </FormItem>
        <FormItem label="任务完成消息提示" {...this.formLayout}>
          <TextArea
            value={editData.tip}
            placeholder="请输入任务完成消息提示"
            onChange={( e ) => this.onChangeData( e.target.value, 'tip' )}
            maxLength={200}
          />
        </FormItem>
      </div>
    )
  }

  // 浏览任务
  renderBrowseFrom = ()=>{
    const { editData }=this.state
    const { form: { getFieldDecorator } } = this.props;
    const { clickEvent = {} }=editData
    // const options = [
    //   { label: '不支持微信打开', value: 'noSupportWx' },
    //   { label: '需原生APP打开', value: 'openByApp' },
    // ];
    const checkboxVal = []
    if ( clickEvent.noSupportWx ) checkboxVal.push( 'noSupportWx' )
    if ( clickEvent.openByApp ) checkboxVal.push( 'openByApp' )

    return (
      <div>
        <FormItem
          label="设置跳转"
          {...this.formLayout}
        >
          {getFieldDecorator( 'clickType', {
            rules: [{ required: true, message: '请选择任务类型' }],
            initialValue: clickEvent.clickType,
            } )(
              <Radio.Group
                onChange={( e ) => this.changeClickEvenData( e.target.value, 'clickType' )}
              >
                <Radio value="NONE">无</Radio>
                {/* <Radio value="FEATURE">功能</Radio> */}
                <Radio value="CUSTOM_LINK">自定义链接</Radio>
              </Radio.Group>
            )}
        </FormItem>
        {clickEvent.clickType === 'FEATURE' &&
          <FormItem label='选择功能' {...this.formLayout}>
            {getFieldDecorator( 'key', {
            rules: [{ required: true, message: '请选择任务类型' }],
            initialValue: clickEvent.key,
            } )(
              <Select
                style={{ width: '100%' }}
                onChange={( e ) => this.changeClickEvenData( e, 'key' )}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {featureTypes.map( info=>  <Option value={info.key}>{info.value}</Option> )}
              </Select>
            )}
          </FormItem>
        }

        {clickEvent.clickType === 'CUSTOM_LINK' &&
          <div>
            <FormItem
              style={{ display: 'flex' }}
              label='跳转链接'
              {...this.formLayout}
            >
              <Input
                value={clickEvent.link}
                placeholder="请输入跳转链接"
                onChange={( e ) => this.changeClickEvenData( e.target.value, 'link' )}
                maxLength={1000}
              />
            </FormItem>
            {/* <FormItem
              style={{ display: 'flex' }}
              label='端内链接'
              {...this.formLayout}
            >
              <Input
                value={clickEvent.link}
                placeholder="请输入端内链接"
                onChange={( e ) => this.changeClickEvenData( e.target.value, 'link' )}
                maxLength={500}
              />
            </FormItem> */}
            {/* <FormItem
              style={{ display: 'flex' }}
              label='端外链接'
              {...this.formLayout}
            >
              <Input
                value={clickEvent.outLink}
                placeholder="请输入端外链接"
                onChange={( e ) => this.changeClickEvenData( e.target.value, 'outLink' )}
                maxLength={500}
              />
            </FormItem> */}
            {/* <FormItem
              style={{ display: 'flex' }}
              label='链接限制'
              {...this.formLayout}
            >
              <Checkbox.Group
                options={options}
                value={checkboxVal}
                onChange={this.onChangeCheckbox}
              />
            </FormItem> */}
            <FormItem label="任务完成消息提示" {...this.formLayout}>
              <TextArea
                value={editData.tip}
                placeholder="请输入任务完成消息提示"
                onChange={( e ) => this.onChangeData( e.target.value, 'tip' )}
                maxLength={200}
              />
            </FormItem>
          </div>
        }
      </div>
    )
  }

  render() {
    const { form: { getFieldDecorator }, modalVisible } = this.props;
    const { eligibilityModalVisible, editData }=this.state
    // 不同任务类型任务细项判断
    let taskItem = null
    if (  editData.taskType  === 'INVITE' ) {
      taskItem = this.renderInviteFrom()
    }
    if ( editData.taskType === 'EVENT' ) {
      taskItem = this.renderQualificaFrom()
    }
    if ( editData.taskType === 'CLICK' ) {
      taskItem = this.renderBrowseFrom()
    }

    const modalFooter = {
      okText: '保存',
      onOk: this.onSubModalConfirm,
      onCancel: this.onSubModalCancel,
    };

    return (
      <div>
        <Modal
          maskClosable={false}
          title={`${editData.id ? '编辑' : '新增'}子任务`}
          width={940}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={modalVisible}
          {...modalFooter}
        >
          <Form>
            <FormItem label='任务标题' {...this.formLayout}>
              {getFieldDecorator( 'name', {
            rules: [{ required: true, message: '请输入任务标题' }],
            initialValue: editData.name,
            } )(
              <Input
                onChange={e=>this.onChangeData( e.target.value, 'name' )}
                placeholder='请输入任务标题'
                maxLength={30}
              />
            )}
            </FormItem>
            <FormItem label="任务类型" {...this.formLayout}>
              {getFieldDecorator( 'taskType', {
                rules: [{ required: true, message: '请选择任务类型' }],
                initialValue: editData.taskType,
                } )(
                  <Radio.Group onChange={e=>this.onChangeData( e.target.value, 'taskType' )}>
                    <Radio value="INVITE">邀请任务</Radio>
                    <Radio value="EVENT">资格任务</Radio>
                    <Radio value="CLICK">浏览任务</Radio>
                  </Radio.Group>
                )}
            </FormItem>
            {taskItem}
            <FormItem
              label='任务描述'
              {...this.formLayout}
            >
              {getFieldDecorator( 'description', {
            rules: [{ required: true, message: '请输入任务描述' }],
            initialValue: editData.description,
            } )(
              <TextArea placeholder="请输入任务描述" maxLength={200} onChange={e=>this.onChangeData( e.target.value, 'description' )} />
            )}
            </FormItem>
          </Form>
        </Modal>
        <EligibilityModal
          modalVisible={eligibilityModalVisible}
          eligibilityModalConfirm={this.eligibilityModalConfirm}
          eligibilityModalCancel={this.eligibilityModalCancel}
          zIndex={1111}
          eleObj={{ task: editData }}
        />
      </div>
    )
  }

}

export default SubTaskModal;

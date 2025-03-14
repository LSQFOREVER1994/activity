/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Radio, Checkbox, InputNumber, Empty, Select, Popconfirm, Table, Button, Icon, Alert, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import serviceObj from '@/services/serviceObj';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import { featureTypes, seniorityTypes } from '../../BeesEnumes'
import EligibilityModal from './EligibilityModal'
import SubTaskModal from './SubTaskModal';
import PrizeTable from './PrizeTable';
import styles from './taskElement.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const InputGroup = Input.Group;

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
class TaskElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      eligibilityModalVisible:false, // 资格设置弹框
      subModalVisible:false, // 子任务弹框展示
      editItem:{}, // 编辑的数据
    }
  }


  componentWillMount(){
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '任务组件',
      isShowing:true,
      task:{
        name:'这里是任务标题',
        description:'这里是任务描述',
        rewardValue:1,
        attendLimit:1,
        isSingle:true,
        taskType:'EVENT',
        attendType:'DURING',
        // duration:false,
        backrewardCount:0,
        descShowType:'QUESTION_MARK',
        rewardType :'LEFT_COUNT',
        clickEvent:{
          clickType:'NONE'
        },
      },
      goButton:`${serviceObj.defaultImagePath}RW_QWC.png`,
      finishButton:`${serviceObj.defaultImagePath}RW_YWC.png`,
      image:`${serviceObj.defaultImagePath}RW_ICON.png`,
      paddingLeft: 30,
      paddingRight: 30,
      textColor:'#000000'
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    const val = e.target.value
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] &&e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign( eleObj.task, { startTime, endTime } );
    const elementsList = domData.elements ? domData.elements : []
    delete eleObj.task.duration
    const newEleObj = eleObj.task = obj;
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeImg = ( e, type ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: e } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeTaskInput = ( e, type ) => {
    const val = e.target?.value || e.format( 'YYYY-MM-DD' )
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const taskObj = eleObj.task ? eleObj.task : {}
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task: { ...taskObj, [type]: val } } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeTaskInputNumber = ( e, type ) => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const taskObj = eleObj.task ? eleObj.task : {}
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task: { ...taskObj, [type]: e } } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInputClickEven = ( e, type ) => {
    const val = e.target.value
    const { domData, changeDomData, eleObj } = this.props;
    const taskObj = eleObj.task ? eleObj.task : {}
    const oldClickEvent = taskObj.clickEvent ? taskObj.clickEvent : {}
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task: { ...taskObj, clickEvent: { ...oldClickEvent, [type]: val } } } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeFuntion = ( e, type ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const taskObj = eleObj.task ? eleObj.task : {}
    const oldClickEvent = taskObj.clickEvent ? taskObj.clickEvent : {}
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task: { ...taskObj, clickEvent: { ...oldClickEvent, [type]: e } } } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
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
    const { domData, changeDomData, eleObj } = this.props;
    const taskObj = eleObj.task ? eleObj.task : {}
    const oldClickEvent = taskObj.clickEvent ? taskObj.clickEvent : {}
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task: { ...taskObj, clickEvent: { ...oldClickEvent, noSupportWx, openByApp } } } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }

  // 打开资格编辑弹框
   onChangeEligibilityModal= ()=>{
    this.setState( {
      eligibilityModalVisible:true
    } )
  }

  // 资格选择确定
  eligibilityModalConfirm = ( data )=>{
  const { taskEventType, taskEventId, name }=data
  this.changeTaskObj( taskEventType, 'taskEventType' )
  this.changeTaskObj( taskEventId, 'taskEventId' )
  this.changeTaskObj( name, 'taskEventName' )
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


  // 打开子任务弹框
  showSubModal = ()=>{
    this.setState( {
      subModalVisible:true
    } )
  }

  // 编辑子任务
  onEditSubTask = ( e, item, index ) => {
    e.stopPropagation();
    const param = { ...item }
    if( !item.id ) param.index = index
    this.setState( {
      subModalVisible:true,
      editItem:param,
    } )
  }

  // 删除子任务
  onDeleteSubTask = ( e, item ) => {
    e.stopPropagation();
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const { task, task:{ tasks=[] } }=eleObj
    const taskList = tasks.filter( i =>{
      return JSON.stringify( i ) !== JSON.stringify( item )
    } )
    const newTask = { ...task, tasks:[...taskList] };
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task:newTask } );
    // 替换对应项
    const newElementsList = elementsList.map( info => {
      return info.virtualId === newEleObj.virtualId ? newEleObj : info;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 关闭子任务弹框
  subModalCancel = ()=>{
    this.setState( {
      subModalVisible:false,
      editItem:{},
    } )
  }

  // 确认子任务弹框
  subModalConfirm = ( data )=>{
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const { task, task:{ tasks=[] } }=eleObj
    let taskList = tasks
    if( data && ( data.id || data.index >= 0 ) ){
      // 编辑
      taskList = tasks.map( ( info, index )=>{
        if( data.id ) {
          return info.id === data.id ? data : info
        }
        if ( data.index >= 0 ) {
          return index === data.index ? data : info
        }
        return info
      } )
    } else if ( data&&!data.id ){
      // 新增
      taskList.push( data )
    }
    const newTask = Object.assign( task, { tasks:taskList } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task: newTask } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( {
      subModalVisible:false,
      editItem:{},
      time: new Date()
    } )
  }

  // 子任务表格
  renderSubTaskTable = () => {
    const { eleObj = {} } = this.props;
    const { task = {} } = eleObj
    const { tasks = [] } = task
    const columns = [
      {
        title: <span>任务标题</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>任务描述</span>,
        dataIndex: 'description',
        key: 'description',
        render: description => <span style={{ width: 450, whiteSpace: 'nowrap', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{description}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.onEditSubTask( e, item, index )}
            >编辑
            </span>
            <span
              style={{ cursor: 'pointer', margin: '0 20px 10px', color: '#f5222d' }}
            >
              <Popconfirm placement="top" title={`是否确认删除:${item.name}`} onConfirm={( e ) => this.onDeleteSubTask( e, item )} okText="是" cancelText="否">
                <span>删除</span>
              </Popconfirm>
            </span>
          </div>
        ),
      },
    ];

    return (
      <div>
        <Button
          type="dashed"
          style={{ width: '100%', marginTop: 10 }}
          icon="plus"
          onClick={this.showSubModal}
        >
          创建子任务
        </Button>
        <div style={{ margin:'20px 0 ' }}>
          <Table
            size="small"
            rowKey="id"
            columns={columns}
            dataSource={tasks}
            pagination={false}
            expandedRowRender={record => this.renderSubView( record )}
          />
        </div>
        <FormItem label={<span className={styles.labelText}><span>*</span>需完成任务数</span>} {...this.formLayout}>
          <InputNumber
            value={task.needSubCount}
            placeholder="请输入"
            min={0}
            formatter={limitDecimals}
            parser={limitDecimals}
            onChange={( e ) => this.changeTaskInputNumber( e, 'needSubCount' )}
            style={{ width: '85%' }}
          />
          <div style={{ paddingLeft: '10px' }}>
            *完成该数量任务，此任务卡片即可达标。数量最少为{task.needSubCount}。
          </div>
        </FormItem>
      </div>
    )
  }


  // 子任务资格列表
  renderSubTaskZGTable = ( list=[] ) => {
    const columns = [
      {
        title: <span>规则</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>规则描述</span>,
        dataIndex: 'description',
        key: 'description',
        render: description => <span>{description}</span>,
      },
    ];

    return (
      <div style={{ margin:'10px 0 ' }}>
        <Table
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
          // expandedRowRender={record => this.renderSubView( record )}
        />
      </div>
    )
  }

  // 子任务资格展示
  renderSubView = ( data )=>{
    const { tasks } = data
    if( tasks && tasks.length > 0 ){
      return this.renderSubTaskZGTable( tasks )
    }
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="此项无数据" />
  }

  // 选择资格类型
  changeTaskObj= ( e, type ) => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props
    const taskObj = eleObj.task ? eleObj.task : {}
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { task: { ...taskObj, [type]: e } } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  // 邀请任务
  renderInviteFrom = () => {
    const { eleObj = {} } = this.props;
    return (
      <div>
        <FormItem label={<span className={styles.labelText}><span>*</span>被邀请人资格</span>} {...this.formLayout}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <div style={{ background:'#f5f5f5', padding:'0 10px', borderRadius:'5px', width:'85%' }}>
              {( eleObj.task && eleObj.task.taskEventId )?eleObj.task.taskEventName:'--'}
            </div>
            <Icon type="edit" style={{ fontSize:'18px', marginLeft:'10px', cursor:'pointer' }} onClick={this.onChangeEligibilityModal} />
          </div>
        </FormItem>
        <FormItem label={<span className={styles.labelText}><span>*</span>被邀请人增加次数</span>} {...this.formLayout}>
          <InputNumber
            value={eleObj?.task?.backRewardCount ?? 0}
            placeholder="请输入"
            min={0}
            formatter={limitDecimals}
            parser={limitDecimals}
            onChange={( e ) => this.changeTaskInputNumber( e, 'backRewardCount' )}
            style={{ width: '85%' }}
          />
          <span style={{ paddingLeft: '10px' }}>次</span>
        </FormItem>
        <FormItem label="被邀请成功提示" {...this.formLayout}>
          <Input
            value={( eleObj.task && eleObj.task.backTip ) ? eleObj.task.backTip : ''}
            placeholder="请输入被邀请成功提示"
            onChange={( e ) => this.changeTaskInput( e, 'backTip' )}
            maxLength={200}
          />
        </FormItem>
        <FormItem label="任务完成消息提示" {...this.formLayout}>
          <TextArea
            value={( eleObj.task && eleObj.task.tip ) ? eleObj.task.tip : ''}
            placeholder="请输入任务完成消息提示"
            onChange={( e ) => this.changeTaskInput( e, 'tip' )}
            maxLength={200}
          />
        </FormItem>
      </div>
    )
  }

  // 资格任务
  renderQualificaFrom = ()=>{
    const { eleObj = {} } = this.props;
    const { task={} }=eleObj
    return (
      <div>
        <FormItem label={<span className={styles.labelText}><span>*</span>参与人资格</span>} {...this.formLayout}>
          <div style={{ display:'flex', alignItems:'center' }}>
            <div style={{ background:'#f5f5f5', padding:'0 10px', borderRadius:'5px', width:'85%' }}>
              {( task && task.taskEventId )?task.taskEventName:'--'}
            </div>
            <Icon type="edit" style={{ fontSize:'18px', marginLeft:'10px', cursor:'pointer' }} onClick={this.onChangeEligibilityModal} />
          </div>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>设置跳转</span>}
          {...this.formLayout}
        >
          <Radio.Group
            onChange={( e ) => this.changeInputClickEven( e, 'clickType' )}
            value={task.clickEvent ? task.clickEvent.clickType : ''}
          >
            <Radio value="NONE">无</Radio>
            <Radio value="FEATURE">功能</Radio>
            <Radio value="CUSTOM_LINK">自定义链接</Radio>
          </Radio.Group>
        </FormItem>
        {task.clickEvent && task.clickEvent.clickType === 'FEATURE' &&
          <FormItem label="选择功能" {...this.formLayout}>
            <Select
              style={{ width: '100%' }}
              onChange={( e ) => this.changeFuntion( e, 'key' )}
              value={task.clickEvent ? task.clickEvent.key : ''}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {seniorityTypes.map( info=>  <Option value={info.key}>{info.value}</Option> )}
            </Select>
          </FormItem>
        }

        { task.clickEvent && task.clickEvent.key === 'SHARE_HELP' &&
        <FormItem
          style={{ display: 'flex' }}
          label='活动链接'
          {...this.formLayout}
        >
          <Input
            value={task.clickEvent ? task.clickEvent.link : ''}
            placeholder='请输入分享助力链接'
            onChange={( e ) => this.changeInputClickEven( e, 'link' )}
            maxLength={200}
          />
        </FormItem>
            }

        {task.clickEvent && task.clickEvent.clickType === 'CUSTOM_LINK' &&
          <div>
            <FormItem
              style={{ display: 'flex' }}
              label='跳转链接'
              {...this.formLayout}
            >
              <Input
                value={task.clickEvent ? task.clickEvent.link : ''}
                placeholder="请输入跳转链接"
                onChange={( e ) => this.changeInputClickEven( e, 'link' )}
              />
            </FormItem>
            {/*
            <FormItem
              style={{ display: 'flex' }}
              label={<span className={styles.labelText}><span>*</span>端内链接</span>}
              {...this.formLayout}
            >
              <Input
                value={task.clickEvent ? task.clickEvent.link : ''}
                placeholder="请输入端内链接"
                onChange={( e ) => this.changeInputClickEven( e, 'link' )}
                maxLength={200}
              />
            </FormItem>

            <FormItem
              style={{ display: 'flex' }}
              label={<span className={styles.labelText}><span>*</span>端外链接</span>}
              {...this.formLayout}
            >
              <Input
                value={task.clickEvent ? task.clickEvent.outLink : ''}
                placeholder="请输入端外链接"
                onChange={( e ) => this.changeInputClickEven( e, 'outLink' )}
                maxLength={200}
              />
            </FormItem>
            <FormItem
              style={{ display: 'flex' }}
              label={<span className={styles.labelText}><span>*</span>链接限制</span>}
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
                value={( eleObj.task && eleObj.task.tip ) ? eleObj.task.tip : ''}
                placeholder="请输入任务完成消息提示"
                onChange={( e ) => this.changeTaskInput( e, 'tip' )}
                maxLength={200}
              />
            </FormItem>
          </div>
        }
      </div>
    )
  }

  // 浏览任务
  renderBrowseFrom = ()=>{
    const { eleObj = {} } = this.props;
    const { task={} }=eleObj
    // const options = [
    //   { label: '不支持微信打开', value: 'noSupportWx' },
    //   { label: '需原生APP打开', value: 'openByApp' },
    // ];

    const checkboxVal = []
    if ( task.clickEvent && task.clickEvent.noSupportWx ) {
      checkboxVal.push( 'noSupportWx' )
    }
    if ( task.clickEvent && task.clickEvent.openByApp ) {
      checkboxVal.push( 'openByApp' )
    }
    return (
      <div>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>设置跳转</span>}
          {...this.formLayout}
        >
          <Radio.Group
            onChange={( e ) => this.changeInputClickEven( e, 'clickType' )}
            value={task.clickEvent ? task.clickEvent.clickType : ''}
          >
            <Radio value="NONE">无</Radio>
            {/* <Radio value="FEATURE">功能</Radio> */}
            <Radio value="CUSTOM_LINK">自定义链接</Radio>
          </Radio.Group>
        </FormItem>

        {/* {task.clickEvent && task.clickEvent.clickType === 'FEATURE' &&
          <FormItem label={<span className={styles.labelText}><span>*</span>选择功能</span>} {...this.formLayout}>
            <Select
              style={{ width: '100%' }}
              onChange={( e ) => this.changeFuntion( e, 'key' )}
              value={task.clickEvent ? task.clickEvent.key : ''}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {featureTypes.map( info=>  <Option value={info.key}>{info.value}</Option> )}
            </Select>
          </FormItem>
        } */}

        {task.clickEvent && task.clickEvent.clickType === 'CUSTOM_LINK' &&
          <div>
            <FormItem
              style={{ display: 'flex' }}
              label='跳转链接'
              {...this.formLayout}
            >
              <Input
                value={task.clickEvent ? task.clickEvent.link : ''}
                placeholder="请输入跳转链接"
                onChange={( e ) => this.changeInputClickEven( e, 'link' )}
                maxLength={1000}
              />
            </FormItem>
            {/*
            <FormItem
              style={{ display: 'flex' }}
              label={<span className={styles.labelText}><span>*</span>端内链接</span>}
              {...this.formLayout}
            >
              <Input
                value={task.clickEvent ? task.clickEvent.link : ''}
                placeholder="请输入端内链接"
                onChange={( e ) => this.changeInputClickEven( e, 'link' )}
                maxLength={200}
              />
            </FormItem>

            <FormItem
              style={{ display: 'flex' }}
              label={<span className={styles.labelText}><span>*</span>端外链接</span>}
              {...this.formLayout}
            >
              <Input
                value={task.clickEvent ? task.clickEvent.outLink : ''}
                placeholder="请输入端外链接"
                onChange={( e ) => this.changeInputClickEven( e, 'outLink' )}
                maxLength={200}
              />
            </FormItem>
            <FormItem
              style={{ display: 'flex' }}
              label={<span className={styles.labelText}><span>*</span>链接限制</span>}
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
                value={( eleObj.task && eleObj.task.tip ) ? eleObj.task.tip : ''}
                placeholder="请输入任务完成消息提示"
                onChange={( e ) => this.changeTaskInput( e, 'tip' )}
                maxLength={200}
              />
            </FormItem>
          </div>
        }
      </div>
    )
  }

  // 单任务展示
  renderTaskSingle = () => {
    const { eleObj = {} } = this.props;
    // 不同任务类型任务细项判断
    let taskItem = null
    if ( eleObj.task && eleObj.task.taskType && eleObj.task.taskType === 'INVITE' ) {
      taskItem = this.renderInviteFrom()
    }
    if ( eleObj.task && eleObj.task.taskType && eleObj.task.taskType === 'EVENT' ) {
      taskItem = this.renderQualificaFrom()
    }
    if ( eleObj.task && eleObj.task.taskType && eleObj.task.taskType === 'CLICK' ) {
      taskItem = this.renderBrowseFrom()
    }

    return (
      <div>
        <FormItem label={<span className={styles.labelText}><span>*</span>任务类型</span>} {...this.formLayout}>
          <Radio.Group
            onChange={( e ) => this.changeTaskInput( e, 'taskType' )}
            value={( eleObj.task && eleObj.task.taskType ) ? eleObj.task.taskType : ''}
          >
            <Radio value="INVITE">邀请任务</Radio>
            <Radio value="EVENT">资格任务</Radio>
            <Radio value="CLICK">浏览任务</Radio>
          </Radio.Group>
        </FormItem>
        {taskItem}
      </div>
    )
  }

  // 跳转资格
  onJumpQualifications = ()=>{
    window.open( serviceObj.jumpObj.qualificationsUrl )
  }

  render() {
    const { eligibilityModalVisible, subModalVisible, editItem }=this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    let taskView
    if ( eleObj.task && eleObj.task.isSingle ) {
      taskView = this.renderTaskSingle()
    } else if( eleObj.task && !eleObj.task.isSingle ) {
      taskView = this.renderSubTaskTable()
    }
    return (
      <div>
        <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}
        />
        <div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>组件名称</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={( e ) => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>是否展示</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'isShowing' )}
              value={eleObj.isShowing}
            >
              <Radio value>展示</Radio>
              <Radio value={false}>不展示</Radio>
            </Radio.Group>
            <span style={{ fontSize:'12px' }}>*选择不展示时，该任务不会再客户端展示</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>任务标题</span>}
            {...this.formLayout}
          >
            <Input
              value={( eleObj.task && eleObj.task.name ) ? eleObj.task.name : ''}
              placeholder="请输入任务标题"
              onChange={( e ) => this.changeTaskInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>任务描述展示类型</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeTaskInput( e, 'descShowType' )}
              value={eleObj.task && eleObj.task.descShowType}
            >
              <Radio key='QUESTION_MARK' value='QUESTION_MARK'>问号</Radio>
              <Radio key='PAGE' value='PAGE'>页面展示</Radio>
              <Radio key="NONE" value='NONE'>无</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}>任务描述</span>}
            {...this.formLayout}
          >
            <TextArea
              value={( eleObj.task && eleObj.task.description ) ? eleObj.task.description : ''}
              placeholder="请输入任务描述"
              onChange={( e ) => this.changeTaskInput( e, 'description' )}
              maxLength={200}
            />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>任务奖励类型</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeTaskInput( e, 'rewardType' )}
              value={eleObj.task && eleObj.task.rewardType}
            >
              <Radio key="LEFT_COUNT" value='LEFT_COUNT'>参与次数</Radio>
              <Radio key='INTEGRAL' value='INTEGRAL'>积分</Radio>
              <Radio key='PRIZE' value='PRIZE'>奖品</Radio>
            </Radio.Group>
          </FormItem>


          {
            eleObj.task.rewardType !== 'PRIZE' &&
            <FormItem label={<span className={styles.labelText}><span>*</span>任务奖励</span>} {...this.formLayout}>
              <InputNumber
                value={eleObj.task && eleObj.task.rewardValue}
                placeholder="请输入"
                min={0}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.changeTaskInputNumber( e, 'rewardValue' )}
                style={{ width: '85%' }}
              />
              <span style={{ paddingLeft: '10px' }}>
                {eleObj.task.rewardType === 'LEFT_COUNT' ? '次' : '分'}
              </span>
            </FormItem>
          }

          <FormItem label={<span className={styles.labelText}><span>*</span>任务上限</span>} {...this.formLayout}>
            <InputGroup compact>
              <InputNumber
                value={eleObj.task && eleObj.task.attendLimit}
                placeholder="请输入"
                min={0}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.changeTaskInputNumber( e, 'attendLimit' )}
                style={{ width: '75%' }}
              />
              <Select
                style={{ width: 100 }}
                value={( eleObj.task&&eleObj.task.attendType )?eleObj.task.attendType:''}
                onChange={( val ) => this.changeTaskInputNumber( val, 'attendType' )}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                <Option value="DAILY">次(每日)</Option>
                <Option value="DURING">次</Option>
              </Select>
            </InputGroup>
          </FormItem>


          <FormItem label="触发几次完成任务" {...this.formLayout}>
            <InputNumber
              value={eleObj.task && eleObj.task.eachCount}
              placeholder="不填默认1次"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeTaskInputNumber( e, 'eachCount' )}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>
              次
            </span>
          </FormItem>

          {
             eleObj.task.rewardType === 'LEFT_COUNT' &&
               <FormItem
                 label={<span className={styles.labelText}>失效时间</span>}
                 {...this.formLayout}
               >
                 <DatePicker
                   style={{ width: '100%' }}
                   placeholder='请选择失效时间'
                   value={eleObj?.task?.expireDate ? moment( eleObj.task.expireDate, 'YYYY-MM-DD' ) : null}
                   onChange={( e ) => this.changeTaskInput( e, 'expireDate' )}
                   format="YYYY-MM-DD"
                 />
               </FormItem>
          }

          <FormItem
            label={<span className={styles.labelText}><span>*</span>去完成按钮</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.goButton}
                onChange={( e )=>this.changeImg( e, 'goButton' )}
              />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
              }
              >
                <div>格式：jpg/jpeg/png </div>
                <div>图片尺寸建议150px * 64px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>已完成按钮</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.finishButton}
                onChange={( e )=>this.changeImg( e, 'finishButton' )}
              />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
              }
              >
                <div>格式：jpg/jpeg/png </div>
                <div>图片尺寸建议150px * 64px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>

          <FormItem
            label="任务图标"
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.image}
                onChange={( e )=>this.changeImg( e, 'image' )}
              />
              <div
                style={{
                  width: '180px',
                  fontSize: 13,
                  color: '#999',
                  lineHeight: 2,
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                <div>格式：jpg/jpeg/png </div>
                <div>图片尺寸建议150px * 64px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>

          <Alert
            type="warning"
            style={{ marginBottom: 10 }}
            showIcon
            message={(
              <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between', marginTop:'2px'  }}>
                <span>添加任务可以需先配置相应资格，已配置请忽略。</span>
                <span onClick={() => { this.onJumpQualifications() }} style={{ color: '#1890FF', cursor: 'pointer' }}>点此去配置资格</span>
              </div> )}
          />


          {/* <FormItem
            label={<span className={styles.labelText}><span>*</span>任务达标限制</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeTaskInput( e, 'duration' )}
              value={eleObj.task && eleObj.task.duration}
            >
              <Radio value={false}>不限制</Radio>
              <Radio value>需在活动期间触发</Radio>
              <Radio value="1">自定义时间段内触发</Radio>
            </Radio.Group>
          </FormItem> */}

          <FormItem
            label={<span className={styles.labelText}>自定义时间段</span>}
            {...this.formLayout}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={eleObj.task.startTime ? [moment( eleObj.task.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( eleObj.task.endTime, 'YYYY-MM-DD HH:mm:ss' )] : []}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={( e ) => this.changeDate( e )}
            />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>是否单任务</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeTaskInput( e, 'isSingle' )}
              value={eleObj.task && eleObj.task.isSingle}
            >
              <Radio value>单任务</Radio>
              <Radio value={false}>任务组</Radio>
            </Radio.Group>
          </FormItem>
          {taskView}
        </div>
        {
          eleObj.task.rewardType === 'PRIZE' &&
          <PrizeTable
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        }
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
        {eligibilityModalVisible&&
          <EligibilityModal
            eleObj={eleObj}
            modalVisible={eligibilityModalVisible}
            eligibilityModalConfirm={this.eligibilityModalConfirm}
            eligibilityModalCancel={this.eligibilityModalCancel}
          />
        }
        {subModalVisible&&
        <SubTaskModal
          modalVisible={subModalVisible}
          eleObj={eleObj}
          data={editItem}
          subModalConfirm={this.subModalConfirm}
          subModalCancel={this.subModalCancel}
        />
        }
      </div>
    )
  }

}

export default TaskElement;

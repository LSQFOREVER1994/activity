import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, DatePicker, Select, Icon, message, Alert } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from '../../../../../Lists.less';


const FormItem = Form.Item;
const { confirm } = Modal;
const time = () => new Date().getTime();
const { Option } = Select;
const InputGroup = Input.Group;


const rewardTypeObj ={
  'DAILY_REWARD':'次（当日）',
  'DURING_REWARD':'次'
}

const typeObj ={
  'DAILY':'次/每日',
  'DURING':'次'
}


@connect( ( { tool } ) => ( {
  loading: tool.loading,
  eventList: tool.eventList,
} ) )
@Form.create()
class TaskModal extends PureComponent {

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
  };

  constructor( props ) {
    super( props );
    let list = [];
    if( props.taskData && props.taskData.taskOptions && props.taskData.taskOptions.length > 0 ){
      list = props.taskData.taskOptions.map( ( item, index ) => ( { ...item, rowKey: `${item.id}+${index}` } ) )
    }
    this.state = {
      pageNum: 1,
      pageSize: 20,
      taskList:list,
      eventList:[],
      nameValue:'',
      noteValue:'',
      rewardType1:'',
      type:'',
    };
  }


  componentDidMount() {
    this.fetchEventList()
    this.props.onRef( this )
  }


  // 获取事件
  fetchEventList =() => {
    const { pageNum, pageSize, name } =this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/getEventList',
      payload: {
        pageNum,
        pageSize,
        name,
        orderBy:'create_time desc'
      },
      callFunc:( res )=>{
        const { list } = res;
        this.setState( { eventList:list } )
      }
    } )
  }


  onPreview = () => {
    this.props.onPreview()
  }

  getValues = () => {
    const { taskData={} }=this.props;
    const { taskList } = this.state;
    const data = taskData;
    data.taskOptions = taskList;
    return data
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      info: undefined,
      nameValue:'',
      noteValue:'',
      rewardType1:'DAILY_REWARD',
      type:'DAILY',
      visible: true,
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, obj ) => {
    const { eventList }=this.state;
    const { eventId, rewardCount, attendLimit, rewardType, type, name, note }=obj;
    const newList = eventList
    if( eventId && !( eventList.find( item=>item.id === obj.eventId ) ) ){
      newList.push( obj )
    }
    this.setState( {
      info:obj,
      nameValue:name || '',
      noteValue:note || '',
      eventList:newList,
      rewardCount,
      attendLimit,
      rewardType1:rewardType,
      type,
      visible:true,
    }, ()=>{
      // const { rewardCount, attendLimit } = obj;
      const { form:{ setFieldsValue } }=this.props;
      setFieldsValue( { rewardCount, attendLimit } )
    } )
  };


  //  事件滚动条
  companyScroll = e => {
    e.persist();
    const { pageSize }=this.state;
    const { target } = e;
    if ( target.scrollTop + target.offsetHeight === target.scrollHeight ) {
      this.setState( { pageSize:pageSize+10 }, ()=>this.fetchEventList() )
    }
  };

  //  奖品输入名称筛选
  onSearch = ( value ) =>{
    clearTimeout( this.timer );
    this.timer=setTimeout( () => {
      this.setState( { name: value, pageSize:10 }, ()=>this.fetchEventList() );
    }, 500 );
  }


  onChange=( e, type )=>{
    const data = e.target.value;
    this.setState( { [type]:data }, ()=>{
      const { form:{ setFieldsValue } }=this.props;
      if( type === 'rewardCount' ){
        setFieldsValue( { rewardCount:data } )
      }
      if( type === 'attendLimit' ){
        setFieldsValue( { attendLimit:data } )
      }
    } )
  }

  selChange=( val, type )=>{
    this.setState( { [type]:val } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      info: undefined,
      noteValue:'',
      nameValue:'',
      name:'',
    }, ()=>this.fetchEventList() );
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { taskList } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk:() => {
        // 过滤删除
        const newList = taskList.filter( item => item.rowKey !==obj.rowKey );
        this.setState( { taskList: newList }, ()=>{
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  deleteNullKey = ( data ) => {
    // eslint-disable-next-line no-restricted-syntax
    for( const key in data ) { // 去除未填写的字段
      if( data[key] === '' || data[key] === undefined ){
        // eslint-disable-next-line no-param-reassign
        delete data[key]
      }
    }
    return data;
  }

  // 提交：商品种类
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { form, activityType } = this.props;
    const { info, taskList, rewardCount, rewardType1, attendLimit, type, eventList } = this.state;

    let newList = taskList;
    let data;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { startTime, endTime, eventId }=fieldsValue;
      if( eventId ){
        const { name } = eventList.find( item=> item.id === fieldsValue.eventId )
        data = Object.assign( { ...fieldsValue }, { attendLimit, type, eventName:name } )
      }else{
        data = Object.assign( { ...fieldsValue }, { attendLimit, type, eventName:'' } )
      }
      if( activityType !== 'GUESS_GAME' ){
        data.rewardCount = rewardCount;
        data.rewardType = rewardType1;
      }
      data.startTime = startTime && moment( startTime ).format( 'YYYY-MM-DD HH:mm:ss' );
      data.endTime = endTime && moment( endTime ).format( 'YYYY-MM-DD HH:mm:ss' );
      if( info && info.rowKey ){
        newList = taskList.map( item => item.rowKey === info.rowKey ? this.deleteNullKey( { ...item, ...data } ) : item )
        message.success( '编辑成功' )
      }else{
        newList.push( { ...this.deleteNullKey( data ), rowKey:time() } )
        message.success( '添加成功' )
      }

      //  按排序值排序
      const Arr = newList.sort( ( a, b ) => {
        const value1 = a.sort;
        const value2 = b.sort;
        return value1 > value2 ? 1 : -1;
      } );

      this.setState( {
        visible: false,
        info: undefined,
        taskList:new Array( ...Arr ),
        noteValue:'',
        nameValue:'',
        name:'',
      }, ()=>{
        this.fetchEventList();
        this.onPreview()
      } );
    } );
  };



  render() {
    const { form: { getFieldDecorator }, showTaskType, activityType } = this.props;
    const { visible, info = {}, taskList, nameValue, noteValue, rewardType1, type, eventList } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns =[
      {
        title: <span>任务名称</span>,
        dataIndex: 'name',
        align: 'center',
        render: name => <span>{name}</span>
      },
      {
        title: <span>事件名称</span>,
        dataIndex: 'eventName',
        align: 'center',
        render:eventName=><span>{eventName || '--'}</span>
      },
      {
        title: <span>任务奖励</span>,
        dataIndex: 'rewardType',
        align: 'center',
        render:( id, item )=>{
          const{ rewardType, rewardCount } = item;
          if( activityType === 'GUESS_GAME' ) return <span>{rewardCount}分</span>
          if( rewardType && rewardCount !== undefined ) return <span>{`活动次数${rewardCount}${rewardTypeObj[rewardType]}`}</span>
          return <span>--</span>
        }
      },
      {
        title:<span>任务上限</span>,
        dataIndex:'attendLimit',
        align: 'center',
        render:( attendLimit, item )=>{
          if( attendLimit !==undefined && item.type ){
            return <span>{`${attendLimit}${typeObj[item.type]}`}</span>
          }
          return <span>--</span>
        }
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'startTime',
        align: 'center',
        render:startTime=><span>{startTime || '--'}</span>
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        align: 'center',
        render:endTime=><span>{endTime || '--'}</span>
      },
      {
        title:<span>排序值</span>,
        dataIndex:'sort',
        align: 'center',
        render:sort=><span>{sort}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'rowKey',
        render: ( rowKey, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>

          </div>
        ),
      },

    ]

    return (
      <GridContent>
        {/* <p style={{ color:'#D1261B', fontSize:12 }}>（选填）对任务进行设置，用户完成任务可以获得奖励</p> */}
        <Alert
          style={{ marginBottom: 15 }}
          className={styles.edit_alert}
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>添加任务需先配置所需事件，若已配置请忽略</span>
              <span onClick={() => { window.open( `${window.location.origin}/oldActivity/tool/taskEvents` )}} style={{ color: '#1890FF', cursor:'pointer' }}>任务事件</span>
            </div> )}
          banner
        />
        <Table
          size="small"
          rowKey="rowKey"
          columns={columns}
          pagination={false}
          dataSource={taskList}
          footer={() => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1890FF',
                  cursor:'pointer',
                }}
                onClick={this.showModal}
              >
                <Icon
                  type="plus-circle"
                  style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
                />
                添加任务
              </div>
            )
          }}
        />
        {
          visible ?
            <Modal
              maskClosable={false}
              title={info.id ? '编辑任务' : '添加任务'}
              className={styles.standardListForm}
              width={700}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form className={styles.formHeight} onSubmit={this.handleSubmit}>

                <FormItem label='任务名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                      rules: [ { required: true, message: `${formatMessage( { id: 'form.input' } )}任务名称` }, ],
                      initialValue: info.name,
                      } )( <Input placeholder='请输入任务名称' maxLength={10} onChange={( e )=>this.onChange( e, 'nameValue' )} />
                    )}
                  <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{nameValue.length}/10</span>
                </FormItem>

                <FormItem label='任务描述' {...this.formLayout}>
                  {getFieldDecorator( 'note', {
                      rules: [ { required: false, message: `${formatMessage( { id: 'form.input' } )}任务描述` }, ],
                      initialValue: info.note,
                      } )( <Input placeholder='可输入任务描述，展示在任务名称下方' maxLength={20} onChange={( e )=>this.onChange( e, 'noteValue' )} />
                    )}
                  <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{noteValue.length}/20</span>
                </FormItem>
                {
                  showTaskType === 'BIG_IMAGE' ?
                    <div>
                      <FormItem label='默认任务图片' {...this.formLayout}>
                        {getFieldDecorator( 'icon', {
                          rules: [{ required: false } ],
                          initialValue: info.icon
                        } )( <UploadImg onChange={this.onPreview} /> )}
                        <div
                          style={{
                            position: 'absolute',
                            top:0, left:'125px',
                            width:'200px',
                            fontSize: 13,
                            color: '#999',
                            lineHeight:2,
                            marginTop:'10px'
                          }}
                        >
                          <div>格式：jpg/jpeg/png </div>
                          <div>建议尺寸：宽度750px，高度不限</div>
                          <div>图片大小建议不大于1M</div>
                        </div>
                      </FormItem>

                      <FormItem label='完成任务图片' {...this.formLayout}>
                        {getFieldDecorator( 'iconFinish', {
                          rules: [{ required: false } ],
                          initialValue: info.iconFinish
                        } )( <UploadImg onChange={this.onPreview} /> )}
                        <div
                          style={{
                            position: 'absolute',
                            top:0, left:'125px',
                            width:'200px',
                            fontSize: 13,
                            color: '#999',
                            lineHeight:2,
                            marginTop:'10px'
                          }}
                        >
                          <div>格式：jpg/jpeg/png </div>
                          <div>建议尺寸：宽度750px，高度不限</div>
                          <div>图片大小建议不大于1M</div>
                        </div>
                      </FormItem>
                    </div>
                  :
                    <FormItem label='任务图标' {...this.formLayout}>
                      {getFieldDecorator( 'icon', {
                      rules: [{ required: false } ],
                      initialValue: info.icon
                    } )( <UploadImg onChange={this.onPreview} /> )}
                      <div
                        style={{
                          position: 'absolute',
                          top:0, left:'125px',
                          width:'180px',
                          fontSize: 13,
                          color: '#999',
                          lineHeight:2,
                          marginTop:'10px'
                        }}
                      >
                        <div>格式：jpg/jpeg/png </div>
                        <div>建议尺寸：100px*100px </div>
                        <div>图片大小建议不大于1M</div>
                      </div>
                    </FormItem>
                }

                <FormItem label='开始时间' {...this.formLayout}>
                  {getFieldDecorator( 'startTime', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}开始时间` }],
                    initialValue: info.startTime && moment( info.startTime, 'YYYY-MM-DD HH:mm:ss' ),
                  } )( <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width:300 }} /> )}
                </FormItem>

                <FormItem label='结束时间' {...this.formLayout}>
                  {getFieldDecorator( 'endTime', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}结束时间` }],
                    initialValue: info.endTime && moment( info.endTime, 'YYYY-MM-DD HH:mm:ss' ),
                  } )( <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width:300 }} /> )}
                </FormItem>

                <FormItem label='事件' {...this.formLayout}>
                  {getFieldDecorator( 'eventId', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.select' } )}事件` }],
                    initialValue: info.eventId,
                  } )(
                    <Select
                      onSearch={this.onSearch}
                      allowClear
                      showSearch
                      filterOption={false}
                      onChange={()=>this.onSearch}
                      onPopupScroll={this.companyScroll}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      {
                        eventList.length && eventList.map( item=>(
                          <Option key={item.id}>{item.name}</Option>
                        ) )
                      }
                    </Select>
                  )}
                </FormItem>

                <FormItem label='跳转链接' {...this.formLayout}>
                  {getFieldDecorator( 'link', {
                      rules: [ { required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }, ],
                      initialValue: info.link,
                      } )( <Input placeholder='可输入跳转链接，不填则点击即可完成' />
                    )}
                </FormItem>

                <FormItem label='关联活动' {...this.formLayout}>
                  {getFieldDecorator( 'activityId', {
                      rules: [ { required: false, message: `${formatMessage( { id: 'form.input' } )}关联活动ID` }, ],
                      initialValue: info.activityId,
                      } )( <Input placeholder='请输入关联活动ID' />
                    )}
                </FormItem>

                {
                  activityType === 'GUESS_GAME' ?
                    <FormItem label='任务奖励' {...this.formLayout}>
                      {getFieldDecorator( 'rewardCount', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务奖励` },
                      { pattern:new RegExp( /^[1-9]\d*$/ ), message:'请输入正整数' }
                    ],
                    } )(
                      <Input
                        placeholder='请输入任务奖励，该值为正整数，最小值为1'
                        min={1}
                        addonAfter='分'
                        type='number'
                      />
                      )}
                    </FormItem>
                  :
                    <FormItem label='任务奖励' {...this.formLayout}>
                      {getFieldDecorator( 'rewardCount', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务奖励` },
                        { pattern:new RegExp( /^[1-9]\d*$/ ), message:'请输入正整数' }
                      ],
                      } )(
                        <InputGroup compact>
                          <Input style={{ width: '75%' }} type='number' defaultValue={info.rewardCount} onChange={( e )=>this.onChange( e, 'rewardCount' )} />
                          <Select style={{ width:100 }} defaultValue={info.rewardType || rewardType1} onChange={( val )=>this.selChange( val, 'rewardType1' )}>
                            <Option value="DAILY_REWARD">次(当日)</Option>
                            <Option value="DURING_REWARD">次</Option>
                          </Select>
                        </InputGroup>
                        )}
                    </FormItem>
                }

                <FormItem label='任务上限' {...this.formLayout}>
                  {getFieldDecorator( 'attendLimit', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务上限` },
                    { pattern:new RegExp( /^[1-9]\d*$/ ), message:'请输入正整数' }
                   ],
                  } )(
                    <InputGroup compact>
                      <Input style={{ width: '75%' }} type='number' defaultValue={info.attendLimit} onChange={( e )=>this.onChange( e, 'attendLimit' )} />
                      <Select style={{ width:100 }} defaultValue={info.type || type} onChange={( val )=>this.selChange( val, 'type' )}>
                        <Option value="DAILY">次/每日</Option>
                        <Option value="DURING">次</Option>
                      </Select>
                    </InputGroup>
                    )}
                </FormItem>

                <FormItem label='排序值' {...this.formLayout}>
                  {getFieldDecorator( 'sort', {
                      rules: [ { required: true, message: `${formatMessage( { id: 'form.input' } )}排序值` }, ],
                      initialValue: info.sort,
                      } )( <Input placeholder='请输入排序值，数值越小排序越靠前' />
                    )}
                </FormItem>

              </Form>
            </Modal> : null
        }
      </GridContent>
    );
  }
}

export default TaskModal;

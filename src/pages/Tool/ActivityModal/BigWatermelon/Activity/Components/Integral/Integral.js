// 积分设置
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Modal, Form, Table, Icon, Radio, message, Alert } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { SketchPicker } from 'react-color';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import IntegralModal from './IntegralModal';
import styles from '../../../../ActivityModal.less';


const rewardTypeObj ={
  'DAILY_REWARD':'分（当日）',
  'DURING_REWARD':'分'
}

const typeObj ={
  'DAILY':'次/每日',
  'DURING':'次'
}

const FormItem = Form.Item;
const { confirm } = Modal;
const time = () => new Date().getTime();


@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )

@Form.create()
class Integral extends PureComponent {


  formItemStyle = {
    display: 'flex',
    marginLeft: '3%'
  }

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      titleValue: this.setInitialValue( 'integralTaskTitle' ),
      integralPopupTitleColor: this.setInitialValue( 'integralPopupTitleColor' ),
      integralPopupBackgroundColor:  this.setInitialValue( 'integralPopupBackgroundColor' ),
      integralList: this.setInitialValue( 'integralTaskGroup' ),  // 表格数据
      id: this.setInitialValue( 'id' ),
      visiblePopupTitleColor: false,
      visiblePopupBackgroundColor: false,
      visible: false, // 控制添加任务弹窗
      info: undefined, // 任务信息
      nameValue: '', // 输入名字
      noteValue: '', // 描述值
      eventList: [], // 任务事件
      rewardType1:'DAILY_REWARD',
      type:'DAILY',
    }
  }


  componentDidMount() {
    this.fetchEventList();
  }

  // 设置初始值
  setInitialValue = ( type ) => {
    const {
      integralTaskGroup,
      integralTaskTitle,
      integralPopupTitleColor,
      integralPopupBackgroundColor
    } = this.props.data;
    let list = [];
    if ( type === 'integralTaskGroup' ) {
      if ( integralTaskGroup && integralTaskGroup.taskOptions && integralTaskGroup.taskOptions.length > 0 ) {
        list = integralTaskGroup.taskOptions.map( ( item, index ) => ( { ...item, rowKey: `${item.id}+${index}` } ) );
      }
      return list;
    }
    if ( type === 'integralTaskTitle' ) {
      return integralTaskTitle || ''
    }
    if ( type === 'integralPopupTitleColor' ) {
      return integralPopupTitleColor || '#333'
    }
    if ( type === 'integralPopupBackgroundColor' ) {
      return integralPopupBackgroundColor || '#333'
    }
    if ( type === 'id' ) {
      if ( integralTaskGroup ) return integralTaskGroup.id;
      return null
    }
    return null
  }

  getValues = () => {
    const { integralList, integralPopupBackgroundColor, integralPopupTitleColor, id } = this.state;
    const { form : { getFieldsValue } } = this.props;
    const { integralShowTask, integralTaskButton, integralTaskTitle } = getFieldsValue();
    return { integralTaskGroup: {
      taskOptions: integralList, ...getFieldsValue(), id
    }, integralPopupBackgroundColor, integralPopupTitleColor, integralShowTask, integralTaskButton, integralTaskTitle };
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
    const newList = eventList;
    if( eventId && !( eventList.find( item=>item.id === obj.eventId ) ) ){
      newList.push( obj );
    }
    this.setState( {
      info: obj,
      nameValue:name || '',
      noteValue:note || '',
      eventList:newList,
      // rewardCount,
      // attendLimit,
      rewardType1:rewardType,
      type,
      visible:true,
    }, ()=>{
      setTimeout( () => {
        const { form:{ setFieldsValue } } = this.formRef.props;
        setFieldsValue( { rewardCount, attendLimit } );
      } );
    } )
  };

  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { integralList } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk:() => {
        // 过滤删除
        const newList = integralList.filter( item => item.rowKey !==obj.rowKey );
        this.setState( { integralList: newList }, ()=>{
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  onPreview = () => {
    setTimeout( () => {
      this.props.onPreview();
    } )
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

  // 获取事件
  fetchEventList =() => {
    const { pageNum, pageSize, name } =this.state;
    const { dispatch } = this.props;
    // if( name && eventList.length === totalNum )return
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

  // 提交：商品种类
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const { form, state: { type, rewardType1 }  } = this.formRef.getValues();
    const { info, integralList, eventList } = this.state;
    let newList = integralList;
    let data;


    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { startTime, endTime }=fieldsValue;
      if( fieldsValue.eventId ){
        const { name } = eventList.find( item=> item.id === fieldsValue.eventId )
        data = Object.assign( { ...fieldsValue }, { type, eventName:name } )
      }else{
        data = Object.assign( { ...fieldsValue }, { type, eventName: null } )
        delete data.eventId;
      }
      data.rewardType = rewardType1;
      data.startTime = startTime && moment( startTime ).format( 'YYYY-MM-DD HH:mm:ss' );
      data.endTime = endTime && moment( endTime ).format( 'YYYY-MM-DD HH:mm:ss' );
      if( info && info.rowKey ){
        newList = integralList.map( item => item.rowKey === info.rowKey ? this.deleteNullKey( { ...item, ...data } ) : item )
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
        integralList:new Array( ...Arr ),
        noteValue:'',
        nameValue:'',
        name:'',
        type,
        rewardType1
      }, ()=>{
        this.fetchEventList();
        this.onPreview()
      } );
    } );
  };

  // 取消奖品弹窗
  handleCancel = () => {
    this.setState( {
      visible: false,
    } );
  };

  onChange = ( e ) => {
    this.setState( { titleValue: e.target.value }, () => { this.onPreview() } )
  }

  onChangePreview = () => {
    this.onPreview();
  }

  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visiblePopupBackgroundColor: false,
      visiblePopupTitleColor: false,
    } )
  }

  // 显示调色板
  showButtonColor=( type )=>{
    this.setState( {
      [`${type}`]: true
    }, ()=>{this.onPreview()} )
  }

  // 颜色变更
  buttonColorChange = ( e, type ) => {
    const color = e.hex;
    this.setState( { [`${type}`]: color }, () => {
      this.onPreview()
    } )
  }

  // 表单提交
  handleSubmit = () => {
    const { form } = this.props;
    let data;
    let isError = true;
    form.validateFields( ( err ) => {
      data = this.getValues();
      if ( err ) {
        isError = false;
        message.error( '请在积分设置中填入必填项' );
      }
    } );
    return  isError && data;
  }


  render() {
    const { integralList, visible, info = {}, nameValue, noteValue, eventList, rewardType1, type, titleValue, integralPopupTitleColor, visiblePopupTitleColor, integralPopupBackgroundColor, visiblePopupBackgroundColor } = this.state;
    const { form: { getFieldDecorator, getFieldValue }, showTaskType, data = {} } = this.props;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>任务名称</span>,
        dataIndex: 'name',
      },
      {
        title: <span>事件名称</span>,
        dataIndex: 'eventName',
        render:( eventName ) => {
          return <span>{eventName || '--'}</span>
        }
      },
      {
        title: <span>任务奖励</span>,
        dataIndex: 'rewardType',
        align: 'center',
        render:( id, item )=>{
          const{ rewardType, rewardCount } = item;
          if( rewardType && rewardCount !== undefined ) return <span>{`活动分数${rewardCount}${rewardTypeObj[rewardType]}`}</span>
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
        title: <span>排序值</span>,
        dataIndex: 'sort',
        key: 'sort',
        render: sort => <span>{sort !== undefined ? sort : '--'}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item ) => (
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
    ];

    return (
      <GridContent>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visiblePopupBackgroundColor || visiblePopupTitleColor )} />
        <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
          <FormItem label='初始化分数' {...this.formLayout}>
            {getFieldDecorator( 'attendOriginCount', {
              rules: [
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.integralTaskGroup && data.integralTaskGroup.attendOriginCount || null
            } )( <Input
              onChange={this.onChangePreview}
              placeholder='请输入初始化积分，最大值是99999'
              min={0}
              max={999999}
              addonAfter='分'
              type='number'
            /> )}
          </FormItem>

          <FormItem label='每日免费分数' {...this.formLayout}>
            {getFieldDecorator( 'attendDailyFreeCount', {
              rules: [
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.integralTaskGroup && data.integralTaskGroup.attendDailyFreeCount || null
            } )( <Input
              onChange={this.onChangePreview}
              placeholder='请输入每日免费积分，最大值是99999'
              min={0}
              max={999999}
              addonAfter='分'
              type='number'
            /> )}
          </FormItem>
          <p style={{ color: '#D1261B', fontSize: 12 }}>（选填）对任务进行设置，用户完成任务可以获得积分</p>
          <FormItem label='任务' {...this.formLayout}>
            {getFieldDecorator( 'integralShowTask', {
              rules: [{ required: true, message: '请选择任务状态' }, ],
              initialValue: data.integralShowTask || 'NONE',
            } )(
              <Radio.Group onChange={this.onChangePreview}>
                <Radio value='NONE'>不展示</Radio>
                {/* <Radio value='POPUP'>弹窗</Radio> */}
                <Radio value='LIST'>平铺</Radio>
                {/* <Radio value='BIG_IMAGE'>图片</Radio> */}
              </Radio.Group>
            )}
          </FormItem>
          {
            ( getFieldValue( 'integralShowTask' ) === 'POPUP' || getFieldValue( 'integralShowTask' ) === 'LIST' ) &&
            <div>
              {
                getFieldValue( 'integralShowTask' ) !== 'LIST' &&
                <FormItem label='任务按钮' {...this.formLayout}>
                  {getFieldDecorator( 'integralTaskButton', {
                    rules: [{ required: true, message: '请上传任务按钮图片' }],
                    initialValue: data.integralTaskButton || '',
                  } )( <UploadImg onChange={this.imgChang} /> )}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0, left: '125px',
                      width: '180px',
                      fontSize: 13,
                      color: '#999',
                      lineHeight: 2,
                      marginTop: '10px'
                    }}
                  >
                    <div>格式：jpg/jpeg/png </div>
                    <div>建议尺寸：80px*80px </div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
              }


              <FormItem label='任务弹窗标题' {...this.formLayout}>
                {getFieldDecorator( 'integralTaskTitle', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务弹窗标题` }, ],
                  initialValue: data.integralTaskTitle || titleValue,
                } )( <Input placeholder='请输入任务弹窗标题' maxLength={10} onChange={( e ) => this.onChange( e )} /> )}
                <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{titleValue.length}/10</span>
              </FormItem>

              <div style={{ display: 'flex', alignItems: 'center', height: '40px', marginBottom: '24px' }}>
                <div style={{ width: '16.6666%', textAlign: 'right', color: 'rgba( 0, 0, 0, 0.85 )' }}>
                  标题色值：
                </div>
                <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -23, padding: 10, border: '1px solid #f5f5f5', cursor: 'pointer' }} onClick={() => { this.showButtonColor( 'visiblePopupTitleColor' ) }}>
                    <div style={{ background: integralPopupTitleColor, width: 116, height: 32 }} />
                  </div>
                  {
                    visiblePopupTitleColor &&
                    <FormItem
                      style={{ position: 'absolute', top: -50, left: 200, zIndex: 999 }}
                    >
                      {getFieldDecorator( 'integralPopupTitleColor', {
                        rules: [{
                          required: true, message: `${formatMessage( { id: 'form.input' } )}标题色值`
                        }],
                        initialValue: data.integralPopupTitleColor || integralPopupTitleColor,
                      } )(
                        <SketchPicker
                          width="230px"
                          color={integralPopupTitleColor}
                          disableAlpha
                          onChange={( e ) => this.buttonColorChange( e, 'integralPopupTitleColor' )}
                        />
                      )}
                    </FormItem>
                  }
                </div>
              </div>
              {
                getFieldValue( 'integralShowTask' ) !== 'LIST' &&
                <div style={{ display: 'flex', padding: '30px 0 50px 13%', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    弹窗背景色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, padding: 10, border: '1px solid #f5f5f5', cursor: 'pointer' }} onClick={() => { this.showButtonColor( 'visiblePopupBackgroundColor' ) }}>
                      <div style={{ background: integralPopupBackgroundColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visiblePopupBackgroundColor &&
                      <FormItem
                        style={{ position: 'absolute', bottom: -120, left: 200, zIndex: 999 }}
                      >
                        {getFieldDecorator( 'integralPopupBackgroundColor', {
                          rules: [{
                            required: true, message: `${formatMessage( { id: 'form.input' } )}背景色值`
                          }],
                          initialValue: data.integralPopupBackgroundColor || integralPopupBackgroundColor,
                        } )(
                          <SketchPicker
                            width="230px"
                            color={integralPopupBackgroundColor}
                            disableAlpha
                            onChange={( e ) => this.buttonColorChange( e, 'integralPopupBackgroundColor' )}
                          />
                        )}
                      </FormItem>
                    }
                  </div>
                </div>
              }

            </div>
          }
        </Form>
        <Alert
          style={{ margin: '20px 0 15px 0' }}
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
          dataSource={integralList}
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
          <IntegralModal
            nameValue={nameValue}
            noteValue={noteValue}
            eventList={eventList}
            rewardType1={rewardType1}
            type={type}
            info={info}
            showTaskType={showTaskType}
            wrappedComponentRef={( form ) => { this.formRef = form }}
            onPreview={this.onPreview}
          />
        </Modal>
      </GridContent>
    )
  }
}

export default Integral;

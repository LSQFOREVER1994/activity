import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Alert, DatePicker, Radio, Row, Col, message } from 'antd';
import moment from 'moment';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

let Timer;
@connect()
@Form.create()
class BasicModal extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      data: props.data,
      nameValue:props.data.name || '',
      ruleValue:props.data.ruleImg || '',
      tipSendSuccessValue:'',
    }
  }

  componentDidMount() {
    this.props.onRef( this )
  }


  getValues = () =>{
    const { form } = this.props;
    const data = form.getFieldsValue()
    return this.dealData( data )
  }

  //  校验表单
  getHaveError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        haveError = true;
      }
      const { userAttendCount, userDayMaxCount, isShowAttendCount } = fieldsValue;
      if( isShowAttendCount ){
        if( !userAttendCount || !userDayMaxCount ){
          message.error( '未填写次数，请选择次数不展示' )
          haveError = true
        }
      }

      if( +userAttendCount < +userDayMaxCount ){
        haveError = true;
        message.error( '总参与次数需大于每日参与次数' )
      }
    } );

    return haveError;
  };

  // 刷新预览数据
  onPreview = () => {
    this.props.onPreview()
  };


  // 名称活动
  nameChange = ( e ) =>{
    this.setState( { nameValue:e.target.value } )
  }

  onPerChange = () => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
  }


  // 弹幕发送成功文案
  tipSendSuccessChange = ( e ) =>{
    this.setState( { tipSendSuccessValue:e.target.value } )
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
  }

  // 表单验证
  basicHandleSubmit = () => {
    const {  form } = this.props;
    let data = {}
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false;
        message.error( '请在基础设置里面输入必填项' )
        return
      }
      const params = this.dealData ( fieldsValue );
      data = params
    } );
    return  isError && data;
  };

  // 数据整理
  dealData = ( fieldsValue ) => {
    const params = fieldsValue;
    const { rangeTime } = fieldsValue;
    params.startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    params.endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    delete params.rangeTime
    return params
  }


  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { data, nameValue, ruleValue, tipSendSuccessValue } = this.state;
    return (
      <div>
        <Form layout='horizontal' className={styles.formHeight} onSubmit={this.basicHandleSubmit}>
          <Title title='基本信息' />
          <FormItem label='活动名称' {...this.formLayout}>
            {getFieldDecorator( 'name', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动名称` }],
            initialValue: data.name,
            } )( <Input
              placeholder={`${formatMessage( { id: 'form.input' } )}活动名称`}
              maxLength={20}
              onChange={this.nameChange}
              suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{nameValue.length}/20</span>}

            /> )}
          </FormItem>
          <FormItem label='活动规则' {...this.formLayout}>
            {getFieldDecorator( 'ruleImg', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动规则` }],
              initialValue: data.ruleImg,
            } )( <TextArea
              rows={4}
              onChange={this.onPerChange}
              placeholder='请输入活动规则'
              className={styles.collect_edit_rule}
            /> )}
          </FormItem>
          <FormItem label='活动时间' {...this.formLayout}>
            {getFieldDecorator( 'rangeTime', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
            initialValue: data.startTime ? [moment( data.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( data.endTime, 'YYYY-MM-DD HH:mm:ss' )] :[],
          } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.onPerChange} /> )}
          </FormItem>
          <FormItem label='参与人数基数' {...this.formLayout}>
            {getFieldDecorator( 'baseCount', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}参与人数基数` }],
              initialValue: data.baseCount || '',
            } )( <Input
              onChange={this.onPerChange}
              placeholder='可输入人数基数'
              precision={0}
              min={0}
              addonAfter='人'
              type='number'
            /> )}
          </FormItem>
          <FormItem label='发送成功文案' {...this.formLayout}>
            {getFieldDecorator( 'tipSendSuccess', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}发送成功弹框文案` }],
                initialValue: data.tipSendSuccess,
                } )( <Input
                  placeholder='可输入弹窗文案，不填则显示用户所发弹幕'
                  maxLength={20}
                  onChange={this.tipSendSuccessChange}
                  suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipSendSuccessValue.length}/20</span>}
                /> )}
          </FormItem>
          <FormItem label='活动状态' {...this.formLayout}>
            {getFieldDecorator( 'isSale', {
              rules: [{ required: true, } ],
              initialValue: data.isSale===undefined ? 'true' : data.isSale.toString()
            } )(
              <Radio.Group disabled={!data.id}>
                <Radio value="true">启用</Radio>
                <Radio value="false">禁用</Radio>
              </Radio.Group>
            )}
            <span style={{ fontSize:12, marginLeft:'20px' }}>*选择禁用时，活动页面将无法访问</span>
          </FormItem>

          <Title title='高级选项' />
          <FormItem
            style={{ paddingTop: 20 }}
            extra={( <div>*埋点统计用于记录用户参与活动、查看我的奖品、查看活动规则、完成任务等数据</div> )}
            label='埋点统计'
            {...this.formLayout}
          > <Alert
            style={{ position:'absolute', top: -40, width:'100%' }}
            className={styles.edit_alert}
            message={(
              <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <span>埋点统计需要先添加关联活动并创建appid</span>
                <u style={{ color: '#1890FF', cursor:'pointer' }} onClick={() => { window.open( `${window.location.origin}/statistics/app` )}}>数据运营-埋点统计</u>
              </div> )}
            banner
          />
            {getFieldDecorator( 'buryPointId', {
              initialValue: data.buryPointId,
            } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}活动对应的appid，用于统计活动参与人数`} /> )}
          </FormItem>
        </Form>
      </div>

    );
  }
}

export default BasicModal;

const Title = ( { title } ) =>
  (
    <Row>
      <Col
        span={4}
        style={{
          fontWeight: 'bold',
          textAlign: 'right',
          paddingRight: 10,
          fontSize: 16,
          marginBottom:20
        }}
      >
        {title}
      </Col>
    </Row>
  )

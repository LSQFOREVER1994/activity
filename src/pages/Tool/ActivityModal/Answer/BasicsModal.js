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
      // isNeedLogin:props.data.isNeedLogin === undefined ? true : props.data.isNeedLogin,
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

  nameChange = ( e ) =>{
    this.setState( { nameValue:e.target.value } )
  }

  //  校验表单
  getHaveError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        haveError = true;
      }
    } );
    return haveError;
  };

  onPreview = () => {
    this.props.onPreview()
  };

  // loginChange = ( e )=>{
  //   this.setState( { isNeedLogin:e.target.value }, ()=>this.onChangePreview() )
  // }

  onChangePreview =()=>{
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
  }

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
      params.isNeedLogin=true;
      data = params
    } );
    return  isError && data;
  };

  dealData = ( fieldsValue ) => {
    const params = fieldsValue;
    const { rangeTime } = fieldsValue;
    params.startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    params.endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    delete params.rangeTime
    return params
  }

  // 拿取表单中积分规则的数据处理
  getFromRule = () => {
    const { form } = this.props;
    const data = form.getFieldsValue()
    const { baseScore, addScore, reduceScore } = data;
    if( baseScore && addScore && reduceScore )return false
    return true
  }


  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { data, nameValue } = this.state;

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
              onChange={this.onChangePreview}
              placeholder='请输入活动规则'
              className={styles.collect_edit_rule}
            /> )}
          </FormItem>
          <FormItem label='活动时间' {...this.formLayout}>
            {getFieldDecorator( 'rangeTime', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
            initialValue: data.startTime ? [moment( data.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( data.endTime, 'YYYY-MM-DD HH:mm:ss' )] :[],
          } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
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
          {/* <FormItem label='参与用户登录' {...this.formLayout}>
            {getFieldDecorator( 'isNeedLogin', {
              rules: [{ required: true, } ],
              initialValue: data.isNeedLogin || isNeedLogin
            } )(
              <Radio.Group onChange={this.loginChange}>
                <Radio value>登录</Radio>
                <Radio value={false}>不登录</Radio>
              </Radio.Group>
            )}
            <span style={{ fontSize:12, marginLeft:'20px' }}>*需要配置奖品抽奖时，必须为登录参与</span>
          </FormItem> */}

          {/* {
           isNeedLogin &&
           <div> */}
          <FormItem label='初始化次数' {...this.formLayout}>
            {getFieldDecorator( 'attendOriginCount', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}初始化次数` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.attendOriginCount
            } )( <Input
              onChange={this.onChangePreview}
              placeholder='请输入初始化次数，最大值是99999'
              min={0}
              max={999999}
              addonAfter='次'
              type='number'
            /> )}
          </FormItem>

          <FormItem label='每日免费次数' {...this.formLayout}>
            {getFieldDecorator( 'userDayMaxCount', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}每日免费次数` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.userDayMaxCount
            } )( <Input
              onChange={this.onChangePreview}
              placeholder='请输入每日免费次数，最大值是99999'
              min={0}
              max={999999}
              addonAfter='次'
              type='number'
            /> )}
          </FormItem>
          {/* </div>
          } */}

          <FormItem label='参与次数展示' {...this.formLayout}>
            {getFieldDecorator( 'isShowAttendCount', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}参与次数展示` }],
              initialValue:data.isShowAttendCount === undefined ? true : data.isShowAttendCount
            } )(
              <Radio.Group onChange={this.onChangePreview}>
                <Radio value>展示</Radio>
                <Radio value={false}>不展示</Radio>
              </Radio.Group>
              )}
          </FormItem>

          <FormItem label='每题答题时间' {...this.formLayout}>
            {getFieldDecorator( 'answerTime', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}每题答题时间` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.answerTime,
            } )( <Input
              onChange={this.onChangePreview}
              placeholder='可设置每题作答时间，不填则不限答题时间'
              min={0}
              addonAfter='秒'
              type='number'
            /> )}
          </FormItem>

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

          <Title title='积分规则' />
          <FormItem label='基础积分' {...this.formLayout}>
            {getFieldDecorator( 'baseScore', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}基础积分` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.baseScore,
            } )( <Input
              placeholder='在基础积分上，根据答题情况加减分数'
              precision={0}
              min={0}
              addonAfter='分'
              type='number'
            /> )}
          </FormItem>
          <FormItem label='答对增加分值' {...this.formLayout}>
            {getFieldDecorator( 'addScore', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}答对增加分值` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.addScore,
            } )( <Input
              placeholder='设置每答对一题增加的分值'
              precision={0}
              min={0}
              addonAfter='分'
              type='number'
            /> )}
          </FormItem>
          <FormItem label='答错扣减分值' {...this.formLayout}>
            {getFieldDecorator( 'reduceScore', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}答错扣减分值` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.reduceScore,
            } )( <Input
              placeholder='设置每答错一题减扣的分值'
              precision={0}
              min={0}
              addonAfter='分'
              type='number'
            /> )}
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
      {
        title === '积分规则' &&
        <p style={{ fontSize:13, color:'#df0606', marginTop:3 }}>用于积分排名，设置答题对错所增减的积分数和基础积分</p>
      }
    </Row>
  )

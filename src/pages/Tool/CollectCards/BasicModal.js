import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Alert, DatePicker, message, Radio, Row, Col } from 'antd';
import moment from 'moment';
import serviceObj from '@/services/serviceObj';
import styles from '../Lists.less';

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

  openWindow = () =>{
    window.open( `${window.location.origin}/statistics/app` )
  }

  onChange = ( e ) => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 1000 );
  }

  basicHandleSubmit = () => {
    const {  form } = this.props;
    let data = {}
    let noError = true;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ){
        noError = false
        return ;
      }
      const params = this.dealData ( fieldsValue );
      if ( moment( params.endTime ).millisecond( Number ) > moment( params.lotteryStartTime ).millisecond( Number ) ) {
        message.error( '抽奖时间天数不可在活动时间内' );
        noError = false
        return ;
      }
      data = params

    } );
    return noError  &&  data;
  };

  dealData = ( fieldsValue ) => {
    const params = fieldsValue;
    const { rangeTime, lotteryTime } = fieldsValue;
    params.startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    params.endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    params.lotteryStartTime = ( lotteryTime && lotteryTime.length ) ? moment( lotteryTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    params.lotteryEndTime = ( lotteryTime && lotteryTime.length ) ? moment( lotteryTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    delete params.rangeTime;
    delete params.lotteryTime;
    return params
  }



  render() {
    const { form: { getFieldDecorator }, currentId } = this.props;
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
              onChange={this.onChange}
              placeholder='请输入活动规则'
              className={styles.collect_edit_rule}
            /> )}
          </FormItem>
          <FormItem
            style={{ marginBottom: 10 }}
            extra="*集卡结束时间需早于抽奖开始时间"
            label='集卡时间'
            {...this.formLayout}
          >
            {getFieldDecorator( 'rangeTime', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
            initialValue: data.startTime ? [moment( data.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( data.endTime, 'YYYY-MM-DD HH:mm:ss' )] :[],
          } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
          </FormItem>

          <FormItem
            style={{ marginBottom:10 }}
            extra="*抽奖开始时间需紧接在集卡时间之后"
            label="抽奖时间"
            {...this.formLayout}
          >
            {getFieldDecorator( 'lotteryTime', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
            initialValue: data.lotteryStartTime ? [moment( data.lotteryStartTime, 'YYYY-MM-DD HH:mm:ss' ), moment( data.lotteryStartTime, 'YYYY-MM-DD HH:mm:ss' )] :[],
          } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
          </FormItem>
          <FormItem
            label='活动状态'
            extra="*选择禁用时，活动页面将无法访问"
            {...this.formLayout}
          >
            {getFieldDecorator( 'isSale', {
              rules: [{ required: true, }],
              initialValue: data.isSale===undefined ? 'true' : data.isSale.toString()
            } )(
              <Radio.Group disabled={!currentId}>
                <Radio value="true">启用</Radio>
                <Radio value="false">禁用</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          {/* <FormItem label='资源位文案' {...this.formLayout}>
            {getFieldDecorator( 'resourceText', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}资源位文案` }],
            initialValue: collectCardsSpecsObj.resourceText,
          } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}资源位文案`} /> )}
          </FormItem>

          <FormItem label='资源位链接' {...this.formLayout}>
            {getFieldDecorator( 'resourceLink', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}资源位链接` }],
            initialValue: collectCardsSpecsObj.resourceLink,
          } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}资源位链接`} /> )}
          </FormItem> */}

          {/* <FormItem label='用户每日可参与' {...this.formLayout}>
            {getFieldDecorator( 'userDayMaxCount', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}数量` }],
              initialValue: collectCardsSpecsObj.userDayMaxCount,
            } )( <InputNumber placeholder='数量' precision={0} min={0} style={{ width:150 }} /> )}
          </FormItem> */}

          <Title title='高级选项' />
          <FormItem
            style={{ marginBottom:40 }}
            label='今日免费抽卡次数'
            {...this.formLayout}
          >
            {getFieldDecorator( 'userDayMaxCount', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}今日免费抽卡次数` }],
              initialValue: data.userDayMaxCount,
            } )( <Input
              placeholder='请输入用户每日可以进行抽卡的初始次数'
              precision={0}
              min={0}
              addonAfter='次'
            /> )}
          </FormItem>
          <FormItem
            style={{ paddingTop: 10 }}
            extra={( <div>*埋点统计用于记录用户参与活动、查看我的奖品、查看活动规则、完成任务等数据</div> )}
            label='埋点统计'
            {...this.formLayout}
          > <Alert
            style={{ position:'absolute', top: -40, width:'100%' }}
            className={styles.edit_alert}
            message={(
              <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <span>埋点统计需要先添加关联活动并创建appid</span>
                <u style={{ color: '#1890FF', cursor:'pointer' }} onClick={this.openWindow}>数据运营-埋点统计</u>
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

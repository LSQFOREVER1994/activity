import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, DatePicker, Radio, Row, Col, message } from 'antd';
import moment from 'moment';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
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
      nameValue: props.data.name || '',
    }
  }

  componentDidMount() {
    this.props.onRef( this )
  }

  getValues = () => {
    const { form } = this.props;
    const data = form.getFieldsValue()
    return this.dealData( data )
  }

  nameChange = ( e ) => {
    this.setState( { nameValue: e.target.value } )
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

  onChange = ( e ) => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 1000 );
  }

  onChangeUserDayMaxCount = () => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
  }

  onChangeUserAttendCount = () => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
  }

  basicHandleSubmit = () => {
    const { form } = this.props;
    let data = {}
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false;
        message.error( '请在基础设置里面输入必填项' )
        return
      }
      const params = this.dealData( fieldsValue );
      data = params
    } );
    return isError && data;
  };

  dealData = ( fieldsValue ) => {
    const params = fieldsValue;
    const { rangeTime } = fieldsValue;
    params.startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm' ) : '';
    params.endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm' ) : '';
    delete params.rangeTime
    return params
  }

  // 抽奖状态展示 
  showState = ( val ) => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
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
          <FormItem label='活动时间' {...this.formLayout}>
            {getFieldDecorator( 'rangeTime', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
              initialValue: data.startTime ? [moment( data.startTime, 'YYYY-MM-DD HH:mm' ), moment( data.endTime, 'YYYY-MM-DD HH:mm' )] : [],
            } )( <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" /> )}
          </FormItem>
          <FormItem label='活动状态' {...this.formLayout}>
            {getFieldDecorator( 'isSale', {
              rules: [{ required: true, }],
              initialValue: data.isSale === undefined ? true : data.isSale
            } )(
              <Radio.Group disabled={!data.id}>
                <Radio value>启用</Radio>
                <Radio value={false}>禁用</Radio>
              </Radio.Group>
            )}
            <span style={{ fontSize: 12, marginLeft: '20px' }}>*选择禁用时，活动页面将无法访问</span>
          </FormItem>

          <Title title='高级选项' />
          <FormItem label='初始化次数' {...this.formLayout}>
            {getFieldDecorator( 'attendOriginCount', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}初始化次数` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.attendOriginCount
            } )( <Input
              onChange={this.onChangeUserDayMaxCount}
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
              onChange={this.onChangeUserDayMaxCount}
              placeholder='请输入每日免费次数，最大值是99999' 
              min={0} 
              max={999999}
              addonAfter='次'
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
          marginBottom: 20
        }}
      >
        {title}
      </Col>
    </Row>
  )

import React, { PureComponent } from 'react';
import { Form, Col, Row, Input, DatePicker, Select, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from '../../Lists.less';

const FormItem = Form.Item;
const { Option } = Select;
@connect()
@Form.create()
class HistoryGains extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      record: props.record,
      type: ( props.record && props.record.type ) || 'MANUAL'
    };
  }


  componentDidMount() {
    this.props.onRef( this )
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.record !== prevState.record ) {
      return {
        record: nextProps.record,
      }
    }
    return null;
  }

  // 获取表单值
  getValues = () => {
    const { form, record } = this.props;
    let data = {};
    form.validateFields( ( err, values ) => {
      const { keys, ...Values } = values
      data = { ...record, ...Values };
    } )
    if( JSON.stringify( data ) === '{}' ) return null;
    return data
  }

  // 表单重置
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState( { record:null } )
  }

  //  校验表单
  getFormError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        haveError = true;
      }
    } );
    return haveError;
  };

  onDelete = () => {    
     this.props.deleteRecord();
  }

  changeType = ( type ) => {
    this.setState( { type } )
    if ( type === 'RANDOM' ){
      this.props.form.setFieldsValue( { triggerTime:undefined } )
    }
  }

  render() {

    const { form: { getFieldDecorator } } = this.props;
    const { record, type } = this.state;
    
    getFieldDecorator( 'key', { initialValue: ( record && record.key ) || '' } )
    return (
      <Row className={styles.form_gains_detail}>
        <Col offset={2} span={4}>

          <FormItem>
            {getFieldDecorator( 'type', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}涨幅` }],
              initialValue: record.type || 'MANUAL',
            } )(
              <Select
                placeholder={`${formatMessage( { id: 'form.select' } )}记录生成方式`}
                onSelect={this.changeType}
              >
                <Option key='MANUAL'>手工生成</Option>
                <Option key='RANDOM'>随机生成</Option>
              </Select>
            )}
          </FormItem>
        </Col>

        <Col span={6}>
          <FormItem>
            {getFieldDecorator( 'triggerTime', {
              rules: [{ required: type ==='MANUAL', message: `${formatMessage( { id: 'form.input' } )}涨幅` }],
              initialValue: record.triggerTime && record.type ==='MANUAL' ? moment( record.triggerTime ) : undefined,
            } )(
              <DatePicker
                showTime 
                disabled={type === 'RANDOM'} 
                placeholder={type === 'RANDOM' ? '系统随机时间' :'请选择购买时间'} 
              />
            )}
          </FormItem>
        </Col>

        <Col span={5}>
          <FormItem>
            {getFieldDecorator( 'username', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}用户${type === 'RANDOM' ? '前缀':'名称'}` }],
              initialValue: record.username || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}用户${type === 'RANDOM' ? '前缀' : '名称'}`} />
            )}
          </FormItem>
        </Col>
       
        <Col span={5}>
          <FormItem>
            {getFieldDecorator( 'productName', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}涨幅` }],
              initialValue: record.productName || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}购买内容`} />
            )}
          </FormItem>
        </Col>
        <Col span={2} style={{ fontSize:20, cursor:'pointer', marginTop:3 }}>
          <Icon type="delete" onClick={this.onDelete} />
        </Col>
      </Row>
    );
  }
}

export default HistoryGains;

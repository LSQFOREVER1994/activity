import React, { PureComponent } from 'react';
import { Form, Col, Row, Input, Icon, DatePicker } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../Lists.less';

const FormItem = Form.Item;
@connect()
@Form.create()
class HistoryGains extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      permission: props.permission,
    };
  }


  componentDidMount() {
    this.props.onRef( this )
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.permission !== prevState.permission ) {
      return {
        permission: nextProps.permission,
      }
    }
    return null;
  }

  // 获取表单值
  getValues = () => {
    const { form, permission } = this.props;
    let data = {};
    form.validateFields( ( err, values ) => {
      const { keys, ...Values } = values
      data = { ...permission, ...Values };
    } )
    if( JSON.stringify( data ) === '{}' ) return null;
    return data
  }

  // 表单重置
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState( { permission:null } )
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
     this.props.deletePermission();
  }

  render() {

    const { form: { getFieldDecorator } } = this.props;
    const { permission } = this.state;
    
    getFieldDecorator( 'key', { initialValue: ( permission && permission.key ) || '' } )
    return (
      <Row className={styles.form_gains_detail}>
        <Col span={7}>
          <FormItem>
            {getFieldDecorator( 'username', {
              rules: [{ required: false }],
              initialValue: permission.username || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}用户手机`} />
            )}
          </FormItem>
        </Col>
        <Col span={7}>
          <FormItem>
            {getFieldDecorator( 'endTime', {
              rules: [{ required: false }],
              initialValue: permission.endTime ? moment( permission.endTime ) : undefined,
            } )(
              <DatePicker 
                placeholder='请选择过期时间'
              />
            )}
          </FormItem>
        </Col>
        <Col span={7}>
          <FormItem>
            {getFieldDecorator( 'comment', {
              rules: [{ required: false }],
              initialValue: permission.comment || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}备注`} />
            )}
          </FormItem>
        </Col>
        <Col offset={1} span={2} style={{ fontSize:20, cursor:'pointer' }}>
          <Icon type="delete" onClick={this.onDelete} />
        </Col>
      </Row>
    );
  }
}

export default HistoryGains;

import React, { PureComponent } from 'react';
import { Form, DatePicker, Input,  Row, Col, Button  } from 'antd';
import { connect } from 'dva';
// import { getUrlParameter } from '@/utils/utils';
import styles from './questionnaire.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;



@connect()
@Form.create()
class FilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  constructor( props ) {
    super( props );
    this.state = {
     
    }; 
  };


  componentDidMount() {
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();

  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  //  提交
  handleSubmit = () => {
    const { form, detail } = this.props;
    let haveError = false
    let data = {};
    form.validateFields( ( err, values ) => {
      if ( err ) {
        haveError = err;
      }
      data = { ...detail, ...values };
    } );
    if ( haveError ) return 'error';
    
    return data;
  };

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
     this.props.deleteDetail();
  }



  render() {
    const { form: { getFieldDecorator }, filterSubmit, routeClickName } = this.props;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label='名称' {...this.formLayout}>
              {getFieldDecorator( 'activityName', {
                initialValue: routeClickName  === null ?  '' : routeClickName,
        } )(
          <Input
            placeholder="名称"
            style={{ width: 220 }}
          /> )}
            </FormItem>
          </Col>
          <Col span={10}>
            
            <FormItem label='时间' {...this.formLayout1}>
              {getFieldDecorator( 'rangeTime', {
        } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem wrapperCol={{ span: 12, offset: 4 }}>
              <div className={styles.button_box}>
                <Button onClick={filterSubmit} type='primary'>搜索</Button>
                <Button onClick={this.formReset} type='primary'>清空</Button>
              </div>
            </FormItem>
          </Col>
        </Row> 
      </Form>
    )}
   
}

export default FilterForm;

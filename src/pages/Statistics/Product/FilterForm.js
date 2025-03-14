
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button  } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect()
@Form.create()
class FilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }

  // 清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={9}>
            <FormItem label='appId' {...this.formLayout}>
              {getFieldDecorator( 'appId', {
            } )(
              <Input
                placeholder="请输入appId"
                style={{ width: 200 }}
              /> )}
            </FormItem>
          </Col>

          <Col span={9}>
            <FormItem label='名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
            } )(
              <Input
                placeholder="请输入名称"
                style={{ width: 200 }}
              /> )}
            </FormItem>
          </Col>  
          <Col span={6}>
            <div style={{ textAlign:'center', marginTop:'4px' }}>
              <Button onClick={filterSubmit} type='primary' style={{ marginRight:15 }}>搜索</Button>
              <Button onClick={this.formReset} type='primary'>清空</Button>
            </div>
          </Col>
        </Row>
 
      </Form>
    )}
   
}

export default FilterForm;
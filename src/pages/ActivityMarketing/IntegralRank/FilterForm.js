import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Button, InputNumber } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};


const formLayout2 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};


@connect()
@Form.create()
class FilterForm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
    }
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
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


  // 清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }


  render() {
    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    return (
      <Form onSubmit={filterSubmit} layout='horizontal'>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label='用户名' {...formLayout2}>
              {getFieldDecorator( 'username', {
              } )(
                <Input
                  placeholder="请输入用户名"
                  style={{ width: 170 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', width:'100%' }}>
                <Button onClick={filterSubmit} type='primary' style={{ marginRight: 15 }}>搜索</Button>
                <Button onClick={this.formReset} type='primary' style={{ marginRight: 15 }}>清空</Button>
              </div>
            </FormItem>
          </Col>
        </Row>

      </Form>
    )
  }

}

export default FilterForm;

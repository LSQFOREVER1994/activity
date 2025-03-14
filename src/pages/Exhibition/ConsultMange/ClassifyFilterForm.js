import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, Select  } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect()
@Form.create()
class ClassifyFilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
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
    const { form: { getFieldDecorator }, filterSubmit, showAddModal } = this.props;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
              } )(
                <Input
                  placeholder="请输入名称"
                  style={{ width: 200 }}
                /> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'isSale', {
                initialValue:""
              } )(
                <Select style={{ width: 200 }}>
                  <Option key="" value=''>全部</Option>
                  <Option value='true'>上架</Option>
                  <Option value='false'>下架</Option>
                </Select>
                )}
            </FormItem>
          </Col>  
          <Col span={8}>
            <div style={{ marginTop:4 }}>
              <Button onClick={filterSubmit} type='primary' style={{ marginRight:15 }}>搜索</Button>
              <Button onClick={this.formReset} style={{ marginRight:15 }}>清空</Button>
              <Button type='primary' onClick={showAddModal}>新增</Button>
            </div>
          </Col>
        </Row>
      </Form>
    )}
   
}

export default ClassifyFilterForm;
import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Row, Col, Button, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect()
@Form.create()
class ConsultFilterForm extends PureComponent {

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
    const { form: { getFieldDecorator }, filterSubmit, delBatch, showAddModal } = this.props;
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
            <FormItem label='发布者' {...this.formLayout}>
              {getFieldDecorator( 'publisher', {
              } )(
                <Input
                  placeholder="请输入发布者"
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
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='发布时间' {...this.formLayout}>
              {getFieldDecorator( 'rangeTime', {
              } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width:270 }} /> )}
            </FormItem>
          </Col>

          <Col span={1} />
          <Col span={12}>
            <div style={{ marginTop:'4px' }}>
              <Button onClick={filterSubmit} type='primary' style={{ marginRight:15 }}>搜索</Button>
              <Button onClick={this.formReset} style={{ marginRight:15 }}>清空</Button>
              <Button onClick={showAddModal} type='primary' style={{ marginRight:15 }}>新增</Button>
              <Button type="danger" onClick={delBatch}>批量删除</Button>
            </div>
          </Col>

        </Row>
 
      </Form>
    )}
   
}

export default ConsultFilterForm;
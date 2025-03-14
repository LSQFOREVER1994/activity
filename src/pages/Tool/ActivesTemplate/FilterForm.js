import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Row, Col, Select, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect()
@Form.create()
class FilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };

  //  获取表单值
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
    const { form: { getFieldDecorator }, filterSubmit, clickAdd } = this.props;
    
    return(
      <Form onSubmit={filterSubmit} layout='horizontal'>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
            } )(
              <Input
                placeholder="请输入名称"
                style={{ width: 220 }}
              /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'state', {
                initialValue: '',
              } )(
                <Select style={{ width: 220 }}>
                  <Option key='' value=''>全部</Option>
                  <Option key='ENABLE' value='ENABLE'>上架</Option>
                  <Option key='DISABLE' value='DISABLE'>下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='结束时间' {...this.formLayout}>
              {getFieldDecorator( 'endTime', {
              } )( <DatePicker showTime style={{ width: 220 }} /> )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='开始时间' {...this.formLayout}>
              {getFieldDecorator( 'startTime', {
              } )( <DatePicker showTime style={{ width: 220 }} /> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <div style={{ width:'100%', marginLeft:'14%', display:'flex' }}>
              <Button onClick={filterSubmit} type='primary'>搜索</Button>
              <Button onClick={clickAdd} type='primary' style={{ margin:'0 30px' }}>新增</Button>
              <Button onClick={this.formReset} type='primary'>清空</Button>
            </div>
          </Col>

        </Row>
        
      </Form>
    )}
   
}

export default FilterForm;

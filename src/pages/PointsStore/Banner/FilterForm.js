import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Row, Col, Select, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect()
@Form.create()
class FilterForm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {  };
  }

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  formLayout1 = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

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
    const { filterSubmit } = this.props
    const { name, shelf, createTime = [] } = this.getValues()
    if ( createTime && createTime.length ) {
      filterSubmit( { name, shelf, beginTime: moment( createTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ), endTime: moment( createTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) } )
    } else {
      filterSubmit( { name, shelf, } )
    }
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

    const { form: { getFieldDecorator } } = this.props;


    return (
      <Form onSubmit={this.handleSubmit} layout='horizontal'>
        <Row>
          <Col span={6}>
            <FormItem label='活动名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
              } )(
                <Input
                  autoComplete='off'
                  placeholder="活动名称"
                /> )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label='活动状态' {...this.formLayout}>
              {getFieldDecorator( 'shelf', {
              } )(
                <Select placeholder='请选择活动状态'>
                  <Option value="">全部</Option>
                  <Option value="1">启用</Option>
                  <Option value="0">关闭</Option>
                </Select>

              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='创建时间' {...this.formLayout1}>
              {getFieldDecorator( 'createTime', {
              } )( <RangePicker
                style={{ width: '100%' }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
              /> )}
            </FormItem>
          </Col>
          <Col span={4} offset={1}>
            <FormItem>
              <Button onClick={this.handleSubmit} style={{ margin:'0 10px' }} type='primary'>搜索</Button>
              <Button onClick={this.formReset} type='primary'>清空</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

}

export default FilterForm;

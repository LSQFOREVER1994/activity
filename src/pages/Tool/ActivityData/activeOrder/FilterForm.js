import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Select,  Row, Col, Button  } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const stateObj = {
  "": formatMessage( { id: 'strategyMall.order.state.all' } ),
  'WAITING_PAY': formatMessage( { id: 'strategyMall.order.WAITING_PAY' } ),
  'INVALID': formatMessage( { id: 'strategyMall.order.INVALID' } ),
  'PAY_SUCCESS': formatMessage( { id: 'strategyMall.order.PAY_SUCCESS' } ),
  'WAITING_DELIVERY': formatMessage( { id: 'strategyMall.order.WAITING_DELIVERY' } ),
  'FINISH': formatMessage( { id: 'strategyMall.order.FINISH' } ),
  'TIME_OUT': formatMessage( { id: 'strategyMall.order.TIME_OUT' } ),
  'REFUNDED': formatMessage( { id: 'strategyMall.order.REFUNDED' } ),
};


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

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }



  render() {
    const { form: { getFieldDecorator }, filterSubmit, handleExport, name } = this.props;

    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='订单号' {...this.formLayout}>
              {getFieldDecorator( 'orderId', {
              } )(
                <Input
                  placeholder="订单号"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='用户名' {...this.formLayout}>
              {getFieldDecorator( 'username', {
              } )(
                <Input
                  placeholder="请输入用户名"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='活动名称' {...this.formLayout}>
              {getFieldDecorator( 'activityName', {
                initialValue:name
              } )(
                <Input
                  disabled={!!name}
                  placeholder="活动名称"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='商品名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
              } )(
                <Input
                  placeholder="商品名称"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
            
          </Col>
          <Col span={8}>
            <FormItem label='订单状态' {...this.formLayout}>
              {getFieldDecorator( 'state', {
                initialValue:''
              } )(
                <Select style={{ width: 220 }} placeholder='订单状态'>
                  <Option value=''>{stateObj['']}</Option>
                  <Option value='WAITING_PAY'>{stateObj.WAITING_PAY}</Option>
                  <Option value='INVALID'>{stateObj.INVALID}</Option>
                  <Option value='PAY_SUCCESS'>{stateObj.PAY_SUCCESS}</Option>
                  <Option value='WAITING_DELIVERY'>{stateObj.WAITING_DELIVERY}</Option>
                  <Option value='FINISH'>{stateObj.FINISH}</Option>
                  <Option value='TIME_OUT'>{stateObj.TIME_OUT}</Option>
                  <Option value='REFUNDED'>{stateObj.REFUNDED}</Option>
                </Select> 
                 )}
            </FormItem>
          </Col>
          <Col span={7} style={{ display:'flex', justifyContent:'center', marginTop:5 }}>
            <Button onClick={filterSubmit} type='primary'>搜索</Button>
            <Button onClick={this.formReset} type='primary' style={{ margin:'0 20px' }}>清空</Button>
            <Button type='primary' onClick={handleExport}>导出</Button>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label='创建时间' {...this.formLayout1}>
              {getFieldDecorator( 'createTime', {
              } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )}
   
}

export default FilterForm;
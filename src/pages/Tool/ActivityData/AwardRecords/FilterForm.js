import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Select,  Row, Col, Button  } from 'antd';
import { connect } from 'dva';
import { activityObj } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const awardStateObj= {
  "": '全部',
  "SENDING": '发送中',
  "SEND_SUCCESS": '发送成功',
  "SEND_FAILED": '发送失败',
}


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
    const { form: { getFieldDecorator }, name, type, filterSubmit, handleExport } = this.props;
    
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='用户名' {...this.formLayout}>
              {getFieldDecorator( 'username', {
              } )(
                <Input
                  placeholder="用户名"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='活动名称' {...this.formLayout}>
              {getFieldDecorator( 'activityName', {
                initialValue: name
              } )(
                <Input
                  disabled={!!name}
                  placeholder="活动名称"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='平台' {...this.formLayout}>
              {getFieldDecorator( 'platform', {
              } )(
                <Input
                  placeholder="平台"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='奖品名称' {...this.formLayout}>
              {getFieldDecorator( 'prizeName', {
              } )(
                <Input
                  placeholder="奖品名称"
                  style={{ width: 220 }}
                /> )}
            </FormItem>
            
          </Col>
          <Col span={8}>
            <FormItem label='活动类型' {...this.formLayout}>
              {getFieldDecorator( 'activityType', {
                initialValue: type,
              } )(
                <Select style={{ width: 220 }} placeholder='活动类型' disabled={!!type}>
                  {
                    Object.keys( activityObj ).map( item =>
                      <Option key={activityObj[item].key}>{activityObj[item].name}</Option>
                    )
                  }
                </Select> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='发奖状态' {...this.formLayout}>
              {getFieldDecorator( 'awardState', {
            } )(
              <Select style={{ width: 220 }} placeholder='发奖状态'>
                <Option value=''>{awardStateObj['']}</Option>
                <Option value='SENDING'>{awardStateObj.SENDING}</Option>
                <Option value='SEND_SUCCESS'>{awardStateObj.SEND_SUCCESS}</Option>
                <Option value='SEND_FAILED'>{awardStateObj.SEND_FAILED}</Option>
              </Select> )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label='发奖时间' {...this.formLayout1}>
              {getFieldDecorator( 'rangeTime', {
              } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
            </FormItem>
          </Col>
          <Col span={5} />
          <Col span={7}>
            <Button onClick={filterSubmit} type='primary'>搜索</Button>
            <Button onClick={this.formReset} type='primary' style={{ margin:'5px 20px' }}>清空</Button>
            <Button type='primary' onClick={handleExport}>导出</Button>
          </Col>
        </Row>
      </Form>
    )}
   
}

export default FilterForm;

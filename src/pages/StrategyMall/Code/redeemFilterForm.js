
import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Row, Col, Button  } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect()
@Form.create()
class RedeemFilterForm extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };


  componentDidMount() {
    // this.props.onRef( this )
  }

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
    const { form: { getFieldDecorator }, filterSubmit, handleExport, clickId } = this.props;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='批次ID' {...this.formLayout}>
              {getFieldDecorator( 'id', {
                initialValue:clickId || ''
              } )(
                <Input
                  placeholder="请选择批次ID"
                  style={{ width: 200 }}
                /> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='兑换码' {...this.formLayout}>
              {getFieldDecorator( 'code', {
              } )(
                <Input
                  placeholder="请输入兑换码"
                  style={{ width: 200 }}
                /> )}
            </FormItem>
          </Col>  
          <Col span={8}>
            <FormItem label='兑换人' {...this.formLayout}>
              {getFieldDecorator( 'username', {
              } )(
                <Input
                  placeholder="请输入兑换人"
                  style={{ width: 200 }}
                /> )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <FormItem label='创建时间' {...this.formLayout1}>
              {getFieldDecorator( 'createTime', {
                  // initialValue:[moment( start ), moment( end )]
              } )( <RangePicker showTime format="YYYY-MM-DD" style={{ width:330 }} getCalendarContainer={triggerNode => triggerNode.parentNode} /> )}
            </FormItem>
          </Col>

          <Col span={3} />
          <Col span={9}>
            <FormItem>
              <div style={{ textAlign:'center' }}>
                <Button onClick={filterSubmit} type='primary' style={{ marginRight:15 }}>搜索</Button>
                <Button onClick={this.formReset} type='primary' style={{ marginRight:15 }}>清空</Button>
                <Button onClick={handleExport} type='primary'>导出</Button>
              </div>
            </FormItem>
          </Col>
        </Row>
 
      </Form>
    )}
   
}

export default RedeemFilterForm;
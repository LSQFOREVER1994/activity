import React, { PureComponent } from 'react';
import { Form, Input,  Row, Col, Button, Select  } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect()
@Form.create()
class BatchFilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  constructor( props ) {
    super( props );
    this.state = {}; 
  };

  componentDidMount() {
    // this.props.onRef( this )
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

    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    
    return(
      <div>
        <Form layout='horizontal' onSubmit={filterSubmit}>
          <Row gutter={24}>
            <Col span={6}>
              <FormItem label='订单单号：' {...this.formLayout}>
                {getFieldDecorator( 'orderNo', {
                } )(
                  <Input
                    placeholder="订单单号"
                    // style={{ width: 230 }}
                  /> )}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label='订单状态：' {...this.formLayout}>
                {getFieldDecorator( 'status', {
              } )(
                <Select 
                  // style={{ width: 230 }} 
                  placeholder="订单状态"
                  // onChange={( val )=>this.getSelectList( val, 'headCompany' )}
                >
                  {/* <Option value="">全部</Option> */}
                  <Option value="0">待付款</Option>
                  <Option value="1">待发货</Option>
                  <Option value="2">待收货</Option>
                  <Option value="3">已完成</Option>
                  <Option value="4">已取消</Option>
                </Select> )}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label='是否支付：' {...this.formLayout}>
                {getFieldDecorator( 'isPay', {
              } )(
                <Select 
                  // style={{ width: 230 }} 
                  placeholder="是否支付"
                  // onChange={( val )=>this.getSelectList( val, 'headCompany' )}
                >
                  {/* <Option value="">全部</Option> */}
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select> )}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem wrapperCol={{ span: 16, offset: 5 }}>
                <div>
                  <Button type='primary' style={{ marginRight:15 }} onClick={filterSubmit}>搜索</Button>
                  <Button onClick={this.formReset} type='primary' style={{ marginRight:15 }}>清空</Button>
                  {/* <Button type='primary' onClick={() => this.showModal()} disabled={!hasSelected} loading={loadingButton}>导出</Button> */}
                </div>
              </FormItem>
            </Col>

          </Row>
        </Form>
      </div>
    )}
   
}

export default BatchFilterForm;

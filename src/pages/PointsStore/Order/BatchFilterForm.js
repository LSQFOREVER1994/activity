import React, { PureComponent } from 'react';
import { Form, Input,  Row, Col, Button, Select  } from 'antd';
import { connect } from 'dva';
import { exportXlsx } from '@/utils/utils';

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
    this.state = {
      isExPLoading: false
    };
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

  // 导出名单
exportRecord = () => {
  const formValue = this.getValues();
  // 拼接参数
  const paramsArray = [];
  /* eslint-disable consistent-return */
  Object.keys( formValue ).forEach( key => {
    if ( formValue[key] || typeof formValue[key] === 'boolean' ) {
      return paramsArray.push( `${key}=${encodeURIComponent( formValue[key] )}` );
    }
  } )

  let ajaxUrl = `orderInfo/export`
  if ( paramsArray && paramsArray.length > 0 ) {
    const paramStr = paramsArray.join( '&' )
    ajaxUrl = `orderInfo/export?${paramStr}`
  }

  this.setState( {
    isExPLoading: true
  }, () => {
    exportXlsx( {
      type: 'jfService',
      uri: ajaxUrl,
      xlsxName: `订单管理列表.xlsx`,
      callBack: () => {
        this.setState( {
          isExPLoading: false
        } )
      }
    } )
  } )
}

  render() {

    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    const { isExPLoading } = this.state
    return(
      <div>
        <Form layout='horizontal' onSubmit={filterSubmit}>
          <Row gutter={24}>
            <Col span={6}>
              <FormItem label='订单单号：' {...this.formLayout}>
                {getFieldDecorator( 'orderNo', {
                } )(
                  <Input
                    autoComplete='off'
                    placeholder="订单单号"
                    // style={{ width: 230 }}
                  /> )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='购买人：' {...this.formLayout}>
                {getFieldDecorator( 'username', {
                } )(
                  <Input
                    autoComplete='off'
                    placeholder="购买人（手机号）"
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
                  <Option value="">全部</Option>
                  {/* <Option value="0">待付款</Option> */}
                  <Option value="1">待发货</Option>
                  <Option value="2">待收货</Option>
                  <Option value="3">已完成</Option>
                  {/* <Option value="4">已取消</Option> */}
                  {/* <Option value="5">退货中</Option> */}
                  <Option value="6">已退货</Option>
                  {/* <Option value="7">订单回退</Option> */}
                </Select> )}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem>
                <div>
                  <Button type='primary' style={{ marginRight:15 }} onClick={filterSubmit}>搜索</Button>
                  <Button onClick={this.formReset} type='primary' style={{ marginRight:15 }}>清空</Button>
                  <Button onClick={this.exportRecord} type='primary' loading={isExPLoading}>导出列表</Button>
                </div>
              </FormItem>
            </Col>

          </Row>
        </Form>
      </div>
    )}

}

export default BatchFilterForm;

import React, { PureComponent } from 'react';
import { Form, Input,  Row, Col, Button, Select, DatePicker  } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@connect()
@Form.create()
class BatchFilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
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

  render() {

    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    return(
      <div>
        <Form layout='horizontal' onSubmit={filterSubmit}>
          <Row>
            <Col span={5}>
              <FormItem label='商品分类：' {...this.formLayout}>
                {getFieldDecorator( 'name', {
              } )(
                <Input
                  autoComplete='off'
                  placeholder="商品分类"
                /> )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label='是否上架：' {...this.formLayout}>
                {getFieldDecorator( 'state', {
              } )(
                <Select
                  // style={{ width: 230 }}
                  placeholder="是否上架"
                  // onChange={( val )=>this.getSelectList( val, 'headCompany' )}
                >
                  <Option value="">全部</Option>
                  <Option value={`${true}`}>上架</Option>
                  <Option value={`${false}`}>下架</Option>
                </Select> )}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem label='创建时间：' {...this.formLayout1}>
                {getFieldDecorator( 'createTime', {
              } )(
                <RangePicker showTime style={{ width: '100%' }} />
                 )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
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

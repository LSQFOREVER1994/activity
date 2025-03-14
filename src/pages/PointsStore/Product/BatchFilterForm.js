import React, { PureComponent } from 'react';
import { Form, Input,  Row, Col, Button, Select  } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const productObj = {
  '0': '实物',
  '1':'虚拟卡券',
  '2':'话费(手机号直充)',
};

@connect()
@Form.create()
class BatchFilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
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

    const { form: { getFieldDecorator }, filterSubmit, codeList } = this.props;
    console.log( 'cscd', productObj );
    return(
      <div>
        <Form layout='horizontal' onSubmit={filterSubmit}>
          <Row>
            <Col span={5}>
              <FormItem label='商品名称：' {...this.formLayout}>
                {getFieldDecorator( 'name', {
                } )(
                  <Input
                    autoComplete='off'
                    placeholder="商品名称"
                    // style={{ width: 230 }}
                  /> )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label='商品类型：' {...this.formLayout}>
                {getFieldDecorator( 'goodsType', {
              } )(
                <Select
                  // style={{ width: 230 }}
                  placeholder="请选择商品类型"
                  // onChange={( val )=>this.getSelectList( val, 'headCompany' )}
                >
                  <Option value="">全部</Option>
                  {
                    Object.keys( productObj ).map( ( key ) =>(
                      <Option key={key} value={key} name={productObj[key]}>{productObj[key]}</Option>
                    ) )
                  }
                </Select> )}
              </FormItem>
            </Col>
            {/*
            <Col span={5}>
              <FormItem label='供应商：' {...this.formLayout}>
                {getFieldDecorator( 'supplier', {
              } )(
                <Input
                  placeholder="供应商"
                  // style={{ width: 230 }}
                /> )}
              </FormItem>
            </Col> */}

            <Col span={5}>
              <FormItem label='是否上架：' {...this.formLayout}>
                {getFieldDecorator( 'shelf', {
              } )(
                <Select
                  // style={{ width: 230 }}
                  placeholder="是否上架"
                  // onChange={( val )=>this.getSelectList( val, 'headCompany' )}
                >
                  <Option value="">全部</Option>
                  <Option value="0">下架</Option>
                  <Option value="1">上架</Option>
                </Select> )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label='商品分类：' {...this.formLayout}>
                {getFieldDecorator( 'categoryFirst', {
              } )(
                <Select
                  // style={{ width: 230 }}
                  placeholder="请选择商品分类"
                  // onChange={( val )=>this.getSelectList( val, 'headCompany' )}
                >
                  <Option value="">全部</Option>
                  {
                    codeList && codeList.map( ( item )=><Option key={item.id} value={item.id}>{item.name}</Option> )
                  }
                </Select> )}
              </FormItem>
            </Col>

            <Col span={4}>
              <FormItem>
                <div>
                  <Button type='primary' style={{ margin: '0 15px' }} onClick={filterSubmit}>搜索</Button>
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

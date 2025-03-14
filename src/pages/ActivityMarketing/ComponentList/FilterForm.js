import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Select, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};


@connect()
@Form.create()
class FilterForm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {}
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
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


  // 清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }


  // 导出名单
  exportRecord = ()=>{

  }

  render() {
    const { form: { getFieldDecorator }, filterSubmit, componentType } = this.props;
    return (
      <Form onSubmit={filterSubmit} layout='horizontal'>
        <Row gutter={24}>
          <Col span={8} />
          <Col span={6}>
            <FormItem label='组件名称' {...formLayout}>
              {getFieldDecorator( 'name', {
              } )(
                <Input
                  placeholder="请输入组件名称"
                  style={{ width: 170 }}
                  maxLength={100}
                />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='组件分类' {...formLayout}>
              {getFieldDecorator( 'groupType', {
                initialValue: ''
              } )(
                <Select style={{ width: 150 }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                  <Option value=''>全部</Option>
                  {
                    Object.keys( componentType ).map( ( item ) => (
                      <Option value={item} key={item}>{componentType[item]}</Option>
                    ) )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', width:'100%' }}>
                <Button onClick={filterSubmit} type='primary' style={{ marginRight: 15 }}>搜索</Button>
                <Button onClick={this.formReset} type='primary' style={{ marginRight: 15 }}>清空</Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

}

export default FilterForm;

import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Select, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;


@connect()
@Form.create()
class FilterForm extends PureComponent {

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

  onDelete = () => {
     this.props.deleteDetail();
  }

  // 清空
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
  }


  render() {
    const { form: { getFieldDecorator }, filterSubmit, activityObj } = this.props;
    return(
      <Form onSubmit={filterSubmit} layout="inline">
        <FormItem label='活动类型'>
          {getFieldDecorator( 'type', {
          initialValue: ''
        } )(
          <Select style={{ width: 150 }}>
            <Option key={undefined} value=''>全部</Option>
            {
              Object.keys( activityObj ).map( item =>
                <Option key={activityObj[item].key}>{activityObj[item].name}</Option>
               )
            }
          </Select>
        )}
        </FormItem>

        <FormItem label='名称'>
          {getFieldDecorator( 'name', {
        } )(
          <Input
            placeholder="活动名称"
            style={{ width: 170 }}
          />
        )}
        </FormItem>

        <FormItem label='时间'>
          {getFieldDecorator( 'rangeTime', {
        } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width:250 }} /> )}
        </FormItem>

        <Button
          type="primary"
          style={{  marginLeft:15, marginRight:10, marginTop:4 }}
          onClick={filterSubmit}
        >搜索
        </Button>
        <Button
          type="primary"
          style={{ marginTop:4 }}
          onClick={this.formReset}
        >清空
        </Button>
      </Form>
    )}

}

export default FilterForm;

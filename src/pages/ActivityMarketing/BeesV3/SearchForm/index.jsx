import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { getValue, activityStates } from '../BeesEnumes';

const FormItem = Form.Item;
const { Option } = Select;
function SearchForm( props, ref ) {
  const {
    handleSearch,
    form: { getFieldDecorator, resetFields, getFieldsValue },
  } = props;
  useImperativeHandle( ref, () => ( {
    getSearchValue:getFieldsValue
  } ) )
  // 清空
  const formReset = () => {
    resetFields();
  };
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <Form onSubmit={handleSearch} layout="inline">
      <FormItem label="名称">
        {getFieldDecorator(
          'name',
          {}
        )( <Input placeholder="活动名称" style={{ width: 170 }} maxLength={60} /> )}
      </FormItem>

      <FormItem label="活动状态">
        {getFieldDecorator( 'state', {
          initialValue: '',
        } )(
          <Select style={{ width: 150 }}>
            <Option value="">全部</Option>
            <Option value="ENABLE">{getValue( activityStates, 'ENABLE' )}</Option>
            <Option value="DISABLE">{getValue( activityStates, 'DISABLE' )}</Option>
            <Option value="PAUSE">{getValue( activityStates, 'PAUSE' )}</Option>
          </Select>
        )}
      </FormItem>

      <Button
        type="primary"
        style={{ marginLeft: 15, marginRight: 10, marginTop: 4 }}
        htmlType="submit"
      >
        搜索
      </Button>
      <Button type="primary" style={{ marginTop: 4 }} onClick={formReset}>
        清空
      </Button>
    </Form>
  );
}
export default Form.create( { name: 'SearchForm' } )( forwardRef( SearchForm ) );

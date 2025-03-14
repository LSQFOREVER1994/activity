
import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Row, Col, Button, Radio, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@connect()
@Form.create()
class FilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
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

  //  获取课程名称
  getCourseName = ( tagsId ) => {
    const { tagsListResult: { list } } = this.props;
    return list.find( item => item.id === parseInt( tagsId, 10 ) ) ? list.find( item => item.id === parseInt( tagsId, 10 ) ).name : ''
  }


  render() {
    const { form: { getFieldDecorator }, filterSubmit, delBatch, tagsList } = this.props;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='ID' {...this.formLayout}>
              {getFieldDecorator( 'id', {
             } )(
               <Input
                 placeholder="请选择ID"
                 style={{ width: 200 }}
               /> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='题目' {...this.formLayout}>
              {getFieldDecorator( 'content', {
              } )(
                <Input
                  placeholder="请输入题目关键词"
                  style={{ width: 200 }}
                /> )}
            </FormItem>
          </Col>  
          <Col span={8}>
            <FormItem label='标签名称' {...this.formLayout}>
              {getFieldDecorator( 'tagsId', {
                initialValue:""
              } )(
                <Select
                  style={{ width: 200, borderRadius: '3px', marginRight: '20px' }}
                  placeholder="请选择标签名"
                  // onSelect={this.onCourseChange}
                >
                  <Option key={undefined} value=''>全部</Option>
                  {tagsList.map( course => 
                    <Option key={course.id} value={course.id}>{course.name}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='创建时间' {...this.formLayout}>
              {getFieldDecorator( 'createTime', {
              } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width:270 }} /> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label="状态" {...this.formLayout}>
              {getFieldDecorator( 'enable', {
                initialValue:""
                } )( 
                  <RadioGroup>
                    <RadioButton value="">全部</RadioButton>
                    <RadioButton value="true">已启用</RadioButton>
                    <RadioButton value="false">未启用</RadioButton>
                  </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <div style={{ width:'50%', marginLeft:'10%', display:'flex' }}>
              <Button onClick={filterSubmit} type='primary' style={{ marginRight:20 }}>搜索</Button>
              <Button onClick={this.formReset} type='primary' style={{ marginRight:20 }}>清空</Button>
              <Button type="danger" onClick={delBatch}>批量删除</Button>
            </div>
          </Col>
        </Row>
 
      </Form>
    )}
   
}

export default FilterForm;
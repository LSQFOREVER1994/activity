
import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Row, Col, Button, Radio, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const typeObj={
  "MOGUL_ATTENTION": '大佬关注',
  "INSTITUTIONAL_DISCUSSION":'机构热议',
  'MAIN_TREND':'主力方向',
  'LONG_TERM_LAYOUT':'长线布局'
}

const pushStateObj={
  'PENDING':'待发布',
  'PUBLISHED':'已发布'
}

const auditStateObj={ 
  'PENDING':'待审核',
  'PASSED':'已通过',
  'REJECTED':'已拒绝'
}

const stateObj = {
  "ENABLE": '上架', // 是
  "DISABLE":'下架', // 否
}


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

  render() {
    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit} style={{ marginBottom:20 }}>
        
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label="状态" {...this.formLayout}>
              {getFieldDecorator( 'state', {
                initialValue:""
                } )( 
                  <Select style={{ width:200 }}>
                    <Option key={undefined} value=''>全部</Option>
                    {
                    Object.keys( stateObj ).map( item =>(
                      <Option key={item}>{stateObj[item]}</Option>
                    ) )
                  }
                  </Select>
              )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='发布状态' {...this.formLayout}>
              {getFieldDecorator( 'pushState', {
                initialValue:""
             } )(
               <Select style={{ width:200 }}>
                 <Option key={undefined} value=''>全部</Option>
                 {
                   Object.keys( pushStateObj ).map( item =>(
                     <Option key={item}>{pushStateObj[item]}</Option>
                   ) )
                 }
               </Select>
               )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='发布时间' {...this.formLayout}>
              {getFieldDecorator( 'pushTime', {
              } )( <RangePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width:260 }}
                getCalendarContainer={triggerNode => triggerNode.parentNode}
              /> )}
            </FormItem>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='类型' {...this.formLayout}>
              {getFieldDecorator( 'type', {
                initialValue:""
             } )(
               <Select style={{ width:200 }}>
                 <Option key={undefined} value=''>全部</Option>
                 {
                   Object.keys( typeObj ).map( item =>(
                     <Option key={item}>{typeObj[item]}</Option>
                   ) )
                 }
               </Select>
               )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='审核状态' {...this.formLayout}>
              {getFieldDecorator( 'auditState', {
                initialValue:""
             } )(
               <Select style={{ width:200 }}>
                 <Option key={undefined} value=''>全部</Option>
                 {
                   Object.keys( auditStateObj ).map( item =>(
                     <Option key={item}>{auditStateObj[item]}</Option>
                   ) )
                 }
               </Select>
               )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="文章标题" {...this.formLayout}>
              {getFieldDecorator( 'title', {
                } )( <Input style={{ width:260 }} /> )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16} />
          <Col span={8}>
            <div style={{ width:'50%', marginLeft:'20%' }}>
              <Button onClick={filterSubmit} type='primary' style={{ marginRight:20 }}>搜索</Button>
              <Button onClick={this.formReset}>清空</Button>
            </div>
          </Col>
        </Row>

      </Form>
    )}
   
}

export default FilterForm;
import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Row, Col, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from '../Lists.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;



@connect()
@Form.create()
class FilterForm extends PureComponent {
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



  // getValues = () => {
  //   const { form, detail } = this.props;
  //   let data = {};
  //   form.validateFields( ( err, values ) => {
  //     console.log( values, 'values' )
  //     const { keys, ...Values } = values
  //     data = { ...detail, ...Values };
  //   } )
  //   if( JSON.stringify( data ) === '{}' ) return null;
  //   return data
  // }
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
      <Form onSubmit={filterSubmit} layout='horizontal'>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
              } )( <Input placeholder="活动名称" style={{ width: 220 }} /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'activityState', {
                initialValue: '',
              } )(
                <Select style={{ width: 220 }}>
                  <Option value=''>全部</Option>
                  <Option value="上架">上架</Option>
                  <Option value="下架">下架</Option>
                  <Option value="即将开始">即将开始</Option>
                  <Option value="进行中">进行中</Option>
                  <Option value="已结束">已结束</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label='时间' {...this.formLayout1}>
              {getFieldDecorator( 'rangeTime', {
              } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <FormItem wrapperCol={{ span: 12, offset: 4 }}>
              <div className={styles.button_box}>
                <Button onClick={filterSubmit} type='primary'>搜索</Button>
                <Button onClick={this.formReset} type='primary'>清空</Button>
              </div>
            </FormItem>
          </Col>
        </Row> 
        
      </Form>
    )}
   
}

export default FilterForm;

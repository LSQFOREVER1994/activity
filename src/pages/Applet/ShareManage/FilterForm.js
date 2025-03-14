import React, { PureComponent } from 'react';
import { Form, Radio, DatePicker, Input, Row, Col, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from '../Lists.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;

const stateObj = {
  "": '全部',
  "ENABLE": '上架',
  "DISABLE": '下架',
}

@connect()
@Form.create()
class FilterForm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      
    };
    
  }

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
        } )(
          <Input
            placeholder="活动名称"
            style={{ width: 220 }}
          /> )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='状态' {...this.formLayout}>
              {getFieldDecorator( 'isSale', {
            initialValue: '',
          } )(
            <Select style={{ width: 220 }}>
              <Option value=''>全部</Option>
              <Option value="true">上架</Option>
              <Option value="false">下架</Option>
            </Select>
           
          )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label='时间' {...this.formLayout1}>
              {getFieldDecorator( 'rangeTime', {
        } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={filterSubmit} /> )}
            </FormItem>
          </Col>


        </Row>

        <Row gutter={24}>
          <Col span={12}>
            
            <FormItem wrapperCol={{ span: 12, offset: 4 }}>
              <div className={styles.button_box}>
                <Button onClick={filterSubmit} type='primary'>搜索</Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )}
   
}

export default FilterForm;

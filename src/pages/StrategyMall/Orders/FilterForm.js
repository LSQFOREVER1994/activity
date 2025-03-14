import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Select,  Row, Col, Button  } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from '../Lists.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const stateObj = {
  "": formatMessage( { id: 'strategyMall.order.state.all' } ),
  'WAITING_PAY': formatMessage( { id: 'strategyMall.order.WAITING_PAY' } ),
  'INVALID': formatMessage( { id: 'strategyMall.order.INVALID' } ),
  'PAY_SUCCESS': formatMessage( { id: 'strategyMall.order.PAY_SUCCESS' } ),
  'WAITING_DELIVERY': formatMessage( { id: 'strategyMall.order.WAITING_DELIVERY' } ),
  'FINISH': formatMessage( { id: 'strategyMall.order.FINISH' } ),
  // 'TIME_OUT': formatMessage( { id: 'strategyMall.order.TIME_OUT' } ),
  'REFUNDED': formatMessage( { id: 'strategyMall.order.REFUNDED' } ),
};

const payObj = {
  "": formatMessage( { id: 'strategyMall.order.state.all' } ),
  'WECHAT_H5': formatMessage( { id: 'strategyMall.order.WECHAT_H5' } ),
  'ALI_PAY_H5': formatMessage( { id: 'strategyMall.order.ALI_PAY_H5' } ),
  'SYSTEM_SEND': formatMessage( { id: 'strategyMall.order.SYSTEM_SEND' } ),
  'FREE': formatMessage( { id: 'strategyMall.order.FREE' } ),

  'WECHAT_APP': formatMessage( { id: 'strategyMall.order.WECHAT_APP' } ),
  'ALI_PAY_APP': formatMessage( { id: 'strategyMall.order.ALI_PAY_APP' } ),
  'EXCHANGE_COUPON': formatMessage( { id: 'strategyMall.order.EXCHANGE_COUPON' } ),
};

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

  constructor( props ) {
    super( props );
    this.state = {
      start: moment().subtract( 1, 'M' ).format( 'YYYY-MM-DD' ),
      end: moment().format( 'YYYY-MM-DD' ),
    }; 
  }

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



  render() {

    const { form: { getFieldDecorator }, filterSubmit, handleOk, showJurisdictionModal } = this.props;
    const { start, end } = this.state;
    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>

          <Col span={8}>
            <FormItem label='订单号' {...this.formLayout}>
              {getFieldDecorator( 'id', {
        } )(
          <Input
            placeholder="请输入订单号"
            style={{ width: 220 }}
          /> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='用户名' {...this.formLayout}>
              {getFieldDecorator( 'username', {
        } )(
          <Input
            placeholder="请输入用户名"
            style={{ width: 220 }}
          /> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='邀请码' {...this.formLayout}>
              {getFieldDecorator( 'visitCode', {
        } )(
          <Input
            placeholder="请输入邀请码"
            style={{ width: 220 }}
          /> )}
            </FormItem>
          </Col>
          
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='第三方订单' {...this.formLayout}>
              {getFieldDecorator( 'thirdPartyId', {
        } )(
          <Input
            placeholder="请输入第三方订单"
            style={{ width: 220 }}
          /> )}
            </FormItem>
            
          </Col>

          <Col span={8}>
            <FormItem label='支付方式' {...this.formLayout}>
              {getFieldDecorator( 'payType', {
                initialValue: '',
        } )(
          <Select style={{ width: 220 }} getPopupContainer={triggerNode => triggerNode.parentNode}>
            <Option value=''>{payObj['']}</Option>
            <Option value='WECHAT_H5'>{payObj.WECHAT_H5}</Option>
            <Option value='ALI_PAY_H5'>{payObj.ALI_PAY_H5}</Option>
            <Option value='SYSTEM_SEND'>{payObj.SYSTEM_SEND}</Option>
            <Option value='FREE'>{payObj.FREE}</Option>
            <Option value='WECHAT_APP'>{payObj.WECHAT_APP}</Option>
            <Option value='ALI_PAY_APP'>{payObj.ALI_PAY_APP}</Option>
            <Option value='EXCHANGE_COUPON'>{payObj.EXCHANGE_COUPON}</Option>
          </Select> )}
            </FormItem>
          </Col>

          <Col span={8}>
            <FormItem label='支付状态' {...this.formLayout}>
              {getFieldDecorator( 'state', {
                initialValue: '',
        } )(
          <Select style={{ width: 220 }} getPopupContainer={triggerNode => triggerNode.parentNode}>
            <Option value=''>{stateObj['']}</Option>
            <Option value='WAITING_PAY'>{stateObj.WAITING_PAY}</Option>
            <Option value='INVALID'>{stateObj.INVALID}</Option>
            <Option value='PAY_SUCCESS'>{stateObj.PAY_SUCCESS}</Option>
            <Option value='WAITING_DELIVERY'>{stateObj.WAITING_DELIVERY}</Option>
            <Option value='FINISH'>{stateObj.FINISH}</Option>
            {/* <Option value='TIME_OUT'>{stateObj.TIME_OUT}</Option> */}
            <Option value='REFUNDED'>{stateObj.REFUNDED}</Option>
          </Select> )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label='支付时间' {...this.formLayout1}>
              {getFieldDecorator( 'payTime', {
                initialValue:[moment( start ), moment( end )]
            } )( <RangePicker showTime format="YYYY-MM-DD" getCalendarContainer={triggerNode => triggerNode.parentNode} /> )}
            </FormItem>
          </Col>
          <Col span={6} />
          <Col span={6} />
         
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            
            <FormItem wrapperCol={{ span: 12, offset: 2 }}>
              <div className={styles.button_box}>
                <Button onClick={filterSubmit} type='primary' style={{ marginRight:15 }}>搜索</Button>
                <Button onClick={this.formReset} type='primary' style={{ marginRight:15 }}>清空</Button>
                <Button onClick={showJurisdictionModal} type='primary' style={{ marginRight:15 }}>新建订单</Button>
                <Button onClick={handleOk} type='primary'>导出订单</Button>
              </div>
            </FormItem>
          </Col>
        </Row>
 
      </Form>
    )}
   
}

export default FilterForm;

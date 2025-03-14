import React, { PureComponent } from 'react';
import { Form, DatePicker, Input, Select,  Row, Col, Button  } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

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
  'TIME_OUT': formatMessage( { id: 'strategyMall.order.TIME_OUT' } ),
  'REFUNDED': formatMessage( { id: 'strategyMall.order.REFUNDED' } ),
};


@connect()
@Form.create()
class FilterForm extends PureComponent {
  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      isShow:false,
    }; 
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


  showScreen = () => {
    const { isShow } = this.state;
    this.setState( {
      isShow:!isShow
    } )
  }

  render() {

    const { form: { getFieldDecorator }, filterSubmit, handleExport, routeClickName  } = this.props;
    const { isShow } = this.state;

    return(
      <Form layout='horizontal' onSubmit={filterSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='订单号' {...this.formLayout}>
              {getFieldDecorator( 'orderId', {
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
         
          <div style={{ float:'right', marginRight:15, marginTop:5 }}>
            <Button type='primary' style={{ marginRight:'15px' }} onClick={filterSubmit}>搜索</Button>
            <Button type='primary' style={{ marginRight:'15px' }} onClick={this.formReset}>清空</Button>
            <Button type='primary' onClick={handleExport}>导出</Button>
          </div>
        </Row> 

        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='创建时间' {...this.formLayout1}>
              {getFieldDecorator( 'createTime', {
              } )( 
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              )}
            </FormItem>
          </Col>
          <div 
            style={{ position:'absolute', top:'10px', left:'500px', color:'#1890FF', cursor:'pointer' }}
            onClick={this.showScreen}
          >
            更多筛选
          </div>
        </Row>

        {
        isShow ?
          <div> 
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label='活动名称' {...this.formLayout}>
                  {getFieldDecorator( 'channel', {
                    initialValue: routeClickName  === null ?  '' : routeClickName,
                    } )(
                      <Input
                        placeholder="请输入活动名称"
                        style={{ width: 220 }}
                      /> 
                    )}
                </FormItem>
                
              </Col>
              <Col span={8}>
                <FormItem label='商品名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                  } )(
                    <Input
                      placeholder="请输入商品名称"
                      style={{ width: 220 }}
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={8}>
                <FormItem label='订单状态' {...this.formLayout}>
                  {getFieldDecorator( 'state', {
                  } )(
                    <Select style={{ width: 220 }} placeholder='订单状态'>
                      <Option value=''>{stateObj['']}</Option>
                      <Option value='WAITING_PAY'>{stateObj.WAITING_PAY}</Option>
                      <Option value='INVALID'>{stateObj.INVALID}</Option>
                      <Option value='PAY_SUCCESS'>{stateObj.PAY_SUCCESS}</Option>
                      <Option value='WAITING_DELIVERY'>{stateObj.WAITING_DELIVERY}</Option>
                      <Option value='FINISH'>{stateObj.FINISH}</Option>
                      <Option value='TIME_OUT'>{stateObj.TIME_OUT}</Option>
                      <Option value='REFUNDED'>{stateObj.REFUNDED}</Option>
                    </Select> 
                  )}
                </FormItem>
              </Col>

            </Row>

          </div>
          : null
        }
      </Form>
    )}
   
}

export default FilterForm;
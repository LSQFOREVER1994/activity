import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Select, Button, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { exportXlsx } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// 订单状态
const orderStateObj = {
  success: '充值成功',
  processing: '充值中',
  failed: '充值失败',
  untreated: '未处理'
}

@connect()
@Form.create()
class FilterForm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      isExPLoading: false
    }
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
exportRecord = () => {
  const { sortedInfo = {} }=this.props
  const formValue = this.getValues();
  const { account, orderId, orderState, createTime, finishTime } = formValue;
  const start = ( createTime && createTime.length ) ? moment( createTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
  const end = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
  const finishStart = ( finishTime && finishTime.length ) ? moment( finishTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
  const finishEnd = ( finishTime && finishTime.length ) ? moment( finishTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
  const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
  const obj = {
    orderBy: `${sortedInfo.columnKey} ${sortValue}`,
    account,
    orderId,
    orderState,
    start,
    end,
    finishStart,
    finishEnd,
  }

  // 拼接参数
  const paramsArray = [];
  /* eslint-disable consistent-return */
  Object.keys( obj ).forEach( key => {
    if ( obj[key] || typeof obj[key] === 'boolean' ) {
      return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
    }
  } )

  let ajaxUrl = `direct/export`
  if ( paramsArray && paramsArray.length > 0 ) {
    const paramStr = paramsArray.join( '&' )
    ajaxUrl = `direct/export?${paramStr}`
  }

  this.setState( {
    isExPLoading: true
  }, () => {
    exportXlsx( {
      type: 'openService',
      uri: ajaxUrl,
      xlsxName: `话费订单列表.xlsx`,
      callBack: () => {
        this.setState( {
          isExPLoading: false
        } )
      }
    } )
  } )
}

  render() {
    const { form: { getFieldDecorator }, filterSubmit } = this.props;
    const { isExPLoading } = this.state
    return (
      <Form onSubmit={filterSubmit} layout='horizontal'>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='手机号' {...formLayout}>
              {getFieldDecorator( 'account', {
              } )(
                <Input
                  placeholder="请输入手机号"
                  style={{ width: 170 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='订单号' {...formLayout}>
              {getFieldDecorator( 'orderId', {
              } )(
                <Input
                  placeholder="请输入订单号"
                  style={{ width: 170 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='充值状态' {...formLayout}>
              {getFieldDecorator( 'orderState', {
                initialValue: ''
              } )(
                <Select style={{ width: 170 }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                  <Option value=''>全部</Option>
                  <Option value='success'>{orderStateObj.success}</Option>
                  <Option value='processing'>{orderStateObj.processing}</Option>
                  <Option value='failed'>{orderStateObj.failed}</Option>
                  <Option value='untreated'>{orderStateObj.untreated}</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <FormItem label='创建时间' {...formLayout1}>
              {getFieldDecorator( 'createTime', {
                initialValue: []
              } )( <RangePicker
                format="YYYY-MM-DD HH:mm:ss"
                getCalendarContainer={triggerNode => triggerNode.parentNode}
                style={{ width:'100%' }}
                showTime
              /> )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='充值成功时间' {...formLayout1}>
              {getFieldDecorator( 'finishTime', {
                initialValue: []
              } )( <RangePicker
                format="YYYY-MM-DD HH:mm:ss"
                getCalendarContainer={triggerNode => triggerNode.parentNode}
                style={{ width:'100%' }}
                showTime
              /> )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                <Button onClick={filterSubmit} type='primary' style={{ marginRight: 15 }}>搜索</Button>
                <Button onClick={this.formReset} type='primary' style={{ marginRight: 15 }}>清空</Button>
                <Button onClick={this.exportRecord} type='primary' loading={isExPLoading}>导出列表</Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

}

export default FilterForm;

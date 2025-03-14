import React, { PureComponent } from 'react';
import { Row, Col, Form, DatePicker, Select, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker, WeekPicker, MonthPicker } = DatePicker;
const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

@connect()
@Form.create()
class FilterForm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      dateType: 'MONTH',
      optionList: props.integralList
    }
  }

  getValues = () => {
    const { form } = this.props;
    return form.getFieldsValue();
  }

  //  提交
  handleSubmit = ( e ) => {
    const { filterSubmit } = this.props;
    const { dateType, optionList } = this.state;
    e.preventDefault();
    this.props.form.validateFields( ( err ) => {
      if ( !err ) {
        filterSubmit( dateType, optionList )
      }
    } );
  };

  selectRankType = ( value ) => {
    const { integralList, guessList, form } = this.props;
    if ( value === 'INTEGRAL' ) {
      form.setFieldsValue( { rankCategoryType: 'MONTH_ACC' } )
      this.setState( {
        optionList: integralList
      }, () => this.selectChange( 'MONTH_ACC' ) )

    } else {
      form.setFieldsValue( { rankCategoryType: 'WEEK_ADD' } )
      this.setState( {
        optionList: guessList
      }, () => this.selectChange( 'WEEK_ADD' ) )
    }
  }

  selectChange = ( value ) => {
    const { form: { resetFields }, } = this.props;
    const { optionList } = this.state
    resetFields( ['createTime'] )
    const optionItem = optionList && optionList.find( ( i ) => {
      let tableItem;
      if ( i.value === value ) {
        tableItem = i
      }
      return tableItem
    } )
    const dateType = optionItem ? optionItem.dateType : "MONTH"
    this.setState( {
      dateType
    } )
  }

    // 清空
    formReset = () => {
      const { form, integralList } = this.props;
      form.resetFields();
      this.setState( {
        dateType: "MONTH",
        optionList: integralList
      } )
    }

  render() {
    const { form: { getFieldDecorator }, exportRankRecord, isExPLoading } = this.props;
    const { dateType, optionList } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} layout='horizontal'>
        <Row gutter={24}>
          <Col span={6}>
            <FormItem label='排行榜类型' {...formLayout}>
              {getFieldDecorator( 'rankType', {
                initialValue: 'INTEGRAL'
              } )(
                <Select
                  style={{ width: 150 }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  onChange={( value ) => this.selectRankType( value )}
                >
                  <Option value='INTEGRAL'>积分排行榜</Option>
                  <Option value='GUESS'>猜涨跌排行榜</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label='榜单类型' {...formLayout}>
              {getFieldDecorator( 'rankCategoryType', {
                initialValue: 'MONTH_ACC'
              } )(
                <Select
                  style={{ width: 150 }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  onChange={( value ) => this.selectChange( value )}
                >
                  {
                    optionList.map( i => (
                      <Option
                        key={i.value}
                        value={i.value}
                      >
                        {i.label}
                      </Option>
                    ) )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            {
              dateType === 'RANGE' &&
              <FormItem label='时间' {...formLayout}>
                {getFieldDecorator( 'createTime', {
                } )(
                  <RangePicker
                    style={{ width: 150 }}
                    format="YYYY-MM-DD"
                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                  />
                )}
              </FormItem>
            }
            {
              dateType === 'WEEK' &&
              <FormItem label='时间' {...formLayout}>
                {getFieldDecorator( 'createTime', {
                  initialValue: moment(),
                  rules: [{ required: true, message: `请选择时间` }],
                } )(
                  <WeekPicker
                    style={{ width: 150 }}
                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                  />
                )}
              </FormItem>
            }            {
              dateType === 'MONTH' &&
              <FormItem label='时间' {...formLayout}>
                {getFieldDecorator( 'createTime', {
                  initialValue: moment(),
                  rules: [{ required: true, message: `请选择时间` }],
                } )(
                  <MonthPicker
                    style={{ width: 150 }}
                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                  />
                )}
              </FormItem>
            }
          </Col>
          <Col span={4}>
            <FormItem>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                <Button onClick={this.handleSubmit} type='primary' style={{ marginRight: 15 }}>搜索</Button>
                <Button onClick={this.formReset} type='primary' style={{ marginRight: 15 }}>清空</Button>
                <Button onClick={exportRankRecord} type='primary' loading={isExPLoading} style={{ marginRight: 15 }}>导出</Button>
                <Button onClick={() => window.open( `/system/exportList` )} type="link">查看导出列表</Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default FilterForm;

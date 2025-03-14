import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Button, DatePicker, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { exportXlsx } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

const formLayout1 = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

const formLayout2 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};
@connect(({ callChargesLinkModel }) => {
  return {
    platformList: callChargesLinkModel.platformList,
  };
})
@Form.create()
class FilterForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExPLoading: false,
    };
  }

  getValues = () => {
    const { form } = this.props;
    const {
      createTime: [createStartTime, createEndTime],
      expireTime: [expireStartTime, expireEndTime],
      username,
      chargePrice,
      isPublish,
      merchantId,
    } = form.getFieldsValue();
    const createTimeBegin = createStartTime
      ? moment(createStartTime).format('YYYY-MM-DD 00:00:00')
      : '';
    const createTimeEnd = createEndTime ? moment(createEndTime).format('YYYY-MM-DD 23:59:59') : '';
    const expireTimeBegin = expireStartTime
      ? moment(expireStartTime).format('YYYY-MM-DD 00:00:00')
      : '';
    const expireTimeEnd = expireEndTime ? moment(expireEndTime).format('YYYY-MM-DD 23:59:59') : '';
    return {
      createTimeBegin,
      createTimeEnd,
      expireTimeBegin,
      expireTimeEnd,
      username,
      chargePrice,
      merchantId,
      isPublish: isPublish ? !!isPublish : isPublish,
    };
  };

  //  提交
  handleSubmit = () => {
    const { form, detail } = this.props;
    let haveError = false;
    let data = {};
    form.validateFields((err, values) => {
      if (err) {
        haveError = err;
      }
      data = { ...detail, ...values };
    });
    if (haveError) return 'error';

    return data;
  };

  //  校验表单
  getFormError = () => {
    const { form } = this.props;
    let haveError = false;
    form.validateFields(err => {
      if (err) {
        haveError = true;
      }
    });
    return haveError;
  };

  // 清空
  formReset = () => {
    const { form, filterSubmit } = this.props;
    form.resetFields();
    filterSubmit();
  };

  // 展示新增弹窗
  showAddModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'callChargesLinkModel/SetState',
      payload: {
        visibleAddModal: true,
      },
    });
  };

  // 导出名单
  exportRecord = () => {
    const formValue = this.getValues();
    const { id, sortedInfo } = this.props;
    const { username, updateStartTime, updateEndTime } = formValue;
    const obj = {
      username,
      updateStartTime,
      updateEndTime,
      activityId: id,
      orderBy: `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`,
    };

    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys(obj).forEach(key => {
      if (obj[key] || typeof obj[key] === 'boolean') {
        return paramsArray.push(`${key}=${encodeURIComponent(obj[key])}`);
      }
    });

    let ajaxUrl = `task/left-count/export`;
    if (paramsArray && paramsArray.length > 0) {
      const paramStr = paramsArray.join('&');
      ajaxUrl = `task/left-count/export?${paramStr}`;
    }

    this.setState(
      {
        isExPLoading: true,
      },
      () => {
        exportXlsx({
          type: 'activityService',
          uri: ajaxUrl,
          xlsxName: `活动参与次数明细.xlsx`,
          callBack: () => {
            this.setState({
              isExPLoading: false,
            });
          },
        });
      }
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
      filterSubmit,
      platformList,
    } = this.props;
    const { isExPLoading } = this.state;
    return (
      <Form onSubmit={filterSubmit} layout="horizontal">
        <Row type="flex">
          <Col>
            <FormItem label="创建时间" {...formLayout1}>
              {getFieldDecorator('createTime', {
                initialValue: [],
              })(
                <RangePicker
                  format="YYYY-MM-DD"
                  getCalendarContainer={triggerNode => triggerNode.parentNode}
                />
              )}
            </FormItem>
          </Col>

          <Col>
            <FormItem label="过期时间" {...formLayout1}>
              {getFieldDecorator('expireTime', {
                initialValue: [],
              })(
                <RangePicker
                  format="YYYY-MM-DD"
                  getCalendarContainer={triggerNode => triggerNode.parentNode}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row type="flex" justify="start">
          <Col style={{ marginRight: '30px' }}>
            <FormItem label="平台名称" {...formLayout2}>
              {getFieldDecorator('merchantId', { initialValue: '' })(
                <Select
                  style={{ width: 220 }}
                  showSearch
                  filterOption={(input, option) => {
                    if (option && option.props && option.props.title) {
                      return option.props.title.includes(input);
                    }
                    return false;
                  }}
                >
                  <Option value="">全部</Option>
                  {platformList.length &&
                    platformList.map(item => {
                      return (
                        <Option key={item.id} value={item.id} title={item.name}>
                          {item.name}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col style={{ marginRight: '30px' }}>
            <FormItem label="充值金额" {...formLayout2}>
              {getFieldDecorator('chargePrice', {})(
                <Input placeholder="请输入充值金额" style={{ width: 190 }} />
              )}
            </FormItem>
          </Col>
          <Col style={{ marginRight: '30px' }}>
            <FormItem label="创建人" {...formLayout2}>
              {getFieldDecorator('username', {})(
                <Input placeholder="请输入创建人" style={{ width: 190 }} />
              )}
            </FormItem>
          </Col>
          <Col style={{ marginRight: '30px' }}>
            <FormItem label="状态" {...formLayout2}>
              {getFieldDecorator('isPublish', { initialValue: '' })(
                <Select style={{ width: 120 }}>
                  <Option value="">全部</Option>
                  <Option value={1}>上架</Option>
                  <Option value={0}>下架</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%',
                  paddingRight: '20px',
                }}
              >
                <Button onClick={filterSubmit} type="primary" style={{ marginRight: 15 }}>
                  搜索
                </Button>
                <Button onClick={this.formReset} type="primary" style={{ marginRight: 15 }}>
                  清空
                </Button>
                <Button onClick={this.showAddModal} type="primary" loading={isExPLoading}>
                  新增
                </Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;

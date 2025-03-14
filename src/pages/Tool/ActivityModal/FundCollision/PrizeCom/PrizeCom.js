import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Radio, Input, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PrizeTable from './PrizeTable';

const FormItem = Form.Item;

@connect(({ fundCollision }) => ({
  loading: fundCollision.loading,
}))
@Form.create()
class PrizeCom extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  constructor(props) {
    super(props)
    this.state = {
      isLottery: props.data.isLottery === undefined ? true : props.data.isLottery,
      lotteryRelative: props.data.lotteryRelative === undefined ? true : props.data.lotteryRelative,
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  onPreview = () => {
    this.props.onPreview()
  }

  getValues = () => {
    const { isLottery, lotteryRelative } = this.state;
    const { form } = this.props;
    let data;
    const prizeObj = this.prizeRef.getValues();
    data = prizeObj
    return data
  }

  getData = () => {
    const { isLottery, lotteryRelative } = this.state;
    const { form } = this.props;
    let isError = true
    let data;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        message.error('请在设置中输入必填项')
        isError = false
        return
      }
      data = fieldsValue
    })
    return isError && data;
  }

  render() {
    const { form: { getFieldDecorator }, data, onPreview } = this.props;
    const { isLottery, lotteryRelative } = this.state;
    return (
      <GridContent>
        <Form>
          <PrizeTable
            prizes={data.prizes}
            onPreview={onPreview}
            onRef={(ref) => { this.prizeRef = ref }}
          />
        </Form>
      </GridContent>
    );
  }
}

export default PrizeCom;

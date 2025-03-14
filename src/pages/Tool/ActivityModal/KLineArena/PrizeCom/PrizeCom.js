import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Radio, Input, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import NoPrizeTable from './NoPrizeTable';
import PrizeTable from './PrizeTable';

const FormItem = Form.Item;

@connect()
@Form.create()
class PrizeCom extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props )
    this.state = {
      isLottery: props.data.isLottery === undefined ? true : props.data.isLottery,
      lotteryRelative: props.data.lotteryRelative === undefined ? true : props.data.lotteryRelative,
    }
  }


  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () => {
    this.props.onPreview()
  }


  getValues = () => {
    const { isLottery, lotteryRelative } = this.state;
    const { form } = this.props;
    let data;
    if ( !isLottery ) {
      const noPrizeObj = this.noPrizeRef.getValues();
      data = Object.assign( noPrizeObj, { isLottery } )
    }
    if ( isLottery && lotteryRelative ) {
      data = form.getFieldsValue()
    }
    if ( isLottery && !lotteryRelative ) {
      const prizeObj = this.prizeRef.getValues();
      data = Object.assign( prizeObj, { isLottery }, { lotteryRelative } )
    }
    return data
  }

  getData = () => {
    const { isLottery, lotteryRelative } = this.state;
    const { form } = this.props;
    let isError = true
    let data;
    if ( !isLottery ) {
      const noPrizeObj = this.noPrizeRef.getData();
      data = Object.assign( noPrizeObj, { isLottery } )
    }
    if ( isLottery && lotteryRelative ) {
      form.validateFields( ( err, fieldsValue ) => {
        if ( err ) {
          message.error( '请在设置中输入必填项' )
          isError = false
          return
        }
        data = fieldsValue
      } )
    }
    if ( isLottery && !lotteryRelative ) {
      const prizeObj = this.prizeRef.getData();
      data = Object.assign( prizeObj, { isLottery }, { lotteryRelative } )
    }
    return isError && data;
  }

  isLotteryChange = ( e ) => {
    this.setState( { isLottery: e.target.value } )
  }

  isRelateChange = ( e ) => {
    this.setState( { lotteryRelative: e.target.value } )
  }

  render() {
    const { form: { getFieldDecorator }, data, onPreview } = this.props;
    const { isLottery, lotteryRelative } = this.state;
    return (
      <GridContent>
        <Form>
          {
            <FormItem label='是否关联其他抽奖活动' style={{ display: 'flex', marginBottom: '20px', marginTop: '-15px' }}>
              {getFieldDecorator( 'lotteryRelative', {
                rules: [{ required: true }],
                initialValue: data.lotteryRelative || lotteryRelative
              } )(
                <Radio.Group onChange={this.isRelateChange}>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              )}
            </FormItem>
          }
          {
            ( isLottery && lotteryRelative ) &&
            <FormItem label='跳转抽奖链接' style={{ display: 'flex', marginBottom: '10px', marginTop: '-5px' }}>
              {getFieldDecorator( 'link', {
                rules: [{ required: true, message:"请输入抽奖跳转链接" }],
                initialValue: data.link
              } )( <Input style={{ width: 350 }} placeholder='请输入抽奖跳转链接' /> )}
            </FormItem>
          }
          {
            (isLottery && lotteryRelative) &&
            <FormItem label='我的奖品链接' style={{ display: 'flex', marginLeft: '10px', marginBottom: '10px', marginTop: '-5px' }}>
              {getFieldDecorator('prizeUrl', {
                initialValue: data.prizeUrl
              })(<Input style={{ width: 350 }} placeholder='请输入我的奖品跳转链接' />)}
            </FormItem>
          }
        </Form>
        {
          !isLottery &&
          <NoPrizeTable
            drawLotsPrizeList={data.prizes}
            onPreview={onPreview}
            onRef={( ref ) => { this.noPrizeRef = ref }}
          />
        }
        {
          ( isLottery && !lotteryRelative ) &&
          <PrizeTable
            prizes={data.prizes}
            onPreview={onPreview}
            onRef={( ref ) => { this.prizeRef = ref }}
          />
        }
      </GridContent>
    );
  }
}

export default PrizeCom;

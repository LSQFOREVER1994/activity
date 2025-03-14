import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, message, Radio, Button, Icon, InputNumber, TimePicker, Tooltip } from 'antd';
import moment from 'moment';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;

@connect()
@Form.create()
class IntegralSetting extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    let signOptions = []
    if ( props.data && props.data.signScoreList ) {
      signOptions = props.data.signScoreList
    }
    super( props );
    this.state = {
      signOptions
    }
  }

  componentDidMount() {
    this.props.onRef( this )
  }

  getValues = () => {
    const { signOptions } = this.state
    const { form, data = {} } = this.props;
    const dataValue = form.getFieldsValue()
    const newData = Object.assign( dataValue, {
      signScoreList: signOptions,
      dailySignScore: dataValue.dailySignScore || 0,
      linkSignScore: dataValue.linkSignScore || 0,
    } );

    if ( dataValue.closeStartTime ) {
      newData.closeStartTime = moment( dataValue.closeStartTime ).format( 'HH:mm:ss' )
    }

    return newData
  }

  getData = () => {
    const { signOptions } = this.state
    const { form, data = {} } = this.props;
    let newData = {};
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在积分设置里面输入必填项' )
        return;
      }
      newData = Object.assign( fieldsValue, {
        signScoreList: signOptions,
        dailySignScore: fieldsValue.dailySignScore || 0,
        linkSignScore: fieldsValue.linkSignScore || 0
      } );
      if ( fieldsValue.closeStartTime ) {
        newData.closeStartTime = moment( fieldsValue.closeStartTime ).format( 'HH:mm:ss' )
      }
    } );
    return isError && newData;
  }


  onPreview = () => {
    this.props.onPreview()
  };


  // 添加签到配置
  addSignOption = () => {
    const { signOptions = [] } = this.state;
    if ( signOptions && signOptions.length >= 7 ) {
      message.error( '最多只能配置七天' )
      return
    }
    signOptions.push( 0 );
    this.setState( { signOptions: [...signOptions] } );
  }

  // 修改签到配置
  editSignOption = ( e, index ) => {
    const { signOptions } = this.state;
    signOptions[index] = e;
    this.setState( { signOptions: [...signOptions] } );
  }

  // 删除签到配置
  deleteSignOption = ( index ) => {
    const { signOptions } = this.state;
    const newOptions = signOptions.filter( ( item, i ) => {
      return i !== index
    } );
    this.setState( { signOptions: [...newOptions] } );
  }

  renderSignDay = () => {
    const { signOptions } = this.state
    let view
    if ( signOptions && signOptions.length > 0 ) {
      view = (
        signOptions.map( ( item, index ) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }} key={index}>
              <div style={{ width: '60px' }}>第{index + 1}天：</div>
              <InputNumber
                min={0}
                style={{ width: '50%' }}
                value={item}
                precision={0}
                onChange={e => this.editSignOption( e, index )}
              />
              <Icon type="delete" theme="twoTone" style={{ fontSize: '24px', marginLeft: '20px' }} onClick={() => this.deleteSignOption( index )} />
            </div>
          )
        } )
      )
    }
    return view
  }

  render() {
    const { signOptions } = this.state
    const { form: { getFieldDecorator, getFieldValue }, data = {}, tripartiteLink } = this.props;

    return (
      <Form layout='horizontal' className={styles.formHeight} onSubmit={this.basicHandleSubmit}>
        <p style={{ color: '#D1261B', marginLeft: '1%' }}>设置活动相关积分</p>
        <FormItem label='基础奖池' {...this.formLayout}>
          {getFieldDecorator( 'baseScore', {
            initialValue: data.baseScore,
            rules: [{
              required: true,
              pattern: new RegExp( /^[0-9]\d*$/, "g" ),
              message: `用户每次竞猜基础奖池积分不能为空！且必须大于等于0！`
            }],
          } )( <Input placeholder='请输入用户每次竞猜基础奖池积分' addonAfter="分" /> )}
        </FormItem>
        <FormItem label='首次登录' {...this.formLayout}>
          {getFieldDecorator( 'firstLoginScore', {
            initialValue: data.firstLoginScore,
            // rules: [{
            //   required: true,
            //   pattern: new RegExp( /^[0-9]\d*$/, "g" ),
            //   message: `用户首次登录奖励积分不能为空！且必须大于0！`
            // }],
          } )( <Input placeholder='请输入用户首次登录奖励积分' addonAfter="分" /> )}
        </FormItem>
        <FormItem label='每日签到' {...this.formLayout}>
          {getFieldDecorator( 'dailySignScore', {
            initialValue: data.dailySignScore,
          } )( <Input placeholder='请输入用户每日签到奖励积分' addonAfter="分" /> )}
        </FormItem>
        <FormItem label='连续签到' {...this.formLayout}>
          {getFieldDecorator( 'linkSignScore', {
            initialValue: data.linkSignScore,
          } )( <Input placeholder='请输入用户连续签到第5天的签到积分' addonAfter="分" /> )}
        </FormItem>
        <FormItem label='只猜收盘' {...this.formLayout}>
          {getFieldDecorator( 'isLimitClose', {
            rules: [{ required: true, }],
            initialValue: data.isLimitClose === undefined ? 'true' : data.isLimitClose.toString()
          } )(
            <Radio.Group>
              <Radio value="true">开启</Radio>
              <Radio value="false">关闭</Radio>
            </Radio.Group>
          )}
          <span style={{ fontSize: 12, marginLeft: '20px' }}>*选择开启时，一天只竞猜一场</span>
        </FormItem>
        <FormItem label='提前猜下期' {...this.formLayout}>
          {getFieldDecorator( 'isAdvance', {
            rules: [{ required: true, }],
            initialValue: data.isAdvance === undefined ? 'true' : data.isAdvance.toString()
          } )(
            <Radio.Group>
              <Radio value="true">开启</Radio>
              <Radio value="false">关闭</Radio>
            </Radio.Group>
          )}
          <span style={{ fontSize: 12, marginLeft: '20px' }}>*选择开启时，开启提前猜下期功能</span>
        </FormItem>
        {
          getFieldValue( 'isLimitClose' ) === 'true' &&
          <FormItem label='只猜收盘竞猜开始时间' {...this.formLayout}>
            {getFieldDecorator( 'closeStartTime', {
              initialValue: data.closeStartTime ? moment( data.closeStartTime, 'HH:mm:ss' ) : ''
            } )(
              <TimePicker defaultOpenValue={moment( '00:00:00', 'HH:mm:ss' )} />,
            )}
          </FormItem>
        }
        <FormItem label='专属活动' {...this.formLayout}>
          {getFieldDecorator( 'tripartiteScore', {
            initialValue: data.tripartiteScore,
          } )( <Input placeholder='请输入用户完成专属活动奖励积分,不填则不展示' addonAfter="分" /> )}
        </FormItem>
        <FormItem label='专属活动链接' {...this.formLayout}>
          {getFieldDecorator( 'tripartiteLink', {
            initialValue: tripartiteLink,
          } )( <Input placeholder='请输入专属活动跳转链接' /> )}
        </FormItem>
        <FormItem
          label={(
            <span>
              <span>瓜分上限 </span>
              <Tooltip title={<span>请输入瓜分上限（所投注积分倍数，结果向下取整），不填则不限制</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
            </span>
        )}
          {...this.formLayout}
        >
          {getFieldDecorator( 'rateHandle', {
            initialValue: data.rateHandle,
          } )( <Input placeholder='请输入瓜分上限（所投注积分倍数，结果向下取整），不填则不限制' addonAfter="倍" /> )}
        </FormItem>

        <FormItem label='是否使用外部积分' {...this.formLayout}>
          {getFieldDecorator( 'useOuterIntegral', {
            initialValue: data.useOuterIntegral === undefined ? false : data.useOuterIntegral,
          } )(
            <Radio.Group>
              <Radio value={false}>禁用</Radio>
              <Radio value>启用</Radio>
            </Radio.Group>
          )}
        </FormItem>

        {
          getFieldValue( 'useOuterIntegral' ) &&
          <FormItem label='外部积分商户' {...this.formLayout}>
            {getFieldDecorator( 'outerIntegralMerchant', {
              initialValue: data.outerIntegralMerchant,
              rules: [{ required: true }],
            } )(
              <Input placeholder='请输入外部积分商户' />
            )}
          </FormItem>
        }


        {/* <FormItem label='关联抽奖活动' {...this.formLayout}>
          {getFieldDecorator( 'relationActivityId', {
            initialValue: data.relationActivityId,
          } )( <Input placeholder='请输入关联抽奖活动ID，不填无关联抽奖活动' /> )}
        </FormItem> */}
        <FormItem label='签到奖励配置' {...this.formLayout}>
          {getFieldDecorator( 'signScoreList', {
            initialValue: signOptions,
          } )(
            <div>
              {this.renderSignDay()}
              <Button
                type="dashed"
                style={{ width: '50%', marginBottom: 8, marginLeft: '60px' }}
                icon="plus"
                onClick={() => this.addSignOption()}
              >
                添加天数配置
              </Button>
            </div>

          )}
        </FormItem>
      </Form>

    );
  }
}

export default IntegralSetting;


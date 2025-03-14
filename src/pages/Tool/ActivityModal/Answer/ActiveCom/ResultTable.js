import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Radio, message } from 'antd';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;


@connect()
@Form.create()
class ResultTable extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      data: props.data,
      resultState:props.data.resultType === undefined ? true : props.data.resultType,
      tipAtLeastNum:props.data.tipAtLeast || '',
      tipGoodValue:props.data.tipGood || '',
      tipSubGoodValue:props.data.tipSubGood || '',
      tipLotteryValue:props.data.tipLottery || '',

      tipRegretValue:props.data.tipRegret || '',
      tipSubRegretValue:props.data.tipSubRegret || '',
      tipRetryValue:props.data.tipRetry || '',

      tipOtherValue:props.data.tipOther || '',

    }
  }

  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () => {
    this.props.onPreview()
  };


  getValues = () =>{
    const { form } = this.props;
    const data = form.getFieldsValue();
    return data
    // return this.dealData( data )
  }



  // nameChange = ( e ) =>{
  //   this.setState( {
  //     nameValue:e.target.value
  //   }, ()=>{
  //     this.onPreview()
  //   } )
  // }  

  //  校验表单
  getHaveError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        haveError = true;
      }
    } );
    return haveError;
  };


  // onChange = ( e ) => {
  //   this.setState( { ruleValue:e.target.value } )
  //   clearTimeout( Timer );
  //   Timer = setTimeout( () => {
  //     this.onPreview()
  //   }, 1000 );
  // }


    // 添加或者编辑数据处理
  getHandleValues = () => {
    const { form, subjctNum } = this.props;
    let data = {}
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在答题结果里面输入必填项' )
        return
      }
      if( +( fieldsValue.tipAtLeast ) > +subjctNum ){
        isError = false
        message.error( '不可大于设置题目的数量' )
        return
      }
      data = fieldsValue
    } );
    if ( isError ) {
      return  data;
    }
    return false
  };

  // 输入框动态长度
  valueChange = ( e, type ) =>{
    this.setState( { [`${type}`]:e.target.value } )
  }

  resultTypeChange = ( e )=>{
    this.setState( { resultState: e.target.value } )
  }

  tipAtLeastChange = ( e )=>{
    // console.log( 'ee', e.target.value )
    this.setState( { tipAtLeastNum: e.target.value } )
  }


  render() {
    const { form: { getFieldDecorator }, getBasicRule } = this.props;
    const { data, resultState, tipAtLeastNum,
      tipGoodValue, tipSubGoodValue, tipLotteryValue,
      tipRegretValue, tipSubRegretValue, tipRetryValue, tipOtherValue 
    } = this.state;
    return (
      <div>
        <Form layout='horizontal' className={styles.formHeight} onSubmit={this.basicHandleSubmit}>
          <Title title='结果条件设置' />

          <FormItem label='“优秀”或抽奖需至少答对' style={{ display: 'flex', marginLeft: '12%', marginBottom: '10px' }}>
            {getFieldDecorator( 'tipAtLeast', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}“优秀”或抽奖需至少答对` },
              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }],
              initialValue: data.tipAtLeast,
              } )( <Input 
                onChange={this.tipAtLeastChange}
                min={0} 
                addonAfter='题'
                style={{ width:'150px', marginRight:20 }}
                type="number"
              /> )}
            <span style={{ fontSize:12 }}>（不可大于设置题目的数量）</span>
          </FormItem>
          <FormItem label='答题结果文案' {...this.formLayout}>
            {getFieldDecorator( 'resultType', {
              rules: [{ required: true, message: '请选择答题结果文案' }],
              initialValue:data.resultType || resultState
              // initialValue:data.resultType === undefined ? 'true' : data.resultType.toString()
            } )(
              <Radio.Group onChange={this.resultTypeChange}>
                <Radio value>自定义文案</Radio>
                <Radio value={false} disabled={getBasicRule()}>提示所得积分</Radio>
                <span style={{ fontSize:12 }}>（<span style={{ color:'#df0606', fontSize:15 }}>*</span>需在基础设置中设置积分规则）</span>
              </Radio.Group>
             )}
          </FormItem>

          <Title title='返回首页设置' />

          <FormItem label='首页链接' {...this.formLayout}>
            {getFieldDecorator( 'landingPageLink', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}首页链接` }],
              initialValue: data.landingPageLink
            } )(
              <Input placeholder="可输入落地页链接，不填默认回到问答活动首页"  />
            )}
          </FormItem>

          <Title title='结果文案设置' />
          <p style={{ marginLeft:'8%', fontSize:14, color:'#000' }}>答对{tipAtLeastNum || 0}题（含）以上显示</p>
          {
            resultState && 
            <FormItem label='大标题文案' {...this.formLayout}>
              {getFieldDecorator( 'tipGood', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}大标题文案` }],
                initialValue: data.tipGood,
              } )( 
                <Input
                  placeholder="请输入大标题提示文案，如：太棒了~"
                  onChange={( e )=>this.valueChange( e, 'tipGoodValue' )}
                  maxLength={15}
                  suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipGoodValue.length}/15</span>}
                />
              )}
            </FormItem>
          }
        

          <FormItem label='副标题文案' {...this.formLayout}> 
            {getFieldDecorator( 'tipSubGood', {
               rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}副标题文案` }],
              initialValue: data.tipSubGood,
            } )( 
              <Input
                placeholder="请输入大标题下方的副标题文案"
                onChange={( e )=>this.valueChange( e, 'tipSubGoodValue' )}
                maxLength={15}
                suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipSubGoodValue.length}/15</span>}
              /> 
            )}
          </FormItem>

          <FormItem label='右下角按钮文案' {...this.formLayout}> 
            {getFieldDecorator( 'tipLottery', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}右下角按钮文案` }],
              initialValue: data.tipLottery,
            } )( 
              <Input
                placeholder="请输入右下角按钮文案，不填默认为“立即抽奖”"
                onChange={( e )=>this.valueChange( e, 'tipLotteryValue' )}
                maxLength={4}
                suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipLotteryValue.length}/4</span>}
              />
            )}
          </FormItem>

          <p style={{ marginLeft:'8%', fontSize:14, color:'#000' }}>答对{tipAtLeastNum || 0}题以下显示</p>
          {
            resultState && 
            <FormItem label='大标题文案' {...this.formLayout}> 
              {getFieldDecorator( 'tipRegret', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}大标题文案` }],
                initialValue: data.tipRegret,
              } )( 
                <Input
                  placeholder="请输入大标题提示文案，如：很遗憾~"
                  onChange={( e )=>this.valueChange( e, 'tipRegretValue' )}
                  maxLength={15}
                  suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipRegretValue.length}/15</span>}
                />
              )}
            </FormItem>
          }

          <FormItem label='副标题文案' {...this.formLayout}> 
            {getFieldDecorator( 'tipSubRegret', {
               rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}副标题文案` }],
              initialValue: data.tipSubRegret,
            } )( 
              <Input 
                placeholder="请输入大标题下方的副标题文案"
                onChange={( e )=>this.valueChange( e, 'tipSubRegretValue' )}
                maxLength={15}
                suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipSubRegretValue.length}/15</span>}
              />
             )}
          </FormItem>

          <FormItem label='右下角按钮文案' {...this.formLayout}> 
            {getFieldDecorator( 'tipRetry', {
               rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}右下角按钮文案` }],
              initialValue: data.tipRetry,
            } )( 
              <Input
                placeholder="请输入右下角按钮文案，不填默认为“再来一次”"
                onChange={( e )=>this.valueChange( e, 'tipRetryValue' )}
                maxLength={4}
                suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipRetryValue.length}/4</span>}
              />
            )}
          </FormItem>
          
          <Title title='其他文案设置' />
          <FormItem label='其他提示文案' {...this.formLayout}> 
            {getFieldDecorator( 'tipOther', {
               rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}其他提示文案` }],
              initialValue: data.tipOther,
            } )( 
              <Input
                placeholder="请输入按钮上方的其他提示文案，如：题目来源XXXX"
                onChange={( e )=>this.valueChange( e, 'tipOtherValue' )}
                maxLength={15}
                suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipOtherValue.length}/15</span>}
              />
            )}
          </FormItem>
        </Form>
      </div>

    );
  }
}

export default ResultTable;

const Title = ( { title, msg = '' } ) =>{
  let text = msg
  switch ( title ) {
    case '结果条件设置': text = '用于区分“优秀”和“遗憾”两种结果文案，或判断是否达到抽奖条件'; break;
    case '返回首页设置': text = '设置返回首页的地址'; break;
    case '结果文案设置': text = '设置答题结果页可修改的文案'; break;
    default:
  }
  return (
    <div style={{ marginLeft:'6%', display:'flex' }}>
      <div
        style={{
          fontWeight: '700',
          fontSize: 15,
          color:'#000',
          marginRight:'15px'
        }}
      >
        {title}
      </div>
      {
        text && <p style={{ fontSize:13, color:'#df0606', marginTop:2 }}>{text}</p>
      }
    </div>
  )
}

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, message, Radio } from 'antd';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;
const re = new RegExp( "^(\\d|[1-9]\\d|100)$" );

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
      tipGoodValue:props.data.tipGood || '',
      tipSubGoodValue:props.data.tipSubGood || '',
      tipLotteryValue:props.data.tipLottery || '',

      tipRegretValue:props.data.tipRegret || '',
      tipSubRegretValue:props.data.tipSubRegret || '',
      tipRetryValue:props.data.tipRetry || '',

      tipOtherValue:props.data.tipOther || '',

      drawCondition:props.data.drawCondition === undefined ? true : props.data.drawCondition,  // 抽奖条件

      rateLow:props.data.rateLow || 0,
      rateHigh:props.data.rateHigh || 100,
      showHint:false

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
    return form.getFieldsValue()
  }

  drawConditionChange = ( e )=>{
    this.setState( { drawCondition:e.target.value }, ()=>this.onPreview() )
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
    const { showHint }=this.state;
    let haveError = showHint;
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
    const { form } = this.props;
    let data = {}
    let isError = true;
    const { showHint, rateLow, rateHigh }=this.state;
    if( showHint ){
      isError = false
      message.error( '机器人准确率为0~100的正整数' )
      // return
    }
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在答题结果里面输入必填项' )
        return
      }
      data = Object.assign( { ...fieldsValue, rateLow, rateHigh } ) 
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

  setRate=( e, type )=>{
    const num = e.target.value;
    if( re.test( num ) ){
      this.setState( {
        showHint:false,
        [type]:num
      } )
      }else{
        this.setState( {
          showHint:true,
          [type]:num
        } )
      }
  }


  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { data, tipGoodValue, tipSubGoodValue, tipLotteryValue,
      tipRegretValue, tipSubRegretValue, tipRetryValue, tipOtherValue,
      drawCondition, rateLow, rateHigh, showHint
    } = this.state;
    console.log( 'rateLow, rateHigh', rateLow, rateHigh )

    return (
      <div>
        <Form layout='horizontal' className={styles.formHeight} onSubmit={this.basicHandleSubmit}>
          <Title title='抽奖条件设置' />
          <FormItem label='抽奖满足条件' {...this.formLayout}>
            {getFieldDecorator( 'drawCondition', {
              rules: [{ required: true, } ],
              initialValue: data.drawCondition || drawCondition
            } )(
              <Radio.Group onChange={this.drawConditionChange}>
                <Radio value={false}>参与游戏</Radio>
                <Radio value>吃鸡成功</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <Title title='机器人准确率设置' />
          <div style={{ display:'flex', alignItems:'center', margin:'8px 0 25px 10%' }}>
            <div>每题答对概率：</div>
            <Input
              type='number'
              style={{ width:150 }}
              min={0}
              max={100}
              addonAfter='%'
              value={rateLow}
              onChange={( e )=>this.setRate( e, 'rateLow' )}
            />
            <div style={{ margin:'0 10px' }}>~</div>
            <Input
              type='number'
              style={{ width:150 }}
              min={0}
              max={100}
              addonAfter='%'
              value={rateHigh}
              onChange={( e )=>this.setRate( e, 'rateHigh' )}
            />
            {
              showHint && <div style={{ fontSize:13, color:'#df0606', marginLeft:10 }}>只能输入0~100的正整数</div>
            }
          </div>

          <Title title='结果文案设置' />
          <p style={{ marginLeft:'8%', fontSize:14, color:'#000' }}>吃鸡成功显示</p>
          <FormItem label='大标题文案' {...this.formLayout}>
            {getFieldDecorator( 'tipGood', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}大标题文案` }],
                initialValue: data.tipGood,
              } )( 
                <Input
                  placeholder="请输入大标题提示文案，如：大吉大利，今晚吃鸡"
                  onChange={( e )=>this.valueChange( e, 'tipGoodValue' )}
                  maxLength={15}
                  suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipGoodValue.length}/15</span>}
                />
              )}
          </FormItem>

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

          <p style={{ marginLeft:'8%', fontSize:14, color:'#000' }}>吃鸡失败显示</p>
          <FormItem label='大标题文案' {...this.formLayout}> 
            {getFieldDecorator( 'tipRegret', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}大标题文案` }],
                initialValue: data.tipRegret,
              } )( 
                <Input
                  placeholder="请输入大标题提示文案，如：再接再厉～"
                  onChange={( e )=>this.valueChange( e, 'tipRegretValue' )}
                  maxLength={15}
                  suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{tipRegretValue.length}/15</span>}
                />
              )}
          </FormItem>
    

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
                placeholder={`请输入右下角按钮文案，不填默认为${!drawCondition?'“立即抽奖”':'“再来一次”'}`}
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
                placeholder="请输入按钮上方的其他提示文案，如：大吉大利，今晚吃鸡"
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

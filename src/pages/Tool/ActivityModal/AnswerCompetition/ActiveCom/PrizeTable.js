import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Radio, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PrizeCom from './PrizeCom'

const FormItem = Form.Item;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )
@Form.create()
class PrizeTable extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      lotteryRelative:props.data.lotteryRelative === undefined ? true : props.data.lotteryRelative,
    };
  }


  componentDidMount() {
    this.props.onRef( this )
  }

  

  onPreview = () => {
    this.props.onPreview()
  }

  
  getValues = () => {
    const { lotteryRelative } = this.state;
    let data;
    if( lotteryRelative ){
      const { form } = this.props;
      data = form.getFieldsValue();
    }else{
      const prizeListObj = this.prizeCom.getValues()
      data = Object.assign( lotteryRelative, prizeListObj )
    }
    return data
  }

  // 添加或者编辑数据处理
  getHandleValues = () => {
    const { lotteryRelative } = this.state;
    const {  form } = this.props;
    let data;
    let isError = true
    if( lotteryRelative ){
      form.validateFields( ( err, fieldsValue ) => {
        if ( err ) {
          isError = false
          message.error( '请在奖品配置里面输入必填项' )
          return
        }
        data = fieldsValue
      } );
    }else{
      const prizeListObj = this.prizeCom.getValues();
      const{ prizes } = prizeListObj
      if( prizes && prizes.length > 0 ){
        prizes.forEach( ( item )=>{
          const { prizeId } = item;
          if( prizeId === 'onWinPrize' ){
            // eslint-disable-next-line no-param-reassign
            item.prizeId = ''
          }
        } )
      }
      data = Object.assign( prizeListObj, { lotteryRelative } )
    }
    return  isError && data;
  }


  onChange =( e )=>{
    if( e.target.value === false ){
      const { form:{ setFieldsValue } } = this.props;
      setFieldsValue( {
        link:''
      } )
    }
    this.setState( { lotteryRelative:e.target.value } )
  }
 
  render() {
    const { form: { getFieldDecorator }, data, data:{ prizes }, onPreview  } = this.props;
    const { lotteryRelative } = this.state;

    return (
      <GridContent>
        <Form>
          <FormItem label='是否关联其他抽奖活动' style={{ display: 'flex', marginLeft: '5%', marginBottom: '10px' }}>
            {getFieldDecorator( 'lotteryRelative', {
                rules: [{ required: true, message: '请选择答题结果文案' }],
                initialValue:data.lotteryRelative || lotteryRelative
                // initialValue:data.resultType === undefined ? 'true' : data.resultType .toString()
              } )(
                <Radio.Group onChange={this.onChange}>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              )}
          </FormItem>

          {
            lotteryRelative &&
            <FormItem label='抽奖跳转链接' {...this.formLayout}>
              {getFieldDecorator( 'link', {
                rules: [{ required:true, message: `${formatMessage( { id: 'form.input' } )}抽奖跳转链接` }],
                initialValue: data.link
              } )(
                <Input placeholder="可输入其他抽奖活动链接，满足抽奖条件后跳转该链接进行抽奖"  />
              )}
            </FormItem>
          }

        </Form>
        {
          lotteryRelative === false &&
          <div>
            <div style={{ display:'flex', marginLeft:'6%' }}>
              <div>提示：</div>
              <div>
                未配置奖品，将无抽奖流程<br />
                增加数量时，直接点击数量右侧按钮进行增加<br />
                减少数量时，需先将概率调整为0，或者将活动更改为非进行中
              </div>
            </div>
            <div style={{ width:'90%', margin:'20px auto' }}>
              <PrizeCom
                onRef={( ref ) =>{this.prizeCom = ref}}
                prizes={prizes}
                onPreview={onPreview}
              />
            </div>

          </div>
        }

      </GridContent>
    );
  }
}

export default PrizeTable;
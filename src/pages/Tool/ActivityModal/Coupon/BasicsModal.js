import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Alert, Radio, Row, Col, message } from 'antd';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;

let Timer;
@connect()
@Form.create()
class BasicModal extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      data: props.data,
      nameValue:props.data.name || '',
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
    const data = form.getFieldsValue()
    return data
    // return this.dealData( data )
  }

  nameChange = ( e ) =>{
    this.setState( {
      nameValue:e.target.value
    }, ()=>{
      this.onPreview()
    } )
  }

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


  onChange = ( e ) => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 1000 );
  }


  onChangeUserAttendCount =()=>{
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 500 );
  }


  basicHandleSubmit = () => {
    const {  form } = this.props;
    let data = {}
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在基础设置里面输入必填项' )
        return
      }
      data = fieldsValue
    } );
    return  isError && data;
  };


  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { data, nameValue } = this.state;
    return (
      <div>
        <Form layout='horizontal' className={styles.formHeight} onSubmit={this.basicHandleSubmit}>
          <Title title='基本信息' />
          <FormItem label='活动名称' {...this.formLayout}>
            {getFieldDecorator( 'name', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动名称` }],
            initialValue: data.name,
            } )( <Input
              placeholder={`${formatMessage( { id: 'form.input' } )}活动名称`}
              maxLength={20}
              onChange={this.nameChange}
              suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{nameValue.length}/20</span>}

            /> )}
          </FormItem>
          <FormItem label='活动规则' {...this.formLayout}>
            {getFieldDecorator( 'ruleImg', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动规则` }],
              initialValue: data.ruleImg,
            } )( <TextArea
              rows={4}
              onChange={this.onChange}
              placeholder='请输入活动规则'
              className={styles.collect_edit_rule}
            /> )}
          </FormItem>

          <FormItem label='活动状态' {...this.formLayout}>
            {getFieldDecorator( 'isSale', {
              rules: [{ required: true, }],
              initialValue: data.isSale===undefined ? 'true' : data.isSale.toString()
            } )(
              <Radio.Group disabled={!data.id}>
                <Radio value="true">启用</Radio>
                <Radio value="false">禁用</Radio>
              </Radio.Group>
            )}
            <span style={{ fontSize:12, marginLeft:'20px' }}>*选择禁用时，活动页面将无法访问</span>
          </FormItem>

          <Title title='高级选项' />
          <FormItem
            style={{ paddingTop: 20 }}
            extra={( <div>*埋点统计用于记录用户参与活动、查看我的奖品、查看活动规则、完成任务等数据</div> )}
            label='埋点统计'
            {...this.formLayout}
          > <Alert
            style={{ position:'absolute', top: -40, width:'100%' }}
            className={styles.edit_alert}
            message={(
              <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <span>埋点统计需要先添加关联活动并创建appid</span>
                <u style={{ color: '#1890FF', cursor:'pointer' }} onClick={() => { window.open( `${window.location.origin}/statistics/app` )}}>数据运营-埋点统计</u>
              </div> )}
            banner
          />
            {getFieldDecorator( 'buryPointId', {
              initialValue: data.buryPointId,
            } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}活动对应的appid，用于统计用户行为数据`} /> )}
          </FormItem>
        </Form>
      </div>

    );
  }
}

export default BasicModal;

const Title = ( { title } ) =>
  (
    <Row>
      <Col
        span={4}
        style={{
          fontWeight: 'bold',
          textAlign: 'right',
          paddingRight: 10,
          fontSize: 16,
          marginBottom:20
        }}
      >
        {title}
      </Col>
    </Row>
  )

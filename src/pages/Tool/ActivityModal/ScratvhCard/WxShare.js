import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, message } from 'antd';
import UploadImg from '@/components/UploadImg';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;

// let Timer;
@connect()
@Form.create()
class WxShare extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      data: props.data,
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


    // 添加或者编辑数据处理
  getHandleValues = () => {
    const { form } = this.props;
    let data = {}
    let isError = true
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        isError = false
        message.error( '请在微信分享里面输入必填项' )
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


  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { data } = this.state;
    return (
      <div>
        <Form layout='horizontal' className={styles.formHeight} onSubmit={this.basicHandleSubmit}>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }} 
            label='分享标题'
            {...this.formLayout}
          >
            {getFieldDecorator( 'shareTitle', {
              initialValue: data.shareTitle,
            } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`} /> )}
          </FormItem>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }} 
            label='分享描述'
            {...this.formLayout}
          >
            {getFieldDecorator( 'shareDescription', {
              initialValue: data.shareDescription,
            } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享描述`} /> )}
          </FormItem>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }} 
            label='分享链接'
            {...this.formLayout}
          >
            {getFieldDecorator( 'shareLink', {
              initialValue: data.shareLink,
            } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享链接，不填默认本活动链接`} /> )}
          </FormItem>
          <FormItem
            label='分享图标'
            {...this.formLayout}
          >
            {getFieldDecorator( 'shareImg', {
                      initialValue: data.shareImg,
                    } )( <UploadImg onChange={this.imgChang} /> )}
            <div
              style={
                     { 
                       position: 'absolute', 
                       top:0, left:'125px', 
                       width:'180px',
                       fontSize: 13,
                       color: '#999', 
                       lineHeight:2,
                       marginTop:'10px'
                       }
                     }
            >
              <div>格式：jpg/jpeg/png </div>
              <div>建议尺寸：200px*200px</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </FormItem>
        </Form>
      </div>

    );
  }
}

export default WxShare;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, message } from 'antd';
import UploadImg from '@/components/UploadImg';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect()
@Form.create()
class WxModal extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
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

  
  getValues = () =>{
    const { form } = this.props;
    const data = form.getFieldsValue()
    return  data
  }

  getData = () =>{
    const { form } = this.props;
    const data = form.getFieldsValue()
    return  data
  }

  onPreview = () => {
    this.props.onPreview()
  };


  // handleSubmit = () => {
  //   const {  form } = this.props;
  //   let data = {}
  //   let isError = true
  //   form.validateFields( ( err, fieldsValue ) => {
  //     if ( err ) {
  //       isError = false;
  //       message.error( '请在基础设置里面输入必填项' )
  //       return
  //     }
  //     data = fieldsValue
  //   } );
  //   return  isError && data;
  // };



  render() {
    const { form: { getFieldDecorator } } = this.props;
    const{ data={} }=this.state;
    return (
      <Form layout='horizontal' className={styles.formHeight} onSubmit={this.basicHandleSubmit}>
        <p style={{ color:'#D1261B', marginLeft:'10%' }}>（选填）微信分享</p>
        <FormItem label='分享标题' {...this.formLayout}>
          {getFieldDecorator( 'shareTitle', {
              initialValue: data.shareTitle,
            } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`} /> )}
        </FormItem>

        <FormItem label='分享描述' {...this.formLayout}>
          {getFieldDecorator( 'shareDescription', {
              initialValue: data.shareDescription,
            } )( <TextArea rows={4} placeholder='请输入分享描述' /> )}
        </FormItem>

        <FormItem label='分享链接' {...this.formLayout}>
          {getFieldDecorator( 'shareLink', {
              initialValue: data.shareLink,
            } )( <Input placeholder='请输入分享链接，不填默认本活动链接' /> )}
        </FormItem>

        <FormItem label='分享图标' {...this.formLayout}>
          {getFieldDecorator( 'shareImg', {
              initialValue: data.shareImg,
            } )( <UploadImg /> )}
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

    );
  }
}

export default WxModal;

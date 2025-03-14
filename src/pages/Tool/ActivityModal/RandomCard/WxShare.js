import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import UploadImg from '@/components/UploadImg';
import { Input, Form } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect()
@Form.create()
class WxShare extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };


  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }


  //  提交数据
  getData = () =>{
    const { form }=this.props;
    const data = form.getFieldsValue();
    return data
  }

  // //  表单数据
  // getValues = () => {
  //   const { form }=this.props;
  //   const data = form.getFieldsValue();
  //   return data
  // }


  render() {
    const { form: { getFieldDecorator }, data  } = this.props;

    return (
      <GridContent>
        <div className={styles.red_rain_prize}>
          <div className={styles.red_share_title}>（选填）微信分享</div>
          <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
            <FormItem label='分享标题' {...this.formLayout}>
              {getFieldDecorator( 'shareTitle', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}分享标题` }],
                initialValue: data.shareTitle,
              } )( <TextArea rows={2} placeholder="请输入分享标题" /> )}
            </FormItem>

            <FormItem label='分享描述' {...this.formLayout}>
              {getFieldDecorator( 'shareDescription', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}分享描述` }],
                initialValue: data.shareDescription,
              } )( <TextArea rows={2} placeholder="请输入分享描述" /> )}
            </FormItem> 

            <FormItem label='分享链接' {...this.formLayout}>
              {getFieldDecorator( 'shareLink', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}分享链接` }],
                initialValue: data.shareLink,
              } )( <Input placeholder="请输入分享链接，不填默认本活动链接" /> )}
            </FormItem>

            <FormItem label='分享图标' {...this.formLayout}>
              {getFieldDecorator( 'shareImg', {
                initialValue: data.shareImg,
              } )( <UploadImg onChange={this.imgChang} /> )}
              <div
                style={
                  { 
                    position: 'absolute', 
                    top:'5px', left:'125px', 
                    width:'180px',
                    fontSize: 12,
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
     
      </GridContent>
    );
  }
}

export default WxShare;

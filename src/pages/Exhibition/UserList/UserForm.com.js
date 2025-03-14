import React, { PureComponent } from 'react';
import { Form, Input,  Modal,  } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import CompanyForm from '../CompanyForm';

const FormItem = Form.Item;



@connect()
@Form.create()
class UserForm extends PureComponent {
  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  compayForm=null

  constructor( props ) {
    super( props );
    this.state = {
      info:{},
      buttonLoading:false
    };

  }

  componentDidMount() {
  }

  static getDerivedStateFromProps( nextProps, preState ){
    if( nextProps.info !== preState.info ){
      return {
        info:nextProps.info,
      }
    }
    return null
  }

  handleOk = () => {
    const { form, dispatch, saveBack } = this.props;
    const { info } = this.state;
    const companyValues = this.compayForm.getValues();
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      this.setState( { buttonLoading:true } )
      const params = Object.assign( info, companyValues, fieldsValue, { isAdvisor:true }  ) ;
      const isUpdate = !!info.id;
      dispatch( {
        type: 'exhibition/submitUser',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            this.setState( { buttonLoading:false } )
            saveBack()
          },
        },
      } );
    } );
  }

  render() {

    const { form: { getFieldDecorator }, visible, onCancel } = this.props;

    const {  info, buttonLoading } = this.state;
    
    return (
      
      <Modal
        title={`${info.id ? '编辑' : '添加'}`}
        visible={visible}
        width={500}
        bodyStyle={{ padding: '12px 36px', maxHeight: '80vh', overflowY: 'auto', minHeight: '40vh' }}
        onCancel={onCancel}
        centered
        onOk={this.handleOk}
        okText="保存"
        confirmLoading={buttonLoading}
      >
        {
         visible && 
         <CompanyForm
           onRef={div => { this.compayForm = div }}
           formLayout={this.formLayout}
           layout='horizontal'
           selectWidth={200}
           info={info}
         />
       } 
        {
         visible && 
         <Form>
           <FormItem label='员工' {...this.formLayout}>
             {getFieldDecorator( 'name', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}员工` }],
                initialValue: info.name,
              } )( <Input
                onChange={this.onChangeUserAttendCount}
                placeholder='请输入员工'
                style={{ width: 200 }}
              /> )}
           </FormItem>
           <FormItem label='微信授权手机号' {...this.formLayout}>
             {getFieldDecorator( 'telephone', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}微信授权手机号` }],
                initialValue: info.telephone,
              } )( <Input
                onChange={this.onChangeUserAttendCount}
                placeholder='请输入手机号'
                style={{ width: 200 }}
              /> )}
           </FormItem>
         </Form>

       }
      </Modal>
    )
  }

}

export default UserForm;

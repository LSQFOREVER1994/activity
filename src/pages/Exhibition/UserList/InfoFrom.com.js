import React, { PureComponent } from 'react';
import { Form, Input, Modal, Select, Col } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import UploadImg from '@/components/UploadImg';

// import styles from '../exhibition.less';
import CompanyForm from '../CompanyForm';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const investTypeObj={
  POSITIVE:'积极型',
  NEGATIVE:'消极型',
  GROWTH:'成长型',
  VALUE:'价值型',
  MIX:'混合型'
}

// const initState = ( props ) => {
//   return {
//     previewVisibleaccountQrCode: false,
//     previewImageaccountQrCode: '',
//     fileListaccountQrCode: props.info.accountQrCode ? [{ url: props.info.accountQrCode, uid: props.info.accountQrCode }] : [],

//     previewVisiblewxQrCode: false,
//     previewImagewxQrCode: '',
//     fileListwxQrCode: props.info.wxQrCode ? [{ url: props.info.wxQrCode, uid: props.info.wxQrCode }] : [],
//   }
// }
@connect()
@Form.create()
class InfoForm extends PureComponent {
  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
    style: { width: '50%', display:'inline-block' }
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };

  formLayout2 = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
    style: { width: '33.333%', display:'inline-block' }
  };


  compayForm = null

  constructor( props ) {
    super( props );
    this.state = {
      info: {},
      buttonLoading: false,
      // ...initState( props )
    };

  }

  componentDidMount() {
  }

  static getDerivedStateFromProps( nextProps, preState ) {
    if ( nextProps.info !== preState.info ) {
      return {
        info: nextProps.info,
        // ...initState( nextProps )
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
      this.setState( { buttonLoading: true } )
      const params = Object.assign( info, companyValues, fieldsValue );
      const isUpdate = !!info.id;
      dispatch( {
        type: 'exhibition/submitUser',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            this.setState( { buttonLoading: false } )
            saveBack()
          },
        },
      } );
    } );
  }

  render() {

    const { form: { getFieldDecorator }, visible, onCancel } = this.props;
    const { info, buttonLoading, } = this.state;

    return (

      <Modal
        title="个人资料"
        visible={visible}
        width={800}
        bodyStyle={{ padding: '12px 36px', maxHeight: '80vh', overflowY: 'auto', minHeight: '40vh' }}
        onCancel={onCancel}
        centered
        onOk={this.handleOk}
        okText="保存"
        confirmLoading={buttonLoading}
      >
        {visible &&
          <Form>
            <FormItem label='员工' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}员工` }],
                initialValue: info.name,
              } )(
                <div>{info.name}</div>
              )}
            </FormItem>
            <FormItem label='性别' {...this.formLayout}>
              {getFieldDecorator( 'gender', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}性别` }],
                initialValue: info.gender,
              } )(
                <Select
                  onChange={this.firstChange}
                  placeholder="请选择性别"
                >
                  <Option value='MALE'>男</Option>
                  <Option value='FEMALE'>女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label='微信授权手机号' {...this.formLayout}>
              {getFieldDecorator( 'telephone', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}微信授权手机号` }],
                initialValue: info.telephone,
              } )( 
                <div>{info.telephone}</div>
              )}
            </FormItem>
            <FormItem label='微信号' {...this.formLayout}>
              {getFieldDecorator( 'wxNum', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}微信号` }],
                initialValue: info.wxNum,
              } )( <Input
                placeholder='请输入微信号'
                style={{ width: 200 }}
              /> )}
            </FormItem>
            <CompanyForm
              onRef={div => { this.compayForm = div }}
              formLayout={this.formLayout}
              layout='horizontal'
              selectWidth={200}
              info={info}
            />
            <FormItem label='部门' {...this.formLayout}>
              {getFieldDecorator( 'supplement', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}部门` }],
                initialValue: info.supplement,
              } )( <Input
                placeholder='请输入部门'
                style={{ width: 200 }}
              /> )}
            </FormItem>
            <FormItem label='职位' {...this.formLayout}>
              {getFieldDecorator( 'occupation', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}职位` }],
                initialValue: info.occupation,
              } )( <Input
                placeholder='请输入职位'
                style={{ width: 200 }}
              /> )}
            </FormItem>
            <FormItem label='从业年限' {...this.formLayout}>
              {getFieldDecorator( 'occupationYears', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}从业年限` }],
                initialValue: info.occupationYears,
              } )( <Input
                placeholder='请输入从业年限'
                style={{ width: 200 }}
              /> )}
            </FormItem>
            <FormItem label='证券职业编号' {...this.formLayout}>
              {getFieldDecorator( 'practisingNum', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}证券职业编号` }],
                initialValue: info.practisingNum,
              } )( <Input
                placeholder='请输入证券职业编号'
                style={{ width: 200 }}
              /> )}
            </FormItem>

            <FormItem label='员工号' {...this.formLayout}>
              {getFieldDecorator( 'employeeNum', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}员工号` }],
              initialValue: info.employeeNum,
              } )( <Input
                placeholder='请输入员工号'
                style={{ width: 200 }}
              /> )}
            </FormItem>

            <FormItem label='证书' {...this.formLayout}>
              {getFieldDecorator( 'certificate', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}证书` }],
                initialValue: info.certificate,
              } )( <Input
                placeholder='请输入证书'
                style={{ width: 200 }}
              /> )}
            </FormItem>

            <FormItem label='客服热线' {...this.formLayout}>
              {getFieldDecorator( 'hotline', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}客服热线` }],
                initialValue: info.hotline,
                } )( <Input
                  placeholder='请输入客服热线'
                  style={{ width: 200 }}
                /> )}
            </FormItem>

            <FormItem label='投资风格' {...this.formLayout}>
              {getFieldDecorator( 'investType', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}投资风格` }],
                initialValue: info.investType,
                } )( 
                  <Select style={{ width: 200 }}>
                    {
                      Object.keys( investTypeObj ).map( ( key )=>
                        <Option key={key}>{investTypeObj[key]}</Option>
                      )
                    }
                  </Select>
                )}
            </FormItem>

            <FormItem label='分支机构地址' {...this.formLayout1}>
              {getFieldDecorator( 'branchAddress', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}分支机构地址` }],
                initialValue: info.branchAddress,
              } )( <TextArea placeholder='请输入分支机构地址' /> )}
            </FormItem>

            <div style={{ paddingLeft:'5%' }}>
              <FormItem label='开户二维码' {...this.formLayout2}>
                {getFieldDecorator( 'accountQrCode', {
                rules: [{ required: false, message: '' }],
                initialValue: info.accountQrCode,
              } )( <UploadImg /> )}
              </FormItem>

              <FormItem label='证书图片' {...this.formLayout2}>
                {getFieldDecorator( 'certificateImg', {
                rules: [{ required: false, message: '' }],
                initialValue: info.certificateImg,
              } )( <UploadImg /> )}
              </FormItem>

              <FormItem label='微信二维码' {...this.formLayout2}>
                {getFieldDecorator( 'wxQrCode', {
                rules: [{ required: false, message: '' }],
                initialValue: info.wxQrCode,
              } )( <UploadImg /> )}
              </FormItem>
            </div>

            <FormItem label='个人介绍' {...this.formLayout1}>
              {getFieldDecorator( 'introduction', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}个人介绍` }],
                initialValue: info.introduction,
              } )( <TextArea
                placeholder='请输入个人介绍'
              // style={{ width: 200 }}
              /> )}
            </FormItem>
          </Form>
        }
      </Modal>
    )
  }

}

export default InfoForm;

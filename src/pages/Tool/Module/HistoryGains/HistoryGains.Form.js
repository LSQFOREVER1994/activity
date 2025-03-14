import React, { PureComponent, } from 'react';
import { Form, Input,  Modal } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import UploadImg from '@/components/UploadImg';

const FormItem = Form.Item;

@connect()
@Form.create()
class HistoryGains extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 4 },
  }

  formLayoutImage = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }

  formLayoutDate = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  }

  constructor( props ){
    const period = props.info.periods && props.info.periods.length > 0 ? props.info.periods[0] : {};
    super( props );
    this.state = {
      // banner图
      coverSrcbanner: '',
      imgagesSrcbanner: '',
      previewVisiblebanner: false,
      previewImagebanner: '',
      fileListbanner: props.info.banner ? [{ url: props.info.banner, uid: props.info.banner }] :  [],

      // snapshot图
      coverSrcsnapshot: '',
      imgagesSrcsnapshot: '',
      previewVisiblesnapshot: false,
      previewImagesnapshot: '',
      fileListsnapshot: period.snapshot ? [{ url: period.snapshot, uid: period.snapshot }] : [],
      // 背景图
      coverSrcbackground: '',
      imgagesSrcbackground: '',
      previewVisiblebackground: false,
      previewImagebackground: '',
      fileListbackground: props.info.background ? [{ url: props.info.background, uid: props.info.background }] : [],
      
      info: props.info || {},
      loading:false,
      period,
    };
  }


  // 取消自身模板
  handleCancel = () => {
    this.props.changeModal()
  };

  // 提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const {  form, dispatch } = this.props;
    const { info } = this.state;
    form.validateFields( ( err, values ) => {
      if( err ) return;
      this.setState( { loading:true } )
      dispatch( {
        type:'tool/submitHistoryCategory',
        payload:values,
        isUpdate: !!info.id,
        callFunc: ( data ) => {
          this.setState( { info: data, loading:false } )
          this.props.handleOk();
          this.handleCancel()
        }
      } )
    } )
  }

  
  // 打开图片预览
  PreviewFunc = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  PreviewFunc2 = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  uploadImg = ( res, type ) => {
    const list = this.state[`fileList${type}`];
    list[0] = res;
    this.setState( { [`fileList${type}`]: new Array( ...list ) } );
    this.props.form.setFieldsValue( { [type]:res.url } )

  }

  RemoveFunc = ( type ) => {
    this.setState( { [`fileList${type}`]: [] } );
    this.props.form.setFieldsValue( { [type]: '' } )
  }


  render() {
    const { form: { getFieldDecorator }, visible } = this.props;
    const { 
      fileListbanner, previewImagebanner, previewVisiblebanner, 
      fileListbackground, previewImagebackground, previewVisiblebackground, 
      info,
    } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };
    
    return (
      <Modal
        title={`${info.id ? '编辑' : '添加'}历史战绩`}
        visible={visible}
        width={1200}
        bodyStyle={{ padding:'12px 24px', maxHeight:'80vh', overflow: "auto" }}
        {...modalFooter}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="模版ID" {...this.formLayout}>
            {getFieldDecorator( 'id', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}模版ID` }],
              initialValue: info.id || '',
            } )(
              <Input
                style={{ width:350 }}
                placeholder={`${formatMessage( { id: 'form.input' } )}模版ID`} 
                disabled={!!info.id}
              />
            )}
          </FormItem>
          <FormItem label="模版名称" {...this.formLayout}>
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}模版名称` }],
              initialValue: info.name || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}模版名称`} style={{ width:350 }} />
            )}
          </FormItem>
          <FormItem label='banner图' {...this.formLayout}>
            {getFieldDecorator( 'banner', {
                  rules: [{ required: true, message: `请上传banner图` }],
                  initialValue: info.banner,
                } )(
                  <div style={{ height:110 }}>
                    <UploadImg
                      previewVisible={previewVisiblebanner}
                      previewImage={previewImagebanner}
                      fileList={fileListbanner}
                      CancelFunc={() => { this.CancelFunc( 'banner' ) }}
                      PreviewFunc={( e ) => { this.PreviewFunc2( e, 'banner' ) }}
                      ChangeFunc={( e ) => this.uploadImg( e, 'banner' )}
                      RemoveFunc={() => this.RemoveFunc( 'banner' )}
                    />
                  </div>
                )}
          </FormItem>
          <FormItem label='背景图' {...this.formLayout}>
            {getFieldDecorator( 'background', {
                  rules: [{ required: true, message: `请上传背景图` }],
                  initialValue: info.background,
                } )(
                  <div style={{ height: 110 }}>
                    <UploadImg
                      previewVisible={previewVisiblebackground}
                      previewImage={previewImagebackground}
                      fileList={fileListbackground}
                      CancelFunc={() => { this.CancelFunc( 'background' ) }}
                      PreviewFunc={( e ) => { this.PreviewFunc2( e, 'background' ) }}
                      ChangeFunc={e => this.uploadImg( e, 'background' )}
                      RemoveFunc={()=> this.RemoveFunc( 'background' )}
                    />
                  </div>
                )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default HistoryGains;

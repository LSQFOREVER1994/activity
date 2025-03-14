import React, { PureComponent, Fragment } from 'react';
import { Form, Col, Row, Input, Icon } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import UploadImg from '@/components/UploadImg';

const FormItem = Form.Item;
const initState = ( props ) => ( {
  previewVisible: false,
  previewImage: '',
  fileList: props.detail.image ? [{ url: props.detail.image, uid: props.detail.image, name: props.detail.image }] : [],
  detail: props.detail
} )

@connect()
@Form.create()
class LandingForm extends PureComponent {

  formLayoutImage = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }
  
  constructor( props ) {
    super( props );
    this.state = initState( props );
  }


  componentDidMount() {
    this.props.onRef( this )
  }

  static getDerivedStateFromProps( nextProps, prevState ){
    
    if ( nextProps.detail !== prevState.detail ) {
      return initState( nextProps )
    }
    return null;
  }

  // 打开图片预览
  PreviewFunc = ( file ) => {
    this.setState( { previewImage:file.url, previewVisible:true
    } );
  }

  PreviewFunc2 = ( file, ) => {
    this.setState( {
      previewImage: file.url, previewVisible: true
    } );
  }

  CancelFunc = () => this.setState( { previewVisible: false } );

  uploadImg = ( res ) => {
    const list = this.state.fileList;
    list[0] = res;
    this.setState( { fileList: new Array( ...list ) } );
    this.props.form.setFieldsValue( { image: res.url } )

  }

  RemoveFunc = () => {
    this.setState( { fileList: [] } );
    this.props.form.setFieldsValue( { image: '' } )
  }

  getValues = () => {
    const { form, detail } = this.props;
    let data = {};
    form.validateFields( ( err, values ) => {
      const { keys, ...Values } = values
      data = { ...detail, ...Values };
    } )
    if( JSON.stringify( data ) === '{}' ) return null;
    return data
  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState( { detail:null } )
  }

  //  提交
  handleSubmit = () => {
    const { form, detail } = this.props;
    let haveError = false
    let data = {};
    const showSettings = {};
    form.validateFields( ( err, values ) => {
      // console.log( 'validateFields', values )
      if ( err ) {
        haveError = err;
      }
      showSettings.image = values.image;
      showSettings.link = values.link;
      data = { ...detail, ...showSettings };
    } );
    if ( haveError ) return 'error';
    
    return data;
  };

  //  校验表单
  getFormError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        haveError = true;
      }
    } );
    return haveError;
  };

  onDelete = () => {    
     this.props.deleteDetail();
  }

  render() {

    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    const { previewVisible, previewImage, fileList, detail } = this.state;
    
    getFieldDecorator( 'keys', { initialValue: [detail] } );
    const keys = getFieldValue( 'keys' );
    
    const formItems = keys.map( ( k, index ) => (
      <Fragment key={k.id || index}>
        <Row style={{ marginTop:'10px' }}>
          <Col span={8} push={2}>
            <FormItem label='底部按钮' {...this.formLayoutImage}>
              {getFieldDecorator( `image`, {
                  rules: [{ required: false, message: `请上传底部按钮` }],
                  initialValue: k.image,
                } )(
                  <div style={{ height: 80 }}>
                    <UploadImg
                      previewVisible={previewVisible}
                      previewImage={previewImage}
                      fileList={fileList}
                      CancelFunc={() => { this.CancelFunc( ) }}
                      PreviewFunc={( e ) => { this.PreviewFunc2( e ) }}
                      ChangeFunc={( e ) => this.uploadImg( e )}
                      RemoveFunc={() => this.RemoveFunc()}
                    />
                  </div>
                )}
            </FormItem>
          </Col>
          <Col span={12} style={{ marginTop:'20px' }}>
            <FormItem label="按钮跳转链接" {...this.formLayoutImage}>
              {getFieldDecorator( 'link', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}按钮跳转链接` }],
                  initialValue: k.link || '',
                } )(
                  <Input
                    placeholder={`${formatMessage( { id: 'form.input' } )}按钮跳转链接`}
                    style={{ width: 300 }}
                  />
                )}
            </FormItem>
          </Col>
          
          <Col span={3} style={{ marginTop:'22px', fontSize:20, cursor:'pointer' }}>
            <Icon type="delete" onClick={this.onDelete} />
          </Col>
        </Row>
      </Fragment>
    ) );
    getFieldDecorator( 'key', { initialValue: ( detail && detail.key ) || '' } )
    return (
      <Form>
        <Row>
          {formItems}
        </Row>
      </Form>
    );
  }
}

export default LandingForm;


import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Col, Row, Input, Tooltip, Icon, Tabs } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import UploadImg from '@/components/UploadImg';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import RecordForm from './Landing.Form'

const FormItem = Form.Item;
const { TabPane } = Tabs;
const time = () => new Date().getTime();

@connect()
@Form.create()
class PurchasesRecordForm extends PureComponent {


  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 4 },
  }

  formLayoutEditor = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  }

  formLayoutImage = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }


  detailsForm = {}

  constructor( props ) {
    const details =  props.info && props.info.showSettings && props.info.showSettings.length > 0 ? props.info.showSettings : [];
    const Details = details.map( ( item, index ) => ( { ...item, key:time()+index } ) );

    super( props );
    this.state={
      // banner图
      coverSrcbanner: '',
      imgagesSrcbanner: '',
      previewVisiblebanner: false,
      previewImagebanner: '',
      fileListbanner: props.info.banner ? [{ url: props.info.banner, uid: props.info.banner }] : [],
      // 背景图
      coverSrcbackground: '',
      imgagesSrcbackground: '',
      previewVisiblebackground: false,
      previewImagebackground: '',
      fileListbackground: props.info.background ? [{ url: props.info.background, uid: props.info.background }] : [],

      info: props.info || {},
      details: Details,
      loading:false,
      listLoading:false,
      deleteLoading:false,
      deleteIds:[0],
    }

  }

  onRef = ( ref, key ) => {
    this.detailsForm[`detailsForm-${key}`] = ref
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


  addDetail = () => {
    const { details } = this.state;
    const newDetails = details.concat( { key:time() } );
    this.setState( { details:newDetails } )
  }

  deleteDetail = ( detail, index ) => {
    let { deleteIds } = this.state;
    if ( detail.id ) deleteIds = deleteIds.concat( [detail.id] )
    const { detailsForm } = this;
    const Details = [];
    Object.keys( detailsForm ).forEach( ( key ) => {
      const formData = detailsForm[key].getValues();
      detailsForm[key].formReset();
      Details.push( formData );
    } )

    const newDetails = Details.filter( ( item ) => item && item.key !== index )
    delete this.detailsForm[`detailForm-${index}`];
    this.setState( { details: newDetails, deleteIds } );
  }


  handleSubmit = ( e ) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { info } = this.state;
    const { detailsForm } = this;
    form.validateFields( ( err, values ) => {
      if ( err ) return;
      const details = [];
      Object.keys( detailsForm ).forEach( ( key ) => {
        const formData = detailsForm[key].handleSubmit();
        details.push( formData );
      } )

      const showSettingsList = details.map( item => {
        delete item.key
        return item
      } )

      values.showSettings = showSettingsList;

      dispatch( {
        type: 'tool/submitLandingPage',
        payload:values,
        isUpdate: !!info.id,
        callFunc: ( data ) => {
          this.setState( { info: data, loading: false } )
          this.props.handleOk();
        }
      } )
    } )
  }


  addDetail = () => {
    const { details } = this.state;
    const newDetails = details.concat( { key:time() } );
    this.setState( { details:newDetails } )
  }

  deleteDetail = ( detail, index ) => {
    let { deleteIds } = this.state;
    if ( detail.id ) deleteIds = deleteIds.concat( [detail.id] )
    const { detailsForm } = this;
    const Details = [];
    Object.keys( detailsForm ).forEach( ( key ) => {
      const formData = detailsForm[key].getValues();
      detailsForm[key].formReset();
      Details.push( formData );
    } )
    // const newDetails = Details.filter((item, Index) => Index !== index && item)
    const newDetails = Details.filter( ( item ) => item && item.key !== index )
    delete this.detailsForm[`detailForm-${index}`];
    this.setState( { details: newDetails, deleteIds } );
    
  }


  render() {

    const { form: { getFieldDecorator } } = this.props;
    const {
      fileListbanner, previewImagebanner, previewVisiblebanner,
      fileListbackground, previewImagebackground, previewVisiblebackground, 
      details,
      info, loading
    } = this.state;

    return (
      <Fragment>
        <Form>
          <FormItem label="模版ID" {...this.formLayout}>
            {getFieldDecorator( 'id', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}模版ID` }],
              initialValue: info.id || '',
            } )(
              <Input
                placeholder={`${formatMessage( { id: 'form.input' } )}模版ID`}
                disabled={!!info.id}
                style={{ width: 250 }}
              />
            )}
          </FormItem>
          <FormItem label="模版名称" {...this.formLayout}>
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}模版名称` }],
              initialValue: info.name || '',
            } )(
              <Input
                placeholder={`${formatMessage( { id: 'form.input' } )}模版名称`}
                style={{ width: 250 }}
              />
            )}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem label='banner图' {...this.formLayoutImage}>
                {getFieldDecorator( 'banner', {
                  rules: [{ required: false, message: `请上传banner图` }],
                  initialValue: info.banner,
                } )(
                  <div style={{ height: 110 }}>
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
            </Col>
            <Col span={12}>
              <FormItem label='背景图' {...this.formLayout}>
                {getFieldDecorator( 'background', {
                  rules: [{ required: false, message: `请上传背景图` }],
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
                      RemoveFunc={() => this.RemoveFunc( 'background' )}
                    />
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>

          <FormItem 
            label={(
              <span>banner文案
                <Tooltip title="加#号换行">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            {...this.formLayout}
          >
            {getFieldDecorator( 'bannerText', {
              rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}banner文案` }],
              initialValue: info.bannerText || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}banner文案`} style={{ width:250 }} />
            )}
          </FormItem>

          <Tabs defaultActiveKey="1" size='small'>
            <TabPane tab="*主介绍标题" key="1">
              <FormItem label="标题" {...this.formLayout}>
                {getFieldDecorator( 'mainTitle', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}主介绍标题` }],
                  initialValue: info.mainTitle || '',
                } )(
                  <Input
                    placeholder={`${formatMessage( { id: 'form.input' } )}主介绍标题`}
                    style={{ width: 250 }}
                  />
                )}
              </FormItem>
              <Row>
                <Col offset={4} span={20}>
                  <FormItem {...this.formLayoutEditor}>
                    {getFieldDecorator( 'mainContent', {
                      initialValue: info.mainContent,
                    } )(
                      <BraftEditor record={info.mainContent} fieldDecorator={getFieldDecorator} field="mainContent" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="副介绍标题" key="2">
              <FormItem label="标题" {...this.formLayout}>
                {getFieldDecorator( 'subTitle', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}副介绍标题` }],
                  initialValue: info.subTitle || '',
                } )(
                  <Input
                    placeholder={`${formatMessage( { id: 'form.input' } )}副介绍标题`}
                    style={{ width: 250 }}
                  />
                )}
              </FormItem>
              <Row>
                <Col offset={4} span={20}>
                  <FormItem {...this.formLayoutEditor}>
                    {getFieldDecorator( 'subContent', {
                      initialValue: info.subContent,
                    } )(
                      <BraftEditor record={info.subContent} fieldDecorator={getFieldDecorator} field="subContent" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          
          <FormItem label="底部按钮设置" {...this.formLayout}>
            <Button onClick={() => this.addDetail()}>添加</Button>
          </FormItem>

          {
            details.map( ( detail ) => 
              <RecordForm 
                detail={detail}
                onRef={( ref ) => { this.detailsForm[`detailForm-${detail.key}`] = ref}}
                key={`detail_${detail.key}`}
                deleteDetail={() => { this.deleteDetail( detail, detail.key )}}
              /> )
          }
          
        </Form>
        <Row style={{ textAlign: 'right', paddingTop: 12 }}>
          <Button onClick={this.handleSubmit} type="primary" loading={loading}>确定</Button>
        </Row>
      </Fragment>
    );
  }
}

export default PurchasesRecordForm;

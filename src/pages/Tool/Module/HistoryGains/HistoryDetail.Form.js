import React, { PureComponent, Fragment } from 'react';
import { Form, Col, Row, Input, DatePicker, Select, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import UploadImg from '@/components/UploadImg';

const FormItem = Form.Item;
const { Option } = Select;
const initState = ( props ) => ( {
  previewVisible: false,
  previewImage: '',
  fileList: props.detail.images ? [{ url: props.detail.images, uid: props.detail.images, name: props.detail.images }] : [],
  detail: props.detail
} )

@connect()
@Form.create()
class HistoryGains extends PureComponent {
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

  uploadImg = ( res, ) => {
    const list = this.state.fileList;
    list[0] = res;
    this.setState( { fileList: new Array( ...list ) } );
    this.props.form.setFieldsValue( { images: res.url } )

  }

  RemoveFunc = () => {
    this.setState( { fileList: [] } );
    this.props.form.setFieldsValue( { images: '' } )
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
    form.validateFields( ( err, values ) => {
      if ( err ) {
        haveError = err;
      }
      data = { ...detail, ...values };
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
        <Col span={3}>
          <FormItem>
            {getFieldDecorator( 'type', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}信号类型` }],
              initialValue: k.type || 'UP',
            } )(
              <Select
                placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.course' } )}信号类型`}
              >
                <Option key='UP'>看多</Option>
                <Option key='DOWN'>看空</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator( 'code', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}股票代码` }],
              initialValue: k.code || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}股票代码`} />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}股票名称` }],
              initialValue: k.name || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}股票名称`} />
            )}
          </FormItem>
        </Col>
        <Col span={5}>
          <FormItem>
            {getFieldDecorator( 'publishTime', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}推送日期` }],
              initialValue: k.publishTime ? moment( k.publishTime ) : undefined,
            } )(
              <DatePicker showTime />
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          <FormItem>
            {getFieldDecorator( 'change', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}涨幅` }],
              initialValue: k.change || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}涨幅`} />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator( 'remark', {
              initialValue: k.remark || '',
            } )(
              <Input placeholder={`${formatMessage( { id: 'form.input' } )}备注`} />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator( 'images', {
              // rules: [{ required: true, message: `请上传截图` }],
              initialValue: k.images || '',
            } )(
              <div>
                <UploadImg
                  listType='text'
                  bodyDom={( <div>上传</div> )}
                  bodyCls={styles.detailUploadImg}
                  previewVisible={previewVisible}
                  previewImage={previewImage}
                  fileList={fileList}
                  CancelFunc={() => { this.CancelFunc() }}
                  PreviewFunc={( e ) => { this.PreviewFunc2( e ) }}
                  ChangeFunc={e => this.uploadImg( e )}
                  RemoveFunc={e => this.RemoveFunc( e )}
                />
              </div>
            )}
          </FormItem>
        </Col>
      </Fragment>
    ) );
    getFieldDecorator( 'key', { initialValue: ( detail && detail.key ) || '' } )
    return (
      <Form>
        <Row className={styles.form_gains_detail}>
          {formItems}
          <Col span={2} style={{ fontSize:20, cursor:'pointer' }}>
            <Icon type="delete" onClick={this.onDelete} />
          </Col>
        </Row>
      </Form>
    );
  }
}

export default HistoryGains;

import React, { PureComponent } from 'react';
import { Form, Col, Row, Icon, Radio, Checkbox } from 'antd';
import { connect } from 'dva';
import styles from '../Lists.less';
import EditImageModal from './EditImageModal.com';

const time = () => new Date().getTime();

const FormItem = Form.Item;
@connect()
@Form.create()
class TemplateForm extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      record: props.record,
      imgVisible:false,
      imgInfo:null,
      details: props.record && props.record.details && props.record.details.length > 0 ? props.record.details.map( ( item, index ) => ( { ...item, key: `${time() + index}` } ) ): []
    };
  }


  componentDidMount() {
    this.props.onRef( this )
  }

  static getDerivedStateFromProps( nextProps, prevState ) {
    if ( nextProps.record !== prevState.record ) {
      const { record } = nextProps;
      return {
        record,
        imgVisible: false,
        details: record && record.details && record.details.length > 0 ? record.details.map( ( item, index ) => ( { ...item, key: `${time() + index}` } ) ) : []
      }
    }
    return null;
  }

  // 获取表单值
  getValues = () => {
    const { form } = this.props;
    const { details, record } = this.state;
    let data = {};
    form.validateFields( ( err, values ) => {
      const { keys, ...Values } = values
      data = { ...record, ...Values, details };
    } )
    if ( JSON.stringify( data ) === '{}' ) return null;
    return data
  }

  // 表单重置
  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState( { record: null } )
  }

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

  clickDel = ( data ) => {
    const details = this.state.details.filter( item => item.key !== data.key );
    this.setState( { details } )
  }

  addClick = ()=> {
    this.setState( { imgVisible: true, imgInfo: null  } )
  }

  changeImgVisible = ( imgVisible ) => {
    console.log(imgVisible);
    this.setState( { imgVisible } )
  }

  onDelete = () => {
    const { record, deleteClick } = this.props;
    deleteClick( record );
  }

  clickEdit = ( imgInfo ) => {
    this.setState( { imgVisible: true, imgInfo } )
  }

  imgHandleOk = ( value ) => {
    if( value.key ){
      const details = this.state.details.map( item => {
        if( item.key === value.key ) return value;
        return item
      } )
      this.setState( { details, imgVisible: false } )
    }else {
      const details = this.state.details.concat( [{ ...value, key: time() }] )
      this.setState( { details, imgVisible: false } )
    }
   
  }

  render() {

    const { form: { getFieldDecorator } } = this.props;
    const { record, imgVisible, details, imgInfo } = this.state;

    return (
      <Row>
        <Col span={5} offset={6}>
          {
            details && details.length > 0 ?
            details.map( item => 
              <ImgBox 
                clickEdit={this.clickEdit}
                clickDel={this.clickDel}
                data={item} 
                key={item.key}
                width={`${100 / details.length}%`}
              /> ) : <div style={{ height:40 }} />
          }

        </Col>
        <Col offset={1} span={11} className={styles.detail_rigth}>
          <Form layout="inline" name="subForm">
            <Icon
              type="plus-circle"
              onClick={this.addClick}
              style={{ fontSize:20, marginRight:15, position:'relative', top:8, cursor:'pointer' }}
            />
            <Icon 
              type="arrow-up"
              onClick={this.props.clickTop}
              style={{ fontSize: 20, marginRight: 15, position: 'relative', top: 8, cursor: 'pointer' }}
            />
            <FormItem>
              {getFieldDecorator( 'isSlide', {
                valuePropName: 'checked',
                initialValue:record.isSlide || false
              } )(
                <Checkbox>轮播</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator( 'isFixed', {
                valuePropName: 'checked',
                initialValue: record.isFixed || false
              } )(
                <Checkbox>固定底部</Checkbox>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator( 'state', {
                initialValue: record.state || 'DISABLE'
              } )(
                <Radio.Group>
                  <Radio value="ENABLE">上架</Radio>
                  <Radio value="DISABLE">下架</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <Icon 
              type="delete" 
              onClick={this.onDelete}
              style={{ fontSize:20,  position:'relative', top:8, cursor:'pointer' }} 
            />
          </Form>
        </Col>
        <EditImageModal
          info={imgInfo} 
          visible={imgVisible}
          handleCancel={this.changeImgVisible}
          handleOk={this.imgHandleOk}
        />
      </Row>
      
    );
  }
}

export default TemplateForm;


const ImgBox = ( { data, clickDel, clickEdit, width } ) => (
  <div className={styles.img_box} style={{ width }}>
    <img className={styles.img_box_pic} src={data.img} alt="" />
    <div className={styles.img_box_mask} />
    <Icon className={styles.img_box_del} type="close-circle" onClick={() =>{clickDel( data )}} />
    {data.link && <Icon className={styles.img_box_link} type="link" />}
    <Icon className={styles.img_box_edit} onClick={() => { clickEdit( data )}} type="edit" />
  </div>
)
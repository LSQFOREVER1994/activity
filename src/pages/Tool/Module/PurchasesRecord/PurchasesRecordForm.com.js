import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Col, Row, Input } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from '../../Lists.less';
import RecordForm from './Record.Form';

const FormItem = Form.Item;
const time = () => new Date().getTime();

@connect()
@Form.create()
class PurchasesRecordForm extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 4 },
  }

  recordForm = {}

  constructor( props ) {
    const list = props.info && props.info.records && props.info.records.length > 0 ? props.info.records : [];
    const List =list.map( ( item, index )=>( { ...item, key:time()+index } ) );
    super( props );
    this.state = {
      info: props.info || {},
      recordList: List,
      deleteIds:[0],
      loading:false
    };
  }


  onRef = ( ref, key ) => {
    this.recordForm[`recordForm-${key}`] = ref
  }

  handleSubmit = ( e ) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { info, deleteIds } = this.state;
    const { recordForm } = this;
    const id = info ? info.id : '';

    let haveError = false;
    Object.keys( recordForm ).forEach( ( key ) => {
      if ( recordForm[key].getFormError() ) haveError = true
    } )
    form.validateFields( ( err, values ) => {
      if ( err || haveError ) return;
      this.setState( { loading: true } )
      const params = id ? Object.assign( values, { id }, ) : values;
      const records = [];
      Object.keys( recordForm ).forEach( ( key ) => {
        const formData = recordForm[key].getValues();
        records.push( formData );
      } )

      dispatch( {
        type: 'tool/submitRecordTemplate',
        payload: {
          ...params,
          records,
          deleteIds
        },
        isUpdate: !!id,
        callFunc: ( data ) => {
          this.setState( { info: data, loading : false } )
          this.props.handleOk()
        }
      } )
    } )
  }

  addRecord = () => {
    const { recordList } = this.state;
    const newrecordList = recordList.concat( { key: time() } );
    this.setState( { recordList: newrecordList } )
  }

  deleteRecord = ( record, index ) => {
    let { deleteIds } = this.state;
    if ( record.id ) deleteIds = deleteIds.concat( [record.id] )
    const { recordForm } = this;
    const records = [];
    Object.keys( recordForm ).forEach( ( key ) => {
      const formData = recordForm[key].getValues();
      recordForm[key].formReset();
      records.push( formData );
      
    } )
    const newRecordList = records.filter( ( item ) => item && item.key !== index )
    delete this.recordForm[`recordForm-${index}`];
    this.setState( { recordList: newRecordList, deleteIds } );

  }

  render() {

    const { form: { getFieldDecorator } } = this.props;
    const {
      info, recordList, loading
    } = this.state;
    return (
      <Fragment>
        <Form>
          {/* <FormItem label="模版ID" {...this.formLayout}>
            {getFieldDecorator( 'id', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}模版ID` }],
              initialValue: info.id || '',
            } )(
              <Input 
                placeholder={`${formatMessage( { id: 'form.input' } )}模版ID`} 
                disabled={info.id} 
                style={{ width:250 }}
              />
            )}
          </FormItem> */}
          <FormItem label="记录名称" {...this.formLayout}>
            {getFieldDecorator( 'name', {
              rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}记录名称` }],
              initialValue: info.name || '',
            } )(
              <Input 
                placeholder={`${formatMessage( { id: 'form.input' } )}记录名称`} 
                style={{ width: 250 }}
              />
            )}
          </FormItem>
          <Row style={{ textAlign: 'center', fontWeight: 'bold', marginBottom:12 }} className={styles.form_gains_detail}>
            <Col offset={2} span={4}><span className={styles.form_before}>*</span>时间生成</Col>
            <Col span={6}><span className={styles.form_before}>*</span>时间</Col>
            <Col span={5}><span className={styles.form_before}>*</span>用户名</Col>
            <Col span={5}><span className={styles.form_before}>*</span>内容</Col>
          </Row>
          {recordList.map( item => (
            <RecordForm 
              key={item.key} 
              record={item} 
              onRef={( ref ) => { this.recordForm[`recordForm-${item.key}`] = ref }}
              deleteRecord={() => { this.deleteRecord( item, item.key ) }}
            />
          ) )}
          <Row>
            <Col offset={2} span={20}>
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8 }}
                icon="plus"
                onClick={() => this.addRecord()}
              >
                {formatMessage( { id: 'form.add' } )}
              </Button>
            </Col>
          </Row>
        </Form>
        <Row style={{ textAlign: 'right', paddingTop:12 }}>
          <Button onClick={this.handleSubmit} type="primary" loading={loading}>确定</Button>
        </Row>
      </Fragment>
    );
  }
}

export default PurchasesRecordForm;

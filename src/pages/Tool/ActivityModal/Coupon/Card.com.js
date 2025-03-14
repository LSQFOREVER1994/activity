import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Row, Col, DatePicker, Popconfirm } from 'antd';
import moment from 'moment';
import PrizeTable from './PrizeTable.com';
// import UploadImg from '@/components/UploadImg';
import styles from '../../Lists.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
// const backgroundCard = require( '../../../../../src/assets/backgroundCard.png' )

let Timer;
const initState = ( props ) => ( {

  previewImageimage: '',
  detail: props.detail,
  rangeTime: { receiveStartTime: props.detail.startTime, receiveEndTime: props.detail.endTime },
  useInventory: '',
  nameValue: ''
} )
@connect()
@Form.create()
class Card extends PureComponent {


  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };


  formLayout1 = {
    labelCol: { span: 2 },
    wrapperCol: { span: 18 },
  }

  constructor( props ) {
    super( props );
    this.state = initState( props );
  }


  static getDerivedStateFromProps( nextProps, prevState ) {

    if ( nextProps.detail !== prevState.detail ) {
      return initState( nextProps )
    }
    return null;
  }

  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () => {
    this.props.onPreview()
  }

  getValues = () => {
    const { form, detail } = this.props;
    let data = {};
    form.validateFields( ( err, values ) => {
      const { keys, ...Values } = values
      data = { ...detail, ...Values };
    } )
    if ( JSON.stringify( data ) === '{}' ) return null;
    return data
  }

  onChange = () => {
    clearTimeout( Timer );
    Timer = setTimeout( () => {
      this.onPreview()
    }, 1000 );
  }

  onChangeName = ( e ) => {
    this.setState( { nameValue: e.target.value }, () => {
      this.onChange()
    } )
  }

  getCardValues = ( isDel ) => {
    const { rangeTime: { receiveStartTime, receiveEndTime } } = this.state;
    const prizeList = this.prizeTable.getValues();

    const { list, deleteIds } = prizeList
    let List = [];
      List = list.map( item => ( { ...item, receiveStartTime, receiveEndTime, key: this.props.index } ) )
    if( isDel && list.length <= 0 ){
      List.push( { receiveStartTime, receiveEndTime } );
    }

    return { List, deleteIds, key: this.props.index }
  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState( { detail: null } )
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
      data = { detail, ...values };
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
        this.setState( { isOpen: true } )
        haveError = true;
      }
    } );
    return haveError;
  };

  onDelete = () => {
    this.props.deleteDetail();
  }

  rangeChange = ( data, dateString ) => {
    this.setState( {
      rangeTime: { receiveStartTime: dateString[0], receiveEndTime: dateString[1]  }
    } )


  }

  rangeOk= () => {
    this.props.onPreview()
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { isOpen, detail, rangeTime } = this.state;

    getFieldDecorator( 'key', { initialValue: ( detail && detail.key ) || '' } );
    getFieldDecorator( 'isOpen', { initialValue: isOpen } );

    return (
      <div className={styles.edit_acitve_card} style={{ height: isOpen ? 'unset' : 64, overflow: 'hidden', padding:'0 20px', paddingBottom: isOpen ? '20px' :  0 }}>
        <Row style={{ padding: '20px' }}>
          {
            isOpen ? (
              <Col span={20}>
                <Form onSubmit={this.handleSubmit}>
                  <div style={{ display: 'flex' }}>
                    <span style={{ marginTop:8, color:'#333' }}>抢券时间：</span>
                    <FormItem
                      style={{ marginBottom: 10 }}
                      extra="设置抢券时间，一天内可多次，不可重合，不可跨天"
                      {...this.formLayout1}
                    >
                      {getFieldDecorator( 'rangeTime', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
                  initialValue: rangeTime.receiveStartTime ? [moment( rangeTime.receiveStartTime, 'YYYY-MM-DD HH:mm:ss' ), moment( rangeTime.receiveEndTime, 'YYYY-MM-DD HH:mm:ss' )] : [],
                } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 270 }} onChange={this.rangeChange} onOk={this.rangeOk} /> )}
                    </FormItem>
                  </div>
                </Form>
              </Col> 
            ) : (
              <Col span={20} style={{ textAlign: 'left', paddingRight: 10, fontSize: 16 }}>
                抢券时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ `${rangeTime && rangeTime.receiveStartTime ?  moment( rangeTime.receiveStartTime ).format( 'MM-DD HH:mm:ss' ) :  '--'} ~ ${rangeTime && rangeTime.receiveEndTime ? moment( rangeTime.receiveEndTime ).format( 'MM-DD HH:mm:ss' ) : '--'}` }
              </Col>
            )
          }
      
          <Col span={4} style={{ textAlign: 'right', color: '#1890FF' }}>
            <span style={{ marginRight: 30, cursor: 'pointer' }} onClick={() => { this.setState( { isOpen: !isOpen } ) }}>{isOpen ? '收起' : '展开'}</span>
            <Popconfirm
              title="确认删除?"
              onConfirm={this.onDelete}
              // onCancel={cancel}
              placement='left'
              okText="确定"
              cancelText="取消"
            >
              <span style={{ cursor: 'pointer' }}>删除</span>
            </Popconfirm>
          </Col>
        </Row>

        <PrizeTable 
          onPreview={this.onPreview}
          onRef={( ref )=>{this.prizeTable = ref}}
          prizeList={detail.prizeList}
        />

      </div>

    );
  }
}

export default Card;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, InputNumber, Row, Col, Popconfirm } from 'antd';

import UploadImg from '@/components/UploadImg';
import styles from '../../Lists.less';

const FormItem = Form.Item;
// const backgroundCard = require( '../../../../../src/assets/backgroundCard.png' )

let Timer;
const initState = ( props ) => ( {
  detail: props.detail,
  isOpen: !!props.detail.isOpen,
  isSpecial: !!props.isSpecial,
  nameValue:''
} )
@connect()
@Form.create()
class Card extends PureComponent {


  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
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

  onPreview = () =>{
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
    this.setState( { nameValue:e.target.value }, ()=>{
      this.onChange()
    } )
  }

  getCardValues = () => {
    const { form } = this.props;
    const data = form.getFieldsValue()
    return data

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
      // console.log( 'validateFields', values )
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
        this.setState( { isOpen:true } )
        haveError = true;
      }
    } );
    return haveError;
  };

  onDelete = () => {
    this.props.deleteDetail();
  }

  //  图片切换
  imgChang=()=>{
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }

  render() {
    const { form: { getFieldDecorator }, cardIndex } = this.props;
    const {
      isOpen, detail, isSpecial, nameValue
    } = this.state;


    getFieldDecorator( 'key', { initialValue: ( detail && detail.key ) || '' } );
    getFieldDecorator( 'isOpen', { initialValue: isOpen } );

    return (
      <div className={styles.edit_acitve_card} style={{ height:isOpen ? 'unset':64, overflow:'hidden' }}>
        <Row style={{ padding: '20px 0' }}>
          <Col span={4} style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: 10, fontSize: 16 }}>卡片{cardIndex}</Col>
          <Col span={20} style={{ textAlign: 'right', paddingRight: 30, color: '#1890FF' }}>
            <span style={{ marginRight: 30, cursor: 'pointer' }} onClick={() => { this.setState( { isOpen: !isOpen } ) }}>{isOpen ? '收起' : '展开'}</span>
            <Popconfirm
              title="确认删除卡片?"
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

        <Form onSubmit={this.handleSubmit}>
          <div>
            <FormItem label='卡片名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}福卡名称` }],
                initialValue: detail.name,
              } )( <Input
                placeholder={`${formatMessage( { id: 'form.input' } )}福卡名称`}
                maxLength={4}
                onChange={this.onChangeName}
                suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{nameValue.length}/4</span>}
              /> )}
            </FormItem>
            <FormItem
              label='卡片正面'
              style={{ position:'relative' }}
              {...this.formLayout1}
            >
              {getFieldDecorator( 'image', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}图片` }],
                    initialValue: detail.image,
                  } )( <UploadImg onChange={this.imgChang} /> )}
              <div className={styles.collect_edit_card_size}>
                <div>格式：jpg/jpeg/png</div>
                <div>尺寸：600px*830px</div>
              </div>
            </FormItem>
            {/* <Col span={3}>
                <div className={styles.exampleCard}>
                  <div className={styles.cardStyle}>
                    <img src={backgroundCard} alt='' />
                  </div>
                  <div className={styles.exampleText}>
                    <span>示例图</span>
                    <Icon type="zoom-in" style={{ marginLeft: 3, marginTop: 1 }} onClick={( e ) => this.props.exampleCardMax( e, backgroundCard )} />
                  </div>
                </div>
              </Col> */}
            {isSpecial && 
              <FormItem label='卡片总库存' {...this.formLayout}>
                {getFieldDecorator( 'inventory', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}卡片总库存数量` }],
                initialValue: detail.inventory,
              } )( <Input
                placeholder={`${formatMessage( { id: 'form.input' } )}卡片总库存数量`}
                addonAfter='张'
              /> )}
              </FormItem>
            }
            {isSpecial && 
              <FormItem label='每日最多发放' {...this.formLayout}>
                {getFieldDecorator( 'dayMaxCount', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}每日最多发放的数量` }],
                initialValue: detail.dayMaxCount,
              } )( <Input placeholder='每日最多发放的数量' addonAfter='张' /> )}
              </FormItem>
            }
            <FormItem label='获得该卡的概率' {...this.formLayout}>
              {getFieldDecorator( 'probability', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}获得该卡的概率` }],
                initialValue: detail.probability,
              } )( <Input
                placeholder='获得该卡的概率'
                addonAfter='%'
                onChange={this.onChange}
              /> )}
            </FormItem>
            {isSpecial && 
            <FormItem
              label='排序值'
              {...this.formLayout}
            >
              {getFieldDecorator( 'sort', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}排序 ` }],
                initialValue: detail.sort || 1,
              } )( <InputNumber placeholder={`${formatMessage( { id: 'form.input' } )}排序`} step={1} min={1} max={999} style={{ width: '100%' }} /> )}
            </FormItem>
            }
          </div>
        </Form>
      </div>

    );
  }
}

export default Card;

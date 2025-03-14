import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  Form, Modal, Input } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../Lists.less';

const FormItem = Form.Item;
const { TextArea } = Input;


@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  sendCouponsVisible: strategyMall.sendCouponsVisible,
} ) )
@Form.create()
class SendCoupons extends PureComponent {

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };


  handleSubmit = ( e ) =>{
    e.preventDefault();
    const { dispatch, form, current, sendProBtnRef } = this.props;
    const id = current ? current.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = Object.assign( fieldsValue, { id } ) ;
      dispatch( {
        type:'strategyMall/sendCoupons',
        payload: {
          query:params,
          callFunc:()=>{
            
            dispatch( {
              type:'strategyMall/setSendCouponsVisible',
              payload: false,
            } )
          }
        },
      } )
      
    } )
    setTimeout( () => {
      if( sendProBtnRef ) {
        sendProBtnRef.blur();
      }
    }, 0 );
    
    
  }

 
  handleCancel = () =>{
    const { dispatch, sendProBtnRef } = this.props;
    dispatch( {
      type:'strategyMall/setSendCouponsVisible',
      payload: false,
    } )
    setTimeout( () => {
      if( sendProBtnRef ) {
        sendProBtnRef.blur();
      }
    }, 0 );
    
  }

  render() {
    const { sendCouponsVisible, form: { getFieldDecorator } } = this.props;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };
    
    return (
      <Modal
        maskClosable={false}
        title='发送优惠券'
        className={styles.standardListForm}
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={sendCouponsVisible}
        {...modalFooter}
      >
        <Form onSubmit={this.handleSubmit}>
          
          <FormItem label={formatMessage( { id: 'strategyMall.coupons.userIds' } )} {...this.formLayout}>
            {getFieldDecorator( 'usernames', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.userIds' } )}` }],
                  // initialValue: current.name,
                } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.userIds' } )}`} /> )}
          </FormItem>
          <div className={styles.infoPics}>用户ID用英文的逗号隔开，如：“id1,id2,id3”</div>
          <FormItem label={formatMessage( { id: 'strategyMall.coupons.channelNote' } )} {...this.formLayout}>
            {getFieldDecorator( 'channel', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.channelNote' } )}` }],
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.channelNote' } )}`} /> )}
          </FormItem>
             
        </Form>
      </Modal>
    );
  }
}

export default SendCoupons;
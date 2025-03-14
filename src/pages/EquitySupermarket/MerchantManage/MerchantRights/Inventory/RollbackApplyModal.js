import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Button, message, Modal, Form, Input } from 'antd'
import styles from './Inventory.less'

const { TextArea } = Input;
const FormItem = Form.Item;
@connect( ( { merchantRights } ) => {
  return {
    ...merchantRights
  }
} )
@Form.create()
class RollbackApply extends PureComponent {


  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  handleAgreeRollback = () => {
    const { id, merchantId, inventory } = this.props.inventoryInfo
    const { form, dispatch, handleCancel } = this.props;
    form.validateFields( ( err ) => {
      if ( err ) {
        return;
      }
      const reason = form.getFieldValue( 'cancelReason' )
      const amount = form.getFieldValue( 'amount' )
      if ( amount > inventory ) {
        message.warning( `最大可回退${inventory}!` )
        return
      } if ( amount <= 0 ) {
        message.warning( `回退数量不得小于等于0！` )
        return
      }
      dispatch( {
        type: 'merchantRights/rollbackRightsApply',
        payload: {
          merchantId,
          rightId: id,
          amount,
          reason
        },
        callBackFunc: ( res ) => {
          const { message: returnMessage, tip } = res
          if ( res.success ) {
            message.success( tip || returnMessage );
            handleCancel()
          }
        }
      } )
    } );
  }

  render() {
    const { visible, handleCancel, inventoryInfo, loading, form: { getFieldDecorator }, numFormat } = this.props;

    return (
      <Modal
        title="回退申请"
        className={styles.global_styles}
        destroyOnClose
        visible={visible}
        onOk={this.handleAgreeRollback}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleAgreeRollback}>保存</Button>,
        ]}
      >

        <FormItem label='回退数量' {...this.formLayout}>
          {getFieldDecorator( 'amount', {
            rules: [{ required: true, message: `请输入回退数量` },
            {
              pattern: inventoryInfo.productType === 'RED' ? new RegExp( /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/ ) : new RegExp( /^\+?[1-9][0-9]*$/ ),
              message: inventoryInfo.productType === 'RED' ? '请输入正确金额，最多支持两位小数！' : '请输入正整数！'
            }],
          } )( <Input placeholder='请输入回退数量' /> )}
        </FormItem>
        <FormItem label='回退原因' {...this.formLayout}>
          {getFieldDecorator( 'cancelReason', { rules: [{ required: true, message: `请输入回退原因` }], } )
            ( <TextArea maxLength={80} autoSize={{ minRows: 6, maxRows: 10 }} placeholder='请输入回退原因' /> )}
        </FormItem>
        <span>提示：最大可回退 {inventoryInfo.productType === 'RED' ? numFormat( inventoryInfo.inventory.toFixed( 2 ) ) : numFormat( inventoryInfo.inventory )}</span>
      </Modal>
    )
  }
}
export default RollbackApply;

import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Button, message, Modal, Form, Input, Select } from 'antd'
import styles from './Inventory.less'

const { Option } = Select
const FormItem = Form.Item;
@connect( ( { merchantRights } ) => {
  return {
    ...merchantRights
  }
} )
@Form.create()
class EditRatioModal extends PureComponent {
  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };


  updateRatio = () => {
    const { merchantCode, productId } = this.props.inventoryInfo
    const { form, dispatch, handleCancel } = this.props;
    form.validateFields( ( err ) => {
      if ( err ) {
        return;
      }
      const priceRatio = form.getFieldValue( 'priceRatio' )
      dispatch( {
        type: 'merchantRights/editPriceRatio',
        payload: {
          priceRatio,
          merchantCode,
          productId,
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
    const { visible, handleCancel, inventoryInfo, loading, merchantList, form: { getFieldDecorator } } = this.props;
    return (
      <Modal
        title="修改商户定价"
        className={styles.global_styles}
        destroyOnClose
        visible={visible}
        onOk={this.updateRatio}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.updateRatio}>保存</Button>,
        ]}
      >

        <FormItem label='商户名称' {...this.formLayout}>
          {getFieldDecorator( 'merchantCode', {
            initialValue: inventoryInfo.merchantId,
            rules: [{ required: true, message: '请选择一个商户' }]
          } )(
            <Select
              placeholder='请选择商户'
              style={{ width: 220 }}
              disabled
              showSearch
              optionFilterProp="children"
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
            >
              {Array.isArray( merchantList ) && merchantList.map( ( v ) => {
                return (
                  <Option key={`${v.id}`} value={v.id}>{v.name}</Option>
                )
              } )}
            </Select>
          )}
        </FormItem>
        <FormItem label='商户定价' {...this.formLayout}>
          {getFieldDecorator( 'priceRatio', {
            rules: [{ required: true, message: `请输入商户定价` }],
          } )(
            <Input
              type='number'
              placeholder="请输入商户定价"
              style={{ width: 220 }}
              maxLength={60}
            />
          )}
        </FormItem>

      </Modal>
    )
  }
}
export default EditRatioModal;

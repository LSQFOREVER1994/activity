import React, { PureComponent } from 'react';
import { Form, Input, message, Modal  } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
import ConfirmModal from '@/components/ConfirmModal';
import styles from '../product.less';

const FormItem = Form.Item;


@Form.create()
class AddModal extends PureComponent {
    formLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      };

      formLayout1 = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      };

      constructor( props ) {
        super( props );
        this.state = {
            modalLoading: false,
            confirmVisible: false,
        };
      };

      handleCancel = ( bool ) => {
        console.log( 'cancel', bool );
          const { cancel, form } = this.props;
          this.setState( {
            modalLoading: false
          } )
          form.resetFields();
          cancel( bool );
      }

      handleSubmit = ( e, bool ) => {
        e.preventDefault();
        const { form, dispatch, data = {} } = this.props;
        const { modalLoading } = this.state;
        if ( modalLoading ) return;
        this.setState( {
            modalLoading: true,
        }, () => {
            form.validateFields( ( err, fieldsValue ) => {
                if ( err ) {
                    this.setState( { modalLoading: false } );
                    return;
                }
                if ( !bool ) {
                  this.setState( {
                    modalLoading: false,
                    confirmVisible: true,
                  } )
                  return;
                }
                const params = { ...data, ...fieldsValue };
                console.log( 'sdcds', params );
                if ( !params.id ) {
                  params.state = true;
                }
                dispatch( {
                  type: 'product/editGoodCategory',
                  payload: params,
                  callFunc: ( text ) => {
                    this.setState( {
                      modalLoading: false,
                      confirmVisible: false,
                    } )
                    message.info( text );
                    this.handleCancel( true );
                  },
                } );
            } )
        } )

      }

      cancelConfirm = () => {
        this.setState( {
          confirmVisible: false,
        } )
      }

      render () {
          const { data = {}, visible, form: { getFieldDecorator } } = this.props;
          const { modalLoading, confirmVisible, confirmLoading } = this.state;
          const modalFooter = {
            okText: '保存',
            onOk: this.handleSubmit,
            onCancel: () => {this.handleCancel()},
            confirmLoading: modalLoading,
          };
          return (
            <Modal
              maskClosable={false}
              title={`${data && data.id ? '编辑' : '新增'}商品分类`}
              className={styles.standardListForm}
              width={666}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form>
                <FormItem label='分类名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: `请先输入分类名称` }],
                    initialValue: data.name,
                  } )(
                    <Input
                      autoComplete='off'
                      placeholder="输入分类名称"
                      size
                    />
                  )}
                </FormItem>
                <FormItem label='排序' {...this.formLayout}>
                  {getFieldDecorator( 'sort', {
                    rules: [{ required: false, message: `请先输入排序` }],
                    initialValue: data.sort,
                  } )(
                    <Input
                      autoComplete='off'
                      type='number'
                      placeholder="输入排序"
                      size
                    />
                  )}
                </FormItem>
                {/* <FormItem label='是否上架' {...this.formLayout}>
                  {getFieldDecorator( 'state', {
                    rules: [{ required: true, message: `是否上架` }],
                    valuePropName: 'checked',
                    initialValue: data.state
                  } )(
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                  )}
                </FormItem> */}
                <FormItem label="分类图片" {...this.formLayout}>
                  {getFieldDecorator( 'icon', {
                    rules: [{ required: true, message: `请先上传分类图片` }],
                    initialValue: data.icon ? data.icon : '',
                  } )( <UploadModal /> )}
                </FormItem>
              </Form>
              <ConfirmModal loading={confirmLoading} visible={confirmVisible} text={data.id ? '修改' : '添加'} cancel={this.cancelConfirm} confirm={this.handleSubmit} />
            </Modal>
          )
      }
}

export default AddModal;

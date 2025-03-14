/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  message, Modal, Input, Form, Switch, Row, Spin } from 'antd';
import debounce from "lodash/debounce";
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from '../GoodsClassifyList.less'

const FormItem = Form.Item
const { TextArea } = Input
@connect( ( { equityGoodsClassify } ) => {
  return {
    ...equityGoodsClassify
  }
} )
@Form.create()
class LevelOneModal extends PureComponent {
  formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  }

  constructor( props ) {
    super( props );
    this.state = { }

    this.fetchGoodsClassifyAdd = debounce( this.fetchGoodsClassifyAdd.bind( this ), 700 )
    this.fetchGoodsClassifyAUpdate = debounce( this.fetchGoodsClassifyAUpdate.bind( this ), 700 )
  }

  //  添加分类
  fetchGoodsClassifyAdd = ( params ) => {
    const { dispatch, handleModalVisible, getNewGoodsClassifyList, getAllLevelOneId, form:{ resetFields } } = this.props
    dispatch( {
      type: 'equityGoodsClassify/fetchGoodsClassifyAdd',
      payload: params,
      callBackFunc: ( res ) => {
        if ( res.success ) {
          message.success( '添加一级分类成功' )
          handleModalVisible( 'one' )
          getNewGoodsClassifyList()
          getAllLevelOneId()
          resetFields()
        }
      }
    } )

  }

  //  修改分类
  fetchGoodsClassifyAUpdate = ( params ) => {
    const { dispatch, handleModalVisible, getNewGoodsClassifyList, getAllLevelOneId } = this.props
    dispatch( {
      type: 'equityGoodsClassify/fetchGoodsClassifyUpDate',
      payload: params,
      callBackFunc: ( res ) => {
        if ( res.success ) {
          message.success( '修改商品分类成功' )
          handleModalVisible( 'one' )
          getNewGoodsClassifyList()
          getAllLevelOneId()
        }
      }
    } )

  }


  // 处理添加分类的表单项
  handleAddClassify = () => {
    const {
      form: { validateFields },
      isAdd,
      lineData,
      loading
    } = this.props

    const { id } = lineData

    let params = { id }
    if( loading ) return
    validateFields( ( err, values ) => {
      values.status = values.status ? 1 : 0
      params = Object.assign( params, values )
      if ( err ) {
        message.error( '请填写正确的分类信息' )
      } else if( isAdd ){
          this.fetchGoodsClassifyAdd( params )
        } else {
          this.fetchGoodsClassifyAUpdate( params )
        }
    } )
  }

  render() {
    const {
      form: { getFieldDecorator, resetFields },
      levelOneVisible,
      lineData,
      isAdd,
      handleModalVisible,
      loading
    } = this.props
    const { name, status, sort, img, description } = lineData
    return (
      <Modal
        className={styles.global_styles}
        title={isAdd ? '添加' : '编辑'}
        visible={levelOneVisible}
        onCancel={() =>{
          resetFields()
          handleModalVisible( 'one' )
        }}
        onOk={this.handleAddClassify}
        width={700}
        maskClosable={false}
        destroyOnClose
        centered
      >
        <Spin spinning={loading}>
          <div className={styles.common_container}>
            <Form {...this.formItemLayout} onSubmit={this.handleAddClassify}>
              <Row>
                <FormItem label='分类名称'>
                  {getFieldDecorator( 'name', {
                    initialValue: isAdd ? '' : name,
                    rules: [{ required: true, message: `请输入分类名称` }],
                  } )(
                    <Input maxLength={30} placeholder='请输入分类名称' />
                  )}
                </FormItem>
              </Row>
              <Row>
                <FormItem label='排序'>
                  {getFieldDecorator( 'sort', {
                    initialValue: isAdd ? '' : sort,
                    rules: [
                      { required: true, message: `请输入排序值` },
                      { pattern: /^\+?[1-9]\d*$/, message: '请输入正确的排序值' }
                    ],

                  } )(
                    <Input placeholder='请输入排序值' />
                  )}
                </FormItem>
              </Row>
              <Row>
                <FormItem label='是否显示'>
                  {getFieldDecorator( 'status', {
                    valuePropName: 'checked',
                    initialValue: isAdd ? true : !!status
                  } )(
                    <Switch />
                  )}
                </FormItem>
              </Row>
              <Row>
                <FormItem label='图片上传'>
                  {getFieldDecorator( 'img', {
                    initialValue: img || ''
                  } )( <UploadModal /> )}
                  <span>支持.jpg .png .gif格式, 尺寸为400 * 400px</span>
                </FormItem>

              </Row>
              <Row>
                <FormItem label='分类描述'>
                  {getFieldDecorator( 'description', {
                    initialValue: description || ''
                  } )(
                    <TextArea
                      placeholder='请输入分类描述'
                      autoSize={{ minRows: 5, maxRows: 10 }}
                      maxLength={100}
                    />
                  )}
                </FormItem>
              </Row>
            </Form>
          </div>
        </Spin>

      </Modal>
    );
  }
}

export default LevelOneModal;

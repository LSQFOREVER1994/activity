import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Cascader, Input, Form, Modal, Button, Switch, message, Select } from 'antd'
import styles from './GoodsList.less'

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
@connect( ( { equityGoods } ) => {
    return {
        ...equityGoods
    }
} )
@Form.create()
class SyncModal extends PureComponent {

    formLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    handleSync = () => {
        const { form, dispatch, handleSyncModalVisible } = this.props;
        form.validateFields( ( err ) => {
            if ( err ) {
                return;
            }
            const cid = form.getFieldValue( 'cid' );
            const stock = form.getFieldValue( 'stock' );
            const status = form.getFieldValue( 'status' );
            const source = form.getFieldValue( 'source' );
            const ids = form.getFieldValue( 'externalIds' ).trim().split( /[\n\r]/ );
            const externalIds = ids.map( i => { return i.trim() } ).filter( Boolean );
            const product = { cid: cid[cid.length - 1], stock, status: status ? 1 : 0, externalIds };
            dispatch( {
                type: 'equityGoods/syncGoods',
                payload: {
                    product,
                    source,
                },
                callBackFunc: ( res ) => {
                    const { message: returnMessage, tip } = res
                    if ( res.success ) {
                        message.success( tip || returnMessage );
                        handleSyncModalVisible()
                    }
                }
            } )
        } );
    }

    filterClassifyList = list => {
      const newList = list
      if ( Array.isArray( newList ) ){
        newList.forEach( ( item, index ) => {
          if ( item.status === 0 ) {
            newList.splice( index, 1 )
          }
          if ( item.categoryChildren.length === 0 ) {
            newList.splice( index, 1 )
          }
          if ( item.categoryChildren.length > 0 ) {
            if ( Array.isArray( item.categoryChildren ) ){
              item.categoryChildren.forEach( ( v, i ) => {
                if ( v.status === 0 ) {
                  item.categoryChildren.splice( i, 1 )
                }
              } )
            }
            }
        } )
      }
      return newList
    }

    render() {
        const { visible, handleSyncModalVisible, classifyList, syncGoodsSource, loading, form: { getFieldDecorator } } = this.props;
        const filterList = this.filterClassifyList( classifyList );
        return (
          <Modal
            title="同步商品"
            className={styles.global_styles}
            destroyOnClose
            visible={visible}
            onOk={this.handleSync}
            onCancel={handleSyncModalVisible}
            maskClosable={false}
            footer={[
              <Button key="back" onClick={handleSyncModalVisible}>取消</Button>,
              <Button key="submit" type="primary" loading={loading} onClick={this.handleSync}>保存</Button>,
                ]}
          >

            <FormItem label='商品分类' {...this.formLayout}>
              {getFieldDecorator( 'cid', {
                        rules: [{ required: true, message: `请选择一个分类` }],
                    } )(
                      <Cascader
                        fieldNames={{ label: 'name', value: 'id', children: 'categoryChildren' }}
                        options={filterList || []}
                        placeholder="请选择一个分类"
                        showSearch
                        filterOption={( input, option ) =>
                                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                            }
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      />,
                    )}
            </FormItem>
            <FormItem label='商品库存' {...this.formLayout}>
              {getFieldDecorator( 'stock', {
                        rules: [{ required: true, message: `请输入库存` }],
                    } )(
                      <Input type='number' placeholder='请输入外部商品库存' />
                    )}
            </FormItem>
            <FormItem label='是否上架' {...this.formLayout}>
              {getFieldDecorator( 'status', {
                        initialValue: false,
                        valuePropName: 'checked',
                        rules: [{ required: true, message: `请输入外部商品类型` }],
                    } )(
                      <Switch placeholder='请输入外部商品类型' />
                    )}
            </FormItem>
            <FormItem label='外部商品来源' {...this.formLayout}>
              {getFieldDecorator( 'source', {
                        rules: [{ required: true, message: `请输入外部商品来源` }],
                    } )(
                      <Select
                        style={{ width: '100%' }}
                        placeholder="请选择商品来源"
                        showSearch
                        optionFilterProp="children"
                        filterOption={( input, option ) =>
                                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                            }
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        <Option value={syncGoodsSource[0]}>有分</Option>
                        {/* {syncGoodsSource ? Array.isArray(syncGoodsSource) && syncGoodsSource.map((v, i) => {
                  return (
                    <Option value={v.name} key={v.id} >{v.name}</Option>
                  )
                }) : ''} */}
                      </Select>
                    )}
            </FormItem>
            <FormItem label='外部商品ID' {...this.formLayout}>
              {getFieldDecorator( 'externalIds', {
                        rules: [{ required: true, message: `请输入外部商品ID` }],
                    } )(
                      <TextArea style={{ height: '100px' }} placeholder='请输入外部商品ID' />
                    )}
            </FormItem>
            <div style={{ marginLeft: '30px' }}>
              <div>温馨提示：</div>
              <div>1.多个外部商品ID可用换行隔开；</div>
              <div>2.若不存在已经关联的外部商品ID，则新增一个商品；</div>
              <div>3.若存在已经关联的外部商品ID，则进行商品信息全部覆盖。</div>
            </div>
          </Modal>
        )
    }
}
export default SyncModal;

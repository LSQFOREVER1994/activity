/* eslint-disable no-useless-escape */
import React, { useMemo, useState } from 'react';
import { Button, Modal, Form, Input, message, Switch } from 'antd';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import { onReplaceFontSize } from '@/utils/utils';

import styles from './index.less';

const FormItem = Form.Item;


const TextOption = props => {
  const { componentsData, changeValue, form } = props;
  const { getFieldDecorator, validateFields, getFieldsValue, getFieldValue } = form
  const { enrollPopContent, enrollPopTitle,  noneRankDesc, protocols: protocoList = [],  isNoneRankDesc } = componentsData;
  const [modalVisible, setModalVisible] = useState( false );
  const [protocols, setProtocols] = useState( protocoList );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState( false );
  const [currentIndex, setCurrentIndex] = useState( -1 );

  // 文案弹窗配置确认
  const handleConfigConfirm = () => {
    validateFields( ( err, values ) => {
      if( err ){
        message.error( '请正确填写文案配置' );
        return;
      }
      if( protocols?.length ){
        if( protocols.some( item=>!item.name||!onReplaceFontSize( item.content ) ) ){
          message.error( '请正确填写协议内容' );
          return;
        }
      }
      const submitParams = { ...values, protocols }
      Object.entries( submitParams ).forEach( ( [key, value] ) => {
          changeValue( value, key );
      } )
      message.success( '文案配置成功' );
      setModalVisible( false );
    } )
  }

  const handleConfigCancel = () => {
    console.log( protocoList, 'protocoListprotocoList' );
    setProtocols( protocoList )
    setModalVisible( false );
  }

  // 添加协议
  const handleAddSignProtocols= () => {
    if ( protocols.length === 3 ) {
      message.warning( '最多添加3个协议' );
      return
    }
    const newProtocols = {
      name: '',
      content: '',
    }
    setProtocols( () => [...protocols, newProtocols] );
  }

  // 删除协议
  const handleDeleteProtocols = ( idx ) => {
    const newProtocols = [...protocols];
    newProtocols.splice( idx, 1 );
    setProtocols( newProtocols );
    setCurrentIndex( -1 );
    setShowDeleteConfirm( false )
  }

  // 协议列表修改
  const handleChangeProtocols = ( e, index, type ) => {
    const val = e?.target ? e?.target?.value : e
    const newProtocols = JSON.parse( JSON.stringify( protocols ) );
    newProtocols[index][type] = val;
    setProtocols( newProtocols );
  }

  const handleDelteConfirm = ( idx ) => {
     setCurrentIndex( idx );
     setShowDeleteConfirm( true );
  }

  // 报名文案内容
  const renderRollContent = () => {
    return (
      <>
        <FormItem style={{ display: 'flex', alignItems: 'center' }} label="报名弹窗标题">
          {getFieldDecorator( 'enrollPopTitle', {
            initialValue: enrollPopTitle,
            rules: [{ required: false, message: `报名弹窗标题` }],
          } )( <Input placeholder="请输入报名弹窗标题" maxLength={15} style={{ width: 500 }} /> )}
        </FormItem>
        <FormItem label="报名弹窗文案">
          {getFieldDecorator( 'enrollPopContent', {
            valuePropName: 'record',
            initialValue: enrollPopContent,
            rules: [{ required: false, message: `请输入报名弹窗文案` }],
          } )(
            <BraftEditor
              field="content"
              contentStyle={{ height: '250px' }}
            />
          )}
        </FormItem>
      </>
    )
  }

  // 报名签署协议模块
  const renderSignAgreement = () => {
    return (
      <div className={styles.agreement_list}>
        <div className={styles.add_agreement} onClick={() => handleAddSignProtocols()}>添加报名需签署协议+</div>
        {protocols?.map( ( item, index ) => {
          return (
            <div className={styles.agreement_item}>
              <div className={styles.delete_agreement} onClick={() => handleDelteConfirm( index )}>删除协议-</div>
              <FormItem required label="协议名称" style={{ display: 'flex', alignItems: 'center' }}>
                <Input style={{ width: 500 }} value={item.name} placeholder='请输入协议名称' maxLength={15} onChange={e => handleChangeProtocols( e, index, 'name' )} />
              </FormItem>
              <FormItem required label="协议内容">
                <BraftEditor
                  record={item.content}
                  field="content"
                  contentStyle={{ height: '250px' }}
                  onChange={e => handleChangeProtocols( e, index, 'content' )}
                />
              </FormItem>
            </div>
          )
        } )}
      </div>
    )
  }

  // etf说明模块
  const renderETFillustrate = () => {
    return (
      <div className={styles.etf_illustrate}>
        <FormItem label="开启暂无排名说明" style={{ display: 'flex', alignItems: 'center' }}>
          {getFieldDecorator( 'isNoneRankDesc', {
            valuePropName: 'checked',
            initialValue:  isNoneRankDesc,
            rules: [{ required: false }],
          } )(
            <Switch />
          )}
        </FormItem>

        {
          getFieldValue( 'isNoneRankDesc' ) && (
            <FormItem label="ETF暂无排名说明">
              {getFieldDecorator( 'noneRankDesc', {
                valuePropName: 'record',
                initialValue:  noneRankDesc,
              rules: [{ required: !!getFieldValue( 'isNoneRankDesc' ), message: `请输入ETF排名说明` }],
            } )(
              <BraftEditor
                field="content"
                contentStyle={{ height: '250px' }}
              />
            )}
            </FormItem>
          )
        }
      </div>
    )
  }

  // 删除确认弹窗
  const renderDeleteConfirmModal = ( ) => {
    const protocolInfo = protocols[ currentIndex ] || {}
    const { name } = protocolInfo
    return (
      <Modal 
        visible={showDeleteConfirm} 
        onOk={() => handleDeleteProtocols( currentIndex )}
        onCancel={() => setShowDeleteConfirm( false )}
        title="确认删除提示"
      >
        {`是否确认删除协议${name ? `：${name}` : ''}？`}
      </Modal>
    )
  }

  // 文案配置弹窗
  const textModal =  () => {
    return (
      <Modal
        title="文案配置"
        width={840}
        bodyStyle={{ padding: '20px' }}
        maskClosable={false}
        visible={modalVisible}
        onCancel={handleConfigCancel}
        onOk={handleConfigConfirm}
      >
        <div className={styles.modal_content}>
          {renderRollContent()}
          {renderSignAgreement()}
          {/* {renderETFillustrate()} */}
        </div>
      </Modal>
    );
  }

  return (
    <div className={styles.option_box}>
      <div className={styles.option_box_tit}>文案配置</div>
      <Button type="primary" onClick={() => setModalVisible( !modalVisible )}>
        配置文案
      </Button>
      {modalVisible && textModal()}
      {renderDeleteConfirmModal()}
    </div>
  );
};

export default Form.create()( TextOption );

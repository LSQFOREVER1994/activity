import React, { useEffect, useState } from 'react';
import { connect } from 'dva'
import { Modal, Form, Input, message } from 'antd';
import icon from '../../assets/image/pushSetting.png';
import styles from '../../thirdDataCenter.less';

function PushSetting( props ) {
  const { form, dispatch, activityId, loading } = props;
  const { getFieldDecorator, getFieldsValue } = form;
  const [visible, setVisible] = useState( false );
  const [settingData, setSettingData] = useState( {} );

  const getPushSetting = () => {
    dispatch( {
      type: 'thirdDataCenter/getPushSetting',
      payload: {
        id: activityId
      },
      successFun: ( res ) => {
        setSettingData( res )
      }
    } )
  }

  const updatePushSetting = () => {
    const values = getFieldsValue();
    dispatch( {
      type: 'thirdDataCenter/updatePushSetting',
      payload: {
        id: activityId,
        ...values
      },
      successFun: ( res ) => {
        message.success( res.message )
        setVisible( false )
      }
    } )
  }

  useEffect( () => {
    if ( visible ) {
      getPushSetting()
    }
  }, [visible] )

  return (
    <>
      <div
        className={styles.activitiesManagementItem}
        onClick={() => { setVisible( true ) }}
      >
        <img className={styles.activitiesManagementItemImg} src={icon} alt="" />
        <div className={styles.activitiesManagementItemLabel}>消息推送</div>
      </div>
      <Modal
        title="消息推送"
        visible={visible}
        okText="确定"
        onOk={() => updatePushSetting()}
        confirmLoading={loading}
        onCancel={() => { setVisible( false ) }}
      >
        <div style={{ marginBottom: '20px' }}>定制化消息推送设置，可支持配置抽奖数据、中奖数据等行为数据，详情咨询管理员。</div>
        <Form>
          <Form.Item label="推送配置">
            {getFieldDecorator( 'mqTag', {
              initialValue: settingData.mqTag,
            } )( <Input.TextArea placeholder="请输入推送配置" /> )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Form.create()( connect( ( { thirdDataCenter } ) => ( { loading: thirdDataCenter.loading } ) )( PushSetting ) );

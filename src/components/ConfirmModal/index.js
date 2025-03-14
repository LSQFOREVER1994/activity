/* eslint-disable react/jsx-filename-extension */
import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';

class ConfirmModal extends PureComponent {
    render () {
        const { visible, text, cancel, confirm, type, extra, loading } = this.props;
        return (
          <Modal
            maskClosable={false}
            visible={visible}
            width={300}
            onCancel={cancel}
            footer={null}
          >
            {
              type === 'extra' ? (
                extra
              ) :
                <div style={{ textAlign: 'center' }}>
                  确认{text}?
                </div>
            }

            <div className={styles.bottomBtn}>
              <Button onClick={() => {cancel()}}>取消</Button>
              <Button loading={loading} onClick={( e ) => {confirm( e, true );}} type="primary" style={{ marginLeft: '20px' }}>确认</Button>
            </div>
          </Modal>
        )
    }
}

export default ConfirmModal;

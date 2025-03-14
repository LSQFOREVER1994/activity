import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Divider, Spin, Table } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

@connect(({ login }) => ({
  loginData: login.loginData,
}))
class Center extends PureComponent {
  render() {
    const { loginData } = this.props;
    const columns = [
      {
        title: formatMessage({ id: 'acount.center.codeText' }),
        dataIndex: 'code',
        key: 'code',
        width: 150,
      },
      {
        title: formatMessage({ id: 'acount.center.roleText' }),
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },
      {
        title: formatMessage({ id: 'acount.center.permissionText' }),
        dataIndex: 'permissionsStr',
        render: (text) => {
          return <span>{text || '--'}</span>;
        }
      },
    ];

    if (loginData.nick) {
      const { roles } = loginData;
      roles.forEach((item, index) => {
        const permissionsArr = [];
        const { permissions } = item;
        permissions.forEach((P) => {
          permissionsArr.push(P.name)
        });
        roles[index].permissionsStr = permissionsArr.join('，');
      });
    }

    return (
      <GridContent className={styles.userCenter}>
        <Card bordered={false} style={{ marginBottom: 24 }}>
          {loginData.nick ? (
            <div>
              <div className={styles.avatarHolder}>
                <img alt="" src={loginData.profilePhoto} />
                <div className={styles.name}>{loginData.nick}</div>
              </div>
              <div className={styles.detail}>
                <div>{formatMessage({ id: 'acount.login.countText' })}： {loginData.loginCount}</div>
                <div>{formatMessage({ id: 'acount.last.loginText' })}： {loginData.lastLoginTime.slice(0, 10)} &ensp; {loginData.lastLoginTime.slice(11, 19)}</div>
              </div>
              <Divider dashed />
              <Table rowKey="code" columns={columns} dataSource={loginData.roles} pagination={false} bordered />
            </div>
              ) : (
                <Spin size="small" style={{ display: 'block', marginLeft: '0 auto' }} />
              )}
        </Card>
      </GridContent>
      
    );
  }
}

export default Center;

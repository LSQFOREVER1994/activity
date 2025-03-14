import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Spin,  } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

@connect( ( { login } ) => ( {
  loginData: login.loginData,
} ) )
class Center extends PureComponent {
  render() {
    const { loginData } = this.props;
    const { roleGroups } = loginData

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
                <div>{formatMessage( { id: 'acount.login.countText' } )}： {loginData.loginCount}</div>
                <div>{formatMessage( { id: 'acount.last.loginText' } )}： {loginData.lastLoginTime.slice( 0, 10 )} &ensp; {loginData.lastLoginTime.slice( 11, 19 )}</div>
                <div>角色：{roleGroups?.length && roleGroups.map( item=>( <span>&nbsp;{item.name}&nbsp;</span> ) )}</div>
              </div>
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

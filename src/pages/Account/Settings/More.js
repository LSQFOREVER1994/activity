import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import styles from './More.less';

@connect(({ login }) => ({
  loginData: login.loginData,
}))
class More extends PureComponent {
  render() {
    return (
      <div>更多设置</div>
    );
  }
}

export default More;

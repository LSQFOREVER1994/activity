import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './GridContent.less';

class GridContent extends PureComponent {
  render() {
    const { contentWidth, children, className = '' } = this.props;
    let ClassName = `${styles.main} ${className}`;
    if ( contentWidth === 'Fixed' ) {
      ClassName = `${styles.main} ${styles.wide} ${className}`;
    }
    return <div className={ClassName}>{children}</div>;
  }
}

export default connect( ( { setting } ) => ( {
  contentWidth: setting.contentWidth,
} ) )( GridContent );

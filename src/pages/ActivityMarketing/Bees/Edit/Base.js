import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './edit.less';
import Share from './ShareOption';
import BasicsModal from './BasicsModal';

@connect()
// @Form.create()
class Base extends PureComponent {
  state = {
    type: 'base',
  };

  changeNav = ( newType ) => {
    const { type } = this.state;
    if ( newType === type ) return;
    this.setState( { type: newType } )
  }

  render() {
    const { type } = this.state;
    const { domData = {}, changeDomData = () => { } } = this.props;
    return (
      <div className={styles.base}>
        <div className={styles.navs}>
          <div
            className={type === 'base' ? styles.navItemActive : styles.navItem}
            onClick={() => this.changeNav( 'base' )}
          >
            基本信息设置
          </div>
          <div
            className={type === 'wx' ? styles.navItemActive : styles.navItem}
            onClick={() => this.changeNav( 'wx' )}
          >
            分享设置
          </div>
        </div>

        <div className={styles.baseContent}>
          {
            type === 'base' ? <BasicsModal domData={domData} changeDomData={changeDomData} /> : <Share domData={domData} changeDomData={changeDomData} />
          }
        </div>
      </div>
    )
  }

}

export default Base;

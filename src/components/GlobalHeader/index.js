import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import NavTabs from '@/components/NavTabs';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo, menuData, location } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <div>
          <span className={styles.trigger} onClick={this.toggle}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
        </div>

        {!isMobile && (
          <div className={styles.tabswrap}>
            <NavTabs location={location} menuData={menuData} />
          </div>
        )}
        <RightContent {...this.props} />
      </div>
    );
  }
}

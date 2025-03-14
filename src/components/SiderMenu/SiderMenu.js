import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import xdTitle from "@/assets/xdTitle.png"

const BaseMenu = React.lazy( () => import( './BaseMenu' ) );
const { Sider } = Layout;

let firstMount = true;

export default class SiderMenu extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      openKeys: getDefaultCollapsedSubMenus( props ),
    };
  }

  componentDidMount() {
    firstMount = false;
  }

  static getDerivedStateFromProps( props, state ) {
    const { pathname, flatMenuKeysLen } = state;
    if ( props.location.pathname !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen ) {
      return {
        pathname: props.location.pathname,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus( props ),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some( item => {
      if ( key ) {
        return item.key === key || item.path === key;
      }
      return false;
    } );
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter( openKey => this.isMainMenu( openKey ) ).length > 1;
    this.setState( {
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    } );
  };

  render() {
    const { collapsed, onCollapse, fixSiderbar, theme, isMobile } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames( styles.sider, {
      [styles.fixSiderBar]: fixSiderbar,
      [styles.light]: theme === 'light',
    } );

    const hiddenBar = sessionStorage.getItem( 'hiddenBar' )
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={collapse => {
          if ( firstMount || !isMobile ) {
            onCollapse( collapse );
          }
        }}
        width={200}
        theme={theme}
        className={siderClassName}
        style={theme === 'dark' && { background:'#323232' }}
      >
        <div className={styles.logo} id="logo" hidden={!!hiddenBar}>
          <img src={xdTitle} alt='' style={{ width:'160px', height:'60px' }} />
        </div>
        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%', background: 'transparent' }}
            className={styles.baseMenuBg}
            {...defaultProps}
          />
        </Suspense>
      </Sider>
    );
  }
}

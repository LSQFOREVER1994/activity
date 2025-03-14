/* eslint-disable no-const-assign */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { isUrl } from '@/utils/utils';
import IconFont from '@/components/IconFont';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import styles from './index.less';

const { SubMenu } = Menu;
// const hideMenu = ['']

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,

const getIcon = icon => {
  if ( typeof icon === 'string' ) {
    if ( isUrl( icon ) ) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if ( icon.startsWith( 'icon-' ) ) {
      return <IconFont type={icon} />;
    }
    return null;
  }
  return icon;
};

export default class BaseMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  state = {
    isShowMenu: false,
  };

  componentWillMount() {
    setTimeout( () => {
      this.setState( { isShowMenu: true } );
    }, 400 );
  }

  getNavMenuItems = menusData => {
    if ( !menusData ) {
      return [];
    }
    const hideMenu = [];

    return menusData
      .filter( item => {
        if ( item.onlyHideMenu ) hideMenu.push( item.path )
        return item.name && !item.hideInMenu
      } )
      .map( item => this.getSubMenuOrItem( item ) )
      .filter( item => item )
      .filter( item => !hideMenu.includes( item.key ) );
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList( pathname ).map( itemPath => getMenuMatches( flatMenuKeys, itemPath ).pop() );
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if ( item.children && !item.hideChildrenInMenu && item.children.some( child => child.name ) ) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon( item.icon )}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
          style={{ background: 'transparent' }}
          id="123123"
        >
          {this.getNavMenuItems( item.children )}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath( item )}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath( item.path );
    const icon = getIcon( item.icon );
    const { target } = item;
    // Is it a http link
    if ( /^https?:\/\//.test( itemPath ) ) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse, } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse( true );
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  conversionPath = path => {
    if ( path && path.indexOf( 'http' ) === 0 ) {
      return path;
    }
    return `/${path || ''}`.replace( /\/+/g, '/' );
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
    } = this.props;
    const { isShowMenu } = this.state;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys( pathname );

    if ( !selectedKeys.length && openKeys ) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if ( openKeys && !collapsed ) {
      // props = {
      //   openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      // }; // 可收缩

      /* eslint-disable no-new-object */ 
      props = {
        defaultSelectedKeys: new Array( ...selectedKeys ),
        defaultOpenKeys: new Array( ...selectedKeys ),
      };
    }
    // const { handleOpenChange, style, menuData } = this.props; // 可收缩
    const { style, menuData } = this.props;
    const cls = classNames( className, {
      'top-nav-menu': mode === 'horizontal',
    } );
  
    return (
      <div>
        {
          isShowMenu ? (
            <Menu
              key="Menu"
              mode={mode}
              theme={theme}
              // onOpenChange={handleOpenChange} // 可收缩
              selectedKeys={selectedKeys} // 可收缩
              style={style}
              className={cls}
              {...props}
            >
              {this.getNavMenuItems( menuData )}
            </Menu>
          ) : null
        }
      </div>
    );
  }
}

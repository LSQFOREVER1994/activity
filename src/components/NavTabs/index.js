import React, { Component } from 'react';
import router from 'umi/router';
import { Tabs } from 'antd';
import { getUrlParameter } from '@/utils/utils';
// import loginStatus from '@/utils/loginStatus';

const { TabPane } = Tabs;
const defaultPathName = '/users/user';

// const getTagName = ( name ) => {
//   let tagName = name;
//   if ( name === '账户详情' ) {
//     tagName = decodeURIComponent( getUrlParameter( 'name', window.location.href ) );
//   }
//   return tagName;
// };

const getText = ( item, key ) => {
  let result = item[key];
  if ( item.name === '账户详情' ) {
    if ( key === 'name' ) {
      result = decodeURIComponent( getUrlParameter( 'name', window.location.href ) );
    }
  }

  if ( key === 'path' ) {
    result = `${item[key]}${decodeURIComponent( window.location.search )}`;
  }
  return result;
};

class NavTabs extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      tabList: [], // { key: '/home', tab: '首页'},
      tabListKey: [], // ?
      activeKey: defaultPathName, // 当前激活的 tab
      activeRemove: false,
    };
  }

  componentDidMount() {
    window.removeTab = this.remove
  }

  static getDerivedStateFromProps() {
    // const isFirstLogin = localStorage.getItem('has-login');

    // if (!loginStatus.getLoginStatus()) {
    //   if (isFirstLogin === 'true') {
    //     // 登录之后才显示
    //     notification.error({
    //       message: '登录超时,请重新登录',
    //       description: '你已经登录时间过长,请重新登录,以检查身份',
    //     });
    //   }

    // eslint-disable-next-line
    //   window.g_app._store.dispatch({
    //     type: 'login/logout',
    //   });
    // }

    return null;
  }

  // 切换 tab页 router.push(key);
  onChange = key => {
    this.setState( { activeKey: key } );
    // const obj = this.state.tabList.find( item => item.key ===key );
    // router.push( obj.path );
    router.push( key );
  };

  onEdit = ( targetKey, action ) => {
    this[action]( targetKey );
  };

  remove = targetKey => {
    let { activeKey, activeRemove } = this.state;
    let lastIndex;
    const tabList = [];

    // eslint-disable-next-line
    this.state.tabList.forEach((pane, i) => {
      // 删除的 不是激活态
      if ( pane.key === targetKey ) {
        lastIndex = i - 1;
      }
      if ( pane.key !== targetKey ) {
        tabList.push( pane );
      }
    } );

    if ( lastIndex >= 0 && activeKey === targetKey ) {
      activeKey = tabList[lastIndex].key;
      activeRemove = true;
    } else {
      activeRemove = false;
    }

    router.push( activeKey );
    this.setState( { tabList, activeKey, activeRemove } );
  };

  updateTreeList = data => {
    const treeData = data;
    const treeList = [];
    // 递归获取树列表
    const getTreeList = item => {
      if( item && item.length ){
        item.forEach( node => {
          if ( !node.level ) {
            treeList.push( {
              tab: getText( node, 'name' ),
              key: getText( node, 'path' ),
              locale: node.locale,
            } );
          }
          if ( !node.hideChildrenInMenu && node.children && node.children.length > 0 ) {
            getTreeList( node.children );
          }
        } );
      }
    };
    getTreeList( treeData );
    return treeList;
  };

  render() {
    const { menuData } = this.props;
    const {
      location: { pathname, search },
    } = this.props;

    let PATHNAME;

    if ( pathname.endsWith( '/tabsPartOne' ) || pathname.endsWith( '/tabsPartTwo' ) ) {
      PATHNAME = pathname.slice( 0, pathname.lastIndexOf( '/' ) );
    } else {
      PATHNAME = search ? `${pathname}${decodeURIComponent( search )}`: pathname;
    }

    const { tabListKey, tabList, activeRemove } = this.state;

    const tabLists = this.updateTreeList( menuData );
    this.state.activeKey = PATHNAME;
    // render 的时候去更新 state?
    /* eslint-disable */
    tabLists.forEach(v => {
      if (v.key === PATHNAME && !activeRemove) {
        if (tabList.length === 0) {
          this.state.tabList.push(v);
        } else if (!tabListKey.includes(v.key)) {
          this.state.tabList.push(v);
        }
      }
    });
    if (PATHNAME === '/') {
      router.push(defaultPathName);
    }

    this.state.activeRemove = false;
    this.state.tabListKey = tabList.map(va => va.key);

    return (
      <div>
        {this.state.tabList && this.state.tabList.length ? (
          <Tabs
            activeKey={PATHNAME}
            onChange={this.onChange}
            tabBarStyle={{ background: '#fff', userSelect: 'none' }}
            tabPosition="top"
            tabBarGutter={-1}
            hideAdd
            type="editable-card"
            onEdit={this.onEdit}
          >
            {this.state.tabList.map(item => (
              <TabPane tab={item.tab} key={item.key} closable={true} />
            ))}
            {/* {
              console.log(this.state.tabList,22222)
            } */}
          </Tabs>
        ) : null}
      </div>
    );
  }
}

export default NavTabs;

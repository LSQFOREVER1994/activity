import React, { Component } from 'react';
import { Layout } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';

const { Header } = Layout;


class HeaderView extends Component {
  state = {
    visible: true,
    orgDataArrs: [],
    showOrgStr: '',
  };

  static getDerivedStateFromProps( props, state ) {
    if ( !props.autoHideHeader && !state.visible ) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener( 'scroll', this.handScroll, { passive: true } );
    const JINIU_DATA_PRODUCT_CMS_USERINFO = window.localStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO' );
    const orgData = JINIU_DATA_PRODUCT_CMS_USERINFO ? JSON.parse( JINIU_DATA_PRODUCT_CMS_USERINFO ).org : '';
    if ( orgData ) {
      const orgDataArrs = orgData.split( ',' );

      this.setState( {
        orgDataArrs,
        showOrgStr: window.sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_sessionStorage' ) || orgDataArrs[0],
      } )
    }
  }

  componentWillUnmount() {
    document.removeEventListener( 'scroll', this.handScroll );
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if ( isMobile || !fixedHeader || layout === 'topmenu' ) {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 200px)';
  };

  handleMenuClick = ( { key } ) => {
    const { dispatch } = this.props;
    const { showOrgStr } = this.state;
    const $this = this;
    if ( key === 'userCenter' ) {
      router.push( '/account/center' );
      setTimeout( () => {
        window.location.reload();
      }, 10 );
      // return;
    } else if ( key === 'userinfo' ) {
      router.push( '/account/settings' );
      setTimeout( () => {
        window.location.reload();
      }, 10 );
      // return;
    } else if ( key === 'logout' ) {
      dispatch( {
        type: 'login/logout',
      } );
    } else if ( showOrgStr !== key ) {
      dispatch( {
        type: 'login/changeOrg',
        payload: {
          key,
          callBackFunc: ( org ) => {
            window.sessionStorage.setItem( 'JINIU_DATA_PRODUCT_CMS_sessionStorage', org );
            $this.setState( {
              showOrgStr: org,
            } );

            setTimeout( () => {
              window.location.reload();
            }, 150 );
          }
        },
      } );
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if ( !autoHideHeader ) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if ( !this.ticking ) {
      this.ticking = true;
      requestAnimationFrame( () => {
        if ( this.oldScrollTop > scrollTop ) {
          this.setState( {
            visible: true,
          } );
        } else if ( scrollTop > 300 && visible ) {
          this.setState( {
            visible: false,
          } );
        } else if ( scrollTop < 300 && !visible ) {
          this.setState( {
            visible: true,
          } );
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      } );
    }
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible, orgDataArrs, showOrgStr } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            orgDataArrs={orgDataArrs}
            showOrgStr={showOrgStr}
            theme={navTheme}
            mode="horizontal"
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            orgDataArrs={orgDataArrs}
            showOrgStr={showOrgStr}
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            {...this.props}
          />
        )}
      </Header>
    ) : null;

    // 有hiddenBar隐藏头部
    const hiddenBar = sessionStorage.getItem( 'hiddenBar' )
    if ( hiddenBar ) return null
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect( ( { login, global, setting } ) => ( {
  loginData: login.loginData,
  collapsed: global.collapsed,
  setting,
} ) )( HeaderView );

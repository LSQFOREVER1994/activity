import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { FormattedMessage } from 'umi/locale';
import { Spin, Menu, Icon, Avatar, notification, Button } from 'antd';
// import SelectLang from '../SelectLang';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

@connect( ( { global }  ) => {
  return ( {
    unreadCount: global.unreadCount,
  } )
} )
class GlobalHeaderRight extends PureComponent {

  constructor( props ) {
    super( props );
    this.intervalId = null;
  }

  componentDidMount(){
    this.intervalId = setInterval( ()=>{
      this.getMessageModalList();
      this.getUnreadCount();
    }, 1 * 60 * 1000 );
      this.getMessageModalList();
      this.getUnreadCount();
  }

  componentWillUnmount() {
    if ( this.intervalId ) {
      clearInterval( this.intervalId );
    }
  }

  getUnreadCount = () => {
    const { dispatch } = this.props;
    dispatch( { 
      type: 'global/getGlobalUnreadCount',
      payload: {
        callFunc:() => {
        }
      }
    } )
  }

  getMessageModalList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type:'global/getMessageModalList',
      payload: {
        callFunc:( res ) => {
          res.forEach( item => {
            this.openNotificationWithIcon( item )
          } )
        }
      }
    } )
  }

  openNotificationWithIcon = item => {
    const { history } = this.props;
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={()=>{
        history.push( '/messageCenter' )}}
      >
        查看
      </Button>
    );
    notification.success( {
      message: item.title,
      description:item.content,
      btn,
      icon: <Icon type="check-circle" style={{ color:'#f5222d' }} />
    } );
  };

  render() {
    const {
      loginData,
      onMenuClick,
      theme,
      orgDataArrs,
      showOrgStr,
      history,
      unreadCount
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* {
          orgDataArrs.map( item => (
            <Menu.Item key={item} className={styles.menuItemBox}>
              {item}
              {( showOrgStr === item ) && <Icon type="check" className={styles.menuItemIcon} />}
            </Menu.Item>
          ) )
        }
        {
          ( orgDataArrs.length > 0 ) && <Menu.Divider />
        } */}
        
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        {/* <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item> */}
      </Menu>
    );
    let className = styles.right;
    if ( theme === 'dark' ) {
      className = `${styles.right}  ${styles.dark}`;
    }

    return (
      <div className={className}>
        <div
          className={styles.message}
          onClick={()=>{
            history.push( '/messageCenter' )
          }}
        >
          <Icon type="bell" style={{ fontSize:'24px' }} />
          <div className={styles.num}>{unreadCount}</div>
        </div>
        {loginData.nick ? (
          <HeaderDropdown overlay={menu} placement="bottomRight">
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={loginData.profilePhoto}
                alt="avatar"
              />
              <span className={styles.name}>{loginData.nick}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {/* <SelectLang className={styles.action} /> */}
      </div>
    );
  }
}

export default GlobalHeaderRight;

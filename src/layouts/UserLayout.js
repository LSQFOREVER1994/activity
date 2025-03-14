/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-07-27 09:22:49
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-02 16:13:02
 * @FilePath: /data_product_cms_ant-pro/src/layouts/UserLayout.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { getUrlParameter } from '@/utils/utils';
import GlobalFooter from '@/components/GlobalFooter';
// import SelectLang from '@/components/SelectLang';
import getPageTitle from '@/utils/getPageTitle';
import styles from './UserLayout.less';
import title from '../assets/xdLoginLogo.png'

const imgSrc = require( '@/assets/beian.png' );

const links = [
  {
    key: formatMessage( { id: 'app.jiniu.about' } ),
    title: formatMessage( { id: 'app.jiniu.about' } ),
    href: formatMessage( { id: 'app.jiniu.about.link' } ),
    blankTarget: true,
  },
  {
    key: formatMessage( { id: 'app.jiniu.beian' } ),
    title: <span><img className={styles.imgSrc} src={imgSrc} alt="" /> {formatMessage( { id: 'app.jiniu.beian' } )}</span>,
    href: formatMessage( { id: 'app.jiniu.beian.link' } ),
    blankTarget: true,
  },
];

const copyright = (
  <Fragment>
    {/* {formatMessage( { id: 'app.jiniu.infoTag' } )} <Icon type="copyright" /> {formatMessage( { id: 'app.jiniu.info' } )} */}
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch( {
      type: 'menu/getMenuData',
      payload: { routes, authority },
    } );
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    const superToken = getUrlParameter( 'superToken' )
    if( superToken ) return children
    return (
      <DocumentTitle title={getPageTitle( pathname, breadcrumbNameMap )}>
        <div className={styles.container}>
          <div className={styles.lang}>
            {/* <SelectLang /> */}
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <img src={title} alt='' style={{ width:'360px', }} />
              </div>
              <div className={styles.desc} />
            </div>
            {children}
          </div>
          {/* <GlobalFooter links={links} copyright={copyright} /> */}
        </div>
      </DocumentTitle>
    );
  }
}

export default connect( ( { menu: menuModel } ) => ( {
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
} ) )( UserLayout );

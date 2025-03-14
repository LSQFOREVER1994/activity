import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './Footer.less';

const { Footer } = Layout;
const imgSrc = require( '@/assets/beian.png' );

const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
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
      ]}
      copyright={
        <Fragment>
          {/* {formatMessage( { id: 'app.jiniu.infoTag' } )} <Icon type="copyright" /> {formatMessage( { id: 'app.jiniu.info' } )} */}
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;

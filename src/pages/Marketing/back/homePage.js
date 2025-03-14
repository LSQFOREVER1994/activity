import React, { PureComponent } from 'react';
import Link from 'umi/link';
import styles from '../index.less';

import AggregateData from "../aggregateData";
import OrderAmounts from '../orderAmounts';
import Basic from '../Basic';
import HotBasic from '../hotBasic';
import NowActivity from './nowActivity';
import StartActivity from '../startActivity';
import NoAccess from '../noAccess';
// import CommomCom from '../Common.com'

const appstoreImage = require( '../../../src/assets/appstore.png' )
const userImage = require( '../../../src/assets/users.png' )
const couponsImage = require( '../../../src/assets/coupons.png' )
const operationImage = require( '../../../src/assets/operation.png' )
const giftImage = require( '../../../src/assets/gift.png' )


// @connect( ( { homePage } ) => ( {
//   // loading: homePage.loading,
//   // startLoading:homePage.startLoading,
//   // nowActivityList: homePage.nowActivityList,
//   // startActivityList:homePage.startActivityList
// } ) )

class HomePage extends PureComponent {
  constructor( props ) {
    const cmsAuthority = window.localStorage.getItem( 'JINIU-CMS-authority' );
    const authority = cmsAuthority ? JSON.parse( cmsAuthority ) : [];
    const jurisdiction = {}
    authority.forEach( ( item ) => {
      jurisdiction[item] = true
    } )
    super( props );
    this.state = {
      jurisdiction
    }
  }


  render() {
    const { jurisdiction } = this.state;


    return (
      <div style={{ backgroundColor: '#aaa' }}>
        {/* 左边盒子 */}
        {
          jurisdiction.MALL_PRODUCT_GET || jurisdiction.MALL_PERMISSION_GET || jurisdiction.MALL_COUPONS_GET
            || jurisdiction['crop-service:banner:get:banner-all'] || jurisdiction['open-service:merchant:get:list-sku']
            ?
              <div
                className={styles.actionManage}
                style={{ height: jurisdiction.MALL_DASHBOARD_STATISTIC || jurisdiction['strategy-mall-service:statistic:get:statistic'] || jurisdiction.MALL_ORDER_GET_LIST || jurisdiction.MALL_DASHBOARD_STATISTIC ? '550px' : 'none' }}
              >
                <h3 className={styles.headline}>常用功能</h3>
                {
                jurisdiction.MALL_PRODUCT_GET ?
                  <div className={styles.action}>
                    <Link target="_top" to="/strategyMall/productList">
                      <div className={styles.icon}><img alt='' src={appstoreImage} /></div>
                      <p>商品管理</p>
                    </Link>
                  </div>
                  : null
              }

                {
                jurisdiction.MALL_PERMISSION_GET ?
                  <div className={styles.action}>
                    <Link target="_top" to="/strategyMall/users">
                      <div className={styles.icon}><img alt='' src={userImage} /></div>
                      <p>用户权益查询</p>
                    </Link>
                  </div>
                  : null
              }

                {
                jurisdiction.MALL_COUPONS_GET ?
                  <div className={styles.action}>
                    <Link target="_top" to="/coupons/manage">
                      <div style={{ marginTop: 3, marginBottom: 13 }}><img alt='' src={couponsImage} /></div>
                      <p>优惠券管理</p>
                    </Link>
                  </div>
                  : null
              }

                {
                jurisdiction['crop-service:banner:get:banner-all'] ?
                  <div className={styles.action} style={{ margin: 0 }}>
                    <Link target="_top" to="/tool/banner">
                      <div className={styles.icon}><img alt='' src={operationImage} /></div>
                      <p>资源位管理</p>
                    </Link>
                  </div>
                  : null
              }

                {
                jurisdiction['open-service:merchant:get:list-sku'] ?
                  <div className={styles.action} style={{ margin: 0 }}>
                    <Link target="_top" to="/tool/prize">
                      <div className={styles.icon}><img alt='' src={giftImage} /></div>
                      <p>奖品管理</p>
                    </Link>
                  </div>
                  : null
              }
              </div>
            : null
        }


        {/* 中间盒子 */}
        {
          jurisdiction.MALL_DASHBOARD_STATISTIC || jurisdiction.MALL_ORDER_GET_LIST ?
            <div className={styles.messageDiv} style={{ width: '35%', marginRight: '1.5%' }}>
              <h3 className={styles.headline}>商城订单概况</h3>
              {
                jurisdiction.MALL_DASHBOARD_STATISTIC ? <AggregateData />
                  :
                <NoAccess />
              }

              <h4 className={styles.orderStatus}>订单金额概况</h4>
              {
                jurisdiction.MALL_ORDER_GET_LIST ? <OrderAmounts />
                  :
                <NoAccess />
              }
            </div>
            : null
        }


        {/* 右边盒子 */}
        {
          jurisdiction.MALL_DASHBOARD_STATISTIC || jurisdiction['strategy-mall-service:statistic:get:statistic'] ?
            <div className={styles.messageDiv} style={{ width: '43%', marginRight: 'none' }}>
              <h3 className={styles.headline} style={{ float: 'left' }}>近3日榜单</h3>

              <p className={styles.topThreeAmountTit}>冠军销售额TOP3</p>
              {
                jurisdiction.MALL_DASHBOARD_STATISTIC ?
                  <div className={styles.topThreeAmountOrder}>
                    <Basic />
                  </div>
                  : <NoAccess />
              }

              <p className={styles.topThreeOrderTit}>热销产品TOP3</p>
              {
                jurisdiction['strategy-mall-service:statistic:get:statistic'] ?
                  <div className={styles.topThreeAmountOrder}>
                    <HotBasic />
                  </div>
                  : <NoAccess />
              }

            </div>
            : null
        }


        {/* 下边盒子 */}
        {
          jurisdiction['crop-service:activities:get:list'] ?
            <div className={styles.table}>
              <h3 className={styles.headline}>活动概况</h3>
              <div className={styles.activeTable}>活动进行时</div>
              <div className={styles.topTable}>
                <NowActivity />
              </div>
              <div className={styles.tableButtom} />
              <div className={styles.activeTable} style={{ marginTop: 30 }}>活动即将开始</div>
              <div className={styles.topTable}>
                <StartActivity />
              </div>
            </div>
            : null
        }
      </div>

    );
  }
}

export default HomePage;



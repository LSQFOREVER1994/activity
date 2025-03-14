import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Sales from './Sales'
import SalesRank from './SalesRank'
import SalesTotal from './SalesTotal'
import TodayTotal from './TodayTotal'
import OrderPay from './OrderPay'
import CouponsCount from './CouponsCount'
import styles from './dashboard.less';

// @connect(({ strategyMall }) => ({
//   goodsList: strategyMall.goodsList,
// }))
@connect( ( { dashboard } ) => {
  return{
    goodsList: dashboard.goodsList,
    // havePermission: false,
  }
} )
class Dashboard extends PureComponent {
  state={
    containerWidth: 0
  }

  componentWillMount(){

  }

  componentDidMount(){
    window.onresize = () => this.getWindowSize();
    this.setState( {
      containerWidth: this.container.clientWidth,
    } );
    const cmsAuthority = window.localStorage.getItem( 'JINIU-CMS-authority' );
    const authority = cmsAuthority ? JSON.parse( cmsAuthority ) : [];
    const havePermission = authority.find( ( item )=>{
      return item === 'MALL_DASHBOARD_STATISTIC'
      } )
    this.setState( { havePermission } );
  }

  getWindowSize = () =>{
    if( this.container ){
      this.setState( {
        containerWidth: this.container.clientWidth || 0,
      } );
    }
  }

  render() {
    const { containerWidth, havePermission } = this.state;
    return (
      <div>
        {
          havePermission?
            <div ref={( div ) => { this.container = div; }}>
              <div className={styles.cardList}>
                <div className={styles.card}>
                  <SalesTotal />
                </div>
                <div className={styles.card}>
                  <TodayTotal />
                </div>
                <div className={styles.card}>
                  <OrderPay />
                </div>
                <div className={styles.card}>
                  <CouponsCount />
                </div>
              </div>
              <Sales containerWidth={containerWidth} />
              <SalesRank containerWidth={containerWidth}  />
            </div>:
            <div style={{ textAlign: 'center' }} ref={( div ) => { this.container = div; }}>
              暂无数据分析
            </div>

        }
        {/* <div ref={(div) => { this.container = div; }}>
          <div className={styles.cardList}>
            <div className={styles.card}>
              <SalesTotal />
            </div>
            <div className={styles.card}>
              <TodayTotal />
            </div>
            <div className={styles.card}>
              <OrderPay />
            </div>
            <div className={styles.card}>
              <CouponsCount />
            </div>
          </div>
          <Sales containerWidth={containerWidth} />
          <SalesRank containerWidth={containerWidth}  />
        </div> */}
      </div>
     
    );
  }
}

export default Dashboard;

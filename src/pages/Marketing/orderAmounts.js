import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon } from 'antd';
import IconFont from '@/components/IconFont';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import Innerlabel from './Innerlabel';


const getIcon = icon => {
  if ( typeof icon === 'string' ) {
    if ( isUrl( icon ) ) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if ( icon.startsWith( 'icon-' ) ) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

@connect( ( { marketing } ) => ( {
  percentList:marketing.percentList,
  productMassageList:marketing.productMassageList,
  yesterdayProductList:marketing.yesterdayProductList
} ) )

class OrderAmounts extends PureComponent{
  state = {
    start:moment().format( 'YYYY-MM-DD' ),
    end:moment().format( 'YYYY-MM-DD' ),
    yesterdayStart:moment().subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
    yesterdayEnd:moment().subtract( 1, 'days' ).format( 'YYYY-MM-DD' ),
    stateType:{
      "今日待支付订单额":"WAITING_PAY",
      "今日支付成功订单额":"FINISH",
      "今日退款订单额":"REFUNDED"
    },
    clickType:''
  };


  componentDidMount() {
    this.fetchPercent();
    this.fetchProductMassage( "今日支付成功订单额" );
  }

  componentWillUnmount(){
    
  }

  // 获取饼图数据
  fetchPercent = () => {
    const { start, end } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'marketing/getPercentList',
      payload: {
        start,
        end,
        states:'WAITING_PAY&states=REFUNDED&states=FINISH'
      },
    } );
  }

  // 点击饼图获取右边相应今日数据
  fetchProductMassage = ( item ) => {
    const { start, end, stateType, clickType } = this.state;
    if( clickType === item )return
    
    const { dispatch } = this.props;
    this.fetchYesterdayProduct( item )
    dispatch( {
      type: 'marketing/getProductMassage',
      payload: {
        start,
        end,
        state: stateType[item]
      },
    } );
  }

   // 点击饼图获取右边相应昨日数据
  fetchYesterdayProduct = ( item ) => {
    const { yesterdayStart, yesterdayEnd, stateType } = this.state;
    this.setState( { clickType:item } )
    const { dispatch } = this.props;
    dispatch( {
      type: 'marketing/getYesterdayProduct',
      payload: {
        start:yesterdayStart,
        end:yesterdayEnd,
        state:stateType[item]
      },
    } );
  }


  render(){
    const { percentList, productMassageList, yesterdayProductList } =this.props;
    const { stateType, clickType } = this.state;


    // 今日完成订单额,待支付,退款  额
    const todayAmount =JSON.stringify( productMassageList ) === '[]' ? 0 : ( productMassageList.amounts.length>0 ? productMassageList.amounts.map( item => item.discountAmount || 0 ):0 );
    // 今日完成订单数,待支付,退款  单
    const allTodayCounts = JSON.stringify( productMassageList ) === '[]' ? 0 :( productMassageList.counts.length>0 ?  productMassageList.counts.map( item => item.amount || 0 ):0 );

    // 昨日完成订单额,待支付,退款  额
    const yesterdayAmount =JSON.stringify( yesterdayProductList ) === '[]' ?  0 : ( yesterdayProductList.amounts.length>0 ? yesterdayProductList.amounts.map( item => item.discountAmount || 0 ):0 );
    // 昨日完成订单数,待支付,退款  单
    const allYesterdayCounts = JSON.stringify( yesterdayProductList ) === '[]'? 0 :( yesterdayProductList.counts.length>0 ?  yesterdayProductList.counts.map( item => item.amount || 0 ):0 );
    
    return (
      <div>
        
        <div className={styles.detail}>
          <div style={{ width:'36%', height:'330px', float:'left' }}>
            {
                JSON.stringify( percentList ) === '{}' ?
                  <div style={{ textAlign:'center', color:'#ccc', marginTop:'50px'  }}>
                    <p className={styles.notData}>{getIcon( 'icon-zanwushuju1' )}</p>
                    <p>暂无数据</p>
                  </div>
                  :
                  <Innerlabel percentList={percentList} fetchProductMassage={this.fetchProductMassage} />
              }
          </div>

          <div className={styles.orderAmount}>
            {
                stateType[clickType] === "FINISH" ?
                  <div>
                    <div className={styles.order}>
                      <p>完成订单额(元)</p>
                      <ul>
                        <li>
                          <span>今日</span>
                          <span className={styles.firstNum}>{todayAmount || 0}</span>
                        </li>

                        <li>
                          <span>昨日</span>
                          <span className={styles.num}>{yesterdayAmount || 0}</span>
                        </li>

                        <li>
                          <span>对比昨日</span>
                          <span className={styles.num}>
                            {
                              ( todayAmount - yesterdayAmount )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
                              }
                            {Math.abs( todayAmount - yesterdayAmount ).toFixed( 2 )}
                          </span>
                        </li>

                      </ul>
                    </div>

                    <div className={styles.orderNumder}>
                      <p>完成订单总数(个)</p>
                      <ul>
                        <li>
                          <span>今日</span>
                          <span style={{ float:'right' }}>{allTodayCounts}</span>
                        </li>

                        <li>
                          <span>昨日</span>
                          <span style={{ float:'right' }}>{allYesterdayCounts }</span>
                        </li>

                        <li>
                          <span>对比昨日</span>
                          <span style={{ float:'right' }}>
                            {
                              ( allTodayCounts - allYesterdayCounts )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
                            }
                            {Math.abs( allTodayCounts - allYesterdayCounts )}
                          </span>
                        </li>

                      </ul>
                    </div>

                  </div>
                  : null
              }
            {
                stateType[clickType] === "WAITING_PAY" ? 
                  <div>
                    <div className={styles.order}>
                      <p>待支付订单额(元)</p>
                      <ul>
                        <li>
                          <span>今日</span>
                          <span className={styles.firstNum}>{todayAmount || 0}</span>
                        </li>

                        <li>
                          <span>昨日</span>
                          <span className={styles.num}>{yesterdayAmount || 0}</span>
                        </li>

                        <li>
                          <span>对比昨日</span>
                          <span className={styles.num}>
                            {
                            ( todayAmount - yesterdayAmount )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
                          }
                            {Math.abs( todayAmount - yesterdayAmount ).toFixed( 2 )}
                          </span>
                        </li>

                      </ul>
                    </div>

                    <div className={styles.orderNumder}>
                      <p>待支付订单总数(个)</p>
                      <ul>
                        <li>
                          <span>今日</span>
                          <span style={{ float:'right' }}>{allTodayCounts || 0 }</span>
                        </li>

                        <li>
                          <span>昨日</span>
                          <span style={{ float:'right' }}>{allYesterdayCounts|| 0 }</span>
                        </li>

                        <li>
                          <span>对比昨日</span>
                          <span style={{ float:'right' }}>
                            {
                            ( allTodayCounts - allYesterdayCounts )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
                          }
                            {Math.abs( allTodayCounts - allYesterdayCounts )}
                          </span>
                        </li>

                      </ul>
                    </div>

                  </div>
                : null
              }
            {
                stateType[clickType] === "REFUNDED" ? 
                  <div>
                    <div className={styles.order}>
                      <p>退款订单额(元)</p>
                      <ul>
                        <li>
                          <span>今日</span>
                          <span className={styles.firstNum}>{ todayAmount || 0}</span>
                        </li>

                        <li>
                          <span>昨日</span>
                          <span className={styles.num}>{yesterdayAmount|| 0 }</span>
                        </li>

                        <li>
                          <span>对比昨日</span>
                          <span className={styles.num}>
                            {
                          (  todayAmount - yesterdayAmount  )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
                        }
                            {Math.abs(  todayAmount - yesterdayAmount  ).toFixed( 2 )}
                          </span>
                        </li>

                      </ul>
                    </div>

                    <div className={styles.orderNumder}>
                      <p>退款订单总数(个)</p>
                      <ul>
                        <li>
                          <span>今日</span>
                          <span style={{ float:'right' }}>{ allTodayCounts || 0 }</span>
                        </li>

                        <li>
                          <span>昨日</span>
                          <span style={{ float:'right' }}>{allYesterdayCounts || 0 }</span>
                        </li>

                        <li>
                          <span>对比昨日</span>
                          <span style={{ float:'right' }}>
                            {
                          (   allTodayCounts - allYesterdayCounts )<0 ? <Icon type="arrow-down" style={{ fontSize:12, color:'green' }} /> : <Icon type="arrow-up" style={{ fontSize:12, color:'red' }} />
                        }
                            {Math.abs(   allTodayCounts - allYesterdayCounts )}
                          </span>
                        </li>

                      </ul>
                    </div>

                  </div>
                : null
              }
          </div>
        </div>

      </div>
    )
  }

}

export default OrderAmounts;
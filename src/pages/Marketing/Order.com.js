import React from "react";
import { Radio, Icon } from "antd";
import { connect } from 'dva';
import moment from 'moment';
import Title from './Title.com';
import PieChart from './PieChart.com';
import BarChart from './BarChart.Com';
import styles from './index.less'

@connect( ( { marketing } ) => ( {
  productMassageList: marketing.productMassageList,
  yesterdayProductList: marketing.yesterdayProductList,
  piesaleData: marketing.pieSaleData,
  pieamountData: marketing.pieAmountData,
  orderBarList: marketing.orderBarList,
  amountChange: marketing.amountChange,
  saleChange: marketing.saleChange,
} ) )
class OrderCom extends React.PureComponent {
  state = {
    start: moment().subtract( 9, 'days' ).format( 'YYYY-MM-DD' ),
    end: moment().format( 'YYYY-MM-DD' ),
    radioValue:'sale'
  };

  componentDidMount() {
    this.getOrderData()
    this.getPieData()
    // this.fetchProductMassage( "今日支付成功订单额" );
  }

  getOrderData = () => {
    const { dispatch } = this.props;
    const { start, end } = this.state;

    dispatch( {
      type: 'marketing/getOrderData',
      payload: {
        start,
        end,
      },
    } );
  }

  getPieData = () => {
    const { dispatch } = this.props;
    const {  end, radioValue } = this.state;
    
    dispatch( {
      type: 'marketing/getPieData',
      payload: {
        start: end,
        end,
        type: radioValue
      },
    } );
  }


  onChange = ( e ) =>{
    this.setState( { radioValue:e.target.value }, ()=>{
      this.getPieData()
    } )
  }

  render() {
    const { orderBarList, noData, winSizeState } = this.props;
    
    const {  radioValue } = this.state;
    return (
      <div>
        <Title name='订单概况' />
        <Radio.Group 
          style={{ position: 'absolute',
            top: 13,
            right: 15,
            fontSize: 12,
          }}
          onChange={this.onChange} 
          value={radioValue}
        >
          <Radio.Button value="sale">订单额</Radio.Button>
          <Radio.Button value="amount">订单数</Radio.Button>
        </Radio.Group>

        <div className={styles.orderData}>
          <span style={{ color:'#8c8c8c', fontSize:'16px', fontWeight:'600' }}>今日{radioValue === 'sale' ? '订单额' : '订单数'}分布</span>
          <div style={{ fontSize:17, color:'#000' }}>
            <span>￥<span style={{ fontSize:'33px' }}>{this.props[`${radioValue}Change`] && this.props[`${radioValue}Change`].today}</span></span>
            <span style={{ marginLeft:'5px' }}>（{radioValue === 'sale' ? '元' : '单'}）</span>
            <span style={{ fontSize:'11px' }}>
              {
                ( this.props[`${radioValue}Change`] && ( this.props[`${radioValue}Change`].today - this.props[`${radioValue}Change`].yesterday )>= 0 ) ? 
                  <Icon type="arrow-up" style={{ color:'#1bb557' }} />
                :
                  <Icon type="arrow-down" style={{ color:'#f5222d' }} />
              }
              {this.props[`${radioValue}Change`] ? ( this.props[`${radioValue}Change`].today - this.props[`${radioValue}Change`].yesterday ).toFixed( 2 ) : 0}
            </span>
          </div>
          {/* <span style={{ fontSize:'12px', color:'#8c8c8c' }}>昨日：{this.props[`${radioValue}Change`] && this.props[`${radioValue}Change`].yesterday}</span> */}
        </div>

        {this.props[`pie${radioValue}Data`] && this.props[`pie${radioValue}Data`].length >0 &&  
        <PieChart 
          data={this.props[`pie${radioValue}Data`]} 
          changeData={this.props[`${radioValue}Change`]}
          type={radioValue}
        />}
        {
          this.props[`pie${radioValue}Data`] && this.props[`pie${radioValue}Data`] .length === 0 && 
          <div style={{ height:165, marginTop:40, marginBottom:10 }}>
            {noData}
          </div>
        }
        <div>
          {
            orderBarList && orderBarList.length > 0  ?
              <BarChart
                // noData={noData}
                winSizeState={winSizeState}
                list={orderBarList}
                legendStyle={{ top:40 }}
                isOrder
                options={{
                xAxis: 'time',
                yAxis: [
                  { key: 'sale', name: '总销售额', color: '#47A1F7' },
                  { key: 'amount', name: '总销售量', color: '#FC9B00' }
                ]
              }
              }
              />
            :
              <div style={{ height:290, marginTop:40 }}>
                {noData}
              </div>
          }
        </div>
      </div>
    )
  }
}

export default OrderCom
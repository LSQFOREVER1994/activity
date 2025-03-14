import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend
} from "bizcharts";
import DataSet from "@antv/data-set";
import { Tabs, Radio, DatePicker, Spin } from 'antd';
import moment from 'moment';
import styles from './dashboard.less';

const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

const getNumText = (num) => {
  let text = num;
  if (num >= 100000000) {
    text = `${(num / 100000000)}亿`;
  } else if (num < 100000000 && num > 10000) {
    text = `${(num / 10000)}万`;
  }
  return text;
};

@connect(({ dashboard }) => ({
  goodsList: dashboard.goodsList,
  amountList: dashboard.amountList,
  orderSalesList: dashboard.orderSalesList,
  loading: dashboard.loading,
  moneyList: dashboard.moneyList
}))
class Sales extends PureComponent {

  state = {
    // start: moment().format('YYYY-MM-DD'),
    // end: moment().format('YYYY-MM-DD'),
    start: moment().subtract('days', 6).format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
    productId: '',
    timeType: 'thisWeek',
    saleType: 'sales',
    amountMap: {all: true},
    amountGetMap: {all: true},
    moneyGetMap: {all: true},
    moneyMap: {all: true}
  }

  componentWillMount(){
    const { dispatch } = this.props;
    const { start, end } = this.state;
    // dispatch({
    //   type:'dashboard/searchGoods',
    //   payload:{
    //     keyword:'',
    //     pageSize:1000,
       
    //   }
    // })
    dispatch({
      type: 'dashboard/initGetOrderData',
      payload:{
        start, end, productId:''
      }
    })
    
    // this.getdateList()
    // this.getOrderSalesList(start, end, '', saleType);

  }


  getdateList = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'dashboard/getTodaySales',
      payload:{
        productId: '',
      }
    })
  }

  changeDayGetOrder = () => {
    const { start, end, amountGetMap, moneyGetMap,saleType } = this.state;
    const { dispatch } = this.props;
    dispatch(({
      type: 'dashboard/changeDayGetOrder',
      payload:{start,end,getMap:saleType === 'sales' ? moneyGetMap:amountGetMap,saleType}
    }))
  }

  getOrderSalesList = () =>{
    const { start, end, productId, saleType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: saleType === 'sales' ? 'dashboard/getOrderSales': 'dashboard/getOrderCounts',
      payload:{
        start,
        end,
        productId,
      }
    })
  }

  // timeChange = (e) =>{
  //   const { productId } = this.state;
  //   const { value } = e.target;
  //   let startTime = '';
  //   let endTime = '';
  //   if(value === 'today'){
  //     startTime = moment().format('YYYY-MM-DD');
  //     endTime = moment().format('YYYY-MM-DD');
  //     this.getdateList(productId)
  //   } else if(value === 'thisWeek'){
  //     startTime = moment().startOf('week').format('YYYY-MM-DD');
  //     endTime = moment().endOf('week').format('YYYY-MM-DD');
  //     this.getOrderSalesList(startTime, endTime, productId)
  //   } else if(value === 'thisMonth'){
  //     startTime = moment().startOf('month').format('YYYY-MM-DD');
  //     endTime =moment().endOf('month').format('YYYY-MM-DD');
  //     this.getOrderSalesList(startTime, endTime, productId)
  //   }
  //   this.setState({ start: startTime, end: endTime, timeType: value })
  // }

  // rangeChange = (time) =>{
  //   const { productId } = this.state;
  //   const start = moment(time[0]).format('YYYY-MM-DD');
  //   const end = moment(time[1]).format('YYYY-MM-DD');
  //   this.setState({ start, end, timeType: ''  })
  //   if(moment(time[0]).isSame(time[1], 'day') && moment(time[0]).isSame(moment(), 'day')){
  //     this.getdateList(productId)
  //   }else{
  //     this.getOrderSalesList(start, end, productId)
  //   }
  // }
  // goodsChange = (value) =>{
  //   const { timeType, start, end } = this.state;
  //   if(timeType === 'today'){
  //     this.getdateList(value)
  //   }else{
  //     this.getOrderSalesList(start, end, value)
  //   }
  //   this.setState({ productId: value })
  // }

  timeChange = (e) =>{
    const { value } = e.target;
    let startTime = '';
    let endTime = '';
    if(value === 'today'){
      startTime = moment().format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else if(value === 'thisWeek'){
      // startTime = moment().startOf('week').format('YYYY-MM-DD');
      // endTime = moment().endOf('week').format('YYYY-MM-DD');
      startTime = moment().subtract('days', 6).format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else if(value === 'thisMonth'){
      // startTime = moment().startOf('month').format('YYYY-MM-DD');
      // endTime =moment().endOf('month').format('YYYY-MM-DD');
      startTime = moment().subtract('days', 29).format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
      
    }
   
    this.setState({ start: startTime, end: endTime, timeType: value },()=>{
       this.changeDayGetOrder()
    })
  }

  rangeChange = (time) =>{
    const start = moment(time[0]).format('YYYY-MM-DD');
    const end = moment(time[1]).format('YYYY-MM-DD');
    this.setState({ start, end, timeType: ''  },()=>{
      this.changeDayGetOrder()
    })
    
  }

  goodsChange = (value) =>{    
    this.setState({ productId: value },()=>{
      this.getOrderSalesList()
    })
  }

  tabChange = (saleType) =>{
    
     this.setState({ saleType },()=>{
       this.changeDayGetOrder()
     });
    
   
  }

  renderTabRight = () =>{
    const { start, end, timeType } = this.state;
    return(
      <div>
        {/* <Select
          allowClear
          onChange={this.goodsChange}
          showSearch
          style={{ width: 180,marginRight: '20px' }}
          placeholder={`${formatMessage({ id: 'form.select' })}${formatMessage({ id: 'strategyMall.coupons.specifiedGoods' })}`}
          optionFilterProp="children"
          onDropdownVisibleChange={this.getGoods}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            goodsList&&goodsList.length && goodsList.map(item=>(
              <Option key={item.id} value={item.id}>{item.name}</Option>
            ))
          }
        </Select> */}
        <RadioGroup value={timeType} onChange={this.timeChange} defaultValue="today">
          {/* <RadioButton value="today">今日</RadioButton> */}
          <RadioButton value="thisWeek">近7天</RadioButton>
          <RadioButton value="thisMonth">近30天</RadioButton>
        </RadioGroup>

        <RangePicker
          allowClear={false}
          // ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')] }}
          value={[moment(start), moment(end)]}
          onChange={this.rangeChange}
          // disabledDate={this.disabledDate}
          style={{ marginLeft: '20px', width: '300px '}}
        />
      </div>
    )
  
  }

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  getGoodOrder = () => {
    const { start, end, productId,saleType } = this.state;
    
    const { goodsList, dispatch } = this.props;
    const product = goodsList.find(item => item.id.toString() === productId)
    
    dispatch({
      type:'dashboard/getGoodOrder',
      payload:{
        start, end, productId, product, saleType
      }
    })
  }

  legendClick = (e,type) => {    
    const { amountMap, amountGetMap,moneyGetMap,moneyMap } = this.state;
    const productId = e.item.dataValue
    const newMap = type === 'sales' ? {...moneyMap} :  {...amountMap}
    if (e.checked ) {
      newMap[productId] = true
      if(type === 'sales') {
        this.setState({moneyMap:newMap,productId,moneyGetMap:newMap},()=>{
          if (!moneyGetMap[productId]) this.getGoodOrder()
        })
      }else{
        this.setState({amountMap:newMap,productId,amountGetMap:newMap},()=>{
          if (!amountGetMap[productId]) this.getGoodOrder()
        })
      }
      
    }else {
       newMap[productId] = false
       if(type === 'sales') this.setState({moneyMap:newMap})
       else this.setState({amountMap:newMap})
       
    } 

  }
  
  renderChar = (list,type) => {
    const { goodsList } = this.props;
    const cols = {
      amount: { min: 0 },
      time: { range: [0, 1] },
    };
 
     const ds = new DataSet();
     const dv = ds.createView().source(list);
     const goodMap = {all:'全部'}
     const fields = ['all']
     goodsList.forEach(good => {
       fields.push(good.id.toString())
      goodMap[good.id] = good.name
     })
     dv.transform({
       type: 'fold',
       fields, // 展开字段集
       key: 'saleKey', // key字段
       value: 'sum', // value字段
     });
    const filterValue = val => type === 'sales' ? this.state.moneyMap[val] : this.state.amountMap[val];
    const axisLabel = val => type === 'sales' ? `${getNumText(val)}元` : `${val}单`
    return(
      <div>
        {
            list.length ?
              <Chart 
                height={450}
                data={dv}
                padding={{ top: 30, right: 60, bottom: 80, left: 60 }}
                scale={cols}
                forceFit
                filter={[ ['saleKey', val => filterValue(val)]]}
              >
                <Axis name="time" label={{ autoRotate: false }} />
                <Axis name="sum" label={{ formatter: val => axisLabel(val)}} />
                <Tooltip 
                  crosshairs={{ type: "y" }} 
                />
                <Legend 
                  onClick={(e)=>{this.legendClick(e,type)}} 
                  itemFormatter={(val => goodMap[val])}
                  offsetY={-10}
                />
                <Geom
                  color="saleKey"
                  type="line"
                  position="time*sum"
                  size={2}
                  tooltip={['time*sum*saleKey', (time, sum,saleKey) => {
                  return {
                    name: goodMap[saleKey],
                    title: time.substring(0,10),
                    value: sum
                  };
                 }]}
                />
              </Chart>
            : <div className={styles.nullData}>暂无数据</div>
          }
      </div>
    )
  }

  render() {
    const { containerWidth, amountList,loading,moneyList } = this.props
    
    
    return (
      <div className={styles.salesRank} ref={(div) => { this.container = div; }}>
        <div className={styles.salesTitle}>销售情况</div>
        <Spin spinning={loading}>
          <Tabs
            tabBarStyle={{ padding: '0px 15px' }}
            onChange={this.tabChange}
            tabBarExtraContent={containerWidth < 850 ? null : this.renderTabRight()}
          >
            <TabPane
              tab="销售额"
              key="sales"
            >
              {  moneyList &&  this.renderChar(moneyList,'sales') }
              
            </TabPane>
            <TabPane
              tab="销售量"
              key="count"
            >
              { amountList &&  this.renderChar(amountList,'count') }
            </TabPane>
           
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default Sales;

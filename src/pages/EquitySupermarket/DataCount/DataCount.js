/* eslint-disable array-callback-return */
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { Button, Table, Card, Select, Row, Col, DatePicker, Radio, Spin, Empty, Collapse, Form } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './DataCount.less';
import { exportXlsx } from '@/utils/utils';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;
const FormItem = Form.Item;

@connect( ( { dataCount } ) => {
  return {
    ...dataCount
  }
} )
@Form.create()
class DataCount extends PureComponent {
  cols = {
    consume: {
      min: 0,
      range: [0., 0.8],
      alias: '商品数量'
    },
    date: {
      range: [0.05, 0.95],
    }
  }

  constructor() {
    super();
    this.state = {
      isExPLoading: false,
      dateType: 'TIMEFRAME',
      startTime: '',
      endTime: '',
      lineData: [],
      topData: {},
      bardataLeft: [],
      leftFields: [''],
      bardataRight: [],
      rightFields: [''],
      lineType: 'RED',
      merchantCode: '',
      merchantId: '',
      merchantName: '',
      red: [],
      coupon: [],
    }
  }

  componentDidMount() {
    this.getMerchantName();
    const startTime = moment( this.getDay( -30 ) ).format( 'YYYY-MM-DD 00:00:00' )
    const endTime = moment().format( 'YYYY-MM-DD 23:59:59' )
    this.setState( {
      startTime, endTime
    }, () => {
      this.getAllData();
    } )
  };

  getAllData = () => {
    const { merchantCode } = this.state;
    this.getTopData();
    if ( merchantCode === '' ) this.getRightConsumeRank();
    this.getLineData();
    this.getDetail();
    this.getRankData();
  }

  // 获取消耗排行数据
  getRankData = () => {
    const { dispatch } = this.props;
    const { startTime, endTime, merchantCode } = this.state;
    dispatch( {
      type: 'dataCount/getTypeRank',
      payload: {
        startTime,
        endTime,
        merchantCode,
        limit: 5
      },
      callFunc: ( res ) => {
        this.setState( {
          red: res.result.RED,
          coupon: res.result.COUPON,
        } )
      }
    } )
  }

  // 获取消耗总趋势数据
  getLineData = () => {
    const { dispatch } = this.props;
    const { startTime, endTime, lineType, merchantCode } = this.state;
    const params = {
      startTime: moment( startTime ).valueOf(),
      endTime: moment( endTime ).valueOf(),
      rightType: lineType
    }
    if ( merchantCode ) params.merchantCode = merchantCode
    dispatch( {
      type: 'dataCount/getRightTrend',
      payload: params,
      callFunc: ( res ) => {
        this.setState( {
          lineData: res.result
        } )
      }
    } )
  }

  // 获取消耗排行数据
  getRightConsumeRank = () => {
    const { dispatch } = this.props;
    const { startTime, endTime } = this.state;
    dispatch( {
      type: 'dataCount/getRightConsumeRank',
      payload: {
        startTime: moment( startTime ).valueOf(),
        endTime: moment( endTime ).valueOf(),
      },
      callFunc: ( res ) => {
        this.handleMerchantRightRank( res.result )
      }
    } )
  }

  // 商品消耗明细
  getDetail = () => {
    const { dispatch } = this.props;
    const { startTime, endTime, merchantCode } = this.state;
    dispatch( {
      type: 'dataCount/getConsumeDetail',
      payload: {
        startTime,
        endTime,
        merchantCode,
      },
    } )
  }

  // 头部数据
  getTopData = () => {
    const { dispatch } = this.props;
    const { startTime, endTime, merchantCode } = this.state;
    dispatch( {
      type: 'dataCount/getConsumeData',
      payload: {
        merchantCode,
        startTime,
        endTime,
      },
      callFunc: ( res ) => {
        this.handleTopData( res.result )
      }
    } )
  }

  // 下拉框商户名称列表
  getMerchantName = () => {
    const { dispatch, form } = this.props;
    const name = ""
    dispatch( {
      type: 'dataCount/getMerchantNames',
      payload: { name },
      callFunc: () => {
        form.setFieldsValue( { name: '' } )
      }
    } );
  }

  // 跳转到消耗订单
  handleToConsumeOrder = ( item ) => {
    const { dispatch } = this.props;
    const { merchantId } = this.state
    const record = { merchantId, createTime: moment( item.date ) }
    dispatch( routerRedux.push( {
      pathname: '/equitySupermarket/dataManage/consumeOrder', // 这个路由为要跳转的页面（在router.config中定义）
      query: { data: record }
    } ) )
  }

  // 导出商品消耗明细
  exportConsumeList = ( e ) => {
    e.stopPropagation()
    const { startTime, endTime, merchantCode, merchantName } = this.state;
    const obj = {
      startTime: moment( startTime ).format( 'YYYY-MM-DD HH:mm:ss' ),
      endTime: moment( endTime ).format( 'YYYY-MM-DD HH:mm:ss' ),
      merchantCode
    }
    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys( obj ).forEach( key => {
      if ( obj[key] || typeof obj[key] === 'boolean' ) {
        return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
      }
    } )
    let ajaxUrl = `statistics/consume/detail/export`
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      ajaxUrl = `statistics/consume/detail/export?${paramStr}`
    }
    this.setState( {
      isExPLoading: true
    }, () => {
      exportXlsx( {
        type: 'equityCenterService',
        uri: ajaxUrl,
        xlsxName: `数据统计-${merchantName}商品消耗明细.xlsx`,
        callBack: () => {
          this.setState( {
            isExPLoading: false
          } )
        }
      } )
    } )
  }

  // 折线图按钮组数据
  changeLineData = ( e ) => {
    // console.log(e.target.value)
    this.setState( {
      lineType: e.target.value
    }, () => {
      this.getLineData()
    } )
  }

  handleMerchantRightRank = ( data ) => {
    const objCOUPON = { name: '虚拟卡券' };
    const objGOODS = { name: '实物' };
    const objRED = { name: '红包' };
    const objPHONE = { name: '话费' };
    let leftFields = [];
    let rightFields = [];
    data.map( i => {
      if ( i.rightType === "COUPON" ) {
        if ( Object.keys( i.consumePoList ).length ) {
          i.consumePoList.map( item => {
            if( item.name ) objCOUPON[item.name] = item.sendCount;
            leftFields.push( item.name )
          } )
        }
      }
      else if ( i.rightType === "GOODS" ) {
        if ( Object.keys( i.consumePoList ).length ){
          i.consumePoList.map( item => {
            if ( item.name ) objGOODS[item.name] = item.sendCount
            leftFields.push( item.name )
          } )
        }
      }
      else if ( i.rightType === "RED" ) {
        if ( Object.keys( i.consumePoList ).length ){
          i.consumePoList.map( item => {
            if ( item.name ) objRED[item.name] = item.sendCount ;
            rightFields.push( item.name )
          } )
        }
      }
      else if ( i.rightType === "PHONE" ) {
        if ( Object.keys( i.consumePoList ).length ){
          i.consumePoList.map( item => {
            if ( item.name )( objPHONE[item.name] = item.sendCount );
            rightFields.push( item.name )
          } )
        }
      }
    } );
    leftFields = Array.from( new Set( leftFields ) );
    rightFields = Array.from( new Set( rightFields ) );
    this.setState( {
      leftFields: leftFields.length === 0 ? [''] : leftFields,
      bardataLeft: Object.keys( objCOUPON ).length === 1 && Object.keys( objGOODS ).length === 1 ? [] : [objCOUPON, objGOODS],
      rightFields: rightFields.length === 0 ? [''] : rightFields,
      bardataRight: Object.keys( objRED ).length === 1 && Object.keys( objPHONE ).length === 1 ? [] : [objRED, objPHONE],
    } )
  }

  handleTopData = ( data ) => {
    const topData = {};
    data.map( item => {
      if ( item.rightType === "COUPON" ) {
        topData.COUPONconsume = this.numFormat( item.consume )
        topData.COUPONstock = this.numFormat( item.stock )
      }
      else if ( item.rightType === "GOODS" ) {
        topData.GOODSconsume = this.numFormat( item.consume )
        topData.GOODSstock = this.numFormat( item.stock )
      }
      else if ( item.rightType === "RED" ) {
        topData.REDconsume = this.numFormat( item.consume.toFixed( 2 ) )
        topData.REDstock = this.numFormat( item.stock.toFixed( 2 ) )
      }
      else if ( item.rightType === "PHONE" ) {
        topData.PHONEconsume = this.numFormat( item.consume )
        topData.PHONEstock = this.numFormat( item.stock )
      }
    } )
    this.setState( {
      topData
    } )
  }

  // 时间选择器
  /* 控制时间选择范围30天 */
  disabledDate = ( current ) => {
    const { selectDate } = this.state
    if ( !current || !selectDate ) return false;
    const offsetV = 2592000000;                 // 30天转换成ms
    const selectV = selectDate.valueOf();
    const currentV = current.valueOf();
    return !!( ( ( currentV - offsetV ) > selectV || ( currentV + offsetV ) < selectV ) );
  }

  /* 选择任务时间变化 */
  onDateChange = ( dates ) => {
    if ( !dates || !dates.length ) return;
    this.setState( { selectDate: dates[0] } )
  }

  onDateOpenChange = () => {
    this.setState( { selectDate: '' } )
  }

  onChangeTimeRange = ( value ) => {
    const startTime = value.length ? moment( value[0] ).format( 'YYYY-MM-DD 00:00:00' ) : this.getDay( -30 ).format( 'YYYY-MM-DD 00:00:00' );
    const endTime = value.length ? moment( value[1] ).format( 'YYYY-MM-DD 23:59:59' ) : this.getDay( 0 ).format( 'YYYY-MM-DD 23:59:59' );
    this.setState( {
      startTime,
      endTime
    }, () => {
      this.getAllData();
    } )
  }

  numFormat = ( num ) => {
    const res = num.toString().replace( /\d+/, ( n ) => { // 先提取整数部分
      return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
        return `${$1},`;
      } );
    } )
    return res;
  }

  // 获取当前月份
  doHandleMonth = ( month ) => {
    let m = month;
    if ( month.toString().length === 1 ) {
      m = `0${month}`;
    }
    return m;
  }

  // 获取日期默认值
  getDay = ( num ) => {
    const nowDate = moment()
    let date = nowDate
    if ( num > 0 ) date = moment( nowDate ).add( 1, "days" );
    if ( num < 0 ) date = moment( nowDate ).subtract( Math.abs( num ), "days" );
    return moment( date, 'YYYY-MM-DD' );
  }

  // 顶部按钮组
  handleDataChange = ( e ) => {

    let startTime
    let endTime
    if ( e.target.value === "TODAY" ) {
      startTime = moment().format( 'YYYY-MM-DD 00:00:00' )
      endTime = moment().format( 'YYYY-MM-DD 23:59:59' )
    }
    else if ( e.target.value === "YESTERDAY" ) {
      startTime = moment( this.getDay( -1 ) ).format( 'YYYY-MM-DD 00:00:00' )
      endTime = moment( this.getDay( -1 ) ).format( 'YYYY-MM-DD 23:59:59' )
    }
    else {
      startTime = moment( this.getDay( -30 ) ).format( 'YYYY-MM-DD 00:00:00' )
      endTime = moment().format( 'YYYY-MM-DD 23:59:59' )
    }
    this.setState( {
      dateType: e.target.value,
      startTime,
      endTime
    }, () => {
      this.getAllData();
    } )
  }

  // 下拉框
  onChangeMerchant = ( value ) => {
    const { merchantNames } = this.props;
    const merchant = merchantNames.filter( item => {
      if ( item.code === value ) return item
    } )
    const merchantCode = merchant[0] ? merchant[0].code : '';
    const merchantId = merchant[0] ? merchant[0].id : '';
    const merchantName = merchant[0] ? merchant[0].name : '';
    this.setState( {
      merchantCode,
      merchantId,
      merchantName
    }, () => {
      this.getAllData();
    } )
  }

  // 商户商品消耗排行
  renderBar = () => {
    const { loading } = this.props;
    const { bardataLeft, leftFields, bardataRight, rightFields } = this.state;
    const ds1 = new DataSet();
    const ds2 = new DataSet();
    const dv1 = ds1.createView().source( bardataLeft );
    const dv2 = ds2.createView().source( bardataRight );
    dv1.transform( {
      type: "fold",
      fields: leftFields,
      // 展开字段集
      key: "商户名",
      // key字段
      value: "消耗量" // value字段
    } );

    dv2.transform( {
      type: "fold",
      fields: rightFields,
      key: "商户名",
      value: "消耗量"
    } );

    return (
      <Card
        bordered={false}
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>商户商品消耗排行</div>}
        style={{ marginBottom: '20px' }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Spin spinning={loading}>
              <h3 className={styles.mainTitle}>商户虚拟卡券/实物消耗排行前五</h3>
              {
                !dv1.origin.length ? <Empty style={{ padding: '100px' }} /> :
                <Chart height={document.body.scrollWidth <= 1440 ? 400 : 500} width={465} data={dv1} forceFit>
                  <Legend />
                  <Axis name="商户名" />
                  <Axis name="消耗量" />
                  <Tooltip />
                  <Geom
                    type="intervalStack"
                    position="商户名*消耗量"
                    color={["name", ["#fe6249", "#fdbc5e"]]}
                    style={{ stroke: "#fff", lineWidth: 1 }}
                    size={['value',
                        () => { return 60; }
                      ]}
                  />
                </Chart>
              }
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={loading}>
              <h3 className={styles.mainTitle}>商户红包/话费消耗排行前五</h3>
              {
                !dv2.origin.length ? <Empty style={{ padding: '100px' }} /> :
                <Chart height={document.body.scrollWidth <= 1440 ? 400 : 500} width={465} data={dv2} forceFit>
                  <Legend />
                  <Axis name="商户名" />
                  <Axis name="消耗量" />
                  <Tooltip />
                  <Geom
                    type="intervalStack"
                    position="商户名*消耗量"
                    color={["name", ["#fe6249", "#fdbc5e"]]}
                    style={{ stroke: "#fff", lineWidth: 1 }}
                    size={['value',
                        () => { return 60; }
                      ]}
                  />
                </Chart>
              }
            </Spin>
          </Col>
        </Row>
      </Card>
    )
  }

  // 商品消耗总趋势
  renderTrend = () => {
    const { loading } = this.props;
    return (
      <Card
        bordered={false}
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>商品消耗总趋势</div>}
        style={{ marginBottom: '20px' }}
        extra={
          <Radio.Group onChange={this.changeLineData} defaultValue="RED">
            <Radio.Button value="RED">红包</Radio.Button>
            <Radio.Button value="PHONE">话费</Radio.Button>
            <Radio.Button value="COUPON">虚拟卡券</Radio.Button>
            <Radio.Button value="GOODS">实物</Radio.Button>
          </Radio.Group>
        }
      >
        <Row>
          <Spin spinning={loading}>
            <Chart height={document.body.scrollWidth <= 1440 ? 300 : 400} padding={[50, 50, 50, 50]} data={this.state.lineData} scale={this.cols} forceFit>
              <Axis
                name="consume"
                title={{
                  position: 'end',
                  offset: 5.5,
                  textStyle: {
                    fontSize: '12',
                    textAlign: 'center',
                    fill: '#999',
                    fontWeight: 'bold',
                    rotate: 0,
                  }
                }}
                label={{ autoRotate: false }}
              />
              <Axis
                name=""
                title={{
                  position: 'end',
                  offset: -15,
                  textStyle: {
                    fontSize: '14',
                    textAlign: 'right',
                    fill: '#000',
                    // fontWeight: 'bold',
                    rotate: 0,
                  }
                }}
                label={{ autoRotate: false }}
              />
              <Tooltip crosshairs={{ type: "y" }} />
              <Geom
                type="line"
                position="date*consume"
                size={2}
                color="#fdbd5c"
                tooltip={['date*consume', ( date, consume ) => {
                  return { name: '消耗量', value: consume, title: date }
                }]}
              />
              <Geom
                type="point"
                position="date*consume"
                size={4}
                color="#fdbd5c"
                shape="hollowCircle"
                style={{ stroke: "#fff", lineWidth: 2 }}
                tooltip={['date*consume', ( date, consume ) => {
                  return { name: '数值', value: consume, title: date }
                }]}
              />
            </Chart>
          </Spin>
        </Row>
      </Card>
    )
  }

  // 商品消耗排行
  renderTypeRank = () => {
    const { loading } = this.props;
    const { red, coupon } = this.state;
    const ds = new DataSet();
    const dv3 = coupon && ds.createView().source( coupon );
    const dv4 = red && ds.createView().source( red );
    if ( coupon ) {
      dv3.transform( {
        type: "sort",
        callback( a, b ) {
          // 排序依据，和原生js的排序callback一致
          return a.amount - b.amount;
        }
      } );
    }

    if ( red ) {
      dv4.transform( {
        type: "sort",
        callback( a, b ) {
          // 排序依据，和原生js的排序callback一致
          return a.amount - b.amount;
        }
      } );
    }
    return (
      <Card
        bordered={false}
        title={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>商品消耗排行</div>}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Spin spinning={loading}>
              <h3 className={styles.mainTitle}>虚拟卡券/实物消耗排行前五</h3>
              {dv3 === undefined || dv3.origin.length === 0 ? <Empty style={{ padding: '100px' }} /> :
              <Chart height={document.body.scrollWidth <= 1440 ? 300 : 400} data={dv3} forceFit>
                <Coord transpose scale={[0.7, 1]} />
                <Axis name="productName" label={{ offset: 12 }} />
                <Axis name="amount" />
                <Tooltip />
                <Geom
                  type="interval"
                  position="productName*amount"
                  color="#fdbd5c"
                  tooltip={['productName*amount', ( productName, amount ) => {
                      return { name: '消耗量', value: amount, title: productName }
                    }]}
                  size={['amount',
                      () => { return 30; }
                    ]}
                />
              </Chart>}
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={loading}>
              <h3 className={styles.mainTitle}>红包/话费消耗排行前五</h3>
              {dv4 === undefined || dv4.origin.length === 0 ? <Empty style={{ padding: '100px' }} /> :
              <Chart height={document.body.scrollWidth <= 1440 ? 300 : 400} data={dv4} forceFit>
                <Coord transpose scale={[0.7, 1]} />
                <Axis name="productName" label={{ offset: 12 }} />
                <Axis name="amount" />
                <Tooltip />
                <Geom
                  type="interval"
                  position="productName*amount"
                  color="#fdbd5c"
                  tooltip={['productName*amount', ( productName, amount ) => {
                      return { name: '消耗量', value: amount, title: productName }
                    }]}
                  size={['amount',
                      () => { return 30; }
                    ]}
                />
              </Chart>}

            </Spin>
          </Col>
        </Row>
      </Card>
    )
  }

  render() {
    const { isExPLoading, dateType, topData, merchantCode } = this.state;
    const { loading, merchantNames, consumeDetail, form: { getFieldDecorator } } = this.props;
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        render: date => <span>{date}</span>,
      },
      {
        title: '红包',
        dataIndex: 'redCount',
        key: 'redCount',
        render: redCount => <span>{redCount.toFixed( 2 )}</span>,
      },
      {
        title: '话费',
        dataIndex: 'directCount',
        key: 'directCount',
        render: directCount => <span>{directCount}</span>,
      },
      {
        title: '虚拟卡券',
        dataIndex: 'couponCount',
        key: 'couponCount',
        render: couponCount => <span>{couponCount}</span>,
      },
      {
        title: '实物',
        dataIndex: 'goodsCount',
        key: 'goodsCount',
        render: goodsCount => <span>{goodsCount}</span>,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: ( action, item ) => <span onClick={() => this.handleToConsumeOrder( item )} style={{ color: "#5087ec", cursor: 'pointer' }}>查看详情</span>
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          bodyStyle={{ padding: '20px 32px 20px 0px', background: '#f0f2f5' }}
        >
          <div className='data_count'>
            <Form layout='inline'>
              <Row gutter={24}>
                <Col span={6}>
                  <h1 style={{ fontWeight: 'bold', fontSize: '20px' }}>数据统计</h1>
                </Col>
                <Col span={18}>
                  <FormItem>
                    {getFieldDecorator( 'name', {} )(
                      <Select
                        showSearch
                        style={document.body.scrollWidth <= 1440 ? { width: 100 } : { width: 200 }}
                        optionFilterProp="children"
                        onChange={this.onChangeMerchant}
                        filterOption={( input, option ) =>
                          option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                        }
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        <Option value='' key={undefined}>全部</Option>
                        {merchantNames ? Array.isArray( merchantNames ) && merchantNames.map( ( v ) => {
                          // merchantNames的商户编码
                          return ( <Option value={v.code} key={v.id}>{v.name}</Option> )
                        } ) : ''}
                      </Select> )}
                  </FormItem>
                  <FormItem>
                    <Radio.Group
                      style={document.body.scrollWidth <= 1440 ? { margin: '0px 20px 0px 20px' } : { margin: '0px 40px 0px 40px' }}
                      onChange={this.handleDataChange}
                      defaultValue="TIMEFRAME"
                    >
                      <Radio.Button value="TODAY">今日</Radio.Button>
                      <Radio.Button value="YESTERDAY">昨日</Radio.Button>
                      <Radio.Button value="TIMEFRAME">时间范围</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                  <FormItem>
                    <RangePicker
                      style={{ width: 250 }}
                      defaultValue={[this.getDay( -30 ), this.getDay( 0 )]}
                      format="YYYY-MM-DD"
                      disabledDate={this.disabledDate}
                      onCalendarChange={this.onDateChange}
                      onOpenChange={this.onDateOpenChange}
                      getCalendarContainer={triggerNode => triggerNode.parentNode}
                      onChange={this.onChangeTimeRange}
                      disabled={dateType !== "TIMEFRAME"}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Form>

          </div>
        </Card>

        <Row gutter={24}>
          <Col span={6}>
            <div className={styles.card}>
              <div className={styles.card_info_box}>
                <span className={styles.type}>红包</span>
                <span className={styles.detail}>消耗 <span className={styles.send}>{topData && topData.REDconsume ? topData.REDconsume : '0.00'}</span></span>
                <span className={styles.detail}>余额 <span>{topData && topData.REDstock ? topData.REDstock : '0.00'}</span></span>
              </div>
              <div className={styles.card_img_box}>
                <div className={styles.img_red} />
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.card}>
              <div className={styles.card_info_box}>
                <span className={styles.type}>话费</span>
                <span className={styles.detail}>消耗 <span className={styles.send}>{topData && topData.PHONEconsume ? topData.PHONEconsume : '0'}</span></span>
                <span className={styles.detail}>库存 <span>{topData && topData.PHONEstock ? topData.PHONEstock : '0'}</span></span>
              </div>
              <div className={styles.card_img_box}>
                <div className={styles.img_fee} />
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.card}>
              <div className={styles.card_info_box}>
                <span className={styles.type}>虚拟卡券</span>
                <span className={styles.detail}>消耗 <span className={styles.send}>{topData && topData.COUPONconsume ? topData.COUPONconsume : '0'}</span></span>
                <span className={styles.detail}>库存 <span>{topData && topData.COUPONstock ? topData.COUPONstock : '0'}</span></span>
              </div>
              <div className={styles.card_img_box}>
                <div className={styles.img_coupon} />
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.card}>
              <div className={styles.card_info_box}>
                <span className={styles.type}>实物</span>
                <span className={styles.detail}>消耗 <span className={styles.send}>{topData && topData.GOODSconsume ? topData.GOODSconsume : '0'}</span></span>
                <span className={styles.detail}>库存 <span>{topData && topData.GOODSstock ? topData.GOODSstock : '0'}</span></span>
              </div>
              <div className={styles.card_img_box}>
                <div className={styles.img_good} />
              </div>
            </div>
          </Col>
        </Row>

        {!merchantCode && this.renderBar()}
        {this.renderTrend()}
        <Collapse defaultActiveKey={['1']} bordered={false} style={{ background: '#ffffff', padding: '10px', marginBottom: '20px' }}>
          <Panel
            key="1"
            header={<div style={{ display: 'flex', justifyContent: "space-between", fontWeight: 'bold', fontSize: '20px', }}>商品消耗明细<Button onClick={( e ) => this.exportConsumeList( e )} loading={isExPLoading} icon='export'>导出</Button></div>}
            style={{ marginBottom: '20px' }}
          >
            <Table
              size="middle"
              rowKey="date"
              columns={columns}
              loading={loading}
              dataSource={consumeDetail}
            />
          </Panel>
        </Collapse>
        {this.renderTypeRank()}
      </GridContent>
    );
  };
}

export default DataCount;

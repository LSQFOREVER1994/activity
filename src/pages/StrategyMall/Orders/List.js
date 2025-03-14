/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 21:27:43
 * @LastEditTime: 2019-08-14 21:32:38
 * @LastEditors: Please set LastEditors
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Table, Card, Icon, Col, Row, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
// import { envTag } from '@/defaultSettings';
import styles from '../Lists.less';
import AddJurisdiction from './addJurisdiction'
import FilterForm from './FilterForm';

const stateObj = {
  "": formatMessage( { id: 'strategyMall.order.state.all' } ),
  'WAITING_PAY': formatMessage( { id: 'strategyMall.order.WAITING_PAY' } ),
  'INVALID': formatMessage( { id: 'strategyMall.order.INVALID' } ),
  'PAY_SUCCESS': formatMessage( { id: 'strategyMall.order.PAY_SUCCESS' } ),
  'WAITING_DELIVERY': formatMessage( { id: 'strategyMall.order.WAITING_DELIVERY' } ),
  'FINISH': formatMessage( { id: 'strategyMall.order.FINISH' } ),
  // 'TIME_OUT': formatMessage( { id: 'strategyMall.order.TIME_OUT' } ),
  'REFUNDED': formatMessage( { id: 'strategyMall.order.REFUNDED' } ),
};

const payObj = {
  "": formatMessage( { id: 'strategyMall.order.state.all' } ),
  'WECHAT_H5': formatMessage( { id: 'strategyMall.order.WECHAT_H5' } ),
  'ALI_PAY_H5': formatMessage( { id: 'strategyMall.order.ALI_PAY_H5' } ),
  'SYSTEM_SEND': formatMessage( { id: 'strategyMall.order.SYSTEM_SEND' } ),
  'FREE': formatMessage( { id: 'strategyMall.order.FREE' } ),

  'WECHAT_APP': formatMessage( { id: 'strategyMall.order.WECHAT_APP' } ),
  'ALI_PAY_APP': formatMessage( { id: 'strategyMall.order.ALI_PAY_APP' } ),
  'EXCHANGE_COUPON': formatMessage( { id: 'strategyMall.order.EXCHANGE_COUPON' } ),
};

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  orders: strategyMall.orders,
  allAmounts: strategyMall.allAmounts,
  jurisdictionVisible:strategyMall.jurisdictionVisible
} ) )
@Form.create()
class OrdersList extends PureComponent {

  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    }
  };

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };


  componentDidMount() {
    this.fetchList();
    this.fetchMessage();
  }

  // 获取列表
  fetchList = () => {
    const { pageNum, pageSize, sortedInfo={} } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { id, username, visitCode, thirdPartyId, payType, state, payTime } = formValue;
    const start = ( payTime && payTime.length ) ?  moment( payTime[0] ).format( 'YYYY-MM-DD' ):'';
    const end = ( payTime && payTime.length ) ? moment( payTime[1] ).format( 'YYYY-MM-DD' ):'';
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getOrders',
      payload: {
        pageNum,
        pageSize,
        state,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
        username,
        id,
        visitCode,
        thirdPartyId,
        start,
        end,
        payType
      },
    } );
  }



  //  获取汇总信息
  fetchMessage = () => {
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { payType, state, payTime } = formValue;
    const start = ( payTime && payTime.length ) ?  moment( payTime[0] ).format( 'YYYY-MM-DD' ):'';
    const end = ( payTime && payTime.length ) ? moment( payTime[1] ).format( 'YYYY-MM-DD' ):'';
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getAllOrderAmounts',
      payload: {
        state,
        start,
        end,
        payType
      },
    } );
  }

  // 翻页
  tableChange = ( pagination, filters, sorter ) =>{
    const { current, pageSize } = pagination;
    const sotrObj = { order:'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, ()=>this.fetchList() );
  }


  // 增加权限模板显示
  showJurisdictionModal = () =>{
    const { dispatch } = this.props;
    dispatch( {
      type:'strategyMall/SetState',
      payload: { jurisdictionVisible: true },
    } )
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( ) =>{
    this.setState( {
      pageNum: 1,
      pageSize: 10,
    }, () =>{
      this.fetchList();
      this.fetchMessage()
    } )
  }

  //  导出
  handleOk = () =>{
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { payType, state, payTime, id, username, visitCode, thirdPartyId } = formValue;
    const payName = payType ? payObj[payType] : '';
    const stateName = state ? stateObj[state] : '';
    const start = ( payTime && payTime.length ) ?  moment( payTime[0] ).format( 'YYYY-MM-DD' ):'';
    const end = ( payTime && payTime.length ) ? moment( payTime[1] ).format( 'YYYY-MM-DD' ):'';

    const uri = payType || state || id || username || thirdPartyId ?
    `orders/export?${start ? `start=${start}` : ''}${end ? `&end=${end}` : ''}${id ? `&id=${id}` : ''}${username ? `&username=${username}` : ''}${thirdPartyId ? `&thirdPartyId=${thirdPartyId}` : ''}${visitCode ? `&visitCode=${visitCode}` : ''}${state ? `&state=${state}` : ''}${payType ? `&payType=${payType}` : ''}`
    : `orders/export?start=${start}&end=${end}`
    const xlsxName = payName || stateName || id || username || thirdPartyId ? `${payName}${stateName}订单${start} - ${end}.xlsx` : `${start} - ${end}订单.xlsx`;

    exportXlsx( {
      type:'strategyMallService',
      uri,
      xlsxName,
      callBack:() => {}
    } )
  }


  render() {
    const { loading, orders: { total, list }, allAmounts } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;

    const all = {};
    if ( allAmounts ) {
      all.finishAmounts = ( allAmounts.amounts.find( n => n.state === 'FINISH' ) && ( allAmounts.amounts.find( n => n.state === 'FINISH' ) ).amount ) || 0;
      all.finishDisAmounts = ( allAmounts.amounts.find( n => n.state === 'FINISH' ) && ( allAmounts.amounts.find( n => n.state === 'FINISH' ) ).discountAmount ) || 0;
      all.finishCount = ( allAmounts.counts.find( n => n.state === 'FINISH' ) && ( allAmounts.counts.find( n => n.state === 'FINISH' ) ).amount ) || 0;

      all.refundAmounts = ( allAmounts.amounts.find( n => n.state === 'REFUNDED' ) && ( allAmounts.amounts.find( n => n.state === 'REFUNDED' ) ).amount ) || 0;
      all.refundDisAmounts = ( allAmounts.amounts.find( n => n.state === 'REFUNDED' ) && ( allAmounts.amounts.find( n => n.state === 'REFUNDED' ) ).discountAmount ) || 0;
      all.refundCount = ( allAmounts.counts.find( n => n.state === 'REFUNDED' ) && ( allAmounts.counts.find( n => n.state === 'REFUNDED' ) ).amount ) || 0;

      all.waitPayAmounts = ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) && ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) ).amount ) || 0;
      all.waitPayDisAmounts = ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) && ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) ).discountAmount ) || 0;
      all.waitPayCount = ( allAmounts.counts.find( n => n.state === 'WAITING_PAY' ) && ( allAmounts.counts.find( n => n.state === 'WAITING_PAY' ) ).amount ) || 0;
    }

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    // const envTagArrs = ( envTag === 'kaiyuan' ) ? [
    //   {
    //     title: <span>{formatMessage( { id: 'strategyMall.order.capitalAccount' } )}</span>,
    //     dataIndex: 'capitalAccount',
    //     render: capitalAccount => <span>{capitalAccount}</span>,
    //   },
    // ] : [
    //   {
    //     title: <span>厂商</span>,
    //     dataIndex: 'vendorOptions',
    //     render: vendorOptions => <span>{vendorOptions || '--'}</span>,
    //   },
    //   {
    //     title: <span>{formatMessage( { id: 'strategyMall.order.code' } )}</span>,
    //     dataIndex: 'visitCode',
    //     render: visitCode => <span>{visitCode || '--'}</span>,
    //   },
    // ];

    const columns = [
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.id' } )}</span>,
        width: 220,
        // fixed: 'left',
        dataIndex: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.nick' } )}</span>,
        dataIndex: 'user',
        width:120,
        render: user => <span>{user && user.username ? user.username : '--'}</span>,
      },

      {
        title: <span>{formatMessage( { id: 'strategyMall.order.name' } )}</span>,
        dataIndex: 'name',
        width: 260,
        render:name => <span>{name}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.state' } )}</span>,
        width:120,
        dataIndex: 'state',
        render: state => <span>{stateObj[state] || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.amount' } )}</span>,
        dataIndex: 'amount',
        width:100,
        sorter: true,
        key: 'amount',
        sortOrder: sortedInfo.columnKey === 'amount' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: amount => <span>{amount}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.discountAmount' } )}</span>,
        width:110,
        dataIndex: 'discountAmount',
        render: discountAmount => <span>{discountAmount}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.payType' } )}</span>,
        dataIndex: 'payType',
        render: payType => <span>{payObj[payType] || '--'}</span>,
      },
      // ...envTagArrs,
      {
        title: <span>厂商</span>,
        dataIndex: 'vendorOptions',
        render: vendorOptions => <span>{vendorOptions || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.code' } )}</span>,
        dataIndex: 'visitCode',
        render: visitCode => <span>{visitCode || '--'}</span>,
      },

      {
        title: <span>{formatMessage( { id: 'strategyMall.order.thirdPartyId' } )}</span>,
        width:200,
        dataIndex: 'thirdPartyId',
        render: thirdPartyId => <span>{thirdPartyId || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.payTime' } )}</span>,
        dataIndex: 'payTime',
        key:'pay_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'pay_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: payTime => <span>{payTime || '--'}</span>,
      },
      {
        title: <span>用户风险等级</span>,
        dataIndex: 'buyLevel',
        // render: buyLevel => <span>{buyLevel || '--'}</span>,
        render: buyLevel => {
          const buyLevelObj =  window.RISKINVESTMENT.find( ( item )=>item.key===buyLevel );
          return( <span>{buyLevelObj ? buyLevelObj.value : '--'}</span> )
         },
      },
      // {
      //   title: <span>是否可退款</span>,
      //   dataIndex: 'payTime',
      //   render: payTime => <span>{payTime || '--'}</span>,
      // },
      {
        title: <span>创建时间</span>,
        width: 120,
        fixed: 'right',
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      // {
      //   title: <span>{formatMessage({ id: 'strategyMall.productsRights.expTime' })}</span>,
      //   dataIndex: 'expTime',
      //   width: 120,
      //   key:'exp_time',
      //   sorter: true ,
      //   sortOrder: sortedInfo.columnKey === 'exp_time' && sortedInfo.order,
      //   sortDirections: ['descend', 'ascend'],
      //   // fixed: 'right',
      //   render: expTime => <span>{expTime}</span>,
      // },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            // extra={extraContent}
            title={formatMessage( { id: 'menu.strategyMall.orderslist' } )}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <FilterForm
                filterSubmit={this.filterSubmit}
                fetchMessage={this.fetchMessage}
                handleOk={this.handleOk}
                showJurisdictionModal={this.showJurisdictionModal}
                wrappedComponentRef={( ref ) => { this.filterForm = ref}}
              />
            </div>

            { Object.keys( all ).length > 0 ?
              <div className={styles.messageDiv}>
                <Row gutter={16}>
                  <Col span={6}>
                    <span style={{ fontSize: '16px' }}>订单总额&nbsp;&nbsp;</span>
                    <Tooltip title="所有订单的总额">
                      <Icon style={{ fontSize:'20px' }} type="question-circle-o" />
                    </Tooltip>
                    <span style={{ display: 'block', margin:'5px 0', fontSize: '20px', fontWeight: 'bold' }}>{( all.finishDisAmounts + all.refundDisAmounts + all.waitPayDisAmounts ).toFixed( 2 )}</span>
                    <del style={{ display: 'block', margin:'5px 0' }}>{( all.finishAmounts + all.refundAmounts + all.waitPayAmounts ).toFixed( 2 )}</del>
                    <span style={{ display: 'block' }}>{all.finishCount + all.refundCount + all.waitPayCount}单</span>
                  </Col>
                  <Col span={6}>
                    <span style={{ fontSize: '16px' }}>成交订单总额&nbsp;&nbsp;</span>
                    <Tooltip title="订单状态为完成的总额">
                      <Icon style={{ fontSize:'20px' }} type="question-circle-o" />
                    </Tooltip>
                    <span style={{ display: 'block', margin:'5px 0', fontSize: '20px', fontWeight: 'bold' }}>{( all.finishDisAmounts + all.refundDisAmounts ).toFixed( 2 )}</span>
                    <del style={{ display: 'block', margin:'5px 0' }}>{all.finishAmounts}</del>
                    <span style={{ display: 'block' }}>{all.finishCount}单</span>
                  </Col>
                  <Col span={6}>
                    <span style={{ fontSize: '16px' }}>退款订单总额&nbsp;&nbsp;</span>
                    <Tooltip title="订单状态为已退款的总额">
                      <Icon style={{ fontSize:'20px' }} type="question-circle-o" />
                    </Tooltip>
                    <span style={{ display: 'block', margin:'5px 0', fontSize: '20px', fontWeight: 'bold' }}>{all.refundDisAmounts}</span>
                    <del style={{ display: 'block', margin:'5px 0' }} />
                    <span style={{ display: 'block' }}>{all.refundCount}单</span>
                  </Col>
                  <Col span={6}>
                    <span style={{ fontSize: '16px' }}>实收总额&nbsp;&nbsp;</span>
                    <Tooltip title="实收总额 = 成交订单总额 - 退款订单总额">
                      <Icon style={{ fontSize:'20px' }} type="question-circle-o" />
                    </Tooltip>
                    <span style={{ display: 'block', margin:'5px 0', fontSize: '20px', color: 'red', fontWeight: 'bold' }}>{all.finishDisAmounts > 0 ? `+${all.finishDisAmounts}`: all.finishDisAmounts}</span>
                  </Col>
                </Row>
              </div>
            : null}

            <Table
              size="large"
              scroll={{ x: 2200 }}
              rowKey={item => item.id}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>

        </div>
        <AddJurisdiction refreshFun={()=>this.fetchList( { pageNum: 1, pageSize: 10, sortedInfo } )} />
      </GridContent>
    );
  }
}

export default OrdersList;

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
import { exportXlsx, getUrlParameter } from '@/utils/utils';
import styles from '../Lists.less';
import FilterForm from './FilterForm';

/* eslint-disable react/destructuring-assignment, no-shadow */
/* eslint-disable react/no-access-state-in-setstate  */
const stateObj = {
  "": formatMessage( { id: 'strategyMall.order.state.all' } ),
  'WAITING_PAY': formatMessage( { id: 'strategyMall.order.WAITING_PAY' } ),
  'INVALID': formatMessage( { id: 'strategyMall.order.INVALID' } ),
  'PAY_SUCCESS': formatMessage( { id: 'strategyMall.order.PAY_SUCCESS' } ),
  'WAITING_DELIVERY': formatMessage( { id: 'strategyMall.order.WAITING_DELIVERY' } ),
  'FINISH': formatMessage( { id: 'strategyMall.order.FINISH' } ),
  'TIME_OUT': formatMessage( { id: 'strategyMall.order.TIME_OUT' } ),
  'REFUNDED': formatMessage( { id: 'strategyMall.order.REFUNDED' } ),
};

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  activeOrderList:tool.activeOrderList,
  allAmounts: tool.allAmounts,
} ) )
@Form.create()
class OrdersList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    // exportLoading:false
    sortedInfo: {},
  };

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    // const {  start, end  } = this.state;
    const str = window.location.href;
    if( getUrlParameter( 'type', str ) ){
      const routeClickType = getUrlParameter( 'type', str )
      const routeClickName = decodeURIComponent( getUrlParameter( 'name', str ) )
      this.setState( {
        routeClickType,
        routeClickName
      }, ()=>{
        this.fetchMessage();
        this.filterSubmit()
      } )
    }else{
      this.fetchList( {} )
      this.fetchMessage();
    }
    
  }

  //  获取列表
    fetchList = ( { pageNum= 1, pageSize= 10, sortedInfo={} } ) => {
      const formValue = this.filterForm ? this.filterForm.getValues() : {};
      const { createTime, orderId, username, channel, name, state } = formValue; 
      // console.log('v',channel)
      const { routeClickName } = this.state;
      const start = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
      const end = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
      const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
      const { dispatch } = this.props;
      dispatch( {
        type:'tool/getActiveOrder',
        payload:{
          pageNum, 
          pageSize,
          orderId,
          username,
          start,
          end,
          channel:routeClickName || channel,
          name,
          state,
          orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'create_time desc',
        }
      } )
    }

   
  // 获取汇总信息
  fetchMessage = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/getAllActiveOrderAmounts',
      payload: {

      },
    } );
  }

  // 翻页
  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize, sortedInfo: sotrObj } );
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sorter,
    } );
  };

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    setTimeout( () => {
      this.fetchList( {} )
    }, 100 );
  }
  
  //  导出
  handleExport = () => {
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { createTime, orderId, username, channel, name, state } = formValue;
    
    const start = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
    const end = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';

    exportXlsx( {
      type:'toolService',
      uri: `orders/export?tool.name=${name || ''}&username=${username || ''}&orderId=${orderId || ''}&start=${start}&end=${end}&state=${state || ''}&tool.channel=${channel || ''}`,
      xlsxName: `活动订单${start}-${end}.xlsx`,
      callBack: () => { }
    } )
  }


  render() {
    const { loading, activeOrderList: { total, list }, allAmounts } = this.props;
    const  { pageSize, pageNum, sortedInfo, routeClickType, routeClickName }  = this.state;

    const all = {};
    if ( allAmounts ) {
      all.finishAmounts = ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) && ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) ).amount ) || 0;
      all.finishDisAmounts = ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) && ( allAmounts.amounts.find( n => n.state === 'WAITING_PAY' ) ).discountAmount ) || 0;
      
      all.refundAmounts = ( allAmounts.amounts.find( n => n.state === 'INVALID' ) && ( allAmounts.amounts.find( n => n.state === 'INVALID' ) ).amount ) || 0;
      all.refundDisAmounts = ( allAmounts.amounts.find( n => n.state === 'INVALID' ) && ( allAmounts.amounts.find( n => n.state === 'INVALID' ) ).discountAmount ) || 0;
      
      all.waitPayAmounts = ( allAmounts.amounts.find( n => n.state === 'PAY_SUCCESS' ) && ( allAmounts.amounts.find( n => n.state === 'PAY_SUCCESS' ) ).amount ) || 0;
      all.waitPayDisAmounts = ( allAmounts.amounts.find( n => n.state === 'PAY_SUCCESS' ) && ( allAmounts.amounts.find( n => n.state === 'PAY_SUCCESS' ) ).discountAmount ) || 0;
      
    }

    // table pagination
    const paginationProps = {
      // showSizeChanger: true,
      // showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };


    const columns = [
      {
        title: <span>订单号</span>,
        dataIndex: 'orderId',
        render: orderId => <span>{orderId}</span>,
      },
      {
        title: <span>用户名</span>,
        dataIndex: 'user',
        render: user => <span>{user && user.username ? user.username : '--'}</span>,
      },
      
      {
        title: <span>活动名称</span>,
        dataIndex: 'channel',
        render: channel => <span>{channel}</span>,
      },
      {
        title: <span>商品名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>原价</span>,
        dataIndex: 'amount',
        render: amount => <span>{amount}</span>,
      },
      {
        title: <span>优惠价</span>,
        dataIndex: 'discountAmount',
        render: discountAmount => <span>{discountAmount}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title: <span>订单状态</span>,
        dataIndex: 'state',
        render: state => <span>{stateObj[state] || '--'}</span>,
      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title='活动订单管理'
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <FilterForm
                filterSubmit={this.filterSubmit}
                handleExport={this.handleExport}
                routeClickType={routeClickType}
                routeClickName={routeClickName}
                wrappedComponentRef={( ref ) => { this.filterForm = ref}}
              />
            </div>
            
            { Object.keys( all ).length > 0 ? 
              <div className={styles.messageDiv}>
                <Row gutter={24}>
                  <Col span={8}>
                    <span style={{ fontSize: '16px' }}>待支付总金额&nbsp;&nbsp;</span>
                    <Tooltip title="所有待支付订单的总额">
                      <Icon style={{ fontSize:'20px' }} type="question-circle-o" />
                    </Tooltip>
                    <span style={{ display: 'block', margin:'5px 0', fontSize: '20px', fontWeight: 'bold' }}>{( all.finishDisAmounts ).toFixed( 2 )}</span>
                    <del style={{ display: 'block', margin:'5px 0' }}>{( all.finishAmounts ).toFixed( 2 )}</del>
                  </Col>
              
                  <Col span={6}>
                    <span style={{ fontSize: '16px' }}>退款订单总额&nbsp;&nbsp;</span>
                    <Tooltip title="订单状态为已退款的总额">
                      <Icon style={{ fontSize:'20px' }} type="question-circle-o" />
                    </Tooltip>
                    <span style={{ display: 'block', margin:'5px 0', fontSize: '20px', fontWeight: 'bold' }}>{( all.refundDisAmounts ).toFixed( 2 )}</span>
                    <del style={{ display: 'block', margin:'5px 0' }}>{( all.refundAmounts ).toFixed( 2 )}</del>
                  </Col>

                  <Col span={8}>
                    <span style={{ fontSize: '16px' }}>实收总额&nbsp;&nbsp;</span>
                    <Tooltip title="实收总额 = 成交订单总额 - 退款订单总额">
                      <Icon style={{ fontSize:'20px' }} type="question-circle-o" />
                    </Tooltip>
                    <span style={{ display: 'block', margin:'5px 0', fontSize: '20px', color: 'red', fontWeight: 'bold' }}>{( all.waitPayDisAmounts ).toFixed( 2 )}</span>
                    <del style={{ display: 'block', margin:'5px 0' }}>{( all.waitPayAmounts ).toFixed( 2 )}</del>
                  </Col>
                </Row>
              </div>
            : null}

            <Table
              size="large"
              // scroll={{ x: 1400 }}
              rowKey={item => item.id}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
          
        </div>
      </GridContent>
    );
  }
}

export default OrdersList;
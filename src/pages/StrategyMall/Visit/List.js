d/* eslint-disable react/sort-comp */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Table, Card, Input, Icon, DatePicker, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';

import styles from '../Lists.less';

const {  RangePicker } = DatePicker;
const { Search } = Input;

const payObj ={
  WAITING_PAY:"待支付",
  INVALID:"作废",
  PAY_SUCCESS:"支付完成",
  WAITING_DELIVERY:"待发货",
  FINISH:"完成",
  SCRAP_PROCESSING:"作废处理中",
  REFUNDED:"已退款"
}
@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  visit: strategyMall.visitList,
} ) )
@Form.create()
class OrdersList extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      paramsObj: {
        pageNum: 1,
        pageSize: 10,
        start: moment().subtract( 1, 'M' ).format( 'YYYY-MM-DD' ),
        end: moment().format( 'YYYY-MM-DD' ),
        // sortedInfo: {
        //   columnKey: 'create_time',
        //   field: 'createTime',
        //   order: 'descend',
        // },
        visitNameValue: '',
        userNameValue: '',
        visitCodeValue: '',
        nameValue: '',
      },
    };
  }
  

  fetchInit = {
    pageNum: 1,
    pageSize: 10,
    start: moment().subtract( 1, 'M' ).format( 'YYYY-MM-DD' ),
    end: moment().format( 'YYYY-MM-DD' ),
    // sortedInfo: {
    //   columnKey: 'create_time',
    //   field: 'createTime',
    //   order: 'descend',
    // },
    visitNameValue: '',
    userNameValue: '',
    visitCodeValue: '',
    nameValue: '',
  }

  componentDidMount() {
    const { paramsObj: { start, end, } } = this.state;
    this.fetchList( { pageNum: 1, pageSize: 10, start, end } );
  }

  //  获取列表
  fetchList = ( { pageNum, pageSize, start, end, visitNameValue, userNameValue, visitCodeValue, nameValue } ) => {
    // const sortValue = (sortedInfo.order === 'descend') ? 'desc' : 'asc'
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getVisit',
      payload: {
        pageNum,
        pageSize,
        // orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
        visitCode: visitCodeValue,
        visitUserName: visitNameValue,
        username: userNameValue,
        name: nameValue,
        start,
        end,
        orderBy: 'create_time desc'
      },
    } );
  }

  tableChange = ( pagination, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    const paramsObj = { ...this.state.paramsObj, sortedInfo: sotrObj, pageNum: current, pageSize }
    this.fetchList( paramsObj );
    this.setState( { paramsObj } );
  }

  onSearch = ( value, type ) =>{
    const paramsObj = { ...this.state.paramsObj, [type]: value }
    this.setState( { paramsObj } )
    this.fetchList( paramsObj );
  }

  valueChange = ( value, type ) =>{
    const paramsObj = { ...this.state.paramsObj, [type]: value }
    this.setState( { paramsObj } )
    if( value === '' ){
      this.fetchList( paramsObj );
    }
  }

  //  时间变化的回调
  onDateChange = ( dates, dateStrings ) => {
  const start = dateStrings[0];
  const end = dateStrings[1];
  const { listType, payType } = this.state.paramsObj;
  const paramsObj = { ...this.state.paramsObj, start, end }
  this.setState( { paramsObj } );
  this.fetchList( { pageNum:1, pageSize:10, start, end, listType, payType, orderValue:'' } );
}

handleOk = () =>{
  const { start, end, visitNameValue, visitCodeValue, nameValue, userNameValue } = this.state.paramsObj;
  exportXlsx( {
    type:'strategyMallService',
    uri: `orders/visit/codes/export?name=${nameValue}&visitUserName=${visitNameValue}&username=${userNameValue}&visitCode=${visitCodeValue}&start=${start}&end=${end}`,
    xlsxName: `邀请码${start}-${end}.xlsx`,
    callBack:() => {}
  } )
}

  renderFilterInput = ( type ) =>{
    const { paramsObj } = this.state;
    return(
      <Search
        allowClear
        size="large"
        placeholder="搜索"
        value={paramsObj[type]}
        onChange={( e )=>this.valueChange( e.target.value, type )}
        onSearch={value => this.onSearch( value, type )}
        style={{ width: 200 }}
      />
    )
  }
  
  render() {
    const {
      loading, visit: { total, list },
    } = this.props;
    const  { pageSize, pageNum, start, end, visitCodeValue, visitNameValue, nameValue, userNameValue }  = this.state.paramsObj;
    const extraContent = (
      <div className={styles.extraContent}>
        <RangePicker 
          style={{ marginRight: 15 }} 
          onChange={this.onDateChange}
          defaultValue={[moment( start ), moment( end )]}
          getCalendarContainer={triggerNode => triggerNode.parentNode}
        />
        <Button 
          type="primary"
          style={{ marginLeft:30 }}
          onClick={() => {this.handleOk()}}
        >导出
        </Button>
      </div>
    );

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
    };

    const columns = [
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.id' } )}</span>,
        width: 200,
        dataIndex: 'id',
        fixed: 'left',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>订单状态</span>,
        dataIndex: 'state',
        render: state => <span>{payObj && payObj[state] ? payObj[state] : '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.name' } )}</span>,
        dataIndex: 'name',
        filterDropdown: () =>this.renderFilterInput( 'nameValue' ),
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || nameValue ? '#1890ff' : undefined }} /> ),
        render: name => <span>{name}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.code' } )}</span>,
        dataIndex: 'visitCode',
        filterDropdown: () =>this.renderFilterInput( 'visitCodeValue' ),
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || visitCodeValue ? '#1890ff' : undefined }} /> ),
        render: visitCode => <span>{visitCode || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.order.visitName' } )}</span>,
        dataIndex: 'visitUserName',
        filterDropdown: () =>this.renderFilterInput( 'visitNameValue' ),
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || visitNameValue ? '#1890ff' : undefined }} /> ),
        render: visitUserName => <span>{visitUserName || '--'}</span>,
      },
      {
        title: <span>购买人</span>,
        dataIndex: 'user',
        filterDropdown: () =>this.renderFilterInput( 'userNameValue' ),
        filterIcon: filtered => ( <Icon type="search" style={{ fontSize: 16, color: filtered || userNameValue ? '#1890ff' : undefined }} /> ),
        render: user => <span>{user.username || '--'}</span>,
      },
      {
        title: <span>创建时间</span>,
        width: 200,
        dataIndex: 'createTime',
        key:'create_time',
        // sorter: true ,
        // sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
    ];
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            extra={extraContent}
            title={formatMessage( { id: 'menu.strategyMall.visitlist' } )}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Table
              size="large"
              scroll={{ x: 1300 }}
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
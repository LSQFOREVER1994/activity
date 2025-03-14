
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, message, Tag } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FilterForm from './FilterForm';
// import styles from './callChargesList.less';

// 订单状态
const orderStateObj = {
  success: '充值成功',
  processing: '充值中',
  failed: '充值失败',
  untreated: '未处理'
}

@connect( ( { callCharges } ) => {
  return {
    loading: callCharges.loading,
    callChargesMap: callCharges.callChargesMap,
  }
} )

class CallChargesList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    isClick: false
  };

  componentDidMount() {
    this.getCallChargesList();
  };

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getCallChargesList();
    } )
  }

  // 获取充值列表
  getCallChargesList = ( num ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { account, orderId, orderState, createTime, finishTime } = formValue;
    const start = ( createTime && createTime.length ) ? moment( createTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const end = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const finishStart = ( finishTime && finishTime.length ) ? moment( finishTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const finishEnd = ( finishTime && finishTime.length ) ? moment( finishTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'callCharges/getCallChargesList',
      payload: {
        pageNum: num || pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        account,
        orderId,
        orderState,
        start,
        end,
        finishStart,
        finishEnd,
      },
    } );
  }


  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sotrObj = { order: 'descend', ...sorter, }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getCallChargesList() );
  };


  // 重新发奖
  getResourcRecharge = ( item ) => {
    const { isClick } = this.state
    const { dispatch } = this.props;
    const { orderId } = item
    if ( isClick ) return
    this.setState( {
      isClick: true
    }, () => {
      dispatch( {
        type: 'callCharges/getResourcRecharge',
        payload: {
          query: { orderId },
          callBack: ( res ) => {
            if ( res && res.success ) {
              message.success( res.message )
              this.getCallChargesList()
            }
            this.setState( {
              isClick: false
            } )
          }
        },
      } );
    } )

  }



  render() {
    const { loading, callChargesMap: { total, list }, id } = this.props;
    const { pageSize, pageNum, sortedInfo, } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      }
    };

    const columns = [
      {
        title: <span>手机号</span>,
        dataIndex: 'account',
        key: 'account',
        width: 160,
        render: account => <span>{account}</span>,
      },
      {
        title: <span>订单号</span>,
        dataIndex: 'orderId',
        key: 'orderId',
        width: 300,
        render: orderId => <span>{orderId}</span>,
      },
      {
        title: <span>充值金额</span>,
        dataIndex: 'orderPrice',
        key: 'orderPrice',
        width: 160,
        render: orderPrice => <span>{orderPrice}</span>,
      },
      {
        title: <span>充值状态</span>,
        dataIndex: 'orderState',
        key: 'orderState',
        width: 160,
        render: orderState => {
          let color = '#333';
          if ( orderState === 'success' ) color = 'green';
          if ( orderState === 'processing' ) color = 'orange';
          if ( orderState === 'failed' ) color = 'red';
          if ( orderState === 'untreated' ) color = 'orange';
          return (
            <span>  {orderState ? <Tag color={color}>{orderStateObj[orderState]}</Tag> : '--'}</span>
          )
        },
      },
      {
        title: <span>充值商户</span>,
        dataIndex: 'provider',
        key: 'provider',
        width: 160,
        render: provider => <span>{provider || '--'}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime ? moment( createTime ).format( 'YYYY-MM-DD HH:mm:ss' ) : '--'}</span>,
      },
      {
        title: <span>充值成功时间</span>,
        dataIndex: 'finishTime',
        key: 'finish_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'finish_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: finishTime => <span>{finishTime ? moment( finishTime ).format( 'YYYY-MM-DD HH:mm:ss' ) : '--'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: ( id, item ) => {
          const { orderState } = item
          if ( orderState !== 'failed' ) return null
          return (
            <div>
              <span
                style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={() => this.getResourcRecharge( item )}
              >
                重试
              </span>
            </div>

          )
        },
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title="话费订单列表"
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <FilterForm
            filterSubmit={this.filterSubmit}
            id={id}
            wrappedComponentRef={( ref ) => { this.filterForm = ref }}
            sortedInfo={sortedInfo}
          />
          <Table
            scroll={{ x: 1500 }}
            size="middle"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
      </GridContent>
    );
  };
}

export default CallChargesList;

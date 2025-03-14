import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { findDOMNode } from 'react-dom';
import { Card, Table, message, Modal, Form, Button, Select, Input, Tag } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BatchFilterForm from './BatchFilterForm';
import styles from './order.less';

const { confirm } = Modal;

// const productObj = {
//   0: '实物',
//   1: '虚拟卡券',
//   2: '话费(手机号直充)',
// };

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Option } = Select;
@connect( ( { order } ) => ( {
  loading: order.loading,
  logistics: order.logistics,
} ) )
@Form.create()
class Order extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    current: undefined,
    type: '',
    logisticsText: '',
    logisticsNo: '',
    // pageInfo: {
    //   // 退款中订单分页数据
    //   pageNum: 1,
    //   pageSize: 10,
    // },
    orders: {},
    // refuseOrders: {}, // 退款中订单列表
    // sortedInfo: {
    //   columnKey: 'spuCode',
    //   field: 'spuCode',
    //   order: 'descend',
    // },
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    this.getOrderInfoList();
    // this.getRefuseOrderList();
    const { dispatch } = this.props;
    dispatch( {
      type: 'order/getLogistics',
      payload: {
        type: 'LOGISTICS',
      },
    } );
  }

  getOrderInfoList = num => {
    const { pageNum, pageSize } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { orderNo, status, isPay, username } = formValue;
    if ( orderNo && orderNo.length > 60 ) {
      message.error( '最多允许输入60个字符' );
      return;
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'order/getOrderInfoList',
      payload: {
        query: {
          pageNum: num || pageNum,
          isPay,
          status,
          orderNo,
          pageSize,
          username,
          descs: 'create_time',
        },
        successFun: res => {
          this.setState( {
            orders: res,
          } );
        },
      },
    } );
  };

  // // 获取退货中的订单
  // getRefuseOrderList = num => {
  //   const {
  //     pageInfo: { pageNum, pageSize },
  //   } = this.state;
  //   const { dispatch } = this.props;
  //   dispatch( {
  //     type: 'order/getOrderInfoList',
  //     payload: {
  //       query: {
  //         pageNum: num || pageNum,
  //         pageSize,
  //         status: '5',
  //         descs: 'create_time',
  //       },
  //       successFun: res => {
  //         this.setState( {
  //           refuseOrders: res,
  //         } );
  //       },
  //     },
  //   } );
  // };

  // 翻页
  tableChange = pagination => {
    const { current, pageSize } = pagination;
    this.setState(
      {
        pageNum: current,
        pageSize,
        // sortedInfo: sorter,
      },
      () => this.getOrderInfoList()
    );
  };

  // 退款中订单列表翻页
  refuseOrdersChange = pagination => {
    const { current, pageSize } = pagination;
    const pageInfo = {
      pageNum: current,
      pageSize,
    };
    this.setState(
      {
        pageInfo,
      },
      () => this.getRefuseOrderList()
    );
  };

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState(
      {
        pageNum: 1,
      },
      () => {
        this.getOrderInfoList();
      }
    );
  };

  changeShelf = obj => {
    const { shelf, id } = obj;
    const { dispatch } = this.props;
    dispatch( {
      type: 'order/changeShelf',
      payload: {
        shelf: shelf === '1' ? '0' : '1',
        ids: id,
      },
      callFunc: () => {
        const text = shelf === '1' ? '商品下架成功' : '商品上架成功';
        message.info( text );
        this.getOrderInfoList();
      },
    } );
  };

  deleteItem = ( e, item ) => {
    e.stopPropagation();
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'order/delShelf',
      payload: { id },
      callFunc: () => {
        message.info( '删除商品成功' );
        this.setState(
          {
            pageNum: 1,
          },
          () => this.getOrderInfoList( 1 )
        );
      },
    } );
  };

  showEditModal = ( e, obj, type ) => {
    // 已退货状态禁止操作
    if ( obj.status === '6' ) {
      return;
    }
    console.log( obj, 'obj' );
    e.stopPropagation();

    this.setState( {
      type,
      visible: true,
      current: obj,
    } );

    const { id } = obj;
    const { dispatch } = this.props;
    dispatch( {
      type: 'order/getOrderInfo',
      payload: { id },
      callFunc: res => {
        this.setState( {
          current: res,
        } );
      },
    } );
  };

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      type: '',
    } );
  };

  changeLogistics = logisticsText => {
    this.setState( { logisticsText } );
  };

  changeLogisticsNo = e => {
    const { value } = e.target;
    this.setState( { logisticsNo: value } );
  };

  submit = () => {
    const {
      logisticsNo,
      logisticsText,
      current: { id, logisticsId, orderNo },
    } = this.state;
    if ( !logisticsText ) {
      message.error( '请先选择快递公司' );
      return;
    }

    if ( !logisticsNo ) {
      message.error( '请先输入快递单号' );
      return;
    } // getDelivery
    const { dispatch } = this.props;
    const $this = this;
    const params = { logisticsNo, logistics: logisticsText, id, logisticsId, orderNo };
    dispatch( {
      type: 'order/getDelivery',
      payload: params,
      callFunc: text => {
        message.info( text );
        $this.getOrderInfoList();
        this.getRefuseOrderList();
        $this.setState( {
          visible: false,
          current: undefined,
          logisticsText: '',
          logisticsNo: '',
        } );
      },
    } );
  };

  // 根据订单状态展示对应Tag
  showTagStatus = status => {
    let color = '';
    if ( status === '已退货' ) {
      color = 'red';
    } else if ( status === '待发货' ) {
      color = 'blue';
    } else {
      color = '#999';
    }
    return <Tag color={color}>{status}</Tag>;
  };

  // 退货
  refuseGoods = id => {
    console.log( id, 'id' );
    confirm( {
      title: '确认退货',
      content: '您确认对该用户进行退货操作吗？',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: ()=>{this.refuseGoodsConfirm( id )},
    } );
  };

  // 退货确认
  refuseGoodsConfirm = async ( id ) => {
    const { dispatch } = this.props;

    await dispatch( {
      type: 'order/refuseGoods',
      payload: {
        query: {
          orderId: id,
        },
        callBack: res => {
          message.success( '退货成功' )
          console.log( res, 'res' );
          if ( res ) {
            this.getOrderInfoList();
            this.getRefuseOrderList();
          }
        },
      },
    } );
  }

  render() {
    const { loading, logistics } = this.props;
    const {
      pageSize,
      pageNum,
      visible,
      current,
      type,
      logisticsText,
      logisticsNo,
      orders: { total, list },
      // refuseOrders,
      // pageInfo,
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
    };

    // const refuseOrderPagination = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   pageSize: pageInfo.pageSize,
    //   total: refuseOrders.total,
    //   current: pageInfo.pageNum,
    // };

    const columns = [
      {
        title: <span>订单编号</span>,
        dataIndex: 'orderNo',
        render: orderNo => <span>{orderNo}</span>,
      },
      {
        title: <span>兑换商品</span>,
        dataIndex: 'listOrderItem',
        key: 'spuName',
        render: listOrderItem => (
          <span>{listOrderItem && listOrderItem[0] && listOrderItem[0].spuName}</span>
        ),
      },
      {
        title: <span>数量</span>,
        dataIndex: 'listOrderItem',
        key: 'quantity',
        render: listOrderItem => (
          <span>{listOrderItem && listOrderItem[0] && listOrderItem[0].quantity}</span>
        ),
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>购买人</span>,
        dataIndex: ['userInfo', 'nick'],
        render: nick => <span>{nick || '--'}</span>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'statusDesc',
        render: statusDesc => this.showTagStatus( statusDesc ),
      },
      {
        title: <span>收货人</span>,
        dataIndex: ['orderLogistics', 'userName'],
        render: userName => <span>{userName || '--'}</span>,
      },
      {
        title: <span>手机号</span>,
        dataIndex: ['orderLogistics', 'telNum'], // orderType = "2" 为话费订单
        render: ( telNum, item ) => <span>{item.orderType === '2' ? item.phoneNumber : ( telNum || '--' )}</span>,
      },
      {
        title: <span>收货地址</span>,
        dataIndex: ['orderLogistics', 'address'],
        render: address => <span>{address || '--'}</span>,
      },
      {
        title: <span>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        render: ( id, item ) => (
          <div
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
            hidden={item.orderType !== '0'}
          >
            <Button
              type="primary"
              size="small"
              style={{ marginRight: '10px' }}
              hidden={item.status !== '2'}
              onClick={e => this.showEditModal( e, item, '查看' )}
            >
              查看
            </Button>
            {/* <Button
              size="small"
              disabled={item.status === '6'}
              hidden={item.status === '1'}
              onClick={e => this.showEditModal( e, item, '编辑发货' )}
            >
              编辑
            </Button> */}
            <Button
              type="danger"
              size="small"
              disabled={item.status === '6'}
              onClick={() => this.refuseGoods( id )}
            >
              退货
            </Button>
          </div>
        ),
      },
    ];

    const modalFooter = {
      okText: '保存',
      // onOk: this.handleSubmit,
      onCancel: this.handleCancel,
    };

    return (
      <GridContent>
        <div>
          <Card bordered={false} title="订单管理" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
            <BatchFilterForm
              filterSubmit={this.filterSubmit}
              wrappedComponentRef={ref => {
                this.filterForm = ref;
              }}
            />
            {/*
            {refuseOrders?.list?.length > 0 && (
              <div className={styles.warnBox}>
                <div className={styles.warnTitle}>以下商品退货中，请及时处理！</div>
                <Table
                  size="large"
                  scroll={{ x: 1300 }}
                  rowKey="id"
                  columns={columns}
                  loading={loading}
                  pagination={refuseOrderPagination}
                  dataSource={refuseOrders && refuseOrders.list}
                  onChange={this.refuseOrdersChange}
                />
              </div>
            )} */}
            <br />
            <Table
              size="large"
              scroll={{ x: 1300 }}
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>

        {visible ? (
          <Modal
            maskClosable={false}
            title={type}
            className={styles.standardListForm}
            width={500}
            bodyStyle={{ padding: '30px 10px' }}
            destroyOnClose
            visible={visible}
            footer={null}
            {...modalFooter}
          >
            <div>
              <Form {...formItemLayout}>
                <Form.Item label="物流公司">
                  {logisticsText || current?.orderLogistics?.logistics}
                  {/* <Select
                    style={{ width: 230 }}
                    placeholder="选择物流公司"
                    value={logisticsText || current?.orderLogistics?.logistics}
                    onChange={this.changeLogistics}
                  >
                    {logistics.map( item => (
                      <Option value={item.value} key={item.value}>
                        {item.label}
                      </Option>
                    ) )}
                  </Select> */}
                </Form.Item>
                <Form.Item label="快递单号">
                  {logisticsNo || current?.orderLogistics?.logisticsNo}
                  {/* <Input
                    placeholder="输入快递单号"
                    style={{ width: 230 }}
                    value={logisticsNo || current?.orderLogistics?.logisticsNo}
                    onChange={this.changeLogisticsNo}
                  /> */}
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 8 },
                  }}
                >
                  {/* <Button type="primary" onClick={this.submit}>
                    提交
                  </Button> */}
                </Form.Item>
              </Form>
            </div>
          </Modal>
        ) : null}
      </GridContent>
    );
  }
}

export default Order;

import React, { PureComponent } from "react";
import { connect } from 'dva';
// import { findDOMNode } from 'react-dom';
import { Card, Table, message, Modal, Form, Button, Select, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BatchFilterForm from './batchFilterForm';
import styles from '../PointsMall.less';

const productObj = {
  0: '实物',
  1: '虚拟卡券',
  2: '话费(手机号直充)',
};

const { Option } = Select;
@connect( ( { pointsMall } ) => ( {
  loading: pointsMall.loading,
  orders: pointsMall.orders,
  logistics: pointsMall.logistics,
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
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/getLogistics',
      payload: {
        type: 'LOGISTICS',
      },
    } );
  }

  getOrderInfoList = ( num ) => {
    const { pageNum, pageSize } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { orderNo, status, isPay } = formValue;
    if ( orderNo && ( orderNo.length > 60 ) ) {
      message.error( '最多允许输入60个字符' );
      return;
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/getOrderInfoList',
      payload: {
        pageNum: num || pageNum,
        isPay,
        status,
        orderNo,
        pageSize,
        descs: 'create_time'
      },
    } );
  }

  // 翻页
  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      // sortedInfo: sorter,
    }, () => this.getOrderInfoList() );
  }

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getOrderInfoList();
    } )
  }

  changeShelf = ( obj ) => {
    const { shelf, id } = obj;
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/changeShelf',
      payload: {
        shelf: shelf === '1' ? '0' : '1',
        ids: id,
      },
      callFunc: () => {
        const text = shelf === '1' ? '商品下架成功' : '商品上架成功';
        message.info( text );
        this.getOrderInfoList();
      }
    } );
  }

  deleteItem = ( e, item ) => {
    e.stopPropagation();
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/delShelf',
      payload: { id },
      callFunc: () => {
        message.info( '删除商品成功' );
        this.setState( {
          pageNum: 1,
        }, () => this.getOrderInfoList( 1 ) );
      }
    } );
  }

  showEditModal = ( e, obj, type ) => {
    e.stopPropagation();

    this.setState( {
      type,
      visible: true,
      current: obj,
    } );

    const { id } = obj;
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/getOrderInfo',
      payload: { id },
      callFunc: ( res ) => {
        this.setState( {
          current: res,
        } );
        console.log( res, 121212121, obj )
      }
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

  changeLogistics = ( logisticsText ) => {
    this.setState( { logisticsText } )
  }

  changeLogisticsNo = ( e ) => {
    const { value } = e.target;
    this.setState( { logisticsNo: value } )
  }

  submit = () => {
    const { logisticsNo, logisticsText, current: { id, logisticsId, orderNo } } = this.state
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
      type: 'pointsMall/getDelivery',
      payload: params,
      callFunc: ( text ) => {
        message.info( text );
        $this.getOrderInfoList();
        $this.setState( {
          visible: false,
          current: undefined,
        } );
      },
    } );
  }

  render() {
    const { loading, orders: { total, list }, logistics } = this.props;
    const { pageSize, pageNum, visible, current = {}, type, logisticsText, logisticsNo } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns = [
      {
        title: <span>订单单号</span>,
        dataIndex: 'orderNo',
        render: orderNo => <span>{orderNo}</span>,
      },
      {
        title: <span>下单时间</span>,
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>订单状态</span>,
        dataIndex: 'statusDesc',
        render: statusDesc => <span>{statusDesc}</span>,
      },
      {
        title: <span>商品类型</span>,
        dataIndex: 'orderType',
        render: orderType => <span>{productObj[orderType]}</span>,
      },
      {
        title: <span>支付状态</span>,
        dataIndex: 'isPay',
        key: 'isPay',
        // sorter: true,
        // sortOrder: sortedInfo.columnKey === 'spuCode' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: isPay => <span>{isPay === '1' ? '已支付' : '未支付'}</span>,
      },
      {
        title: <span>付款时间</span>,
        dataIndex: 'paymentTime',
        key: 'paymentTime',
        // sorter: true,
        // sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: paymentTime => <span>{paymentTime || '--'}</span>,
      },
      {
        title: <span>支付金额</span>,
        dataIndex: 'paymentPrice',
        render: paymentPrice => <span>{paymentPrice || '--'}</span>,
      },
      {
        title: <span>支付交易ID</span>,
        dataIndex: 'transactionId',
        render: transactionId => <span>{transactionId || '--'}</span>,
      },
      {
        title: <span>操作</span>,
        dataIndex: 'id',
        width: 90,
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, '订单详情' )}
            >
              订单详情
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#1F3883' }}
              type="link"
              hidden={!( item.orderType === '0' && item.status === '1' )}
              onClick={( e ) => this.showEditModal( e, item, '发货' )}
            >
              发货
            </span>


          </div>
        ),
      },
    ];

    const modalFooter = {
      okText: '保存',
      // onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    return (
      <GridContent>
        <div>
          <Card
            bordered={false}
            title="订单管理"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <BatchFilterForm
              filterSubmit={this.filterSubmit}
              wrappedComponentRef={( ref ) => { this.filterForm = ref }}
            />

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

        {
          visible ? (
            <Modal
              maskClosable={false}
              title={type}
              className={styles.standardListForm}
              width={1000}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              footer={null}
              {...modalFooter}
            >
              <div className={styles.info}>
                <div>
                  <h4>基本信息：</h4>
                  <div className={styles.infoBox}>
                    <div className={styles.infoBoxItem}>订单号：{current.orderNo}</div>
                    <div className={styles.infoBoxItem}>订单状态：{current.statusDesc}</div>
                    <div className={styles.infoBoxItem}>下单时间：{current.createTime}</div>
                    <div className={styles.infoBoxItem}>支付状态：{current.isPay === '1' ? '已支付' : '未支付'}</div>
                    <div className={styles.infoBoxItem}>付款时间：{current.paymentTime || '--'}</div>
                    <div className={styles.infoBoxItem}>支付金额：{current.paymentPrice || '--'}</div>
                    <div className={styles.infoBoxItem}>支付交易ID：{current.transactionId || '--'}</div>
                    <div className={styles.infoBoxItem}>商品类型：{current.orderType ? productObj[current.orderType] : '--'}</div>
                  </div>
                </div>

                <div>
                  <h4 className={styles.infoBoxTit}>用户信息：</h4>
                  <div className={styles.infoBox}>
                    <div className={styles.infoBoxItemImg}>用户头像：<img className={styles.infoBoxItemLogo} src={current.userInfo ? current.userInfo.profilePhoto : ''} alt="" /></div>
                    <div className={styles.infoBoxItem}>用户名：{current.userInfo ? current.userInfo.username : '--'}</div>
                    <div className={styles.infoBoxItem}>用户昵称：{current.userInfo ? current.userInfo.nick : '--'}</div>
                  </div>
                </div>

                <div>
                  <h4 className={styles.infoBoxTit}>收货信息：</h4>
                  <div className={styles.infoBox}>
                    <div className={styles.infoBoxItem}>姓名：{current.orderLogistics ? current.orderLogistics.userName : '--'}</div>
                    <div className={styles.infoBoxItem}>电话：{current.orderLogistics ? current.orderLogistics.telNum : '--'}</div>
                    <div className={styles.infoBoxItem}>地址：{current.orderLogistics ? current.orderLogistics.address : '--'}</div>
                  </div>
                </div>

                <div>
                  <h4 className={styles.infoBoxTit}>商品信息：</h4>
                  <div className={styles.infoBox}>
                    <div className={styles.infoBoxItemImg}>缩略图：<img className={styles.infoBoxItemLogo} src={current.listOrderItem ? current.listOrderItem[0].picUrl : ''} alt="" /></div>
                    <div className={styles.infoBoxItem}>名称：{current.listOrderItem ? current.listOrderItem[0].spuName : '--'}</div>
                    <div className={styles.infoBoxItem}>价格：{current.listOrderItem ? current.listOrderItem[0].salesPrice : '--'}</div>
                  </div>
                </div>

                {
                  type === '发货' ? (
                    <div>
                      <h4 className={styles.infoBoxTit}>快递信息：</h4>
                      <div className={styles.infoBox}>
                        <div className={styles.infoBoxItemImg}>
                          快递公司：
                          <Select
                            style={{ width: 230 }}
                            placeholder="选择快递公司"
                            value={logisticsText}
                            onChange={this.changeLogistics}
                          >
                            {
                              logistics.map( item => (
                                <Option value={item.value} key={item.value}>{item.label}</Option>
                              ) )
                            }
                          </Select>
                        </div>
                        <div className={styles.infoBoxItemImg}>
                          快递单号：
                          <Input
                            placeholder="输入快递单号"
                            style={{ width: 230 }}
                            value={logisticsNo}
                            onChange={this.changeLogisticsNo}
                            maxLength={30}
                          />
                        </div>
                        <div className={styles.infoBoxItem}>
                          <Button
                            type='primary'
                            // style={{ width: '10%', marginBottom: 8, marginRight: 15 }}
                            icon="plus"
                            onClick={this.submit}
                          >
                            发货
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className={styles.infoBoxTit}>快递信息：</h4>
                      <div className={styles.infoBox}>
                        <div className={styles.infoBoxItem}>快递公司：{current.orderLogistics ? current.orderLogistics.logisticsDesc : '--'}</div>
                        <div className={styles.infoBoxItem}>快递单号：{current.orderLogistics ? current.orderLogistics.logisticsNo : '--'}</div>
                      </div>
                    </div>
                  )
                }



              </div>
            </Modal>
          ) : null
        }

      </GridContent>
    )
  }
}

export default Order
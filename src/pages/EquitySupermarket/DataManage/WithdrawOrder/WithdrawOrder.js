import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Input, message, Modal, Form } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import styles from './WithdrawOrder.less';

const { TextArea } = Input;
const FormItem = Form.Item;

@connect( ( { withdrawOrder } ) => {
  return {
    loading: withdrawOrder.loading,
    withdrawOrderList: withdrawOrder.withdrawOrderList,
    merchantNames: withdrawOrder.merchantNames,
  }
} )
@Form.create()
class WithdrawOrder extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      merchantOption: [],
      currentOrder: undefined,
      agreeVisible: false,
      rejectVisible: false,
      rejectReasonVisible: false
    };
    this.searchBar = React.createRef()
  }

  componentDidMount() {
    this.getMerchantName()
    this.searchBar.current.handleReset()
  };

  // 获取日期默认值
  getDay = ( num ) => {
    const nowDate = moment()
    let date = nowDate
    if ( num > 0 ) date = moment( nowDate ).add( 1, "days" );
    if ( num < 0 ) date = moment( nowDate ).subtract( Math.abs( num ), "days" );
    return moment( date, 'YYYY-MM-DD' );
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1,
    }, () => {
      this.getListData( data );
    } )
  }

  // 下拉框商户名称列表
  getMerchantName = () => {
    const { dispatch } = this.props
    dispatch( {
      type: 'withdrawOrder/getMerchantNames',
      payload: {},
      callBackFunc: ( result ) => {
        const merchantOption = [{ label: '全部', value: '' }]
        result.forEach( item => {
          const obj = { label: item.name, value: item.id }
          merchantOption.push( obj )
        } )
        this.setState( {
          merchantOption
        } )
      }
    } )
  }

  // 获取回退订单列表数据
  getListData = ( data ) => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    const query={ ...data }
    if( !query.auditStatus ) delete query.auditStatus
    if( !query.productType ) delete query.productType
    dispatch( {
      type: 'withdrawOrder/getWithdrawOrderList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `audit_status asc,${sortedInfo.columnKey} ${sortValue}`,
        },
        ...query
      },
    } );
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'createTime' ) {
      sortObj.columnKey = 'create_time'
    }
    if ( sortObj.columnKey === 'auditTime' ) {
      sortObj.columnKey = 'audit_time'
    }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sortObj,
    }, () => this.getListData( this.searchBar.current.data ) );
  };

  // 显示Modal
  showAgreeModal = ( record ) => {
    this.setState( {
      agreeVisible: true,
      currentOrder: record
    } );
  };

  showRejectModal = ( record ) => {
    this.setState( {
      rejectVisible: true,
      currentOrder: record
    } );
  };

  showRejectReasonModal = ( record ) => {
    this.setState( {
      rejectReasonVisible: true,
      currentOrder: record
    } );
  };

  // 同意回退
  handleAgree = () => {
    const choice = true;
    const reason = '';
    this.handleAudit( choice, reason );
  };

  // 驳回回退
  handleReject = () => {
    const { form } = this.props;
    form.validateFields( ( err ) => {
      if ( err ) {
        return
      }
      const reason = form.getFieldValue( 'reason' );
      const choice = false;
      this.handleAudit( choice, reason );

    } )
  };

  handleAudit = ( choice, reason ) => {
    const { id } = this.state.currentOrder;
    const { dispatch } = this.props;
    dispatch( {
      type: 'withdrawOrder/auditWithdrawOrder',
      payload: {
        id,
        pass: choice,
        reason
      },
      callFunc: ( text ) => {
        message.success( text )
        this.handleCancel()
        this.getListData( this.searchBar.current.data )
      }
    } )
  };

  // 取消Modal
  handleCancel = () => {
    this.setState( {
      agreeVisible: false,
      rejectVisible: false,
      rejectReasonVisible: false,
      currentOrder: undefined
    } );
  };

  render() {
    const { loading, withdrawOrderList: { total, list }, merchantNames } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, sortedInfo, currentOrder, merchantOption } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const orderBy = `audit_status asc,${sortedInfo.columnKey} ${sortValue}`;
    const exportConfig = {
      type: 'equityCenterService',
      ajaxUrl: `order/rollback/export`,
      xlsxName: '回退订单明细.xlsx',
      extraData: { orderBy, pageNum: 1, pageSize: -1, searchCount: false },
      responseType: 'POST'
    }
    const searchEleList = [
      {
        key: 'waterNo',
        label: '订单编号',
        type: 'Input',
      },
      {
        key: 'merchantId',
        label: '商户名称',
        type: 'Select',
        optionList: merchantOption
      },
      {
        key: 'productName',
        label: '商品名称',
        type: 'Input',
      },
      {
        key: 'productType',
        label: '商品类型',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          // {
          //   value: 'RED',
          //   label: '红包',
          // },
          {
            value: 'COUPON',
            label: '虚拟卡券',
          },
          {
            value: 'GOODS',
            label: '实物',
          },
          // {
          //   value: 'PHONE',
          //   label: '直充',
          // },
          // {
          //   value: 'WX_COUPON',
          //   label: '微信立减金',
          // },
          // {
          //   value: 'WX_VOUCHER',
          //   label: '微信代金券',
          // },
          // {
          //   value: 'RIGHT_PACKAGE',
          //   label: '权益包',
          // },
          {
            value:'TG_COUPON',
            label:'投顾卡券'
          },
          {
            value:'JN_RED',
            label:'绩牛红包'
          },
          {
            value:'JN_RIGHT',
            label:'绩牛权益'
          },
          {
            value: 'CUSTOM',
            label: '自定义商品',
          },
        ]
      },
      {
        key: 'createUsername',
        label: '申请人',
        type: 'Input',
      },
      {
        key: 'auditStatus',
        label: '订单状态',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'PENDING',
            label: '待审核',
          },
          {
            value: 'FINISH',
            label: '审核通过',
          },
          {
            value: 'REJECT',
            label: '审核失败',
          },
        ]
      },
      {
        key: 'createTime',
        label: '申请时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { createStart: 'YYYY-MM-DD 00:00:00', createEnd: 'YYYY-MM-DD 23:59:59' },
        initialValue: [
          this.getDay( -30 ).format( 'YYYY-MM-DD 00:00:00' ),
          this.getDay( 0 ).format( 'YYYY-MM-DD 23:59:59' )
        ] // 默认时间范围近一个月
      },
    ]

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

    const colorToStatus = {
      PENDING: 'gray',
      REJECT: 'red',
      FINISH: '#4668e4',
    }

    const wordToStatus = {
      PENDING: '待审核',
      REJECT: '审核失败',
      FINISH: '审核通过',
    }

    const wordToProductType = {
      COUPON: '虚拟卡券',
      GOODS: '实物',
      RED: '现金红包',
      PHONE: '直充',
      CUSTOM: '自定义商品',
      RIGHT_PACKAGE: '权益包',
      WX_COUPON: '微信立减金',
      WX_VOUCHER: '微信代金券',
      TG_COUPON: '投顾卡券',
      JN_RED:'绩牛红包',
      JN_RIGHT:'绩牛权益',
    }

    const columns = [
      {
        title: <span>订单编号</span>,
        dataIndex: 'waterNo',
        key: 'waterNo',
        render: waterNo => <span>{waterNo}</span>,
      },
      // {
      //   title: <span>外部商户订单号</span>,
      //   dataIndex: 'thirdPartyId',
      //   key: 'thirdPartyId',
      //   render: thirdPartyId => <span>{thirdPartyId}</span>,
      // },
      {
        title: <span>商品类型</span>,
        dataIndex: 'productType',
        key: 'productType',
        render: productType => <span>{wordToProductType[productType]}</span>,
      },
      {
        title: <span>商户名称</span>,
        dataIndex: 'merchantId',
        key: 'merchantId',
        render: merchantId => merchantNames ? merchantNames.map( item =>
          <span key={item.id}>{item.id === merchantId ? item.name : ''}</span> ) : '',
      },
      {
        title: <span>商品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
        render: productName => <span>{productName}</span>,
      },
      {
        title: <span>回退原因</span>,
        dataIndex: 'reason',
        key: 'reason',
        width: 200,
        ellipsis: true,
        render: reason => <div style={{ width:'200px', whiteSpace:'wrap' }}>{reason}</div>,
      },
      {
        title: <span>回退数量/金额</span>,
        dataIndex: 'amount',
        key: 'amount',
        render: ( _, record ) => {
          return ( <span>{record.productType === "RED" ? record.amount.toFixed( 2 ) : record.amount}</span> )
        }
      },
      {
        title: <span>订单状态</span>,
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        render: auditStatus => {
          return (
            <div className={styles.order_status}>
              <span style={{ background: `${colorToStatus[auditStatus]}` }} />
              <span> {wordToStatus[auditStatus]}</span>
            </div>
          )
        },
      },
      {
        title: <span>申请人</span>,
        dataIndex: 'createUsername',
        key: 'createUsername',
        render: createUsername => <span>{createUsername}</span>,
      },
      {
        title: <span>申请时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>审核人</span>,
        dataIndex: 'auditUsername',
        key: 'auditUsername',
        render: auditUsername => <span>{auditUsername}</span>,
      },
      {
        title: <span>审批时间</span>,
        dataIndex: 'auditTime',
        key: 'auditTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'audit_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: auditTime => <span>{auditTime}</span>,
      },
      {
        title: <span>操作</span>,
        key: 'operation',
        align: 'center',
        width: 100,
        fixed: 'right',
        render: ( _, record ) => {
          return (
            <div className={styles.operate_container}>
              {
                record.auditStatus === 'PENDING' &&
                <>
                  <span onClick={() => this.showAgreeModal( record )}>同意</span>
                  <span onClick={() => this.showRejectModal( record )}>驳回</span>
                </>
              }
              {
                record.auditStatus === 'REJECT' &&
                <span onClick={() => this.showRejectReasonModal( record )}>驳回原因</span>
              }
            </div>
          )
        }
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title='回退订单'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.global_styles}>
            <SearchBar
              ref={this.searchBar}
              searchEleList={searchEleList}
              searchFun={this.filterSubmit}
              exportConfig={exportConfig}
              loading={loading}
            />
          </div>
          <Table
            scroll={{ x: true }}
            size="middle"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        <Modal
          title="同意"
          className={styles.global_styles}
          visible={this.state.agreeVisible}
          onOk={() => this.handleAgree()}
          onCancel={this.handleCancel}
          centered
          destroyOnClose
        >
          <p>您确认同意回退申请吗？</p>
        </Modal>
        <Modal
          title="驳回"
          className={styles.global_styles}
          visible={this.state.rejectVisible}
          onOk={() => this.handleReject()}
          onCancel={this.handleCancel}
          centered
          destroyOnClose
        >
          <FormItem label='驳回原因'>
            {getFieldDecorator( 'reason', {
              initialValue: '',
              rules: [{ required: true, message: `请输入驳回原因` }]
            } )(
              <TextArea maxLength={80} autoSize={{ minRows: 6, maxRows: 10 }} placeholder='请输入驳回原因' />
            )}
          </FormItem>
        </Modal>
        <Modal
          title="驳回原因"
          className={styles.global_styles}
          footer={null}
          onCancel={this.handleCancel}
          visible={this.state.rejectReasonVisible}
          centered
          destroyOnClose
        >
          <TextArea defaultValue={currentOrder ? currentOrder.rejectReason : ''} disabled style={{ height: '180px' }} />
        </Modal>
      </GridContent>
    );
  };
}

export default WithdrawOrder;

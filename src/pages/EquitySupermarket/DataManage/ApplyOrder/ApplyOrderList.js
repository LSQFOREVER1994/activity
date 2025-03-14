/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, message, Modal, Input, Form, Button, Spin } from 'antd';
import moment from 'moment';
import debounce from 'lodash/debounce'
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ApplyOrderDetail from './ApplyOrderDetail/ApplyOrderDetail'
import SearchBar from '@/components/SearchBar';
import styles from './applyOrderList.less';
import All from '@/assets/all.png'
import Pending from '@/assets/pending.png'
import Wait from '@/assets/wait.png'
import Fin from '@/assets/fin.png'
import Other from '@/assets/other.png'

const { TextArea } = Input
const FormItem = Form.Item

const STATUS = [
  {
    value: '',
    status: '全部',
    icon: All,
  },
  {
    value: 'PENDING',
    status: '待审核',
    icon: Pending,
  },
  // {
  //   value: 'WAITSENT',
  //   status: '待发送',
  //   icon: Wait,
  // },
  {
    value: 'FINISH',
    status: '已完成',
    icon: Fin,
  },
  {
    value: 'REJECT,CANCELED',
    status: '其他',
    icon: Other,
  }
];

@connect( ( { applyOrder } ) => {
  return {
    ...applyOrder,
  }
} )
@Form.create()
class ApplyOrderList extends PureComponent {
  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

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
      auditStatus: '', // 顶部激活框
      merchantOption: [],
      detailData: [], // 详情模块对应的信息

      // 功能模块显示隐藏
      rejectVisible: false,
      accessVisible: false,
      cancelVisible: false,
      sendEmailVisible: false,

      auditDetail: {}, // 申请的详细信息

      applyOrderList: [], // 申请订单列表

      type: '', // 需要打开的申请订单商品类型
      applyOrderDetailVisible: false
    };
    this.searchBar = React.createRef()
    this.getApplyOrderList = debounce( this.getApplyOrderList.bind( this ), 700 )
    this.fetchEquityApply = debounce( this.fetchEquityApply.bind( this ), 700 )
    this.fetchEquityAudit = debounce( this.fetchEquityAudit.bind( this ), 700 )
    this.fetchEquityCancel = debounce( this.fetchEquityCancel.bind( this ), 700 )
    this.fetchEquitySend = debounce( this.fetchEquitySend.bind( this ), 700 )

  }

  componentDidMount() {
    this.searchBar.current.handleReset();
    this.getAllMerchant();
    this.getStatusCount();
  };

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
    }, () => this.getApplyOrderList( this.searchBar.current.data ) );
  };


  // 获取单个商品详情
  getProductDetailById = ( record ) => {
    const { productId } = record
    const { dispatch } = this.props
    dispatch( {
      type: 'applyOrder/getSingleGoodsDetail',
      payload: {
        id: productId
      },
      callBackFunc: ( res ) => {
        if ( res.success ) {
          res.result.productId = res.result.id
          delete res.result.id
          record = Object.assign( record, res.result )
          this.getOrderDetailById( record )
        }
      }
    } )
  }

  // 获取单个订单详情
  getOrderDetailById = ( record ) => {
    const { id } = record
    const { dispatch } = this.props
    dispatch( {
      type: 'applyOrder/getSingleOrderDetail',
      payload: {
        id
      },
      callBackFunc: ( res ) => {
        if ( res.success ) {
          this.handleDetailOpen( record, res.result )
        }
      }
    } )
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1,
      pageSize: 10,
    }, () => {
      this.getApplyOrderList( data )
    } )
  }

  // 获取订单列表
  getApplyOrderList = ( data ) => {
    const { dispatch } = this.props
    const { pageNum, pageSize, sortedInfo, auditStatus } = this.state
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'applyOrder/getApplyOrderList',
      payload: {
        auditStatusList: auditStatus,
        page:{
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
          pageNum,
          pageSize,
        },
        ...data
      },
      callBackFunc: res => {
        const { result: { list } } = res
        this.setState( {
          applyOrderList: list
        } )
      }
    } )
  }

  getStatusCount = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'applyOrder/getStatusCount',
      payload: {},
    } )
  }

  // 获取商户列表
  getAllMerchant = () => {
    const { dispatch } = this.props
    dispatch( {
      type: 'applyOrder/getMerchantNameList',
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

  // 权益订单申请 - 申请订单 -发送
  fetchEquityApply = ( params ) => {
    const { dispatch } = this.props
    dispatch( {
      type: 'applyOrder/fetchEquityApply',
      payload: params,
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.handleModalVisible( 'access' )
          this.getApplyOrderList()
        }
      }
    } )
  }

  // 权益订单审核
  fetchEquityAudit = ( params ) => {
    const { dispatch } = this.props
    dispatch( {
      type: 'applyOrder/fetchEquityAudit',
      payload: params,
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage );
          if ( params.pass ) { this.handleModalVisible( 'access' ) }
          else { this.handleModalVisible( 'reject' ) }
          this.getApplyOrderList()
        }
      }
    } )
  }

  // 权益订单发送
  fetchEquitySend = ( params ) => {
    const { dispatch } = this.props
    const { id } = params
    dispatch( {
      type: 'applyOrder/fetchEquitySend',
      payload: { id },
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.handleModalVisible( 'sendEmail' )
          this.getApplyOrderList()
        }
      }
    } )
  }

  // 权益订单取消
  fetchEquityCancel = ( params ) => {
    const { dispatch } = this.props
    const { id, reason } = params
    dispatch( {
      type: 'applyOrder/fetchEquityCancel',
      payload: { id, reason },
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.handleModalVisible( 'cancel' )
          this.getApplyOrderList()
        }
      }
    } )
  }

  // 审核事件处理 同意 / 驳回
  handleAuditEvent = ( record ) => {
    const { form: { getFieldValue, validateFields } } = this.props
    validateFields( ( err ) => {
      const reason = getFieldValue( 'rejectReason' )
      record = Object.assign( record, { reason } )
      if ( !record.pass ) {
        if ( err ) {
          // message.error('请填写驳回原因')
        } else {
          this.fetchEquityAudit( record )
        }
      } else {
        this.fetchEquityAudit( record )
      }
    } )
  }

  // 取消事件处理
  handleCancelEvent = record => {
    const { form: { getFieldValue, validateFields } } = this.props
    validateFields( ( err ) => {
      const reason = getFieldValue( 'cancelReason' )
      record = Object.assign( record, { reason } )
      if ( err ) {
        // message.error('请填写取消原因')
      } else {
        this.fetchEquityCancel( record )
      }
    } )
  }

  // 发送事件处理
  handleSendEvent = record => {
    this.fetchEquitySend( record )
  }

  // 模块显隐控制
  handleModalVisible = ( type, record ) => {
    if ( record ) {
      this.setState( {
        auditDetail: record,
        type,
      } )
    }

    switch ( type ) {
      case 'access':
        this.setState( {
          accessVisible: !this.state.accessVisible
        }, )
        break;
      case 'cancel':
        this.setState( {
          cancelVisible: !this.state.cancelVisible
        }, )
        break;
      case 'reject':
        this.setState( {
          rejectVisible: !this.state.rejectVisible
        }, )
        break;
      case 'sendEmail':
        this.setState( {
          sendEmailVisible: !this.state.sendEmailVisible
        }, )
        break;
      default:
        this.setState( {
          applyOrderDetailVisible: !this.state.applyOrderDetailVisible
        } )
        break;
    }
  }

  // 驳回模块
  renderRejectReasonModal = ( data ) => {
    const { form: { getFieldDecorator, getFieldValue }, auditLoading } = this.props
    const { rejectVisible } = this.state
    const { id, auditStatus, rejectReason } = data
    return (
      <Modal
        className={styles.global_styles}
        title='驳回'
        visible={rejectVisible}
        onCancel={() => this.handleModalVisible( 'reject' )}
        footer={
          auditStatus !== 'REJECT' &&
          <>
            <Button onClick={() => this.handleModalVisible( 'reject' )}>取消</Button>
            {
              auditStatus === 'REJECT' ?
                <Button onClick={() => this.handleModalVisible( 'reject' )}>确定</Button> :
                <Button onClick={() => this.handleAuditEvent( { id, pass: false } )}>确定</Button>
            }
          </>
        }
        maskClosable={false}
        centered
        destroyOnClose
      >
        <Spin spinning={auditLoading}>
          <Form>
            <FormItem label='驳回原因'>
              {getFieldDecorator( 'rejectReason', {
                initialValue: auditStatus === 'REJECT' ? rejectReason : '',
                rules: [
                  { required: true, message: '请输入驳回原因' },
                ]
              } )(
                <TextArea autoSize={{ minRows: 6, maxRows: 10 }} placeholder='请输入驳回原因' maxLength={80} disabled={auditStatus === 'REJECT'} />
              )}
            </FormItem>
            <div className={styles.length}> <span>{`${String( getFieldValue( 'rejectReason' ) ).length}/ 80`} </span></div>
          </Form>
        </Spin>
      </Modal>
    )
  }

  // 同意模块
  renderAccessModal = ( data ) => {
    const { auditLoading } = this.props
    const { accessVisible } = this.state
    const { id } = data
    return (
      <Modal
        className={styles.global_styles}
        title='同意'
        visible={accessVisible}
        onOk={() => {
          this.handleAuditEvent( { id, pass: true } )
        }}
        onCancel={() => { this.handleModalVisible( 'access' ) }}
        maskClosable={false}
        centered
      >
        <Spin spinning={auditLoading}>
          <span>请确认申请信息，同意后无法撤回！</span>
        </Spin>
      </Modal>
    )
  }

  // 取消模块
  renderCancelModal = ( data ) => {
    const { form: { getFieldDecorator, getFieldValue }, cancelLoading } = this.props
    const { cancelVisible } = this.state
    const { id, auditStatus, cancelReason } = data
    return (
      <Modal
        className={styles.global_styles}
        title='取消'
        visible={cancelVisible}
        onCancel={() => { this.handleModalVisible( 'cancel' ) }}
        footer={
          auditStatus !== 'CANCELED' &&
          <>
            <Button onClick={() => this.handleModalVisible( 'cancel' )}>取消</Button>
            {
              auditStatus === 'CANCELED' ?
                <Button onClick={() => this.handleModalVisible( 'cancel' )}>确定</Button> :
                <Button onClick={() => this.handleCancelEvent( { id } )}>确定</Button>
            }
          </>
        }
        maskClosable={false}
        centered
        destroyOnClose
      >
        <Spin spinning={cancelLoading}>
          <Form>
            <FormItem label='取消原因'>
              {getFieldDecorator( 'cancelReason', {
                initialValue: auditStatus === 'CANCELED' ? cancelReason : '',
                rules: [{ required: true, message: '请输入取消原因' }]
              } )(
                <TextArea autoSize={{ minRows: 6, maxRows: 10 }} placeholder='请输入取消原因' maxLength={80} disabled={auditStatus === 'CANCELED'} />
              )}
            </FormItem>
            <div className={styles.length}> <span>{String( getFieldValue( 'cancelReason' ) ).length}/80 </span></div>
          </Form>
        </Spin>
      </Modal>
    )
  }

  // 发送到邮箱
  renderSendEmailModal = ( data ) => {
    const { sendLoading } = this.props
    const { sendEmailVisible } = this.state
    const { id, email } = data
    return (
      <Modal
        className={styles.global_styles}
        title='发送到邮箱'
        visible={sendEmailVisible}
        onOk={() => { this.fetchEquitySend( { id } ) }}
        onCancel={() => { this.handleModalVisible( 'sendEmail' ) }}
        maskClosable={false}
        centered
      >
        <Spin spinning={sendLoading}>
          <div className={styles.send_email}>
            <span>即将发送到邮箱</span>
            <span>{email || '-'}</span>
          </div>
        </Spin>
      </Modal>
    )
  }

  // 打开详情页
  handleDetailOpen = ( record, singleInfo ) => {
    const { type } = record
    record = Object.assign( record, singleInfo )
    this.setState( {
      detailData: record
    } )
    this.handleModalVisible( type )
  }

  // 详情页的同意
  handleDetailButton = ( openType, record ) => {
    const { type } = record
    this.handleModalVisible( type )
    if ( openType === 'access' ) {
      this.handleModalVisible( 'access', record )
    } else {
      this.handleModalVisible( openType, record )
    }
  }

  numFormat = ( num ) => {
    const res = num.toString().replace( /\d+/, ( n ) => {
      return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
        return `${$1},`;
      } );
    } )
    return res;
  }

  // 获取日期默认值
  getDay = ( num ) => {
    const nowDate = moment()
    let date = nowDate
    if ( num > 0 ) date = moment( nowDate ).add( 1, "days" );
    if ( num < 0 ) date = moment( nowDate ).subtract( Math.abs( num ), "days" );
    return moment( date, 'YYYY-MM-DD' );
  }

  selectStatus = ( status ) => {
    this.setState( {
      auditStatus: status
    } )
    this.filterSubmit( this.searchBar.current.data )
  }

  renderStat = () => {
    const { statusResult } = this.props;
    const { auditStatus } = this.state;
    const status = { 'ALL': 0, 'PENDING': 0, 'WAITSENT': 0, 'FINISH': 0, 'REJECT,CANCELED': 0 };
    Object.keys( statusResult ).map( item => {
      status.ALL += statusResult[item];
      if ( item === 'PENDING' ) { status.PENDING = statusResult[item]; }
      if ( item === 'WAITSENT' ) { status.WAITSENT = statusResult[item]; }
      if ( item === 'FINISH' ) { status.FINISH = statusResult[item]; }
      status['REJECT,CANCELED'] = status.ALL - status.PENDING - status.WAITSENT - status.FINISH;
      return null
    } )

    return (
      <div className={styles.status_box}>
        {STATUS.map( item =>
          <div
            onClick={() => this.selectStatus( item.value )}
            className={styles[`${auditStatus === item.value ? 'status_active' : 'status'}`]}
            key={item.status}
          >
            <div className={styles.icon_box}><img src={item.icon} alt={item.status} /></div>
            <div className={styles.text_box}>
              <div>{this.numFormat( status[item.value || 'ALL'] )}</div>
              <div>{item.status}</div>
            </div>
          </div> )}
      </div>
    )
  }

  render() {
    const { loading, applyOrderListResult: { total } } = this.props;
    const { pageNum, pageSize, detailData, auditDetail, applyOrderList,
      sortedInfo, applyOrderDetailVisible, merchantOption, auditStatus } = this.state
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'equityCenterService',
      ajaxUrl: `order/apply/export`,
      xlsxName: '申请订单明细.xlsx',
      extraData: { orderBy, auditStatusList: auditStatus, pageNum: 1, pageSize: -1, searchCount: false },
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
        key: 'createUsername',
        label: '申请人',
        type: 'Input',
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
      }
    ]

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      },
    };

    const colorToStatus = {
      PENDING: '#ff314a',
      REJECT: '#066efd',
      WAITSENT: '#7064ff',
      FINISH: '#05caaa',
      CANCELED: '#066efd',
    }

    const wordToStatus = {
      PENDING: '待审核',
      REJECT: '已拒绝',
      WAITSENT: '待发送',
      FINISH: '已完成',
      CANCELED: '已取消',
    }

    const columns = [
      {
        title: <span>订单编号</span>,
        dataIndex: 'waterNo',
        key: 'waterNo',
        render: waterNo => <span>{waterNo}</span>,
      },
      {
        title: <span>商户名称</span>,
        dataIndex: 'merchantName',
        key: 'merchantName',
        ellipsis: true,
        render: merchantName => <span>{merchantName}</span>,
      },
      {
        title: <span>商品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        render: productName => <span>{productName}</span>,
      },
      {
        title: <span>申请量</span>,
        dataIndex: 'applyNum',
        key: 'applyNum',
        render: ( applyNum, record ) => {
          const amoutType = ['COUPON', 'GOODS', 'CUSTOM', 'WX_VOUCHER', 'PHONE']
          const moneyType = ['RED', 'WX_COUPON', 'JN_RED']
          const {  sendEmail } = record || {}

          if ( moneyType.includes( record.productType ) || ( moneyType.includes( record.productType ) && !sendEmail ) ) {
            return <span>{record.totalMoney}元</span>
          } if( amoutType.includes( record.productType ) ){
            return <span>{record.amount || 0}个</span>
          }

          return <span>{record.amount || 0}个</span>
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
        title: <span>订单状态</span>,
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        render: status => {
          return (
            <div className={styles.order_status}>
              <span style={{ background: `${colorToStatus[status]}` }} />
              <span> {wordToStatus[status]}</span>
            </div>
          )
        },
      },
      {
        title: <span>操作</span>,
        key: 'operation',
        align: 'center',
        fixed: 'right',
        render: ( _, record ) => {
          return (
            <div className={styles.operate_container} style={{ justifyContent: 'center' }}>
              {
                record.auditStatus === 'PENDING' &&
                <>
                  <span onClick={() => {
                    this.getProductDetailById( record )
                  }}
                  >详情
                  </span>
                  <span onClick={() => { this.handleModalVisible( 'access', record ) }}>同意</span>
                  <span style={{ color: 'red' }} onClick={() => this.handleModalVisible( 'reject', record )}>驳回</span>
                  <span style={{ color: '#ffaa07' }} onClick={() => this.handleModalVisible( 'cancel', record )}>取消</span>
                </>
              }
              {
                record.auditStatus === 'REJECT' &&
                <>
                  <span onClick={() => {
                    this.getProductDetailById( record )
                  }}
                  >详情
                  </span>
                  <span onClick={() => this.handleModalVisible( 'reject', record )}>驳回原因</span>
                </>
              }
              {
                record.auditStatus === 'WAITSENT' &&
                <>
                  <span onClick={() => {
                    this.getProductDetailById( record )
                  }}
                  >详情
                  </span>
                  <span onClick={() => this.handleModalVisible( 'sendEmail', record )}>发送</span>
                </>
              }
              {
                record.auditStatus === 'FINISH' &&
                <>
                  <span onClick={() => {
                    this.getProductDetailById( record )
                  }}
                  >详情
                  </span>
                  {record.sendEmail && <span onClick={() => this.handleModalVisible( 'sendEmail', record )}>再次发送</span>}
                </>
              }
              {
                record.auditStatus === 'CANCELED' &&
                <>
                  <span onClick={() => this.getProductDetailById( record )}>详情</span>
                  <span onClick={() => this.handleModalVisible( 'cancel', record )}>取消原因</span>
                </>
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
          title='申请订单'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          {this.renderStat()}
          <div className={styles.global_styles}>
            <SearchBar
              ref={this.searchBar}
              preSearchData={this.state.preSearchData}
              searchEleList={searchEleList}
              searchFun={this.filterSubmit}
              loading={loading}
              exportConfig={exportConfig}
            />
          </div>
          <Table
            style={{ marginTop: 20 }}
            scroll={{ x: true }}
            size="middle"
            rowKey={( r, index ) => index}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.tableChange}
            dataSource={applyOrderList}
          />
        </Card>
        {/* 详情模块 */}
        <ApplyOrderDetail
          detailData={detailData}
          applyOrderDetailVisible={applyOrderDetailVisible}
          type={this.state.type}
          handleModalVisible={this.handleModalVisible}
          fetchEquitySend={this.fetchEquitySend}
          handleDetailButton={this.handleDetailButton}
        />
        {/* 其余模块 */}
        {this.renderAccessModal( auditDetail )}
        {this.state.cancelVisible && this.renderCancelModal( auditDetail )}
        {this.state.rejectVisible && this.renderRejectReasonModal( auditDetail )}
        {this.renderSendEmailModal( auditDetail )}
      </GridContent>
    );
  };
}

export default ApplyOrderList;

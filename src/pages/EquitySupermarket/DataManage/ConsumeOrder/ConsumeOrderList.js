import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table, Modal, Card, message, Input, Button, Row, Upload, Spin, Select, Tooltip, Switch, Icon } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import LogisticsDetail from './LogisticsDetail';
import styles from './consumeOrderList.less';

const FormItem = Form.Item;
const { Option } = Select;
@connect( ( { consumeOrder } ) => {
  return {
    ...consumeOrder
  }
} )
@Form.create()
class ConsumeOrderList extends PureComponent {
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
      sendModalVisible: false,
      multiSendModalVisible: false,
      lineData: {},
      consumeOrderList: [], // 消耗订单列表数据
      fileList: [],
      fileFormdata: '',
      merchantOption: [],
      preSearchData: {},
      logiVisible: false,
      currentLogiData: undefined,
    };
    this.searchBar = React.createRef()
  }

  componentDidMount() {
    this.getAllMerchant();
    // this.getExpressList();
  };

  // 获取商户列表
  getAllMerchant = () => {
    const { dispatch, history: { location: { query: { data } } } } = this.props
    dispatch( {
      type: 'consumeOrder/getMerchantNameList',
      payload: {},
      callBackFunc: ( res ) => {
        const { result } = res
        const merchantOption = [{ label: '全部', value: '' }]
        result.forEach( item => {
          const obj = { label: item.name, value: item.id }
          merchantOption.push( obj )
        } )
        this.setState( {
          merchantOption
        }, () => {
          if ( data ) {
            this.handlePreSearch()
          } else {
            this.searchBar.current.handleReset()
          }
        } )
      }
    } )
  }

  // 接受路由传参
  handlePreSearch = () => {
    const { history: { location: { query: { data } } } } = this.props
    const preSearchData = {
      merchantId: data.merchantId,
      productName: data.name,
      productType: data.type,
      createStart: data.createTime ? moment( data.createTime ).format( 'YYYY-MM-DD 00:00:00' ) : '',
      createEnd: data.createTime ? moment( data.createTime ).format( 'YYYY-MM-DD 23:59:59' ) : '',
    }
    this.setState( {
      preSearchData
    }, () => this.filterSubmit( preSearchData ) )
  }

  // 获取日期默认值
  getDay = ( num ) => {
    const nowDate = moment()
    let date = nowDate
    if ( num > 0 ) date = moment( nowDate ).add( 1, "days" );
    if ( num < 0 ) date = moment( nowDate ).subtract( Math.abs( num ), "days" );
    return moment( date, 'YYYY-MM-DD' );
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'createTime' ) {
      sortObj.columnKey = 'create_time'
    }
    if ( sortObj.columnKey === 'sendTime' ) {
      sortObj.columnKey = 'send_time'
    }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sortObj,
    }, () => this.getConsumeOrderList( this.searchBar.current.data ) );
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1,
      pageSize: 10,
    }, () => {
      this.getConsumeOrderList( data )
    } )
  }

  // 获取消耗订单列表
  getConsumeOrderList = ( data ) => {
    const { dispatch } = this.props
    const { pageNum, pageSize, sortedInfo } = this.state
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const query = { ...data }
    if( !query.productType ) delete query.productType
    if( !query.sendState ) delete query.sendState
    dispatch( {
      type: 'consumeOrder/getConsumeOrderList',
      payload: {
        page:{
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
          pageNum,
          pageSize,
        },
        ...query
      },
      callBackFunc: res => {
        const { result: { list } } = res
        this.setState( {
          consumeOrderList: list
        } )
      }
    } )
  }

  // 发货或修改物流信息
  fetchConsumeExpressAlterOrSend = ( params ) => {
    const { dispatch, expressList } = this.props
    const { expressMerchantNo, expressNo, id, isSubscribe } = params
    const expressMerchant = expressList.find( item => item.code === expressMerchantNo )?.name;
    dispatch( {
      type: 'consumeOrder/fetchConsumeExpressAlterOrSend',
      payload: {
        id,
        expressNo,
        expressMerchant,
        expressMerchantNo,
      },
      callBackFunc: res => {
        if ( res.success ) {
          message.success( '发货信息提交成功！' )
          this.handleModalVisible( 'send' )
          this.getConsumeOrderList( this.searchBar.current.data )
          if ( isSubscribe ) {
            this.changeExpressSubscribe( id )
          }
        }
      }
    } )
  }

  // 获取物流公司
  getExpressList = () => {
    const { dispatch } = this.props
    dispatch( {
      type: 'consumeOrder/getExpressList',
    } )
  }

  changeExpressSubscribe = ( id ) => {
    const { dispatch } = this.props
    dispatch( {
      type: 'consumeOrder/changeExpressSubscribe',
      payload: {
        id,
      },
      callBackFunc: res => {
        message.success( res.message )
      }
    } )
  }

  // modal显隐藏控制
  handleModalVisible = ( type, data ) => {
    if ( data ) {
      switch ( type ) {
        case 'send':
          this.setState( {
            sendModalVisible: !this.state.sendModalVisible,
            lineData: data
          } )
          break;
        case 'multiSend':
          this.setState( {
            multiSendModalVisible: !this.state.multiSendModalVisible
          } )
          break;
        default:
          break;
      }
    } else {
      switch ( type ) {
        case 'send':
          this.setState( {
            sendModalVisible: !this.state.sendModalVisible,
          } )
          break;
        case 'multiSend':
          this.setState( {
            multiSendModalVisible: !this.state.multiSendModalVisible
          } )
          break;
        default:
          break;
      }
    }
  }

  // 修改或发货 确认按钮触发
  handleExpressAlterOrSend = () => {
    const { form: { validateFields } } = this.props
    const { lineData } = this.state
    const { id } = lineData

    let params = { id }
    validateFields( ( err, values ) => {
      params = Object.assign( params, values )
      if ( err ) {
        message.error( '请输入正确的发货信息' )
      } else {
        this.fetchConsumeExpressAlterOrSend( params )
      }
    } )
  }

  // 批量发货接口调用
  fetchMultiSend = ( params ) => {
    const { dispatch } = this.props
    const { formData } = params
    dispatch( {
      type: 'consumeOrder/fetchMultiSend',
      payload: {
        file: formData
      },
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.handleModalVisible( 'multiSend' )
          this.getConsumeOrderList( this.searchBar.current.data )
        }
        this.setState( { fileList: [] } );
      }
    } )
  }

  // 上传文件处理
  getImportOrder = ( params ) => {
    const { res: { file } } = params
    if ( !file ) return
    const isLtM = ( file.size / 1024 / 1024 );
    if ( isLtM > 10 ) {
      message.error( `请上传小于10M的文件!` );
      return
    }
    const { lastModified, name } = file;
    const formData = new FormData();
    if ( lastModified ) {
      formData.append( "file", file ); // 文件对象
    } else {
      formData.append( "file", file, name );
    }
    this.setState( {
      fileList: [file],
      fileFormdata: formData,
    } )
  };

  //  确认上传
  onUpload = () => {
    const { fileFormdata } = this.state
    this.fetchMultiSend( { formData: fileFormdata } )
  }

  // 下载模版地址
  fetchMultiSendTemplate = () => {
    window.open( 'https://media-test.jiniutech.com/dev/excel/批量发货模板.xlsx' )
  }

  numberFormat = str => {
    return String( Number( str ).toFixed( 2 ) ).toLocaleString()
  }

  // 物流查询
  handleQueryExpress = ( expressNo ) => {
    window.open( `https://www.kuaidi100.com/?nu=${expressNo}` )
  }

  getLogisticsData = ( data ) => {
    const { dispatch } = this.props;
    const { tradeId } = data;
    dispatch( {
      type: 'consumeOrder/getLogisticsData',
      payload: {
        thirdPartyId: tradeId
      },
      callBackFunc: ( res ) => {
        const currentLogiData = { ...res, ...data }
        this.setState( {
          logiVisible: true,
          currentLogiData
        } )

      }
    } )
  }

  closeModal = () => {
    this.setState( {
      logiVisible: false,
      currentLogiData: undefined,
    } );
  };

  // 发货 or 修改
  renderSendOrAlterExpressModal = ( data ) => {
    const { form: { getFieldDecorator }, loading, expressList } = this.props;
    const { sendModalVisible } = this.state
    const { expressMerchantNo, expressNo } = data
    const filterLogistics = []
    if ( expressList ) {
      for ( let i = 0; i < expressList.length; i += 1 ) {
        if ( filterLogistics.findIndex( item => item.code === expressList[i].code ) === -1 ) {
          filterLogistics.push( expressList[i] )
        }
      }
    }

    return (
      <Modal
        className={styles.global_styles}
        title="编辑发货信息"
        visible={sendModalVisible}
        maskClosable={false}
        centered
        destroyOnClose
        onCancel={() => this.handleModalVisible( 'send' )}
        zIndex={1050}
        footer={[
          <Button key="back" onClick={() => this.handleModalVisible( 'send' )}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => this.handleExpressAlterOrSend()}>保存</Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Form onSubmit={this.handleExpressAlterOrSend}>
            <Row>
              <FormItem label='物流公司' {...this.formLayout}>
                {getFieldDecorator( 'expressMerchantNo', {
                  initialValue: expressMerchantNo,
                  rules: [{ required: true, message: '请输入一家物流公司！' }]
                } )(
                  // <Select
                  //   style={{ width: 230 }}
                  //   placeholder="选择物流公司"
                  //   onChange={this.changeLogistics}
                  //   showSearch
                  //   optionFilterProp="children"
                  //   filterOption={( input, option ) =>
                  //     option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                  //   }
                  // >
                  //   {filterLogistics.map( item => (
                  //     <Option value={item.code} key={item.code}>
                  //       {item.name}
                  //     </Option>
                  //   ) )}
                  // </Select>

                  <Input style={{ width: 230 }} placeholder="请输入物流公司" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label='快递单号' {...this.formLayout}>
                {getFieldDecorator( 'expressNo', {
                  initialValue: expressNo,
                  rules: [{ required: true, message: '请输入一个快递单号！', whitespace: true }]
                } )(
                  <Input
                    placeholder="请输入快递单号"
                    style={{ width: 230 }}
                    maxLength={30}
                  />
                )}
              </FormItem>
            </Row>
            {!expressNo &&
              <Row>
                <FormItem
                  label={
                    <>
                      <span>物流订阅</span>
                      <Tooltip title="开启会消耗一定费用">
                        <Icon style={{ marginLeft: 5, marginTop: 13 }} type="question-circle" />
                      </Tooltip>
                    </>
                  }
                  {...this.formLayout}
                  hidden
                >
                  {getFieldDecorator( 'isSubscribe', {
                    initialValue: false,
                  } )( <Switch /> )}
                </FormItem>
              </Row>}
          </Form>
        </Spin>
      </Modal>
    )
  }

  // 批量发货
  renderMultiSendGoodModal = () => {
    const { loading } = this.props;
    const { multiSendModalVisible } = this.state
    return (
      <Modal
        className={styles.global_styles}
        title='批量发货'
        onCancel={() => {
          this.handleModalVisible( 'multiSend' )
          this.setState( { fileList: [] } )
        }}
        footer={
          <>
            <Button onClick={() => {
              this.handleModalVisible( 'multiSend' )
              this.setState( { fileList: [] } )
            }}
            >取消
            </Button>
            <Button loading={loading} onClick={() => this.onUpload()}>确定</Button>
          </>
        }
        visible={multiSendModalVisible}
        maskClosable={false}
        centered
      >
        <Spin spinning={loading}>
          <div className={styles.file_load}>
            <div style={{ height: 120 }}>
              <span>模版导入：</span>
              <div>
                <Upload
                  fileList={this.state.fileList}
                  beforeUpload={( file ) => { this.setState( { fileList: [file] } ) }}
                  onRemove={() => this.setState( { fileList: [] } )}
                  customRequest={( res ) => this.getImportOrder( { res } )}
                  accept='.xlsx,.xls'
                >
                  <Button
                    icon='import'
                    style={{ width: 150, marginLeft: 8 }}
                    disabled={this.state.fileList.length > 0}
                  >
                    上传文件
                  </Button>
                </Upload>
                <span>支持扩展名: .xls .xlsx</span>
              </div>
            </div>
            <Button icon='download' onClick={this.fetchMultiSendTemplate}> 模版下载</Button>
          </div>
        </Spin>
      </Modal>
    )
  }


  render() {
    const { loading, consumeOrderListResult: { total } } = this.props;
    const {
      pageSize,
      pageNum,
      consumeOrderList,
      sortedInfo,
      lineData,
      merchantOption,
      logiVisible,
      currentLogiData
    } = this.state
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'equityCenterService',
      ajaxUrl: `order/consume/export`,
      xlsxName: '消耗订单明细.xlsx',
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
            value: 'CUSTOM',
            label: '自定义商品',
          },
        ]
      },
      {
        key: 'channel',
        label: '订单来源',
        type: 'Input',
      },
      {
        key: 'createTime',
        label: '创建时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { createStart: 'YYYY-MM-DD 00:00:00', createEnd: 'YYYY-MM-DD 23:59:59' },
        limit: 31536000000, // 限制范围：一年
        initialValue: [
          this.getDay( -30 ).format( 'YYYY-MM-DD 00:00:00' ),
          this.getDay( 0 ).format( 'YYYY-MM-DD 23:59:59' )
        ] // 默认时间范围近一个月
      },
      {
        key: 'receiveUser',
        label: '接收人',
        type: 'Input',
      },
      {
        key: 'sendState',
        label: '发货状态',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'SENDING',
            label: '待发货',
          }, {
            value: 'SUCCESS',
            label: '已发货',
          },
        ]
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
      },
    };

    const wordsToType = {
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
        title: <span>商户名称</span>,
        dataIndex: 'merchantName',
        key: 'merchantName',
        render: merchantName => <span>{merchantName}</span>,
      },
      {
        title: <span>商品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
        render: productName => <span>{productName}</span>,
      },
      {
        title: <span>商品类型</span>,
        dataIndex: 'productType',
        key: 'productType',
        render: productType => <span>{wordsToType[productType]}</span>,
      },
      {
        title: <span>发送数量/金额</span>,
        dataIndex: 'sendAmount',
        key: 'sendAmount',
        align: 'center',
        render: ( sendAmount, record ) => {
          if ( record.productType === 'RED' ) {
            return <span>{this.numberFormat( sendAmount )}</span>
          }
          return <span>{String( sendAmount ).toLocaleString()}</span>
        },
      },
      {
        title: <span>发货状态</span>,
        dataIndex: 'sendState',
        key: 'sendState',
        render: ( sendState, rowData ) => {
          const wordsToSendStatus = {
            SENDING: '待发货',
            SUCCESS: '已发货'
          }
          let state = wordsToSendStatus[sendState]
          if( rowData.productType !== 'GOODS' ) state = '--'
          return (
            <span> {state}</span>
          )
        }
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>订单来源</span>,
        dataIndex: 'channel',
        key: 'channel',
        render: channel => <span>{channel}</span>,
      },
      {
        title: <span>接收人</span>,
        dataIndex: 'receiveUser',
        key: 'receiveUser',
        render: ( receiveUser, record ) => {
          if ( record.productType === 'GOODS' ) {
            return ( <span style={{ fontSize: 12 }}>姓名：{receiveUser}<br />手机号：{record.receiveTel}<br />收货地址：{record.receiveAddress}</span> )
          }
          return <span>{receiveUser}</span>
        }
      },
      {
        title: <span>订单编号</span>,
        dataIndex: 'orderNo',
        key: 'orderNo',
        render: orderNo => <span>{orderNo}</span>,
      },
      {
        title: <span>外部订单编号</span>,
        dataIndex: 'tradeId',
        key: 'tradeId',
        render: tradeId => <span>{tradeId}</span>,
      },
      {
        title: <span>操作</span>,
        key: 'operation',
        width: 120,
        align: 'center',
        fixed: 'right',
        render: ( _, record ) => {
          const { productType, expressNo } = record
          return (
            <div className={styles.operate_container}>
              {
                productType === 'GOODS' && <span onClick={() => this.handleModalVisible( 'send', record )}>编辑</span>
              }
              {
                expressNo && <span onClick={() => this.handleQueryExpress( expressNo )}>物流查询</span>
              }
              {/* {
                expressNo && <span onClick={() => this.getLogisticsData( record )}>详情</span>
              } */}
            </div>
          )
        }
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title='消耗订单'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
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
          {/* <Button
            type="primary"
            onClick={() => this.handleModalVisible( 'multiSend' )}
          >
            批量发货
          </Button> */}
          <Table
            scroll={{ x: true }}
            size="middle"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={consumeOrderList}
            onChange={this.tableChange}
          />
        </Card>
        {this.renderSendOrAlterExpressModal( lineData )}
        {this.renderMultiSendGoodModal()}
        {
          logiVisible &&
          <LogisticsDetail
            data={currentLogiData}
            visible={logiVisible}
            editLogistics={() => this.handleModalVisible( 'send', currentLogiData )}
            changeExpressSubscribe={( id ) => this.changeExpressSubscribe( id )}
            onCancel={this.closeModal}
          />
        }
      </GridContent>
    );
  };
}

export default ConsumeOrderList;

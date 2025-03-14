
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import styles from './ResplenishRecordList.less'

@connect( ( { resplenishRecord } ) => {
  return {
    ...resplenishRecord,
  };
} )
@Form.create()
class ResplenishRecordList extends PureComponent {
  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      pageNum: 1,
      pageSize: 10,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
    };
    this.searchBar = React.createRef()
  }

  componentDidMount() {
    this.searchBar.current.handleReset()
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sortObj = { order: 'descend', ...sorter };
    if ( sortObj.columnKey === 'createTime' ) {
      sortObj.columnKey = 'create_time';
    }
    this.setState(
      {
        pageNum: current,
        pageSize,
        sortedInfo: sortObj,
      },
      () => this.getResplenishList( this.searchBar.current.data )
    );
  };

  // 获取补仓记录列表
  getResplenishList = ( data ) => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, sortedInfo } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    if ( data ) {
      const { startTime, endTime } = data
      if( startTime && endTime ) {
        // eslint-disable-next-line no-param-reassign
        data.startTime = moment( startTime ).valueOf();
        // eslint-disable-next-line no-param-reassign
        data.endTime = moment( endTime ).valueOf()
      }
    }
    const query = { ...data }
    if( !query.type ) delete query.type
    dispatch( {
      type: 'resplenishRecord/getResplenishList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        ...query,
      },
    } );
  };

  //  提交
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1,
    }, () => {
      this.getResplenishList( data );
    } );
  };

  numberFormat = str => {
    return String( Number( str ).toFixed( 2 ) ).toLocaleString();
  };

  // 获取日期默认值
  getDay = ( num ) => {
    const nowDate = moment()
    let date = nowDate
    if ( num > 0 ) date = moment( nowDate ).add( 1, "days" );
    if ( num < 0 ) date = moment( nowDate ).subtract( Math.abs( num ), "days" );
    return moment( date, 'YYYY-MM-DD' );
  }

  render() {
    const { loading, resplenishListResult: { total, list }, } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    let startTime = '';
    let endTime = '';
    if ( this.searchBar.current !== null && this.searchBar.current.data !== null ) {
      // 该接口参数传的是时间戳
      startTime = moment( this.searchBar.current.data.startTime ).valueOf();
      endTime = moment( this.searchBar.current.data.endTime ).valueOf();
    }
    const exportConfig = {
      type: 'equityCenterService',
      ajaxUrl: `product/replenishment/export`,
      xlsxName: '补仓记录明细.xlsx',
      extraData: { orderBy, startTime, endTime },
    }
    this.searchEleList = [
      {
        key: 'name',
        label: '商品名称',
        type: 'Input'
      },
      {
        key: 'type',
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
        key: 'people',
        label: '操作人',
        type: 'Input'
      },
      {
        key: 'createTime',
        label: '补仓时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' },
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

    const wordsToSort = {
      COUPON: '虚拟卡券',
      GOODS: '实物',
      RED: '现金红包',
      PHONE: '话费充值',
      WX_COUPON: '微信立减金',
      WX_VOUCHER: '微信代金券',
      RIGHT_PACKAGE: '权益包',
      CUSTOM: '自定义商品',
      TG_COUPON: '投顾卡券',
      JN_RED:'绩牛红包',
      JN_RIGHT:'绩牛权益',
    };

    const columns = [
      {
        title: <span>商品类型</span>,
        dataIndex: 'productType',
        key: 'productType',
        align: 'center',
        render: productType => <span>{wordsToSort[productType]}</span>,
      },
      {
        title: <span>商品名称</span>,
        dataIndex: 'productName',
        key: 'productName',
        align: 'center',
        render: productName => <span>{productName}</span>,
      },
      {
        title: <span>补仓数量/金额</span>,
        dataIndex: 'replenishmentCount',
        key: 'replenishmentCount',
        align: 'center',
        render: ( replenishmentCount, record ) => {
          const { productType } = record;
          if ( productType === 'RED' ) {
            return <span>{this.numberFormat( replenishmentCount )}</span>;
          }
          return <span>{replenishmentCount.toLocaleString()}</span>;
        },
      },
      {
        title: <span>操作人</span>,
        dataIndex: 'createBy',
        key: 'createBy',
        align: 'center',
        render: createBy => <span>{createBy}</span>,
      },
      {
        title: <span>补仓时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
    ];

    return (
      <GridContent>
        <Card bordered={false} title="补仓记录" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
          <div className={styles.global_styles}>
            <SearchBar
              ref={this.searchBar}
              searchEleList={this.searchEleList}
              preSearchData={this.state.preSearchData}
              searchFun={this.filterSubmit}
              exportConfig={exportConfig}
              loading={loading}
            />
          </div>
          <Table
            size="middle"
            rowKey={( r ) => r.id}
            columns={columns}
            loading={{ spinning: loading }}
            dataSource={list}
            pagination={paginationProps}
            onChange={this.tableChange}
          />
        </Card>
      </GridContent>
    );
  }
}

export default ResplenishRecordList;

/* eslint-disable import/extensions */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Breadcrumb } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import RewardInfo from './RewardInfo'
import RewardDailyConsume from './RewardDailyConsume';

const prizeTypeObj = {
  RED: '红包',
  PHONE: '话费',
  GOODS: '实物',
  COUPON: '卡券',
  INTEGRAL: '积分',
  CUSTOM: '自定义商品',
  RIGHT_PACKAGE: '权益包',
  WX_VOUCHER: '微信代金券',
  WX_COUPON: '微信立减金',
  OTHER: '其他',
  TG_COUPON: '投顾卡券',
  JN_RED:'绩牛红包',
  JN_RIGHT:'绩牛权益',
}

const prizeStateObj = {
  UNUSED: '待领取',
  USED: '已领取',
  BINDING: '已绑定待领取',
  EXPIRED: '已过期',
  CONSUMED: '已消费'
}

const sendStateObj = {
  SENDING: '发送中',
  SUCCESS: '已发送',
  FAILED: '发送失败',
}

@connect( ( { reward } ) => {
  return {
    loading: reward.loading,
    rewardRecord: reward.rewardRecord,
    merchantList: reward.merchantList,
  }
} )

class RewardRecord extends PureComponent {
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
    };
    this.searchBar = React.createRef()
    this.searchEleList = [
      {
        key: 'mobile',
        label: '手机号',
        type: 'Input'
      },
      {
        key: 'fundAccount',
        label: '资金账号',
        type: 'Input'
      },
      {
        key: 'userNo',
        label: '客户号',
        type: 'Input'
      },
      {
        key: 'prizeName',
        label: '奖品名称',
        type: 'Input'
      },
      {
        key: 'prizeType',
        label: '奖品类型',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          // { label: '红包', value: 'RED' },
          { label: '实物', value: 'GOODS' },
          { label: '卡券', value: 'COUPON' },
          // { label: '积分', value: 'INTEGRAL' },
          // { label: '话费', value: 'PHONE' },
          // { label: '其他', value: 'OTHER' },
          { label: '自定义商品', value: 'CUSTOM' },
          // { label: '微信立减金', value: 'WX_COUPON' },
          // { label: '微信代金券', value: 'WX_VOUCHER' },
          // { label: '权益包', value: 'RIGHT_PACKAGE' },
          { label:'投顾卡券', value:'TG_COUPON'  },
          { label:'绩牛红包', value:'JN_RED' },
          { label:'绩牛权益', value:'JN_RIGHT' },
        ]
      },
      {
        key: 'state',
        label: '奖品状态',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '待领取', value: 'UNUSED' },
          // { label: '已绑定待领取', value: 'BINDING' },
          { label: '已领取', value: 'USED' },
          { label: '已过期', value: 'EXPIRED' },
          // { label: '已消费', value: 'CONSUMED' },
        ]
      },
      {
        key: 'sendState',
        label: '发送状态',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '发送中', value: 'SENDING' },
          { label: '发送失败', value: 'FAILURE' },
          { label: '已发送', value: 'SUCCESS' },
        ]
      },
      {
        key: 'createTime',
        label: '中奖时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
      },
      {
        key: 'expireTime',
        label: '过期时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { expireStartDate: 'YYYY-MM-DD', expireEndDate: 'YYYY-MM-DD' }
      },
      {
        key: 'usedTime',
        label: '领奖时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { usedStartDate: 'YYYY-MM-DD', usedEndDate: 'YYYY-MM-DD' }
      }
    ]
  }


  componentDidMount() {
    this.getRewardRecord();
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getRewardRecord( data );
    } )
  }

  // 获取中奖记录
  getRewardRecord = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'reward/getRewardRecord',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        activityId,
        ...data
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
    }, () => this.getRewardRecord( this.searchBar.current.data ) );
  };

  render() {
    const { loading, rewardRecord: { total, list }, activityId, closeUserActionPage } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `activity/reward-record/search/export`,
      xlsxName: '中奖名单.xlsx',
      extraData: { activityId, orderBy, pageNum: 1, pageSize: -1, searchCount: false },
      responseType: 'POST'
    }
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
        dataIndex: 'mobile',
        key: 'mobile',
        render: mobile => <span>{mobile}</span>,
      },
      {
        title: <span>资金账号</span>,
        dataIndex: 'fundAccount',
        key: 'fundAccount',
        render: fundAccount => <span>{fundAccount || '--'}</span>,
      },
      {
        title: <span>客户号</span>,
        dataIndex: 'userNo',
        key: 'userNo',
        render: userNo => <span>{userNo || '--'}</span>,
      },
      {
        title: <span>奖品名称</span>,
        dataIndex: 'prizeName',
        key: 'prizeName',
        render: prizeName => <span>{prizeName}</span>,
      },
      {
        title: <span>奖品类型</span>,
        dataIndex: 'prizeType',
        key: 'prizeType',
        render: prizeType => <span>{prizeType ? prizeTypeObj[prizeType] : '--'}</span>,
      },
      {
        title: <span>中奖时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime ? moment( createTime ).format( 'YYYY-MM-DD HH:mm:ss' ) : '--'}</span>,
      },
      {
        title: <span>过期时间</span>,
        dataIndex: 'expireTime',
        key: 'expire_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'expire_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: expireTime => <span>{expireTime ? moment( expireTime ).format( 'YYYY-MM-DD HH:mm:ss' ) : '--'}</span>,
      },
      {
        title: <span>奖品状态</span>,
        dataIndex: 'state',
        key: 'state',
        render: state => {
          const text = prizeStateObj[state]
          return <span>{text}</span>
        }
      },
      {
        title: <span>发送状态</span>,
        dataIndex: 'sendState',
        key: 'sendState',
        render: sendState => {
          const text = sendStateObj[sendState]
          return <span>{text}</span>
        }
      },
      {
        title: <span>领奖时间</span>,
        dataIndex: 'usedTime',
        key: 'used_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'used_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: usedTime => <span>{usedTime ? moment( usedTime ).format( 'YYYY-MM-DD HH:mm:ss' ) : '--'}</span>,
      },
      {
        title: <span>收货人姓名</span>,
        dataIndex: 'address',
        key: 'nameText',
        render: address => {
          let nameText = '--'
          let addressObj = {}
          if ( address ) {
            addressObj = JSON.parse( address )
            nameText = addressObj.name ? addressObj.name : '--'
          }
          return (
            <span>{nameText}</span>
          )
        }
      },
      {
        title: <span>收货人手机号</span>,
        dataIndex: 'address',
        key: 'telephoneText',
        render: address => {
          let telephoneText = '--'
          let addressObj = {}
          if ( address ) {
            addressObj = JSON.parse( address )
            telephoneText = addressObj.telephone ? addressObj.telephone : '--'
          }
          return (
            <span>{telephoneText}</span>
          )
        }
      },
      {
        title: <span>收货地址</span>,
        dataIndex: 'address',
        key: 'addressText',
        render: address => {
          let addressText = '--'
          let addressObj = {}
          if ( address ) {
            addressObj = JSON.parse( address )
            addressText = addressObj.address ? addressObj.address : '--'
          }
          return (
            <span>{addressText}</span>
          )
        }
      },
    ];

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>奖品数据</Breadcrumb.Item>
        </Breadcrumb>
        <RewardInfo activityId={activityId} />
        <RewardDailyConsume activityId={activityId} />
        <Card
          bordered={false}
          title="中奖记录"
          headStyle={{ fontWeight: 'bold' }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={this.searchEleList}
            searchFun={this.filterSubmit}
            loading={loading}
            exportConfig={exportConfig}
          />
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
      </GridContent>
    );
  };
}

export default RewardRecord;

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Card, Table, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

const EXCHANGE_STATUS = [
  { label: '全部', value: '' },
  { label: '待领取', value: 'NORMAL' },
  { label: '已兑换', value: 'FINISH' },
  { label: '已过期', value: 'EXPIRED' },
  { label: '已退回', value: 'BACKTRACK' },
  { label: '冻结 ', value: 'LOCK' },
];

// const ORDER_VALUE = { peopleNum: "people_num"};

const RedEnvelopeData = props => {
  const {
    dispatch,
    loading,
    merchantNames,
    data: { records, total },
  } = props;

  const dataSource = records ? records.map( ( item, index ) => ( { ...item, key: index } ) ) : [];

  const searchBar = useRef( null );
  const [pageObj, setPageObj] = useState( { pageNum: 1, pageSize: 10 } );
  const[merchantCode, setMerchantCode] = useState( "" );

  const getRedEnvelopeData = () => {
    setMerchantCode( searchBar.current?.data?.merchantCode || "" );
    const merchantCodeVal = searchBar.current?.data?.merchantCode
     if( !merchantCodeVal ){
      message.error( '请选择商户' )
      return
     }
    dispatch( {
      type: 'redEnvelopeData/getRedEnvelopeData',
      payload: { ...searchBar.current.data, ...pageObj },
    } );
  };

  const filterSubmit = () => {
    setPageObj( { pageNum: 1, pageSize: 10 } )
    getRedEnvelopeData()
  }

  useEffect( ()=>{
    getRedEnvelopeData()
  }, [pageObj] );

  useEffect( () => {
    dispatch( {
      type: 'redEnvelopeData/getMerchantNames',
      payload: {},
    } );
  }, [] );

  const searchEleList = useMemo( () => {
    const merchantOption = merchantNames.map( item => ( { label: item.name, value: item.code } ) );
    return [
      {
        key: 'merchantCode',
        label: '商户名称',
        type: 'Select',
        optionList: merchantOption,
      },
      {
        key: 'description',
        label: '红包描述',
        type: 'Input',
      },
      {
        key: 'startTime',
        label: '更新时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' },
      },
      {
        key: 'status',
        label: '兑换状态',
        type: 'Select',
        optionList: EXCHANGE_STATUS,
      },
    ];
  }, [merchantNames] );

  const columns = [
    {
      title: <span>商户名称</span>,
      dataIndex: 'merchantName',
      key: 'merchantName',
      render: merchantName => <span>{merchantName}</span>,
    },
    {
      title: <span>人数</span>,
      dataIndex: 'peopleNum',
      key: 'peopleNum',
      render: peopleNum => <span>{peopleNum}</span>,
    },
    {
      title: <span>人次</span>,
      dataIndex: 'times',
      key: 'times',
      render: times => <span>{times}</span>,
    },
    {
      title: <span>总金额</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: amount => <span>{amount}</span>,
    },
    {
      title: <span>开始时间</span>,
      dataIndex: 'startTime',
      key: 'startTime',
      render: startTime => <span>{moment( startTime ).format( 'YYYY-MM-DD' ) || '-'}</span>,
    },
    {
      title: <span>结束时间</span>,
      dataIndex: 'endTime',
      key: 'endTime',
      render: endTime => <span>{moment( endTime ).format( 'YYYY-MM-DD' ) || '-'}</span>,
    },
    {
      title: <span>描述</span>,
      dataIndex: 'description',
      key: 'description',
      render: description => <span>{description}</span>,
    },
    {
      title: <span>渠道</span>,
      dataIndex: 'channel',
      key: 'channel',
      render: channel => <span>{channel}</span>,
    },
    {
      title: <span>状态</span>,
      dataIndex: 'tradeStatus',
      key: 'tradeStatus',
      render: tradeStatus => (
        <span>{EXCHANGE_STATUS.find( item => item.value === tradeStatus )?.label}</span>
      ),
    },
  ];

  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: pageObj.pageSize,
    total,
    current: pageObj.pageNum,
    showTotal: () => {
      return `共 ${total} 条`;
    },
  };

  const tableChange = pageData => {
    const { current, pageSize } = pageData;
    setPageObj( { pageNum: current, pageSize } );
  };

  const exportConfig = {
    type: 'equityCenterService',
    ajaxUrl: `vouchers/details/export`,
    xlsxName: `${merchantNames.find( item => item.code === merchantCode )?.name}-红包数据明细.xlsx`,
    extraData: { ...( searchBar.current?.data || {} ), ...pageObj },
    responseType:'POST'
  };

  const beforeExportFun = callback => {
    if ( !merchantCode ) {
      message.error( '请选择商户名称搜索后进行数据导出！' );
      return;
    }
    if ( callback ) {
      callback();
    }
  };

  return (
    <GridContent>
      <Card bordered={false} title="红包数据" bodyStyle={{ padding: '20px 32px 40px 32px' }}>
        <div>
          <SearchBar
            searchFun={filterSubmit}
            ref={searchBar}
            loading={loading}
            searchEleList={searchEleList}
            exportConfig={exportConfig}
            beforeExportFun={beforeExportFun}
          />
        </div>
        <Table
          scroll={{ x: true }}
          size="middle"
          rowKey="key"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={tableChange}
        />
      </Card>
    </GridContent>
  );
};

export default connect( ( { redEnvelopeData } ) => {
  return {
    loading: redEnvelopeData.loading,
    data: redEnvelopeData.data,
    merchantNames: redEnvelopeData.merchantNames,
  };
} )( RedEnvelopeData );

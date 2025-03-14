import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form  } from 'antd';
import moment from 'moment';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { exportXlsx } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import RedeemFilterForm from './redeemFilterForm'
import styles from '../Lists.less';

const stateObj = {
  'ENABLE': formatMessage( { id: 'strategyMall.coupons.state.ENABLE' } ),
  'LOCK': formatMessage( { id: 'strategyMall.coupons.state.LOCK' } ),
  'DISABLE': formatMessage( { id: 'strategyMall.coupons.state.DISABLE' } ),
  'USED': formatMessage( { id: 'strategyMall.coupons.state.USED' } ),
  'OUT_TIME': formatMessage( { id: 'strategyMall.coupons.state.OUT_TIME' } ),
};

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  redeemCodeList:strategyMall.redeemCodeList,
} ) )
@Form.create()

class RedeemCoode extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: { 
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
   }
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    this.props.onRef( this )
    this.fetchList()
  }

  // 获取兑换码
  fetchList = () => {
    const { pageSize, pageNum, sortedInfo={} } =this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { id, username, code, createTime } = formValue;
    const start = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD' ):'';
    const end = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD' ):'';

    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc,code' : 'asc,code';
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getRedeemCodeList',
      payload: {
        pageSize,
        pageNum,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
        groupIds: id,
        code,
        username,
        createTimeFrom:start,
        createTimeTo:end
      }
    } )
  };

  // 筛选表单提交 请求数据
  filterSubmit = () =>{
    setTimeout( () => {
      this.setState( {
        pageNum:1
      }, ()=>this.fetchList() )
    }, 100 );
  }


  // 翻页
  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, ()=>this.fetchList() );
  };

  // 导出
  handleExport = () =>{
    const { clickId } = this.props;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { id, username, code, createTime } = formValue;
    const groupIds= clickId || id;
    const createTimeFrom = ( createTime && createTime.length ) ?  moment( createTime[0] ).format( 'YYYY-MM-DD' ):'';
    const createTimeTo = ( createTime && createTime.length ) ? moment( createTime[1] ).format( 'YYYY-MM-DD' ):'';
    const obj = { groupIds, code, username, createTimeFrom, createTimeTo };

    // 筛选全部导出
    let paramsStr = '';
    for( const key in obj ){
      console.log( 'item', obj[key] )
      if( obj[key] ){
        paramsStr+=`${paramsStr?'&':'?'}${key}=${obj[key]}`
      }
    }

    const uri = paramsStr ? `coupons-code/export${paramsStr}` : `coupons-code/export`;
    const xlsxName = paramsStr ? `兑换码_${groupIds ? `批次ID：${groupIds}` : ''}${code ? `兑换码：${code}` : ''}${username ? `兑换人：${username}` : ''}${createTime ? `创建时间：${createTimeFrom}-` : '' }${createTimeTo || ''}.xlsx` : `兑换码批次订单.xlsx`;
    exportXlsx( {
      type:'strategyMallService',
      uri,
      xlsxName,
      callBack:() => {}
    } )
  }
   
  render() {
    const { loading, redeemCodeList: { total, list }, clickId } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns =[
      {
        title: <span>兑换码</span>,
        dataIndex: 'code',
        render: code => <span>{code}</span>,
      },
      {
        title: <span>批次ID</span>,
        dataIndex: 'groupId',
        render: groupId => <span>{groupId}</span>,
      },
      {
        title: <span>优惠券</span>,
        dataIndex: 'couponName',
        render: couponName => <span>{couponName}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>失效日期</span>,
        dataIndex: 'endTime',
        key:'end_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => <span>{endTime}</span>,
      },
      {
        title: <span>兑换时间</span>,
        dataIndex: 'useTime',
        key:'use_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'use_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: useTime => <span>{useTime || '--'}</span>,
      },
      {
        title: <span>使用状态</span>,
        dataIndex: 'couponState',
        render: couponState => <span>{stateObj[couponState]}</span>
      },
      {
        title: <span>兑换人</span>,
        dataIndex: 'username',
        render: username => <span>{username || '--'}</span>,
      },
    ]

    return (
      <GridContent>
        <div className={styles.standardList}>
          <RedeemFilterForm
            filterSubmit={this.filterSubmit}
            handleExport={this.handleExport}
            clickId={clickId}
            wrappedComponentRef={( ref ) => { this.filterForm = ref}}
          />
          <Table
            size="large"
            rowKey="code"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </div>
      </GridContent>
    );
  };
}

export default RedeemCoode;
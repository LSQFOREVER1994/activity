import React, { PureComponent } from 'react';
import { Form, Table  } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';


const timeObj = {
  "SECONDS": formatMessage( { id: 'strategyMall.product.time.SECONDS' } ),
  "MINUTES": formatMessage( { id: 'strategyMall.product.time.MINUTES' } ),
  "HOURS": formatMessage( { id: 'strategyMall.product.time.HOURS' } ),
  "DAY": formatMessage( { id: 'strategyMall.product.time.DAY' } ),
  "WEEK": formatMessage( { id: 'strategyMall.product.time.WEEK' } ),
  "MONTH": formatMessage( { id: 'strategyMall.product.time.MONTH' } ),
  "YEAR": formatMessage( { id: 'strategyMall.product.time.YEAR' } ),
}

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  productsParticularsList:strategyMall.productsParticularsList
} ) )
@Form.create()
class BatchFilterForm extends PureComponent {

  state={
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'exp_time',
      field: 'expTime',
      order: 'descend',
    },
  }

  componentDidMount() {
    const { pageNum, pageSize } = this.state;
    this.fetchList( { pageNum, pageSize } )
  }

  // 获取列表
  fetchList = ( { pageNum, pageSize, sortedInfo={} } ) => {
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'
    const { dispatch, batchFilterObj } = this.props;
    const { userId, permissionId } = batchFilterObj;
    dispatch( {
      type:'strategyMall/getProductsParticulars',
      payload:{
        pageNum,
        pageSize,
        userId,
        permissionId,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'exp_time desc',
      }
    } )
  }

  // 翻页
  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.fetchList( { pageNum: current, pageSize, sortedInfo: sotrObj } );
    this.setState( {
      sortedInfo: sorter,
      pageNum: current,
      pageSize,
    } );
   
  }

  render() {
    const { loading, productsParticularsList:{ list, total }, batchFilterObj } = this.props;
    const { pageSize, pageNum, sortedInfo }= this.state;
    const { username } = batchFilterObj.user;
    const { name } = batchFilterObj.permission;
    
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
    };

    const columns = [
      {
        title: <span>渠道</span>,
        dataIndex: 'channel',
        render: channel => <span>{channel || '--'}</span>,
      },
      {
        title: <span>权限时长</span>,
        dataIndex: 'unitValue',
        render: ( id, item ) => <span>{item.unitValue}{timeObj[item.unitType]}</span>,
      },
      {
        title: <span>过期时间</span>,
        dataIndex: 'expTime',
        key:'exp_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'exp_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: expTime => <span>{expTime}</span>,
      },
      {
        title:<span>创建时间</span>,
        dataIndex:'createTime',
        render:createTime => <span>{createTime}</span>
      },
    ];
 
    return(
      <div>
        <div style={{ marginBottom:'20px', fontSize:14, fontWeight:'bold', color:'#333' }}>
          <span style={{ margin:'0 70px 0 20px' }}>用户名称：{username}</span>
          <span>工具：{name}</span>
        </div>
        <Table
          size="large"
          rowKey="id"
          columns={columns}
          loading={loading}
          pagination={paginationProps}
          dataSource={list}
          onChange={this.tableChange}
        />
      </div>
    )}
}

export default BatchFilterForm;

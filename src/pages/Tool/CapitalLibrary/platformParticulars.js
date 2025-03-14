import React, { PureComponent } from 'react';
import { Form, Card, Table  } from 'antd';
import { connect } from 'dva';
import { getUrlParameter } from '@/utils/utils';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const sourceTypeObj = {
  PLATFORM:'平台',
  REDENVELOPE:"红包"
}

const tradeStatusObj = {
  PAY:'充值',
  BACKTRACK:'余额退回',
  WAITING_PROCESS:'待领取',
  LOCK:"冻结",
  FINISH:'已领取',
  EXPIRED:'已过期',
  RECYCLED:'已回收'
}
@connect( ( { tool } )=>( {
  loading: tool.loading,
  accountDetailsList:tool.accountDetailsList
} ) )
@Form.create()
class BatchFilterForm extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  constructor( props ) {
    super( props );
    const merchantId = props.location.query.merchantId || sessionStorage.getItem( 'merchantId' ) ||  '';
    const merchantName = props.location.query.name || sessionStorage.getItem( 'name' ) ||  '';

    this.state = {
      pageNum: 1,
      pageSize: 10,
      merchantId,
      merchantName,
      accountData:null,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      }
    };
  };

  componentDidMount() {
    const name = getUrlParameter( 'name', window.location.href )  ;
    if ( !name ) {
      window.location.replace( '/oldActivity/tool/capitalLibrary' );
    }
    // this.props.onRef( this )
    this.getAllAccountData();
    this.fetchList();
  }

  //  获取账户总详情
  getAllAccountData=()=>{
    const{ merchantId }=this.state;
    const{ dispatch }=this.props;
    if( merchantId ){
      dispatch( {
        type:'tool/getAllAccountData',
        payload:{
          merchantId
        },
        callFunc:( result )=>{
          this.setState( {
            accountData:result
          } )
        }
      } )
    }
  }

  //  获取资金详情列表
  fetchList = () => {
    const  { pageSize, pageNum, merchantId, sortedInfo } = this.state;
    const { dispatch } = this.props;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'tool/getAccountDetailsList',
      payload: {
        pageSize,
        pageNum,
        merchantId,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: '',
      },
    } )
  };

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


  render() {
    const { loading, accountDetailsList:{ list, total } } = this.props;
    const { pageSize, pageNum, accountData, sortedInfo, merchantName } = this.state;

    const fundsAvailable = accountData && accountData.fundsAvailable !== undefined ? accountData.fundsAvailable  : '';
    const fundsFreeze = accountData && accountData.fundsFreeze !== undefined ? accountData.fundsFreeze  : '';
    const fundsTotal = accountData && accountData.fundsTotal !== undefined ? accountData.fundsTotal  : '';
    const fundsUnOccupy = accountData && accountData.fundsUnOccupy !== undefined ? accountData.fundsUnOccupy  : '';
    const fundsUsed = accountData && accountData.fundsUsed !== undefined ? accountData.fundsUsed  : '';

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns = [
      {
        title:<span>类型</span>,
        dataIndex: 'sourceType',
        render: sourceType => <span>{sourceType ? sourceTypeObj[sourceType] : '--' }</span>,
      },
      {
        title:<span>操作类型</span>,
        dataIndex: 'tradeStatus',
        render: tradeStatus => <span>{tradeStatus ? tradeStatusObj[tradeStatus] : '--'}</span>,
      },
      {
        title: <span>金额</span>,
        dataIndex: 'amount',
        render: amount => <span>{amount}元</span>,
      },
      {
        title:<span>创建时间</span>,
        // align: 'center',
        dataIndex: 'createTime',
        key:'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime || '--'}</span>,
      },
      {
        title:<span>领取时间</span>,
        dataIndex: 'updateTime',
        // align: 'center',
        render: updateTime => <span>{updateTime || '--'}</span>,
      },
      {
        title: <span>过期时间</span>,
        dataIndex: 'expireDate',
        // align: 'center',
        render: expireDate => <span>{expireDate || '--'}</span>,
      },
      {
        title: <span>操作者</span>,
        dataIndex: 'userName',
        // align: 'center',
        render: userName => <span>{userName || '--'}</span>,
      },
      {
        title:<span>领取者</span>,
        dataIndex: 'openId',
        // align: 'center',
        render: openId => <span>{openId || '--'}</span>,
      },
      {
        title:<span>描述</span>,
        dataIndex: 'description',
        render: description => <span>{description || '--'}</span>,
      },
    ];

    return(
      <GridContent>
        <Card
          className={styles.listCard}
          title={`${merchantName}资金详情`}
          bordered={false}
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.platform_header}>
            <div><span>可用金额：</span>{fundsAvailable}元</div>
            <div><span>已用金额：</span>{fundsUsed}元</div>
            <div><span>待领取金额：</span>{fundsUnOccupy}元</div>
            <div><span>冻结金额：</span>{fundsFreeze}元</div>
            <div><span>总金额：</span>{fundsTotal}元</div>
          </div>
          <Table
            size="large"
            rowKey="orderId"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
      </GridContent>
    )}

}

export default BatchFilterForm;

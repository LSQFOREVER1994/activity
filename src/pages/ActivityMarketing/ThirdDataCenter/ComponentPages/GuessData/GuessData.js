import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Breadcrumb, Modal, Descriptions } from 'antd';
import moment from 'moment';
import UserRecord from './UserRecord.jsx';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const GuessType = {
  OPEN: '开盘',
  CLOSE: '收盘',
  ALL: '全部',
}
const settledStatusType = {
  UNFINISHED: '未结算',
  PROCESSING: '结算中',
  FINISH: '已结算',
}
const productTypeMap = {
  STOCK: '股票',
  FUNDS: '金融',
  FUTURES: '期货',
}
const resultType = {
  FALL: '看跌',
  RISE: '看涨',
  FLAT: '收平',
}
@connect( ( { guessData } ) => ( {
  ...guessData,
} ) )
class GuessData extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      isShwoModal: false,
      currentRecord: null,
      sortedInfo: {
        columnKey: 'date',
        field: 'date',
        order: 'descend',
      },
      userRecordVisible: false,
    }
  }

  componentDidMount() {
    this.getGuessPeriods();
  }

  getGuessPeriods = () => {
    const { dispatch, activityId } = this.props;
    const { pageNum, pageSize, sortedInfo } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    dispatch( {
      type: 'guessData/getGuessPeriods',
      payload: {
        query: {
          activityId,
          page:{ 
            pageNum,
            pageSize,
            orderBy: `${sortedInfo.columnKey} ${sortValue}`
          }
        },
        successFun: () => { }
      }
    } );
  }

  // 结算详情
  showModal = ( record ) => {
    this.setState( {
      isShwoModal: true,
      currentRecord: record,
    } )
  }

  handleUserRecord = ( record ) => {
    const { userRecordVisible } = this.state;
    this.setState( {
      userRecordVisible: !userRecordVisible,
      currentRecord: record,
    } )
  }

  closeUserRecord = () => {
    this.setState( {
      userRecordVisible: false,
    } )
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sortObj = { order: 'descend', ...sorter, }
    // if ( sortObj.columnKey === 'createTime' ) {
    //   sortObj.columnKey = 'date'
    // }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sortObj,
    }, () => this.getGuessPeriods() );
  };

  renderTable = () => {
    const { guessData: { list, total }, loading } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
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
    const integralColumns = [
      {
        title: <span>竞猜日期</span>,
        align: 'center',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: date => <span>{date}</span>,
      },
      {
        title: <span>竞猜标的</span>,
        align: 'center',
        dataIndex: 'productName',
        key: 'productName',
        render: productName => <span>{productName}</span>,
      },
      {
        title: <span>竞猜类型</span>,
        align: 'center',
        dataIndex: 'type',
        key: 'type',
        render: type => <span>{GuessType[type]}</span>,
      },
      {
        title: <span>正方人数</span>,
        align: 'center',
        dataIndex: 'upCount',
        key: 'upCount',
        render: upCount => <span>{upCount}</span>,
      },
      {
        title: <span>反方人数</span>,
        align: 'center',
        dataIndex: 'downCount',
        key: 'downCount',
        render: downCount => <span>{downCount}</span>,
      },
      {
        title: <span>总竞猜人数</span>,
        align: 'center',
        dataIndex: 'score',
        key: 'score',
        render: ( _, record ) => <span>{record.upCount + record.downCount}</span>,
      },
      {
        title: <span>积分池总额</span>,
        align: 'center',
        dataIndex: 'totalScore',
        key: 'totalScore',
        render: ( totalScore, record ) => <span>{totalScore + record.baseScore}</span>,
      },
      {
        title: <span>竞猜状态</span>,
        align: 'center',
        dataIndex: 'bettingStopTime',
        key: 'bettingStopTime',
        render: bettingStopTime => <span>{bettingStopTime > moment().format( "YYYY-MM-DD HH:mm:ss" ) ? '进行中' : '已结束'}</span>,
      },
      {
        title: <span>结算状态</span>,
        align: 'center',
        dataIndex: 'settledStatus',
        key: 'settledStatus',
        render: settledStatus => <span>{settledStatusType[settledStatus]}</span>,
      },
      {
        title: '操作',
        align: 'center',
        render: ( _, record ) =>
          <div>
            <a style={{ padding: "0 10px" }} onClick={() => { this.showModal( record ) }}>查看</a>
            <a style={{ padding: "0 10px" }} onClick={() => { this.handleUserRecord( record ) }}>用户竞猜记录</a>
          </div>
      }
    ];

    return (
      <Table
        size="middle"
        rowKey="id"
        loading={loading}
        columns={integralColumns}
        pagination={paginationProps}
        onChange={this.tableChange}
        dataSource={list}
      />
    )
  }

  renderModal = () => {
    const { currentRecord } = this.state;
    if ( !currentRecord ) return null
    const { productType, productCode, productName, type, upCount, downCount, price, change, result } = currentRecord;
    let color;
    let resultSign;
    if ( change >= 0 ) {
      color = 'red';
      resultSign = '+';
    } else {
      color = 'green';
      resultSign = '';
    }
    return (
      <Descriptions title="结算详情" column={1}>
        <Descriptions.Item label="竞猜标的类型">{productTypeMap[productType]}</Descriptions.Item>
        <Descriptions.Item label="竞猜标的名称">{productName}{`(${productCode})`}</Descriptions.Item>
        <Descriptions.Item label="竞猜类型">{GuessType[type]}</Descriptions.Item>
        <Descriptions.Item label="总竞猜人数">{upCount + downCount}</Descriptions.Item>
        <Descriptions.Item label="正方人数">{upCount}</Descriptions.Item>
        <Descriptions.Item label="反方人数">{downCount}</Descriptions.Item>
        <Descriptions.Item label="标的结算数据">
          {result ? <span style={{ color }}>{`${price} ${resultSign}${change}%`}</span> : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="竞猜结果">{result ? resultType[result] : '-'}</Descriptions.Item>
      </Descriptions>
    )
  }

  render() {
    const { closeUserActionPage } = this.props;
    const { currentRecord, isShwoModal, userRecordVisible } = this.state;
    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>竞猜结算表</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          title='竞猜结算表'
          headStyle={{ fontWeight: 'bold' }}
          bodyStyle={{ padding: '0 32px 40px 32px', margin: '16px' }}
        >
          {this.renderTable()}
        </Card>
        <Modal
          visible={isShwoModal}
          footer={null}
          onCancel={() => { this.setState( { isShwoModal: false } ) }}
        >
          {this.renderModal()}
        </Modal>
        <UserRecord
          record={currentRecord}
          visible={userRecordVisible}
          onClose={this.closeUserRecord}
          {...this.props}
        />
      </GridContent>
    );
  }
}

export default GuessData;

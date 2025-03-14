import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Popconfirm, message } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import styles from './RedAbnormalData.less';


@connect( ( { redAbnormal } ) => {
  return {
    loading: redAbnormal.loading,
    redAbnormalList: redAbnormal.redAbnormalList,
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
    };
    this.searchBar = React.createRef()
  }

  componentDidMount() {
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

  // 重发||解绑

  handleAction = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type:'redAbnormal/getRedAbnormalAction',
      payload:{
        id,
      },
      callFunc: ( text ) => {
        message.success( text )
        this.getListData( this.searchBar.current.data )
      }
    } )
  }


  // 获取回退订单列表数据
  getListData = ( data ) => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'redAbnormal/getRedAbnormalList',
      payload: {
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        ...data
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
    if ( sortObj.columnKey === 'updateTime' ) {
      sortObj.columnKey = 'update_Time'
    }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sortObj,
    }, () => this.getListData( this.searchBar.current.data ) );
  };


  render() {
    const { loading, redAbnormalList: { total, list } } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const searchEleList = [
      {
        key: 'username',
        label: 'openId',
        type: 'Input',
      },
      {
        key: 'account',
        label: '红包码',
        type: 'Input',
      },
      {
        key: 'reason',
        label: '异常原因',
        type: 'Input',
      },
      {
        key: 'bindAccount',
        label: '红包码对应用户名',
        type: 'Input',
      },
      {
        key: 'status',
        label: '状态',
        type: 'Select',
        optionList: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '已处理',
            value: true,
          },
          {
            label: '未处理',
            value: false,
          },
        ]
      },
      {
        key: 'createTime',
        label: '创建时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { createStartTime: 'YYYY-MM-DD 00:00:00', createEndTime: 'YYYY-MM-DD 23:59:59' },
        initialValue: [
          this.getDay( -30 ).format( 'YYYY-MM-DD 00:00:00' ),
          this.getDay( 0 ).format( 'YYYY-MM-DD 23:59:59' )
        ] // 默认时间范围近一个月
      },
      {
        key: 'updateTime',
        label: '处理时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { updateStartTime: 'YYYY-MM-DD 00:00:00', updateEndTime: 'YYYY-MM-DD 23:59:59' },
        // initialValue: [
        //   this.getDay( -30 ).format( 'YYYY-MM-DD 00:00:00' ),
        //   this.getDay( 0 ).format( 'YYYY-MM-DD 23:59:59' )
        // ]
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

    const columns = [
      {
        title: <span>openId</span>,
        dataIndex: 'username',
        key: 'username',
        render: username => <span>{username}</span>,
      },
      {
        title: <span>红包码</span>,
        dataIndex: 'account',
        key: 'account',
        render: account => <span>{account}</span>,
      },
      {
        title: <span>红包码对应用户名</span>,
        dataIndex: 'bindAccount',
        key: 'bindAccount',
        render: bindAccount => <span>{bindAccount}</span>,
      },
      {
        title: <span>渠道</span>,
        dataIndex: 'channel',
        key: 'channel',
        render: channel => <span>{channel}</span>,
      },
      {
        title: <span>异常原因</span>,
        dataIndex: 'reason',
        key: 'reason',
        render: reason => <span>{reason}</span>,
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
        title: <span>处理人</span>,
        dataIndex: 'handlers',
        key: 'handlers',
        render: handlers => <span>{handlers || '- -'}</span>,
      },
      {
        title: <span>处理时间</span>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'updateTime' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: updateTime => <span>{updateTime}</span>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'status',
        key: 'status',
        render: status => <span> {status ? '已处理' : '未处理'}</span>
      },
      {
        title: <span>操作</span>,
        key: 'operation',
        align: 'center',
        width: 100,
        fixed: 'right',
        render: ( _, record ) => (
          !record.status && (
            <Popconfirm
              placement="top"
              title={`是否${record.retry ? "重试" : "解绑"}`}
              onConfirm={() => {this.handleAction( record.id )}}
              okText="是"
              cancelText="否"
            >
              <span style={{ cursor:'pointer', color:'red' }}>{record.retry ? "重试" : "解绑"}</span>
            </Popconfirm>
          )
        )
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title='红包提现异常记录'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.global_styles}>
            <SearchBar
              ref={this.searchBar}
              searchEleList={searchEleList}
              searchFun={this.filterSubmit}
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
      </GridContent>
    );
  };
}

export default WithdrawOrder;

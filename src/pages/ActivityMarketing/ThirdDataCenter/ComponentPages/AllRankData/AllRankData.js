import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Breadcrumb, Modal, Button } from 'antd';
import moment from 'moment';
import { exportXlsx } from '@/utils/utils';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FilterForm from './FilterForm';

const integralList = [
  { label: '每月积分榜', value: 'MONTH_ACC', dateType: 'MONTH' }, // 累计积分
  { label: '每月王者榜', value: 'MONTH_ADD', dateType: 'MONTH' }, // 获得积分
  { label: '总积分榜', value: 'TOTAL_ACC', dateType: 'TOTAL' },
]

const guessList = [
  { label: '每周王者榜', value: 'WEEK_ADD', dateType: 'WEEK' },  // 获得积分
  { label: '每月王者榜', value: 'MONTH_ADD', dateType: 'MONTH' },  // 获得积分
  { label: '每周获胜榜', value: 'WEEK_WIN_TIME', dateType: 'WEEK' }, // 竞猜次数/获胜次数
  { label: '每月获胜榜', value: 'MONTH_WIN_TIME', dateType: 'MONTH' }, // 竞猜次数/获胜次数
  { label: '每周胜率榜', value: 'WEEK_WIN_RATE', dateType: 'WEEK' }, // 竞猜胜率/竞猜次数
  { label: '每月胜率榜', value: 'MONTH_WIN_RATE', dateType: 'MONTH' }, // 竞猜胜率/竞猜次数
  { label: '每月积分榜', value: 'MONTH_ACC', dateType: 'MONTH' }, // 累计积分
]

@connect( ( { allRankData } ) => ( {
  ...allRankData,
} ) )
class AllRankData extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      paginationInfo: {
        pageNum: 1,
        pageSize: 10
      },
      isShwoModal: false,
      username: '',
      modalSortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      isExPLoading: false,
      dateType: 'MONTH',
      optionList: integralList,
      columnItem: integralList[0],
    }
  }

  componentDidMount() {
    this.getAllRankData()
  }

  changeTableType = ( value ) => {
    const { optionList } = this.state;
    const columnItem = optionList.find( ( i ) => {
      let tableItem;
      if ( i.value === value ) {
        tableItem = i
      }
      return tableItem
    } )
    this.setState( {
      columnItem,
    } )
  }

  getAllRankData = () => {
    const { dispatch, activityId } = this.props;
    const { pageNum, pageSize, dateType } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { rankType, rankCategoryType, createTime } = formValue;
    let startDate; let endDate;
    if ( dateType === 'MONTH' ) {
      startDate = moment( createTime ).startOf( 'month' ).format( 'YYYY-MM-DD' );
      endDate = moment( createTime ).endOf( 'month' ).format( 'YYYY-MM-DD' );
    } else if ( dateType === 'WEEK' ) {
      startDate = moment( createTime ).startOf( 'week' ).format( 'YYYY-MM-DD' );
      endDate = moment( createTime ).endOf( 'week' ).format( 'YYYY-MM-DD' );
    } else {
      startDate = '';
      endDate = '';
    }
    dispatch( {
      type: 'allRankData/getAllRankData',
      payload: {
        query: {
          activityId,
          rankType,
          rankCategoryType,
          page: { pageNum, pageSize },
          startDate,
          endDate,
        },
        successFun: () => {
          this.changeTableType( rankCategoryType )
        }
      }
    } );
  }

  exportRankRecord = () => {
    const { activityId } = this.props;
    const { dateType } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { rankType, rankCategoryType, createTime } = formValue;
    let startDate; let endDate;
    if ( dateType === 'MONTH' ) {
      startDate = moment( createTime ).startOf( 'month' ).format( 'YYYY-MM-DD' );
      endDate = moment( createTime ).endOf( 'month' ).format( 'YYYY-MM-DD' );
    } else if ( dateType === 'WEEK' ) {
      startDate = moment( createTime ).startOf( 'week' ).format( 'YYYY-MM-DD' );
      endDate = moment( createTime ).endOf( 'week' ).format( 'YYYY-MM-DD' );
    } else {
      // 总积分榜
      startDate = '';
      endDate = '';
    }
    const obj = {
      activityId,
      rankType,
      rankCategoryType,
      startDate,
      endDate,
    }

    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys( obj ).forEach( key => {
      if ( obj[key] || typeof obj[key] === 'boolean' ) {
        return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
      }
    } )

    let ajaxUrl = `element/rank/export`
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      ajaxUrl = `element/rank/export?${paramStr}`
    }

    this.setState( {
      isExPLoading: true
    }, () => {
      exportXlsx( {
        type: 'activityService',
        uri: ajaxUrl,
        responseType: 'POST',
        xlsxName: `排行榜数据.xlsx`,
        callBack: () => {
          this.setState( {
            isExPLoading: false
          } )
        }
      } )
    } )
  }

  // 导出用户积分明细
  exportUserRecord = () => {
    const { activityId } = this.props
    const { userId, modalSortedInfo, username } = this.state
    const obj = {
      userId,
      activityId,
      orderBy: `${modalSortedInfo.columnKey} ${modalSortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    }

    // 拼接参数
    const paramsArray = [];
    /* eslint-disable consistent-return */
    Object.keys( obj ).forEach( key => {
      if ( obj[key] || typeof obj[key] === 'boolean' ) {
        return paramsArray.push( `${key}=${encodeURIComponent( obj[key] )}` );
      }
    } )

    let ajaxUrl = `integral/user/record/export`
    if ( paramsArray && paramsArray.length > 0 ) {
      const paramStr = paramsArray.join( '&' )
      ajaxUrl = `integral/user/record/export?${paramStr}`
    }

    this.setState( {
      isExPLoading: true
    }, () => {
      exportXlsx( {
        type: 'activityService',
        uri: ajaxUrl,
        // responseType:'POST',
        xlsxName: `用户积分流水明细-${username}.xlsx`,
        callBack: () => {
          this.setState( {
            isExPLoading: false
          } )
        }
      } )
    } )
  }

  // 展示用户具体积分明细
  showModal = ( record ) => {
    const { userId, username } = record;
    const { paginationInfo } = this.state;
    paginationInfo.pageNum = 1
    this.setState( {
      paginationInfo,
      isShwoModal: true,
      username,
      userId,
    }, () => {
      this.getUserIntergralRecord();
    } )
  }

  // 获取用户具体积分明细
  getUserIntergralRecord = () => {
    const { dispatch, activityId } = this.props
    const { userId, modalSortedInfo, paginationInfo } = this.state
    const sortValue = modalSortedInfo?.order === 'descend' ? 'desc' : 'asc'
    dispatch( {
      type: 'allRankData/getUserIntergralRecord',
      payload: {
        activityId,
        userId,
        pageNum: paginationInfo.pageNum,
        pageSize: paginationInfo.pageSize,
        orderBy: `${modalSortedInfo.columnKey} ${sortValue}`
      },
    } );
  }

  modalTableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order: 'descend', ...sorter, }
    const { current, pageSize } = pagination;
    const { paginationInfo } = this.state
    paginationInfo.pageNum = current;
    paginationInfo.pageSize = pageSize
    this.setState( {
      paginationInfo,
      modalSortedInfo: sotrObj,
    }, () => this.getUserIntergralRecord() );
  };

  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, () => this.getAllRankData() );
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( dateType, list ) => {
    this.setState( {
      pageNum: 1,
      dateType,
      optionList: list
    }, () => {
      this.getAllRankData();
    } )
  }

  // 表格渲染
  renderRankTable = () => {
    const { allRankData: { total, list }, loading } = this.props;
    const { pageSize, pageNum, columnItem } = this.state;
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
        title: <span>排名</span>,
        dataIndex: 'rank',
        align: 'center',
        key: 'rank',
        render: rank => <span>{rank}</span>,
      },
      {
        title: <span>用户id</span>,
        dataIndex: 'userId',
        align: 'center',
        key: 'userId',
        render: userId => <span>{userId}</span>,
      },
      {
        title: <span>用户名</span>,
        dataIndex: 'username',
        align: 'center',
        key: 'username',
        render: username => <span>{username}</span>,
      },
      {
        title: <span>用户昵称</span>,
        dataIndex: 'user',
        align: 'center',
        key: 'user',
        render: user => <span>{user && user.nick || '-'}</span>,
      },
      // 表单差别部分开始
      columnItem.value === 'MONTH_ACC' && {
        title: <span>本月累计积分</span>,
        dataIndex: 'score',
        align: 'center',
        key: 'score',

        render: score => <span>{score || 0}</span>,
      },
      columnItem.value === 'MONTH_ADD' && {
        title: <span>本月获得积分</span>,
        dataIndex: 'score',
        align: 'center',
        key: 'score',
        render: score => <span>{score || 0}</span>,
      },
      columnItem.value === 'WEEK_ADD' && {
        title: <span>本周获得积分</span>,
        dataIndex: 'score',
        align: 'center',
        key: 'score',
        render: score => <span>{score || 0}</span>,
      },
      (
        columnItem.value === 'MONTH_WIN_RATE' ||
        columnItem.value === 'WEEK_WIN_RATE'
      ) &&
      {
        title: <span>胜率</span>,
        dataIndex: 'winRate',
        align: 'center',
        key: 'winRate',
        render: winRate => <span>{`${( winRate * 100 ).toFixed( 2 )} %`}</span>,
      },
      (
        columnItem.value === 'WEEK_WIN_TIME' ||
        columnItem.value === 'MONTH_WIN_TIME' ||
        columnItem.value === 'MONTH_WIN_RATE' ||
        columnItem.value === 'WEEK_WIN_RATE'
      ) &&
      {
        title: <span>竞猜次数</span>,
        dataIndex: 'betCount',
        align: 'center',
        key: 'betCount',
        render: betCount => <span>{betCount || 0}</span>,
      },
      (
        columnItem.value === 'WEEK_WIN_TIME' ||
        columnItem.value === 'MONTH_WIN_TIME'
      ) &&
      {
        title: <span>获胜次数</span>,
        dataIndex: 'winTime',
        align: 'center',
        key: 'winTime',
        render: winTime => <span>{winTime || 0}</span>,
      },
      // 表单差别部分结束
      {
        title: '操作',
        align: 'center',
        render: ( _, record ) => <a href="#" onClick={() => { this.showModal( record ) }}>详情</a>
      }
    ].filter( Boolean );
    return (
      <Table
        size="middle"
        rowKey="userId"
        loading={loading}
        columns={integralColumns}
        pagination={paginationProps}
        dataSource={list}
        onChange={this.tableChange}
      />
    )
  }

  render() {
    const { closeUserActionPage, loading, userInterGralList } = this.props;
    const { isShwoModal, username, paginationInfo, modalSortedInfo, isExPLoading } = this.state;
    const modalPaginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: paginationInfo.pageSize,
      total: userInterGralList.total,
      current: paginationInfo.pageNum,
      showTotal: () => {
        return `共 ${userInterGralList.total} 条`;
      }
    };
    const modalColumns = [
      {
        title: <span>事件</span>,
        align: 'center',
        dataIndex: 'source',
      },
      {
        title: <span>积分变动</span>,
        align: 'center',
        dataIndex: 'score',
      },
      {
        title: <span>当前积分</span>,
        align: 'center',
        dataIndex: 'currentScore',
      },
      {
        title: <span>时间</span>,
        align: 'center',
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: modalSortedInfo.columnKey === 'create_time' && modalSortedInfo.order,
        sortDirections: ['descend', 'ascend'],
      },
    ]
    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>排行榜数据</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          title='详细信息'
          headStyle={{ fontWeight: 'bold' }}
          bodyStyle={{ padding: '0 32px 40px 32px', margin: '16px' }}
        >
          <FilterForm
            filterSubmit={this.filterSubmit}
            wrappedComponentRef={( ref ) => { this.filterForm = ref }}
            dateType={this.state.dateType}
            integralList={integralList}
            guessList={guessList}
            exportRankRecord={this.exportRankRecord}
            isExPLoading={isExPLoading}
          />
          <div>
            {this.renderRankTable()}
          </div>
        </Card>
        <Modal
          visible={isShwoModal}
          width="50%"
          footer={null}
          onCancel={() => { this.setState( { isShwoModal: false, userId: '' } ) }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginTop: '30px' }}>
            <span>用户名: {username}</span>
            <Button onClick={this.exportUserRecord} type='primary' loading={isExPLoading}>导出列表</Button>
          </div>
          <Table
            size="small"
            rowKey="id"
            columns={modalColumns}
            loading={loading}
            pagination={modalPaginationProps}
            dataSource={userInterGralList?.list}
            onChange={this.modalTableChange}
          />
        </Modal>
      </GridContent>
    );
  }
}

export default AllRankData;


import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

@connect( ( { topicPK } ) => {
  return {
    loading: topicPK.loading,
    topicPKDetail: topicPK.topicPKDetail,
  }
} )

class TopicPKDetail extends PureComponent {
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
        key: 'username',
        label: '用户名',
        type: 'Input'
      },
      {
        key: 'isPositive',
        label: '选择内容',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '正方', value: true },
          { label: '反方', value: false },
        ]
      }
    ]
  }


  componentDidMount() {
    this.getTopicPKDetail();
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getTopicPKDetail( data );
    } )
  }

  // 获取中奖记录
  getTopicPKDetail = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, topicDetail } = this.props;
    dispatch( {
      type: 'topicPK/getTopicPKDetail',
      payload: {
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        elementId: topicDetail.id,
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
    }, () => this.getTopicPKDetail( this.searchBar.current.data ) );
  };


  render() {
    const { loading, topicPKDetail: { list, total, pageSize, pageNum }, topicDetail } = this.props;
    const { sortedInfo } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `element/pk-topic/detail/export`,
      xlsxName: '话题PK详情.xlsx',
      extraData: { elementId: topicDetail?.id, orderBy },
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
        title: <span>用户</span>,
        dataIndex: 'userId',
        key: 'userId',
        render: ( userId, item ) => <span>{( item?.user?.username ) || '--'}</span>,
      },
      {
        title: <span>选择内容</span>,
        dataIndex: 'isPositive',
        key: 'isPositive',
        render: isPositive => <span>{isPositive ? topicDetail.positive : topicDetail.negative}</span>,
      },
      {
        title: <span>选择时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          // title='话题PK查询'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={this.searchEleList}
            searchFun={this.filterSubmit}
            loading={loading}
            exportConfig={exportConfig}
          />
          <Table
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

export default TopicPKDetail;

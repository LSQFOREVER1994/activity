import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Button, Breadcrumb } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import TopicPKDetail from './TopicPKDetail';
import SearchBar from '@/components/SearchBar';

@connect( ( { topicPK } ) => {
  return {
    loading: topicPK.loading,
    topicPKList: topicPK.topicPKList,
  }
} )

class TopicPKList extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      visibleTopicPKDetail: false,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
    };
    this.searchBar = React.createRef()
    this.searchEleList = [
      {
        key: 'topic',
        label: '话题名称',
        type: 'Input'
      },
      {
        key: 'isFinish',
        label: '话题状态',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '进行中', value: false },
          { label: '已结束', value: true },
        ]
      }
    ]
  }

  componentDidMount() {
    this.getTopicPKList();
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getTopicPKList( data );
    } )
  }

  // 获取中奖记录
  getTopicPKList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'topicPK/getTopicPKList',
      payload: {
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
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
    }, () => this.getTopicPKList( this.searchBar.current.data ) );
  };

  goShowDetailModal = ( e, item ) => {
    this.setState( {
      visibleTopicPKDetail: true,
      topicDetail: item
    } )
  }

  onCloseModal = () => {
    this.setState( {
      visibleTopicPKDetail: false,
      topicDetail: {}
    } )
  }

  render() {
    const { loading, topicPKList: { list, total, pageSize, pageNum }, closeUserActionPage, activityId } = this.props;
    const { sortedInfo, visibleTopicPKDetail, topicDetail } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `element/pk-topic/list/export`,
      xlsxName: '话题PK列表.xlsx',
      extraData: { activityId, orderBy },
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
        title: <span>话题名称</span>,
        dataIndex: 'topic',
        key: 'topic',
        width: 300,
        render: topic => <span>{topic}</span>,
      },
      {
        title: <span>参与人数</span>,
        dataIndex: 'total',
        key: 'total',
        render: ( _, item ) => <span>{item.positiveCount + item.negativeCount}</span>,
      },
      {
        title: <span>正方</span>,
        dataIndex: 'positive',
        key: 'positive',
        render: ( positive, item ) => <span>{positive}({( ( ( item.positiveCount / ( item.positiveCount + item.negativeCount ) ) || 0 ) * 100 ).toFixed( 2 )}%)</span>
      },
      {
        title: <span>反方</span>,
        dataIndex: 'negative',
        key: 'negative',
        render: ( negative, item ) => <span>{negative}({( ( ( item.negativeCount / ( item.positiveCount + item.negativeCount ) ) || 0 ) * 100 ).toFixed( 2 )}%)</span>,
      },
      {
        title: <span>话题状态</span>,
        dataIndex: 'isFinish',
        key: 'isFinish',
        render: isFinish => <span>{isFinish ? '已结束' : '进行中'}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        key: 'end_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'end_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => <span>{endTime}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.goShowDetailModal( e, item )}
            >详情
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>话题PK列表</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          title='详细信息'
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
            size="middle"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        <Modal
          title={`参与详情-${!!topicDetail && topicDetail.topic}`}
          width={700}
          visible={visibleTopicPKDetail}
          onCancel={this.onCloseModal}
          destroyOnClose
          footer={
            <Button type='primary' onClick={this.onCloseModal}>关闭</Button>
          }
        >
          <TopicPKDetail topicDetail={topicDetail} />
        </Modal>
      </GridContent>
    );
  };
}

export default TopicPKList;

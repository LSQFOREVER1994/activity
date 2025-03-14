
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Breadcrumb } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FilterForm from './FilterForm';
import DetailTable from './DetailTable';

@connect( ( { integralRank } ) => {
  return {
    loading: integralRank.loading,
    IntegralRankMap: integralRank.IntegralRankMap,
  }
} )

class IntegralRank extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
    detailInfo: {},
    visibleTableModal: false
  };

  componentDidMount() {
    this.getIntegralRank();
  };

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getIntegralRank();
    } )
  }

  // 获取活动列表
  getIntegralRank = ( num ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { username } = formValue;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, id } = this.props;
    dispatch( {
      type: 'integralRank/getIntegralRank',
      payload: {
        pageNum: num || pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        username,
        activityId: id,
      },
    } );
  }


  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const sotrObj = { order: 'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getIntegralRank() );
  };

  showDetailTable = ( e, item ) => {
    // 渲染详情表格
    this.setState( {
      visibleTableModal: true,
      detailInfo: item,
    } )
  }

  onCancelModal = () => {
    // 渲染详情表格
    this.setState( {
      visibleTableModal: false,
      detailInfo: {},
    } )
  }

  render() {
    const { loading, IntegralRankMap: { total, list }, id, closeUserActionPage } = this.props;
    const { pageSize, pageNum, sortedInfo, detailInfo, visibleTableModal } = this.state;
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
        title: <span>排名</span>,
        dataIndex: 'rank',
        key: 'rank',
        render: ( rank, item, index ) => <span>{index + 1 + ( ( pageNum - 1 ) * 10 )}</span>,
      },
      {
        title: <span>奖品名称</span>,
        dataIndex: 'prizeName',
        key: 'prizeName',
        render: prizeName => {
          return <span>{prizeName || '--'}</span>
        }
      },
      {
        title: <span>用户名</span>,
        dataIndex: 'username',
        key: 'username',
        render: username => {
          return <span>{username}</span>
        }
      },
      {
        title: <span>昵称</span>,
        dataIndex: 'nick',
        key: 'nick',
        render: nick => {
          return <span>{nick}</span>
        }
      },
      {
        title: <span>积分</span>,
        dataIndex: 'historyScore',
        key: 'historyScore',
        render: historyScore => <span>{historyScore}</span>,
      },
      {
        title: <span>操作</span>,
        dataIndex: 'id',
        key: 'id',
        render: ( id, item ) =>
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.showDetailTable( e, item )}
            >详情
            </span>
          </div>,
      },
    ];

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>积分排行榜</Breadcrumb.Item>
        </Breadcrumb>
        <Card
          bordered={false}
          title="积分排行榜"
          headStyle={{ fontWeight:'bold' }}
        >
          <FilterForm
            filterSubmit={this.filterSubmit}
            wrappedComponentRef={( ref ) => { this.filterForm = ref }}
          />
          <Table
            scroll={{ x: 1000 }}
            size="middle"
            rowKey="userId"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
          <Modal
            visible={visibleTableModal}
            width='60%'
            footer={null}
            onCancel={this.onCancelModal}
            destroyOnClose
          >
            <DetailTable detailInfo={detailInfo} id={id} />
          </Modal>
        </Card>
      </GridContent>
    );
  };
}

export default IntegralRank;

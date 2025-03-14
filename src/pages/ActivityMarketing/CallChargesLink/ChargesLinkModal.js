import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Button } from 'antd';
import serviceObj from '@/services/serviceObj';

const tradeStatusList = {
  WAITING_PROCESS: '未使用',
  FINISH: '已使用',
  EXPIRED: '已过期',
};

@connect()
class ChargesLinkModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      isExPLoading: false,
      paginationInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  componentDidMount() {
    this.getChargesLinkDetail();
  }

  // static getDerivedStateFromProps( nextProps, prevState ) {
  //   const { visible } = nextProps
  //   if( visible !== prevState.visible ) {
  //     return {
  //       visible
  //     }
  //   }
  //   return null
  // }

  // componentDidUpdate( prevProps, prevState ) {
  //   if( prevState.visible !== this.state.visible && this.state.visible ) {
  //     this.getChargesLinkDetail()
  //   };
  //   return null;
  // }

  // 获取充值码详情数据
  getChargesLinkDetail = () => {
    const {
      paginationInfo: { pageNum, pageSize },
    } = this.state;
    const { dispatch, chargePrizeId } = this.props;
    dispatch({
      type: 'callChargesLinkModel/getChargesLinkDetail',
      payload: {
        query: {
          pageNum,
          pageSize,
          chargePrizeId,
        },
        successFun: res => {
          this.setState({
            list: res.list,
            paginationInfo: {
              pageNum: res.pageNum,
              pageSize: res.pageSize,
              total: res.total,
            },
          });
        },
      },
    });
  };

  tableChange = pagination => {
    const { current, pageSize } = pagination;
    this.setState(
      {
        paginationInfo: { ...this.state.paginationInfo, pageNum: current, pageSize },
      },
      () => this.getChargesLinkDetail()
    );
  };

  render() {
    const { onCancel, visible, exportRecord, chargePrizeId } = this.props;
    const {
      paginationInfo: { pageNum, pageSize, total },
      list,
      isExPLoading,
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      },
    };
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (text, record, index) => <span>{(pageNum - 1) * pageSize + (index + 1)}</span>,
        // 当前页数减1乘以每一页页数再加当前页序号+1
      },
      {
        title: '流水号',
        dataIndex: 'tradeId',
        render: tradeId => <span>{tradeId}</span>,
      },
      {
        title: '充值金额',
        dataIndex: 'chargePrice',
        render: chargePrice => <span>{`¥${chargePrice}元`}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: '过期时间',
        dataIndex: 'expireTime',
        render: expireTime => <span>{expireTime}</span>,
      },
      {
        title: '链接地址',
        dataIndex: 'chargeUrl',
        render: chargeUrl => <div>{chargeUrl}</div>,
      },
      {
        title: '充值号码',
        dataIndex: 'chargeAccount',
        render: chargeAccount => <span>{chargeAccount || '----'}</span>,
      },
      {
        title: '充值时间',
        dataIndex: 'useTime',
        render: useTime => <span>{useTime || '----'}</span>,
      },
      {
        title: '使用状态',
        dataIndex: 'tradeStatus',
        render: tradeStatus => <span>{tradeStatusList[tradeStatus]}</span>,
      },
    ];

    return (
      <Modal title="话费充值链接" width="80%" visible={visible} onCancel={onCancel} onOk={onCancel}>
        <Button
          type="primary"
          style={{ position: 'absolute', top: '10px', right: '60px' }}
          key="back"
          onClick={() => {
            exportRecord(chargePrizeId);
          }}
          loading={isExPLoading}
        >
          导出
        </Button>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.tableChange}
        />
      </Modal>
    );
  }
}

export default ChargesLinkModal;

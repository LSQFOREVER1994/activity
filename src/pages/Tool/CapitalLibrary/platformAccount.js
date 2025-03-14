import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, Select, Tooltip, Icon, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const { Option } = Select;
const FormItem = Form.Item;

const modalObj = {
  // dataModal:{ name:'添加' },
  payModal: { name: '充值' },
  lockModal: { name: '锁定资金' },
  unLockModal: { name: '解锁资金' },
  balanceModal: { name: '余额退回' }
}

@connect(({ tool }) => ({
  loading: tool.loading,
  platformyListAll: tool.platformyListAll,
  accountList: tool.accountList
}))
@Form.create()

class PlatformAccount extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    modalType: 'dataModal',
    // TabPaneKey:false,
    platformId: '',
    visibleLock: false
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  formLayout1 = {
    labelCol: { span: 11 },
    wrapperCol: { span: 10 },
  };

  componentDidMount() {
    this.getPlatformNameList()
    this.fetchList();
  };


  //  获取券商名称列表
  getPlatformNameList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tool/getPlatformListAll',
      payload: {
        pageNum: 1,
        pageSize: 100,
      }
    })
  }

  //  获取平台账户列表
  fetchList = (page) => {
    const { pageSize, pageNum, platformId } = this.state;
    const { dispatch } = this.props;
    if (page) this.setState({ pageNum: page })
    dispatch({
      type: 'tool/getAccountList',
      payload: {
        pageSize,
        pageNum: page || pageNum,
        merchantId: platformId
      }
    })
  };

  // 翻页
  tableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.setState({
      pageNum: current,
      pageSize,
      // sortedInfo: sorter,
    }, () => this.fetchList());
  };

  // 阻止事件冒泡
  stop = (e) => {
    e.stopPropagation();
  }

  //  显示添加 Modal
  showAddModal = (e) => {
    this.stop(e);
    this.setState({
      modalType: 'dataModal',
      visible: true,
      current: undefined
    });
  };

  // //  显示编辑 Modal
  // showEditModal = ( e, item ) => {
  //   this.stop( e );
  //   this.setState( {
  //     modalType:'dataModal',
  //     visible: true,
  //     current: item
  //   } );
  // };

  //  显示充值 Modal
  showPayModal = (e, item) => {
    this.stop(e);
    this.setState({
      modalType: 'payModal',
      visible: true,
      current: item
    })
  }

  //  显示锁定模板
  lockModal = (e, item) => {
    this.stop(e);
    this.setState({
      modalType: 'lockModal',
      visibleLock: true,
      current: item,
    })
  }

  //  显示解锁模板
  unLockModal = (e, item) => {
    this.stop(e);
    this.setState({
      modalType: 'unLockModal',
      visibleLock: true,
      current: item,
    })
  }

  //  显示余额退回模板
  balanceModal = (e, item) => {
    this.stop(e);
    this.setState({
      modalType: 'balanceModal',
      visible: true,
      current: item,
    })
  }


  //  筛选
  onSelect = (val) => {
    this.setState({
      platformId: val
    })
  }

  // 清空
  emptySelect = () => {
    this.setState({
      platformId: ''
    }, () => this.fetchList(1))
  }

  //  取消
  handleCancel = () => {
    this.setState({
      visible: false,
      current: undefined,
    });
  };

  //  锁定模板关闭
  lockCancel = () => {
    this.setState({
      visibleLock: false,
      current: undefined,
    });
  }

  //  提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      modalType, current
    } = this.state;
    const merchantId = current ? current.merchantId : '';
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (modalType === 'balanceModal') {
        const { fundsAvailable } = current;
        const { amount } = fieldsValue;
        if (fundsAvailable < amount) {
          message.error('退回金额不可超过可用金额')
          return
        }
      }
      const params = merchantId ? Object.assign(fieldsValue, { merchantId }) : fieldsValue;
      dispatch({
        type: 'tool/accountModal',
        payload: {
          type: modalType,
          params,
        },
        callFunc: () => {
          this.fetchList();
          this.setState({
            visible: false,
            modalType: 'dataModal'
          })
        }
      })

    });
  };

  // 锁定或解开资金提交
  lockSubmit = (e) => {
    e.stopPropagation();
    const { current: { merchantId }, modalType } = this.state;
    const { dispatch } = this.props;
    const params = modalType === 'lockModal' ? Object.assign({ merchantId }, { accountState: 'DISABLE' }) : Object.assign({ merchantId }, { accountState: 'ENABLE' })
    dispatch({
      type: 'tool/accountModal',
      payload: {
        type: modalType,
        params,
      },
      callFunc: () => {
        this.fetchList();
        this.setState({
          visibleLock: false,
          modalType: 'dataModal'
        })
      }
    })
  }



  goDetailed = (record) => {
    const { merchantId, name } = record
    if (merchantId && name) {
      sessionStorage.setItem('merchantId', merchantId)
      sessionStorage.setItem('name', name)
      this.props.history.push(`/rightsManagement/treasury/platformParticulars?name=${name}&merchantId=${merchantId}`)
    }
  }


  render() {
    const { loading, form: { getFieldDecorator }, platformyListAll, accountList: { list, total } } = this.props;
    const { pageSize, pageNum, visible, current = {}, modalType, visibleLock, platformId } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };


    const modalFooter = {
      okText: formatMessage({ id: 'form.save' }),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>平台名称</span>,
        dataIndex: 'name',
        render: (name, item) => <span style={{ color: item.accountState === 'DISABLE' && '#d9d9d9' }}>{name}</span>,
      },
      {
        title: <span>可用金额<TitleIcon type='fundsAvailable' /></span>,
        dataIndex: 'fundsAvailable',
        render: (fundsAvailable, item) => <span style={{ color: item.accountState === 'DISABLE' && '#d9d9d9' }}>{fundsAvailable}元</span>,
      },
      {
        title: <span>已用金额<TitleIcon type='fundsUsed' /></span>,
        dataIndex: 'fundsUsed',
        render: (fundsUsed, item) => <span style={{ color: item.accountState === 'DISABLE' && '#d9d9d9' }}>{fundsUsed}元</span>,
      },
      {
        title: <span>待领取金额<TitleIcon type='fundsUnOccupy' /></span>,
        dataIndex: 'fundsUnOccupy',
        render: (fundsUnOccupy, item) => <span style={{ color: item.accountState === 'DISABLE' && '#d9d9d9' }}>{fundsUnOccupy}元</span>,
      },
      {
        title: <span>冻结金额<TitleIcon type='fundsFreeze' /></span>,
        dataIndex: 'fundsFreeze',
        render: (fundsFreeze, item) => <span style={{ color: item.accountState === 'DISABLE' && '#d9d9d9' }}>{fundsFreeze}元</span>,
      },
      {
        title: <span>总金额<TitleIcon type='fundsTotal' /></span>,
        dataIndex: 'fundsTotal',
        render: (fundsTotal, item) => <span style={{ color: item.accountState === 'DISABLE' && '#d9d9d9' }}>{fundsTotal}元</span>,
      },
      {
        title: formatMessage({ id: 'form.action' }),
        render: (id, item) => {
          if (item.accountState === 'DISABLE') {
            return (
              <span
                style={{ marginRight: 15, cursor: 'pointer', color: '#d1212b' }}
                onClick={(e) => this.unLockModal(e, item)}
              >解锁
              </span>
            )
          }
          return (
            <div>
              <span
                style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
                onClick={(e) => this.showPayModal(e, item)}
              >充值
              </span>
              <span
                style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
                onClick={(e) => this.lockModal(e, item)}
              >锁定
              </span>
              <span
                style={{ cursor: 'pointer', color: '#f4121e' }}
                onClick={(e) => this.balanceModal(e, item)}
              >退回
              </span>
            </div>
          )
        }

      },
    ];

    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            title="资金库"
            bordered={false}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div style={{ margin: '20px 0 40px 20px' }}>
              <span>平台名称：</span>
              <Select
                // defaultValue=""
                style={{ width: 180 }}
                onSelect={this.onSelect}
                value={platformId}
              >
                <Option key="" value="">全部</Option>
                {
                  (platformyListAll && platformyListAll.list.length > 0) &&
                  platformyListAll.list.map(item => (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  ))
                }
              </Select>
              <div style={{ float: 'right' }}>
                <Button type="primary" style={{ marginRight: '20px' }} onClick={() => this.fetchList(1)}>搜索</Button>
                <Button type="primary" onClick={this.emptySelect}>清空</Button>
              </div>
            </div>
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 15 }}
              icon="plus"
              onClick={(e) => this.showAddModal(e)}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              新建
            </Button>

            <Table
              size="large"
              rowKey="merchantId"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
              onRow={(record) => {
                if (record.accountState === 'DISABLE') return false
                return {
                  // 点击行
                  onClick: event => {
                    event.stopPropagation()
                    this.goDetailed(record)
                  },
                };
              }}
            />
          </Card>
        </div>
        <Modal
          maskClosable={false}
          title={modalType === 'dataModal' ? `${current.merchantId ? '编辑' : '添加'}` : modalObj[modalType].name}
          className={styles.standardListForm}
          width={700}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            {
              modalType === 'dataModal' &&
              <FormItem label='平台名称' {...this.formLayout}>
                {getFieldDecorator('merchantId', {
                  rules: [{ required: true, message: '请选择平台名称' }],
                  initialValue: current.merchantId,
                })(
                  <Select>
                    {
                      (platformyListAll && platformyListAll.list.length > 0) &&
                      platformyListAll.list.map(item => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            }
            {
              modalType === 'payModal' &&
              <div style={{ paddingBottom: '20px' }}>
                <FormItem label='充值金额' {...this.formLayout}>
                  {getFieldDecorator('amount', {
                    rules: [
                      { required: true, message: `${formatMessage({ id: 'form.input' })}充值金额` },
                      { pattern: new RegExp(/^(\d+|\d+\.\d{1,2})$/), message: '最多有两位小数' }
                    ],
                    // initialValue: current.amount,
                  })(<Input placeholder="单位精确到小数点后2位" type="number" addonAfter='元' />)}
                </FormItem>
                <div style={{ marginLeft: '20%', marginTop: '-5px', textAlign: 'left', fontSize: 13 }}>
                  <p style={{ marginBottom: '2px' }}>提示：</p>
                  <p style={{ margin: '2px' }}>将资金分配到该券商账户中</p>
                </div>
              </div>
            }

            {
              modalType === 'balanceModal' &&
              <div style={{ paddingBottom: '20px' }}>
                <FormItem label='退回金额' {...this.formLayout}>
                  {getFieldDecorator('amount', {
                    rules: [
                      { required: true, message: `${formatMessage({ id: 'form.input' })}退回金额` },
                      // { pattern:new RegExp( /^(\d+|\d+\.\d{1,2})$/ ), message:'最多有两位小数' }
                    ],
                    // initialValue: current.amount,
                  })(<Input placeholder="不得超过“可用金额”" type="number" addonAfter='元' />)}
                </FormItem>
                <div style={{ marginLeft: '20%', marginTop: '-5px', textAlign: 'left', fontSize: 13 }}>
                  <p style={{ marginBottom: '2px' }}>提示：</p>
                  <p style={{ margin: '2px' }}>可将该平台账户的“可用余额”进行退回</p>
                </div>
              </div>
            }

          </Form>
        </Modal>

        <Modal
          maskClosable={false}
          title={modalType === 'lockModal' ? '锁定资金' : '解锁资金'}
          className={styles.standardListForm}
          width={700}
          destroyOnClose
          visible={visibleLock}
          footer={
            <div>
              <Button onClick={this.lockCancel}>取消</Button>
              <Button type="primary" onClick={(e) => this.lockSubmit(e)}>确定</Button>
            </div>
          }
          onCancel={this.lockCancel}
        >
          <div style={{ fontSize: 15, paddingLeft: '30%', boxSizing: 'border-box' }}>
            {
              modalType === 'lockModal' &&
              `确定锁定${current.name}的全部资金？`
            }
            {
              modalType === 'unLockModal' &&
              `确定解锁${current.name}的全部资金？`
            }
          </div>
        </Modal>
      </GridContent>
    );
  };
}

export default PlatformAccount;

const TitleIcon = ({ type, msg = '' }) => {
  let title = msg;
  switch (type) {
    case 'fundsAvailable': title = '未被用掉的金额'; break;
    case 'fundsUsed': title = '已被领取的资金'; break;
    case 'fundsUnOccupy': title = '已发放但还未被领取的'; break;
    case 'fundsFreeze': title = '将待领取金额外进行冻结'; break;
    case 'fundsTotal': title = '总金额=可用金额+已用金额+待领取+冻结金额'; break;
    default:
  }
  return (
    <Tooltip title={title}>
      <Icon type="question-circle-o" style={{ cursor: 'pointer', marginLeft: '5px' }} />
    </Tooltip>
  )
}

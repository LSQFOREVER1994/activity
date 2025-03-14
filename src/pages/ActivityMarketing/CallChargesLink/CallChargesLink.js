import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, message, Switch, Modal, Form, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FilterForm from './FilterForm';
import ChargesLinkModal from './ChargesLinkModal';
import { exportXlsx } from '@/utils/utils';

const moneyList = [10, 20, 30, 50, 100, 200, 300, 500];
const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

@connect(({ callChargesLinkModel }) => {
  return {
    loading: callChargesLinkModel.loading,
    recordList: callChargesLinkModel.recordList,
    visibleAddModal: callChargesLinkModel.visibleAddModal,
    platformList: callChargesLinkModel.platformList,
  };
})
@Form.create()
class CallChargesLink extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paginationInfo: {
        pageSize: 10,
        pageNum: 1,
      },
      editModalInfo: {},
      chargePrizeId: '',
      visibleChargesLinkModal: false,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      isLoading: false, // 是否加载中，防抖标志符
    };
  }

  componentDidMount() {
    this.getPlatformName();
    this.getCallChargesLinkList();
  }

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState(
      {
        paginationInfo: {
          ...this.state.paginationInfo,
          pageNum: 1,
        },
      },
      () => {
        this.getCallChargesLinkList();
      }
    );
  };

  getCallChargesLinkList = () => {
    const {
      paginationInfo: { pageNum, pageSize },
      sortedInfo = {},
    } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    switch (formValue.isPublish) {
      case '':
        formValue.isPublish = '';
        break;
      case 1:
        formValue.isPublish = true;
        break;
      case 0:
        formValue.isPublish = false;
        break;
    }
    const sortValue = sortedInfo.order === 'descend' ? 'desc' : 'asc';
    console.log(formValue);
    const { dispatch } = this.props;
    dispatch({
      type: 'callChargesLinkModel/getCallChargesLinkList',
      payload: {
        pageNum,
        pageSize,
        orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        ...formValue,
      },
    });
  };

  // 查看链接
  showCallChargesLinkModal = id => {
    this.setState({
      visibleChargesLinkModal: true,
      chargePrizeId: id,
    });
  };

  // 获取平台名称
  getPlatformName = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'callChargesLinkModel/getPlatformName',
      payload: {
        pageNum: 1,
        pageSize: 1000,
      },
    });
  };

  // 导出
  exportRecord = id => {
    const ajaxUrl = `direct/code/export?directPrizeId=${id}`;
    exportXlsx({
      type: 'openService',
      uri: ajaxUrl,
      xlsxName: `话费充值码列表.xlsx`,
    });
  };

  renderAddOrEditModal = () => {
    const { editModalInfo } = this.state;
    const {
      visibleAddModal,
      dispatch,
      platformList,
      form: { getFieldDecorator, validateFields, resetFields },
    } = this.props;

    const handleOk = async () => {
      const data = await validateFields();
      this.setState({
        isLoading: true,
      });
      // 将过期时间格式转换为普通时间字符串格式
      data.expireTime = moment(data.expireTime).format('YYYY-MM-DD HH:mm:ss');
      // 补全参数
      data.orderType = 'MOBILE';

      // 编辑保存
      if (editModalInfo.id) {
        dispatch({
          type: 'callChargesLinkModel/editCallChargesLink',
          payload: {
            query: {
              ...data,
              id: editModalInfo.id,
            },
            successFun: () => {
              this.setState({
                isLoading: false,
              });
              handleCancel()
              this.getCallChargesLinkList();
            },
            errorFunc: () => {
              this.setState({
                editModalInfo: {},
                isLoading: false,
              });
            },
          },
        });
      } else {
        dispatch({
          type: 'callChargesLinkModel/createChargeCode',
          payload: {
            query: data,
            successFun: () => {
              this.setState({
                isLoading: false,
              });
              handleCancel()
              this.getCallChargesLinkList();
            },
            errorFunc: () => {
              this.setState({
                isLoading: false,
              });
            },
          },
        });
      }
    };

    const handleCancel = () => {
      resetFields();
      dispatch({
        type: 'callChargesLinkModel/SetState',
        payload: {
          visibleAddModal: false,
        },
      });
      this.setState({
        editModalInfo: {},
      });
    };

    const validateTime = (rule, value, callbakc) => {
      const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const selectTime = moment(value).format('YYYY-MM-DD HH:mm:ss');
      if (selectTime < nowTime) {
        callbakc('过期时间不能小于当前时间');
      }
      callbakc();
    };

    return (
      <Modal
        title={editModalInfo?.id ? '编辑话费充值链接' : '添加话费充值链接'}
        visible={visibleAddModal}
        okText="保存"
        onOk={handleOk}
        confirmLoading={this.state.isLoading}
        onCancel={handleCancel}
      >
        <Form>
          <FormItem label="平台名称" {...formLayout}>
            {getFieldDecorator('merchantId', {
              initialValue: editModalInfo?.merchantId ?? '',
              rules: [{ required: true, message: '请选择平台名称' }],
            })(
              <Select
                showSearch
                disabled={!!editModalInfo.id}
                filterOption={(input, option) => {
                  if (option && option.props && option.props.title) {
                    return option.props.title.includes(input);
                  }
                  return false;
                }}
                style={{ width: 220 }}
              >
                {platformList.length &&
                  platformList.map(item => {
                    return (
                      <Option key={item.id} value={item.id} title={item.name}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            )}
          </FormItem>

          <FormItem label="充值金额" {...formLayout}>
            {getFieldDecorator('chargePrice', {
              initialValue: editModalInfo?.chargePrice ?? 10,
              rules: [
                {
                  required: true,
                  message: '请输入充值金额',
                },
                {
                  // 请输入正整数
                  pattern: /^[1-9]\d*$/,
                  message: '请输入正整数',
                },
              ],
            })(
              <Select style={{ width: 120 }} disabled={!!editModalInfo.id}>
                {moneyList.map(item => {
                  return (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="数量" {...formLayout}>
            {getFieldDecorator('num', {
              initialValue: editModalInfo?.num ?? '',
              rules: [
                {
                  required: true,
                  message: '请输入数量',
                },
              ],
            })(<InputNumber min={1} disabled={!!editModalInfo.id} />)}
          </FormItem>
          <FormItem label="过期时间" {...formLayout}>
            {getFieldDecorator('expireTime', {
              initialValue: editModalInfo?.expireTime
                ? moment(editModalInfo?.expireTime)
                : moment().add(1, 'days'),
              rules: [
                {
                  required: true,
                  message: '请选择过期时间',
                },
                { validator: validateTime },
              ],
            })(<DatePicker showTime placeholder="请选择过期时间" />)}
          </FormItem>
          <FormItem label="状态" {...formLayout}>
            {getFieldDecorator('isPublish', {
              valuePropName: 'checked',
              initialValue: editModalInfo?.isPublish ?? true,
              rules: [
                {
                  required: true,
                  message: '请选择状态',
                },
              ],
            })(<Switch checkedChildren="上架" unCheckedChildren="下架" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  };

  // 排序
  tableChange = (pagination, _, sorter) => {
    console.log(sorter, 'sorter');
    const sortedInfo = { order: 'descend', ...sorter };
    const { current, pageSize } = pagination;
    this.setState(
      {
        paginationInfo: { pageNum: current, pageSize },
        sortedInfo,
      },
      () => this.getCallChargesLinkList()
    );
  };

  // 更改上下架状态
  handleChangeIsPublish = (e, id) => {
    const { dispatch } = this.props;
    const that = this;
    confirm({
      title: e ? '您确定要上架吗？' : '下架后链接将失效，您确定要下架吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        return new Promise(resolve => {
          dispatch({
            type: 'callChargesLinkModel/updateChargeCode',
            payload: {
              query: {
                id,
                isPublish: e,
              },
              successFun: () => {
                resolve();
                that.getCallChargesLinkList();
              },
            },
          });
        });
      },
    });
  };

  showEditModal = ({ id, chargePrice, num, expireTime, isPublish, merchantId }) => {
    const { dispatch } = this.props;
    const editModalInfo = {
      id,
      chargePrice,
      num,
      expireTime,
      isPublish,
      merchantId,
    };
    this.setState({
      editModalInfo,
    });
    dispatch({
      type: 'callChargesLinkModel/SetState',
      payload: {
        visibleAddModal: true,
      },
    });
  };

  // 关闭充值码详情弹窗
  closeChargesLinkModal = () => {
    this.setState({
      visibleChargesLinkModal: false,
    });
  };

  render() {
    const {
      loading,
      recordList: { total, list },
      id,
      activityName,
      platformList,
    } = this.props;
    const {
      paginationInfo: { pageSize, pageNum },
      sortedInfo,
      visibleChargesLinkModal,
      chargePrizeId,
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
        title: '平台名称',
        dataIndex: 'merchantId',
        render: merchantId => (
          <span>
            {platformList.length &&
              platformList[platformList.findIndex(item => item.id === merchantId)].name}
          </span>
        ),
      },
      {
        title: '充值金额',
        dataIndex: 'chargePrice',
        render: chargePrice => <span>{chargePrice}</span>,
      },
      {
        title: '数量',
        dataIndex: 'num',
        render: num => <span>{num}</span>,
      },
      {
        title: '已使用数量',
        dataIndex: 'useCount',
        render: useCount => <span>{useCount}</span>,
      },
      {
        title: '过期时间',
        dataIndex: 'expireTime',
        key: 'expire_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'expire_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: expireTime => <span>{expireTime}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'username',
        render: username => <span>{username}</span>,
      },
      {
        title: '状态',
        dataIndex: 'isPublish',
        render: (isPublish, record) => (
          <Switch
            checkedChildren="上架"
            unCheckedChildren="下架"
            checked={isPublish}
            onChange={e => this.handleChangeIsPublish(e, record.id)}
          />
        ),
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (id, item) => (
          <div style={{ color: '#1890ff' }}>
            <span
              style={{ marginRight: 15, cursor: 'pointer' }}
              onClick={() => this.showCallChargesLinkModal(id)}
            >
              查看链接
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer' }}
              onClick={() => this.showEditModal(item)}
            >
              编辑
            </span>
            {/* <span style={{ cursor: 'pointer' }} onClick={() => this.exportRecord( id )}>导出</span> */}
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title="话费充值链接"
          bodyStyle={{ padding: id ? '' : '20px 32px 40px 32px' }}
        >
          <FilterForm
            filterSubmit={this.filterSubmit}
            id={id}
            sortedInfo={sortedInfo}
            activityName={activityName}
            wrappedComponentRef={ref => {
              this.filterForm = ref;
            }}
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
        {this.renderAddOrEditModal()}
        {visibleChargesLinkModal && (
          <ChargesLinkModal
            visible={visibleChargesLinkModal}
            onCancel={this.closeChargesLinkModal}
            exportRecord={this.exportRecord}
            chargePrizeId={chargePrizeId}
          />
        )}
      </GridContent>
    );
  }
}

export default CallChargesLink;

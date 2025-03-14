import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Radio, DatePicker } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const time = () => new Date().getTime();
const { Option } = Select;

@connect(({ fundCollision }) => ({
  allPrizeList: fundCollision.allPrizeList,
}))
@Form.create()
class FundSetting extends PureComponent {
  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  constructor(props) {
    super(props);
    this.state = {
      list:
        props.data.fundGroups && props.data.fundGroups.length
          ? props.data.fundGroups.map((item, i) => {
              return { ...item, rowKey: time() + i };
            })
          : [],
      deleteIds: [0],
      modalType: 'prizeModal',
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  onPreview = () => {
    this.props.onPreview();
  };

  getData = () => {
    const { list, deleteIds } = this.state;
    return { fundGroups: list, deleteIds };
  };

  getValues = () => {
    const { list, deleteIds } = this.state;
    return { fundGroups: list, deleteIds };
  };

  // 显示新建遮罩层
  showModal = () => {
    const { list = [] } = this.state;
    this.setState({
      visible: true,
      prizeCurrent: undefined,
      modalType: 'prizeModal',
    });
  };

  // 显示编辑遮罩层
  showEditModal = (e, prize) => {
    e.stopPropagation();
    const $this = this;
    this.setState(
      {
        visible: true,
        prizeCurrent: prize,
        modalType: 'prizeModal',
      },
      () => {
        // $this.onChange(prize.prizeId)
      }
    );
  };

  // 取消
  handleCancel = () => {
    this.setState({
      visible: false,
      prizeCurrent: undefined,
    });
  };

  // 删除种类
  deleteItem = (e, obj) => {
    e.stopPropagation();
    const { list, deleteIds } = this.state;
    confirm({
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage({ id: 'form.del.tit' })}？`,
      onOk: () => {
        const newList = list.filter(item => item.rowKey !== obj.rowKey);
        let newDeleteIds = deleteIds;

        if (obj.id) {
          newDeleteIds = deleteIds.concat([obj.id]);
        }
        this.setState({ list: newList, deleteIds: newDeleteIds }, () => {
          this.onPreview();
        });
      },
      onCancel() {},
    });
  };

  // 提交：商品种类
  prizeHandleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { prizeCurrent, list } = this.state;

    let newList = list;
    const $this = this;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { code1, title1, link1, code2, title2, link2, date } = fieldsValue;

      const activityDate = moment(date).format('YYYY-MM-DD HH:MM:ss');
      const endDate = moment().format('YYYY-MM-DD 14:30:00');
      const nextDay = moment()
        .add(1, 'day')
        .format('YYYY-MM-DD 00:00:00');
      
      if (activityDate > endDate && activityDate < nextDay) {
        message.error('今日已超过基金活动竞猜时间，请选择下一个开盘日对战基金！');
        return;
      }

      const isInclude = _.findIndex(
        list,
        item => moment(item.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
      );
      if (isInclude >= 0) {
        message.error('当日只限一组基金对战！');
        return;
      }
      const newFundObj = {
        date: moment(date).format('YYYY-MM-DD'),
        funds: [
          {
            code: code1,
            link: link1,
            title: title1,
            position: 0,
          },
          {
            code: code2,
            link: link2,
            title: title2,
            position: 1,
          },
        ],
      };
      if (prizeCurrent && prizeCurrent.rowKey) {
        newList = list.map(item => {
          return item.rowKey === prizeCurrent.rowKey
            ? { ...newFundObj, rowKey: prizeCurrent.rowKey }
            : item;
        });
        message.success('编辑成功');
      } else {
        newList = newList.concat([{ ...newFundObj, rowKey: time() }]);
        message.success('添加成功');
      }
      $this.setState(
        {
          visible: false,
          prizeCurrent: undefined,
          list: newList,
        },
        () => {
          $this.onPreview();
        }
      );
    });
  };

  //  图片切换
  imgChang = () => {
    setTimeout(() => {
      this.onPreview();
    }, 100);
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      allPrizeList,
    } = this.props;
    const { visible, prizeCurrent = {}, list, modalType } = this.state;
    const modalFooter = {
      okText: formatMessage({ id: 'form.save' }),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel,
    };
    const columns = [
      {
        title: <span>基金1</span>,
        dataIndex: 'people',
        render: (record, data) => {
          const fundsCode = data && data.funds ? data.funds[0].code : '-';
          return <span>{fundsCode}</span>;
        },
      },
      {
        title: <span>基金2</span>,
        dataIndex: 'bean',
        render: (record, data) => {
          const fundsCode = data && data.funds ? data.funds[1].code : '-';
          return <span>{fundsCode}</span>;
        },
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'date',
        render: date => <span>{date || '--'}</span>,
      },
      {
        title: formatMessage({ id: 'form.action' }),
        dataIndex: 'id',
        render: (id, item, index) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={e => this.showEditModal(e, item, index)}
            >
              编辑
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={e => this.deleteItem(e, item)}
            >
              删除
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <p style={{ color: '#D1261B' }}>
          <Icon style={{ color: '#1F3883', padding: '0 5px' }} type="info-circle" />
          基金对战设置
        </p>
        <Table
          size="small"
          rowKey="rowKey"
          columns={columns}
          pagination={false}
          dataSource={list}
          footer={() => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1890FF',
                  cursor: 'pointer',
                }}
                onClick={this.showModal}
              >
                <Icon
                  type="plus-circle"
                  style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
                />
                添加（{list.length}）
              </div>
            );
          }}
        />
        <Modal
          maskClosable={false}
          title={`${
            prizeCurrent.date
              ? formatMessage({ id: 'form.exit' })
              : formatMessage({ id: 'form.add' })
          }`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <div>
            <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
              <p style={{ color: '#D1261B', marginLeft: '200px' }}>开始时间建议选择非节假日</p>
              <FormItem label="开始时间" {...this.formLayout}>
                {getFieldDecorator('date', {
                  rules: [
                    {
                      required: true,
                      message: `开始时间不能为空！`,
                    },
                  ],
                  initialValue: prizeCurrent.date ? moment(prizeCurrent.date) : undefined,
                })(<DatePicker disabledDate={current => current < moment().subtract(1,'day')} />)}
              </FormItem>
              {/* 基金1设置 */}
              <FormItem label="基金1设置" {...this.formLayout}>
                {getFieldDecorator('code1', {
                  rules: [
                    {
                      required: true,
                      message: '基金1设置不能为空！',
                    },
                  ],
                  initialValue: prizeCurrent.funds && prizeCurrent.funds[0].code,
                })(<Input placeholder="请输入基金代码" min={0} />)}
              </FormItem>
              <FormItem label="副标题描述" {...this.formLayout}>
                {getFieldDecorator('title1', {
                  initialValue: prizeCurrent.funds && prizeCurrent.funds[0].title,
                })(<Input placeholder="请输入基金副标题" min={0} />)}
              </FormItem>
              <FormItem label="详情介绍" {...this.formLayout}>
                {getFieldDecorator('link1', {
                  initialValue: prizeCurrent.funds && prizeCurrent.funds[0].link,
                })(<Input placeholder="请输入产品详情链接" min={0} />)}
              </FormItem>
              {/* 基金2设置 */}
              <FormItem label="基金2设置" {...this.formLayout}>
                {getFieldDecorator('code2', {
                  rules: [
                    {
                      required: true,
                      message: '基金2设置不能为空！',
                    },
                  ],
                  initialValue: prizeCurrent.funds && prizeCurrent.funds[1].code,
                })(<Input placeholder="请输入基金代码" min={0} />)}
              </FormItem>
              <FormItem label="副标题描述" {...this.formLayout}>
                {getFieldDecorator('title2', {
                  initialValue: prizeCurrent.funds && prizeCurrent.funds[1].title,
                })(<Input placeholder="请输入基金副标题" />)}
              </FormItem>
              <FormItem label="详情介绍" {...this.formLayout}>
                {getFieldDecorator('link2', {
                  initialValue: prizeCurrent.funds && prizeCurrent.funds[1].link,
                })(<Input placeholder="请输入产品详情链接" />)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </GridContent>
    );
  }
}

export default FundSetting;

const Content = props => {
  const { style = {}, sizeText } = props;
  return (
    <div style={{ display: 'flex', padding: '10px 0 0 0', ...style }}>
      <div
        style={{
          display: 'flex',
          fontSize: 13,
          color: '#999',
        }}
      >
        {props.children}
        <div
          style={{ lineHeight: '22px', fontSize: '10px', paddingLeft: '20px', paddingTop: '15px' }}
        >
          格式：jpg/jpeg/png
          <br />
          建议尺寸：{sizeText}
          <br />
          图片大小建议不大于1M
        </div>
      </div>
    </div>
  );
};

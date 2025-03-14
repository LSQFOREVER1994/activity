import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Radio } from 'antd';
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
class PrizeTable extends PureComponent {


  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };


  constructor(props) {
    super(props);
    this.state = {
      list: (props.prizes && props.prizes.length) ? props.prizes.map((item, i) => { return ({ ...item, rowKey: time() + i }) }) : [],
      // useInventory: '',
      deleteIds: [0],
      // name: '',
      // popupText: '',
      modalType: 'prizeModal'
    };
  }


  componentDidMount() {
    this.props.onRef(this)
  }

  onPreview = () => {
    this.props.onPreview()
  }

  getData = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  getValues = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  // 显示新建遮罩层
  showModal = () => {
    const { list = [] } = this.state;
    if (list.length === 5) {
      message.error('新增参与人数和奖金失败,最多可设置5个!');
      return;
    }
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
    this.setState({
      visible: true,
      prizeCurrent: prize,
      modalType: 'prizeModal',
    }, () => {
      // $this.onChange(prize.prizeId)
    });
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
          newDeleteIds = deleteIds.concat([obj.id])
        }
        this.setState({ list: newList, deleteIds: newDeleteIds }, () => {
          this.onPreview()
        })
      },
      onCancel() {
      },
    });
  }

  // 提交：商品种类
  prizeHandleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    const { prizeCurrent, list } = this.state;

    let newList = list;
    const $this = this;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { totalCount = 0 } = fieldsValue;

      if (prizeCurrent && prizeCurrent.rowKey) {
        newList = list.map(item => {
          return item.rowKey === prizeCurrent.rowKey ? ({ ...item, ...fieldsValue }) : item
        })
        message.success('编辑成功')
      } else {
        newList = newList.concat([{ ...fieldsValue, prizeType: "ALL", rowKey: time() }])
        message.success('添加成功')
      }
      $this.setState({
        visible: false,
        prizeCurrent: undefined,
        list: newList,
      }, () => {
        $this.onPreview()
      });
    });
  };

  //  图片切换
  imgChang = () => {
    setTimeout(() => {
      this.onPreview()
    }, 100);
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, allPrizeList } = this.props;
    const { visible, prizeCurrent = {}, list, modalType } = this.state;
    const modalFooter = {
      okText: formatMessage({ id: 'form.save' }),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>参与人数（人）</span>,
        align: 'center',
        dataIndex: 'people',
        render: people => <span>{people}</span>
      },
      {
        title: <span>累计奖励（豆）</span>,
        dataIndex: 'bean',
        align: 'center',
        render: bean => <span>{bean || '--'}</span>,
      },
      {
        title: formatMessage({ id: 'form.action' }),
        dataIndex: 'id',
        align: 'center',
        render: (id, item, index) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={(e) => this.showEditModal(e, item, index)}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={(e) => this.deleteItem(e, item)}
            >删除
            </span>

          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <p style={{ color: '#D1261B' }}>
          <Icon style={{ color: '#1F3883', padding: "0 5px" }} type="info-circle" />
           本期奖励为总瓜分金豆数量（奖励数量为最后一位数组）
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
                  cursor: 'pointer'
                }}
                onClick={this.showModal}
              >
                <Icon
                  type="plus-circle"
                  style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
                />
                添加（{list.length}/5）
              </div>
            )
          }}
        />
        <Modal
          maskClosable={false}
          title={`${prizeCurrent.id ? formatMessage({ id: 'form.exit' }) : formatMessage({ id: 'form.add' })}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <div>
            <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
              <FormItem
                label='参与人数（人）'
                {...this.formLayout}
              >
                {getFieldDecorator('people', {
                  rules: [
                    {
                      required: true,
                      message: `请输入参与人数（人）`
                    },
                    { pattern: new RegExp(/^\+?(0|[1-9][0-9]*)$/), message: '请输入正整数' }
                  ],
                  initialValue: prizeCurrent.people,
                })(<Input
                  placeholder='请输入参与人数'
                  min={0}
                />
                )}
              </FormItem>
              <FormItem label='累计奖励（豆）' {...this.formLayout} >
                {getFieldDecorator('bean', {
                  rules: [
                    { required: true, message: `请输入累计奖励` },
                    { pattern: new RegExp(/^\+?(0|[1-9][0-9]*)$/), message: '请输入正整数' }
                  ],
                  initialValue: prizeCurrent.bean,
                })(<Input
                  placeholder='请输入累计奖励'
                  min={0}
                />
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </GridContent>
    );
  }
}

export default PrizeTable;

const Content = (props) => {
  const { style = {}, sizeText, } = props;
  return (
    <div style={{ display: "flex", padding: '10px 0 0 0', ...style }}>
      <div
        style={{
          display: "flex",
          fontSize: 13,
          color: '#999',
        }}
      >
        {props.children}
        <div style={{ lineHeight: '22px', fontSize: '10px', paddingLeft: '20px', paddingTop: '15px' }}>
          格式：jpg/jpeg/png
          <br />
          建议尺寸：{sizeText}
          <br />
          图片大小建议不大于1M
        </div>
      </div>
    </div>
  )
}
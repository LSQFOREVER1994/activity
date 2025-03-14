import React, { PureComponent } from 'react';
import { Row, Col, Form, Input, Select, Button, Modal, Table, Switch } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
@connect(({ system }) => {
  return {
    permissionLoading: system.permissionLoading,
    permissionDetail: system.permissionDetail,
  }
})
@Form.create()
class EditModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      permissions: [],
      name: '',
      code: ''
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.permissionDetail !== nextProps.permissionDetail) {
      const { permissions } = nextProps.permissionDetail
      const newPermissions = permissions.map(info => {
        return { ...info, isShow: true }
      })
      this.setState({ permissions: newPermissions })
    }
  }

  //搜索
  onSearch = (val, type) => {
    this.setState({
      [type]: val
    }, () => {
      setTimeout(() => {
        const { permissions, name, code } = this.state
        const nameStr = name ? name.trim() : ''
        const codeStr = code ? code.trim() : ''
        const newPermissions = permissions.map(item => {
          let newItem = { ...item, isShow: true }
          if (item.name.indexOf(nameStr) <= -1 || item.code.indexOf(codeStr) <= -1) {
            newItem = { ...item, isShow: false }
          }
          return newItem
        })
        this.setState({
          permissions: [...newPermissions]
        })
      }, 50);
    })
  }

  //筛选
  renderFilterForm = () => {
    const { form: { getFieldDecorator } } = this.props;
    const { permissionDetail: { menuName, name } } = this.props
    return (
      <Form layout='horizontal'>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='所属菜单' {...formLayout}>
              <Input
                placeholder="请输入所属菜单"
                style={{ width: 220 }}
                disabled
                value={menuName || '--'}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='权限组' {...formLayout}>
              <Input
                placeholder="请输入权限组"
                style={{ width: 220 }}
                disabled
                value={name || '--'}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <FormItem label='权限名称' {...formLayout}>
              <Input
                placeholder="请输入权限名称"
                style={{ width: 220 }}
                onChange={(e) => this.onSearch(e.target.value, 'name')}
                value={this.state.name}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label='代码' {...formLayout}>
              <Input
                placeholder="请输入代码"
                style={{ width: 220 }}
                onChange={(e) => this.onSearch(e.target.value, 'code')}
                value={this.state.code}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }

  // 启用禁用
  onEnableChange = (item) => {
    const { permissions } = this.state
    const { code, enable } = item
    const newPermissions = permissions.map(info => {
      let newInfo = { ...info }
      if (info.code === code) {
        newInfo = { ...info, enable: !enable }
      }
      return newInfo
    })
    this.setState({
      permissions: newPermissions
    })
  }

  // 表格
  renderTable = () => {
    const { permissions } = this.state
    const listData = permissions.filter(info => {
      return info.isShow === true
    })
    const { permissionLoading } = this.props
    const columns = [
      {
        title: <span>权限名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>代码</span>,
        dataIndex: 'code',
        key: 'code',
        render: code => <span>{code || '--'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'enable',
        fixed: 'right',
        width: 100,
        render: (enable, item) => (
          <Switch checked={enable} onChange={() => this.onEnableChange(item)} />
        ),
      },
    ];

    return (
      <Table
        size="middle"
        rowKey='code'
        columns={columns}
        loading={permissionLoading}
        dataSource={listData}
        pagination={
          { pageSize: 100 }
        }
      />
    )
  }

  // 关闭弹窗
  onCloseModal = () => {
    const { handleEditModalCancel } = this.props
    this.setState({ permissions: [], name: '', code: '' }, () => { handleEditModalCancel() })
  }

  // 确认弹窗
  onSubmitModal = () => {
    const { permissions } = this.state
    const { handleEditModalSubmit } = this.props
    handleEditModalSubmit(permissions, () => {
      this.setState({
        name: '',
        code: ''
      })
    })
  }

  render() {
    const { editModalVisible, handleEditModalSubmit, handleEditModalCancel } = this.props
    return (
      <Modal
        title="编辑权限"
        visible={editModalVisible}
        onOk={this.onSubmitModal}
        onCancel={this.onCloseModal}
        width={900}
      >
        {this.renderFilterForm()}
        {this.renderTable()}
      </Modal>
    )
  }
}

export default EditModal;

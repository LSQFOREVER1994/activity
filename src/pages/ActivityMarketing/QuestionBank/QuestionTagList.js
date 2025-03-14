
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Form, Radio, Input, message, Button, Switch, Popconfirm } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};
@connect( ( { answer } ) => {
  return {
    loading: answer.loading,
    tagListMap: answer.tagListMap,
  }
} )
@Form.create()

class Questions extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    operationVisible: false,
    operationItem: {}, // 选中的项
    sortedInfo: {
      columnKey: 'create_time',
      field: 'createTime',
      order: 'descend',
    },
  };

  searchBar = React.createRef()

  componentDidMount() {
    this.props.refs( this );
    // this.getTagList();
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getTagList( data );
    } )
  }

  // 获取题目标签列表
  getTagList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'answer/getTagList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        ...data
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
    }, () => this.getTagList( this.searchBar.current.data ) );
  };

  showModal = () => { // 弹窗展示
    this.setState( {
      operationVisible: true,
    } )
  }

  onEditItem = ( e, item ) => { // 点击操作
    this.setState( {
      operationItem: item,
      operationVisible: true
    } )
  }

  onChatModalConfirm = () => {
    const { operationItem } = this.state;
    const { dispatch, form: { validateFields } } = this.props
    validateFields( ( err, value ) => {
      if ( !err ) {
        const params = { ...value, id: operationItem.id }
        const isUpdate = !!params.id
        dispatch( {
          type: 'answer/saveTag',
          payload: {
            query: params,
            callFunc: () => {
              this.getTagList( this.searchBar.current.data );
              message.success( '操作成功' )
              this.setState( {
                operationVisible: false,
                operationItem: {},
              } )
            },
            isUpdate,
          }
        } );
      }
    } )
  }

  onChatModalCancel = () => {
    this.setState( {
      operationItem: {},
      operationVisible: false,
    } )
  }

  changeStatus = ( e, item ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'answer/changeStatus',
      payload: {
        query: {
          ...item,
          enable: e,
        },
        callFunc: () => {
          this.getTagList( this.searchBar.current.data );
          message.success( '修改成功' )
        },
        failFunc: () => {
          this.getTagList( this.searchBar.current.data );
        }
      }
    } )
  }

  delTag = ( e, item ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'answer/delTag',
      payload: {
        query: {
          id: item.id,
        },
        callFunc: () => {
          this.getTagList( this.searchBar.current.data );
        }
      }
    } )
  }

  renderModal = () => {
    const { operationVisible, operationItem } = this.state;
    const { form: { getFieldDecorator } } = this.props;

    const modalFooter = {
      okText: '保存',
      onOk: this.onChatModalConfirm,
      onCancel: this.onChatModalCancel,
    };

    return (
      <Modal
        title={`${operationItem.id ? '编辑' : '新增'}标签`}
        width={840}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={operationVisible}
        {...modalFooter}
      >
        <div onClick={this.showBgColor} />
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="标签名称" {...formLayout}>
            {getFieldDecorator( 'name', {
              rules: [
                {
                  whitespace:true,
                  required: true,
                  message: '请输入标签名称',
                },
              ],
              initialValue: operationItem.name
            } )(

              <Input placeholder='请输入标签名称' maxLength={30} />
            )}
          </Form.Item>
          <Form.Item label="是否启用" {...formLayout}>
            {getFieldDecorator( 'enable', {
              rules: [
                {
                  required: true,
                  message: '请选择是否启用',
                },
              ],
              initialValue: typeof operationItem.enable === 'boolean' ? operationItem.enable : true
            } )(
              <Radio.Group disabled={operationItem.id}>
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    const { loading, tagListMap: { total, list } } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const searchEleList = [
      {
        key: 'id',
        label: 'ID',
        type: 'InputNumber',
        maxLength: 100,
        max: 1000000,
        min: 0,
        precision: 0,
      },
      {
        key: 'name',
        label: '标签内容',
        type: 'Input'
      },
      {
        key: 'enable',
        label: '状态',
        type: 'Select',
        optionList: [
          { label: '全部', value: '' },
          { label: '启用', value: 'true' },
          { label: '禁用', value: 'false' },
        ]
      },
      {
        key: 'createTime',
        label: '创建时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
      }
    ]
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
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>标签内容</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: endTime => {
          let showTime = '--'
          if ( endTime ) {
            showTime = moment( endTime ).format( 'YYYY-MM-DD  HH:mm:ss' )
          }
          return (
            <span>{showTime}</span>
          )
        }
      },
      {
        title: <span>状态</span>,
        dataIndex: 'enable',
        key: 'enable',
        width: 100,
        render: ( enable, item ) => <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={enable} onChange={( e ) => { this.changeStatus( e, item ) }} />,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'choice',
        fixed: 'right',
        // width: 210,
        render: ( choice, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.onEditItem( e, item )}
            >修改
            </span>
            <span
              style={{ cursor: 'pointer', margin: '0 20px 10px', color: '#f5222d' }}
            >
              <Popconfirm placement="top" title={`是否确认删除:${item.name}`} onConfirm={( e ) => this.delTag( e, item )} okText="是" cancelText="否">
                <span>删除</span>
              </Popconfirm>
            </span>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title=''
          bodyStyle={{ padding: 0 }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={searchEleList}
            searchFun={this.filterSubmit}
            loading={loading}
          />
          <Button
            type="dashed"
            style={{ width: '100%', marginTop: 10, marginBottom: 10 }}
            icon="plus"
            onClick={this.showModal}
          >
            添加新标签
          </Button>
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
        {this.renderModal()}
      </GridContent>
    );
  };
}

export default Questions;

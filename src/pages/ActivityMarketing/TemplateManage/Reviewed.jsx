import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Form, Radio, Input, message, Button } from 'antd';
import moment from 'moment';
import EditTag from './EditTag';
import styles from './templateManage.less';
import SearchBar from '@/components/SearchBar';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

@connect( ( { template } ) => {
  return {
    auditList: template.auditList,
    loading: template.loading
  };
} )
@Form.create()
class Comment extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      pageNum: 1,
      pageSize: 10,
      selectedRowKeys: [], // 多选id
      auditTemplateItem: {}, // 审核模板模板对象
      auditTemVisible: false, // 审核模板弹窗
      editVisible: false, // 编辑信息弹窗
      editItem: {}, // 编辑信息模板对象
      sortedInfo: {
        columnKey: 'create_time',
        field: 'create_time',
        order: 'descend',
      },
      isClick: false
    };
    this.searchBar = React.createRef()
    this.searchEleList = [
      {
        key: 'templateName',
        label: '模板名称',
        type: 'Input'
      },
    ]
  }

  componentDidMount() {
    this.getAuditList();
  }

  getAuditList = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch } = this.props;
    dispatch( {
      type: 'template/getAuditList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        ...data
      }
    } )
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    if ( pageSize !== this.setState.pageSize ) {
      this.setState( {
        selectedRowKeys: [],
      } );
    }

    const sotrObj = { order: 'descend', ...sorter, columnKey: 'create_time' };
    this.setState(
      {
        pageNum: current,
        pageSize,
        sortedInfo: sotrObj,
      },
      () => this.getAuditList( this.searchBar.current.data )
    );
  };

  onTableChange = selectedRowKeys => {
    this.setState( {
      selectedRowKeys,
    } );
  };

  // 新增或编辑模版
  editTemp = item => {
    const { templateId } = item || {};
    const { activityTemplate } = item;
    const { version } = activityTemplate;
    const { history } = this.props;
    if ( templateId ) sessionStorage.setItem( 'editTempId', templateId );
    sessionStorage.setItem( 'isEditTemp', version );
    history.push( `/activityTemplate/bees` );
  };

  // 唤起修改模版弹窗
  handleEditTemplate = item => {
    this.setState( {
      editItem: item,
      editVisible: true,
    } );
  };

  // 关闭编辑弹框
  onCloseEditModal = () => {
    this.setState( {
      editItem: {},
      editVisible: false,
    } );
  };

  // 编辑模版
  editTemplate = () => {
    const { editItem } = this.state;
    const { activityTemplate } = editItem;
    const { name } = activityTemplate || {}
    if ( !name ) {
      message.error( '请输入模版名称' );
      return;
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'template/editTemplate',
      payload: {
        ...editItem?.activityTemplate,
      },
      callFunc: () => {
        message.success( '修改成功！' );
        this.getAuditList();
        this.onCloseEditModal();
      },
    } );
  };

  // 编辑标签
  editTemplateTags = newTags => {
    const { editItem } = this.state;
    const data = { ...JSON.parse( JSON.stringify( editItem?.activityTemplate ) ), labels: newTags }
    const newEditItem = { ...editItem, activityTemplate: data };
    this.setState( {
      editItem: newEditItem,
    } );
  };

  // 编辑名称
  editTemplateName = e => {
    const { editItem } = this.state;
    const data = { ...JSON.parse( JSON.stringify( editItem?.activityTemplate ) ), name: e.target.value }
    const newEditItem = { ...editItem, activityTemplate: data };
    this.setState( {
      editItem: newEditItem,
    } );
  };

  // 编辑模版弹框
  renderEditModal = () => {
    const { editVisible, editItem } = this.state;
    const { activityTemplate } = editItem;
    const { name, labels } = activityTemplate || {}
    return (
      <Modal
        key="show_img_modal_preview"
        title="模版编辑"
        visible={editVisible}
        onCancel={this.onCloseEditModal}
        onOk={() => this.editTemplate()}
      >
        <FormItem required style={{ display: 'flex' }} label="模版名称" {...this.formLayout}>
          <Input
            type='text'
            placeholder="请输入名称"
            onChange={this.editTemplateName}
            value={name}
            maxLength={20}
          />
        </FormItem>
        <FormItem
          style={{ display: 'flex', alignItems: 'center' }}
          label="模板标签"
          {...this.formLayout}
        >
          <EditTag tags={labels} changeTags={this.editTemplateTags} />
        </FormItem>
      </Modal>
    );
  };

  handleAudit = item => {
    this.setState( {
      auditTemplateItem: item,
      auditTemVisible: true,
    } );
  };

  onCloseAudit = () => {
    this.setState( {
      auditTemplateItem: {},
      auditTemVisible: false,
    } );
  };

  // 审核模板
  auditTemplate = () => {
    const { auditTemplateItem, isClick } = this.state;
    const {
      form: { getFieldValue }, dispatch
    } = this.props;
    const { templateId } = auditTemplateItem;
    const { selectedRowKeys } = this.state;
    const params = selectedRowKeys.length ? selectedRowKeys : [templateId]
    const auditResult = getFieldValue( 'humanAudit' )
    if ( !params ) return
    if ( isClick ) return
    this.setState( {
      isClick: true
    }, () => {
      dispatch( {
        type: 'template/auditTemplate',
        payload: {
          ids: params,
          auditResult,
        },
        callFunc: () => {
          this.getAuditList();
          message.success( '操作成功' );
          this.setState( {
            auditTemplateItem: {},
            auditTemVisible: false,
            selectedRowKeys: [],
            isClick: false
          } );
        }
      } )
    } )
  }

  renderAuditModal = () => {
    const { auditTemplateItem, auditTemVisible } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const modalFooter = {
      okText: '保存',
      onOk: this.auditTemplate,
      onCancel: this.onCloseAudit,
    };

    return (
      <Modal
        title="审核模板"
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={auditTemVisible}
        {...modalFooter}
      >
        <Form {...formItemLayout}>
          <div className={styles.audit_state}>
            <Form.Item label="审核状态">
              {getFieldDecorator( 'humanAudit', {
                rules: [
                  {
                    required: true,
                    message: '请选择审核状态',
                  },
                ],
                initialValue: auditTemplateItem.humanAudit || true,
              } )(
                <Radio.Group>
                  <Radio value>通过</Radio>
                  <Radio value={false}>不通过</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            {/* <span>审核通过的模板将放入公共模板，审核不通过的模板将直接删除</span> */}
          </div>
        </Form>
      </Modal>
    );
  };

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getAuditList( data );
    } )
  }

  batchProcessing = () => {
    const { selectedRowKeys } = this.state;
    if ( !selectedRowKeys.length ) {
      message.error( '请选择修改内容' )
      return;
    }
    this.setState( {
      auditTemVisible: true,
    } )

  }

  render() {
    const { auditList: { total, list }, loading } = this.props;
    const { pageSize, pageNum, sortedInfo, selectedRowKeys } = this.state;
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
        title: <span>模板名称</span>,
        dataIndex: 'templateName',
        key: 'templateName',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>模板标签</span>,
        dataIndex: 'labels',
        key: 'labels',
        width: 300,
        render: labels => (
          <div>
            {labels.map( item => {
              return (
                <span key={item} className={styles.templateItemTips}>
                  {item}
                </span>
              );
            } )}
          </div>
        ),
      },
      {
        title: <span>提交时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        width: 200,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: pushTime => {
          let showTime = '--';
          if ( pushTime ) {
            showTime = moment( pushTime ).format( 'YYYY-MM-DD  HH:mm:ss' );
          }
          return <span>{showTime}</span>;
        },
      },
      {
        title: <span>提交人</span>,
        dataIndex: 'commit_user',
        key: 'commit_user',
        render: commitUser => <span>{commitUser}</span>,
      },
      {
        title: <span style={{ textAlign: 'center' }}>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => this.editTemp( item )}
            >
              编辑模板
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => {
                this.handleEditTemplate( item );
              }}
            >
              编辑信息
            </span>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={() => this.handleAudit( item )}
            >
              审核模板
            </span>
          </div>
        ),
      },
    ];

    const rowSelection = {
      onChange: this.onTableChange,
      selectedRowKeys,
    };
    return (
      <>
        <SearchBar
          ref={this.searchBar}
          searchEleList={this.searchEleList}
          searchFun={this.filterSubmit}
          loading={loading}
        />
        <Button type="primary" onClick={this.batchProcessing}>
          批量修改
        </Button>
        <Table
          rowSelection={rowSelection}
          scroll={{ x: 1000 }}
          size="middle"
          rowKey="templateId"
          columns={columns}
          pagination={paginationProps}
          dataSource={list}
          onChange={this.tableChange}
          loading={loading}
        />
        {this.renderEditModal()}
        {this.renderAuditModal()}
      </>
    );
  }
}

export default Comment;

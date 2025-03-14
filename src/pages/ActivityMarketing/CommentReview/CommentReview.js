/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/sort-comp */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Form, Radio, Input, message, Switch, Breadcrumb, Button } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 16 },
  },
};

const resultArr = {
  DEFAULT: {
    value: '机审失败',
    color: '#D9001B'
  },
  PASS: {
    value: '通过',
    color: '#2CA612'
  },
  NO_PASS: {
    value: '不通过',
    color: '#D9001B'
  },
  SUSPECTED: {
    value: '嫌疑',
    color: '#FAAD13'
  },
}

const sourceArr = {
  BARRAGE: '弹幕',
  BULLET: '视频弹幕',
  NORMAL_COMMENT: '普通评论',
  OPPOSITE_COMMENT: '正反方评论',
}

const contentTypeArr = {
  DEFAULT: '其他',
  ADVERTISEMENT: '广告',
  REACTIONARY: '反动',
  PORNOGRAPHIC: '涉黄',
  POLITICS: '涉政',
}


const contentTypes = [
  {
    value: 'DEFAULT',
    label: '其他'
  },
  {
    value: 'ADVERTISEMENT',
    label: '广告'
  },
  {
    value: 'REACTIONARY',
    label: '反动'
  },
  {
    value: 'PORNOGRAPHIC',
    label: '涉黄'
  },
  {
    value: 'POLITICS',
    label: '涉政'
  },
]

@connect( ( { comment } ) => {
  return {
    loading: comment.loading,
    commentMap: comment.commentMap,
    elementList:comment.elementList
  }
} )
@Form.create()

class Comment extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,
      operationVisible: false,
      operationItem: {}, // 选中的项
      selectedRowKeys: [], // 多选id
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      topicEleList:props.elementList
    };

    this.searchBar = React.createRef()
  }


  componentDidMount() {
    this.getComment();
    this.getTopicElementList();
  };

  componentDidUpdate( prevProps ) {
    if ( prevProps.elementList.length !== this.props.elementList.length ) {
      this.setState( { topicEleList: this.props.elementList } );
    }
  }



  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getComment( data );
    } )
  }

  // 获取活动列表
  getComment = ( data ) => {
    const { pageNum, pageSize, sortedInfo = {} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
    const { dispatch, activityId } = this.props;

    dispatch( {
      type: 'comment/getComment',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy: `${sortedInfo.columnKey} ${sortValue}`,
        },
        activityId,
        ...data
      },
    } );
  }

  // 获取话题组件列表
  getTopicElementList = () => {
    const { dispatch, activityId } = this.props;
    dispatch( {
      type: 'comment/getTopicElementList',
      payload: {
          query:{ activityId },
      },
    } );
  }


  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    if ( pageSize !== this.setState.pageSize ) {
      this.setState( {
        selectedRowKeys: []
      } )
    }
    const sotrObj = { order: 'descend', ...sorter, }

    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sotrObj,
    }, () => this.getComment( this.searchBar.current.data ) );
  };

  onTableChange = ( selectedRowKeys ) => {
    this.setState( {
      selectedRowKeys
    } )
  }

  onEditItem = ( e, item, more ) => { // 点击操作
    const { selectedRowKeys } = this.state;
    if ( more && !selectedRowKeys.length ) {
      message.error( '请选择修改内容' )
      return
    }
    this.setState( {
      operationItem: item,
      operationVisible: true
    } )
  }

  onChatModalConfirm = () => {
    const { operationItem, selectedRowKeys } = this.state;
    const { dispatch, form: { validateFields } } = this.props
    validateFields( ( err, value ) => {
      if ( !err ) {
        const params = { ids: selectedRowKeys.length ? selectedRowKeys : [operationItem.id], ...value }
        dispatch( {
          type: 'comment/toExamine',
          payload: {
            query: params,
            callFunc: () => {
              this.getComment( this.searchBar.current.data );
              message.success( '操作成功' )
              this.setState( {
                operationVisible: false,
                operationItem: {},
                selectedRowKeys: []
              } )
            }
          }
        } );
      }
    } )
  }

  // 置顶状态更新
  onToponChange = ( item ) => {
    const { dispatch } = this.props
    const params = { ids: [item.id], onTop: !item.onTop }
    dispatch( {
      type: 'comment/toExamine',
      payload: {
        query: params,
        callFunc: () => {
          this.getComment();
          message.success( '操作成功' )
        }
      }
    } );
  }


  onChatModalCancel = () => {
    this.setState( {
      operationItem: {},
      operationVisible: false,
    } )
  }

  renderModal = () => {
    const { operationVisible, operationItem } = this.state;
    const { form: { getFieldDecorator, getFieldValue } } = this.props;

    const modalFooter = {
      okText: '保存',
      onOk: this.onChatModalConfirm,
      onCancel: this.onChatModalCancel,
    };

    return (
      <Modal
        title="变更审核结果"
        width={640}
        bodyStyle={{ padding: '28px 0 0' }}
        destroyOnClose
        visible={operationVisible}
        {...modalFooter}
      >
        <div onClick={this.showBgColor} />
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="审核状态">
            {getFieldDecorator( 'humanAudit', {
              rules: [
                {
                  required: true,
                  message: '请选择审核状态',
                },
              ],
              initialValue: operationItem.humanAudit || 'PASS'
            } )(
              <Radio.Group>
                <Radio value='PASS'>通过</Radio>
                <Radio value='NO_PASS'>不通过</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {getFieldValue( 'humanAudit' ) === 'NO_PASS' &&
            <Form.Item label="命中类型">
              {getFieldDecorator( 'contentType', {
                rules: [
                  {
                    required: true,
                    message: '请选择命中类型',
                  },
                ],
                initialValue: operationItem.contentType || 'DEFAULT'
              } )(
                <Radio.Group>
                  {
                    contentTypes.map( item => (
                      <Radio value={item.value} key={item.value}>{item.label}</Radio>
                    ) )
                  }
                </Radio.Group>
              )}
            </Form.Item>
          }
          {getFieldValue( 'contentType' ) === 'DEFAULT' &&
            <Form.Item label="其他">
              {getFieldDecorator( 'note', {
                rules: [
                  {
                    required: true,
                    message: '请选择其他',
                  },
                ],
                initialValue: operationItem.note
              } )(
                <Input placeholder='请输入其他' style={{ width: 280 }} maxLength={50} />
              )}
            </Form.Item>
          }
        </Form>
      </Modal>
    )
  }



  render() {

    const { loading, commentMap: { total, list }, closeUserActionPage, activityId } = this.props;
    const { pageSize, pageNum, sortedInfo, selectedRowKeys } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const exportConfig = {
      type: 'activityService',
      ajaxUrl: `content/export`,
      xlsxName: '审核列表.xlsx',
      extraData: { activityId, orderBy },
      responseType:'POST'
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
        title: <span>评论内容</span>,
        dataIndex: 'content',
        key: 'content',
        width: 300,
        render: content => <span>{content}</span>,
      },
      {
        title: <span>机审结果</span>,
        dataIndex: 'robotAudit',
        key: 'robotAudit',
        render: robotAudit => <span style={{ color: resultArr[robotAudit] && resultArr[robotAudit].color }}>{( resultArr[robotAudit] && resultArr[robotAudit].value ) || '--'}</span>,
      },
      {
        title: <span>人审结果</span>,
        dataIndex: 'humanAudit',
        key: 'humanAudit',
        render: humanAudit => <span style={{ color: resultArr[humanAudit] && resultArr[humanAudit].color }}>{( resultArr[humanAudit] && resultArr[humanAudit].value ) || '未审核'}</span>,
      },
      {
        title: <span>命中类型</span>,
        dataIndex: 'contentType',
        key: 'contentType',
        render: contentType => {
          return <span>{contentTypeArr[contentType] || '--'}</span>
        }
      },
      {
        title: <span>是否置顶</span>,
        dataIndex: 'onTop',
        key: 'onTop',
        render: ( onTop, item ) => {
          return <span> <Switch checked={onTop} onChange={() => this.onToponChange( item )} /></span>
        }
      },
      {
        title: <span>评论层级</span>,
        dataIndex: 'level',
        key: 'level',
        render: ( level ) => {
          let levelText = '--'
          if ( level && level === 1 ) levelText = '一级评论'
          if ( level && level === 2 ) levelText = '二级评论'
          return <span>{levelText}</span>
        }
      },
      {
        title: <span>用户名</span>,
        dataIndex: 'username',
        key: 'username',
        // render: user => <span>{user && user.username ? user.username : '--'}</span>,
        render: user => <span>{user || '--'}</span>,
      },
      {
        title: <span>关联话题</span>,
        dataIndex: 'topicId',
        key: 'topicId',
        width: 200,
        render: ( id, record ) => <span> {id ? `${record.topicName || '--'}(${id})` : '--' }</span>,
      },
      {
        title: <span>数据来源</span>,
        dataIndex: 'source',
        key: 'source',
        render: source => <span>{sourceArr[source]}</span>,
      },
      {
        title: <span>评论时间</span>,
        dataIndex: 'createTime',
        key: 'create_time',
        sorter: true,
        width: 200,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => {
          let showTime = '--'
          if ( createTime ) {
            showTime = moment( createTime ).format( 'YYYY-MM-DD  HH:mm:ss' )
          }
          return (
            <span>{showTime}</span>
          )
        }
      },
      {
        title: <span>最近审核时间</span>,
        dataIndex: 'updateTime',
        key: 'update_time',
        sorter: true,
        width: 200,
        sortOrder: sortedInfo.columnKey === 'update_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: updateTime => {
          let showTime = '--'
          if ( updateTime ) {
            showTime = moment( updateTime ).format( 'YYYY-MM-DD  HH:mm:ss' )
          }
          return (
            <span>{showTime}</span>
          )
        },
      },
      {
        title: <span>审核人</span>,
        dataIndex: 'auditor',
        key: 'auditor',
        render: auditor => <span>{auditor}</span>,
      },
      {
        title: <span>不通过原因</span>,
        dataIndex: 'note',
        key: 'note',
        render: note => <span>{note || '--'}</span>,
      },
      {
        title: <span style={{ textAlign: 'center', }}>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        // width: 210,
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight: 15, cursor: 'pointer', color: '#1890ff' }}
              onClick={( e ) => this.onEditItem( e, item )}
            >修改
            </span>
          </div>
        ),
    },
    ];

    // 关联话题列表
    const topicOptionList = this.state.topicEleList && this.state.topicEleList.map( ( item ) =>{
      if( item.id ){
        return {
          value:item.id,
          label:`${item.name}(${item.id})`
        }
      }
      return {}
    } )
    topicOptionList.unshift( {
      value:'',
      label:'全部'
    } )

    const searchEleList = [
      {
        key: 'content',
        label: '评论内容',
        type: 'Input'
      },
      {
        key: 'username',
        label: '用户名',
        type: 'Input'
      },
      {
        key: 'source',
        label: '数据来源',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'BARRAGE',
            label: '弹幕',
          },
          {
            value: 'BULLET',
            label: '视频弹幕',
          },
          {
            value: 'NORMAL_COMMENT',
            label: '普通评论',
          },
          {
            value: 'OPPOSITE_COMMENT',
            label: '正反方评论',
          },
        ]
      },
      {
        key: 'robotAudit',
        label: '机审结果',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'PASS',
            label: '通过',
          },
          {
            value: 'NO_PASS',
            label: '不通过',
          },
          {
            value: 'NO_CHECK',
            label: '未审核',
          },
        ]
      },
      {
        key: 'humanAudit',
        label: '人审结果',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'PASS',
            label: '通过',
          },
          {
            value: 'NO_PASS',
            label: '不通过',
          },
          {
            value: 'NO_CHECK',
            label: '未审核',
          },
        ]
      },
      {
        key: 'createTime',
        label: '评论时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { pushStart: 'YYYY-MM-DD', pushEnd: 'YYYY-MM-DD' }
      },
      {
        key: 'onTop',
        label: '是否置顶',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 'true',
            label: '是',
          },
          {
            value: 'false',
            label: '否',
          },
        ]
      },
      {
        key: 'updateTime',
        label: '最近审核时间',
        type: 'RangePicker',
        format: 'YYYY-MM-DD',
        alias: { auditStart: 'YYYY-MM-DD', auditEnd: 'YYYY-MM-DD' }
      },
      {
        key: 'level',
        label: '评论层级',
        type: 'Select',
        optionList: [
          {
            value: '',
            label: '全部',
          },
          {
            value: 1,
            label: '一级评论',
          },
          {
            value: 2,
            label: '二级评论',
          },
        ]
      },
      {
        key: 'topicId',
        label: '关联话题',
        type: 'Select',
        optionList:topicOptionList
      }
    ]


    const rowSelection = {
      onChange: this.onTableChange,
      selectedRowKeys
    };
    return (
      <GridContent>
        {activityId &&
          <Breadcrumb style={{ marginBottom: 20 }}>
            <Breadcrumb.Item>
              <a onClick={() => { closeUserActionPage() }}>数据中心</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>审核列表</Breadcrumb.Item>
          </Breadcrumb>
        }
        <Card
          bordered={false}
          title='详细信息'
          headStyle={{ fontWeight: 'bold' }}
        >
          <SearchBar
            ref={this.searchBar}
            searchEleList={searchEleList}
            searchFun={this.filterSubmit}
            loading={loading}
            exportConfig={exportConfig}
          />
          <Button
            type="primary"
            onClick={() => {
                this.onEditItem( '', {}, 'more' );
              }}
          >
            批量修改
          </Button>
          <Table
            rowSelection={rowSelection}
            scroll={{ x: 2200 }}
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

export default Comment;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Button, Table, Divider, Form, Popconfirm, Input, Modal } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const { TextArea } = Input;
const FormItem = Form.Item;

@connect( ( { system } ) => ( {
  loading: system.loading,
  tags: system.tags,
} ) )
@Form.create()

class TagsModal extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      visible:false,
      data:{},
      tagNameStr:'',
    };
  }


  // 编辑标签列表
  showTagModal = ( item ) => {
    this.setState( {
      visible: true,
      data: item,
      tagNameStr:item.name
    } )
  }

  //  新建标签
  addTag=()=>{
    this.setState( {
      visible: true,
      data: {},
      tagNameStr:''
    } )
  }

  // 关闭标签列表弹窗
  closeTagModal = () => {
    this.setState( {
      visible: false,
      tagNameStr:'',
      data:{}
    } )
  }

  // 添加\编辑标签
  submitTag = () => {
    const { dispatch, form, fetchTagList } = this.props;
    const { data } = this.state;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = {
        ...fieldsValue,
        id: data.id
      }
      dispatch( {
        type: 'system/submitTags',
        payload: {
          isUpdate: !!data.id,
          params,
          callFunc: () => {
            this.setState( {
              visible: false,
              data:{},
              tagNameStr:''
            } )
            fetchTagList( { pageNum:1, pageSize:10 } )
          },
        }
      } )
    } );
  }

  // 删除标签
  delTagsList = ( item ) => {
    const { dispatch, fetchTagList } = this.props;
    dispatch( {
      type: 'system/delTagList',
      payload: {
        query: {
          id: item.id
        },
        successFunc: () => {
          fetchTagList( { pageNum:1, pageSize:10 } );
        }
      }
    } )
  }

  // 翻页
  onChangePage = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.props.fetchTagList( { pageNum:current, pageSize } );
  }

  // 输入框值变化
  onChageInput = ( e ) => {
    this.setState( {
      tagNameStr:e.target.value
    } )
  }

  render() {
    const { loading, form: { getFieldDecorator }, tags:{ list, total, pageNum } } = this.props;
    const { pageSize, data, visible, tagNameStr } = this.state;

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>标签名称</span>,
        dataIndex: 'name',
        render: tagName => <span>{tagName}</span>,
      },
      {
        title: <span>用户数量</span>,
        dataIndex: 'total',
        render: userTotal => <span>{userTotal || 0}</span>,
      },
      {
        title: <span>备注</span>,
        dataIndex: 'description',
        render: description => <span>{description || '--'}</span>,
      },
      {
        title: <span>操作</span>,
        render: ( text, record ) => (
          <div className={styles.btns}>
            <span
              style={{ cursor: 'pointer', color: '#1890ff' }}
              className={styles.btnsBtn}
              onClick={() => this.showTagModal( record )}
              type="link"
            >
              编辑
            </span>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除：该用户标签?"
              onConfirm={() => { this.delTagsList( record ) }}
              okText="确定"
              cancelText="取消"
            >
              <span
                style={{ cursor: 'pointer', color: '#fc2a33' }}
                type="link"
              >
                删除
              </span>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const pagination = {
      total,
      current: pageNum,
      defaultPageSize: pageSize,
      showQuickJumper: true,
      showTotal: ( t, r ) => `${r[0]}-${r[1]} 共 ${t} 条记录`,
    };


    return (
      <GridContent>
        <div className={styles.standardList}>
          <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={() => this.addTag()}
          >
            {formatMessage( { id: 'form.add' } )}
          </Button>
          <Table
            rowKey="id"
            columns={columns}
            loading={loading}
            dataSource={list}
            pagination={pagination}
            onChange={this.onChangePage}
          />
        </div>
        <Modal
          title={data.id ? '编辑标签' : '添加标签'}
          className={styles.standardListForm}
          bodyStyle={{ padding:'28px', display:'flex', justifyContent :'flex-start' }}
          visible={visible}
          onOk={this.submitTag}
          onCancel={this.closeTagModal}
          maskClosable={false}
          destroyOnClose
        >
          <div className={styles.modal} style={{ width: '100%' }}>
            <Form onSubmit={this.submitTag}>
              <FormItem label="标签名称" {...formItemLayout}>
                {
                  getFieldDecorator( 'name', {
                    rules: [{ required: true, message: '标签名称不能为空' }],
                    initialValue: data.name
                  } )(
                    <Input
                      placeholder="请输入标签名称"
                      maxLength={10}
                      suffix={<span>{tagNameStr.length} / 10</span>}
                      onChange={this.onChageInput}
                    /> )
                }
              </FormItem>
              <FormItem label="备注" {...formItemLayout}>
                {
                  getFieldDecorator( 'description', {
                    initialValue: data.description
                  } )(
                    <TextArea
                      placeholder="请输入备注"
                      maxLength={20}
                    /> )
                }
              </FormItem>
            </Form>
          </div>
        </Modal>
      </GridContent>
    );
  }
}

export default TagsModal;

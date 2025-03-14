
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, Radio, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../EducationService/education.less';

const FormItem = Form.Item;
const { confirm } = Modal;

const RadioGroup = Radio.Group;

const stateObj = {
  "ENABLE": formatMessage( { id: 'website.tag.true' } ), // 是
  "DISABLE": formatMessage( { id: 'website.tag.false' } ), // 否
}

@connect( ( { crop } ) => ( {
  loading: crop.loading,
  tagsListResult: crop.tagsListResult
} ) )
@Form.create()

class TagsList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    // articleId: 'all',
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const { pageNum, pageSize } = this.state;
    this.tagsListManage( { pageNum, pageSize } );
  };

  // 初始化 页面获取标签列表
  tagsListManage = ( { pageSize, pageNum } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'crop/getTagsListAll',
      payload: {
        params: {
          pageSize,
          pageNum
        },
        callFunc() { }
      }
    } )
  };

  // 翻页
  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.tagsListManage( { pageNum: current, pageSize } );
    this.setState( {
      pageNum: current,
      pageSize,
    } );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( id ) => {

    const { tagsListResult: { list } } = this.props;

    const obj = list.find( o => o.id === id );

    this.setState( {
      visible: true,
      current: obj
    } );
  };

  //  取消
  handleCancel = () => {
    const { current } = this.state;
    const id = current ? current.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      current: undefined,
    } );
  };

  //  提交(添加或者编辑标签)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNum,
    } = this.state;

    const id = current ? current.id : '';

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;

      const params = id ? Object.assign( current, fieldsValue, { id } ) : { ...fieldsValue };
      // 处理是否首页显示
      params.isShow = params.isShow === 'ENABLE' ? params.isShow = true : params.isShow = false;
      const isUpdate = !!id;

      dispatch( {
        type: 'crop/upaddDataTag',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.tagsListManage( { pageNum, pageSize } );
            $this.setState( {
              visible: false,
              current: undefined,
            } );
          },
        },
      } );
    } );
  };

  // 删除课程
  deleteItem = ( e, id ) => {
    e.stopPropagation();

    const $this = this;
    const { pageSize, pageNum } = this.state;
    const { tagsListResult: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );

    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'crop/delTags',
          payload: {
            id,
            callFunc: () => {
              $this.tagsListManage( { pageSize, pageNum } );
              $this.setState( { pageSize, pageNum } )
            },
          },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
          if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }

  render() {

    const { loading, tagsListResult: { total, list }, form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, current = {} } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        render: id => <span>{id}</span>,
      },
      { // 标签名称
        title: <span>{formatMessage( { id: 'website.tags.name' } )}</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {// 是否显示首页
        title: <span>{formatMessage( { id: 'website.tags.show' } )}</span>,
        dataIndex: 'isShow',
        render: isShow => (
          <span>{isShow ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> )
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: id => (
          <div>

            {/* 编辑按钮 */}
            <span
              style={{ marginRight:'15px', cursor:'pointer', color:'#1890ff'  }}
              type="link"
              onClick={() => this.showEditModal( id )}
              ref={component => {
                  /* eslint-disable */
                  this[`editProBtn${id}`] = findDOMNode(component);
                  /* eslint-enable */
                }}
            >
                编辑
            </span>

            {/* 删除按钮 */}
            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, id )}
              ref={component => {
                  /* eslint-disable */
                  this[`delProBtn${id}`] = findDOMNode(component);
                  /* eslint-enable */
                }}
            >
                删除
            </span>
            
          </div>
        ),
      },
    ];
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="标签列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            {/* 添加按钮 */}
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showAddModal()}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>

            {/* 显示列表 */}
            <Table
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>

        {/* 添加，编辑模板 */}
        <Modal
          maskClosable={false}
          title={Object.keys( current ).length > 0 ? '编辑标签' : '添加标签'}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>

              {/* 标签名称 */}
              <FormItem label={formatMessage( { id: 'website.tags.name' } )} {...this.formLayout}>
                {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.tags.name' } )}` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.tags.name' } )}`} /> )}
              </FormItem>

              {/* 是否显示按钮 */}
              <FormItem label={formatMessage( { id: 'website.tags.show' } )} {...this.formLayout}>
                {getFieldDecorator( 'isShow', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'website.tags.show' } )}` }],
                  initialValue: current.isShow ? 'ENABLE' : 'DISABLE',
                } )(
                  <RadioGroup>
                    <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                    <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                  </RadioGroup>
                )}
              </FormItem>

            </Form>
          }
        </Modal>
      </GridContent>
    );
  };
}

export default TagsList;
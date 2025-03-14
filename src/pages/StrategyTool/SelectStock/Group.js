import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';
import {
  Card, Input, Button, Modal, Form, Table,
} from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Lists.less';

const FormItem = Form.Item;
const { confirm } = Modal;

@connect( ( { selectStock } ) => ( {
  loading: selectStock.loading,
  groups: selectStock.groups,
} ) )
@Form.create()
class Group extends PureComponent {
  state = {
    pageNumber: 1,
    pageSize: 20,
    visible: false,
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { pageSize } = this.state;
    this.fetchList( 1, pageSize );
  }

  //  获取列表
  fetchList = ( pageNum, pageSize ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'selectStock/getGroups',
      payload: {
        pageNum,
        pageSize,
      },
    } );
  }

  //  pageSize  变化的回调
  onShowSizeChange = ( current, pageSize ) => {
    this.setState( { pageSize, pageNumber: 1 } );
    this.fetchList( 1, pageSize );
  }

  //  页码变化回调
  changePageNum = ( pageNumber ) => {
    const { pageSize } = this.state;
    this.setState( { pageNumber } );
    this.fetchList( pageNumber, pageSize );
  }

  //  删除
  deleteItem = ( id ) => {
    const $this = this;
    const { pageSize, pageNumber } = this.state;
    const { groups: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
        }, 0 )
        dispatch( {
          type: 'selectStock/delGroups',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList( pageNumber, pageSize );
            },
          },
        } );
      },
      onCancel() {
        setTimeout( () => {
          if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
        }, 0 )
      },
    } );
  }

  //  显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  //  显示编辑遮罩层
  showEditModal = ( id ) => {
    const { groups: { list } } = this.props;
    const obj = list.find( o => o.id === id );
    this.setState( {
      visible: true,
      current: obj,
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

  //  提交：商品(product)、规格(specs)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNumber,
    } = this.state;
    const id = current ? current.id : '';

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( current, fieldsValue ) : fieldsValue;

      dispatch( {
        type: 'selectStock/submitGroups',
        payload: {
          params,
          callFunc: () => {
            $this.fetchList( pageNumber, pageSize );
            $this.setState( {
              visible: false,
              current: undefined,
            } );
          },
        },
      } );
    } );
  };

  render() {
    const {
      loading, groups: { total, list }, form: { getFieldDecorator },
    } = this.props;

    const { pageSize, visible, current = {} } = this.state;

    // table pagination
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      onChange: this.changePageNum,
      onShowSizeChange: this.onShowSizeChange,
    };

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>键值</span>,
        dataIndex: 'key',
        render: key => <span>{key}</span>,
      },
      {
        title: <span>单位</span>,
        dataIndex: 'unit',
        render: unit => <span>{unit || '--'}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: id => (
          <div>
            
            <span
              style={{ marginRight:'15px', cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( id, 'product' )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
                编辑
            </span>
            
            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={() => this.deleteItem( id, 'product' )}
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
            title="配置列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showModal( 'product' )}
              ref={component => {
                /* eslint-disable */
                this.addProBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              size="large"
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
            />
          </Card>
        </div>
        <Modal
          title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="名称" {...this.formLayout}>
                {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}名称` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}名称`} /> )}
              </FormItem>
              <FormItem label="键值" {...this.formLayout}>
                {getFieldDecorator( 'key', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}键值)}` }],
                  initialValue: current.key,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}键值)}`} disabled={!!current.key} /> )}
              </FormItem>
              <FormItem label="单位" {...this.formLayout}>
                {getFieldDecorator( 'unit', {
                  initialValue: current.unit,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}单位`} /> )}
              </FormItem>
            </Form>
          }
        </Modal>
      </GridContent>
    );
  }
}

export default Group;
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Input, Button, Modal, Form, Tooltip, Table, Icon } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from '../Lists.less';

import AvatarDemo from "../Avatar/AvatarDemo";

const FormItem = Form.Item;
const { confirm } = Modal;

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  ProductsRights: strategyMall.ProductsRights,
} ) )
@Form.create()
class ProductsRightsList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
  };

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = () => {
    const { pageNum, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getProductsRights',
      payload: {
        pageNum,
        pageSize,
      },
    } );
  }


  // 删除
  deleteItem = ( item ) => {
    const $this = this;
    const { dispatch } = this.props;
    const{ name, id }=item;
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${name}`,
      onOk() {
        dispatch( {
          type: 'strategyMall/delProductsRights',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList();
            },
          },
        } );
      },
    } );
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( obj ) => {
    this.setState( {
      visible: true,
      current: obj,
    } );
  };

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
    } );
  };

  // 提交：产品(product)、规格(specs)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( current, fieldsValue, { change: 'exit' } ) : { ...fieldsValue };
      dispatch( {
        type: 'strategyMall/submitProductsRights',
        payload: {
          params,
          callFunc: () => {
            $this.setState( {
              visible: false,
              current: undefined,
            } );
            $this.fetchList();
          },
        },
      } );
    } );
  };

  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  }

  render() {
    const {
      loading, ProductsRights: { total, list }, form: { getFieldDecorator },
    } = this.props;

    const { visible, current = {}, pageSize, pageNum, } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      // onChange: this.changePageNum,
      // onShowSizeChange: this.onShowSizeChange,
    };

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.cover' } )}</span>,
        dataIndex: 'cover',
        render: cover => (
          <AvatarDemo src={cover} />
        ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.productsRights.name' } )}</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>厂商</span>,
        dataIndex: 'vendorOptions',
        render: vendorOptions => <span>{vendorOptions || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.link' } )}</span>,
        dataIndex: 'link',
        width: 300,
        render: link => <span>{link || '--'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            <span
              style={{ marginRight:'15px', cursor:'pointer', color:'#1890ff'  }}
              type="link"
              onClick={() => this.showEditModal( item )}
            >编辑
            </span>
            
            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={() => this.deleteItem( item )}
            >删除
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
            title="工具管理"
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showModal()}
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
              onChange={this.tableChange}
            />
          </Card>
        </div>
        <Modal
          maskClosable={false}
          title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}${formatMessage( { id: 'strategyMall.productsRights.tit' } )}${current.id ? `：${current.name}` : ''}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="厂商" {...this.formLayout}>
                {getFieldDecorator( 'vendorOptions', {
                  // rules: [{ required: true, message: `${formatMessage({ id: 'form.input' })}厂商` }],
                  initialValue: current.vendorOptions,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}厂商`} /> )}
              </FormItem>
              <FormItem
                label={(
                  <span>
                  工具代码&nbsp;
                    <Tooltip title={( <div>定义工具编号，为数字</div> )}>
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                  )}
                {...this.formLayout}
              >
                {getFieldDecorator( 'id', {
                  rules: [{ required: true, pattern: new RegExp( /^[1-9]\d*$/, "g" ), message: `${formatMessage( { id: 'form.input' } )}正确的${formatMessage( { id: 'strategyMall.productsRights.id' } )}` }],
                  getValueFromEvent: ( event ) => {
                    return event.target.value.replace( /\D/g, '' )
                  },
                  initialValue: current.id,
                } )( <Input disabled={!!current.id} placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.productsRights.id' } )}`} /> )}
              </FormItem>
              <FormItem label={formatMessage( { id: 'strategyMall.productsRights.name' } )} {...this.formLayout}>
                {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.productsRights.name' } )}` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.productsRights.name' } )}`} /> )}
              </FormItem>
              <FormItem label={formatMessage( { id: 'strategyMall.product.cover' } )} {...this.formLayout}>
                {getFieldDecorator( 'cover', {
                  rules: [{ required: true, message: `请上传${formatMessage( { id: 'strategyMall.product.cover' } )}` }],
                  initialValue: current.cover,
                } )( <UploadImg /> )}
              </FormItem>

              <FormItem label={formatMessage( { id: 'strategyMall.product.link' } )} {...this.formLayout}>
                {getFieldDecorator( 'link', {
                  rules: [
                    { required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.link' } )}`, },
                    { pattern: new RegExp( /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/ ), message: '请输入正确的产品链接' }
                  ],
                  initialValue: current.link,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.link' } )}`} /> )}
              </FormItem>
            </Form>
          }
        </Modal>
      </GridContent>
    );
  }
}

export default ProductsRightsList;

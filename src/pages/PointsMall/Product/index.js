import React, { PureComponent } from "react";
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import { Card, Button, Table, Switch, Popconfirm, message, Modal, Form, Input, Select, InputNumber } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import BatchFilterForm from './batchFilterForm'
import styles from '../PointsMall.less';

const FormItem = Form.Item;
const { Option } = Select;

const productObj = {
  0: '实物',
  1:'虚拟卡券',
  2:'话费(手机号直充)',
};

@connect( ( { pointsMall } ) => ( {
  loading: pointsMall.loading,
  goods: pointsMall.goods,
} ) )
@Form.create()
class Product extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    current: undefined,
    isSubmit: true,
    // sortedInfo: {
    //   columnKey: 'spuCode',
    //   field: 'spuCode',
    //   order: 'descend',
    // },

  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    this.getGoodsSpu();
  }

  getGoodsSpu = ( num ) => {
    const { pageNum, pageSize } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { name, spuCode, shelf } = formValue;
    if ( ( name && ( name.length > 60 ) ) || ( spuCode && ( spuCode.length > 60 ) ) ) {
      message.error( '最多允许输入60个字符' );
      return;
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/getGoodsSpu',
      payload: {
        pageNum: num || pageNum,
        name,
        spuCode,
        shelf,
        pageSize
      },
    } );
  }

  // 翻页
  tableChange = ( pagination ) => {
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
      // sortedInfo: sorter,
    }, () => this.getGoodsSpu() );
  }

  // 筛选表单提交 请求数据
  filterSubmit = () => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getGoodsSpu();
    } )
  }

  changeShelf = ( obj ) => {
    const { shelf, id } = obj;
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/changeShelf',
      payload: {
        shelf: shelf === '1' ? '0' : '1',
        ids: id,
      },
      callFunc: () => {
        const text = shelf === '1' ? '商品下架成功' : '商品上架成功';
        message.info( text );
        this.getGoodsSpu();
      }
    } );
  }

  deleteItem = ( e, item ) => {
    e.stopPropagation();
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'pointsMall/delShelf',
      payload: { id },
      callFunc: () => {
        message.info( '删除商品成功' );
        this.setState( {
          pageNum: 1,
        }, () => this.getGoodsSpu( 1 ) );
      }
    } );
  }

  showEditModal = ( e, obj ) => {
    e.stopPropagation();

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

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current, isSubmit } = this.state;
    const id = current ? current.id : '';
    const $this = this;
    if ( isSubmit ) {
      this.setState( { isSubmit: false } );
      form.validateFields( ( err, fieldsValue ) => {
        if ( err ) {
          this.setState( { isSubmit: true } );
          return;
        }
        const { picUrls, shelf, stock } = fieldsValue;
        const params = id ? Object.assign( current, fieldsValue ) : { ...fieldsValue };
        params.picUrls = [picUrls];
        params.stock = +stock;
        params.shelf = shelf ? '1' : '0';
        dispatch( {
          type: 'pointsMall/editGood',
          payload: params,
          callFunc: ( text ) => {
            message.info( text );
            $this.getGoodsSpu();
            $this.setState( {
              visible: false,
              current: undefined,
              isSubmit: true,
            } );
          },
        } );
      } );
    }
    
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  render() {
    const { loading, goods: { total, list }, form: { getFieldDecorator } } = this.props;
    const { pageSize, pageNum, visible, current = {} } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum
    };

    const columns = [
      // {
      //   title: (
      //     <div>
      //       <span style={{ cursor: 'pointer', color: '#1890FF' }} onClick={this.allExport}>全部导出</span>
      //       &nbsp;&nbsp;&nbsp;
      //       <span style={{ cursor: 'pointer', color: '#1890FF' }} onClick={this.portionExport}>导出</span>
      //     </div>
      //   ),
      //   dataIndex: 'Checkbox',
      //   width: 130,
      //   render: ( id, item ) => <div style={{ textAlign: 'center', position: 'relative' }} onClick={this.stop}><Checkbox onChange={( e ) => this.checkBox( e, item )} key={item.id} /></div>
      // },
      {
        title: <span>商品名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>商品图片</span>,
        dataIndex: 'picUrls',
        render: picUrls => <div className={styles.picUrlsBox}><img className={styles.picUrls} src={picUrls[0]} alt="商品图片" /></div>,
      },
      {
        title: <span>商品类型</span>,
        dataIndex: 'goodsType',
        render: goodsType => <span>{productObj[goodsType]}</span>,
      },
      {
        title: <span>销售价</span>,
        dataIndex: 'salesPrice',
        render: salesPrice => <span>{salesPrice || '0'}</span>,
      },
      {
        title: <span>库存</span>,
        dataIndex: 'stock',
        render: stock => <span>{stock || '0'}</span>,
      },
      {
        title: <span>商品编码</span>,
        dataIndex: 'spuCode',
        key: 'spuCode',
        // sorter: true,
        // sortOrder: sortedInfo.columnKey === 'spuCode' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: spuCode => <span>{spuCode}</span>,
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        // sorter: true,
        // sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>更新时间</span>,
        dataIndex: 'updateTime',
        render: updateTime => <span>{updateTime || '-'}</span>,
      },
      {
        title: <span>是否上架</span>,
        dataIndex: 'shelf',
        key: 'shelf',
        // sorter: true,
        // sortOrder: sortedInfo.columnKey === 'shelf' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        // render: shelf => <span>{shelfObj[shelf]}</span>,
        render: ( shelf, item ) => (
          <Popconfirm placement="top" title={shelf === '1' ? '确定下架该产品？' : '确定上架该产品？'} onConfirm={() => this.changeShelf( item )} okText="是" cancelText="否">
            <Switch checked={shelf === '1'} checkedChildren="上架" unCheckedChildren="下架" />
          </Popconfirm>
        ),
      },
      {
        title: <span>操作</span>,
        dataIndex: 'id',
        width: 90,
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
            >编辑
            </span>

            <Popconfirm placement="top" title="确定删除该产品？" onConfirm={( e ) => this.deleteItem( e, item )} okText="是" cancelText="否">
              <span
                style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
                type="link"
              >
                删除
              </span>
            </Popconfirm>


          </div>
        ),
      },
    ];

    const modalFooter = {
      okText: '保存',
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    return (
      <GridContent>
        <div>
          <Card
            bordered={false}
            title="商品管理"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <BatchFilterForm
              filterSubmit={this.filterSubmit}
              wrappedComponentRef={( ref ) => { this.filterForm = ref }}
            />
            <div className={styles.btns}>
              <Button
                type="dashed"
                style={{ width: '100%', marginBottom: 8, marginRight: 15 }}
                icon="plus"
                onClick={() => this.showAddModal()}
                ref={component => {
                  /* eslint-disable */
                  this.addProBtn = findDOMNode(component);
                  /* eslint-enable */
                }}
              >
                新建
              </Button>
              {/* <Button
                type='primary'
                style={{ width: '10%', marginBottom: 8, marginRight: 15 }}
                icon="plus"
              // onClick={() => this.showAddModal()}
              >
                批量上架
              </Button>
              <Button
                type="danger"
                style={{ width: '10%', marginBottom: 8 }}
                icon="plus"
              // onClick={() => this.showAddModal()}
              >
                批量下架
              </Button> */}
            </div>

            <Table
              size="large"
              scroll={{ x: 1300 }}
              rowKey="id"
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />

          </Card>
        </div>

        {
          visible ? (
            <Modal
              maskClosable={false}
              title={`${current.id ? '编辑' : '新增'}商品`}
              className={styles.standardListForm}
              width={1000}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Form onSubmit={this.handleSubmit}>
                <FormItem label='商品名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: `请先输入商品名称` }],
                    initialValue: current.name,
                  } )(
                    <Input
                      placeholder="输入商品名称"
                      size
                    />
                  )}
                </FormItem>
                <FormItem label='商品类型' {...this.formLayout}>
                  {getFieldDecorator( 'goodsType', {
                    rules: [{ required: true, message: `请先输入商品类型` }],
                    initialValue: current.goodsType,
                  } )(
                    <Select
                      style={{ width: 230 }}
                      placeholder="请输入商品类型"
                    >
                      {/* <Option value="">全部</Option> */}
                      <Option value="0">实物</Option>
                      <Option value="1">虚拟卡券</Option>
                      <Option value="2">话费(手机号直充)</Option>
                    </Select> )}
                </FormItem>
                <FormItem label="图片" {...this.formLayout}>
                  {getFieldDecorator( 'picUrls', {
                    rules: [{ required: true, message: `请先上传图片` }],
                    initialValue: current.picUrls ? current.picUrls[0] : '',
                  } )( <UploadImg /> )}
                </FormItem>
                <FormItem label='销售价' {...this.formLayout}>
                  {getFieldDecorator( 'salesPrice', {
                    rules: [{ required: true, message: `请先输入商品销售价` }],
                    initialValue: current.salesPrice,
                  } )(
                    <InputNumber
                      placeholder="输入商品销售价"
                      style={{ width: 230 }}
                      min={0} 
                      max={99999999} 
                    />
                  )}
                </FormItem>
                <FormItem label='市场价' {...this.formLayout}>
                  {getFieldDecorator( 'marketPrice', {
                    rules: [{ required: true, message: `请先输入商品市场价` }],
                    initialValue: current.marketPrice,
                  } )(
                    <InputNumber
                      placeholder="输入商品市场价"
                      style={{ width: 230 }}
                      min={0} 
                      max={99999999} 
                    />
                  )}
                </FormItem>
                <FormItem label='库存' {...this.formLayout}>
                  {getFieldDecorator( 'stock', {
                    rules: [{ required: true, message: `请先输入商品库存` }],
                    initialValue: current.stock,
                  } )(
                    <InputNumber
                      placeholder="输入商品库存"
                      style={{ width: 230 }}
                      min={0} 
                      max={999999} 
                    />
                  )}
                </FormItem>
                <FormItem label='商品编码' {...this.formLayout}>
                  {getFieldDecorator( 'spuCode', {
                    rules: [{ required: true, message: `请先输入商品编码` }],
                    initialValue: current.spuCode,
                  } )(
                    <Input
                      placeholder="输入商品编码"
                      size
                    />
                  )}
                </FormItem>
                <FormItem label='是否上架' {...this.formLayout}>
                  {getFieldDecorator( 'shelf', {
                    rules: [{ required: true, message: `请先输入商品编码` }],
                    valuePropName: 'checked',
                    initialValue: current.shelf === '1'
                  } )(
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                  )}
                </FormItem>
                <FormItem label='商品描述' {...this.formLayout}>
                  {getFieldDecorator( 'description', {
                    rules: [{ required: true, message: `请先输入商品描述` }],
                    initialValue: current.description,
                  } )(
                    <BraftEditor record={current.description} fieldDecorator={getFieldDecorator} field="introduction" />
                  )}
                </FormItem>
              </Form>
            </Modal>
          ) : null
        }

      </GridContent>
    )
  }
}

export default Product
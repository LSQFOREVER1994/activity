/* eslint-disable no-nested-ternary */
import React, { PureComponent } from "react";
import { connect } from 'dva';
import moment from "moment";
import { findDOMNode } from 'react-dom';
import { Card, Button, Table, Switch, Popconfirm, message, Modal, Form, Input, Select, InputNumber, Radio, DatePicker } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import UploadModal from '@/components/UploadModal/UploadModal';
import BatchFilterForm from './BatchFilterForm';
import ConfirmModal from '@/components/ConfirmModal';
import RightPop from "./RightPop";
import DiscountConfig from "./DiscountConfig";
import styles from '../product.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;

// const codeList =  [
//   {
//     "code": "NEW",
//     "name": "最新"
//   },
//   {
//     "code": "HOT",
//     "name": "热门"
//   },
//   {
//     "code": "PREFERRED",
//     "name": "优选"
//   },
//   {
//     "code": "BRAND",
//     "name": "品牌"
//   }
// ];
const productObj = {
  '0': '实物',
  '1':'虚拟卡券',
  // 'RED': '红包',
  '2':'话费(手机号直充)',
};

@connect( ( { product } ) => ( {
  loading: product.loading,
  goods: product.goods,
  codeList: product.codeList,
  warnGoods: product.warnGoods,
  userLevelList: product.userLevelList,
} ) )
@Form.create()
class Product extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    current: undefined,
    isSubmit: true,
    modalVisible: false,
    rightItem: {},
    confirmVisible: false,
    maxInventory: 0,
    nowProductDesc: '',
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

  formLayout1 = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };

  componentDidMount() {
    this.getGoodsCode(); // 获取商品分类
    this.getGoodsSpu();
    this.getUserLevel();
    this.getWarnGoodsSpu();
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/getRightList',
      payload: {
        pageNum: 1,
        pageSize: 10
      },
    } )
  }

  getUserLevel = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/getUserLevel'
    } )
  }

  // 获取预警商品列表
  getWarnGoodsSpu = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/getWarnGoodsSpu',
      payload: {
        stock: 10,
        shelf: '1'
      }
    } );
  }

  // 获取项目账户列表
  getIntegralAccountList = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/getIntegralAccountList',
    } );
  }

  // 获取商品分类
  getGoodsCode = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/getGoodsCode',
    } );
  }

  getGoodsSpu = ( num ) => {
    const { pageNum, pageSize } = this.state;
    const formValue = this.filterForm ? this.filterForm.getValues() : {};
    const { name, shelf, goodsType, categoryFirst } = formValue;
    if ( ( name && ( name.length > 60 ) ) ) {
      message.error( '最多允许输入60个字符' );
      return;
    }
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/getGoodsSpu',
      payload: {
        pageNum: num || pageNum,
        name,
        goodsType,
        categoryFirst,
        // supplier,
        shelf,
        pageSize,
        orderBy: 'create_time desc',
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
      type: 'product/changeShelf',
      payload: {
        shelf: shelf === '1' ? '0' : '1',
        ids: id,
      },
      callFunc: () => {
        const text = shelf === '1' ? '商品下架成功' : '商品上架成功';
        message.info( text );
        this.getWarnGoodsSpu();
        this.getGoodsSpu();
      }
    } );
  }

  deleteItem = ( e, item ) => {
    e.stopPropagation();
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/delShelf',
      payload: { id },
      callFunc: () => {
        message.info( '删除商品成功' );
        this.setState( {
          pageNum: 1,
        }, () =>{
          this.getWarnGoodsSpu();
          this.getGoodsSpu( 1 )}
        );}
    } );
  }

  showEditModal = ( e, obj ) => {
    e.stopPropagation();
    console.log( 'cdc', obj );
    this.setState( {
      visible: true,
      current: obj,
      picUrls: obj.picUrls,
      nowProductDesc: obj.description,
    }, () => {
      this.props.form.resetFields();
      this.getRightlist( obj.spuCode );
    } );
  };

  getRightlist = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'product/getRightList',
      payload: {
        id,
        pageNum: 1,
        pageSize: 10,
      },
      callFunc: ( res ) => {
          if ( res && res.list && res.list.length > 0 ) {
            this.chooseRight( res.list[0], true )
          }
      }
    } )
  }

  // 取消
  handleCancel = () => {
    this.props.form.resetFields();
    this.setState( {
      visible: false,
      current: undefined,
      rightItem: {},
      maxInventory: 0,
    } );
  };

  //  提交
  handleSubmit = ( e, bool ) => {

    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current, isSubmit, rightItem } = this.state;
    const id = current ? current.id : '';
    const $this = this;
    if ( isSubmit ) {
      this.setState( { isSubmit: false } );
      form.validateFields( ( err, fieldsValue ) => {
        if ( err ) {
          this.setState( { isSubmit: true } );
          return;
        }
        if ( !bool ) {
          this.setState( {
            confirmVisible: true,
            isSubmit: true,
          } )
          return;
        }
        const { picUrls, stock } = fieldsValue;
        const params = id ? Object.assign( current, fieldsValue ) : { ...fieldsValue, shelf: '1' };
        // if ( clientGroupIds === 'ALL' ) {
        //     params.clientGroupIds = '';
        // } else {
        //   const ids = clientGroupIds.filter( item =>item ==='ALL' );
        //   if( ids.length !== 0 ) {
        //     params.clientGroupIds = '';
        //   } else {
        //     params.clientGroupIds = clientGroupIds.join();
        //   }
        // }
        params.picUrls = picUrls;
        params.stock = +stock;
        params.spuName = rightItem.name;
        if  ( params.discountTime && params.discountTime.length > 0 ) {
          params.discountStart = moment( params.discountTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' );
          params.discountEnd = moment( params.discountTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' );
        } else {
          params.discountStart = '';
          params.discountEnd = '';
        }
        // params.onStartTime = ( stockTime && stockTime.length ) ?  moment( stockTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
        // params.onEndTime = ( stockTime && stockTime.length ) ? moment( stockTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ):'';
        dispatch( {
          type: 'product/editGood',
          payload: params,
          callFunc: ( text ) => {
            message.info( text );
            $this.getGoodsSpu();
            $this.getWarnGoodsSpu();
            $this.setState( {
              visible: false,
              current: undefined,
              isSubmit: true,
              confirmVisible: false,
            } );
          },
          errFunc: () => {
            $this.setState( {
              isSubmit: true,
              confirmVisible: false,
            } );
          }
        } );
      } );
    }

  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      rightItem: {},
      picUrls: []
    } );
  };

  renderCategoryFirst = ( categoryFirst ) => {
    const { codeList = [] } = this.props;
    const data = codeList.filter( ( item )=>item.id === categoryFirst );
    return data[0]?.name;
  }

  setChange = ( e, type ) => {
    this.setState( {
      [type]: e
    } )
  }

  cancelRightPop = () => {
    this.setState( {
      modalVisible: false,
    } );
  }

  changeTop = ( e ) => {
    this.props.form.setFieldsValue( {
      topPick: e.target.checked
    } )
  }

  chooseRight = ( item ) => {
    const { current } = this.state;
      this.props.form.setFieldsValue( {
        spuCode: item.id,
        goodsType: item.type === 'PHONE' ? '2' : item.type === 'GOODS' ? '0' : '1',
        picUrls: [item.imageUrl],
        name: current && current.spuCode === item.id ? current.name : item.name,
      } )
    this.setState( {
      rightItem: item,
      maxInventory: item.inventory || 0,
      nowProductDesc: !current ? item.productDesc : current.description
    } )
    this.cancelRightPop();
  }

  cancelChooseRight = () => {
    this.props.form.resetFields( ['spuCode', 'goodsType', 'name', 'description'] )
    this.setState( {
      rightItem: {},
      maxInventory: 0,
    } )
  }

  cancelConfirm = () => {
    this.setState( {
      confirmVisible: false,
    } )
  }

   // 编辑封面图
   uploadImg = ( urls ) => {
     console.log( 'urls', urls );
     this.setState( {
       picUrls: urls
     } )
    this.props.form.setFieldsValue( {
      picUrls: urls
    } )
  }

  changeConfig = ( list ) => {
    const { form } = this.props;
    form.setFieldsValue( {
      userLevels: list,
    } )
  }

  render() {
    const { loading, goods: { total, list }, warnGoods: { list: warnList }, form: { getFieldDecorator }, codeList, userLevelList } = this.props;
    const { pageSize, pageNum, visible, current = {}, modalVisible, rightItem, confirmVisible, picUrls, maxInventory, nowProductDesc } = this.state;
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
        render: picUrls => <div className={styles.picUrlsBox}><img className={styles.picUrls} src={picUrls && picUrls[0]} alt="商品图片" /></div>,
      },
      // {
      //   title: <span>供应商</span>,
      //   dataIndex: 'supplier',
      //   render: supplier => <span>{supplier}</span>,
      // },
      {
        title: <span>商品分类</span>,
        dataIndex: 'categoryFirst',
        // render: categoryFirst => <span>{codeList.filter( ( item )=>{console.log( categoryFirst ); return item.code === categoryFirst;} ).name}</span>,
        render: categoryFirst => <span>{this.renderCategoryFirst( categoryFirst )}</span>,
      },
      {
        title: <span>商品类型</span>,
        dataIndex: 'goodsType',
        render: goodsType => <span>{productObj[goodsType]}</span>,
      },
      {
        title: <span>需要积分数量</span>,
        dataIndex: 'salesPrice',
        render: salesPrice => <span>{salesPrice || '0'}</span>,
      },
      {
        title: <span>发放/总量</span>,
        dataIndex: 'stock',
        render: ( stock, record ) => <span>{`${ record.total - stock}/${  record.total}`}</span>,
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
          <Popconfirm placement="top" title={shelf === '1' ? '确定下架该商品？' : '确定上架该商品？'} onConfirm={() => this.changeShelf( item )} okText="是" cancelText="否">
            <Switch checked={shelf === '1'} checkedChildren="上架" unCheckedChildren="下架" />
          </Popconfirm>
        ),
      },
      {
        title: <span>操作</span>,
        dataIndex: 'id',
        fixed: 'right',
        width: 90,
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
            >编辑
            </span>

            <Popconfirm placement="top" title="确定删除该商品？" onConfirm={( e ) => this.deleteItem( e, item )} okText="是" cancelText="否">
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
      onOk: ( e ) => {this.handleSubmit( e, false )},
      onCancel: this.handleCancel,
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
              codeList={codeList}
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
            </div>

            {
              warnList.length > 0 && (
                <div className={styles.warnBox}>
                  <div className={styles.warnTitle}>以下商品库存不足，请及时补充</div>
                  <Table
                    size="large"
                    scroll={{ x: 1300 }}
                    rowKey="id"
                    columns={columns}
                    loading={loading}
                    dataSource={warnList}
                    pagination={false}
                  />
                </div>
                )
              }

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
              <Form onSubmit={( e ) => {this.handleSubmit( e, false )}}>
                <FormItem label='商品选择' {...this.formLayout1}>
                  {getFieldDecorator( 'spuCode', {
                      rules: [{ required: true, message: `请先选择商品选择` }],
                      initialValue: current.spuCode,
                    } )(
                      <div>
                        <Button style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }} disabled={!!current.id} icon={rightItem && rightItem.id ? '' : "plus"} onClick={() => {this.setState( { modalVisible: true } )}}>{rightItem && rightItem.id ? rightItem.name : '添加商品'}</Button>
                        {rightItem && rightItem.id && ( !current || !current.id ) && <Button onClick={this.cancelChooseRight} shape="circle" icon="close" size="small" style={{ marginLeft: '5px' }} />}
                        {!!current.id && <br />}
                        <span style={{ marginLeft: '5px' }}>*保存后，商品选择将无法更改</span>
                      </div>

                    )}
                </FormItem>
                <FormItem label='商品名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                    rules: [{ required: true, message: `请先输入商品名称` }],
                    initialValue: current.name,
                  } )(
                    <Input
                      autoComplete='off'
                      maxLength={100}
                      placeholder="输入商品名称"
                    />
                  )}
                </FormItem>

                <FormItem label='商品分类' {...this.formLayout}>
                  {getFieldDecorator( 'categoryFirst', {
                    rules: [{ required: true, message: '请先输入商品分类' }],
                    initialValue: current.categoryFirst,
                  } )(
                    <Select
                      style={{ width: 230 }}
                      placeholder="请输入商品分类"
                    >
                      {
                        codeList && codeList.map( ( item )=><Option key={item.id} value={item.id}>{item.name}</Option> )
                      }
                    </Select> )}
                </FormItem>

                <FormItem label='商品类型' {...this.formLayout}>
                  {getFieldDecorator( 'goodsType', {
                    rules: [{ required: true, message: `请先输入商品类型` }],
                    initialValue: current.goodsType,
                  } )(
                    <Select
                      disabled
                      style={{ width: 230 }}
                      placeholder="请选择商品类型"
                    >
                      {
                      Object.keys( productObj ).map( ( key ) =>(
                        <Option key={key} value={key} name={productObj[key]}>{productObj[key]}</Option>
                      ) )
                      }
                    </Select>

                     )}
                  <span style={{ marginLeft: '5px' }}>*保存后，商品类型将无法更改</span>
                </FormItem>
                <FormItem label='热门精选' {...this.formLayout}>
                  {getFieldDecorator( 'topPick', {
                    rules: [{ required: false, message: `请先选择热门精选` }],
                    initialValue: current.topPick,
                  } )(
                    <RadioGroup>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </RadioGroup>

                  )}
                </FormItem>
                <FormItem label='需要积分数量' {...this.formLayout}>
                  {getFieldDecorator( 'salesPrice', {
                    rules: [{ required: true, message: `请先输入需要积分数量` }],
                    initialValue: current.salesPrice,
                  } )(
                    <InputNumber
                      placeholder="输入需要积分数量"
                      style={{ width: 230 }}
                      min={0}
                      max={99999999}
                    />
                  )}
                </FormItem>
                <FormItem label='可兑换数量' {...this.formLayout}>
                  {getFieldDecorator( 'exchange', {
                    rules: [{ required: false, message: `请先输入商品可兑换数量` }],
                    initialValue: current.exchange,
                  } )(
                    <InputNumber
                      placeholder="不输入则表示不限制兑换数量"
                      style={{ width: 230 }}
                      min={0}
                      max={999999}
                    />
                  )}
                </FormItem>
                <FormItem label='折扣配置' {...this.formLayout}>
                  {getFieldDecorator( 'userLevels', {
                    rules: [{ required: false, message: `请先输入商品可兑换数量` }],
                    initialValue: current.userLevels,
                  } )(
                    <DiscountConfig
                      userLevelList={userLevelList}
                      userLevels={this.props.form.getFieldValue( 'userLevels' ) || current.userLevels}
                      oriPrice={this.props.form.getFieldValue( 'salesPrice' )}
                      changeConfig={this.changeConfig}
                    />
                  )}
                </FormItem>
                <FormItem label='折扣时间' {...this.formLayout}>
                  {getFieldDecorator( 'discountTime', {
                    rules: [{ required: false, message: `请先输入商品可兑换数量` }],
                    initialValue: current.discountStart && current.discountEnd  && [moment( current.discountStart ), moment( current.discountEnd )],
                  } )(
                    <RangePicker showTime />                  )}
                </FormItem>
                <FormItem label='商品库存' {...this.formLayout}>
                  {getFieldDecorator( 'stock', {
                    rules: [{ required: true, message: `请不要超过仓库商品库存` }],
                    initialValue: current.stock,
                  } )(
                    <InputNumber
                      placeholder="输入商品库存"
                      style={{ width: 230 }}
                      min={0}
                      max={maxInventory}
                    />
                  )}
                  <div style={{ color: 'red' }}>库存：{maxInventory}</div>
                </FormItem>
                {/* {
                  ( current.goodsType === '1' || goodsTypeState === '1' ) && (
                    <FormItem label='卡券批次id' {...this.formLayout}>
                      {getFieldDecorator( 'spuCode', {
                        rules: [{ required: true, message: `请先输入卡券批次id` }],
                        initialValue: current.spuCode,
                      } )(
                        <Input
                          placeholder="输入卡券批次id"
                        />
                      )}
                    </FormItem>
                  )
                } */}

                {/* {
                  ( current.goodsType === '0' || goodsTypeState === '0' ) && (
                    <FormItem label='销售价' {...this.formLayout}>
                      {getFieldDecorator( 'amount', {
                        rules: [{ required: true, message: `请先输入商品销售价` }],
                        initialValue: current.amount,
                      } )(
                        <InputNumber
                          placeholder="输入商品销售价"
                          style={{ width: 230 }}
                          min={0}
                          max={99999999}
                        />
                      )}
                    </FormItem>
                  )
                }
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
                </FormItem> */}
                <FormItem label="商品图片" {...this.formLayout}>
                  {getFieldDecorator( 'picUrls', {
                    rules: [{ required: true, message: `请先上传商品图片` }],
                    initialValue: current.picUrls || [],
                  } )( <UploadModal fileLength={5} onChanges={urls => this.uploadImg( urls )} value={picUrls || []} /> )}
                </FormItem>
                {/* <FormItem label='是否上架' {...this.formLayout}>
                  {getFieldDecorator( 'shelf', {
                    rules: [{ required: true, message: `请先输入商品编码` }],
                    valuePropName: 'checked',
                    initialValue: current.shelf === '1'
                  } )(
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                  )}
                </FormItem> */}
                {/* <FormItem label='是否上架' {...this.formLayout}>
                  {getFieldDecorator( 'shelf', {
                    rules: [{ required: true, message: `请先输入商品编码` }],
                    valuePropName: 'checked',
                    initialValue: current.shelf === '1'
                  } )(
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                  )}
                </FormItem>
                <FormItem label='定时上下架' {...this.formLayout}>
                  {getFieldDecorator( 'stockTime', {
                    rules: [{ required: false, message: `请先输入商品库存` }],
                    initialValue: current.onStartTime ? [moment( current.onStartTime ), moment( current.onEndTime )] : '',
                  } )(
                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"  />
                  )}
                </FormItem>
                <FormItem label='发货供应商' {...this.formLayout}>
                  {getFieldDecorator( 'supplier', {
                    rules: [{ required: true, message: '请先输入发货供应商' }],
                    initialValue: current.supplier,
                  } )(
                    <Input
                      style={{ width: 230 }}
                      placeholder="请输入发货供应商"
                    />
                  )}
                </FormItem> */}
                {/* <FormItem label='客群展示' {...this.formLayout}>
                  {getFieldDecorator( 'clientGroupIds', {
                    rules: [{ required: true, message: '请先选择客群展示' }],
                    initialValue: current.clientGroupIds ? current.clientGroupIds.length > 0 && current.clientGroupIds.split( ',' ) : 'ALL',
                  } )(
                    <Select
                      mode="multiple"
                      placeholder="请选择客群展示"
                      style={{ width: '100%' }}
                    >
                      <Option value="ALL">全部客群</Option>
                      {
                        customerList && customerList.length > 0 && customerList.map( item => (
                          <Option value={`${item.id}`}>{item.name}</Option>
                        ) )
                      }
                    </Select>
                  )}
                </FormItem> */}
                {/* <FormItem label='项目账户' {...this.formLayout}>
                  {getFieldDecorator( 'integralAccountIds', {
                    rules: [{ required: true, message: '请先选择项目账户' }],
                    initialValue: current.integralAccountIds,
                  } )(
                    <Select
                      placeholder="请选择项目账户"
                      style={{ width: '100%' }}
                    >
                      {
                        accountList && accountList.length > 0 && accountList.map( item => (
                          <Option value={item.id}>{item.name}</Option>
                        ) )
                      }
                    </Select>
                  )}
                </FormItem> */}
                <FormItem label='商品描述' {...this.formLayout}>
                  {getFieldDecorator( 'description', {
                    rules: [{ required: true, message: `请先输入商品描述` }],
                    initialValue: nowProductDesc,
                  } )(
                    <BraftEditor record={nowProductDesc} fieldDecorator={getFieldDecorator} field="introduction" />
                  )}
                </FormItem>
                <FormItem label='售后须知' {...this.formLayout}>
                  {getFieldDecorator( 'notice', {
                    rules: [{ required: true, message: `请先输入售后须知` }],
                    initialValue: current.notice,
                  } )(
                    <BraftEditor record={current.notice} fieldDecorator={getFieldDecorator} field="introduction" />
                  )}
                </FormItem>
              </Form>
              <ConfirmModal visible={confirmVisible} text={current.id ? '修改' : '添加'} cancel={this.cancelConfirm} confirm={this.handleSubmit} />
              <Modal
                maskClosable={false}
                title="商品选择"
                width={840}
                bodyStyle={{ padding: '28px 0 0', minHeight: '30vh', maxHeight:'72vh' }}
                destroyOnClose
                visible={modalVisible}
                onCancel={this.cancelRightPop}
                footer={null}
              >
                <RightPop rightItem={rightItem} cancel={this.cancelRightPop} onChoose={this.chooseRight} />
              </Modal>
            </Modal>
          ) : null
        }
      </GridContent>
    )
  }
}

export default Product

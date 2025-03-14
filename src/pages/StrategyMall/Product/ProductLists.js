import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {
  Card, Input, Button, Modal, Form,
  InputNumber, Select, Radio, Table, Icon, Tooltip,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import AvatarDemo from '../Avatar/AvatarDemo';
import PackageModal from './PackageModal'
import 'braft-editor/dist/index.css';
import styles from '../Lists.less';
import modalStyles from './ProductModal.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { confirm } = Modal;
const { Option  } = Select;


const stateObj = {
  "": formatMessage( { id: 'strategyMall.product.state.all' } ),
  "ENABLE": formatMessage( { id: 'strategyMall.product.state.ENABLE' } ),
  "DISABLE": formatMessage( { id: 'strategyMall.product.state.DISABLE' } ),
}


// const typeObj = {
//   "PERMISSION": formatMessage({ id: 'strategyMall.product.PERMISSION' }),
// }

const payTypeObj = {
  "CHARGES": formatMessage( { id: 'strategyMall.product.PAYTYPE.CHARGES' } ),
  "FREE": formatMessage( { id: 'strategyMall.product.PAYTYPE.FREE' } ),
  "OPEN": formatMessage( { id: 'strategyMall.product.PAYTYPE.OPEN' } ),
}

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  datas: strategyMall.datas,
  specsList: strategyMall.specsList,
  ProductsRights: strategyMall.ProductsRights,
  categorieList: strategyMall.categorieList,
} ) )
@Form.create()
class ProductLists extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    listType: '',
    visible: false,
    expandedRowKeys: [],
    openId: null,
    sortedInfo: {},
    showImages: '',
    isMoreContent: false,
    selectMore: true,
    isShow:false,
    isSave:false,
    productId: '',
  };

  fetchInit={
    pageNum: 1,
    pageSize: 10,
    listType: '',
    sortedInfo: {},
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 },
  };


  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchList();
    dispatch( {
      type: 'strategyMall/getProductsRights',
      payload: {},
    } );

    // 获取类别
    dispatch( {
      type: 'strategyMall/getCategories',
      payload: {},
    } );
  }

  // 改变产品状态
  changeListType = ( e ) => {
    const listType = e.target.value;
    this.setState( { ...this.fetchInit, listType, openId: null }, ()=>this.fetchList() )
  }

  // 获取列表
  fetchList = () => {
    const { pageNum, listType, pageSize, sortedInfo={} } = this.state;
    const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc'
    const { dispatch } = this.props;
    const { openId } = this.state;
    dispatch( {
      type: 'strategyMall/getProducts',
      payload: {
        pageNum,
        pageSize,
        state: listType,
        orderBy: sortedInfo.columnKey ? `${ sortedInfo.columnKey || '' } ${ sortValue }`: 'sort desc',
      },
    } );

    if ( openId === null  ) {
      // 不获取规格
      this.setState( {
        expandedRowKeys: [],
        openId: null,
      } );
    } else {
      this.fetchSpecs( openId );
    }
  }

  // 展开触发
  onExpandFunc = ( expanded, id ) => {
    const { dispatch } = this.props;
    if ( expanded ) {
      this.fetchSpecs( id );
      this.setState( { openId: id } );
    } else {
      dispatch( {
        type: 'strategyMall/clearSpecs',
        payload: [],
      } );
      this.setState( { openId: null } );
    }
  }

  // 获取规格
  fetchSpecs = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getSpecs',
      payload: {
        id,
      },
    } );
  }

  // 改变付费类型
  changePayType = ( e, id ) => {
    const { showImages } = this.state;
    const { datas: { list } } = this.props;
    const obj = list.find( o => o.id === id );
    let PImages = [];
    if ( id ) {
      PImages = obj.permissions && obj.permissions.length && obj.permissions.map( item=> item.cover )
    } else {
      PImages = showImages;
    }
    if ( e.target.value === 'FREE' ) {
      this.setState( { selectMore: false, isMoreContent: false } );
      if ( typeof showImages !== 'string' && showImages.length !== 1 ) {
        this.setState( { showImages: showImages[0] } );
      }
    } else {
      this.setState( { selectMore: true, showImages: PImages } );
      if ( id && obj.permissions.length > 1 ) {
        this.setState( { isMoreContent: true } );
      }
    }
  }

  // 展开
  expandedRowRender = () => {
    const { specsList } = this.props;

    return (
      <div className={styles.specs}>
        <div className={styles.specsTit}>{formatMessage( { id: 'strategyMall.product.specs' } )}: </div>
        <div className={styles.specsBox}>
          {
            specsList.map( item => {
              const Price = item.salePrice === 0 ? 0 : item.salePrice || item.price;
              return (
                <div className={styles.specsCard} key={item.id}>
                  <div className={styles.specsCardTop}>
                    <span className={styles.specsCardTit}>{item.name}</span>
                    <Icon style={{ marginLeft: '5px' }} type={item.state === 'ENABLE' ? 'check-circle' : 'stop'} theme="twoTone" />
                  </div>
                  <div className={styles.specsCardText}>
                    <div className={styles.p} style={{ display:'flex', alignItems:'center' }}>
                      ￥: {Price.toFixed( 2 )}
                      {( !!item.salePrice || item.salePrice === 0 ) && <del style={{ fontSize:12, marginLeft:8, color:'#999' }}> {item.price.toFixed( 2 )}</del> }
                    </div>
                    
                    <div>{item.sellCount}单</div>
                  </div>

                </div>
              )
            } )
          }
        </div>
      </div>
    );
  }

  // 更改展开项
  onExpandedRowsChange = ( expandedRows ) => {
    const newIndex = expandedRows[expandedRows.length - 1];
    if ( newIndex ) {
      this.setState( { expandedRowKeys: [newIndex] } );
    } else {
      this.setState( { expandedRowKeys: [] } );
    }
  }

  // 删除: 产品(product)、规格(specs)
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { listType, productId } = this.state;
    const { datas: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        dispatch( {
          type: 'strategyMall/delProduct',
          payload: {
            id,
            callFunc: () => {
              $this.setState( { ...$this.fetchInit, listType }, ()=> $this.fetchList() )
              $this.fetchSpecs( productId )
            },
          },
        } );
      },
    } );
  }

  // 显示新建遮罩层：产品(product)、规格(specs)
  showModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
      showImages: '',
      openId:null,
      isSave:false
    } );
  };

  // 显示编辑遮罩层：产品(product)、规格(specs)
  showEditModal = ( e, id ) => {
    e.stopPropagation();
    const { datas: { list } } = this.props;
    const obj = list.find( o => o.id === id );

    //  获取图片
    const { content } = obj;
    const PImages = obj.permissions && obj.permissions.length && obj.permissions.map( item=> item.cover );
    if ( content.split( ',' ).length > 1 ) {
      this.setState( { isMoreContent: true } );
    } else {
      this.setState( { isMoreContent: false } );
    }

    this.setState( {
      visible: true,
      current: obj,
      showImages: obj.cover || PImages,
      openId:null,
      selectMore: obj.payType === 'CHARGES',
      isShow:true,
      productId:id,
      isSave:false
    } );
    this.fetchSpecs( id )
  };

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      expandedRowKeys: [],
      isShow:false,
      isSave:false
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
      const content = fieldsValue.content.toString();
      const params = id ? Object.assign( { ...fieldsValue, content, type: 'PERMISSION', id } )
       : { ...fieldsValue, content, type: 'PERMISSION' };
      dispatch( {
        type: 'strategyMall/submitProduct',
        payload: {
          params,
          callFunc: ( result ) => {
            $this.setState( {
              visible:params.payType === 'CHARGES',
              current: result || current,
              isShow:true,
              productId:result.id || id,
              isSave:true
            } );
            $this.fetchList();
            $this.fetchSpecs( result.id || id )
          },
        },
      } );
    } );
  };

  tableChange = ( pagination, filters, sorter ) =>{
    const sotrObj = { order:'descend', ...sorter, }
    const { current, pageSize } = pagination;
    this.setState( {
      sortedInfo: sotrObj,
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  }


  moreContentChange = ( keys ) =>{
    const { ProductsRights } = this.props;
    const PImages = [];
    ProductsRights.list.forEach( item => {
      if( keys.find( value => value === item.id.toString() ) ){
        PImages.push( item.cover )
      }
    } )
    this.setState( { showImages: PImages } );
    if ( keys.length > 1 ) {
      this.setState( { isMoreContent: true } );
    } else {
      this.setState( { isMoreContent: false } );
    }
  }

  contentChange = ( value ) =>{
    const { ProductsRights } = this.props;
    const PImages = [];
    ProductsRights.list.forEach( item => {
      if( value === item.id.toString() ){
        PImages.push( item.cover )
      }
    } )
    this.setState( { showImages: PImages } );
  }

  render() {
    const {
      loading, datas: { total, list }, ProductsRights,
      form: { getFieldDecorator }, categorieList,
    } = this.props;

    const {
      pageSize, pageNum, listType, visible, current = {},
      expandedRowKeys,
      sortedInfo, showImages,
      isMoreContent, selectMore,
      isShow, productId, isSave
    } = this.state;

    const extraContent = (
      <div className={styles.extraContent}>
        <span>{formatMessage( { id: 'strategyMall.product.state' } )}：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={listType}>
          <RadioButton value="">{stateObj['']}</RadioButton>
          <RadioButton value="ENABLE">{stateObj.ENABLE}</RadioButton>
          <RadioButton value="DISABLE">{stateObj.DISABLE}</RadioButton>
        </RadioGroup>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      // onChange: this.changePageNum,
      // onShowSizeChange: this.onShowSizeChange,
    };

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: ( e ) => this.handleSubmit( e ),
      onCancel: this.handleCancel
    }

    const modalTitle = (
      <div>
        <span>{current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}{`${formatMessage( { id: 'strategyMall.product.tit' } )}${!current.name ? '' : `：${current.name}`}`}</span>
      </div>
    )

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
        width: 80,
        render: ( cover, record ) => {
          const PImages = record.permissions && record.permissions.length && record.permissions.map( item=> item.cover )
          const images = cover || PImages;
          return(
            <AvatarDemo src={images} />
          )
        },
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.name' } )}</span>,
        dataIndex: 'name',
        width: 150,
        render: name => <span>{name}</span>,
      },
      {
        title: <span>厂商</span>,
        dataIndex: 'permissions',
        render: ( permissions = [] ) => {
          const text = [];
          permissions.forEach( item => {if( item.vendorOptions ) {text.push( item.vendorOptions )}} );
          return(
            <span>{text && text.join( '/' ) ? text.join( '/' ) : '--'}</span>
          )
        },
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.category' } )}</span>,
        dataIndex: 'category',
        width: 150,
        render: category => {
          const obj = category && ( categorieList.find( item => item.id.toString() === category.toString() ) || {} )
          return(
            <span>{ ( obj && obj.name ) ? obj.name : '--'}</span>
          )
        },
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.sort' } )}</span>,
        dataIndex: 'sort',
        key: 'sort',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'sort' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: sort => <span>{sort}</span>
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.hot' } )}</span>,
        dataIndex: 'hot',
        key: 'hot',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'hot' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: hot => <span>{hot || '--'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.state' } )}</span>,
        dataIndex: 'state',
        key: 'state',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'state' && sortedInfo.order,
        // sortDirections: ['descend', 'ascend'],
        render: state => (
          <span>{state === 'ENABLE' ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> ),
      },
     
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.buyLevel' } )}</span>,
        dataIndex: 'buyLevel',
        key:'buy_level',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'buy_level' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: buyLevel => {
         const buyLevelObj =  window.RISKLEVEL.find( ( item )=>item.key===buyLevel );
         return( <span>{buyLevelObj ? buyLevelObj.value : ''}</span> )
        },
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.description' } )}</span>,
        dataIndex: 'description',
        width: 180,
        render: description => <span>{description}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.createTime' } )}</span>,
        dataIndex: 'createTime',
        key:'create_time',
        width: 130,
        // sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        width: 80,
        render: id => (
          <div>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
              onClick={( e ) => this.showEditModal( e, id )}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', marginRight: 15, color:'#f5222d' }}
              onClick={( e ) => this.deleteItem( e, id )}
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
            extra={extraContent}
            title={formatMessage( { id: 'menu.strategyMall.productlist' } )}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
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
              // scroll={{ x: 1600 }}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              expandedRowKeys={expandedRowKeys}
              onExpandedRowsChange={expandedRows => this.onExpandedRowsChange( expandedRows )}
              onExpand={( expanded, record ) => this.onExpandFunc( expanded, record.id )}
              expandedRowRender={this.expandedRowRender}
              expandRowByClick
              onChange={this.tableChange}
            />
          </Card>
        </div>
        {
          visible?
            <Modal
              maskClosable={false}
              title={modalTitle}
              className={modalStyles.standardListForm}
              width='100%'
              style={{ top:0, height: '100%', paddingBottom: 0 }}
              bodyStyle={{ height: '100%' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
              footer={null}
            >
              <div className={styles.formFullHeight}>
                <div>
                  <p style={{ fontSize:16, textAlign:'center' }}>基本设置</p>
                  <Form onSubmit={( e ) => this.handleSubmit( e )}>
                    <FormItem label={formatMessage( { id: 'strategyMall.product.category' } )} {...this.formLayout}>
                      {getFieldDecorator( 'category', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.category' } )}` }],
                          initialValue: current.category,
                        } )(
                          <Select 
                            placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.category' } )}`} 
                            disabled={isSave}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                          >
                            {
                              categorieList.map( item => (
                                <SelectOption key={item.id}>{item.name}</SelectOption>
                              ) )
                            }
                          </Select> 
                        )}
                    </FormItem>
                    <FormItem label={formatMessage( { id: 'strategyMall.product.name' } )} {...this.formLayout}>
                      {getFieldDecorator( 'name', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.name' } )}` }],
                        initialValue: current.name,
                      } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.name' } )}`} disabled={isSave} /> )}
                    </FormItem>
                    <FormItem {...this.formLayout} label={formatMessage( { id: 'strategyMall.product.subTitle' } )}>
                      {getFieldDecorator( 'description', {
                        rules: [{ required: true, max: 200, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.subTitle' } )}` }],
                        initialValue: current.description,
                      } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.subTitle' } )}`} disabled={isSave} /> )}
                    </FormItem>
                    <FormItem {...this.formLayout} label={formatMessage( { id: 'strategyMall.product.payType' } )}>
                      {getFieldDecorator( 'payType', {
                        rules: [{ required: true, max: 200, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.payType' } )}` }],
                        initialValue: current.payType,
                      } )(
                        <RadioGroup onChange={( e ) => this.changePayType( e, current.id )} disabled={isSave}>
                          <Radio value="CHARGES">{payTypeObj.CHARGES}</Radio>
                          <Radio value="FREE">{payTypeObj.FREE}</Radio>
                          <Radio value="OPEN" disabled>
                            {payTypeObj.OPEN}&nbsp;
                            <Tooltip title="选择付费，并设置套餐为0元，用户0元购买">
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <FormItem
                      label={(
                        <span>
                          {`包含${formatMessage( { id: 'strategyMall.product.content' } )}`}&nbsp;
                          <Tooltip title="商品包含的工具，多选则表示组合销售">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                          )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'content', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.content' } )}` }],
                            initialValue: current.content ? current.content.split( ',' ) : undefined,
                          } )(
                            selectMore ? 
                              <Select 
                                style={{ width: '90%' }} 
                                allowClear
                                disabled={isSave}
                                onChange={this.moreContentChange}
                                mode='multiple'
                                placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.content' } )}`}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                              >
                                {
                                  ProductsRights.list.map( item => (
                                    <SelectOption key={item.id.toString()}>{item.name}</SelectOption>
                                  ) )
                                }
                              </Select> :
                              <Select 
                                style={{ width: '90%' }}
                                disabled={isSave} 
                                onChange={this.contentChange}
                                placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.content' } )}`}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                              >
                                {
                                  ProductsRights.list.map( item => (
                                    <Option key={item.id.toString()}> {item.name}</Option>
                                  ) )
                                }
                              </Select>
                          )}
                      <span style={{ margin: '0 13px', color: 'red' }}>{isMoreContent ? '组合' : '单品'}</span>
                    </FormItem>
                    <FormItem
                      label={(
                        <span>
                          {formatMessage( { id: 'strategyMall.product.cover' } )}&nbsp;
                          <Tooltip title="默认为工具的LOGO，也可自定义上传">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'cover', {
                        rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.cover' } )}` }],
                        initialValue:current.cover,
                      } )( <UploadImg disabled={isSave} />
                      )}
                      {
                        !( current.cover ) &&
                        <div className={modalStyles.AvatarDemo}>
                          <AvatarDemo src={showImages} size={200} />
                        </div>
                      }
                    </FormItem>
                    {
                      selectMore && 
                      <div>
                        <FormItem label={formatMessage( { id: 'strategyMall.product.buyLevel' } )} {...this.formLayout}>
                          {getFieldDecorator( 'buyLevel', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.buyLevel' } )}` }],
                            initialValue: current.buyLevel,
                          } )(
                            <Select
                              placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.buyLevel' } )}`} 
                              disabled={isSave}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                              {
                                window.RISKLEVEL.map( ( item ) =>(
                                  <SelectOption key={item.key} value={item.key}>{item.value}</SelectOption>
                                ) )
                              }
                            </Select>
                          )}
                        </FormItem>
                        <FormItem {...this.formLayout} label={formatMessage( { id: 'strategyMall.product.detail' } )}>
                          {getFieldDecorator( 'introduction', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.detail' } )}` }],
                          initialValue: current.introduction,
                        } )(
                          <BraftEditor record={current.introduction} readOnly={isSave} fieldDecorator={getFieldDecorator} field="introduction" />
                        )}
                        </FormItem>
                        <FormItem label='自定义介绍链接' {...this.formLayout}>
                          {getFieldDecorator( 'customizeLink', {
                          rules: [],
                          initialValue: current.customizeLink,
                        } )( <Input disabled={isSave} /> )}
                        </FormItem>
                        <FormItem
                          label={(
                            <span>
                            购买基数&nbsp;
                              <Tooltip title={(
                                <div>设置购买基数（配合运营展示）。<br />前端展示购买数 = 实际购买数量 + 购买基数；</div>
                            )}
                              >
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </span>
                            )}
                          {...this.formLayout}
                        >
                          {getFieldDecorator( 'baseCount', {
                          rules: [],
                          initialValue: current.baseCount,
                        } )( <Input disabled={isSave} /> )}
                        </FormItem>
                      </div>
                    }
                    <FormItem label='人气值' {...this.formLayout}>
                      {getFieldDecorator( 'hot', {
                        rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.hot' } )} ` }],
                        initialValue: current.hot,
                      } )( <InputNumber step={1} max={5} min={0} disabled={isSave} /> )}
                    </FormItem>

                    <FormItem 
                      label={(
                        <span>
                          {formatMessage( { id: 'strategyMall.product.sort' } )}&nbsp;
                          <Tooltip title="数值越大越靠前">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                        )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'sort', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.sort' } )},最小值为0，最大值为99 ` }],
                            initialValue: current.sort,
                          } )( <InputNumber step={1} disabled={isSave} min={0} max={99} /> )}
                    </FormItem>
                    <FormItem label={formatMessage( { id: 'strategyMall.product.state' } )} {...this.formLayout}>
                      {getFieldDecorator( 'state', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.state' } )}` }],
                          initialValue: current.state || 'ENABLE',
                        } )(
                          <RadioGroup disabled={isSave}>
                            <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                            <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                          </RadioGroup>
                        )}
                    </FormItem>
                      
                    <FormItem>
                      <div style={{ textAlign:'right', marginRight:30 }}>
                        <Button type='primary' disabled={isSave} onClick={( e ) => this.handleSubmit( e )}>保存</Button>
                      </div>
                    </FormItem>

                  </Form>  
                </div> 

                {
                  ( isShow && selectMore )  && <PackageModal productId={productId} />
                }
              </div>
            </Modal>:null
          }
      </GridContent>
    );
  }
}

export default ProductLists;

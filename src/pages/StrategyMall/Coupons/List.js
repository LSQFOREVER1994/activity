import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Input, Button, Modal, Form, Table, InputNumber,
  Radio, DatePicker, Card, Select, Icon, Tooltip,
  TreeSelect, message,
} from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SendCoupons from './SendCoupons';
import styles from '../Lists.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { confirm } = Modal;
const { Option } = Select;

const stateObj = {
  "": formatMessage( { id: 'strategyMall.product.state.all' } ),
  ENABLE: formatMessage( { id: 'strategyMall.product.state.ENABLE' } ),
  DISABLE: formatMessage( { id: 'strategyMall.product.state.DISABLE' } ),
}
const stopSendObj = {
  true: formatMessage( { id: 'strategyMall.coupons.true' } ),
  false: formatMessage( { id: 'strategyMall.coupons.false' } ),
}
const typeObj = {
  "": formatMessage( { id: 'strategyMall.product.state.all' } ),
  RATE: formatMessage( { id: 'strategyMall.coupons.type.RATE' } ),
  FIXED: formatMessage( { id: 'strategyMall.coupons.type.FIXED' } ),
  EXCHANGE: formatMessage( { id: 'strategyMall.coupons.type.EXCHANGE' } ),
}

@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  coupons: strategyMall.coupons,
  goodsList: strategyMall.goodsList,
  goodsSpecsTree: strategyMall.goodsSpecsTree,
} ) )
@Form.create()
class CouponsList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    couponsType: 'RATE',
    listType: '',
    addInventory: false,
    inventoryValue: 0,
    expType: 'TIME'
  };

  fetchInit = {
    pageNum: 1,
    pageSize: 10,
    listType: '',
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentWillMount() {
    this.fetchList();
  }

  //  获取列表
  fetchList = () => {
    const { pageNum, pageSize, listType } = this.state;
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getCoupons',
      payload: {
        pageNum,
        pageSize,
        type: listType,
        orderBy:"create_time desc", // 页面没有时间筛选，排序方式写死
      },
    } );
    // 获取商品下套餐(tree)
    dispatch( {
      type:'strategyMall/getgoodsSpecs'
    } )
  }

  // //  pageSize  变化的回调
  // onShowSizeChange = (current, pageSize) => {
  //   const { listType } = this.state;
  //   this.setState({ pageSize, pageNum: 1 });
  //   this.fetchList(1, pageSize, listType);
  // }

  // //  页码变化回调
  // changePageNum = (pageNum) => {
  //   const { pageSize, listType } = this.state;
  //   this.setState({ pageNum });
  //   this.fetchList(pageNum, pageSize, listType);
  // }

  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current,
      pageSize,
    }, ()=>this.fetchList() );
  }

  //  删除
  deleteItem = ( id ) => {
    const $this = this;
    const { coupons: { list }, dispatch } = this.props;
    const obj = list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        dispatch( {
          type: 'strategyMall/delCoupons',
          payload: {
            id,
            callFunc: () => {
              $this.setState( { ...$this.fetchInit }, ()=>$this.fetchList() )
            },
          },
        } );
      },
    } );
  }

  //  显示新建遮罩层
  showModal = () => {
    this.getGoods()
    this.setState( {
      visible: true,
      current: undefined,
      couponsType: 'RATE',
      expType: 'TIME'
    } );
  };

  //  显示编辑遮罩层
  showEditModal = ( obj ) => {
    // this.getGoods()
    this.setState( {
      visible: true,
      current: obj,
      couponsType: obj.type,
      expType: obj.expType
    } );
  };

  // 获取商品
  getGoods = () =>{
    const { dispatch } = this.props;
    dispatch( {
      type:'strategyMall/searchGoods',
      payload:{
        keyword:'',
        pageSize:1000,
        orderBy: 'sort desc',
      }
    } )
  }

  //  取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      current: undefined,
      expType: 'TIME'
    } );
  };

  //  提交：商品(product)、规格(specs)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { type, matchCondition, breaks }=fieldsValue;
      if( type === 'FIXED' && ( +matchCondition < +breaks ) ){
        message.error( '满金额要大于减金额' )
        return;
      }
      let params = {};
      if( id ){
        params = Object.assign( fieldsValue, { id } );
        delete params.type;
      }else{
        params = fieldsValue;
      }

      params.expTime = fieldsValue.expTime ? fieldsValue.expTime.format( "YYYY-MM-DD HH:mm:ss" ) : '';
      params.receiveDeadTime = fieldsValue.receiveDeadTime ? fieldsValue.receiveDeadTime.format( "YYYY-MM-DD HH:mm:ss" ) : '';

      dispatch( {
        type: 'strategyMall/submitCoupons',
        payload: {
          params,
          callFunc: () => {
            $this.setState( {
              visible: false,
              current: undefined,
              expType: 'TIME'
            } );
            $this.fetchList();
          },
        },
      } );
    } );
  };

  //  时间是否 更改判断
  // disabledEndDate = ( time ) => {
	// 	return time < moment().subtract( 1, 'days' );
  // }

  // 显示最新优惠券
  showSendModal = ( id ) =>{
    const { dispatch } = this.props;
    dispatch( {
      type:'strategyMall/setSendCouponsVisible',
      payload: true,
    } )
    const { coupons: { list } } = this.props;
    const obj = list.find( o => o.id === id );
    this.setState( {
      current: obj,
    } );
  }

  //  切换过期类型
  expTypeChange = ( e ) => {
    this.setState( { expType: e.target.value } )
  }

  // 优惠券类型改变
  typeChange = ( e )=>{
    this.setState( { couponsType: e.target.value } )
  }

  // 筛选优惠券类型
  changeListType = ( e ) => {
    const listType = e.target.value;
    this.setState( { ...this.fetchInit, listType }, ()=>this.fetchList() )
  }

  addInventory = ( id ) =>{
    const { coupons: { list } } = this.props;
    const obj = list.find( o => o.id === id );
    this.setState( {
      current: obj,
    } );
    this.setState( { addInventory: true } )
  }

  addInventoryCancel = () =>{
    this.setState( { addInventory: false, inventoryValue: '' } )
  }

  addInventoryOk = () =>{
    const { dispatch } = this.props;
    const { current, inventoryValue } = this.state;
    this.setState( { addInventory:false } );
    this.setState( { inventoryValue: '' } );
    dispatch( {
      type:'strategyMall/putInventories',
      payload: {
        params: { id: current.id, count: inventoryValue },
        callFunc: ()=>{
          this.fetchList();
        }
      }
    } )
  }

  inventoryValueChange = ( value ) =>{
    this.setState( { inventoryValue: value } )
  }

  renderInfo = ( breaks, record ) =>{
    const { goodsSpecsTree } = this.props;
    let productName = '';
    let specName = ''
    if( record.type === 'RATE' ){
      return (
        <span>{breaks} 折</span>
      )
    }if( record.type === 'FIXED' ){
      return (
        <span>满 {record.matchCondition} 减 {breaks}</span>
      )
    }

    goodsSpecsTree.forEach( item =>{
      if( `p_${record.productId}` === item.key ){
        productName = item.title;
        item.children.forEach( spec =>{
          if( record.specId === spec.key ){
            specName = spec.title
          }
        } )
      }
    } )
      return(
        <span>兑换: {productName}（{specName}）</span>
      )
  }

  render() {
    const {
      loading, coupons: { total, list }, form: { getFieldDecorator }, goodsList, goodsSpecsTree
    } = this.props;
    const { pageSize, pageNum, visible, current = {}, couponsType, listType, addInventory, inventoryValue, expType } = this.state;
    const extraContent = (
      <div className={styles.extraContent}>
        <span>{formatMessage( { id: 'strategyMall.coupons.type' } )}：</span>
        <RadioGroup onChange={this.changeListType} defaultValue={listType}>
          <RadioButton value="">{typeObj['']}</RadioButton>
          <RadioButton value="RATE">{typeObj.RATE}</RadioButton>
          <RadioButton value="FIXED">{typeObj.FIXED}</RadioButton>
          <RadioButton value="EXCHANGE">{typeObj.EXCHANGE}</RadioButton>
        </RadioGroup>
      </div>
    );

    // table pagination
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
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>ID</span>,
        dataIndex: 'id',
        key: 'ID',
        width: 80,
        fixed: 'left',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.name' } )}</span>,
        dataIndex: 'name',
        width: 180,
        fixed: 'left',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.state' } )}</span>,
        dataIndex: 'state',
        render: state => (
          <span>{state==='ENABLE' ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color:'red' }} type="close-circle" />}
          </span> ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.type' } )}</span>,
        dataIndex: 'type',
        render: type => <span>{typeObj[type]}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.breaks' } )}</span>,
        dataIndex: 'breaks',
        // render: (breaks, record ) => (
        //   <span>{
        //   record.type === 'RATE' ? `${breaks} 折` :
        //   `满 ${record.matchCondition} 减 ${breaks}`
        // }
        //   </span>)
        width:260,
        render: ( breaks, record ) => this.renderInfo( breaks, record )
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.inventory' } )}</span>,
        dataIndex: 'inventory',
        render: ( inventory, record )=> (
          <span>{inventory}
            <Tooltip title='添加库存'>
              <Icon
                onClick={()=>this.addInventory( record.id )}
                style={{ color: 'green', marginLeft: '10px', cursor: 'pointer' }}
                type="plus-circle"
              />
            </Tooltip>
          </span>
        ),
      },
      // {
      //   title: <span>{formatMessage({ id: 'strategyMall.coupons.userMaxReceive' })}</span>,
      //   dataIndex: 'userMaxReceive',
      //   render: userMaxReceive => <span>{userMaxReceive}</span>,
      // },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.sendCount' } )}</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.usedCount' } )}</span>,
        dataIndex: 'usedCount',
        render: sendCount => <span>{sendCount}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.createTime' } )}</span>,
        dataIndex: 'createTime',
        // width: 130,
        render: createTime => <span>{createTime}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.coupons.expTime' } )}</span>,
        dataIndex: 'expTime',
        render: ( expTime, record ) => <span>{expTime || `${record.expType === 'DAYS' ? `领取${record.receiveEffectiveDays}天后过期`:''}`}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        width: 90,
        fixed: 'right',
        render: ( id, item ) => (
          <div>
            <span
              style={{ display:'block', cursor:'pointer', color:'#1890ff' }}
              onClick={() => this.showEditModal( item )}
            >
              编辑
            </span>
            {
              ( item.expTime && moment().format( "YYYY-MM-DD HH:mm:ss" ) >= item.expTime ) || ( item.receiveEffectiveDays && item.receiveEffectiveDays <= 0 ) || ( item.state === 'DISABLE' ) ?
                <span style={{ display:'block', margin:'5px 0' }}>
                  {item.state === 'DISABLE' ? '已下架' : '已失效'}
                </span>
                :
                <span
                  style={{ display:'block', margin:'5px 0', cursor:'pointer', color:'#52c41a' }}
                  onClick={() => this.showSendModal( id )}
                >
                  发送
                </span>
            }
            <span
              style={{ display:'block', cursor:'pointer', color:'#f5222d' }}
              onClick={() => this.deleteItem( id )}
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
            extra={extraContent}
            title={formatMessage( { id: 'menu.strategyMall.coupons.list' } )}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showModal( 'product' )}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              size="large"
              rowKey="id"
              scroll={{ x: 1400 }}
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
          title={`${current.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label={formatMessage( { id: 'strategyMall.coupons.name' } )} {...this.formLayout}>
              {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.name' } )}` }],
                  initialValue: current.name,
                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.name' } )}`} /> )}
            </FormItem>

            <FormItem label={formatMessage( { id: 'strategyMall.coupons.type' } )} {...this.formLayout}>
              {getFieldDecorator( 'type', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.type' } )}` }],
                  initialValue: current.type || 'RATE',
                } )(
                  <RadioGroup disabled={!!current.id} onChange={this.typeChange}>
                    <Radio value="RATE">{typeObj.RATE}</Radio>
                    <Radio value="FIXED">{typeObj.FIXED}</Radio>
                    <Radio value="EXCHANGE">{typeObj.EXCHANGE}</Radio>
                  </RadioGroup>
                )}
            </FormItem>
            {
                couponsType === 'FIXED' &&
                  <FormItem
                    label={formatMessage( { id: 'strategyMall.coupons.full' } )}
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'matchCondition', {
                      rules: [{ required: true,
                        message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.full' } )}` }],
                        initialValue: current.matchCondition,
                    } )( <InputNumber disabled={!!current.id} step={0.01}  /> )}
                  </FormItem>
              }

            {
              couponsType !== 'EXCHANGE' &&
              <FormItem
                label={formatMessage( { id: couponsType === 'RATE' ? 'strategyMall.coupons.discount': 'strategyMall.coupons.subtract' } )}
                {...this.formLayout}
              >
                {getFieldDecorator( 'breaks', {
                  rules: [{ required: true,
                    message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: couponsType === 'RATE' ? 'strategyMall.coupons.discount': 'strategyMall.coupons.subtract' } )}` }],
                    initialValue: current.breaks,
                } )( <InputNumber 
                  disabled={!!current.id}
                  step={couponsType === 'RATE'? 0.05 : 0.01}
                  min={couponsType === 'RATE'? 0.1 : 0.01}
                  max={couponsType === 'RATE' ? 9.9 : 100}
                /> )}
              </FormItem>
            }
            {
                couponsType === 'EXCHANGE' ?
                  <FormItem
                    label={(
                      <span>
                        {formatMessage( { id: 'strategyMall.coupons.specs' } )}&nbsp;
                        <Tooltip title="指定套餐，则只能在该套餐用">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    )}
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'specId', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.specs' } )}` }],
                      initialValue: current.specId ? `${current.specId}`: undefined,
                    } )(
                      <TreeSelect
                        disabled={!!current.id}
                        style={{ width: 300 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={goodsSpecsTree}
                        placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.specs' } )}`}
                        treeDefaultExpandAll
                        // onChange={this.onChange}
                      />
                    )}
                  </FormItem>:
                  <FormItem
                    label={(
                      <span>
                        {formatMessage( { id: 'strategyMall.coupons.specifiedGoods' } )}&nbsp;
                        <Tooltip title="指定商品，则只能在该商品用">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                  )}
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'productId', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.specifiedGoods' } )}` }],
                      initialValue: current.productId,
                    } )(
                      <Select
                        disabled={!!current.id}
                        showSearch
                        style={{ width: 200 }}
                        placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.specifiedGoods' } )}`}
                        optionFilterProp="children"
                        allowClear
                        // onDropdownVisibleChange={this.getGoods}
                        // filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
                        filterOption={( input, option ) =>  option.props.children && option.props.children.indexOf( input ) >=0}
                      >
                        {
                          goodsList.length && goodsList.map( item=>(
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                          ) )
                        }
                      </Select>
                    )}
                  </FormItem>
              }

            <FormItem
              label={(
                <span>
                  {formatMessage( { id: 'strategyMall.coupons.endTime' } )}&nbsp;
                  <Tooltip title="默认为优惠券失效时间">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              {...this.formLayout}
            >
              {getFieldDecorator( 'receiveDeadTime', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.endTime' } )}` }],
                  initialValue: current.receiveDeadTime ? moment( current.receiveDeadTime ) : current.receiveDeadTime,
                } )(
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    // disabledDate={this.disabledEndDate}
                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.endTime' } )}`}
                  />
                )}
            </FormItem>
            <FormItem label='过期类型' {...this.formLayout}>
              {getFieldDecorator( 'expType', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.type' } )}` }],
                  initialValue: current.expType || expType,
                } )(
                  <RadioGroup disabled={!!current.id} onChange={this.expTypeChange}>
                    <Radio value="TIME">失效时间</Radio>
                    <Radio value="DAYS">有效天数</Radio>
                  </RadioGroup>
                )}
            </FormItem>
            {
                current.expType === 'TIME' || expType === 'TIME' ?
                  (
                    <FormItem label={formatMessage( { id: 'strategyMall.coupons.expTime' } )} {...this.formLayout}>
                      {getFieldDecorator( 'expTime', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.expTime' } )}` }],
                        initialValue: current.expTime ? moment( current.expTime ) : current.expTime,
                      } )(
                        <DatePicker
                          // disabled={current.id}
                          style={{ width: '100%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          // disabledDate={this.disabledEndDate}
                          placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.expTime' } )}`}
                        />
                      )}
                    </FormItem>
                  ) : (
                    <FormItem label='有效天数' {...this.formLayout}>
                      {getFieldDecorator( 'receiveEffectiveDays', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}有效天数` }],
                        initialValue: current.receiveEffectiveDays,
                      } )( <InputNumber disabled={!!current.id} min={1} /> )}
                    </FormItem>
                  )
              }

            {/* <FormItem label={formatMessage({ id: 'strategyMall.coupons.expTime' })} {...this.formLayout}>
                {getFieldDecorator('expTime', {
                        rules: [{ required: true, message: `${formatMessage({ id: 'form.select' })}${formatMessage({ id: 'strategyMall.coupons.expTime' })}`}],
                        initialValue: current.expTime ? moment(current.expTime) : current.expTime,
                      })(
                        <DatePicker
                          style={{ width: '100%' }}
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          disabledDate={this.disabledEndDate}
                          placeholder={`${formatMessage({ id: 'form.select' })}${formatMessage({ id: 'strategyMall.coupons.expTime' })}`}
                        />
                      )}
              </FormItem> */}

            {/* <FormItem
                label={(
                  <span>
                    {formatMessage({ id: 'strategyMall.coupons.userMaxReceive' })}&nbsp;
                    <Tooltip title="可领取数量大于0，则会展示在领券中心。数量代表用户最多可领取的，但用户在使用前最多只能领1张。">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
              )}
                {...this.formLayout}
              >
                {getFieldDecorator('userMaxReceive', {
                  rules: [{ required: true,
                    message: `${formatMessage({ id: 'form.input' })}${formatMessage({ id: 'strategyMall.coupons.userMaxReceive' })}`}],
                  initialValue: current.userMaxReceive,
                })(<InputNumber  />)}
              </FormItem> */}

            {
                !current.id ?
                  <FormItem
                    label={(
                      <span>
                        {formatMessage( { id: 'strategyMall.coupons.inventory' } )}&nbsp;
                        <Tooltip title="该优惠券的总数量">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    )}
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'inventory', {
                  rules: [{ required: true,
                    message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.inventory' } )}` }],
                  initialValue: current.inventory,
                } )( <InputNumber min={1}  /> )}
                  </FormItem> : null
              }


            <FormItem
              label={(
                <span>
                  {formatMessage( { id: 'strategyMall.coupons.state' } )}&nbsp;
                  <Tooltip title="优惠券下架后，该优惠券领取的用户券也会同时被禁止使用了。">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
            )}
              {...this.formLayout}
            >
              {getFieldDecorator( 'state', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.state' } )}` }],
                  initialValue: current.state || 'ENABLE',
                } )(
                  <RadioGroup>
                    <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                    <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                  </RadioGroup>
                )}
            </FormItem>

            <FormItem
              label={(
                <span>
                  {formatMessage( { id: 'strategyMall.coupons.stopSend' } )}&nbsp;
                  <Tooltip title="选择 “否” 后，用户将无法领取该优惠券。">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
            )}
              {...this.formLayout}
            >
              {getFieldDecorator( 'isReceive', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.coupons.stopSend' } )}` }],
                  initialValue: current.isReceive !== false,
                } )(
                  <RadioGroup>
                    <Radio value>{stopSendObj.true}</Radio>
                    <Radio value={false}>{stopSendObj.false}</Radio>
                  </RadioGroup>
                )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title={`${current.name}（当前库存：${current.inventory}） `}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={addInventory}
          onCancel={this.addInventoryCancel}
          onOk={this.addInventoryOk}
        >
          <FormItem
            label={(
              <span>
                {formatMessage( { id: 'strategyMall.coupons.addInventory' } )}&nbsp;
                <Tooltip title="增加库存时，填数字，例如：100，减库存时则负号加数字，例如：-100">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            {...this.formLayout}
          >
            <InputNumber value={inventoryValue} onChange={this.inventoryValueChange} />
          </FormItem>

        </Modal>
        <SendCoupons sendProBtnRef={this[`sendProBtn${current.id}`]} current={current} />
      </GridContent>
    );
  }
}

export default CouponsList;

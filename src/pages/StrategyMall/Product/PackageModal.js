import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import {
  Input, Button, Modal, Form,
  InputNumber, Select, Radio, Table, Icon, Tooltip, message, DatePicker
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import 'braft-editor/dist/index.css';
import styles from '../Lists.less';
import modalStyles from './ProductModal.less';

const FormItem = Form.Item;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

const stateObj = {
  "": formatMessage( { id: 'strategyMall.product.state.all' } ),
  "ENABLE": formatMessage( { id: 'strategyMall.product.state.ENABLE' } ),
  "DISABLE": formatMessage( { id: 'strategyMall.product.state.DISABLE' } ),
}

const timeObj = {
  "SECONDS": formatMessage( { id: 'strategyMall.product.time.SECONDS' } ),
  "MINUTES": formatMessage( { id: 'strategyMall.product.time.MINUTES' } ),
  "HOURS": formatMessage( { id: 'strategyMall.product.time.HOURS' } ),
  "DAY": formatMessage( { id: 'strategyMall.product.time.DAY' } ),
  "WEEK": formatMessage( { id: 'strategyMall.product.time.WEEK' } ),
  "MONTH": formatMessage( { id: 'strategyMall.product.time.MONTH' } ),
  "YEAR": formatMessage( { id: 'strategyMall.product.time.YEAR' } ),
}


@connect( ( { strategyMall } ) => ( {
  loading: strategyMall.loading,
  specsList: strategyMall.specsList,
} ) )
@Form.create()

class PackageModal extends PureComponent {
  state={
    visible: false,
    // productId:''
    start: '',
    end: '',
    currentSpecs:{},
    pricingType:false
  }

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {

  };

  // 获取规格
  fetchList = ( id ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'strategyMall/getSpecs',
      payload: {
        id,
      },
    } );
  }


  //  显示套餐新增 modal 框
  showSpecsAddModal = () => {
    this.setState( {
      visible:true,
      currentSpecs: {},
    } )
  };

  //  显示套餐编辑 modal 框
  showSpecsModal = ( id ) => {
    const { specsList } = this.props;
    const obj = specsList.find( o => o.id === id );
    this.setState( {
      visible:true,
      currentSpecs: obj,
      // productId:id,
    } )
  };

  // 取消
  handleCancel = () => {
    const { currentSpecs } = this.state;
    const id = currentSpecs ? currentSpecs.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this.addSpeBtn ) { this.addSpeBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
      if ( this[`editSpeBtn${id}`] ) { this[`editSpeBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      currentSpecs: {},
    } );
  };

  //  取消套餐modal框
  cancelSpecsModal = () => {
    const { currentSpecs } = this.state;
    const id = currentSpecs ? currentSpecs.id : '';
    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this.addSpeBtn ) { this.addSpeBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
      if ( this[`editSpeBtn${id}`] ) { this[`editSpeBtn${id}`].blur(); }
    }, 0 );

    this.setState( {
      visible: false,
      currentSpecs: {},
    } );
  }


  // 删除: 产品(product)、规格(specs)
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;

    const { specsList, dispatch, productId } = this.props;

    const obj = specsList.find( o => o.id === id );

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
          type: 'strategyMall/delPackage',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList( productId );
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


  // 提交：产品(product)、规格(specs)
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form, productId  } = this.props;
    const { currentSpecs, start, end } = this.state;
    const id = currentSpecs ? currentSpecs.id : ''

    setTimeout( () => {
      if ( this.addProBtn ) { this.addProBtn.blur(); }
      if ( this.addSpeBtn ) { this.addSpeBtn.blur(); }
      if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
      if ( this[`editSpeBtn${id}`] ) { this[`editSpeBtn${id}`].blur(); }
    }, 0 );

    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;

      const params = id ? Object.assign( { ...fieldsValue, id } ) : { ...fieldsValue };

      params.productId = productId;
      params.start = start;
      params.end = end;
      delete params.type

      if ( !params.productId ) {
        message.error( '套餐所属商品不能为空' );
      }

      dispatch( {
        type: 'strategyMall/submitPackage',
        payload: {
          params,
          callFunc: () => {
              $this.setState( {
                visible: false,
                currentSpecs: {},
                pricingType:false
              } );
              $this.fetchList( productId );
          },
        },
      } );
    } );
  };

  //  改成促销时间
  onDateChange = ( dates, dateStrings ) => {
    this.setState( {
      start: dateStrings[0],
      end: dateStrings[1]
    } )
  }

  //  切换定价方式类型
  pricingTypeChange = () => {
    const { currentSpecs } = this.state;
    const isChip = currentSpecs.isChip || false;
    currentSpecs.isChip = !isChip;
  }

  render(){
    const { loading, form: { getFieldDecorator }, specsList } = this.props;
    const { currentSpecs, visible, pricingType }=this.state;
    const specsColumns = [
      {
        title: <span>ID</span>,
        dataIndex: 'ID',
        render: ( id, item ) => <span>{item.id || '匿名'}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.name' } )}</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.time' } )}</span>,
        dataIndex: 'unitValue',
        render: ( unitValue, item ) => <span>{`${unitValue}${formatMessage( { id: `strategyMall.product.time.${item.unitType}` } )}`}</span>,
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.specs.price' } )}</span>,
        dataIndex: 'price',
        render: ( price, item ) => (
          <span>￥: {item.salePrice === 0 ? '0.00' : item.salePrice || item.price}
            {( !!item.salePrice || item.salePrice === 0 ) && <del style={{ fontSize:12, marginLeft:8, color:'#999' }}> {item.price.toFixed( 2 )}</del> }
          </span>
          ),
      },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.specs.sellCount' } )}</span>,
        dataIndex: 'sellCount',
        render: sellCount => <span>{sellCount || 0}</span>,
      },
      {
        title: <span>单次购买</span>,
        dataIndex: 'isSinglePurchase',
        render: isSinglePurchase => <span>{isSinglePurchase ? '是' : '否'}</span>,
      },
      // {
      //   title: <span>是否可退款</span>,
      //   dataIndex: 'isChip',
      //   render: isChip => <span>{isChip ? '不可退款' : '可退款'}</span>,
      // },
      {
        title: <span>{formatMessage( { id: 'strategyMall.product.specs.state' } )}</span>,
        dataIndex: 'state',
        render: state => (
          <span>{state === 'ENABLE' ?
            <Icon style={{ color: 'green' }} type="check-circle" /> : <Icon style={{ color: 'red' }} type="close-circle" />}
          </span> ),
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: id => (
          <div>
            <span
              style={{ marginBottom:5, marginRight: 15, cursor:'pointer', color:'#1890ff' }}
              onClick={() => this.showSpecsModal( id )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              编辑
            </span>

            <span
              style={{ cursor:'pointer', marginRight: 15, color:'#f5222d' }}
              onClick={( e ) => this.deleteItem( e, id, 'specs' )}
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
    return(
      <GridContent>
        <div className={styles.combo}>

          <div style={{ width: '70%', margin:'0 auto' }}>
            <p style={{ margin:'20px 0', fontSize:16 }}>套餐设置</p>

            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showSpecsAddModal()}
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
              // className={styles.formFullHeight}
              rowKey="id"
              columns={specsColumns}
              loading={loading}
              // dataSource={( current.id||productId ) ? specsList : []}
              dataSource={specsList}
              pagination={false}
            />
          </div>

        </div>
        {
          visible ?
            <Modal
              maskClosable={false}
              // title={`${currentSpecs.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}${modalType === 'product' ? `${formatMessage( { id: 'strategyMall.product.tit' } )}${!current.name ? '' : `：${current.name}`}` : `${formatMessage( { id: 'strategyMall.product.specs' } )}${!current.name ? '' : `：${current.name}`}`}`}
              className={modalStyles.standardListForm}
              width='100%'
              style={{ top:0, height: '100%' }}
              bodyStyle={{ padding: '100px 0 0px', height: '100%', overflow: 'scroll' }}
              destroyOnClose
              visible={visible}
              okText={formatMessage( { id: 'form.save' } )}
              onOk={( e ) => this.handleSubmit( e, 'specs' )}
              onCancel={this.cancelSpecsModal}
            >
              <div>
                {
                  <Form onSubmit={( e ) => this.handleSubmit( e )}>

                    <FormItem label={formatMessage( { id: 'strategyMall.product.specs' } )} {...this.formLayout}>
                      {getFieldDecorator( 'name', {
                        rules: [{ required: true, max: 20, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.specs' } )}（二十字内）` }],
                        initialValue: currentSpecs.name,
                      } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.specs' } )}`} /> )}
                    </FormItem>

                    <FormItem label={formatMessage( { id: 'strategyMall.product.specs.state' } )} {...this.formLayout}>
                      {getFieldDecorator( 'state', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.specs.state' } )}` }],
                        initialValue: currentSpecs.state || 'ENABLE',
                      } )(
                        <RadioGroup>
                          <Radio value="ENABLE">{stateObj.ENABLE}</Radio>
                          <Radio value="DISABLE">{stateObj.DISABLE}</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>

                    <FormItem label='单次购买' {...this.formLayout}>
                      {getFieldDecorator( 'isSinglePurchase', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.specs.state' } )}` }],
                        initialValue: currentSpecs.isSinglePurchase ? 'true' : 'false',
                      } )(
                        <RadioGroup>
                          <Radio value="true">是</Radio>
                          <Radio value="false">否</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>

                    <FormItem label={formatMessage( { id: 'strategyMall.product.specs.price' } )} {...this.formLayout}>
                      {getFieldDecorator( 'price', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.specs.price' } )} ` }],
                        initialValue: currentSpecs.price,
                      } )( <InputNumber step={0.01} /> )}
                    </FormItem>

                    {/* <FormItem label={formatMessage( { id: 'strategyMall.coupons.inventory' } )} {...this.formLayout}>
                      {getFieldDecorator( 'inventory', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.coupons.inventory' } )} ` }],
                        initialValue: currentSpecs.inventory,
                      } )( <InputNumber step={1} /> )}
                    </FormItem> */}

                    <FormItem
                      label={(
                        <span>
                          {formatMessage( { id: 'strategyMall.product.specs.salePrice' } )}&nbsp;
                          <Tooltip title="添加促销价后，实际价格为促销价；不填则为上面价格。">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                          )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'salePrice', {
                        rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.specs.salePrice' } )} ` }],
                        initialValue: currentSpecs.salePrice,
                      } )( <InputNumber step={0.01} /> )}
                    </FormItem>

                    <FormItem label='促销时间' {...this.formLayout}>
                      {getFieldDecorator( 'startDate', {
                          initialValue: currentSpecs.start ? [moment( currentSpecs.start ), moment( currentSpecs.end )] : ''
                        } )(
                          <RangePicker
                            style={{ marginRight: 15 }}
                            onChange={( dates, dateStrings ) => this.onDateChange( dates, dateStrings )}
                            showTime={{
                              hideDisabledOptions: true,
                              defaultValue: [moment( '00:00:00', 'HH:mm:ss' ), moment( '11:59:59', 'HH:mm:ss' )],
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                          />
                        )}
                    </FormItem>

                    <FormItem
                      label={(
                        <span>
                          定价方式&nbsp;
                          <Tooltip title={currentSpecs.isChip ? "按部分进行定价,保存后不可修改" : "全部按时间定价,保存后不可修改"}>
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'isChip', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}定价方式` }],
                        initialValue:currentSpecs.id ? currentSpecs.isChip.toString() : 'false'
                      } )(
                        <RadioGroup onChange={this.pricingTypeChange} disabled={currentSpecs.id ? !pricingType : pricingType}>
                          <Radio value="false">完整权限</Radio>
                          <Radio value="true">部分权限</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>

                    {
                    currentSpecs.isChip ?
                    (
                      <FormItem
                        label={(
                          <span>
                            部分权限ID&nbsp;
                            <Tooltip title={(
                              <div>
                                填写的ID来源需跟开发确认。
                              </div>
                            )}
                            >
                              <Icon type="question-circle-o" />
                            </Tooltip>
                          </span>
                      )}
                        {...this.formLayout}
                      >
                        {getFieldDecorator( 'chipKey', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}部分权限ID ` }],
                          initialValue: currentSpecs.chipKey,
                        } )( <Input style={{ width:350 }} placeholder={`${formatMessage( { id: 'form.input' } )}部分权限ID`} /> )}
                      </FormItem>
                    ):null
                    }
                    <FormItem
                      label={(
                        <span>
                          {formatMessage( { id: 'strategyMall.product.specs.unitValue' } )}&nbsp;
                          <Tooltip title="指从支付成功后，可使用的时间长度">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                        )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'unitValue', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'strategyMall.product.specs.unitValue' } )} ` }],
                            initialValue: currentSpecs.unitValue,
                          } )( <InputNumber step={1} min={1} /> )}
                    </FormItem>

                    <FormItem
                      label={(
                        <span>
                          {formatMessage( { id: 'strategyMall.product.specs.unitType' } )}&nbsp;
                          <Tooltip title={(
                            <div>时间单位是按照实际时间推算的。<br />如N天，则到N天后的当前时间；<br />1月：到下个月的当前时间,而不是30天；
                              <br />1年：到明年的当前时间,而不是365天；<br />建议使用“天”。<br />秒、分钟、小时使用情况较少。
                            </div>
                                )}
                          >
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                          )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'unitType', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.specs.unitType' } )}` }],
                            initialValue: currentSpecs.unitType,
                          } )(
                            <Select
                              placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.specs.unitType' } )}`}
                              getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                              <SelectOption value="SECONDS">{timeObj.SECONDS}</SelectOption>
                              <SelectOption value="MINUTES">{timeObj.MINUTES}</SelectOption>
                              <SelectOption value="HOURS">{timeObj.HOURS}</SelectOption>
                              <SelectOption value="DAY">{timeObj.DAY}</SelectOption>
                              <SelectOption value="WEEK">{timeObj.WEEK}</SelectOption>
                              <SelectOption value="MONTH">{timeObj.MONTH}</SelectOption>
                              <SelectOption value="YEAR">{timeObj.YEAR}</SelectOption>
                            </Select>
                          )}
                    </FormItem>

                    {/* <FormItem
                      label={(
                        <span>
                         是否可退款&nbsp;
                          <Tooltip title="是否退款">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      )}
                      {...this.formLayout}
                    >
                      {getFieldDecorator( 'isSinglePurchase', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'strategyMall.product.specs.state' } )}` }],
                        initialValue: currentSpecs.isSinglePurchase ? 'true' : 'false',
                      } )(
                        <RadioGroup>
                          <Radio value="true">可退款</Radio>
                          <Radio value="false">不可退款</Radio>
                        </RadioGroup>
                      )}
                    </FormItem> */}

                  </Form>
                  }
              </div>
            </Modal>
          : null
        }

      </GridContent>
    )
  }
}
export default PackageModal;

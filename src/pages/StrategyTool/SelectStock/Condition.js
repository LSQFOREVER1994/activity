import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';
import {
  Card, Input, Button, Modal, Form, Table,
  Tooltip, Icon, Radio, InputNumber, Select,
} from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Lists.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { confirm } = Modal;
const { Option } = Select;

const formLayoutA = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    sm: { span: 16, offset: 7 },
  },
};

@connect( ( { selectStock } ) => ( {
  loading: selectStock.loading,
  conditions: selectStock.conditions,
  searchGroups: selectStock.searchGroups,
} ) )
@Form.create()
class Condition extends PureComponent {
  state = {
    pageNumber: 1,
    pageSize: 10,
    visible: false,
    current: undefined,
    listType: 'noFilter',
    queryArrs: [],

    STOCKCONDITIONS: [], // 查询条件
    STOCKCONDITIONSIndex: undefined, // 查询条件序号
    STOCKCONDITIONSObj: {}, // 查询条件对象
    STOCKCONDITIONSVisible: false, // 查询条件编辑模版

    filtersArrs: [], // 条件
    filtersArrsIndex: undefined, // 条件序号
    filtersArrsObj: {}, // 条件对象
    filtersArrsVisible: false, // 条件编辑模版
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
      type: 'selectStock/getCondition',
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
    const { conditions: { list }, dispatch } = this.props;
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
          type: 'selectStock/delCondition',
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
      STOCKCONDITIONS: [],
      STOCKCONDITIONSIndex: undefined,
    } );
  };

  //  显示编辑遮罩层
  showEditModal = ( id ) => {
    const { conditions: { list } } = this.props;
    const obj = list.find( o => o.id === id );
    this.setState( {
      visible: true,
      current: obj,
      STOCKCONDITIONS: JSON.parse( JSON.stringify( obj.stockConditions || [] ) ),
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
      STOCKCONDITIONS: [],
      STOCKCONDITIONSIndex: undefined,
    } );
  };

  //  提交
  handleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, pageSize, pageNumber, STOCKCONDITIONS,
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
      params.stockConditions = STOCKCONDITIONS;

      dispatch( {
        type: 'selectStock/submitCondition',
        payload: {
          params,
          callFunc: () => {
            $this.fetchList( pageNumber, pageSize );
            $this.setState( {
              visible: false,
              current: undefined,
              STOCKCONDITIONS: [],
              STOCKCONDITIONSIndex: undefined,
            } );
          },
        },
      } );
    } );
  };

  getFormItemDom = ( lists, type, text='查询条件列表' ) => {
    let showBtns = false;

    if ( type === 'STOCKCONDITIONS' ) {
      showBtns = true;
    }

    return (
      <div>
        {
          lists.map( ( k, index ) => (
            <FormItem
              {...( index === 0 ? formLayoutA : formItemLayoutWithOutLabel )}
              label={index === 0 ? text : ''}
              required={false}
              /* eslint-disable react/no-array-index-key */
              key={index}
              /* eslint-enable react/no-array-index-key */
              style={{ marginBottom: 10 }}
            >
              <FormItem style={{ display: 'inline-block', width: `${showBtns ? '52%' : '82%'}`, marginBottom: 0 }}>
                <Input placeholder="点击右侧蓝色按钮编辑条件" value={k.name} disabled  />
              </FormItem>
      
              {
                showBtns && (
                <FormItem style={{ display: 'inline-block', width: '28%', marginLeft: 10, marginBottom: 0 }}>
                  <RadioGroup value={k.isShow} onChange={() => this.changeConditionList( type, index )}>
                    <Radio value>开</Radio>
                    <Radio value={false}>关</Radio>
                  </RadioGroup>
                </FormItem>
                )
              }
              
              <FormItem style={{ display: 'inline-block', width: '6%', marginBottom: 0 }}>
                {
                  index === 0 ? null : (
                    <Tooltip title="上移" placement="left">
                      <Icon
                        type="arrow-up"
                        style={{ display: 'block', height: 20 }}
                        onClick={() => this.moveConditionList( type, index, 'up' )}
                      />
                    </Tooltip>
                  )
                }
                {
                  index === ( lists.length - 1 ) ? null : (
                    <Tooltip title="下移" placement="left">
                      <Icon 
                        type="arrow-down"
                        style={{ display: 'block', height: 20 }}
                        onClick={() => this.moveConditionList( type, index, 'down' )}
                      />
                    </Tooltip>
                  )
                }
              </FormItem>
              
              <FormItem style={{ display: 'inline-block', width: '6%', marginBottom: 0 }}>
                <Tooltip title="编辑" placement="right">
                  {
                    type === 'filtersArrs' ? (
                      <Icon
                        type="edit"
                        theme="twoTone"
                        style={{ display: 'block', height: 15, marginBottom: 6 }}
                        onClick={() => this.editFiltersList( index )}
                      />
                    ) : (
                      <Icon
                        type="edit"
                        theme="twoTone"
                        style={{ display: 'block', height: 15, marginBottom: 6 }}
                        onClick={() => this.editConditionList( type, index )}
                      />
                    )
                  }
                  
                </Tooltip>
      
                <Tooltip title="移除" placement="right">
                  <Icon
                    type="delete"
                    style={{ display: 'block', height: 15 }}
                    onClick={() => this.delConditionList( type, index )}
                  />
                </Tooltip>
              </FormItem>
            </FormItem>
          ) )
        }
        {
          lists.length > 0 ? (
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={() => this.addConditionList( type )} style={{ width: '94%' }}>
                <Icon type="plus" /> {`增加${text}`}
              </Button>
            </FormItem>
          ) : (
            <FormItem {...this.formLayout} label={text}>
              <Button type="dashed" onClick={() => this.addConditionList( type )} style={{ width: '100%' }}>
                <Icon type="plus" /> {`增加${text}`}
              </Button>
            </FormItem>
          )
        }
      </div>
    );
  }

  getKeysDom = ( lists ) => {
    const { searchGroups } = this.props;
    return (
      <FormItem 
        label={(
          <span>
            条件语句&nbsp;
            <Tooltip title="需要有mogodb基础的人编写否则后果自负，条件格式例如：{$eq:0,$lte:25}">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        )}
        {...this.formLayout}
      >
        {
          lists.map( ( item, index ) => (
            <FormItem
              style={{ marginBottom: 0 }}
              /* eslint-disable react/no-array-index-key */
              key={index}
              /* eslint-enable react/no-array-index-key */
            >
              <Select
                placeholder="请输入key"
                showSearch
                value={item.key || ''}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.searchKeys}
                onChange={( val ) => this.changeQuery( val, index, 'key' )}
                notFoundContent={null}
                style={{ display: 'inline-block', width: '40%' }}
              >
                {
                  searchGroups.map( ( IT, I ) => (
                    <Option 
                      /* eslint-disable react/no-array-index-key */
                      key={I}
                      /* eslint-enable react/no-array-index-key */
                      value={IT.key}
                    >
                      {IT.name} ( {IT.key} )
                    </Option>
                  ) )
                }
              </Select>
              <Input
                value={item.value || ''}
                placeholder="请输入条件" 
                onChange={( e ) => this.changeQuery( e.target.value, index, 'value' )}
                style={{ display: 'inline-block', width: '50%', marginLeft: 10 }}
              />
              <Tooltip title="移除" placement="right">
                <Icon
                  type="delete"
                  style={{ display: 'inline-block', marginLeft: 10 }}
                  onClick={() => this.delConditionList( 'queryArrs', +index )}
                />
              </Tooltip>
            </FormItem>
            ) )
          }
        <Button type="dashed" onClick={() => this.addConditionList( 'queryArrs' )} style={{ width: '100%' }}>
          <Icon type="plus" /> 增加条件语句
        </Button>
      </FormItem>       
    );
  }

  // 增加条件列表
  addConditionList = ( type ) => {
    const arrs = this.state[type];
    const obj = type === 'queryArrs' ? { key: null, value: null } : { name: null, query: null, isShow: false };
    arrs.push( obj );

    this.setState( {
      [type]: new Array( ...arrs ),
    } )
  }

  // 删除条件列表
  delConditionList = ( type, index ) => {
    const arrs = this.state[type];
    arrs.splice( index, 1 );

    this.setState( {
      [type]: new Array( ...arrs ),
    } )
  }

  // 改变条件列表状态
  changeConditionList = ( type, index ) => {
    const arrs = this.state[type];
    const val = !arrs[index].isShow;
    arrs[index].isShow = val;

    this.setState( {
      [type]: new Array( ...arrs ),
    } )
  }

  // 移动条件列表
  moveConditionList = ( type, index, modus ) => {
    const arrs = this.state[type];
    const moveItem = arrs[index];
    if ( modus === 'up' ) {
      // 上移
      const beforeItem =  arrs[index - 1];
      arrs[index] = beforeItem;
      arrs[index - 1] = moveItem;
    } else if ( modus === 'down' ) {
      // 下移
      const afterItem =  arrs[index + 1];
      arrs[index] = afterItem;
      arrs[index + 1] = moveItem;
    }

    this.setState( {
      [type]: new Array( ...arrs ),
    } )
  }

  // 编辑条件列表
  editConditionList = ( type, index ) => {
    const obj = this.state[type][index];
    const queryArrs = [];

    if( obj.query ) {
      const objParse = JSON.parse( obj.query );
      const keys = Object.keys( objParse );
      const values = Object.values( objParse );
      for( let i = 0; i < keys.length; i += 1 ) {
        const objArr = {
          key: keys[i],
          value: JSON.stringify( values[i] ),
        }
        queryArrs.push( objArr );
      }
    }

    this.setState( {
      [`${type}Index`]: index,
      [`${type}Visible`]: true,
      [`${type}Obj`]: JSON.parse( JSON.stringify( obj ) ),
      listType: obj.filters ? 'Filter' : 'noFilter',
      filtersArrs: obj.filters || [],
      queryArrs: new Array( ...queryArrs ),
    } )
  }

  editFiltersList = ( index ) => {
    const obj = this.state.filtersArrs[index];
    const queryArrs = [];

    if( obj.query ) {
      const objParse = JSON.parse( obj.query );
      const keys = Object.keys( objParse );
      const values = Object.values( objParse );
      for( let i = 0; i < keys.length; i += 1 ) {
        const objArr = {
          key: keys[i],
          value: JSON.stringify( values[i] ),
        }
        queryArrs.push( objArr );
      }
    }

    this.setState( {
      filtersArrsIndex: index,
      filtersArrsVisible: true,
      filtersArrsObj: JSON.parse( JSON.stringify( obj ) ),
      queryArrs: new Array( ...queryArrs ),
    } )
  }

  // 关闭编辑条件
  closeStockModal = ( e ) => {
    e.preventDefault();
    this.setState( {
      STOCKCONDITIONSVisible: false,
      STOCKCONDITIONSIndex: undefined,
      STOCKCONDITIONSObj: {},
    } )
  }

  closeFiltersModal = ( e ) => {
    e.preventDefault();
    this.setState( {
      filtersArrsVisible: false,
      filtersArrsIndex: undefined,
      filtersArrsObj: {},
      queryArrs: [],
    } )
  }

  // 保存编辑条件
  okStockModal = ( e ) => {
    e.preventDefault();
    const {
      STOCKCONDITIONSObj, STOCKCONDITIONSIndex, STOCKCONDITIONS, queryArrs,
      listType, filtersArrs,
    } = this.state;
    if (
      ( STOCKCONDITIONSObj.query ) ||
      ( listType === 'noFilter' )
    ) {
      const obj = {};
      for ( let i = 0; i < queryArrs.length; i += 1 ) {
        obj[queryArrs[i].key] = eval( `(${queryArrs[i].value})` );
      }
      STOCKCONDITIONSObj.query = JSON.stringify( obj );
    } else if (
      ( STOCKCONDITIONSObj.filters ) ||
      ( listType === 'Filter' )
    ) {
      STOCKCONDITIONSObj.filters = filtersArrs;
    }
    STOCKCONDITIONS[STOCKCONDITIONSIndex] = STOCKCONDITIONSObj;
    this.setState( {
      STOCKCONDITIONSVisible: false,
      STOCKCONDITIONSIndex: undefined,
      STOCKCONDITIONSObj: {},
      listType: 'noFilter',
      queryArrs: [],
      STOCKCONDITIONS: new Array( ...STOCKCONDITIONS ),
    } )
  }

  okFilterModal = ( e ) => {
    e.preventDefault();
    const {
      filtersArrsObj, filtersArrsIndex, queryArrs, filtersArrs,
    } = this.state;

    const obj = {};
    for ( let i = 0; i < queryArrs.length; i += 1 ) {
      obj[queryArrs[i].key] = eval( `(${queryArrs[i].value})` );
    }
    filtersArrsObj.query = JSON.stringify( obj );


    filtersArrs[filtersArrsIndex] = filtersArrsObj;
    this.setState( {
      filtersArrsVisible: false,
      filtersArrsIndex: undefined,
      filtersArrsObj: {},
      queryArrs: [],
      filtersArrs: new Array( ...filtersArrs ),
    } )
  }

  // 查看详情
  infoList= ( title, list ) => {
    Modal.info( {
      title,
      content: (
        <div>
          {
            list.map( ( ITEM, INDEX ) => (
              <div
                /* eslint-disable react/no-array-index-key */
                key={INDEX}
                /* eslint-enable react/no-array-index-key */
              >{ITEM.name}
              </div>
            ) )
          } 
        </div>
      ),
      onOk() {},
    } );
  }

  // 改变条件类型
  changeListType = ( e ) => {
    this.setState( { listType: e.target.value } )
  }

  // 改变条件名
  changeListName = ( e ) => {
    const { STOCKCONDITIONSObj } = this.state;
    STOCKCONDITIONSObj.name = e.target.value;
    this.setState( { STOCKCONDITIONSObj: Object.assign( {}, STOCKCONDITIONSObj ) } )
  }

  changeFliterListName = ( e ) => {
    const { filtersArrsObj } = this.state;
    filtersArrsObj.name = e.target.value;
    this.setState( { filtersArrsObj: Object.assign( {}, filtersArrsObj ) } )
  }

  // 搜索相关key
  searchKeys = ( value ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'selectStock/searchGroups',
      payload: {
        queryKey: value,
      },
    } );
  }

  // 改变Query值
  changeQuery = ( val, index, type ) => {
    const { queryArrs } = this.state;
    queryArrs[index][type] = val;
    
    this.setState( { queryArrs: new Array( ...queryArrs ) } )
  }

  render() {
    const {
      loading, conditions: { total, list }, form: { getFieldDecorator },
    } = this.props;

    const { 
      pageSize, visible, current = {}, listType,  queryArrs,
      STOCKCONDITIONS, STOCKCONDITIONSObj, STOCKCONDITIONSVisible,
      filtersArrs, filtersArrsObj, filtersArrsVisible,
     } = this.state;

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
        width: '20%',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>状态</span>,
        dataIndex: 'isShow',
        width: '10%',
        render: isShow => (
          <div>
            {
            isShow ? (
              <Tooltip title="开启" placement="left">
                <Icon style={{ color: 'green' }} type="check-circle" />
              </Tooltip>
            ) : (
              <Tooltip title="关闭" placement="left">
                <Icon style={{ color: 'red' }} type="close-circle" />
              </Tooltip>
            )
          }
          </div>
        ),
      },
      {
        title: <span>查询条件列表</span>,
        dataIndex: 'stockConditions',
        width: '50%',
        render: stockConditions => (
          <div>
            {
              stockConditions && stockConditions.map( ( item, index ) => (
                <div
                  /* eslint-disable react/no-array-index-key */
                  key={index}
                  /* eslint-enable react/no-array-index-key */
                  className={styles.listItem}
                >
                  <div className={styles.listItemIcon}>
                    {
                      item.isShow ? (
                        <Tooltip title="开启" placement="left">
                          <Icon style={{ color: 'green' }} type="check-circle" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="关闭" placement="left">
                          <Icon style={{ color: 'red' }} type="close-circle" />
                        </Tooltip>
                      )
                    }
                  </div>
                  <div className={styles.listItemName}>{item.name}</div>
                  
                  {
                    item.query ? null : (
                      <div className={styles.listItemText}>
                        <Tooltip title="点击查看详情" placement="right">
                          <Icon type="eye" style={{ color: '#1890FF' }} onClick={() => this.infoList( item.name, item.filters )} />
                        </Tooltip>
                      </div>
                    )
                  }
                </div>
              ) )
            }
          </div>
        ),
      },
      {
        title: <span>排序值</span>,
        dataIndex: 'sort',
        width: '10%',
        render: sort => <span>{sort}</span>,
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        width: '10%',
        render: id => (
          <div>
            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={() => this.showEditModal( id )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >编辑
            </span>
            
            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={() => this.deleteItem( id )}
              ref={component => {
                /* eslint-disable */
                this[`delProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
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
            title="条件列表"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showModal()}
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
              <FormItem label="状态" {...this.formLayout}>
                {getFieldDecorator( 'isShow', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}状态` }],
                    initialValue: current.isShow || false,
                  } )(
                    <RadioGroup>
                      <Radio value>开启</Radio>
                      <Radio value={false}>关闭</Radio>
                    </RadioGroup>
                  )}
              </FormItem>
              <FormItem
                label={(
                  <span>
                    排序值&nbsp;
                    <Tooltip title="数值越大越靠前">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
                {...this.formLayout}
              >
                {getFieldDecorator( 'sort', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}排序` }],
                    initialValue: current.sort,
                  } )( <InputNumber placeholder="排序" /> )}
              </FormItem>
              {this.getFormItemDom( STOCKCONDITIONS, 'STOCKCONDITIONS' )}
            </Form>
          }
        </Modal>

        <Modal
          title={STOCKCONDITIONSObj.name ? `编辑${STOCKCONDITIONSObj.name}` : '新建条件'}
          visible={STOCKCONDITIONSVisible}
          onOk={this.okStockModal}
          onCancel={this.closeStockModal}
          okText="确认"
          cancelText="取消"
          className={styles.standardListForm}
          width={680}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
        >
          <Form>
            {
               !STOCKCONDITIONSObj.name && (
               <FormItem label="条件类别" {...this.formLayout}>
                 <RadioGroup value={listType} onChange={this.changeListType}>
                   <Radio value='noFilter'>no-filters</Radio>
                   <Radio value='Filter'>filters</Radio>
                 </RadioGroup>
               </FormItem>
               )
             }
            {
               listType === 'noFilter' ? (
                 <div>
                   <FormItem label="名称" {...this.formLayout}>
                     <Input placeholder="请输入名称" value={STOCKCONDITIONSObj.name} onChange={this.changeListName}  />
                   </FormItem>
                   {this.getKeysDom( queryArrs )}
                 </div>
               ) : (
                 <div>
                   <FormItem label="名称" {...this.formLayout}>
                     <Input placeholder="请输入名称" value={STOCKCONDITIONSObj.name} onChange={this.changeListName} />
                   </FormItem>
                   {this.getFormItemDom( filtersArrs, 'filtersArrs', '条件集合' )}
                 </div>
               )
             }
          </Form>
        </Modal>
      
        <Modal
          title={filtersArrsObj.name ? `编辑${filtersArrsObj.name}` : '新建条件'}
          visible={filtersArrsVisible}
          onOk={this.okFilterModal}
          onCancel={this.closeFiltersModal}
          okText="确认"
          cancelText="取消"
          className={styles.standardListForm}
          width={720}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
        >
          <Form>
            <FormItem label="名称" {...this.formLayout}>
              <Input placeholder="请输入名称" value={filtersArrsObj.name} onChange={this.changeFliterListName} />
            </FormItem>
            {this.getKeysDom( queryArrs )}
          </Form>
        </Modal>
      
      </GridContent>
    );
  }
}

export default Condition;
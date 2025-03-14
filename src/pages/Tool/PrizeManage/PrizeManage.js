/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-14 14:05:10
 * @LastEditTime: 2019-08-14 21:22:00
 * @LastEditors: Please set LastEditors
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, Select, Row, Col  } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';
/* eslint-disable react/no-array-index-key  */

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;

const prizeTypeObj = {
  RED:'红包',
  GOODS:'实物',
  COUPON:'卡券',
  INTEGRAL:'积分',
  OTHER:'其他',
}

@connect( ( { tool } ) => ( {
  loading: tool.loading,
  prizeManageList: tool.prizeManageList,

  // 获取平台名称列表
  platformyListAll:tool.platformyListAll,
  // 通过ID获取对接功能列表
  dockingList:tool.dockingList,
} ) )
@Form.create()

class List extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
    visible: false,
    inputValue:'',
    platformValue:'',
    dockingValue:'',
    openSelect:false,
    itemObj:{},
    dockingSelect:false,
    addLoading: false,
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 },
  };

  componentDidMount() {
    const{ dispatch } = this.props;
    this.fetchList();
    dispatch( {
      type: 'tool/getPlatformListAll',
      payload: {
        pageNum:1,
        pageSize:1000
      },
    } )

  };

  fetchList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, inputValue, platformValue, dockingValue } =this.state
    dispatch( {
      type: 'tool/getPrizeList',
      payload: {
        pageNum,
        pageSize,
        name:inputValue,
        merchantId:platformValue,
        spuId:dockingValue,
        orderBy: 'id desc',
      },
    } );
  }

  // 翻页
  tableChange = ( pagination ) =>{
    const { current, pageSize } = pagination;
    this.setState( {
      pageNum: current, 
      pageSize,
    }, ()=>{
      this.fetchList();
    } );
  };

  //  显示添加 Modal
  showAddModal = () => {
    this.setState( {
      visible: true,
      current: undefined,
    } );
  };

  //  显示编辑 Modal
  showEditModal = ( e, id ) => {
    e.stopPropagation();
    const { prizeManageList: { list } } = this.props;
    const obj = list.find( o => o.id === id );
    this.selectDockingType( obj.spu.merchant.id )
    this.setState( {
      visible: true,
      current: obj,
    } );
  }

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
      openSelect:false,
      itemObj:{}
    } );
  };

  // onRef = ( ref ) => {
  //   this.child = ref
  // }

  //  提交
  handleSubmit = ( e ) => {
    
    e.preventDefault();
    const { dispatch, form } = this.props;
    const {
      current, addLoading
    } = this.state;
    const id = current ? current.id : '';
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;

      const params = id ? Object.assign( fieldsValue, { id } ) : { ...fieldsValue };
      delete params.spuMerchantName;
      
      params.spuId= params.spuId.toString() || '';
      
      const isUpdate = !!current;
      if(addLoading) return;
      this.setState({
        addLoading: true,
      })
      dispatch( {
        type: 'tool/submitPrize',
        payload: {
          params,
          isUpdate,
          callFunc: () => {
            $this.fetchList();
            $this.setState( {
              visible: false,
              addLoading: false,
              current: undefined,
              openSelect:false,
              itemObj:{}
            } );
          },
        },
      } );
    } );
  };

  // 删除奖品
  deleteItem = ( e, id ) => {
    e.stopPropagation();
    const $this = this;
    const { dispatch, prizeManageList: { list } } = this.props;
    const current = list.find( o => o.id === id );
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}奖品${current.name}`,
      onOk() {
        dispatch( {
          type: 'tool/delPrize',
          payload: {
            id,
            callFunc: () => {
              $this.fetchList();
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

  //  选择对接功能列表
  selectDockingType = ( value ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'tool/getDockingList',
      payload: {
        merchantId:value,
        pageNum: 1,
        pageSize: 100
      },
    } );
    this.setState( {
      openSelect:true
    } )
  }

  //  获取筛选框值
  valueChange =( value ) => {
    this.setState( {
      inputValue:value,
      pageNum:1
    } )
  }

  //  获取选择平台名称框值
  platformChange =( value ) => {
    if( value === '' ){
      this.setState( {
        pageNum:1,
        platformValue:value,
        dockingValue:'',
        dockingSelect:false,
        pageNum:1
      } )
    }else{
      this.setState( {
        pageNum:1,
        platformValue:value,
        dockingValue:'',
        dockingSelect:true,
        pageNum:1
      } )
    }
  }

  // 获取选择框对接功能值
  dockingChange=( value ) => {
    this.setState( {
      dockingValue:value,
      pageNum:1
    } )
  }

  // 筛选
  handleSearch= () => {
    this.fetchList()
  }

  // 清空
  handleEmpty=()=>{
    this.setState( {
      pageNum:1,
      pageSize:10, 
      inputValue:'', 
      platformValue:'',
      dockingValue:'',
      dockingSelect:false,
    }, ()=>{this.fetchList()} )
  }

  // 获取编辑时对接功能所对应的对象
  apiCommentObj = ( value ) =>{
    const { dockingList } = this.props;
    const dockingIdList  =  dockingList.list;
    dockingIdList.map( item => {
      if( item.id === value ){
        this.setState( {
          itemObj:item
        } )
      }
    } )
  }

  render() {
    const { loading, prizeManageList: { total, list }, form: { getFieldDecorator }, platformyListAll, dockingList } = this.props;
    const { pageSize, pageNum, visible, current = {}, inputValue, platformValue, dockingValue, openSelect, itemObj, dockingSelect, addLoading } = this.state;
    

    const platformyList = platformyListAll.list;
    const dockingName = dockingList.list;

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

    const extraContent = (
      <div>
        <span>奖品名称：</span>
        <Input
          size="default"
          placeholder="请输入奖品名称"
          value={inputValue}
          onChange={( e )=>this.valueChange( e.target.value )}
          style={{ width: 150, marginRight:15 }}
        />

        <span>平台名称：</span>
        <Select
          placeholder={`${formatMessage( { id: 'form.select' } )}活动类型`}
          onSelect={this.selectDockingType}
          value={platformValue}
          style={{ width:150, marginRight:15 }}
          onChange={this.platformChange}
          defaultValue=''
        >
          <Option value=''>全部</Option>
          {platformyList.length > 0 && platformyList.map( item =>
            <Option key={item.id} value={item.id}>{item.name}</Option>
          )}
        </Select>
        
        <span>对接功能：</span>
        <Select
          placeholder={`${formatMessage( { id: 'form.select' } )}活动类型`}
          style={{ width:150, marginRight:15 }}
          value={dockingValue}
          defaultValue=''
          disabled={!dockingSelect}
          onChange={this.dockingChange}
        >
          <Option value=''>全部</Option>
          {dockingName.length > 0 && dockingName.map( item =>
            <Option key={item.id} value={item.id}>{item.name}</Option>
          )}
        </Select>
        <Button 
          type="primary"
          onClick={this.handleSearch}
          style={{ marginRight:15 }}
        >搜索
        </Button>

        <Button 
          type="primary"
          onClick={this.handleEmpty}
          style={{ marginRight:15 }}
        >清空
        </Button>

      </div>
    );

    const columns = [
      {
        title: <span>奖品ID</span>,
        dataIndex: 'id',
        key: 'ID',
        render: id => <span>{id}</span>,
      },
      {
        title: <span>奖品名称</span>,
        width:300,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>奖品类型</span>,
        dataIndex: 'type',
        key: 'type',
        render: type => <span>{type ? prizeTypeObj[type] : '--'}</span>,
      },
      {
        title: <span>平台</span>,
        dataIndex: 'merchantId',
        render: ( id, item ) => <span>{ item.spu.merchant ? item.spu.merchant.name : ''}</span>,
      },
      {
        title: <span>对接功能</span>,
        dataIndex: 'spu',
        render: spu => <span>{spu.name || ''}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'activeCount',
        render: activeCount => <span>{activeCount}</span>,
      },
      {
        title: <span>已发数量</span>,
        dataIndex: 'sentCount',
        render: sentCount => <span>{sentCount}</span>,
      },
      {
        title: <span>奖品总量</span>,
        dataIndex: 'sentTotal',
        render: ( sentCount, item ) => <span>{( item.activeCount )+( item.sentCount )}</span>,
      },
      {
        title: <span>业务参数</span>,
        width:400,
        dataIndex: 'extendParams',
        render: extendParams => <div className={styles.showSingleLine}>{extendParams || '--'}</div>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: id=> (
          <div>

            <span
              style={{ marginRight:'15px', cursor:'pointer', color:'#1890ff'  }}
              type="link"
              onClick={( e ) => this.showEditModal( e, id )}
              ref={component => {
                /* eslint-disable */
                this[`editProBtn${id}`] = findDOMNode(component);
                /* eslint-enable */
              }}
            >编辑
            </span>

            <span
              style={{ cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, id )}
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
            title="奖品列表"
            extra={extraContent}
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={() => this.showAddModal()}
            >
              {formatMessage( { id: 'form.add' } )}
            </Button>
            <Table
              size="large"
              rowKey="id"
              scroll={{ x: 1800 }}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              onChange={this.tableChange}
            />
          </Card>
        </div>
        <Modal
          confirmLoading={addLoading}
          maskClosable={false}
          title={Object.keys( current ).length > 0 ? '编辑奖品' : '添加奖品'}
          className={styles.standardListForm}
          width={1000}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit} layout='horizontal'>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label='平台名称' {...this.formLayout}>
                  {getFieldDecorator( 'spuMerchantName', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}平台名称` }],
                      initialValue: current.spu ? current.spu.merchant.id : '',
                    } )(
                      <Select
                        placeholder={`${formatMessage( { id: 'form.select' } )}平台名称`}
                        onSelect={this.selectDockingType}
                        disabled={!!current.id}
                        style={{ width:260 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {platformyList.length > 0 && platformyList.map( item =>
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )}
                      </Select>
                    )}
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem label='对接功能' {...this.formLayout}>
                  {getFieldDecorator( 'spuId', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}对接功能` }],
                      initialValue: current.spu ? current.spu.id : '',
                    } )(
                      <Select
                        placeholder={`${formatMessage( { id: 'form.select' } )}对接功能`}
                        disabled={!!current.id || !openSelect}
                        allowClear
                        style={{ width:260 }}
                        onChange={this.apiCommentObj}
                      >
                        {dockingName.length > 0 && dockingName.map( item =>
                          <Option key={item.id} value={item.id}>{item.name}</Option>
                        )}
                      </Select>
                    )}
                </FormItem>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col span={12}>
                <FormItem label='奖品名称' {...this.formLayout}>
                  {getFieldDecorator( 'name', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}奖品名称` }],
                      initialValue: current.name,
                    } )(
                      <Input style={{ width:260 }} />
                    )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='奖品类型' {...this.formLayout}>
                  {getFieldDecorator( 'type', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}奖品类型` }],
                    initialValue: current.type || '',
                  } )(
                    <Select
                      style={{ width: 260 }}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      placeholder={`${formatMessage( { id: 'form.select' } )}奖品类型`}
                    >
                      {
                        Object.keys( prizeTypeObj ).map( ( keys )=>(
                          <Option value={keys} key={keys}>{prizeTypeObj[keys]}</Option>
                        ) )
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <FormItem label='活动库存' {...this.formLayout}>
                  {getFieldDecorator( 'activeCount', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动库存` }],
                      initialValue: current.activeCount,
                    } )(
                      <Input style={{ width:260 }} />
                    )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="业务参数" {...this.formLayout}>
                  {getFieldDecorator( 'extendParams', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}业务参数` }],
                      initialValue:current.extendParams,
                  } )(
                    <Input placeholder="请根据下方的案例输入" style={{ width:260 }} />
                  )}
                  {/* <div style={{ color:'red' }}>
                    <p style={{ marginBottom:'-17px' }}>案例:</p>
                    <span>{`{"day":红包过期天数，"amount":金额}`}</span>
                  </div> */}
                </FormItem>
                <div className={styles.infoPics}>{current.spu ? current.spu.apiComment : ( itemObj ? itemObj.apiComment : '' ) }</div>
              </Col>
            </Row>


            <Row gutter={24}>
              <Col span={12}>
                <FormItem label='奖品描述' {...this.formLayout}>
                  {getFieldDecorator( 'description', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}奖品描述` }],
                  initialValue: current.description || '',
                } )(
                  <TextArea rows={4} style={{ width:260 }} />
                )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='使用链接' {...this.formLayout}>
                  {getFieldDecorator( 'useLink', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}使用链接` }],
                    initialValue: current.useLink,
                  } )( <Input style={{ width:260 }} placeholder={`${formatMessage( { id: 'form.input' } )}使用链接`} /> )}
                </FormItem>
              </Col>
            </Row>

          </Form>
        </Modal>
      </GridContent>
    );
  };
}

export default List;
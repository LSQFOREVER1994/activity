import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash'
import { Table, Card, Form, Input, message, Modal, Select, Switch, Popconfirm, Spin, Button, Radio, InputNumber, Divider, Tooltip, Icon, Tag } from 'antd';
import moment from 'moment';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import styles from './AlertConfig.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect( ( { alertConfig } ) => {
  return {
    loading: alertConfig.loading,
    alertList: alertConfig.alertList,
    merchantNames: alertConfig.merchantNames,
    adminList:alertConfig.adminList
  }
} )

class AlertConfig extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  inlineFormLayout = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      pageNum: 1,
      pageSize: 10,
      sortedInfo: {
        columnKey: 'create_time',
        field: 'createTime',
        order: 'descend',
      },
      current: undefined,
      visible: false,
      alertType: false,
      cacheList: [],
    };
    this.searchBar = React.createRef()
    this.debouncedOnSearch = _.debounce( this.onSearch, 300 );
    this.searchEleList = [
      {
        key: 'name',
        label: '预警名称',
        type: 'Input'
      },
      // {
      //   key: 'noticeSort',
      //   label: '通知类型',
      //   type: 'Select',
      //   optionList: [
      //     { label: '全部', value: '' },
      //     { label: '企业微信', value: 'WECOM' },
      //   ]
      // },
      // {
      //   key: 'merchantName',
      //   label: '商户名称',
      //   type: 'Input'
      // },
      // {
      //   key: 'warnAccount',
      //   label: '提醒@',
      //   type: 'Input'
      // },
    ]
  }

  componentDidMount() {
    this.getListData();
    this.getMerchantName();
  };

  onSearch = ( value ) => {
    this.getAdminList( value );
  }

  // 是否开启提醒
  changeStatus = ( item ) => {
    const { id, status } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'alertConfig/changeStatus',
      payload: {
        id,
        status: status ? 0 : 1,
      },
      callFunc: () => {
        const text = status ? '关闭提醒成功' : '开启提醒成功';
        message.success( text );
        this.getListData( this.searchBar.current.data );
      }
    } );
  }

  // 删除
  deleteItem = ( e, item ) => {
    e.stopPropagation();
    const { id } = item;
    const { dispatch } = this.props;
    dispatch( {
      type: 'alertConfig/delAlert',
      payload: { id },
      callFunc: () => {
        message.success( '删除预警配置成功' );
        this.setState( {
          pageNum: 1,
        }, () => this.filterSubmit() );
      }
    } );
  }

  // 对话框
  showModal = ( item ) => {
    if( item?.warnAccount ) {
      console.log( '编辑' );
      const { dispatch } = this.props;
      dispatch( {
        type: 'alertConfig/setAdminList',
        payload: item.warnAccount,
      } );
      const { cacheList } = this.state;
      this.setState( {
        cacheList: [...cacheList, ...item.warnAccount],
        current: item,
        alertType: item.jiNiuEarly,
        visible: !this.state.visible
      } );
    } else {
      console.log( '新增' );
      this.getAdminList( '', ()=>{
        this.setState( {
          current: item,
          alertType: item.jiNiuEarly,
          visible: !this.state.visible
        } );
      } )
    }
  }

  closeModal = () => {
    this.setState( {
      visible: false,
      current: undefined,
    } );
  };

  // 新增/编辑
  handleSubmit = ( e ) => {
    e.preventDefault();
    e.persist();
    const { dispatch, form, merchantNames } = this.props;
    const { current, cacheList } = this.state;
    const id = current ? current.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) {
        return;
      }
      const params = id ? Object.assign( current, fieldsValue ) : { ...fieldsValue };
      
      if ( params.jiNiuEarly ) {
        // 选择预警权益商品，预警商户置空
        params.merchantList = []
      } else {
        // 表单的id值取出，从商户列表中取出匹配的对象，并替换key值使其符合接口
        const idList = params.merchantList && params.merchantList.length > 0 ? params.merchantList : [];
        const list = idList.map( item => merchantNames.filter( i => i.code === item )[0] )
        params.merchantList = list.map( item =>
        ( {
          code: item.code,
          name: item.name
        } ) )
      }
      
      const list = params.warnAccount.map( item => cacheList.filter( i => i.id === Number( item ) )[0] )
      const newWarnAccount = list.map( ( item )=>{
        return{
          nick: item.nick,
          id: item.id
        }
      } )
      params.warnAccount = newWarnAccount
      dispatch( {
        type: 'alertConfig/editAlert',
        payload: params,
        callFunc: ( res ) => {
          if ( res.success ) {
            message.success( res.message );
            this.setState( {
              visible: false,
              current: undefined,
            } );
          }
          this.getListData( this.searchBar.current.data );
        },
      } );
    } );
  }

  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    this.setState( {
      pageNum: 1
    }, () => {
      this.getListData( data );
    } )
  }

  // 获取列表数据
  getListData = ( data ) => {
    const { pageNum, pageSize, sortedInfo } = this.state;
    const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
    const { dispatch } = this.props;
    dispatch( {
      type: 'alertConfig/getAlertList',
      payload: {
        page:{
          pageNum,
          pageSize,
          orderBy,
        },
        ...data,
        
      },
    } );
  }

  // 下拉框商户名称列表
  getMerchantName = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'alertConfig/getMerchantNames',
      payload: {},
    } );
  }

  getAdminList = ( value, cb ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'alertConfig/getManagerUserList',
      payload: {
        page:{
          pageNum:1,
          pageSize:10,
         },
         nick:value
      },
      callFunc:( list=[] )=>{
        const { cacheList } = this.state;
        
        this.setState( {
          cacheList: [...cacheList, ...list]
        } );
        if( cb ) cb()
      }
    } );
  }

  // 排序
  tableChange = ( pagination, filters, sorter ) => {
    const { current, pageSize } = pagination;
    const sortObj = { order: 'descend', ...sorter, }
    if ( sortObj.columnKey === 'createTime' ) {
      sortObj.columnKey = 'create_time';
    }
    this.setState( {
      pageNum: current,
      pageSize,
      sortedInfo: sortObj,
    }, () => this.getListData( this.searchBar.current.data ) );
  };

  renderModal = () => {
    const { loading, merchantNames = {}, form: { getFieldDecorator, getFieldValue, }, adminList } = this.props;
    const { current = {}, visible, alertType } = this.state;
    return (
      <Modal
        className={styles.global_styles}
        visible={visible}
        title={`${current.id ? "编辑" : "新增"}预警配置`}
        destroyOnClose
        okText="保存"
        onCancel={this.closeModal}
        onOk={this.handleSubmit}
        width={600}
        footer={[
          <Button key="back" onClick={this.closeModal}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>保存</Button>,
        ]}
      >
        <Spin spinning={loading}>
          <div className={styles.common_container}>
            <Form layout="horizontal">
              {/* <FormItem label="通知类型" {...this.formLayout}>
                {getFieldDecorator('noticeType', {
                  rules: [{ required: true, message: '请选择通知类型' }],
                  initialValue: current.id ? current.noticeType : undefined
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择通知类型"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Option value="WECOM">企业微信</Option>
                  </Select>)}
              </FormItem> */}
              <FormItem label="预警名称" {...this.formLayout}>
                {getFieldDecorator( 'name', {
                  rules: [{ required: true, message: '请输入预警名称' }],
                  initialValue: current.id ? current.name : ''
                } )( <Input placeholder='请输入预警名称' maxLength={30} /> )}
              </FormItem>
              {/* <FormItem label="Hook地址" {...this.formLayout}>
                {getFieldDecorator('hook', {
                  rules: [{ required: true, message: '请输入Hook地址' }],
                  initialValue: current.id ? current.hook : ''
                })(<Input placeholder='从第三方系统获取webhook并填写到此处' />)}
              </FormItem> */}
              <FormItem label="预警类型" {...this.formLayout}>
                {getFieldDecorator( 'jiNiuEarly', {
                  rules: [{ required: true }],
                  initialValue: current.id ? current.jiNiuEarly : false
                } )(
                  <Radio.Group onChange={( e ) => { this.setState( { alertType: e.target.value } ); }}>
                    <Radio value={false}>商户权益</Radio>
                    <Radio value>权益商品</Radio>
                  </Radio.Group> )}
              </FormItem>
              {
                getFieldValue( 'jiNiuEarly' ) === false ? (
                  <FormItem
                    label="预警商户"
                    {...this.formLayout}
                    style={{ display: alertType ? 'none' : '' }}
                  >
                    {getFieldDecorator( 'merchantList', {
                  initialValue: current.id && Object.keys( current.merchantList ).map( i => current.merchantList[i].code )
                } )(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择关联商户"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {
                      merchantNames ? Object.keys( merchantNames ).map( i =>
                        <Option key={i} value={merchantNames[i].code}>{merchantNames[i].name}</Option>
                      ) : ""
                    }
                  </Select>
                )}
                  </FormItem>
                ) : null
              }
              <FormItem
                label="预警商品类型"
                {...this.formLayout}
              >
                {getFieldDecorator( 'earlyProductType', {
                  initialValue: current.id ? current.earlyProductType : [],
                  rules: [{ required: true, message: '请选择商品类型' }],
                } )(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选预警商品类型"
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Option value="COUPON">虚拟卡券</Option>
                    <Option value="GOODS">实物</Option>
                    <Option value="TG_COUPON">投顾卡券</Option>
                    <Option value="JN_RED">绩牛红包</Option>
                    <Option value="JN_RIGHT">绩牛权益</Option>
                    <Option value="CUSTOM">自定义商品</Option>
                    {/* <Option value="RED">红包</Option> */}
                    {/* <Option value="PHONE">直充</Option> */}
                    {/* <Option value="WX_COUPON">微信立减金</Option> */}
                    {/* <Option value="WX_VOUCHER">微信代金券</Option> */}
                    {/* <Option value="RIGHT_PACKAGE">权益包</Option> */}
                  </Select>
                )}
              </FormItem>
            </Form>
            <Divider dashed style={{ margin: '8px 0', fontSize: 14, color: "#1F3883" }}>预警配置</Divider>
            {/* <Form layout="inline" style={{ marginBottom: 24 }}>
              <FormItem label="峰值预警" style={{ width: '43%' }} {...this.inlineFormLayout}>
                {getFieldDecorator( 'objectEarlyTime', {
                  initialValue: current.id ? current.objectEarlyTime : ''
                } )(
                  <InputNumber
                    precision={0}
                    min={1}
                    max={60}
                    placeholder='请输入1-60'
                    style={{ width: "100%" }}
                  /> )}
              </FormItem>
              <FormItem style={{ width: '11%' }}>
                {getFieldDecorator( 'objectEarlyTimeUnit', {
                  rules: [{ required: true }],
                  initialValue: current.id ? current.objectEarlyTimeUnit || 'MINUTES' : 'MINUTES'
                } )(
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Option value='HOURS'>小时</Option>
                    <Option value='MINUTES'>分钟</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem style={{ width: '30%' }}>
                {getFieldDecorator( 'peekObjectInventory', {
                  initialValue: current.id ? current.peekObjectInventory : '',
                } )(
                  <InputNumber
                    precision={0}
                    min={1}
                    placeholder='请输入预警值'
                    style={{ width: "80%", marginRight: 10 }}
                  /> )}
                <span>笔</span>
              </FormItem>
            </Form> */}
            <Form layout="horizontal">
              <FormItem label="剩余库存预警" {...this.formLayout}>
                {getFieldDecorator( 'objectEarly', {
                  initialValue: current.id ? current.objectEarly : '',
                } )(
                  <InputNumber
                    precision={0}
                    min={0}
                    placeholder='低于等于此数值时，进行预警'
                    style={{ width: "85%", marginRight: 10 }}
                  /> )}
                <span>个 (元)</span>
              </FormItem>
            </Form>
            {/* <Divider dashed style={{ margin: '8px 0', fontSize: 14, color: "#1F3883" }}>金额配置</Divider>
            <Form layout="inline" style={{ marginBottom: 24 }}>
              <FormItem label="金额峰值预警" style={{ width: '43%' }} {...this.inlineFormLayout}>
                {getFieldDecorator( 'amountEarlyTime', {
                  initialValue: current.id ? current.amountEarlyTime : ''
                } )( <InputNumber
                  precision={0}
                  min={1}
                  max={60}
                  placeholder='请输入1-60'
                  style={{ width: "100%" }}
                /> )}
              </FormItem>
              <FormItem style={{ width: '11%' }}>
                {getFieldDecorator( 'amountEarlyTimeUnit', {
                  rules: [{ required: true }],
                  initialValue: current.id ? current.amountEarlyTimeUnit || 'MINUTES' : 'MINUTES'
                } )(
                  <Select
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    <Option value='HOURS'>小时</Option>
                    <Option value='MINUTES'>分钟</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem style={{ width: '30%' }}>
                {getFieldDecorator( 'peekAmountInventory', {
                  initialValue: current.id ? current.peekAmountInventory : '',
                } )(
                  <InputNumber
                    precision={2}
                    min={1}
                    placeholder='请输入预警金额'
                    style={{ width: "80%", marginRight: 10 }}
                  /> )}
                <span>元</span>
              </FormItem>
            </Form> */}
            <Form layout="horizontal">
              {/* <FormItem label="剩余金额预警" {...this.formLayout}>
                {getFieldDecorator( 'amountEarly', {
                  initialValue: current.id ? current.amountEarly : '',
                } )(
                  <InputNumber
                    precision={2}
                    min={0}
                    placeholder='低于此数值时，进行预警'
                    style={{ width: "88%", marginRight: 10 }}
                  /> )}
                <span>元</span>
              </FormItem> */}
              <Divider dashed style={{ margin: '8px 0' }} />
              <FormItem label="提醒对象" {...this.formLayout}>
                {getFieldDecorator( 'warnAccount', {
                  initialValue: current.id ? current.warnAccount.map( item => String( item.id ) ) : []
                } )( 
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择提醒对象"
                    onSearch={this.debouncedOnSearch}
                    filterOption={false}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {
                      adminList.map( ( item )=>{
                        return <Option key={String( item.id )} value={String( item.id )}>{item.nick}</Option>
                      } )
                    }
                  </Select> )}
              </FormItem>
              <FormItem label="是否开启提醒" {...this.formLayout}>
                {getFieldDecorator( 'status', {
                  rules: [{ required: true }],
                  valuePropName: 'checked',
                  initialValue: current.id ? current.status : true,
                } )( <Switch /> )}
              </FormItem>
              <FormItem label="描述" {...this.formLayout}>
                {getFieldDecorator( 'description', {
                  initialValue: current.id ? current.description : ''
                } )( <TextArea placeholder='请输入描述' maxLength={80} style={{ height: '100px' }} /> )}
              </FormItem>
            </Form>
          </div>
        </Spin>
      </Modal>
    )
  }

  render() {
    const { loading, alertList: { total, list } } = this.props;
    const { pageSize, pageNum, sortedInfo } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      }
    };

    const columns = [
      {
        title: <span>预警名称</span>,
        dataIndex: 'name',
        key: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>通知类型</span>,
        dataIndex: 'noticeType',
        key: 'noticeType',
        render: () => <span>平台通知</span>,
      },
      {
        title: <span>是否开启提醒</span>,
        dataIndex: 'status',
        key: 'status',
        render: ( status, item ) => (
          <Popconfirm
            placement="top"
            title={status ? '是否关闭该提醒？' : '确定开启该提醒？'}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            onConfirm={() => this.changeStatus( item )}
            okText="是"
            cancelText="否"
          >
            <Switch checked={status} />
          </Popconfirm>
        ),
      },
      {
        title: <span>商户名称</span>,
        dataIndex: 'merchantList',
        key: 'merchantList',
        width: '300px',
        ellipsis: true,
        render: merchantList => {
          return merchantList.map( ( item )=>{
            return <Tag key={item.code}>{item.name}</Tag>
          } )
        },
      },
      {
        title: <span>提醒对象</span>,
        dataIndex: 'warnAccount',
        key: 'warnAccount',
        ellipsis: true,
        render: warnAccount => {
          return warnAccount.map( ( item )=>{
            return <Tag key={item.id}>{item.username || item.nick}</Tag>
          } )
        },
      },
      {
        title: <span>创建时间</span>,
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
        sortDirections: ['descend', 'ascend'],
        render: createTime => <span>{createTime ? moment( createTime ).format( 'YYYY-MM-DD HH:mm:ss' ) : '--'}</span>,
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: ( v, item ) => (
          <div>
            <a style={{ color: "#5087ec", padding: "0 20px 0 0" }} onClick={() => this.showModal( item )}>编辑</a>
            <Popconfirm
              placement="left"
              title="是否确认删除？"
              onConfirm={( e ) => this.deleteItem( e, item )}
              okText="确定"
              cancelText="取消"
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <span style={{ cursor: 'pointer', color: 'red' }}>删除</span>
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title={
            <div className={styles.grid_title}>
              <span>预警配置</span>
              <Tooltip title='新增预警'>
                <Icon className={styles.add_icon} onClick={this.showModal} type='plus' />
              </Tooltip>
            </div>
          }
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.global_styles}>
            <SearchBar
              ref={this.searchBar}
              searchEleList={this.searchEleList}
              searchFun={this.filterSubmit}
              loading={loading}
            />
          </div>
          <Table
            size="middle"
            rowKey="id"
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            onChange={this.tableChange}
          />
        </Card>
        {this.renderModal()}
      </GridContent>
    );
  };
}

export default AlertConfig;

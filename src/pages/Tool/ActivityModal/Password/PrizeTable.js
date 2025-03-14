import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Radio, Spin, Tabs } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../Lists.less';
import WxShare from './WxShare';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const time = () => new Date().getTime();
const { Option } = Select;
const { TabPane } = Tabs;
@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )
@Form.create()
class PrizeCom extends PureComponent {
  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  formLayout1 = {
    labelCol: { span: 9 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      list:props.prizes && props.prizes.length ? props.prizes.map( item => ( { ...item, rowKey:item.id } ) ) : [],
      newAllPrizeList:[],
      useInventory: '',
      deleteIds:[0],
      popupValue:'',
      exchangePasswordValue:'',
      currTab:1
    };
  }


  componentDidMount() {
    this.getPrizeList( {} )
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }



  // 获取选择奖品列表
  getPrizeList = ( { name = '' } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getAllPrizeList',
      payload: {
        pageNum: 1,
        pageSize: 30,
        name,
      },
      callFunc:( res )=>{
        this.setState( { newAllPrizeList:[...res] } )
      }
    } );
  }

  getData = () =>{
    const { list, deleteIds } = this.state;
    let wxShareData={}
    if( this.wxShareRef ){
      wxShareData = this.wxShareRef.getValues();
    }
    return { prizes: list, deleteIds, ...wxShareData }
  }

  getValues = () => {
    const { list, deleteIds } = this.state;

    let wxShareData={}
    if( this.wxShareRef ){
      wxShareData = this.wxShareRef.getValues();
    }
    return{ prizes: list, deleteIds, ...wxShareData }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue:'',
      exchangePasswordValue:''
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, item ) => {
    e.stopPropagation();
    const { prizeId } = item;
    const { newAllPrizeList } = this.state;
    const obj = newAllPrizeList.find( o => o.id === prizeId )
    if( obj ){
      this.setState( {
        useInventory: obj ? obj.activeCount : '',
      } );
    }else{
      const { dispatch } = this.props;
      dispatch( {
        type:'activity/getSinglePrizeList',
        payload:{ id:prizeId },
        callFunc:( res )=>{
          const arr = res ? newAllPrizeList.concat( res ) : newAllPrizeList;
          this.setState( {
            newAllPrizeList:arr,
            useInventory: res ? res.activeCount : '',
          } );
        }
      } )
    }
    this.setState( {
      prizeCurrent:item,
      popupValue: item.popupText || '',
      exchangePasswordValue:item.description || '',
      visible: true,
    } )
  };

  popupChange = ( e ) =>{
    this.setState( { popupValue:e.target.value } )
  }

  exchangePasswordChange = ( e ) =>{
    this.setState( { exchangePasswordValue:e.target.value } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue:'',
      exchangePasswordValue:''
    }, ()=>this.getPrizeList( {} ) );
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { list, deleteIds } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk:() => {
        const newList = list.filter( item => item.rowKey !==obj.rowKey );
        let newDeleteIds = deleteIds;

        if( obj.id ){
          newDeleteIds = deleteIds.concat( [obj.id] )
        }
        this.setState( { list: newList, deleteIds:newDeleteIds }, ()=>{
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  // 提交：商品种类
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const {  form } = this.props;
    const { prizeCurrent, list, useInventory } = this.state;

    let newList = list;
    const $this = this;

    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { inventory } = fieldsValue
      if(  useInventory < inventory ){
        message.error( '活动库存不可大于可用库存' )
        return
      }
      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue } ): item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, prizeType: "ALL", rowKey:time() } ] )
        message.success( '添加成功' )
      }
      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory: '',
        list:newList,
        popupValue:'',
        exchangePasswordValue:''
      }, ()=>{
        $this.onPreview()
      } );
    } );
  };


  //  奖品输入名称筛选
  onSearch = ( value ) =>{
    clearTimeout( this.timer );
    this.timer=setTimeout( () => {
      this.getPrizeList( { name: value } );
    }, 500 );
  }

  //  库存切换
  onChange = ( id ) => {
    const { newAllPrizeList } = this.state;
    const { form: { setFieldsValue } } = this.props;
    const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}
    setFieldsValue( {
      name: getInventory ? getInventory.name : '',
      popupText: `恭喜你，获得${getInventory.name}`
    } )
    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
      popupValue:`恭喜你，获得${getInventory.name}`,
    } )
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  changeTab = ( currTab ) => {
    this.setState( { currTab } )
  }

  render() {
    const { loading, form: { getFieldDecorator }, data, onPreview  } = this.props;
    const { newAllPrizeList, visible, prizeCurrent = {}, useInventory, list, popupValue, exchangePasswordValue, currTab } = this.state;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>奖项名称</span>,
        dataIndex: 'name',
        render:name=><span>{name}</span>
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
        render: popupText => <span>{popupText || ''}</span>,
      },
      {
        title: <span>正确口令</span>,
        dataIndex: 'description',
        render: description => <span>{description || ''}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory || 0}</span>,
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || 0}</span>,
      },
      {
        title: <span>概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render: probability => <span>{ `${probability}%`}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, index )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor: 'pointer', color: '#f5222d' }}
              type="link"
              onClick={( e ) => this.deleteItem( e, item )}
            >删除
            </span>

          </div>
        ),
      },
    ];

    return (
      <Tabs defaultActiveKey="1" onChange={this.changeTab}>
        <TabPane tab={( <TabName name='奖品配置' isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
          <GridContent>
            <p style={{ fontWeight:600, color:'#000', fontSize:15 }}>口令奖品设置</p>
            <Alert
              style={{ marginBottom: 15 }}
              className={styles.edit_alert}
              message={(
                <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <span>添加口令奖品需先到“奖品管理”内配置，若已配置请忽略</span>
                  <span onClick={() => { window.open( `${window.location.origin}/oldActivity/prizeManage` )}} style={{ color: '#1890FF', cursor:'pointer' }}>奖品管理</span>
                </div> )}
              banner
            />
            <Table
              size="small"
              rowKey="rowKey"
              columns={columns}
              pagination={false}
              dataSource={list}
              footer={( ) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1890FF',
                  cursor:'pointer'
                }}
                onClick={this.showModal}
              >
                <Icon
                  type="plus-circle"
                  style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
                />
                添加奖品（{list.length}）
              </div>
            )
          }}
            />
            {
          visible ?
            <Modal
              maskClosable={false}
              title={`${prizeCurrent.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Spin spinning={loading}>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                  <FormItem label='选择奖项' {...this.formLayout}>
                    {getFieldDecorator( 'prizeId', {
                    rules: [{ required: true, message: `请选择奖品` }],
                    initialValue: prizeCurrent.prizeId,
                  } )(
                    <Select
                      onSearch={this.onSearch}
                      showSearch
                      filterOption={false}
                      onChange={this.onChange}
                    >
                      {
                        newAllPrizeList.length && newAllPrizeList.map( item=><Option key={item.id} value={item.id}>{item.name}</Option> )
                      }
                    </Select>
                   )}
                  </FormItem>

                  <FormItem
                    label='奖项名称'
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'name', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}奖项名称` }],
                      initialValue: prizeCurrent.name,
                    } )(
                      <Input placeholder={`${formatMessage( { id: 'form.input' } )}奖品名称`} />
                    )}
                  </FormItem>

                  <FormItem label='弹窗文案' {...this.formLayout}>
                    {getFieldDecorator( 'popupText', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}弹窗文案` }],
                      initialValue: prizeCurrent.popupText,
                    } )( <TextArea
                      rows={2}
                      placeholder="请输入抽奖结果弹窗文案"
                      onChange={this.popupChange}
                      maxLength={15}
                    /> )}
                    <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{popupValue.length}/15</span>
                  </FormItem>

                  <FormItem
                    label='正确口令'
                    {...this.formLayout}
                    extra={<span style={{ color: '#D1261B', fontSize: 12 }}>*同一活动内正确口令不能重复</span>}
                  >
                    {getFieldDecorator( 'description', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}正确口令` }],
                    initialValue: prizeCurrent.description,
                  } )( <Input placeholder='正确口令' onChange={this.exchangePasswordChange} maxLength={10} /> )}
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0, 0, 0, 0.25)' }}>{exchangePasswordValue.length}/10</span>
                  </FormItem>

                  <FormItem
                    label='活动库存'
                    {...this.formLayout}
                    extra={useInventory ? <span style={{ color:'#1890FF', fontSize:12 }}>当前可用库存：({useInventory}个)</span> : null}
                  >
                    {getFieldDecorator( 'inventory', {
                        rules: [
                          { required: true, message: `${formatMessage( { id: 'form.input' } )}活动库存` },
                          { pattern:new RegExp( /^\+?(0|[1-9][0-9]*)$/ ), message:'请输入正整数' }
                        ],
                        initialValue: prizeCurrent.inventory,
                      } )( <Input
                        placeholder='请输入该奖品库存数量'
                        precision={0}
                        min={0}
                        addonAfter='个'
                        type='number'
                      />
                      )}
                  </FormItem>

                  <FormItem label='概率' {...this.formLayout}>
                    {getFieldDecorator( 'probability', {
                      rules: [
                        { required: true, message: `${formatMessage( { id: 'form.input' } )}概率,并且只能输入数字` },
                        { pattern:new RegExp( /^(\d|[1-9]\d|100)(\.\d{1,2})?$/ ), message:'请输入0-100的数字,且最多有两位小数' }
                      ],
                      initialValue: prizeCurrent.probability,
                    } )( <Input
                      placeholder='请输入该奖项出现的概率'
                      precision={0}
                      min={0}
                      addonAfter='%'
                    />
                     )}
                  </FormItem>

                  <FormItem label='活动状态' {...this.formLayout}>
                    {getFieldDecorator( 'isSale', {
                      rules: [{ required: true, }],
                      initialValue: prizeCurrent === undefined || JSON.stringify( prizeCurrent ) === '{}' ? true : prizeCurrent.isSale
                    } )(
                      <Radio.Group>
                        <Radio value>上架</Radio>
                        <Radio value={false}>下架</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Form>
              </Spin>
            </Modal> : null
        }
          </GridContent>
        </TabPane>

        <TabPane tab='微信分享' key="2">
          <p style={{ fontWeight:600, color:'#000', fontSize:15 }}>微信分享（选填）</p>
          <WxShare
            data={data}
            onRef={( wxShare ) => {this.wxShareRef = wxShare}}
            onPreview={onPreview}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default PrizeCom;

const TabName = ( { name, errorFormList, requiredList, isActive } ) => {
  let isError = false;
  if ( errorFormList&&errorFormList.length && requiredList&&requiredList.length ){
    requiredList.forEach( item => {
      if ( !isError ){
        isError = errorFormList.includes( item )
      }

    } )
  }
  if ( isActive ) isError=false
  const style = isError? { color:'#f5222d' } : {}
  return (
    <div style={style} className={styles.edit_acitve_tab}>
      {name}
      {isError && <Icon type="exclamation-circle" theme="filled" style={{ color: '#f5222d' }} />}
    </div>
  )
}

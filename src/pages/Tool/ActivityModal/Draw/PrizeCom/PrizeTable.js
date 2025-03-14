import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Radio, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const time = () => new Date().getTime();
const { Option } = Select;
const { TextArea } = Input;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )
@Form.create()
class Prize extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  formLayout1 = {
    labelCol: { span: 9 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    let prizes=[]
    if( props.prizes && props.prizes.length >0 ){
      prizes = props.prizes.map( item =>( { ...item, rowKey:item.id } ) )
    }
    super( props );
    this.state = {
      list:prizes,
      useInventory: '',
      popupValue:'',
      newAllPrizeList:[],
      prizeState:true,
    };
  }


  componentDidMount() {
    this.getPrizeList( {} )
    this.props.onRef( this )
  }


  // 获取选择奖品列表
  getPrizeList = ( { name='' } ) => {
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


  onPreview = () => {
    this.props.onPreview()
  }

  getData = () => {
    const { list } = this.state;
    return { prizes: list }
  }

  getValues = () => {
    const { list } = this.state;
    return { prizes: list }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue:'',
      prizeState:true,
    } );
  };

  // 显示编辑遮罩层
  showEditModal=( e, item )=>{
    e.stopPropagation();
    const { prizeId } = item;
    if( prizeId && prizeId !=='onWinPrize' ){
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
        popupValue: item.popupText,
        prizeState:true,
        visible: true,
      } )
    }else{
        this.setState( {
        visible: true,
        prizeCurrent:{ ...item, prizeId:'onWinPrize' },
        popupValue: item.popupText,
        prizeState:false,
      } );
    }
  }


  // 弹窗文案数量动态变化
  popuChange = ( e ) =>{
    this.setState( { popupValue:e.target.value } )
  }


  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue:'',
      prizeState:true,
    } );
    this.getPrizeList( {} )
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { list } = this.state;

    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk:() => {
        // 过滤删除
        const newList = list.filter( item => item.rowKey !==obj.rowKey );
        this.setState( { list: newList }, ()=>{
          this.onPreview()
        } )
      },
      onCancel() {
      },
    } );
  }

  // 提交
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const {  form } = this.props;
    const { prizeCurrent, list, useInventory } = this.state;

    let newList = list;
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { inventory, dayMaxSendCount, probability } = fieldsValue
      if(  parseInt( useInventory, 0 )  <  parseInt( inventory, 0 ) ){
        message.error( '活动库存不可大于可用库存' )
        return
      }
      if( parseInt( dayMaxSendCount, 0 )>  parseInt( inventory, 0 ) ){
        message.error( '发放库存不可大于活动库存' )
        return
      }
      if(  parseInt( probability, 0 ) > 100 ){
        message.error( '概率不可超过100%' )
        return
      }
      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue } ): item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, rowKey:time() } ] )
      }
      //  未中奖处理
      newList.map( ( item )=>{
        const listItem = item
        const { name, prizeId } = listItem;
        if( prizeId === 'onWinPrize' || name === '未中奖' ){
          listItem.prizeId = ''
        }
        return listItem
      } )
      $this.setState( {
        visible: false,
        prizeState:true,
        prizeCurrent: undefined,
        useInventory: '',
        list:newList,
      }, ()=>{
        $this.getPrizeList( {} );
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
    const { form: { setFieldsValue } } = this.props;
    if( id === 'onWinPrize' || id === undefined ||id === '' ){
      setFieldsValue( {
        popupText:'谢谢参与',
        name:'未中奖',
      } )
      this.setState( { prizeState:false, popupValue:'谢谢参与' } )
    }else{
      const { newAllPrizeList } = this.state;
      const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}
      setFieldsValue( {
        name: getInventory ? getInventory.name : '',
        popupText:`恭喜你，获得${getInventory.name}`,
      } )
      this.setState( {
        useInventory: getInventory ? getInventory.activeCount : '',
        popupValue:`恭喜你，获得${getInventory.name}`,
        prizeState:true
      } )
    }
  }


  render() {
    const { loading, form: { getFieldDecorator } } = this.props;
    const { visible, prizeCurrent = {}, useInventory, list, popupValue, newAllPrizeList, prizeState } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };
    const columns =[
      {
        title: <span>奖项名称</span>,
        dataIndex: 'name',
        render:name=><span>{name}</span>
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
        render: popupText => <span>{popupText || '--'}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory !==undefined ? inventory : '--'}</span>,
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount !== undefined ? sendCount : '--'}</span>,
      },
      {
        title: <span>中奖概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render: probability => <span>{probability ? `${probability}%` : '--'}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item )}
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

    ]

    return (
      <GridContent>
        <Alert
          style={{ marginBottom: 15 }}
          className={styles.edit_alert}
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>添加奖品需先配置所需奖品，若已配置请忽略</span>
              <span onClick={() => {     window.open( `${window.location.origin}/oldActivity/prizeManagement` )}} style={{ color: '#1890FF', cursor:'pointer' }}>奖品管理</span>
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
                  cursor:'pointer',
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
              width={700}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Spin spinning={loading}>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                  <FormItem label='选择奖项' {...this.formLayout}>
                    {getFieldDecorator( 'prizeId', {
                  rules: [{ required: true, message: '请选择选择奖项' }],
                  initialValue: prizeCurrent.prizeId,
                } )(
                  <Select
                    onSearch={this.onSearch}
                    showSearch
                    filterOption={false}
                    onChange={( e ) => this.onChange( e )}
                  >
                    <Option value="onWinPrize" key="未中奖">未中奖</Option>
                    {
                      newAllPrizeList.length > 0 && newAllPrizeList.map( item=><Option key={item.id} value={item.id}>{item.name}</Option> )
                    }
                  </Select>
                )}
                  </FormItem>

                  <FormItem label='奖项名称' {...this.formLayout}>
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
                    onChange={this.popuChange}
                    maxLength={20}
                  /> )}
                    <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{popupValue.length}/20</span>
                  </FormItem>

                  <FormItem label='跳转链接' {...this.formLayout}>
                    {getFieldDecorator( 'link', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                  initialValue: prizeCurrent.link,
                } )( <Input placeholder="点击抽奖结果弹窗按钮，将跳转到该链接地址" /> )}
                  </FormItem>

                  {
                  prizeState &&
                  <FormItem
                    label='活动库存'
                    {...this.formLayout}
                    extra={useInventory ? <span style={{ color:'#1890FF', fontSize:12 }}>可用库存：({useInventory}个)</span> : null}
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
                }

                  <FormItem label='概率' {...this.formLayout} extra={<span style={{ color:"#3097f6" }}>所有奖品情况概率之和需为100%</span>}>
                    {getFieldDecorator( 'probability', {
                    rules: [
                      { required: true, message: `${formatMessage( { id: 'form.input' } )}概率` },
                      // { pattern:new RegExp( /^\d+(\.\d{1,2})?$/ ), message:'请输入正数,且最多有两位小数' }
                    ],
                    initialValue: prizeCurrent.probability,
                    } )( <Input
                      placeholder='请输入该奖项出现的概率'
                      precision={0}
                      min={0}
                      addonAfter='%'
                      type='number'
                    />
                  )}
                  </FormItem>

                  <FormItem label='状态' {...this.formLayout}>
                    {getFieldDecorator( 'isSale', {
                    rules: [{ required: true, message: '请选择状态' }],
                    initialValue:prizeCurrent.isSale === undefined ? 'true' : prizeCurrent.isSale.toString()
                  } )(
                    <Radio.Group>
                      <Radio value="true">上架</Radio>
                      <Radio value="false">下架</Radio>
                    </Radio.Group>
                    )}
                  </FormItem>
                </Form>
              </Spin>
            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default Prize;

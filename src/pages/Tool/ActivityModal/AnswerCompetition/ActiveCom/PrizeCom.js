import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Icon, Alert, message, Spin } from 'antd';
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
      prizes=props.prizes.map( item =>( { ...item, rowKey:item.id } ) )
    }
    super( props );
    this.state = {
      list:prizes,
      useInventory: '',
      popupValue:'',
      deleteIds:[0],
      prizeState:true,
      modalType:'prizeModal'
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


  getValues = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      modalType:'prizeModal',
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue:'',
      prizeState:true,
    } );
  };

  // 显示编辑遮罩层
  showEditModal=( e, item, type )=>{
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
        modalType:type,
        prizeCurrent:item,
        popupValue: item.popupText || '',
        prizeState:true,
        visible: true,
      } )
    }else{
      this.setState( {
        modalType:type,
        visible: true,
        prizeCurrent:{ ...item, prizeId:'onWinPrize' },
        popupValue: item.popupText || '',
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
      modalType:'prizeModal',
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue:'',
      prizeState:true,
    } );
    this.getPrizeList( {} );
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
        // 过滤删除
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
      if( useInventory < inventory ){
        message.error( '活动库存不可大于可用库存' )
        return
      }

      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList=list.map( item=>{
          const listItem=item
          if( item.name==='未中奖' ){
            delete listItem.prizeId
          }
          if( item.rowKey === prizeCurrent.rowKey ){
            return { ...listItem, ...fieldsValue }
          }
            return listItem
        } )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, rowKey:time() } ] )
        message.success( '添加成功' )
      }

      $this.setState( {
        modalType:'prizeModal',
        visible: false,
        prizeState:true,
        prizeCurrent: undefined,
        useInventory: '',
        list:newList,
      }, ()=>{
        $this.getPrizeList( {} )
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
    const { newAllPrizeList } = this.state;
    if( id === 'onWinPrize'|| id === undefined || id === '' ){
      setFieldsValue( {
        popupText:'谢谢参与',
        name:'未中奖',
      } )
      this.setState( { prizeState:false, popupValue:'未中奖' } )
      return
    }
    const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}
    setFieldsValue( {
      name: getInventory ? getInventory.name : '',
      popupText:`恭喜你，获得${getInventory.name}`,
    } )
    this.setState( {
      popupValue:`恭喜你，获得${getInventory.name}`,
      useInventory: getInventory ? getInventory.activeCount : '',
      prizeState:true
    } )
  }



  render() {
    const { loading, form: { getFieldDecorator } } = this.props;
    const { visible, prizeCurrent = {}, useInventory, list, popupValue, newAllPrizeList=[], prizeState, modalType } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns =[
      // {
      //   title: <span>奖项</span>,
      //   dataIndex: 'prizeId',
      //   align: 'center',
      //   render: prizeId => {
      //     if( prizeId === 'onWinPrize' ||prizeId === '' )return <span>未中奖</span>
      //     const prizeObj = ( newAllPrizeList.length && prizeId ) ? newAllPrizeList.find( item=>item.id===prizeId ):{}
      //     return( <span>{prizeObj  && prizeObj.name}</span> )
      //   },
      // },
      {
        title: <span>奖项名称</span>,
        dataIndex: 'name',
        render:name=><span>{name}</span>
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        align: 'center',
        render:( inventory, item )=>{
          if( inventory !== undefined ){
            return(
              <span>{inventory}个<Icon type="plus-circle" style={{ cursor:'pointer', color:'#56a2e8', marginLeft:'5px' }} onClick={( e )=>this.showEditModal( e, item, 'countModal' )} /></span>
            )
          }
          return ( <span>--</span> )
        }
      },
      {
        title: <span>概率</span>,
        dataIndex: 'probability',
        align: 'center',
        render:probability=><span>{probability ? `${probability}%` : '--'}</span>
      },
      // {
      //   title:<span>每日最多发放</span>,
      //   dataIndex:'daySendMaxCount',
      //   align: 'center',
      //   render:daySendMaxCount=><span>{daySendMaxCount ? `${daySendMaxCount}个` : '--'}</span>
      // },
      {
        title: <span>已发放数量</span>,
        dataIndex: 'sendCount',
        align: 'center',
        render:sendCount=><span>{sendCount !==undefined  ? `${sendCount}个` : '--'}</span>
      },
      // {
      //   title:<span>剩余数量</span>,
      //   dataIndex:' surplusCount',
      //   align: 'center',
      //   render:surplusCount=><span>{surplusCount ? `${surplusCount}个` : '--'}</span>
      // },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom: 5, cursor: 'pointer', color: '#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, item, 'prizeModal' )}
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
          footer={() => {
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
              title={modalType === 'prizeModal' ? `${prizeCurrent.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}` : '修改数量'}
              className={styles.standardListForm}
              width={700}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Spin spinning={loading}>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                  {
                  modalType === 'prizeModal' &&
                  <div>
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
                         newAllPrizeList && newAllPrizeList.map( item=><Option key={item.id} value={item.id}>{item.name}</Option> )
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
                    {/* <FormItem label='每日最多发放' {...this.formLayout}>
                      {getFieldDecorator( 'daySendMaxCount', {
                        rules: [
                          { required: false, message: `${formatMessage( { id: 'form.input' } )}每日最多发放` },
                          // { pattern:new RegExp( /^\d+(\.\d{1,2})?$/ ), message:'请输入正数,且最多有两位小数' }
                        ],
                        initialValue: prizeCurrent.daySendMaxCount,
                        } )( <Input
                          placeholder='请输入每日最多发放个数'
                          precision={0}
                          min={0}
                          addonAfter='个'
                          type='number'
                        />
                      )}
                    </FormItem> */}

                    <FormItem label='弹窗文案' {...this.formLayout}>
                      {getFieldDecorator( 'popupText', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}弹窗文案` }],
                      initialValue:prizeCurrent.popupText
                    } )(
                      <TextArea
                        rows={2}
                        placeholder="请输入抽奖结果弹窗文案"
                        onChange={this.popuChange}
                        maxLength={20}
                      />
                      )}
                      <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{popupValue.length}/20</span>
                    </FormItem>

                    <FormItem label='概率' {...this.formLayout} extra={<span style={{ color:"#3097f6" }}>总概率相加需等于100%</span>}>
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
                  </div>
                  }

                  {
                  modalType === 'countModal' &&
                    <FormItem
                      label='数量'
                      {...this.formLayout}
                      extra={useInventory ? <span style={{ color:'#1890FF', fontSize:12 }}>可用库存：({useInventory}个)</span> : null}
                    >
                      {getFieldDecorator( 'inventory', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}数量` }, ],
                        initialValue: prizeCurrent.inventory,
                        } )(
                          <Input
                            placeholder='请输入每日最多发放个数'
                            precision={0}
                            min={0}
                            addonAfter='个'
                            type='number'
                          />
                      )}
                    </FormItem>
                  }
                </Form>
              </Spin>
            </Modal> : null
        }
      </GridContent>
    );
  }
}

export default Prize;

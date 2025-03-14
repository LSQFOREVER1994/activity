import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Button, Modal, Form, Table, InputNumber, Select, Alert, Icon, message } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../../Lists.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const time = () => new Date().getTime();

const { Option } = Select;
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
    labelCol: { span: 15 },
    wrapperCol: { span: 7 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      list:props.list && props.list.length ? props.list.map( item => ( { ...item, rowKey:item.id } ) ) : [],
      useInventory: '',
      prizeDeleteIds:[0],
      popupValue:''

    };
  }


  componentDidMount() {
    this.props.onRef( this )
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
      }
    } );
  }

getData = () =>{
  const { list, prizeDeleteIds } = this.state;
  return { prizeList: list, prizeDeleteIds }
}

 getValues = () => {
   const { list, prizeDeleteIds } = this.state;
   return { prizeList: list, prizeDeleteIds }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue:''
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, prize ) => {
    e.stopPropagation();

    const $this = this;
    this.setState( {
      visible: true,
      prizeCurrent: prize,
      popupValue: prize.popupText || ''
    }, () => {
        $this.onChange( prize.prizeId, 'first' )
    } );
  };

  popuChange = ( e ) =>{
    this.setState( { popupValue:e.target.value } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',

    } );
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { list, prizeDeleteIds } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk:() => {
        const newList = list.filter( item => item.rowKey !==obj.rowKey );
        let newDeleteIds = prizeDeleteIds;

        if( obj.id ){
          newDeleteIds = prizeDeleteIds.concat( [obj.id] )
        }
        this.setState( { list: newList, prizeDeleteIds:newDeleteIds } )
      },
      onCancel() {
      },
    } );
  }

  // 提交：商品种类
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const {  form } = this.props;
    const { prizeCurrent, list, useInventory  } = this.state;

    let newList = list;
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      if ( fieldsValue.inventory > useInventory ) {
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
        list:newList
      } );
    } );
  };


  //  库存切换
  onChange = ( id, num ) => {
    const { allPrizeList, form: { setFieldsValue } } = this.props;
    const getInventory = ( allPrizeList.length && id ) ? allPrizeList.find( item => item.id === id ) : {}
    if ( !num ) {
      setFieldsValue( {
        name: getInventory ? getInventory.name : '',
      } )
    }
    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
    } )
  }


  render() {
    const { form: { getFieldDecorator }, allPrizeList,  } = this.props;
    const { visible, prizeCurrent = {}, useInventory, list, popupValue } = this.state;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>奖品</span>,
        dataIndex: 'prizeId',
        width:130,
        render: prizeId => {
          const prizeObj = allPrizeList.length ? allPrizeList.find( item => item.id === prizeId ) : {}
          return ( <span>{prizeObj ? prizeObj.name : '未中奖'}</span> )
        },
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || 0}</span>,
      },
      {
        title: <span>中奖概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render: probability => <span>{probability === 100 ? '--' : `${probability}%`}</span>
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
        width: 90,
      },
    ];

    return (
      <GridContent>
        <Alert
          style={{ marginBottom: 15 }}
          className={styles.edit_alert}
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>添加奖品需先配置所需奖品，若已配置请忽略</span>
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
                  height: 54, color: '#1890FF',
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
              <div>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>

                  <FormItem
                    label='奖品'
                    {...this.formLayout}
                    // extra={<span style={{ fontSize: 12 }}>没有找到所需奖品？到<span style={{ color:'#1890FF' }}>奖品管理</span>中进行新增</span>}
                  >
                    {getFieldDecorator( 'prizeId', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}奖品名称` }],
                      initialValue: prizeCurrent.prizeId,
                    } )(
                      <Select
                        placeholder="选择奖品"
                        showSearch
                        filterOption={false}
                        onChange={( e ) => this.onChange( e )}
                      >
                        <Option value=''>未中奖</Option>
                        {
                          allPrizeList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
                        }
                      </Select>
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
                  <FormItem
                    label='活动库存'
                    {...this.formLayout}
                    extra={useInventory ? <span style={{ color:'#1890FF', fontSize:12 }}>当前可用库存：({useInventory}个)</span> : null}
                  >
                    {getFieldDecorator( 'inventory', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动库存` }],
                          initialValue: prizeCurrent.inventory,
                    } )( <InputNumber placeholder='请输入该奖品库存数量' precision={0} min={0}  /> )}
                  </FormItem>
                  <FormItem
                    label='中奖概率'
                    {...this.formLayout}
                    extra={<span style={{ color: '#D1261B', fontSize: 12 }}>*所有奖品情况概率之和需为100%</span>}
                  >
                    {getFieldDecorator( 'probability', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}数量` }],
                      initialValue: prizeCurrent.probability,
                    } )( <InputNumber placeholder='请输入该奖品情况出现的概率' min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace( '%', '' )} /> )}
                  </FormItem>
                </Form>
              </div>
            </Modal> : null
        }
      </GridContent>
    );
  }
}

export default PrizeCom;

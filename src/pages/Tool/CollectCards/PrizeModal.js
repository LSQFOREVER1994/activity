import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {  Input, Button, Modal, Form, Table, InputNumber, Select, Row, Col, Tooltip, Icon, message } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const FormItem = Form.Item;
const { confirm } = Modal;

const { Option } = Select;
@connect( ( { activity } ) => ( {
  loading: activity.loading,
  collectCardsSpecsObj:activity.collectCardsSpecsObj,
  allPrizeList: activity.allPrizeList,
} ) )
@Form.create()
class PrizeTable extends PureComponent {
  state = {
    activeIndex: undefined,
    // prizeList:[],
    useInventory:'',
    prizeName:''
  };

  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  formLayout1 = {
    labelCol: { span: 15 },
    wrapperCol: { span: 7 },
  };


  componentWillMount() {

  }

  componentDidMount() {
    const { dispatch, collectCardsSpecsObj, collectCardsSpecsObj:{ prizeList } } = this.props;
    if( prizeList.length === 0 ){
      dispatch( {
        type:'activity/SetState',
        payload:{
          collectCardsSpecsObj:{
            ...collectCardsSpecsObj,
            nextState:true
          }
        }
      } )
    }
    this.getPrizeList( {} )
    this.props.onRef( this )
  }

  // // 获取奖品展示列表
  // fetchList = () =>{
  //   const { dispatch, collectCardsSpecsObj } = this.props;
  //   const { id } = collectCardsSpecsObj;
  //   dispatch( {
  //     type: 'activity/getPrizeListAll',
  //     payload:{
  //       id
  //     },
  //     callFunc:( result )=>{
  //       dispatch( {
  //         type:'activity/SetState',
  //         payload:{
  //           collectCardsSpecsObj:{
  //             ...collectCardsSpecsObj,
  //             prizeList:result
  //           }
  //         }
  //       } )
  //     }
  //   } )
   
  // }


  // 获取选择奖品列表
  getPrizeList = ( { name= '' } ) =>{
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getAllPrizeList',
      payload: {
        pageNum:1,
        pageSize:30,
        name,
      }
    } );
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      activeIndex: undefined,
      useInventory:'',
      prizeName:''
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, index ) => {
    e.stopPropagation();
    const { collectCardsSpecsObj:{ prizeList } } = this.props;
    const obj = prizeList[index];
    const $this = this;
    this.setState( {
      visible: true,
      prizeCurrent: obj,
      activeIndex:index
    }, ()=>{
      $this.onChange( obj.prizeId, 'first' )
    } );
  };

 
  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory:'',
      prizeName:''
    } );
  };


  // 删除种类
  deleteItem = ( e, index ) => {
    e.stopPropagation();
    
    const { collectCardsSpecsObj, dispatch } = this.props;
    const list =collectCardsSpecsObj ? collectCardsSpecsObj.prizeList : [];
    const obj = list[index];
  
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        list.splice( index, 1 );
        if( obj.id ){
          collectCardsSpecsObj.prizeDeleteIds.push( obj.id )
        }
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ ...collectCardsSpecsObj, prizeList:list }
          }
        } )
      },
      onCancel() {
      },
    } );
  }

  // 提交：商品种类
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form, collectCardsSpecsObj } = this.props;
    const { activeIndex } = this.state;
    const list = collectCardsSpecsObj.prizeList || [];
    const $this = this;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      if( activeIndex!== undefined ){
        list[activeIndex] = { ...list[activeIndex], ...fieldsValue, prizeType: "ALL" }
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ ...collectCardsSpecsObj, prizeList:list }
          }
        } )
        message.success( '添加成功' )
      }else{
        list.push( { ...fieldsValue, prizeType: "ALL" } )
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ ...collectCardsSpecsObj, prizeList:list }
          }
        } )
        message.success( '添加成功' )
      }

      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory:'',
        prizeName:''
      } );
    } );
  };


  //  库存切换
  onChange = ( id, num ) => {
    const { allPrizeList, form:{ setFieldsValue } } = this.props;
    const getInventory = ( allPrizeList.length && id ) ? allPrizeList.find( item=>item.id===id ):{}
    if( !num ){
      setFieldsValue( {
        name:getInventory ? getInventory.name : '',
      } )
    }
    this.setState( {
      useInventory:getInventory ? getInventory.activeCount : '',
    } )
    // this.fetchList( {} )
  }


  render() {
    const { form: { getFieldDecorator }, allPrizeList, collectCardsSpecsObj:{ prizeList } } = this.props;
    const { visible, prizeCurrent = {}, useInventory, prizeName } = this.state;
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk:  this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };
 
    const columns = [
      {
        title: <span>奖品</span>,
        dataIndex: 'prizeId',
        render: prizeId => {
          const prizeObj = allPrizeList.length? allPrizeList.find( item=>item.id===prizeId ):{}
          return( <span>{prizeObj?prizeObj.name:''}</span> )
        },
      }, 
      {
        title: <span>奖品名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory}</span>,
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || 0}</span>,
        // render: prizeId => {
        //   const prizeObj = allPrizeList.length? allPrizeList.find( item=>item.id===prizeId ):{}
        //   return( <span>{prizeObj ? prizeObj.sentCount : 0}</span> )
        // },
      },
      {
        title: <span>中奖概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render : probability=> <span>{probability === 100 ? '--' : `${probability}%` }</span>
      },     
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'id',
        render: ( id, item, index ) => (
          <div>
            <span
              style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
              type="link"
              onClick={( e ) => this.showEditModal( e, index )}
            >编辑
            </span>

            <span
              style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
              type="link"
              onClick={( e )  => this.deleteItem( e, index )}
            >删除
            </span>
          
          </div>
        ),
        width:90,
      },
    ];

    return (
      <GridContent>
        <p style={{ marginLeft:45, fontWeight:'bold' }}>没有找到所需奖品，点击跳转<span>奖品管理</span>进行新增，完成新增后，点击“奖品设置--添加”进行设置</p>
        <div style={{ margin: '0px 0px -25px 45px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          奖品设置
          <Button onClick={this.showModal} style={{ margin: '0 10px' }} type="primary" ghost>新增</Button>
          <div style={{ fontSize: 12, color: '#999', display:'flex', flexDirection:'column' }}>
            <div>*添加奖品：设置“奖品管理”中已有的奖品</div>
            <div>*不选择“奖品”，即为未中奖提示</div>
          </div>
        </div>
        <div style={{ width:'90%', margin:'40px auto 20px auto' }}>
          <Table
            size="small"
            rowKey="id"
            columns={columns}
            pagination={false}
            dataSource={prizeList}
          />
        </div>
        {
          visible?
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

                  <FormItem label='奖品' {...this.formLayout}>
                    {getFieldDecorator( 'prizeId', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}奖品名称` }],
                      initialValue: prizeCurrent.prizeId,
                    } )(  
                      <Select
                        placeholder="奖品" 
                        showSearch
                        filterOption={false}
                        onChange={( e )=>this.onChange( e )}
                      >
                        {
                          allPrizeList.map( item=><Option key={item.id} value={item.id}>{item.name}</Option> )
                        }
                      </Select>
                    )}
                  </FormItem>

                  <FormItem 
                    label={(
                      <span>奖品名称
                        <Tooltip title="有默认值,可修改">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    )}
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'name', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}奖品名称` }],
                      initialValue: prizeCurrent.name || prizeName,
                    } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}奖品名称`} /> )}
                  </FormItem>

                  <FormItem label='跳转链接' {...this.formLayout}>
                    {getFieldDecorator( 'link', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                      initialValue: prizeCurrent.link,
                    } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}跳转链接`} /> )}
                  </FormItem>

                  <Row gutter={24}>
                    <Col span={13}>
                      <FormItem label='活动库存' {...this.formLayout1}>
                        {getFieldDecorator( 'inventory', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动库存` }],
                          initialValue: prizeCurrent.inventory,
                        } )( <InputNumber placeholder='活动库存' precision={0} min={0} /> )}
                      </FormItem>
                    </Col>
                    <Col span={7}>
                      <p style={{ marginTop:'9px', fontSize:'11px', fontWeight:'450' }}>
                        {
                         useInventory ? <span>(可用库存：{useInventory})</span> : null
                        }
                      </p>
                    </Col>
                  </Row>
                  <FormItem label='中奖概率' {...this.formLayout}>
                    {getFieldDecorator( 'probability', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}数量` }],
                          initialValue: prizeCurrent.probability,
                        } )( <InputNumber placeholder='概率' min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace( '%', '' )} /> )}
                  </FormItem>
                  {/* 
                  {
                    getFieldValue( 'prizeType' ) === 'ALL'?
                      <FormItem label='中奖概率' {...this.formLayout}>
                        {getFieldDecorator( 'probability', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}数量` }],
                          initialValue: prizeCurrent.probability,
                        } )( <InputNumber placeholder='概率' min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace( '%', '' )} /> )}
                      </FormItem>
                    : null
                  } */}

                </Form>
              </div>
            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default PrizeTable;

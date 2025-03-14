import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {  Input, Button, Modal, Form, Table, InputNumber, Radio, Tooltip, Icon, message, Row, Col } from 'antd';

import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const backgroundCard = require( '../../../../src/assets/backgroundCard.png' )

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  collectCardsSpecsObj:activity.collectCardsSpecsObj,
} ) )
@Form.create()
class CardModal extends PureComponent {
  state = {

    // 福卡图
    coverSrcimage: '',
    imgagesSrcimage: '',
    previewVisibleimage: false,
    previewImageimage: '',
    fileListimage: [],

    // cardList:[],
    activeIndex: undefined,
  };

  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  formLayout1={
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.props.onRef( this )
  }

  // 改变下一步状态
  nextChang =()=>{
    const { dispatch, collectCardsSpecsObj } = this.props;
    dispatch( {
      type:'activity/SetState',
      payload:{
        collectCardsSpecsObj:{
          ...collectCardsSpecsObj,
          nextState:false
        }
      }
    } )
  }
  

  // // 获取卡牌列表
  // fetchList = () =>{
  //   const { dispatch, collectCardsSpecsObj } = this.props;
  //   const { id }= collectCardsSpecsObj;
  //   dispatch( {
  //     type: 'activity/getAllCardList',
  //     payload:{
  //       id
  //     },
  //     callFunc:( result ) => {
  //       dispatch( {
  //         type: 'activity/SetState',
  //         payload:{
  //           collectCardsSpecsObj:{
  //             ...collectCardsSpecsObj,
  //             cardInfoList:result
  //           }
  //         }
  //       } )
  //     }
  //   } )
  // }

  

  // 删除种类
  deleteItem = ( e, index ) => {
    e.stopPropagation();

    const { collectCardsSpecsObj, dispatch } = this.props;
    const list = collectCardsSpecsObj ? collectCardsSpecsObj.cardInfoList : []
    const obj = list[index];
    
    confirm( {
      cancelText:'取消',
      okText:'确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk() {
        list.splice( index, 1 );
        if( obj.id ){
          collectCardsSpecsObj.cardDeleteIds.push( obj.id )
        }
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ ...collectCardsSpecsObj, cardInfoList:list }
          }
        } )
      },
      onCancel() {
      },
    } );
  }



  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      cardCurrent: undefined,
      fileListimage: [],
      activeIndex: undefined,
    } );
  };

  // 显示编辑遮罩层
  showEditModal = ( e, index ) => {
    e.stopPropagation();
    const { collectCardsSpecsObj:{ cardInfoList } } = this.props;
    // const list = collectCardsSpecsObj ? collectCardsSpecsObj.cardInfoList : []
    const obj = cardInfoList[index]
    this.setState( {
      visible: true,
      cardCurrent: obj,
      fileListimage: obj.image ? [{ url: obj.image, uid: obj.image }]:[],
      activeIndex:index
    } );
  };

 
  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      cardCurrent: undefined,
    } );
  };

  // 提交（保存）
  cardHandleSubmit = ( e ) => {
    e.preventDefault();
    const { form, dispatch, collectCardsSpecsObj } = this.props;
    const{ activeIndex } = this.state;
    const list = collectCardsSpecsObj ? collectCardsSpecsObj.cardInfoList : []
    const id = collectCardsSpecsObj.id ? collectCardsSpecsObj.id : '';
    const $this = this;
    let sortRepeat = false // 判断是否排序重复
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      if( fieldsValue.isSpecial==='true' ){
        collectCardsSpecsObj.cardInfoList.forEach( item=>{
          if( item.sort===fieldsValue.sort ){
            sortRepeat=true;
          }
        } )
      }
      if( sortRepeat )
        {message.error( '福卡排序值重复' )
        return
      }

      if( activeIndex!== undefined ){
        list[activeIndex] = { ...list[activeIndex], ...fieldsValue }
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ 
              ...collectCardsSpecsObj, cardInfoList:list,
             }
          }
        } )
        message.success( '添加成功' )
      }else{
        // 普通卡添加最大库存,排序,每日最多
        if( fieldsValue.isSpecial==='false' ){
          fieldsValue.inventory = 999999;
          fieldsValue.dayMaxCount = 999999;
          fieldsValue.sort=999
        }
        list.push( { ...fieldsValue } )
        dispatch( {
          type: 'activity/SetState',
          payload:{
            collectCardsSpecsObj:{ 
              ...collectCardsSpecsObj, cardInfoList:list,
            }
          }
        } )
        message.success( '添加成功' )
      }

      // if( id ){
      //   this.nextChang()
      // }

      $this.setState( {
        visible: false,
        cardCurrent: undefined,
      } );
      // this.props.nextType()
    } );
  };

  
  // 打开图片预览
  PreviewFunc = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  PreviewFunc2 = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  uploadImg = ( res, type ) => {
    const list = this.state[`fileList${type}`];
    list[0] = res;
    this.setState( { [`fileList${type}`]: new Array( ...list ) } );
    this.props.form.setFieldsValue( { [type]:res.url } )

  }

  RemoveFunc = ( type ) => {
    this.setState( { [`fileList${type}`]: [] } );
    this.props.form.setFieldsValue( { [type]: '' } )
  }


  render() {
    const { form: { getFieldDecorator, getFieldValue }, collectCardsSpecsObj:{ cardInfoList } } = this.props;
    const {
      visible, cardCurrent={}, previewVisibleimage, previewImageimage, fileListimage,
    } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk:  this.cardHandleSubmit,
      onCancel: this.handleCancel
    };


    const columns = [
      {
        title: <span>福卡名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>,
      }, 
      {
        title: <span>总数量</span>,
        dataIndex: 'inventory',
        render:( id, item )=><span>{( ( item.isSpecial ).toString() === 'false' || item.inventory === 999999 ) ? '--' : item.inventory }</span>
      },
      {
        title: <span>已发数量</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || 0}</span>,
      },
      {
        title: <span>排序</span>,
        dataIndex: 'sort',
        render:( id, item )=><span>{( ( item.isSpecial ).toString() === 'false' || item.sort === 999 ) ? '--' : item.sort }</span>
      },
      {
        title: <span>概率</span>,
        dataIndex: 'probability',
        render : probability => <span>{probability}%</span>,
      },
      {
        title: <span>每日最多发放</span>,
        dataIndex: 'dayMaxCount',
        render:( id, item )=><span>{( ( item.isSpecial ).toString() === 'false' || item.dayMaxCount === 999999 ) ? '--' : item.dayMaxCount }</span>
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
      },
    ];

    return (
      <GridContent>
        <div style={{ margin: '0px 0px -25px 45px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          卡牌设置
          <Button onClick={this.showModal} style={{ margin: '0 10px' }} type="primary" ghost>新增</Button>
          <span style={{ fontSize: 12, color: '#999' }}>福卡可设置3张～15张，其他卡片不是非所集卡片</span>
        </div>
        <div style={{ width:'90%', margin:'40px auto 20px auto' }}>
          
          {/* <Button
            type="dashed"
            style={{ width: '100%', marginBottom: 8 }}
            icon="plus"
            onClick={this.showModal}
          >
            {formatMessage( { id: 'form.add' } )}
          </Button> */}
          <Table
            size="small"
            rowKey="id"
            columns={columns}
            pagination={false}
            dataSource={cardInfoList}
          />
        </div>
        {
          visible?
            <Modal
              maskClosable={false}
              title={`${cardCurrent.id ? formatMessage( { id: 'form.exit' } ) : formatMessage( { id: 'form.add' } )}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <div>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                  <FormItem label='福卡选择' {...this.formLayout}>
                    {getFieldDecorator( 'isSpecial', {
                      initialValue: cardCurrent.isSpecial ===undefined ? 'true' : cardCurrent.isSpecial.toString()
                    } )( 
                      <RadioGroup disabled={!!cardCurrent.id}>
                        <Radio value="true">福卡</Radio>
                        <Radio value="false">普通卡</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                  {
                    getFieldValue( 'isSpecial' )=== 'true' ? 
                      <div>
                        <FormItem label='福卡名称' {...this.formLayout}>
                          {getFieldDecorator( 'name', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}福卡名称` }],
                          initialValue: cardCurrent.name,
                        } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}福卡名称`} /> )}
                        </FormItem>
              
                        <Row gutter={24}>
                          <Col span={4} />
                          <Col span={10}>
                            <FormItem
                              label={(
                                <span>卡片正面
                                  <Tooltip title="图片建议大小（180px*180px）">
                                    <Icon type="question-circle-o" />
                                  </Tooltip>
                                </span>
                              )}
                              {...this.formLayout1}
                            >
                              {getFieldDecorator( 'image', {
                                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}图片` }],
                                initialValue: cardCurrent.image,
                              } )(
                                <div style={{ height: 110 }}>
                                  <UploadImg
                                    previewVisible={previewVisibleimage}
                                    previewImage={previewImageimage}
                                    fileList={fileListimage}
                                    CancelFunc={() => { this.CancelFunc( 'image' ) }}
                                    PreviewFunc={( e ) => { this.PreviewFunc2( e, 'image' ) }}
                                    ChangeFunc={( e ) => this.uploadImg( e, 'image' )}
                                    RemoveFunc={() => this.RemoveFunc( 'image' )}
                                  />
                                </div>
                              )}
                            </FormItem>
                          </Col>
                          <Col span={3}>
                            <div className={styles.exampleCard}>
                              <div className={styles.cardStyle}>
                                <img src={backgroundCard} alt='' />
                              </div>
                              <div className={styles.exampleText}>
                                <span>示例图</span>
                                <Icon type="zoom-in" style={{ marginLeft:3, marginTop:1 }} onClick={( e )=>this.props.exampleCardMax( e, backgroundCard )} />
                              </div>
                            </div>
                          </Col>
                        </Row>
                     
                        <FormItem label='总数量' {...this.formLayout}>
                          {getFieldDecorator( 'inventory', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}总数量` }],
                          initialValue: cardCurrent.inventory,
                        } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}总数量`} style={{ width:150 }} /> )}
                        </FormItem>

                        <FormItem 
                          label={(
                            <span>
                              排序&nbsp;
                              <Tooltip title="数值越小越靠前,默认值和最小值为1,可修改">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </span>
                        )}
                          {...this.formLayout}
                        >
                          {getFieldDecorator( 'sort', {
                            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}排序 ` }],
                            initialValue: cardCurrent.sort || 1,
                          } )( <InputNumber placeholder={`${formatMessage( { id: 'form.input' } )}排序`} step={1} min={1} max={999} style={{ width:150 }} /> )}
                        </FormItem>

                        <FormItem label='中奖概率' {...this.formLayout}>
                          {getFieldDecorator( 'probability', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}中奖概率` }],
                          initialValue: cardCurrent.probability,
                        } )( <InputNumber placeholder='中奖概率' min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace( '%', '' )} style={{ width:150 }} /> )}
                        </FormItem>

                        <FormItem label='每日最多发放' {...this.formLayout}>
                          {getFieldDecorator( 'dayMaxCount', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}每日最多发放` }],
                          initialValue: cardCurrent.dayMaxCount,
                        } )( <Input placeholder='每日最多发放' style={{ width:150 }} /> )}
                        </FormItem>
                      </div>
                    :
                      <div>
                        <FormItem label='普通卡名称' {...this.formLayout}>
                          {getFieldDecorator( 'name', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}福卡名称` }],
                          initialValue: cardCurrent.name,
                        } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}福卡名称`} /> )}
                        </FormItem>

                        <FormItem
                          label={(
                            <span>普通卡图片
                              <Tooltip title="图片建议大小（180px*180px）">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </span>
                        )}
                          {...this.formLayout}
                        >
                          {getFieldDecorator( 'image', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}图片` }],
                          initialValue: cardCurrent.image,
                        } )(
                          <div style={{ height: 110 }}>
                            <UploadImg
                              previewVisible={previewVisibleimage}
                              previewImage={previewImageimage}
                              fileList={fileListimage}
                              CancelFunc={() => { this.CancelFunc( 'image' ) }}
                              PreviewFunc={( e ) => { this.PreviewFunc2( e, 'image' ) }}
                              ChangeFunc={( e ) => this.uploadImg( e, 'image' )}
                              RemoveFunc={() => this.RemoveFunc( 'image' )}
                            />
                          </div>
                        )}
                        </FormItem>

                        <FormItem label='中奖概率' {...this.formLayout}>
                          {getFieldDecorator( 'probability', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}中奖概率` }],
                          initialValue: cardCurrent.probability,
                        } )( <InputNumber placeholder='概率' min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace( '%', '' )} style={{ width:150 }} /> )}
                        </FormItem>
                        <div className={styles.countNum}>(普通卡无数量限制,无限发放)</div>
                      
                      </div>
                  }

                </Form>
              </div>
            </Modal>:null
        }
      </GridContent>
    );
  }
}

export default CardModal;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const time = () => new Date().getTime();
const { Option } = Select;

@connect( ( { activity } ) => ( {
  loading:activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )
@Form.create()
class PrizeTable extends PureComponent {
  timer = null;

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };


  constructor( props ) {
    super( props );
    this.state = {
      list: ( props.prizes && props.prizes.length ) ? props.prizes.map( item => {  return ( { ...item, rowKey: item.id } ) } ) : [],
      newAllPrizeList:[],
      useInventory: '',
      deleteIds: [0],
      popupValue: '',
      modalType: 'prizeModal'
    };
  }


  componentDidMount() {
    this.getPrizeList( {} )
    this.props.onRef( this )
  }

  onPreview = () => {
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

  getData = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  getValues = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue: '',
      modalType: 'prizeModal',
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, item, type ) => {
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
        visible: true,
      } )
    }else{
      this.setState( {
        modalType:type,
        visible: true,
        prizeCurrent:{ ...item, prizeId:'onWinPrize' },
        popupValue: item.popupText || '',
      } );
    }
  };

  winningTipChange = ( e ) => {
    this.setState( { popupValue: e.target.value } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue: '',
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
      onOk: () => {
        const newList = list.filter( item => item.rowKey !== obj.rowKey );
        let newDeleteIds = deleteIds;

        if ( obj.id ) {
          newDeleteIds = deleteIds.concat( [obj.id] )
        }
        this.setState( { list: newList, deleteIds: newDeleteIds }, () => {
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
    const { form } = this.props;
    const { prizeCurrent, list, useInventory = 0 } = this.state;

    let newList = list;
    const $this = this;

    form.validateFields( ( err, fieldsValue ) => {

      if ( err ) return;
      const { inventory = 0 } = fieldsValue;
      if ( useInventory < inventory ) {
        message.error( '活动库存不可大于可用库存' )
        return
      }

      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList = list.map( item => {
          return item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue, activeCount:useInventory } ) : item
        } )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, activeCount:useInventory, prizeType: "ALL", rowKey: time() }] )
        message.success( '添加成功' )
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
        prizeCurrent: undefined,
        useInventory: '',
        list: newList,
      }, () => {
        $this.getPrizeList( {} )
        $this.onPreview()
      } );
    } );
  };


  //  奖品输入名称筛选
  onSearch = ( value ) => {
    clearTimeout( this.timer );
    this.timer = setTimeout( () => {
      this.getPrizeList( { name: value } );
    }, 500 );
  }

  //  库存切换
  onChange = ( id ) => {
    const { form: { setFieldsValue, getFieldValue } } = this.props;
    const { newAllPrizeList }=this.state;
    const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}

    if ( id === 'onWinPrize' || id === undefined || id === '' ) {
      setFieldsValue( {
        popupText: '谢谢参与',
        name: '未中奖',
      } )
    } else {
      const preizName = getInventory.name || ''
      setFieldsValue( {
        popupText: `恭喜你，获得${preizName}`,
        name: preizName,
      } )
    }
    const prizeValue = getFieldValue( 'popupText' );
    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
      popupValue: prizeValue,
    } )
  }



  //  图片切换
  imgChang = () => {
    setTimeout( () => {
      this.onPreview()
    }, 100 );
  }


  render() {
    const { loading, form: { getFieldDecorator, getFieldValue } } = this.props;
    const { newAllPrizeList, visible, prizeCurrent = {}, useInventory, list, modalType, popupValue } = this.state;
    const prizeValue = getFieldValue( 'prizeId' )
    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>奖品名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
        render: popupText => <span>{popupText || '--'}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: ( inventory, item ) => {
          if ( inventory ) {
            return (
              <span>{inventory}个<Icon type="plus-circle" style={{ cursor: 'pointer', color: '#56a2e8', marginLeft: '5px' }} onClick={( e ) => this.showEditModal( e, item, 'countModal' )} /></span>
            )
          }
          return ( <span>--</span> )
        }
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || '--'}</span>,
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
    ];

    return (
      <GridContent>
        <p style={{}}>提示：抽奖需配置至少1个奖项结果</p>
        <p style={{ paddingLeft: "40px" }}>增加数量时，直接点击数量右侧按钮进行增加</p>
        <p style={{ paddingLeft: "40px" }}>减少数量时，需先将概率调整为0，或者将活动更改为非进行中</p>
        <Alert
          style={{ marginBottom: 15 }}
          className={styles.edit_alert}
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>添加奖品需先配置所需奖品，若已配置请忽略</span>
              <span onClick={() => {     window.open( `${window.location.origin}/oldActivity/prizeManagement` ) }} style={{ color: '#1890FF', cursor: 'pointer' }}>奖品管理</span>
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
                  cursor: 'pointer'
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
            <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
              {
                modalType === 'prizeModal' &&
                <div>
                  <FormItem label='奖品' {...this.formLayout}>
                    {getFieldDecorator( 'prizeId', {
                      rules: [{ required: true, message: `请选择奖品` }],
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
                          newAllPrizeList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem label='奖品名称' {...this.formLayout}>
                    {getFieldDecorator( 'name', {
                      rules: [{ required: true, message: "奖品名称不能为空" }],
                      initialValue: prizeCurrent.name,
                    } )(
                      <Input placeholder="请输入奖品名称" />
                    )}
                  </FormItem>
                  <FormItem label='奖品描述' {...this.formLayout}>
                    {getFieldDecorator( 'description', {
                      initialValue: prizeCurrent.description,
                    } )( <Input placeholder="请输入奖品描述" /> )}
                  </FormItem>
                  <div style={{ display: 'flex', padding: '0px 0px 20px 120px', alignItems: 'center' }}>
                    <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 10, color: '#333' }} className={styles.edit_form_pre}>
                        <span style={{ color: 'red', marginRight: 5 }}>*</span>奖品图片:
                      </div>
                      <FormItem style={{ marginBottom: 0, paddingLeft: 80 }}>
                        {getFieldDecorator( 'image', {
                          rules: [{ required: true, message: '请上传奖品图片' }],
                          initialValue: prizeCurrent.image
                        } )( <UploadImg onChange={this.imgChang} /> )}
                      </FormItem>
                      <div style={{ fontSize: 13, color: '#999', position: 'absolute', top: '20px', right: '100px' }}>
                        格式：jpg/jpeg/png
                        <br />
                        建议尺寸：180px*180px
                        <br />
                        建议大小：不超过1M
                      </div>
                    </div>
                  </div>
                  <FormItem label='弹窗文案' {...this.formLayout}>
                    {getFieldDecorator( 'popupText', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}弹窗文案` }],
                      initialValue: prizeCurrent.popupText,
                    } )( <TextArea
                      rows={2}
                      placeholder="请输入发奖结果弹窗文案"
                      onChange={this.winningTipChange}
                      maxLength={20}
                    /> )}
                    <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{popupValue.length}/20</span>
                  </FormItem>

                  <FormItem label='跳转链接' {...this.formLayout}>
                    {getFieldDecorator( 'link', {
                      rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                      initialValue: prizeCurrent.link,
                    } )( <Input placeholder="点击立即领取按钮，跳转该链接" /> )}
                  </FormItem>
                  {prizeValue !== 'onWinPrize' &&
                    <FormItem
                      label='活动库存'
                      {...this.formLayout}
                      extra={useInventory ? <span style={{ color: '#1890FF', fontSize: 12 }}>当前可用库存：({useInventory}个)</span> : null}
                    >
                      {getFieldDecorator( 'inventory', {
                        rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动库存` }, { pattern: new RegExp( /^\+?(0|[1-9][0-9]*)$/ ), message: '请输入正整数' }],
                        initialValue: prizeCurrent.inventory,
                      } )( <Input
                        placeholder='请输入该奖品库存数量'
                        precision={0}
                        min={0}
                        addonAfter='个'
                      />
                      )}
                    </FormItem>
                  }
                  <FormItem
                    label='概率'
                    {...this.formLayout}
                    extra={<span style={{ color: '#D1261B', fontSize: 12 }}>*所有奖品情况概率之和需为100%</span>}
                  >
                    {getFieldDecorator( 'probability', {
                      rules: [
                        { required: true, message: `${formatMessage( { id: 'form.input' } )}概率,并且只能输入数字` },
                        { pattern: new RegExp( /^(\d|[1-9]\d|100)(\.\d{1,2})?$/ ), message: '请输入0-100的数字,且最多有两位小数' }
                      ],
                      initialValue: prizeCurrent.probability,
                    } )( <Input
                      placeholder='请输入该奖品出现的概率'
                      precision={0}
                      min={0}
                      addonAfter='%'
                    />
                    )}
                  </FormItem>
                </div>
              }
              {/* 编辑库存 */}
              {
                modalType === 'countModal' &&
                <FormItem
                  label='数量'
                  {...this.formLayout}
                  extra={useInventory ? <span style={{ color: '#1890FF', fontSize: 12 }}>可用库存：({useInventory}个)</span> : null}
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
        </Modal>
      </GridContent>
    );
  }
}

export default PrizeTable;

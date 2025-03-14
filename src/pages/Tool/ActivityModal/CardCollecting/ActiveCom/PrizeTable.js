import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Spin } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import serviceObj from '@/services/serviceObj';
import styles from '../../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const time = () => new Date().getTime();
const { Option } = Select;
const { activityTemplateObj } = serviceObj

const ImgObj = {
  winPrize: `${activityTemplateObj}dazhuanpan/image.png`,
}
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

  constructor( props ) {
    super( props );
    this.state = {
      list: props.prizes && props.prizes.length ? props.prizes.map( item => ( { ...item, rowKey: item.id } ) ) : [],
      useInventory: '',
      popupValue: '',
      newAllPrizeList: [],
      prizeState: true,
    };
  }


  componentDidMount () {
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
      callFunc: ( res ) => {
        this.setState( { newAllPrizeList: [...res] } )
      }
    } );
  }

  // getData = () =>{
  //   const { list, deleteIds } = this.state;
  //   return { prizes: list, deleteIds }
  // }

  getValues = () => {
    const { list } = this.state;

    return { prizes: list }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeState: true,
      prizeCurrent: undefined,
      useInventory: '',
      popupValue: '',
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, item ) => {
    e.stopPropagation();
    const { prizeId } = item;
    if ( prizeId && prizeId !== 'onWinPrize' ) {
      const { newAllPrizeList } = this.state;
      const obj = newAllPrizeList.find( o => o.id === prizeId )
      if ( obj ) {
        this.setState( {
          useInventory: obj ? obj.activeCount : '',
        } );
      } else {
        const { dispatch } = this.props;
        dispatch( {
          type: 'activity/getSinglePrizeList',
          payload: { id: prizeId },
          callFunc: ( res ) => {
            const arr = res ? newAllPrizeList.concat( res ) : newAllPrizeList;
            this.setState( {
              newAllPrizeList: arr,
              useInventory: res ? res.activeCount : '',
            } );
          }
        } )
      }
      this.setState( {
        prizeCurrent: item,
        popupValue: item.popupText,
        prizeState: true,
        visible: true,
      } )
    } else {
      this.setState( {
        visible: true,
        prizeCurrent: { ...item, prizeId: 'onWinPrize' },
        popupValue: item.popupText,
        prizeState: false,
      } );
    }
  }

  popuChange = ( e ) => {
    this.setState( { popupValue: e.target.value } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      prizeState: true,
    } );
    this.getPrizeList( {} );
  };


  // 删除种类
  deleteItem = ( e, obj ) => {
    e.stopPropagation();
    const { list } = this.state;
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.name}`,
      onOk: () => {
        const newList = list.filter( item => item.rowKey !== obj.rowKey );
        this.setState( { list: newList }, () => {
          this.onPreview()
        } )
      },
      onCancel () {
      },
    } );
  }

  // 提交：商品种类
  prizeHandleSubmit = ( e ) => {
    e.preventDefault();
    const { form } = this.props;
    const { prizeCurrent, list, useInventory } = this.state;

    let newList = list;
    const $this = this;

    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const { inventory } = fieldsValue
      if ( useInventory < inventory ) {
        message.error( '活动库存不可大于可用库存' )
        return
      }
      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue } ) : item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, prizeType: "ALL", rowKey: time() }] )
        message.success( '添加成功' )
      }
      //  未中奖处理
      newList.map( ( item ) => {
        const listItem = item
        const { name, prizeId } = listItem;
        if ( prizeId === 'onWinPrize' || name === '未中奖' ) {
          listItem.prizeId = ''
        }
        return listItem
      } )
      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory: '',
        list: newList,
        prizeState: true,
      }, () => {
        $this.getPrizeList( {} );
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
    const { form: { setFieldsValue } } = this.props;
    const { prizeCurrent, newAllPrizeList } = this.state;
    const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}
    if ( id === 'onWinPrize' || id === undefined || id === '' ) {
      setFieldsValue( {
        popupText: '谢谢参与',
        name: '未中奖',
        image: prizeCurrent && prizeCurrent.image ? prizeCurrent.image : ImgObj.winPrize,
      } )
      this.setState( { prizeState: false, popupValue: '谢谢参与' } )
      return
    }
    setFieldsValue( {
      name: getInventory ? getInventory.name : '',
      popupText: `恭喜你，获得${getInventory.name}`,
      image: prizeCurrent && prizeCurrent.image
    } )
    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
      popupValue: `恭喜你，获得${getInventory.name}`,
      prizeState: true
    } )
  }

  // //  图片切换
  // imgChang = () => {
  //   setTimeout(() => {
  //     this.onPreview()
  //   }, 100);
  // }


  render () {
    const { loading, form: { getFieldDecorator } } = this.props;
    const {
      visible, prizeCurrent = {}, useInventory, list, popupValue, newAllPrizeList, prizeState
    } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>奖项名称</span>,
        dataIndex: 'name',
        render: name => <span>{name}</span>
      },
      {
        title: <span>弹窗文案</span>,
        dataIndex: 'popupText',
        render: popupText => <span>{popupText}</span>,
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory !== undefined ? inventory : 0}</span>,
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount !== undefined ? sendCount : 0}</span>,
      },
      {
        title: <span>中奖概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render: probability => <span>{probability !== undefined ? `${probability}%` : '--'}</span>
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
    ];

    return (
      <GridContent>
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
                添加奖品
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
                <Form className={styles.formHeight} onSubmit={this.prizeHandleSubmit}>
                  <FormItem label='奖品' {...this.formLayout}>
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
                        <Option value="onWinPrize" key="未中奖">未中奖</Option>
                        {
                          newAllPrizeList.length > 0 && newAllPrizeList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
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

                  {/* <FormItem label='奖项图片' {...this.formLayout}>
                    {getFieldDecorator('image', {
                      rules: [{ required: true, message: '请上传奖品图片' }],
                      initialValue: prizeCurrent.image
                    })(<UploadImg onChange={this.imgChang} />)}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0, left: '125px',
                        width: '200px',
                        fontSize: 13,
                        color: '#999',
                        lineHeight: 2,
                        marginTop: '10px'
                      }}
                    >
                      <div>格式：jpg/jpeg/png </div>
                      <div>建议尺寸：180px*180px</div>
                      <div>建议大小：不超过1M</div>
                    </div>
                  </FormItem> */}

                  <FormItem label='弹窗文案' {...this.formLayout}>
                    {getFieldDecorator( 'popupText', {
                      rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}弹窗文案` }],
                      initialValue: prizeCurrent.popupText,
                    } )( <TextArea
                      rows={2}
                      placeholder="请输入抽奖结果弹窗文案"
                      onChange={this.popuChange}
                      maxLength={20}
                    // value={`恭喜你，获得${popupValue}`}
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
                      placeholder='请输入该奖项出现的概率'
                      precision={0}
                      min={0}
                      addonAfter='%'
                    />
                    )}
                  </FormItem>

                </Form>
              </Spin>
            </Modal> : null
        }
      </GridContent>
    );
  }
}

export default PrizeCom;

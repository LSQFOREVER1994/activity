import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
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
    labelCol: { span: 9 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      list: props.data && props.data.prizes && props.data.prizes.length ? props.data.prizes.map( ( item ) => ( { ...item, rowKey: item.id } ) ) : [],
      useInventory: '',
      deleteIds: [0],
      prizeState: true,
    };
  }

  componentDidMount() {
    this.getPrizeList( {} )
    this.props.onRef( this )
  }

  onPreview = () => {
    this.props.onPreview();
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

  //  提交数据
  getData = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  //  表单数据
  getValues = () => {
    const { list, deleteIds } = this.state;
    return { prizes: list, deleteIds }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeState: true,
      prizeCurrent: undefined,
      useInventory: '',
    } );
  };

  // 显示编辑遮罩层
  showEditModal=( e, item )=>{
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
      visible: true,
    } )
  }

  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
      prizeState: true
    }, () => this.getPrizeList( {} ) );
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

      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory: '',
        list: newList,
      }, () => {
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
    const { newAllPrizeList } = this.state;
    const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}
    const preizName = getInventory ? getInventory.name : ''
    setFieldsValue( {
      name: preizName,
    } )

    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
      prizeState: !( id === undefined )
    } )
  }

  render() {
    const { loading, form: { getFieldDecorator } } = this.props;
    const { visible, prizeCurrent = {}, useInventory, list = [], newAllPrizeList = [], prizeState } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };
    const columns = [
      {
        title: <span>奖项名称</span>,
        dataIndex: 'name',
        render: ( name, prize ) => {
          if ( name ) return <span>{name}</span>
          const obj = newAllPrizeList.find( item => item.id === prize.prizeId )
          return <span>{obj ? obj.name : '--'}</span>
        }
      },
      {
        title: <span>图片</span>,
        dataIndex: 'image',
        align: 'center',
        render: image => {
          return <div style={{  width: '60px', margin:'0 auto' }}><img src={image} alt="" style={{ width: '100%' }} /></div>
        }
      },

      {
        title: <span>活动库存</span>,
        key: 'inventory',
        dataIndex: 'inventory',
        render: ( inventory, item ) => <span>{item.prizeId !== '' ? inventory : '--'}</span>,
      },
      {
        title: <span>已用库存</span>,
        key: 'sendCount',
        dataIndex: 'sendCount',
        render: ( sendCount, item ) => {
          return <span>{item.prizeId !== undefined ? sendCount : '--'}</span>
        },
      },
      {
        title: <span>中奖概率</span>,
        dataIndex: 'probability',
        key: 'probability',
        render: probability => <span>{probability ? `${probability}%` : '--'}</span>
      },
      {
        title: formatMessage( { id: 'form.action' } ),
        dataIndex: 'edit',
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
      <GridContent>
        <div className={styles.red_rain_prize}>
          <div className={styles.lottery_prize}>
            <p className={styles.lottery_prize_name} style={{ width: '90%', color: '#d1261b' }}>对奖品进行设置，所有奖品情况概率之和需为100%</p>
          </div>
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
                          {
                            newAllPrizeList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
                          }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label='奖品名称' {...this.formLayout}>
                      {getFieldDecorator( 'name', {
                        rules: [{ required: true, message: `奖项名称不能为空！` }],
                        initialValue: prizeCurrent.name,
                      } )( <Input placeholder="请输入奖品名称" /> )}
                    </FormItem>

                    <div style={{ display: 'flex', padding: '0px 0px 20px 120px', alignItems: 'center' }}>
                      <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 10, color: '#333' }} className={styles.edit_form_pre}>
                          <span style={{ color: 'red' }}>*</span> 图片:
                        </div>
                        <FormItem style={{ marginBottom: 0, paddingLeft: 80 }}>
                          {getFieldDecorator( 'image', {
                            rules: [{ required: true, message: '请上传奖品图片' }],
                            initialValue: prizeCurrent.image
                          } )( <UploadImg /> )}
                        </FormItem>
                        <div style={{ fontSize: 13, color: '#999', position: 'absolute', top: '20px', right: '100px' }}>
                          格式：jpg/jpeg/png
                          <br />
                          建议尺寸：750px*270px
                          <br />
                          建议大小：不超过1M
                        </div>
                      </div>

                    </div>
                    <FormItem label='跳转链接' {...this.formLayout}>
                      {getFieldDecorator( 'link', {
                        rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                        initialValue: prizeCurrent.link,
                      } )( <Input placeholder="点击图片跳转链接，不填默认到我的优惠券" /> )}
                    </FormItem>

                    {
                      prizeState &&
                      <FormItem
                        label='活动库存'
                        {...this.formLayout}
                        extra={useInventory ? <span style={{ color: '#1890FF', fontSize: 12 }}>当前可用库存：({useInventory}个)</span> : null}
                      >
                        {getFieldDecorator( 'inventory', {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动库存` }],
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
                      label='中奖概率'
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
        </div>
      </GridContent>
    );
  }
}

export default PrizeCom;

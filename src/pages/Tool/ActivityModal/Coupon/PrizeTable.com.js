import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Modal, Form, Table, Select, Icon, message, Radio, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const time = () => new Date().getTime();
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  allPrizeList: activity.allPrizeList,
} ) )
@Form.create()
class PrizeTable extends PureComponent {

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
      list:props.prizeList && props.prizeList.length ? props.prizeList.map( item => ( { ...item, rowKey:item.id } ) ) : [],
      useInventory: '',
      deleteIds:[],
    };
  }


  componentDidMount() {
    this.getPrizeList( {} )
    this.props.onRef( this )
  }


  // 获取选择奖品列表
  getPrizeList = ( { name = '' } ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'activity/getAllPrizeList',
      payload: {
        // canOrder:true,
        pageNum: 1,
        pageSize: 30,
        name,
      }
    } );
  }


  onPreview = () => {
    this.props.onPreview()
  }

  
  getValues = () => {
    const { list, deleteIds } = this.state;
    return { list: [...list], deleteIds }
  }

  // 显示新建遮罩层
  showModal = () => {
    this.setState( {
      visible: true,
      prizeCurrent: undefined,
      useInventory: '',
    } );
  };


  // 显示编辑遮罩层
  showEditModal = ( e, prize ) => {
    e.stopPropagation();
    const $this = this;
    this.setState( {
      visible: true,
      prizeCurrent: prize,
    }, () => {
        $this.getPrizeList( {} )
        $this.onChange( prize.prizeId, 'first' )
    } );
  };


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
    const { list } = this.state;
    const { allPrizeList } = this.props;
    const prizeObj = allPrizeList.length ? allPrizeList.find( item => item.id === obj.prizeId ) : {}
    confirm( {
      cancelText: '取消',
      okText: '确定',
      title: `${formatMessage( { id: 'form.del.tit' } )}：${prizeObj.name}`,
      onOk:() => {
        // 过滤删除
        let { deleteIds } = this.state;
        if ( obj.id ) deleteIds = deleteIds.concat( [obj.id] )
        const newList = list.filter( item => item.rowKey !==obj.rowKey );
        this.setState( { list: newList, deleteIds }, ()=>{
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
      const { inventory, baseCount } = fieldsValue

      if( useInventory < inventory ){
        message.error( '活动库存不可大于可用库存' )
        return
      }

      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue, baseCount:baseCount || '0' } ): item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, baseCount:baseCount || '0', rowKey:time() } ] )
        message.success( '添加成功' )
      }

      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory: '',
        list:newList,
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
    const { loading, form: { getFieldDecorator }, allPrizeList } = this.props;
    const { visible, useInventory, list, prizeCurrent = {} } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns = [
      {
        title: <span>奖品名称</span>,
        dataIndex: 'prizeId',
        render: prizeId => {
          const prizeObj = allPrizeList.length ? allPrizeList.find( item => item.id === prizeId ) : {}
          let newText = ''
          if ( prizeObj && prizeObj.name ) {
            newText = prizeObj.name
            if ( newText.length > 4 ) {
              newText = `${prizeObj.name.substring( 0, 5 )}...`;
            }
          }
          return ( <span>{newText || ''}</span> )
        },
      },
      {
        title: <span>优惠券名称</span>,
        dataIndex: 'name',
        render: name => {
          if ( name && name.length > 6 ) {
            return ( <span>{`${name.substring( 0, 7 )}...`}</span> )
          }
          return ( <span>{name || ''}</span> )
        }
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render: inventory => <span>{inventory || '--'}</span>
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sendCount',
        render: sendCount => <span>{sendCount || '--'}</span>
      },
      {
        title: <span>状态</span>,
        dataIndex: 'isSale',
        render: isSale => <span>{isSale ? '上架' : '下架'}</span>
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
                  height: 54, color: '#1890FF',
                  cursor: 'pointer',
                }}
                onClick={this.showModal}
              >
                <Icon
                  type="plus-circle"
                  style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
                />
                新增优惠券
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
                  <FormItem label='奖品名称' {...this.formLayout}>
                    {getFieldDecorator( 'prizeId', {
                      rules: [{ required: true, message: '请选择可抢优惠券' }],
                      initialValue: prizeCurrent.prizeId,
                    } )(
                      <Select
                        onSearch={this.onSearch}
                        showSearch
                        filterOption={false}
                        onChange={( e ) => this.onChange( e )}
                      >
                        {
                          allPrizeList.map( item => <Option key={item.id} value={item.id}>{item.name}</Option> )
                        }
                      </Select>
                    )}
                  </FormItem>

                  <FormItem label='优惠券名称' {...this.formLayout}>
                    {getFieldDecorator( 'name', {
                      rules: [
                        { required: true, message: `${formatMessage( { id: 'form.input' } )}优惠券名称` },
                      ],
                      initialValue: prizeCurrent.name,
                    } )(
                      <Input placeholder={`${formatMessage( { id: 'form.input' } )}优惠券名称`} maxLength={10} />
                    )}
                  </FormItem>

                  <FormItem
                    label='活动库存'
                    {...this.formLayout}
                    extra={useInventory ? <span style={{ color: '#1890FF', fontSize: 12 }}>当前可用库存：({useInventory}个)</span> : null}
                  >
                    {getFieldDecorator( 'inventory', {
                      rules: [
                        { required: true, message: `${formatMessage( { id: 'form.input' } )}活动库存` },
                        { pattern: new RegExp( /^\+?(0|[1-9][0-9]*)$/ ), message: '请输入正整数' }
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

                  <FormItem label='显示数量' {...this.formLayout}>
                    {getFieldDecorator( 'isShowSendCount', {
                      rules: [{ required: true }],
                      initialValue: prizeCurrent === undefined || JSON.stringify( prizeCurrent ) === '{}' ? true : prizeCurrent.isShowSendCount
                    } )(
                      <RadioGroup>
                        <Radio value>显示已售数量</Radio>
                        <Radio value={false}>显示剩余库存量</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>

                  <FormItem label='已售基数' {...this.formLayout}>
                    {getFieldDecorator( 'baseCount', {
                      rules: [
                        { required: false, message: `${formatMessage( { id: 'form.input' } )}已售基数` },
                        { pattern: new RegExp( /^([1-9]\d*|[0]{1,1})$/ ), message: '请输入正整数，可以输入0' }
                      ],
                      initialValue: prizeCurrent.baseCount,
                    } )( <Input
                      placeholder='该奖品已售基数，不填默认为0'
                      precision={0}
                      min={0}
                      addonAfter='个'
                      type='number'
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
    );
  }
}

export default PrizeTable;
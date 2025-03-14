import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { Input, Modal, Form, Table, Select, Alert, Icon, message, DatePicker, Spin, Radio, Tabs } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const time = () => new Date().getTime();
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;
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

  formLayout3 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      list:props.flashSaleSpecs && props.flashSaleSpecs.length ? props.flashSaleSpecs.map( item => ( { ...item, rowKey:item.id } ) ) : [],
      newAllPrizeList:[],
      useInventory: '',
      isShowSellCountState:true,
      deleteIds:[0],
      showDates:props.flashSaleSpecs && props.flashSaleSpecs.length ? props.flashSaleSpecs.map( ( item )=>( item.id? moment( item.endTime ).format( 'YYYY-MM-DD' ):'' ) ) : [],
      errorFormList:[], // 表单错误项
      currTab:1,
      shareImg:props.data.shareImg,
      shareDescription:props.data.shareDescription,
      shareTitle:props.data.shareTitle,
      shareLink:props.data.shareLink
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
        canOrder:true,
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
    const { list, showDates, deleteIds, shareImg, shareDescription, shareTitle, shareLink } = this.state;
    return {
      flashSaleSpecs: list,
      deleteIds,
      showDates: showDates ? [...new Set( showDates )] : [],
      shareImg,
      shareDescription,
      shareTitle,
      shareLink
     }
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
      visible: true,
    } )
  };


  // 取消
  handleCancel = () => {
    this.setState( {
      visible: false,
      prizeCurrent: undefined,
      useInventory: '',
    } );
    this.getPrizeList( {} )
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
        const newList = list.filter( item => item.rowKey !== obj.rowKey );
        const chooseShowDates = []
        newList.forEach( ( item )=>{
          const endTimeDay = item.endTime ? moment( item.endTime ).format( 'YYYY-MM-DD' ) : ''
          chooseShowDates.push( endTimeDay )
        } )
        //  储存删除奖品的id
        let newDeleteIds = deleteIds;
        if( obj.id ){
          newDeleteIds = deleteIds.concat( [obj.id] )
        }

        this.setState( { list: newList, showDates:chooseShowDates, deleteIds:newDeleteIds }, ()=>{
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
      const { inventory, rangeTime, baseCount, amount, discountAmount } = fieldsValue
      const startTimeDay = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD' ) : '';
      const endTimeDay = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD' ) : '';

      if( startTimeDay !== endTimeDay ){
        message.error( '秒杀时间不可跨天' )
        return
      }
      if( useInventory < inventory ){
        message.error( '活动库存不可大于可用库存' )
        return
      }
      if( +amount < +discountAmount ){
        message.error( '秒杀价不可大于原价' )
        return
      }

      const startTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[0] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
      const endTime = ( rangeTime && rangeTime.length ) ? moment( rangeTime[1] ).format( 'YYYY-MM-DD HH:mm:ss' ) : '';
      delete fieldsValue.rangeTime

      if ( prizeCurrent && prizeCurrent.rowKey ) {
        newList = list.map( item => item.rowKey === prizeCurrent.rowKey ? ( { ...item, ...fieldsValue, startTime, endTime, baseCount:baseCount || '0' } ): item )
        message.success( '编辑成功' )
      } else {
        newList = newList.concat( [{ ...fieldsValue, startTime, endTime, baseCount:baseCount || '0', rowKey:time() } ] )
        message.success( '添加成功' )
      }

      const chooseShowDates = []
      newList.map( ( item )=>{
        const newEndTimeDay = item.endTime ? moment( item.endTime ).format( 'YYYY-MM-DD' ) : ''
        chooseShowDates.push( newEndTimeDay )
      } )

      $this.setState( {
        visible: false,
        prizeCurrent: undefined,
        useInventory: '',
        list:newList,
        showDates:chooseShowDates,
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
    const { newAllPrizeList }=this.state;
    const getInventory = ( newAllPrizeList.length && id ) ? newAllPrizeList.find( item => item.id === id ) : {}
    setFieldsValue( {
      name: getInventory ? getInventory.name : '',
    } )
    this.setState( {
      useInventory: getInventory ? getInventory.activeCount : '',
    } )
  }

  isShowSellCountChang=( e )=>{
    this.setState( {
      isShowSellCountState:e.target.value
    } )
  }

  shareImgChang=( value )=>{
    this.setState( {
      shareImg:value
    } )
  }

  shareDescriptionChange=( v )=>{
    this.setState( {
      shareDescription:v.target.value
    } )
  }

  shareTitleChange=( v )=>{
    this.setState( {
      shareTitle:v.target.value
    } )
  }

  shareLinkChange=( v )=>{
    this.setState( {
      shareLink:v.target.value
    } )
  }

  changeTab = ( currTab ) => {
    const { errorFormList } = this.state;
    if( errorFormList.length > 0 ){
      this.getHaveError()
    }
    this.setState( { currTab } )
  }

  render() {
    const { loading, form: { getFieldDecorator }  } = this.props;
    const {
      newAllPrizeList, visible, prizeCurrent = {}, useInventory, list, isShowSellCountState,
      errorFormList, currTab, shareImg, shareDescription, shareTitle, shareLink
    } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.prizeHandleSubmit,
      onCancel: this.handleCancel
    };

    const columns =[
      {
        title: <span>秒杀商品名称</span>,
        dataIndex: 'name',
        render:name => {
          if( name && name.length>6 ){
            return( <span>{`${name.substring( 0, 7 )}...`}</span> )
          }
            return( <span>{name||''}</span> )
        }
      },
      {
        title: <span>秒杀时间</span>,
        dataIndex: 'startTime',
        render:( id, item )=>(
          <span>{item.startTime && item.endTime ?
           `${item.startTime ?  moment( item.startTime ).format( 'MM-DD HH:mm:ss' ) :  '--'} ~ ${item.endTime ? moment( item.endTime ).format( 'HH:mm:ss' ) : '--'}`
           : '--'}
          </span>
        )
      },
      {
        title: <span>活动库存</span>,
        dataIndex: 'inventory',
        render:inventory=><span>{inventory || '--'}</span>
      },
      {
        title: <span>已用库存</span>,
        dataIndex: 'sellCount',
        render:sellCount=><span>{sellCount || '--'}</span>
      },
      {
        title: <span>奖品状态</span>,
        dataIndex: 'isSale',
        render:isSale=><span>{isSale ? '上架' : '下架'}</span>
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
      <Tabs defaultActiveKey="1" onChange={this.changeTab}>
        <TabPane tab={( <TabName name='抽奖结果' errorFormList={errorFormList} requiredList={['list']} isActive={parseInt( currTab, 10 ) === 1} /> )} key="1">
          <GridContent>
            <Alert
              style={{ marginBottom: 15 }}
              className={styles.edit_alert}
              message={(
                <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                  <span>添加秒杀商品需先到奖品管理内配置，若已配置请忽略</span>
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
                  cursor:'pointer',
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
              width={700}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              <Spin spinning={loading}>
                <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
                  <FormItem label='秒杀商品' {...this.formLayout}>
                    {getFieldDecorator( 'prizeId', {
                      rules: [{ required: true, message: '请选择秒杀商品' }],
                      initialValue: prizeCurrent.prizeId,
                    } )(
                      <Select
                        onSearch={this.onSearch}
                        showSearch
                        filterOption={false}
                        onChange={( e ) => this.onChange( e )}
                      >
                        {
                         newAllPrizeList.length && newAllPrizeList.map( item=><Option key={item.id} value={item.id}>{item.name}</Option> )
                        }
                      </Select>
                    )}
                  </FormItem>

                  <FormItem label='秒杀商品名称' {...this.formLayout}>
                    {getFieldDecorator( 'name', {
                      rules: [ { required: true, message: `${formatMessage( { id: 'form.input' } )}秒杀商品名称` } ],
                      initialValue: prizeCurrent.name,
                    } )(
                      <Input placeholder={`${formatMessage( { id: 'form.input' } )}秒杀商品名称`} maxLength={10} />
                    )}
                  </FormItem>

                  <FormItem
                    style={{ marginBottom: 10 }}
                    extra="设置当天秒杀时间，不可跨天"
                    label='秒杀时间'
                    {...this.formLayout}
                  >
                    {getFieldDecorator( 'rangeTime', {
                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}活动时间` }],
                    initialValue: prizeCurrent.startTime ? [moment( prizeCurrent.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( prizeCurrent.endTime, 'YYYY-MM-DD HH:mm:ss' )] :[],
                  } )( <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width:325 }}  /> )}
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

                  <FormItem label='原价' {...this.formLayout}>
                    {getFieldDecorator( 'amount', {
                        rules: [
                          { required: true, message: `${formatMessage( { id: 'form.input' } )}商品原价` },
                          { pattern:new RegExp( /^\d+(\.\d{1,2})?$/ ), message:'请输入正数,且最多有两位小数' }
                        ],
                        initialValue: prizeCurrent.amount,
                        } )( <Input
                          placeholder='请输入该奖品原价'
                          precision={0}
                          min={0}
                          addonAfter='元'
                          type='number'
                        />
                      )}
                  </FormItem>

                  <FormItem label='秒杀价' {...this.formLayout}>
                    {getFieldDecorator( 'discountAmount', {
                        rules: [
                          { required: true, message: `${formatMessage( { id: 'form.input' } )}商品秒杀价` },
                          { pattern:new RegExp( /^\d+(\.\d{1,2})?$/ ), message:'请输入正数,且最多有两位小数' }
                        ],
                        initialValue: prizeCurrent.discountAmount,
                        } )( <Input
                          placeholder='请输入该商品秒杀价'
                          precision={0}
                          min={0}
                          addonAfter='元'
                          type='number'
                        />
                      )}
                  </FormItem>

                  <FormItem label='显示数量' {...this.formLayout}>
                    {getFieldDecorator( 'isShowSellCount', {
                      rules: [{ required: true }],
                      initialValue:prizeCurrent === undefined || JSON.stringify( prizeCurrent ) === '{}' ? true : prizeCurrent.isShowSellCount
                    } )(
                      <RadioGroup onChange={this.isShowSellCountChang}>
                        <Radio value>显示已售数量</Radio>
                        <Radio value={false}>显示剩余库存量</Radio>
                      </RadioGroup>
                      )}
                  </FormItem>

                  {
                    isShowSellCountState &&
                    <FormItem label='已售基数' {...this.formLayout}>
                      {getFieldDecorator( 'baseCount', {
                        rules: [
                          { required: false, message: `${formatMessage( { id: 'form.input' } )}已售基数` },
                          { pattern:new RegExp( /^([1-9]\d*|[0]{1,1})$/ ), message:'请输入正整数，可以输入0' }
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
                  }
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
          <FormItem
            style={{ paddingTop: 20, display:'flex' }}
            label='分享标题'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareTitle', {
              initialValue: shareTitle,
            } )( <Input
              placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`}
              onChange={this.shareTitleChange}
            /> )}
          </FormItem>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }}
            label='分享描述'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareDescription', {
              initialValue:shareDescription,
            } )( <Input
              placeholder={`${formatMessage( { id: 'form.input' } )}分享描述`}
              onChange={this.shareDescriptionChange}
            /> )}
          </FormItem>
          <FormItem
            style={{ paddingTop: 20, display:'flex' }}
            label='分享链接'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareLink', {
              initialValue: shareLink,
            } )( <Input
              placeholder={`${formatMessage( { id: 'form.input' } )}分享链接，不填默认本活动链接`}
              onChange={this.shareLinkChange}
            /> )}
          </FormItem>
          <FormItem
            label='分享图标'
            {...this.formLayout3}
          >
            {getFieldDecorator( 'shareImg', {
                      initialValue: shareImg,
                    } )( <UploadImg onChange={this.shareImgChang} /> )}
            <div
              style={
                     {
                       position: 'absolute',
                       top:0, left:'125px',
                       width:'180px',
                       fontSize: 13,
                       color: '#999',
                       lineHeight:2,
                       marginTop:'10px'
                       }
                     }
            >
              <div>格式：jpg/jpeg/png </div>
              <div>建议尺寸：200px*200px</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </FormItem>
        </TabPane>
      </Tabs>
    );
  }
}

export default PrizeTable;

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

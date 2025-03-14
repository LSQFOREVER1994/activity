import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Collapse, InputNumber, Table, Button, Select, message,
  Alert, Popconfirm, Modal, Input, Checkbox, Radio, DatePicker
} from 'antd';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './sloganElement.less';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Group } = Checkbox;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
};
let timer = null;

let getRowKey = () => Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 );

@connect( ( { bees } ) => ( {
  prizeTypeList: bees.prizeTypeList,
  prizeList: bees.prizeList
} ) )
@Form.create()
class PrizeTable extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      visible: false,
      saveObj:{},
      prizeObj:{},
      expandItem:{},
      expandedRowKeys: [],
    }
  }

  componentDidMount(){
    this.initPeizeData();
  }


  // 模糊搜索奖品列表
  getPrizeList = ( rightName, relationPrizeType ) => {
    const { form } = this.props;
    form.setFieldsValue({ relationPrizeId: undefined });
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getPrizeList',
      payload: {
        rightName,
        rightType: relationPrizeType
      },
    } );
  }

  // 处理奖品数据
  initPeizeData = () => {
    const { eleObj = {} } = this.props
    let newPrizes = eleObj.sloganPrizeList ? eleObj.sloganPrizeList : []
    if ( eleObj.sloganPrizeList && eleObj.sloganPrizeList.length > 0 ) {
      newPrizes = eleObj.sloganPrizeList.map( info => {
        return {
          ...info,
          rowKey: getRowKey()
        }
      } )
    }
    this.updateData( 'sloganPrizeList', newPrizes )
  }

  updateData = ( type, val ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  // 跳转权益中心
  onJumpPrize = () => {
    window.open( `${window.location.origin}/oldActivity/prizeManagement` )
  }

  onAddPrizeItem=()=>{
    this.setState( {
      visible:true,
      saveObj:{},
      prizeObj:{}
    } )
  }

  // 获取剩余库存
  getUnIssuedCnt = () => {
    const {  form: { getFieldValue }, prizeList=[] } = this.props;
    if( !prizeList.length )return 0;
    const param = prizeList.find( item => item.rightId === getFieldValue( 'relationPrizeId' ) );
    return ( param && param.unIssuedCnt ) || 0
  }

  onModalConfirm=()=>{
    const { form, eleObj:{ sloganPrizeList=[] } } = this.props;
    const { saveObj:{ rowKey } } = this.state;
    form.validateFields( ( err, fieldsValue )=>{
      if( err )return;
      const {
        prizeImage, prizeSloganNames, rewardType, prizeValue, prizeType,
        relationPrizeType, relationPrizeId, prizeName, inventory, expireType, expireTime, expireDays
      } = fieldsValue;

      const sloganNameArr = prizeSloganNames.length ? prizeSloganNames.map( ( n )=> {return { name:n }} ) :[]

      let newSaveObj={};
      if( rewardType!== 'PRIZE' ){
        newSaveObj = { prizeImage, prizeSloganNames:sloganNameArr, rewardType, prizeValue, inventory, prizeName };
      }else{
        const peizeData ={
          relationPrizeType, relationPrizeId, name: prizeName, inventory, expireType, expireDays, prizeType,
          expireTime:moment( expireTime ).format( 'YYYY-MM-DD' )
        };
        newSaveObj={
          prizeImage, prizeSloganNames:sloganNameArr, rewardType, prizeValue, prizeName,
          prize:{ ...peizeData }
        }
      }
      let newList = sloganPrizeList;
        const key = getRowKey();
        if( rowKey ){
        newList = sloganPrizeList.map( item => item.rowKey === rowKey ? ( { rowKey:key, ...newSaveObj } ): item )
        message.success( '编辑成功' )
      }else{
        const key = getRowKey();
        newList = sloganPrizeList.concat( [{ ...newSaveObj, rowKey:key } ] )
        message.success( '添加成功' )
      }
      this.updateData( 'sloganPrizeList', newList )
      this.setState( {
        saveObj:{},
        prizeObj:{},
        visible: false,
      } )
    } )
  }

  onModalCancel=()=>{
    this.setState( {
      visible:false,
      saveObj:{},
      prizeObj:{}
    } )
  }

  editItem=( e,data )=>{
    e.stopPropagation();
    const { prize }=data;
    this.getPrizeList( '', ( prize && prize.relationPrizeType ) || '' );
    this.setState( {
      visible:true,
      saveObj:data,
      prizeObj:prize
    } )
  }

  // 搜索奖品
  onPrizeSearch = ( e, relationPrizeType ) => {
    clearTimeout( timer )
    if ( !relationPrizeType ) {
      message.error( '请先选择权益类型' )
      return
    }
    timer = setTimeout( () => {
      this.getPrizeList( e, relationPrizeType )
    }, 500 );
  }

  onDeleteItem=( e, data )=>{
    e.stopPropagation();
    const { eleObj:{ sloganPrizeList } } = this.props;
    let newList = sloganPrizeList
    if ( sloganPrizeList.length > 0 ) {
      newList = sloganPrizeList.filter( info => {
        return info.rowKey !== data.rowKey
      } )
    }
    this.updateData( 'sloganPrizeList', newList )
  }

  // 展开触发
  onExpandFunc = ( expanded, data ) => {
    if( expanded ){
      this.setState( {
        expandItem:data
      } )
    }else{
      this.setState( {
        expandItem:{}
      } )
    }
  }

  expandedRowRender = (prizeObj) => {
    const{ expandItem:{ prizeSloganNames=[] } } = this.state;
    const columns = [
      {
        title: '口令名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '活动库存',
        dataIndex: 'inventory',
        key: 'inventory',
        render: (inventory, item) => (
          <div>{item?.prize?.inventory || '-'}</div>
        )
      },
      // {
      //   title: '已用 / 活动库存 ',
      //   dataIndex: 'inventory',
      //   key: 'inventory',
      //   render: (id,p) => {
      //     const { rewardType } = prizeObj
      //     const { consume = 0, amountConsume = 0 } = p;
      //     return <div>{rewardType !== 'PRIZE' ? '-' : consume} / {rewardType !== 'PRIZE' ? '-' : amountConsume}</div>

      //   },
      // },
    ];

    return (
      <div className={styles.expandTable}>
        <Table
          rowKey="passRowKey"
          size='small'
          showHeader={false}
          columns={columns}
          dataSource={prizeSloganNames}
          pagination={false}
          bordered={false}
        />
      </div>
    )
  };

  // 更改展开项
  onExpandedRowsChange = ( expandedRows ) => {
    // console.log(expandedRows,'expandedRows');
    // const { expandedRowKeys } = this.state;
    // const newIndex = expandedRows[expandedRows.length - 1];
    // console.log(newIndex,expandedRowKeys,'newIndex');
    // let keyArr = [newIndex]
    // if (expandedRowKeys.indexOf(newIndex) > -1) { // 有相同时关闭
    //   keyArr = expandedRowKeys.filter((item) => item === newIndex);
    // } else {
    //   keyArr = [...expandedRowKeys, newIndex];
    // }
    // console.log(keyArr);
    // if ( newIndex ) {
    //   this.setState( { expandedRowKeys: [...keyArr] } );
    // } else {
    //   this.setState( { expandedRowKeys: [] } );
    // }

    const newIndex = expandedRows[expandedRows.length - 1];

    if ( newIndex ) {
      this.setState( { expandedRowKeys: [newIndex] } );
    } else {
      this.setState( { expandedRowKeys: [] } );
    }
  }

  selectPrize = (e, ele) => {
    const { form: { setFieldsValue }} = this.props
    setFieldsValue({'prizeType': ele.props.prizeType});
  }


  render() {
    const { visible, saveObj={}, prizeObj={}, expandedRowKeys } = this.state;

    const {
      form: { getFieldDecorator, getFieldValue }, prizeTypeList=[], prizeList=[],
      eleObj:{ sloganPrizeList=[], sloganList=[], isRemovePrize }
    } = this.props;
    const prizeSloganNamesArr = saveObj.prizeSloganNames && saveObj.prizeSloganNames.length ?
      saveObj.prizeSloganNames.map( ( n )=>n.name ) :[];

      const passwordNameArr = sloganList.length ? sloganList.map( ( p )=> p.name ):[];

    const getName = ()=>{
      let name ='次数'
      if( getFieldValue( 'rewardType' ) === 'INTEGRAL' ){
        name = '积分'
      }
      return name
    }

    const columns =[
      {
        title: '奖品名称',
        dataIndex: 'prizeName',
        // width:'40%',
        key: 'prizeName',
        render: text =>(
            <div>{text}</div>
          )
      },
      {
        title: '活动库存',
        dataIndex: 'inventory',
        key: 'inventory',
        render: (inventory, item) =>(
          <div>{item?.prize?.inventory || '-'}</div>
          )
      },
      // {
      //   title: '已用 / 活动库存 ',
      //   dataIndex: 'inventory',
      //   key: 'inventory',
      //   width:'30%',
      //   render:( id, item )=>{
      //     const{ rewardType, prize={} } = item;
      //     if( rewardType === 'PRIZE' ){
      //         const sendCount = prize.sendCount ? prize.sendCount : 0
      //         const invent = prize.inventory || 0
      //         return (
      //           <div>
      //             {sendCount || 0}<span style={{ margin: '0 10px' }}> / </span>{sendCount + invent}
      //           </div>
      //         )
      //     }
      //     return <span>--</span>
      //   }
      // },
      {
        title:'操作',
        dataIndex: 'action',
        key: 'action',
        align:'center',
        width:'30%',
        render: ( text, record ) => {
          return (
            <div style={{ display:'flex', justifyContent:"center" }}>
              <span
                style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={(e)=>this.editItem( e,record )}
              >
                编辑
              </span>

              <span style={{ margin: '0 20px', cursor: 'pointer', color: '#f5222d' }} onClick={(e)=>{e.stopPropagation()}}>
                <Popconfirm
                  placement="top"
                  title="是否确认删除该奖品"
                  onConfirm={( e ) => this.onDeleteItem( e, record )}
                  okText="是"
                  cancelText="否"
                >
                  删除
                </Popconfirm>
              </span>
            </div>
          )
        }
      }
    ];


    const modalFooter = {
      okText: '保存',
      onOk: this.onModalConfirm,
      onCancel: this.onModalCancel,
    };

    return (
      <Collapse defaultActiveKey={['1']} style={{ marginBottom:20 }}>

        <Panel header="活动奖品配置" key="1">
          <FormItem
            label={<span className={styles.labelText}><span>*</span>0库存奖品是否移除</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.updateData( 'isRemovePrize', e.target.value )}
              value={isRemovePrize}
            >
              <Radio value={false}>否</Radio>
              <Radio value>是</Radio>
            </Radio.Group>
          </FormItem>
          <div style={{color: 'red',margin: '-20px 0 20px'}}>* 若选择是(移除)，多奖励类型多口令交叉时兑换口令，该口令没库存奖品不发且不补发，有库存奖品继续发放。若选择否，该口令其中一个奖品没库存时兑换口令提示弹窗。</div>
          <Alert
            style={{ marginBottom:20 }}
            type="warning"
            showIcon
            message={(
              <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <span>关联奖品需先配置奖品，已配置请忽略。</span>
                <span onClick={() => { this.onJumpPrize() }} style={{ color: '#1890FF', cursor: 'pointer' }}>点此去配置奖品</span>
              </div>
            )}
          />
          <Table
            rowKey="rowKey"
            size="small"
            pagination={false}
            columns={columns}
            dataSource={sloganPrizeList}
            expandedRowRender={this.expandedRowRender}
            expandRowByClick
            expandedRowKeys={expandedRowKeys}
            onExpandedRowsChange={expandedRows => this.onExpandedRowsChange( expandedRows )}
            onExpand={( expanded, record ) => this.onExpandFunc( expanded, record )}
          />

          <Button
            type="dashed"
            style={{ width: '100%', marginTop: 10 }}
            icon="plus"
            onClick={() => this.onAddPrizeItem()}
          >
            添加奖品
          </Button>
          <Modal
            maskClosable={false}
            title={saveObj.rowKey ? '编辑奖品' : '添加奖品'}
            width={840}
            bodyStyle={{ padding: '28px 0 0' }}
            destroyOnClose
            visible={visible}
            {...modalFooter}
          >
            <Form>
              <FormItem label="奖品图" {...formLayout}>
                {getFieldDecorator( 'prizeImage', {
                  rules: [{ required: true, message: '请上传奖品图' }],
                  initialValue: saveObj.prizeImage
                } )( <UploadModal /> )}
              </FormItem>
              {
                passwordNameArr.length ?
                  <FormItem label="生效口令" {...formLayout}>
                    {getFieldDecorator( 'prizeSloganNames', {
                      rules: [{ required: true, message: '请选择生效口令' }],
                      initialValue: prizeSloganNamesArr
                    } )(
                      <Group options={passwordNameArr} />
                    )}
                    <div style={{ marginTop:'-10px', color: '#f5222d' }}>选择该奖品适用的口令，可多选</div>
                  </FormItem>
                :
                  <FormItem label="生效口令" {...formLayout}>
                    {getFieldDecorator( 'prizeSloganNames', {
                      rules: [{ required: true, message: '请选择生效口令' }],
                    } )(
                      <div style={{ color: '#f5222d', fontWeight: 'bold' }}>请先配置口令列表</div>
                    )}
                  </FormItem>
              }

              <FormItem label="奖品名称" {...formLayout}>
                {getFieldDecorator( 'prizeName', {
                  rules: [{ required: true, message: '请输入奖品名称' }],
                  initialValue: saveObj.prizeName
                } )(
                  <Input placeholder="请输入奖品名称" />
                )}
              </FormItem>

              <FormItem label="奖励类型" {...formLayout}>
                {getFieldDecorator( 'rewardType', {
                  rules: [{ required: true, message: '请选择奖励类型' }],
                  initialValue: saveObj.rewardType || 'LEFT_COUNT'
                } )(
                  <Radio.Group>
                    <Radio value='LEFT_COUNT'>活动次数</Radio>
                    <Radio value='INTEGRAL'>积分</Radio>
                    <Radio value='PRIZE'>奖品</Radio>
                  </Radio.Group>
                )}
              </FormItem>

              {
                getFieldValue( 'rewardType' ) !== 'PRIZE' ?
                  <>
                    <FormItem
                      label={`${getName()}奖励`}
                      {...formLayout}
                      >
                      {getFieldDecorator( 'prizeValue', {
                        rules: [
                          { required: true, message:`请输入${getName()}奖励` },
                          { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }
                        ],
                        initialValue: saveObj.prizeValue
                      } )(
                        <Input
                          placeholder={`请输入${getName()}奖励,最大值是99999`}
                          min={0}
                          max={999999}
                          addonAfter={getFieldValue('rewardType') === 'LEFT_COUNT' ? '次' : '分'}
                          type='number'
                        />
                        )}
                    </FormItem>
                    {/* <FormItem label="活动库存" {...formLayout}>
                      {getFieldDecorator( 'inventory', {
                        rules: [{ required: false, message: '请输入活动库存' }],
                        initialValue: saveObj.inventory
                      } )(
                        <InputNumber
                          style={{ width: '50%' }}
                          placeholder="请输入活动库存"
                          min={0}
                          max={999999999}
                        />
                      )}
                    </FormItem> */}
                  </>
                :
                  <>
                    <FormItem label="奖品类型" {...formLayout}>
                      {getFieldDecorator( 'relationPrizeType', {
                        rules: [{ required: true, message: '请选择奖品类型' }],
                        initialValue: prizeObj.relationPrizeType
                      } )(
                        <Select
                          onChange={( val ) => this.getPrizeList( '', val )}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          placeholder="请选择奖品类型"
                        >
                          {
                            prizeTypeList.map( p => <Option value={p.rightTypeId} key={p.rightTypeId}>{p.rightTypeName}</Option> )
                          }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="选择奖品" {...formLayout}>
                      {getFieldDecorator( 'relationPrizeId', {
                        rules: [{ required: true, message: '请选择奖品' }],
                        initialValue: prizeObj.relationPrizeId
                      } )(
                        <Select
                          showSearch
                          allowClear
                          onChange={(e, ele)=>{this.selectPrize(e,ele)}}
                          onSearch={( e ) => this.onPrizeSearch( e, getFieldValue( 'relationPrizeType' ) )}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                          placeholder="请选择奖品"
                        >
                          {
                            prizeList.map( info => <Option value={info.rightId} prizeType={info.prizeType} key={info.rightId}>{info.rightName}</Option> )
                          }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem label="选择奖品类型" {...formLayout} hidden>
                      {getFieldDecorator( 'prizeType', {
                        initialValue: prizeObj.prizeType
                      } )(
                        <Input/>
                      )}
                    </FormItem>
                    {/*
                    <FormItem label="奖品名称" {...formLayout}>
                      {getFieldDecorator( 'name', {
                        rules: [{ required: true, message: '请输入奖品名称' }],
                        initialValue: prizeObj.name
                      } )(
                        <Input placeholder="请输入奖品名称" />
                      )}
                    </FormItem> */}

                    <FormItem label="活动库存" {...formLayout}>
                      {getFieldDecorator( 'inventory', {
                        rules: [{ required: true, message: '请输入活动库存' }],
                        initialValue: prizeObj.inventory
                      } )(
                        <InputNumber
                          style={{ width: '50%' }}
                          placeholder="请输入活动库存"
                          min={0}
                          max={this.getUnIssuedCnt()}
                        />
                      )}
                      <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>*可用库存：{this.getUnIssuedCnt()}</span>
                    </FormItem>

                    <FormItem label="过期类型" {...formLayout}>
                      {getFieldDecorator( 'expireType', {
                        rules: [{ required: true, message: '请选择过期类型' }],
                        initialValue: prizeObj.expireType || 'TIME'
                      } )(
                        <Radio.Group>
                          <Radio value='TIME'>失效时间</Radio>
                          <Radio value='DAYS'>有效天数</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                    {
                      getFieldValue( 'expireType' ) === 'TIME'?
                        <FormItem label="失效时间" {...formLayout}>
                          {getFieldDecorator( 'expireTime', {
                            rules: [{ required: true, message: '请输入失效时间' }],
                            initialValue: prizeObj.expireTime ? moment( prizeObj.expireTime, 'YYYY-MM-DD' ) : null
                          } )(
                            <DatePicker
                              style={{ width: '100%' }}
                              format="YYYY-MM-DD"
                              placeholder='请选择失效时间'
                            />
                          )}
                        </FormItem>
                      :
                        <FormItem label="有效天数" {...formLayout}>
                          {getFieldDecorator( 'expireDays', {
                            rules: [
                              { required: true, message: '请输入有效天数' },
                              { pattern:new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message:'请输入0~999999之间的整数' }
                            ],
                            initialValue: prizeObj.expireDays
                          } )(
                            <InputNumber style={{ width: '50%' }} placeholder="请输入有效天数" />
                          )}
                        </FormItem>
                    }
                  </>
              }
            </Form>
          </Modal>
        </Panel>
      </Collapse>
    )
  }

}

export default PrizeTable;

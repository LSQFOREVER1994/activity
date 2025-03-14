import React from 'react';
import { Collapse, Form, Input, Select, Popconfirm, Button, Empty } from 'antd';
import { connect } from 'dva';
import Delete from '../../../assets/img/delete.png'

const FormItem = Form.Item;
const { Panel } = Collapse;
const { Option } = Select;

const fundsShowTypes = [
  [],
  [
    { key: 'growthRateDaily', value: '日涨幅' },
    { key: 'growthRateWeekly', value: '周涨幅' },
    { key: 'growthRateMonthly', value: '月涨幅' },
    { key: 'growthRate3m', value: '近三个月涨幅' },
    { key: 'growthRate6m', value: '近六个月涨幅' },
    { key: 'growthRate1y', value: '近一年涨幅' },
    { key: 'growthRate2y', value: '近两年涨幅' },
    { key: 'growthRate3y', value: '近三年涨幅' },
    { key: 'growthRate5y', value: '近五年涨幅' },
    { key: 'growthRate0y', value: '今年以来涨幅' },
  ],
  [
    // { key: 'growthRateDaily', value: '日涨幅' },
    { key: 'growthRateWeekly', value: '周涨幅' },
    { key: 'growthRateMonthly', value: '月涨幅' },
    { key: 'growthRate3m', value: '近三个月涨幅' },
    { key: 'growthRate6m', value: '近六个月涨幅' },
    { key: 'growthRate1y', value: '近一年涨幅' },
    { key: 'growthRate2y', value: '近两年涨幅' },
    { key: 'growthRate3y', value: '近三年涨幅' },
    { key: 'growthRate0y', value: '今年以来涨幅' },
    // { key: 'growthRate5y', value: '近五年涨幅' },
  ],
  [
    { key: 'growthRateDaily', value: '日涨幅' },
    // { key: 'growthRateWeekly', value: '周涨幅' },
    // { key: 'growthRateMonthly', value: '月涨幅' },
    // { key: 'growthRate1y', value: '近一年涨幅' },
    // { key: 'growthRate2y', value: '近两年涨幅' },
    // { key: 'growthRate3y', value: '近三年涨幅' },
    // { key: 'growthRate5y', value: '近三年涨幅' },
  ]
]




function FundList( { componentsData, changeValue, dispatch, initFundList } ) {
  const { funds, prodType } = componentsData;
  let timer;
  const searchFund = ( code = '' ) => {
    if( !code ) {
      dispatch( {
      type: 'beesVersionThree/getFundList',
      payload:{
        page:{
          pageSize:1000,
          pageNum:1,
        },
        prodType
      }
    } )
    }
    dispatch( {
      type: 'beesVersionThree/getFundList',
      payload:{
        page:{
          pageSize:1000,
          pageNum:1,
        },
        queryKey:code,
        prodType
      }
    } )
  }

  const onFundsSearch = ( e ) => {
    clearTimeout( timer )
    timer = setTimeout( ()=>{
      searchFund( e )
    } )
  }

  const onAddFund = () => {
    const id = Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
    const showType =  prodType === '1' || prodType === '3'? 'growthRateDaily' : 'growthRate2y'
    const newFundList = [...funds, { id, showType }]
    changeValue( newFundList, 'funds' )
  }

  const onDeleteFund = ( info ) => {
    const newFundList = funds.filter( ( item )=>{
      return item.id !== info.id;
    } )
    changeValue( newFundList, 'funds' )
  }

  const changeFundItemInput = ( e, type, info, index ) => {
    const val = e && e.target ? e.target.value : e;
    const selectFundItem = funds.filter( item=>item.id === info.id )
    // if( type ==='fundId' ){
    //   const fundDetails = initFundList.filter( item=>item.fundId === val )
    //   const newFundDetails = Object.assign( selectFundItem[0], fundDetails[0] )
    //   changeValue( newFundDetails, `funds[${index}]` )
    // }
    const newFundItem = { ...selectFundItem[0], [type]:val }
    changeValue( newFundItem, `funds[${index}]` ) // 根据下标找到funds数组中对应产品对象更新属性
  }

  const renderFundItems =() =>{
    let view = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无产品配置，请去添加产品" />
    if( funds && funds.length > 0 ){
      view = funds.map( ( info, index )=>(
        <div style={{ padding: '10px', backgroundColor:'#f3f3f3', borderRadius:'10px', marginBottom: '10px' }} key={info.fundVirtualId}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: '10px' }}>
            <div style={{ lineHeight:'30px' }}>产品代码{index+1}</div>
            <Popconfirm
              placement="topRight"
              title="确定删除该产品吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {onDeleteFund( info )}}
            >
              <div style={{ cursor:'pointer' }}><img style={{ width:23 }} src={Delete} alt='' /></div>
            </Popconfirm>
          </div>
          <FormItem label="选择产品" required>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择产品"
              value={info.fundId}
              showSearch
              onFocus={()=>searchFund()}
              onChange={( e ) => changeFundItemInput( e, 'fundId', info, index )}
              onSearch={( e ) => onFundsSearch( e )}
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {initFundList.map( item=>(
                <Option value={item.fundId} key={item.fundId}>{`${item.fullName}(${item.fundId})`}</Option>
              ) )}
            </Select>
          </FormItem>
          <FormItem label="展示类型" required>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择展示类型"
              value={info.showType}
              onChange={( e ) => changeFundItemInput( e, 'showType', info, index )}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {fundsShowTypes[prodType].map( item => (
                <Option value={item.key} key={item.value}>{item.value}</Option>
              ) )}
            </Select>
          </FormItem>
          <FormItem label='产品评价'>
            <Input 
              placeholder='请输入产品评价'
              value={info.comment}
              onChange={( e )=>changeFundItemInput( e, 'comment', info, index )}
            />
          </FormItem>
        </div>
    ) )
    }
    return view
  }
  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: '20px' }}>
      <Panel
        header={
          <div>
            <span>产品配置</span>
          </div>
        }
        key="1"
      >
        {renderFundItems()}
        <Button
          type="dashed"
          style={{ width: '100%', marginTop: 10, borderColor: '#1F3883', color:'#1F3883' }}
          icon="plus"
          onClick={() => onAddFund()}
        >
          <span>添加产品</span>
        </Button>
      </Panel>
    </Collapse>
  );
}

export default connect( ( { beesVersionThree } )=>( {
  initFundList: beesVersionThree.initFundsList
} ) )( FundList )

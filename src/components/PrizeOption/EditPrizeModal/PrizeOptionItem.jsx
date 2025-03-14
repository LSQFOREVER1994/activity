/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Select, Input, InputNumber, Radio, DatePicker, Tooltip, Icon, Divider, message, Empty, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { mathematicalCalculation } from '@/utils/utils'
import styles from './index.less';
import useDebounce from '@/hooks/useDebounce';
import useElementList from '@/hooks/useElementList';

const { add } = mathematicalCalculation
const { Option } = Select;
const FormItem = Form.Item;
const { Group } = Radio;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const formLayout1 = {
  labelCol: { span: 9 },
  wrapperCol: { span: 10 },
};
const changeModeReset = [
  'relationPrizeType',
  'productType',
  'relationPrizeType',
  'relationPrizeId',
];
const formKeys = [
  'price',
  'description',
  'name',
  'userLimit',
  'userDayLimit',
  'userWeekLimit',
  'userMonthLimit',
  'daySendLimit',
  'expireDays',
  'changeInventory',
  'prizeType',
  'minimum', // 微信立减金 - “满”
  'rewardValue', // 积分与次数类型的值
  'rewardActivityId', // 积分与次数奖品发放到的活动id
  'subPrizeIds',
];
// 正则判断
const limitDecimals = ( value, red ) => {
  // eslint-disable-next-line no-useless-escape
  let reg = /^(\-)*(\d+).*$/;
  if ( red === 'red' ) {
    reg = /^(-)*(\d+)\.(\d\d).*$/;
  }
  if ( typeof value === 'string' ) {
    if ( red === 'red' ) return !Number.isNaN( Number( value ) ) ? value.replace( reg, '$1$2.$3' ) : '';
    return !Number.isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : '';
  }
  if ( typeof value === 'number' ) {
    if ( red === 'red' ) return !Number.isNaN( value ) ? String( value ).replace( reg, '$1$2.$3' ) : '';
    return !Number.isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : '';
  }
  return '';
};
function PrizeOptionItem( props ) {
  const { dispatch, form, awardMode, merchantList, editObj, prizeTypeList, rewardType, needWeekAndMonth, loading, allActivityList, drawElementList } = props;
  const { getFieldDecorator, getFieldsValue, getFieldValue, resetFields, setFieldsValue, validateFields } = form;
  //   为了避免每个配置直接影响，每个item单独保存自己的奖品列表
  const [prizeList, setPrizeList] = useState( [] );
  const [addSub, setAddSub] = useState( true );
  const stockNum = useRef( 0 );
  const prizePage = useRef( { pageNum: 1, pageSize: 10, done: false } )
  const prizeSearchVal = useRef( '' )
  const editOldPrizeOption = useRef( null )
  const { inventory = 0, sendCount = 0, id } = editObj || {};
  const throttle = useRef( false )
  const {
    productType = editObj?.productType || '',
    relationPrizeType,
    expireType = editObj?.expireType || '',
    relationPrizeId = editObj?.relationPrizeId,
    price = editObj?.price,
    changeInventory = editObj?.changeInventory,
    subPrizeIds = editObj?.subPrizeIds,
    rewardElementId = editObj?.rewardElementId,
  } = getFieldsValue( ['productType', 'relationPrizeType', 'expireType', 'relationPrizeId',
    'price', 'changeInventory', 'subPrizeIds', 'rewardElementId'] );



  /**
   * @example 获取新模式奖品列表
   * @param {string} merchantCode 商户code
   * @param {string} type 商品类型
   */
  const getVisibleGoodsList = ( { merchantCode, type, productName = '', productId = '' }, flag ) => {
    return new Promise( ( resolve ) => {
      // 需要根据前面的条件查询，如果没有清空当前值
      if ( !merchantCode || !type ) {
        if ( prizeList.length ) {
          setPrizeList( [] );
        }
        resolve()
        return;
      }
      const merchantId = merchantList && merchantList.find( item => item.code === merchantCode )?.id || '';
      dispatch( {
        type: 'bees/getVisibleGoodsList',
        payload: {
          merchantId,
          type,
          productName,
          productId,
          tradeStatus: 'NORMAL',
          done:prizePage.done,
          pageSize:prizePage.pageSize,
          pageNum:prizePage.pageNum,
        },
        successFun: ( data, { total } ) => {
          resolve()
          // 编辑的时候，因为做了分页不知道所选数据在多少条，所以开始会把这条数据查出来，但是为了避免有重复的，所以需要过滤
          const resData = editOldPrizeOption?.current ? data.filter( item => item.productId !== editOldPrizeOption.current.productId ) : data;
          if ( data.length < 10 ) {
            prizePage.current.done = true
          } else {
            prizePage.current.done = false
          }
          if ( flag === 1 ) { // 分页搜索
            const newData = prizeList.concat( resData )
            if ( newData.length === total ) {
              prizePage.current.done = true
            }
            setPrizeList( newData )
          } else if ( flag === 2 ) { // 编辑时查询已选内容
            if ( !prizeList.some( item => item.productId === productId ) ) {
              editOldPrizeOption.current = data[0]
              setPrizeList( [data[0], ...prizeList] )
            }
          } else { // 查询默认值
            if ( editOldPrizeOption?.current ) { // 如果搜索了其他内容 编辑的时候没有这条数据会默认选择已有数据第一条
              resData.unshift( editOldPrizeOption.current )
            }
            setPrizeList( resData );
          }
        },
        failFunc: () => {
          // 说明是查询分页失败，回到上一个分页
          if ( flag === 1 ) {
            prizePage.current.pageNum -= 1
          }
          message.error( '查询失败，请重试！' )
          resolve()
        }
      } );
    } )
  };
  /**
   * @example 旧模式 模糊搜索奖品列表
   * @param {string} prizeType 奖品类型
   * @param {*} rightName 奖品名称
   */
  const getPrizeList = ( prizeType, rightName ) => {
    if ( !prizeType ) {
      if ( prizeList.length ) {
        setPrizeList( [] );
      }
      return;
    }
    dispatch( {
      type: 'bees/getPrizeList',
      payload: {
        rightName,
        rightType: prizeType,
      },
      successFun: data => {
        setPrizeList( data );
      },
    } );
  };

  useEffect( () => {
    if ( awardMode === 'RIGHT' ) {
      const { relationPrizeType: prizeType = '', productType: _productType = '' } = editObj || {};
      // 新模式
      getVisibleGoodsList( { merchantCode: prizeType, type: _productType, productId: relationPrizeId }, 2 );
    } else if ( awardMode === 'OPEN' ) {
      getPrizeList( editObj?.relationPrizeType );
    }
    resetFields( changeModeReset );

  }, [awardMode] );

  useEffect( () => {
    if ( !editObj ) return;
    if ( awardMode === 'RIGHT' ) {
      const { relationPrizeType: prizeType = '', productType: _productType = '' } = editObj || {};
      getVisibleGoodsList( { merchantCode: prizeType, type: _productType, productId: relationPrizeId }, 2 );
    }
    let objKeys = [...formKeys, ...changeModeReset];
    if ( needWeekAndMonth ) objKeys = [...formKeys, ...changeModeReset, 'weekSendLimit', 'monthSendLimit']
    const obj = Object.keys( editObj ).reduce( ( prev, item ) => {
      if ( objKeys.includes( item ) ) {
        prev[item] = editObj[item];
      }
      return prev;
    }, {} );

    if ( editObj.expireTime ) {
      obj.expireTime = moment( editObj.expireTime, 'YYYY-MM-DD' );
    }
    obj.expireType = expireType;

    // 更新加减库存数据
    if ( changeInventory ) {
      setAddSub( changeInventory > 0 )
      stockNum.current = Math.abs( changeInventory )
    }
    setTimeout( () => {
      setFieldsValue( obj );
    }, 0 );
  }, [] );


  // 剩余库存数据
  const copyInventory = useMemo( () => {
    if ( !prizeList?.length ) return 0;
    let initUsrInventory = 0;
    if ( awardMode === 'OPEN' ) {
      const choosePrizeObj = prizeList.find( item => item && item.rightId === relationPrizeId );
      initUsrInventory = choosePrizeObj?.unIssuedCnt ? choosePrizeObj.unIssuedCnt : inventory || 0;
    }
    if ( awardMode === 'RIGHT' ) {
      const newChoosePrizeObj = prizeList.find(
        item => item && item.productId === +relationPrizeId && item.merchantCode === relationPrizeType
      );
      initUsrInventory = newChoosePrizeObj?.inventory
        ? newChoosePrizeObj.inventory
        : inventory || 0;
    }
    return initUsrInventory;
  }, [prizeList, relationPrizeId, relationPrizeType] );

  const addSubSwitch = () => {
    setAddSub( !addSub );
    setTimeout( () => {
      validateFields( ['changeInventory'], { force: true } );
    }, 200 );
  };

  const inventoryValidator = ( rule, value, callback ) => {
    // 修改预计剩余库存量为剩余库存量
    const storeCount = copyInventory; // 可以用库存
    const val = stockNum.current;
    if ( !val ) {
      callback();
      return;
    }
    let addMaxCount = 0; // 最大可以配置库存
    let subMaxCount = 0; // 活动剩余库存
    if ( !inventory ) {
      // 新增奖品
      addMaxCount = storeCount;
      subMaxCount = 0;
      if ( productType === 'RED' || productType === 'JN_RED' ) {
        addMaxCount = Math.floor( storeCount / price );
      }
    } else if ( inventory ) {
      // 编辑已有奖品
      addMaxCount = storeCount - inventory;
      subMaxCount = inventory;
      if ( productType === 'RED'|| productType === 'JN_RED' ) {
        addMaxCount = Math.floor( storeCount / price ) - inventory;
      }
    }
    if ( inventory && addSub ) {
      if ( val > addMaxCount && rewardType === 'PRIZE' ) {
        callback( '添加数量超出剩余库存量，请重新输入' );
        return;
      }
    }
    if ( inventory && !addSub ) {
      if ( subMaxCount - val < 0 ) {
        callback( '剩余库存量小于0，请重新输入' );
        return;
      }
    } else if ( !inventory && addSub ) {
      if ( val > addMaxCount && rewardType === 'PRIZE' ) {
        callback( '添加数量超出剩余库存量，请重新输入' );
        return;
      }
    }
    if ( !addSub && !subMaxCount ) {
      callback( '剩余库存为0，不可减少' );
      return;
    }
    if ( !addSub && subMaxCount ) {
      if ( val > subMaxCount ) {
        callback( '减少数量超出剩余库存，请重新输入' );
        return;
      }
    }
    setFieldsValue( { changeInventory: addSub ? val : 0 - val } );
    callback();
  };

  // 旧模式奖品类型改变
  const changeOpenPrizeType = e => {
    resetFields( ['relationPrizeId'] );
    getPrizeList( e );
  };
  // 新模式商品搜索
  const changeRightPrizeList = async ( obj, flag ) => {
    // 改变的不是奖品清空奖品
    if ( !Object.keys( obj ).includes( 'productName' ) ) {
      prizePage.current.pageNum = 1
      resetFields( ['relationPrizeId'] );
    } else {
      prizeSearchVal.current = obj.productName
      prizePage.current.done = false
    }
    await getVisibleGoodsList( {
      merchantCode: relationPrizeType,
      type: productType,
      ...obj,
    }, flag );
  };
  // 新模式商品搜索防抖
  const rightPrizeSearch = useDebounce( ( e, action ) => {
    prizePage.current.pageNum = 1
    if( action === "search" ){
      setPrizeList( [] )
    }
    changeRightPrizeList( { productName: e } )
  }, 500 )
  // 分页
  const handleAddPrize = async () => {
    if ( throttle.current || prizePage.current.done ) return
    throttle.current = true
    prizePage.current.pageNum += 1
    await changeRightPrizeList( { productName: prizeSearchVal.current }, 1 )
    throttle.current = false
  }

  const changeSelectPrize = ( val ) => {
    const obj = prizeList && prizeList.find( item => item.rightId === val || item.productId === +val )
    if ( obj ) {
      setFieldsValue( { 'prizeType': obj.productType || obj.prizeType, } )
    }
  }
  //   选择奖品下拉框
  const renderSelectPrize = () => {
    let dataKey = null;
    if ( awardMode === 'RIGHT' ) {
      dataKey = {
        value: 'productId',
        name: 'productName',
      };
    } else {
      dataKey = {
        value: 'rightId',
        name: 'rightName',
      };
    }
    return prizeList.map( info => {
      return info &&
        <Option value={`${info[dataKey.value]}`} key={info[dataKey.value]}>
          {info[dataKey.name]}
        </Option>
    } );
  };

  // 获取活动列表
  const getAllActivityList = () => {
    dispatch( {
      type: 'bees/getAllActivityList',
      payload: {},
    } )
  }

  const getDrawElement = ( activityId ) => {
    if( rewardType === "INTEGRAL" ) return
    setFieldsValue( { rewardElementId: undefined } )
    if( !activityId ) return
    dispatch( {
      type: 'bees/getDrawElement',
      payload: {
        query: activityId,
        successFun: () => { },
      }
    } )
  }

  useEffect( () => {
    getAllActivityList();
  }, [] )

  const renderOptionItem = () => {
    const currentElementList = useElementList()
    const elementList = getFieldValue( 'rewardActivityId' ) ? drawElementList : currentElementList;
    return (
      <>
        {
          rewardType === 'PRIZE' &&
          <>
            {awardMode === 'RIGHT' && (
              <>
                <FormItem label="选择商户" {...formLayout} key="relationPrizeType">
                  {getFieldDecorator( 'relationPrizeType', {
                    rules: [{ required: true, message: '请选择商户' }],
                  } )(
                    <Select
                      style={{ width: '75%' }}
                      placeholder="请选择商户"
                      showSearch
                      getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                      filterOption={( input, option ) =>
                        option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                      }
                      onChange={e => changeRightPrizeList( { merchantCode: e } )}
                      disabled={!!id}
                    >
                      {merchantList.map( info => (
                        <Option value={String( info.code )} key={info.code}>
                          {info.name}
                        </Option>
                      ) )}
                    </Select>
                  )
                  }
                </FormItem>
                <FormItem label="商品类型" {...formLayout} key="productType">
                  {getFieldDecorator( 'productType', {
                    rules: [{ required: true, message: '请选择商品类型' }],
                  } )(
                    <Select
                      style={{ width: '75%' }}
                      placeholder="请选择商品类型"
                      showSearch
                      filterOption={( input, option ) =>
                        option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                      }
                      getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                      onChange={e => changeRightPrizeList( { type: e } )}
                      disabled={!!id}
                    >
                      {/* <Option value="RED">红包</Option> */}
                      <Option value="COUPON">虚拟卡券</Option>
                      <Option value="GOODS">实物</Option>
                      <Option value="TG_COUPON">投顾卡券</Option>
                      <Option value="JN_RED">绩牛红包</Option>
                      <Option value="JN_RIGHT">绩牛权益</Option>
                      {/* <Option value="PHONE">直充</Option> */}
                      {/* <Option value="WX_COUPON">微信立减金</Option> */}
                      {/* <Option value="WX_VOUCHER">微信代金券</Option> */}
                      {/* <Option value="RIGHT_PACKAGE">权益包</Option> */}
                      <Option value="CUSTOM">自定义商品</Option>
                    </Select>
                  )
                  }
                </FormItem>
              </>
            )
            }

            {
              awardMode === 'OPEN' && (
                <>
                  <FormItem label="奖品类型" {...formLayout} key="relationPrizeType">
                    {getFieldDecorator( 'relationPrizeType', {
                      rules: [{ required: true, message: '请选择奖品类型' }],
                    } )(
                      <Select
                        style={{ width: '75%' }}
                        placeholder="请选择奖品类型"
                        showSearch
                        filterOption={( input, option ) =>
                          option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                        }
                        getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                        onChange={changeOpenPrizeType}
                        disabled={!!id}
                      >
                        {prizeTypeList.map( info => (
                          <Option value={info.rightTypeId} key={info.rightTypeId}>
                            {info.rightTypeName}
                          </Option>
                        ) )}
                      </Select>
                    )
                    }
                  </FormItem>
                </>
              )
            }
            <FormItem label="选择奖品" {...formLayout} key="relationPrizeId">
              {getFieldDecorator( 'relationPrizeId', {
                rules: [{ required: true, message: '请选择奖品' }],
              } )(
                awardMode === 'OPEN' ? (
                  <Select
                    style={{ width: '75%' }}
                    showSearch
                    placeholder="请选择奖品"
                    onChange={changeSelectPrize}
                    filterOption={( input, option ) =>
                      option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                    getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                    disabled={!!id}
                  >
                    {renderSelectPrize()}
                  </Select>
                ) : (
                  <Select
                    style={{ width: '75%' }}
                    placeholder="请选择奖品"
                    showSearch
                    filterOption={false}
                    onSearch={( e ) => rightPrizeSearch( e, "search" )}
                    onChange={changeSelectPrize}
                    getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                    disabled={!!id}
                    onFocus={( e ) => rightPrizeSearch( e, "focus" )}
                    dropdownRender={menu => (
                      <div>
                        {menu}
                        {!!prizeList?.length && !prizePage.current.done && (
                          <>
                            <Divider style={{ margin: '4px 0' }} />
                            <div
                              style={{ padding: '4px 8px', cursor: 'pointer' }}
                              onMouseDown={e => e.preventDefault()}
                              onClick={handleAddPrize}
                            >
                              <Icon type="plus" /> 加载更多
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  >{renderSelectPrize()}
                  </Select>
                )
              )
              }
            </FormItem>
            {
              awardMode === 'RIGHT' && productType === 'WX_COUPON' &&
              <FormItem
                label="满减设置"
                {...formLayout}
              >
                <div className={styles.money_minus}>
                  <span style={{ marginRight: 10 }}>满</span>
                  {getFieldDecorator( 'minimum', {
                    rules: [
                      { required: true, message: '请输入满减金额' },
                    ]
                  } )(
                    <InputNumber
                      placeholder="请输入满减金额"
                      min={getFieldValue( 'price' ) ? add( getFieldValue( 'price' ), 0.01 ) : 1.01}
                      style={{ width: '30%', marginRight: 16 }}
                      formatter={value => limitDecimals( value, 'red' )}
                      parser={value => limitDecimals( value, 'red' )}
                      disabled={!!id}
                    />
                  )
                  }
                  <span style={{ marginRight: 10 }}>减</span>
                  {getFieldDecorator( 'price', { // wx立减金 - 减
                    rules: [
                      { required: true, message: '请输入减免金额' },
                    ]
                  } )(
                    <InputNumber
                      placeholder="请输入减免金额"
                      min={1}
                      max={500}
                      style={{ width: '30%' }}
                      formatter={value => limitDecimals( value, 'red' )}
                      parser={value => limitDecimals( value, 'red' )}
                      disabled={!!id}
                    />
                  )
                  }
                </div>
              </FormItem>
            }
            {
              ( productType === 'RED' || productType === 'JN_RED' ) && (
                <>
                  <FormItem label="红包金额" {...formLayout}>
                    {getFieldDecorator( 'price', {
                      rules: [
                        { required: true, message: '请输入红包金额' },
                        {
                          required: true,
                          validator: ( rule, value, callback ) => {
                            if ( value * 100 < 10 ) {
                              callback( '红包金额最小0.1元' );
                              return;
                            }
                            callback();
                          },
                          message: '红包金额最小0.1元',
                          trigger: 'change',
                        },
                      ],
                    } )(
                      <InputNumber
                        placeholder="请输入红包金额"
                        min={0.1}
                        style={{ width: '75%' }}
                        formatter={value => limitDecimals( value, 'red' )}
                        parser={value => limitDecimals( value, 'red' )}
                        disabled={!!id}
                      />
                    )
                    }
                    <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>元</span>
                  </FormItem>
                  <FormItem label="红包描述" {...formLayout}>
                    {getFieldDecorator( 'description', {
                      rules: [{ required: true, message: '请输入红包描述' }],
                    } )( <Input style={{ width: '75%' }} placeholder="请输入红包描述" /> )}
                  </FormItem>
                </>
              )
            }
          </>
        }
        {
          rewardType === 'INTEGRAL' && (
            <>
              <FormItem label="积分值" {...formLayout}>
                {getFieldDecorator( 'rewardValue', {
                  rules: [{ required: true, message: '请输入积分值' }],
                } )( <InputNumber precision={0} min={1} placeholder="请输入积分值" style={{ width: '75%' }} maxLength={20} /> )}
              </FormItem>
              <FormItem label="积分描述" {...formLayout}>
                {getFieldDecorator( 'description', {
                  rules: [{ required: true, message: '请输入积分描述' }],
                } )( <Input style={{ width: '75%' }} placeholder="请输入积分描述" /> )}
              </FormItem>
            </>
          )
        }

        {
          rewardType === 'LEFT_COUNT' && (
            <FormItem label="次数" {...formLayout}>
              {getFieldDecorator( 'rewardValue', {
                rules: [{ required: true, message: '请输入次数' }],
              } )( <InputNumber precision={0} min={1} placeholder="请输入次数" style={{ width: '75%' }} maxLength={20} /> )}
            </FormItem>
          )
        }
        {
          ( rewardType === 'INTEGRAL' || rewardType === 'LEFT_COUNT' ) && (
            // <FormItem label="活动ID" {...formLayout}>
            //   {getFieldDecorator( 'rewardActivityId', {
            //   } )( <Input placeholder="发放至其他活动，不填写则为当前活动" style={{ width: '75%' }} maxLength={20} /> )}
            // </FormItem>
            <FormItem label="关联活动" {...formLayout}>
              {getFieldDecorator( 'rewardActivityId', {} )(
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
                  placeholder="发放至其他活动，不选则为当前活动"
                  onChange={e => getDrawElement( e )}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  style={{ width: '75%' }}
                >
                  {allActivityList.map( et => (
                    <Option key={et.id}>{`${et.name} (${et.id})`}</Option>
                  ) )}
                </Select> )}
            </FormItem>
          )
        }
        {
          rewardType === 'LEFT_COUNT' && (
            <FormItem label="关联组件" {...formLayout}>
              {getFieldDecorator( 'rewardElementId', {
                initialValue: rewardElementId
              } )(
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
                  placeholder="发放至组件，不填则为通用次数"
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                  style={{ width: '75%' }}
                >
                  {!loading && elementList?.map( el => (
                    <Option key={el.id}>{`${el.label || el.name} (${el.id})`}</Option> )
                  )}
                </Select>
              )}
            </FormItem>
          )
        }
        {
          rewardType !== 'EMPTY' && (
            <FormItem label="奖品名称" {...formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: '请输入奖品名称' }],
              } )( <Input placeholder="请输入奖品名称" style={{ width: '75%' }} maxLength={50} /> )}
            </FormItem>
          )
        }

        <FormItem label="活动库存" {...formLayout}>
          <div className={styles.inventoryShow}>
            <p>
              剩余库存
              <Tooltip title={<span>当前奖品剩余库存（非实时更新）</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
              &nbsp;:
              {inventory || 0}
            </p>
            <p>
              活动库存
              <Tooltip title={<span>当期奖品总库存，活动库存=已用库存+剩余库存</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
              &nbsp;:
              {( inventory || 0 ) + ( sendCount || 0 )}
            </p>
            {
              rewardType === 'PRIZE' && (
                <p>
                  可用{( productType === 'RED' || productType==='JN_RED' ) ? '资金' : '库存'}
                  <Tooltip
                    title={
                      <span>取自{awardMode === 'RIGHT' ? '权益商超' : '奖品管理'}（非实时更新）</span>
                    }
                  >
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                  &nbsp;:
                  {copyInventory}
                </p>
              )
            }
          </div>
          <div
            className={styles.addButton}
            style={{ backgroundColor: addSub ? 'rgba(16,171,105)' : 'rgba(255,0,0)' }}
            onClick={addSubSwitch}
          >
            {addSub ? '+加' : '-减'}
          </div>
          <InputNumber
            min={0}
            defaultValue={changeInventory ? Math.abs( changeInventory ) : 0}
            formatter={limitDecimals}
            parser={limitDecimals}
            onChange={e => {
              const val = e?.target ? e.target.value : e;
              stockNum.current = val;
              validateFields( ['changeInventory'], { force: true } );
            }}
          />
          {/* 用于保存并校验数据 */}
          {
            getFieldDecorator( 'changeInventory', {
              rules: [
                { required: true, validator: inventoryValidator },
              ],
            } )( <InputNumber style={{ display: 'none' }} /> )
          }
          {addSub ? (
            <span style={{ paddingLeft: '20px' }}>
              预计剩余库存：{( inventory || 0 ) + stockNum.current}
            </span>
          ) : (
            <span style={{ paddingLeft: '20px' }}>
              预计剩余库存：
              {( inventory || 0 ) - stockNum.current > 0 ? ( inventory || 0 ) - stockNum.current : 0}
            </span>
          )}
        </FormItem>



        {
          rewardType === 'PRIZE' && (
            <FormItem label="过期类型" {...formLayout}>
              {
                getFieldDecorator( 'expireType', {
                  initialValue: expireType,
                  rules: [{ required: true, message: '请选择过期类型' }],
                } )(
                  <Group>
                    <Radio value="TIME">失效时间</Radio>
                    <Radio value="DAYS">有效天数</Radio>
                  </Group>
                )
              }
            </FormItem>
          )
        }
        {
          rewardType === 'PRIZE' && expireType === 'TIME' && (
            <FormItem label="失效时间" {...formLayout}>
              {
                getFieldDecorator( 'expireTime', {
                  rules: [{ required: true, message: '请选择失效时间' }],
                } )(
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择失效时间"
                    format="YYYY-MM-DD"
                  />
                )
              }
            </FormItem>
          )
        }
        {
          rewardType === 'PRIZE' && expireType === 'DAYS' && (
            <FormItem label="有效天数" {...formLayout}>
              {
                getFieldDecorator( 'expireDays', {
                  rules: [{ required: true, message: '请输入有效天数' }],
                } )(
                  <InputNumber
                    placeholder="请输入有效天数"
                    min={0}
                    style={{ width: '100%' }}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                  />
                )
              }
            </FormItem>
          )
        }

        {/* <FormItem
          label={
            <>
              子奖品ID列表
              <Tooltip title="用于同时发放多个奖品。可填写奖品ID，多个ID用“,”隔开">
                <Icon style={{ margin: '13px 0 0 5px' }} type="question-circle-o" />
              </Tooltip>
            </>
          }
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
        >
          {
            getFieldDecorator( 'subPrizeIds', {
              initialValue: subPrizeIds,
              rules: [{ required: false, message: '请输入子奖品ID列表' }],
            } )( <Input placeholder="请输入子奖品ID列表" style={{ width: '75%' }} maxLength={5000} /> )
          }
        </FormItem> */}

        <FormItem {...formLayout1} label="单用户单奖品日中奖次数上限">
          {getFieldDecorator( 'userDayLimit', {
            rules: [{ required: false }],
          } )(
            <InputNumber
              placeholder="请输入，不填则视为不限制"
              min={0}
              style={{ width: 240 }}
              formatter={limitDecimals}
              parser={limitDecimals}
            />
          )}
        </FormItem>
        <FormItem {...formLayout1} label="单用户单奖品周中奖次数上限">
          {getFieldDecorator( 'userWeekLimit', {
            rules: [{ required: false }],
          } )(
            <InputNumber
              placeholder="请输入，不填则视为不限制"
              min={0}
              style={{ width: 240 }}
              formatter={limitDecimals}
              parser={limitDecimals}
            />
          )}
        </FormItem>
        <FormItem {...formLayout1} label="单用户单奖品月中奖次数上限">
          {getFieldDecorator( 'userMonthLimit', {
            rules: [{ required: false }],
          } )(
            <InputNumber
              placeholder="请输入，不填则视为不限制"
              min={0}
              style={{ width: 240 }}
              formatter={limitDecimals}
              parser={limitDecimals}
            />
          )}
        </FormItem>
        <FormItem {...formLayout1} label="单用户单奖品总中奖次数上限">
          {getFieldDecorator( 'userLimit', {
            rules: [{ required: false }],
          } )(
            <InputNumber
              placeholder="请输入，不填则视为不限制"
              min={0}
              style={{ width: 240 }}
              formatter={limitDecimals}
              parser={limitDecimals}
            />
          )}
        </FormItem>
        <FormItem {...formLayout1} label="单奖品每日发放上限">
          {getFieldDecorator( 'daySendLimit', {
            rules: [{ required: false }],
          } )(
            <InputNumber
              placeholder="请输入，不填则视为不限制"
              min={0}
              style={{ width: 240 }}
              formatter={limitDecimals}
              parser={limitDecimals}
            />
          )}
        </FormItem>


        {
          needWeekAndMonth && (
            <>
              <FormItem {...formLayout1} label="单奖品每周发放上限">
                {
                  getFieldDecorator( 'weekSendLimit', {
                    rules: [{ required: false }],
                  } )(
                    <InputNumber
                      placeholder="请输入，不填则视为不限制"
                      min={0}
                      style={{ width: 240 }}
                      formatter={limitDecimals}
                      parser={limitDecimals}
                    />
                  )
                }
              </FormItem>
              <FormItem {...formLayout1} label="单奖品每月发放上限">
                {
                  getFieldDecorator( 'monthSendLimit', {
                    rules: [{ required: false }],
                  } )(
                    <InputNumber
                      placeholder="请输入，不填则视为不限制"
                      min={0}
                      style={{ width: 240 }}
                      formatter={limitDecimals}
                      parser={limitDecimals}
                    />
                  )
                }
              </FormItem>
            </>
          )
        }
        <FormItem {...formLayout1} label="" style={{ display: 'none' }}>
          {getFieldDecorator( 'prizeType', {
            rules: [{ required: false }],
          } )(
            <Input style={{ display: 'none' }} />
          )}
        </FormItem>
      </>
    );
  };

  const renderContent = () => {
    return renderOptionItem();
  };
  return renderContent();
}

const mapProps = ( { bees } ) => ( {
  merchantList: bees.merchantList,
  prizeTypeList: bees.prizeTypeList,
  loading: bees.loading,
  allActivityList: bees.allActivityList,
  drawElementList: bees.drawElementList,
} );

export default Form.create( { name: 'PrizeOptionForm' } )( connect( mapProps )( PrizeOptionItem ) );

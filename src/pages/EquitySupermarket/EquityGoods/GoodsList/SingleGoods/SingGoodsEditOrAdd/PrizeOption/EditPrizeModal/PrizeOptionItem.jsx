/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Select, Input, InputNumber, Tooltip, Icon, Divider, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { mathematicalCalculation }  from '@/utils/utils'
import styles from './index.less';

const { add } = mathematicalCalculation
const { Option } = Select;
const FormItem = Form.Item;
// const { Group } = Radio;
const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
// const formLayout1 = {
//   labelCol: { span: 9 },
//   wrapperCol: { span: 10 },
// };
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
  'daySendLimit',
  'expireDays',
  'changeInventory',
  'prizeType',
  'minimum', // 微信立减金 - “满”
  'rewardValue', // 积分与次数类型的值
  'rewardActivityId', // 积分与次数奖品发放到的活动id
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
  const { dispatch, form, awardMode = "RIGHT", merchantList, editObj, rewardType, needWeekAndMonth } = props;
  const { getFieldDecorator, getFieldsValue, getFieldValue, resetFields, setFieldsValue, validateFields } = form;
  //   为了避免每个配置直接影响，每个item单独保存自己的奖品列表
  const [prizeList, setPrizeList] = useState( [] );
  const [addSub, setAddSub] = useState( true );
  const stockNum = useRef( 0 );
  const prizePage = useRef( { pageNum: 1, pageSize: 10, done: false } )
  const editOldPrizeOption = useRef( null )
  const { inventory = 0, id } = editObj || {};

  const [goodsPageSize] = useState( 100 )

  const {
    productType = editObj?.productType || '',
    expireType = editObj?.expireType || '',
    relationPrizeId = editObj?.relationPrizeId,
    price = editObj?.price,
    changeInventory = editObj?.changeInventory,
  } = getFieldsValue( ['productType', 'relationPrizeType', 'expireType', 'relationPrizeId', 'price', 'changeInventory'] );



  useEffect( () => {
    if ( Object.keys( editObj || {} ).length ) {
      setPrizeList( [] )
    }
  }, [editObj] )

  // 获取商品列表
  const getGoodsList = ( { type, name, ...other } ) => {
    dispatch( {
      type: 'equityGoods/getGoodsList',
      payload: {
        pageNum: prizePage.current.pageNum,
        pageSize: goodsPageSize,
        type: productType || type,
        name,
        ...other
      },
      callBackFunc: ( res ) => {
        if ( res.success ) {
          const copyPrizeList = [...prizeList]
          setPrizeList( copyPrizeList.concat( res.result.list ) )
        }
      }
    } )
  };

  useEffect( () => {
    getGoodsList( { type: productType } )
  }, [productType] )


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
        type: 'prizeModal/getVisibleGoodsList',
        payload: {
          merchantId,
          type,
          productName,
          productId,
          tradeStatus: 'NORMAL',
          ...prizePage.current
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
      type: 'prizeModal/getPrizeList',
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
      getVisibleGoodsList( { merchantCode: prizeType, type: _productType } );
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
    const newChoosePrizeObj = prizeList.find(
      item => item && item.id === relationPrizeId
    );
    initUsrInventory = newChoosePrizeObj?.stock
      ? newChoosePrizeObj.stock
      : inventory || 0;
    return initUsrInventory;
  }, [prizeList, relationPrizeId] );

  const addSubSwitch = () => {
    setAddSub( !addSub );
    // setTimeout( () => {
    //   validateFields( ['changeInventory'], { force: true } );
    // }, 200 );
  };

  // const inventoryValidator = ( rule, value, callback ) => {
  //   // 修改预计剩余库存量为剩余库存量
  //   const storeCount = copyInventory; // 可以用库存
  //   const val = stockNum.current;
  //   if ( !val ) {
  //     callback();
  //     return;
  //   }
  //   let addMaxCount = 0; // 最大可以配置库存
  //   let subMaxCount = 0; // 活动剩余库存
  //   if ( !inventory ) {
  //     // 新增奖品
  //     addMaxCount = storeCount;
  //     subMaxCount = 0;
  //     if ( productType === 'RED' ) {
  //       addMaxCount = Math.floor( storeCount / price );
  //     }
  //   } else if ( inventory ) {
  //     // 编辑已有奖品
  //     addMaxCount = storeCount - inventory;
  //     subMaxCount = inventory;
  //     if ( productType === 'RED' ) {
  //       addMaxCount = Math.floor( storeCount / price ) - inventory;
  //     }
  //   }
  //   // if ( inventory && addSub ) {
  //   //   if ( val > addMaxCount && rewardType === 'PRIZE' ) {
  //   //     callback( '添加数量超出剩余库存量，请重新输入' );
  //   //     return;
  //   //   }
  //   // }
  //   // if ( inventory && !addSub ) {
  //   //   if ( subMaxCount - val < 0 ) {
  //   //     callback( '剩余库存量小于0，请重新输入' );
  //   //     return;
  //   //   }
  //   // } else if ( !inventory && addSub ) {
  //   //   if ( val > addMaxCount && rewardType === 'PRIZE' ) {
  //   //     callback( '添加数量超出剩余库存量，请重新输入' );
  //   //     return;
  //   //   }
  //   // }
  //   if ( !addSub && !subMaxCount ) {
  //     callback( '剩余库存为0，不可减少' );
  //     return;
  //   }
  //   if ( !addSub && subMaxCount ) {
  //     if ( val > subMaxCount ) {
  //       callback( '减少数量超出剩余库存，请重新输入' );
  //       return;
  //     }
  //   }
  //   setFieldsValue( { changeInventory: addSub ? val : 0 - val } );
  //   callback();
  // };


  // 分页
  const handleAddPrize = () => {
    prizePage.current.pageNum += 1
    getGoodsList( { type: productType } )
  }

  const changeSelectPrize = ( val ) => {
    const obj = prizeList && prizeList.find( item => item.id === val || item.id === +val )
    if ( obj ) {
      setFieldsValue( { 'prizeType': obj.productType || obj.prizeType } )
    }
  }

  const changeProductType = ( type ) => {
    if ( type !== productType ) {
      setPrizeList( [] )
    }
  }

  //   旋转奖品下拉框
  const renderSelectPrize = () => {
    const dataKey = {
      value: 'id',
      name: 'name',
    };
    return prizeList.map( ( info ) => {
      return info &&
        <Option value={Number( info[dataKey.value] )} key={`${info[dataKey.value]}`}>
          {info[dataKey.name]}
        </Option>
    } );
  }

  const renderOptionItem = () => {
    return (
      <>
        {
          rewardType === 'PRIZE' &&
          <>
            {awardMode === 'RIGHT' && (
              <>
                {/* <FormItem label="选择商户" {...formLayout} key="relationPrizeType">
              {getFieldDecorator( 'relationPrizeType', {
                rules: [{ required: true, message: '请选择商户' }],
              } )(
                <Select
                  style={{ width: '75%' }}
                  placeholder="请选择商户"
                  showSearch
                  getPopupContainer={( triggerNode )=>triggerNode.parentElement || document.body}
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
              )}
            </FormItem> */}
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
                      onChange={e => changeProductType( e )}
                      disabled={!!id}
                    >
                      <Option value="RED">红包</Option>
                      <Option value="COUPON">虚拟卡券</Option>
                      <Option value="GOODS">实物</Option>
                      <Option value="PHONE">直充</Option>
                      <Option value="WX_COUPON">微信立减金</Option>
                      <Option value="WX_VOUCHER">微信代金券</Option>
                      {/* <Option value="CUSTOM">自定义商品</Option> */}
                    </Select>
                  )}
                </FormItem>
              </>
            )}

            <FormItem label="选择奖品" {...formLayout} key="relationPrizeId">
              {getFieldDecorator( 'relationPrizeId', {
                rules: [{ required: true, message: '请选择奖品' }],
              } )(
                <Select
                  style={{ width: '75%' }}
                  placeholder="请选择奖品"
                  showSearch
                  filterOption={( input, option ) =>
                    option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                  }
                  onChange={changeSelectPrize}
                  getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                  disabled={!!id}
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
              )}
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
                  )}
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
                  )}
                </div>
              </FormItem>
            }
            {productType === 'RED' && (
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
                  )}
                  <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>元</span>
                </FormItem>
                {/* <FormItem label="红包描述" {...formLayout}>
                  {getFieldDecorator( 'description', {
                    rules: [{ required: true, message: '请输入红包描述' }],
                  } )( <Input style={{ width: '75%' }} placeholder="请输入红包描述" /> )}
                </FormItem> */}
              </>
            )}
          </>
        }
        {
          rewardType === 'PRIZE' && (
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
              &nbsp;: {inventory || 0}
            </p>
            {/* <p>
              活动库存
              <Tooltip title={<span>当期奖品总库存，活动库存=已用库存+剩余库存</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
              &nbsp;:{( inventory || 0 ) + ( sendCount || 0 )}
            </p> */}
            {
              rewardType === 'PRIZE' && (
                <p>
                  可用{productType === 'RED' ? '资金' : '库存'}
                  <Tooltip
                    title={
                      <span>取自{awardMode === 'RIGHT' ? '权益商超' : '奖品管理'}（非实时更新）</span>
                    }
                  >
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                  &nbsp;: {copyInventory}
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
              setFieldsValue( { changeInventory: addSub ? val : 0 - val } );
                // validateFields( ['changeInventory'], { force: true } );
            }}
          />
          {/* 用于保存并校验数据 */}
          {getFieldDecorator( 'changeInventory', {
            rules: [
              { required: true, },
            ],
          } )( <InputNumber style={{ display: 'none' }} /> )}
          {/* {addSub ? (
            <span style={{ paddingLeft: '20px' }}>
              预计剩余库存：{ ( inventory || 0 ) + stockNum.current}
            </span>
          ) : (
            <span style={{ paddingLeft: '20px' }}>
              预计剩余库存：
              { ( inventory || 0 ) - stockNum.current > 0 ? ( inventory || 0 ) - stockNum.current : 0}
            </span>
          )} */}
        </FormItem>
      </>
    );
  };

  const renderContent = () => {
    return renderOptionItem();
  };
  return renderContent();
}

const mapProps = ( { prizeModal } ) => ( {
  merchantList: prizeModal.merchantList,
  prizeTypeList: prizeModal.prizeTypeList,
} );

export default Form.create( { name: 'PrizeOptionForm' } )( connect( mapProps )( PrizeOptionItem ) );

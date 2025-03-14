/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-expressions */
import { Form, Input, Select, InputNumber, Radio, DatePicker, message, Tooltip, Icon } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import styles from './editPrizeModal.less';

const { Option } = Select;
const { Group } = Radio;
const FormItem = Form.Item;

const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const formLayout1 = {
    labelCol: { span: 9 },
    wrapperCol: { span: 10 },
};

// 正则判断
const limitDecimals = ( value, red ) => {
    // eslint-disable-next-line no-useless-escape
    let reg = /^(\-)*(\d+).*$/;
    if ( red === 'red' ) {
        reg = /^(\-)*(\d+)\.(\d\d).*$/;
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

const KeyInfoFormItems = ( props ) => {
    const {
        awardMode = 'RIGHT',
        isSaveTag = false,
        getVisibleGoodsList,
        getPrizeList,
        getPrizeTypeList,
        getMerchantList,
        merchantVisibleList,
        prizeList,
        merchantOptions,
        rightPrizeOptions,
        openPrizeOptions,
        prizeTypeOptions,
        formInitData,
        changeToUpdate
    } = props
    const originData = JSON.parse( JSON.stringify( formInitData ) )
    const {
        relationPrizeType = '',
        relationPrizeId = '',
        productType = '',
        name = '',
        expireType = 'TIME',
        price = '',
        description = '',
        inventory = '',
        expireTime = null,
        expireDays = '',
        userLimit = '',
        daySendLimit = '',
        userDayLimit = '',
        sendCount = 0
    } = originData


    const [copyInventory, setCopyInventory] = useState( 0 );
    const [addSub, setAddSub] = useState( true );
    const [predictInventory, setPredictInventory] = useState( 0 );
    const [predictInventory2, setPredictInventory2] = useState( 0 );
    const [inventoryExhibit, setInventoryExhibit] = useState( inventory );
    const [sendCountShow, setSendCountShow] = useState( sendCount );

    // 初始化库存数据
    const initInventory = () => {
        let initUsrInventory = 0
        if ( awardMode === 'OPEN' ) {
            const choosePrizeObj = prizeList && prizeList.find( item => ( item.rightId === relationPrizeId ) )
            initUsrInventory = ( choosePrizeObj && choosePrizeObj.unIssuedCnt ) ? choosePrizeObj.unIssuedCnt : ( inventory || 0 )
        }
        if ( awardMode === 'RIGHT' ) {
            let newChoosePrizeObj = []
            if ( merchantVisibleList.length ){
                merchantVisibleList.forEach( item => {
                    if ( String( item.productId ) === relationPrizeId && String( item.merchantCode ) === relationPrizeType ) {
                        newChoosePrizeObj = item
                    }
                } )
            }
            initUsrInventory = ( newChoosePrizeObj && newChoosePrizeObj.inventory ) ? newChoosePrizeObj.inventory : ( inventory || 0 )
        }
        return initUsrInventory
    }

    // 可用库存实时计算显示
    const getUnIssuedCnt = ( id ) => {
        const findInventoryList = awardMode === 'RIGHT' ? merchantVisibleList : prizeList;
        if ( !id ) return 0;
        let param = 0;
        if ( findInventoryList.length ) {
            findInventoryList.forEach( item => {
                if ( awardMode === 'RIGHT' && String( item.productId ) === id ) {
                    param = item.inventory;
                }
                if ( awardMode === 'OPEN' && item.rightId === id ) {
                    param = item.unIssuedCnt || 0;
                }
            } );
        }

        return param;
    };

    // 重置库存数据
    const clearInventory = () => {
        setPredictInventory2( 0 );
        setInventoryExhibit( 0 );
        setSendCountShow( 0 );
        setPredictInventory( 0 );
        setAddSub( true );
    };

    // 处理表单项目的change事件
    const handleFormItemChange = ( e, type ) => {
        // 按顺序填写奖品信息的字段映射
        const queryRelect = {
            RIGHT: {
                productType: 'relationPrizeType',
                relationPrizeId: 'productType',
            },
            OPEN: {
                relationPrizeId: 'relationPrizeType',
            },
        };

        // 选择对应表单项目之后需要置空的对象
        const resetEmptyObj = {
            RIGHT: {
                productType: ['relationPrizeId'],
                relationPrizeType: ['relationPrizeId', 'productType'],
            },
            OPEN: {
                relationPrizeType: ['relationPrizeId'],
            },
        };
        const judgeObj = queryRelect[awardMode];
        const resetObj = resetEmptyObj[awardMode];

        const editData = formInitData;
        editData.awardMode = awardMode
        let val = e && e.target ? e.target.value : e || '';
        let chooseItem = {};

        if ( type === 'relationPrizeId' && awardMode === 'OPEN' ) {
            chooseItem = prizeList.find( info => info.rightId === e ) || {};
            editData.prizeType = chooseItem.prizeType
        }

        if ( Object.keys( resetObj ).includes( type ) ) {
            resetObj[type].forEach( key => {
                editData[key] = '';
            } );
        }

        if ( Object.keys( judgeObj ).includes( type ) ) {
            if ( !editData[judgeObj[type]] ) {
                message.error( '请按顺序填写奖品信息' );
                return null;
            }
            getMerchantList();
            if ( type === 'productType' ){
                editData.prizeType = val
                getVisibleGoodsList( editData.relationPrizeType, val, '' );
            }
            awardMode === 'OPEN' && getPrizeList( '', relationPrizeType );
        }
        type === 'relationPrizeType' && awardMode === 'OPEN' && getPrizeList( '', val );

        if ( type === 'relationPrizeType' || type === 'productType' ) {
            setCopyInventory( 0 );
            editData.inventory = 0;
            editData.sendCount = 0;
            editData.usrInventory = 0;
            clearInventory();
        }

        if ( type === 'relationPrizeId' ) {
            setCopyInventory( getUnIssuedCnt( val ) );
            editData.usrInventory = getUnIssuedCnt( val );
            editData.inventory = 0;
            editData.sendCount = 0;
            clearInventory();
        }

        if ( type === 'inventory' ) {
            if ( inventory ) {
                if ( addSub ) {
                    val += inventory;
                } else {
                    val = inventory - val;
                }
            }
        }
        editData[type] = val;
        if ( changeToUpdate ) {
            isSaveTag ? changeToUpdate( editData ) : changeToUpdate( formInitData );
        }
        return editData
    };

    // 切换库存是增加还是减少
    const addSubSwitch = () => {
        const beforeInventory = inventory;
        let storeCount = copyInventory;
        if ( productType === 'RED' ) {
            storeCount = Math.floor( storeCount / price );
        }
        setPredictInventory( 0 );
        setPredictInventory2( 0 );

        // 如果输入框有值，则切换加减模式 清空输入框
        if ( predictInventory ) {
            setAddSub( !addSub );
            return;
        }
        if ( beforeInventory <= 0 || !beforeInventory ) {
            setAddSub( true );
            if ( addSub ) {
                message.warn( '库存已为0' );
            }
            return;
        }
        if (
            predictInventory + beforeInventory >= storeCount &&
            predictInventory + beforeInventory !== 0
        ) {
            setAddSub( false );
            if ( !addSub ) {
                message.warn( '已达到最大库存' );
            }
            return;
        }
        setAddSub( !addSub );
    };

    // 修改预计剩余库存量
    const onChangePredictInventory = e => {
        const val = ( e && e.target ? e.target.value : e || '' ) * 1;
        setPredictInventory( val );
        setPredictInventory2( val );
    };

    // 修改预计剩余库存量为剩余库存量
    const onBlurPredictInventory = e => {
        const storeCount = copyInventory;
        const val = ( e && e.target ? e.target.value : e || '' ) * 1;
        if ( !val ) {
            setPredictInventory( 0 );
            return;
        }
        let addMaxCount = 0;
        let subMaxCount = 0;
        if ( !inventory ) {
            // 新增奖品
            addMaxCount = storeCount;
            subMaxCount = 0;
            if ( productType === 'RED' ) {
                addMaxCount = Math.floor( storeCount / price );
            }
        } else if ( inventory ) {
            // 编辑已有奖品
            addMaxCount = storeCount - inventory;
            subMaxCount = inventory;
            if ( productType === 'RED' ) {
                addMaxCount = Math.floor( storeCount / price ) - inventory;
            }
        }
        if ( inventory && addSub ) {
            if ( val > addMaxCount ) {
                message.error( '超出剩余库存量，请重新输入' );
                setPredictInventory( 0 );
                setPredictInventory2( 0 );
                return;
            }
        }
        if ( inventory && !addSub ) {
            if ( val > subMaxCount ) {
                message.error( '剩余库存量小于0，请重新输入' );
                setPredictInventory( 0 );
                setPredictInventory2( 0 );
                return;
            }
        } else if ( !inventory && addSub ) {
            if ( val > addMaxCount ) {
                message.error( '超出剩余库存量，请重新输入' );
                setPredictInventory( 0 );
                setPredictInventory2( 0 );
                return;
            }
        }
        handleFormItemChange( val, 'inventory' );
        if ( addSub && val === addMaxCount ) {
            setPredictInventory( 0 );
            setAddSub( false );
            message.warn( '已达到最大库存' );
        } else if ( !addSub && val === subMaxCount ) {
            setPredictInventory( 0 );
            setAddSub( true );

            message.warn( '库存已为0' );
        }
        setPredictInventory2( 0 );
    };

    // select下拉搜索
    const onPrizeSearch = ( val, type ) => {
        if ( val ) {
            setTimeout( () => {
                if ( awardMode === 'RIGHT' ) {
                    if ( type === 'goods' ) {
                        getVisibleGoodsList( relationPrizeType, productType, val )
                    }
                    if ( type === 'merchant' ) {
                        getMerchantList( val )
                    }
                }
            }, 200 );
        }

    }

    useEffect( () => {
        if ( awardMode === 'RIGHT' ) {
            getMerchantList()
            getVisibleGoodsList( relationPrizeType, productType, '' )
        }
        if ( awardMode === 'OPEN' ) {
            getPrizeTypeList()
            getPrizeList( '', relationPrizeType )
        }
    }, [awardMode] )


    useEffect( ()=>{
        setPredictInventory( 0 )
        setPredictInventory2( 0 )
    }, [awardMode] )

    useEffect( () => {
        setCopyInventory( initInventory() )
    }, [merchantVisibleList, prizeList] );

    return (
      <>
        {awardMode === 'RIGHT' && (
        <>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>选择商户
              </span>
                        }
            {...formLayout}
          >
            <Select
              value={relationPrizeType}
              onChange={e => handleFormItemChange( e, 'relationPrizeType' )}
              style={{ width: '75%' }}
              showSearch
              onSearch={( val ) => onPrizeSearch( val, 'merchant' )}
              filterOption={false}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {merchantOptions}
            </Select>
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>商品类型
              </span>
                        }
            {...formLayout}
          >
            <Select
              value={productType}
              onChange={e => handleFormItemChange( e, 'productType' )}
              style={{ width: '75%' }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              <Option value="RED">红包</Option>
              <Option value="COUPON">虚拟卡券</Option>
              <Option value="GOODS">实物</Option>
              <Option value="PHONE">话费充值</Option>
              <Option value="CUSTOM">自定义商品</Option>
            </Select>
          </FormItem>
        </>
            )}
        {awardMode === 'OPEN' && (
        <>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>奖品类型
              </span>
                        }
            {...formLayout}
          >
            <Select
              value={relationPrizeType}
              onChange={e => handleFormItemChange( e, 'relationPrizeType' )}
              style={{ width: '75%' }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {prizeTypeOptions}
            </Select>
          </FormItem>
        </>
            )}
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>选择奖品
            </span>
                }
          {...formLayout}
        >
          <Select
            value={String( relationPrizeId )}
            onChange={e => handleFormItemChange( e, 'relationPrizeId' )}
            style={{ width: '75%' }}
            showSearch={awardMode === 'RIGHT'}
            onSearch={( val ) => onPrizeSearch( val, 'goods' )}
            filterOption={false}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {awardMode === 'RIGHT' ? rightPrizeOptions : openPrizeOptions}
          </Select>
        </FormItem>
        {productType === 'RED' && (
        <>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>红包金额
              </span>
                        }
            {...formLayout}
          >
            <InputNumber
              value={price}
              onChange={e => handleFormItemChange( e, 'price' )}
              placeholder="请输入红包金额"
              min={0}
              style={{ width: '75%' }}
              formatter={value => limitDecimals( value, 'red' )}
              parser={value => limitDecimals( value, 'red' )}
            />
            <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>元</span>
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>红包描述
              </span>
                        }
            {...formLayout}
          >
            <Input
              value={description}
              onChange={e => handleFormItemChange( e, 'description' )}
              style={{ width: '75%' }}
              placeholder="请输入红包描述"
            />
          </FormItem>
        </>
            )}
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>奖品名称
            </span>
                }
          {...formLayout}
        >
          <Input
            value={name}
            onChange={e => handleFormItemChange( e, 'name' )}
            placeholder="请输入奖品名称"
            style={{ width: '75%' }}
            maxLength={50}
          />
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>活动库存
            </span>
                }
          {...formLayout}
        >
          <div className={styles.inventoryShow}>
            <p>
              剩余库存
              <Tooltip title={<span>当前奖品剩余库存（非实时更新）</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
              &nbsp;: {inventoryExhibit || 0}
            </p>
            <p>
              活动库存
              <Tooltip title={<span>当期奖品总库存，活动库存=已用库存+剩余库存</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
              &nbsp;:  {( inventoryExhibit || 0 ) + ( sendCountShow || 0 )}
            </p>
            <p>
              可用{productType === 'RED' ? '资金' : '库存'}
              <Tooltip title={<span>取自{awardMode === 'RIGHT' ? '权益商超' : '奖品管理'}（非实时更新）</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
              &nbsp;: {copyInventory}
            </p>
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
            value={predictInventory}
            formatter={limitDecimals}
            parser={limitDecimals}
            onBlur={e => {
                        onBlurPredictInventory( e );
                    }}
            onChange={e => {
                        onChangePredictInventory( e );
                    }}
          />
          {addSub ? (
            <span style={{ paddingLeft: '20px' }}>
              预计剩余库存：{( inventory || 0 ) + predictInventory2}
            </span>
                ) : (
                  <span style={{ paddingLeft: '20px' }}>
                    预计剩余库存：
                    {( inventory || 0 ) - predictInventory2 > 0 ? ( inventory || 0 ) - predictInventory2 : 0}
                  </span>
                )}
        </FormItem>
        {productType !== 'COUPON' && (
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>过期类型
            </span>
                    }
          {...formLayout}
        >
          <Group value={expireType} onChange={e => handleFormItemChange( e, 'expireType' )}>
            <Radio value="TIME">失效时间</Radio>
            <Radio value="DAYS">有效天数</Radio>
          </Group>
        </FormItem>
            )}
        {expireType === 'TIME' && productType !== 'COUPON' && (
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>失效时间
            </span>
                    }
          {...formLayout}
        >
          <DatePicker
            value={expireTime ? moment( expireTime, 'YYYY-MM-DD' ) : null}
            onChange={e => handleFormItemChange( e, 'expireTime' )}
            style={{ width: '100%' }}
            placeholder="请选择失效时间"
            format="YYYY-MM-DD"
          />
        </FormItem>
            )}
        {expireType === 'DAYS' && productType !== 'COUPON' && (
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>有效天数
            </span>
                    }
          {...formLayout}
        >
          <InputNumber
            value={expireDays}
            onChange={e => handleFormItemChange( e, 'expireDays' )}
            placeholder="请输入有效天数"
            min={0}
            style={{ width: '100%' }}
            formatter={limitDecimals}
            parser={limitDecimals}
          />
        </FormItem>
            )}
        <FormItem
          {...formLayout1}
          label={<span className={styles.labelText}>单用户单奖品总中奖次数上限</span>}
        >
          <InputNumber
            value={userLimit}
            onChange={e => handleFormItemChange( e, 'userLimit' )}
            placeholder="请输入，不填则不限制"
            min={0}
            style={{ width: 240 }}
            formatter={limitDecimals}
            parser={limitDecimals}
          />
        </FormItem>
        <FormItem
          {...formLayout1}
          label={<span className={styles.labelText}>单用户单奖品单日中奖次数上限 </span>}
        >
          <InputNumber
            value={userDayLimit}
            onChange={e => handleFormItemChange( e, 'userDayLimit' )}
            placeholder="请输入，不填则不限制"
            min={0}
            style={{ width: 240 }}
            formatter={limitDecimals}
            parser={limitDecimals}
          />
        </FormItem>
        <FormItem
          {...formLayout1}
          label={<span className={styles.labelText}>单奖品每日发放上限</span>}
        >
          <InputNumber
            value={daySendLimit}
            onChange={e => handleFormItemChange( e, 'daySendLimit' )}
            placeholder="请输入，不填则不限制"
            min={0}
            style={{ width: 240 }}
            formatter={limitDecimals}
            parser={limitDecimals}
          />
        </FormItem>
      </>
    );
};

export default KeyInfoFormItems;

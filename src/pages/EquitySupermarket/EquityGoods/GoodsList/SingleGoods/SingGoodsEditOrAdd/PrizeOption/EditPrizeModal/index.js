/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from 'react';
import { message, Modal, Form, Radio, Checkbox, Input, Button, Empty } from 'antd';
import { connect } from 'dva';
import _ from 'lodash'
import { CommonOperationFun } from '@/pages/ActivityMarketing/BeesV3/AddOrEditBees/provider'
import UploadModal from '@/components/UploadModal/UploadModal';
import PrizeOptionItem from './PrizeOptionItem';
import styles from './index.less';
/**
 * 奖品配置组件参数
 * @param editKey 编辑的奖品表示
 * @param dataKey 更新的参数名，不传默认prizes
 * @param changeValue 更新组件数据FUNC
 * @param componentsData 组件数据
 * @param tableWithPosition  是否带奖项
 * @param modalVisible 弹窗状态
 * @param setModalVisible 更新弹窗状态的FUN
 */

const FormItem = Form.Item;
const { TextArea } = Input;

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// const needWeekMonthLimit = ['GRID_WHEEL', 'BIG_WHEEL', 'SCRATCH_CARD', 'GRID_WHEEL', 'RED_RAIN', 'SLOT_MACHINE', 'MYSTERY_BOX', 'SMASH_EGG', 'LUCK_DOG', 'AWARD', ]


const formLayoutCheckbox = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const randomKey = () =>
  Number(
    Math.random()
      .toString()
      .substr( 3, 12 ) + Date.now()
  ).toString( 36 );
// 头部内容部分字段key
const contentObjKeys = ['image', 'itemName'];
const defaultArr = []
const EditPrizeModal = props => {
  const {
    editData = [],
    dataKey = 'prizes',
    changeValue,
    componentsData,
    modalVisible,
    setModalVisible,
    tableWithPosition,
    maxPrizeNum,
    form,
    // dispatch,
    noProbability = false,
    disabledThanks = false
  } = props;

  const { getFieldDecorator, setFieldsValue, resetFields, validateFields, getFieldsValue } = form;
  const editObj = editData?.[0];
  const prizeData = _.get( componentsData, dataKey ) || defaultArr;
  const [prizeOptionList, setPrizeOptionList] = useState( [] );
  const prizeOptionRef = useRef( [] );
  const { awardMode, rewardType } = getFieldsValue( ['awardMode', 'rewardType'] );
  const { integralOtherName } = useContext( CommonOperationFun )
  // const needWeekAndMonth = needWeekMonthLimit.includes( componentsData.type )

  /**
   *  初始化时如果中奖类型是奖品设置发奖模式
   *  问：为什么在这设置表单值？
   *  答： form表单要求不能在呈现之前设置
   */
  useEffect( () => {
    if ( awardMode || !rewardType || rewardType === 'EMPTY' ) return;
    const newAwardMode = editObj?.awardMode || 'RIGHT';
    setFieldsValue( {
      awardMode: newAwardMode,
    } );
  }, [rewardType] );

  // 谢谢参与提示文案
  useEffect( () => {
    if ( !rewardType || rewardType !== 'EMPTY' ) return;
    const popupText = editObj ? editObj?.popupText : '积攒好运气，明日再来哦~'
    setFieldsValue( {
      popupText,
    } );
  }, [rewardType] );

  // 初始化表单值
  useEffect( () => {
    if ( !modalVisible ) return;
    if ( !editObj ) {
      setFieldsValue( { rewardType: 'PRIZE' } );
      return;
    }
    const newPrizeType = editObj.rewardType || ( editObj?.name || !editObj ? 'PRIZE' : 'EMPTY' );
    const defaultObj = Object.keys( editObj ).reduce( ( prev, item ) => {
      if ( contentObjKeys.includes( item ) ) {
        prev[item] = editObj[item];
      }
      return prev;
    }, {} );
    setFieldsValue( {
      ...defaultObj,
      rewardType: newPrizeType,
      itemPosition: editObj?.itemPosition?.split( ',' ) || [],
    } );
    const isIntegralOrCount = editObj.rewardType === 'INTEGRAL' || editObj.rewardType === 'LEFT_COUNT'
    if ( ( newPrizeType === 'PRIZE' || isIntegralOrCount ) && tableWithPosition ) {
      setPrizeOptionList( _.cloneDeep( editData ) );

    }
  }, [modalVisible] );

  // // 获取新模式商户列表
  // const getMerchantList = name => {
  //   dispatch( {
  //     type: 'prizeModal/getMerchantList',
  //     payload: {
  //       name,
  //     },
  //   } );
  // };

  /**
   * @example 旧模式奖品类型
   * @returns
   */
  // const getPrizeTypeList = () => {
  //   dispatch( {
  //     type: 'prizeModal/getPrizeTypeList',
  //     payload: {},
  //   } );
  // };

  // 这些下拉框内容没有分页，查一次就好
  useEffect( () => {
    // getMerchantList();
    // getPrizeTypeList();
  }, [] );

  // 有奖品位 奖品位置选项框
  const checkOption = useMemo( () => {
    if ( !tableWithPosition || !modalVisible ) return [];
    const disabledCheckbox = prizeData.reduce( ( prev, item ) => {
      const { itemPosition } = item;
      if ( itemPosition && itemPosition !== editObj?.itemPosition ) {
        prev.push( ...item.itemPosition.split( ',' ) );
      }
      return prev;
    }, [] );
    const checkBox = new Array( maxPrizeNum ).fill( '' ).map( ( item, idx ) => {
      const obj = {
        label: `选项${idx + 1}`,
        value: `${idx + 1}`,
        disabled: false,
      };
      if ( disabledCheckbox.includes( `${idx + 1}` ) ) {
        obj.disabled = true;
      }
      return obj;
    } );
    return checkBox;
  }, [maxPrizeNum, tableWithPosition, modalVisible] );

  // 弹窗关闭
  const handleModalClose = useCallback( () => {
    setModalVisible( false );
    resetFields();
    setPrizeOptionList( [] );
    prizeOptionRef.current = [];
  }, [] );

  // 默认概率
  const evalWinningProbability = data => {
    const obj = {};
    if ( !noProbability ) {
      obj.probability = 0
    }
    if ( prizeData?.length ) {
      const singlePrize = prizeData[0];
      Object.keys( singlePrize ).forEach( key => {
        if ( key.includes( 'probability' ) ) {
          obj[key] = 0;
        }
      } );
    }
    return data.map( item => {
      // 有表示编辑内容，不需要添加默认值
      if ( item.probability !== undefined ) {
        return item
      }
      if ( !item.prizeVirtualId ) {
        item.prizeVirtualId = randomKey()
      }
      return { ...obj, ...item }
    } );
  };
  // 弹窗保存
  const modalSaveFun = async () => {
    const beseObj = await validateFields().catch( () => null );
    if ( !beseObj ) return;
    const { current } = prizeOptionRef;
    const prizeOptionData = [];
    if ( beseObj.itemPosition ) beseObj.itemPosition = beseObj.itemPosition.join( ',' );
    const rewardTypeArr = ['PRIZE', 'INTEGRAL', 'LEFT_COUNT']
    // 奖品配置部分
    if ( rewardTypeArr.includes( rewardType ) ) {
      if ( !current.length ) {
        message.error( '至少需要有一个奖品～' );
        return
      }
      for ( let i = 0; i < current.length; i += 1 ) {
        const optionItem = await current[i].validateFields().catch( () => null );
        if ( !optionItem ) return;
        const obj = {
          ...optionItem,
          ...beseObj,
        }
        if ( obj.expireTime ) obj.expireTime = obj.expireTime.format( 'YYYY-MM-DD' )
        if ( rewardType === 'INTEGRAL' ) obj.name = `${obj.rewardValue || '-'}${integralOtherName || '积分'}`
        if ( rewardType === 'LEFT_COUNT' ) obj.name = `${obj.rewardValue || '-'}次次数`
        if ( obj.rewardActivityId === '' ) obj.rewardActivityId = null
        obj.productId = optionItem.relationPrizeId
        prizeOptionData.push( obj );
      }
    } else {
      prizeOptionData.push( beseObj );
    }


    // 编辑
    if ( editData?.length ) {
      // 旧数据合并
      const newEditList = prizeOptionData.map( ( item, idx ) => {
        if ( editData[idx] ) {
          return { ...editData[idx], ...item };
        }
        return item;
      } );
      // 带奖项位
      if ( tableWithPosition ) {
        const idsObj = {
          start: undefined,
          end: 0,
        };
        // 找出原位置开始和结束索引
        prizeData.forEach( ( item, index ) => {
          // 利用位置做key
          if ( item.itemPosition === editObj.itemPosition ) {
            if ( idsObj.start === undefined ) {
              idsObj.start = index;
            }
            idsObj.end += 1;
          }
        } );
        prizeData.splice( idsObj.start, idsObj.end, ...evalWinningProbability( newEditList ) );
      } else {
        const newEditObj = Object.assign( editObj, prizeOptionData[0] )
        prizeData.forEach( ( item, index ) => {
          if ( item.prizeVirtualId === newEditObj.prizeVirtualId ) {
            prizeData[index] = newEditObj
          }
        } )
      }
      changeValue( prizeData.concat( [] ), dataKey );
    } else {
      const data = prizeData.concat( evalWinningProbability( prizeOptionData ) );
      changeValue( data, dataKey );
    }
    message.success( '保存成功' );
    handleModalClose();
  };

  // 删除奖品配置列表
  const onDeletePrizeItem = index => {
    prizeOptionList.splice( index, 1 );
    setPrizeOptionList( prizeOptionList.concat( [] ) );
  };
  // 添加奖品配置列表
  const onAddPrizeItem = () => {
    setPrizeOptionList( prizeOptionList.concat( { prizeVirtualId: randomKey() } ) );
  };
  // 头部内容
  const renderContent = useCallback( () => {
    return (
      <>
        <FormItem label={tableWithPosition ? '奖项类型' : '中奖类型'} {...formLayout}>
          {getFieldDecorator( 'rewardType', {
            rules: [
              { required: true, message: `请选择${tableWithPosition ? '奖项类型' : '中奖类型'}` },
            ],
          } )(
            <Radio.Group disabled={!!editData}>
              <Radio value="PRIZE">奖品</Radio>
              {/* <Radio value="INTEGRAL">积分</Radio> */}
              {/* <Radio value="LEFT_COUNT">次数</Radio> */}
              <Radio value="EMPTY" disabled={disabledThanks}>谢谢参与</Radio>
            </Radio.Group>
          )}
        </FormItem>
        {tableWithPosition && (
          <>
            <FormItem style={{ display: 'flex' }} label="奖项位置" {...formLayoutCheckbox}>
              {getFieldDecorator( 'itemPosition', {
                rules: [
                  {
                    required: true,
                    message: `请选择${tableWithPosition ? '奖项类型' : '中奖类型'}`,
                  },
                ],
              } )( <Checkbox.Group options={checkOption} /> )}

              <div style={{ color: '#f73232', fontSize: '12px' }}>*不同奖项的序号不能重复</div>
            </FormItem>
            <FormItem style={{ display: 'flex' }} label="奖项名称" {...formLayout}>
              {getFieldDecorator( 'itemName', {
                rules: [{ required: true, message: `请输入奖品名称` }],
              } )( <Input placeholder="请输入奖项名称" maxLength={50} /> )}
            </FormItem>
          </>
        )}
        <FormItem label={tableWithPosition ? '奖项图' : '奖品图'} {...formLayout}>
          {getFieldDecorator( 'image', {
            rules: [
              { required: true, message: `请选择${tableWithPosition ? '奖项图' : '奖品图'}` },
            ],
          } )( <UploadModal /> )}
        </FormItem>
        {
          rewardType === 'EMPTY' && (
            <FormItem label="提示文案" {...formLayout}>
              {getFieldDecorator( 'popupText', {
              } )( <TextArea maxLength={64} /> )}
            </FormItem>
          )
        }
      </>
    );
  }, [tableWithPosition, editData, checkOption, rewardType] );

  const renderPrizeOptionItem = () => {
    prizeOptionRef.current = [];
    if ( !tableWithPosition ) {
      return (
        <PrizeOptionItem
          editObj={editObj}
          // awardMode={awardMode}
          rewardType={rewardType}
          ref={ref => {
            if ( ref ) prizeOptionRef.current.push( ref );
          }}
          // needWeekAndMonth={needWeekAndMonth}
        />
      );
    }
    let content = null;

    if ( !prizeOptionList?.length ) {
      content = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无奖品，请去添加奖品" />;
    } else {
      content = prizeOptionList.map( ( info, index ) => (
        <FormItem
          label={`关联奖品${index + 1}`}
          {...formLayoutCheckbox}
          key={info.prizeVirtualId || info.id}
        >
          <div className={styles.associate_prize}>
            <div className={styles.items_container}>
              <PrizeOptionItem
                ref={ref => {
                  if ( ref ) prizeOptionRef.current.push( ref );
                }}
                editObj={prizeOptionList[index]}
                awardMode={awardMode}
                rewardType={rewardType}
                // needWeekAndMonth={needWeekAndMonth}
              />
            </div>
            <div className={styles.delete_prize} onClick={() => onDeletePrizeItem( index )}>
              删除
            </div>
          </div>
        </FormItem>
      ) );
    }
    return (
      <>
        {content}
        <FormItem label="" {...formLayout}>
          <Button
            className={styles.add_prize}
            type="dashed"
            icon="plus"
            onClick={() => onAddPrizeItem()}
          >
            添加奖品
          </Button>
        </FormItem>
      </>
    );
  };
  // 奖品配置部分
  const renderPrizeOption = useCallback( () => {
    if ( !rewardType || rewardType === 'EMPTY' ) return null;
    return (
      <>
        {/* {
          rewardType === 'PRIZE' && (
            <FormItem label="发奖模式" {...formLayout}>
              {getFieldDecorator( 'awardMode', {
                rules: [{ required: true, message: '请选择发奖模式' }],
              } )(
                <Radio.Group disabled={!!editData}>
                  <Radio value="RIGHT">新模式</Radio>
                  <Radio value="OPEN">旧模式</Radio>
                </Radio.Group>
              )}
            </FormItem>
          )
        } */}
        {renderPrizeOptionItem()}
      </>
    );
  }, [rewardType, prizeOptionList] );

  return (
    <Modal
      title={editData ? '编辑奖品' : '新增奖品'}
      width={840}
      bodyStyle={{ padding: '20px' }}
      visible={modalVisible}
      onCancel={handleModalClose}
      onOk={modalSaveFun}
      maskClosable={false}
    >
      {renderContent()}
      {renderPrizeOption()}
    </Modal>
  );
};
export default Form.create( { name: 'EditPrizeModalForm' } )( connect()( EditPrizeModal ) );

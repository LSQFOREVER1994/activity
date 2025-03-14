/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, InputNumber, Radio, Modal, Select, message, Tooltip, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { mathematicalCalculation }  from '@/utils/utils'
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './exchangeElement.less'

const { add } = mathematicalCalculation;
const FormItem = Form.Item;
const { Option } = Select;
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

const keyVerification = ['score', 'sort', 'image', 'relationPrizeType', 'relationPrizeId', 'name', 'expireType']

@connect( ( { bees } ) => ( {
  prizeTypeList: bees.prizeTypeList,
  prizeList: bees.prizeList,
  merchantList: bees.merchantList,
  merchantVisibleList: bees.merchantVisibleList,
} ) )
@Form.create()
class EditPrizeModal extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  formLayoutCheckbox = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  formLayout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 4 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      editList: [],
      saveObj: {}, //  数据存放。最后提交保存
      predictInventory: 0, // 预计剩余库存
      addSub: true, // 增加库存or减少库存
      awardMode: '', // 新旧模式切换
    }
  }

  componentWillMount() {
    this.initEditData();
  }

  componentDidMount() {
    this.getMerchantList();
  }

  // 获取商品列表
  getVisibleGoodsList = ( code, type, productName ) => {
    const { dispatch, merchantList } = this.props;
    let merchantId = '';
    if ( !code || !type ) return
    merchantList.forEach( item => {
      if ( item.code === code ) {
        merchantId = item.id;
      }
    } );
    dispatch( {
      type: 'bees/getVisibleGoodsList',
      payload: {
        pageNum: 1,
        pageSize: 500,
        merchantId,
        type,
        productName,
      },
    } );
  };

  // 获取商户列表
  getMerchantList = ( name, list ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getMerchantList',
      payload: {
        name,
      },
      successFun: () => {
        if ( list.length )
          this.getVisibleGoodsList( list[0].relationPrizeType, list[0].productType, '' );
      },
    } );
  };

  // 模糊搜索奖品列表
  getPrizeList = ( rightName, relationPrizeType ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getPrizeList',
      payload: {
        rightName,
        rightType: relationPrizeType
      },
    } );
  }

  // 初始化编辑数据
  initEditData = () => {
    const { eleObj = {}, editPositionKey } = this.props;
    // 编辑数据处理
    const prizeList = eleObj.prizes ? eleObj.prizes : []
    let editList = []
    if ( prizeList.length > 0 && editPositionKey ) {
      editList = prizeList.filter( info => {
        return info.prizeVirtualId === editPositionKey
      } )
    }
    const prizeIdList = []
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        if ( info && info.relationPrizeId ) {
          prizeIdList.push( info.relationPrizeId )
        }
      } )
    }

    let awardMode = 'RIGHT';
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        if ( info && !info.productType ) {
          awardMode = 'OPEN';
        } else {
          awardMode = 'RIGHT';
        }
      } );
    }

    const copyEditItem = editList.length ? editList[0] : {}
    copyEditItem.changeInventory = 0
    const newSaveObj = editList.length ? copyEditItem : { expireType: 'TIME', changeInventory: 0 }

    this.setState( {
      saveObj: newSaveObj,
      awardMode,
    }, () => {
      if ( awardMode === 'OPEN' ) {
        this.getPrizeList( '', editList.length ? editList[0].relationPrizeType : '' );
      }
      if ( awardMode === 'RIGHT' ) {
        const code = editList.length ? editList[0].relationPrizeType : ''
        const { saveObj } = this.state
        this.getVisibleGoodsList( code, saveObj.productType || '' )
      }
    } )
  }

  // 弹框保存操作
  onPrizeModalConfirm = () => {
    const { editPositionKey } = this.props
    if ( editPositionKey ) {
      this.onEdit()
    } else if ( !editPositionKey ) {
      this.onAdd()
    }
  }

  // 新增
  onAdd = () => {
    if ( !this.onPrizeModalVerification() ) return
    const { saveObj, awardMode } = this.state
    const { domData = {}, changeDomData, eleObj = {}, onChangeVisible, tagActive } = this.props;
    const prizeList = eleObj.prizes || [];
    saveObj.awardMode = awardMode;
    let editObj = {
      ...saveObj,
      probability: 0,
      prizeVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
    }
    if ( eleObj.elementShowType === 'HOMEPAGE' ) {
      editObj = Object.assign( editObj, { tagName: tagActive, } )
      // eslint-disable-next-line no-prototype-builtins
    } else if ( eleObj.elementShowType === 'SECOND_LEVEL_PAGE' && editObj.hasOwnProperty( 'tagName' ) ) {
      delete editObj.tagName
    }
    let newPrizeList = [];
    newPrizeList = [...prizeList, editObj]
    newPrizeList.sort( ( item1, item2 ) => ( item1.sort - item2.sort ) )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { prizes: [...newPrizeList] } );

    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );

    this.setState( {
      saveObj: {},
    }, () => {
      onChangeVisible( false )
    } )
  }

  // 编辑
  onEdit = () => {
    if ( !this.onPrizeModalVerification() ) return
    const { saveObj } = this.state;
    let editObj = JSON.parse( JSON.stringify( saveObj ) );
    const { domData = {}, changeDomData, eleObj = {}, onChangeVisible, editPositionKey, tagActive } = this.props;
    if ( eleObj.elementShowType === 'HOMEPAGE' ) {
      editObj = Object.assign( saveObj, { tagName: tagActive, } )
      // eslint-disable-next-line no-prototype-builtins
    } else if ( eleObj.elementShowType === 'SECOND_LEVEL_PAGE' && editObj.hasOwnProperty( 'tagName' ) ) {
      delete editObj.tagName
    }
    // 整理数据
    const prizeList = [...eleObj.prizes]
    const index = eleObj.prizes.findIndex( item => item.prizeVirtualId === editPositionKey )
    prizeList.splice( index, 1, editObj );

    prizeList.sort( ( item1, item2 ) => ( item1.sort - item2.sort ) )
    prizeList.forEach( ( item => {
      if ( item.prizeVirtualId !== editPositionKey ) {
        item.changeInventory = 0
      }
    } ) )
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { prizes: [...prizeList] } );

    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );

    this.setState( {
      saveObj: { changeInventory: 0 },
    }, () => {
      onChangeVisible( false )
    } )
  }

  // 校验弹窗必填项
  onPrizeModalVerification = () => {
    let past = true;
    const { saveObj, awardMode } = this.state;
    keyVerification.forEach( item => {
      if ( typeof saveObj[item] === 'number' ) return
      if ( !saveObj[item] && item !== 'inventory' ) {
        past = false
      }
      // 过期类型为失效日期时判断
      if ( item === 'expireType' && saveObj[item] === 'TIME' && !saveObj.expireTime ) {
        past = false
      }
      // 过期类型为失效天数时限制
      if ( item === 'expireType' && saveObj[item] === 'DAYS' && ( saveObj.expireDays <= 0 || !saveObj.expireDays ) ) past = false
      // 判断奖品库存
      if ( item === 'inventory' && saveObj[item] === undefined || saveObj[item] === null || saveObj[item] === '' ) past = false
    } )

    // 新模式必填校验
    if ( awardMode === 'RIGHT' ) {
      if ( !saveObj.productType ) past = false
      if ( saveObj.productType === 'RED' && ( !saveObj.price || !saveObj.description ) ) past = false
      if ( saveObj.productType === 'WX_COUPON' && ( !saveObj.price || !saveObj.minimum ) ) past = false
    }
    if ( !past ) {
      message.error( '还有未填的必填项！' );
    }
    return past;
  }

  // 弹框关闭操作
  onPrizeModalCancel = () => {
    const { onChangeVisible } = this.props
    onChangeVisible( false )
  }

  // 搜索奖品
  onPrizeSearch = ( e, relationPrizeType ) => {
    if ( !relationPrizeType ) {
      message.error( '请先选择权益类型' )
      return
    }
    if ( e ) {
      setTimeout( () => {
        this.getPrizeList( e, relationPrizeType )
      }, 20 );
    }
  }

  // 选择奖品下拉回调
  onDropdownVisibleChange = ( e, info ) => {
    if ( e ) {
      this.getPrizeList( '', info.relationPrizeType )
    }
  }

  // 新旧模式切换
  onModeChange = ( e ) => {
    if ( !e ) return
    const { saveObj } = this.state
    const newSaveObj = JSON.parse( JSON.stringify( saveObj ) );
    Object.keys( newSaveObj ).forEach( key => {
      const valiArr = ['image', 'score', 'sort']
      if ( !valiArr.includes( key ) ) {
        newSaveObj[key] = '';
      }
    } );
    this.setState( {
      awardMode: e.target.value,
      saveObj: newSaveObj
    } )
  }

  onItemChange = ( e, type ) => { // 塞入奖品项
    const { saveObj, addSub, awardMode } = this.state;
    const { prizeList } = this.props;
    // 对象复制
    const saveObjStr = JSON.stringify( saveObj );
    const newSaveObj = JSON.parse( saveObjStr );
    let param = {};
    let val = e && e.target ? e.target.value : e || '';
    if ( typeof val === 'object' ) {
      val = val.format( 'YYYY-MM-DD' )
    }

    if ( awardMode === 'RIGHT' ) {
      if ( type === 'relationPrizeType' ) {
        this.getVisibleGoodsList( val, saveObj.productType || '', '' );

        // delete newSaveObj.productType;
        delete newSaveObj.relationPrizeId;
        delete newSaveObj.inventory;
        this.setState( {
          predictInventory: 0,
          addSub: true,
        } );
      }

      if ( type === 'productType' ) {
        if ( !newSaveObj.relationPrizeType ) {
          message.error( '请选择商户!' );
          return;
        }
        this.getVisibleGoodsList( saveObj.relationPrizeType, val, '' );
        newSaveObj.prizeType = val;
        delete newSaveObj.relationPrizeId;
        delete newSaveObj.inventory;
        this.setState( {
          predictInventory: 0,
          addSub: true,
        } );
      }
    }

    if ( type === 'relationPrizeType' && awardMode === 'OPEN' ) {
      this.getPrizeList( '', val )
      delete newSaveObj.relationPrizeId
      delete newSaveObj.relationPrizeType
      delete newSaveObj.usrInventory
      delete newSaveObj.inventory;
    }
    if ( type === 'inventory' ) {
      if ( saveObj.inventory ) {
        val = saveObj.inventory;
      }
    }

    if ( type === 'relationPrizeId' ) {
      if ( !newSaveObj.relationPrizeType ) {
        message.error( '请选择奖品类型' )
        return
      }

      if ( !newSaveObj.relationPrizeType && awardMode === 'RIGHT' ) {
        message.error( '请选择商户' );
        return;
      }

      if ( !newSaveObj.productType && awardMode === 'RIGHT' ) {
        message.error( '请选择商品类型' );
        return;
      }

      if ( awardMode === 'OPEN' ) {
        param = prizeList.find( ( item ) => item.rightId === e )
        delete newSaveObj.inventory;
        this.setState( {
          predictInventory: 0,
          addSub: true,
        } );
      }
    }

    if ( type === 'changeInventory' ) {
      val = addSub ? Number( `+${val}` ) : Number( `-${val}` )
    }
    let obj = {}
    if ( param.prizeType ) {
      obj = { ...newSaveObj, [`${type}`]: val, prizeType: param.prizeType }
    } else {
      obj = { ...newSaveObj, [`${type}`]: val }
    }
    this.setState( {
      saveObj: obj,
    } )
  }

  getUnIssuedCnt = () => {
    // 获取剩余库存
    const { saveObj, awardMode } = this.state;
    const { prizeList, merchantVisibleList } = this.props;

    let param;
    if ( awardMode === 'OPEN' ) {
      param = prizeList.find( item => item.rightId === saveObj.relationPrizeId );
      return ( param && param.unIssuedCnt ) || 0;
    }

    if ( awardMode === 'RIGHT' && merchantVisibleList.length ) {
      merchantVisibleList.forEach( item => {
        if ( String( item.productId ) === saveObj.relationPrizeId ) {
          param = item.inventory;
        }
      } );
      return param || 0;
    }
    return param
  };

  // 切换加减
  addSubSwitch = () => {
    // 切换库存是增加还是减少
    const { saveObj, addSub, predictInventory } = this.state;
    const beforeInventory = saveObj && saveObj.inventory;
    let storeCount = this.getUnIssuedCnt();
    if ( saveObj.productType === 'RED' ) {
      storeCount = Math.floor( storeCount / saveObj.price );
    }
    saveObj.changeInventory = 0
    this.setState( {
      predictInventory: 0,
    } );

    // 如果输入框有值，则切换加减模式 清空输入框
    if ( predictInventory ) {
      this.setState( {
        addSub: !addSub,
      } );
      return;
    }
    if ( beforeInventory <= 0 || !beforeInventory ) {
      this.setState( {
        addSub: true,
      } );
      if ( addSub ) {
        message.warn( '库存已为0' );
      }
      return;
    }
    if ( predictInventory + beforeInventory >= storeCount && predictInventory + beforeInventory !== 0 ) {
      this.setState( {
        addSub: false,
      } );
      if ( !addSub ) {
        message.warn( '已达到最大库存' );
      }
    }
  };

  // 库存的增减校验
  validateCurrentInventory = ( e ) => {
    const { saveObj, addSub } = this.state
    const storeCount = this.getUnIssuedCnt();
    const changeVal = ( e && e.target ? e.target.value : e || '' ) * 1;
    if ( !changeVal ) return
    let addMaxCount = 0;
    let subMaxCount = 0;
    if ( saveObj && !saveObj.inventory ) {
      // 新增奖品
      addMaxCount = storeCount;
      subMaxCount = 0;
      if ( saveObj.productType === 'RED' ) {
        addMaxCount = Math.floor( storeCount / saveObj.price );
      }
    } else if ( saveObj.inventory ) {
      // 编辑已有奖品
      addMaxCount = storeCount - saveObj.inventory;
      subMaxCount = saveObj.inventory;
      if ( saveObj.productType === 'RED' ) {
        addMaxCount = Math.floor( storeCount / saveObj.price ) - saveObj.inventory;
      }
    }
    if ( saveObj.inventory && addSub ) {
      if ( changeVal > addMaxCount ) {
        message.error( '超出剩余库存量，请重新输入' );
        this.onItemChange( 0, 'changeInventory' )
      }
    }
    if ( saveObj.inventory && !addSub ) {
      if ( changeVal > subMaxCount ) {
        message.error( '剩余库存量小于0，请重新输入' );
        this.onItemChange( 0, 'changeInventory' )
        return
      }
    } else if ( !saveObj.inventory && addSub ) {
      if ( changeVal > addMaxCount ) {
        message.error( '超出剩余库存量，请重新输入' );
        this.onItemChange( 0, 'changeInventory' )
        return
      }
    }

    if ( addSub && changeVal === addMaxCount ) {
      this.setState( {
        predictInventory: 0,
        addSub: false,
      } );
      message.warn( '已达到最大库存' );
    } else if ( !addSub && changeVal === subMaxCount ) {
      this.setState( {
        predictInventory: 0,
        addSub: true,
      } );
      message.warn( '库存已为0' );
    }

  }

  render() {
    const { editList, saveObj, addSub, awardMode } = this.state
    const { prizeModalVisible, editPositionKey, prizeTypeList, prizeList, merchantList, merchantVisibleList } = this.props;
    const wordsToType = {
      COUPON: '虚拟卡券',
      GOODS: '实物',
      RED: '现金红包',
      PHONE: '直充',
      WX_COUPON: '微信立减金',
      WX_VOUCHER: '微信代金券',
      CUSTOM: '自定义商品',
    }
    let SelectOptions = null
    if ( prizeTypeList && prizeTypeList.length > 0 ) {
      SelectOptions = prizeTypeList.map( info => {
        return (
          <Option value={info.rightTypeId}>{info.rightTypeName}</Option>
        )
      } )
    }

    let prizeSelectOptions = null
    if ( prizeList && prizeList.length > 0 ) {
      prizeSelectOptions = prizeList.map( info => {
        return (
          <Option value={info.rightId}>{info.rightName}</Option>
        )
      } )
    }

    // 新模式商户列表
    const merchantSelectOption = merchantList && merchantList.map( ( info ) => {
      return (
        <Option value={String( info.code )} key={`${info.name}_${info.code}`}>
          {info.name}
        </Option>
      );
    } );

    // 新模式商品列表
    const goodsSelctOption = merchantVisibleList && merchantVisibleList.map( ( info ) => {
      return (
        <Option value={String( info.productId )} key={`${info.productName}_${info.productId}`}>
          {info.productName}
        </Option>
      );
    } );

    const newProductTypeOption = Object.keys( wordsToType ).map( key => {
      return (
        <Option value={key}>{wordsToType[key]}</Option>
      )
    } )

    const finalPrizeOption = awardMode === 'RIGHT' ? goodsSelctOption : prizeSelectOptions

    // 判断有无奖品id，无奖品id为谢谢参与类型
    const prizeIdList = []
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        prizeIdList.push( info.prizeId )
      } )
    }

    const modalFooter = {
      okText: '保存',
      onOk: this.onPrizeModalConfirm,
      onCancel: this.onPrizeModalCancel,
    };
    return (
      <div>
        <Modal
          maskClosable={false}
          title={`${editPositionKey ? '编辑' : '新增'}奖品`}
          width={840}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={prizeModalVisible}
          {...modalFooter}
        >
          <div>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>兑换所需积分</span>}
              {...this.formLayout}
            >
              <InputNumber
                value={saveObj.score}
                placeholder="请输入兑换该奖品所需的积分数量"
                min={0}
                style={{ width: '50%' }}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.onItemChange( e, 'score' )}
              />
            </FormItem>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>奖品次序</span>}
              {...this.formLayout}
            >
              <InputNumber
                value={saveObj.sort}
                placeholder="请输入兑换该奖品的排序值"
                min={0}
                style={{ width: '50%' }}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.onItemChange( e, 'sort' )}
              />
            </FormItem>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>兑换奖品图</span>}
              {...this.formLayout}
            >
              <div style={{ display: 'flex' }}>
                <UploadModal value={saveObj.image} onChange={( e ) => this.onItemChange( e, 'image' )} />
                <div
                  style={
                    {
                      width: '180px',
                      fontSize: 13,
                      color: '#999',
                      lineHeight: 2,
                      marginTop: 10,
                      marginLeft: 10,
                    }
                  }
                >
                  <div>格式：jpg/jpeg/png </div>
                  <div>180px*180px</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </div>
            </FormItem>
            <div style={{ marginLeft: 115, fontWeight: 'bold' }}>奖品设置</div>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>发奖模式
                </span>
              }
              {...this.formLayout}
            >
              <Radio.Group
                onChange={val => this.onModeChange( val )}
                disabled={!!editPositionKey}
                value={awardMode}
              >
                <Radio value="RIGHT">新模式</Radio>
                <Radio value="OPEN">旧模式</Radio>
              </Radio.Group>
            </FormItem>
            {
              awardMode === 'OPEN' &&
              <FormItem
                label={<span className={styles.labelText}><span>*</span>奖品类型</span>}
                {...this.formLayout}
              >
                <Select
                  style={{ width: '100%' }}
                  value={saveObj.relationPrizeType}
                  onChange={( e ) => this.onItemChange( e, 'relationPrizeType', true )}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  showSearch
                  filterOption={( input, option ) =>
                    option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                  }
                  disabled={!!editPositionKey}
                >
                  {SelectOptions}
                </Select>
              </FormItem>
            }
            {
              awardMode === 'RIGHT' &&
              <>
                <FormItem
                  label={
                    <span className={styles.labelText}>
                      <span>*</span>选择商户
                    </span>
                  }
                  {...this.formLayout}
                >
                  <Select
                    value={saveObj.relationPrizeType}
                    style={{ width: '100%' }}
                    onChange={e => this.onItemChange( e, 'relationPrizeType', true )}
                    showSearch
                    filterOption={( input, option ) =>
                      option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                    }
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    disabled={!!editPositionKey}
                  >
                    {merchantSelectOption}
                  </Select>
                </FormItem>
                <FormItem
                  label={
                    <span className={styles.labelText}>
                      <span>*</span>商品类型
                    </span>
                  }
                  {...this.formLayout}
                >
                  <Select
                    value={saveObj.productType}
                    style={{ width: '100%' }}
                    onChange={e => this.onItemChange( e, 'productType', true )}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    disabled={!!editPositionKey}
                  >
                    {newProductTypeOption}
                  </Select>
                </FormItem>
              </>
            }
            <FormItem
              label={<span className={styles.labelText}><span>*</span>选择奖品</span>}
              {...this.formLayout}
            >
              <Select
                style={{ width: '100%' }}
                value={saveObj.relationPrizeId}
                onChange={( e ) => this.onItemChange( e, 'relationPrizeId' )}
                showSearch
                filterOption={( input, option ) =>
                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                }
                getPopupContainer={triggerNode => triggerNode.parentNode}
                disabled={!!editPositionKey}
              >
                {finalPrizeOption}
              </Select>
            </FormItem>
            {
              awardMode === 'RIGHT' && saveObj.productType === 'WX_COUPON' &&
              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>满减设置
                  </span>
                }
                {...this.formLayout}
              >
                <div className={styles.money_minus}>
                  <span style={{ marginRight: 10 }}>满</span>
                  <InputNumber
                    placeholder="请输入满减金额"
                    min={saveObj.price ? add( saveObj.price, 0.01 ) : 1.01}
                    value={saveObj.minimum}
                    onChange={( e ) => this.onItemChange( e, 'minimum' )}
                    style={{ width: '30%', marginRight: 16 }}
                    formatter={value => limitDecimals( value, 'red' )}
                    parser={value => limitDecimals( value, 'red' )}
                  />

                  <span style={{ marginRight: 10 }}>减</span>
                  <InputNumber
                    placeholder="请输入减免金额"
                    min={1}
                    max={500}
                    value={saveObj.price}
                    onChange={( e ) => this.onItemChange( e, 'price' )}
                    style={{ width: '30%' }}
                    formatter={value => limitDecimals( value, 'red' )}
                    parser={value => limitDecimals( value, 'red' )}
                  />
                </div>
              </FormItem>
            }
            {awardMode === 'RIGHT' && saveObj.productType === 'RED' && (
              <>
                <FormItem
                  label={
                    <span className={styles.labelText}>
                      <span>*</span>红包金额
                    </span>
                  }
                  {...this.formLayout}
                >
                  <InputNumber
                    value={saveObj.price}
                    placeholder="请输入红包金额"
                    min={0.3}
                    style={{ width: '75%' }}
                    formatter={value => limitDecimals( value, 'red' )}
                    parser={value => limitDecimals( value, 'red' )}
                    onChange={e => this.onItemChange( e, 'price' )}
                  />
                  <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>元</span>
                </FormItem>
                <FormItem
                  label={
                    <span className={styles.labelText}>
                      <span>*</span>红包描述
                    </span>
                  }
                  {...this.formLayout}
                >
                  <Input
                    value={saveObj.description || ''}
                    style={{ width: '75%' }}
                    placeholder="请输入红包描述"
                    onChange={e => this.onItemChange( e, 'description' )}
                  />
                </FormItem>
              </>
            )}
            <FormItem
              label={<span className={styles.labelText}><span>*</span>奖品名称</span>}
              {...this.formLayout}
            >
              <Input
                value={saveObj.name}
                placeholder="请输入奖品名称"
                onChange={( e ) => this.onItemChange( e, 'name' )}
                maxLength={50}
              />
            </FormItem>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>活动库存
                </span>
              }
              {...this.formLayout}
            >
              <div className={styles.inventoryShow}>
                <p>
                  剩余库存
                  <Tooltip title={<span>当前奖品剩余库存（非实时更新）</span>}>
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                  &nbsp;: {saveObj.inventory || 0}
                </p>
                <p>
                  活动库存
                  <Tooltip title={<span>当期奖品总库存，活动库存=已用库存+剩余库存</span>}>
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                  &nbsp;:{( saveObj.inventory || 0 ) + ( saveObj.sendCount || 0 )}
                </p>
                <p>
                  可用{saveObj.productType === 'RED' ? '资金' : '库存'}
                  <Tooltip title={<span>取自权益商超（非实时更新）</span>}>
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                  &nbsp;: {this.getUnIssuedCnt()}
                </p>
              </div>
              <div
                className={styles.addButton}
                style={{ backgroundColor: addSub ? 'rgba(16,171,105)' : 'rgba(255,0,0)' }}
                onClick={this.addSubSwitch}
              >
                {addSub ? '+加' : '-减'}
              </div>
              <InputNumber
                min={0}
                value={Math.abs( saveObj.changeInventory )}
                formatter={limitDecimals}
                parser={limitDecimals}
                onBlur={e => {
                  this.validateCurrentInventory( e );
                }}
                onChange={e => {
                  this.onItemChange( e, 'changeInventory' )
                  // this.onChangePredictInventory( e );
                }}
              />
              <span style={{ paddingLeft: '20px' }}>
                预计剩余库存：{( saveObj.inventory || 0 ) + ( saveObj.changeInventory || 0 )}
              </span>
            </FormItem>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>过期类型</span>}
              {...this.formLayout}
            >
              <Radio.Group
                onChange={( e ) => this.onItemChange( e, 'expireType' )}
                value={saveObj.expireType}
              >
                <Radio value='TIME'>失效时间</Radio>
                <Radio value='DAYS'>有效天数</Radio>
              </Radio.Group>
            </FormItem>
            {
              ( saveObj.expireType && saveObj.expireType === 'TIME' ) &&
              <FormItem
                label={<span className={styles.labelText}><span>*</span>失效时间</span>}
                {...this.formLayout}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder='请选择失效时间'
                  value={saveObj.expireTime ? moment( saveObj.expireTime, 'YYYY-MM-DD' ) : null}
                  onChange={( e ) => this.onItemChange( e, 'expireTime' )}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            }
            {
              saveObj.expireType && saveObj.expireType === 'DAYS' &&
              <FormItem
                label={<span className={styles.labelText}><span>*</span>有效天数</span>}
                {...this.formLayout}
              >
                <InputNumber
                  value={saveObj.expireDays}
                  placeholder="请输入有效天数"
                  min={0}
                  style={{ width: '100%' }}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={( e ) => this.onItemChange( e, 'expireDays' )}
                />
              </FormItem>
            }

            <FormItem label="单用户单奖品总中奖次数上限" {...this.formLayout1}>
              <InputNumber
                value={saveObj.userLimit}
                placeholder="请输入，不填则不限制"
                min={0}
                style={{ width: 240 }}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.onItemChange( e, 'userLimit' )}
              />
            </FormItem>

            <FormItem label="单用户单奖品单日中奖次数上限" {...this.formLayout1}>
              <InputNumber
                value={saveObj.userDayLimit}
                placeholder="请输入，不填则不限制"
                min={0}
                style={{ width: 240 }}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.onItemChange( e, 'userDayLimit' )}
              />
            </FormItem>

            <FormItem label="单奖品每日发放上限" {...this.formLayout1}>
              <InputNumber
                value={saveObj.daySendLimit}
                placeholder="请输入，不填则不限制"
                min={0}
                style={{ width: 240 }}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.onItemChange( e, 'daySendLimit' )}
              />
            </FormItem>
          </div>
        </Modal>
      </div>
    )
  }
}

export default EditPrizeModal;



/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-useless-escape */
/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Radio,
  Modal,
  Select,
  message,
  Icon,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './publicEditPrizeModal.less';

const FormItem = Form.Item;
const { Option } = Select;
// const { TextArea } = Input;
const limitDecimals = ( value, red ) => {
  // eslint-disable-next-line no-useless-escape
  let reg = /^(\-)*(\d+).*$/;
  if ( red === 'red' ) {
    reg = /^(\-)*(\d+)\.(\d\d).*$/;
  }
  if ( typeof value === 'string' ) {
    if ( red === 'red' ) return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2.$3' ) : '';
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : '';
  }
  if ( typeof value === 'number' ) {
    if ( red === 'red' ) return !isNaN( value ) ? String( value ).replace( reg, '$1$2.$3' ) : '';
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : '';
  }
  return '';
};

/**
 * TODO: 该奖品弹窗适用于所有不带奖项的组件(刮刮卡之类)
 * */

const keyVerification = ['image', 'relationPrizeType', 'relationPrizeId', 'name', 'expireType'];
const newModeVerification = [
  'relationPrizeType',
  'productType',
  'name',
  'relationPrizeId',
  'image',
];
const redTypeVerification = [
  'relationPrizeType',
  'productType',
  'price',
  'name',
  'image',
  'description',
  'expireType',
];

@connect( ( { bees } ) => ( {
  prizeTypeList: bees.prizeTypeList,
  prizeList: bees.prizeList,
  merchantList: bees.merchantList,
  merchantVisibleList: bees.merchantVisibleList,
} ) )
@Form.create()
class PublicEditPrizeModal extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
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
      optionPrizeType: '',
      awardMode: '', // 发奖模式value
      productType: '', // 新模式商品类型
      saveObj: {}, // 数据存放。最后提交保存
      predictInventory: 0, // 预计剩余库存
      predictInventory2: 0, // 预计剩余库存仅用于数据展示
      addSub: true, // 增加库存or减少库存
    };
  }

  componentWillMount() {
    this.initEditData();
  }

  componentDidMount() {
    this.getMerchantList();
  }

  // 模糊搜索奖品列表
  getPrizeList = ( rightName, relationPrizeType ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getPrizeList',
      payload: {
        rightName,
        rightType: relationPrizeType,
      },
    } );
  };

  // 获取商品列表
  getVisibleGoodsList = ( code, type, productName ) => {
    const { dispatch, merchantList } = this.props;
    let merchantId = '';
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
        if ( list.length > 0 )
          this.getVisibleGoodsList( list[0].relationPrizeType, list[0].productType, '' );
      },
    } );
  };

  // 判断对象是否为空
  onEmptyObject = obj => {
    if ( !obj ) {
      return true;
    }
    const arr = Object.keys( obj );
    if ( arr.length === 0 ) {
      return true;
    }
    return false;
  };

  // 初始化编辑数据
  initEditData = () => {
    const { eleObj = {}, editPositionKey, dataKey } = this.props;

    // 编辑数据处理
    const prizeList = isCollection
      ? eleObj.prizeList
      : isLucky
      ? eleObj.prize || {}
      : eleObj.prizes || [];

    let editList = [];
    if ( !isLucky ) {
      if ( prizeList.length > 0 && editPositionKey ) {
        editList = prizeList.filter( info => {
          return info.prizeVirtualId === editPositionKey;
        } );
      }
    }

    let optionPrizeType = 'PRIZE';
    let awardMode = 'RIGHT';
    if ( editList && editList.length > 0 ) {
        if ( dataKey === 'prize' ) {
        editList.forEach( info => {
          if ( info && ( info.expireDays || info.expireTime ) && !info.productType ) {
            awardMode = 'OPEN';
          } else {
            awardMode = 'RIGHT';
          }
        } );
      }
    }

    // 开奖(锦鲤)组件单独判断
    if ( isLucky && !this.onEmptyObject( prizeList ) ) {
      awardMode = prizeList.awardMode;
    }

    const prizeIdList = [];
    if ( !isLucky ) {
      if ( editList && editList.length > 0 ) {
        editList.forEach( info => {
          if ( info && info.relationPrizeId ) {
            prizeIdList.push( info.relationPrizeId );
          }
        } );
      }

      if ( editPositionKey && prizeIdList && !prizeIdList.length ) {
        optionPrizeType = 'THANKS';
      }
    }

    // 开奖(锦鲤)组件单独判断
    let needSaveObj = {};
    if ( isLucky ) needSaveObj = prizeList;
    if ( !isLucky ) needSaveObj = editList.length ? editList[0] : {};

    this.setState(
      {
        saveObj: needSaveObj,
        optionPrizeType,
        awardMode,
      },
      () => {
        if ( awardMode === 'OPEN' ) {
          this.getPrizeList( '', editList.length ? editList[0].relationPrizeType : '' );
        }
        if ( awardMode === 'RIGHT' ) {
          this.getMerchantList( '', editList );
        }
      }
    );
  };

  // 切换配置的奖品类型 / 发奖模式
  changePrizeType = ( e, type ) => {
    const { saveObj } = this.state;
    if ( type ) {
      const newSaveObj = JSON.parse( JSON.stringify( saveObj ) );
      Object.keys( newSaveObj ).forEach( key => {
        if ( key !== 'image' ) {
          newSaveObj[key] = '';
        }
      } );

      this.setState( {
        awardMode: e.target.value,
        saveObj: newSaveObj,
      } );
      return;
    }
    this.setState( {
      optionPrizeType: e.target.value,
      saveObj: {},
    } );
  };

  // 新模式修改商品类型
  changeGoodsType = value => {
    this.setState( {
      productType: value,
    } );
  };

  // 弹框保存操作
  onPrizeModalConfirm = () => {
    const { editPositionKey } = this.props;
    if ( editPositionKey ) {
      this.onEdit();
    } else if ( !editPositionKey ) {
      this.onAdd();
    }
  };

  // 新增
  onAdd = () => {
    if ( !this.onPrizeModalVerification() ) return;
    const { saveObj, awardMode } = this.state;
    const {
      domData = {},
      changeDomData,
      eleObj = {},
      onChangeVisible,
      isCollection,
      isLucky,
    } = this.props;
    const prizeList = isCollection
      ? eleObj.prizeList || []
      : isLucky
      ? eleObj.prize || []
      : eleObj.prizes || [];

    saveObj.awardMode = awardMode;
    const editObj = {
      ...saveObj,
      probability: 0,
      prizeVirtualId: Number(
        Math.random()
          .toString()
          .substr( 3, 12 ) + Date.now()
      ).toString( 36 ),
    };

    if ( prizeList.findIndex( item => item.probability1 || item.probability1 === 0 ) > -1 )
      editObj.probability1 = 0;
    if ( prizeList.findIndex( item => item.probability2 || item.probability2 === 0 ) > -1 )
      editObj.probability2 = 0;
    if ( prizeList.findIndex( item => item.probability3 || item.probability3 === 0 ) > -1 )
      editObj.probability3 = 0;
    if ( prizeList.findIndex( item => item.probability4 || item.probability4 === 0 ) > -1 )
      editObj.probability4 = 0;
    if ( prizeList.findIndex( item => item.probabilityL || item.probabilityL === 0 ) > -1 )
      editObj.probabilityL = 0;
    if ( prizeList.findIndex( item => item.probabilityL1 || item.probabilityL1 === 0 ) > -1 )
      editObj.probabilityL1 = 0;
    if ( prizeList.findIndex( item => item.probabilityL2 || item.probabilityL2 === 0 ) > -1 )
      editObj.probabilityL2 = 0;
    if ( prizeList.findIndex( item => item.probabilityL3 || item.probabilityL3 === 0 ) > -1 )
      editObj.probabilityL3 = 0;
    if ( prizeList.findIndex( item => item.probabilityL4 || item.probabilityL4 === 0 ) > -1 )
      editObj.probabilityL4 = 0;
    let newPrizeList = [];
    newPrizeList = [...prizeList, editObj];
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = isCollection
      ? Object.assign( eleObj, { prizeList: [...newPrizeList] } )
      : isLucky
      ? Object.assign( eleObj, { prize: saveObj } )
      : Object.assign( eleObj, { prizes: [...newPrizeList] } );

    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState(
      {
        saveObj: {},
        time: new Date(),
      },
      () => {
        onChangeVisible( false );
      }
    );
  };

  // 编辑
  onEdit = () => {
    if ( !this.onPrizeModalVerification() ) return;
    const { saveObj } = this.state;
    const {
      domData = {},
      changeDomData,
      eleObj = {},
      onChangeVisible,
      editPositionKey,
      isCollection,
      isLucky,
    } = this.props;
    // 整理数据
    const prizeList = isLucky
      ? [eleObj.prize]
      : isCollection
      ? [...eleObj.prizeList]
      : [...eleObj.prizes];
    let index = eleObj?.prizes?.findIndex( item => item.prizeVirtualId === editPositionKey );
    if ( isLucky ) index = 0;
    if ( isCollection )
      index = eleObj.prizeList.findIndex( item => item.prizeVirtualId === editPositionKey );

    prizeList.splice( index, 1, saveObj );

    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = isCollection
      ? Object.assign( eleObj, { prizeList: [...prizeList] } )
      : isLucky
      ? Object.assign( eleObj, { prize: saveObj } )
      : Object.assign( eleObj, { prizes: [...prizeList] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState(
      {
        saveObj: {},
        time: new Date(),
      },
      () => {
        onChangeVisible( false );
      }
    );
  };

  // 校验弹窗必填项
  onPrizeModalVerification = () => {
    let past = true;
    let verifyMoney = true;
    let redFlag = true;
    const { saveObj, optionPrizeType, awardMode } = this.state;
    if ( optionPrizeType === 'THANKS' ) {
      if ( !saveObj.image ) {
        past = false;
      }
      if ( !past ) {
        message.error( '还有未填的必填项！' );
      }
      return past;
    }
    // 新模式必填校验
    if ( awardMode === 'RIGHT' ) {
      if ( saveObj.productType !== 'RED' ) {
        newModeVerification.forEach( item => {
          if ( saveObj.productType !== 'COUPON' ) {
            if ( !saveObj.expireType ) past = false;
            if ( saveObj.expireType === 'TIME' && !saveObj.expireTime ) past = false;
            if ( saveObj.expireType === 'DAYS' && !saveObj.expireDays ) past = false;
          }

          if ( !saveObj[item] && item !== 'inventory' ) {
            past = false;
          }

          if ( item === 'inventory' && !saveObj[item] ) past = false;
        } );
      }

      if ( saveObj.productType === 'RED' ) {
        redTypeVerification.forEach( item => {
          if ( !saveObj[item] || !saveObj.expireType ) {
            past = false;
          }

          if ( saveObj.price * saveObj.inventory > this.getUnIssuedCnt() ) {
            verifyMoney = false;
          }

          if ( parseFloat( saveObj.price ) < 0.3 ) {
            redFlag = false;
          }
          if ( item === 'inventory' && !saveObj[item] ) past = false;
        } );
      }
    }

    // 旧模式必填校验
    if ( awardMode === 'OPEN' ) {
      keyVerification.forEach( item => {
        if ( !saveObj[item] && item !== 'inventory' ) {
          past = false;
          if (
            ( item === 'inventory' && saveObj[item] === undefined ) ||
            saveObj[item] === null ||
            saveObj[item] === ''
          )
            past = false;
        } else if ( !saveObj[item] && item === 'image' ) {
          past = false;
        }
      } );
    }

    if ( !past ) {
      message.error( '还有未填的必填项！' );
    }

    if ( !verifyMoney ) {
      past = false;
      message.error( '红包金额 * 活动库存应小于可用资金！' );
    }

    if ( !redFlag ) {
      past = false;
      message.error( '最小红包金额为0.3！' );
    }
    return past;
  };

  // 弹框关闭操作
  onPrizeModalCancel = () => {
    const { onChangeVisible } = this.props;
    onChangeVisible( false );
  };

  // 搜索奖品
  onPrizeSearch = ( e, relationPrizeType, type ) => {
    const { awardMode, productType } = this.state;
    if ( type === 'goods' && !relationPrizeType ) {
      message.error( '请先选择商户' );
      return;
    }
    if ( awardMode === 'OPEN' && !type && !relationPrizeType ) {
      message.error( '请先选择奖品类型' );
      return;
    }
    if ( e ) {
      setTimeout( () => {
        if ( awardMode === 'OPEN' ) {
          this.getPrizeList( e, relationPrizeType );
        } else {
          if ( type === 'goods' ) {
            this.getVisibleGoodsList( relationPrizeType, productType, e );
          }
          if ( type === 'merchant' ) {
            this.getMerchantList( e );
          }
        }
      }, 600 );
    }
  };

  // 奖品选择回调
  onPrizeSelect = ( value, type ) => {
    const { awardMode, saveObj } = this.state;
    const { relationPrizeType } = saveObj;
    if ( awardMode === 'OPEN' ) {
      this.getPrizeList( '', relationPrizeType );
    } else {
      if ( type === 'merchant' ) {
        this.getVisibleGoodsList( value, '', '' );
      }
      if ( type === 'productType' ) {
        this.getVisibleGoodsList( saveObj.relationPrizeType, value, '' );
      }
    }
  };

  onItemChange = ( e, type ) => {
    // 塞入奖品项
    const { saveObj, awardMode, addSub } = this.state;
    const { prizeList } = this.props;
    // 对象复制
    const saveObjStr = JSON.stringify( saveObj );
    const newSaveObj = JSON.parse( saveObjStr );
    let param = {};
    let val = e && e.target ? e.target.value : e || '';
    if ( typeof val === 'object' ) {
      val = val.format( 'YYYY-MM-DD' );
    }

    if ( awardMode === 'RIGHT' ) {
      if ( type === 'relationPrizeType' ) {
        this.getVisibleGoodsList( val, '', '' );
        delete newSaveObj.productType;
        delete newSaveObj.relationPrizeId;
        delete newSaveObj.inventory;
        this.setState( {
          predictInventory: 0,
          predictInventory2: 0,
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
          predictInventory2: 0,
          addSub: true,
        } );
      }
    }

    if ( type === 'relationPrizeType' && awardMode === 'OPEN' ) {
      this.getPrizeList( '', val );
      delete newSaveObj.relationPrizeId;
      delete newSaveObj.relationPrizeType;
      delete newSaveObj.usrInventory;
    }

    if ( type === 'relationPrizeId' ) {
      if ( !newSaveObj.relationPrizeType && awardMode === 'OPEN' ) {
        message.error( '请选择奖品类型' );
        return;
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
        param = prizeList.find( i => i.rightId === e ) || {};
      }
      delete newSaveObj.inventory;
      this.setState( {
        predictInventory: 0,
        predictInventory2: 0,
        addSub: true,
      } );
    }
    if ( type === 'inventory' ) {
      if ( saveObj.inventory ) {
        if ( addSub ) {
          val += saveObj.inventory;
        } else {
          val = saveObj.inventory - val;
        }
      }
    }

    let obj = {};
    if ( param.prizeType ) {
      obj = { ...newSaveObj, [`${type}`]: val, prizeType: param.prizeType || '' };
    } else {
      obj = { ...newSaveObj, [`${type}`]: val };
    }
    this.setState( {
      saveObj: obj,
    } );
  };

  getUnIssuedCnt = () => {
    // 获取剩余库存
    const { saveObj, awardMode } = this.state;
    const { prizeList, merchantVisibleList } = this.props;

    let param;
    if ( awardMode === 'OPEN' ) {
      param = prizeList.find( item => item.rightId === saveObj.relationPrizeId );
      return ( param && param.unIssuedCnt ) || 0;
    }

    if ( awardMode === 'RIGHT' ) {
      merchantVisibleList &&
        merchantVisibleList.map( item => {
          if ( String( item.productId ) === saveObj.relationPrizeId ) {
            param = item.inventory;
          }
        } );
      return param || 0;
    }
  };

  addSubSwitch = () => {
    // 切换库存是增加还是减少
    const { saveObj, addSub, predictInventory } = this.state;
    const beforeInventory = saveObj && saveObj.inventory;
    let storeCount = this.getUnIssuedCnt();
    if( saveObj.productType === 'RED' ){
      storeCount = Math.floor( storeCount / saveObj.price );
    }
    this.setState( {
      predictInventory: 0,
      predictInventory2: 0,
    } );

    // 如果输入框有值，则切换加减模式 清空输入框
    if( predictInventory ){
      this.setState( {
        addSub: !addSub,
      } );
      return;
    }
    if ( beforeInventory <= 0 || !beforeInventory ) {
      this.setState( {
        addSub: true,
      } );
      if( addSub ){
        message.warn( '库存已为0' );
      }
      return;
    }
    if ( predictInventory + beforeInventory >= storeCount && predictInventory + beforeInventory !== 0 ) {
      this.setState( {
        addSub: false,
      } );
      if( !addSub ){
        message.warn( '已达到最大库存' );
      }
      return;
    }
    this.setState( {
      addSub: !addSub,
    } );
  };

  onBlurPredictInventory = ( e ) => {
    // 修改预计剩余库存量为剩余库存量
    const storeCount = this.getUnIssuedCnt();
    const { addSub, saveObj } = this.state;
    const val = ( e && e.target ? e.target.value : e || '' ) * 1;
    if ( !val ) {
      this.setState( {
        predictInventory: 0,
      } );
      return;
    }
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
      if( saveObj.productType === 'RED' ) {
        addMaxCount = Math.floor( storeCount / saveObj.price ) - saveObj.inventory;
      }
    }
    if ( saveObj.inventory && addSub ) {
      if ( val > addMaxCount ) {
        message.error( '超出剩余库存量，请重新输入' );
        this.setState( {
          predictInventory: 0,
          predictInventory2: 0,
        } );
        return;
      }
    }
    if ( saveObj.inventory && !addSub ) {
      if ( val > subMaxCount ) {
        message.error( '剩余库存量小于0，请重新输入' );
        this.setState( {
          predictInventory: 0,
          predictInventory2: 0,
        } );
        return;
      }
    } else if ( !saveObj.inventory && addSub ) {
      if ( val > addMaxCount ) {
        message.error( '超出剩余库存量，请重新输入' );
        this.setState( {
          predictInventory: 0,
          predictInventory2: 0,
        } );
        return;
      }
    }
    this.onItemChange( val, 'inventory' );
    if ( addSub && val === addMaxCount ) {
      this.setState( {
        predictInventory: 0,
        addSub: false,
      } );
      message.warn( '已达到最大库存' );
    } else if ( !addSub && val === subMaxCount ) {
      this.setState( {
        predictInventory: 0,
        addSub: true,
      } );
      message.warn( '库存已为0' );
    }
    this.setState( {
      predictInventory2: 0,
    } );
  };

  onChangePredictInventory = e => {
    // 修改预计剩余库存量
    const val = ( e && e.target ? e.target.value : e || '' ) * 1;
    this.setState( {
      predictInventory: val,
      predictInventory2: val,
    } );
  };

  // 新模式新增奖品弹窗
  renderNewMode = () => {
    const {
      editList,
      saveObj,
      predictInventory,
      predictInventory2,
      addSub,
    } = this.state;
    const { inventory, sendCount } = saveObj;
    const { merchantList, merchantVisibleList } = this.props;

    // 商户权益列表（奖品列表）
    let goodsSelctOption = null;
    if ( merchantVisibleList && merchantVisibleList.length > 0 ) {
      goodsSelctOption = merchantVisibleList.map( ( info, index ) => {
        return (
          <Option value={String( info.productId )} key={`${info.productName}_${index}`}>
            {info.productName}
          </Option>
        );
      } );
    }

    // 商户列表数据
    let merchantSelectOption = null;
    if ( merchantList && merchantList.length > 0 ) {
      merchantSelectOption = merchantList.map( ( info, index ) => {
        return (
          <Option value={String( info.code )} key={`${info.name}_${index}`}>
            {info.name}
          </Option>
        );
      } );
    }

    // 判断有无奖品id，无奖品id为谢谢参与类型
    const prizeIdList = [];
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        prizeIdList.push( info.prizeId );
      } );
    }

    return (
      <div>
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
            style={{ width: '75%' }}
            onChange={e => this.onItemChange( e, 'relationPrizeType', true )}
            showSearch
            filterOption={false}
            onSearch={e => this.onPrizeSearch( e, saveObj.relationPrizeType, 'merchant' )}
            onSelect={value => this.onPrizeSelect( value, 'merchant' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
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
            style={{ width: '75%' }}
            onChange={e => this.onItemChange( e, 'productType', true )}
            onSelect={value => this.onPrizeSelect( value, 'productType' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="RED">红包</Option>
            <Option value="COUPON">虚拟卡券</Option>
            <Option value="GOODS">实物</Option>
            <Option value="PHONE">话费充值</Option>
            <Option value="CUSTOM">自定义商品</Option>
          </Select>
        </FormItem>

        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>选择奖品
            </span>
          }
          {...this.formLayout}
        >
          <Select
            value={saveObj.relationPrizeId}
            style={{ width: '75%' }}
            onChange={e => this.onItemChange( e, 'relationPrizeId' )}
            showSearch
            filterOption={false}
            onSearch={e => this.onPrizeSearch( e, saveObj.relationPrizeType, 'goods' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {goodsSelctOption}
          </Select>
        </FormItem>
        {saveObj.productType === 'RED' && (
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
                min={0}
                max={saveObj.price}
                style={{ width: '75%' }}
                precision={2}
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
          label={
            <span className={styles.labelText}>
              <span>*</span>奖品名称
            </span>
          }
          {...this.formLayout}
        >
          <Input
            value={saveObj.name}
            placeholder="请输入奖品名称"
            style={{ width: '75%' }}
            onChange={e => this.onItemChange( e, 'name' )}
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
              &nbsp;: {inventory || 0 }
            </p>
            <p>
              活动库存
              <Tooltip title={<span>当期奖品总库存，活动库存=已用库存+剩余库存</span>}>
                <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
              </Tooltip>
              &nbsp;: {( inventory || 0 ) + ( sendCount || 0 )}
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
            value={predictInventory}
            // max={this.getUnIssuedCnt() - saveObj.inventory ? saveObj.inventory : 0}
            formatter={limitDecimals}
            parser={limitDecimals}
            onBlur={e => {
              this.onBlurPredictInventory( e );
            }}
            onChange={e => {
              this.onChangePredictInventory( e );
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
        {/* <FormItem
          label={<span className={styles.labelText}><span>*</span>活动库存</span>}
          {...this.formLayout}
        >
          <InputNumber
            value={saveObj.inventory}
            placeholder="请输入活动库存"
            min={0}
            max={saveObj.productType === 'RED' ? Number.MAX_SAFE_INTEGER  : this.getUnIssuedCnt()}
            style={{ width: '75%' }}
            formatter={limitDecimals}
            parser={limitDecimals}
            onChange={( e ) => this.onItemChange( e, 'inventory' )}
          />
          <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>*可用{saveObj.productType === 'RED' ? '资金' : '库存'}：{this.getUnIssuedCnt()}</span>
        </FormItem> */}
        {saveObj.productType !== 'COUPON' && (
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>过期类型
              </span>
            }
            {...this.formLayout}
          >
            <Radio.Group
              onChange={e => this.onItemChange( e, 'expireType' )}
              value={saveObj.expireType}
            >
              <Radio value="TIME">失效时间</Radio>
              <Radio value="DAYS">有效天数</Radio>
            </Radio.Group>
          </FormItem>
        )}
        {saveObj.productType !== 'COUPON' && (
          <>
            {saveObj.expireType && saveObj.expireType === 'TIME' && (
              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>失效时间
                  </span>
                }
                {...this.formLayout}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择失效时间"
                  value={saveObj.expireTime ? moment( saveObj.expireTime, 'YYYY-MM-DD' ) : null}
                  onChange={e => this.onItemChange( e, 'expireTime' )}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            )}
            {saveObj.expireType && saveObj.expireType === 'DAYS' && (
              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>有效天数
                  </span>
                }
                {...this.formLayout}
              >
                <InputNumber
                  value={saveObj.expireDays}
                  placeholder="请输入有效天数"
                  min={0}
                  style={{ width: '100%' }}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.onItemChange( e, 'expireDays' )}
                />
              </FormItem>
            )}
          </>
        )}
      </div>
    );
  };

  // 旧模式新增奖品弹窗
  renderOldMode = () => {
    const {
      editList,
      optionPrizeType,
      saveObj,
      addSub,
      predictInventory,
      predictInventory2,
    } = this.state;
    const { inventory, sendCount } = saveObj;
    const { prizeTypeList, prizeList } = this.props;
    let SelectOptions = null;
    if ( prizeTypeList && prizeTypeList.length > 0 ) {
      SelectOptions = prizeTypeList.map( ( info, index ) => {
        return (
          <Option value={info.rightTypeId} key={`${info.rightTypeName}_${index}`}>
            {info.rightTypeName}
          </Option>
        );
      } );
    }

    let prizeSelectOptions = null;
    if ( prizeList && prizeList.length > 0 ) {
      prizeSelectOptions = prizeList.map( info => {
        return <Option value={info.rightId}>{info.rightName}</Option>;
      } );
    }

    // 判断有无奖品id，无奖品id为谢谢参与类型
    const prizeIdList = [];
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        prizeIdList.push( info.prizeId );
      } );
    }

    return (
      <div>
        {optionPrizeType === 'THANKS' && (
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>奖品名称
              </span>
            }
            {...this.formLayout}
          >
            <Input
              value={saveObj.name}
              placeholder="请输入奖品名称"
              onChange={e => this.onItemChange( e, 'name' )}
              maxLength={50}
            />
          </FormItem>
        )}

        {optionPrizeType === 'PRIZE' && (
          <div>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>奖品类型
                </span>
              }
              {...this.formLayout}
            >
              <Select
                style={{ width: '100%' }}
                value={saveObj.relationPrizeType}
                onChange={e => this.onItemChange( e, 'relationPrizeType', true )}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {SelectOptions}
              </Select>
            </FormItem>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>选择奖品
                </span>
              }
              {...this.formLayout}
            >
              <Select
                style={{ width: '100%' }}
                value={saveObj.relationPrizeId}
                onChange={e => this.onItemChange( e, 'relationPrizeId' )}
                showSearch
                filterOption={false}
                onSearch={e => this.onPrizeSearch( e, saveObj.relationPrizeType )}
                // onSelect={this.onPrizeSelect}
                getPopupContainer={triggerNode => triggerNode.parentNode}
              >
                {prizeSelectOptions}
              </Select>
            </FormItem>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>奖品名称
                </span>
              }
              {...this.formLayout}
            >
              <Input
                value={saveObj.name}
                placeholder="请输入奖品名称"
                onChange={e => this.onItemChange( e, 'name' )}
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
                  &nbsp;: {inventory || 0}
                </p>
                <p>
                  活动库存
                  <Tooltip title={<span>当期奖品总库存，活动库存=已用库存+剩余库存</span>}>
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                  &nbsp;: {( inventory || 0 ) + ( sendCount || 0 ) }
                </p>
                <p>
                  可用{saveObj.productType === 'RED' ? '资金' : '库存'}
                  <Tooltip title={<span>取自奖品管理（非实时更新）</span>}>
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
                value={predictInventory}
                // max={this.getUnIssuedCnt() - saveObj.inventory ? saveObj.inventory : 0}
                formatter={limitDecimals}
                parser={limitDecimals}
                onBlur={e => {
                  this.onBlurPredictInventory( e );
                }}
                onChange={e => {
                  this.onChangePredictInventory( e );
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
            {/* <FormItem
              label={<span className={styles.labelText}><span>*</span>活动库存</span>}
              {...this.formLayout}
            >
              <InputNumber
                value={saveObj.inventory}
                placeholder="请输入活动库存"
                min={0}
                max={this.getUnIssuedCnt()}
                style={{ width: '75%' }}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.onItemChange( e, 'inventory' )}
              />
              <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>*可用库存：{this.getUnIssuedCnt()}</span>
            </FormItem> */}
            <FormItem
              label={<span className={styles.labelText}>奖品高级配置</span>}
              {...this.formLayout}
            >
              <Input
                value={saveObj.prizeFilter}
                placeholder="请不要乱输入"
                onChange={e => this.onItemChange( e, 'prizeFilter' )}
              />
            </FormItem>

            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>过期类型
                </span>
              }
              {...this.formLayout}
            >
              <Radio.Group
                onChange={e => this.onItemChange( e, 'expireType' )}
                value={saveObj.expireType}
              >
                <Radio value="TIME">失效时间</Radio>
                <Radio value="DAYS">有效天数</Radio>
              </Radio.Group>
            </FormItem>
            {saveObj.expireType && saveObj.expireType === 'TIME' && (
              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>失效时间
                  </span>
                }
                {...this.formLayout}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择失效时间"
                  value={saveObj.expireTime ? moment( saveObj.expireTime, 'YYYY-MM-DD' ) : null}
                  onChange={e => this.onItemChange( e, 'expireTime' )}
                  format="YYYY-MM-DD"
                />
              </FormItem>
            )}
            {saveObj.expireType && saveObj.expireType === 'DAYS' && (
              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>有效天数
                  </span>
                }
                {...this.formLayout}
              >
                <InputNumber
                  value={saveObj.expireDays}
                  placeholder="请输入有效天数"
                  min={0}
                  style={{ width: '100%' }}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.onItemChange( e, 'expireDays' )}
                />
              </FormItem>
            )}
          </div>
        )}
      </div>
    );
  };

  render() {
    const { prizeModalVisible, editPositionKey, isLucky } = this.props;
    const { awardMode, optionPrizeType, saveObj } = this.state;

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
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={prizeModalVisible}
          {...modalFooter}
        >
          <div>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>中奖类型
                </span>
              }
              {...this.formLayout}
            >
              <Radio.Group
                onChange={e => this.changePrizeType( e )}
                disabled={!!editPositionKey}
                value={optionPrizeType}
              >
                <Radio value="PRIZE">奖品</Radio>
                <Radio value="THANKS" disabled={isLucky}>
                  谢谢参与
                </Radio>
              </Radio.Group>
            </FormItem>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>奖品图
                </span>
              }
              {...this.formLayout}
            >
              <div style={{ display: 'flex' }}>
                <UploadModal value={saveObj.image} onChange={e => this.onItemChange( e, 'image' )} />
                <div
                  style={{
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }}
                >
                  <div>格式：jpg/jpeg/png </div>
                  <div>180px*180px</div>
                  <div>图片大小建议不大于1M</div>
                </div>
              </div>
            </FormItem>
            {optionPrizeType === 'PRIZE' && (
              <>
                <FormItem
                  label={
                    <span className={styles.labelText}>
                      <span>*</span>发奖模式
                    </span>
                  }
                  {...this.formLayout}
                >
                  <Radio.Group
                    onChange={e => this.changePrizeType( e, 'mode' )}
                    disabled={!!editPositionKey}
                    value={awardMode}
                  >
                    <Radio value="RIGHT">新模式</Radio>
                    <Radio value="OPEN">旧模式</Radio>
                  </Radio.Group>
                </FormItem>
              </>
            )}
          </div>
          {awardMode === 'RIGHT' && optionPrizeType === 'PRIZE' && this.renderNewMode()}
          {awardMode === 'OPEN' && this.renderOldMode()}

          {optionPrizeType === 'PRIZE' && (
            <>
              <FormItem label="单用户单奖品总中奖次数上限" {...this.formLayout1}>
                <InputNumber
                  value={saveObj.userLimit}
                  placeholder="请输入，不填则不限制"
                  min={0}
                  style={{ width: 240 }}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.onItemChange( e, 'userLimit' )}
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
                  onChange={e => this.onItemChange( e, 'userDayLimit' )}
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
                  onChange={e => this.onItemChange( e, 'daySendLimit' )}
                />
              </FormItem>
            </>
          )}
        </Modal>
      </div>
    );
  }
}

export default PublicEditPrizeModal;

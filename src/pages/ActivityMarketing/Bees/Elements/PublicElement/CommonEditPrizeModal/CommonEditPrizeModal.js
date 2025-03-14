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
import { Form, Input, DatePicker, InputNumber, Empty, Radio, Modal, Checkbox, Button, Select, message, Tooltip, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './commonEditPrizeModal.less'

const FormItem = Form.Item;
const { Option } = Select;

const limitDecimals = ( value, red ) => {
  // eslint-disable-next-line no-useless-escape
  let reg = /^(\-)*(\d+).*$/
  if ( red === 'red' ) {
    reg = /^(\-)*(\d+)\.(\d\d).*$/
  }
  if ( typeof value === 'string' ) {
    if ( red === 'red' ) return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2.$3' ) : ''
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : ''
  } if ( typeof value === 'number' ) {
    if ( red === 'red' ) return !isNaN( value ) ? String( value ).replace( reg, '$1$2.$3' ) : ''
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : ''
  }
  return ''
};

/**
 * TODO: 该奖品弹窗适用于所有带奖项的组件(九宫格，大转盘之类)
 * */

const keyVerification = ['itemPosition', 'itemName', 'image']
const keyListVerification = ['relationPrizeType', 'relationPrizeId', 'name']
const newModeVerification = ['relationPrizeType', 'productType', 'name', 'relationPrizeId']
const redTypeVerification = ['relationPrizeType', 'productType', 'price', 'name', 'description', 'expireType']


@connect( ( { bees } ) => ( {
  prizeTypeList: bees.prizeTypeList,
  prizeList: bees.prizeList,
  merchantList: bees.merchantList,
  merchantVisibleList: bees.merchantVisibleList
} ) )
@Form.create()
class CommonEditPrizeModal extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  formLayoutCheckbox = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  formLayout1 = {
    labelCol: { span: 9 },
    wrapperCol: { span: 10 },
  };

  constructor( props ) {
    super( props );

    this.state = {
      editList: [],
      deleteIdList: [],
      addIdlist: [],
      optionPrizeType: '',
      addItem: {}, // 新增临时保存项
      prizeTypeList: props.prizeTypeList || [],
      awardMode: '', // 发奖模式value
      productType: '', // 新模式商品类型
      predictInventory: 0,  // 预计剩余库存
      predictInventory2: 0, // 预计剩余库存仅用于数据展示
      addSub: true,  // 增加库存or减少库存
    }
  }

  componentWillMount() {
    this.initEditData();
  }


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

  // 获取商品列表
  getVisibleGoodsList = ( code, type, productName ) => {
    const { dispatch, merchantList } = this.props;
    let merchantId = ''
    merchantList.forEach( item => {
      if ( item.code === code ) {
        merchantId = item.id
      }
    } )
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
  }


  // 获取商户列表
  getMerchantList = ( name ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getMerchantList',
      payload: {
        name
      }
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
        return info.itemPosition === editPositionKey
      } )
    }

    // 设置奖品的新旧模式类型
    let awardMode = 'RIGHT'
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        if ( info && ( info.expireDays || info.expireTime ) && !info.productType ) {
          info.awardMode = 'OPEN'
          awardMode = 'OPEN'
        } else {
          info.awardMode = 'RIGHT'
          awardMode = 'RIGHT'

        }
      } )
    }

    let optionPrizeType = 'PRIZE'
    const prizeIdList = []
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        if ( info && info.relationPrizeId ) {
          prizeIdList.push( info.relationPrizeId )
        }
      } )
    }
    if ( editPositionKey && prizeIdList && prizeIdList.length > 0 ) {
      optionPrizeType = 'PRIZE'
    } else if ( editPositionKey && prizeIdList && !prizeIdList.length ) {
      optionPrizeType = 'THANKS'
    }
    const typeList = [];
    if ( editList.length ) {
      editList.forEach( item => {
        if ( !typeList.includes( item.relationPrizeType ) ) {
          typeList.push( item.relationPrizeType )
        }
      } )
    }
    this.setState( {
      editList,
      optionPrizeType,
      awardMode
    }, () => {
      if ( typeList.length > 0 && awardMode === 'OPEN' ) {
        typeList.forEach( item => {
          this.getPrizeList( '', item )
        } )
      }
      if ( awardMode === 'RIGHT' ) {
        this.getMerchantList()
        if ( editList.length > 0 ) {
          editList.forEach( ( item ) => {
            this.getVisibleGoodsList( item.relationPrizeType, item.productType, '' )
          } )
        }
      }
    } )
  }

  // 切换配置的奖品类型 / 发奖模式
  changePrizeType = ( e, type ) => {
    const { editList } = this.state
    if ( type === 'mode' ) {
      const newEditList = [...editList]
      newEditList.map( item => {
        Object.keys( item ).forEach( ( key ) => {
          if ( key !== 'image' ) {
            item[key] = ''
          }
        } )
      } )
      this.setState( {
        awardMode: e.target.value,
        editList: newEditList
      }, () => {
        editList.forEach( item => {
          this.onDeletePrizeItem( item )
        } )
      } )
    } else {
      this.setState( {
        optionPrizeType: e.target.value,
      } )
    }


  }


  // 新模式修改商品类型
  changeGoodsType = ( value ) => {
    this.setState( {
      productType: value
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
    const { optionPrizeType, addItem, editList, awardMode } = this.state
    const { domData = {}, changeDomData, eleObj = {}, onChangeVisible } = this.props;
    const prizeList = eleObj.prizes ? eleObj.prizes : []
    let editObj = {}
    if ( prizeList && prizeList.length > 0 ) {
      // eslint-disable-next-line prefer-destructuring
      editObj = prizeList[0]
    }
    if ( optionPrizeType === 'THANKS' ) {
      // 没有奖品类型
      const prizeItem = {
        ...addItem,
        probability: 0,
        prizeVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
      }

      if ( editObj.probability1 || editObj.probability1 === 0 ) prizeItem.probability1 = 0
      if ( editObj.probability2 || editObj.probability2 === 0 ) prizeItem.probability2 = 0
      if ( editObj.probability3 || editObj.probability3 === 0 ) prizeItem.probability3 = 0
      if ( editObj.probability4 || editObj.probability4 === 0 ) prizeItem.probability4 = 0
      if ( editObj.probabilityL || editObj.probabilityL === 0 ) prizeItem.probabilityL = 0
      if ( editObj.probabilityL1 || editObj.probabilityL1 === 0 ) prizeItem.probabilityL1 = 0
      if ( editObj.probabilityL2 || editObj.probabilityL2 === 0 ) prizeItem.probabilityL2 = 0
      if ( editObj.probabilityL3 || editObj.probabilityL3 === 0 ) prizeItem.probabilityL3 = 0
      if ( editObj.probabilityL4 || editObj.probabilityL4 === 0 ) prizeItem.probabilityL4 = 0

      const newPrizeList = [...prizeList, prizeItem]
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
        editList: [],
        deleteIdList: [],
        addIdlist: [],
        time: new Date()
      }, () => {
        message.success( '保存成功' )
        onChangeVisible( false )
      } )
    } else if ( optionPrizeType === 'PRIZE' ) {
      const copyEditList = JSON.parse( JSON.stringify( editList ) )
      if ( awardMode ) {
        copyEditList.map( ( item ) => {
          item.awardMode = awardMode
        } )
      }

      // 类型为奖品的新增
      const newPrizeList = [...prizeList, ...copyEditList]
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
        editList: [],
        deleteIdList: [],
        time: new Date()
      }, () => {
        message.success( '保存成功' )
        onChangeVisible( false )
      } )
    }
  }

  // 编辑
  onEdit = () => {
    if ( !this.onPrizeModalVerification() ) return
    const { editList, deleteIdList, addIdlist } = this.state
    const { domData = {}, changeDomData, eleObj = {}, onChangeVisible } = this.props;
    // 整理数据
    const prizeList = eleObj.prizes ? eleObj.prizes : []
    let newPrizeList = prizeList

    // 整理编辑数据
    if ( editList && editList.length > 0 ) {
      editList.forEach( info => {
        newPrizeList = newPrizeList.map( item => {
          return info.prizeVirtualId === item.prizeVirtualId ? info : item
        } )
      } )
    }

    // 整理删除数据
    if ( deleteIdList && deleteIdList.length > 0 ) {
      deleteIdList.forEach( info => {
        newPrizeList = newPrizeList.filter( item => {
          return info !== item.prizeVirtualId
        } )
      } )
    }

    // 整理添加数据
    if ( addIdlist && addIdlist.length > 0 ) {
      addIdlist.forEach( info => {
        const peizeItem = editList.find( item => {
          return item.prizeVirtualId === info
        } )
        newPrizeList.push( peizeItem )
      } )
    }



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
      editList: [],
      deleteIdList: [],
      addIdlist: [],
      time: new Date()
    }, () => {
      message.success( '修改成功' )
      onChangeVisible( false )
    } )
  }

  // 校验弹窗必填项
  onPrizeModalVerification = () => {
    let past = true;
    let verifyMoney = true
    let redFlag = true
    const { optionPrizeType, editList, addItem, awardMode } = this.state;
    keyVerification.forEach( item => {
      if ( !( Object.keys( addItem ).length ? addItem || {} : editList[0] || {} )[item] ) {
        past = false
        message.error( '还有未填的必填项！' );
      }
    } )

    if ( !past ) return false
    if ( optionPrizeType === 'PRIZE' && !editList.length ) {
      past = false
      message.error( '至少需要有一个奖品～' );
    } else if ( optionPrizeType === 'PRIZE' && editList.length ) {
      editList.forEach( item => {
        keyListVerification.forEach( citem => {
          if ( item.productType !== 'COUPON' ) {
            if ( !item.expireType ) past = false
            if ( item.expireType === 'TIME' && !item.expireTime ) past = false
            if ( item.expireType === 'DAYS' && !item.expireDays ) past = false
          }
          if ( !item[citem] || ( typeof item[citem] === 'number' && item[citem] >= 0 ) ) past = false

        } )

        // 新模式必填校验
        if ( awardMode === 'RIGHT' ) {
          if ( item.productType !== 'RED' ) {
            newModeVerification.forEach( citem => {
              if ( item.productType !== 'COUPON' ) {
                if ( !item.expireType ) past = false
                if ( item.expireType === 'TIME' && !item.expireTime ) past = false
                if ( item.expireType === 'DAYS' && !item.expireDays ) past = false
              }
              if ( !item[citem] ) past = false
            } )
          }


          if ( item.productType === 'RED' ) {
            redTypeVerification.forEach( citem => {
              if ( !item[citem] ) past = false
            } )

            if ( item.price * item.inventory > item.usrInventory ) {
              verifyMoney = false
            }
            if ( parseFloat( item.price ) < 0.3 ) {
              redFlag = false
            }
          }
        }

        // 判断奖品库存
        if ( item.inventory === undefined || item.inventory === null || item.inventory === '' ) past = false

      } )

      if ( !past ) {
        message.error( '奖品中还有未填的必填项！' );
      }

      if ( !verifyMoney ) {
        past = false
        message.error( '红包金额 * 活动库存应小于可用资金！' );
      }

      if ( !redFlag ) {
        past = false
        message.error( '最小红包金额为0.3！' );
      }
    }
    return past;
  }

  // 弹框关闭操作
  onPrizeModalCancel = () => {
    const { onChangeVisible } = this.props
    onChangeVisible( false )
  }

  // 删除关联奖品
  onDeletePrizeItem = ( data ) => {
    const { editList, deleteIdList } = this.state
    const newDeleteIdList = deleteIdList
    const newEditList = editList.filter( info => {
      return info.prizeVirtualId !== data.prizeVirtualId
    } )
    newDeleteIdList.push( data.prizeVirtualId )
    this.setState( {
      editList: [...newEditList],
      deleteIdList: [...newDeleteIdList]
    } )
  }

  onChangeCheckbox = ( e, type ) => {
    const { editPositionKey } = this.props;
    const { editList } = this.state
    let value = ''
    if ( e && e.length > 0 ) {
      value = e.join( ',' )
    }
    if ( editPositionKey ) {
      // 编辑
      if ( editList && editList.length > 0 ) {
        const newPrizes = editList.map( info => {
          return {
            ...info,
            [type]: value
          }
        } )
        this.setState( {
          editList: [...newPrizes]
        } )
      }
    } else if ( !editPositionKey ) {
      // 新增
      const addItem = {
        ...this.state.addItem,
        [type]: value
      }
      this.setState( {
        addItem
      } )

      if ( editList && editList.length > 0 ) {
        const newPrizes = editList.map( info => {
          return {
            ...info,
            [type]: value
          }
        } )
        this.setState( {
          editList: [...newPrizes]
        } )
      }
    }
  }

  changeImage = ( e, type ) => {
    const { editPositionKey } = this.props;
    const { editList } = this.state
    if ( editPositionKey ) {
      let newPrizes = []
      if ( editList && editList.length > 0 ) {
        newPrizes = editList.map( info => {
          return {
            ...info,
            [type]: e
          }
        } )
      }
      this.setState( {
        editList: [...newPrizes]
      } )
    } else if ( !editPositionKey ) {
      const addItem = {
        ...this.state.addItem,
        [type]: e
      }
      this.setState( {
        addItem
      } )

      if ( editList && editList.length > 0 ) {
        const newPrizes = editList.map( info => {
          return {
            ...info,
            [type]: e
          }
        } )
        this.setState( {
          editList: [...newPrizes]
        } )
      }
    }
  }

  changeItemName = ( e, type ) => {
    const { editPositionKey } = this.props;
    const { editList } = this.state
    let val = ""
    if ( e ) {
      val = e.target.value
    }
    if ( editPositionKey ) {
      let newPrizes = []
      if ( editList && editList.length > 0 ) {
        newPrizes = editList.map( info => {
          return {
            ...info,
            [type]: val
          }
        } )
      }
      this.setState( {
        editList: [...newPrizes]
      } )
    } else if ( !editPositionKey ) {
      const addItem = {
        ...this.state.addItem,
        [type]: e.target.value
      }
      this.setState( {
        addItem
      } )

      if ( editList && editList.length > 0 ) {
        const newPrizes = editList.map( info => {
          return {
            ...info,
            [type]: val
          }
        } )
        this.setState( {
          editList: [...newPrizes]
        } )
      }
    }
  }

  changeThankText = ( e, type ) => {
    const { editPositionKey } = this.props;
    if ( editPositionKey ) {
      const { editList } = this.state
      let newPrizes = []
      if ( editList && editList.length > 0 ) {
        newPrizes = editList.map( info => {
          return {
            ...info,
            [type]: e.target.value
          }
        } )
      }
      this.setState( {
        editList: [...newPrizes]
      } )
    } else if ( !editPositionKey ) {
      const addItem = {
        ...this.state.addItem,
        [type]: e.target.value
      }
      this.setState( {
        addItem
      } )
    }
  }

  changeItemValue = ( e, type, data ) => {
    const { editList, awardMode, addSub } = this.state;
    const { prizeList } = this.props;
    let chooseItem = {};

    if ( type === 'relationPrizeId' && awardMode === 'OPEN' ) {
      chooseItem = prizeList.find( info => info.rightId === e ) || {};
    }


    const prizeItem = editList.find( info => {
      return info.prizeVirtualId === data.prizeVirtualId
    } )


    let newPrizeItem = ''
    let val = e && e.target ? e.target.value : e || '';
    const {  relationPrizeType } = data
    if ( type === 'inventory' ) {
      if( data.inventory ){
        if( addSub ){
          val = data.inventory + val*1
        }else{
          val = data.inventory - val*1;
        }
      }else{
         val *=1
      }
    }
    if ( awardMode === 'RIGHT' ) {
      newPrizeItem = { ...prizeItem, [type]: val }
      if ( type === 'relationPrizeType' ) {
        this.getVisibleGoodsList( val, '', '' )
        newPrizeItem.productType = ''
        newPrizeItem.relationPrizeId = ''
        newPrizeItem.inventory = 0;
        this.setState( {
          predictInventory: 0,
          predictInventory2: 0,
          addSub: true,
        } )
      }


      if ( type === 'productType' ) {
        if ( !newPrizeItem.relationPrizeType ) {
          message.error( '请选择商户!' )
          return
        }
        this.getVisibleGoodsList( relationPrizeType, val, '' )
        newPrizeItem.relationPrizeId = ''
        newPrizeItem.prizeType = val
        newPrizeItem.inventory = 0;
        this.setState( {
          predictInventory: 0,
          predictInventory2: 0,
          addSub: true,
        } )
      }

      if ( type === 'relationPrizeId' ) {
        if ( !newPrizeItem.relationPrizeType ) {
          message.error( '请选择商户!' )
          return
        }
        if ( !newPrizeItem.productType ) {
          message.error( '请选择商品类型!' )
          return
        }
      }
    }

    if ( awardMode === 'OPEN' ) {


      newPrizeItem = type === 'relationPrizeId' ? { ...prizeItem, [type]: e, prizeType: chooseItem.prizeType } : { ...prizeItem, [type]: val };
      if ( type === 'relationPrizeId' ) {
        if ( !newPrizeItem.relationPrizeType ) {
          message.error( '请选择奖品类型！' )
          return
        }
      }
    }

    const newEditList = editList.map( info => {
      return info.prizeVirtualId === data.prizeVirtualId ? newPrizeItem : info
    } )
    this.setState( {
      editList: [...newEditList]
    } )
  }


  changeItemPrizeType = ( e, type, data ) => {
    const { editList } = this.state


    const prizeItem = editList.find( info => {
      return info.prizeVirtualId === data.prizeVirtualId
    } )

    delete prizeItem.relationPrizeId;
    delete prizeItem.relationPrizeType;
    delete prizeItem.usrInventory;

    const newPrizeItem = { ...prizeItem, [type]: e };
    const newEditList = editList.map( info => {
      return info.prizeVirtualId === data.prizeVirtualId ? newPrizeItem : info
    } )

    this.setState( {
      editList: [...newEditList]
    }, () => {
      this.getPrizeList( '', e )
    } )
  }

  changeItemInputValue = ( e, type, data ) => {
    const val = e.target.value
    const { editList } = this.state
    const prizeItem = editList.find( info => {
      return info.prizeVirtualId === data.prizeVirtualId
    } )
    const newPrizeItem = { ...prizeItem, [type]: val }
    const newEditList = editList.map( info => {
      return info.prizeVirtualId === data.prizeVirtualId ? newPrizeItem : info
    } )

    this.setState( {
      editList: [...newEditList]
    } )
  }

  changeDate = ( e, type, data ) => {
    let val = ''
    if ( e ) {
      val = e.format( 'YYYY-MM-DD' )
    }
    const { editList } = this.state
    const prizeItem = editList.find( info => {
      return info.prizeVirtualId === data.prizeVirtualId
    } )
    const newPrizeItem = { ...prizeItem, [type]: val }
    const newEditList = editList.map( info => {
      return info.prizeVirtualId === data.prizeVirtualId ? newPrizeItem : info
    } )

    this.setState( {
      editList: [...newEditList]
    } )
  }

  // 新增关联奖品
  onAddPrizeItem = ( editObj ) => {
    const { editPositionKey, eleObj = {}, } = this.props
    const { editList, addIdlist, addItem } = this.state
    const prizeVirtualId = Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
    if ( editPositionKey ) {
      const obj = {
        itemPosition: editObj.itemPosition ? editObj.itemPosition : '',
        image: editObj.image ? editObj.image : '',
        itemName: editObj.itemName ? editObj.itemName : '',
        prizeVirtualId,
        probability: 0
      }
      // 塞入概率逻辑
      if ( editObj.probability1 || editObj.probability1 === 0 ) obj.probability1 = 0
      if ( editObj.probability2 || editObj.probability2 === 0 ) obj.probability2 = 0
      if ( editObj.probability3 || editObj.probability3 === 0 ) obj.probability3 = 0
      if ( editObj.probability4 || editObj.probability4 === 0 ) obj.probability4 = 0
      if ( editObj.probabilityL || editObj.probabilityL === 0 ) obj.probabilityL = 0
      if ( editObj.probabilityL1 || editObj.probabilityL1 === 0 ) obj.probabilityL1 = 0
      if ( editObj.probabilityL2 || editObj.probabilityL2 === 0 ) obj.probabilityL2 = 0
      if ( editObj.probabilityL3 || editObj.probabilityL3 === 0 ) obj.probabilityL3 = 0
      if ( editObj.probabilityL4 || editObj.probabilityL4 === 0 ) obj.probabilityL4 = 0
      const newEditList = [
        ...editList,
        obj
      ]
      const newAddIdlist = [...addIdlist, prizeVirtualId]
      this.setState( {
        editList: [...newEditList],
        addIdlist: [...newAddIdlist],
      } )
    } else if ( !editPositionKey ) {
      const obj = {
        ...addItem,
        prizeVirtualId,
        probability: 0
      }

      const prizeList = eleObj.prizes ? eleObj.prizes : []
      let editItem = {}
      if ( prizeList && prizeList.length > 0 ) {
        // eslint-disable-next-line prefer-destructuring
        editItem = prizeList[0]
      }
      // 塞入概率逻辑
      if ( editItem.probability1 || editItem.probability1 === 0 ) obj.probability1 = 0
      if ( editItem.probability2 || editItem.probability2 === 0 ) obj.probability2 = 0
      if ( editItem.probability3 || editItem.probability3 === 0 ) obj.probability3 = 0
      if ( editItem.probability4 || editItem.probability4 === 0 ) obj.probability4 = 0
      if ( editItem.probabilityL || editItem.probabilityL === 0 ) obj.probabilityL = 0
      if ( editItem.probabilityL1 || editItem.probabilityL1 === 0 ) obj.probabilityL1 = 0
      if ( editItem.probabilityL2 || editItem.probabilityL2 === 0 ) obj.probabilityL2 = 0
      if ( editItem.probabilityL3 || editItem.probabilityL3 === 0 ) obj.probabilityL3 = 0
      if ( editItem.probabilityL4 || editItem.probabilityL4 === 0 ) obj.probabilityL4 = 0
      const newAddlist = [...editList, obj]
      this.setState( {
        editList: newAddlist
      } )
    }

  }

  // 搜索奖品
  onPrizeSearch = ( e, relationPrizeType, productType, type ) => {
    const { awardMode } = this.state
    if ( type === 'goods' && !relationPrizeType ) {
      message.error( '请先选择商户' )
      return
    }
    if ( awardMode === 'OPEN' && !type && !relationPrizeType ) {
      message.error( '请先选择奖品类型' )
      return;
    }
    if ( e ) {
      setTimeout( () => {
        if ( awardMode === 'OPEN' ) {
          this.getPrizeList( e, relationPrizeType )
        }
        if ( awardMode === 'RIGHT' ) {
          if ( type === 'goods' ) {
            this.getVisibleGoodsList( relationPrizeType, productType, e )
          }
          if ( type === 'merchant' ) {
            this.getMerchantList( e )
          }
        }
      }, 200 );
    }
  }

  // 选择奖品下拉回调
  onDropdownVisibleChange = ( e, info ) => {
    const { awardMode } = this.state
    if ( e ) {
      if ( awardMode === 'OPEN' ) {
        this.getPrizeList( '', info.relationPrizeType )
      }
      if ( awardMode === 'RIGHT' ) {
        this.getVisibleGoodsList( String( info.relationPrizeType ), info.productType, '' )
      }
    }
  }

  onPrizeSelect = ( value, info, type ) => {
    const { awardMode } = this.state
    const { relationPrizeType } = info
    if ( awardMode === 'OPEN' ) {
      this.getPrizeList()
    } else {
      if ( type === 'merchant' ) {
        this.getVisibleGoodsList( value, '', '' )
      }
      if ( type === 'productType' ) {
        this.getVisibleGoodsList( relationPrizeType, value, '' )

      }
    }
  }

  onSearch = ( val ) => {
    clearTimeout( this.timer );
    this.timer = setTimeout( () => {
      if ( val ) {
        const { prizeTypeList } = this.state;
        const arr = [];
        prizeTypeList.forEach( item => {
          if ( item.rightTypeName.indexOf( val ) > -1 ) {
            arr.push( item )
          }
        } )
        this.setState( {
          prizeTypeList: arr
        } )
      } else {
        const { prizeTypeList } = this.props;
        this.setState( {
          prizeTypeList
        } )
      }
    }, 600 );
  }

  addSubSwitch = ( config ) => {  // 切换库存是增加还是减少
    const { addSub, predictInventory } = this.state;
    const beforeInventory = config && config.inventory;
    let storeCount = config.usrInventory;
    if( config.productType === 'RED' ){
      storeCount = Math.floor( config.usrInventory / config.price );
    }
    this.setState( {
      predictInventory: 0,
      predictInventory2: 0,
    } )
    // 如果输入框有值，则切换加减模式 清空输入框
    if( predictInventory ){
      this.setState( {
        addSub: !addSub,
      } );
      return;
    }
    if( beforeInventory <= 0 || !beforeInventory ) {
      this.setState( {
        addSub: true,
      } )
      if( addSub ){
        message.warn( '库存已为0' );
      }
      return
    }
    if ( predictInventory + beforeInventory >= storeCount && predictInventory + beforeInventory !== 0 ){
      this.setState( {
        addSub: false,
      } )
      if( !addSub ){
        message.warn( '已达到最大库存' );
      }
      return
    }
    this.setState( {
      addSub: !addSub,
    } )
  }

  onBlurPredictInventory = ( e, config ) => { // 修改预计剩余库存量为剩余库存量
    if( !config ) return;
    const { addSub } = this.state
    const val = ( e && e.target ? e.target.value : e || '' ) * 1;
    if( !val ){
      this.setState( {
        predictInventory : 0,
      } )
      return
    }
    let addMaxCount = 0;
    let subMaxCount = 0;
    if( config && !config.inventory ){ // 新增奖品
      addMaxCount = config.usrInventory
      subMaxCount = 0
      if( config.productType === "RED" ) {
        addMaxCount = Math.floor( config.usrInventory / config.price );
      }
    }else if( config.inventory ) { // 编辑已有奖品
      addMaxCount = config.usrInventory - config.inventory
      subMaxCount = config.inventory
      if( config.productType === "RED" ) {
        addMaxCount = Math.floor( config.usrInventory / config.price ) - config.inventory
      }
    }
    if( config.inventory && addSub ) {
      if( val > addMaxCount ) {
        message.error( "超出剩余库存量，请重新输入" )
        this.setState( {
          predictInventory : 0,
          predictInventory2: 0
        } )
        return
      }
    }
    if( config.inventory && !addSub ) {
      if( val > subMaxCount ) {
        message.error( "剩余库存量小于0，请重新输入" )
        this.setState( {
          predictInventory : 0,
          predictInventory2: 0
        } )
        return

      }
    }else if( !config.inventory && addSub ){
      if( val > addMaxCount ) {
        message.error( "超出剩余库存量，请重新输入" )
        this.setState( {
          predictInventory : 0,
          predictInventory2: 0
        } )
        return
      }
    }
    this.changeItemValue( e, 'inventory', config )
    if ( addSub && val === addMaxCount ){
      this.setState( {
        predictInventory : 0,
        addSub: false,
      } )
      message.warn( '已达到最大库存' );
    }else if( !addSub && val === subMaxCount ){
      this.setState( {
        predictInventory : 0,
        addSub: true,
      } )
      message.warn( '库存已为0' );
    }
    this.setState( {
      predictInventory2 : 0,
    } )

  }

  onChangePredictInventory = ( e ) => { // 修改预计剩余库存量
    const val = ( e && e.target ? e.target.value : e || '' ) * 1;
    this.setState( {
      predictInventory: val,
      predictInventory2: val
    } )
  }

  // 关联奖品
  renderAssociatePrize = ( editList ) => {
    const { prizeTypeList, awardMode,  predictInventory, predictInventory2, addSub, } = this.state;
    const { prizeList, merchantVisibleList, merchantList } = this.props;
    let SelectOptions = null
    if ( prizeTypeList && prizeTypeList.length > 0 ) {
      SelectOptions = prizeTypeList.map( info => {
        return (
          <Option value={info.rightTypeId} key={info.rightTypeId}>{info.rightTypeName}</Option>
        )
      } )
    }

    let prizeSelectOptions = null
    if ( prizeList && prizeList.length > 0 ) {
      prizeSelectOptions = prizeList.map( info => {
        return (
          <Option value={info.rightId} key={info.rightId}>{info.rightName}</Option>
        )
      } )
    }

    // 商户权益列表（奖品列表）
    let goodsSelctOption = null
    if ( merchantVisibleList && merchantVisibleList.length > 0 ) {

      goodsSelctOption = [...new Set( merchantVisibleList )].map( ( info, index ) => {
        return (
          <Option value={String( info.productId )} key={`${info.productName}_${index}`} title={info.productName}> {info.productName}</Option>
        )
      } )
    }

    // 商户列表数据
    let merchantSelectOption = null
    if ( merchantList && merchantList.length > 0 ) {
      merchantSelectOption = merchantList.map( ( info, index ) => {
        return (
          <Option value={String( info.code )} key={`${info.name}_${index}`}>{info.name}</Option>
        )
      } )
    }

    let prizeItem = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无奖品，请去添加奖品" />
    if ( editList && editList.length > 0 ) {
      prizeItem = editList.map( ( info, index ) => {
        const choosePrizeObj = prizeList.find( item => ( item.rightId === info.relationPrizeId ) )

        const newChoosePrizeObj = merchantVisibleList && merchantVisibleList.find( item => {
          if ( String( item.productId ) === info.relationPrizeId && String( item.merchantCode ) === info.relationPrizeType ) {
            return item
          }
        } )

        if ( awardMode === 'OPEN' ) {
          info.usrInventory = ( choosePrizeObj && choosePrizeObj.unIssuedCnt ) ? choosePrizeObj.unIssuedCnt : ( info.usrInventory || 0 )
        }

        if ( awardMode === 'RIGHT' ) {
          info.usrInventory = ( newChoosePrizeObj && newChoosePrizeObj.inventory ) ? newChoosePrizeObj.inventory : ( info.usrInventory || 0 )
          if ( info.productType === 'RED' ) {
            info.price = ( newChoosePrizeObj && newChoosePrizeObj.price ) ? newChoosePrizeObj.price : ( info.price || '' )
          }
        }

        return (
          <FormItem label={`关联奖品${index + 1}`} {...this.formLayoutCheckbox}>
            <div style={{
              display: 'flex',
              border: '1px solid #eee',
              padding: '20px',
              borderRadius: '5px',
              background: '#f9f9f9',
              marginRight: '30px'
            }}
            >
              <div
                style={{
                  flex: '1'
                }}
              >
                {
                  awardMode === 'RIGHT' &&
                  <>
                    <FormItem
                      label={<span className={styles.labelText}><span>*</span>选择商户</span>}
                      {...this.formLayout}
                    >
                      <Select
                        value={info.relationPrizeType}
                        style={{ width: '100%' }}
                        onChange={( e ) => this.changeItemValue( e, 'relationPrizeType', info )}
                        showSearch
                        filterOption={false}
                        onSearch={( e ) => this.onPrizeSearch( e, info.relationPrizeType, info.productType, 'merchant' )}
                        onSelect={( value ) => this.onPrizeSelect( value, info, 'merchant' )}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        {merchantSelectOption}
                      </Select>
                    </FormItem>
                    <FormItem
                      label={<span className={styles.labelText}><span>*</span>商品类型</span>}
                      {...this.formLayout}
                    >
                      <Select
                        value={info.productType}
                        style={{ width: '100%' }}
                        onChange={( e ) => this.changeItemValue( e, 'productType', info )}
                        onSelect={( value ) => this.onPrizeSelect( value, info, 'productType' )}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                        <Option value='RED'>红包</Option>
                        <Option value='COUPON'>虚拟卡券</Option>
                        <Option value='GOODS'>实物</Option>
                        <Option value='PHONE'>话费充值</Option>
                        <Option value='CUSTOM'>自定义商品</Option>
                      </Select>
                    </FormItem>
                  </>
                }
                {
                  awardMode === 'OPEN' &&
                  <>
                    <FormItem
                      label={<span className={styles.labelText}><span>*</span>奖品类型</span>}
                      {...this.formLayout}
                    >
                      <Select
                        style={{ width: '100%' }}
                        value={info.relationPrizeType}
                        onChange={( e ) => this.changeItemPrizeType( e, 'relationPrizeType', info )}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        filterOption={false}
                      >
                        {SelectOptions}
                      </Select>
                    </FormItem>
                  </>
                }

                <FormItem
                  label={<span className={styles.labelText}><span>*</span>选择奖品</span>}
                  {...this.formLayout}
                >

                  <Select
                    value={info.relationPrizeId}
                    style={{ width: '100%' }}
                    onChange={( e ) => this.changeItemValue( e, 'relationPrizeId', info )}
                    showSearch
                    filterOption={false}
                    onSearch={( e ) => {
                      if ( awardMode === 'RIGHT' ) {
                        this.onPrizeSearch( e, info.relationPrizeType, info.productType, 'goods' )
                      }
                      if ( awardMode === 'OPEN' ) {
                        this.onPrizeSearch( e, info.relationPrizeType )
                      }
                    }}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {awardMode === 'RIGHT' ? goodsSelctOption : prizeSelectOptions}
                  </Select>
                </FormItem>
                {
                  info.productType === 'RED' &&
                  <>
                    <FormItem
                      label={<span className={styles.labelText}><span>*</span>红包金额</span>}
                      {...this.formLayout}
                    >
                      <InputNumber
                        value={info.price}
                        placeholder="请输入红包金额"
                        min={0}
                        max={info.price}
                        style={{ width: '75%' }}
                        // step={0.01}
                        formatter={( value ) => limitDecimals( value, 'red' )}
                        parser={( value ) => limitDecimals( value, 'red' )}
                        onChange={( e ) => this.changeItemValue( e, 'price', info )}
                      />
                      <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>元</span>
                    </FormItem>
                    <FormItem
                      label={<span className={styles.labelText}><span>*</span>红包描述</span>}
                      {...this.formLayout}
                    >
                      <Input
                        value={info.description || ''}
                        style={{ width: '75%' }}
                        placeholder="请输入红包描述"
                        onChange={( e ) => this.changeItemValue( e, 'description', info )}
                      />
                    </FormItem>
                  </>
                }
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>奖品名称</span>}
                  {...this.formLayout}
                >
                  <Input
                    value={info.name}
                    placeholder="请输入奖品名称"
                    onChange={( e ) => this.changeItemInputValue( e, 'name', info )}
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
                        &nbsp;: {info.inventory || 0}
                    </p>
                    <p>
                      活动库存
                      <Tooltip title={<span>当期奖品总库存，活动库存=已用库存+剩余库存</span>}>
                        <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                      </Tooltip>
                         &nbsp;: {( info.inventory || 0 ) + ( info.sendCount || 0 )}
                    </p>
                    <p>
                      可用{info.productType === 'RED' ? '资金' : '库存'}
                      <Tooltip title={<span>取自{awardMode === "RIGHT" ? '权益商超' : '奖品管理' }（非实时更新）</span>}>
                        <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                      </Tooltip>
                        &nbsp;: {info.usrInventory || 0 }
                    </p>
                  </div>
                  <div
                    className={styles.addButton}
                    style={{ backgroundColor: addSub ? 'rgba(16,171,105)' : 'rgba(255,0,0)' }}
                    onClick={( )=>{this.addSubSwitch( info )}}
                  >
                    {addSub ? '+加' : '-减'}
                  </div>
                  <InputNumber
                    min={0}
                    value={predictInventory}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    onBlur={e => {this.onBlurPredictInventory( e, info )}}
                    onChange={e => {this.onChangePredictInventory( e )}}
                  />
                  {addSub ? (
                    <span style={{ paddingLeft: '20px' }}>
                      预计剩余库存：{( info.inventory || 0 ) + predictInventory2}
                    </span>
                  ) : (
                    <span style={{ paddingLeft: '20px' }}>
                      预计剩余库存：
                      {( info.inventory || 0 ) - predictInventory2 > 0 ? ( info.inventory || 0 ) - predictInventory2 : 0}
                    </span>
                  )}
                </FormItem>
                {/* <FormItem
                  label={<span className={styles.labelText}><span>*</span>活动库存</span>}
                  {...this.formLayout}
                >
                  <InputNumber
                    value={info.inventory}
                    placeholder="请输入活动库存"
                    min={0}
                    max={info.productType === 'RED' ? Number.MAX_SAFE_INTEGER : info.usrInventory}
                    style={{ width: '50%' }}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    onChange={( e ) => this.changeItemValue( e, 'inventory', info )}
                  />
                  <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>*可用{info.productType === 'RED' ? '资金' : '库存'}：{info.usrInventory}</span>
                </FormItem> */}
                {
                  awardMode === 'OPEN' &&
                  <FormItem
                    label={<span className={styles.labelText}>奖品高级配置</span>}
                    {...this.formLayout}
                  >
                    <Input
                      value={info.prizeFilter}
                      placeholder="请不要乱输入"
                      onChange={( e ) => this.changeItemInputValue( e, 'prizeFilter', info )}
                    />
                  </FormItem>
                }

                {
                  info.productType !== 'COUPON' &&
                  <FormItem
                    label={<span className={styles.labelText}><span>*</span>过期类型</span>}
                    {...this.formLayout}
                  >
                    <Radio.Group
                      onChange={( e ) => this.changeItemInputValue( e, 'expireType', info )}
                      value={info.expireType}
                    >
                      <Radio value='TIME'>失效时间</Radio>
                      <Radio value='DAYS'>有效天数</Radio>
                    </Radio.Group>
                  </FormItem>
                }

                {( info.expireType && info.expireType === 'TIME' ) &&
                  <FormItem
                    label={<span className={styles.labelText}><span>*</span>失效时间</span>}
                    {...this.formLayout}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder='请选择失效时间'
                      value={info.expireTime ? moment( info.expireTime, 'YYYY-MM-DD' ) : null}
                      onChange={( e ) => this.changeDate( e, 'expireTime', info )}
                      format="YYYY-MM-DD"
                    />
                  </FormItem>
                }
                {info.expireType && info.expireType === 'DAYS' &&
                  <FormItem
                    label={<span className={styles.labelText}><span>*</span>有效天数</span>}
                    {...this.formLayout}
                  >
                    <InputNumber
                      value={info.expireDays}
                      placeholder="请输入有效天数"
                      min={0}
                      style={{ width: '100%' }}
                      formatter={limitDecimals}
                      parser={limitDecimals}
                      onChange={( e ) => this.changeItemValue( e, 'expireDays', info )}
                    />
                  </FormItem>
                }
                <FormItem label="单用户单奖品总中奖次数上限" {...this.formLayout1}>
                  <InputNumber
                    value={info.userLimit}
                    placeholder="请输入，不填则不限制"
                    min={0}
                    style={{ width: 240 }}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    onChange={( e ) => this.changeItemValue( e, 'userLimit', info )}
                  />
                </FormItem>

                <FormItem label="单用户单奖品单日中奖次数上限" {...this.formLayout1}>
                  <InputNumber
                    value={info.userDayLimit}
                    placeholder="请输入，不填则不限制"
                    min={0}
                    style={{ width: 240 }}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    onChange={( e ) => this.changeItemValue( e, 'userDayLimit', info )}
                  />
                </FormItem>

                <FormItem label="单奖品每日发放上限" {...this.formLayout1}>
                  <InputNumber
                    value={info.daySendLimit}
                    placeholder="请输入，不填则不限制"
                    min={0}
                    style={{ width: 240 }}
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    onChange={( e ) => this.changeItemValue( e, 'daySendLimit', info )}
                  />
                </FormItem>
              </div>
              <div style={{ color: '#f5222d', cursor: 'pointer' }} onClick={() => { this.onDeletePrizeItem( info ) }}>
                删除
              </div>
            </div>
          </FormItem>
        )
      } )
    }

    return (
      <div>
        {prizeItem}
      </div>
    )

  }

  render() {
    const { editList, optionPrizeType, addItem, awardMode } = this.state
    const { eleObj = {}, prizeModalVisible, editPositionKey } = this.props;

    // 数据处理
    const prizeList = eleObj.prizes ? eleObj.prizes : []
    let unEditList = prizeList
    if ( prizeList.length > 0 && editPositionKey ) {
      unEditList = prizeList.filter( info => {
        return info.itemPosition !== editPositionKey
      } )
    }
    // editPositionKey下奖项基础配置都一致
    let editObj = {}
    if ( editList && editList.length > 0 ) {
      // eslint-disable-next-line prefer-destructuring
      editObj = editList[0]
    }

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

    let checkboxVal = []
    if ( editObj && editObj.itemPosition ) {
      checkboxVal = editObj.itemPosition.split( ',' )
    }

    // 多选框选项
    let checkboxOptions = [
      { label: '位置1', value: '1' },
      { label: '位置2', value: '2' },
      { label: '位置3', value: '3' },
      { label: '位置4', value: '4' },
      { label: '位置5', value: '5' },
      { label: '位置6', value: '6' },
    ]
    if ( eleObj.type && eleObj.type ==='GRID_WHEEL' ) {
      checkboxOptions = [
        { label: '位置1', value: '1' },
        { label: '位置2', value: '2' },
        { label: '位置3', value: '3' },
        { label: '位置4', value: '4' },
        { label: '位置5', value: '5' },
        { label: '位置6', value: '6' },
        { label: '位置7', value: '7' },
        { label: '位置8', value: '8' },
      ];
    }


    // 将已有的且不能更改的坐标点标记出来
    const unCheckList = []
    if ( unEditList && unEditList.length > 0 ) {
      unEditList.forEach( info => {
        if ( info && info.itemPosition ) {
          const pointList = info.itemPosition.split( ',' )
          pointList.forEach( item => {
            unCheckList.push( item )
          } )
        }
      } )
    }
    // 限制多选框点击
    const newCheckboxOptions = checkboxOptions.map( info => {
      let disabled = false
      if ( unCheckList.includes( info.value ) ) {
        disabled = true
        // checkboxVal.push( info.value )
      }
      return {
        ...info,
        disabled
      }
    } )
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
              label={<span className={styles.labelText}><span>*</span>奖项类型</span>}
              {...this.formLayout}
            >
              <Radio.Group
                onChange={( e ) => this.changePrizeType( e )}
                disabled={!!editPositionKey}
                value={optionPrizeType}
              >
                <Radio value='PRIZE'>奖品</Radio>
                <Radio value='THANKS'>谢谢参与</Radio>
              </Radio.Group>
            </FormItem>
            <FormItem
              style={{ display: 'flex' }}
              label={<span className={styles.labelText}><span>*</span>奖项位置</span>}
              {...this.formLayoutCheckbox}
            >
              <Checkbox.Group
                options={newCheckboxOptions}
                value={editPositionKey ? checkboxVal : addItem.itemPosition}
                onChange={( e ) => this.onChangeCheckbox( e, 'itemPosition' )}
              />
              <div style={{ color: '#f73232', fontSize: '12px' }}>*不同奖项的序号不能重复</div>
            </FormItem>
            <FormItem
              label={<span className={styles.labelText}><span>*</span>奖项名称</span>}
              {...this.formLayout}
            >
              <Input
                value={editPositionKey ? editObj.itemName : addItem.itemName}
                placeholder="请输入奖项名称"
                onChange={( e ) => this.changeItemName( e, 'itemName' )}
                maxLength={20}
              />
            </FormItem>
            <div>
              <FormItem
                label={<span className={styles.labelText}><span>*</span>奖项图</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex', }}>
                  <UploadModal value={editPositionKey ? editObj.image : addItem.image} onChange={( e ) => this.changeImage( e, 'image' )} />
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
                    <div>格式：jpg/jpeg/png </div>
                    <div>180px*180px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>
            </div>

            {optionPrizeType === 'PRIZE' &&
              <>
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>发奖模式</span>}
                  {...this.formLayout}
                >
                  <Radio.Group
                    onChange={( e ) => this.changePrizeType( e, 'mode' )}
                    disabled={!!editPositionKey}
                    value={awardMode}
                  >
                    <Radio value='RIGHT'>新模式</Radio>
                    <Radio value='OPEN'>旧模式</Radio>
                  </Radio.Group>
                </FormItem>
                {
                  this.renderAssociatePrize( editList )
                }
              </>
            }
            {optionPrizeType === 'PRIZE' &&
              <FormItem label="" {...this.formLayout}>
                <Button
                  type="dashed"
                  style={{ width: '100%', marginTop: 10, marginLeft: '25%' }}
                  icon="plus"
                  onClick={() => this.onAddPrizeItem( editObj )}
                >
                  添加奖品
                </Button>
              </FormItem>
            }
          </div>
        </Modal>
      </div>
    )
  }
}

export default CommonEditPrizeModal;

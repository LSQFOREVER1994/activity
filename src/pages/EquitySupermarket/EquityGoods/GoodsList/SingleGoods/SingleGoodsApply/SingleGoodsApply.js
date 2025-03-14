/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Form, Drawer, Button, message, Row, Select, Input, Radio, DatePicker, Col, Icon, Tooltip } from 'antd';
// import moment from 'moment';
import styles from './SingleGoodsApply.less'
import comStyles from '@/pages/EquitySupermarket/EquityGoods/GoodsList/GoodsList.less'


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input
@connect()
@Form.create()
class SingleGoodsApply extends PureComponent {
  emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  phoneRegex = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

  moneyRegex = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/

  wordsToSort = {
    COUPON: '虚拟卡券',
    GOODS: '实物',
    // RED: '现金红包',
    // PHONE: '直充',
    // WX_COUPON: '微信立减金',
    // WX_VOUCHER: '微信代金券',
    // RIGHT_PACKAGE: '权益包',
    CUSTOM: '自定义商品',
    TG_COUPON: '投顾卡券',
    JN_RED:'绩牛红包',
    JN_RIGHT:'绩牛权益',
  }

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }

  constructor( props ) {
    super( props );
    this.state = {
      /**
      * 手机amountMap初始化 格式：{phone:''} 或
      *  红包amountMap初始化 格式：{money:0,num:0}， 接口参数格式 {20:1,3:5} meaning:20元红包*1，3元红包*5
      */
      amountMapList: [],
      // TODO:
      wxCoupons: [] // 微信立减金商品申请数组
    }
  }

  /**
   * 处理计算结果以及数字格式化
   * @param {*} computeN1
   * @param {*} computeN2
   * @param {*} mode 计算模式 enums:{ plus:加法,multiple: 乘法 }
   */
  digitalFormatOrCompute = ( computeN1 = 0, computeN2 = 0, mode ) => {
    let computeResult = 0
    if ( mode === 'plus' ) computeResult = Number( computeN1 ) + Number( computeN2 )
    if ( mode === 'multiple' ) computeResult = Number( computeN1 ) * Number( computeN2 )
    computeResult = computeResult.toFixed( 2 )
    return computeResult
  }

  componentDidMount() {
    this.initAmountMapList()
  }

  // 关闭Drawer清空状态
  closeDrawer = () => {
    const { handleApplyModalVisible } = this.props;
    this.props.form.resetFields()
    this.initAmountMapList()
    handleApplyModalVisible()
  }

  // 立减金合并重复数组
  mergeAndDeduplicate = ( arr ) => {
    const map = new Map();
    arr.forEach( item => {
      const key = `${item.amount}-${item.minimum}`;
      if ( map.has( key ) ) {
        // 如果已经存在相同 "amount" 和 "minimum" 的元素，则进行合并
        const existingItem = map.get( key );
        existingItem.count += Number( item.count );
      } else {
        // 否则，添加到 map 中
        map.set( key, { ...item } );
      }
    } );

    // 将 map 中的值转换回数组形式
    return Array.from( map.values() );
  }

  // 立减金判空处理
  hasEmptyValues = ( arr ) => {
    for ( const item of arr ) {
      for ( const key in item ) {
        if ( item.hasOwnProperty( key ) ) {
          if ( !item[key] ) {
            return true; // 如果有任何一个值为空，则返回 true
          }
        }
      }
    }
    return false; // 如果没有空值，返回 false
  }

  // 收集当前表单信息
  filterSubmit = () => {
    const { amountMapList, wxCoupons } = this.state
    const { form: { validateFields, getFieldValue }, filterSubmit, goodsInfo } = this.props
    if ( !Object.keys( goodsInfo ).length ) return
    const { id, merchantCode, type, name, price, marketPrice } = goodsInfo
    const validateArr = []

    validateFields( ( err, values ) => {
      let params = {
        productId: id,
        merchantCode,
        productType: type,
        productName: name,
      }
      if ( err ) {
        message.error( '请填写正确的申请信息' )
      } else if ( type === "RED" ) { // 不同类型的表单数据处理
        const amountMap = {}
        // 重复红包申请逻辑判断
        const mergedRedArr = amountMapList.reduce( ( acc, cur ) => {
          const curIndex = acc.findIndex( item => item.money === cur.money )
          if ( curIndex === -1 ) {
            acc.push( { money: cur.money, num: cur.num } )
          } else {
            acc[curIndex].num += cur.num
          }
          return acc;
        }, [] );
        mergedRedArr.forEach( ( item ) => {
          amountMap[item.money] = Number( item.num )
          validateArr.push( item.validateMoney )
          validateArr.push( item.validateNum )
        } )
        params = Object.assign( params, values )
        params.productType = type
        params.amountMap = amountMap

        if ( getFieldValue( 'sendEmail' ) ) {
          const calcRedCallBack = ( item ) => Number( item.money ) * Number( item.num )
          params.totalMoney = this.calcTotalMoney( type, calcRedCallBack )
          params.sendType = 'EMAIL'
        } else {
          params.totalMoney = Number( getFieldValue( 'totalMoney' ) ).toFixed( 2 )
          params.sendType = 'ADVANCE'
        }

        // 红包限制参数整理
        const redeemRestrict = {
          timeType: params.timeType,
          timeLimit: params.timeLimit,
          countLimit: params.countLimit
        }
        params.redeemRestrict = redeemRestrict

        if ( validateArr.includes( true ) ) {
          message.error( '请填写正确的申请信息' )
        } else if ( params.totalMoney === 0.00 ) {
          amountMapList.map( ( item ) => {
            const copyItem = item
            if ( !item.money ) {
              copyItem.validateMoney = true
              return copyItem
            }
            if ( !item.num ) {
              copyItem.validateNum = true
              return copyItem
            }
            return copyItem
          } )
          message.error( '请填写正确的申请信息' )
        }
        else {
          filterSubmit( params )
          this.initAmountMapList()
          this.props.form.resetFields()
        }
      } else if ( type === 'PHONE' ) {
        const { sendType } = values
        // TODO: 话费复杂数据处理(待优化)
        if ( sendType === "EMAIL" ) {
          params.sendEmail = true
        }
        if ( sendType === 'EMAIL' || sendType === 'ADVANCE' ) {
          params = Object.assign( params, values )
          params.productType = type
          params.chargeMoney = marketPrice
          params.totalMoney = this.digitalFormatOrCompute( getFieldValue( 'amount' ), price, 'multiple' )
          filterSubmit( params )
          this.props.form.resetFields()
        }
        if ( sendType === 'DIRECT' ) {
          const mobileList = []
          amountMapList.forEach( ( item ) => {
            validateArr.push( item.validate )
            mobileList.push( item.phone )
          } )
          params = Object.assign( params, values )
          params.mobileList = mobileList
          params.productType = type
          params.chargeMoney = marketPrice
          params.totalMoney = this.digitalFormatOrCompute( amountMapList.length, price, 'multiple' )
          params.amount = amountMapList.length

          if ( validateArr.includes( true ) ) {
            message.error( '请填写正确的申请信息' )
          } else if ( mobileList.includes( '' ) ) {
            amountMapList.map( ( item ) => {
              const copyItem = item
              copyItem.validate = true
              return copyItem
            } )
            message.error( '请填写正确的申请信息' )
          }
          else {
            filterSubmit( params )
            this.initAmountMapList()
            this.props.form.resetFields()
          }
        }
      } else if ( type === "WX_COUPON" ) {
        params = Object.assign( params, values )
        params.productType = type
        if ( getFieldValue( 'sendEmail' ) ) {
          const hasEmpty = this.hasEmptyValues( wxCoupons )
          const isValidValArr = []
          wxCoupons.forEach( ( item ) => {
            isValidValArr.push( this.validateWxCouponsValue( item ) )
          } )
          if ( hasEmpty || isValidValArr.includes( false ) ) {
            message.error( '请填写正确的申请信息' )
            return;
          }
          params.sendType = 'EMAIL'
          const calcWxCouponCallBack = ( item ) => Number( item.amount ) * Number( item.count )
          params.totalMoney = this.calcTotalMoney( type, calcWxCouponCallBack )
        } else {
          params.sendType = 'ADVANCE'
          params.totalMoney = Number( getFieldValue( 'totalMoney' ) ).toFixed( 2 )
        }

        params.wxCoupons = wxCoupons

        filterSubmit( params )
        this.props.form.resetFields()
      } else {
        // 卡券 | 实物 | 代金券 || 自定义商品 数据处理
        params = Object.assign( params, values )
        const defaultMoney = this.digitalFormatOrCompute( getFieldValue( 'amount' ), price, 'multiple' )
        const includeArr = ['GOODS', 'CUSTOM', 'COUPON', 'RIGHT_PACKAGE', 'WX_VOUCHER']
        params.productType = type
        if ( type === 'GOODS' || type === 'WX_VOUCHER' ) {
          params.amount = Number( params.amount )
          params.sendType = 'ADVANCE'
        }
        if ( includeArr.includes( type ) ) {
          params.totalMoney = defaultMoney
        } else if( getFieldValue( 'totalMoney' ) ){
          params.totalMoney = Number( getFieldValue( 'totalMoney' ) ).toFixed( 2 )
        }else{
          delete params.totalMoney
        }
        filterSubmit( params )
        this.props.form.resetFields()
      }
    } )
  }

  // 获取日期默认值
  // getDay = ( num ) => {
  //   const nowDate = moment()
  //   let date = nowDate
  //   if ( num > 0 ) date = moment( nowDate ).add( 1, "days" );
  //   if ( num < 0 ) date = moment( nowDate ).subtract( Math.abs( num ), "days" );
  //   return moment( date, 'YYYY-MM-DD' );
  // }

  validateNumber = ( num, isInteger ) => {
    if ( !num ) return true
    // 匹配正整数或小数（小数点后最多两位）
    const reg = isInteger ? /^[1-9]\d*$/ : /^\d+(\.\d{1,2})?$/;
    return reg.test( num );
  }

  validateWxCouponsValue = ( couponsLine = {} ) => {
    const { amount, minimum } = couponsLine
    if( !this.validateNumber( amount ) || !this.validateNumber( minimum ) ){
       return false
    } if( amount && minimum ){
      if( minimum < amount  + 0.01 ) return false
      if( amount > 500 || amount < 1 ) return false
    }

    return true
   }


  // 初始化手机map / 红包map数据 / 立减金数组数据
  initAmountMapList = () => {
    const { applyType } = this.props
    if ( applyType === 'PHONE' ) {
      this.setState( {
        amountMapList: [
          { phone: '', validate: false }
        ]
      } )
    }
    if ( applyType === 'RED' ) {
      this.setState( {
        amountMapList: [
          { money: '', num: '', validateMoney: false, validateNum: false }
        ]
      } )
    }

    if ( applyType === 'WX_COUPON' ) {
      this.setState( {
        wxCoupons: [
          { amount: '', minimum: '', count: '' }
        ]
      } )
    }
  }

  /** 话费类型申请相关函数 */
  // 话费发送类型变更
  handleTypeChange = () => {
    const { form: { setFieldsValue } } = this.props
    this.initAmountMapList()
    setFieldsValue( {
      email: '',
      amount: '',
      reason: '',
      contractMoney: ''
    } )
  }

  // 手机号change事件
  onPhoneChange = ( e, index ) => {
    let val;
    let validate
    if ( e && e.target.value ) {
      val = e.target.value
      if ( this.phoneRegex.test( e.target.value ) ) {
        validate = false
      } else {
        validate = true
      }
    }
    const { amountMapList } = this.state
    const newItem = { phone: val, validate }
    const newAmountMapList = amountMapList.map( ( v, i ) => {
      let tItem = { ...v }
      if ( index === i ) tItem = newItem
      return tItem
    } )

    this.setState( {
      amountMapList: newAmountMapList
    } )
  }

  // 添加手机号模块
  renderPhoneItems = () => {
    const { amountMapList } = this.state
    const addItems = amountMapList && amountMapList.map( ( k, index ) => {
      return (
        <div className={styles.phone_new_item} key={index}>
          <Row gutter={24}>
            <Col span={17}>
              <FormItem label='账号' key={`${index}1`} required>
                <Input
                  value={k.phone}
                  style={{ width: 220 }}
                  placeholder='请输入账号'
                  onChange={e => this.onPhoneChange( e, index )}
                />
                {k.validate && <span style={{ color: 'red' }}>请输入正确的手机号！</span>}
              </FormItem>
            </Col>
            <Col span={7}>
              {
                index === 0 ?
                  <span className={styles.bonus_delete} /> :
                  <span
                    className={styles.bonus_delete_phone}
                    onClick={() => this.handleItemsRemove( amountMapList, index, 'amountMapList' )}
                  >
                    删除
                  </span>
              }
            </Col>
          </Row>
        </div>
      )
    } )
    return addItems
  }

  /** 红包申请相关函数 */
  // 红包明细change事件
  onRedChange = ( e, index, key ) => {
    let val;
    let validateMoney;
    let validateNum
    const moneyRegex = /^(([1-9]\d{0,9})|([0-9]\d*.\d?[1-9]{1}))$/
    const numRegex = /^\+?[1-9]\d*$/
    if ( e && e.target.value ) {
      // 对红包数组的每一项做校验判断
      if ( key === 'money' ) {
        val = Number( e.target.value )
        if ( moneyRegex.test( Number( e.target.value ) ) ) {
          validateMoney = false
        } else {
          validateMoney = true
        }
      }
      if ( key === 'num' ) {
        val = Number( e.target.value )
        if ( numRegex.test( Number( e.target.value ) ) ) {
          validateNum = false
        } else {
          validateNum = true
        }
      }
    }

    const { amountMapList } = this.state
    const item = amountMapList && amountMapList.find( ( v, i ) => i === index )
    const newItem = { ...item, [key]: val, validateMoney, validateNum }
    const newAmountMapList = amountMapList.map( ( v, i ) => {
      let ritem = { ...v }
      if ( index === i ) ritem = newItem
      return ritem
    } )

    this.setState( {
      amountMapList: newAmountMapList
    } )
  }

  // 计算总金额
  calcTotalMoney = ( type, callback = () => { } ) => {
    const { amountMapList, wxCoupons } = this.state
    const handleList = type === 'RED' ? amountMapList : wxCoupons
    let num = 0
    if ( handleList.length ) {
      handleList.forEach( ( item ) => {
        num += callback( item )
      } )
    }
    num = Number( num ).toFixed( 2 ) || 0
    return num
  }

  // 处理新增
  handleItemsAdd = ( handleList, pushItem, setStateStr ) => {
    const newHandleList = JSON.parse( JSON.stringify( handleList ) )
    newHandleList.push( pushItem )
    this.setState( {
      [setStateStr]: newHandleList
    } )
  }

  // 处理删除
  handleItemsRemove = ( handleList, index, setStateStr ) => {
    const newHandleList = JSON.parse( JSON.stringify( handleList ) )
    newHandleList.splice( index, 1 )

    this.setState( {
      [setStateStr]: newHandleList
    } )
  }

  // 立减金change
  handleWxCouponChange = ( e, index, type ) => {
    const val = e && ( e.target.value || '' )
    const { wxCoupons } = this.state
    const newWxCoupons = JSON.parse( JSON.stringify( wxCoupons ) )
    newWxCoupons[index][type] = val ? Number( val ) : ''
    this.setState( { wxCoupons: newWxCoupons } )
  }

  // 添加红包模块
  renderAddItems = () => {
    const { amountMapList } = this.state;
    const { goodsInfo } = this.props;
    if ( !Object.keys( goodsInfo ).length ) return null
    const { cid, id } = goodsInfo;
    const addItems = amountMapList && amountMapList.map( ( k, index ) => {
      return (
        <div key={`${cid}_${id}_${index}`}>
          <div className={styles.fixed_bonus_line} key={index}>
            <FormItem
              label=''
              key={`${index}_1`}
            >
              <Input
                type='number'
                value={k.money}
                precision={2}
                onChange={e => this.onRedChange( e, index, 'money' )}
                placeholder='请输入金额'
                style={{ width: 140 }}
                suffix={<span>元</span>}
              />
            </FormItem>
            <FormItem
              label=''
              key={`${index}_2`}
            >
              <Input
                type='number'
                value={k.num}
                onChange={e => this.onRedChange( e, index, 'num' )}
                placeholder='请输入个数'
                style={{ width: 140 }}
                suffix={<span>个</span>}
              />
            </FormItem>
            {index === 0 && <span className={styles.bonus_delete} />}
            {index !== 0 &&
              <span
                className={styles.bonus_delete}
                onClick={() => this.handleItemsRemove( amountMapList, index, 'amountMapList' )}
              >
                删除
              </span>
            }
          </div>
          <div className={styles.red_validate}>
            {k.validateMoney ? <span key={`${index}_money`} style={{ margin: '0 0 0 12px', color: 'red' }}>请输入正确的金额！</span> : <span />}
            {k.validateNum ? <span key={`${index}_num`} style={{ margin: '0 0 0 0', color: 'red' }}>请输入正确的个数！</span> : <span />}
          </div>
        </div>
      )
    } )

    return addItems
  }

  // 添加立减金模块
  renderWxCouponAddItems = () => {
    const { wxCoupons } = this.state
    const { goodsInfo } = this.props;
    if ( !Object.keys( goodsInfo ).length ) return null
    const { cid, id } = goodsInfo;
    const inputNumStyle = { width: 85, marginRight: '10px' }

    const wxAddItems = wxCoupons && wxCoupons.map( ( item, idx ) => {
      const { amount, minimum, count } = item
      const validateCondition = !this.validateWxCouponsValue( item )
      return (
        <div key={`${cid}_${id}_${idx}`}>
          <div className={styles.wx_coupon_line}>
            <FormItem>
              <Input
                type='number'
                value={minimum}
                precision={2}
                onChange={( e ) => this.handleWxCouponChange( e, idx, 'minimum' )}
                style={inputNumStyle}
                prefix={<span>满</span>}
              />
            </FormItem>
            <FormItem>
              <Input
                label=''
                key={`${idx}_2`}
                type='number'
                value={amount}
                precision={2}
                style={inputNumStyle}
                onChange={( e ) => this.handleWxCouponChange( e, idx, 'amount' )}
                prefix={<span>减</span>}
              />
            </FormItem>
            <FormItem
              label=''
              key={`${idx}_3`}
            >
              <Input
                type='number'
                value={count}
                placeholder='请输入个数'
                style={{ width: 130 }}
                onChange={( e ) => this.handleWxCouponChange( e, idx, 'count' )}
                suffix={<span>个</span>}
              />
            </FormItem>
            {idx === 0 && <span className={styles.bonus_delete} />}
            {idx !== 0 &&
              <span
                className={styles.bonus_delete_wxcoupon}
                onClick={() => this.handleItemsRemove( wxCoupons, idx, 'wxCoupons' )}
              >
                删除
              </span>
            }
          </div>
          <div className={styles.red_validate}>
            {validateCondition ? <span key={`${idx}_money`} style={{ margin: '0 0 0 12px', color: 'red' }}>请输入正确的满减金额！</span> : <span />}
            {!this.validateNumber( count, 'isInteger' ) ? <span key={`${idx}_num`} style={{ margin: '0 0 0 0', color: 'red' }}>请输入正确的个数！</span> : <span />}
          </div>
        </div>
      )
    } )
    return wxAddItems
  }

  /** 申请表单👇 */
  renderApplyForm = ( goodsInfoData = {} ) => {
    const {
      form: { getFieldDecorator, getFieldValue },
      merchantList,
      isMerchantDisable = false,
    } = this.props
    if ( !Object.keys( goodsInfoData ).length ) return null
    const {
      name,  // 商品名称
      type, // 商品类型  COUPON: 虚拟卡券 GOODS:实物 RED:现金红包 PHONE:话费充值 COUSTOM:自定义商品 WX_COUPON:微信立减金
      stock = 0, // 库存
      reason, // 申请理由,
      productDescribe, // 商品描述
      merchantId,
      unlimitedStock,
    } = goodsInfoData
    const { amountMapList, wxCoupons } = this.state

    const needEmailSend = ['RED', 'COUPON', 'WX_COUPON', 'RIGHT_PACKAGE', 'GOODS', 'WX_VOUCHER'] // 需要邮箱发送
    const needAmountCalc = ['GOODS', 'COUPON', 'CUSTOM', 'RIGHT_PACKAGE', 'WX_VOUCHER', 'TG_COUPON', 'JN_RIGHT'] // 需要数量计算
    const infinityType = ['CUSTOM', 'GOODS']
    const stockAmount = ( infinityType.includes( type ) && unlimitedStock ) ? '无库存限制' : `${stock}个` // 是否无限库存

    const pushRedItem = { money: '', num: '', validateMoney: false, validateNum: false }
    const pushPhoneItem = { phone: '', validate: false }
    const pushWxCouponItem = { amount: '', minimum: '', count: '' }

    // 红包特殊表单
    const redView = type === 'RED' &&
      <>
        {
          ( getFieldValue( 'sendEmail' ) && type === 'RED' ) &&
          <>
            <div className={styles.fixed_bonus_container}>
              <div className={styles.bonus_item_container}>
                {this.renderAddItems()}
              </div>
              <FormItem label=''>
                <Button
                  style={{
                    width: 248,
                    color: '#1F3883',
                    border: '1px dashed #1F3883',
                  }}
                  icon="plus"
                  onClick={() => this.handleItemsAdd( amountMapList, pushRedItem, 'amountMapList' )}
                >新增红包
                </Button>
              </FormItem>
            </div>
            <Row>
              <FormItem label='红包描述' required>
                {getFieldDecorator( 'describe', {
                  initialValue: productDescribe || '',
                  rules: [{ required: true, message: '请输入红包描述' }]
                } )(
                  <Input style={{ width: 220, marginRight: 16 }} placeholder='请输入红包描述' />
                )}
                <Tooltip placement="topLeft" title={<sapn>红包到账后来源提示</sapn>}>
                  <Icon type="question-circle" theme="filled" />
                </Tooltip>

              </FormItem>
            </Row>
            <Row>
              <FormItem label='过期时间'>
                {getFieldDecorator( 'expireTime', {
                  // initialValue: this.getDay( 365 )
                } )(
                  <DatePicker style={{ width: 220, marginRight: 16 }} />
                )}
              </FormItem>
            </Row>
          </>
        }
      </>

    // 卡券特殊表单
    const couponView = ( type === 'COUPON' || type === 'GOODS' ) && getFieldValue( 'sendEmail' ) &&
      <>
        {
          type === 'COUPON' && (
            <FormItem label='邮箱发送类型'>
              {getFieldDecorator( 'sendCode', {
                initialValue: true,
                rules: [{ required: true }]

              } )(
                <Radio.Group className={comStyles.is_email_send}>
                  <Radio value>兑换码</Radio>
                  <Radio value={false}>实际卡密</Radio>
                </Radio.Group>
              )}
            </FormItem>
          )
        }

        {
          ( getFieldValue( 'sendCode' ) || type === 'GOODS' ) && (
            <FormItem label='过期时间'>
              {getFieldDecorator( 'expireTime', {
                // initialValue: this.getDay( 365 )
              } )(
                <DatePicker style={{ width: 220, marginRight: 16 }} />
              )}
            </FormItem>
          )
        }
      </>

    const wxCouponView = type === 'WX_COUPON' &&
      <>
        {
          ( getFieldValue( 'sendEmail' ) && type === 'WX_COUPON' ) &&
          <>
            <div className={styles.fixed_bonus_container}>
              <div className={styles.bonus_item_container}>
                {this.renderWxCouponAddItems()}
              </div>
              <FormItem label=''>
                <Button
                  style={{
                      width: 248,
                      color: '#1F3883',
                      border: '1px dashed #1F3883',
                    }}
                  icon="plus"
                  onClick={() => this.handleItemsAdd( wxCoupons, pushWxCouponItem, 'wxCoupons' )}
                >新增立减金
                </Button>
              </FormItem>
            </div>

            <Row>
              <FormItem label='过期时间'>
                {getFieldDecorator( 'expireTime', {
                  // initialValue: this.getDay( 365 )
                } )(
                  <DatePicker style={{ width: 220, marginRight: 16 }} />
                )}
              </FormItem>
            </Row>
          </>
        }
      </>

    // 权益包特殊表单
    const rightPackageView = ( getFieldValue( 'sendEmail' ) && type === 'RIGHT_PACKAGE' ) &&
      <>
        <Row>
          <FormItem label='红包描述' required>
            {getFieldDecorator( 'describe', {
              initialValue: productDescribe || '',
              rules: [{ required: true, message: '请输入红包描述' }]
            } )(
              <Input style={{ width: 220, marginRight: 16 }} placeholder='请输入红包描述' />
            )}
            <Tooltip placement="topLeft" title={<sapn>红包到账后来源提示</sapn>}>
              <Icon type="question-circle" theme="filled" />
            </Tooltip>

          </FormItem>
        </Row>
        <Row>
          <FormItem label='过期时间'>
            {getFieldDecorator( 'expireTime', {
              // initialValue: this.getDay( 365 )
            } )(
              <DatePicker style={{ width: 220, marginRight: 16 }} />
            )}
          </FormItem>
        </Row>
      </>

    // 话费特殊表单
    const phoneView = type === 'PHONE' &&
      <>
        <Row>
          <FormItem label='充值类型'>
            {getFieldDecorator( 'sendType', {
              initialValue: 'DIRECT',
              rules: [{ required: true }]

            } )(
              <Radio.Group className={styles.is_email_send_phone} onChange={() => this.handleTypeChange()}>
                <Radio value='DIRECT'>代充</Radio>
                <Radio value='EMAIL'>邮箱发送</Radio>
                <Radio value='ADVANCE'>预申请</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Row>
        {
          getFieldValue( 'sendType' ) === 'EMAIL' &&
          <Row>
            <FormItem label='邮箱' required>
              {getFieldDecorator( 'email', {
                rules: [
                  { required: true, message: '请输入邮箱' },
                  { pattern: this.emailRegex, message: '请输入正确的邮箱！' }
                ]
              } )(
                <Input placeholder='请输入邮箱' />
              )}
            </FormItem>
          </Row>
        }

        {
          getFieldValue( 'sendType' ) === 'DIRECT' &&
          <div className={styles.phone_item_container}>
            {this.renderPhoneItems()}
            <FormItem>
              <Button
                style={{
                  width: 200,
                  color: '#1F3883',
                  border: '1px dashed #1F3883',
                  marginLeft: 97
                }}
                icon="plus"
                onClick={() => this.handleItemsAdd( amountMapList, pushPhoneItem, 'amountMapList' )}
              >新增手机号
              </Button>
            </FormItem>
          </div>
        }
        {
          ( getFieldValue( 'sendType' ) === 'ADVANCE' || getFieldValue( 'sendType' ) === 'EMAIL' ) &&
          <div className={styles.input_num}>
            <FormItem label='数量' required>
              {getFieldDecorator( 'amount', {
                rules: [
                  { required: true, message: '请输入数量' },
                  { pattern: /^\+?[1-9]\d*$/, message: '请输入正确的数字' }
                ]
              } )(
                <Input style={{ width: 120, marginLeft: 12 }} placeholder='请输入数量' suffix={<span>个</span>} />
              )}
            </FormItem>
            <span>库存： {stock || 0}个</span>
          </div>
        }
        {
          getFieldValue( 'sendType' ) === 'EMAIL' &&
          <Row>
            <FormItem label='过期时间'>
              {getFieldDecorator( 'expireTime', {
                // initialValue: this.getDay( 365 ),
                rules: [{ required: true, message: '请选择过期时间' }]
              } )(
                <DatePicker style={{ width: 220, marginRight: 16 }} />
              )}
            </FormItem>
          </Row>
        }

      </>
    return (
      <>
        <Row>
          <FormItem label='商户名称'>
            {getFieldDecorator( 'merchantId', {
              initialValue: merchantId,
              rules: [{ required: true, message: '请选择一个商户' }]
            } )(
              <Select
                placeholder='请选择商户'
                style={{ width: 220 }}
                disabled={isMerchantDisable || false}
                showSearch
                optionFilterProp="children"
                filterOption={( input, option ) =>
                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                }
              >
                {Array.isArray( merchantList ) && merchantList.map( ( v, i ) => {
                  return (
                    <Option key={`${v}_${i}`} value={v.id}>{v.name}</Option>
                  )
                } )}
              </Select>
            )}
          </FormItem>
        </Row>

        <Row>
          <FormItem label='商品名称'>
            {getFieldDecorator( 'productName', {
              initialValue: name || '-',
              rules: [{ required: true }]
            } )(
              <Input style={{ color: '#434343', background: '#fff' }} disabled />
            )}
          </FormItem>
        </Row>

        <Row>
          <FormItem label='商品类型'>
            {getFieldDecorator( 'productType', {
              initialValue: this.wordsToSort[type],
              rules: [{ required: true }]
            } )(
              <Input style={{ color: '#434343', background: '#fff' }} disabled />
            )}
          </FormItem>
        </Row>
        {
          ( needEmailSend.includes( type ) ) &&
          <Row>
            <FormItem label='是否邮箱发送' required hidden>
              {getFieldDecorator( 'sendEmail', {
                initialValue: false,
                rules: [{ required: true }]
              } )(
                <Radio.Group className={comStyles.is_email_send}>
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              )}
            </FormItem>
            {
              getFieldValue( 'sendEmail' ) &&
              <FormItem label='邮箱' required>
                {getFieldDecorator( 'email', {
                  rules: [
                    { required: true, message: '请输入邮箱' },
                    { pattern: this.emailRegex, message: '请输入正确的邮箱！' }
                  ]
                } )(
                  <Input style={{ width: 220 }} placeholder='请输入邮箱' />
                )}
              </FormItem>
            }

          </Row>
        }
        {
          type === 'WX_VOUCHER' && getFieldValue( 'sendEmail' ) && (
            <Row>
              <FormItem label='过期时间'>
                {getFieldDecorator( 'expireTime', {
                  // initialValue: this.getDay( 365 ),
                  rules: [{ required: true, message: '请选择过期时间' }]
                } )(
                  <DatePicker style={{ width: 220, marginRight: 16 }} />
                )}
              </FormItem>
            </Row>
          )
        }
        {redView}
        {couponView}
        {wxCouponView}
        {phoneView}
        {rightPackageView}
        {
          ( ( !getFieldValue( 'sendEmail' ) && ( type === 'RED' || type === 'WX_COUPON' || type==='JN_RED' ) ) ) &&
          <Row>
            <FormItem label='总金额'>
              {getFieldDecorator( 'totalMoney', {
                rules: [
                  { required: true, message: '请输入总金额' },
                  { pattern: this.moneyRegex, message: '请输入正确的金额' }
                ]
              } )(
                <Input style={{ width: 220, marginRight: 16 }} placeholder='请输入总金额' suffix={<span>元</span>} />
              )}
            </FormItem>
          </Row>
        }
        {
          ( needAmountCalc.includes( type ) ) &&
          <div className={styles.input_num}>
            <FormItem label='数量'>
              {getFieldDecorator( 'amount', {
                rules: [{ required: true, message: '请输入数量' }, { pattern: /^\+?[1-9]\d*$/, message: '请输入正确的数量' }]
              } )(
                <Input style={{ marginLeft: 5 }} placeholder='请输入数量' suffix={<span>个</span>} />
              )}
            </FormItem>
            <span>剩余： {stockAmount}</span>
          </div>
        }
        <Row>
          <FormItem label='申请理由' required>
            {getFieldDecorator( 'reason', {
              initialValue: reason || '',
              rules: [{ required: true, message: '请输入申请理由' }]
            } )(
              <TextArea maxLength={80} autoSize={{ minRows: 6, maxRows: 10 }} placeholder='请输入申请理由' />
            )}
          </FormItem>
        </Row>
        {/* <Row>
          <FormItem label='合同费用'>
            {getFieldDecorator( 'contractMoney', {
              rules: [
                { pattern: this.moneyRegex, message: '请输入正确的金额！' }
              ]
            } )(
              <Input style={{ width: 220 }} placeholder='请输入合同费用' />
            )}
          </FormItem>
        </Row> */}
      </>
    )
  }

  // 抽屉底部
  renderFormFooter = () => {
    const { form: { getFieldValue }, handleApplyModalVisible, goodsInfo = {}, applyType } = this.props
    if ( !Object.keys( goodsInfo ).length ) return null
    const { price } = goodsInfo
    const { amountMapList } = this.state
    const defaultPrice = this.digitalFormatOrCompute( getFieldValue( 'amount' ), price, 'multiple' )
    const totalMoneyNum = ( Number( getFieldValue( 'totalMoney' ) || 0 ).toFixed( 2 ) )
    const calcRedCallBack = ( item ) => Number( item.money ) * Number( item.num )
    const calcWxCouponCallBack = ( item ) => Number( item.minimum ) * Number( item.count )


    // 红包类型总金额
    const redTypeTotalMoney = getFieldValue( 'sendEmail' ) ? this.calcTotalMoney( applyType, calcRedCallBack ) : totalMoneyNum

    // 话费类型总金额
    const phoneTypeTotalMoney = getFieldValue( 'sendType' ) === 'DIRECT' ?
      this.digitalFormatOrCompute( amountMapList.length, price, 'multiple' ) :
      this.digitalFormatOrCompute( getFieldValue( 'amount' ), price, 'multiple' ) || 0

    // 微信立减金类型总金额
    const wxCouponTypeTotalMoney = getFieldValue( 'sendEmail' ) ? this.calcTotalMoney( applyType, calcWxCouponCallBack ) : totalMoneyNum

    const typeToTotalMoney = {
      COUPON: defaultPrice,
      GOODS: defaultPrice,
      CUSTOM: defaultPrice,
      RIGHT_PACKAGE: defaultPrice,
      RED: redTypeTotalMoney,
      PHONE: phoneTypeTotalMoney,
      WX_COUPON: wxCouponTypeTotalMoney,
      WX_VOUCHER: defaultPrice
    }
    return (
      <div className={comStyles.footer}>
        <span style={{ fontSize: 16, fontWeight: 600, marginLeft: 12 }}>
          {/* 合计金额：{typeToTotalMoney[applyType]}元 */}
        </span>
        <div>
          <Button onClick={() => handleApplyModalVisible()}>取消</Button>
          <Button onClick={() => this.filterSubmit()}>确定</Button>
        </div>
      </div>
    )
  }

  render() {
    const {
      applyFormVisible,
      applyType,
      goodsInfo
    } = this.props

    return (
      <Drawer
        className={styles.global_styles}
        title={`${this.wordsToSort[applyType]} - 订单申请`}
        visible={applyFormVisible}
        onClose={this.closeDrawer}
        width={480}
        zIndex={99}
        maskClosable={false}
      >
        <Form className={styles.global_styles} {...this.formItemLayout} onSubmit={this.filterSubmit}>
          {this.renderApplyForm( goodsInfo )}
        </Form>
        {this.renderFormFooter()}
      </Drawer>
    )
  }
}


export default SingleGoodsApply


/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Button, message, Modal, Form, Row, Input, Switch, Select, Cascader, Spin, Tabs, Radio } from 'antd'
import _ from 'lodash'
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import UploadModal from '@/components/UploadModal/UploadModal';
import PrizeTable from './PrizeOption'
import styles from './SingGoodsEditOrAdd.less'
import newStyles from '@/pages/EquitySupermarket/globalStyles.less'

const { TabPane } = Tabs;
const { Option } = Select;

const FormItem = Form.Item
@connect( ( { equityGoods } ) => {
  return {
    ...equityGoods
  }
} )
@Form.create()
class SingleGoodsEditOrAdd extends PureComponent {
  formItemLayout = {
    labelCol: {
      xs: { span: 16 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 20 },
      sm: { span: 16 },
    },
  }

  wordsToType = {
    COUPON: '虚拟卡券',
    GOODS: '实物',
    // RED: '现金红包',
    // PHONE: '直充',
    // WX_COUPON: '微信立减金',
    // WX_VOUCHER: '微信代金券',
    // RIGHT_PACKAGE: '权益包',
    TG_COUPON: '投顾卡券',
    JN_RED:'绩牛红包',
    JN_RIGHT:'绩牛权益',
    CUSTOM: '自定义商品',
  }

  constructor( props ) {
    super( props );
    this.state = {
      moneyRegex: /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/,
      currentTab: 'basic',
      showOtherConfig: false, // 是否显示其他设置标签
      equityPackData: { rightPackages: [] }
    }
    this.debouncedOnSearch = _.debounce( this.onSearch, 300 );
  }



  componentWillReceiveProps( nextProps ) {
    if ( this.props.goodsInfo.rightPackages !== nextProps.goodsInfo.rightPackages ) {
      const { goodsInfo } = nextProps;
      this.setState( {
        equityPackData: { rightPackages: goodsInfo.rightPackages }
      } )
    }
    if( ( this.props.editOrAddVisible !== nextProps.editOrAddVisible  && nextProps.editOrAddVisible ) ){
      const { externalId='' } = nextProps.goodsInfo || {}    
      this.getJnRightList( { id:externalId } )
    }
  }




  // 计算奖品中概率
  reduceProbability = ( info, keyName ) => {
    let totalProbability = 0;
    if ( info && info.length > 0 ) {
      info.forEach( item => {
        totalProbability += item[keyName] * 1000;
      } );
    }
    const res = totalProbability / 1000;
    return res;
  };

  judgeProbability = ( list ) => {
    let whether = true
    if ( list && list.length ) {
      // 判断奖品概率
      Object.keys( list[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( this.reduceProbability( list, item ) !== 100 ) {
            whether = false
          }
        }
      } );
    } else {
      whether = false
    }
    return whether
  }

  // 提交添加商品表单
  handleSubmitMyForm = ( e ) => {
    e.preventDefault();
    const { goodsInfo, form: { validateFields }, isAdd } = this.props
    const { equityPackData: { rightPackages } } = this.state

    const {
      id, // 商品id
      price, // 销售价
      type, // 商品分类
    } = goodsInfo

    let params = { id, price, type }
    validateFields( ( err, values ) => {
      const { status, cid } = values
      values.status = status ? 1 : 0
      values.cid = cid[cid.length - 1]
      values.presaleThreshold = values.presaleThreshold === '' ? '' : values.presaleThreshold / 100
      if ( values.type === 'RED' ) {
        values.marketPrice = 1
      }
      if ( values.type === 'RIGHT_PACKAGE' || type === 'RIGHT_PACKAGE' ) {
        if ( !rightPackages?.length ) {
          message.error( '请配置奖品！' )
          return;
        }
        if ( !this.judgeProbability( rightPackages ) ) {
          message.error( '权益包奖品需要概率为100%' );
          return;
        }

        values.rightPackages = rightPackages
      }
      params = Object.assign( params, values )
      if ( err ) {
        message.error( '请填写正确的商品信息！' )
      } else if ( isAdd ) {
        this.fetchGoodsAdd( params )
      } else {
        this.fetchGoodsUpdate( params )
      }
    } )
  }

  // 底部按钮变化
  nextStep = ( e ) => {
    const { currentTab } = this.state;
    switch ( currentTab ) {
      case 'basic':
        this.setState( { currentTab: 'detail' } )
        break;
      case 'detail':
        this.setState( { currentTab: 'other' } )
        break
      default:
        this.handleSubmitMyForm( e )
        break;
    }
  }

  onTabClick = ( tab ) => {
    this.setState( { currentTab: tab } )
  }

  // 添加商品
  fetchGoodsAdd = ( params ) => {
    const { dispatch, handleEditOrAddModalVisible, isAdd, getGoodsList } = this.props
    dispatch( {   // 新增商品
      type: 'equityGoods/fetchGoodsAdd',
      payload: params,
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          handleEditOrAddModalVisible( isAdd )
          this.setState( {
            currentTab: 'basic'
          } )
          getGoodsList( 1 )
        } else {
          message.error( tip || returnMessage )
        }
      }
    } )
  }

  getJnRightList = ( params ) => {
    const { dispatch } = this.props
    dispatch( {
      type:'equityGoods/getJNRigthList',
      payload:{
        source:'JN_RIGHT',
        ...params
      },
      callBackFunc:(  ) => {}
    } )
  }


  onSearch = ( value ) => {
    this.getJnRightList( { name: value } );
  }

  // 修改商品
  fetchGoodsUpdate = ( params ) => {
    const { dispatch, handleEditOrAddModalVisible, isAdd, getGoodsList } = this.props
    dispatch( {  // 修改商品
      type: 'equityGoods/fetchGoodsUpDate',
      payload: params,
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          handleEditOrAddModalVisible( isAdd )
          this.setState( {
            currentTab: 'basic'
          } )
          getGoodsList( 1 )
        }
      }
    } )
  }

  // 寻找分类Id
  handleFindParentId = ( list = [], childrenId ) => {
    const mySortId = []
    if ( !list || !list.length ) return []
    list.forEach( ( item ) => {
      if ( item.categoryChildren.length === 0 ) {
        if ( item.id === childrenId ) mySortId.push( childrenId )
      }
      if ( item.categoryChildren && item.categoryChildren.length > 0 ) {
        item.categoryChildren.forEach( ( v ) => {
          if ( v ) {
            if ( v.id === childrenId ) {
              mySortId.push( item.id )
              mySortId.push( childrenId )
            }
          } else {
            mySortId.push( childrenId )
          }
        } )
      }
    } )
    return mySortId
  }

  fliterclassifyList = ( list = [] ) => {
    const newList = list
    if ( !list.length ) return null
    newList.forEach( ( item, index ) => {
      if ( item.status === false || item.categoryChildren.length === 0 ) newList.splice( index, 1 )
      if ( item.categoryChildren && item.categoryChildren.length > 0 ) {
        item.categoryChildren.map( ( v, i ) => {
          if ( v.status === false ) {
            item.categoryChildren.splice( i, 1 )
          }
          return null
        } )
      }
    } )
    return newList
  }

  // 切换商品类型的回调
  handleResetFormItems = ( val ) => {
    const { form } = this.props;
    form.resetFields( ['price', 'priceRatio', 'marketPrice', 'exchangeLink', 'stockThreshold', 'presaleThreshold'] );
    // this.checkShowOtherConfig( val )
  }

  checkShowOtherConfig = ( type ) => {
    let showOtherConfig;
    if ( type === 'COUPON' || type === 'CUSTOM' ) { showOtherConfig = true } else { showOtherConfig = false }
    if ( type === 'RIGHT_PACKAGE' ) {
      this.setState( { equityPackData: { rightPackages: [] } } )
    }
    this.setState( {
      showOtherConfig
    } )
  }

  getApiKey = () => {
    const { form } = this.props;
    const arr = [1, 2, 3] // 保证八位随机码包含数字+大写字母+小写字母
    let code = ''
    function getRandom( min, max ) {
      return Math.round( Math.random() * ( max - min ) + min )
    }
    function randomsort() {
      return Math.random() > 0.5 ? -1 : 1
    }
    for ( let i = 0; i < 5; i += 1 ) {
      arr.push( getRandom( 1, 3 ) ) // 补成八位
    }
    arr.sort( randomsort ) // 打乱数组

    for ( let i = 0; i < 8; i += 1 ) {
      const type = arr[i]
      switch ( type ) {
        case 1:
          code += String.fromCharCode( getRandom( 48, 57 ) ) // 数字
          break
        case 2:
          code += String.fromCharCode( getRandom( 65, 90 ) ) // 大写字母
          break
        case 3:
          code += String.fromCharCode( getRandom( 97, 122 ) ) // 小写字母
          break
        default:
          break
      }
    }
    form.setFieldsValue( { customApiKey: code } )
  }

  // 自定义changeValue
  changeEquityPackValue = ( val, key ) => {
    const { equityPackData } = this.state
    const value = val?.target ? val.target?.value : val;
    const data = _.set( equityPackData, key, value )
    const newData = { ...equityPackData, ...data };
    this.setState( { equityPackData: newData } )
  }

  // 切换发奖模式的回调
  changeAwardModeCallBack = () => {
    this.setState( { equityPackData: { rightPackages: [] } } )
  }


  // 权益包发奖模式渲染 TODO:
  renderEquityPackAwardMode = ( sendMode ) => {
    const { form: { getFieldDecorator, getFieldValue }, isAdd } = this.props
    const { equityPackData } = this.state

    return (
      <>
        <FormItem label='发奖模式'>
          {getFieldDecorator( 'sendMode', {
            initialValue: isAdd ? 'CHOICE' : sendMode,
            rules: [
              { required: true },
            ],
          } )(
            <Radio.Group onChange={() => this.changeAwardModeCallBack()} disabled={!isAdd}>
              <Radio value="CHOICE">N选1</Radio>
              <Radio value="DRAW">抽奖模式</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <FormItem style={{ marginLeft: 200 }}>
          <PrizeTable
            dataKey='rightPackages'
            componentsData={equityPackData}
            changeValue={this.changeEquityPackValue}
            noProbability={getFieldValue( 'sendMode' ) === 'CHOICE'}
            disabledThanks={getFieldValue( 'sendMode' ) === 'CHOICE'}
          />
        </FormItem>
      </>
    )

  }

  // 商品基本信息
  renderGoodsBasic = ( info, list, myId ) => {
    const { form: { getFieldDecorator, getFieldValue }, isAdd, jnRightList } = this.props
    const { moneyRegex } = this.state;
    const goodstype = getFieldValue( 'type' );
    const {
      img,
      name,  // 商品名称
      status, // 商品状态 0:下架 1:上架
      type, // 商品类型
      price, // 销售价
      marketPrice, // 市场价
      externalId, // 立减金批次id
      sendMode,
      unlimitedStock, // 是否无库存限制
      productSource, // 外部供应商
    } = info

    const productTypeOption = Object.keys( this.wordsToType )?.map( key => {
      return (
        <Option key={key} value={key}>{this.wordsToType[key]}</Option>
      )
    } )
    return (
      <>
        <Row>
          <FormItem label='商品类型'>
            {getFieldDecorator( 'type', {
              initialValue: isAdd ? undefined : type,
              rules: [{ required: true, message: '请选择商品类型' }],
            } )(
              <Select
                style={{ width: '40%' }}
                onChange={this.handleResetFormItems}
                placeholder='请选择商品类型'
                getPopupContainer={triggerNode => triggerNode.parentNode}
                disabled={!isAdd}
              >
                {productTypeOption}
              </Select>
            )}
            <span style={{ marginLeft: 20, color: '#999' }}>保存后，商品类型将无法更改！</span>
          </FormItem>
        </Row>
        <Row>
          <FormItem label='商品分类'>
            {getFieldDecorator( 'cid', {
              initialValue: isAdd ? '' : myId,
              rules: [{ required: true, message: `请选择一个分类` }],
            } )(
              <Cascader
                style={{ width: 280 }}
                fieldNames={{ label: 'name', value: 'id', children: 'categoryChildren' }}
                options={list || []}
                placeholder="请选择一个分类"
                showSearch
                filterOption={( input, option ) =>
                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                }
                getPopupContainer={triggerNode => triggerNode.parentNode}
              />
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label='商品名称'>
            {getFieldDecorator( 'name', {
              initialValue: ( isAdd ? '' : name ) || '',
              rules: [
                { required: true, message: `请输入商品名称` },
              ],
            } )(
              <Input style={{ width: 300, paddingRight: 60 }} maxLength={50} placeholder='请输入商品名称' suffix={<span>{getFieldValue( 'name' ).length}/50</span>} />
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label='图片上传'>
            {getFieldDecorator( 'img', {
              initialValue: isAdd ? '' : img,
              rules: [{ required: true, message: `请先上传图片` }],
            } )(
              <UploadModal />
            )}
            <span style={{ marginLeft: 12 }}>支持.jpg .png .gif格式，尺寸为400px * 400px </span>
          </FormItem>
        </Row>
        {goodstype === 'RIGHT_PACKAGE' && this.renderEquityPackAwardMode( sendMode )}
        {
          ( goodstype === 'CUSTOM' || goodstype === 'GOODS' ) && (
            <Row>
              <FormItem label='无库存限制'>
                {getFieldDecorator( 'unlimitedStock', {
                  valuePropName: 'checked',
                  initialValue: isAdd ? true : !!unlimitedStock,
                  rules: [{ required: true }],
                } )(
                  <Switch />
                )}
              </FormItem>
            </Row>
          )
        }
        {/* {
          ( goodstype === 'PHONE' || goodstype === 'GOODS' ) &&
          <>
            <Row>
              <FormItem label='外部供应商'>
                {getFieldDecorator( 'productSource', {
                  initialValue: ( isAdd ? '' : productSource ) || '',
                  rules: [
                    { required: false, },
                  ],
                } )(
                  <Select
                    style={{ width: '40%' }}
                    placeholder='请选择外部供应商'
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    allowClear
                  >
                    <Option value='YOU_FEN'>有分</Option>
                    <Option value='FU_LU'>福禄</Option>
                    <Option value='YI_QI_DA'>亿奇达</Option>
                    <Option value='JIN_FENG_YUN'>劲峰云</Option>
                    <Option value='YSF_RED'>云闪付红包</Option>
                  </Select>
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label='外部商品ID'>
                {getFieldDecorator( 'externalId', {
                  initialValue: ( isAdd ? '' : externalId ) || '',
                  rules: [
                    { required: getFieldValue( 'productSource' ), message: `请输入外部商品ID` },
                  ],
                } )(
                  <Input style={{ width: 300 }} placeholder='请输入外部商品ID' />
                )}
              </FormItem>
            </Row>
          </>
        } */}
        {/* <Row>
          <FormItem label='商品售价'>
            {getFieldDecorator( 'price', {
              initialValue: isAdd ? '' : price,
              rules: [
                { required: true, message: `请输入商品售价` },
                { pattern: moneyRegex, message: '请输入正确的商品售价' }
              ],
            } )(
              <Input style={{ width: 300 }} placeholder='请输入商品售价' />
            )}
            <span style={{ marginLeft: 12 }}>单位：元</span>
          </FormItem>
        </Row> */}
        {/* {
          goodstype !== 'RED' && goodstype !== 'WX_COUPON' && goodstype !== 'WX_VOUCHER' &&
          <Row>
            <FormItem label='市场价'>
              {getFieldDecorator( 'marketPrice', {
                initialValue: isAdd ? '' : marketPrice,
                rules: [
                  { required: true, message: `请输入市场价` },
                  { pattern: moneyRegex, message: '请输入正确的市场价' }
                ],
              } )(
                <Input style={{ width: 300 }} placeholder='请输入市场价' />
              )}
              <span style={{ marginLeft: 12 }}>单位：元</span>
            </FormItem>
          </Row>
        } */}
        {/* {
          ( goodstype === 'WX_COUPON' || goodstype === 'WX_VOUCHER' ) &&
          <Row>
            <FormItem label={`微信${goodstype === 'WX_COUPON' ? '立减金' : '代金券'}批次ID`}>
              {getFieldDecorator( 'externalId', {
                initialValue: ( isAdd ? '' : externalId ) || '',
                rules: [
                  { required: true, message: `请输入微信${goodstype === 'WX_COUPON' ? '立减金' : '代金券'}批次ID` },
                ],
              } )(
                <Input style={{ width: 300 }} placeholder={`请输入微信${goodstype === 'WX_COUPON' ? '立减金' : '代金券'}批次ID`} />
              )}
            </FormItem>
          </Row>
        } */}
        {
          goodstype === 'TG_COUPON' && (
            <Row>
              <FormItem label='优惠券ID'>
                {getFieldDecorator( 'externalId', {
                  initialValue: ( isAdd ? '' : externalId ) || '',
                  rules: [
                    { required: true, message: `请输入优惠券ID` },
                  ],
                } )(
                  <Input style={{ width: 300 }} placeholder='请输入优惠券ID' />
                )}
              </FormItem>
            </Row>
          )
        }
        {
          goodstype === 'JN_RIGHT' && (
            <Row>
              <FormItem label='绩牛权益选择'>
                {getFieldDecorator( 'externalId', {
                  initialValue: ( isAdd ? '' : externalId ) || '',
                  rules: [
                    { required: true, message: `请选择绩牛权益` },
                  ],
                } )(
                  <Select
                    placeholder='请选择绩牛权益'
                    showSearch
                    allowClear
                    filterOption={false}
                    onChange={( e )=>{
                      if( e===undefined ){
                        this.getJnRightList()
                      }
                      }
                    }
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    onSearch={this.debouncedOnSearch}
                    style={{ width: '40%' }}
                  >
                    {jnRightList.map( ( item )=>{
                      return <Option key={item.id} value={String( item.id )}>{item.name}</Option>
                    } )}
                  </Select>
                )}
              </FormItem>
            </Row>
          )
        }
        <Row>
          <FormItem label='是否上架'>
            {getFieldDecorator( 'status', {
              valuePropName: 'checked',
              initialValue: isAdd ? true : !!status,
              rules: [{ required: true }],
            } )(
              <Switch />
            )}
          </FormItem>
        </Row>
      </>
    )
  }

  // 商品详情
  renderGoodsDetail = () => {
    const { form: { getFieldDecorator }, isAdd, goodsInfo } = this.props
    const {
      instructions, // 使用说明
      description, // 商品描述
    } = goodsInfo

    return (
      <>
        <Row>
          <FormItem label='使用说明'>
            {getFieldDecorator( 'instructions', {
              initialValue: isAdd ? '' : instructions,
            } )(
              <BraftEditor
                placeholder='请输入使用说明'
                record={isAdd ? '' : instructions}
                fieldDecorator={getFieldDecorator}
                field="instructions"
              />
            )}
          </FormItem>
        </Row>
        <Row>
          <FormItem label='商品描述'>
            {getFieldDecorator( 'description', {
              initialValue: isAdd ? '' : description,
            } )(
              <BraftEditor
                placeholder='请输入商品描述'
                record={isAdd ? '' : description}
                fieldDecorator={getFieldDecorator}
                field="description"
              />
            )}
          </FormItem>
        </Row>
      </>
    )
  }

  // 其他设置
  renderGoodsTypeToOther = () => {
    const { form: { getFieldDecorator, getFieldValue }, isAdd, goodsInfo } = this.props;
    const {
      customApi, // 自定义API
      customApiKey, // 自定义秘钥
      extendParams, // 自定义参数
      exchangeLink,
    } = goodsInfo
    const goodstype = getFieldValue( 'type' );
    return (
      <>
        {
          goodstype === 'CUSTOM' &&
          <>
            <Row>
              <FormItem label='自定义API'>
                {getFieldDecorator( 'customApi', {
                  initialValue: isAdd ? '' : customApi,
                } )(
                  <Input style={{ width: 350 }} placeholder='请输入发放接口' />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label='自定义参数'>
                {getFieldDecorator( 'extendParams', {
                  initialValue: isAdd ? '' : extendParams,
                } )(
                  <Input style={{ width: 350 }} placeholder='请输入业务参数' />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label='自定义秘钥'>
                {getFieldDecorator( 'customApiKey', {
                  initialValue: isAdd ? '' : customApiKey,
                  rules: [{ pattern: new RegExp( /^[A-Za-z0-9]{8}$/ ), message: '请输入正确密钥，由八位字母和数字组成' }],
                } )(
                  <Input style={{ width: 350 }} placeholder='请输入密钥' />
                )}
                <Button onClick={() => this.getApiKey()} style={{ marginLeft: 15 }} type='primary'>生成密钥</Button>
              </FormItem>
            </Row>
            <Row>
              <FormItem label='使用链接'>
                {getFieldDecorator( 'exchangeLink', {
                  initialValue: isAdd ? '' : exchangeLink,
                } )(
                  <Input style={{ width: 350 }} placeholder='请输入使用链接' />
                )}
              </FormItem>
            </Row>
          </>
        }
        {
          goodstype === 'COUPON' &&
          <Row>
            <FormItem label='兑换链接'>
              {getFieldDecorator( 'exchangeLink', {
                initialValue: isAdd ? '' : exchangeLink,
              } )(
                <Input style={{ width: 350 }} placeholder='请输入商品兑换链接' />
              )}
            </FormItem>
          </Row>
        }
      </>
    )
  }

  // 底部按钮组，编辑可直接保存，新增需判断到达最后一个tab，个别商品类型其他设置无内容则隐藏
  renderFooter = ( isAdd ) => {
    const { loading, handleEditOrAddModalVisible } = this.props;
    const { showOtherConfig } = this.state;
    let footer = [
      <Button key="back" onClick={() => { this.setState( { currentTab: 'basic' } ); handleEditOrAddModalVisible( isAdd ) }}>取消</Button>,
      <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmitMyForm}>确定</Button>
    ]
    if ( isAdd ) {
      if ( showOtherConfig ) {
        footer = [
          <Button key="back" onClick={() => { this.setState( { currentTab: 'basic' } ); handleEditOrAddModalVisible( isAdd ) }}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={( e ) => this.nextStep( e )}>{this.state.currentTab === 'other' ? '确定' : '下一步'}</Button>
        ]
      } else if ( this.state.currentTab === 'detail' ) {
        footer = [
          <Button key="back" onClick={() => { this.setState( { currentTab: 'basic' } ); handleEditOrAddModalVisible( isAdd ) }}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmitMyForm}>确定</Button>
        ]
      } else {
        footer = [
          <Button key="back" onClick={() => { this.setState( { currentTab: 'basic' } ); handleEditOrAddModalVisible( isAdd ) }}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={( e ) => this.nextStep( e )}>{this.state.currentTab === 'other' ? '确定' : '下一步'}</Button>
        ]
      }
    }
    return ( footer )
  }

  render() {
    const {
      form: { getFieldValue },
      editOrAddVisible,
      handleEditOrAddModalVisible,
      isAdd,
      editLoading,
      loading,
      classifyList
    } = this.props
    const { cid } = this.props.goodsInfo;
    const fliterList = this.fliterclassifyList( classifyList )
    const mySortId = this.handleFindParentId( fliterList, cid )
    // const goodstype = getFieldValue( 'type' );
    // let showOtherConfig
    // if ( goodstype === 'COUPON' || goodstype === 'CUSTOM' ) { showOtherConfig = true } else { showOtherConfig = false }
    return (
      <Modal
        className={newStyles.global_styles}
        width={1120}
        bodyStyle={{ paddingTop: 0 }}
        title={isAdd ? '新增' : '编辑'}
        visible={editOrAddVisible}
        onCancel={() => { this.setState( { currentTab: 'basic' } ); handleEditOrAddModalVisible( isAdd ) }}
        onOk={this.handleSubmitMyForm}
        maskClosable={false}
        destroyOnClose
        centered
        footer={this.renderFooter( isAdd )}
      >
        <Spin spinning={editLoading || loading}>
          <Form {...this.formItemLayout} onSubmit={this.handleSubmitMyForm}>
            <Tabs activeKey={this.state.currentTab} onTabClick={( e ) => this.onTabClick( e )}>
              <TabPane tab="基本信息" key="basic">
                <div className={styles.tab_container}>
                  {this.renderGoodsBasic( this.props.goodsInfo, fliterList, mySortId )}
                </div>
              </TabPane>
              <TabPane tab="商品详情" key="detail">
                <div className={styles.tab_container}>
                  {this.renderGoodsDetail()}
                </div>
              </TabPane>
              {/* {showOtherConfig &&
                <TabPane tab="其他设置" key="other">
                  <div className={styles.tab_container}>
                    {this.renderGoodsTypeToOther()}
                  </div>
                </TabPane>
              } */}
            </Tabs>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default SingleGoodsEditOrAdd;

/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { Button, Popconfirm, message, Modal, Form, Row, Input, Upload, Spin, Tooltip, Icon } from 'antd'
import debounce from "lodash/debounce";
import SingleGoodsApply from './SingleGoodsApply/SingleGoodsApply'
import SingleGoodsDetail from './SingGoodsDetail/SingGoodsDetail'
import CouponManage from './CouponManage/CouponManage'
import SaleDetail from './SaleDetail';
import styles from './SingleGoods.less'

const FormItem = Form.Item

@connect( ( { equityGoods } ) => {
  return {
    ...equityGoods
  }
} )
@Form.create()
class SingleGoods extends PureComponent {
  constructor( props ) {
    const couponListAuthority = ( window.localStorage.getItem( 'JINIU-CMS-authority' ) || [] ).includes( 'VOUCHER_LIST' );
    super( props );
    this.state = {
      // 商品补仓
      resplenishVisible: false,

      // 立即申请模块显隐
      applyFormVisible: false,

      // 详情模块显隐
      detailVisible: false,
      isImportLoading: false,
      fileList: [],
      fileFormdata: '',
      fileId: '',
      saleDetailVisible: false,
      saleDetailData: [],
      couponManageVisible: false,
      couponListAuthority,
    }

    this.fetchCouponResplenish = debounce( this.fetchCouponResplenish.bind( this ), 700 )
    this.fetchGoodsApply = debounce( this.fetchGoodsApply.bind( this ), 700 )
    this.fetchGoodsDownShelf = debounce( this.fetchGoodsDownShelf.bind( this ), 700 )
    this.fetchGoodsResplenish = debounce( this.fetchGoodsResplenish.bind( this ), 2000 )
    this.fetchResplenishTemplate = debounce( this.fetchResplenishTemplate.bind( this ), 700 )
  }

  // 字数限制
  limitWords = txt => {
    let newStr
    const len = txt.length
    if ( len > 12 ) {
      newStr = `${txt.slice( 0, 12 )}...`
      return newStr
    }
    return txt
  }

  getSaleDetail = () => {
    const { goodsInfo, dispatch } = this.props;
    dispatch( {
      type: 'equityGoods/getPreSaleDetail',
      payload: { productId: goodsInfo.id },
      callBackFunc: ( res ) => {
        this.setState( {
          saleDetailData: res.result,
          saleDetailVisible: true
        } )
      }
    } )
  }

  handleSaleDetailVisible = () => {
    this.setState( {
      saleDetailVisible: !this.state.saleDetailVisible,
    } )
  }

  // 下架商品确认
  handleConfirm = ( id, status ) => {
    if ( status ) {
      this.fetchGoodsDownShelf( id, 0 )
    } else {
      this.fetchGoodsDownShelf( id, 1 )
    }
  }

  // 调用下架商品接口
  fetchGoodsDownShelf = ( id, status ) => {
    const { dispatch, getGoodsList } = this.props
    dispatch( {
      type: 'equityGoods/fetchGoodsDownShelf',
      payload: {
        productId:id, status
      },
      callBackFunc: ( res ) => {
        if ( res.success ) {
          // eslint-disable-next-line no-unused-expressions
          status ? message.success( '上架商品成功' ) : message.success( '下架商品成功' )
          getGoodsList( 1 )
        }
      }
    } )
  }

  // 权益申请接口调用
  fetchGoodsApply = params => {
    const { dispatch, getGoodsList } = this.props
    const { productType } = params
    dispatch( {
      type: 'equityGoods/fetchGoodsApply',
      payload: {
        ...params
      },
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.handleApplyModalVisible( productType )
          getGoodsList( 1 )
        }
      }
    } )
  }

  // 补仓接口调用
  fetchGoodsResplenish = ( params ) => {
    const { dispatch, getGoodsList } = this.props
    dispatch( {
      type: 'equityGoods/fetchGoodsResplenish',
      payload: params,
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.handleResplenishVisible()
          getGoodsList( 1 )
        }
      }
    } )
  }

  // 卡密的补仓接口 - 文件上传调用
  fetchCouponResplenish = ( params ) => {
    const { isImportLoading } = this.state
    const { dispatch, getGoodsList } = this.props
    const { id, formData } = params
    dispatch( {
      type: 'equityGoods/fetchCouponResplenish',
      payload: {
        id,
        file: formData
      },
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.handleResplenishVisible()
          getGoodsList( 1 )
        }
        this.setState( { isImportLoading: false, fileList: [], fileFormdata:'' } );
      }
    } )
  }

  // 下载模版地址
  fetchResplenishTemplate = () => {
    window.open( 'https://xdtx-new-oss-cdn.cindasc.com/xlgj/excel/卡密导入模板.xlsx' )
  }

  // 补仓确认
  handleResplenishConfirm = ( { id, type } ) => {
    const { form: { validateFields } } = this.props
    const params = {
      id,
      type,
    }
    validateFields( ( err, values ) => {
      const { count, unlimitedStock } = values
      if ( !err?.count ) {
        params.count = Number( count )
        if ( type === 'CUSTOM' && unlimitedStock ) {
          message.warning( '当前商品无库存限制，无需补仓' )
        } else {
          this.fetchGoodsResplenish( params )
        }
      }
    } )
  }


  // 上传文件处理
  getImportOrder = ( params ) => {
    const { isImportLoading } = this.state
    const { id, res: { file } } = params
    if ( !file ) return
    const isLtM = ( file.size / 1024 / 1024 );
    if ( isLtM > 10 ) {
      message.error( `请上传小于10M的文件!` );
      return
    }
    const { lastModified, name } = file;
    this.setState( { isImportLoading: true } );
    const formData = new FormData();
    if ( lastModified ) {
      formData.append( "file", file ); // 文件对象
    } else {
      formData.append( "file", file, name );
    }
    this.setState( {
      fileList: [file],
      fileFormdata: formData,
      fileId: id
    } )
  };


  //  确认上传
  onUpload = () => {
    const { fileFormdata, fileId } = this.state
    if ( !fileFormdata ) {   
      message.error( '请上传文件!' )
      return
    }
    this.fetchCouponResplenish( { id: fileId, formData: fileFormdata } )
  }

  // 补仓模块控制
  handleResplenishVisible = ( isInfinity ) => {
    if ( isInfinity ) {
      message.warn( '当前商品无库存限制，无需补仓' )
      return
    }
    this.setState( {
      resplenishVisible: !this.state.resplenishVisible
    } )
  }

  // 详情模块控制
  handleDetailModalVisible = ( e ) => {
    this.setState( {
      detailVisible: !this.state.detailVisible
    } )
  }

  // 编辑 / 新增模块控制
  handleEditOrAddModalVisible = ( isAdd ) => {
    const { handleEditOrAddModalVisible } = this.props
    handleEditOrAddModalVisible( isAdd )
  }

  // 申请模块控制
  handleApplyModalVisible = () => {
    this.setState( {
      applyFormVisible: !this.state.applyFormVisible
    } )
  }

  // 补仓模块
  renderResplenishModal = () => {
    const { form: { getFieldDecorator, getFieldValue }, resplenishLoading, loading } = this.props
    const { isImportLoading } = this.state
    const { type, id, name } = this.props.goodsInfo
    const { resplenishVisible } = this.state
    const resplenishValue = getFieldValue( 'count' ) || 0 // 补仓值
    const resplenishUnit = ( type === 'RED' || type === 'WX_COUPON' || type==='JN_RED' ) ? '元' : '个' // 补仓值单位
    const needMoneyTipsVal = ['RED', 'WX_COUPON', 'JN_RED']

    // 需要展示金额的判断条件
    const needMoneyTipsCondition = needMoneyTipsVal.includes( type )


    // 补仓文案提示
    const resplenishTitle = type === 'COUPON' ?
      `确定为${name}补仓?` :
      `确定为${name}补仓${resplenishValue}${resplenishUnit}？`
    return (
      <Modal
        className={styles.global_styles}
        title='补仓'
        visible={resplenishVisible}
        onCancel={() => {
          this.handleResplenishVisible()
          this.setState( { fileList: [], fileFormdata:'' } )
        }}
        footer={
          <>
            <Button onClick={() => {
              this.setState( {
                fileList: [],
                fileFormdata:''
              } )
              this.handleResplenishVisible()
            }}
            >取消
            </Button>
            <Popconfirm
              title={resplenishTitle}
              onClick={e => e.stopPropagation()}
              onConfirm={( e ) => {
                if ( type === 'COUPON' ) {
                  this.onUpload()
                } else {
                  this.handleResplenishConfirm( { id, type } )
                }
              }}
              okText="是"
              cancelText="否"
            >
              <Button loading={loading}>确定</Button>
            </Popconfirm>
          </>
        }
        maskClosable={false}
        centered
        destroyOnClose
      >
        <div className={styles.current_good}>
          当前补仓商品：<div>{name}</div>
        </div>
        {
          type === 'COUPON' &&
          <Spin spinning={loading}>
            <div className={styles.download}>
              <span>下载导入模版，根据模版提示完善内容</span>
              <Button
                style={{ width: 160, borderRadius: 8 }}
                icon='block'
                onClick={this.fetchResplenishTemplate}
              >
                下载模版
              </Button>
            </div>
            <div className={styles.import}>
              <span>上传文件</span>
              <div className={styles.import_files}>
                <div />
                <Upload
                  fileList={this.state.fileList}
                  beforeUpload={( file ) => { this.setState( { fileList: [file] } ) }}
                  onRemove={() => this.setState( { fileList: [], fileFormdata:'' } )}
                  customRequest={( res ) => this.getImportOrder( { id, res } )}
                  accept='.xlsx,.xls'
                >
                  <Button icon='import' disabled={this.state.fileList.length === 1}>上传文件</Button>
                </Upload>
                <span>支持扩展名: .xls .xlsx</span>
              </div>
            </div>
          </Spin>}
        {
          type !== 'COUPON' &&
          <>
            <Row>
              <Spin spinning={resplenishLoading}>
                <FormItem style={{ display: 'flex' }} label={needMoneyTipsCondition ? <span>补仓金额</span> : <span>补仓数量</span>}>
                  {getFieldDecorator( 'count', {
                    rules: [{ required: true, message: needMoneyTipsCondition ? '请输入补仓金额' : '请输入补仓数量' }]
                  } )(
                    <Input style={{ width: 380 }} placeholder={needMoneyTipsCondition ? '请输入补仓金额' : '请输入补仓数量'} />
                  )}
                </FormItem>
              </Spin>
            </Row>
          </>
        }
      </Modal>
    )
  }

  // 跳转到消耗订单页面
  handleToConsumeOrder = () => {
    const { dispatch, goodsInfo } = this.props;
    const newGoodsInfo = {
      name: goodsInfo.name,
      type: goodsInfo.type
    }
    dispatch( routerRedux.push( {
      pathname: '/equitySupermarket/dataManage/consumeOrder', // 这个路由为要跳转的页面（在router.config中定义）
      query: { data: newGoodsInfo }
    } ) )
  }

  handleCouponManageVisible = () => {
    this.setState( { couponManageVisible: !this.state.couponManageVisible } )
  }

  numberFormat = str => {
    return String( Number( str ).toFixed( 2 ) ).toLocaleString()
  }

  // 单个商品的功能按钮hover页面
  renderHoverFunc = () => {
    const { couponListAuthority } = this.state;
    const { handleSetGoodsInfo, goodsInfo } = this.props
    const { type, id, status, unlimitedStock } = goodsInfo
    return (
      <div className={styles.operations}>
        {!!status &&
          <div>
            <div onClick={( e ) => {
              e.stopPropagation();
              this.handleApplyModalVisible( type )
            }}
            >
              {/* <img src={applyIcon} alt="" /> */}
              <Icon type="form" />
              <span> 申请</span>
            </div>
          </div>
        }
        <div>
          <div onClick={( e ) => {
            e.stopPropagation();
            handleSetGoodsInfo( goodsInfo, ()=>{this.handleEditOrAddModalVisible( false )} )
          }}
          >
            {/* <img src={editIcon} alt="" /> */}
            <Icon type="edit" />
            <span> 编辑</span>
          </div>
        </div>
        <div>
          <div onClick={( e ) => {
            e.stopPropagation()
            this.handleResplenishVisible( unlimitedStock )
          }}
          >
            {/* <img src={resplenishIcon} alt="" /> */}
            <Icon type="import" />
            <span> 补仓</span>
          </div>
        </div>
        <div>
          <div>
            <Popconfirm
              title={status ? "是否下架" : '是否上架'}
              onClick={e => e.stopPropagation()}
              onConfirm={( e ) => {
                e.stopPropagation()
                this.handleConfirm( id, status )
              }}
              onCancel={e => e.stopPropagation()}
              okText="是"
              cancelText="否"
            >
              <div>
                <Icon type={status ? "down-square" : "up-square"} />
                {/* <img src={status ? downShelfIcon : upShelfIcon} alt="" /> */}
                {status ? <span> 下架</span> : <span> 上架</span>}
              </div>
            </Popconfirm>
          </div>
        </div>
        <div>
          <div onClick={this.handleToConsumeOrder}>
            {/* <img src={detailIcon} alt="" /> */}
            <Icon type="file-text" />
            <span> 消耗明细</span>
          </div>
        </div>
        {
          type === 'COUPON' && couponListAuthority &&
          <div>
            <div onClick={this.handleCouponManageVisible}>
              <Icon type="account-book" />
              <span> 卡券管理</span>
            </div>
          </div>
        }
      </div>
    )
  }

  render() {
    const {
      itemWidth,
      isLast,
      merchantList,
      goodsInfo,
      handleEditOrAddModalVisible,
      editOrAddVisible,
      classifyList,
      loading
    } = this.props

    const {
      id, // 商品id
      exchangeLink, // 兑换链接
      img, // 商品图片
      name,  // 商品名称
      pageNum,
      price, // 销售价
      priceRatio, // 售价比
      status, // 商品状态 0:下架 1:上架
      type, // 商品类型  COUPON: 虚拟卡券 GOODS:实物 RED:现金红包 PHONE:话费充值,WX_COUPON:微信立减金
      stock, // 库存
      preApprovalCount, // 商品预售值
      unlimitedStock,
    } = goodsInfo
    const {
      applyFormVisible,
      detailVisible,
      isAdd,
      isImportLoading,
      couponManageVisible,
      couponListAuthority
    } = this.state

    const vacanciesArr = ['RED', 'WX_COUPON', 'JN_RED'] // 余额展示类型
    const stockTitle = vacanciesArr.includes( type ) ? '余额' : '库存'


    // 预售值
    const preApprovalCountValue = `：${vacanciesArr.includes( type ) ?
      this.numberFormat( preApprovalCount ) || 0 :
      String( preApprovalCount ).toLocaleString() || 0}`


    let stockValue = 0
    if ( unlimitedStock ) {
      stockValue = '：无限'
    } else {
      // eslint-disable-next-line no-lonely-if
      if ( vacanciesArr.includes( type ) ) {
        stockValue = `：${this.numberFormat( stock ) || 0}`
      } else {
        stockValue = `：${String( stock ).toLocaleString() || 0}`
      }
    }

    // 商品售价信息渲染
    const goodsSalesInfoView = (
      <div className={styles.goods_sales_info}>
        <div className={styles.num_div1}>
          <span className={styles.stock_border1}>{stockTitle}</span>
          {stockValue}
        </div>
        <div className={styles.num_div2}>
          <span
            className={styles.stock_border2}
            onClick={() => this.getSaleDetail()}
            style={{ cursor: 'pointer' }}
          >
            预售
          </span>
          {preApprovalCountValue}
        </div>
      </div>
    )

    // 商品售价/售价比渲染
    const priceView =
      type === 'RED' ?
        <div
          className={styles.red_price}
          title={this.numberFormat( price / 1 * 100 )}
          style={{ marginLeft: 20, marginTop: 2 }}
        >
          商户售价比：{this.numberFormat( price / 1 * 100 ) || 0}{`%`}
        </div> :
        <div
          className={styles.red_price}
          title={this.numberFormat( price )}
          style={{ marginLeft: 20, marginTop: 2 }}
        >
          商户定价：{( this.numberFormat( price ) ) || 0}元
        </div>

    return (
      <div className={styles.single_goods} style={{ width: itemWidth - 11, height: 1.2 * itemWidth, marginRight: 10 }}>
        <div className={styles.goods_card}>
          <div
            className={styles.goods_img}
            style={{ cursor: 'pointer' }}
            onClick={( e ) => {
              e.stopPropagation();
              this.handleDetailModalVisible()
            }}
          >
            <img src={img} alt="" />
          </div>
          {!status && <span>已下架</span>}
          <div className={styles.goods_info_container}>
            <Tooltip placement='topLeft' title={name}><div className={styles.goods_name}>{name || '-'}</div></Tooltip>
            {goodsSalesInfoView}
            <div className={styles.goods_bottom}>
              {/* {priceView} */}
              <Tooltip
                overlayClassName={styles.tool_tip}
                placement='rightBottom'
                title={() => this.renderHoverFunc()}
              >
                <Button style={{ width:'35px', }} icon='ellipsis' />
              </Tooltip>
            </div>
          </div>
        </div>
        {this.renderResplenishModal()}
        {/* 立即申请模块 */}
        <SingleGoodsApply
          applyType={type}
          filterSubmit={this.fetchGoodsApply}
          applyFormVisible={applyFormVisible}
          handleApplyModalVisible={this.handleApplyModalVisible}
          goodsInfo={this.props.goodsInfo}
          merchantList={merchantList}
        />
        {/* 商品详情 */}
        <SingleGoodsDetail
          classifyList={classifyList}
          detailVisible={detailVisible}
          handleApplyModalVisible={this.handleApplyModalVisible}
          handleDetailModalVisible={this.handleDetailModalVisible}
          goodsInfo={this.props.goodsInfo}
        />
        {/* 预售明细 */}
        <SaleDetail
          visible={this.state.saleDetailVisible}
          handleVisible={this.handleSaleDetailVisible}
          goodsInfo={goodsInfo}
          saleDetailData={this.state.saleDetailData}
        />
        {/* 卡券管理 */}
        {couponManageVisible && couponListAuthority &&
          <CouponManage
            visible={couponManageVisible}
            goodsInfo={goodsInfo}
            handleVisible={this.handleCouponManageVisible}
          />
        }
      </div>
    );
  }
}

export default SingleGoods;

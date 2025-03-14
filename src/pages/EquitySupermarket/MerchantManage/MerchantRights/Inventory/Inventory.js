import React, { PureComponent } from 'react';
import { Button, Popconfirm, message, Form, Tooltip } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import debounce from 'lodash/debounce'
import SingleGoodsApply from '@/pages/EquitySupermarket/EquityGoods/GoodsList/SingleGoods/SingleGoodsApply/SingleGoodsApply'
import InventoryDetail from './InventoryDetail';
import RollbackApply from './RollbackApplyModal';
import EditRatioModal from './EditRatioModal';
import styles from './Inventory.less'
import resplenishIcon from './assets/resplenish.svg'
import detailIcon from './assets/consumedetail.svg'
import freezeIcon from './assets/freeze.svg'
import rollbackIcon from './assets/rollback.svg'
// import ratioIcon from './assets/ratio.svg'

@connect( ( { merchantRights } ) => {
  return {
    ...merchantRights
  }
} )
@Form.create()
class Inventory extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      goodsInfo: {},
      withdrawInventoryVisible: false,
      editRatioModalVisible: false,
      // 立即申请模块显隐
      applyFormVisible: false,
    }
    this.fetchGoodsApply = debounce( this.fetchGoodsApply.bind( this ), 700 );
  }

  componentDidMount() { }

  // 唤醒对话框
  openModal = ( type ) => {
    if ( type === "withdraw" ) {
      this.setState( { withdrawInventoryVisible: true } )
    } else if ( type === "ratio" ) {
      this.setState( { editRatioModalVisible: true } )
    } else if ( type === "detail" ) {
      this.setState( { inventoryDetailVisible: true } )
    }
  }

  fetchGoodsDetail = ( productId, merchantId ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'merchantRights/getGoodsDetail',
      payload: { id: productId },
      callFunc: ( res ) => {
        if ( res.success ) {
          this.setState( {
            goodsInfo: res.result
          }, () => {
            this.state.goodsInfo.merchantId = merchantId;
          } )
          this.handleApplyModalVisible( res.result.type )
        }
      }
    } )
  }

  // 申请模块控制
  handleApplyModalVisible = () => {
    this.setState( {
      applyFormVisible: !this.state.applyFormVisible
    } )
  }

  // 权益申请接口调用
  fetchGoodsApply = params => {
    const { dispatch } = this.props
    const { productType } = params
    dispatch( {
      type: 'merchantRights/fetchGoodsApply',
      payload: {
        ...params
      },
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
        }
      }
    } )
    this.handleApplyModalVisible( productType )
  }

  // 跳转消耗订单页面
  handleJump = ( inventoryInfo ) => {
    const { productName, productType, merchantId } = inventoryInfo;
    const goodsInfo = { merchantId, name: productName, type: productType }
    const { dispatch } = this.props;
    dispatch( routerRedux.push( {
      pathname: '/equitySupermarket/dataManage/consumeOrder', // 这个路由为要跳转的页面（在router.config中定义）
      query: { data: goodsInfo }
    } ) )
  }

  // 商户权益冻结
  lockItem = ( e ) => {
    e.stopPropagation()
    const { id, tradeStatus } = this.props.inventoryInfo
    const { dispatch, filterSubmit } = this.props;
    dispatch( {
      type: 'merchantRights/lockMerchantRights',
      payload: {
        id,
        tradeStatus
      },
      callFunc: ( text ) => {
        message.success( text );
        filterSubmit();
      }
    } )
  }

  handleCancel = () => {
    this.setState( {
      withdrawInventoryVisible: false,
      editRatioModalVisible: false,
      inventoryDetailVisible: false
    } );
  }

  numFormat = ( num ) => {
    const res = num.toString().replace( /\d+/, ( n ) => { // 先提取整数部分
      return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
        return `${$1},`;
      } );
    } )
    return res;
  }

  // 单个商品悬停显示页面
  renderHoverWrap = () => {
    const { inventoryInfo } = this.props
    const { productId, tradeStatus, merchantId } = inventoryInfo;

    return (
      <div className={styles.operations}>
        <div>
          <div onClick={( e ) => {
            e.stopPropagation();
            this.openModal( "withdraw" )
          }}
          >
            <img src={rollbackIcon} alt="" />
            <span> 回退</span>
          </div>
        </div>
        <div>
          <div onClick={( e ) => {
            e.stopPropagation()
            this.fetchGoodsDetail( productId, merchantId )
          }}
          >
            <img src={resplenishIcon} alt="" />
            <span> 补仓</span>
          </div>
        </div>
        <div>
          <Popconfirm
            title={tradeStatus !== "LOCK" ? "是否确认冻结？" : "是否解除冻结？"}
            style={{ zIndex: 9 }}
            onClick={e => e.stopPropagation()}
            onConfirm={( e ) => {
              this.lockItem( e )
            }}
            onCancel={e => e.stopPropagation()}
            okText="确定"
            cancelText="取消"
          >
            <div>
              <img src={freezeIcon} alt="" />
              {tradeStatus !== "LOCK" ? <><span> 冻结</span></> : <><span> 解除冻结</span></>}
            </div>
          </Popconfirm>
        </div>
        <div>
          <div onClick={() => this.handleJump( inventoryInfo )}>
            <img src={detailIcon} alt="" />
            <span> 消耗明细</span>
          </div>
        </div>
        {/* TODO 商户定价显示 */}
        {/* <div>
          <div onClick={(e) => {
            e.stopPropagation();
            this.openModal("ratio")
          }}>
            <img src={ratioIcon} alt="" />
            <span> 修改商户定价</span>
          </div>
        </div> */}
      </div>
    )
  }

  render() {
    const { merchantList, inventoryInfo, openFreezeDetailModal, itemWidth, isLast } = this.props
    const {
      inventory,
      lockCount,
      productImg,
      merchantName,
      productName,
      productType,
      weekSendCount,
      tradeStatus } = inventoryInfo

    const {
      goodsInfo,
      applyFormVisible
    } = this.state

    return (
      <>
        <div className={styles.single_goods} style={{ width: itemWidth - 24, height: 1.3 * itemWidth, marginRight: isLast ? 0 : 20 }}>
          <div className={styles.goods_card}>
            <div className={styles.merchant_name}>{merchantName}</div>
            <div className={styles.lock_inventory} style={{ display: tradeStatus === "LOCK" ? "block" : "none" }}>已冻结</div>
            <div
              className={styles.goods_img}
              style={{ opacity: tradeStatus === "LOCK" ? "0.3" : "1" }}
              onClick={() => { this.openModal( 'detail' ) }}
            >
              <img src={productImg} alt="" />
            </div>
            <div>
              <Tooltip placement='topLeft' title={productName}><div className={styles.goods_name}>{productName || '-'}</div></Tooltip>
              <div className={styles.goods_sales_info}>
                <div className={styles.goods_top_info}>
                  <div>
                    <span className={styles.goods_sales_info_item}>{( productType === 'RED' || productType === 'WX_COUPON' || productType==='JN_RED' ) ? '余额' : '库存'}</span>
                    {inventory && ( productType === 'RED' || productType === 'WX_COUPON' || productType==='JN_RED' ) ? this.numFormat( inventory.toFixed( 2 ) ) : this.numFormat( inventory )}
                  </div>
                  <div>
                    <span className={styles.goods_sales_info_item} style={{ cursor: 'pointer' }} onClick={() => openFreezeDetailModal( inventoryInfo )}>冻结明细</span>
                  </div>
                </div>
                <div className={styles.goods_bottom_info}>
                  {/* TODO 商户定价显示 */}
                  {/* <span>商户定价：{(sellPrice && this.numFormat(sellPrice)) || '-'} 元</span> */}
                  <span>近7天消耗：{( weekSendCount && this.numFormat( weekSendCount ) ) || '-'}</span>
                  <Tooltip
                    overlayClassName={styles.tool_tip}
                    placement='rightBottom'
                    title={() => this.renderHoverWrap()}
                  >
                    <Button icon='ellipsis' />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 补仓申请模块 */}
        <SingleGoodsApply
          filterSubmit={this.fetchGoodsApply}
          applyFormVisible={applyFormVisible}
          handleApplyModalVisible={this.handleApplyModalVisible}
          goodsInfo={goodsInfo}
          applyType={productType}
          merchantList={merchantList}
          isMerchantDisable
        />
        {/* 回退申请 */}
        <RollbackApply
          numFormat={this.numFormat}
          visible={this.state.withdrawInventoryVisible}
          handleCancel={this.handleCancel}
          inventoryInfo={inventoryInfo}
        />
        {/* 修改商户定价 */}
        <EditRatioModal
          merchantList={merchantList}
          visible={this.state.editRatioModalVisible}
          handleCancel={this.handleCancel}
          inventoryInfo={inventoryInfo}
        />
        {/* 权益详情 */}
        <InventoryDetail
          visible={this.state.inventoryDetailVisible}
          handleCancel={this.handleCancel}
          inventoryInfo={inventoryInfo}
          merchantList={merchantList}
        />
      </>
    );
  }
}

export default Inventory;

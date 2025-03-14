/* eslint-disable react/no-danger */

import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Button, Modal, Form, Tooltip, Icon } from 'antd'
import styles from './SingleGoodsDetail.less'

@connect()
@Form.create()
class SingleGoodsDetail extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {}
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

  numberFormat = str => {
    return String( Number( str ).toFixed( 2 ) ).toLocaleString()
  }

  // 寻找分类id对应名称
  handleFindParentIdToName = ( list = [], childrenId ) => {
    let name = ''
    const goodsFullClass = []
    if ( !list.length ) return ''
    list.forEach( ( item ) => {
      if ( item.id === childrenId ) {
        goodsFullClass.push( item.name )
      }
      if ( item.categoryChildren && item.categoryChildren.length ) {
        item.categoryChildren.forEach( ( v ) => {
          if ( v && v.id === childrenId ) {
            goodsFullClass.push( item.name )
            goodsFullClass.push( v.name )
          }
        } )
      }
    } )

    name = goodsFullClass.length === 2 ? `${goodsFullClass[0]}/${goodsFullClass[1]}` : goodsFullClass[0]

    return name
  }

  // 申请模块显隐控制
  handleApplyModalVisible = () => {
    const { handleDetailModalVisible, handleApplyModalVisible } = this.props
    handleDetailModalVisible()
    handleApplyModalVisible()
  }

  render() {
    const { detailVisible, handleDetailModalVisible, classifyList } = this.props

    const {
      id, // 商品id
      img,
      marketPrice, // 市场价
      name,  // 商品名称
      price, // 销售价
      description, // 商品描述
      status, // 商品状态上下架
      type, // 商品类型    COUPON: 虚拟卡券 GOODS:实物 RED:现金红包 PHONE:话费充值
      cid,
      stock, // 库存
      instructions, // 使用说明
      unlimitedStock,
    } = this.props.goodsInfo

    const decriptionToType = {
      COUPON: '当前库存',
      GOODS: '当前库存',
      RED: '余额',
      PHONE: '当前库存',
      CUSTOM: '当前库存',
      WX_COUPON: '余额',
      WX_VOUCHER: '库存',
      RIGHT_PACKAGE: '当前库存',
      TG_COUPON: '当前库存',
      JN_RED:'余额',
      JN_RIGHT:'当前库存',
    }

    const priceToType = {
      COUPON: '元',
      GOODS: '元',
      RED: '%',
      PHONE: '元',
      CUSTOM: '元',
      WX_COUPON: '元',
      WX_VOUCHER: '元',
      RIGHT_PACKAGE: '元',
    }

    const titleToType = {
      COUPON: '详情 - 虚拟卡券',
      GOODS: '详情 - 实物',
      RED: '详情 - 现金红包',
      PHONE: '详情 - 直充',
      CUSTOM: '详情 - 自定义商品',
      RIGHT_PACKAGE: '详情 - 权益包',
      WX_COUPON: '详情 - 微信立减金',
      WX_VOUCHER: '详情 - 微信代金券',
    }

    const stockCalcValue = ( type === 'RED' || type === 'WX_COUPON' ) ? this.numberFormat( stock ) : stock || 0
    const stockValue = unlimitedStock ? '无限' : stockCalcValue

    return (
      <Modal
        className={styles.global_styles}
        title={titleToType[type]}
        visible={detailVisible}
        width={680}
        onCancel={() => handleDetailModalVisible()}
        footer={
          <div className={styles.detail_footer}>
            <Button onClick={() => handleDetailModalVisible()}>返回</Button>
            {!!status && <Button onClick={() => this.handleApplyModalVisible()}>立即申请</Button>}
          </div>
        }
        maskClosable={false}
        centered
      >
        <div className={styles.single_details}>
          <div className={styles.single_base_info}>
            <div
              className={styles.goods_cover}
              style={{ backgroundImage: `url(${img || ''})` }}
            />
            <div>
              <span>商品编号：<a>{id}</a> </span>
              <span>商品名称：<a>{this.limitWords( name )}</a> </span>
              <span>所属分类：<a>{this.handleFindParentIdToName( classifyList, cid )}</a> </span>
              <span>{`${decriptionToType[type]}：`}
                <a>{stockValue}</a>
              </span>
              {/* <span>{type === 'RED' ? `售价比：` : `售价：`}<a>{type === 'RED' ? this.numberFormat( price / 1 * 100 ) : this.numberFormat( price )}</a>{`${priceToType[type]}`}
                {( type !== 'RED' && type !== 'WX_COUPON' && type !== 'WX_VOUCHER' ) &&
                  <span style={{ marginLeft: 12, textDecoration: 'line-through' }}>市场价：{this.numberFormat( marketPrice ) || '-'}元</span>
                }
                {
                  type === 'RED' &&
                  <Tooltip placement="topLeft" title={<sapn>例：用户到账金额100元，实际销售费用为100 * 该售价比 </sapn>}>
                    <Icon style={{ marginLeft: 12 }} type="question-circle" theme="filled" />
                  </Tooltip>
                }
              </span> */}
            </div>
          </div>
          <div className={styles.base_description}>
            <span>商品描述:</span>
            <div className={styles.description_box} dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <div className={styles.base_description}>
            <span>使用说明:</span>
            <div dangerouslySetInnerHTML={{ __html: instructions }} />
          </div>
        </div>
      </Modal>
    );
  }
}

export default SingleGoodsDetail;

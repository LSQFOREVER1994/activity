import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Modal, Form, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './Inventory.less';

@connect()
@Form.create()
class InventoryDetail extends PureComponent {
	constructor( props ) {
		super( props );
		this.state = {
			isCopy: false,
		}
	}

	// 名称字数限制
	limitWords = ( txt ) => {
		let newStr
		const len = txt.length
		if ( len > 24 ) {
			newStr = `${txt.slice( 0, 24 )}...`
			return newStr
		}
		return txt
	}

	// 千分符
	numFormat = ( num ) => {
		const res = num.toString().replace( /\d+/, ( n ) => {
			return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
				return `${$1},`;
			} );
		} )
		return res;
	}

	// 复制提示
	copyTip = () => {
		const { isCopy } = this.state;
		if ( isCopy ) return;
		this.setState( {
			isCopy: true
		}, () => {
			message.success( '复制成功' );
			setTimeout( () => {
				this.setState( { isCopy: false } );
			}, 1000 )
		} )
	}

	render() {
		const { visible, handleCancel, inventoryInfo } = this.props;
		const { productName, productType, productImg, productId, merchantCode, inventory, sendCount, weekSendCount, tradeStatus, merchantName } = inventoryInfo;
		const wordsToSort = {
			COUPON: '虚拟卡券',
			GOODS: '实物',
			RED: '现金红包',
			PHONE: '话费充值',
			CUSTOM: '自定义商品',
			RIGHT_PACKAGE: '权益包',
			WX_COUPON: '微信立减金',
			WX_VOUCHER: '微信代金券',
			TG_COUPON: '投顾卡券',
      JN_RED:'绩牛红包',
      JN_RIGHT:'绩牛权益',
		}
		const wordsToStatus = {
			NORMAL: '可用',
			LOCK: '已冻结'
		}

		return (
  <Modal
    title={`权益详情 - ${productName}`}
    width={600}
    destroyOnClose
    visible={visible}
    className={styles.global_styles}
    onCancel={handleCancel}
    footer={[<Button key={`${merchantCode}_${productId}`} type="primary" onClick={handleCancel}>确定</Button>]}
  >
    <div className={styles.inventory_detail}>
      <div className={styles.detail_img}>
        <img src={productImg} alt={productName} />
      </div>
      <div className={styles.detail_desc}>
        <span>商品ID：<a>{productId}</a>
          <CopyToClipboard text={productId}><Button type="default" icon="copy" onClick={() => { this.copyTip() }} /></CopyToClipboard>
        </span>
        <span>商品名称：<a>{this.limitWords( productName )}</a></span>
        <span>商品类型：<a>{wordsToSort[productType]}</a></span>
        <span>所属商户：<a>{merchantName}</a></span>
        <span>
          {( productType === 'RED' || productType === 'WX_COUPON' || productType==='JN_RED' ) ? '余额：' : '库存：'}
          <a>{inventory && ( productType === 'RED' || productType === 'WX_COUPON' || productType==='JN_RED' ) ? this.numFormat( inventory.toFixed( 2 ) ) : this.numFormat( inventory )}</a>
        </span>
        <span>总消耗量：<a>{( productType === 'RED' || productType === 'WX_COUPON' || productType==='JN_RED' ) ? this.numFormat( sendCount.toFixed( 2 ) ) : this.numFormat( sendCount )}</a></span>
        <span>七天内消耗量：<a>{( ( productType === 'RED' || productType === 'WX_COUPON' || productType==='JN_RED' ) ? this.numFormat( weekSendCount.toFixed( 2 ) ) : this.numFormat( weekSendCount ) )}</a></span>
        <span>权益状态：<a>{wordsToStatus[tradeStatus]}</a></span>
      </div>
    </div>
  </Modal>
		)
	}
}

export default InventoryDetail;

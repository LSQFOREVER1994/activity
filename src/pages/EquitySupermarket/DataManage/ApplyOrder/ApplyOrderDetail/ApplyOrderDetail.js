/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'dva';
import comStyles from '../applyOrderList.less'
import styles from './ApplyOrderDetail.less'

@connect( ( { applyOrder } ) => {
  return {
    ...applyOrder
  }
} )
class ApplyOrderDetail extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {}
  }

  numberFormat = str => {
    return String( Number( str ).toFixed( 2 ) ).toLocaleString()
  }

  group = ( array, subGroupLength ) => {
    let index = 0;
    const newArray = [];
    while ( index < array?.length ) {
      newArray.push( array.slice( index, index += subGroupLength ) );
    }
    return newArray;
  }

  renderMapTable = ( list = {} ) => {
    const { detailData } = this.props
    const { productType, type } = detailData
    const isArray = Array.isArray( list )
    const noPlusMapLength = isArray ? !list?.length  : !Object.keys( list )?.length
    if ( noPlusMapLength ) return null
    let newlist = []
    if ( productType === 'RED' || type === 'RED' ) {
      // eslint-disable-next-line no-restricted-syntax
      for ( const [money, num] of Object.entries( list ) ) {
        newlist.push( { money, num } )
      }
    }

    if ( productType === 'WX_COUPON' || type === 'WX_COUPON' ) {
      // eslint-disable-next-line no-restricted-syntax
      newlist = list
    }

    if ( productType === 'PHONE' || type === 'PHONE' ) {
      newlist = this.group( list, 3 )
    }
    return (
      <table border='1' cellPadding={( productType === 'PHONE' || type === 'PHONE' ) ? 4 : 8}>
        <tbody>
          {( productType === 'RED' || type === 'RED' ) &&
            <>
              <tr>
                <th>金额</th>
                <th>数量</th>
              </tr>
              {
                newlist && newlist.map( ( item ) => {
                  return (
                    <tr key={item.money}>
                      <td>{item.money}元</td>
                      <td>{item.num}个</td>
                    </tr>
                  )

                } )
              }
            </>
          }
          {
            ( productType === 'WX_COUPON' || type === 'WX_COUPON' ) &&
            <>
              <tr>
                <th>满</th>
                <th>减</th>
                <th>数量</th>
              </tr>
              {
                newlist && newlist?.map( ( item ) => {
                  return (
                    <tr key={item.amount}>
                      <td>{item.minimum}元</td>
                      <td>{item.amount}元</td>
                      <td>{item.count}个</td>
                    </tr>
                  )

                } )
              }
            </>
          }
          {
            ( productType === 'PHONE' || type === 'PHONE' ) &&
            <>
              {
                newlist && newlist.map( ( item ) => {
                  return (
                    <tr key={item}>
                      {
                        item && item.map( v => {
                          return <td key={v} align='center'>{v}</td>
                        } )
                      }
                    </tr>
                  )
                } )
              }
            </>
          }
        </tbody>
      </table>
    )
  }

  render() {
    const {
      filterSubmit,
      handleModalVisible,
      applyOrderDetailVisible,
      type,
      fetchEquitySend,
      detailData,
      handleDetailButton,
    } = this.props;

    const {
      id,
      createStart, // 申请开始时间
      createEnd,  // 申请结束时间
      createName, // 申请人
      amount, // 申请数量
      auditStatus, // 审核状态
      auditTime, // 审核时间
      auditUsername, // 审核人
      createTime, // 创建时间
      createUsername, // 创建人
      stock, // 库存
      preApprovalCount, // 预售量
      price, // 价格
      email, // 邮箱
      expireDays, // 过期天数
      expireTime, // 过期时间
      merchantCode, // 商户编码
      merchantName, // 商户名称
      merchantId, // 商户id
      productId, // 商品id
      productName, // 商品名称
      productType, // 商品类型 Available values : COUPON, GOODS, RED, PHONE
      reason,  // 申请理由
      sellPriceRatio, // 售价比
      sendEmail, // 是否发送邮箱
      totalMoney, // 总金额
      waterNo, // 订单编号
      cancelReason, // 取消理由
      rejectReason, // 驳回理由
      marketPrice, // 市场价
      contractMoney, // 合同费用
      cancelTime, // 取消时间
      thirdPartyId, // 第三方外部订单id
      plus, // ? 该对象包含describe, amountMap, redeemRestrict
      describe, // 红包描述
      redeemRestrict, // 领取上限数据，
      amountMap, // 红包具体数据
      mobileList, // 充值手机具体数据
      redPacketType, // 红包类型 FIX:固定 RANDOM：随机（暂时不可用）
      sendType, // 发送类型
      externalId, // wx立减金的批次id
      unlimitedStock, // 是否无限库存
      sendCode, // 邮箱发送类型 兑换码 / 实际卡密
    } = detailData

    const wordsToType = {
      COUPON: '虚拟卡券',
      GOODS: '实物',
      RED: '现金红包',
      PHONE: '直充',
      CUSTOM: '自定义商品',
      RIGHT_PACKAGE: '权益包',
      WX_COUPON: '微信立减金',
      WX_VOUCHER: '微信代金券',
      TG_COUPON: '投顾卡券',
      JN_RED:'绩牛红包',
      JN_RIGHT:'绩牛权益',
    }

    const wordToStatus = {
      PENDING: '待审核',
      REJECT: '审核失败',
      WAITSENT: '待发送',
      FINISH: '已完成',
      CANCELED: '已取消'
    }

    const wordToSendType = {
      DIRECT: '代充',
      EMAIL: '邮箱发送',
      ADVANCE: '预申请',
    }

    const stockValue = unlimitedStock ? '无限' : this.numberFormat( stock || 0 )
    const applyNum = ( productType === 'RED' || productType === 'WX_COUPON' || productType === 'JN_RED'  ) ? `${this.numberFormat( totalMoney )} 元` : `${Number( amount || 0 ).toLocaleString()} 个`

    return (
      <Modal
        className={comStyles.global_styles}
        title='申请订单/订单详情'
        visible={applyOrderDetailVisible}
        style={{ height: 900 }}
        width={900}
        onCancel={() => { handleModalVisible( 'COUPON' ) }}
        centered
        maskClosable={false}
        footer={
          <div className={comStyles.operate_container}>
            {
              auditStatus === 'PENDING' &&
              <>
                <Button onClick={() => handleModalVisible( 'COUPON' )}>返回</Button>
                <Button onClick={() => handleDetailButton( 'access', detailData )}>同意</Button>
                <Button onClick={() => handleDetailButton( 'reject', detailData )}>驳回</Button>
                <Button onClick={() => handleDetailButton( 'cancel', detailData )}>取消 </Button>
              </>
            }
            {
              auditStatus === 'WAITSENT' &&
              <>
                <Button onClick={() => handleModalVisible( 'COUPON' )}>返回</Button>
                <Button onClick={() => handleDetailButton( 'sendEmail', detailData )}>发送</Button>
              </>
            }
            {
              auditStatus === 'FINISH' &&
              <>
                <Button onClick={() => handleModalVisible( 'COUPON' )}>返回</Button>
                {
                  sendEmail && <Button onClick={() => handleDetailButton( 'sendEmail', detailData )}>再次发送</Button>
                }
              </>
            }
            {
              ( auditStatus === 'REJECT' || auditStatus === 'CANCELED' ) &&
              <>
                <Button onClick={() => handleModalVisible( 'COUPON' )}>返回</Button>
              </>
            }
          </div>
        }
      >
        <div className={styles.info_modal}>
          {/* 申请信息 */}
          <div className={styles.info_container}>
            <div className={styles.title}>
              <span>申请信息</span>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <div>
                  订单编号：<span>{waterNo || '-'}</span>
                </div>
                <div>
                  申请人：<span>{createUsername || '-'}</span>
                </div>
                <div>
                  商户名称：<span>{merchantName || '-'}</span>
                </div>
                <div>
                  申请理由：<span style={{ width: '80%' }}>{reason || '-'}</span>
                </div>
                {/* {
                  ( expireTime || sendCode ) && (
                    <div>
                      过期时间：<span>{expireTime}</span>
                    </div>
                  )
                } */}

                {thirdPartyId &&
                  <div>
                    提取单号：<span>{thirdPartyId}</span>
                  </div>
                }
              </div>
              <div className={styles.column}>
                <div>
                  订单状态：<span>{wordToStatus[auditStatus]}</span>
                </div>
                <div>
                  申请时间：<span>{createTime || '-'}</span>
                </div>
                <div>
                  商户编号：<span>{merchantId || '-'}</span>
                </div>
                {sendEmail &&
                  <>
                    <div>
                      接收邮箱：<span>{email}</span>
                    </div>
                    {
                      productType !== 'GOODS' &&
                      <div>
                        邮箱发送类型：<span>{sendCode ? '兑换码' : '实际卡密'}</span>
                      </div>
                    }
                  </>
                }
              </div>
            </div>
          </div>

          {/* 商品信息 */}
          <div className={styles.info_container}>
            <div className={styles.title}>
              <span>商品信息</span>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <div>
                  商品名称：<span>{productName || '-'}</span>
                </div>
                <div>
                  商品编号：<span>{productId || '-'}</span>
                </div>
                {( productType === 'RED' || productType === 'WX_COUPON' ) && sendEmail &&
                  <>
                    {
                      expireTime ?
                        <div>
                          过期时间：<span>{expireTime || '-'}</span>
                        </div>
                        :
                        <div>
                          过期天数：<span>{`${expireDays} 天` || '-'}</span>
                        </div>
                    }
                  </>
                }
                {
                  productType === 'PHONE' && sendEmail &&
                  <div>
                    过期时间：<span>{expireTime || '-'}</span>
                  </div>
                }
                <div>
                  {/* 合计金额： <span>{`${totalMoney || 0} 元`}</span> */}
                </div>
                <div>
                  {( productType === 'RED' || productType === 'WX_COUPON'|| productType === 'JN_RED'  ) ? '余额：' : '库存：'}<span>{stockValue}</span>
                </div>
                {
                  productType === 'RED' && plus && sendEmail &&
                  <div style={{ margin: '12px 0' }}>
                    红包明细：{this.renderMapTable( plus?.amountMap )}
                  </div>
                }
                {
                  productType === 'WX_COUPON' && plus && sendEmail &&
                  <div style={{ margin: '12px 0' }}>
                    立减金明细：{this.renderMapTable( plus?.wxCoupons )}
                  </div>
                }
                {
                  productType === 'PHONE' && sendType === 'DIRECT' && plus &&
                  <div style={{ margin: '12px 0' }}>
                    <div style={{ width: '80px' }}>充值手机：</div>{this.renderMapTable( plus?.mobileList )}
                  </div>
                }
              </div>
              <div className={styles.column}>
                <div>
                  商品类型： <span>{wordsToType[productType]}</span>
                </div>
                {productType === 'WX_COUPON' &&
                  <div>
                    微信立减金批次ID：<span>{externalId || '-'}</span>
                  </div>
                }
                {productType === 'RED' && plus &&
                  <div>
                    红包描述：<span>{plus.describe || '-'}</span>
                  </div>
                }
                <div>
                  申请数量：<span>{applyNum}</span>
                </div>
                {
                  productType === 'PHONE' &&
                  <div>
                    充值类型：<span>{wordToSendType[sendType]}</span>
                  </div>
                }
                <div>
                  {/* 合同费用：<span>{this.numberFormat( contractMoney || 0 )} 元</span> */}
                </div>
                <div>
                  预售量：<span>{this.numberFormat( preApprovalCount || 0 )}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 审核信息 */}
          <div className={styles.info_container}>
            <div className={styles.title}>
              <span>审核信息</span>
            </div>
            <div className={styles.row}>
              {
                auditStatus !== 'CANCELED' &&
                <>
                  <div className={styles.column}>
                    <div>
                      审核人：<span>{auditUsername || '-'}</span>
                    </div>
                    <div>
                      审核时间：<span>{auditTime || '-'}</span>
                    </div>
                  </div>
                </>
              }
              <div className={styles.column}>
                {
                  auditStatus === 'CANCELED' &&
                  <>
                    <div>
                      取消理由：<span style={{ width: '80%' }}>{cancelReason || '-'}</span>
                    </div>
                    <div>
                      取消时间：<span>{cancelTime || '-'}</span>
                    </div>
                  </>
                }
                {
                  auditStatus === 'REJECT' &&
                  <>
                    <div>
                      驳回理由：<span style={{ width: '80%' }}>{rejectReason || '-'}</span>
                    </div>
                    <div>
                      驳回时间：<span>{auditTime || '-'}</span>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ApplyOrderDetail;

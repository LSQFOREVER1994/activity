import React, { useState } from 'react'
import { Modal, Descriptions, Timeline, Button, Divider, Empty, message } from 'antd';

const subsStateObj = {
  UNSUBSCRIBE: "未订阅",
  POLLING: "订阅中",
  FAILED: "订阅失败",
  ABORT: "订阅中止",
  SHUTDOWN: "订阅结束",
}

const stateObj = {
  0: "在途",
  1: "揽收",
  2: "疑难",
  3: "签收",
  4: "退签",
  5: "派件",
  8: "清关",
  14: "拒签",
  101: "已下单",
  102: "待揽收",
  103: "已揽收",
  1001: "到达派件城市",
  1002: "干线",
  1003: "转递",
  501: "投柜或驿站",
  301: "本人签收",
  302: "派件异常后签收",
  303: "代签",
  304: "投柜或站签收",
  401: "已销单",
  7: "转投",
  201: "超时未签收",
  202: "超时未更新",
  203: "拒收",
  204: "派件异常",
  205: "柜或驿站超时未取",
  206: "无法联系",
  207: "超区",
  208: "滞留",
  209: "破损",
  210: "销单",
  10: "待清关",
  11: "清关中",
  12: "已清关",
  13: "清关异常"
}

function LogisticsDetail( props ) {
  const { visible, onCancel, data, changeExpressSubscribe, editLogistics } = props;
  const [isClickSubscribe, setIsClickSubscribe] = useState( false );
  if ( !data ) return message.error( "订单缺少详情数据" );
  const { id, orderNo, expressNo, logisticsNo, expressMerchant, logisticsState, subscribeState, remark, reason, logisticsInfoJson } = data;
  const details = JSON.parse( logisticsInfoJson || '[]' );
  const renderTimeLine = () => {
    if ( !details.length ) return <Empty description="暂无物流信息" />
    return details.map( item => {
      const { status, time, context } = item;
      return (
        <Timeline.Item key={`${time}-${context}`}>
          <span>{status}</span>
          <span style={{ fontSize: 13, marginLeft: 10 }}>{time}</span>
          <br />
          <span>{context}</span>
        </Timeline.Item>
      )
    } )
  }

  const subscribeButton = () => {
    if ( !subscribeState || subscribeState === "FAILED" ) {
      return (
        <>
          {/* {subscribeState === "FAILED" && <span style={{ marginRight: 10 }}>{subsStateObj[subscribeState]}</span>} */}
          <Button
            type="primary"
            size='small'
            disabled={isClickSubscribe}
            onClick={() => {
              changeExpressSubscribe( id );
              setIsClickSubscribe( true )
            }}
          >
            订阅
          </Button>
        </>

      )
    }
    return subsStateObj[subscribeState]
  }

  return (
    <Modal
      visible={visible}
      title="物流详情"
      onCancel={onCancel}
      width={600}
      maskClosable={false}
      destroyOnClose
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button type="primary" onClick={() => { editLogistics(); onCancel() }}>物流修改</Button>
          <Button type="primary" onClick={onCancel}>确定</Button>
        </div>
      }
    >
      <Descriptions column={1}>
        <Descriptions.Item label="订单编号">{orderNo}</Descriptions.Item>
      </Descriptions>
      <Descriptions column={2}>
        <Descriptions.Item label="快递公司">{expressMerchant || "--"}</Descriptions.Item>
        <Descriptions.Item label="快递单号">{expressNo || logisticsNo || "--"}</Descriptions.Item>
        <Descriptions.Item label="物流状态">{stateObj[logisticsState] || "--"}</Descriptions.Item>
        <Descriptions.Item label="订阅状态">{subscribeButton()}</Descriptions.Item>
        <Descriptions.Item label="物流状态异常备注">{remark || "--"}</Descriptions.Item>
        <Descriptions.Item label="订阅失败备注">{reason || "--"}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ margin: "10px 0" }} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ marginRight: 30 }}>物流信息</h3>
        <h4>更新时间：{details[0]?.time || "--"}</h4>
      </div>
      <div style={{ background: '#f5f5f5', padding: "20px" }}>
        <Timeline>
          {renderTimeLine()}
        </Timeline>
      </div>
    </Modal>
  )
}

export default LogisticsDetail

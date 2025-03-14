import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Tooltip, PageHeader, Statistic, Col, Row, Card } from 'antd'

@connect( ( { statistics } ) => {
  return {
    appointAppData: statistics.appointAppData,
  }
} )
class AppInfo extends PureComponent {
  componentWillMount() {
    this.getAppointAppData();
  }

  getAppointAppData = () => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'statistics/getAppointAppData',
      payload: {
        id: this.props.appId,
      }
    } )
  }

  render() {
    // const { appointAppData } = this.props;
    const appointAppData = this.props.appointAppData ? this.props.appointAppData : {}
    const StatisticCard = ( { icon, title, tip, today, yestoday, backgroundImage } ) => {
      return (
        <div>
          <Card style={{ backgroundImage, color: 'white' }}>
            <div style={{ fontSize: '20px' }}>
              <Icon type={icon} style={{ marginRight: '10px' }} />{title}
              <Tooltip placement="top" title={tip}>
                <Icon style={{ fontSize: '15px', marginLeft: '10px' }} type="info-circle" />
              </Tooltip>
            </div>
            <div><span>今日</span><span style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "10px" }}>{today}</span></div>
            <div><span>昨日</span><span style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "10px" }}>{yestoday}</span></div>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <PageHeader
          style={{ backgroundColor: 'white' }}
          title={appointAppData.name ? appointAppData.name : ''}
          subTitle={appointAppData.description ? appointAppData.description : ''}
          avatar={appointAppData.image && { src: appointAppData.image }}
          extra={[
            <Row type="flex" key="1">
              <Statistic
                title="累计用户"
                value={appointAppData.preTotalUv + appointAppData.newUv}
                style={{ marginRight: '32px' }}
                suffix="人"
              />
              <Statistic title="累计启动" value={appointAppData.preTotalPv + appointAppData.pv} suffix="次" />
            </Row>
          ]}
        />
        <Row gutter={[8, 8]} style={{ margin: '10px 0' }}>
          <Col span={12} md={6}>
            <StatisticCard
              icon="user-add"
              title="新增用户"
              tip="第一次启动应用的用户（H5以缓存UID为判断标准）。"
              today={appointAppData.newUv ? appointAppData.newUv : '0'}
              yestoday={appointAppData.preNewUv ? appointAppData.preNewUv : '0'}
              backgroundImage="linear-gradient(-45deg, #4BB1FF 0%, #1D6EFF 100%)"
            />
          </Col>
          <Col span={12} md={6}>
            <StatisticCard
              icon="heart"
              title="活跃用户"
              tip="启动过应用用户（去重），启动过一次的用户即视为活跃用户，包括新用户与老用户。"
              today={appointAppData.uv ? appointAppData.uv : '0'}
              yestoday={appointAppData.preUv ? appointAppData.preUv : '0'}
              backgroundImage="linear-gradient(134deg, #FF8814 0%, #FFAF38 100%)"
            />
          </Col>
          <Col span={12} md={6}>
            <StatisticCard
              icon="select"
              title="启动次数"
              tip="截止至统计时间，应用的总启动次数。"
              today={appointAppData.pv ? appointAppData.pv : '0'}
              yestoday={appointAppData.prePv ? appointAppData.prePv : '0'}
              backgroundImage="linear-gradient(-45deg, #40CEE1 0%, #17A0F5 100%)"
            />
          </Col>
          {/* <Col span={12} md={6}>
            <StatisticCard
              icon="global"
              title="独立IP数"
              tip="启动过应用用户IP（去重），启动过一次的IP即记录，包括新IP与老IP。"
              today={appointAppData.ips ? appointAppData.ips : '0'}
              yestoday={appointAppData.preIps ? appointAppData.preIps : '0'}
              backgroundImage="linear-gradient(-45deg, #538EFD 0%, #6D5AFE 100%)"
            />
          </Col> */}
        </Row>
      </div>
    );
  }
}

export default AppInfo;


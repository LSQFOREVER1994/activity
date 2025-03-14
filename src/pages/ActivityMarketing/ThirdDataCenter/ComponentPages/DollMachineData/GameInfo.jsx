import React, { useMemo } from 'react';
import { Statistic, Row, Col } from 'antd';

function GameStatistic( props ) {
  const { gameInfo } = props;
  const { avgPeopleCount = 0, avgPeopleScore = 0, avgDailyCount = 0, highestScore = 0, totalCount = 0 } = gameInfo
  const style = { display: 'flex', justifyContent: 'center', marginTop: 20 }
  const renderStatistic = useMemo( () => {
    return (
      <>
        <Row gutter={24}>
          <Col span={12} style={style}>
            <Statistic title="人均游玩次数" value={avgPeopleCount} suffix="人" precision={1} />
          </Col>
          <Col span={12} style={style}>
            <Statistic title="人均得分" value={avgPeopleScore} suffix="分" precision={1} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12} style={style}>
            <Statistic title="日均游玩次数" value={avgDailyCount} suffix="次" precision={1} />
          </Col>
          <Col span={12} style={style}>
            <Statistic title="最高得分" value={highestScore} suffix="分" />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12} style={style}>
            <Statistic title={<span style={{ fontWeight:'bold', fontSize:16 }}>总游玩次数</span>} value={totalCount} suffix="次" />
          </Col>
        </Row>
      </>
    )
  }, [gameInfo] )
  return renderStatistic
}
export default GameStatistic

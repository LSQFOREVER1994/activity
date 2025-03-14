import React, { PureComponent } from 'react';
import { Card, Tabs } from 'antd';
import TendencyData from '../../Statistics/ProductDetail';
import WinnerModal from './AwardRecords/AwardRecords';
import ActiveOrder from './ActiveOrder/activeOrder';
import AppointTask from './TaskEvents/TaskStatistics';
import GuessWave from './GuessWave/GuessWave';
import Questionnaire from './QuestionnaireData/QuestionnaireData';
import Watermelon from './Watermelon/Watermelon';



const { TabPane } = Tabs;
const list =['FLASH_SALES', 'RUSH_COUPON', 'PASSWORD_EXCHANGE', 'BARRAGE', 'GUESS_GAME', 'K_LINE_ARENAS', 'WATERMELON']
class ActivityData extends PureComponent {
 constructor( props ){
   super( props );
   const activityData = sessionStorage.getItem( 'activityData' ) ? JSON.parse( sessionStorage.getItem( 'activityData' ) ) : {}
   this.state={
    activityData,
   }
 }

  render() {
    const { activityData:{ buryPointId, id, name, type } }=this.state;
    return (
      <Card
        bordered={false}
        title={`数据统计-${name}`}
        bodyStyle={{ padding: '20px 32px 40px 32px' }}
      >
        <Tabs>
          {
            buryPointId &&
            <TabPane tab="趋势详情" key="1">
              <TendencyData appId={buryPointId} location={this.props.location} />
            </TabPane>
          }
          {
            type !== 'FLASH_SALES' &&
            <TabPane tab="中奖名单" key="2">
              <WinnerModal name={name} type={type} />
            </TabPane>
          }
          {
            type === 'FLASH_SALES' &&
            <TabPane tab="活动订单" key="3">
              <ActiveOrder activityId={id} name={name} />
            </TabPane>
          }
          {
            list.indexOf( type ) === -1 &&
            <TabPane tab="任务统计" key="4">
              <AppointTask id={id} />
            </TabPane>
          }
          {
            type === "GUESS_GAME" &&
            <TabPane tab="猜涨跌数据" key="5">
              <GuessWave platFormName={name} activityId={id} />
            </TabPane>
          }
          {
            type === "QUESTIONNAIRE" &&
            <TabPane tab="问券统计" key="6">
              <Questionnaire id={id} />
            </TabPane>
          }
          {
            type === "WATERMELON" &&
            <TabPane tab="大西瓜数据" key="7">
              <Watermelon platFormName={name} activityId={id} />
            </TabPane>
          }
        </Tabs>
      </Card>
    );
  }
}

export default ActivityData;

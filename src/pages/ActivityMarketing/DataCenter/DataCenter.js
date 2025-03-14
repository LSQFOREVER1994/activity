
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Tabs, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import RewardRecord from '../RewardRecord/RewardRecord'
import GuessRank from '../GuessRank/GuessRank'
import IntegralRank from '../IntegralRank/IntegralRank'
import Invite from '../Invite/Invite'
import Questionnaire from '../QuestionnaireData/QuestionnaireData';
import ParticipationTimes from '../ParticipationTimes/ParticipationTimes';
import IntergralRecord from '../IntergralRecord/IntergralRecord';
import ParticipationRecord from '../ParticipationRecord/ParticipationRecord';
import TaskRecord from '../TaskRecord/TaskRecord';
import { getPageQuery } from '@/utils/utils';
import styles from './datacenter.less';

const { TabPane } = Tabs;

@connect( ( { dataCenter } ) => {
  return {
    loading: dataCenter.loading,
  }
} )
class DataCenter extends PureComponent {
  constructor( props ) {
    const params = getPageQuery();
    const { id, activityName } = params;
    super( props );
    this.state = {
      activityId: id,
      activityName,
      loading: false,
      showTabList: []
    }
    this.tabList = [
      {
        key: 'REWARD_RECORD',
        ele: <RewardRecord id={id} activityName={activityName} />,
        title: '中奖名单'
      },
      {
        key: 'INVITE',
        ele: <Invite id={id} activityName={activityName} />,
        title: '邀请列表'
      },
      {
        key: 'INTEGRAL_RANK',
        ele: <IntegralRank id={id} activityName={activityName} />,
        title: '积分排行榜'
      },
      {
        key: 'GUESS_RANK',
        ele: <GuessRank id={id} activityName={activityName} />,
        title: '猜涨跌排行榜'
      },
      {
        key: 'QUESTIONNAIRE',
        ele: <Questionnaire id={id} activityName={activityName} />,
        title: '问卷统计'
      },
      {
        key: 'PARTICIPATION_RECORD',
        ele: <ParticipationRecord id={id} activityName={activityName} />,
        title: '用户参与记录'
      },
      {
        key: 'INTEGRAL_RECORD',
        ele: <IntergralRecord id={id} activityName={activityName} />,
        title: '活动积分明细'
      },
      {
        key: 'PARTICIPATION_TIMES',
        ele: <ParticipationTimes id={id} activityName={activityName} />,
        title: '活动参与次数'
      },
      {
        key: 'TASK',
        ele: <TaskRecord id={id} activityName={activityName} />,
        title: '任务完成表'
      },
    ]
  }

  componentDidMount() {
    this.setState( {
      loading: true
    }, () => {
      this.getElementDataType()
    } )
  };

  changeTabs = () => {
    this.getElementDataType()
  }

  // 获取活动详情信息
  getElementDataType = () => {
    const { dispatch } = this.props;
    const { activityId } = this.state
    dispatch( {
      type: 'dataCenter/getElementDataType',
      payload: {
        query: {
          id:activityId
        },
        successFun: ( res ) => {
          if ( res ) {
            this.getShowTab( res )
          }
        }
      }
    } );
  }

  // 数据处理，判断展示哪些TAB
  getShowTab = ( typeList ) => {
    // 筛选出所有组件类型
    if ( typeList && typeList.length ) {
      const showTabList = typeList.map( info => {
        const infoEle = this.tabList.find( item => item.key === info )
        return infoEle
      } )
      this.setState( {
        loading: false,
        showTabList
      } )
    }
  }

  render() {
    const { activityId, activityName, loading, showTabList } = this.state
    let tabView
    if ( showTabList && showTabList.length ) {
      const tabPaneList = showTabList.map( info => {
        return (
          <TabPane tab={info.title} key={info.key}>
            {info.ele}
          </TabPane>
        )
      } )
      tabView = (
        <Tabs onChange={this.changeTabs}>
          {tabPaneList}
        </Tabs>
      )
    }
    return (
      <GridContent>
        <Card
          bordered={false}
          title={`数据统计--${activityName}（${activityId}）`}
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.tab_box}>
            <Spin spinning={loading}>
              {tabView}
            </Spin>
          </div>
        </Card>
      </GridContent>
    );
  };
}

export default DataCenter;

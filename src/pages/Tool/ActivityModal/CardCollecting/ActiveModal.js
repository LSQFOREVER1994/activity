import React, { PureComponent } from 'react';
import { Steps } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';
import AllCard from './ActiveCom/AllCard';
import PrizeCom from './ActiveCom/PrizeTable';
import TaskModal from '../../TaskModal/TaskSetting'
import WxShare from './ActiveCom/WxShare';

const { Step } = Steps;

class ActiveModal extends PureComponent {

  formLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 14 },
  };

  formLayoutInput = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      cardList: props.data && props.data.cardInfoList,
      prizeList: props.data && props.data.prizes,
      activityId: props.activityId,
    }
  }

  componentDidMount () {
    this.props.onRef(this)
  }

  getValues = () => {
    const allCardData = this.allCardRef.getValues();
    const prizeData = this.prizeRef.getValues();
    const taskData = this.taskSetRef.handleSubmit();
    const wxShareData = this.wxShareRef.getValues();

    // const cardInfoList = allCardData.list.concat( otherCardData.list );
    // const cardDeleteIds = allCardData.deleteIds.concat( otherCardData.deleteIds )
    return {
      ...prizeData,
      ...allCardData,
      ...taskData,
      ...wxShareData
    }
  }

  activeHandleSubmit = () => {
    const allCardData = this.allCardRef.getData();
    const prizeData = this.prizeRef.getValues();
    const taskData = this.taskSetRef.handleSubmit();
    const wxShareData = this.wxShareRef.getValues();
    if (allCardData && prizeData) {
      return {
        ...allCardData,
        ...prizeData,
        ...taskData,
        ...wxShareData
      }
    }
    return false
  }

  openWindow = () => {
    const { activityId } = this.state;
    window.open(`${window.location.origin}/oldActivity/appointTask${activityId ? `?activityId=${activityId}` : ''}`)
  }

  render () {
    const { activityId, current, cardList, prizeList } = this.state;
    const { onPreview, data } = this.props;
    const stepList = [
      {
        name: '卡片配置',
        desc: '本次集卡活动所要集齐的卡片种类配置，至少配置3张卡片，所有卡片图尺寸建议保持一致',
        content: <AllCard
          list={cardList}
          onRef={(allCard) => { this.allCardRef = allCard }}
          activityId={activityId}
          onPreview={onPreview}
        />
      },
      {
        name: '奖品设置',
        desc: '集齐卡片后可进行抽奖，对奖品进行设置。',
        content: <PrizeCom
          prizes={prizeList}
          onRef={(prize) => { this.prizeRef = prize }}
          onPreview={onPreview}
        />
      },
      {
        name: '任务设置',
        // desc: '用户执行任务可以获得更多抽卡次数，对任务进行设置',
        content: <TaskModal
          data={data}
          onPreview={onPreview}
          onRef={(ref) => { this.taskSetRef = ref }}
        />
      },
      {
        name: '微信分享',
        desc: '微信分享（选填）',
        content: data &&
          <WxShare
            data={data}
            onRef={(wxShare) => { this.wxShareRef = wxShare }}
            onPreview={onPreview}
          />
      },

    ]
    return (
      <GridContent style={{ paddingLeft: 30 }}>
        <div style={{ width: '100%', backgroundColor: '#fff' }}>
          <Steps
            size="small"
            current={current}
            progressDot
            onChange={(value) => { this.setState({ current: value }) }}
            className={styles.edit_acitve_steps}
          >
            {
              stepList.map(step => (
                <Step title={step.name} key={step.name} />
              ))
            }
          </Steps>
        </div>

        {
          stepList.map((step, index) => (
            <div
              key={step.name}
              className={styles.collect_edit_active_content}
              style={{ display: current === index ? 'block' : 'none' }}
            >
              <div className={styles.edit_acitve_desc}>{step.desc}</div>
              {step.content}
            </div>
          ))
        }

      </GridContent>
    );
  }
}

export default ActiveModal;

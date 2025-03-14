import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Alert, message, Select, Steps } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';
import AllCard from './ActiveCom/AllCard';
import OtherCard from './ActiveCom/OtherCard';
import PrizeCom from './ActiveCom/PrizeCom';
import WxShare from './ActiveCom/WxShare';

const { Step } = Steps;
const { Option } = Select;

@connect(({ activity }) => ({
  loading: activity.loading,
  collectTaskList: activity.collectTaskList
}))
@Form.create()
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
    const normallCardList = [];
    const specialCardList = [];
    if (props.cardList && props.cardList.length) {
      props.cardList.forEach(card => {
        if (card.isSpecial) specialCardList.push(card)
        else normallCardList.push(card)
      })
    }
    super(props);
    this.state = {
      current: 0,
      cardList: props.cardList,
      normallCardList,
      specialCardList,
      prizeList: props.prizeList || [],
      activityId: props.activityId,
      taskTemplateId: props.taskTemplateId,
      taskTemplateName: props.taskTemplateName,
      taskList: [],
    }

  }

  componentDidMount () {
    this.getTaskTemplateList()
    this.props.onRef(this)
  }

  getTaskTemplateList = () => {
    const { taskTemplateId } = this.state;
    const { dispatch } = this.props;
    if (taskTemplateId) {
      dispatch({
        type: 'activity/getTaskTemplateList',
        payload: { id: taskTemplateId },
        callFunc: (taskList) => {
          this.setState({ taskList }, () => {
            this.props.onPreview()
          })
        }
      })
    }

  }

  getValues = () => {
    const { taskTemplateId, taskList } = this.state;
    const allCardData = this.allCardRef.getValues();
    const otherCardData = this.otherCardRef.getValues();
    const prizeData = this.prizeRef.getValues();
    const wxShareData = this.wxShareRef.getValues();
    const cardInfoList = allCardData.list.concat(otherCardData.list);
    const cardDeleteIds = allCardData.deleteIds.concat(otherCardData.deleteIds)
    return {
      ...prizeData,
      cardInfoList,
      cardDeleteIds: cardDeleteIds.length === 0 ? [0] : cardDeleteIds,
      taskTemplateId,
      taskList,
      ...wxShareData
    }
  }

  activeHandleSubmit = () => {
    const { taskTemplateId, taskList } = this.state;
    const allCardData = this.allCardRef.getData();
    const otherCardData = this.otherCardRef.getData();
    const prizeData = this.prizeRef.getData();
    const wxShareData = this.wxShareRef.getValues();
    if (allCardData && otherCardData && prizeData) {
      const cardSortList = []
      const cardInfoList = allCardData.list.concat(otherCardData.list);
      const cardProbabilityTotal = cardInfoList.reduce((total, item) => {
        if (item.isSpecial) cardSortList.push(item.sort)
        return parseFloat(total, 10) + parseFloat(item.probability)
      }, 0)
      const prizeRangeTotal = prizeData.prizeList.reduce((total, item) => parseFloat(total, 10) + parseFloat(item.probability, 10), 0)
      if (Array.from(new Set(cardSortList)).length !== cardSortList.length) {
        message.warning('所集卡片配置的排序重复')
        return false
      }
      if (cardProbabilityTotal !== 100) {
        message.warning('所有卡片概率之和非100%')
        return false
      }
      if (prizeRangeTotal !== 100) {
        message.warning('所有奖品概率和应为100%')
        return false
      }
      const cardDeleteIds = allCardData.deleteIds.concat(otherCardData.deleteIds)
      return {
        ...prizeData,
        cardInfoList,
        cardDeleteIds: cardDeleteIds.length === 0 ? [0] : cardDeleteIds,
        taskTemplateId,
        taskList,
        ...wxShareData
      }
    }
    return false
  }

  openWindow = () => {
    const { activityId } = this.state;
    window.open(`${window.location.origin}/oldActivity/appointTask${activityId ? `?activityId=${activityId}` : ''}`)
  }

  onChange = (taskTemplateId) => {
    this.setState({ taskTemplateId }, () => {
      this.getTaskTemplateList()
    })
  }

  renderTask = () => {
    const { collectTaskList } = this.props;
    const { taskTemplateId, taskTemplateName } = this.state;
    return (
      <div>
        <Alert
          className={styles.edit_alert}
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span>设置任务需先配置活动关联的指定任务，若已配置在下拉选项框中选择即可</span>
              <span onClick={this.openWindow} style={{ color: '#1890FF', cursor: 'pointer' }}>指定任务</span>
            </div>)}
          banner
        />
        <Row style={{ marginTop: 20 }}>
          <Col span={4} style={{ paddingTop: 4, paddingRight: 10, textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>指定任务</Col>
          <Col span={16}>
            <Select
              defaultValue={taskTemplateId}
              placeholder="请选择"
              style={{ width: 200 }}
              onChange={this.onChange}
            >
              {taskTemplateId &&
                <Option key={taskTemplateId}>{taskTemplateName}</Option>
              }
              {collectTaskList.map(item =>
                <Option key={item.id} value={item.id}>{item.name}</Option>
              )}
            </Select>
          </Col>
        </Row>
      </div>
    )
  }

  render () {
    const { current, specialCardList, normallCardList, prizeList, activityId } = this.state;
    const { collectTaskList, onPreview, data } = this.props;
    const stepList = [
      {
        name: '所集卡片配置',
        desc: '本次集卡活动所要集齐的卡片种类配置，至少配置2张卡片，所有卡片图尺寸建议保持一致',
        content: specialCardList &&
          <AllCard
            list={specialCardList}
            onRef={(allCard) => { this.allCardRef = allCard }}
            activityId={activityId}
            onPreview={onPreview}
          />
      },
      {
        name: '其他卡片配置',
        desc: '配置除所集卡片的其他卡片，如“祝福”卡、“谢谢参与”卡等，可无限发放，所有卡片图尺寸建议保持一致',
        content: normallCardList &&
          <OtherCard
            list={normallCardList}
            onRef={(otherCard) => { this.otherCardRef = otherCard }}
            activityId={activityId}
            onPreview={onPreview}
          />
      },
      {
        name: '集齐卡片抽奖设置',
        desc: '集齐卡片后可进行抽奖，对奖品进行设置。',
        content: prizeList &&
          <PrizeCom
            list={prizeList}
            onRef={(prize) => { this.prizeRef = prize }}
          />
      },
      {
        name: '任务设置',
        desc: '用户执行任务可以获得更多抽卡次数，对任务进行设置',
        content: collectTaskList && this.renderTask()
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

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Tabs } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
// import { tuple } from 'antd/lib/_util/type';
import styles from '../ActivityModal.less';
import PrizeCom from './PrizeCom/PrizeCom';
import TaskModal from '../../TaskModal/TaskModal'
import WxModal from './PrizeCom/WxModal'
import IntegralSetting from './PrizeCom/IntegralSetting'

const { TabPane } = Tabs;

@connect( ( { activity } ) => ( {
  loading: activity.loading,
  integralData: activity.integralData,
} ) )
@Form.create()
class ActiveModal extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      taskData:props.data && props.data.taskGroup,
      currentStep: 0,
    }
  }

  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () => {
    this.props.onPreview()
  }

  // 预览数据传输
  getValues = () => {
    const prizeData = this.prizeRef.getValues();
    const shareData = this.shareRef.getValues();
    const taskGroup = this.taskRef.getValues()
    const integral = this.integral.getValues();
    return {
      ...prizeData,
      ...shareData,
      taskGroup,
      ...integral,
    }
  }

  //  提交数据传送
  getHandleValues = () => {
    const prizeData = this.prizeRef.getData();
    const taskGroup = this.taskRef.getValues();
    const shareData = this.shareRef.getData();
    if ( prizeData ) {
      return {
        ...prizeData,
        taskGroup,
        ...shareData,
      }
    }
    return false
  }

  // 获取积分数据
  getIntegral = () => {
    const integral = this.integral.getData();
    if ( integral ) {
      return {
        ...integral,
      }
    }
    return false
  }

  render() {
    const { currentStep, taskData } = this.state;
    const { onPreview, data={}, integralData } = this.props;
    const tabList = [
      {
        name: <div className={styles.edit_acitve_tab}>积分设置</div>,
        content: data &&
          <IntegralSetting
            data={integralData}
            tripartiteLink={data.tripartiteLink}
            onRef={( integral ) => { this.integral = integral }}
            onPreview={onPreview}
          />
      },
      {
        name: <div className={styles.edit_acitve_tab}>奖品设置</div>,
        content: data &&
          <PrizeCom
            data={data}
            onRef={( prize ) => { this.prizeRef = prize }}
            onPreview={onPreview}
          />
      },
      {
        name: '任务设置',
        content: data &&
          <TaskModal
            activityType={data.type}
            taskData={taskData}
            onPreview={this.onPreview}
            onRef={( ref )=>{this.taskRef = ref}}
          />
      },
      {
        name: '微信分享',
        content: data &&
          <WxModal
            data={data}
            onRef={( Share ) => { this.shareRef = Share }}
            onPreview={onPreview}
          />
      },
    ]
    return (
      <GridContent style={{ paddingLeft: 30 }}>
        <div style={{ backgroundColor: '#fff', margin: '5px auto' }}>
          <Tabs
            onChange={( value ) => {
              this.setState( { currentStep: parseInt( value ) } )
            }}
            tabBarStyle={{ padding: '0px 15px' }}
          >
            {tabList.map( ( tab, index ) => (
              <TabPane
                tab={tab.name}
                key={index}
              /> ) )
            }
          </Tabs>
        </div>
        {
          tabList.map( ( tab, index ) => (
            <div
              key={index}
              className={styles.collect_edit_active_content}
              style={{ display: currentStep === index ? 'block' : 'none' }}
            >
              {tab.content}
            </div>
          ) )
        }
      </GridContent>
    );

  }
}

export default ActiveModal;

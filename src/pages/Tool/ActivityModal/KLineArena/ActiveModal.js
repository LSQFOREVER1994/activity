import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Tabs } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';
import PrizeCom from './PrizeCom/PrizeCom';
import WxModal from './PrizeCom/WxModal'

const { TabPane } = Tabs;

@connect()
@Form.create()
class ActiveModal extends PureComponent {

  formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  constructor( props ) {
    super( props );
    this.state = {
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
    return {
      ...prizeData,
      ...shareData
    }
  }

  //  提交数据传送
  getHandleValues = () => {
    const prizeData = this.prizeRef.getData();
    const shareData = this.shareRef.getData();
    if ( prizeData ) {
      return {
        ...prizeData,
        ...shareData,
      }
    }
    return false
  }

  render() {
    const { currentStep } = this.state;
    const { onPreview, data } = this.props;
    const tabList = [
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
              key={tab.name}
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
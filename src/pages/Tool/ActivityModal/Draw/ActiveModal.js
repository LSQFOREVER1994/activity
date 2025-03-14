import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Steps } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../ActivityModal.less';
import PrizeCom from './PrizeCom/PrizeCom';
import CipherTable from './PrizeCom/CipherTable';
import TaskModal from '../../TaskModal/TaskSetting'
import WxModal from './PrizeCom/WxModal'

const { Step } = Steps;

@connect()
@Form.create()
class ActiveModal extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      currentStep:0,
    }
  }

  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }

  // 预览数据传输  
  getValues = () => {
    const cupherData =this.cipherRef.getValues();
    const prizeData = this.prizeRef.getValues();
    const taskGroup = this.taskRef.getValues()
    const shareData = this.shareRef.getValues();
    return {
      ...cupherData,
      ...prizeData,
      ...taskGroup,
      ...shareData
    }
  }

  //  提交数据传送
  getHandleValues = () =>{
    const cupherData =this.cipherRef.getData();
    const prizeData = this.prizeRef.getValues();
    const taskGroup = this.taskRef.handleSubmit();
    const shareData = this.shareRef.getData();
    if( cupherData && prizeData && taskGroup ){
      return {
        ...cupherData,
        ...prizeData,
        ...taskGroup,
        ...shareData,
      }
    }
    return false
  }


  render() {
    const { currentStep } = this.state;
    const { onPreview, data } = this.props;
    const stepList = [
      {
        name: '签文设置', 
        content: data && 
        <CipherTable
          data={data}
          onRef={( cipher ) => {this.cipherRef = cipher}}
          onPreview={onPreview}
        />
      },
      { 
        name: '抽签设置', 
        content: data && 
        <PrizeCom
          data={data}
          onRef={( prize ) => {this.prizeRef = prize}}
          onPreview={onPreview}
        />
      },
      { 
        name: '任务设置',
        content: data && 
        <TaskModal
          data={data}
          onPreview={this.onPreview}
          onRef={( ref )=>{this.taskRef = ref}}
        />
      },
      { 
        name: '微信分享',
        content: data && 
        <WxModal 
          data={data}
          onRef={( share ) => { this.shareRef = share }} 
          onPreview={onPreview}
        />
      },
    ]
    return (
      <GridContent style={{ paddingLeft:30 }}>
        <div style={{ width:'50%', backgroundColor:'#fff', margin:'5px auto' }}>
          <Steps
            size="small"
            current={currentStep}
            progressDot
            onChange={( value ) => { this.setState( { currentStep: value } ) }}
            className={styles.edit_acitve_steps}
          >
            {
              stepList.map( step => (
                <Step
                  title={step.name}
                  key={step.name}
                />
              ) )
            }
          </Steps>
        </div>
        {
          stepList.map( ( step, index ) => (
            <div 
              key={step.name}
              className={styles.collect_edit_active_content}
              style={{ display: currentStep === index? 'block' :'none' }}
            >
              {step.content}
            </div>
          ) )
        }
        
      </GridContent>
    );

  }
}

export default ActiveModal;

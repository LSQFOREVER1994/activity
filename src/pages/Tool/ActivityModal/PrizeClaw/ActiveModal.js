import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Input  } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { formatMessage } from 'umi/locale';
import UploadImg from '@/components/UploadImg';
import styles from '../ActivityModal.less';
import TaskModal from '../../TaskModal/TaskModal';
import PrizeTable from './PrizeTable';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;

@connect()
@Form.create()
class ActiveModal extends PureComponent {


  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  componentDidMount() {
    this.props.onRef( this )
  }

  onPreview = () =>{
    this.props.onPreview()
  }



  // 预览数据传输  
  getValues = () => {
    const { form }=this.props;
    const prizeData = this.prizeRef.getValues();
    let taskGroup;
    if( this.taskRef ){
      taskGroup = this.taskRef.getValues()
    }
    const shareData = form.getFieldsValue()
    return {
      ...prizeData,
      taskGroup,
      ...shareData
    }
  }

  //  提交数据传送
  getHandleValues = () =>{
    const { form }=this.props;
    const prizeData = this.prizeRef.getData();
    let taskGroup;
    if( this.taskRef ){
      taskGroup = this.taskRef.getValues()
    }
    const shareData = form.getFieldsValue()
    if( prizeData ){
      return {
        ...prizeData,
        taskGroup,
        ...shareData,
      }
    }
    return false
  }


  render() {
    const { form: { getFieldDecorator }, onPreview, data, data:{ taskData } } = this.props;
    return (
      <GridContent style={{ paddingLeft:30 }}>
        <div style={{ width: '100%', border: '1px solid #f5f5f5', borderRadius: 3, padding: '0px 15px 30px 15px' }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab={<div><span style={{ color:'#f5222d', marginRight:5 }}>*</span>活动奖品</div>} key="1">
              <PrizeTable
                prizes={data.prizes}
                onRef={( prize ) => {this.prizeRef = prize}}
                onPreview={onPreview}
              />
            </TabPane>
            <TabPane tab='任务设置' key="2">
              <TaskModal 
                taskData={taskData}
                onPreview={this.onPreview}
                onRef={( ref )=>{this.taskRef = ref}}
              />
            </TabPane>
            <TabPane tab="微信分享" key="3">
              <Form layout='horizontal' className={styles.formHeight}>
                <p style={{ color:'#D1261B', marginLeft:'8%' }}>（选填）微信分享</p>
                <FormItem label='分享标题' {...this.formLayout}>
                  {getFieldDecorator( 'shareTitle', {
                    initialValue: data.shareTitle,
                    } )( <TextArea rows={4} placeholder={`${formatMessage( { id: 'form.input' } )}分享标题`} /> )}
                </FormItem>

                <FormItem label='分享描述' {...this.formLayout}>
                  {getFieldDecorator( 'shareDescription', {
                      initialValue: data.shareDescription,
                    } )( <TextArea rows={4} placeholder='请输入分享描述' /> )}
                </FormItem>

                <FormItem label='分享链接' {...this.formLayout}>
                  {getFieldDecorator( 'shareLink', {
                      initialValue: data.shareLink,
                    } )( <Input placeholder='请输入分享链接，不填默认本活动链接' /> )}
                </FormItem>

                <FormItem label='分享图标' {...this.formLayout}>
                  {getFieldDecorator( 'shareImg', {
                      initialValue: data.shareImg,
                    } )( <UploadImg /> )}
                  <div
                    style={
                      { 
                        position: 'absolute', 
                        top:0, left:'125px', 
                        width:'180px',
                        fontSize: 13,
                        color: '#999', 
                        lineHeight:2,
                        marginTop:'10px'
                        }
                      }
                  >
                    <div>格式：jpg/jpeg/png </div>
                    <div>建议尺寸：200px*200px</div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>

              </Form>
            </TabPane>
          </Tabs>
        </div>
      </GridContent>
    );

  }
}

export default ActiveModal;

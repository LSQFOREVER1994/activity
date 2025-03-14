import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Input, Form, Radio } from 'antd';
import { SketchPicker } from 'react-color';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import TaskModal from './TaskModal';
import styles from '../../../../../Lists.less';

const FormItem = Form.Item;


// 任务奖励
@connect()
@Form.create()
class Task extends PureComponent {

  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      titleValue: props.data && props.data.taskTitle ? props.data.taskTitle : '',
      visiblePopupTitleColor: false,
      visiblePopupBackgroundColor: false,
      popupTitleColor: props.data.popupTitleColor ? ( props.data.popupTitleColor.indexOf( '#' ) != -1 ? props.data.popupTitleColor : `#${props.data.popupTitleColor}` ) : '#333',
      popupBackgroundColor: props.data.popupBackgroundColor ? ( props.data.popupBackgroundColor.indexOf( '#' ) != -1 ? props.data.popupBackgroundColor : `#${props.data.popupBackgroundColor}` ) : '#F1F1F1',
    };
  }



  componentDidMount() {
    this.props.onRef( this )
  }


  onPreview = () => {
    this.props.onPreview()
  }

  //  图片切换
  imgChang = () => {
    setTimeout( () => {
      this.onPreview()
    }, 200 );
  }

  getValues = () => {
    const { popupTitleColor, popupBackgroundColor } = this.state;
    const { form } = this.props;
    const data = form.getFieldsValue();
    const taskGroup = this.taskRef.getValues();
    return { ...data, taskGroup, popupTitleColor, popupBackgroundColor }
  }

  onChange = ( e ) => {
    this.setState( { titleValue: e.target.value }, () => { this.onPreview() } )
  }


  // 提交：商品种类
  handleSubmit = () => {
    const { popupTitleColor, popupBackgroundColor } = this.state;
    const { form } = this.props;
    let data;
    let taskGroup;
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      data = fieldsValue;
      taskGroup = this.taskRef.getValues();
    } );
    if ( !data ) return null
    return { ...data, taskGroup, popupTitleColor, popupBackgroundColor }
  };

  // 显示调色板
  showButtonColor = ( type ) => {
    this.setState( {
      [`${type}`]: true
    }, () => { this.onPreview() } )
  }

  // 颜色变更
  buttonColorChange = ( e, type ) => {
    const color = e.hex;
    this.setState( { [`${type}`]: color }, () => {
      this.onPreview()
    } )
  }

  // 点击元素外隐藏元素
  hideAllMenu = () => {
    this.setState( {
      visiblePopupBackgroundColor: false,
      visiblePopupTitleColor: false,
    } )
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, data = {} } = this.props;
    const { titleValue, popupBackgroundColor, popupTitleColor, visiblePopupBackgroundColor, visiblePopupTitleColor } = this.state;

    return (
      <GridContent>
        <p style={{ color: '#D1261B', fontSize: 12 }}>（选填）对任务进行设置，用户完成任务可以获得次数</p>
        <div onClick={this.hideAllMenu} className={styles.cover} hidden={!( visiblePopupBackgroundColor || visiblePopupTitleColor )} />
        <Form className={styles.formHeight} onSubmit={this.handleSubmit}>

          <FormItem label='任务' {...this.formLayout}>
            {getFieldDecorator( 'showTask', {
              rules: [{ required: true, message: '请选择任务状态' }, ],
              initialValue: data.showTask || 'NONE',
            } )(
              <Radio.Group onChange={this.imgChang}>
                <Radio value='NONE'>不展示</Radio>
                {/* <Radio value='POPUP'>弹窗</Radio> */}
                <Radio value='LIST'>平铺</Radio>
                {/* <Radio value='BIG_IMAGE'>图片</Radio> */}
              </Radio.Group>
            )}
          </FormItem>

          {
            ( getFieldValue( 'showTask' ) === 'POPUP' || getFieldValue( 'showTask' ) === 'LIST' ) &&
            <div>
              {
                getFieldValue( 'showTask' ) !== 'LIST' &&
                <FormItem label='任务按钮' {...this.formLayout}>
                  {getFieldDecorator( 'taskButton', {
                    rules: [{ required: true, message: '请上传任务按钮图片' }],
                    initialValue: data.taskButton || '',
                  } )( <UploadImg onChange={this.imgChang} /> )}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0, left: '125px',
                      width: '180px',
                      fontSize: 13,
                      color: '#999',
                      lineHeight: 2,
                      marginTop: '10px'
                    }}
                  >
                    <div>格式：jpg/jpeg/png </div>
                    <div>建议尺寸：80px*80px </div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </FormItem>
              }


              <FormItem label='任务弹窗标题' {...this.formLayout}>
                {getFieldDecorator( 'taskTitle', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务弹窗标题` }, ],
                  initialValue: data.taskTitle,
                } )( <Input placeholder='请输入任务弹窗标题' maxLength={10} onChange={( e ) => this.onChange( e )} /> )}
                <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{titleValue.length}/10</span>
              </FormItem>

              <div style={{ display: 'flex', alignItems: 'center', height: '40px', marginBottom: '24px' }}>
                <div style={{ width: '16.6666%', textAlign: 'right', color: 'rgba( 0, 0, 0, 0.85 )' }}>
                  标题色值：
                </div>
                <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -23, padding: 10, border: '1px solid #f5f5f5', cursor: 'pointer' }} onClick={() => { this.showButtonColor( 'visiblePopupTitleColor' ) }}>
                    <div style={{ background: popupTitleColor, width: 116, height: 32 }} />
                  </div>
                  {
                    visiblePopupTitleColor &&
                    <FormItem 
                      style={{ position: 'absolute', top: -50, left: 200, zIndex: 999 }}
                    >
                      {getFieldDecorator( 'popupTitleColor', {
                        rules: [{
                          required: true, message: `${formatMessage( { id: 'form.input' } )}标题色值`
                        }],
                        initialValue: data.popupTitleColor || popupTitleColor,
                      } )(
                        <SketchPicker
                          width="230px"
                          color={popupTitleColor}
                          disableAlpha
                          onChange={( e ) => this.buttonColorChange( e, 'popupTitleColor' )}
                        />
                      )}
                    </FormItem>
                  }
                </div>
              </div>
              {
                getFieldValue( 'showTask' ) !== 'LIST' &&
                <div style={{ display: 'flex', padding: '30px 0 50px 13%', alignItems: 'center' }}>
                  <div style={{ marginRight: 20 }}>
                    弹窗背景色值:
                  </div>
                  <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -23, padding: 10, border: '1px solid #f5f5f5', cursor: 'pointer' }} onClick={() => { this.showButtonColor( 'visiblePopupBackgroundColor' ) }}>
                      <div style={{ background: popupBackgroundColor, width: 116, height: 32 }} />
                    </div>
                    {
                      visiblePopupBackgroundColor &&
                      <FormItem
                        style={{ position: 'absolute', bottom: -120, left: 200, zIndex: 999 }}
                      >
                        {getFieldDecorator( 'popupBackgroundColor', {
                          rules: [{
                            required: true, message: `${formatMessage( { id: 'form.input' } )}背景色值`
                          }],
                          initialValue: data.popupBackgroundColor || popupBackgroundColor,
                        } )(
                          <SketchPicker
                            width="230px"
                            color={popupBackgroundColor}
                            disableAlpha
                            onChange={( e ) => this.buttonColorChange( e, 'popupBackgroundColor' )}
                          />
                        )}
                      </FormItem>
                    }
                  </div>
                </div>
              }

            </div>
          }
        </Form>
        <TaskModal
          showTaskType={getFieldValue( 'showTask' )}
          taskData={this.props.data && this.props.data.taskGroup}
          onPreview={this.onPreview}
          onRef={( ref ) => { this.taskRef = ref }}
        />
      </GridContent>
    );
  }
}

export default Task;
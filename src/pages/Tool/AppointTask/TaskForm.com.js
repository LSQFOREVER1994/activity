import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Input, Form, InputNumber, Alert, Row, Col, Popconfirm, Radio, Select } from 'antd';

import UploadImg from '@/components/UploadImg';
import styles from '../Lists.less';

const taskDemoImg = require( '../../../../src/assets/taskDemoImg.png' )

const FormItem = Form.Item;
const { Option } = Select;

const initState = ( props ) => ( {
  previewImageicon: '',
  fileListicon: props.detail && props.detail.icon ? [{ url: props.detail.icon, uid: props.detail.icon }] : [],
  detail: props.detail,
  isOpen: !!props.detail.isOpen,
  isSpecial: !!props.isSpecial,
  nameValue: props.detail.name || ''
} )

@Form.create()
class TaskForm extends PureComponent {


  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
  };

  formLayout1 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  }

  constructor( props ) {
    super( props );
    this.state = initState( props );
  }


  static getDerivedStateFromProps( nextProps, prevState ) {

    if ( nextProps.detail !== prevState.detail ) {
      return initState( nextProps )
    }
    return null;
  }

  componentDidMount() {
    this.props.onRef( this )
  }


  // 打开图片预览
  PreviewFunc = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  PreviewFunc2 = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  uploadImg = ( res, type ) => {
    const list = this.state[`fileList${type}`];
    list[0] = res;
    this.setState( { [`fileList${type}`]: new Array( ...list ) } );
    this.props.form.setFieldsValue( { [type]: res.url } )
  }

  RemoveFunc = ( type ) => {
    this.setState( { [`fileList${type}`]: [] } );
    this.props.form.setFieldsValue( { [type]: '' } )
  }

  getValues = () => {
    const { form, detail } = this.props;
    let data = {};
    form.validateFields( ( err, values ) => {
      const { keys, ...Values } = values
      data = { ...detail, ...Values };
    } )
    if ( JSON.stringify( data ) === '{}' ) return null;
    return data
  }

  formReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState( { detail: null } )
  }

  //  提交
  handleSubmit = () => {
    const { form, detail } = this.props;
    let haveError = false
    let data = {};
    form.validateFields( ( err, values ) => {
      if ( err ) {
        haveError = err;
      }
      data = { detail, ...values };
    } );
    if ( haveError ) return 'error';

    return data;
  };

  //  校验表单
  getFormError = () => {
    const { form } = this.props;
    let haveError = false
    form.validateFields( ( err ) => {
      if ( err ) {
        this.setState( { isOpen: true } )
        haveError = true;
      }
    } );
    return haveError;
  };

  onDelete = () => {
    this.props.deleteDetail();
  }

  render() {
    const { form: { getFieldDecorator }, cardIndex, prizeList } = this.props;
    const {
      previewVisibleicon, previewImageicon, fileListicon, isOpen, detail, nameValue
    } = this.state;

    getFieldDecorator( 'key', { initialValue: ( detail && detail.key ) || '' } );
    getFieldDecorator( 'isOpen', { initialValue: isOpen } );
    const selectAfter = (
      <FormItem style={{ marginBottom:0 }} className={styles.input_after}>
        {getFieldDecorator( 'attendType', {
            rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务名称` }],
          initialValue: detail.attendType || 'DAY',
          } )(
            <Select style={{ width: 90 }}>
              <Option value="DAY">次/每天</Option>
              <Option value="TOTAL">次/永久</Option>
            </Select> )}
      </FormItem>
      );
    return (
      <div className={styles.edit_acitve_card} style={{ height: isOpen ? 'unset' : 64, overflow: 'hidden' }}>
        <Row style={{ padding: '20px 0' }}>
          <Col span={4} style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: 10, fontSize: 16 }}>任务{cardIndex}</Col>
          <Col span={20} style={{ textAlign: 'right', paddingRight: 30, color: '#1890FF' }}>
            <span style={{ marginRight: 30, cursor: 'pointer' }} onClick={() => { this.setState( { isOpen: !isOpen } ) }}>{isOpen ? '收起' : '展开'}</span>
            <Popconfirm
              title="确认删除任务?"
              onConfirm={this.onDelete}
              // onCancel={cancel}
              placement='left'
              okText="确定"
              cancelText="取消"
            >
              <span style={{ cursor: 'pointer' }}>删除</span>
            </Popconfirm>
          </Col>
        </Row>

        <Form onSubmit={this.handleSubmit}>
          <div>
            <FormItem label='任务名称' {...this.formLayout}>
              {getFieldDecorator( 'name', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务名称` }],
                initialValue: detail.name,
              } )( <Input
                placeholder={`${formatMessage( { id: 'form.input' } )}任务名称`}
                maxLength={8}
                onChange={this.onChangeName}
                suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{nameValue.length}/8</span>}
              /> )}
            </FormItem>
            <FormItem label='任务类型' {...this.formLayout}>
              {getFieldDecorator( 'taskType', {
                rules:[{ required: true, message: `${formatMessage( { id: 'form.input' } )}卡片总库存数量` }],
                initialValue: detail.taskType || 'JUMP',
              } )(
                <Radio.Group>
                  <Radio value="JUMP">跳转型任务<span style={{ color:'rgba(0, 0, 0, 0.25)', marginLeft:4, fontSize:12 }}>跳转指定页面即算完成任务</span></Radio>
                  <Radio value="OPERATION">操作型任务<span style={{ color:'rgba(0, 0, 0, 0.25)', marginLeft:4, fontSize:12 }}>指定页面完成指定操作即算完成任务</span></Radio>
                </Radio.Group>,
          )}
            </FormItem>
            <Row>
              <Col span={12}>
                <FormItem label='奖励类型' {...this.formLayout1}>
                  {getFieldDecorator( 'rewardType', {
                rules:[{ required: true, message: `${formatMessage( { id: 'form.input' } )}卡片总库存数量` }],
                    initialValue: detail.rewardType || 'ATTEND_COUNT',
              } )(
                <Radio.Group style={{ height:100, paddingTop:8 }}>
                  <Radio style={{ marginBottom: 40 }} value="ATTEND_COUNT">每完成1次任务增加活动参与次数</Radio>
                  <Radio value="AWARD">每完成1次任务获得奖品</Radio>
                </Radio.Group>,
          )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator( 'presentCount', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}任务最大完成次数` }],
                    initialValue: detail.presentCount,
                  } )( <Input
                    placeholder={`${formatMessage( { id: 'form.input' } )}可增加的参与次数，不填写默认1次`}
                    addonAfter="次"
                  /> )}
                </FormItem>
                <Alert
                  style={{ position:'absolute', top:39, width:'100%' }}
                  className={styles.edit_alert}
                  message={(
                    <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <span>奖品奖励需先配置对应的奖品，若已配置请忽略</span>
                      <span onClick={() => {     window.open( `${window.location.origin}/oldActivity/prizeManagement` ) }} style={{ color: '#1890FF', cursor:'pointer' }}>奖品管理</span>
                    </div> )}
                  banner
                />
                <FormItem>
                  {getFieldDecorator( 'prizeIdList', {
                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}任务最大完成次数` }],
                    initialValue: detail.prizeIdList&& detail.prizeIdList.length > 0 ?
                      detail.prizeIdList.map( item => ( item.toString() ) )
                    : [],
                  } )(
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="请选择可获得的奖品，不选择默认无奖品，可多选"
                      filterOption={( inputValue, option ) => option.props.children.includes( inputValue )}
                    >
                      {prizeList && prizeList.length > 0 && prizeList.map( item =>
                        <Option key={item.id}>{item.name}</Option> )}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem label='任务最大完成次数' {...this.formLayout}>
              {getFieldDecorator( 'shareCount', {
                  rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}任务最大完成次数` }],
                initialValue: detail.shareCount,
                } )( <Input
                  placeholder={`${formatMessage( { id: 'form.input' } )}每天或总共可完成该任务的最大次数`}
                  addonAfter={selectAfter}
                /> )}
            </FormItem>
            <FormItem label='跳转链接' {...this.formLayout}>
              {getFieldDecorator( 'link', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}跳转链接` }],
                  initialValue: detail.link,
                } )( <Input placeholder='请输入完成该任务需要跳转的链接地址' /> )}
            </FormItem>
            <FormItem
              label='任务图标'
              style={{ position: 'relative' }}
              {...this.formLayout}
            >
              {getFieldDecorator( 'icon', {
                rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}任务图标` }],
                initialValue: detail.icon,
              } )(
                <div style={{ height: 110 }}>
                  <UploadImg
                    previewVisible={previewVisibleicon}
                    previewImage={previewImageicon}
                    fileList={fileListicon}
                    CancelFunc={() => { this.CancelFunc( 'icon' ) }}
                    PreviewFunc={( e ) => { this.PreviewFunc2( e, 'icon' ) }}
                    ChangeFunc={( e ) => this.uploadImg( e, 'icon' )}
                    RemoveFunc={() => this.RemoveFunc( 'icon' )}
                  />
                </div>
              )}
              <div className={styles.collect_edit_card_size}>
                <div>格式：jpg/jpeg/png</div>
                {/* <div>尺寸：600px*830px</div> */}
              </div>
              <div className={styles.appoint_task_demo}>
                <div>示例图</div>
                <img src={taskDemoImg} alt='' />
                <div>上传后讲展示在任务最左侧</div>
              </div>
            </FormItem>
            <FormItem
              label='排序值'
              {...this.formLayout}
            >
              {getFieldDecorator( 'sort', {
                  rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}排序值 ` }],
                  initialValue: detail.sort,
                } )( <InputNumber placeholder={`${formatMessage( { id: 'form.input' } )}数字，数值越小在任务列表中的排序越靠前，不填时默认为任务创建顺序`} step={1} min={1} max={999} style={{ width: '100%' }} /> )}
            </FormItem>
          </div>
        </Form>
      </div>

    );
  }
}

export default TaskForm;

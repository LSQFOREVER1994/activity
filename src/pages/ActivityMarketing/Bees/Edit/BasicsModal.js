/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import { Input, Form, Select, DatePicker, Radio, InputNumber, Collapse, Alert } from 'antd';
import moment from 'moment';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import UploadModal from '@/components/UploadModal/UploadModal';
import { activityTypes, themeTypes, seniorityTypes } from '../BeesEnumes';
import styles from './edit.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const limitDecimals = ( value ) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : ''
  }
  return ''
};
@connect( ( { bees } ) => ( {
  eligibilityList: bees.eligibilityList,
  eligibilityType: bees.eligibilityType
} ) )
class BasicModal extends PureComponent {

  formLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 14 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      visibleBgColor: false,
    }
  }

  componentDidMount() {
    this.initBasicsData()
    this.getEligibilityType()
    const { domData = {} } = this.props;
    const { attendTask = {} } = domData
    const { taskEventType } = attendTask
    if ( taskEventType ) this.getEligibilityList( taskEventType )
  }

  // 活动基础信息初始化
  initBasicsData = () => {
    const { domData = {}, changeDomData } = this.props;
    // 编辑不走此流程
    if ( ( domData && domData.id ) || ( domData && domData.name ) ) return
    // 塞入默认值
    const defaultObj = {
      theme: 'theme1',
      backgroundColor: '#F1F1F1',
      // terminalType:'APP',
      // withAccount:false,
      activityType: "NEWER",
      state: 'ENABLE',
      endTip: '活动已结束',
      isBury: true,
      attendTask: {
        clickEvent: {
          clickType: 'NONE'
        }
      }
    }
    const obj = Object.assign( domData, defaultObj );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  // 获取资格类型
  getEligibilityType = ( name ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : ''
        },
        successFun: () => { }
      },
    } );
  }

  setData = ( payload ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/setState',
      payload,
    } );
  }

  // 获取资格列表
  getEligibilityList = ( id ) => {
    this.setData( { eligibilityList: [] } )
    if ( !id ) return
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query:{
          id
        },
        successFun:( data )=>{
        }
      },
    } );
  }

  changeInput = ( e, type ) => {
    const { value } = e.target;
    const { domData, changeDomData } = this.props;
    const obj = Object.assign( domData, { [type]: value } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  changeSelect = ( e, type ) => {
    const { domData, changeDomData } = this.props;
    const obj = Object.assign( domData, { [type]: e } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  changeInputNumber = ( e, type ) => {
    const { domData, changeDomData } = this.props;
    if ( type === 'dailyRewardCount' && !e === 0 ) return; // 单日中奖次数上限为空或者0时不传值，则无法抽奖
    const obj = Object.assign( domData, { [type]: e } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const { domData, changeDomData } = this.props;
    const obj = Object.assign( domData, { startTime, endTime } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  changeImg = ( e ) => {
    const { domData, changeDomData } = this.props;
    const obj = Object.assign( domData, { backgroundImage: e } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  changeColor = ( e ) => {
    const color = e.hex;
    const { domData, changeDomData } = this.props;
    const obj = Object.assign( domData, { backgroundColor: color } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  showHomeBgColor = ( e ) => {
    e.stopPropagation()
    const { visibleBgColor } = this.state;
    this.setState( {
      visibleBgColor: !visibleBgColor
    } )
  }

  // 活动页面参与次数基本配置
  renderCountOption = () => {
    const { domData = {} } = this.props;
    return (
      <Collapse>
        <Panel header="活动页面参与次数基本配置" key="1">
          <div style={{ marginBottom: '20px' }}>
            <Alert
              type="warning"
              showIcon
              message={(
                <div style={{ fontSize: 12, width: '100%', display: 'flex', marginTop: '2px' }}>
                  <span>抽奖类组件（九宫格、大转盘、红包雨、盲盒等）和需用到次数的组件（答题组件的次数、集卡组件的抽卡次数等）中的次数均共用。活动页面次数相关配置均在此配置。</span>
                </div> )}
            />
          </div>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>初始化次数</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={domData.initCount}
              placeholder="请输入初始化次数"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeInputNumber( e, 'initCount' )}
              style={{ width: '85%' }}
            />
            <div style={{ fontSize: '12px', color: '#ff2d2d', lineHeight: '16px' }}>
              * 用户首次登录活动赠送的次数
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>每日免费次数</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={domData.dailyCount}
              placeholder="请输入每日免费次数"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeInputNumber( e, 'dailyCount' )}
              style={{ width: '85%' }}
            />
            <div style={{ fontSize: '12px', color: '#ff2d2d', lineHeight: '16px' }}>
              * 用户每日登录活动会赠送的次数，次数当日有效
            </div>
          </FormItem>
          <FormItem label="单日中奖次数上限" {...this.formLayout}>
            <InputNumber
              value={domData.dailyRewardCount}
              placeholder="请输入"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => { this.changeInputNumber( e, 'dailyRewardCount' ) }}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>次</span>
            <div style={{ fontSize: '12px', color: '#ff2d2d', lineHeight: '16px' }}>
              *限制用户单日中奖次数。若配置此选项，奖项必须设置谢谢参与奖项。
            </div>
          </FormItem>
          <FormItem label="总中奖次数上限" {...this.formLayout}>
            <InputNumber
              value={domData.maxRewardCount}
              placeholder="请输入"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeInputNumber( e, 'maxRewardCount' )}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>次</span>
            <div style={{ fontSize: '12px', color: '#ff2d2d', lineHeight: '16px' }}>
              *限制用户本期中奖次数。若配置此选项，奖项必须设置谢谢参与奖项。
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>0库存奖品概率是否移除</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'withoutEmpty' )}
              value={domData.withoutEmpty}
            >
              <Radio value={false}>否</Radio>
              <Radio value>是</Radio>
            </Radio.Group>
            <div style={{ fontSize: '12px', color: '#ff2d2d', lineHeight: '16px' }}>
              * 若选择是（移除），则此奖品的中奖概率将平均分配给其余奖品（此奖品不会被抽中），低概率大奖会更容易被抽中。若选择否（不移除），此奖品中奖概率仍在，若抽中，则前端会为用户抽中谢谢参与。此项若选择否，奖项必须设置谢谢参与奖项。
            </div>
          </FormItem>
        </Panel>
      </Collapse>
    )
  }

  // 资格判断字段更新
  changeAttendTask = ( e, type ) => {
    let val
    if ( e ) {
      val = e
      if ( e.target ) val = e.target.value
    }
    const { domData, changeDomData } = this.props;
    const { attendTask = {} } = domData
    const newAttendTask = Object.assign( attendTask, { [type]: val } );
    const obj = Object.assign( domData, { attendTask: newAttendTask } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  // 资格按钮跳转配置
  changeAttendTaskClickEven = ( e, type ) => {
    let val
    if ( e ) {
      val = e
      if ( e.target ) val = e.target.value
    }
    const { domData, changeDomData } = this.props;
    const { attendTask = {} } = domData
    const { clickEvent = {} } = attendTask
    const newClickEvent = Object.assign( clickEvent, { [type]: val } )
    const newAttendTask = Object.assign( attendTask, { clickEvent: newClickEvent } );
    const obj = Object.assign( domData, { attendTask: newAttendTask } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }

  // 选择资格相关
  changeEligibility = ( e, type ) => {
    const { domData, changeDomData } = this.props;
    const { attendTask = {} } = domData
    const newAttendTask = Object.assign( attendTask, { [type]: e } );
    if ( type === 'taskEventType' ) {
      this.getEligibilityList( e )
      delete newAttendTask.taskEventId
    }
    const obj = Object.assign( domData, { attendTask: newAttendTask } );
    changeDomData( obj );
    this.setState( { time: new Date() } )
  }


  // 登录资格判断
  rednerQualificationsSet = () => {
    const { domData, eligibilityList, eligibilityType } = this.props;
    const { attendTask = {} } = domData
    return (
      <div style={{ marginTop: '20px' }}>
        <Collapse>
          <Panel header="登录资格判断" key="4">
            <div style={{ marginBottom: '20px' }}>
              <Alert
                type="warning"
                showIcon
                message={(
                  <div style={{ fontSize: 12, width: '100%', display: 'flex', marginTop: '2px' }}>
                    <span>若配置了资格，参与活动时，会判断是否满足资格，满足时正常参与成功。不满足时，无法参与活动并展示不满足资格弹窗。</span>
                  </div> )}
              />
            </div>
            <div style={{ marginBottom: '20px', minHeight: 200 }}>
              <Form>
                <FormItem label='关联资格' {...this.formLayout}>
                  <div>
                    <Select
                      style={{ width: '40%' }}
                      showSearch
                      filterOption={( input, option ) =>
                        option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                      }
                      value={attendTask.taskEventType}
                      placeholder="请选择资格类型"
                      onChange={( e ) => this.changeEligibility( e, 'taskEventType' )}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      allowClear
                    >
                      {eligibilityType.map( item => (
                        <Option key={item.id}>{item.name}</Option>
                      ) )}
                    </Select>
                    <Select
                      style={{ width: '40%', marginLeft: '20px' }}
                      showSearch
                      filterOption={( input, option ) =>
                        option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                      }
                      value={attendTask.taskEventId}
                      placeholder="请选择资格"
                      onChange={( e ) => this.changeEligibility( e, 'taskEventId' )}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      allowClear
                    >
                      {eligibilityList.map( item => (
                        <Option key={item.taskEventId}>{item.name}</Option>
                      ) )}
                    </Select>
                  </div>
                </FormItem>
                <FormItem label='不满足资格标题' {...this.formLayout}>
                  <Input
                    value={attendTask.unableAttendTitle}
                    onChange={( e ) => this.changeAttendTask( e, 'unableAttendTitle' )}
                    placeholder="请输入不满足资格标题"
                    maxLength={10}
                  />
                </FormItem>

                <FormItem label='不满足资格内容' {...this.formLayout}>
                  <Input
                    value={attendTask.unableAttendTip}
                    onChange={( e ) => this.changeAttendTask( e, 'unableAttendTip' )}
                    maxLength={40}
                    placeholder="请输入不满足资格内容"
                  />
                </FormItem>
                <FormItem label='不满足资格按钮文案' {...this.formLayout}>
                  <Input
                    value={attendTask.unableAttendBtnText}
                    onChange={( e ) => this.changeAttendTask( e, 'unableAttendBtnText' )}
                    maxLength={10}
                    placeholder="请输入不满足资格按钮文案"
                  />
                </FormItem>
                <FormItem label='设置跳转' {...this.formLayout}>
                  <Radio.Group
                    onChange={( e ) => this.changeAttendTaskClickEven( e, 'clickType' )}
                    value={attendTask.clickEvent ? attendTask.clickEvent.clickType : ''}
                  >
                    <Radio value="NONE">无</Radio>
                    <Radio value="FEATURE">功能</Radio>
                    <Radio value="CUSTOM_LINK">自定义链接</Radio>
                  </Radio.Group>
                </FormItem>

                {attendTask.clickEvent && attendTask.clickEvent.clickType === 'FEATURE' &&
                  <FormItem label="选择功能" {...this.formLayout}>
                    <Select
                      style={{ width: '100%' }}
                      onChange={( e ) => this.changeAttendTaskClickEven( e, 'key' )}
                      value={attendTask.clickEvent ? attendTask.clickEvent.key : ''}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                      placeholder="请选择功能"
                    >
                      {seniorityTypes.map( info => <Option value={info.key}>{info.value}</Option> )}
                    </Select>
                  </FormItem>
                }
                {attendTask.clickEvent && attendTask.clickEvent.clickType === 'CUSTOM_LINK' &&
                  <FormItem
                    style={{ display: 'flex' }}
                    label='跳转链接'
                    {...this.formLayout}
                  >
                    <Input
                      value={attendTask.clickEvent ? attendTask.clickEvent.link : ''}
                      placeholder="请输入跳转链接"
                      onChange={( e ) => this.changeAttendTaskClickEven( e, 'link' )}
                    />
                  </FormItem>
                }
              </Form>
            </div>
          </Panel>
        </Collapse>
      </div>
    )
  }

  render() {
    const { domData = {} } = this.props;
    const { visibleBgColor } = this.state;
    return (
      <div>
        <div onClick={this.showHomeBgColor} className={styles.cover} hidden={!visibleBgColor} />
        <FormItem label={<span className={styles.labelText}><span>*</span>活动名称</span>} {...this.formLayout}>
          <Input
            value={domData.name}
            placeholder="请输入活动名称"
            onChange={( e ) => this.changeInput( e, 'name' )}
            maxLength={20}
            suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{( domData && domData.name && domData.name.length ) || 0}/20</span>}
          />
        </FormItem>
        <FormItem label={<span className={styles.labelText}><span>*</span>活动类型</span>} {...this.formLayout}>
          <Select
            style={{ width: '50%' }}
            value={domData.activityType}
            placeholder="请选择活动类型"
            onChange={( e ) => this.changeSelect( e, 'activityType' )}
            disabled={!!domData.id}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {activityTypes.map( info => {
              return (
                <Option key={info.key}>{info.value}</Option>
              )
            } )}
          </Select>
          <span style={{ fontSize: 12, marginLeft: '10px', color: '#999' }}>
            * 保存后，活动类型将无法更改
          </span>
        </FormItem>
        <FormItem label={<span className={styles.labelText}><span>*</span>活动二级页面主题</span>} {...this.formLayout}>
          <Select
            style={{ width: '50%' }}
            value={domData.theme}
            placeholder="请选择主题"
            onChange={( e ) => this.changeSelect( e, 'theme' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {themeTypes.map( info => {
              return (
                <Option key={info.key}>{info.value}</Option>
              )
            } )}
          </Select>
        </FormItem>
        <FormItem label='活动时间' {...this.formLayout}>
          <RangePicker
            style={{ width: '100%' }}
            showTime
            value={domData.startTime ? [moment( domData.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( domData.endTime, 'YYYY-MM-DD HH:mm:ss' )] : []}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={( e ) => this.changeDate( e )}
          />
        </FormItem>
        <FormItem label={<span className={styles.labelText}><span>*</span>活动结束提示语</span>} {...this.formLayout}>
          <Input
            value={domData.endTip}
            placeholder="请输入活动结束提示语"
            onChange={( e ) => this.changeInput( e, 'endTip' )}
            maxLength={30}
            suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{domData.endTip && domData.endTip.length}/30</span>}
          />
        </FormItem>

        <FormItem label={<span className={styles.labelText}><span>*</span>活动状态</span>} {...this.formLayout}>
          <Radio.Group
            onChange={( e ) => this.changeInput( e, 'state' )}
            value={domData.state}
          >
            <Radio value="ENABLE">启用</Radio>
            <Radio value="PAUSE">暂停</Radio>
            <Radio value="DISABLE">禁用</Radio>
          </Radio.Group>
          <span style={{ fontSize: 12, marginLeft: '20px', color: '#999' }}>*选择禁用时，活动页面将无法访问</span>
        </FormItem>

        <FormItem
          label={
            <span
              className={styles.labelText}
            >
              <span>*</span>
              {domData.state === 'PAUSE' ? '活动暂停提示语' : '活动禁用提示语'}
            </span>}
          {...this.formLayout}
          hidden={domData.state === 'ENABLE'
          }
        >
          <Input
            value={domData.pauseTip}
            placeholder="请输入活动暂停提示语"
            onChange={( e ) => this.changeInput( e, 'pauseTip' )}
            maxLength={30}
            suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{domData.pauseTip && domData.pauseTip.length}/30</span>}
          />
        </FormItem>
        <FormItem label='活动规则' {...this.formLayout}>
          <BraftEditor
            record={domData.rules}
            onChange={( e ) => this.changeSelect( e, 'rules' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem>
        <FormItem label='领奖规则' {...this.formLayout}>
          <BraftEditor
            record={domData.rewardRules}
            onChange={( e ) => this.changeSelect( e, 'rewardRules' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem>
        <FormItem label="是否启用埋点" {...this.formLayout}>
          <Radio.Group
            onChange={( e ) => this.changeInput( e, 'isBury' )}
            value={domData.isBury}
          >
            <Radio value>开启</Radio>
            <Radio value={false}>关闭</Radio>
          </Radio.Group>
          <span style={{ fontSize: 12, marginLeft: '20px', color: '#999' }}>*选择关闭时，将不对用户行为进行统计</span>
        </FormItem>
        {/* <FormItem
          extra={<div style={{ fontSize: 12 }}>*埋点统计用于记录用户行为数据</div>}
          label='埋点统计'
          {...this.formLayout}
        >
          <Input
            value={domData.buryPointId}
            placeholder="请输入活动对应的appid，用于统计活动参与人数"
            onChange={( e ) => this.changeInput( e, 'buryPointId' )}
          />
        </FormItem> */}
        <FormItem
          label='页面背景图'
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={domData.backgroundImage} onChange={this.changeImg} />
            <div
              style={
                {
                  width: '180px',
                  fontSize: 13,
                  color: '#999',
                  lineHeight: 2,
                  marginTop: 10,
                  marginLeft: 10,
                }
              }
            >
              <div>格式：jpg/jpeg/png </div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>

        <FormItem
          label="页面背景色"
          {...this.formLayout}
          extra={<div style={{ fontSize: 12 }}>*填充页面除图片外的区域</div>}
        >
          <span
            style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
            onClick={( e ) => { this.showHomeBgColor( e ) }}
          >
            <span style={{ display: 'inline-block', background: domData.backgroundColor, width: 116, height: '22px' }} />
          </span>

          {
            visibleBgColor &&
            <div style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}>
              <SketchPicker
                width="230px"
                disableAlpha
                color={domData.backgroundColor}
                onChange={this.changeColor}
              />
            </div>
          }
        </FormItem>

        <FormItem
          extra={<div style={{ fontSize: 12 }}>*参与,抽奖,邀请绑定等动作前需要校验拦截,为空则不校验. 格式：多个按英文,分割</div>}
          label='允许的用户前缀'
          {...this.formLayout}
        >
          <Input
            value={domData.allowedUserPrefix}
            placeholder="请输入允许的用户前缀"
            onChange={( e ) => this.changeInput( e, 'allowedUserPrefix' )}
          />
        </FormItem>
        {/* 活动页面参与次数基本配置 */}
        {this.renderCountOption()}
        {/* 登录资格判断 */}
        {this.rednerQualificationsSet()}
      </div>
    );
  }
}

export default BasicModal;

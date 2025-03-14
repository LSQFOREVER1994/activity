/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Radio, DatePicker, Select, Tabs, Switch, Alert, Checkbox, Button, TimePicker, InputNumber } from 'antd';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import { connect } from 'dva';
import { DomDataContext } from '../../provider';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import { seniorityTypes } from '@/pages/ActivityMarketing/BeesV3/BeesEnumes';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

function ActivitySettings( props ) {
  const [domData, changeDomData] = useContext( DomDataContext );
  const { eligibilityList, eligibilityType, dispatch, liveData } = props;

  const [functionConfig, setFunctionConfig] = useState( [] );

  // 获取资格类型
  const getEligibilityType = name => {
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : '',
          removeActivity:true
        },
        successFun: () => { },
      },
    } );
  };

  // 获取资格列表
  const getEligibilityList = id => {
    if ( !id ) return;
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query: {
          id,
        },
        successFun: data => { },
      },
    } );
  };

  

  
  
 


  useEffect( () => {
    const { attendTask = {}, extendsConfig = {}, receiveEligibilityTask = {} } = domData;
    getEligibilityType();
    if ( attendTask.taskEventType ) getEligibilityList( attendTask.taskEventType );
    let obj = {};
    /** 进入页面填入默认值 */

    // 登录资格默认值
    if ( Object.keys( attendTask ).length === 0 ) {
      const newAttendTask = Object.assign( attendTask, {
        unableAttendTitle: '温馨提示',
        unableAttendTip: '您不是受邀用户无法参与活动',
        unableAttendBtnText: '我知道了',
      } );
      obj = Object.assign( domData, { attendTask: newAttendTask } );
      changeDomData( obj );
    }

    // 领奖资格默认值
    if ( Object.keys( receiveEligibilityTask ).length === 0 ) {
      const newPrizeTask = Object.assign( receiveEligibilityTask, {
        ineligibleTitle: '温馨提示',
        ineligibleTip: '您不是受邀用户无法参与活动',
        ineligibleBtnText: '我知道了',
      } );
      obj = Object.assign( domData, { receiveEligibilityTask: newPrizeTask } );
      changeDomData( obj );
    }

    // 公告设置默认值
    if ( Object.keys( extendsConfig ).length === 0 ) {
      const partExtendsConfig = Object.assign( extendsConfig, {
        isEnableNotice: false,
        isNoticeClose: true,
        noticeTitle: '系统维护',
        noticeContent: '活动正在定期维护中，请稍后再来哦~',
      } );
      obj = Object.assign( domData, { extendsConfig: partExtendsConfig } );
      changeDomData( obj );
    }

    dispatch( {
      type: 'bees/typeFunctionConfig',
      payload: {
        body: {
          jumpType: 'TASK',
          page:{
            pageNum: 1,
            pageSize: 10000,
          },
        },
        callback: res => {
          setFunctionConfig( res.list );
        },
      },
    } );
  }, [] );

  const changeInput = ( e, type, menuBarType ) => {
    const value = e?.target ? e.target.value : e;
    if ( type === 'taskEventType' ) {
      const { attendTask = {}, receiveEligibilityTask = {} } = domData;
      const newTask =
        menuBarType === 'attendTask'
          ? Object.assign( attendTask, { [type]: value } )
          : Object.assign( receiveEligibilityTask, { [type]: value } );

      getEligibilityList( value );
      delete newTask.taskEventId;
    }
    let obj = {};
    if ( !menuBarType ) {
      obj = Object.assign( domData, { [type]: value } );
    } else {
      const newMenuObj = Object.assign( domData[menuBarType] || {}, { [type]: value } );
      obj = Object.assign( domData, { [menuBarType]: newMenuObj } );
    }
    changeDomData( obj );
  };

  const changeTaskValue = ( e, type, paramsType ) => {
    changeInput( undefined, 'parameter', paramsType )
    changeInput( undefined, 'parameter2', paramsType )
    changeInput( e, type, paramsType )
  }

  // 修改关联资格按钮跳转信息
  const changeAttendTaskClickEvent = ( e, type, qulifyType ) => {
    let value = e?.target ? e.target.value : e;
    if ( type === 'key' ) {
      value = JSON.stringify( functionConfig.find( item => item.parameter === value ) );
    }
    const { attendTask = {}, receiveEligibilityTask = {} } = domData;
    const typeToObj = qulifyType === 'receiveEligibilityTask' ? receiveEligibilityTask : attendTask;
    const { clickEvent = {} } = typeToObj;
    const newClickEvent = Object.assign( clickEvent, { [type]: value } );
    const newAttendTask = Object.assign( typeToObj, { clickEvent: newClickEvent } );
    const obj =
      qulifyType === 'receiveEligibilityTask'
        ? Object.assign( domData, { receiveEligibilityTask: newAttendTask } )
        : Object.assign( domData, { attendTask: newAttendTask } );
    changeDomData( obj );
  };

  const changeDate = e => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const obj = Object.assign( domData, { startTime, endTime } );
    changeDomData( obj );
  };

  const changeTimePeriodDate = ( e, idx, type ) => {
    const val = e ? e.format( 'HH:mm:ss' ) : '';
    const newAppointTime = domData.appointTime ? [...domData.appointTime] : [];
    newAppointTime[idx] = { ...newAppointTime[idx], [type]: val };
    changeDomData( { ...domData, appointTime: newAppointTime } );
  };

  const addTimePeriodDate = () => {
    const newAppointTime = ( domData.appointTime || [] ).concat( { startTime: '', endTime: '' } );
    changeDomData( { ...domData, appointTime: newAppointTime } );
  }

  const deleteTimePeriodDate = ( idx ) => {
    const newAppointTime = domData.appointTime ? [...domData.appointTime] : [];
    newAppointTime.splice( idx, 1 );
    changeDomData( { ...domData, appointTime: newAppointTime } );
  }

  const renderDateCheckBox = ( dateType ) => {
    const view = {
      WEEKLY: (
        <FormItem label="指定日期" required {...formLayout}>
          <Checkbox.Group
            value={domData.appointDate}
            onChange={e => changeInput( e, 'appointDate' )}
            style={{ textIndent: '8px' }}
          >
            {['一', '二', '三', '四', '五', '六', '日'].map( ( day, index ) => (
              <Checkbox key={day} value={index + 1}>周{day}</Checkbox>
            ) )}
          </Checkbox.Group>
        </FormItem>
      ),
      MONTHLY: (
        <FormItem label="指定日期" required {...formLayout}>
          <Checkbox.Group
            value={domData.appointDate}
            onChange={e => changeInput( e, 'appointDate' )}
            style={{ textIndent: '8px' }}
          >
            {Array.from( { length: 31 }, ( _, i ) => (
              <Checkbox key={i + 1} value={i + 1}>{i + 1}日</Checkbox>
            ) )}
          </Checkbox.Group>
        </FormItem>
      )
    }
    return view[dateType]
  }

  const renderDateTimePeriod = () => {
    const view = domData.appointTime?.length ? domData.appointTime.map( ( item, index ) => {
      const { startTime, endTime } = item || {};
      return (
        <React.Fragment key={item.start}>
          <FormItem label={`时间段${index + 1}`} {...formLayout} style={{ display: 'flex' }}>
            <TimePicker
              value={startTime ? moment( startTime, 'HH:mm:ss' ) : undefined}
              onChange={( e ) => { changeTimePeriodDate( e, index, 'startTime' ) }}
              style={{ width: '35%' }}
              placeholder='请选择开始时间'
              getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
            />
            <span style={{ padding: '0 10px' }}>~</span>
            <TimePicker
              value={endTime ? moment( endTime, 'HH:mm:ss' ) : undefined}
              onChange={( e ) => { changeTimePeriodDate( e, index, 'endTime' ) }}
              style={{ width: '35%' }}
              placeholder='请选择结束时间'
              getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
            />
            <span
              style={{ paddingLeft: '10px', color: 'red', cursor: 'pointer' }}
              onClick={() => { deleteTimePeriodDate( index ) }}
            >删除
            </span>
          </FormItem>
        </React.Fragment>
      )
    } ) : null

    return (
      <div>
        {view}
        <FormItem label={null} {...formLayout}>
          <Button
            className={styles.add_button}
            type="dashed"
            onClick={addTimePeriodDate}
            icon="plus"
          >
            <span>添加时间段</span>
          </Button>
        </FormItem>
      </div>
    )
  }

  // 基础设置
  const renderBase = () => {
    return (
      <div className={styles.container}>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>活动名称
            </span>
          }
          {...formLayout}
        >
          <Input
            value={domData.name}
            placeholder="请输入活动名称"
            onChange={e => changeInput( e, 'name' )}
            maxLength={20}
            suffix={
              <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                {( domData && domData.name && domData.name.length ) || 0}/20
              </span>
            }
          />
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>活动时间类型
            </span>
          }
          {...formLayout}
        >
          <Radio.Group onChange={e => changeInput( e, 'timeType' )} value={domData.timeType || false}>
            <Radio value={false}>长期</Radio>
            <Radio value>起止时间</Radio>
          </Radio.Group>
        </FormItem>
        {
          domData.timeType && (
            <FormItem label="活动时间" required {...formLayout}>
              <RangePicker
                style={{ width: '100%' }}
                showTime
                value={
                  domData.startTime
                    ? [
                      moment( domData.startTime, 'YYYY-MM-DD HH:mm:ss' ),
                      moment( domData.endTime, 'YYYY-MM-DD HH:mm:ss' ),
                    ]
                    : []
                }
                format="YYYY-MM-DD HH:mm:ss"
                onChange={e => changeDate( e )}
              />
            </FormItem> )
        }
        <FormItem label="指定日期类型" {...formLayout}>
          <Select
            style={{ width: '30%' }}
            onChange={e => {
              changeInput( e, 'appointDateType' );
              if( e === 'WEEKLY' ) {
                changeInput( [1, 2, 3, 4, 5, 6, 7], 'appointDate' )
              }else{
                changeInput( [], 'appointDate' )
              }
            }}
            value={domData.appointDateType || "DAILY"}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="DAILY">每天</Option>
            <Option value="WEEKLY">每周</Option>
            <Option value="MONTHLY">每月</Option>
          </Select>
        </FormItem>
        {
          domData.appointDateType !== 'DAILY' && (
            renderDateCheckBox( domData.appointDateType )
          )
        }
        <FormItem label="指定时间类型" {...formLayout}>
          <Select
            style={{ width: '30%' }}
            onChange={e => changeInput( e, 'appointTimeType' )}
            value={domData.appointTimeType || "ALL_DAY"}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="ALL_DAY">全天</Option>
            <Option value="TIME_PERIOD">时间段</Option>
          </Select>
        </FormItem>
        {domData.appointTimeType === 'TIME_PERIOD' && renderDateTimePeriod()}
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>活动未开始提示语
            </span>
          }
          {...formLayout}
        >
          <Input
            value={domData.notStartTip}
            placeholder="请输入活动未开始提示语"
            onChange={e => changeInput( e, 'notStartTip' )}
            maxLength={30}
            suffix={
              <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                {domData.notStartTip && domData.notStartTip.length}/30
              </span>
            }
          />
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>活动结束提示语
            </span>
          }
          {...formLayout}
        >
          <Input
            value={domData.endTip}
            placeholder="请输入活动结束提示语"
            onChange={e => changeInput( e, 'endTip' )}
            maxLength={30}
            suffix={
              <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                {domData.endTip && domData.endTip.length}/30
              </span>
            }
          />
        </FormItem>

        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>活动状态
            </span>
          }
          {...formLayout}
        >
          <Radio.Group onChange={e => changeInput( e, 'state' )} value={domData.state}>
            <Radio value="ENABLE">启用</Radio>
            <Radio value={"DISABLE" || "PAUSE"}>禁用</Radio>
          </Radio.Group>
          <span style={{ fontSize: 12, marginLeft: '20px', color: '#999' }}>
            *选择禁用时，活动页面将无法访问
          </span>
        </FormItem>

        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>
              {domData.state === 'PAUSE' ? '活动暂停提示语' : '活动禁用提示语'}
            </span>
          }
          {...formLayout}
          hidden={domData.state === 'ENABLE'}
        >
          <Input
            value={domData.pauseTip}
            placeholder="请输入活动禁用提示语"
            onChange={e => changeInput( e, 'pauseTip' )}
            maxLength={30}
            suffix={
              <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                {domData.pauseTip && domData.pauseTip.length}/30
              </span>
            }
          />
        </FormItem>
      </div>
    );
  };

  // 规则设置
  const renderRule = () => {
    return (
      <>
        <FormItem label="活动规则" {...formLayout}>
          <BraftEditor
            record={domData.rules}
            onChange={e => changeInput( e, 'rules' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem>
        <FormItem label="领奖规则" {...formLayout}>
          <BraftEditor
            record={domData.rewardRules}
            onChange={e => changeInput( e, 'rewardRules' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem>
      </>
    )
  }

  // 活动登录资格 / 领奖资格
  const renderLoginOrPrize = type => {
    const { attendTask = {}, receiveEligibilityTask = {} } = domData;
    const typeToObj = type === 'prize' ? receiveEligibilityTask : attendTask;
    const {
      clickEvent = {},
      taskEventType,
      taskEventId,
      parameter,
      unableAttendTitle,
      unableAttendTip,
      unableAttendBtnText,
      limitPrizeTypes = [],
      ineligibleTitle,
      ineligibleTip,
      ineligibleBtnText,
    } = typeToObj;
    const paramsType = type === 'prize' ? 'receiveEligibilityTask' : 'attendTask';
    const prizeOption = [
      { label: '红包', value: 'RED' },
      { label: '实物', value: 'GOODS' },
      { label: '卡密', value: 'COUPON' },
      { label: '话费', value: 'PHONE' },
      { label: '微信立减金', value: 'WX_COUPON' },
      { label: '微信代金券', value: 'WX_VOUCHER' },
      { label: '权益包', value: 'RIGHT_PACKAGE' },
      { label: '自定义', value: 'CUSTOM' },
    ];

    const alertSpan =
      type === 'prize' ? (
        <span>
          {' '}
          若配置了资格，在领奖时，针对配置的奖品类型，判断是否满足资格，满足时即可正常领取奖品。不满足时，做领奖拦截，并展示不满足资格弹窗。
          <span style={{ color: 'red' }}>仅支持权益中心发奖模式（新模式）</span>
        </span>
      ) : (
        <span>
          若配置了资格，参与活动时，会判断是否满足资格，满足时正常参与成功。不满足时，无法参与活动并展示不满足资格弹窗。
        </span>
      );

      const getJSONData = () => {
        try {
          return JSON.parse( clickEvent.key || null )?.parameter;
        } catch ( error ) {
          return functionConfig.find( item => item.parameter === clickEvent.key )?.parameter || "";
        }
      }

    const clickTypeSelect = (
      <>
        {clickEvent.clickType === 'FEATURE' && (
          <FormItem label="选择功能" {...formLayout}>
            <Select
              style={{ width: '80%' }}
              onChange={e => changeAttendTaskClickEvent( e, 'key', paramsType )}
              value={getJSONData()}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              allowClear
            >
              {/* {seniorityTypes.map( info => <Option value={info.key} key={info.key}>{info.value}</Option> )} */}

              {functionConfig.map( item => (
                <Option key={item.id} value={item.parameter}>
                  {item.name}
                </Option>
              ) )}
            </Select>
          </FormItem>
        )}
        {clickEvent.clickType === 'CUSTOM_LINK' && (
          <>
            <FormItem {...formLayout} style={{ display: 'flex' }} label="端内链接">
              <Input
                value={clickEvent.link}
                onChange={e => changeAttendTaskClickEvent( e, 'link', paramsType )}
                placeholder="请输入跳转链接"
              />
            </FormItem>
            <FormItem {...formLayout} style={{ display: 'flex' }} label="端外链接">
              <Input
                value={clickEvent.outLink}
                onChange={e => changeAttendTaskClickEvent( e, 'outLink', paramsType )}
                placeholder="请输入跳转链接"
              />
            </FormItem>
          </>
        )}
      </>
    );
    return (
      <div className={styles.container}>
        <div style={{ marginBottom: '20px' }}>
          <Alert
            type="warning"
            showIcon
            message={<div className={styles.alert_text}>{alertSpan}</div>}
          />
        </div>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>登录方式
            </span>
          }
          {...formLayout}
        >
          <Radio.Group disabled onChange={e => changeInput( e, 'terminalType' )} value={domData.terminalType || 'APP'}>
            <Radio value="APP">端内</Radio>
            <Radio value="WEB">端外</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>登录校验方式
            </span>
          }
          {...formLayout}
        >
          <Radio.Group onChange={e => changeInput( e, 'customerType' )} value={domData.customerType || 'MOBILE'}>
            <Radio value="MOBILE">仅手机号登录</Radio>
            <Radio value='ACCOUNT'>仅资金账号登录</Radio>
          </Radio.Group>
        </FormItem>
        {type === 'prize' && (
          <FormItem label="限制奖品类型" {...formLayout}>
            <Checkbox.Group
              value={limitPrizeTypes}
              options={prizeOption}
              onChange={e => changeInput( e, 'limitPrizeTypes', paramsType )}
            />
          </FormItem>
        )}
        <FormItem label="关联资格" {...formLayout}>
          <div>
            <Select
              style={{ width: '40%' }}
              showSearch
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              value={taskEventType || undefined}
              placeholder="请选择资格类型"
              onChange={e => changeInput( e, 'taskEventType', paramsType )}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              allowClear
            >
              {eligibilityType.map( item => (
                <Option key={item.id}>{item.name}</Option>
              ) )}
            </Select>
            <Select
              style={{ width: '50%', marginLeft: '20px' }}
              showSearch
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              value={taskEventId || undefined}
              placeholder="请选择资格"
              // onChange={e => changeInput( e, 'taskEventId', paramsType )}
              onChange={e => changeTaskValue( e, 'taskEventId', paramsType )}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              allowClear
            >
              {eligibilityList.map( item => (
                <Option key={item.taskEventId}>{item.name}</Option>
              ) )}
            </Select>
            {( attendTask?.taskEventId === 'IS_LAST_DAY_MONEY' || attendTask?.taskEventId === 'IS_TOTAL_MONEY' )&&(
              <InputNumber
                min={0}
                value={attendTask?.parameter}
                placeholder="X"
                onChange={e => changeInput( e, 'parameter', paramsType )}
                style={{ width:'70%' }}
              />
            )}
            {( attendTask?.taskEventId === 'IS_SUBSCRIBE_LIVE' || attendTask?.taskEventId === 'WATCH_LIVE' )&&(
              <>
                <Select
                // mode="multiple"
                  value={attendTask?.parameter}
                  placeholder="请选择直播间"
                  onChange={e => changeInput( e, 'parameter', paramsType )}
                  style={{ width:'70%' }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {liveData?.map( item => (
                    <Option
                      key={`${item.subject}(${item.webinarId})`}
                      value={item.webinarId}
                    >{`${item.subject}(${item.webinarId})`}
                    </Option>
              ) )}
                </Select>
                {
                  attendTask?.taskEventId === 'WATCH_LIVE' && (
                  <InputNumber
                    min={0}
                    value={attendTask?.parameter2}
                    placeholder="X"
                    onChange={e => changeInput( e, 'parameter2', paramsType )}
                    style={{ width:'70%' }}
                  />
                  )
                }
              </>
            )}
          </div>
        </FormItem>
        <FormItem label="不满足资格标题" {...formLayout}>
          <Input
            value={type === 'prize' ? ineligibleTitle : unableAttendTitle}
            placeholder="请输入不满足资格标题"
            onChange={e =>
              changeInput( e, type === 'prize' ? 'ineligibleTitle' : 'unableAttendTitle', paramsType )
            }
            maxLength={10}
            suffix={
              <span className={styles.title_suffix}>
                {( domData &&
                  ( type === 'prize' ? ineligibleTitle?.length : unableAttendTitle?.length ) ) ||
                  0}
                /20
              </span>
            }
          />
        </FormItem>
        <FormItem label="不满足资格内容" {...formLayout}>
          <TextArea
            value={type === 'prize' ? ineligibleTip : unableAttendTip}
            placeholder="请输入不满足资格内容"
            onChange={e =>
              changeInput( e, type === 'prize' ? 'ineligibleTip' : 'unableAttendTip', paramsType )
            }
            maxLength={100}
          />
        </FormItem>
        <FormItem label="不满足资格按钮文案" {...formLayout}>
          <Input
            value={type === 'prize' ? ineligibleBtnText : unableAttendBtnText}
            placeholder="请输入不满足资格文案"
            onChange={e =>
              changeInput(
                e,
                type === 'prize' ? 'ineligibleBtnText' : 'unableAttendBtnText',
                paramsType
              )
            }
            maxLength={10}
            suffix={
              <span className={styles.title_suffix}>
                {( domData &&
                  ( type === 'prize' ? ineligibleBtnText?.length : unableAttendBtnText?.length ) ) ||
                  0}
                /10
              </span>
            }
          />
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>设置按钮跳转
            </span>
          }
          {...formLayout}
        >
          <Radio.Group
            value={clickEvent.clickType || ''}
            onChange={e => changeAttendTaskClickEvent( e, 'clickType', paramsType )}
          >
            <Radio value="">无</Radio>
            {/* {type !== 'prize' && <Radio value="FEATURE">功能</Radio>} */}
            <Radio value="CUSTOM_LINK">自定义链接</Radio>
          </Radio.Group>
        </FormItem>
        {clickTypeSelect}
      </div>
    );
  };

  // 公告设置
  const renderPublish = () => {
    const { extendsConfig = {} } = domData;
    const { isEnableNotice, isNoticeClose, noticeTitle, noticeContent } = extendsConfig;
    return (
      <div className={styles.container}>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>是否启用公告
            </span>
          }
          {...formLayout}
        >
          <Switch
            checked={isEnableNotice}
            onChange={e => changeInput( e, 'isEnableNotice', 'extendsConfig' )}
          />
        </FormItem>
        <FormItem
          label={
            <span className={styles.labelText}>
              <span>*</span>是否可以被关闭
            </span>
          }
          {...formLayout}
        >
          <Switch
            checked={isNoticeClose}
            onChange={e => changeInput( e, 'isNoticeClose', 'extendsConfig' )}
          />
        </FormItem>
        <FormItem label="公告标题" {...formLayout}>
          <Input
            value={noticeTitle}
            placeholder="请输入公告标题"
            onChange={e => changeInput( e, 'noticeTitle', 'extendsConfig' )}
            maxLength={20}
            suffix={
              <span className={styles.title_suffix}>
                {( domData && noticeTitle?.length ) || 0}/20
              </span>
            }
          />
        </FormItem>
        <FormItem label="公告内容" {...formLayout}>
          <BraftEditor
            record={noticeContent}
            onChange={e => changeInput( e, 'noticeContent', 'extendsConfig' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
          {/* <TextArea
            value={noticeContent}
            placeholder="请输入公告内容"
            onChange={e => changeInput( e, 'noticeContent', 'extendsConfig' )}
            maxLength={100}
          /> */}
        </FormItem>
      </div>
    );
  };

  // 字典设置
  const renderDictionary = () => {
    const { dictConfig = {} } = domData;
    const { integralName } = dictConfig;
    return (
      <div className={styles.container}>
        <FormItem label="积分名称" {...formLayout}>
          <Input
            value={integralName}
            placeholder="请输入积分名称"
            onChange={e => changeInput( e, 'integralName', 'dictConfig' )}
            maxLength={3}
            suffix={
              <span className={styles.title_suffix}>
                {( domData && integralName?.length ) || 0}/3
              </span>
            }
          />
        </FormItem>
      </div>
    );
  };

  const renderRedemptionPage = () => {
    const { extendsConfig = {} } = domData;
    const { redPacketRules, wxCouponRules, phoneBillRules } = extendsConfig;
    return (
      <div className={styles.container}>
        <FormItem label="红包说明" {...formLayout}>
          <BraftEditor
            record={redPacketRules || ""}
            onChange={e => changeInput( e, 'redPacketRules', 'extendsConfig' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem>
        <FormItem label="微信立减金说明" {...formLayout}>
          <BraftEditor
            record={wxCouponRules || ''}
            onChange={e => changeInput( e, 'wxCouponRules', 'extendsConfig' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem>
        {/* <FormItem label="话费说明" {...formLayout}>
          <BraftEditor
            record={phoneBillRules || ''}
            onChange={e => changeInput( e, 'phoneBillRules', 'extendsConfig' )}
            field="content"
            contentStyle={{ height: '250px' }}
          />
        </FormItem> */}
      </div>
    )

  }

  return (
    <>
      <Tabs defaultActiveKey="BASE">
        <TabPane tab="基本设置" key="BASE">
          <div className={styles.tab_container}>{renderBase()}</div>
        </TabPane>
        <TabPane tab='规则设置' key='RULE'>
          <div className={styles.tab_container}>{renderRule()}</div>
        </TabPane>
        <TabPane tab="活动登录资格" key="LOGIN">
          <div className={styles.tab_container}>{renderLoginOrPrize( 'login' )}</div>
        </TabPane>
        {/* <TabPane tab="领奖资格" key="PRIZE">
          <div className={styles.tab_container}>{renderLoginOrPrize( 'prize' )}</div>
        </TabPane> */}
        <TabPane tab="公告设置" key="PUBLISH">
          <div className={styles.tab_container}>{renderPublish()}</div>
        </TabPane>
        <TabPane tab="字典设置" key="DICTIONARY">
          <div className={styles.tab_container}>{renderDictionary()}</div>
        </TabPane>
        {/* <TabPane tab="兑换页设置" key="EXCHANGE">
          <div className={styles.tab_container}>{renderRedemptionPage()}</div>
        </TabPane> */}
      </Tabs>
    </>
  );
}

const mapProps = ( { bees } ) => ( {
  eligibilityList: bees.eligibilityList,
  eligibilityType: bees.eligibilityType,
  liveData: bees.liveData,
} );

export default connect( mapProps )( ActivitySettings );

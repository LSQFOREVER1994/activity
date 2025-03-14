/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import {
  Form,
  Switch,
  Input,
  Tooltip,
  Icon,
  Collapse,
  Select,
  Checkbox,
  Radio,
  InputNumber,
} from 'antd';
import RenderFormItem from '../RenderFormItem';
import { featureTypes } from '@/pages/ActivityMarketing/Bees/BeesEnumes';
import PrizeOption from '@/components/PrizeOption';

const FormItem = Form.Item;
const { Panel } = Collapse;
const { Option } = Select;
const InputGroup = Input.Group;

const limitDecimals = value => {
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : '';
  }
  if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : '';
  }
  return '';
};

const diyOptions = [
  { label: '不支持微信打开', value: 'noSupportWx' },
  { label: '需原生APP打开', value: 'openByApp' },
];

const renderList = [
  {
    renderType: 'Input',
    label: '不满足资格标题',
    field: 'inviterSetting.ineligibleTitle',
    required: false,
    wordsMax: 10,
    propsData: {
      placeholder: '请输入不满足资格标题',
    },
  },
  {
    renderType: 'TextArea',
    label: '不满足资格内容',
    field: 'inviterSetting.ineligibleTip',
    required: false,
    propsData: {
      maxLength: 40,
      placeholder: '请输入不满足资格内容',
    },
  },
  {
    renderType: 'Input',
    label: '不满足资格按钮文案',
    field: 'inviterSetting.ineligibleBtnText',
    required: false,
    wordsMax: 10,
    propsData: {
      placeholder: '请输入不满足资格按钮文案',
    },
  },
];
function InviterSetting( props ) {
  const {
    componentsData: { inviterSetting, inviterLimit },
    changeValue,
    eligibilityType,
    dispatch,
    functionConfig,
    liveData
  } = props;
  const {
    eventType,
    eventId,
    parameter,
    enable,
    limit,
    attendType,
    eachCount,
    rewardType,
    rewardValue,
  } = inviterSetting;
  const [eligibilityList, setEligibilityList] = useState( [] );


  // 获取直播列表
  const getLiveList = () => {
    dispatch( {
      type: 'bees/getLiveList',
      payload: {
      },
    } );
  };
  
  useEffect( () => {
    if ( inviterSetting?.eventId === 'IS_SUBSCRIBE_LIVE' || inviterSetting?.eventId === 'WATCH_LIVE' ) {
      getLiveList( );
    }
  }, [inviterSetting?.eventId] );

  const changeTaskValue = ( e, type ) => {
    changeValue( undefined, 'inviterSetting.parameter' )
    changeValue( undefined, 'inviterSetting.parameter2' )
    changeValue( e, type )
  }

  const changeEventType = ( e, t ) => {
    changeValue( '', 'inviterSetting.eventId' )
    changeValue( e, t )
  }

  // 获取资格列表
  const getEligibilityList = ( id ) => {
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query:{
          id
        },
        successFun:( data )=>{
          setEligibilityList( data )
        }
      },
    } );
  }

  const changeFeature = ( e ) => {
    const events = inviterSetting.clickEvent;
    const data = functionConfig.find( ( item )=>item.parameter === e );
    const newImgObj = Object.assign( events, {
      ...data,
      key: data.parameter
    } );
    changeValue( newImgObj, `inviterSetting.clickEvent` )
  }


  const renderSetJump = () => {
    const linkRestrictions = [];
    const events = inviterSetting.clickEvent;
    const setting = inviterSetting;
    if ( events ) {
      const { noSupportWx, openByApp } = events;
      if ( noSupportWx ) {
        linkRestrictions.push( 'noSupportWx' );
      }
      if ( openByApp ) {
        linkRestrictions.push( 'openByApp' );
      }
    }
    if ( !setting.enable ) return null;
    return (
      <>
        <FormItem required label="设置跳转">
          <Radio.Group
            onChange={e => {
              changeValue( e, 'inviterSetting.clickEvent.clickType' );
            }}
            value={events?.clickType || 'NONE'}
          >
            <Radio value="NONE"> 无 </Radio>
            <Radio value="FEATURE"> 功能 </Radio>
            <Radio value="CUSTOM_LINK"> 自定义链接 </Radio>
          </Radio.Group>
        </FormItem>
        {events?.clickType === 'FEATURE' && (
          <Form.Item label="跳转" layout="vertical">
            <Select
              allowClear
              value={events?.key}
              style={{ width: '100%' }}
              onChange={e => changeFeature( e )}
              getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
            >
              {functionConfig.map( item => (
                <Option style={{ width: '100%' }} value={item.parameter} key={item.id}>
                  {item.name}
                </Option>
              ) )}
            </Select>
          </Form.Item>
        )}
        {events?.clickType === 'CUSTOM_LINK' && (
          <>
            {/* <FormItem label="端内链接">
              <Input
                value={events?.link}
                onChange={e => {
                  changeValue(
                    e,
                    'inviterSetting.clickEvent.link'
                  );
                }}
              />
            </FormItem> */}
            <FormItem label="跳转链接">
              <Input
                value={events?.link}
                onChange={e => {
                  changeValue( e, 'inviterSetting.clickEvent.link' );
                }}
              />
            </FormItem>
            {/* <Form.Item label="链接限制">
              <Checkbox.Group
                options={diyOptions}
                value={linkRestrictions}
                onChange={e => {
                  diyOptions.forEach( item => {
                    changeValue( e.includes( item.value ), `inviterSetting.clickEvent.${item.value}` );
                  } );
                }}
              />
            </Form.Item> */}
          </>
        )}
      </>
    );
  };

  useEffect( ()=>{
    if( eventType ){
      getEligibilityList( eventType )
    }
  }, [eventType] )

  return (
    <React.Fragment>
      <Collapse defaultActiveKey="1">
        <Panel
          header={
            <div>
              <span>邀请人设置</span>
            </div>
          }
          key="1"
        >
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                邀请人资格限制
                {/* <Tooltip
                  title={
                    <span>
                      当用户不符合邀请人资格时，该用户的邀请码加密展示且当该用户点击复制时弹出不符合邀请资格提示
                    </span>
                  }
                >
                  <Icon type="question-circle" theme="filled" style={{ color: '#000000', marginLeft:5 }} />
                </Tooltip> */}
              </span>
              <Switch checked={enable} onChange={e => changeValue( e, 'inviterSetting.enable' )} />
            </div>
            {enable && (
            <>
              <FormItem label="邀请人资格">
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
                  value={eventType || undefined}
                  placeholder="请选择资格类型"
                  onChange={e => changeEventType( e, 'inviterSetting.eventType' )}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  allowClear
                >
                  {eligibilityType.map( item => (
                    <Option key={item.id}>{item.name}</Option>
              ) )}
                </Select>
                <Select
                  style={{ width: '100%' }}
                  showSearch
                  filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
                  value={eventId || undefined}
                  placeholder="请选择资格"
                  // onChange={e => changeValue( e, 'inviterSetting.eventId' )}
                  onChange={e => changeTaskValue( e, 'inviterSetting.eventId' )}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  allowClear
                >
                  {eligibilityList.map( item => (
                    <Option key={item.taskEventId}>{item.name}</Option>
              ) )}
                </Select>
                {( inviterSetting?.eventId === 'IS_LAST_DAY_MONEY' || inviterSetting?.eventId === 'IS_TOTAL_MONEY' )&&(
                  <InputNumber
                    min={0}
                    value={inviterSetting?.parameter}
                    placeholder="X"
                    onChange={e => changeValue( e, 'inviterSetting.parameter' )}
                    style={{ width:'70%' }}
                  />
                )}
                {( inviterSetting?.eventId === 'IS_SUBSCRIBE_LIVE' || inviterSetting?.eventId === 'WATCH_LIVE' )&&(
                  <>
                    <Select
                    // mode="multiple"
                      value={inviterSetting?.parameter}
                      placeholder="请选择直播间"
                      onChange={e => changeValue( e, 'inviterSetting.parameter' )}
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
                      inviterSetting?.eventId === 'WATCH_LIVE' && (
                      <InputNumber
                        min={0}
                        value={inviterSetting?.parameter2}
                        placeholder="X"
                        onChange={e => changeValue( e, 'inviterSetting.parameter2' )}
                        style={{ width:'70%' }}
                      />
                      )
                    }
                  </>
                )}
              </FormItem>
              <RenderFormItem renderList={renderList} />
              {renderSetJump()}
            </>
          )}
          </FormItem>

          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>邀请人数上限</span>
              <Switch
                checked={inviterLimit || inviterSetting?.limit}
                onChange={e => {
                  changeValue( e, 'inviterLimit' );
                  if ( !e ) {
                    changeValue( '', 'inviterSetting.limit' );
                    changeValue( '', 'inviterSetting.attendType' );
                  }
                }}
              />
            </div>
            {( inviterLimit || inviterSetting?.limit ) && (
              <FormItem required label="任务上限">
                <InputGroup compact>
                  <div style={{ display: 'flex' }}>
                    <InputNumber
                      value={limit || ''}
                      placeholder="请输入"
                      min={0}
                      formatter={limitDecimals}
                      parser={limitDecimals}
                      onChange={e => changeValue( e, 'inviterSetting.limit' )}
                      style={{ width: '75%', marginRight: 15 }}
                    />
                    <Select
                      style={{ width: 150 }}
                      value={attendType}
                      onChange={val => changeValue( val, 'inviterSetting.attendType' )}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                      <Option value="DURING">次</Option>
                      <Option value="DAILY">次(每日)</Option>
                      <Option value="MONTHLY">次(每月)</Option>
                    </Select>
                  </div>
                </InputGroup>
              </FormItem>
            )}
          </FormItem>
          <FormItem>
            <span>
              每邀请{' '}
              <InputNumber
                value={eachCount}
                placeholder='不填，默认1人'
                onChange={val => changeValue( val, 'inviterSetting.eachCount' )}
              />{' '}
              人，可获得一次奖励
            </span>
          </FormItem>
          <FormItem required label="任务奖励类型">
            <Radio.Group
              onChange={e => changeValue( e, 'inviterSetting.rewardType' )}
              value={rewardType}
            >
              <Radio key="LEFT_COUNT" value="LEFT_COUNT">
                参与次数
              </Radio>
              <Radio key="INTEGRAL" value="INTEGRAL">
                积分
              </Radio>
              <Radio key="PRIZE" value="PRIZE">
                奖品
              </Radio>
            </Radio.Group>
          </FormItem>
          {rewardType === 'PRIZE' ? (
            <PrizeOption
              {...props}
              tableTitle="邀请奖品配置"
              dataKey="inviterSetting.prizes"
              descriptionText="*第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。每一列抽奖概率总和需为100%。"
            />
          ) : (
            <FormItem required label="任务奖励" style={{ display: 'flex' }}>
              <InputNumber
                value={rewardValue || 0}
                placeholder="请输入"
                min={0}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={e => changeValue( e, 'inviterSetting.rewardValue' )}
                style={{ width: '85%' }}
              />
              <span style={{ paddingLeft: '10px' }}>
                {rewardType === 'LEFT_COUNT' ? '次' : '分'}
              </span>
            </FormItem>
          )}
        </Panel>
      </Collapse>
    </React.Fragment>
  );
}

export default connect( ( { bees } ) => {
  return {
    eligibilityType: bees.eligibilityType,
    liveData: bees.liveData,
  };
} )( InviterSetting );

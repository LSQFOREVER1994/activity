/* eslint-disable no-shadow */
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

const renderList = type => {
  return [
    {
      renderType: 'Input',
      label: '不满足资格标题',
      field: `${type}.ineligibleTitle`,
      required: false,
      wordsMax: 10,
      propsData: {
        placeholder: '请输入不满足资格标题',
      },
    },
    {
      renderType: 'TextArea',
      label: '不满足资格内容',
      field: `${type}.ineligibleTip`,
      required: false,
      propsData: {
        maxLength: 40,
        placeholder: '请输入不满足资格内容',
      },
    },
    {
      renderType: 'Input',
      label: '不满足资格按钮文案',
      field: `${type}.ineligibleBtnText`,
      required: false,
      wordsMax: 10,
      propsData: {
        placeholder: '请输入不满足资格按钮文案',
      },
    },
  ];
};

const RenderSetting = ( {
  componentsData,
  type,
  changeValue,
  getEligibilityList,
  eligibilityType,
  functionConfig,
  liveData,
  getLiveList
} ) => {
  if( !componentsData || !type || !componentsData[type] ){
    return null
  }
  const { eventType, eventId, parameter, enable } = componentsData[type];
  const [eligibilityList, setEligibilityList] = useState( [] );

  useEffect( () => {
    if ( eventType ) {
      getEligibilityList( eventType, setEligibilityList );
    }
  }, [eventType] );

  const changeFeature = ( e ) => {
    const events = componentsData[type].clickEvent;
    const data = functionConfig.find( ( item )=>item.parameter === e );
    const newImgObj = Object.assign( events, {
      ...data,
      key: data.parameter
    } );
    changeValue( newImgObj, `${type}.clickEvent` )
  }

  const renderSetJump = type => {
    const linkRestrictions = [];
    const events = componentsData[type].clickEvent;
    const setting = componentsData[type];
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
              changeValue( e, `${type}.clickEvent.clickType` );
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
              value={events?.key || null}
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
                    `${type}.clickEvent.link`
                  );
                }}
              />
            </FormItem> */}
            <FormItem label="跳转链接">
              <Input
                value={events?.link}
                onChange={e => {
                  changeValue( e, `${type}.clickEvent.link` );
                }}
              />
            </FormItem>
            {/* <Form.Item label="链接限制">
              <Checkbox.Group
                options={diyOptions}
                value={linkRestrictions}
                onChange={e => {
                  diyOptions.forEach( item => {
                    changeValue( e.includes( item.value ), `${type}.clickEvent.${item.value}` );
                  } );
                }}
              />
            </Form.Item> */}
          </>
        )}
      </>
    );
  };

  useEffect( () => {
    if ( componentsData[type]?.eventId === 'IS_SUBSCRIBE_LIVE' || componentsData[type]?.eventId === 'WATCH_LIVE' ) {
      getLiveList( );
    }
  }, [componentsData[type]?.eventId] );

  const changeTaskValue = ( e, valueName ) => {
    changeValue( undefined, `${type}.parameter` )
    changeValue( undefined, `${type}.parameter2` )
    changeValue( e, valueName )
  }

  const changeEventType = ( e, t ) => {
    changeValue( '', `${type}.eventId` )
    changeValue( e, t )
  }


  return (
    <FormItem>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {type === 'inviteeBindSetting' ? '被邀请人绑定限制' : '被邀请人达标限制'}
          <Tooltip
            title={
              <span>
                {type === 'inviteeBindSetting' ? '当用户不符合绑定资格时，弹窗提示资格不满足' : '当用户不符合达标资格时，邀请人不予发放奖励'}

              </span>
            }
          >
            <Icon type="question-circle" theme="filled" style={{ color: '#000000', marginLeft:5  }} />
          </Tooltip>
        </span>
        <Switch checked={enable} onChange={e => changeValue( e, `${type}.enable` )} />
      </div>
      {enable && (
        <>
          <FormItem label={type === 'inviteeBindSetting' ? '被邀请人绑定资格' : '被邀请人达标资格'}>
            <Select
              style={{ width: '100%' }}
              showSearch
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              value={eventType || undefined}
              placeholder="请选择资格类型"
              onChange={e => changeEventType( e, `${type}.eventType` )}
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
              onChange={e => changeTaskValue( e, `${type}.eventId` )}
              // onChange={e => changeValue( e, `${type}.eventId` )}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              allowClear
            >
              {eligibilityList.map( item => (
                <Option key={item.taskEventId}>{item.name}</Option>
              ) )}
            </Select>
            {( componentsData[type]?.eventId === 'IS_LAST_DAY_MONEY' || componentsData[type]?.eventId === 'IS_TOTAL_MONEY' )&&(
            <InputNumber
              min={0}
              value={componentsData[type]?.parameter}
              placeholder="X"
              onChange={e => changeValue( e, `${type}.parameter` )}
              style={{ width:'70%' }}
            />
                )}
            {( componentsData[type]?.eventId === 'IS_SUBSCRIBE_LIVE' || componentsData[type]?.eventId === 'WATCH_LIVE' )&&(
            <>
              <Select
                    // mode="multiple"
                value={componentsData[type]?.parameter}
                placeholder="请选择直播间"
                onChange={e => changeValue( e, `${type}.parameter` )}
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
                componentsData[type]?.eventId === 'WATCH_LIVE' && (
                <InputNumber
                  min={0}
                  value={componentsData[type]?.parameter2}
                  placeholder="X"
                  onChange={e => changeValue( e, `${type}.parameter2` )}
                  style={{ width:'70%' }}
                />
                )
              }
            </>
                )}
          </FormItem>
          <RenderFormItem renderList={renderList( type )} />
          {renderSetJump( type )}
        </>
      )}
    </FormItem>
  );
};

function InviteeSetting( props ) {
  const {
    componentsData,
    componentsData: { inviteeSetting },
    changeValue,
    eligibilityType,
    dispatch,
    functionConfig,
    liveData
  } = props;
  const { rewardType, rewardValue, rewardEnable } = inviteeSetting;

  // 获取资格列表
  const getEligibilityList = ( id, callFunc ) => {
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query:{
          id
        },
        successFun:( data )=>{
          callFunc( data )
        }
      },
    } );
  };

  
  // 获取直播列表
  const getLiveList = () => {
    dispatch( {
      type: 'bees/getLiveList',
      payload: {
      },
    } );
  };
  

  return (
    <React.Fragment>
      <Collapse defaultActiveKey="1">
        <Panel
          header={
            <div>
              <span>被邀请人设置</span>
            </div>
          }
          key="1"
        >
          <RenderSetting
            type='inviteeBindSetting'
            componentsData={componentsData}
            eligibilityType={eligibilityType}
            changeValue={changeValue}
            getEligibilityList={getEligibilityList}
            functionConfig={functionConfig}
            liveData={liveData}
            getLiveList={getLiveList}
          />
          <RenderSetting
            type='inviteeSetting'
            componentsData={componentsData}
            eligibilityType={eligibilityType}
            changeValue={changeValue}
            getEligibilityList={getEligibilityList}
            liveData={liveData}
            getLiveList={getLiveList}
            functionConfig={functionConfig}
          />
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>被邀请奖励</span>
              <Switch
                checked={rewardEnable}
                onChange={e => {
                  changeValue( e, 'inviteeSetting.rewardEnable' );
                }}
              />
            </div>
          </FormItem>
          {rewardEnable && (
            <>
              <FormItem required label="任务奖励类型">
                <Radio.Group
                  onChange={e => changeValue( e, 'inviteeSetting.rewardType' )}
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
                  dataKey="inviteeSetting.prizes"
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
                    onChange={e => changeValue( e, 'inviteeSetting.rewardValue' )}
                    style={{ width: '85%' }}
                  />
                  <span style={{ paddingLeft: '10px' }}>
                    {rewardType === 'LEFT_COUNT' ? '次' : '分'}
                  </span>
                </FormItem>
              )}
            </>
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
} )( InviteeSetting );

/* eslint-disable eqeqeq */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useContext, useState } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, Select, Icon, Tooltip, InputNumber, Checkbox } from 'antd';
import PrizeTable from '@/components/PrizeOption';
import RenderFormItem from '../RenderFormItem';
import TaskAdvancedSetting from './TaskAdvancedSetting';

import { DomDataContext, CurrentPages } from '../../provider';

const FormItem = Form.Item;
const { Option } = Select;

function Task( props ) {
  const { componentsData, changeValue, eligibilityType, eligibilityList, dispatch, liveData } = props;
  const [componentData] = useContext( DomDataContext );
  const currentPageIndex = useContext( CurrentPages )[2]
  const { task: { taskType, rewardType, attendType, taskEventType, taskEventId, subTasks, parameter, parameter2  }, id, } = componentsData;
  const [functionConfig, setFunctionConfig] = useState( [] );
  
  useEffect( () => {
    dispatch( {
      type: 'bees/typeFunctionConfig',
      payload: {
        body: {
          jumpType: 'TASK',
          page: {
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

  const getAllTaskComponents = () => {
    const taskComponents = [];
    componentData?.pages.length &&
      componentData.pages.forEach( item => {
        item?.componentData?.length &&
          item.componentData.forEach( i => {
            if ( i.type === 'TASK' ) {
              taskComponents.push( i );
            }
          } );
      } );
    return taskComponents
      .map( item => ( {
        elementId: item.id,
        name: item.label,
      } ) )
      .filter( i => i.elementId !== id );
  };
  const OPTIONS = getAllTaskComponents();
  // 修改task对象数据
  const changeTaskValue = ( e, type, typeTwo ) => {
    let val;
    if ( type === 'expireDate' ) {
      val = e && e.format( 'YYYY-MM-DD' );
    } else {
      val = e && e.target ? e.target.value : e;
    }

    if ( typeTwo === 'key' ) {
      val = JSON.stringify( functionConfig.find( item => item.parameter == val ) );
    }
    const taskObj = componentsData.task ? componentsData.task : {};
    let newTask;
    if ( typeTwo ) {
      newTask = Object.assign( taskObj, { [type]: { ...taskObj[type], [typeTwo]: val } } );
    } else {
      newTask = Object.assign( taskObj, { [type]: val } );
    }
    changeValue( newTask, 'task' );
  };

  // 获取资格类型
  const getEligibilityType = name => {
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : '',
        },
        successFun: () => {},
      },
    } );
  };

  // 获取资格列表
  const getEligibilityList = parmasId => {
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query: {
          id:parmasId,
        },
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


  // 选择资格相关
  const changeEligibility = ( e, type ) => {
    
    if ( type === 'taskEventType' ) {
      if( e ) getEligibilityList( e );
      getLiveList( e );
      changeValue( e, 'task.taskEventType' );
      changeValue( '', 'task.taskEventId' );
    } else {
      changeValue( undefined, 'task.parameter' );
      changeValue( undefined, 'task.parameter2' );
      changeValue( e, 'task.taskEventId' );
    }
  };

  const handleChange = selectedItems => {
    const Data = [];
    selectedItems.forEach( item =>
      OPTIONS.forEach( i => {
        if ( i.elementId === item ) {
          Data.push( i );
        }
      } )
    );
    changeValue( Data, 'task.subTasks' );
  };

  const changeCheckBox = ( e, type ) => {
    const val = e.target.checked
    changeTaskValue( val, 'clickEvent', type )
  }

  const renderSelectQualification = () => {
    return (
      <div>
        <FormItem label="关联资格">
          <Select
            style={{ width: '100%' }}
            showSearch
            filterOption={( input, option ) =>
              option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
            }
            value={taskEventType}
            placeholder="请选择资格类型"
            onChange={e => changeEligibility( e, 'taskEventType' )}
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
            value={taskEventId}
            placeholder="请选择资格"
            onChange={e => changeEligibility( e, 'taskEventId' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            allowClear
          >
            {eligibilityList.map( item => (
              <Option key={item.taskEventId}>{item.name}</Option>
            ) )}
          </Select>
          {( taskEventId === 'IS_LAST_DAY_MONEY' || taskEventId === 'IS_TOTAL_MONEY' )&&(
            <InputNumber
              min={0}
              value={parameter}
              placeholder="X"
              onChange={e => changeTaskValue( e, 'parameter' )}
              style={{ width:'70%' }}
            />
          )}
          {( taskEventId === 'IS_SUBSCRIBE_LIVE' || taskEventId === 'WATCH_LIVE' )&&(
          <>
            <Select
              // mode="multiple"
              value={parameter}
              placeholder="请选择直播间"
              onChange={e => changeTaskValue( e, 'parameter' )}
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
              taskEventId === 'WATCH_LIVE' && (
              <InputNumber
                min={0}
                value={parameter2}
                placeholder="X"
                onChange={e => changeTaskValue( e, 'parameter2' )}
                style={{ width:'70%' }}
              />
              )
            }
          </>
          )}
          {taskEventId === 'COMPLETE_TASK' && (
            <Select
              mode="multiple"
              value={subTasks.map( i => i.elementId )}
              placeholder="请选择组件，不选择则不区分组件"
              onChange={handleChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {OPTIONS.map( item => (
                <Option
                  key={`${item.name}(${item.elementId})`}
                  value={item.elementId}
                >{`${item.name}(${item.elementId})`}
                </Option>
              ) )}
            </Select>
          )}
        </FormItem>
      </div>
    );
  };

  // 资格任务
  const renderQualificaFrom = () => {
    const { task } = componentsData;
    const getJSONData = () => {
      try {
        return task.clickEvent ? JSON.parse( task.clickEvent.key || null )?.parameter : '';
      } catch( error ) {
      return functionConfig.find( item => item.parameter == task.clickEvent.key )?.parameter || "";
      }
    }
    return (
      <div>
        {renderSelectQualification()}
        <FormItem required label="设置跳转">
          <Radio.Group
            onChange={e => changeTaskValue( e, 'clickEvent', 'clickType' )}
            value={task.clickEvent ? task.clickEvent.clickType : ''}
          >
            <Radio value="NONE">无</Radio>
            <Radio value="FEATURE">功能</Radio>
            <Radio value="PAGE_TO"> 页面 </Radio>
            <Radio value="CUSTOM_LINK">自定义链接</Radio>
          </Radio.Group>
        </FormItem>
        {task.clickEvent && task.clickEvent.clickType === 'FEATURE' && (
          <FormItem label="选择功能">
            <Select
              style={{ width: '100%' }}
              onChange={e => changeTaskValue( e, 'clickEvent', 'key' )}
              value={getJSONData()}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {/* {seniorityTypes.map( info => (
                <Option value={info.key}>{info.value}</Option>
              ) )} */}
              {functionConfig.map( item => (
                <Option key={item.id} value={item.parameter}>
                  {item.name}
                </Option>
              ) )}
            </Select>
          </FormItem>
        )}

        {task.clickEvent && task.clickEvent.clickType === 'CUSTOM_LINK' && (
          <>
            <FormItem label="端内链接">
              <Input
                value={task.clickEvent ? task.clickEvent.link : ''}
                placeholder="请输入跳转链接"
                onChange={e => changeTaskValue( e, 'clickEvent', 'link' )}
              />
            </FormItem>
            <FormItem label="端外链接">
              <Input
                value={task.clickEvent ? task.clickEvent.outLink : ''}
                placeholder="请输入跳转链接"
                onChange={e => changeTaskValue( e, 'clickEvent', 'outLink' )}
              />
            </FormItem>
            {/* <Form.Item label="链接限制">
              <Checkbox onChange={e => changeCheckBox( e, 'noSupportWx' )} checked={task.clickEvent ? task.clickEvent.noSupportWx : false}>不支持微信打开</Checkbox>
              <Checkbox onChange={e => changeCheckBox( e, 'openByApp' )} checked={task.clickEvent ? task.clickEvent.openByApp : false}>需原生APP打开</Checkbox>
            </Form.Item> */}
          </>
        )}

        {task.clickEvent && task.clickEvent.clickType === 'PAGE_TO' && (
        <Form.Item label="跳转" layout="vertical">
          <Select
            allowClear
            value={task.clickEvent ? task.clickEvent.pageId : ''}
            style={{ width: '100%' }}
            onChange={e => changeTaskValue( e, 'clickEvent', 'pageId' )}
            getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
            showSearch
            optionFilterProp="children"
            filterOption={( input, option ) =>
             JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
           }
          >
            {componentData.pages.filter( ( item, index )=>( index !== currentPageIndex ) ).map(
             item =>
               item.id !== id && (
                 <Option style={{ width: '100%' }} value={item.id} key={item.id}>
                   {item.label || `页面`}
                   ({item.id})
                 </Option>
               )
           )}
          </Select>
        </Form.Item>
        )}

        {/* {( task?.clickEvent?.clickType === 'FEATURE' ||
          task?.clickEvent?.clickType === 'CUSTOM_LINK' ) && (
          <FormItem label="任务完成消息提示">
            <TextArea
              value={task && task.tip ? task.tip : ''}
              placeholder="请输入任务完成消息提示"
              onChange={e => changeTaskValue( e, 'tip' )}
              maxLength={200}
            />
          </FormItem>
        )} */}
      </div>
    );
  };

  // 浏览任务
  const renderBrowseFrom = () => {
    const { task = {} } = componentsData;
    const getJSONData = () => {
      try {
        return task.clickEvent ? JSON.parse( task.clickEvent.key || null )?.parameter : '';
      } catch( error ) {
      return functionConfig.find( item => item.parameter == task.clickEvent.key )?.parameter || "";
      }
    }
    return (
      <div>
        <FormItem required label="浏览时长" style={{ display:'flex' }}>
          <InputNumber
            min={0}
            value={task.browseTime}
            placeholder="请输入浏览时间"
            style={{ width:'70%' }}
            onChange={e => changeTaskValue( e, 'browseTime' )}
          />
          <span style={{ paddingLeft:'10px' }}>秒</span>
        </FormItem>
        <FormItem required label="设置跳转">
          <Radio.Group
            onChange={e => changeTaskValue( e, 'clickEvent', 'clickType' )}
            value={task.clickEvent ? task.clickEvent.clickType : ''}
          >
            <Radio value="NONE">无</Radio>
            {/* <Radio value="FEATURE">功能</Radio> */}
            {/* <Radio value="PAGE_TO"> 页面 </Radio> */}
            <Radio value="CUSTOM_LINK">自定义链接</Radio>
          </Radio.Group>
        </FormItem>
        {task.clickEvent && task.clickEvent.clickType === 'FEATURE' && (
          <FormItem label="选择功能">
            <Select
              style={{ width: '100%' }}
              onChange={e => changeTaskValue( e, 'clickEvent', 'key' )}
              value={getJSONData()}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {/* {seniorityTypes.map( info => (
                <Option value={info.key}>{info.value}</Option>
              ) )} */}
              {functionConfig.map( item => (
                <Option key={item.id} value={item.parameter}>
                  {item.name}
                </Option>
              ) )}
            </Select>
          </FormItem>
        )}

        {task.clickEvent && task.clickEvent.clickType === 'CUSTOM_LINK' && (
          <>
            <FormItem label="自定义链接">
              <Input
                value={task.clickEvent ? task.clickEvent.link : ''}
                placeholder="请输入自定义链接"
                onChange={e => changeTaskValue( e, 'clickEvent', 'link' )}
              />
            </FormItem>
          </>
        )}

        {task.clickEvent && task.clickEvent.clickType === 'PAGE_TO' && (
        <Form.Item label="跳转" layout="vertical">
          <Select
            allowClear
            value={task.clickEvent ? task.clickEvent.pageId : ''}
            style={{ width: '100%' }}
            onChange={e => changeTaskValue( e, 'clickEvent', 'pageId' )}
            getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
            showSearch
            optionFilterProp="children"
            filterOption={( input, option ) =>
             JSON.stringify( option.props.children ).toLowerCase().indexOf( input.toLowerCase() ) >= 0
           }
          >
            {componentData.pages.filter( ( item, index )=>( index !== currentPageIndex ) ).map(
             item =>
               item.id !== id && (
                 <Option style={{ width: '100%' }} value={item.id} key={item.id}>
                   {item.label || `页面`}
                   ({item.id})
                 </Option>
               )
           )}
          </Select>
        </Form.Item>
        )}
        {/* <FormItem label="任务完成消息提示">
          <TextArea
            value={task && task.tip ? task.tip : ''}
            placeholder="请输入任务完成消息提示"
            onChange={e => changeTaskValue( e, 'tip' )}
            maxLength={200}
          />
        </FormItem> */}
      </div>
    );
  };


  const renderList = [
      {
        renderType: 'Input',
        label: '任务标题',
        field: 'task.name',
        required: false,
        formLayout: {},
        wordsMax:20,
        propsData: {
          placeholder: '请输入任务标题',
        },
      },
      {
        renderType: 'Radio',
        label: '任务类型展示',
        field: 'task.descShowType',
        required: true,
        formLayout: {},
        radioList: [
          {
            label: '问号',
            value: 'QUESTION_MARK',
          },
          {
            label: '页面展示',
            value: 'PAGE',
          },
          {
            label: '无',
            value: 'NONE',
          },
        ],
      },
      {
        renderType: 'TextArea',
        label: '任务描述',
        field: 'task.description',
        required: true,
        formLayout: {},
        propsData: {
          placeholder: '请输入任务描述',
        },
        conditionalRendering: data => {
          const showArr = ['QUESTION_MARK', 'PAGE']
          return showArr.includes( data.task.descShowType );
        },
      },
      {
        renderType: 'Radio',
        label: '任务奖励类型',
        field: 'task.rewardType',
        required: true,
        formLayout: {},
        radioList: [
          {
            label: '参与次数',
            value: 'LEFT_COUNT',
          },
          {
            label: '积分',
            value: 'INTEGRAL',
          },
          {
            label: '奖品',
            value: 'PRIZE',
          },
        ],
        annotation: rewardType === 'PRIZE' && (
          <div style={{ marginTop: '30px' }}>
            <PrizeTable {...props} />
          </div>
        ),
      },
      {
        renderType: 'InputNumber',
        label: '任务奖励',
        field: 'task.rewardValue',
        required: true,
        flex: true,
        formLayout: {},
        conditionalRendering: data => data.task.rewardType !== 'PRIZE',
        propsData: {
          placeholder: '请输入',
          min: 0,
        },
        unit: (
          <span style={{ paddingLeft: '10px' }}>{rewardType === 'LEFT_COUNT' ? '次' : '分'}</span>
        ),
      },
      {
        renderType: 'InputNumber',
        label: '任务上限',
        field: 'task.attendLimit',
        required: true,
        flex: true,
        formLayout: {},
        propsData: {
          placeholder: '请输入',
          min: 1,
        },
        unit: (
          <Select
            style={{ width: 150 }}
            value={attendType || ''}
            onChange={val => changeTaskValue( val, 'attendType' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="DURING">次</Option>
            <Option value="DAILY">次(每日)</Option>
            <Option value="WEEKLY">次(每周)</Option>
            <Option value="MONTHLY">次(每月)</Option>
            <Option value="QUARTERLY">次(每季)</Option>
          </Select>
        ),
      },
      {
        renderType: 'Switch',
        flex: true,
        label: (
          <span>
            <span>任务上限展示 </span>
            <Tooltip title={<span>默认展示任务上限（0/1）,关闭后隐藏（0/1）</span>}>
              <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
            </Tooltip>
          </span>
        ),
        field: 'taskLimitShow',
        required: false,
      },
      {
        renderType: 'DatePicker',
        flex: true,
        label: (
          <span>
            <span>次数失效时间 </span>
            <Tooltip
              title={
                <span>
                  任务奖励为次数时,才可配置此项。若配置了任务失效时间，当前任务获得的次数将在此时间后失效
                </span>
              }
            >
              <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
            </Tooltip>
          </span>
        ),
        field: 'task.expireDate',
        required: false,
        conditionalRendering: data => data.task.rewardType === 'LEFT_COUNT',
        propsData: {
          format: 'YYYY-MM-DD',
          style: {
            width: '100%',
          },
        },
      },
      {
        renderType: 'UploadModal',
        label: '去完成按钮',
        field: 'goButton',
        required: true,
        tips: {
          text: ['格式：jpg/jpeg/png ', '图片尺寸建议150px * 64px ', '图片大小建议不大于1M'],
        },
      },
      {
        renderType: 'UploadModal',
        label: '已完成按钮',
        field: 'finishButton',
        required: true,
        tips: {
          text: ['格式：jpg/jpeg/png ', '图片尺寸建议150px * 64px ', '图片大小建议不大于1M'],
        },
      },
      {
        renderType: 'UploadModal',
        label: '任务图标',
        field: 'image',
        required: false,
        tips: {
          text: ['格式：jpg/jpeg/png ', '图片尺寸建议150px * 64px ', '图片大小建议不大于1M'],
        },
      },
      {
        renderType: 'Radio',
        label: '任务类型',
        field: 'task.taskType',
        required: true,
        radioList: [
          {
            label: '资格任务',
            value: 'EVENT',
          },
          {
            label: '浏览任务',
            value: 'CLICK',
          },
        ],
        annotation: taskType === 'EVENT' ? renderQualificaFrom() : renderBrowseFrom(),
      },
  ];

  useEffect( () => {
    getEligibilityType();
    if ( componentsData.task.taskEventType ) {
      getEligibilityList( componentsData.task.taskEventType );
    }
  }, [componentsData.id] );

  return (
    <div>
      <RenderFormItem renderList={renderList} key={id} />
      <TaskAdvancedSetting componentsData={componentsData} changeValue={changeValue} />
    </div>
  );
}

export const HIDE_TEXT_COLOR = true;
export default connect( ( { bees } ) => {
  return {
    eligibilityList: bees.eligibilityList,
    eligibilityType: bees.eligibilityType,
    liveData: bees.liveData,
  };
} )( Task );

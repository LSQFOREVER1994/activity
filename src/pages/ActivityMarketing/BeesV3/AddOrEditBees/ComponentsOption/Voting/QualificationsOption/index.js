/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Collapse, Form, Select, Radio, Input, InputNumber } from 'antd';
import { connect } from 'dva';
import RenderFormItem from '../../RenderFormItem';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Option } = Select;

const QualificationsOption = props => {
  const {
    eligibilityType, 
    eligibilityList,
    dispatch,
    changeValue,
    componentsData: { id, task={}, task:{ taskEventId, parameter } },
    liveData
  } = props;
  const [functionConfig, setFunctionConfig] = useState( [] );

  const renderList1 = [
    {
      renderType: 'Input',
      label: '不满足资格标题',
      field: 'task.ineligibleTitle',
      required: false,
      wordsMax: 10,
      propsData: {
        placeholder: '请输入不满足资格标题',
      },
    },
    {
      renderType: 'TextArea',
      label: '不满足资格内容',
      field: 'task.ineligibleTip',
      required: false,
      propsData: {
        maxLength: 40,
        placeholder: '请输入不满足资格内容',
      },
    },
    {
      renderType: 'Input',
      label: '不满足资格按钮文案',
      field: 'task.ineligibleBtnText',
      required: false,
      wordsMax: 10,
      propsData: {
        placeholder: '请输入不满足资格按钮文案',
      },
    },
  ];

    // 获取资格类型
  const getEligibilityType = name => {
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : '',
          removeActivity:true
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
  
  useEffect( () => {
    if ( task?.taskEventId === 'IS_SUBSCRIBE_LIVE' || task?.taskEventId === 'WATCH_LIVE' ) {
      getLiveList( );
    }
  }, [task?.taskEventId] );

  const changeQuaValue = ( e, type ) => {
    changeValue( undefined, 'task.parameter' )
    changeValue( undefined, 'task.parameter2' )
    changeValue( e, type )
  }

  const getFunctionConfig = () => {
    dispatch( {
      type: 'bees/typeFunctionConfig',
      payload: {
        body: {
          jumpType: 'FUNCTION',
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
  }

  const getJSONData = () => {
    try {
      return task.clickEvent ? JSON.parse( task.clickEvent.key || null )?.parameter : '';
    } catch( error ) {
    return functionConfig.find( item => item.parameter == task.clickEvent.key )?.parameter || "";
    }
  }

  // 修改task对象数据
  const changeTaskValue = ( e, type, typeTwo ) => {
    let val = e && e.target ? e.target.value : e;
    if ( typeTwo === 'key' ) {
      val = JSON.stringify( functionConfig.find( item => item.parameter == val ) );
    }
    const taskObj = task || {};
    let newTask;
    if ( typeTwo ) {
      newTask = Object.assign( taskObj, { [type]: { ...taskObj[type], [typeTwo]: val } } );
    } else {
      newTask = Object.assign( taskObj, { [type]: val } );
    }
    changeValue( newTask, 'task' );
  };


  useEffect( ()=>{
    getFunctionConfig()
  }, [] )

  useEffect( () => {
    getEligibilityType();
  }, [] );

  useEffect( ()=>{
    if ( task.taskEventType ) {
      getEligibilityList( task.taskEventType );
    }
  }, [task.taskEventType] )

  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: 20 }}>
      <Panel header="投票资格配置" key="1">
        <FormItem label="投票资格">
          <Select
            style={{ width: '100%' }}
            showSearch
            filterOption={( input, option ) =>
                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                }
            value={task?.taskEventType}
            placeholder="请选择资格类型"
            onChange={e => {
              changeValue( e, 'task.taskEventType' )
              changeQuaValue( '', 'task.taskEventId' )
            }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            allowClear
          >
            {eligibilityType?.map( item => <Option key={item.id}>{item.name}</Option> )}
          </Select>
          <Select
            style={{ width: '100%' }}
            showSearch
            filterOption={( input, option ) =>
                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                }
            value={task?.taskEventId}
            placeholder="请选择资格"
            onChange={e => changeQuaValue( e, 'task.taskEventId' )}
            // onChange={e => changeValue( e, 'task.taskEventId' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            allowClear
          >
            {eligibilityList.map( item => (
              <Option key={item.taskEventId}>{item.name}</Option>
                ) )}
          </Select>
          {( task?.taskEventId === 'IS_LAST_DAY_MONEY' || task?.taskEventId === 'IS_TOTAL_MONEY' )&&(
            <InputNumber
              min={0}
              value={task?.parameter}
              placeholder="X"
              onChange={e => changeValue( e, 'task.parameter' )}
              style={{ width:'70%' }}
            />
          )}
          {( task?.taskEventId === 'IS_SUBSCRIBE_LIVE' || task?.taskEventId === 'WATCH_LIVE' )&&(
          <>
            <Select
              // mode="multiple"
              value={task?.parameter}
              placeholder="请选择直播间"
              onChange={e => changeValue( e, 'task.parameter' )}
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
              task?.taskEventId === 'WATCH_LIVE' && (
              <InputNumber
                min={0}
                value={task?.parameter2}
                placeholder="X"
                onChange={e => changeValue( e, 'task.parameter2' )}
                style={{ width:'70%' }}
              />
              )
            }
          </>
          )}
        </FormItem>
        <RenderFormItem renderList={renderList1} />
        <FormItem required label="设置跳转">
          <Radio.Group
            onChange={e => changeTaskValue( e, 'clickEvent', 'clickType' )}
            value={task?.clickEvent ? task.clickEvent.clickType : ''}
          >
            <Radio value="NONE">无</Radio>
            <Radio value="FEATURE">功能</Radio>
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
            <FormItem label="跳转链接">
              <Input
                value={task.clickEvent ? task.clickEvent.link : ''}
                placeholder="请输入跳转链接"
                onChange={e => changeTaskValue( e, 'clickEvent', 'link' )}
              />
            </FormItem>
            {/* <FormItem label="端外链接">
              <Input
                value={task.clickEvent ? task.clickEvent.outLink : ''}
                placeholder="请输入跳转链接"
                onChange={e => changeTaskValue( e, 'clickEvent', 'outLink' )}
              />
            </FormItem> */}
          </>
        )}
      </Panel>
    </Collapse>
  );
};

export default connect( ( { bees } ) => {
  return {
    eligibilityType: bees.eligibilityType,
    eligibilityList: bees.eligibilityList,
    liveData: bees.liveData,
  };
} )( QualificationsOption );

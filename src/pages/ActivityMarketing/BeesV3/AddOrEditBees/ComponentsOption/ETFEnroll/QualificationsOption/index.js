/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Collapse, Form, Select, InputNumber } from 'antd';
import { connect } from 'dva';
import RenderFormItem from '../../RenderFormItem';

const { Panel } = Collapse;
const FormItem = Form.Item;
const { Option } = Select;

const QualificationsOption = props => {
  const {
    eligibilityType,
    dispatch,
    changeValue,
    componentsData: { task },
    liveData,
  } = props;
  const [eligibilityList, setEligibilityList] = useState( [] );

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
      wordsMax: 20,
      propsData: {
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
  
  useEffect( () => {
    if ( task?.taskEventType ) {
      getEligibilityList( task?.taskEventType );
    }
  }, [task?.taskEventType] );
  

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
  
  // 获取资格列表
  const getEligibilityList = id => {
    dispatch( {
      type: 'bees/getEligibilityList',
      payload: {
        query: {
          id,
        },
        successFun: data => {
          setEligibilityList( data );
        },
      },
    } );
  };

  const changeTaskValue = ( e, type ) => {
    changeValue( undefined, 'task.parameter' )
    changeValue( undefined, 'task.parameter2' )
    changeValue( e, type )
  }

  const changeEventType = ( e, type ) => {
    changeValue( '', 'task.taskEventId' )
    changeValue( e, type )
  }

  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: 20 }}>
      <Panel header="报名资格配置" key="1">
        <FormItem label="报名资格">
          <Select
            style={{ width: '100%' }}
            showSearch
            filterOption={( input, option ) =>
                  option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                }
            value={task?.taskEventType}
            placeholder="请选择资格类型"
            onChange={e => changeEventType( e, 'task.taskEventType' )}
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
            onChange={e => changeTaskValue( e, 'task.taskEventId' )}
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
      </Panel>
    </Collapse>
  );
};

export default connect( ( { bees } ) => {
  return {
    eligibilityType: bees.eligibilityType,
    liveData: bees.liveData,
  };
} )( QualificationsOption );

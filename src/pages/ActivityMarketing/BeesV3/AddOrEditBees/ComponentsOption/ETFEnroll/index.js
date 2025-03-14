/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Select, Radio, Input } from 'antd';
import RenderFormItem from '../RenderFormItem';
import TextOption from './TextOption';
import PrizeOption from './PrizeOption';
import QualificationsOption from './QualificationsOption';

const FormItem = Form.Item;
const { Option } = Select;


const renderList = [
  {
    renderType: 'DatePicker',
    field: 'startTime',
    label: '报名开始时间',
    required: false,
    flex: true,
    propsData: {
      showTime: true,
      placeholder: '请选择开始时间',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    renderType: 'DatePicker',
    field: 'endTime',
    label: '报名结束时间',
    flex: true,
    required: false,
    propsData: {
      showTime: true,
      placeholder: '请选择结束时间',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    renderType: 'UploadModal',
    field: 'enrollButton',
    label: '报名按钮图',
    required: true,
    tips: {
      text: ['图片大小建议不大于1M'],
    },
  },
  {
    renderType: 'UploadModal',
    field: 'hasEnrollButton',
    label: '已报名按钮图',
    required: true,
    tips: {
      text: ['图片大小建议不大于1M'],
    },
  },
];

function ETFEnroll( props ) {
  const { componentsData, dispatch, changeValue } = props;
  const [functionConfig, setFunctionConfig] = useState( [] );

  const { id, hasEnrollEvent={} } = componentsData;

  useEffect( () => {
    getEligibilityType();
    getFunctionConfig();
  }, [id] );

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

  
  const getJSONData = () => {
    try {
      return hasEnrollEvent ? JSON.parse( hasEnrollEvent.key || null )?.parameter : '';
    } catch( error ) {
    return functionConfig.find( item => item.parameter == hasEnrollEvent.key )?.parameter || "";
    }
  }

  // 修改task对象数据
  const changeTaskValue = ( e, type, typeTwo ) => {
    let val = e && e.target ? e.target.value : e;
    if ( typeTwo === 'key' ) {
      val = JSON.stringify( functionConfig.find( item => item.parameter == val ) );
    }
    const taskObj = hasEnrollEvent || {};
    let newTask;
    if ( typeTwo ) {
      newTask = Object.assign( taskObj, { [type]: { ...taskObj[type], [typeTwo]: val } } );
    } else {
      newTask = Object.assign( taskObj, { [type]: val } );
    }
    changeValue( newTask, 'hasEnrollEvent' );
  };

  return (
    <>
      <RenderFormItem renderList={renderList} />
      <FormItem required label="已报名按钮跳转">
        <Radio.Group
          onChange={e => changeTaskValue( e, 'clickType' )}
          value={hasEnrollEvent ? hasEnrollEvent.clickType : ''}
        >
          <Radio value="NONE">无</Radio>
          <Radio value="FEATURE">功能</Radio>
          <Radio value="CUSTOM_LINK">自定义链接</Radio>
        </Radio.Group>
      </FormItem>
      {hasEnrollEvent && hasEnrollEvent.clickType === 'FEATURE' && (
      <FormItem label="选择功能">
        <Select
          style={{ width: '100%' }}
          onChange={e => changeTaskValue( e, 'key' )}
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
      {hasEnrollEvent && hasEnrollEvent.clickType === 'CUSTOM_LINK' && (
      <>
        <FormItem label="跳转链接">
          <Input
            value={hasEnrollEvent ? hasEnrollEvent.link : ''}
            placeholder="请输入跳转链接"
            onChange={e => changeTaskValue( e, 'link' )}
          />
        </FormItem>
        {/* <FormItem label="端外链接">
              <Input
                value={hasEnrollEvent ? hasEnrollEvent.outLink : ''}
                placeholder="请输入跳转链接"
                onChange={e => changeTaskValue( e, 'outLink' )}
              />
            </FormItem> */}
      </>
        )}
      <TextOption {...props} />
      <QualificationsOption {...props} />
      <PrizeOption {...props} />
    </>
  );
}
export const SUSPENSION = true;
export const HIDE_TEXT_COLOR = true;
export default connect()( ETFEnroll );

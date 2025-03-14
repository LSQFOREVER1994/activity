import React, { useContext } from 'react';
import { Form, Radio, Input, Select, Checkbox } from 'antd';
import { featureTypes } from '../../../../BeesEnumes';
import { CurrentPages } from '../../../provider.js';

// 轮播图组件用，用在其他地方可能需要适配 TODO:
const FormItem = Form.Item;
const { Option } = Select;
export default function SetSkip( { formLayout, changeVal, clickEvent = {}, functionConfig } ) {
  const options = [
    { label: '不支持微信打开', value: 'noSupportWx' },
    { label: '需原生APP打开', value: 'openByApp' },
  ];

  const needRelevanceComponent = ['SEND_BULLET', 'SEND_COMMENT', 'SEND_OPPSSITE_COMMENT'];
  const [currentPageData] = useContext( CurrentPages );

  const checkboxVal = [];
  if ( clickEvent?.noSupportWx ) {
    checkboxVal.push( 'noSupportWx' );
  }
  if ( clickEvent?.openByApp ) {
    checkboxVal.push( 'openByApp' );
  }

  const changeInputClickEven = ( e, type ) => {
    const val = e?.target ? e.target?.value : e;
    const newImgObj = Object.assign( clickEvent, {
      [type]: val,
    } );
    changeVal( { ...newImgObj } );
  };

  const changeFuntion = ( e ) => {
    const data = functionConfig.find( ( item )=>item.parameter === e )
    const newImgObj = Object.assign( clickEvent, {
      ...data,
      key: data.parameter
    } );
    changeVal( { ...newImgObj } );
  };

  // 多选框
  const onChangeCheckbox = e => {
    let noSupportWx = false;
    let openByApp = false;
    if ( e.indexOf( 'noSupportWx' ) > -1 ) {
      noSupportWx = true;
    }
    if ( e.indexOf( 'openByApp' ) > -1 ) {
      openByApp = true;
    }
    const newImgObj = Object.assign( clickEvent, {
      noSupportWx,
      openByApp,
    } );
    changeVal( { ...newImgObj } );
  };


  const getCurrentPageBarrage = ( action ) => {
    const componentType = {
      SEND_BULLET: 'BARRAGE',
      SEND_COMMENT: 'NORMAL_COMMENT',
      SEND_OPPSSITE_COMMENT: 'OPPOSING_COMMENT'
    }
    const { componentData } = currentPageData;
    return componentData?.length && componentData.filter( ( item ) => item.type === componentType[action] ) || [];
  }
  console.log( clickEvent, 'clickEvent' );
  
  return (
    <>
      <FormItem
        label={
          <span>
            <span style={{ marginRight: '10px', color: 'red' }}>*</span>设置跳转
          </span>
        }
        {...formLayout}
      >
        <Radio.Group
          onChange={e => changeInputClickEven( e, 'clickType' )}
          value={clickEvent.clickType || ''}
        >
          <Radio value="NONE">无</Radio>
          <Radio value="FEATURE">功能</Radio>
          <Radio value="CUSTOM_LINK">自定义链接</Radio>
        </Radio.Group>
      </FormItem>
      {clickEvent.clickType === 'FEATURE' && (
        <FormItem label="选择功能" {...formLayout}>
          <Select
            style={{ width: '100%' }}
            onChange={e => changeFuntion( e, )}
            value={clickEvent.parameter || clickEvent.key || ''}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {functionConfig && functionConfig.map( item => (
              <Option style={{ width: '100%' }} value={item.parameter} key={item.key}>
                {item.name}
              </Option>
              ) )}
          </Select>
        </FormItem>
      )}

      {clickEvent.clickType === 'CUSTOM_LINK' && (
        <div>
          <FormItem style={{ display: 'flex' }} label="端内链接" {...formLayout}>
            <Input
              value={clickEvent.link || ''}
              placeholder="请输入端内链接"
              onChange={e => changeInputClickEven( e, 'link' )}
              maxLength={5000}
            />
          </FormItem>

          <FormItem style={{ display: 'flex' }} label="端外链接" {...formLayout}>
            <Input
              value={clickEvent.outLink || ''}
              placeholder="请输入端外链接"
              onChange={e => changeInputClickEven( e, 'outLink' )}
              maxLength={5000}
            />
          </FormItem>
          {/* <FormItem style={{ display: 'flex' }} label="链接限制" {...formLayout}>
            <Checkbox.Group options={options} value={checkboxVal} onChange={onChangeCheckbox} />
          </FormItem> */}
        </div>
      )}
      {
          clickEvent?.clickType === 'FEATURE' && needRelevanceComponent.includes( clickEvent?.key || "" ) && (
            <Form.Item label="关联组件" {...formLayout}>
              <Select
                allowClear
                value={clickEvent?.elementId}
                style={{ width: '100%' }}
                showSearch
                getPopupContainer={( triggerNode ) => triggerNode.parentElement || document.body}
                onChange={e => {
                  changeInputClickEven( e, 'elementId' )
                }}
              >
                {getCurrentPageBarrage( clickEvent?.key ).map( item => (
                  <Option style={{ width: '100%' }} value={item.id} key={item.id}>
                    {`${item.label}(${item.id})`}
                  </Option>
                ) )}
              </Select>
            </Form.Item>
          )
        }
    </>
  );
}

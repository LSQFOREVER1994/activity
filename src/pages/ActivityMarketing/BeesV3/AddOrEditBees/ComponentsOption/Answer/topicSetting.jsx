/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
import React, { useEffect, useState, useRef } from 'react';
import { Form, Collapse, InputNumber, Select, Alert } from 'antd';
import { connect } from 'dva';

const { Panel } = Collapse;
const { Option } = Select
const FormItem = Form.Item;

const limitDecimals = ( value ) => {
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : ''
  }
  return ''
};

function prizeSetting( props ) {
    const { searchTagListMap, componentsData, changeValue } = props
    const { tag, count } = componentsData
    const [tagObj, setTagObj] = useState( {} );
    const itemRef = useRef( null );

  // 获取标签
  const searchTagList = searchContent => {
    const { dispatch } = props;
    dispatch( {
          type: 'bees/SearchTagList',
          payload: {
            query: {
              page:{
                pageNum: 1,
                pageSize: 10,
              },
              name: searchContent,
              enable: true,
            },
          },
        } );
  };

  const changeTag = ( e ) => {
    const selectTag = searchTagListMap.length && searchTagListMap.find(  item => item.id === e )
    setTagObj( selectTag );
    const newTag = {
        id: selectTag?.id,
        name: selectTag?.name,
    }
    changeValue( newTag, 'tag' )
    const targetElement = itemRef.current;
    if( targetElement ) targetElement.style.height="auto"
  }
  const onJump = () => {
     window.open( `#/activityTemplate/questionBank` )
  }

  useEffect( () => {
    searchTagList( tag?.name || undefined );
  }, [tag?.name, tag?.id] );

useEffect( () => {
  if ( searchTagListMap.length ) {
    const selectTag = searchTagListMap.find( item => item.id === tag?.id );
    setTagObj( selectTag );
  }
}, [tag?.id, searchTagListMap] );

  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: '20px' }}>
      <Panel
        header={
          <div>
            <span>答题题目配置</span>
          </div>
        }
        key="1"
      >
        <Alert
          type="warning"
          showIcon
          message={(
            <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between', marginTop:'2px'  }}>
              <span>添加题目前需先配置题库</span>
              <span onClick={onJump} style={{ color: '#1890FF', cursor: 'pointer' }}>配置题目</span>
            </div> )}
        />
        <FormItem label='选择标签' required style={{ display:'flex', marginTop: 10 }}>
          <div ref={itemRef}>
            <Select
              style={{ width: 200 }}
              getPopupContainer={triggerNode => triggerNode.parentElement || document.body}
              showSearch
              onSearch={searchTagList}
              allowClear
              filterOption={( input, option ) =>
                option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
              }
              onFocus={()=>{
                const targetElement = itemRef.current;
                if( targetElement ) {
                  targetElement.style.height=`${searchTagListMap.length * 20}px`
                }
                searchTagList();
              }}
              onBlur={()=>{
                const targetElement = itemRef.current;
                if( targetElement ) targetElement.style.height="auto"
              }}
              onChange={( e ) => changeTag( e )}
              value={tagObj?.id ? tagObj?.id : ''}
            >
              {searchTagListMap.map( item => {
              return (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              );
            } )}
            </Select>
          </div>
        </FormItem>
        <FormItem label='题目数量' required style={{ display:'flex' }}>
          <InputNumber
            value={count || 0}
            formatter={limitDecimals}
            placeholder="请输入题目数量"
            onChange={( e )=>{changeValue( e, 'count' )}}
            max={( tagObj && tagObj?.count )}
            min={0}
          />
        </FormItem>
        <div>*题目将随机展示，该标签下的题目数量是：{( tagObj && tagObj?.count ) || 0}</div>
      </Panel>
    </Collapse>
  );
}

export default connect( ( { bees } ) => {
  return {
    searchTagListMap: bees.searchTagListMap,
  };
} )( prizeSetting );

/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-08-28 11:01:22
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-10-10 14:11:13
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/BeesV3/AddOrEditBees/ComponentsOption/Voting/VoteTopicSetting/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import {  Collapse, Icon, Input, Form, Button, Popconfirm  } from 'antd'
import RenderFormItem from '../../RenderFormItem';


const { Panel } = Collapse;


function Index( { componentsData, changeValue } ) {
  const { optionsList, id:componentId } = componentsData
  const VoteOptions = () => {

    const addOption = () => {
      const newOption = {
        context: `选项${optionsList.length + 1}`,
        elementId:componentId,
      }
      changeValue(  [ ...optionsList, newOption], 'optionsList' )
    }

    const deleteOption = ( indexToRemove ) => {
      changeValue( optionsList.filter( ( item, index ) => index !== indexToRemove ), 'optionsList'  )
    }
    
    const changeOption = ( e, index ) => {
      changeValue( e, `optionsList[${index}].context` )
    }

    const swapItems = ( arr, idx1, idx2 ) => {
      const newArr = [...arr];
      [newArr[idx1], newArr[idx2]] = [newArr[idx2], newArr[idx1]];
      return newArr;
    }
  
    const moveItemUp = ( index ) => {
      if ( index === 0 ) return;
      changeValue( swapItems( optionsList, index, index - 1 ), 'optionsList' );
    }
  
    const moveItemDown = ( index ) => {
      if ( index === optionsList.length - 1 ) return;
      changeValue( swapItems( optionsList, index, index + 1 ), 'optionsList' );
    }
  

    const view = optionsList.length ? optionsList.map( ( item, index )=>{
      const { context, id } = item
      return (
        <div key={id || index} style={{ display:'flex', alignItems:'center', marginTop: index === 0 ? '0px' : '10px' }}>
          <Input value={context} onChange={( e )=>{changeOption( e, index )}} maxLength={24} placeholder={`请输入选项${index}`} style={{ width:'70%' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', flex:1, marginLeft:'10px'  }}>
            <Icon type="up-circle" style={{ fontSize:'24px', color:'#1F3883' }} onClick={()=>{moveItemUp( index )}} />
            <Icon type="down-circle" style={{ fontSize:'24px', color:'#1F3883' }} onClick={()=>{moveItemDown( index )}} />
            <Popconfirm
              title='确定删除该选项吗？'
              okText='确定'
              cancelText='取消'
              placement="topRight"
              onConfirm={()=>{deleteOption( index )}}
            >
              <Icon type="delete" style={{ fontSize:'24px', color:'#1F3883' }} />
            </Popconfirm>
          </div>
        </div>
      )
    } ) : null

    return (
      <Form.Item required label='选项设置' style={{ display: optionsList.length ? '' : 'flex' }}>
        {view}
        <Button type='dashed' icon='plus-circle' style={{ marginTop:optionsList.length ? '10px' : '' }} onClick={addOption}>添加选项</Button>
      </Form.Item>
    )
  }

  const renderList =  [
    {
      renderType: 'Select',
      label: '题目类型',
      field: 'questionType',
      required: true,
      flex: true,
      optionList: [
        {
          label: '单选题',
          value: 'SINGLE_CHOICE',
        },
        {
          label: '多选题',
          value: 'MULTIPLE_CHOICE',
        },
        // {
        //   label:'问答题',
        //   value:'ESSAY_QUESTION'
        // },
        // {
        //   label:'评分',
        //   value:'SCORE'
        // }
      ],
      propsData: {
        style:{
          width: 200
        }
      },
    },
    {
      renderType: 'Input',
      label: '投票主题',
      field: 'title',
      required: true,
      wordsMax: 50,
      propsData: {
        placeholder: '请输入投票主题',
      },
    },
    {
      renderType: 'Input',
      label: '主题描述',
      field: 'description',
      required: true,
      wordsMax: 200,
      propsData: {
        placeholder: '请输入主题描述',
      },
    },
    {
      renderType:'custom',
      content: VoteOptions() 
    },
    {
      renderType: 'InputNumber',
      field: 'votingLimit',
      label: '单次投票上限',
      conditionalRendering:{ path:'questionType', value:'MULTIPLE_CHOICE' },
      propsData: {
        min:0,
        precision: 0,
        placeholder: '请输入单次最多可投票的选项数量',
        parser: text => Number( text.replace( /[^0-9]/g, '' ) )
      }
    },
    {
      renderType: 'Radio',
      label: '是否展示投票数据',
      field: 'isShowVoteData',
      required: true,
      flex: true,
      radioList: [
        {
          label: '否',
          value:  false,
        },
        {
          label: '是',
          value: true,
        },
      ],
    },
    {
      renderType: 'Radio',
      label: '展示数据类型',
      field: 'showVoteDataType',
      required: true,
      conditionalRendering:'isShowVoteData',
      radioList: [
        {
          label: '百分比',
          value: 'PERCENT',
        },
        {
          label: '投票人数',
          value:  'VOTERS',
        },
        {
          label: '投票人数&百分比',
          value: 'ALL'
        }
      ],
    },
  ]

  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: 20 }}>
      <Panel header="投票题目配置" key="1">
        <RenderFormItem renderList={renderList} />
      </Panel>
    </Collapse>
  )
}

export default Index

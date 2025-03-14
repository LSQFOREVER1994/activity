import React from 'react';
import { Collapse } from 'antd';
import RenderFormItem from '../../RenderFormItem';
import PrizeTable from '@/components/PrizeOption';

const { Panel } = Collapse;
const reg = new RegExp( /^\d+$/ );

const PrizeOption = props => {
  const { componentsData={} } = props || {};
  const renderList = [
    {
      renderType: 'Switch',
      flex: true,
      label: '早鸟报名奖品',
      field: 'enableAward',
    },
  ];

  
  const renderList2 =[
    {
      renderType: 'Input',
      flex: true,
      label: '早鸟报名人数',
      field: 'enrollNumber',
      required: true,
      propsData: {
        placeholder: '请输入报名人数',
        type: 'number',
        min: 0,
        // pattern:'^\\d+$',
        onKeyPress: event => {
          if ( event.key === '-' || !reg.test( event.key ) ) {
            event.preventDefault();
          }
        },
      },
    },
  ]

  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: 20 }}>
      <Panel header="早鸟报名奖" key="1">
        <RenderFormItem renderList={renderList} />
        {
          componentsData.enableAward && 
          <>
            <RenderFormItem renderList={renderList2} />
            <PrizeTable tableTitle="早鸟报名奖" dataKey='prizes' {...props} />
            <PrizeTable tableTitle="兜底奖池配置" dataKey='prizeList' {...props} />
          </>
        }
      </Panel>
    </Collapse>
  );
};

export default PrizeOption;

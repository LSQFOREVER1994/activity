import React from 'react';
import { Collapse, Tooltip, Icon } from 'antd';
import RenderFormItem from '../RenderFormItem';
import RankTask from './taskForm';
import CheckForm from './CheckForm';
import styles from './index.less';

const { Panel } = Collapse;

const renderList = [
  {
    renderType: 'Select',
    label: '排行榜类型',
    field: 'rankType',
    required: true,
    flex:true,
    propsData:{
       style:{
         width:195
       }
    },
    optionList:[
      {
        label: '积分排行榜',
        value: 'INTEGRAL',
      },
      {
        label: '猜涨跌排行榜',
        value: 'GUESS',
      },
    ],
    changeCallBack:( e, componentData, changeComponentData )=>{
      changeComponentData( ['MONTH_ACC', 'MONTH_ADD'], 'rankCategoryTypes' )
    }
  },
  {
    renderType: 'InputNumber',
    required: true,
    flex:true,
    field: 'showNumber',
    propsData:{
      min:3,
      max:1000
    },
    label:(
      <span>数据展示量
        <Tooltip title='默认仅展示前十名数据，若数据大于10，则展示在"更多数据"中。最大展示量：1000名排行榜数据，1000名及以后的排名展示999+'>
          <Icon type="question-circle" />
        </Tooltip>
      </span> ),
  },
];

function Rank( props ) {
  return(
    <Collapse defaultActiveKey="1" className={styles.rank_box_c}>
      <Panel header="排行榜设置" key="1">
        <RenderFormItem renderList={renderList} />
        <RankTask {...props} />
        <CheckForm {...props} />
      </Panel>
    </Collapse>
  )
}

export const HIDE_TEXT_COLOR = true;
export default Rank;

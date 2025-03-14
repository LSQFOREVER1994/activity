import React from 'react';
import RenderFormItem from '../RenderFormItem';
import TabList from './TabList';


const renderList2 = [
  {
    renderType: 'InputNumber',
    label: '字号',
    field: 'fontSize',
    flex:true,
    required: false,
    formLayout: {},
    unit:{
      text:['px']
    },
    propsData: {
      min: 12,
      style:{
        width: '75%',
      }
    },
  },
  {
    renderType: 'SketchPicker',
    label: '激活颜色',
    field: 'activeColor',
    flex:true,
    required: false,
  },
    {
    renderType: 'SketchPicker',
    label: '未激活颜色',
    field: 'unActiveColor',
    flex:true,
    required: false,
  },
];

function Tab( props ) {
    const { componentsData:{ showTitle, mode } } = props || {};
    const positionOptionList =mode === 'TAB' ? [
      {
        label: '居上',
        value: 'TOP',
      },
      {
        label: '居下',
        value: 'BOTTOM',
      }
    ] : [
      {
        label: '居下',
        value: 'BOTTOM',
      }
    ]

    const renderList1 = [
      {
        renderType: 'Radio',
        label: '展示模式',
        field: 'mode',
        required: true,
        formLayout: {},
        radioList: [
          {
            label: '导航栏',
            value: 'NAV',
          },
          {
            label: 'tab',
            value: 'TAB',
          }
        ],
        changeCallBack: ( e, componentsData, changeComponentData ) => {
          const val = e.target.value;
          if ( val === 'NAV' ) {
            changeComponentData( 'BOTTOM', 'position' );
            changeComponentData( 'BOTTOM', 'suspendMode' )
          }
        },
      },
      {
        renderType: 'Select',
        label: 'Tab容器位置',
        field: 'position',
        required: true,
        optionList:positionOptionList
      },
      // {
      //   renderType: 'Switch',
      //   label: '展示标题文字',
      //   field: 'showTitle',
      //   flex:true,
      //   required: false,
      // },
    ];

    return(
      <>
        <RenderFormItem renderList={renderList1} />
        {showTitle && <RenderFormItem renderList={renderList2} />}
        <TabList {...props} />
      </>
    )
}

export default Tab;

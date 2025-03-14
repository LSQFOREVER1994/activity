import React, { useMemo, useEffect } from 'react';
import { connect } from 'dva';
import RenderFormItem from '../RenderFormItem';
import BasicsSetting from './BasicsSetting';
import InviterSetting from './InviterSetting';
import InviteeSetting from './InviteeSetting';
import ModalShowSetting from './ModalShowSetting';

const renderList = [
  // {
  //   renderType: 'Select',
  //   label: '绑定方式',
  //   field: 'bindingType',
  //   required: false,
  //   flex: true,
  //   propsData: {
  //     style: {
  //       width: 200
  //     }
  //   },
  //   optionList: [
  //     {
  //       label: '手动绑定',
  //       value: 'MANUAL',
  //     },
  //     {
  //       label: '自动绑定',
  //       value: 'AUTO',
  //     },
  //   ],
  // },
  {
    renderType: 'Radio',
    label: '展示形式',
    field: 'showType',
    flex: true,
    required: false,
    conditionalRendering: { path: 'bindingType', value: 'MANUAL' },
    radioList: [
      {
        label: '页面展示',
        value: 'DIRECT',
      },
      {
        label: '弹窗展示',
        value: 'POP_WINDOWS',
      },
    ],
  },
  {
    renderType: 'Radio',
    label:'弹窗展示形式',
    field:'showStyle',
    flex: true,
    required: false,
    conditionalRendering: ( data ) => {
      if ( data.bindingType === 'MANUAL' && data.showType === 'POP_WINDOWS' ) return true;
      if ( data.bindingType === 'AUTO' ) return true;
      return false
    },
    radioList: [
      {
        label: '任务形式',
        value: 'TASK',
      },
      {
        label: '按钮形式',
        value: 'BUTTON',
      }
    ]
  }
];

const inviteButton = [
  {
    renderType: 'UploadModal',
    field: 'inviteButton',
    label: '邀请按钮',
    required: true,
    tips: {
      text: ['图片大小建议不大于1M']
    },
  },
]

function Invite( props ) {
  const { componentsData, dispatch } = props;
  const { showType, bindingType, showStyle, id } = componentsData;

    // 获取资格类型
  const getEligibilityType = ( name ) => {
    dispatch( {
      type: 'bees/getEligibilityType',
      payload: {
        query: {
          key: name ? encodeURIComponent( name ) : '',
          removeActivity:true
        },
        successFun: () => {}
      },
    } );
  }

  const renderPopSetting = useMemo( () => {
    const componentMap = {
      TASK: <ModalShowSetting />,
      BUTTON: <RenderFormItem renderList={inviteButton} />,
    };
    if ( bindingType === 'MANUAL' && showType === 'POP_WINDOWS' ) return componentMap[showStyle] || null;
    if ( bindingType === 'AUTO' ) return componentMap[showStyle] || null;
    return null;
  }, [showType, bindingType, showStyle] );


  useEffect( ()=>{
    getEligibilityType()
  }, [id] )
  return (
    <React.Fragment>
      <RenderFormItem renderList={renderList} />
      {renderPopSetting}
      {bindingType === 'MANUAL' && <BasicsSetting />}
      <InviterSetting {...props} />
      <InviteeSetting {...props} />
    </React.Fragment>
  );
}
export const HIDE_TEXT_COLOR = true;
export default connect()( Invite );

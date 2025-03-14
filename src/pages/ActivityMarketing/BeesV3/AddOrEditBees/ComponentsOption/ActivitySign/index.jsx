/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import React, { useState, useMemo, useEffect } from 'react';
import { Collapse, Empty, Form, Button, Icon, InputNumber, Popconfirm } from 'antd';
import RenderFormItem from '../RenderFormItem';
import PrizeTable, { PrizeTableModal } from '@/components/PrizeOption';
import styles from './index.less';
import PrizeImg from './prize.png'
import imgObj from './signStyleConfig';

const { Panel } = Collapse;

function index( props ) {
  const { componentsData, isEditTemp, changeValue } = props;
  const { CURRENT_ADD, freshType, signDay, dailyRewardType, rewardEnable } = componentsData;
  let { reachRewards = [] } = componentsData;
  const [modalVisible, setModalVisible] = useState( false );
  const [prizesIndex, setPrizesIndex] = useState( -1 );

  useEffect( () => {
    if ( reachRewards.length !== 0 && !rewardEnable ) {
      changeValue( true, "rewardEnable" )
    }
    reachRewards = reachRewards.map( ( item, index ) => {
      if ( !item.key ) {
        // eslint-disable-next-line no-param-reassign
        item.key = ( new Date() ).getTime() + index
      }
      return item
    } )
  }, [] );

  const dailyPrize = useMemo( () => {
    if ( dailyRewardType !== 'PRIZE' ) return null;
    return (
      <div style={{ marginTop: '20px' }} key="dailyPrizeTable">
        <PrizeTable
          {...props}
          dataKey="prizeList"
          tableTitle="奖品配置"
        />
      </div>
    );
  }, [dailyRewardType, componentsData] );

  const renderList = [
    {
      renderType: 'DatePicker',
      label: '签到开始时间',
      field: 'startTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      renderType: 'DatePicker',
      label: '签到结束时间',
      flex: true,
      field: 'endTime',
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      renderType: 'Select',
      field: 'signStyle',
      label: '签到样式',
      required: true,
      flex: true,
      propsData: {
        style: {
          width: 200
        },
      defaultValue: 'BASIC'
      },
      optionList: [
        {
          label: '基础样式',
          value: 'BASIC',
        },
        {
          label: '活力金黄',
          value: 'GOLD',
        },
        {
          label: '经典橙红',
          value: 'ORANGE',
        },
      ],
      changeCallBack: ( e, componentsData, changeComponentData ) => {
        Object.keys( imgObj[e] ).forEach( key => {
          changeComponentData( imgObj[e][key], key )
        } )
      },
    },
    {
      renderType: 'Input',
      field: 'rule',
      label: '签到文案规则',
      flex: true,
      required: true,
      propsData: {
        style: {
          width: 180,
        },
        placeholder: '请输入签到规则文案',
        maxLength: 30,
      },
    },
    {
      renderType: 'Radio',
      label: '签到刷新类型',
      field: 'freshType',
      required: true,
      disabled: !CURRENT_ADD,
      radioList: [
        {
          label: '不刷新',
          value: 'NONE',
        },
        {
          label: '达到指定天数刷新',
          value: 'DAY',
        },
        {
          label: '自然周刷新',
          value: 'WEEK',
        },
        {
          label: '自然月刷新',
          value: 'MONTH',
        },
      ],
      changeCallBack: ( e, componentsData, changeComponentData ) => {
        const val = e.target.value;
        if ( val === 'DAY' ) {
          changeComponentData( 'SEQUENCE', 'signType' );
          changeComponentData( 3, 'signDay' );
        } else if ( val === 'WEEK' ) {
          changeComponentData( 190, 'style.height' );
        }
        if ( val === 'MONTH' ) {
          changeComponentData( 460, 'style.height' );
        } else {
          changeComponentData( 190, 'style.height' );
        }
      },
    },
    // {
    //   renderType: 'Radio',
    //   label: '展示错过',
    //   field: 'showMiss',
    //   required: true,
    //   disabled: !CURRENT_ADD,
    //   radioList: [
    //     {
    //       label: '展示',
    //       value: true,
    //     },
    //     {
    //       label: '不展示',
    //       value: false,
    //     }
    //   ],
    // },
    {
      renderType: ( freshType === 'DAY'||freshType === 'NONE' ) ? 'Radio' : 'custom',
      label: '可签到天数',
      field: 'signDay',
      required: true,
      radioList: [
        {
          label: '3天',
          value: 3,
        },
        {
          label: '5天',
          value: 5,
        },
        {
          label: '7天',
          value: 7,
        },
        {
          label: '14天',
          value: 14,
        },
        {
          label: '20天',
          value: 20,
        },
        {
          label: '30天',
          value: 30,
        },
      ],
      disabled: !CURRENT_ADD,
      annotation: <span style={{ color: '#f5222d' }}>*保存后，可签到天数将无法更改</span>,
      changeCallBack: ( e, componentsData, changeComponentData ) => {
        const val = e.target.value;
        if ( val === 3 || val === 5 || val === 7 ) {
          changeComponentData( 190, 'style.height' );
        } else if ( val === 14 ) {
          changeComponentData( 270, 'style.height' );
        } else {
          changeComponentData( 510, 'style.height' );
        }
      },
    },
    // {
    //   renderType: 'Radio',
    //   label: '达标奖励',
    //   field: 'rewardType',
    //   required: true,
    //   radioList: [
    //     {
    //       label: '积分',
    //       value: 'INTEGRAL',
    //     },
    //     {
    //       label: '奖品',
    //       value: 'PRIZE',
    //     },
    //     {
    //       label: '次数',
    //       value: 'LEFT_COUNT',
    //     },
    //   ],
    //   changeCallBack: ( e, componentsData, changeComponentData ) => {
    //     const val = e.target.value;
    //     if ( val === 'PRIZE' ) {
    //       changeComponentData( '', 'rewardValue' );
    //     } else if ( val !== 'PRIZE' ) {
    //       changeComponentData( [], 'prizes' );
    //     }
    //   },
    // },
    // {
    //   renderType: 'InputNumber',
    //   label: '达标签到奖励',
    //   field: 'rewardValue',
    //   required: true,
    //   flex:true,
    //   formLayout: {},
    //   propsData: {
    //     style:{
    //       width:230
    //     },
    //     placeholder: '请输入签到天数达标所获得的奖励（分/次）',
    //     min: 0,
    //   },
    //   disabled: config => {
    //     if ( config.rewardType === 'PRIZE' ) return true;
    //   },
    // },
    // {
    //   renderType: 'InputNumber',
    //   label: '达标天数',
    //   field: 'reach',
    //   flex:true,
    //   required: true,
    //   formLayout: {},
    //   propsData: {
    //     style:{
    //       width:230
    //     },
    //     placeholder: '请输入可获得奖励的签到达标天数，需≤可签到天数',
    //     min: 0,
    //   },
    // },
    {
      renderType: 'Radio',
      label: '每日奖励类型',
      field: 'dailyRewardType',
      flex: true,
      required: true,
      radioList: [
        {
          label: '奖品',
          value: 'PRIZE',
        },
        {
          label: '无',
          value: 'NONE',
        },
      ],
    },
    {
      renderType: 'custom',
      content: dailyPrize
    },
    // {
    //   renderType: 'InputNumber',
    //   label: '每日签到奖励',
    //   field: 'dailyRewardValue',
    //   conditionalRendering: data => ( data.dailyRewardType !== 'PRIZE' ),
    //   flex: true,
    //   required: false,
    //   propsData: {
    //     style: {
    //       width: 230,
    //     },
    //     placeholder: '请输入每日签到奖励',
    //     min: 0,
    //   },
    // },
    // {
    //   renderType: 'InputNumber',
    //   label: '可完成次数',
    //   field: 'limit',
    //   flex:true,
    //   required: false,
    //   propsData: {
    //     style:{
    //       width:230
    //     },
    //     placeholder: '请输入可获得签到奖励的次数，不填默认不限',
    //     min: 1,
    //   },
    // },
    {
      renderType: 'UploadModal',
      field: 'unSignBtnImg',
      label: '签到按钮图（签到前）',
      required: true,
      tips: {
        text: ['图片尺寸建议180px * 70px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'signedBtnImg',
      label: '签到按钮图（签到后）',
      required: true,
      tips: {
        text: ['图片尺寸建议180px * 70px', '图片大小建议不大于1M'],
      },
    },
  ];

  const renderSignImgList = [
    {
      renderType: 'UploadModal',
      field: 'signedIcon',
      label: '已签到',
      required: true,
      tips: {
        text: ['图片尺寸建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: freshType === 'MONTH' ? 'custom' : 'UploadModal',
      field: 'missIcon',
      label: '已错过',
      required: true,
      tips: {
        text: ['图片尺寸建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: freshType === 'MONTH' ? 'custom' : 'UploadModal',
      field: 'unSignIcon',
      label: '待签到',
      required: true,
      tips: {
        text: ['图片尺寸建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: freshType === 'MONTH' ? 'custom' : 'UploadModal',
      field: 'lockIcon',
      label: '待解锁',
      required: true,
      tips: {
        text: ['图片尺寸建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'prizeIcon',
      label: '达标奖品图',
      required: true,
      tips: {
        text: ['图片尺寸建议1:1', '图片大小建议不大于1M'],
      },
    },
  ];

  const ComplianceRewards = () => {
    return (
      <div>
        {reachRewards.length === 0 ? (
          <>
            <Empty description="暂未添加达标天数" />
          </>
        ) : (
          reachRewards.map( ( item, index ) => {
            return (
              <div key={item.key} className={styles.rewards_item}>
                <InputNumber
                  type="number"
                  min={1}
                  max={freshType === 'DAY' ? signDay : 32}
                  defaultValue={item.conditionValue}
                  style={{ flex: 1 }}
                  onChange={e => {
                    reachRewards[index].conditionValue = e;
                  }}
                  placeholder='完成需达标天数应<=可签到天数'
                />
                <Popconfirm
                  title="是否删除该达标天数奖励？"
                  onConfirm={() => {
                    reachRewards.splice( index, 1 );
                    changeValue( reachRewards, 'reachRewards' );
                  }}
                >
                  <Icon
                    type="delete"
                    theme="filled"
                    style={{ color: 'red', fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }}
                  />
                </Popconfirm>
                <img
                  onClick={() => {
                    setPrizesIndex( index );
                    setModalVisible( true );
                  }}
                  alt=""
                  src={PrizeImg}
                  style={{ width: '20px', height: "20px", marginLeft: '10px', cursor: 'pointer' }}
                />
              </div>
            );
          } )
        )}
        {( ( freshType === 'DAY' && signDay !== reachRewards.length ) || freshType !== 'DAY' ) && (
          <Button
            onClick={() =>
              changeValue(
                [...reachRewards, { conditionValue: '', prizes: [], key: new Date().getTime() }],
                'reachRewards'
              )
            }
            type="dashed"
            style={{ width: '100%', marginTop: '10px' }}
          >
            添加达标天数奖励
          </Button>
        )}
      </div>
    );
  };

  const additionalRewardsList = [
    {
      renderType: 'Radio',
      label: '签到类型',
      field: 'signType',
      required: true,
      radioList: [
        {
          label: '连续签到',
          value: 'SEQUENCE',
        },
        {
          label: '累计签到',
          value: 'ACCUMULATIVE',
          disabled: freshType === 'DAY',
        },
      ],
      disabled: () => {
        if ( isEditTemp ) {
          return false;
        }
        return !CURRENT_ADD;
      },
    },
    {
      renderType: 'custom',
      content: <Form.Item style={{ marginBottom: 0 }} label="达标天数奖励" required key="reachRewards" />,
    },
    {
      renderType: 'custom',
      content: <ComplianceRewards key="complianceRewards" />,
    },
  ];

  // const renderPrizeOption = useMemo( () => {
  //   if ( !( rewardType === 'PRIZE' ) ) return null;
  //   return (
  //     <div style={{ marginTop: '20px' }}>
  //       <PrizeTable {...props} tableTitle="奖品配置" />
  //     </div>
  //   );
  // }, [rewardType, componentsData] );

  return (
    <>
      <RenderFormItem renderList={renderList} key='list' />
      <RenderFormItem
        key="rewardEnable"
        renderList={[
        {
          renderType: 'Switch',
          flex: true,
          label: '额外签到奖励',
          field: 'rewardEnable',
          changeCallBack: ( e, componentsData, changeComponentData ) => {
            if( !e ) changeComponentData( [], 'reachRewards' )
          },
        }, ]}
      />
      {
        rewardEnable && (
          <div style={{ marginBottom: 20 }}>
            <Collapse defaultActiveKey="1">
              <Panel header="额外签到奖励" key="1">
                <RenderFormItem renderList={additionalRewardsList} key='rewardList' />
              </Panel>
            </Collapse>
          </div>
        )
      }
      <div style={{ marginBottom: 20, marginTop: 20 }}>
        <Collapse defaultActiveKey="1">
          <Panel header="签到状态图片设置" key="1">
            <RenderFormItem renderList={renderSignImgList} key='imgList' />
          </Panel>
        </Collapse>
      </div>
      {/* {renderPrizeOption} */}
      {/* <RenderFormItem
        renderList={[
          {
            renderType: 'SketchPicker',
            field: 'style.textColor',
            label: '文字颜色',
            flex: true,
          },
        ]}
      /> */}
      <PrizeTableModal
        {...props}
        dataKey={`reachRewards[${prizesIndex}].prizes`}
        modalVisible={modalVisible}
        setModalVisible={status => setModalVisible( status )}
      />
    </>
  );
}

export const HIDE_TEXT_COLOR = true;
export default index;

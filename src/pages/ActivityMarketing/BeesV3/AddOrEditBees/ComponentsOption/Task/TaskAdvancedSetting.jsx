import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Collapse, Tooltip, Icon, Form, Select, Spin, Empty } from 'antd'
import RenderFormItem from '../RenderFormItem';
import useElementList from '@/hooks/useElementList';

const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;

const colorsTip = {
  titleColor: "标题颜色",
  textColor: "描述颜色"
}

const colorsKey = [
  "titleColor",
  "textColor",
]

const defaultColors = {
  titleColor: 'rgba(84,84,84,1)',
  textColor: 'rgba(134, 140, 148,1)'
}

const renderList = [

  {
    renderType: 'InputNumber',
    label: (
      <span>
        <span>每完成几次获得奖励 </span>
        <Tooltip
          title={
            <span>
              若配置了N次，则表明，每达成N次资格，才可获得1次奖励
            </span>
          }
        >
          <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
        </Tooltip>
      </span>
    ),
    field: 'task.eachCount',
    required: false,
    propsData: {
      placeholder: '不填默认1次',
      min: 0,
    },
    unit: (
      <span style={{ paddingLeft: '10px' }}>次</span>
    ),
  },
  {
    renderType: 'DatePicker',
    label: (
      <span>
        <span>任务开始时间 </span>
        <Tooltip
          title={
            <span>
              若配置了任务开始时间，任务只能此时间之后完成
            </span>
          }
        >
          <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
        </Tooltip>
      </span>
    ),
    field: 'task.startTime',
    required: false,
    propsData: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择时间',
      style: {
        width: '100%',
      },
    },
  },
  {
    renderType: 'DatePicker',
    label: (
      <span>
        <span>任务结束时间 </span>
        <Tooltip
          title={
            <span>
              若配置了任务结束时间，任务只能此时间之前完成
            </span>
          }
        >
          <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
        </Tooltip>
      </span>
    ),
    field: 'task.endTime',
    required: false,
    propsData: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择时间',
      style: {
        width: '100%',
      },
    },
  },
  {
    renderType: 'Radio',
    label: (
      <span>
        <span>任务完成模式 </span>
        <Tooltip
          title={
            <span>
              自动领取：成功登陆活动后自动调用接口领取任务奖励
              <br />
              手动领取：需手动点击待领取按钮进行任务奖励领取
            </span>
          }
        >
          <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
        </Tooltip>
      </span>
    ),
    field: 'task.isManual',
    required: true,
    radioList: [
      {
        label: '自动领取',
        value: false,
      },
      {
        label: '手动领取',
        value: true,
      },
    ],
    propsData: {
      defaultValue: false,
    },
  },
  {
    renderType: 'UploadModal',
    label: '待领取按钮',
    field: 'getButton',
    required: true,
    tips: {
      text: ['格式：jpg/jpeg/png ', '图片尺寸建议150px * 64px ', '图片大小建议不大于1M'],
    },
    conditionalRendering: data => data.task.isManual === true,
  },
  {
    renderType: 'TextArea',
    label: (
      <span>
        <span>任务完成消息提示 </span>
        <Tooltip
          title={
            <span>
              任务奖励为次数或积分时，将展示任务完成消息弹窗。不配置不展示。
              <br />
              任务奖励为奖品时，若配置了任务完成消息提示，则将展示任务完成消息弹窗；若未配置，则展示奖品中奖弹窗或谢谢参与弹窗。
            </span>
          }
        >
          <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
        </Tooltip>
      </span>
    ),
    field: 'task.tip',
    required: false,
    propsData: {
      placeholder: '请输入任务完成消息提示',
      style: {
        width: '100%',
      },
    },
  },
  {
    renderType: 'Switch',
    flex: true,
    label: (
      <span>
        <span>已完成任务跳转 </span>
        <Tooltip
          title={
            <span>
              默认开启，开启时，任务完成时，点击已完成按钮也可正常跳转；关闭时，点击已完成按钮无反应
            </span>
          }
        >
          <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
        </Tooltip>
      </span>
    ),
    field: 'task.isFinishJump',
    required: false,
  },
  {
    renderType: 'ColorsMap',
    label: '颜色',
    field: 'colors',
    flex: true,
    formLayout: {},
    propsData: {
      colorsTip,
      colorsKey,
      defaultValue: defaultColors
    },
  },
]


function TaskAdvancedSetting( props ) {
  const currentElementList = useElementList();
  const { allActivityList, loading, drawElementList, componentsData, changeValue, dispatch } = props;
  const { task: { rewardType, otherActivityId, otherElementId } } = componentsData;

  const renderDrawElement = () => {
    if ( rewardType !== "LEFT_COUNT" ) return null
    const elementList = otherActivityId ? drawElementList : currentElementList;

    // 获取活动列表
    const getAllActivityList = () => {
      dispatch( {
        type: 'bees/getAllActivityList',
        payload: {},
      } )
    }

    const getDrawElement = ( activityId ) => {
      if ( !activityId ) return
      dispatch( {
        type: 'bees/getDrawElement',
        payload: {
          query: activityId,
          successFun: () => { },
        }
      } )
    }

    const changeSelect = ( e, type ) => {
      if ( type === 'otherActivityId' ) {
        getDrawElement( e );
        changeValue( e, 'task.otherActivityId' );
        changeValue( undefined, 'task.otherElementId' );
      } else {
        changeValue( e, 'task.otherElementId' );
      }
    };

    useEffect( () => {
      if ( otherActivityId ) {
        getAllActivityList()
        getDrawElement( otherActivityId );
      }
    }, [] )

    return (
      <Form>
        <FormItem label="关联活动">
          <Select
            showSearch
            allowClear
            value={otherActivityId}
            filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
            placeholder="发放至其他活动，不选则为当前活动"
            onFocus={getAllActivityList}
            onChange={e => changeSelect( e, 'otherActivityId' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {allActivityList.map( et => (
              <Option key={et.id}>{`${et.name} (${et.id})`}</Option>
            ) )}
          </Select>
        </FormItem>
        <FormItem label="关联组件">
          <Select
            showSearch
            allowClear
            value={otherElementId}
            filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
            placeholder="发放至组件，不填则为通用次数"
            onChange={e => changeSelect( e, 'otherElementId' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          >
            {!loading && elementList.map( el => (
              <Option key={el.id}>{`${el.name || el.label} (${el.id})`}</Option> )
            )}
          </Select>
        </FormItem>
      </Form>
    )
  }

  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: '20px' }}>
      <Panel
        header={
          <div>
            <span>任务高级配置</span>
          </div>
        }
        key="1"
      >
        {renderDrawElement()}
        <RenderFormItem renderList={renderList} />
      </Panel>
    </Collapse>
  )
}

export default connect( ( { bees } ) => {
  return {
    loading: bees.loading,
    allActivityList: bees.allActivityList,
    drawElementList: bees.drawElementList,
  };
} )( TaskAdvancedSetting );

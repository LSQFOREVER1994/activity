/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-08-28 10:21:49
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-10-10 13:34:40
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/BeesV3/AddOrEditBees/ComponentsOption/Voting/index.jsx
 */
import React from 'react'
import RenderFormItem from '../RenderFormItem'
import QualificationsOption from './QualificationsOption'
import VoteTopicSetting from './VoteTopicSetting'
import VoteStyleSetting from './VoteStyleSetting'




function Index( { componentsData, changeValue } )  {
  const { questionType } = componentsData
  const renderList = [
    {
      renderType: 'DatePicker',
      label: '投票开始时间',
      field: 'startTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
    {
      renderType: 'DatePicker',
      label: '投票结束时间',
      field: 'endTime',
      flex: true,
      required: false,
      formLayout: {},
      propsData: {
        showTime: true,
        style: { width: '80%' },
        format: 'YYYY-MM-DD HH:mm:ss',
      }
    },
    {
      renderType: 'Radio',
      label: '是否展示活动数据',
      field: 'showAttendUser',
      required: true,
      flex: true,
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
      radioList: [
        {
          label: '否',
          value: false,
        },
        {
          label: '是',
          value: true,
        },
      ],
    },
    {
      renderType: 'UploadModal',
      field: 'submitButtonImage',
      label: '提交按钮',
      required: questionType === 'MULTIPLE_CHOICE',
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'noSubmitButtonImage',
      label: '已提交按钮',
      required: questionType === 'MULTIPLE_CHOICE',
      tips: {
        text: ['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
    },
  ]
  return (
    <>
      <RenderFormItem renderList={renderList} />
      <QualificationsOption componentsData={componentsData} changeValue={changeValue} />
      <VoteTopicSetting componentsData={componentsData} changeValue={changeValue} />
      <VoteStyleSetting />
    </>
  )
}

export const HIDE_TEXT_COLOR = true;
export default Index
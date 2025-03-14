/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-09-03 14:31:55
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-09-24 21:56:57
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/BeesV3/AddOrEditBees/ComponentsOption/BindGroup/index.jsx
 */
import React from 'react';
import { Collapse } from 'antd';
import PrizeTable from '@/components/PrizeOption';
import RenderFormItem from '../RenderFormItem';

const { Panel } = Collapse;

function Index( props ) {
  const renderList = [
    {
      renderType: 'DatePicker',
      label: '拼团开始时间',
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
      label: '拼团结束时间',
      field: 'endTime',
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
      renderType: 'InputNumber',
      label: '组团人数',
      field: 'memberAmount',
      required: true,
      propsData: {
        placeholder: '请输入每个团所需组团人数，最少为2人',
        min: 2,
        precision: 0,
        parser: text => Number( text.replace( /[^0-9]/g, '' ) ),
      },
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
    },
    {
      renderType: 'InputNumber',
      label: '用户可参团次数',
      field: 'attendLimit',
      required: true,
      propsData: {
        placeholder: '请输入每个用户可参与组团的次数，最少为1',
        min: 1,
        precision: 0,
        parser: text => Number( text.replace( /[^0-9]/g, '' ) ),
      },
      formLayout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 },
      },
    },
    {
      renderType: 'UploadModal',
      field: 'inviteButtonImg',
      label: '邀请好友按钮图',
      required: true,
      tips: {
        text: ['图片尺寸比例建议548px * 80px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'drawButtonImg',
      label: '抽奖按钮图',
      required: true,
      tips: {
        text: ['图片尺寸比例建议548px * 80px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'startGroupButtonImg',
      label: '我也要开团按钮',
      required: true,
      tips: {
        text: ['图片尺寸比例建议548px * 80px', '图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'awardButtonImg',
      label: '已获奖按钮图',
      required: true,
      tips: {
        text: ['图片尺寸比例建议548px * 80px', '图片大小建议不大于1M'],
      },
    },
  ];
  return (
    <>
      <RenderFormItem renderList={renderList} />
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel
          header="团长奖品配置"
          key="1"
          style={{
            borderRadius: 4,
            marginBottom: 10,
            border: 0,
            overflow: 'hidden',
          }}
        >
          <span style={{ color:'#c72a29', fontSize:'12px' }}>*一个用户一期活动仅可当一次团长，只需配置默认概率</span>
          <PrizeTable {...props} />
        </Panel>
        <Panel
          header="团员奖品配置"
          key="2"
          style={{
            borderRadius: 4,
            marginBottom: 10,
            border: 0,
            overflow: 'hidden',
          }}
        >
          <PrizeTable {...props} dataKey="prizeList" />
        </Panel>
      </Collapse>
    </>
  );
}
export const HIDE_TEXT_COLOR = true;
export default Index;

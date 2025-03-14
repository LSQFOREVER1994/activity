import React from 'react';
import { Collapse, Tooltip, Icon } from 'antd';
import RenderFormItem from '../RenderFormItem';
import IntegralList from './integralList';
import CustomIntegral from './customIntegral';

const { Panel } = Collapse;
const reg = new RegExp( /^\d+$/ );

const IntegralOption = props => {
    const renderList1=[
        {
            renderType: 'InputNumber',
            label: '基础积分池 ',
            field: 'baseScore',
            required: true,
            addonAfter:'分',
            propsData: {
                placeholder: '请输入用户每次竞猜基础积分奖池',
                min:0,
                max:1000000000,
                type: 'number',
                onKeyPress: ( event ) => {
                    if( event.key === '-' || !reg.test( event.key ) ){
                        event.preventDefault()
                    }
                }
            },
        },
        {
            renderType: 'InputNumber',
            label: (
              <span>
                <span>瓜分倍数上限</span>
                <Tooltip title={<span>请输入瓜分倍数上限（所投注积分倍数，结果向下取整），不填则不限制</span>}>
                  <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                </Tooltip>
              </span>
            ),
            field: 'rateHandle',
            required: false,
            addonAfter:'倍',
            propsData: {
                placeholder: '请输入用户每次竞猜瓜分倍数上限',
                // type: 'InputNumber',
                min:1,
                // pattern:'^\\d+$',
                onKeyPress: ( event ) => {
                    if( event.key === '-' ||!reg.test( event.key ) ){
                        event.preventDefault()
                    }
                }
            },
        }

    ];
    const renderList2=[
        {
            renderType: 'Input',
            label: '押注提示文案',
            field: 'betTip',
            required: false,
            propsData: {
                placeholder: '请输入押注提示文案',
                maxLength: 20,
            },
        },
        {
            renderType: 'Input',
            label: '积分不足提示文案',
            field: 'scoreUnreachedTip',
            required: false,
            propsData: {
                placeholder: '请输入竞猜积分不足提示文案',
                maxLength: 20,
            },
        },
    ]
    return(
      <Collapse defaultActiveKey="1" style={{ marginBottom:20 }}>
        <Panel header="竞猜奖励配置" key="1">
          <RenderFormItem renderList={renderList1} />
          <IntegralList {...props} />
          <CustomIntegral {...props} />
          <RenderFormItem renderList={renderList2} />
        </Panel>
      </Collapse>
    )
}

export default IntegralOption
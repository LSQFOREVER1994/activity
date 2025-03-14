/* eslint-disable no-restricted-globals */
import React from 'react';
import { Collapse, Form, Switch, Radio, InputNumber, Input, Icon, Tooltip } from 'antd';
import PrizeOption from '@/components/PrizeOption';

const FromItem = Form.Item;
const { Panel } = Collapse;
const limitDecimals = ( value ) => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : ''
  }
  return ''
};

export default function prizeSetting( props ) {
  const { componentsData, changeValue } = props;
  const { withPrize, rewardType, integralType, score, rewardCount, relationId } = componentsData;


  const changeInput = ( e, type ) =>{
    const val = e && e.target ? e.target.value : e;
    changeValue( val, type );
  }

  return (
    <Collapse defaultActiveKey="1" style={{ marginBottom: '20px' }}>
      <Panel
        header={
          <div>
            <span>答题奖励配置</span>
          </div>
        }
        key="1"
      >
        <FromItem label="是否发放奖励" style={{ display:'flex' }}>
          <Switch
            checked={withPrize}
            onChange={e => {
              changeValue( e, 'withPrize' );
            }}
          />
        </FromItem>
        {withPrize && (
          <FromItem label="奖品类型" required style={{ display:'flex' }}>
            <Radio.Group
              onChange={e => changeInput( e, 'rewardType' )}
              value={rewardType || 'INTEGRAL'}
            >
              <Radio value="INTEGRAL">积分</Radio>
              {/* <Radio value="LEFT_COUNT">次数</Radio> */}
              <Radio value='PRIZE'>奖品</Radio>
            </Radio.Group>
          </FromItem>
        )}
        {withPrize && rewardType==='INTEGRAL' && (
        <>
          <FromItem label='答对增加分值' required>
            <Radio.Group
              onChange={e => changeInput( e, 'integralType' )}
              value={integralType || 'ALONE'}
            >
              <div>
                <Radio value="ALONE">
                  <span>每答对一题获取积分 </span>
                  <Tooltip title={<span>答题完成且达标，根据答对的题数获取分数，例如：答对3题，分值为10分，则可获得30积分。</span>}>
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                </Radio>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Radio value="ALL">
                  <span>答题达标获取积分 </span>
                  <Tooltip title={<span>答题完成且达标，即可对应分数，例如：答对3题，分值为10分，则可获得10积分。</span>}>
                    <Icon type="question-circle" theme="filled" style={{ color: '#000000' }} />
                  </Tooltip>
                </Radio>
              </div>
            </Radio.Group>
          </FromItem>
          <FromItem label='分值' required style={{ display:'flex' }}>
            <InputNumber
              onChange={e => changeInput( e, 'score' )}
              value={score}
              placeholder="设置获取分值"
              formatter={limitDecimals}
              style={{ width: '100%' }}
              min={0}
            />
          </FromItem>
          <FromItem label='关联活动ID' style={{ display:'flex' }}>
            <Input
              onChange={e => changeInput( e, 'relationId' )}
              value={relationId}
              placeholder="不填默认本活动"
              formatter={limitDecimals}
              style={{ width: '100%' }}
              min={0}
            />
          </FromItem>
        </>
         )}

        {withPrize&& rewardType === 'LEFT_COUNT' && (
          <>
            <FromItem label='奖励次数' required style={{ display:'flex' }}>
              <InputNumber
                onChange={e => changeInput( e, 'rewardCount' )}
                value={rewardCount}
                placeholder="请输入奖励次数"
                formatter={limitDecimals}
                style={{ width: '100%' }}
              />
            </FromItem>
            <FromItem label='关联活动ID' style={{ display:'flex', marginLeft: 10 }}>
              <Input
                onChange={e=>changeInput( e, 'relationId' )}
                value={relationId}
                placeholder='不填默认本活动'
                style={{ width: '100%' }}
              />
            </FromItem>
          </>
        )}
        {withPrize && rewardType==='PRIZE' && <PrizeOption {...props} tableTitle="奖品配置" />}
      </Panel>
    </Collapse>
  );
}

import React, { useContext } from 'react';
import { Radio, InputNumber, Alert, Form, Tooltip, Icon, Row, Col, Select, TimePicker, Button } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { DomDataContext } from '../../provider';
import removalInstructions from '@/assets/removalInstructions.png'

const FormItem = Form.Item;
const { Option } = Select;
const formLayout2 = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const limitDecimals = value => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !Number.isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : '';
  }
  if ( typeof value === 'number' ) {
    return !Number.isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : '';
  }
  return '';
};
function LotterySettings() {
  const [domData, changeDomData] = useContext( DomDataContext );
  const { drawSetting = {
      removeZeroStock: true,
      dailyCount: 0, initCount: 0,
      dailyType: 'NATURAL',
      dailyClear: true,
      enableTidal:false,
      tidalProbability:0,
      tidalTime:[
        {
          startTime:'07:00',
          endTime:'11:00',
        }
      ]
    } } = domData;
  const changeInputNumber = ( e, type, obj ) => {
    if ( e || e === 0 || e === '' ) {
      const val = e.target ? e.target.value : e;
      domData.drawSetting = { ...obj, [type]: val };
      changeDomData( domData );
    }
  };

  const changeTimePeriodDate = ( e, idx, type ) => {
    const val = e ? e.format( 'HH:mm:ss' ) : '';
    const newAppointTime = drawSetting.tidalTime ? [...drawSetting.tidalTime] : [];
    newAppointTime[idx] = { ...newAppointTime[idx], [type]: val };
    changeInputNumber( newAppointTime, 'tidalTime', drawSetting )
  };

  const addTimePeriodDate = () => {
    const newAppointTime = ( drawSetting.tidalTime || [] ).concat( { startTime: '', endTime: '' } );
    changeInputNumber( newAppointTime, 'tidalTime', drawSetting )
  }

  const deleteTimePeriodDate = ( idx ) => {
    const newAppointTime = drawSetting.tidalTime ? [...drawSetting.tidalTime] : [];
    newAppointTime.splice( idx, 1 );
    changeInputNumber( newAppointTime, 'tidalTime', drawSetting )
  }

  const renderDateTimePeriod = () => {
    const view = drawSetting.tidalTime?.length ? drawSetting.tidalTime.map( ( item, index )=>{
      const { startTime, endTime } = item || {};
      return (
        <React.Fragment key={item.start}>
          <FormItem label={`时间段${index+1}`} {...formLayout2} style={{ display:'flex' }}>
            <TimePicker
              value={startTime ? moment( startTime, 'HH:mm:ss' ) : undefined}
              onChange={( e )=>{ changeTimePeriodDate( e, index, 'startTime' )}}
              style={{ width:'35%' }}
              placeholder='请选择开始时间'
              getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
            />
            <span style={{ padding:'0 10px' }}>~</span>
            <TimePicker
              value={endTime ? moment( endTime, 'HH:mm:ss' ) : undefined}
              onChange={( e )=>{ changeTimePeriodDate( e, index, 'endTime' )}}
              style={{ width:'35%' }}
              placeholder='请选择结束时间'
              getCalendarContainer={triggerNode => triggerNode.parentNode || document.body}
            />
            <span
              style={{ paddingLeft:'10px', color:'red', cursor:'pointer' }}
              onClick={()=>{deleteTimePeriodDate( index )}}
            >删除
            </span>
          </FormItem>
        </React.Fragment>
      )
    } ) : null

    return(
      <div>
        {view}
        <FormItem label={null} {...formLayout2}>
          <Button
            className={styles.add_button}
            type="dashed"
            onClick={addTimePeriodDate}
            icon="plus"
          >
            <span>添加时间段</span>
          </Button>
        </FormItem>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Alert
          type="warning"
          showIcon
          message={
            <div style={{ fontSize: 12, width: '100%', display: 'flex', marginTop: '2px' }}>
              <span>
                通用次数：抽奖类组件（九宫格、大转盘、红包雨、盲盒等）和需用到次数的组件（答题组件的次数、集卡组件的抽卡次数等）中的次数均共用。
              </span>
            </div>
          }
        />
      </div>

      <FormItem
        label={
          <span className={styles.labelText}>
            <span>*</span>初始化通用次数&nbsp;
            <Tooltip title="*用户首次登录活动赠送的通用次数">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        }
        {...formLayout2}
      >
        <InputNumber
          value={drawSetting && drawSetting.initCount}
          placeholder="请输入初始化通用次数"
          min={0}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={e => changeInputNumber( e, 'initCount', drawSetting )}
          style={{ width: '85%' }}
        />
      </FormItem>
      <FormItem
        label={
          <span className={styles.labelText}>
            <span>*</span>每日通用次数&nbsp;
            <Tooltip title="*用户每日登录活动会赠送的通用次数">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        }
        {...formLayout2}
      >
        <Row>
          <Col span={15}>
            <InputNumber
              value={drawSetting && drawSetting.dailyCount}
              placeholder="请输入每日通用次数"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={e => changeInputNumber( e, 'dailyCount', drawSetting )}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={7}>
            <Select
              defaultValue="NATURAL"
              style={{ width: '76%' }}
              disabled
              value={drawSetting && drawSetting.dailyType}
              onChange={e => changeInputNumber( e, 'dailyType', drawSetting )}
            >
              <Option value="NATURAL">自然日</Option>
              {/* <Option value="TRADING">交易日</Option> */}
            </Select>
          </Col>
        </Row>
      </FormItem>
      <FormItem
        label={
          <span className={styles.labelText}>
            <span>*</span>
            每日通用次数是否过期
          </span>
        }
        {...formLayout2}
      >
        <Radio.Group
          value={drawSetting && drawSetting.dailyClear}
          onChange={e => changeInputNumber( e, 'dailyClear', drawSetting )}
        >
          <Radio value>当日过期</Radio>
          <Radio value={false}>不过期</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem
        label={
          <span>
            日中奖次数上限&nbsp;
            <Tooltip title="*限制用户日中奖次数。若配置此选项，奖项必须设置谢谢参与奖项。">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        }
        {...formLayout2}
      >
        <InputNumber
          value={drawSetting && drawSetting.dayLimit}
          placeholder="请输入日中奖次数上限，不填则不限制"
          min={0}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={e => {
            changeInputNumber( e, 'dayLimit', drawSetting );
          }}
          style={{ width: '85%' }}
        />
        <span style={{ paddingLeft: '10px' }}>次</span>
      </FormItem>
      <FormItem
        label={
          <span>
            周中奖次数上限&nbsp;
            <Tooltip title="*限制用户周中奖次数。若配置此选项，奖项必须设置谢谢参与奖项。">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        }
        {...formLayout2}
      >
        <InputNumber
          value={drawSetting && drawSetting.weekLimit}
          placeholder="请输入周中奖次数上限，不填则不限制"
          min={0}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={e => {
            changeInputNumber( e, 'weekLimit', drawSetting );
          }}
          style={{ width: '85%' }}
        />
        <span style={{ paddingLeft: '10px' }}>次</span>
      </FormItem>
      <FormItem
        label={
          <span>
            月中奖次数上限&nbsp;
            <Tooltip title="*限制用户月中奖次数。若配置此选项，奖项必须设置谢谢参与奖项。">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        }
        {...formLayout2}
      >
        <InputNumber
          value={drawSetting && drawSetting.monthLimit}
          placeholder="请输入月中奖次数上限，不填则不限制"
          min={0}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={e => {
            changeInputNumber( e, 'monthLimit', drawSetting );
          }}
          style={{ width: '85%' }}
        />
        <span style={{ paddingLeft: '10px' }}>次</span>
      </FormItem>
      <FormItem
        label={
          <span>
            总中奖次数上限&nbsp;
            <Tooltip title="*限制用户总中奖次数。若配置此选项，奖项必须设置谢谢参与奖项。">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        }
        {...formLayout2}
      >
        <InputNumber
          value={drawSetting && drawSetting.totalLimit}
          placeholder="请输入总中奖次数上限，不填则不限制"
          min={0}
          formatter={limitDecimals}
          parser={limitDecimals}
          onChange={e => changeInputNumber( e, 'totalLimit', drawSetting )}
          style={{ width: '85%' }}
        />
        <span style={{ paddingLeft: '10px' }}>次</span>
      </FormItem>
      <FormItem
        label={
          <span className={styles.labelText}>
            <span>*</span>概率是否移除&nbsp;
            <Tooltip
              placement="right"
              autoAdjustOverflow
              overlayStyle={{ maxWidth:'1000px' }}
              title={<img style={{ width:'615px', height:'542px' }} src={removalInstructions} alt='' />}
            >
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        }
        {...formLayout2}
      >
        <Radio.Group
          onChange={e => changeInputNumber( e, 'removeZeroStock', drawSetting )}
          value={drawSetting.removeZeroStock}
        >
          <Radio value={false}>否</Radio>
          <Radio value>是</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem
        label="潮汐概率开启"
        {...formLayout2}
      >
        <Radio.Group
          onChange={e => changeInputNumber( e, 'enableTidal', drawSetting )}
          value={drawSetting.enableTidal || false}
        >
          <Radio value={false}>否</Radio>
          <Radio value>是</Radio>
        </Radio.Group>
      </FormItem>
      {
        drawSetting.enableTidal && (
          <>
            <div className={styles.tidalProbability}>
              时间段内，有
              <span>
                <InputNumber
                  value={drawSetting && drawSetting.tidalProbability}
                  min={0}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => {
              changeInputNumber( e, 'tidalProbability', drawSetting );
            }}
                />
              </span>%的概率参与活动正常，剩余概率将直接抽中谢谢参与。
            </div>
            { renderDateTimePeriod()}
          </>
        )
      }
    </div>
  );
}
export default LotterySettings;

import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, Radio, InputNumber, Collapse } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import UploadModal from '@/components/UploadModal/UploadModal';
import serviceObj from '@/services/serviceObj';
import PrizeTable from './PrizeTable';
import styles from './signElement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker
const { Panel } = Collapse

@connect()
@Form.create()
class TextElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {

    }
  }

  componentWillMount(){
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '签到组件',
      rule:'累计签到即可获得积分',
      signDays:'THREE',
      signType:'ACCUMULATIVE',
      rewardType: 'INTEGRAL',
      dailyRewardType: 'INTEGRAL',
      buttonBefore:`${serviceObj.defaultImagePath}DT_QD.png`,
      buttonAfter:`${serviceObj.defaultImagePath}DT_YQD.png`,
      finish:`${serviceObj.defaultImagePath}DT_ZT_YQD.png`,
      miss:`${serviceObj.defaultImagePath}DT_ZT_YCG.png`,
      unSign:`${serviceObj.defaultImagePath}DT_ZT_DQD.png`,
      lock:`${serviceObj.defaultImagePath}DT_ZT_DJS.png`,
      paddingLeft: 30,
      paddingRight: 30
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeInput = ( e, type ) => {
    let val
    if( e && !e.target ){
      val = e
    }else if( e && e.target ) {
      val = e.target.value
    }
    const { domData, changeDomData, eleObj } = this.props;
    if( type === 'rewardType' && val === 'PRIZE' ) {
      eleObj.rewardValue = '';
    } else if( type === 'rewardType' && val !== 'PRIZE' ) {
      eleObj.prizes = [];
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }

  renderSignImg = () => {
    const { eleObj } = this.props;
    return (
      <div>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>已签到</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.finish} onChange={( e ) => this.changeInput( e, 'finish' )} />
            <div className={styles.textStyle}>
              <div>图片尺寸比例建议1:1</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>已错过</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.miss} onChange={( e ) => this.changeInput( e, 'miss' )} />
            <div className={styles.textStyle}>
              <div>图片尺寸比例建议1:1</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>待签到</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.unSign} onChange={( e ) => this.changeInput( e, 'unSign' )} />
            <div className={styles.textStyle}>
              <div>图片尺寸比例建议1:1</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>待解锁</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.lock} onChange={( e ) => this.changeInput( e, 'lock' )} />
            <div className={styles.textStyle}>
              <div>图片尺寸比例建议1:1</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}>达标奖品图</span>}
          {...this.formLayout}
        >
          <div style={{ display: 'flex' }}>
            <UploadModal value={eleObj.prizeImg} onChange={( e ) => this.changeInput( e, 'prizeImg' )} />
            <div className={styles.textStyle}>
              <div>图片尺寸比例建议1:1</div>
              <div>图片大小建议不大于1M</div>
            </div>
          </div>
        </FormItem>
      </div>
    )
  }

  render() {
    const { domData = {}, changeDomData, eleObj } = this.props;
    return (
      <div>
        <div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>组件名称</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={( e ) => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>
          <div style={{ color: '#f5222d', marginLeft: 150, marginBottom: 20 }}>
            若配置未来版本且更新期数时，期数更新时将重置用户签到记录。
          </div>
          <FormItem
            label={<span className={styles.labelText}>签到有效时间</span>}
            {...this.formLayout}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={eleObj.startTime ? [moment( eleObj.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' )] : []}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={( e ) => this.changeDate( e )}
            />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}><span>*</span>签到规则文案</span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.rule}
              placeholder="请输入签到规则文案"
              onChange={( e ) => this.changeInput( e, 'rule' )}
              maxLength={30}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>可签到天数</span>}
            {...this.formLayout}
          >
            <Radio.Group onChange={( e ) => this.changeInput( e, 'signDays' )} value={eleObj.signDays} disabled={eleObj.id}>
              <Radio value='THREE'>3天</Radio>
              <Radio value='SEVEN'>7天</Radio>
              <Radio value='FOURTEEN'>14天</Radio>
              <Radio value='THIRTY'>30天</Radio>
            </Radio.Group>
            <span style={{ marginLeft: 30, color: '#f5222d' }}>*保存后，可签到天数将无法更改</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>签到类型</span>}
            {...this.formLayout}
          >
            <Radio.Group onChange={( e ) => this.changeInput( e, 'signType' )} value={eleObj.signType} disabled={eleObj.id}>
              <Radio value='ACCUMULATIVE'>累计签到</Radio>
              <Radio value='SEQUENCE'>连续签到</Radio>
            </Radio.Group>
            <span style={{ marginLeft: 30, color: '#f5222d' }}>*保存后，签到类型将无法更改</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>达标奖励</span>}
            {...this.formLayout}
          >
            <Radio.Group onChange={( e ) => this.changeInput( e, 'rewardType' )} value={eleObj.rewardType}>
              <Radio value='INTEGRAL'>积分</Radio>
              <Radio value='PRIZE'>奖品</Radio>
              <Radio value='LEFT_COUNT'>次数</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>达标签到奖励</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.rewardValue}
              placeholder="请输入签到天数达标所获得的奖励（分/次）"
              onChange={( e ) => this.changeInput( e, 'rewardValue' )}
              min={1}
              precision={0}
              style={{ width: '100%' }}
              disabled={eleObj.rewardType === 'PRIZE'}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>达标天数</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.reach}
              placeholder="请输入可获得奖励的签到达标天数，需≤可签到天数"
              onChange={( e ) => this.changeInput( e, 'reach' )}
              min={1}
              precision={0}
              style={{ width: '100%' }}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>每日奖励类型</span>}
            {...this.formLayout}
          >
            <Radio.Group onChange={( e ) => this.changeInput( e, 'dailyRewardType' )} value={eleObj.dailyRewardType}>
              <Radio value='INTEGRAL'>积分</Radio>
              <Radio value='LEFT_COUNT'>次数</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}>每日签到奖励</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.dailyRewardValue}
              placeholder="请输入每日签到奖励"
              onChange={( e ) => this.changeInput( e, 'dailyRewardValue' )}
              style={{ width: '100%' }}
              min={1}
              precision={0}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}>可完成次数</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.limit}
              placeholder="请输入可获得签到奖励的次数，不填默认不限"
              onChange={( e ) => this.changeInput( e, 'limit' )}
              style={{ width: '100%' }}
              min={1}
              precision={0}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>签到按钮图（签到前）</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.buttonBefore} onChange={( e ) => this.changeInput( e, 'buttonBefore' )} />
              <div className={styles.textStyle}>
                <div>图片尺寸建议180px * 70px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>签到按钮图（签到后）</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.buttonAfter} onChange={( e ) => this.changeInput( e, 'buttonAfter' )} />
              <div className={styles.textStyle}>
                <div>图片尺寸建议180px * 70px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
        </div>
        <div style={{ marginBottom: 20 }}>
          <Collapse defaultActiveKey='1'>
            <Panel header="签到状态图片设置" key="1">
              {this.renderSignImg()}
            </Panel>
          </Collapse>
        </div>
        <div hidden={eleObj.rewardType !== 'PRIZE'}>
          <PrizeTable
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
        <div>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
      </div>
    )
  }

}

export default TextElement;

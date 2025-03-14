/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Radio, Collapse, Select, Icon } from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import serviceObj from '@/services/serviceObj';
import PrizeTable from './PrizeTable';
import EligibilityModal from './EligibilityModal';
import styles from './inviteElement.less'

const FormItem = Form.Item;
const { Panel } = Collapse;
const InputGroup = Input.Group;
const { Option } = Select;
const { TextArea } = Input;



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


@connect()
@Form.create()
class RedRainElement extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      visibleBgColor: false
    }
  }

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '邀请组件',
      showType: 'DIRECT',
      drawButton:`${serviceObj.defaultImagePath}HBY_KST.png`,
      redPacket:`${serviceObj.defaultImagePath}HBY_HBT.png`,
      clickRed:`${serviceObj.defaultImagePath}HBY_DJT.png`,
      prizes: [
        {
          image: `${serviceObj.defaultImagePath}XXCY.png`,
          probability: 100,
        },
      ],
      task: {
        backRewardType: 'LEFT_COUNT',
        rewardType: 'LEFT_COUNT',
        attendType: 'DAILY'
      },
    }
    const newEleObj = Object.assign( eleObj, defaultObj );
    this.updateData( newEleObj )
  }

  changeInput = ( e, type, secondType ) => {
    const val = e && e.target ? e.target.value : e;
    const { eleObj } = this.props;
    let newEleObj = null;
    if( secondType ) {
      newEleObj = Object.assign( eleObj, { [secondType]: { ...eleObj[secondType], [type]: val } } );
    } else {
      newEleObj = Object.assign( eleObj, {  [type]: val } );
    }
    this.updateData( newEleObj )
  }

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const { eleObj } = this.props;
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const newEleObj = Object.assign( eleObj, obj );
    this.updateData( newEleObj )
  }

  changeColor = ( e, type ) => {
    const color = e.hex;
    const { eleObj } = this.props;
    const newEleObj = Object.assign( eleObj, { [type]: color } );
    this.updateData( newEleObj )
  }

  // 拾色板
  showBgColor = ( e ) => {
    e.stopPropagation()
    const { visibleBgColor } = this.state;
    this.setState( {
      visibleBgColor: !visibleBgColor
    } )
  }

  updateData = ( obj ) => {
    // 替换对应项
    const { domData, changeDomData } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newElementsList = elementsList.map( item => {
      return item.virtualId === obj.virtualId ? obj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    console.log( newDomData, 'newDomData' )
    changeDomData( newDomData );
    // eslint-disable-next-line react/no-unused-state
    this.setState( { time: new Date() } )
  }

  // 打开资格编辑弹框
  onChangeEligibilityModal= ( passive )=>{
    this.setState( {
      eligibilityModalVisible:true,
      passive
    } )
  }

  // 资格选择弹框关闭
  eligibilityModalCancel = ()=>{
    this.setState( {
      eligibilityModalVisible:false
    } )
  }

  // 资格选择确定
  eligibilityModalConfirm = ( data )=>{
    const { passive } = this.state;
    const { taskEventType, taskEventId, name }=data
    if( passive ) {
      this.changeInput( taskEventType, 'taskEventType', 'task' )
      this.changeInput( taskEventId, 'taskEventId', 'task' )
      this.changeInput( name, 'taskEventName', 'task' )
    } else {
      this.changeInput( taskEventType, 'inviterEventType' )
      this.changeInput( taskEventId, 'inviterEventId' )
      this.changeInput( name, 'inviterEventName' )
    }
    this.setState( {
      eligibilityModalVisible:false
    } )
  }

  // 任务设置
  renderTaskSetting = ( passive ) => {
    const { eleObj } = this.props;
    return (
      <Collapse defaultActiveKey={['1']} style={{ marginBottom: 20 }}>
        <Panel header={passive ? '被邀请人设置' : '邀请人设置'} key="1">
          { // 由于后端数据问题，部分数据在task中，部分在外层，难以做到统一，所以会看起来繁琐一点
            passive ?
              <FormItem label={<span className={styles.labelText}>被邀请人资格</span>} {...this.formLayout}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ background:'#f5f5f5', padding:'0 10px', borderRadius:'5px', width:'85%' }}>
                    {( eleObj.task && eleObj.task.taskEventId )? eleObj.task.taskEventName:'--'}
                  </div>
                  <Icon
                    type="edit"
                    style={{ fontSize:'18px', marginLeft:'10px', cursor:'pointer' }}
                    onClick={() => {
                    this.onChangeEligibilityModal( passive )
                  }}
                  />
                </div>
              </FormItem>
              :
              <FormItem label={<span className={styles.labelText}>邀请人资格</span>} {...this.formLayout}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ background:'#f5f5f5', padding:'0 10px', borderRadius:'5px', width:'85%' }}>
                    {( eleObj && eleObj.inviterEventId )? eleObj.inviterEventName:'--'}
                  </div>
                  <Icon
                    type="edit"
                    style={{ fontSize:'18px', marginLeft:'10px', cursor:'pointer' }}
                    onClick={() => {
                    this.onChangeEligibilityModal( passive )
                  }}
                  />
                </div>
              </FormItem>
          }

          <div style={{ color: "#dc172a", fontSize: 12, marginLeft: '10%', marginBottom: 20 }}>
            {passive ? '当用户不符合被邀请人资格时，填写框置灰且该用户点击填写框/确定时候弹出不符合被邀请资格提示toast' :
            '当用户不符合邀请人资格时，该用户的邀请码加密展示且当该用户点击复制时弹出不符合邀请资格提示toast'}
          </div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>{passive ? '被邀请人奖励类型' : '邀请人奖励类型'}</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, passive ? 'backRewardType' : 'rewardType', 'task' )}
              value={eleObj.task && eleObj.task[passive ? 'backRewardType' : 'rewardType']}
            >
              <Radio key="LEFT_COUNT" value='LEFT_COUNT'>参与次数</Radio>
              <Radio key='INTEGRAL' value='INTEGRAL'>积分</Radio>
              <Radio key='PRIZE' value='PRIZE'>奖品</Radio>
            </Radio.Group>
          </FormItem>

          {
            eleObj.task[passive ? 'backRewardType' : 'rewardType'] !== 'PRIZE' &&
            <FormItem label={<span className={styles.labelText}>{passive ? '' : ( <span>*</span> )}任务奖励</span>} {...this.formLayout}>
              <InputNumber
                value={( eleObj.task && eleObj.task[passive ?  'backRewardCount' : 'rewardValue'] ) ? eleObj.task[passive ?  'backRewardCount' : 'rewardValue'] : ''}
                placeholder="请输入任务奖励"
                min={0}
                formatter={limitDecimals}
                parser={limitDecimals}
                onChange={( e ) => this.changeInput( e, passive ?  'backRewardCount' : 'rewardValue', 'task' )}
                style={{ width: '85%' }}
              />
              <span style={{ paddingLeft: '10px' }}>
                {eleObj.task[passive ? 'backRewardType' : 'rewardType'] === 'LEFT_COUNT' ? '次' : '分'}
              </span>

            </FormItem>
          }

          <div
            hidden={eleObj.task[passive ? 'backRewardType' : 'rewardType'] === 'PRIZE'}
            style={{ color: "#dc172a", fontSize: 12, marginLeft: '10%', marginBottom: 20 }}
          >
            {passive ? '每个被邀请人固定仅可被邀请一次，绑定邀请码后无法更改' :
            ''}
          </div>
          {
            !passive &&
            <FormItem label={<span className={styles.labelText}><span>*</span>任务上限</span>} {...this.formLayout}>
              <InputGroup compact>
                <InputNumber
                  value={( eleObj.task && eleObj.task.attendLimit ) ? eleObj.task.attendLimit : ''}
                  placeholder="请输入任务上限"
                  min={0}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={( e ) => this.changeInput( e, 'attendLimit', 'task' )}
                  style={{ width: '75%' }}
                />
                <Select
                  style={{ width: 100 }}
                  value={( eleObj.task&&eleObj.task.attendType )?eleObj.task.attendType:''}
                  onChange={( val ) => this.changeInput( val, 'attendType', 'task' )}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  <Option value="DAILY">次(每日)</Option>
                  <Option value="DURING">次</Option>
                </Select>
              </InputGroup>
            </FormItem>
          }
          {
            <FormItem
              label={<span className={styles.labelText}>{passive ? '被邀请成功提醒' : '邀请成功提醒'}</span>}
              {...this.formLayout}
            >
              <TextArea
                onChange={( e ) => this.changeInput( e, passive?'backTip':'tip', 'task' )}
                // value={( eleObj.task&&eleObj.task.backTip )?eleObj.task.backTip:''}
                value={passive ? eleObj?.task?.backTip : eleObj?.task?.tip}
                autoSize={{ minRows: 2, maxRows: 5 }}
                placeholder={passive ? '请输入被邀请成功提醒' : '请输入邀请成功提醒'}
              />
            </FormItem>
          }
          <FormItem
            label={<span className={styles.labelText}>不符合{passive ? '被' : ''}邀请资格提示</span>}
            {...this.formLayout}
          >
            <TextArea
              onChange={( e ) => this.changeInput( e, passive ? 'unqualifiedInviteeTip' : 'unqualifiedInviterTip' )}
              value={eleObj && eleObj[passive ? 'unqualifiedInviteeTip' : 'unqualifiedInviterTip']}
              autoSize={{ minRows: 2, maxRows: 5 }}
              placeholder={`请输入不符合${passive ? '被' : ''}邀请资格提示`}
            />
          </FormItem>
        </Panel>
      </Collapse>
    )
  }

  render() {
    const { visibleBgColor, eligibilityModalVisible, passive } = this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <div>
          <div onClick={this.showBgColor} className={styles.cover} hidden={!( visibleBgColor )} />
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

          <FormItem
            label={<span className={styles.labelText}><span>*</span>展示类型</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'showType' )}
              value={eleObj.showType}
            >
              <Radio value='DIRECT'>直接展示</Radio>
              <Radio value='POP_WINDOWS'>弹窗展示</Radio>
            </Radio.Group>
          </FormItem>
          {
            eleObj.showType === 'POP_WINDOWS' &&
            <div>
              <div style={{ color: "#dc172a", fontSize: 12, marginLeft: '10%', marginBottom: 20 }}>展示形式为弹窗时，若和其他任务放在一起，建议配置任务图标和任务描述</div>
              <FormItem
                label={<span className={styles.labelText}><span>*</span>去完成按钮</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex' }}>
                  <UploadModal value={eleObj.goButton} onChange={( e ) => this.changeInput( e, 'goButton' )} />
                  <div
                    style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
                  >
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>
              <FormItem
                label={<span className={styles.labelText}>任务图标</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex' }}>
                  <UploadModal value={eleObj.image} onChange={( e ) => this.changeInput( e, 'image' )} />
                  <div
                    style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
                  >
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>
              <FormItem
                label={<span className={styles.labelText}>任务描述</span>}
                {...this.formLayout}
              >
                <TextArea
                  onChange={( e ) => this.changeInput( e, 'description', 'task' )}
                  value={eleObj.task && eleObj.task.description}
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
              </FormItem>
            </div>
          }
          <FormItem
            label={<span className={styles.labelText}><span>*</span>{eleObj.showType ? '邀请背景图' : '弹窗背景图'}</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.inviteBackgroundImage} onChange={( e ) => this.changeInput( e, 'inviteBackgroundImage' )} />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <div style={{ color: "#dc172a", fontSize: 12, marginLeft: '10%', marginBottom: 20 }}>背景图需严格参考范例图在同样的位置流出邀请码框、复制&确定按钮以及邀请按钮</div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>复制按钮</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.copyButton} onChange={( e ) => this.changeInput( e, 'copyButton' )} />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>确定按钮</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.confirmButton} onChange={( e ) => this.changeInput( e, 'confirmButton' )} />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>邀请按钮</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.inviteButton} onChange={( e ) => this.changeInput( e, 'inviteButton' )} />
              <div
                style={
                  {
                    width: '180px',
                    fontSize: 13,
                    color: '#999',
                    lineHeight: 2,
                    marginTop: 10,
                    marginLeft: 10,
                  }
                }
              >
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label="邀请码框色值"
            {...this.formLayout}
          >
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor( e ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.inviteFrameColor, width: 116, height: '22px' }} />
            </span>

            {
            visibleBgColor &&
            <div style={{ position: 'absolute', bottom: -60, left: 200, zIndex: 999 }}>
              <SketchPicker
                width="230px"
                disableAlpha
                color={eleObj.inviteFrameColor}
                onChange={( e ) => {this.changeColor( e, 'inviteFrameColor' )}}
              />
            </div>
          }
          </FormItem>
        </div>
        {
          this.renderTaskSetting( false )
        }
        {
          this.renderTaskSetting( true )
        }
        <div hidden={eleObj.task.rewardType !== 'PRIZE'}>
          <PrizeTable
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            title="邀请人奖品配置"
          />
        </div>
        <div hidden={eleObj.task.backRewardType !== 'PRIZE'}>
          <PrizeTable
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            title="被邀请人奖品配置"
            configPrizeKey='inviteePrizes'
          />
        </div>
        {eligibilityModalVisible&&
          <EligibilityModal
            eleObj={eleObj}
            modalVisible={eligibilityModalVisible}
            eligibilityModalConfirm={this.eligibilityModalConfirm}
            eligibilityModalCancel={this.eligibilityModalCancel}
            taskEventType={passive ? eleObj.task.taskEventType : eleObj.inviterEventType}
            taskEventId={passive ? eleObj.task.taskEventId : eleObj.inviterEventId}
          />
        }
        <div style={{ marginTop: '30px' }}>
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

export default RedRainElement;

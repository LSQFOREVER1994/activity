/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, Radio, InputNumber, Select, DatePicker, Collapse, Alert } from 'antd';
import { connect } from 'dva';
import { SketchPicker } from 'react-color';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import serviceObj from '@/services/serviceObj';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import styles from './answerElement.less';

const FormItem = Form.Item;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;


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

@connect( ( { bees } ) => {
  return {
    searchTagListMap: bees.searchTagListMap,
  }
} )
@Form.create()
class AnswerElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      resultBackgroundVisible: false,
      buttonColorVisible: false
    }
  }


  componentWillMount() {
    this.initElmentData()
    this.searchTagList()
  }


  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '答题组件',
      showLeftCount: true,
      startButton: `${serviceObj.defaultImagePath}DT_KS.png`,
      buttonWidth: 400,
      buttonHeight: 130,
      banner: `${serviceObj.defaultImagePath}DT_BANNER.png`,
      resultBackground: '#f4debd',
      buttonColor: '#BB8B46',
      rewardType: 'INTEGRAL', // LEFT_COUNT
      hasNoChangeTip:'答题次数已达上限，明天再来吧',
      hasChangeTip:'快去完成下方任务，获得抽奖机会吧',
      passContext:'太棒了，您已获得奖励',
      unPassContext:'很遗憾，未达成奖励条件'
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

  // 获取标签
  searchTagList = ( searchContent ) => {
    const { dispatch } = this.props;
    if ( this.timer ) clearTimeout( this.timer )
    this.timer = setTimeout( () => {
      dispatch( {
        type: 'bees/SearchTagList',
        payload: {
          query: {
            pageNum: 1,
            pageSize: 10,
            name: searchContent,
            enable: true
          },
        },
      } );
    }, searchContent ? 500 : 0 );
  }

  changeInput = ( e, type ) => {

    const val = e && e.target ? e.target.value : e;
    if ( type === 'score' || type === 'count' || type === 'passAnswerNumber' ) {
      if ( ( val < 0 || typeof val !== 'number' ) && val !== '' ) return
    }
    const { domData, changeDomData, eleObj } = this.props;
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

  changeValue = ( e, type, citem ) => {
    const { domData, changeDomData, eleObj, searchTagListMap } = this.props;
    let obj = {};
    if ( citem ) {
      obj = { [type]: e, tag: { name: citem.props.children, id: citem.props.value }, count: null }
      this.setState( {
        selectTag: searchTagListMap.find( item => item.id === e )
      } )
    } else {
      obj = { [type]: e && e.hex ? e.hex : e }
    }
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

  // 拾色板
  showBgColor = ( e, type ) => {
    e.stopPropagation()
    const visibleType = `${type}Visible`
    this.setState( {
      [visibleType]: !this.state[visibleType]
    } )
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
    this.setState( {
      time: new Date()
    } )
  }

  // 跳转题库管理
  onJumpPrize = () => {
    window.open( window.location.href.replace( /bees/, 'questionBank' ) )
  }

  hiddenColorModal = () => {
    this.setState( {
      resultBackgroundVisible: false,
      buttonColorVisible: false,
    } )
  }

  getAnswerCount = () => {
    // 编辑时放入count
    const { searchTagListMap, eleObj } = this.props
    if ( eleObj.tag && eleObj.tag.id ) {
      const selectTag = searchTagListMap.find( item => item.id === eleObj.tag.id )
      console.log( selectTag );
      this.setState( {
        selectTag
      } )
      return ( selectTag && selectTag.count ) || 0
    }
    return 0
  }

  render() {
    const { resultBackgroundVisible, buttonColorVisible, selectTag } = this.state
    const { domData = {}, changeDomData, eleObj = {}, searchTagListMap } = this.props;
    const newSearchMap = Object.assign( [], searchTagListMap )
    if ( eleObj.tag && !searchTagListMap.find( item => ( item.id === eleObj.tag.id ) ) ) {
      newSearchMap.push( eleObj.tag )
    }
    return (
      <div>
        <div>
          <div onClick={this.hiddenColorModal} className={styles.cover} hidden={!( resultBackgroundVisible || buttonColorVisible )} />
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
            label={<span className={styles.labelText}>答题有效时间</span>}
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
            label={<span className={styles.labelText}><span>*</span>参与次数展示</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'showLeftCount' )}
              value={eleObj.showLeftCount}
            >
              <Radio value>展示</Radio>
              <Radio value={false}>不展示</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label='每次答题时间(秒)'
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.answerTime}
              placeholder="可设置答题时间，不填则不限制答题时间"
              onChange={( e ) => this.changeInput( e, 'answerTime' )}
              formatter={limitDecimals}
              style={{ width: '100%' }}
              min={0}
              precision={0}
            />
          </FormItem>

          <FormItem label={<span className={styles.labelText}><span>*</span>开始答题按钮图</span>} {...this.formLayout}>
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.startButton} onChange={( e ) => this.changeValue( e, 'startButton' )} />
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
                <div>图片尺寸建议400px * 130px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>

          <FormItem label='图片宽' {...this.formLayout}>
            <InputNumber
              value={eleObj.buttonWidth}
              placeholder="请输入图片宽"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'buttonWidth' )}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>px</span>
          </FormItem>

          <FormItem label='图片高' {...this.formLayout}>
            <InputNumber
              value={eleObj.buttonHeight}
              placeholder="请输入图片高"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'buttonHeight' )}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>px</span>
          </FormItem>

          <FormItem label="答题页/结果页banner图" {...this.formLayout}>
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.banner} onChange={( e ) => this.changeValue( e, 'banner' )} />
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
                <div>图片尺寸建议750px * 320px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>

          <FormItem label="答题页/结果页背景色" {...this.formLayout}>
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor( e, 'resultBackground' ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.resultBackground, width: 116, height: '22px' }} />
            </span>

            {
              resultBackgroundVisible &&
              <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.resultBackground}
                  onChange={( e ) => { this.changeValue( e, 'resultBackground' ) }}
                />
              </div>
            }
            <span style={{ marginLeft: 10 }}>
              *设置答题/结果页面背景色，填充页面除Banner、题目外的背景区域;题目区域为白色，建议设置深色色值
            </span>
          </FormItem>
          <FormItem label="答题页/结果页按钮色" {...this.formLayout}>
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor( e, 'buttonColor' ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.buttonColor, width: 116, height: '22px' }} />
            </span>

            {
              buttonColorVisible &&
              <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.buttonColor}
                  onChange={( e ) => { this.changeValue( e, 'buttonColor' ) }}
                />
              </div>
            }
            <span style={{ marginLeft: 10 }}>
              *设置确定、上一题、下一题、提交、结果页按钮色值，文字固定白色，建议设置深色色值
            </span>
          </FormItem>
          <div style={{ fontWeight: 500, marginBottom: '10px' }}>无答题机会且任务全部完成</div>
          <FormItem
            label={<span className={styles.labelText}>弹窗文案展示</span>}
            {...this.formLayout}
          >
            <TextArea
              rows={2}
              value={eleObj.hasNoChangeTip}
              placeholder="请输入弹框文案"
              onChange={( e ) => this.changeInput( e, 'hasNoChangeTip' )}
            />
          </FormItem>
          <div style={{ fontWeight: 500, marginBottom: '10px' }}>无答题机会且任务未全部完成</div>
          <FormItem
            label={<span className={styles.labelText}>弹窗文案展示</span>}
            {...this.formLayout}
          >
            <TextArea
              rows={2}
              value={eleObj.hasChangeTip}
              placeholder="请输入弹框文案"
              onChange={( e ) => this.changeInput( e, 'hasChangeTip' )}
            />
          </FormItem>
          <Collapse defaultActiveKey='1' style={{ marginBottom: 20 }}>
            <Panel header="答题题目配置" key="1">

              <FormItem
                label={<span className={styles.labelText}><span>*</span>奖品类型</span>}
                {...this.formLayout}
              >
                <Radio.Group
                  onChange={( e ) => this.changeInput( e, 'rewardType' )}
                  value={eleObj.rewardType}
                >
                  <Radio value='INTEGRAL'>积分</Radio>
                  <Radio value='LEFT_COUNT'>次数</Radio>
                </Radio.Group>
              </FormItem>
              {eleObj.rewardType && eleObj.rewardType === 'INTEGRAL' &&
                <FormItem
                  label={<span className={styles.labelText}><span>*</span>答对增加分值</span>}
                  {...this.formLayout}
                >
                  <InputNumber
                    value={eleObj.score}
                    placeholder="设置获取分值"
                    onChange={( e ) => this.changeInput( e, 'score' )}
                    formatter={limitDecimals}
                    style={{ width: '100%' }}
                  />
                </FormItem>
              }
              {eleObj.rewardType && eleObj.rewardType === 'LEFT_COUNT' &&
                <div>
                  <FormItem
                    label={<span className={styles.labelText}>奖励次数</span>}
                    {...this.formLayout}
                  >
                    <InputNumber
                      value={eleObj.rewardCount}
                      placeholder="请输入奖励次数"
                      onChange={( e ) => this.changeInput( e, 'rewardCount' )}
                      formatter={limitDecimals}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                  <FormItem
                    label={<span className={styles.labelText}><span>*</span>达标题数</span>}
                    {...this.formLayout}
                  >
                    <InputNumber
                      value={eleObj.passAnswerNumber}
                      placeholder="请输入达标题数"
                      onChange={( e ) => this.changeInput( e, 'passAnswerNumber' )}
                      formatter={limitDecimals}
                      style={{ width: '100%' }}
                    />
                  </FormItem>
                  <FormItem
                    label={<span className={styles.labelText}>达标文案</span>}
                    {...this.formLayout}
                  >
                    <Input
                      value={eleObj.passContext}
                      placeholder="请输入达标文案"
                      onChange={( e ) => this.changeInput( e, 'passContext' )}
                      maxLength={20}
                    />
                  </FormItem>
                  <FormItem
                    label={<span className={styles.labelText}>未达标文案</span>}
                    {...this.formLayout}
                  >
                    <Input
                      value={eleObj.unPassContext}
                      placeholder="请输入未达标文案"
                      onChange={( e ) => this.changeInput( e, 'unPassContext' )}
                      maxLength={20}
                    />
                  </FormItem>
                  <FormItem
                    label={<span className={styles.labelText}>跳转按钮文案</span>}
                    {...this.formLayout}
                  >
                    <Input
                      value={eleObj.jumpButtonContext}
                      placeholder="请输入跳转按钮文案"
                      onChange={( e ) => this.changeInput( e, 'jumpButtonContext' )}
                      maxLength={20}
                    />
                  </FormItem>
                  <FormItem
                    label={<span className={styles.labelText}> 跳转链接  </span>}
                    {...this.formLayout}
                  >
                    <Input
                      value={eleObj.jumpLink}
                      placeholder="请输入跳转链接"
                      onChange={( e ) => this.changeInput( e, 'jumpLink' )}
                    />
                  </FormItem>
                </div>
              }
              <Alert
                style={{ margin: '0 12% 20px 10%' }}
                type="warning"
                showIcon
                message={(
                  <div style={{ fontSize: 12, width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span>添加题目前需先配置题库，已配置请忽略。</span>
                    <span onClick={() => { this.onJumpPrize() }} style={{ color: '#1890FF', cursor: 'pointer' }}>题库管理</span>
                  </div> )}
              />
              <FormItem
                label={<span className={styles.labelText}><span>*</span>选择标签</span>}
                {...this.formLayout}
              >
                <Select
                  style={{ width: '100%' }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  showSearch
                  onSearch={this.searchTagList}
                  filterOption={false}
                  onChange={( e, item ) => this.changeValue( e, 'tagId', item )}
                  value={eleObj.tag ? eleObj.tag.id : ''}
                  onFocus={this.searchTagList}
                >
                  {
                    searchTagListMap.map( item => {
                      return <Option value={item.id} key={item.id}>{item.name}</Option>
                    } )
                  }
                </Select>
              </FormItem>
              <FormItem
                label={<span className={styles.labelText}><span>*</span>题目数量</span>}
                {...this.formLayout}
              >
                <InputNumber
                  value={selectTag && selectTag.count ? eleObj.count : this.getAnswerCount()}
                  formatter={limitDecimals}
                  placeholder="请输入题目数量"
                  onChange={( e ) => this.changeInput( e, 'count' )}
                  style={{ width: '100%' }}
                  max={( selectTag && selectTag.count ) || 0}
                />
                *题目将随机展示，该标签下的题目数量是：{( selectTag && selectTag.count ) || 0}
              </FormItem>
              <FormItem
                label={<span className={styles.labelText}>关联活动id</span>}
                {...this.formLayout}
              >
                <Input
                  value={eleObj.relationId}
                  placeholder="请输入关联活动id"
                  onChange={( e ) => this.changeInput( e, 'relationId' )}
                />
              </FormItem>

            </Panel>
          </Collapse>
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

export default AnswerElement;

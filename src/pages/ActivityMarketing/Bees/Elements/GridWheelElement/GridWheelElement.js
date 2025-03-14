/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, InputNumber, Radio } from 'antd';
import { connect } from 'dva';
// import { SketchPicker } from 'react-color';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import serviceObj from '@/services/serviceObj';
import styles from './gridWheelElement.less'

const FormItem = Form.Item;
const { TextArea } = Input;
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


@connect()
@Form.create()
class GridWheelElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      textColorVisible: false
    }
  }

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id )||( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '九宫格组件',
      showLeftCount: true,
      showAttendUser: true,
      drawImage: `${serviceObj.defaultImagePath}JGG_CJT.gif`,
      hasNoChangeTip: '活动次数已达上限，下次再来吧',
      hasChangeTip: '快去完成任务，获得抽奖机会吧',
      prizes: [
        {
          image: `${serviceObj.defaultImagePath}XXCY.png`,
          itemName: "谢谢参与",
          itemPosition: '1,3,5,7',
          probability: 50,
        },
        {
          image: `${serviceObj.defaultImagePath}HBY_HBT.png`,
          itemName: "现金红包",
          itemPosition: '2,4,6,8',
          probability: 50,
        },
      ],
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
    const val = e.target.value
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

  changeValue = ( e, type ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: e } );
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

  changeColor = ( e, type ) => {
    const color = e.hex;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { [type]: color } );
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
  showBgColor = ( e ) => {
    e.stopPropagation()
    const { textColorVisible } = this.state;
    this.setState( {
      textColorVisible: !textColorVisible
    } )
  }

  render() {
    const { textColorVisible } = this.state
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <div>
          <div onClick={this.showBgColor} className={styles.cover} hidden={!( textColorVisible )} />
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
            label={<span className={styles.labelText}>九宫格有效时间</span>}
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
          {/* <FormItem
            label={<span className={styles.labelText}><span>*</span>初始化次数</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.initCount}
              placeholder="请输入初始化次数"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'initCount' )}
              style={{ width:'85%' }}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>每日免费次数</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.dailyCount}
              placeholder="请输入每日免费次数"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'dailyCount' )}
              style={{ width:'85%' }}
            />
          </FormItem> */}
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
            label={<span className={styles.labelText}><span>*</span>参与人数展示</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'showAttendUser' )}
              value={eleObj.showAttendUser}
            >
              <Radio value>展示</Radio>
              <Radio value={false}>不展示</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label='活动虚拟参与人数' {...this.formLayout}>
            <InputNumber
              value={eleObj.baseAttendUser}
              placeholder="请输入活动虚拟参与人数"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.changeValue( e, 'baseAttendUser' )}
              style={{ width: '85%' }}
            />
          </FormItem>
          {/* <FormItem
            label="次数/人数文字颜色"
            {...this.formLayout}
          >
            <span
              style={{ display: 'inline-block', width: 136, padding: '10px', height: '42px', lineHeight: 0, border: '1px solid #f5f5f5', cursor: 'pointer' }}
              onClick={( e ) => { this.showBgColor(  e, 'textColor' ) }}
            >
              <span style={{ display: 'inline-block', background: eleObj.textColor, width: 116, height: '22px' }} />
            </span>

            {textColorVisible &&
              <div style={{ position: 'absolute', bottom: -260, left: 200, zIndex: 999 }}>
                <SketchPicker
                  width="230px"
                  disableAlpha
                  color={eleObj.textColor}
                  onChange={( e ) => { this.changeColor( e, 'textColor' )}}
                />
              </div>
                }
          </FormItem> */}
          {/* <FormItem
            label="九宫格背景图"
            {...this.formLayout}
          >
            <UploadModal value={eleObj.gridBackgroundImage} onChange={( e ) => this.changeValue( e, 'gridBackgroundImage' )} />
            <div
              style={
              {
                position: 'absolute',
                top: 0, left: '125px',
                width: '180px',
                fontSize: 13,
                color: '#999',
                lineHeight: 2,
                marginTop: '10px'
              }
            }
            >
              <div>图片尺寸比例建议1:1 </div>
              <div>图片大小建议不大于1M</div>
            </div>
          </FormItem> */}
          <FormItem
            label={<span className={styles.labelText}><span>*</span>抽奖按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.drawImage} onChange={( e ) => this.changeValue( e, 'drawImage' )} />
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
                <div>图片尺寸比例建议1:1 </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <div style={{ fontWeight: 500, marginBottom: '10px' }}>无抽奖机会且任务全部完成</div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>弹窗文案展示</span>}
            {...this.formLayout}
          >
            <TextArea
              rows={2}
              value={eleObj.hasNoChangeTip}
              placeholder="请输入弹框文案"
              onChange={( e ) => this.changeInput( e, 'hasNoChangeTip' )}
            />
          </FormItem>
          <div style={{ fontWeight: 500, marginBottom: '10px' }}>无抽奖机会且任务未全部完成</div>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>弹窗文案展示</span>}
            {...this.formLayout}
          >
            <TextArea
              rows={2}
              value={eleObj.hasChangeTip}
              placeholder="请输入弹框文案"
              onChange={( e ) => this.changeInput( e, 'hasChangeTip' )}
            />
          </FormItem>
        </div>
        <div>
          <PrizeOptionSecondEdition
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            tableWithPosition={8}
            maxPrizeNum={8}
            descriptionText=" *此组件必须配置8个奖品。 第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。 每一列抽奖概率总和需为100%。"
          />
        </div>
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

export default GridWheelElement;

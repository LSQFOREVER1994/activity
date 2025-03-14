/* eslint-disable react/no-unused-state */
/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, InputNumber, Radio } from 'antd';
import { connect } from 'dva';
// import { SketchPicker } from 'react-color';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import serviceObj from '@/services/serviceObj';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import styles from './blindBoxElement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const limitDecimals = value => {
  // eslint-disable-next-line no-useless-escape
  const reg = /^(\-)*(\d+).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2' ) : '';
  }
  if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2' ) : '';
  }
  return '';
};

@connect()
@Form.create()
class GridWheelElement extends PureComponent {
  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      textColorVisible: false,
    };
  }

  componentWillMount() {
    this.initElmentData();
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const { domData, changeDomData, eleObj } = this.props;
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return;
    // 塞入默认值
    const defaultObj = {
      name: '盲盒组件',
      boxBefore: `${serviceObj.defaultImagePath}MH_KQQ.gif`,
      boxAfter: `${serviceObj.defaultImagePath}MH_KQH.gif`,
      buttonBefore: `${serviceObj.defaultImagePath}MH_KQ1.png`,
      buttonAfter: `${serviceObj.defaultImagePath}MH_KQ2.png`,
      buttonWidth: 400,
      buttonHeight: 90,
      paddingLeft: 30,
      paddingRight: 30,
      showLeftCount: true,
      showLeftCountType: 'TEXT',
      hasChangeTip: '快去完成任务，获取抽奖机会吧。',
      hasNoChangeTip: '活动次数已达上限，下次再来吧。',
    };
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  };

  changeInput = ( e, type ) => {
    const val = e.target.value;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign( eleObj, { [type]: val } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  };

  changeValue = ( e, type ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign( eleObj, { [type]: e } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  };

  changeDate = e => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const { domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  };

  changeColor = ( e, type ) => {
    const color = e.hex;
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    const newEleObj = Object.assign( eleObj, { [type]: color } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  };

  // 拾色板
  showBgColor = e => {
    e.stopPropagation();
    const { textColorVisible } = this.state;
    this.setState( {
      textColorVisible: !textColorVisible,
    } );
  };

  render() {
    const { textColorVisible } = this.state;
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    return (
      <div>
        <div>
          <div onClick={this.showBgColor} className={styles.cover} hidden={!textColorVisible} />
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>组件名称
              </span>
            }
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={e => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}>盲盒有效时间</span>}
            {...this.formLayout}
          >
            <RangePicker
              style={{ width: '100%' }}
              showTime
              value={
                eleObj.startTime
                  ? [
                      moment( eleObj.startTime, 'YYYY-MM-DD HH:mm:ss' ),
                      moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' ),
                    ]
                  : []
              }
              format="YYYY-MM-DD HH:mm:ss"
              onChange={e => this.changeDate( e )}
            />
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>参与次数展示
              </span>
            }
            {...this.formLayout}
          >
            <Radio.Group
              value={eleObj.showLeftCount}
              onChange={e => this.changeInput( e, 'showLeftCount' )}
            >
              <Radio value>展示</Radio>
              <Radio value={false}>不展示</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>展示方式
              </span>
            }
            {...this.formLayout}
          >
            <Radio.Group
              value={eleObj.showLeftCountType}
              onChange={e => this.changeInput( e, 'showLeftCountType' )}
            >
              <Radio value="TEXT">文字</Radio>
              <Radio value="CORNER_MARK">角标</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}>开启前盲盒样式图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.boxBefore}
                onChange={e => this.changeValue( e, 'boxBefore' )}
              />
              <div
                style={{
                  width: '180px',
                  fontSize: 13,
                  color: '#999',
                  lineHeight: 2,
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                <div>图片宽度建议750px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}>开启后盲盒样式图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.boxAfter}
                onChange={e => this.changeValue( e, 'boxAfter' )}
              />
              <div
                style={{
                  width: '180px',
                  fontSize: 13,
                  color: '#999',
                  lineHeight: 2,
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                <div>图片宽度建议750px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>开启按钮点亮图
              </span>
            }
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.buttonBefore}
                onChange={e => this.changeValue( e, 'buttonBefore' )}
              />
              <div
                style={{
                  width: '180px',
                  fontSize: 13,
                  color: '#999',
                  lineHeight: 2,
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                <div>图片尺寸建议400px * 90px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={
              <span className={styles.labelText}>
                <span>*</span>开启按钮置灰图
              </span>
            }
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.buttonAfter}
                onChange={e => this.changeValue( e, 'buttonAfter' )}
              />
              <div
                style={{
                  width: '180px',
                  fontSize: 13,
                  color: '#999',
                  lineHeight: 2,
                  marginTop: 10,
                  marginLeft: 10,
                }}
              >
                <div>图片尺寸建议400px * 90px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}>开始按钮图片宽</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.buttonWidth}
              placeholder="请输入"
              min={0}
              max={750}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={e => this.changeValue( e, 'buttonWidth' )}
              style={{ width: '20%' }}
            />{' '}
            px
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}>开始按钮图片高</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.buttonHeight}
              placeholder="请输入"
              min={0}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={e => this.changeValue( e, 'buttonHeight' )}
              style={{ width: '20%' }}
            />{' '}
            px
          </FormItem>
          <div>
            <div>无抽奖机会且任务全部完成</div>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>弹窗文案展示
                </span>
              }
              {...this.formLayout}
            >
              <TextArea
                onChange={e => this.changeInput( e, 'hasNoChangeTip' )}
                value={eleObj.hasNoChangeTip}
              />
            </FormItem>
          </div>

          <div>
            <div>无抽奖机会且任务未全部完成</div>
            <FormItem
              label={
                <span className={styles.labelText}>
                  <span>*</span>弹窗文案展示
                </span>
              }
              {...this.formLayout}
            >
              <TextArea
                onChange={e => this.changeInput( e, 'hasChangeTip' )}
                value={eleObj.hasChangeTip}
              />
            </FormItem>
          </div>
        </div>
        <div>
          <PrizeOptionSecondEdition domData={domData} changeDomData={changeDomData} eleObj={eleObj} />
        </div>
        <div style={{ marginTop: '30px' }}>
          <AdvancedSettings domData={domData} changeDomData={changeDomData} eleObj={eleObj} />
        </div>
      </div>
    );
  }
}

export default GridWheelElement;

/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, Radio, InputNumber, Collapse } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import serviceObj from '@/services/serviceObj';
import UploadModal from '@/components/UploadModal/UploadModal';
import SingleLatticeImg from './SingleLatticeImg';
import LatticePrize from './LatticePrize';
import Advertisement from './Advertisement';
import AdvancedSettings from '../../Edit/AdvancedSettings';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import styles from './monopolyElement.less'

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Panel } = Collapse

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

const startImg = `${serviceObj.defaultImagePath}licaijie/startPoint.png`;
const endImg = `${serviceObj.defaultImagePath}licaijie/endPoint.png`;
const meImg = `${serviceObj.defaultImagePath}licaijie/doll.png`;
const bgImg = `${serviceObj.defaultImagePath}licaijie/bg.png`;


@connect()
@Form.create()
class MonopolyElement extends PureComponent {
    formLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };

    componentWillMount() {
        this.initElmentData()
    }

    // 组件基础信息初始化
    initElmentData = () => {
        const { domData, changeDomData, eleObj } = this.props
        // 编辑和新增状态的编辑都不走此流程
        if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return
        // 塞入默认值
        const defaultObj = {
            name: '理财街组件',
            single: true,
            startPoint: startImg,
            endPoint: endImg,
            doll: meImg,
            height: 850,
            backgroundImage: bgImg,
            goAlongType: 'RANDOM_DICE',
            isLoop: false,
            maxStep: 6,
            resetType: 'NEVER'
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
    }

    render() {
        const { domData = {}, changeDomData, eleObj = {} } = this.props;

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

              <FormItem
                label={<span className={styles.labelText}><span>*</span>组件有效时间</span>}
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
                label={<span className={styles.labelText}><span>*</span>起点图标</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex' }}>
                  <UploadModal value={eleObj.startPoint} onChange={( e ) => this.changeValue( e, 'startPoint' )} />
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
                    <div>图片尺寸比例建议1:1 </div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>

              <FormItem
                label={<span className={styles.labelText}><span>*</span>终点图标</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex' }}>
                  <UploadModal value={eleObj.endPoint} onChange={( e ) => this.changeValue( e, 'endPoint' )} />
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
                    <div>图片尺寸比例建议1:1 </div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>

              <FormItem
                label={<span className={styles.labelText}><span>*</span>小人图标</span>}
                {...this.formLayout}
              >
                <div style={{ display: 'flex' }}>
                  <UploadModal value={eleObj.doll} onChange={( e ) => this.changeValue( e, 'doll' )} />
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
                    <div>图片尺寸比例建议1:1 </div>
                    <div>图片大小建议不大于1M</div>
                  </div>
                </div>
              </FormItem>

              <FormItem
                label={<span className={styles.labelText}><span>*</span>是否单格发奖</span>}
                {...this.formLayout}
              >
                <Radio.Group
                  onChange={( e ) => this.changeInput( e, 'single' )}
                  value={eleObj.single}
                >
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </FormItem>

              <FormItem
                label={<span className={styles.labelText}><span>*</span>前进方式</span>}
                {...this.formLayout}
              >
                <Radio.Group
                  onChange={e => this.changeInput( e, 'goAlongType' )}
                  value={eleObj.goAlongType}
                >
                  <Radio value="LEFT_COUNT">前进次数</Radio>
                  <Radio value="RANDOM_DICE">随机骰子</Radio>
                </Radio.Group>
              </FormItem>

              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>一次前进最大步数
                  </span>
                        }
                {...this.formLayout}
              >
                <InputNumber
                  value={eleObj.maxStep}
                  placeholder="请输入"
                  min={0}
                  max={6}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.changeValue( e, 'maxStep' )}
                  style={{ width: '200px' }}
                />
              </FormItem>

              <FormItem
                label={
                  <span className={styles.labelText}>
                    <span>*</span>是否循环(默认否)
                  </span>
                        }
                {...this.formLayout}
              >
                <Radio.Group
                  onChange={e => this.changeInput( e, 'isLoop' )}
                  value={eleObj.isLoop}
                >
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </FormItem>

              <FormItem
                label={<span className={styles.initStep}>第一次投掷的点数</span>}
                {...this.formLayout}
              >
                <InputNumber
                  value={eleObj.initStep}
                  placeholder="请输入"
                  min={0}
                  max={6}
                  formatter={limitDecimals}
                  parser={limitDecimals}
                  onChange={e => this.changeValue( e, 'initStep' )}
                  style={{ width: '200px' }}
                />
              </FormItem>

              <FormItem
                label={<span className={styles.labelText}><span>*</span>重置类型</span>}
                {...this.formLayout}
              >
                <Radio.Group
                  onChange={e => this.changeInput( e, 'resetType' )}
                  value={eleObj.resetType}
                >
                  <Radio value="NEVER">不重置</Radio>
                  <Radio value="REACH_END">到达终点</Radio>
                  {/* <Radio value="EVERY_DAY">每天</Radio> */}
                </Radio.Group>
              </FormItem>

            </div>

            <SingleLatticeImg
              domData={domData}
              changeDomData={changeDomData}
              eleObj={eleObj}
            />
            {
                    eleObj.single &&
                    <LatticePrize
                      domData={domData}
                      changeDomData={changeDomData}
                      eleObj={eleObj}
                    />
                }

            <Advertisement
              domData={domData}
              changeDomData={changeDomData}
              eleObj={eleObj}
            />
            {
              eleObj.single &&
              <div style={{ marginTop: '30px' }}>
                <Collapse defaultActiveKey={['1']}>
                  <Panel header="单格奖品配置" key="1">
                    <PrizeOptionSecondEdition
                      domData={domData}
                      changeDomData={changeDomData}
                      eleObj={eleObj}
                      tableTitle='单格奖品配置'
                      descriptionText="*第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。
每一列抽奖概率总和需为100%。"
                    />
                  </Panel>
                </Collapse>
              </div>
            }
            <div style={{ marginTop: '30px' }}>
              <PrizeOptionSecondEdition
                domData={domData}
                changeDomData={changeDomData}
                eleObj={eleObj}
                tableTitle='终点奖品配置'
                dateKey='prizeList'
                descriptionText="*第N次概率，即用户第N次参与该抽奖时的概率，用户优先使用第N次概率，其次使用默认概率。
每一列抽奖概率总和需为100%。"
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

export default MonopolyElement;

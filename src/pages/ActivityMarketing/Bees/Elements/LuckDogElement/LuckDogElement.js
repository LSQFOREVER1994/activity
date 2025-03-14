/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, InputNumber } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import serviceObj from '@/services/serviceObj';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import styles from './luckDogElement.less';

const FormItem = Form.Item;
// const { RangePicker } = DatePicker;

@connect()
@Form.create()
class LuckDogElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {}
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
      name: '开奖组件',
      luckDog:{
        score:999,
      },
      price:999,
      attendButton: `${serviceObj.defaultImagePath}KJ_LJCY.png`,
      paddingLeft:30,
      paddingRight:30,
      prizes:[],
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
    if ( type === 'text' || !e.target ) {
      val = e
    } else {
      val = e.target.value
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

  }

  changeImg = ( e, type ) => {
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

  changeLuckDog = ( e, type ) => {
    let val
    if ( type === 'text' || !e.target ) {
      val = e
    } else {
      val = e.target.value
    }
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const luckDog = eleObj.luckDog || {}
    const newLuckDog = Object.assign( luckDog, { [type]: val } );
    const obj = Object.assign( eleObj, { luckDog: newLuckDog } );
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
  }


  changeOpenDate = ( e ) => {
    const { domData, changeDomData, eleObj } = this.props;
    const openTime = e && e.format( 'YYYY-MM-DD HH:mm:ss' );
    const luckDog = eleObj.luckDog || {}
    const newLuckDog = Object.assign( luckDog, { openTime } );
    const obj = Object.assign( eleObj, { luckDog: newLuckDog } );
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
          {/* <FormItem
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
          </FormItem> */}
          <FormItem
            label={<span className={styles.labelText}><span>*</span>开奖时间</span>}
            {...this.formLayout}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={eleObj.luckDog && eleObj.luckDog.openTime ? moment( eleObj.luckDog.openTime, 'YYYY-MM-DD HH:mm:ss' ) : null}
              style={{ width: 270 }}
              onChange={( e ) => this.changeOpenDate( e, 'openTime' )}
            />
            {/* <span className={styles.labelText}>
              <span>*</span>开奖时间需在活动时间内
            </span> */}
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>抽奖码所需积分</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.luckDog ? eleObj.luckDog.score : ''}
              placeholder="请输入兑换一次抽奖码所需积分数量"
              onChange={( e ) => this.changeLuckDog( e, 'score' )}
              maxLength={20}
              precision={0}
              min={1}
              style={{ width: 120 }}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>奖品价值</span>}
            {...this.formLayout}
          >
            <InputNumber
              value={eleObj.price}
              placeholder="请输入奖品价值"
              onChange={( e ) => this.changeInput( e, 'price' )}
              maxLength={20}
              min={0}
              style={{ width: 120 }}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>立即参与按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal
                value={eleObj.attendButton}
                onChange={( e ) => this.changeImg( e, 'attendButton' )}
              />
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
                <div>格式：jpg/jpeg/png </div>
                <div>图片尺寸建议150px * 50px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
        </div>
        <div style={{ marginBottom:20 }}>
          <PrizeOptionSecondEdition
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            maxPrizeNum={1}
            descriptionText="单场开奖仅可抽取一种奖品，同一奖品可抽取多个中奖用户（奖品库存数即为中奖库存数）。"
            noProbability
            disabledThanks
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

export default LuckDogElement;

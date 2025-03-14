/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { Form, Input, DatePicker, Radio, InputNumber, Collapse } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import UploadModal from '@/components/UploadModal/UploadModal';
import CardItem from './CardItem'
// import CardPrize from './CardPrize'
// import DrawPrize from './DrawPrize'
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import serviceObj from '@/services/serviceObj';
import styles from './collectionCardElement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
@connect( ( { bees } ) => ( {
  fundsList: bees.fundsList
} ) )
@Form.create()
class CollectionCardElement extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  fundItemFormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  constructor( props ) {
    super( props );
    this.state = {

    }
  }


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
      name: '集卡组件',
      openTip: '集齐5张卡片即可抽大奖',
      single: false,
      cardType: 'FIVE',
      cardButton: `${serviceObj.defaultImagePath}JK_CK.png`,
      drawButton: `${serviceObj.defaultImagePath}JK_CJ.png`,
      continueButton: `${serviceObj.defaultImagePath}JK_JXCK.png`,
      buttonWidth: 450,
      buttonHeight: 95,
      cardImage: `${serviceObj.defaultImagePath}JK_KB.png`,
      cardList: [
        {
          frontImage: `${serviceObj.defaultImagePath}JK_KM1.png`,
          name: "集",
        },
        {
          frontImage: `${serviceObj.defaultImagePath}JK_KM2.png`,
          name: "卡",
        },
        {
          frontImage: `${serviceObj.defaultImagePath}JK_KM3.png`,
          name: "赢",
        },
        {
          frontImage: `${serviceObj.defaultImagePath}JK_KM4.png`,
          name: "好",
        },
        {
          frontImage: `${serviceObj.defaultImagePath}JK_KM5.png`,
          name: "礼",
        },
      ],
      paddingLeft: 30,
      paddingRight: 30,
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

  changeInput = ( e, type, funcType ) => {
    let val
    if ( funcType === 'date' ) {
      val = e && e.format( 'YYYY-MM-DD HH:mm:ss' )
    } else if ( e && e.target ) {
      val = e.target.value
    } else {
      val = e
    }
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    let newEleObj = Object.assign( eleObj, { [type]: val } );
    if ( type === 'single' && val === false ) {
      newEleObj = Object.assign( eleObj, { [type]: val, prizes: [] } );
    }
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    if ( type === 'cardType' ) this.updateCardList( e.target.value )
    this.setState( { time: new Date() } )
  }

  // 选择卡片数量时候
  updateCardList = ( cardType ) => {
    const arr = []
    let arrLen
    if ( cardType === 'THREE' ) arrLen = 3
    if ( cardType === 'FIVE' ) arrLen = 5
    if ( cardType === 'EIGHT' ) arrLen = 8
    const cardInfo = { isShow: true }
    const newArr = arr.concat( new Array( arrLen ).fill( cardInfo ) );
    const { domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, { cardList: [...newArr] } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  // 范围日期选择
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


  // 卡片列表
  renderCardList = () => {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    const { cardList } = eleObj
    let listBox
    if ( cardList && cardList.length > 0 ) {
      const listView = cardList.map( ( info, index ) => {
        return (
          <CardItem
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            cardItem={info}
            itemIndex={index}
          />
        )
      } )
      listBox = (
        <Collapse defaultActiveKey='cardOption'>
          <Panel header="活动卡片配置" key="cardOption">
            <div>
              <div style={{ color: '#f73232', fontSize: '12px' }}>
                本次活动所要集齐的集卡数量选择几张就需要配置几张卡片，所有卡片图尺寸需保持一致并与卡片背景图尺寸一致；卡片概率总和需为100%
              </div>
              {listView}
            </div>
          </Panel>
        </Collapse>
      )
    }
    return listBox
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
            label='集卡有效时间'
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
            label={<span className={styles.labelText}><span>*</span>抽奖开放时间</span>}
            {...this.formLayout}
          >
            <DatePicker
              style={{ width: '50%' }}
              placeholder='请选择时间'
              showTime
              value={eleObj.openTime ? moment( eleObj.openTime, 'YYYY-MM-DD HH:mm:ss' ) : null}
              onChange={( e ) => this.changeInput( e, 'openTime', 'date' )}
              format="YYYY-MM-DD HH:mm:ss"
            />
            <span style={{ fontSize: 12, marginLeft: '10px', color: '#999' }}>
              * 抽奖活动时间需在活动有效期内
            </span>
          </FormItem>
          <FormItem label={<span className={styles.labelText}><span>*</span>开奖提示语</span>} {...this.formLayout}>
            <Input
              value={eleObj.openTip}
              placeholder="请输入开奖提示语"
              onChange={( e ) => this.changeInput( e, 'openTip' )}
              maxLength={15}
              suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{( eleObj.openTip && eleObj.openTip.length ) || 0}/15</span>}
            />
          </FormItem>
          <FormItem label={<span className={styles.labelText}><span>*</span>单张卡抽奖</span>} {...this.formLayout}>
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'single' )}
              value={eleObj.single}
            >
              <Radio value>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label={<span className={styles.labelText}><span>*</span>集卡数量</span>} {...this.formLayout}>
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'cardType' )}
              value={eleObj.cardType}
              disabled={!!eleObj.id}
            >
              <Radio value='THREE'>3张</Radio>
              <Radio value='FIVE'>5张</Radio>
              <Radio value='EIGHT'>8张</Radio>
            </Radio.Group>
            <span style={{ fontSize: 12, marginLeft: '10px', color: '#999' }}>
              * 保存后，卡片数量将无法更改
            </span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>抽卡按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.cardButton} onChange={( e ) => this.changeInput( e, 'cardButton' )} />
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
                <div>图片尺寸建议450px * 95px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>抽奖按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.drawButton} onChange={( e ) => this.changeInput( e, 'drawButton' )} />
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
                <div>图片尺寸建议450px * 95px </div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem label='抽卡/抽奖按钮图片宽' {...this.formLayout}>
            <InputNumber
              value={eleObj.buttonWidth}
              placeholder="请输入按钮宽度"
              min={0}
              onChange={( e ) => this.changeInput( e, 'buttonWidth' )}
              style={{ width: '50%' }}
            />
            <span style={{ paddingLeft: '10px' }}>px</span>
          </FormItem>
          <FormItem label='抽卡/抽奖按钮图片高' {...this.formLayout}>
            <InputNumber
              value={eleObj.buttonHeight}
              placeholder="请输入按钮高度"
              min={0}
              onChange={( e ) => this.changeInput( e, 'buttonHeight' )}
              style={{ width: '50%' }}
            />
            <span style={{ paddingLeft: '10px' }}>px</span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>继续抽卡按钮图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.continueButton} onChange={( e ) => this.changeInput( e, 'continueButton' )} />
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
                <div>图片尺寸建议400px * 95px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>卡片背景图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={eleObj.cardImage} onChange={( e ) => this.changeInput( e, 'cardImage' )} />
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
                <div>图片尺寸建议500px * 625px</div>
                <div>图片大小建议不大于1M</div>
              </div>
            </div>
          </FormItem>
        </div>
        {this.renderCardList()}
        <div hidden={!eleObj.single} style={{ marginTop: '20px' }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="单卡奖品配置" key="1">
              <PrizeOptionSecondEdition
                domData={domData}
                changeDomData={changeDomData}
                eleObj={eleObj}
              />
            </Panel>
          </Collapse>
        </div>
        <div style={{ marginTop: '20px' }}>
          <PrizeOptionSecondEdition
            domData={domData}
            changeDomData={changeDomData}
            dataKey='prizeList'
            eleObj={eleObj}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <AdvancedSettings
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
            itemIndex={1}
          />
        </div>
      </div>
    )
  }

}

export default CollectionCardElement;

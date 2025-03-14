/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable radix */
import React, {
  PureComponent
} from 'react';
import { Form, Input, Radio } from 'antd';
import { connect } from 'dva';
import AdvancedSettings from '../../Edit/AdvancedSettings'
import UploadModal from '@/components/UploadModal/UploadModal';
import { PrizeOptionSecondEdition } from '@/components/PrizeOption';

import styles from './hiteggelement.less';
import serviceObj from '@/services/serviceObj';

const FormItem = Form.Item;

@connect( ( { bees } ) => ( {
  fundsList: bees.fundsList
} ) )
@Form.create()
class HitEggElement extends PureComponent {
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
    this.state = { }
  }

  componentWillMount() {
    this.initElmentData()
  }

  // 组件基础信息初始化
  initElmentData = () => {
    const {
      domData,
      changeDomData,
      eleObj
    } = this.props
    // 编辑和新增状态的编辑都不走此流程
    if ( ( eleObj && eleObj.id ) || ( eleObj && eleObj.name ) ) return
    // 塞入默认值
    const defaultObj = {
      name: '砸金蛋组件',
      style: 'cross',
      showLeftCount: true,
      eggsImages: [
        `${serviceObj.defaultImagePath}egg/dan.png`,
        `${serviceObj.defaultImagePath}egg/dan.png`,
        `${serviceObj.defaultImagePath}egg/dan.png`,
      ],
      hitImages: [
        `${serviceObj.defaultImagePath}egg/baozha.gif`,
        `${serviceObj.defaultImagePath}egg/baozha.gif`,
        `${serviceObj.defaultImagePath}egg/baozha.gif`,
      ],
      hammerImages: `${serviceObj.defaultImagePath}egg/chuizi.gif`,
      bottomImage: `${serviceObj.defaultImagePath}egg/dipan.png`,
      clickImage: `${serviceObj.defaultImagePath}egg/dianji.png`,
    }
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, defaultObj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, {
      elements: newElementsList
    } );
    changeDomData( newDomData );
  }

  changeInput = ( e, type ) => {
    const val = e.target.value
    const {
      domData,
      changeDomData,
      eleObj
    } = this.props;
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, {
      [type]: val
    } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, {
      elements: newElementsList
    } );
    changeDomData( newDomData );
  }

  changeImg = ( e, type ) => {
    const {  domData, changeDomData, eleObj } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    const eggsImages = eleObj.eggsImages || [];
    const hitImages = eleObj.hitImages || [];
    let type1 = type;
    if ( type.indexOf( 'eggsImages' ) > -1 ) {
      type1 = 'eggsImages';
      const i = parseInt( type.substr( 10 ) ) - 1;
      eggsImages[i] = e;
    }
    if ( type.indexOf( 'hitImages' ) > -1 ) {
      type1 = 'hitImages';
      const n = parseInt( type.substr( 9 ) ) - 1;
      hitImages[n] = e;
    }
    const newEleObj = Object.assign( eleObj, {
      [type1]: type1 === 'eggsImages' ? eggsImages : type1 === 'hitImages' ? hitImages : e
    } );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );

    // 刷新总数据
    const newDomData = Object.assign( domData, {
      elements: newElementsList
    } );
    changeDomData( newDomData );
  }

  changeDate = ( e ) => {
    const startTime = e[0] && e[0].format( 'YYYY-MM-DD HH:mm:ss' );
    const endTime = e[1] && e[1].format( 'YYYY-MM-DD HH:mm:ss' );
    const {  domData, changeDomData, eleObj } = this.props;
    const obj = Object.assign( eleObj, { startTime, endTime } );
    const elementsList = domData.elements ? domData.elements : []
    const newEleObj = Object.assign( eleObj, obj );
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, {
      elements: newElementsList
    } );
    changeDomData( newDomData );
  }

  render() {
    const { domData = {}, changeDomData, eleObj = {} } = this.props;
    if ( eleObj.eggsImages && eleObj.eggsImages.length > 0 ) {
      eleObj.eggsImages.map( ( item, index ) => {
        eleObj[`eggsImages${index + 1}`] = item
      } )
    }
    if ( eleObj.hitImages && eleObj.hitImages.length > 0 ) {
      eleObj.hitImages.map( ( item, index ) => {
        eleObj[`hitImages${index + 1}`] = item
      } )
    }
    return (
      <div>
        <div>
          <FormItem
            label={<span className={styles.labelText}> <span> * </span>组件名称 </span>}
            {...this.formLayout}
          >
            <Input
              value={eleObj.name}
              placeholder="请输入组件名称"
              onChange={( e ) => this.changeInput( e, 'name' )}
              maxLength={20}
            />
          </FormItem> {
            /* <FormItem
                        label={<span className={styles.labelText}>活动有效时间</span>}
                        {...this.formLayout}
                      >
                        <RangePicker
                          style={{ width: '100%' }}
                          showTime
                          value={eleObj.startTime ? [moment( eleObj.startTime, 'YYYY-MM-DD HH:mm:ss' ), moment( eleObj.endTime, 'YYYY-MM-DD HH:mm:ss' )] : []}
                          format="YYYY-MM-DD HH:mm:ss"
                          onChange={( e ) => this.changeDate( e )}
                        />
                      </FormItem> */
          }
          <FormItem
            label={<span className={styles.labelText}> <span> * </span>次数展示</span>}
            {...this.formLayout}
          >
            <Radio.Group
              onChange={( e ) => this.changeInput( e, 'showLeftCount' )}
              value={eleObj.showLeftCount}
            >
              <Radio value> 展示 </Radio>
              <Radio value={false}> 不展示 </Radio>
            </Radio.Group>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}> <span> * </span>金蛋展示 </span>}
            {...this.formLayout}
          >
            <Radio.Group onChange={( e ) => this.changeInput( e, 'style' )} value={eleObj.style}>
              <Radio value='cross'> 横向展示 </Radio>
              <Radio value='cone'> 锥形展示 </Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label={<span className={styles.labelText}> <span> * </span>静态蛋图</span>} {...this.formLayout}>
            <div className={styles.staticImgCon}>
              <UploadModal
                className={styles.staticImg}
                value={eleObj.eggsImages1}
                onChange={( e ) => this.changeImg( e, 'eggsImages1' )}
              />
              <UploadModal
                className={styles.staticImg}
                value={eleObj.eggsImages2}
                onChange={( e ) => this.changeImg( e, 'eggsImages2' )}
              />
              <UploadModal
                className={styles.staticImg}
                value={eleObj.eggsImages3}
                onChange={( e ) => this.changeImg( e, 'eggsImages3' )}
              />
            </div>
            <span> 建议比例： 图片大小建议不大于1M
            </span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}> <span> * </span>锥子图</span>}
            {...this.formLayout}
          >
            <UploadModal
              value={eleObj.hammerImages}
              onChange={( e ) => this.changeImg( e, 'hammerImages' )}
            />
            <span> 建议比例： 图片大小建议不大于1M </span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}> <span> * </span>砸蛋效果图</span>}
            {...this.formLayout}
          >
            <div className={styles.staticImgCon}>
              <UploadModal
                className={styles.staticImg}
                value={eleObj.hitImages1}
                onChange={( e ) => this.changeImg( e, 'hitImages1' )}
              />
              <UploadModal
                className={styles.staticImg}
                value={eleObj.hitImages2}
                onChange={( e ) => this.changeImg( e, 'hitImages2' )}
              />
              <UploadModal
                className={styles.staticImg}
                value={eleObj.hitImages3}
                onChange={( e ) => this.changeImg( e, 'hitImages3' )}
              />
            </div>
            <span> 建议比例： 图片大小建议不大于1M</span>
          </FormItem>

          <FormItem
            label={<span className={styles.labelText}> <span> * </span>点击按钮图</span>}
            {...this.formLayout}
          >
            <UploadModal
              value={eleObj.clickImage}
              onChange={( e ) => this.changeImg( e, 'clickImage' )}
            />
            <span> 建议比例： 图片大小建议不大于1M </span>
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}> <span> * </span>底部托盘图</span>}
            {...this.formLayout}
          >
            <UploadModal
              value={eleObj.bottomImage}
              onChange={( e ) => this.changeImg( e, 'bottomImage' )}
            />
            <span> 建议比例： 图片大小建议不大于1M </span>
          </FormItem>
        </div>
        <div>
          <PrizeOptionSecondEdition
            domData={domData}
            changeDomData={changeDomData}
            eleObj={eleObj}
          />
        </div>
        <div style={{ marginTop:'20px' }}>
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

export default HitEggElement;

/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-globals */
import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Radio,
  Select,
  Row,
  Col,
  Button,
  Empty,
  message,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import UploadModal from '@/components/UploadModal/UploadModal';
import {
  FORM_LAYOUT,
  PRIZE_DEF,
  getUniqueKey,
  PRIZE_MARK,
  BTN_IMAGE,
} from './constant';
import styles from './awardElement.less';

const FormItem = Form.Item;
const { Option } = Select;

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

@connect( ( { bees } ) => ( {
  prizeTypeList: bees.prizeTypeList,
  // prizeList: bees.prizeList,
} ) )
@Form.create()

class EditAwardPrize extends PureComponent {

  constructor( props ) {
    super( props );
    // 编辑时，给每项奖品设置唯一标识
    const ukPrizeListTemp = this.setUniKeyForPrize( props );
    this.state = {
      ukPrizeListTemp, // 编辑时，初始化关联奖品列表暂存
      ukPrizeList: [], // 拥有唯一标识的奖品列表
      prizeTypeOptions: [], // 奖品类型下拉选项
       // 存储每个关联奖品中
      prizeObj: {}, // 奖品类型对应的奖品列表
      prizeOptionObj: {}, // 奖品下拉选项
    }
  }

  componentWillMount() {
    this.initPrizeData();
  }

  // 给每项奖品设置唯一标识
  setUniKeyForPrize = ( props ) => {
    const { eleObj, eleObj: { prizes = [] } } = props;
    if ( eleObj && eleObj.id ) {
      const ukPrizeList = prizes.map( prize => {
        const prizeVirtualId = getUniqueKey();
        return { ...prize, prizeVirtualId }
      } );
      return ukPrizeList;
    }
    return prizes;
  }

  // 初始化奖品数据
  initPrizeData = () => {
    const { prizeTypeList = [] } = this.props;
    const { ukPrizeListTemp = [] } = this.state;
    // 奖品类型
    const prizeTypeOptions = prizeTypeList.map( info => {
      return (
        <Option key={info.rightTypeId} value={info.rightTypeId}>{info.rightTypeName}</Option>
      );
    } );
    // 奖品选项
    ukPrizeListTemp.forEach( ( ukPrize, index ) => {
      let finished = false;
      if ( index === ukPrizeListTemp.length - 1 ) finished = true;
      const { prizeVirtualId: echoUK, relationPrizeType } = ukPrize;
      // 根据奖品类型 请求接口 获取该类型下的奖品列表
      this.getPrizeList( '', relationPrizeType, echoUK, PRIZE_MARK.init, finished );
    } );
    this.setState( { prizeTypeOptions } );
  }

  /**
   * 模糊搜索奖品列表
   * @param {string} rightName 奖品搜索值
   * @param {string} relationPrizeType 关联奖品类型
   * @param {string} uniKey 关联奖品唯一标识
   * @param {boolean} initPrize 编辑时初始化标志
   * @param {boolean} isUpdate 是否更新关联奖品项
   */
  getPrizeList = ( rightName, relationPrizeType, uniKey, prizeMark, finished ) => {
    const { dispatch } = this.props;
    dispatch( {
      type: 'bees/getPrizeList',
      payload: {
        rightName,
        rightType: relationPrizeType,
      },
      successFun: ( prizeList ) => {
        if ( uniKey ) {
          const { prizeObj, prizeOptionObj } = this.state;
          prizeObj[uniKey] = prizeList;
          const prizeSelectOptions = prizeList.map( info => {
            return (
              <Option key={info.rightId} value={info.rightId}>{info.rightName}</Option>
            );
          } );
          prizeOptionObj[uniKey] = prizeSelectOptions;
          this.setState( {
            prizeObj,
            prizeOptionObj,
          }, () => {
            const { eleObj: { prizes } } = this.props;
            const { ukPrizeListTemp } = this.state;
            switch ( prizeMark ) {
              case PRIZE_MARK.init: // 初始化关联奖品列表
                if ( finished ) {
                  setTimeout( () => {this.setState( { ukPrizeList: ukPrizeListTemp } );
                  }, 200 );
                }
                break;
              case PRIZE_MARK.update: // 更新关联奖品列表
                this.setState( { ukPrizeList: prizes } );
                break;
              case PRIZE_MARK.search: // 搜索奖品时，强制更新状态
                this.setState( { time: new Date() } );
                break;
              default:
                break;
            }
          } );
        }
      },
    } );
  }

  // 搜索奖品
  onPrizeSearch = ( e, relationPrizeType, prizeVirtualId ) => {
    if ( !relationPrizeType ) {
      message.error( '请先选择权益类型' );
      return;
    }
    setTimeout( () => {
      this.getPrizeList( e, relationPrizeType, prizeVirtualId, PRIZE_MARK.search );
    }, 20 );
  }

  onItemChange = ( e, prizeItem, type ) => { // 塞入奖品项
    const { prizeTypeList, eleObj } = this.props;
    const { ukPrizeList } = this.state;
    const { prizeVirtualId } = prizeItem;
    // 对象复制
    const saveObj = JSON.parse( JSON.stringify( prizeItem ) );
    let param = {};
    let val = e.target ? e.target.value : e;
    if ( typeof val === 'object' ) {
      val = val.format( 'YYYY-MM-DD' );
    }
    if ( type === 'relationPrizeType' ) {
      this.getPrizeList( '', val, prizeVirtualId, PRIZE_MARK.update );
      param = prizeTypeList.find( ( item ) => item.rightTypeId === e );
      delete saveObj.relationPrizeId;
      delete saveObj.relationPrizeType;
      delete saveObj.usrInventory;
    }
    if ( type === 'relationPrizeId' && !saveObj.relationPrizeType ) {
      message.error( '请选择奖品类型' );
      return;
    }
    let obj = {};
    if ( param.prizeType ) {
      obj = { ...saveObj, [`${type}`]: val, prizeType: param.prizeType };
    } else {
      obj = { ...saveObj, [`${type}`]: val };
    }
    const newPrizes = ukPrizeList.map( ukPrize => {
      if ( ukPrize.prizeVirtualId === prizeVirtualId ) {
        return {
          ...obj,
        }
      }
      return ukPrize;
    } );
    // 更新项不为奖品类型时，需同步更新组件状态
    if ( type !== 'relationPrizeType' ) this.setState( { ukPrizeList: newPrizes } );
    const newEleObj = Object.assign( eleObj, { prizes: newPrizes } );
    this.updateDomData( newEleObj );
  }

  getUnIssuedCnt = ( relationPrizeId, prizeVirtualId ) => { // 获取剩余库存
    const { prizeObj } = this.state;
    const prizeList = prizeObj[prizeVirtualId] || [];
    const param = prizeList.find( item => item.rightId === relationPrizeId );
    return ( param && param.unIssuedCnt ) || 0;
  }

  // 删除领奖奖项
  deletePrizeOption = ( editPositionKey ) => {
    const { eleObj } = this.props;
    const { ukPrizeList } = this.state;
    const newPrizes = ukPrizeList.filter( it => it.prizeVirtualId !== editPositionKey );
    this.setState( { ukPrizeList: newPrizes } );
    const newEleObj = Object.assign( eleObj, { prizes: newPrizes } );
    this.updateDomData( newEleObj );
  }

  // 添加领奖奖项
  addPrizeOption = () => {
    const { eleObj } = this.props;
    const { ukPrizeList } = this.state;
    const prizeVirtualId = getUniqueKey();
    ukPrizeList.push( { prizeVirtualId, ...PRIZE_DEF } );
    this.getPrizeList( '', '', prizeVirtualId, PRIZE_MARK.update );
    const newEleObj = Object.assign( eleObj, { prizes: ukPrizeList } );
    this.updateDomData( newEleObj );
  }

  // // 层级数据更换
  // tierDataChange = ( tier, type, val ) => {
  //   const { eleObj, optionIndex } = this.props;
  //   const tierItem = eleObj[tier];
  //   const newOption = tierItem.map( ( item, index ) => {
  //     if( index === optionIndex ) {
  //       return {
  //         ...item,
  //         [type]: val,
  //       };
  //     }
  //     return item;
  //   } );
  //   return newOption;
  // }

  // 更新总数据
  updateDomData = ( newEleObj ) => {
    const { domData, changeDomData } = this.props;
    const elementsList = domData.elements ? domData.elements : [];
    // 替换对应项
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } );
  }

  // 渲染按钮图元素
  renderBtnImage = ( prize, btnImg ) => {
    const { key, require, label, tips } = btnImg;

    return (
      <FormItem
        label={<span className={styles.labelText}>{require && <span>*</span>}{label}</span>}
        {...FORM_LAYOUT}
      >
        <div style={{ display: 'flex' }}>
          <UploadModal
            value={prize[key]}
            onChange={( e ) => this.onItemChange( e, prize, key )}
          />
          <div
            style={{
              // width: '180px',
              marginTop: 10,
              marginLeft: 10,
              color: '#999',
              fontSize: 13,
              lineHeight: 2,
            }}
          >
            {tips.map( ( item ) => {
              const biUniKey = getUniqueKey();
              return <div key={`award_tip${biUniKey}`}>{item}</div>
            } )}
          </div>
        </div>
      </FormItem>
    );
  }

  // 渲染奖品选项
  renderPrizeOption = ( item ) => {
    const { prizeTypeOptions, prizeOptionObj } = this.state;
    const {
      prizeVirtualId,
      relationPrizeType,
      relationPrizeId,
      name,
      inventory,
      expireType,
      expireTime,
      expireDays,
    } = item;
    const unIssuedCnt = this.getUnIssuedCnt( relationPrizeId, prizeVirtualId );

    return (
      <div key={`award_po${prizeVirtualId}`}>
        {/* 奖项图 */}
        {this.renderBtnImage( item, BTN_IMAGE.image )}
        <FormItem
          label={<span className={styles.labelText}><span>*</span>奖品类型</span>}
          {...FORM_LAYOUT}
        >
          <Select
            style={{ width: '100%' }}
            value={relationPrizeType}
            onChange={( e ) => this.onItemChange( e, item, 'relationPrizeType' )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {prizeTypeOptions}
          </Select>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>选择奖品</span>}
          {...FORM_LAYOUT}
        >
          <Select
            style={{ width: '100%' }}
            value={relationPrizeId}
            onChange={( e ) => this.onItemChange( e, item, 'relationPrizeId', )}
            showSearch
            onSearch={( e ) => this.onPrizeSearch( e, relationPrizeType, prizeVirtualId )}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            filterOption={false} // 关闭自动筛选
          >
            {prizeOptionObj[prizeVirtualId]}
          </Select>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>奖品名称</span>}
          {...FORM_LAYOUT}
        >
          <Input
            value={name}
            placeholder="请输入奖品名称"
            onChange={( e ) => this.onItemChange( e, item, 'name' )}
            maxLength={50}
          />
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>剩余库存</span>}
          {...FORM_LAYOUT}
        >
          <InputNumber
            value={inventory || 0}
            placeholder="请输入"
            min={0}
            max={unIssuedCnt}
            style={{ width: '50%' }}
            formatter={limitDecimals}
            parser={limitDecimals}
            onChange={( e ) => this.onItemChange( e, item, 'inventory' )}
          />
          <span style={{ marginLeft: '20px', color: '#f5222d', fontWeight: 'bold' }}>*可用库存：{unIssuedCnt}</span>
        </FormItem>
        <FormItem
          label={<span className={styles.labelText}><span>*</span>过期类型</span>}
          {...FORM_LAYOUT}
        >
          <Radio.Group
            onChange={( e ) => this.onItemChange( e, item, 'expireType' )}
            value={expireType}
          >
            <Radio value='TIME'>失效时间</Radio>
            <Radio value='DAYS'>有效天数</Radio>
          </Radio.Group>
        </FormItem>
        {( expireType && expireType === 'TIME' ) &&
          <FormItem
            label={<span className={styles.labelText}><span>*</span>失效时间</span>}
            {...FORM_LAYOUT}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder='请选择失效时间'
              value={expireTime ? moment( expireTime, 'YYYY-MM-DD' ) : null}
              onChange={( e ) => this.onItemChange( e, item, 'expireTime' )}
              format="YYYY-MM-DD"
            />
          </FormItem>
        }
        {expireType && expireType === 'DAYS' &&
          <FormItem
            label={<span className={styles.labelText}><span>*</span>有效天数</span>}
            {...FORM_LAYOUT}
          >
            <InputNumber
              value={expireDays}
              placeholder="请输入有效天数"
              min={0}
              style={{ width: '100%' }}
              formatter={limitDecimals}
              parser={limitDecimals}
              onChange={( e ) => this.onItemChange( e, item, 'expireDays' )}
            />
          </FormItem>
        }
      </div>
    );
  }

  // 渲染关联奖项
  renderAwardPrize = ( item, index ) => {
    const { prizeVirtualId: editPositionKey } = item;
    return (
      <Row gutter={24} key={`award_${editPositionKey}`}>
        <Col span={4} className={styles.prizeLabel}>关联奖品{index + 1}</Col>
        <Col span={16}>
          {this.renderPrizeOption( item )}
        </Col>
        <Col span={4}>
          <Button icon="delete" onClick={() => this.deletePrizeOption( editPositionKey )} />
        </Col>
      </Row>
    );
  }

  // 渲染添加按钮
  renderAddBtn = ( text ) => {
    return (
      <div className={styles.bottomBtnBox}>
        <Button
          type="dashed"
          className={styles.prizeAddBtn}
          icon="plus"
          onClick={this.addPrizeOption}
        >
          {text}
        </Button>
      </div>
    );
  }

  render() {
    const { ukPrizeList = [] } = this.state;
    return (
      <div className={styles.prizeConfigBox}>
        {( !!ukPrizeList.length && ukPrizeList.map( ( item, index ) => this.renderAwardPrize( item, index ) )
          || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无奖品配置，请去添加奖品" />
        )}
        {this.renderAddBtn( "添加奖品" )}
      </div>
    );
  }
}

export default EditAwardPrize;

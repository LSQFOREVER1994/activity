import React, { PureComponent } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { connect } from 'dva';
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './collectionCardElement.less';

const FormItem = Form.Item;
@connect( ( { bees } ) => ( {
  fundsList: bees.fundsList
} ) )
@Form.create()
class CardItem extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
      isShow: false
    }
  }


  componentWillMount() {
    const { cardItem }=this.props
    this.setState( {
      isShow:cardItem.isShow,
    } )
  }

  // 展开、收起
  onChangeShow = () => {
    this.setState( {
      isShow: !this.state.isShow
    } )
  }

  // 更新值
  onChangeItemValue = ( e, type, funcType ) => {
    let val
    if ( funcType === 'date' ) {
      val = e && e.format( 'YYYY-MM-DD HH:mm:ss' )
    } else if ( e.target ) {
      val = e.target.value
    } else {
      val = e
    }
    const { domData, changeDomData, eleObj, cardItem, itemIndex } = this.props;
    const { cardList = [] } = eleObj
    const newCardItem = { ...cardItem, [type]: val }
    const newCardList = cardList.map( ( info, index ) => {
      return index === itemIndex ? newCardItem : info
    } )
    const newEleObj = Object.assign( eleObj, { cardList: [...newCardList] } );
    // 替换对应项
    const elementsList = domData.elements ? domData.elements : []
    const newElementsList = elementsList.map( item => {
      return item.virtualId === newEleObj.virtualId ? newEleObj : item;
    } );
    // 刷新总数据
    const newDomData = Object.assign( domData, { elements: newElementsList } );
    changeDomData( newDomData );
    this.setState( { time: new Date() } )
  }


  render() {
    const { isShow } = this.state
    const { cardItem = {}, itemIndex } = this.props;
    return (
      <div style={{ border: '1px solid #d9d9d9', padding: '20px', marginTop: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>
            {cardItem.name || `卡片${itemIndex+1}`}
          </div>
          <div style={{ fontSize: '14px', color: '#1890ff' }} onClick={this.onChangeShow}>
            {isShow ? '收起' : '展开'}
          </div>
        </div>
        <div
          hidden={!isShow}
          style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #d9d9d9'

          }}
        >
          <FormItem
            label={<span className={styles.labelText}><span>*</span>卡片名称</span>}
            {...this.formLayout}
          >
            <Input
              value={cardItem.name}
              placeholder="请输入卡片名称"
              onChange={( e ) => this.onChangeItemValue( e, 'name' )}
              maxLength={4}
              suffix={<span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{( cardItem.name && cardItem.name.length ) || 0}/4</span>}
            />
          </FormItem>
          <FormItem
            label={<span className={styles.labelText}><span>*</span>卡片正面图</span>}
            {...this.formLayout}
          >
            <div style={{ display: 'flex' }}>
              <UploadModal value={cardItem.frontImage} onChange={( e ) => this.onChangeItemValue( e, 'frontImage' )} />
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
          <FormItem label='已用库存' {...this.formLayout}>
            <InputNumber
              value={cardItem.sendCount || 0}
              placeholder="请输入按钮宽度"
              min={0}
              style={{ width: '85%' }}
              disabled
            />
            <span style={{ paddingLeft: '10px' }}>张</span>
          </FormItem>
          <FormItem label={<span className={styles.labelText}><span>*</span>活动库存</span>} {...this.formLayout}>
            <InputNumber
              value={cardItem.inventory}
              placeholder="请输入活动库存"
              min={0}
              onChange={( e ) => this.onChangeItemValue( e, 'inventory' )}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>张</span>
          </FormItem>
          <FormItem label={<span className={styles.labelText}><span>*</span>每日最多发放</span>} {...this.formLayout}>
            <InputNumber
              value={cardItem.dayMaxCount}
              placeholder="请输入每日最多发放"
              min={0}
              onChange={( e ) => this.onChangeItemValue( e, 'dayMaxCount' )}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>张</span>
          </FormItem>
          <FormItem label={<span className={styles.labelText}><span>*</span>获得该卡片概率</span>} {...this.formLayout}>
            <InputNumber
              value={cardItem.probability}
              placeholder="请输入获得该卡片概率"
              min={0}
              onChange={( e ) => this.onChangeItemValue( e, 'probability' )}
              style={{ width: '85%' }}
            />
            <span style={{ paddingLeft: '10px' }}>%</span>
          </FormItem>
        </div>
      </div>
    )
  }

}

export default CardItem;

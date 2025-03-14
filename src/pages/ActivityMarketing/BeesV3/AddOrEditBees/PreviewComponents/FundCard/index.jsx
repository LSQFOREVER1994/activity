/* eslint-disable import/no-cycle */
import React, { useRef, useEffect } from 'react'
import { setScaleFunc } from '../index';
import styles from './index.less'
import addIcon from './images/addIcon.png';

const fundsShowTypes = [
  { key: 'growthRateDaily', value: '日涨幅' },
  { key: 'growthRateWeekly', value: '周涨幅' },
  { key: 'growthRateMonthly', value: '月涨幅' },
  { key: 'growthRate3m', value: '近三个月涨幅' },
  { key: 'growthRate6m', value: '近六个月涨幅' },
  { key: 'growthRate1y', value: '近一年涨幅' },
  { key: 'growthRate2y', value: '近两年涨幅' },
  { key: 'growthRate3y', value: '近三年涨幅' },
  { key: 'growthRate5y', value: '近五年涨幅' },
  { key: 'growthRate0y', value: '今年以来涨幅' },
];

function index( props ) {

  const { cardStyle, funds, jumpButtonList, style, id, prodType } = props;
  const itemEl = useRef( null );
    

  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );

  const findShowType = ( type )=>{
    const filterType = fundsShowTypes.filter( item=>item.key === type )
    return filterType[0].value
  }

  const renderSmallCardButtonText = ()=>{  // 渲然购买或定投按钮
      let buttonText;
      if( !jumpButtonList.length ) return null;
      if( jumpButtonList.includes( 'BUY' ) ) buttonText = '购买';
      if( jumpButtonList.includes( 'AIP' ) ) buttonText = '定投';
      if( jumpButtonList.includes( 'SELF_SELECT' ) && jumpButtonList.length === 1 ) buttonText = '加关注'
      return(
        <div className={styles.item_right_button}>{buttonText}</div>
      )

  }

  const renderSmallCardAddButton = () => {
    if( jumpButtonList.includes( 'SELF_SELECT' ) && jumpButtonList.length > 1 ) {
      return (
        <img src={addIcon} className={styles.item_add_button} alt="" />
      )
    }
    return null;
  }


  const rederSmallCardFundList = () => {
    let view = null
    if( funds && funds.length>0 ){
      view = funds.map( info=>{
        return (
          <div
            className={styles.fund_card_item}
            key={info.id}
          >
            <div className={styles.fund_card_message}>
              <div className={styles.fund_card_item_left}>
                <div className={styles.item_left_name}>
                  <div className={styles.item_left_name_content}>{info.fullName || '产品名称'}</div>
                  {renderSmallCardAddButton()}
                </div>
                {
                  prodType === '1' && 
                  <div className={styles.fund_card_item_tip}>
                    <div className={styles.tip_riskRank}>风险等级</div>
                    <div className={styles.tip_productType}>产品类型</div>
                  </div>
                }
                
              </div>
              <div className={styles.fund_card_item_right}>
                <div className={styles.fund_card_item_probability}>
                  <div
                    className={styles.item_right_rate}
                    style={{ color: '#C50808' }}
                  >
                    66%
                  </div>
                  <div className={styles.item_right_type}>{findShowType( info.showType )}</div>
                </div>
                <div className={styles.item_right_button_box}>
                  {renderSmallCardButtonText()}
                </div>
              </div>
            </div>
            <div className={styles.fund_card_comment}>{info.comment}</div>
          </div>
        )
      } )
    }
    return(
      <div>
        {view}
      </div>
    )
  }


  const renderBigCardButton = () => {
    if( !jumpButtonList.length ) return null
    const fixInput = jumpButtonList.includes( 'AIP' ) ? '定投' : null;
    const bug = jumpButtonList.includes( 'BUY' ) ? '购买' : null
    if( jumpButtonList.length === 2 ){
      return (
        <div className={styles.big_fund_card_jumpButton}>
          <div className={styles.big_fund_card_button_add}>加关注</div>
          <div className={styles.big_fund_card_button_twoButton}>{fixInput || bug}</div>
        </div>
      )
    }
    if( jumpButtonList.length === 1 ){
      return(
        <div className={styles.big_fund_card_jumpButton}>
          <div className={styles.big_fund_card_button_oneButton}>{fixInput || bug || '加关注'}</div>
        </div>
      )
    }
    return null
  }

  const renderBigCardFundList = () => {
    let view = null;
    if( funds && funds.length > 0 ){
      view = funds.map( info=>{
        return (
          <div className={styles.big_fund_card_item} key={info.id}>
            <div className={styles.big_fund_card_name}>{info.fullName || '产品名称'}</div>
            <div className={styles.big_fund_card_comment}>{info.comment}</div>
            {
              prodType === '1' && 
              <div className={styles.big_fund_card_tag}>
                <div className={styles.big_fund_card_tip}>风险等级</div>
                <div className={styles.big_fund_card_tip}>产品类型</div>
              </div>
            }
            <div className={styles.big_fund_card_rate}>66%</div>
            <div className={styles.big_fund_card_rate_type}>{findShowType( info.showType )}</div>
            {renderBigCardButton()}
          </div>
        )
      } )
    }
    return(
      <div>
        {view}
      </div>
    )
  }

  return (
    <div className={styles.main} ref={itemEl} id={id}>
      {
        cardStyle === 'BIG' ? renderBigCardFundList() : rederSmallCardFundList()
      }
    </div>
  )
}


export default index;

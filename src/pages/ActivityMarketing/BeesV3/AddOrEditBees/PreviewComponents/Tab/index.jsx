/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState, useEffect, useRef, useContext } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import { DomDataContext } from "../../provider";
import ComponentsItem from "./ComponentsItem";
import styles from './index.less';
import { setPageListFunc } from '../index';

function Tab( props ) {
  const [domData] = useContext( DomDataContext );
  const { tabItems, activeColor, unActiveColor, fontSize, textColor, style, id, showTitle, position, dispatch, mode } = props;
  const [chooseTab, setChooseTab] = useState( 0 ); // 默认为第一页
  const [tabItem, setTabItem] = useState( tabItems[0] );
  const [messageInfo, setMessageInfo] = useState( null );

  const itemEl = useRef( null );

  // useEffect( () => {
  //   const componentWrap = itemEl.current;
  //   if ( componentWrap ) {
  //     setScaleFunc( componentWrap, style );
  //   }
  // }, [style.width, style.height] );

  const getCompontentData = ( info ) => {
    const { pageName, activityId } = info;
    dispatch( {
      type: 'beesVersionThree/getActivityIdPageData',
      payload: {
        id: activityId,
      },
      successFun: ( data ) => {
        const { pages=[] } = data;
        let targetPage = {};
        if( pageName.startsWith( 'page' ) ){
          targetPage = pages.find( p=>p.id === pageName )
        }else{
          targetPage = pages[pageName]
        }
        setMessageInfo( targetPage || {} );
      },
    } );
  };

  useEffect( ()=>{
    if( chooseTab === 0 ){
      const { type } = tabItems[0] ||{};
      if( type==="ACTIVITY" ){
        getCompontentData( tabItems[0] )
      }else{
        setTabItem( tabItems[0] )
      }
    }
  }, [ JSON.stringify( tabItems )  ] )

  // 切换Tab
  const onChangeTab = ( index, info ) => {
    
    const { type, event } = info || {};
    if ( index === chooseTab ) return;
    setChooseTab( index );
    setTabItem( info );
    if ( type === 'ACTIVITY' ) {
      getCompontentData( info );
    } else if ( type === 'EVENT' ) {
      if ( event.params && event.params ) {
        console.log( 'sss' )
      }
    }
  };


  // TAB主体
  const renderTab = () => {
    
    let tabView;
    if ( tabItems && tabItems.length > 0 ) {
      tabView = tabItems.map( ( info, index ) => {
        const styleName = 'tab_box_item';
        const isSelected = chooseTab === index;
        const styleObj = {
          width: `${100 / tabItems.length}%`,
          fontSize: fontSize ? `${( fontSize * 2 ) / 32}rem` : undefined,
          color: isSelected && activeColor ? activeColor : unActiveColor || textColor,
        };
        return (
          <div
            key={index}
            className={styles[styleName]}
            onClick={() => onChangeTab( index, info )}
            style={styleObj}
          >
            {
              showTitle &&  <div className={styles.tab_box_item_title}>{info.title}</div>
            }
          </div>
        );
      } );
    }
    return(
      <div className={styles.tab_box}>
        <img
          className={styles.tab_box_item_img}
          src={tabItems?.[chooseTab]?.selectedIcon}
          alt=""
        />
        <div className={styles.tab_content}>
          {tabView}
        </div>
      </div>
    )
  };

  // 计算每个活动页面的高度
  const computedPageHeight = ( componentData ) => {
    let pageHeight = 0;
    componentData.forEach( ( item ) => {
      if ( item.isSuspend ) return;
      const { top, height } = item.style;
      const topOrHeight = top + height;
      if ( topOrHeight > pageHeight ) {
        pageHeight = topOrHeight;
      }
    } );
    return `${( pageHeight * 2 ) / 32}rem`;
  };

  const renderComponentList = ( componentData ) => {
    const view = (
      <>
        {componentData?.map(
            ( item ) =>
              !item.inCombination && (
                <ComponentsItem
                  key={item.id}
                  element={item}
                />
              )
          )}
      </>
    )
    return view
  }

  // 内容
  const renderContent = useCallback( () => {
    let tabContent;
    
    if ( tabItems && tabItems.length > 0 ) {
      const { type, pageName, content } = tabItem || {};
      if( type === 'CURRENT' || type === 'ACTIVITY' ){
        let data;
        if( type === 'CURRENT' ){
          const { pages } = domData || {};
          let targetPage = {};
          if( pageName?.startsWith( 'page' ) ){
            targetPage = pages.find( p=>p.id === pageName )
          }else{
            targetPage = pages[pageName]
          }
          data = targetPage || {};
        }else if( type === 'ACTIVITY' ){
          data = messageInfo || {}
        }
        
        const pageList = setPageListFunc( data )
        const stylePage = {};
        const { backgroundImage, backgroundColor, opacity } = data.style|| {};

        // if ( data.style && data.style.constructor === String ) {
        //   const { backgroundImage, backgroundColor, opacity } = JSON.parse( data.style ) || {};
        //   console.log( JSON.parse( data.style ) || {}, 'JSON.parse( data.style ) || {}' );
          
        //   if ( backgroundImage ) stylePage.backgroundImage = `url(${backgroundImage})`;
        //   if ( backgroundColor ) stylePage.backgroundColor = backgroundColor;
        //   if ( opacity ) stylePage.opacity = opacity;
        // }
        if ( backgroundImage ) stylePage.backgroundImage = `url(${backgroundImage})`;
        if ( backgroundColor ) stylePage.backgroundColor = backgroundColor;
          if ( opacity ) stylePage.opacity = opacity;
        stylePage.height ='100%';
        const scaleValue = Number( style.width ) / 375 ;
        const scaleStyleObj = {
          width:`${( 375 * scaleValue )}px`,
          transform:`scale(${scaleValue})`,
        }
        
        tabContent = (
          <div className={styles.tab_content_box}>
            <div
              id='componentListDom'
              className={styles.tab_content_componentList}
              style={{ ...scaleStyleObj, ...stylePage }}
              // style={getStyle( data )}

            >
              {
                ( pageList && pageList.length ) ? renderComponentList( pageList ) :
                <div className={styles.page_content_box_text}>
                  暂无数据
                </div>
              }
            </div>
          </div>
        )
      } else if( type === 'EVENT' ){
        tabContent = (
          <div className={styles.tab_content_box}>
            <div className={styles.tab_content_box_text}>
              请在C端查看
            </div>
          </div>
        )
      } else if( type === 'LINK' ){
        if ( content ) {
          tabContent = (
            <div className={styles.tab_content_box}>
              <div className={styles.tab_content_box_iframe_madal} />
              <iframe
                scrolling="auto"
                title="效果预览"
                frameBorder={0}
                src={content}
                id="myframe"
                style={{
                  width: '100%', height:'100%', overflow:'auto'
                }}
              />
            </div>
          );
        }else{
          tabContent = <>暂未配置链接</>
        }
      } else if( type === 'NONE' ) {
        tabContent = <div style={{ width: '100%', height:'100%' }} />
      }
    }else{
      tabContent = '请配置Tab列表后查看'
    }
    return tabContent;
  }, [ chooseTab, messageInfo, domData, tabItem, style.width, style.height] );

  const renderBox = ( pos )=>(
    <>
      {pos === 'TOP' ? renderTab() : ""}
      {mode !== 'NAV' ? renderContent() : ( <div style={{ flex: 1 }} /> )}
      {pos === 'BOTTOM' ? renderTab() : ""}
    </>
  )

  useEffect( () => {
    renderBox( position )
  }, [position, chooseTab] )

  return (
    <div className={styles.main} ref={itemEl} id={id}>
      <div className={styles.tab_main}>
        {renderBox( position )}
      </div>
    </div>
  );
}

export default Form.create( { name: 'beesVersionThree' } )( connect()( Tab ) );


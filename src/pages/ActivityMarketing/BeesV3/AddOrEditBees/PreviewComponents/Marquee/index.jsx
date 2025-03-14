/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
import styles from './index.less';
import useDebounce from '@/hooks/useDebounce';

require( 'swiper/swiper.min.css' );

SwiperCore.use( [Autoplay] );
function Marquee( props ) {
  const { records, winerList, events, showCount, direction, style, id, fontSize, speed = 1 } = props;
  const swiperExample = useRef( null );
  const [marqueeList, setMarqueeList] = useState( [] );
  const [speedArr, setSpeedArr] = useState( [] );
  const resizeRenderSwiper = useDebounce( () => {
    swiperExample.current.resize.resizeHandler();
  }, 200 );

  // 宽高改变时重新渲染
  useEffect( () => {
    if ( !swiperExample?.current ) return;
    resizeRenderSwiper();
  }, [style.width, style.height, direction, speed] );

  // 设置当前marqueeItem的滚动速度
  const onActiveIndexChange = ( e ) => {
    // 仅横向滚动模式需要计算
    if ( direction === "VERTICAL" ) return;
    if ( !swiperExample.current?.params?.speed ) return;
    if ( e.realIndex >= 0 ) {
      swiperExample.current.params.speed = speedArr[e.realIndex];
    }
  }

  // 为了求滚动速度计算字符串的实际宽度
  // 影响因素很多，精度、字体等等，只能尽可能减小卡顿，事实上还是会卡一下
  const getActualWidthOfChars = ( text, options = {} ) => {
    const { size = 14, family = "Microsoft YaHei" } = options;
    const canvas = document.createElement( "canvas" );
    const ctx = canvas.getContext( "2d" );
    ctx.font = `${size}rem ${family}`;
    const metrics = ctx.measureText( text );
    //  eslint-disable-next-line max-len
    const actual = Math.abs( metrics.actualBoundingBoxLeft ) + Math.abs( metrics.actualBoundingBoxRight );
    return Math.max( metrics.width, actual );
  }

  const getMarqueeList = () => {
    let newRecords = records;
    if ( winerList && winerList.length > 0 ) {
      const newWinerList = winerList.map( ( info ) => `用户${info.username}获得${info.prizeName}` );
      newRecords = [...records, ...newWinerList];
    }

    if ( newRecords.length === 0 ) {
      newRecords = ['暂无数据'];
    }

    const clickType = events[0]?.action;
    let rightText = `\u00A0>>`;
    if ( !clickType || clickType === 'none' ) {
      rightText = "\u00A0";
    }

    // 间距三个空格，不在swiper配置里配置是因为要根据字符串长度单独计算滚动速度
    const spaceBetween = "\u00A0\u00A0\u00A0";
    newRecords = newRecords.map( ( item ) => `${spaceBetween}${item}${rightText}${spaceBetween}` );
    const getSpeedArr = newRecords.map( ( item ) => {
      const itemSpeed = ( getActualWidthOfChars( item, { size: fontSize } ) / speed );
      return Math.floor( itemSpeed );
    } );

    setSpeedArr( direction === "HORIZONTAL" ? getSpeedArr : [3000 / speed] );
    setMarqueeList( newRecords );
  }

  useEffect( () => {
    getMarqueeList()
  }, [speed, direction, JSON.stringify( records )] )

  const renderMarquee = () => {
    if ( !marqueeList.length ) return <></>;
    const styleObj = { fontSize: `calc(${fontSize} * 2 / 32 * 1rem)` };
    const marqueeItem = marqueeList.slice( 0, showCount ).map( info => (
      <SwiperSlide
        data-swiper-autoplay={direction === 'HORIZONTAL' ? 0 : 1500}
        key={`${info}${Math.random().toString( 36 ).slice( 2, 8 )}`}
        className={styles.marqueeItem}
      >
        <p style={styleObj}>{info}</p>
      </SwiperSlide>
    ) );
    return (
      <Swiper
        loop
        freeMode
        speed={speedArr[0]}
        autoplay={{ disableOnInteraction: false }}
        slidesPerView="auto"
        spaceBetween={0}
        direction={direction.toLocaleLowerCase()}
        allowTouchMove={false}
        className={direction === 'HORIZONTAL' ? styles.marqueeHorizontal : styles.marqueeVertical}
        onInit={e => {
          swiperExample.current = e;
        }}
        onActiveIndexChange={
          ( e ) => onActiveIndexChange( e )
        }
      >
        {marqueeItem}
      </Swiper>
    )
  }

  return (
    <div className={styles.main} id={id}>
      {renderMarquee()}
    </div>
  )
}
export default Marquee;

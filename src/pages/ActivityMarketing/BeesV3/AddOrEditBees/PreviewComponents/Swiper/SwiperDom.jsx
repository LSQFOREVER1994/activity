/* eslint-disable react/no-array-index-key */
import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  EffectFade, EffectCube, EffectFlip, Pagination, Autoplay,
} from 'swiper';
import styles from './index.less';
import useDebounce from '@/hooks/useDebounce';

require( 'swiper/swiper.min.css' )
require( 'swiper/components/effect-fade/effect-fade.min.css' );
require( 'swiper/components/effect-cube/effect-cube.min.css' );
require( 'swiper/components/effect-flip/effect-flip.min.css' );
require( 'swiper/components/pagination/pagination.min.css' );

SwiperCore.use( [EffectFade, EffectCube, EffectFlip, Pagination, Autoplay] );
/*
* direction：滑动方向【horizontal(水平方向)/vertical(垂直方向)】
* spaceBetween：slide之间设置距离（单位px）
* slidesPerView：容器能够同时显示的slides数量，类型：number or auto默认：1， 'auto'则自动根据slides的宽度来设定数量
* effect：切换效果【slide(位移切换)/fade(淡入)/cube(方块)/flip(3d翻转)】
* pagination：分页器【{ type: bullets(圆点)/fraction(分式) }】
* autoplay：自动切换【{ delay: 100 (自动切换的时间间隔，单位ms), disableOnInteraction: false }】
* loop：开启环形回路模式【false/true】
*/

const DirectionType = {
  HORIZONTAL: 'horizontal', // 横向
  VERTICAL: 'vertical', // 竖向
};

const EffectType = {
  SLIDE: 'slide', // 位移切换
  FADE: 'fade', // 淡入
  CUBE: 'cube', // 方块
  FLIP: 'flip', // 3D翻转
};

const PaginationType = {
  BULLETS: 'bullets', // 圆点
  FRACTION: 'fraction', // 分式
};

function SwiperDom( props ) {

  const { element = {} } = props;
  const { images = [], autoplay, delay = 0, direction, effect, loop, pagination, spaceBetween, bannerType = 'SINGLE', style } = element
  const { height } = style;
  const speed = delay > 500 ? delay : 4000 / delay; // 改为小数倍数模式，兼容旧版本
  const swiperExample = useRef( null );
  const [speedArr, setSpeedArr] = useState( [] );
  const resizeRenderSwiper = useDebounce( () => {
    swiperExample.current.resize.resizeHandler();
  }, 200 );

  // 参数改变时重新渲染
  useEffect( () => {
    if ( !swiperExample?.current ) return;
    resizeRenderSwiper();
  }, [style.width, style.height, direction, spaceBetween, bannerType, delay] );

  const onActiveIndexChange = ( e ) => {
    // ! 仅多图滚动模式需要计算
    if ( bannerType === 'SINGLE' ) return;
    if ( !swiperExample.current?.params?.speed ) return;
    if ( e.realIndex >= 0 ) {
      swiperExample.current.params.speed = speedArr[e.realIndex];
    }
  }

  const getSpeedArr = () => {
    // 滚动速度如果为固定值，图片宽度越小则滚动速度越快（height: "100%"）
    // 考虑到每张轮播图的宽高比可能不一样， 分别计算每张轮播图的滚动速度
    // 边距也要考虑内，作为图片整体宽度来计算
    const promistList = [];
    images.forEach( ( item ) => {
      const promiseItem = new Promise( ( resolve ) => {
        const imageItem = new Image();
        imageItem.src = item.url;
        setTimeout( () => {
          resolve( speed * ( ( imageItem.width / imageItem.height ) + ( spaceBetween / height ) ) )
        }, 50 )
      } )
      promistList.push( promiseItem );
    } )

    Promise.all( promistList ).then( ( res ) => {
      setSpeedArr( res );
    } )
  }

  useEffect( () => {
    getSpeedArr();
  }, [spaceBetween, height, delay] )

  const singleParams = {
    loop: !!loop,
    autoplay: autoplay ? { delay: speed || 1, disableOnInteraction: false } : false,
    direction: direction ? DirectionType[direction] : 'horizontal',
    effect: effect ? EffectType[effect] : 'slide',
    pagination: pagination ? { type: PaginationType[pagination] } : {},
    spaceBetween: spaceBetween || 0,
    key: new Date().getTime(),
  };
  const muiltipleParams = {
    loop: true,
    autoplay: autoplay ? { delay: 0, disableOnInteraction: false } : false,
    speed: speedArr[0] || speed,
    spaceBetween: spaceBetween || 0,
    slidesPerView: 'auto',
    key: new Date().getTime(),
  }
  const parms = bannerType === 'SINGLE' ? singleParams : muiltipleParams
  return (
    <Swiper
      className={bannerType === 'SINGLE' ? styles.swiper : styles.swiperMulti}
      {...parms}
      onInit={e => {
        swiperExample.current = e;
      }}
      onActiveIndexChange={
        ( e ) => onActiveIndexChange( e )
      }
    >
      {
        images.map( ( item, index ) => (
          <SwiperSlide
            className={styles.swiperSlide}
            key={index}
          // onClick={() => { clickImg( item ); }}
          >
            <img
              className={bannerType === 'SINGLE' ? styles.swiperSlideImg : styles.swiperSlideImgMulti}
              src={item.url}
              alt=""
            />
          </SwiperSlide>
        ) )
      }
    </Swiper>
  );
}

export default SwiperDom

/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import Loadable from 'react-loadable';
import styles from './index.less'
import loadableLoading from "../loadableLoading";


const SwiperDom = Loadable( {
    loader: () => import( './SwiperDom' ),
    loading: loadableLoading,
    // timeout: loadingDomTimeout,
  } );

export default function Swiper( props ) {

    const { images=[], id, activeColor, defaultColor } = props;

    const colorObj = useMemo( ()=>( {
      '--pagination_current_color':activeColor,
      '--pagination_default_color':defaultColor,
    } ), [activeColor, defaultColor] )
    return(
      <div className={styles.main} style={colorObj} id={id}>
        {
            images.length > 1 ? (
              <SwiperDom element={props} />
            ) : (
              <div className={styles.swiperSlide}>
                {
                  images[0] && (
                    <img
                      className={styles.swiperSlideImg}
                      src={images[0].url}
                      alt=""
                    />
                  )
                }
              </div>
            )
          }
      </div>
    )
}

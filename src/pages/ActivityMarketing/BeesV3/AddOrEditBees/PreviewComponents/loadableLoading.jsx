/*
 * @Author: RidingWind
 * @Date: 2021-07-20 14:17:27
 * @Last Modified by: 绩牛信息 - RidingWind
 * @Last Modified time: 2021-07-20 17:53:25
 */

// 异步组建加载
import React from 'react';

export default function loadableLoading( props ) {
  let dom = null;
  if ( props.isLoading ) {
    if ( props.timedOut ) {
      dom = <div>Loader timed out!</div>;
    } else if ( props.pastDelay ) {
      dom = <div><svg><use xlinkHref="#spinner" /></svg></div>;
    } else {
      dom = null;
    }
  } else if ( props.error ) {
    dom = <div>Error! Component failed to load</div>;
  }
  return dom;
}

/* eslint-disable no-param-reassign */
import moment from 'moment';
import React from 'react';
import { notification, Modal, Icon } from 'antd';
import nzh from 'nzh/cn';
import cookies from 'js-cookie';
import { parse, stringify } from 'qs';
import { formatMessage } from 'umi/locale';
import serviceObj from '@/services/serviceObj';

const {
  activityKLineArenaUrl,
  guessMarketUrl,
  prizeClawUrl,
  fundCollisionUrl,
  activityEggsUrl,
  answerCompetitionUrl,
  activityRedRainUrl,
  activityBigWheelUrl,
  activityScratchCardUrl,
  activitySeckillUrl,
  activityGrabCouponUrl,
  activityPasswordUrl,
  activityDrawUrl,
  activityGleanCardUrl,
  activityRandomCardUrl,
  answerUrl,
  barrageUrl,
  questionnaireUrl,
  bigWatermelonUrl,
} = serviceObj;

export function fixedZero( val ) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance( type ) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if ( type === 'today' ) {
    now.setHours( 0 );
    now.setMinutes( 0 );
    now.setSeconds( 0 );
    return [moment( now ), moment( now.getTime() + ( oneDay - 1000 ) )];
  }

  if ( type === 'week' ) {
    let day = now.getDay();
    now.setHours( 0 );
    now.setMinutes( 0 );
    now.setSeconds( 0 );

    if ( day === 0 ) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment( beginTime ), moment( beginTime + ( 7 * oneDay - 1000 ) )];
  }

  if ( type === 'month' ) {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment( now ).add( 1, 'months' );
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment( `${year}-${fixedZero( month + 1 )}-01 00:00:00` ),
      moment( moment( `${nextYear}-${fixedZero( nextMonth + 1 )}-01 00:00:00` ).valueOf() - 1000 ),
    ];
  }

  const year = now.getFullYear();
  return [moment( `${year}-01-01 00:00:00` ), moment( `${year}-12-31 23:59:59` )];
}

export function getPlainNode( nodeList, parentPath = '' ) {
  const arr = [];
  nodeList.forEach( node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace( /\/+/g, '/' );
    item.exact = true;
    if ( item.children && !item.component ) {
      arr.push( ...getPlainNode( item.children, item.path ) );
    } else {
      if ( item.children && item.component ) {
        item.exact = false;
      }
      arr.push( item );
    }
  } );
  return arr;
}

export function digitUppercase( n ) {
  return nzh.toMoney( n );
}

function getRelation( str1, str2 ) {
  if ( str1 === str2 ) {
    // eslint-disable-line
  }
  const arr1 = str1.split( '/' );
  const arr2 = str2.split( '/' );
  if ( arr2.every( ( item, index ) => item === arr1[index] ) ) {
    return 1;
  }
  if ( arr1.every( ( item, index ) => item === arr2[index] ) ) {
    return 2;
  }
  return 3;
}

function getRenderArr( routes ) {
  let renderArr = [];
  renderArr.push( routes[0] );
  for ( let i = 1; i < routes.length; i += 1 ) {
    // 去重
    renderArr = renderArr.filter( item => getRelation( item, routes[i] ) !== 1 );
    // 是否包含
    const isAdd = renderArr.every( item => getRelation( item, routes[i] ) === 3 );
    if ( isAdd ) {
      renderArr.push( routes[i] );
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes( path, routerData ) {
  let routes = Object.keys( routerData ).filter(
    routePath => routePath.indexOf( path ) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map( item => item.replace( path, '' ) );
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr( routes );
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map( item => {
    const exact = !routes.some( route => route !== item && getRelation( route, item ) === 1 );
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  } );
  return renderRoutes;
}

export function getPageQuery() {
  return parse( window.location.href.split( '?' )[1] );
}

export function getQueryPath( path = '', query = {} ) {
  const search = stringify( query );
  if ( search.length ) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const urlReg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl( path ) {
  return urlReg.test( path );
}

export function formatWan( val ) {
  const v = val * 1;
  if ( !v || Number.isNaN( v ) ) return '';

  let result = val;
  if ( val > 10000 ) {
    result = Math.floor( val / 10000 );
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export const importCDN = ( url, name ) =>
  new Promise( resolve => {
    const dom = document.createElement( 'script' );
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve( window[name] );
    };
    document.head.appendChild( dom );
  } );

// export function exportXlsx( { type, uri, xlsxName, callBack, responseType = "blob" } ) {
//   const xhr = new XMLHttpRequest();
//   xhr.open( 'GET', `${serviceObj[type]}/${uri}` );
//   xhr.setRequestHeader( 'X-Auth-Token', cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' ) || sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' ) );
//   xhr.responseType = responseType;
//   // 为 ajax 请求设置超时限制
//   xhr.timeout = 100 * 1000;
//   xhr.addEventListener( 'timeout', () => {
//     return message.error( '请求超时' );
//   } );
//   xhr.send( null );
//   xhr.onreadystatechange = () => {
//     if ( xhr.readyState === 4 ) {
//       // responseType ！== ‘blob’时，申请加入导出队列
//       if ( responseType !== 'blob' ) {
//         if ( xhr.response ) {
//           const data = JSON.parse( xhr.response );
//           const tip = data.tip || data.message;
//           // TOOD: 后端接口不太规范
//           if ( callBack ) callBack( tip ? tip.indexOf( '任务已提交，请在导出任务中查看' ) > -1 : false )
//         }
//       } else {
//         if ( callBack && typeof ( callBack === 'function' ) ) {
//           callBack( xhr.response && xhr.response.type !== 'application/json' );
//         }
//         if ( xhr.status === 200 && xhr.response && xhr.response.type !== 'application/json' ) {
//           const downloadFile = document.createElement( 'a' );
//           downloadFile.href = window.URL.createObjectURL( xhr.response );
//           downloadFile.download = xlsxName;
//           downloadFile.click();
//         } else {
//           notification.error( {
//             message: formatMessage( { id: 'strategyMall.export.file.failed' } ),
//             description: formatMessage( { id: 'strategyMall.export.file.failed.message' } ),
//           } );
//         }
//       }

//     }
//   };
// }

function showSuccess() {
  Modal.confirm( {
    content: '导出请求已加载到队列中，稍等可在导出列表中下载。',
    okText: '立即查看',
    cancelText: '关闭',
    icon: <Icon style={{ color: '#54c51c' }} type="check-circle" />,
    onOk() {
      window.open( `#/system/exportList` )
    },
    onCancel() { },
  } );
}


function parseQueryString( url ) {
  // 拆分路径和查询字符串
  const [path, queryString] = url.split( '?' );

  // 处理查询字符串部分
  const params = new URLSearchParams( queryString );
  const result = {};
  // 使用 forEach 遍历所有参数并还原成对象
  params.forEach( ( value, key ) => {
    // 处理布尔值，字符串 "true" 和 "false" 转换为布尔值
    if ( value === 'true' ) {
      result[key] = true;
    } else if ( value === 'false' ) {
      result[key] = false;
    } else {
      // 其他值保持原样
      result[key] = decodeURIComponent( value );
    }
  } );

  return {
    path,
    params:result
  }
}


export function exportFunc ( { type, uri, xlsxName, callBack, responseType = "POST" } ) {
  const TOKEN = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' ) || sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
  const tokenObj = TOKEN ? { 'X-Auth-Token': TOKEN } : {};
  return fetch( `${serviceObj[type]}/${uri}`, {
    method: 'get',
    responseType,
    headers: {
      ...tokenObj,
    }
  } ).then( res => {
    return res.blob();
  } ).then( blob => {
    // 暂时处理方法 后端返回message:"任务已提交，请在导出任务中查看"大小为97b
    if ( blob.size > 100 ) {
      // application/vnd.ms-excel -> xlsx文件
      // text/plain -> txt文件
      const bl = new Blob( [blob], { type: blob.type } );
      const link = document.createElement( 'a' );
      link.href = window.URL.createObjectURL( bl );
      link.download = xlsxName;
      link.click();
      window.URL.revokeObjectURL( link.href );
      if ( callBack ) callBack();
    } else if ( callBack ) callBack();
  } ).catch( () => {
    notification.error( {
      message: formatMessage( { id: 'strategyMall.export.file.failed' } ),
      description: formatMessage( { id: 'strategyMall.export.file.failed.message' } ),
    } );
  } )
}



/**
 * 导出文件或加入导出队列，权益和活动的大部分接口后端都是加入导出队列
 *
 * @param {string} type - serviceObj 的类型 如 activityService
 * @param {string} uri - 接口地址，包含了拼接的参数
 * @param {string} xlsxName - 导出文件名，*.xlsx, *.txt
 * @param {function} callBack - 回调
 * @param {string} responseType - 响应类型，blob或POST,默认为POST
 * @return {Promise<Blob>}  下载文件或者加入队列成功消息弹窗
 */
export function exportXlsx( { type, uri, xlsxName, callBack, data, responseType = "POST" } ) {
  const TOKEN = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' ) || sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
  const tokenObj = TOKEN ? { 'baggage_context.x-auth-token': TOKEN } : {};
  const { path, params } = parseQueryString( uri )
  const body = data || {
    ...params,
    page: {}
  };

  const { orderBy, pageSize, pageNum } = params;
  if ( orderBy ) body.page.orderBy = orderBy;
  if ( pageSize ) body.page.pageSize = pageSize;
  if ( pageNum ) body.page.pageNum = pageNum;
  ['orderBy', 'pageSize', 'pageNum'].forEach( key => delete body[key] );
  // const xGatewayHostObj = {
  //   'userService' : 'b4fo6yxqgfc8n9km.apigateway.antdev.xdcloud.com',
  //   'activityService' : 'dlww2jfxo18k83o6.apigateway.antdev.xdcloud.com',
  //   'rightService': 'oezspffnlmikunij.apigateway.antdev.xdcloud.com',
  //   'statisticsService': 'hop6xb1r9s2a8req.apigateway.antdev.xdcloud.com',
  //   'fileService': '7q8skcf1kelp6zpo.apigateway.antdev.xdcloud.com',
  // }
  return fetch( `${serviceObj[type]}/${path}`, {
    method: 'POST',
    responseType,
    headers: {
      ...tokenObj,
      // 'x-gateway-host': xGatewayHostObj[type],
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body:JSON.stringify( body )
  } ).then( res => {
    return res.blob();
  } ).then( blob => {
    // 暂时处理方法 后端返回message:"任务已提交，请在导出任务中查看"大小为97b
    if ( blob.size > 100 ) {
      // application/vnd.ms-excel -> xlsx文件
      // text/plain -> txt文件
      const bl = new Blob( [blob], { type: blob.type } );
      const link = document.createElement( 'a' );
      link.href = window.URL.createObjectURL( bl );
      link.download = xlsxName;
      link.click();
      window.URL.revokeObjectURL( link.href );
      if ( callBack ) callBack();
    } else {
      if ( callBack ) callBack();
      showSuccess();
    }
  } ).catch( () => {
    notification.error( {
      message: formatMessage( { id: 'strategyMall.export.file.failed' } ),
      description: formatMessage( { id: 'strategyMall.export.file.failed.message' } ),
    } );
  } )
}

// 获取路由上的参数
export function getUrlParameter( parameterName, str ) {
  const reg = new RegExp( `(^|&|\\?)${parameterName}=([^&]*)(&|$)`, 'i' );
  let arr;
  let arr1;
  if ( str ) {
    arr = str.match( reg );
    arr1 = str.match( reg );
  } else {
    arr = window.location.search.substr( 1 ).match( reg );
    arr1 = window.location.hash.substr( 2 ).match( reg );
  }

  if ( arr ) {
    return arr[2];
  }
  if ( arr1 ) {
    return arr1[2];
  }

  return null;
}

export const activityObj = {
  BIG_WHEEL: {
    namespace: 'dazhuanpan',
    key: 'BIG_WHEEL',
    name: '大转盘',
    sessionType: 'bigwheel_edit_id',
    editUrl: 'editBigWheel',
    activityUrl: activityBigWheelUrl,
    addUrl: 'addBigWheel',
  },
  SCRATCH_CARD: {
    namespace: 'guaguaka',
    key: 'SCRATCH_CARD',
    name: '刮刮卡',
    sessionType: 'scratvh_edit_id',
    editUrl: 'editScratvhCard',
    activityUrl: activityScratchCardUrl,
    addUrl: 'addScratchCard',
  },
  FLASH_SALES: {
    namespace: 'miaosha',
    key: 'FLASH_SALES',
    name: '秒杀',
    sessionType: 'flashSales_edit_id',
    editUrl: 'editFlashSales',
    activityUrl: activitySeckillUrl,
    addUrl: 'addFlashSales',
  },
  RUSH_COUPON: {
    namespace: 'qiangquan',
    key: 'RUSH_COUPON',
    name: '抢券',
    sessionType: 'coupon_edit_id',
    editUrl: 'editCoupon',
    activityUrl: activityGrabCouponUrl,
    addUrl: 'addCoupon',
  },
  PASSWORD_EXCHANGE: {
    namespace: 'kouling',
    key: 'PASSWORD_EXCHANGE',
    name: '口令兑换',
    sessionType: 'password_edit_id',
    editUrl: 'editPassword',
    activityUrl: activityPasswordUrl,
    addUrl: 'addPassword',
  },
  PLACE_ORDER_WITH_PRIZE: {
    namespace: 'xiadanyouli',
    key: 'PLACE_ORDER_WITH_PRIZE',
    name: '下单有礼',
    sessionType: 'placeOrder_edit_id',
    editUrl: 'editOrderCourtesy',
    activityUrl: 'https://m.jiniutech.com/s-mall/#/', // 下单有礼跳商城首页
    addUrl: 'addOrderCourtesy',
  },
  DRAW_LOTS: {
    namespace: 'chouqian',
    key: 'DRAW_LOTS',
    name: '抽签',
    sessionType: 'draw_edit_id',
    editUrl: 'editDraw',
    activityUrl: activityDrawUrl,
    addUrl: 'addDraw',
  },
  SMASH_EGGS: {
    namespace: 'zajindan',
    key: 'SMASH_EGGS',
    name: '砸金蛋',
    sessionType: 'egg_edit_id',
    editUrl: 'editEggFrenzy',
    activityUrl: activityEggsUrl,
    addUrl: 'addEggFrenzy',
  },
  COLLECT_CARD: {
    namespace: 'jika',
    key: 'COLLECT_CARD',
    name: '集卡',
    sessionType: 'collect_edit_id',
    editUrl: 'editCollectCard',
    activityUrl: activityGleanCardUrl,
    addUrl: 'addCollectCard',
  },
  DOLL_MACHINE: {
    namespace: 'zhuawawa',
    key: 'DOLL_MACHINE',
    name: '娃娃机',
    sessionType: 'prizeclaw_edit_id',
    editUrl: 'editPrizeClaw',
    activityUrl: prizeClawUrl,
    addUrl: 'addPrizClaw',
  },
  RANDOM_CARD: {
    namespace: 'suijika',
    key: 'RANDOM_CARD',
    name: '随机卡',
    sessionType: 'randomCard_edit_id',
    editUrl: 'editRandomCard',
    activityUrl: activityRandomCardUrl,
    addUrl: 'addRandomCard',
  },
  RED_PACKET_RAIN: {
    namespace: 'hongbaoyu',
    key: 'RED_PACKET_RAIN',
    name: '红包雨',
    sessionType: 'redRain_edit_id',
    editUrl: 'editRedRain',
    activityUrl: activityRedRainUrl,
    addUrl: 'addRedRain',
  },
  ANSWER: {
    namespace: 'dati2',
    key: 'ANSWER',
    name: '答题活动',
    sessionType: 'answer_edit_id',
    editUrl: 'editAnswer',
    activityUrl: answerUrl,
    addUrl: 'addAnswer',
  },
  BARRAGE: {
    namespace: 'danmu',
    key: 'BARRAGE',
    name: '弹幕活动',
    sessionType: 'barrage_edit_id',
    editUrl: 'editBarrage',
    activityUrl: barrageUrl,
    addUrl: 'addBarrage',
  },
  QUESTIONNAIRE: {
    namespace: 'wenjuan',
    key: 'QUESTIONNAIRE',
    name: '问卷活动',
    sessionType: 'questionnaire_edit_id',
    editUrl: 'editQuestionnaire',
    activityUrl: questionnaireUrl,
    addUrl: 'addQuestionnaire',
  },
  ANSWER_COMPETITION: {
    namespace: 'dati-chiji',
    key: 'ANSWER_COMPETITION',
    name: '吃鸡答题活动',
    sessionType: 'editAnswerCompetition_edit_id',
    editUrl: 'editAnswerCompetition',
    activityUrl: answerCompetitionUrl,
    addUrl: 'addAnswerCompetition',
  },
  K_LINE_ARENAS: {
    namespace: 'juedou',
    key: 'K_LINE_ARENAS',
    name: 'K线角斗场',
    sessionType: 'arenas_edit_id',
    editUrl: 'editKLineArena',
    activityUrl: activityKLineArenaUrl,
    addUrl: 'addKLineArena',
  },
  GUESS_GAME: {
    namespace: 'caizhangdie',
    key: 'GUESS_GAME',
    name: '猜涨跌',
    sessionType: 'guess_edit_id',
    editUrl: 'editGuessGame',
    activityUrl: guessMarketUrl,
    addUrl: 'addGuessGame',
  },
  FUND_BATTLE: {
    namespace: 'duiduipeng',
    key: 'FUND_BATTLE',
    name: '基金对对碰',
    sessionType: 'fundCollision_edit_id',
    editUrl: 'editFundCollision',
    activityUrl: fundCollisionUrl,
    addUrl: 'addFundCollision',
  },
  WATERMELON: {
    namespace: 'daxigua',
    key: 'WATERMELON',
    name: '大西瓜',
    sessionType: 'bigWatermelon_edit_id',
    editUrl: 'editBigWatermelonGame',
    activityUrl: bigWatermelonUrl,
    addUrl: 'addBigWatermelonGame',
  },
};

/**
 * @example 根据图片宽度比例放大高度
 * @param {string} url  图片地址
 * @param {number} width 图片现宽度
 * @returns
 */
export function widthEnlargesPictureHeight( url, width ) {
  if ( !url || !width ) Promise.reject()
  return new Promise( ( res, rej ) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const imgScale = img.width / parseFloat( width );
      const height = Math.round( img.height / imgScale ) || 0;
      res( height );
    };
    img.onerror = () => {
      rej()
    }
  } );
}

/** 数学计算，解决精度问题 start */
/**
 * https://www.jianshu.com/p/ba72b2c4fe2b
 */
function add( num1, num2 ) {
  num1 = num1.toString().indexOf( '.' ) < 0 ? `${num1.toString()}.0` : num1
  num2 = num2.toString().indexOf( '.' ) < 0 ? `${num2.toString()}.0` : num2
  let r1 = 0
  let r2 = 0
  let m = 0
  try {
    r1 = num1.toString().split( '.' )[1].length
  } catch ( e ) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split( '.' )[1].length
  } catch ( e ) {
    r2 = 0
  }
  m = 10 ** Math.max( r1, r2 )
  return Math.round( num1 * m + num2 * m ) / m
}

function subtract( num1, num2 ) {
  num1 = num1.toString().indexOf( '.' ) < 0 ? `${num1.toString()}.0` : num1
  num2 = num2.toString().indexOf( '.' ) < 0 ? `${num2.toString()}.0` : num2
  let r1 = 0
  let r2 = 0
  let m = 0
  let n = 0
  try {
    r1 = num1.toString().split( '.' )[1].length
  } catch ( e ) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split( '.' )[1].length
  } catch ( e ) {
    r2 = 0
  }

  m = 10 ** Math.max( r1, r2 )
  n = r1 >= r2 ? r1 : r2
  return ( Math.round( num1 * m - num2 * m ) / m ).toFixed( n )
}

function multiply( num1, num2 ) {
  let m = 0
  if ( num1 == null ) {
    num1 = 0
  }
  let s1 = num1.toString()
  let s2 = num2.toString()
  if ( s1.indexOf( '.' ) < 0 ) s1 += '.0'
  if ( s2.indexOf( '.' ) < 0 ) s2 += '.0'
  try {
    m += s1.split( '.' )[1].length
  } catch ( e ) {
    // eslint-disable-next-line no-console
    console.log( e )
  }
  try {
    m += s2.split( '.' )[1].length
  } catch ( e ) {
    // eslint-disable-next-line no-console
    console.log( e )
  }
  return ( Number( s1.replace( '.', '' ) ) * Number( s2.replace( '.', '' ) ) ) / ( 10 ** m )
}

function divide( num1, num2 ) {
  num1 = num1.toString().indexOf( '.' ) < 0 ? `${num1.toString()}.0` : num1
  num2 = num2.toString().indexOf( '.' ) < 0 ? `${num2.toString()}.0` : num2
  let t1 = 0
  let t2 = 0
  let r1 = 0
  let r2 = 0
  try {
    t1 = num1.toString().split( '.' )[1].length
  } catch ( e ) {
    t1 = 0
  }
  try {
    t2 = num2.toString().split( '.' )[1].length
  } catch ( e ) {
    t2 = 0
  }
  r1 = Number( num1.toString().replace( '.', '' ) )
  r2 = Number( num2.toString().replace( '.', '' ) )
  return ( r1 / r2 ) * ( 10 ** ( t2 - t1 ) )
}


// 富文本全量替换
export function onReplaceFontSize( content ) {
  let newContent = content;
  if ( content ) {
    const reg = /(\s*\d+\.?\d*)(px|pt)(\s*;?\s*)/g;
    const contentText = content.replace(
      reg, ( match, capture1 ) => `${capture1 / 16}rem;` );
    newContent = contentText.replace( /<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1' )
      .replace( /<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1' )
      .replace( /<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1' )
      .replace( /<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1' )
      .replace( /<img([\s\w"-=\/\.:;]+)/ig, '<img style="width: 100%;" $1' );
  }
  return newContent;
}

export const mathematicalCalculation = {
  add,
  subtract,
  multiply,
  divide
}
/** 数学计算，解决精度问题 end */

// 验证富文本空校验
export const validatorRichTxt = ( rule, value, callback, tips = "请输入富文本内容" ) => {
  if ( value.replace( /<p(?:(?!<\/p>).|\n)*?>/gm, "" ).replace( /<\/p>/gm, "" ).replace( /&nbsp;/gi, "" ) ) {
    callback()
  } else {
    callback( tips )
  }
}

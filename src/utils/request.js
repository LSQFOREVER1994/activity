/* eslint-disable no-irregular-whitespace */
import fetch from 'dva/fetch';
import { notification, message, Modal } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { stringify } from 'qs';
import cookies from 'js-cookie';
// import { isAntdPro } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = ( response, callUrl ) => {
  if ( response.status >= 200 && response.status < 300 ) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error( {
    message: `请求错误 ${response.status}: ${callUrl}`,
    description: errortext,
  } );
  const error = new Error( errortext );
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = ( response, hashcode ) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get( 'Content-Type' );
  if ( contentType && contentType.match( /application\/json/i ) ) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then( () => {
        // sessionStorage.setItem( hashcode, content );
        sessionStorage.setItem( `${hashcode}:timestamp`, Date.now() );
      } );
  }
  return response;
};

const changeDatas = ( response, callUrl ) => {
  if ( response.status === 200 ) {
    const TOKEN = response.headers.get( 'x-auth-token' );
    const expires = new Date( new Date().getTime() + 24 * 60 * 60 * 1000 );
    if ( TOKEN ) {
      cookies.set( 'JINIU_DATA_PRODUCT_CMS_TOKEN', TOKEN, { expires } );
      sessionStorage.removeItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )
    }
    if( callUrl.indexOf( '/user-service/users/ssoLogin' ) > -1 ){
      if ( TOKEN ) {
      sessionStorage.setItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN', TOKEN )
      cookies.remove( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )
      }
    }else if ( callUrl.indexOf( '/user-service/users/logout' ) > -1 ) {
      // 如果是退出登录就删除缓存
      localStorage.removeItem( 'JINIU-CMS-authority' );
      localStorage.removeItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO' );
      cookies.remove( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
      sessionStorage.removeItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )
    }
  }

  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
// eslint-disable-next-line no-unused-vars
export default function request( url, option, formType = 'FORM', isFile ) {
  const callUrl = url;
  const options = {
    ...option,
  };
  const TOKEN = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' ) || sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
  const tokenObj = TOKEN ? { 'baggage_context.x-auth-token': TOKEN } : {};
  const fingerprint = callUrl + ( options.body ? JSON.stringify( options.body ) : '' );
  const hashcode = hash
  .sha256()
  .update( fingerprint )
  .digest( 'hex' );

  // !!! 不同服务对应不同的 headers[x-gateway-host]
  // const pathParts = url.split( '/' ).filter( part => part );
  // const serviceName = pathParts.find( part => part.endsWith( '-service' ) ) || '';
  // const xGatewayHostObj = {
  //   'user-service' : 'b4fo6yxqgfc8n9km.apigateway.antdev.xdcloud.com',
  //   'activity-service' : 'dlww2jfxo18k83o6.apigateway.antdev.xdcloud.com',
  //   'right-service': 'oezspffnlmikunij.apigateway.antdev.xdcloud.com',
  //   'statistics-service': 'hop6xb1r9s2a8req.apigateway.antdev.xdcloud.com',
  //   'file-service': '7q8skcf1kelp6zpo.apigateway.antdev.xdcloud.com',
  // }
  // !!! 不同服务对应不同的 headers[x-gateway-host]

  const optionsObj = {
        ...options,
        body: JSON.stringify( options.body || {} ),
        method: 'POST',
        headers: {
          // 'x-gateway-host': xGatewayHostObj[serviceName],
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
          ...tokenObj
        },
      }
      
      return fetch( callUrl, optionsObj )
    .then( response => checkStatus( response, callUrl ) )
    .then( response => cachedSave( response, hashcode ) )
    .then( response => changeDatas( response, callUrl ) )
    .then( response => {
      return response.json();
    } )
    .then( response => {
      if( response.code === 2002 ){
        notification.error( {
          message: `账号存在安全风险，请及时修改密码！`,
          description: response.message,
        }, 5000 );
        const { href } = window.location;
        router.replace( {
          pathname: '/user/modifyPassword',
          search: stringify( {
            redirect: href,
          } ),
        } );
      }
      if ( response.code === 2001 ) {
        cookies.remove( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
        localStorage.removeItem( 'JINIU-CMS-authority' );
        localStorage.removeItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO' );
        const hiddenBar = sessionStorage.getItem( 'hiddenBar' )
        if( hiddenBar ){
          const callBackUrlMap= {
            dev:'http://s-cms30.test.jiniutech.cn',
            uat:'http://uat.cms.jiniutech.com',
            pro:'https://api.jiniutech.com', // 生产暂时没有 TODO:
          }
          window.parent.postMessage( {
            code: 2001,
            message: "登录过期，请重新登录！",
          }, callBackUrlMap[BUILD_ENV] );
        }
        // else if( window.location.hash === '#/activityTemplate/bees' ){
        //   if( window.onShowLoginModal ) window.onShowLoginModal()
        // }
      else{
          // setTimeout( () => {
          //   const { href } = window.location;
          //   if ( href.indexOf( 'redirect' ) <= -1 ) {
          //     router.replace( {
          //       pathname: '/user/login',
          //       search: stringify( {
          //         redirect: href,
          //       } ),
          //     } );
          //   }
          // }, 100 )
          if( window.modal_show ) return;
          window.modal_show = true
          Modal.confirm( {
            content: '身份信息已过期，请重新登录',
            okText: '确定',
            cancelText: '取消',
            // icon: <Icon style={{ color: '#54c51c' }} type="check-circle" />,
            onOk() {
              window.location.href = BUILD_ENV === 'pro' ? 'https://xdoa.cindasc.com/XDZQ/login.shtml' : 'http://192.168.96.41:8088/XDZQ/login.shtml'
              window.modal_show = false
            },
            onCancel() { 
              window.modal_show = false
            },
          } );
        }
      } else if ( response.code !== 200 ) {
        if ( response.tip || response.message ) {
          message.error( response.tip || response.message );
        }
      }
      return response;
    } )
    .catch( e => {
      const status = e.name;
      if ( status === 401 ) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch( {
          type: 'login/logout',
        } );
        return;
      }
      // environment should not be used
      if ( status === 403 ) {
        router.push( '/exception/403' );
        return;
      }
      if ( status <= 504 && status >= 500 ) {
        router.push( '/exception/500' );
        return;
      }
      if ( status >= 404 && status < 422 ) {
        router.push( '/exception/404' );
      }
    } );
}


export function request2( url, option, formType = 'FORM', isFile ) {
  let callUrl = url;
  const options = {
    ...option,
  };
  const TOKEN = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' ) || sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
  const tokenObj = TOKEN ? { 'X-Auth-Token': TOKEN } : {};

  // const expires = new Date( new Date().getTime() + ( 2 * 60 * 60 * 1000 ) );
  // if ( TOKEN ) {
  //   cookies.set( 'JINIU_DATA_PRODUCT_CMS_TOKEN', TOKEN, { expires } );
  //   sessionStorage.setItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN', TOKEN )
  // }
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = callUrl + ( options.body ? JSON.stringify( options.body ) : '' );
  const hashcode = hash
    .sha256()
    .update( fingerprint )
    .digest( 'hex' );

  let newOptions = { ...options };
  if ( option.method === 'POST' || option.method === 'PUT' || option.method === 'DELETE' ) {
    if ( !( newOptions.body instanceof FormData ) ) {
      if ( formType === 'FORM' ) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          ...newOptions.headers,
          ...tokenObj,
        };
        if ( isFile ) {
          delete newOptions.headers['Content-Type'];
          const data = new FormData();
          Object.entries( newOptions.body ).forEach( ( item ) => {
            const value = item[1] === false ? item[1] : item[1] || ''
            data.append( item[0], value );
          } );
          newOptions.body = data;
        } else {
          newOptions.body = stringify( newOptions.body );
        }
      } else if ( formType === 'JSON' ) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...newOptions.headers,
          ...tokenObj,
        };
        newOptions.body = JSON.stringify( newOptions.body );
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
        ...tokenObj,
      };
    }
  } else if ( option.method === 'GET' || option.method === 'PATCH' ) {
    const { body } = option;
    if ( body ) {
      const paramsArray = [];
      // 拼接参数
      /* eslint-disable consistent-return */
      Object.keys( body ).forEach( key => {
        if ( body[key] || body[key] === false || body[key] === 0 ) {
          return paramsArray.push( `${key}=${encodeURIComponent( body[key] )}` );
        }
      } );
      /* eslint-enable consistent-return */

      if ( url.search( /\?/ ) === -1 ) {
        callUrl += `?${paramsArray.join( '&' )}`;
      } else {
        callUrl += `&${paramsArray.join( '&' )}`;
      }
    } else {
      callUrl = url;
    }
    newOptions = !TOKEN
      ? { method: option.method }
      : {
          method: option.method,
          headers: {
            ...tokenObj,
          },
        };
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if ( options.expirys !== false ) {
    const cached = sessionStorage.getItem( hashcode );
    const whenCached = sessionStorage.getItem( `${hashcode}:timestamp` );
    if ( cached !== null && whenCached !== null ) {
      const age = ( Date.now() - whenCached ) / 1000;
      if ( age < expirys ) {
        const response = new Response( new Blob( [cached] ) );
        return response.json();
      }
      sessionStorage.removeItem( hashcode );
      sessionStorage.removeItem( `${hashcode}:timestamp` );
    }
  }
  return fetch( callUrl, newOptions )
    .then( response => checkStatus( response, callUrl ) )
    .then( response => cachedSave( response, hashcode ) )
    .then( response => changeDatas( response, callUrl ) )
    .then( response => {
      return response.json();
    } )
    .then( response => {
      if( response.code === 2002 ){
        notification.error( {
          message: `账号存在安全风险，请及时修改密码！`,
          description: response.message,
        }, 5000 );
        const { href } = window.location;
        router.replace( {
          pathname: '/user/modifyPassword',
          search: stringify( {
            redirect: href,
          } ),
        } );
      }
      if ( response.code === 2001 ) {
        cookies.remove( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
        localStorage.removeItem( 'JINIU-CMS-authority' );
        localStorage.removeItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO' );
        const hiddenBar = sessionStorage.getItem( 'hiddenBar' )
        if( hiddenBar ){
          const callBackUrlMap= {
            dev:'http://s-cms30.test.jiniutech.cn',
            uat:'http://uat.cms.jiniutech.com',
            pro:'https://api.jiniutech.com', // 生产暂时没有 TODO:
          }
          window.parent.postMessage( {
            code: 2001,
            message: "登录过期，请重新登录！",
          }, callBackUrlMap[BUILD_ENV] );
        }
        // else if( window.location.pathname === '/activityTemplate/bees' ){
        //   if( window.onShowLoginModal ) window.onShowLoginModal()
        // }
        else{
          // setTimeout( () => {
          //   const { href } = window.location;
          //   if ( href.indexOf( 'redirect' ) <= -1 ) {
          //     router.replace( {
          //       pathname: '/user/login',
          //       search: stringify( {
          //         redirect: href,
          //       } ),
          //     } );
          //   }
          // }, 100 )
          Modal.confirm( {
            content: '导出请求已加载到队列中，稍等可在导出列表中下载。',
            okText: '立即查看',
            cancelText: '关闭',
            // icon: <Icon style={{ color: '#54c51c' }} type="check-circle" />,
            onOk() {
              window.open( `#/system/exportList` )
            },
            onCancel() { },
          } );
        }
      } else if ( response.code !== 200 ) {
        if ( response.tip || response.message ) {
          message.error( response.tip || response.message );
        }
      }
      return response;
    } )
    .catch( e => {
      const status = e.name;
      if ( status === 401 ) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch( {
          type: 'login/logout',
        } );
        return;
      }
      // environment should not be used
      if ( status === 403 ) {
        router.push( '/exception/403' );
        return;
      }
      if ( status <= 504 && status >= 500 ) {
        router.push( '/exception/500' );
        return;
      }
      if ( status >= 404 && status < 422 ) {
        router.push( '/exception/404' );
      }
    } );
}


  // const expires = new Date( new Date().getTime() + ( 2 * 60 * 60 * 1000 ) );
  // if ( TOKEN ) {
  //   cookies.set( 'JINIU_DATA_PRODUCT_CMS_TOKEN', TOKEN, { expires } );
  //   sessionStorage.setItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN', TOKEN )
  // }
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  // const fingerprint = callUrl + ( options.body ? JSON.stringify( options.body ) : '' );
  // const hashcode = hash
  //   .sha256()
  //   .update( fingerprint )
  //   .digest( 'hex' );

//   let newOptions = { ...options };
//   if ( option.method === 'POST' || option.method === 'PUT' || option.method === 'DELETE' ) {
//     if ( !( newOptions.body instanceof FormData ) ) {
//       if ( formType === 'FORM' ) {
//         newOptions.headers = {
//           Accept: 'application/json',
//           'Content-Type': 'application/x-www-form-urlencoded',
//           ...newOptions.headers,
//           ...tokenObj,
//         };
//         if ( isFile ) {
//           delete newOptions.headers['Content-Type'];
//           const data = new FormData();
//           Object.entries( newOptions.body ).forEach( ( item ) => {
//             const value = item[1] === false ? item[1] : item[1] || ''
//             data.append( item[0], value );
//           } );
//           newOptions.body = data;
//         } else {
//           newOptions.body = stringify( newOptions.body );
//         }
//       } else if ( formType === 'JSON' ) {
//         newOptions.headers = {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           ...newOptions.headers,
//           ...tokenObj,
//         };
//         newOptions.body = JSON.stringify( newOptions.body );
//       }
//     } else {
//       // newOptions.body is FormData
//       newOptions.headers = {
//         Accept: 'application/json',
//         ...newOptions.headers,
//         ...tokenObj,
//       };
//     }
//   } else if ( option.method === 'GET' || option.method === 'PATCH' ) {
//     const { body } = option;
//     if ( body ) {
//       const paramsArray = [];
//       // 拼接参数
//       /* eslint-disable consistent-return */
//       Object.keys( body ).forEach( key => {
//         if ( body[key] || body[key] === false || body[key] === 0 ) {
//           return paramsArray.push( `${key}=${encodeURIComponent( body[key] )}` );
//         }
//       } );
//       /* eslint-enable consistent-return */

//       if ( url.search( /\?/ ) === -1 ) {
//         callUrl += `?${paramsArray.join( '&' )}`;
//       } else {
//         callUrl += `&${paramsArray.join( '&' )}`;
//       }
//     } else {
//       callUrl = url;
//     }
//     newOptions = !TOKEN
//       ? { method: option.method }
//       : {
//           method: option.method,
//           headers: {
//             ...tokenObj,
//           },
//         };
//   }

//   const expirys = options.expirys && 60;
//   // options.expirys !== false, return the cache,
//   if ( options.expirys !== false ) {
//     const cached = sessionStorage.getItem( hashcode );
//     const whenCached = sessionStorage.getItem( `${hashcode}:timestamp` );
//     if ( cached !== null && whenCached !== null ) {
//       const age = ( Date.now() - whenCached ) / 1000;
//       if ( age < expirys ) {
//         const response = new Response( new Blob( [cached] ) );
//         return response.json();
//       }
//       sessionStorage.removeItem( hashcode );
//       sessionStorage.removeItem( `${hashcode}:timestamp` );
//     }
//   }

//   const optionsObj = {
//     ...newOptions,
//     headers: {
//       'x-gateway-host': 'b4fo6yxqgfc8n9km.apigateway.antdev.xdcloud.com',
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       ...newOptions.headers,
//     },
//   }
//   return fetch( callUrl, optionsObj )
//     .then( response => checkStatus( response, callUrl ) )
//     .then( response => cachedSave( response, hashcode ) )
//     .then( response => changeDatas( response, callUrl ) )
//     .then( response => {
//       return response.json();
//     } )
//     .then( response => {
//       if( response.code === 2002 ){
//         notification.error( {
//           message: `账号存在安全风险，请及时修改密码！`,
//           description: response.message,
//         }, 5000 );
//         const { href } = window.location;
//         router.replace( {
//           pathname: '/user/modifyPassword',
//           search: stringify( {
//             redirect: href,
//           } ),
//         } );
//       }
//       if ( response.code === 2001 ) {
//         cookies.remove( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
//         localStorage.removeItem( 'JINIU-CMS-authority' );
//         localStorage.removeItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO' );
//         const hiddenBar = sessionStorage.getItem( 'hiddenBar' )
//         if( hiddenBar ){
//           const callBackUrlMap= {
//             dev:'http://s-cms30.test.jiniutech.cn',
//             uat:'http://uat.cms.jiniutech.com',
//             pro:'https://api.jiniutech.com', // 生产暂时没有 TODO:
//           }
//           window.parent.postMessage( {
//             code: 2001,
//             message: "登录过期，请重新登录！",
//           }, callBackUrlMap[BUILD_ENV] );
//         }else if( window.location.pathname === '/activityTemplate/bees' ){
//           if( window.onShowLoginModal ) window.onShowLoginModal()
//         }else{
//           setTimeout( () => {
//             const { href } = window.location;
//             if ( href.indexOf( 'redirect' ) <= -1 ) {
//               router.replace( {
//                 pathname: '/user/login',
//                 search: stringify( {
//                   redirect: href,
//                 } ),
//               } );
//             }
//           }, 100 )
//         }
//       } else if ( response.code !== 200 ) {
//         if ( response.tip || response.message ) {
//           message.error( response.tip || response.message );
//         }
//       }
//       return response;
//     } )
//     .catch( e => {
//       const status = e.name;
//       if ( status === 401 ) {
//         // @HACK
//         /* eslint-disable no-underscore-dangle */
//         window.g_app._store.dispatch( {
//           type: 'login/logout',
//         } );
//         return;
//       }
//       // environment should not be used
//       if ( status === 403 ) {
//         router.push( '/exception/403' );
//         return;
//       }
//       if ( status <= 504 && status >= 500 ) {
//         router.push( '/exception/500' );
//         return;
//       }
//       if ( status >= 404 && status < 422 ) {
//         router.push( '/exception/404' );
//       }
//     } );
// }

// export function download( url ) {
//   const TOKEN = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' ) || sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
//   const tokenObj = TOKEN ? { 'baggage_context.x-auth-token': TOKEN } : {};
//   return fetch( url, {
//     method: 'get',
//     responseType: 'blob',
//     headers: {
//       ...tokenObj,
//     }
//   } ).then( res => {
//     return res.blob();
//   } ).then( blob => {
//     const bl = new Blob( [blob], { type: "application/vnd.ms-excel" } );
//     const fileName = '补发名单.xlsx';
//     const link = document.createElement( 'a' );
//     link.href = window.URL.createObjectURL( bl );
//     link.download = fileName;
//     link.click();
//     window.URL.revokeObjectURL( link.href );
//   } )
// }

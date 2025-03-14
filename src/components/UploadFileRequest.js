
import cookies from 'js-cookie';
import { stringify } from 'qs';
import router from 'umi/router';
import { message } from 'antd';
import reqwest from 'reqwest';
import serviceObj from '@/services/serviceObj';

let failFunc = () => { }

const fileRequest = ( { url, method = 'GET', header={}, tokenName, data, success = () => { } }, noResult ) => {
  const token = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )|| sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
  const TOKEN_NAME = tokenName || 'baggage_context.x-auth-token'
  const tokenObj = token ? { [TOKEN_NAME]: token } : {};
  reqwest( {
    url,
    method,
    processData: false,
    headers: Object.assign( {
      Accept: 'application/json',
      ...header
    }, tokenObj ),
    data,
    success: ( res ) => {
      if ( noResult ) {
        if ( res.readyState === 4 && ( res.status >= 200 && res.status < 400 ) ) {
          success()
        }
      } else if ( res.success ) {
        success( res.result )
      } else {
        message.error( res.message );
        if ( res.code === 2001 ) {
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
          }else{
            setTimeout( () => {
              const { href } = window.location;
              if ( href.indexOf( 'redirect' ) <= -1 ) {
                router.replace( {
                  pathname: '/user/login',
                  search: stringify( {
                    redirect: href,
                  } ),
                } );
              }
            }, 100 )
          }
        }
      }
    },
    error: () => {
      failFunc()
      message.error( "文件上传失败！" );
    },
  } );
}

const sendConfirm = ( { uuid, parentFunc } ) => {
  const url = `${serviceObj.libraryService}/files/confirm?uuid=${uuid}`
  fileRequest( {
    url,
    method: 'POST',
    success: ( res ) => {
      const file = {
        url: res,
        uid: uuid
      }
      if ( parentFunc ) parentFunc( file );
    }
  } )
}

/**
 * 上传到服务器
 */
const sendSevice = ( { formData, uuid }, libraryType, parentFunc ) => {
  let url = `${serviceObj.fileUploadService}/files/${uuid}`; // 上传到我的素材
  if ( libraryType === 'public' ) url = `${serviceObj.fileUploadService}/files/common/${uuid}`; // 上传到公共素材库
  fileRequest( {
    url,
    method: 'POST',
    data: formData,
    tokenName:'X-Auth-Token',
    success: ( res ) => {
      const file = {
        url: res,
        uid: uuid
      }
      if ( parentFunc ) parentFunc( file );
    }
  } )
}

/**
 * 上传到腾讯云
 */
const sendCos = ( { file, url, uuid }, parentFunc ) => {
  fileRequest( {
    url,
    method: 'PUT',
    data: file,
    success: () => {
      sendConfirm( { uuid, parentFunc } )
    }
  }, true )
}

/**
 * 上传到阿里云
 */
// const sendOss = ( ) => {
//   // TODO: 生产支持大文件
// }

const uploadFileRequest = ( { formData, file, categoryId, libraryType, parentFunc, parentFailFunc } ) => {
  const url = `${serviceObj.libraryService}/files/upload/pre`
  failFunc = parentFailFunc;
  const data = { originalName: file.name }
  if( categoryId ) data.categoryId = categoryId
  fileRequest( {
    method:'POST',
    url,
    data:JSON.stringify( data ),
    header:{
      // 'x-gateway-host': '7q8skcf1kelp6zpo.apigateway.antdev.xdcloud.com',
      'Content-Type': 'application/json',
    },
    success: ( res ) => {
      if ( res.uploadLocation === 'cos' ) {
        sendCos( { file, url: res.url, uuid: res.uuid }, parentFunc );
      } else if ( res.uploadLocation === 'oss' ) {
        // TODO: sendOss
        sendSevice( { formData, url: res.url, uuid: res.uuid }, libraryType, parentFunc );
      } else {
        sendSevice( { formData, url: res.url, uuid: res.uuid }, libraryType, parentFunc );
      }
    }
  } )
}




export default uploadFileRequest

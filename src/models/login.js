import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { message } from 'antd';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, getUrlParameter } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { loginFUNC, logoutFunc, changeOrgFunc, getSsoLogin, modifyPassword } from '@/services/login.service';

export default {
  namespace: 'login',

  state: {
    loginData: {},
  },

  effects: {
    *changeOrg( { payload: { key, callBackFunc } }, { call } ) {
      const data = yield call( changeOrgFunc, key );
      if ( data.success ) {
        message.success( data.message );
        callBackFunc( key );
      }
    },

    *login( { payload }, { call, put } ) {
      const data = yield call( loginFUNC, payload );
      if ( data.success ) {
        yield put( {
          type: 'changeLoginData',
          payload: data,
        } );
        message.success( data.message );
        // reloadAuthorized();
        const params = getPageQuery();
        const { redirect } = params;
        if ( redirect && ( redirect.indexOf( window.location.origin ) > -1 ) ) {
          if( redirect.includes( 'login' ) ){
            yield put( routerRedux.replace( '/home' ) );
            return;
          }
          window.location.href = redirect
        } else {
          yield put( routerRedux.replace( '/home' ) );
        }
      }
    },

    *modalLogin( { payload: { query, callBackFun } }, { call, put } ) {
      const data = yield call( loginFUNC, query );
      if ( data.success ) {
        yield put( {
          type: 'changeLoginData',
          payload: data,
        } );
        message.success( data.message );
        if( callBackFun ) {
          callBackFun();
        }
      }
    },

    *getLoginData( _, { put } ) {
      const data = JSON.parse( window.localStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_USERINFO' ) );
      yield put( {
        type: 'setLoginData',
        payload: data,
      } );
    },

    *logout( _, { call, put } ) {
      const data = yield call( logoutFunc );
      if ( data.success ) {
        // reloadAuthorized();
        message.success( data.message );
        yield put(
          routerRedux.replace( {
            pathname: '/user/login',
            // search: stringify( {
            //   redirect: window.location.href,
            // } ),
          } )
        );
      } else {
        message.error( data.message );
      }
    },


    *getSsoLogin( { payload }, { call, put } ) {
      const data = yield call( getSsoLogin, payload );
      if ( data.success ) {
        yield put( {
          type: 'changeLoginData',
          payload: data,
        } );
        // message.success( data.message );
        // reloadAuthorized();
        const urlParams = new URL( window.location.href );
        const params = getPageQuery();
        let { redirect } = params;
        if ( redirect && ( redirect.indexOf( window.location.origin ) > -1 ) ) {
          const redirectUrlParams = new URL( redirect );
          if ( redirectUrlParams.origin === urlParams.origin ) {
            redirect = redirect.substr( urlParams.origin.length );
          } else {
            window.location.href = redirect;
            return;
          }
          yield put( routerRedux.replace( redirect ) );
        } else {
          const menuType = getUrlParameter( 'menuType' )
           let replacePath = '/home'
           if( menuType ){
            if( menuType==='ACTIVITY_AUDIT' )replacePath = '/activityTemplate/activityAudit?isAudit=true'
            if( menuType==='ACTIVITY' )replacePath = '/activityTemplate/template'
            if( menuType==='POINTMALL' )replacePath = '/pointShop/list'
            if( menuType==='STRATEGYMALL' )replacePath = '/strategyMall/categoryList'
            if( menuType==='CONTENT' )replacePath = '/contentMarketing/content/toujiao'
            if( menuType==='EQUITYSUPERMARK' )replacePath = '/equitySupermarket/dataCount'
           }

           let redirectUrl = replacePath;
           if( getUrlParameter( 'redirectUrl' ) ) {
            redirectUrl= decodeURIComponent( getUrlParameter( 'redirectUrl' ) )
           }

          yield put( routerRedux.replace( redirectUrl ) );
        }
      }
    },

    // 未登录修改密码
    *modifyPassword( { payload, callBack }, { call } ) {
      const data = yield call( modifyPassword, payload );
      if ( data.success ) {
        if( callBack ) {
          callBack( data );
        }
      } else {
        message.error( data.message );
      }
    },
  },

  reducers: {
    changeLoginData( state, { payload } ) {
      setAuthority( payload );
      return {
        ...state,
      };
    },
    setLoginData( state, { payload } ) {
      return {
        ...state,
        loginData: payload || {},
      };
    },
  },
};

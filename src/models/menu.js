import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { menu } from '../defaultSettings';
import { fetchMenuList } from '@/services/login.service'

const { check } = Authorized;

// Conversion router to menu.
function formatter( data, parentAuthority, parentName ) {
  if ( !data ) {
    return undefined;
  }
  return data
    .map( item => {
      if ( !item.name || !item.path ) {
        return null;
      }

      let locale = 'menu';
      if ( parentName ) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage( { id: locale, defaultMessage: item.name } );
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if ( item.routes ) {
        const children = formatter( item.routes, item.authority, locale );
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    } )
    .filter( item => item );
}

const memoizeOneFormatter = memoizeOne( formatter, isEqual );

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if ( item.children && !item.hideChildrenInMenu && item.children.some( child => child.name ) ) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {  
  if ( !menuData ) {
    return [];
  }
  return menuData
    .filter( item => item.name && !item.hideInMenu )
    .map( item => check( item.authority, getSubMenu( item ) ) )
    .filter( item => item );
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if ( !menuData ) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach( menuItem => {
      if ( menuItem.children ) {
        flattenMenuData( menuItem.children );
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    } );
  };
  flattenMenuData( menuData );
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne( getBreadcrumbNameMap, isEqual );


const transformData = data => {
  return (
    data?.length &&
    data.map( item => {
      const transformedItem = {
        ...item,
        children: item.childList.length > 0 ? transformData( item.childList ) : [],
        path: item.router
      };
      return transformedItem;
    } )
  );
};

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData( { payload }, { put } ) {
      const { routes, authority } = payload;
      const originalMenuData = memoizeOneFormatter( routes, authority );
      const menuData = filterMenuData( originalMenuData );
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap( originalMenuData );
      yield put( {
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      } );
    },

    *fetchMenuData( { payload:{ callBackFun } }, { call, put } ){
      const { result, success } = yield call( fetchMenuList )
      if( success ){
        const { codes, menuTrees } = result;
        yield put( {
          type:'save',
          payload:{ menuData:transformData( menuTrees ) }
        } )
        localStorage.setItem( 'JINIU-CMS-authority', JSON.stringify( codes ) );
        if( callBackFun ) callBackFun();
      }
    }
  },

  reducers: {
    save( state, action ) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

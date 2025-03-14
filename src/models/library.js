// import { message } from 'antd';
import {
  getCategoryList,
  getMineCategoryList,
  addCategory,
  editCategory,
  delCategory,
  getMaterialList,
  editCategoryAll,
  editMineCategoryAll,
  saveMaterial,
  batchDelMaterial,
  batchEditMaterial,
  uploadUrlFile,
  getEQXiuOpus,
  getAuditList,
  getMineMaterialList,
  commitMaterial,
  batchAuditMaterial,
} from '@/services/library.service';
import { getEqxiuLoginCode } from '@/services/eqxiu.service';

export default {
  namespace: 'library',

  state: {
    loading: false,
    categoryMap: {
      total: 0,
      categoryList: [],
    },
    classList: [], // 分类列表
    authCode: '',
  },

  effects: {
    // 获取我的分类or公共分类列表
    *getCategoryList( { payload, callFunc }, { call, put } ) {
      const query = { ...payload }
      delete query.libraryType
      const data = yield call( payload.libraryType === 'private' ? getMineCategoryList : getCategoryList, query );
      if ( data.success ) {
        // 数据整理
        const arr = data.result || [];
        const allType = {
          id: '',
          mediaType: 'IMAGE',
          name: '全部',
          noEdit: true,
        };
        const defaultType = {
          id: 'default',
          mediaType: 'IMAGE',
          name: '未分组',
          noEdit: true,
        };
        const newArr = [allType, ...arr, defaultType];
        yield put( {
          type: 'SetState',
          payload: { classList: newArr },
        } );
        if ( callFunc ) {
          callFunc( newArr );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 删除分类
    *delCategory( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( delCategory, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },
    // 更新我的or公共的所有分类列表
    *editCategoryAll( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const query = { ...payload }
      delete query.libraryType
      const data = yield call( payload.libraryType === 'private' ? editMineCategoryAll : editCategoryAll, query );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },
    // 新增\修改分类
    *submitCategory( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = payload.id
        ? yield call( editCategory, payload )
        : yield call( addCategory, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 获取素材
    *getMaterialList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getMaterialList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { categoryMap: data.result },
        } );
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 编辑或新增
    *saveMaterial( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( saveMaterial, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 批量删除素材
    *batchDelMaterial( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( batchDelMaterial, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 批量更新素材
    *batchEditMaterial( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( batchEditMaterial, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    *getEqxiuLoginCode( { payload }, { call, put } ) {
      const data = yield call( getEqxiuLoginCode, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { authCode: data.result },
        } );
      }
    },

    *uploadUrlFile( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( uploadUrlFile, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    *getEQXiuOpus( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getEQXiuOpus, payload );
      if ( data ) {
        if ( callFunc ) {
          callFunc( data );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 获取审核素材列表
    *getAuditList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const query = { ...payload, materialName:payload.name }
      delete query.categoryId
      delete query.name
      const data = yield call( getAuditList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { categoryMap: data.result },
        } );
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 素材提交审核
    *commitMaterial( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( commitMaterial, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },


    // 批量审核素材
    *batchAuditMaterial( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( batchAuditMaterial, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 获取我的素材
    *getMineMaterialList( { payload, callFunc }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getMineMaterialList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { categoryMap: data.result },
        } );
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },
  },

  reducers: {
    SetState( state, { payload } ) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

// import { message } from 'antd';
import {
  getComponentIds,
  getBees,
  getBeesInfo,
  addBeesOrEditBees,
  deleteBees,
  getPrizeTypeList,
  getPrizeList,
  userTemplate,
  copyActivity,
  userComponent,
  addToTemplate,
  getComponentList,
  getEligibilityList,
  getEligibilityType,
  getFundListV3,
  getActivityDraft,
  addActivityDraft,
  deleteActivityDraft,
  editActivityDraft,
  getTagList,
  getTemplate,
  setPreview,
  setPublish,
  getGuessProductsList,
  getFontList,
  getXDMallActivityList,
  getXDMallGoodsList,
  // getQrcode,
  getAllActivityList,
  getActivityIdPageList,
  getActivityIdPageData,
  getETFMerchantIdList,
  getETFDatasourceList,
  getETFFundList,
  getETFRankMerchantList,
  getETFCodeFundList,
  getPassBeesInfo,
} from '@/services/drag.service';

import { editTemplate } from '@/services/template.service';

export default {
  namespace: 'beesVersionThree',

  state: {
    loading: false,
    saveLoading:false,
    bees: {
      total: 0,
      list: [],
    },
    prizeTypeList: [],
    prizeList: [],
    template: {},
    eligibilityList: [],
    eligibilityType: [],
    initFundsList: [],
    fundList: [],
    searchTagListMap: [],
    componentListIds: [],
    currentEditId: undefined,
    currentActiveEl: null,
    merchantList: [],
    merchantVisibleList: [],
    allActivityList: [],
    activityIdPageList: [],
    ETFMerchantIdList: [],
    ETFDatasourceIdList: [],
    ETFFundList: [],
    xdMallActivityList:[],
    xdMallGoodsList:[]
  },

  effects: {
    // 获取模版列表
    *getBees( { payload: { query, callBack = () => { } } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getBees, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { bees: data.result },
        } );
        callBack( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 获取单个活动的信息
    *getBeesInfo( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getBeesInfo, query );
      if ( data.success ) {
        successFun( data.result );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 获取通过活动的信息
    *getPassBeesInfo( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getPassBeesInfo, query );
      if ( data.success ) {
        successFun( data.result );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 新增活动
    *addBeesOrEditBees( { payload: { query, successFun, failFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          saveLoading: true,
        },
      } );
      let data = yield call( addBeesOrEditBees, query );
      if ( !data ) data = {}
      if ( data?.success ) {
        successFun( data.result );
      } else if ( failFunc ) {
        failFunc( data.tip || data.message );
      }
      yield put( {
        type: 'SetState',
        payload: {
          saveLoading: false,
        },
      } );
    },

        // 发布活动
        *setPublish( { payload: { query, successFun, failFunc } }, { call, put } ) {
          yield put( {
            type: 'SetState',
            payload: {
              saveLoading: true,
            },
          } );
          let data = yield call( setPublish, query );
          if ( !data ) data = {}
          if ( data?.success ) {
            successFun( data.result );
          } else if ( failFunc ) {
            failFunc( data.tip || data.message );
          }
          yield put( {
            type: 'SetState',
            payload: {
              saveLoading: false,
            },
          } );
        },

    // 编辑活动
    *editBees( { payload: { query, successFun, failFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      let data = yield call( editBees, query );
      if ( !data ) data = {}
      if ( data?.success ) {
        successFun( data.result );
      } else if ( failFunc ) {
        failFunc( data.tip || data.message );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 删除活动
    *deleteBees( { payload: { query, successFun } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( deleteBees, query );
      if ( data.success ) {
        successFun( data.result );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 保存预览活动
    *setPreview( { payload: { query, successFun, failFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          saveLoading: true,
        },
      } );
      let data = yield call( setPreview, query );
      if ( !data ) data = {}
      if ( data?.success && data.result && data.result.previewUrl ) {
        successFun( `${data.result.previewUrl}&preview=1` );
      } else if ( failFunc ) {
        failFunc( data.tip || data.message );
      }
      yield put( {
        type: 'SetState',
        payload: {
          saveLoading: false,
        },
      } );
    },

    // 查询奖品类型
    *getPrizeTypeList( { payload }, { call, put } ) {
      const data = yield call( getPrizeTypeList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { prizeTypeList: data.result },
        } );
      }
    },

    // 模糊搜索奖品
    *getPrizeList( { payload, successFun }, { call, put } ) {
      const data = yield call( getPrizeList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { prizeList: data.result.list },
        } );
        if ( successFun ) successFun( data.result.list );
      }
    },


    // 获取基金列表
    *getFundList( { payload, successFun }, { call, put } ) {
      const data = yield call( getFundListV3, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { initFundsList: data.result.list },
        } )
        if ( successFun ) successFun( data.result.list )
      }
    },

    // 获取字体列表
    *getFontList( { payload, successFun }, { call, put } ) {
      const data = yield call( getFontList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { initFontList: data.result },
        } )
        if ( successFun ) successFun( data.result )
      }
    },

    // 获取id
    *getSingleId( { payload: { successFun, failFun } }, { call } ) {
      const data = yield call( getComponentIds, 1 );
      if ( data && data.success ) {
        if ( successFun ) successFun( data.result[0] );
      } else if ( failFun ) {
        failFun()
      }
    },

    // 批量获取id
    *getComponentIds( { payload: { query, successFun, failFun } }, { call } ) {
      const data = yield call( getComponentIds, query );
      if ( data && data.success ) {
        if ( successFun ) successFun( data.result );
      } else if ( failFun ) {
        failFun()
      }
    },

    // 更新ids
    *updateComponentIds( { payload: { query, successFun } }, { put } ) {
      yield put( {
        type: 'SetState',
        payload: { componentListIds: query.componentListIds },
      } );
      if ( successFun ) successFun();
    },

    // 使用活动模版
    *userTemplate( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( userTemplate, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { template: data.result },
        } );
        if ( successFun ) {
          successFun( data.result );
        }
      }
    },

    // 查询模版信息
    *getTemplate( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getTemplate, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { template: data.result },
        } );
        if ( successFun ) {
          successFun( data.result );
        }
      }
    },

    *editTemplate( { payload, callFunc }, { call } ) {
      const data = yield call( editTemplate, payload );
      if ( data.success ) {
        if ( callFunc ) {
          callFunc( data.result );
        }
      }
    },

    // 复制活动
    *copyActivity( { payload: { query, successFun } }, { call } ) {
      const data = yield call( copyActivity, query );
      if ( data.success ) {
        if ( successFun ) {
          successFun( data.result );
        }
      }
    },

    // 使用组件模版
    *userComponent( { payload: { query, successFun } }, { call } ) {
      const data = yield call( userComponent, query );
      if ( data.success ) {
        if ( successFun ) {
          successFun( data.result );
        }
      }
    },

    // 添加至模版库
    *addToTemplate( { payload: { query, successFun } }, { call } ) {
      const data = yield call( addToTemplate, query );
      if ( data.success ) {
        if ( successFun ) {
          successFun( data.result );
        }
      }
    },
    // 获取组件列表
    *getComponentList( { payload }, { call, put } ) {
      const data = yield call( getComponentList, payload );
      if ( data.success ) {
        let list = [];
        if ( data.result && data.result.length > 0 ) {
          const obj = {};
          data.result.forEach( item => {
            const { groupType } = item;
            if ( !obj[groupType] ) {
              obj[groupType] = {
                groupType,
                list: [],
              };
            }
            obj[groupType].list.push( item );
          } );
          list = Object.values( obj );
        }
        yield put( {
          type: 'SetState',
          payload: { componentList: list },
        } );
      }
    },

    // 获取资格列表
    *getEligibilityList( { payload }, { call, put } ) {
      const data = yield call( getEligibilityList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { eligibilityList: data.result },
        } );
      } else {
        yield put( {
          type: 'SetState',
          payload: { eligibilityList: [] },
        } );
      }
    },

    // 获取资格类型
    *getEligibilityType( { payload: { query, successFun } }, { call, put } ) {
      const data = yield call( getEligibilityType, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { eligibilityType: data.result },
        } );
        if ( successFun ) successFun( data.success );
      }
    },

    // // 选择期数
    // *selectPeriodsDate( { payload: { query, successFun }  }, { call } ) {
    //   const data = yield call( selectPeriodsDate, query );
    //   if ( data.success && successFun ) {
    //     successFun( data.message )
    //   }
    // },

    // 查询未来版本
    *getActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( getActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data );
      }
    },

    // 新增未来版本
    *addActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( addActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data );
      }
    },

    // 删除未来版本
    *deleteActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( deleteActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data );
      }
    },

    // 编辑未来版本
    *editActivityDraft( { payload: { query, successFun } }, { call } ) {
      const data = yield call( editActivityDraft, query );
      if ( data.success && successFun ) {
        successFun( data );
      }
    },

    // 搜索标签列表
    *SearchTagList( { payload: { query, callFunc } }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getTagList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { searchTagListMap: data.result.list },
        } );
        if ( callFunc ) callFunc();
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },


    *getGuessProductsList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getGuessProductsList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { guessProductsList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    *getAllActivityList( { payload }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getAllActivityList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { allActivityList: data.result },
        } );
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    *getActivityIdPageList( { payload, successFun }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getActivityIdPageList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { activityIdPageList: data.result },
        } );
        if ( successFun ) successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    *getActivityIdPageData( { payload, successFun }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getActivityIdPageData, payload );
      if ( data.success ) {
        if ( successFun ) successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    // 获取ETF商户列表
    *getETFMerchantIdList( { payload: { query } }, { call, put } ) {
      const data = yield call( getETFMerchantIdList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { ETFMerchantIdList: data.result },
        } );
      }
    },

    // 获取ETF数据源列表
    *getETFDatasourceList( { payload: { query } }, { call, put } ) {
      const data = yield call( getETFDatasourceList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { ETFDatasourceIdList: data.result },
        } );
      }
    },

    // 获取基金列表
    *getETFFundList( { payload, successFun }, { call, put } ) {
      const data = yield call( getETFFundList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { ETFFundList: data.result.list },
        } )
        if ( successFun ) successFun( data.result.list )
      }
    },

    // 获取基金列表
    *getETFCodeFundList( { payload, successFun }, { call, put } ) {
      const data = yield call( getETFCodeFundList, payload );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { ETFFundList: data.result },
        } )
        if ( successFun ) successFun( data.result )
      }
    },

    *getETFRankMerchantList( { successFun }, { call, put } ) {
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getETFRankMerchantList );
      if ( data.success ) {
        if ( successFun ) successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },

    *getXDMallActivityList( { successFun }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getXDMallActivityList );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { xdMallActivityList: data.result },
        } );
        if ( successFun ) successFun( data.result )
      }
      yield put( {
        type: 'SetState',
        payload: {
          loading: false,
        },
      } );
    },
    *getXDMallGoodsList( { payload:{ query, successFun } }, { call, put } ){
      yield put( {
        type: 'SetState',
        payload: {
          loading: true,
        },
      } );
      const data = yield call( getXDMallGoodsList, query );
      if ( data.success ) {
        yield put( {
          type: 'SetState',
          payload: { xdMallGoodsList: data.result },
        } );
        if ( successFun ) successFun( data.result )
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
      const newState = { ...state, ...payload, }
      return newState
    },
  },
};
